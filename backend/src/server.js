const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
// Test database connection
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("PostgreSQL connected successfully ✅");
  })
  .catch((error) => {
    console.error("PostgreSQL connection failed ❌");
    console.error(error.message);
  });

// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "GigForce Backend is running 🚀",
  });
});
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "GigForce API + PostgreSQL connected 🚀",
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});
app.post("/api/companies/register", async (req, res) => {
  const { name, email, password, companyName, phone, city } = req.body;

  if (!name || !email || !password || !companyName) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password and company name are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'company')
       RETURNING id, name, email, role`,
      [name, email, password]
    );

    const user = userResult.rows[0];

    const companyResult = await client.query(
      `INSERT INTO companies (user_id, company_name, phone, city)
       VALUES ($1, $2, $3, $4)
       RETURNING id, company_name, phone, city`,
      [user.id, companyName, phone || null, city || null]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Company registered successfully 🚀",
      user,
      company: companyResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: "Company registration failed",
      error: error.message,
    });
  } finally {
    client.release();
  }
});
app.post("/api/workers/register", async (req, res) => {
  const {
    name,
    email,
    password,
    workerType,
    phone,
    city,
    skills
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'worker')
       RETURNING id, name, email, role`,
      [name, email, password]
    );

    const user = userResult.rows[0];

    const workerResult = await client.query(
      `INSERT INTO workers
       (user_id, worker_type, phone, city, skills)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, worker_type, phone, city, skills, availability`,
      [
        user.id,
        workerType || "Delivery Partner",
        phone || null,
        city || null,
        skills || null
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Worker registered successfully 🚀",
      user,
      worker: workerResult.rows[0],
    });

  } catch (error) {
    await client.query("ROLLBACK");

    res.status(500).json({
      success: false,
      message: "Worker registration failed",
      error: error.message,
    });

  } finally {
    client.release();
  }
});
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, email, password_hash, role
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    if (password !== user.password_hash) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      success: true,
      message: "Login successful 🚀",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});
app.post("/api/workforce-requests", authenticateToken, async (req, res) => {
  const {
    workType,
    location,
    workersRequired,
    duration,
    requiredDate,
    priority
  } = req.body;

  if (!workType || !location || !workersRequired) {
    return res.status(400).json({
      success: false,
      message: "Work type, location and workers required are mandatory",
    });
  }

  try {
    // Make sure logged-in user is a company
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only companies can create workforce requests",
      });
    }

    // Find company belonging to logged-in user
    const companyResult = await pool.query(
      `SELECT id, company_name
       FROM companies
       WHERE user_id = $1`,
      [req.user.userId]
    );

    if (companyResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    const company = companyResult.rows[0];

    // Create workforce request
    const requestResult = await pool.query(
      `INSERT INTO workforce_requests
       (
         company_id,
         work_type,
         location,
         workers_required,
         duration,
         required_date,
         priority,
         status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Open')
       RETURNING *`,
      [
        company.id,
        workType,
        location,
        Number(workersRequired),
        duration || null,
        requiredDate || null,
        priority || "Medium"
      ]
    );

    res.status(201).json({
      success: true,
      message: "Workforce request created successfully 🚀",
      request: requestResult.rows[0],
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create workforce request",
      error: error.message,
    });
  }
});
app.get("/api/workforce-requests", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        wr.id,
        wr.work_type,
        wr.location,
        wr.workers_required,
        wr.duration,
        wr.required_date,
        wr.priority,
        wr.status,
        wr.created_at,
        c.company_name
      FROM workforce_requests wr
      JOIN companies c
        ON wr.company_id = c.id
      ORDER BY wr.created_at DESC
    `);

    res.json({
      success: true,
      count: result.rows.length,
      requests: result.rows,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch workforce requests",
      error: error.message,
    });
  }
});
app.get("/api/worker/jobs", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can access available jobs",
      });
    }

    const result = await pool.query(`
      SELECT
        wr.id,
        c.company_name,
        wr.work_type,
        wr.location,
        wr.workers_required,
        wr.duration,
        wr.required_date,
        wr.priority,
        wr.status,
        COUNT(a.id)::INTEGER AS assigned_workers
      FROM workforce_requests wr
      JOIN companies c
        ON wr.company_id = c.id
      LEFT JOIN assignments a
        ON wr.id = a.request_id
      WHERE wr.status IN ('Open', 'Partially Assigned')
      GROUP BY
        wr.id,
        c.company_name
      ORDER BY
        CASE
          WHEN wr.priority = 'Critical' THEN 1
          WHEN wr.priority = 'High' THEN 2
          WHEN wr.priority = 'Medium' THEN 3
          ELSE 4
        END,
        wr.created_at DESC
    `);

    const jobs = result.rows.map((job) => ({
      ...job,
      workers_remaining:
        Math.max(
          Number(job.workers_required) -
          Number(job.assigned_workers),
          0
        ),
    }));

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available jobs",
      error: error.message,
    });
  }
});
app.post(
  "/api/worker/jobs/:requestId/accept",
  authenticateToken,
  async (req, res) => {
    const requestId = Number(req.params.requestId);

    if (!Number.isInteger(requestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request ID",
      });
    }

    if (req.user.role !== "worker") {
      return res.status(403).json({
        success: false,
        message: "Only workers can accept jobs",
      });
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Find worker profile
      const workerResult = await client.query(
        `SELECT id, availability
         FROM workers
         WHERE user_id = $1`,
        [req.user.userId]
      );

      if (workerResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          success: false,
          message: "Worker profile not found",
        });
      }

      const worker = workerResult.rows[0];

      // Worker must be available
      if (worker.availability !== "Available") {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "Worker is not available",
        });
      }

      // Lock request while assigning
      const requestResult = await client.query(
        `SELECT *
         FROM workforce_requests
         WHERE id = $1
         FOR UPDATE`,
        [requestId]
      );

      if (requestResult.rows.length === 0) {
        await client.query("ROLLBACK");

        return res.status(404).json({
          success: false,
          message: "Workforce request not found",
        });
      }

      const request = requestResult.rows[0];

      if (!["Open", "Partially Assigned"].includes(request.status)) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "This job is no longer available",
        });
      }

      // Check how many workers are already assigned
      const countResult = await client.query(
        `SELECT COUNT(*)::INTEGER AS assigned_count
         FROM assignments
         WHERE request_id = $1`,
        [requestId]
      );

      const assignedCount = countResult.rows[0].assigned_count;

      if (assignedCount >= request.workers_required) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "All required workers have already been assigned",
        });
      }

      // Prevent duplicate assignment
      const existingAssignment = await client.query(
        `SELECT id
         FROM assignments
         WHERE request_id = $1
         AND worker_id = $2`,
        [requestId, worker.id]
      );

      if (existingAssignment.rows.length > 0) {
        await client.query("ROLLBACK");

        return res.status(400).json({
          success: false,
          message: "You have already accepted this job",
        });
      }

      // Create assignment
      const assignmentResult = await client.query(
        `INSERT INTO assignments
         (request_id, worker_id, status)
         VALUES ($1, $2, 'Assigned')
         RETURNING *`,
        [requestId, worker.id]
      );

      const newAssignedCount = assignedCount + 1;

      const newStatus =
        newAssignedCount >= request.workers_required
          ? "Assigned"
          : "Partially Assigned";

      // Mark worker busy
      await client.query(
        `UPDATE workers
         SET availability = 'Busy'
         WHERE id = $1`,
        [worker.id]
      );

      // Update request status
      await client.query(
        `UPDATE workforce_requests
         SET status = $1
         WHERE id = $2`,
        [newStatus, requestId]
      );

      await client.query("COMMIT");

      res.status(201).json({
        success: true,
        message: "Job accepted successfully 🚀",
        assignment: assignmentResult.rows[0],
        requestStatus: newStatus,
      });

    } catch (error) {
      await client.query("ROLLBACK");

      // Handles duplicate assignment safely
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "You have already accepted this job",
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to accept job",
        error: error.message,
      });

    } finally {
      client.release();
    }
  }
);
app.get("/api/company/my-requests", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only companies can access their requests",
      });
    }

    const result = await pool.query(
      `SELECT
         wr.id,
         c.company_name,
         wr.work_type,
         wr.location,
         wr.workers_required,
         wr.duration,
         wr.required_date,
         wr.priority,
         wr.status,
         wr.created_at,
         COUNT(a.id)::INTEGER AS assigned_workers
       FROM workforce_requests wr
       JOIN companies c
         ON wr.company_id = c.id
       LEFT JOIN assignments a
         ON wr.id = a.request_id
       WHERE c.user_id = $1
       GROUP BY wr.id, c.company_name
       ORDER BY wr.created_at DESC`,
      [req.user.userId]
    );

    const requests = result.rows.map((request) => ({
      ...request,
      workers_remaining: Math.max(
        Number(request.workers_required) -
        Number(request.assigned_workers),
        0
      ),
    }));

    res.json({
      success: true,
      count: requests.length,
      requests,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch company requests",
      error: error.message,
    });
  }
});
app.listen(PORT, () => {
  console.log(`GigForce Backend running on http://localhost:${PORT}`);
});