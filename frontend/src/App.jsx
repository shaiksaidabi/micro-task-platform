import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  return localStorage.getItem("gigforce_token");
};

const getWorkerAuthToken = () => {
  return localStorage.getItem("gigforce_token");
};


 const normalizeApiRequest = (request) => {
  const requiredDate =
    request.required_date || request.requiredDate || "";

  return {
    ...request,

    id: request.id,

    companyName:
      request.company_name ||
      request.companyName ||
      "",

    company:
      request.company ||
      request.company_name ||
      request.companyName ||
      "",

    workType:
      request.work_type ||
      request.workType ||
      "",

    location:
      request.location ||
      "",

    workersRequired:
      Number(
        request.workers_required ||
        request.workersRequired ||
        0
      ),

    assignedCount:
      Number(
        request.assigned_workers ||
        request.assignedCount ||
        0
      ),

    completedWorkers:
      Number(
        request.completed_workers ||
        request.completedWorkers ||
        0
      ),

    workersRemaining:
      Number(
        request.workers_remaining ||
        request.workersRemaining ||
        0
      ),

    duration:
      request.duration ||
      "",

    requiredDate,

    date:
      request.date ||
      requiredDate,

    priority:
      request.priority ||
      "Medium",

    status:
      request.status ||
      "Open",

    createdAt:
      request.created_at ||
      request.createdAt ||
      "",
  };
};
/* =========================================================
   INITIAL DATA
========================================================= */



/* =========================================================
   LOGIN SCREEN
========================================================= */

const LoginScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [registerRole, setRegisterRole] = useState("company");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [workerType, setWorkerType] = useState("Delivery Partner");
  const [skills, setSkills] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    resetMessages();

    if (!email.trim() || !password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password.");
      }

      localStorage.setItem("gigforce_token", data.token);
      localStorage.setItem("gigforce_role", data.user.role);
      localStorage.setItem("gigforce_user", JSON.stringify(data.user));

      localStorage.removeItem("gigforce_admin_token");
      localStorage.removeItem("gigforce_worker_token");
      localStorage.removeItem("token");

      onLogin(data.user);
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    resetMessages();

    if (!name.trim() || !email.trim() || !password || !phone.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    if (registerRole === "company" && !companyName.trim()) {
      setError("Please enter company name.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        registerRole === "company"
          ? `${API_BASE_URL}/companies/register`
          : `${API_BASE_URL}/workers/register`;

      const body =
        registerRole === "company"
          ? {
              name: name.trim(),
              email: email.trim(),
              password,
              companyName: companyName.trim(),
              phone: phone.trim(),
              city: city.trim(),
            }
          : {
              name: name.trim(),
              email: email.trim(),
              password,
              phone: phone.trim(),
              city: city.trim(),
              workerType,
              skills: skills.trim(),
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(
        "Registration successful 🚀 Please login with your new account."
      );

      setMode("login");
      setPassword("");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">G</div>
          <div>
            <h1>GigForce</h1>
            <p>B2B Workforce Platform</p>
          </div>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              resetMessages();
            }}
          >
            Login
          </button>

          <button
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              resetMessages();
            }}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="register-role-switch">
              <button
                type="button"
                className={registerRole === "company" ? "active" : ""}
                onClick={() => setRegisterRole("company")}
              >
                Company
              </button>

              <button
                type="button"
                className={registerRole === "worker" ? "active" : ""}
                onClick={() => setRegisterRole("worker")}
              >
                Worker
              </button>
            </div>

            <div>
              <label>{registerRole === "company" ? "Contact Name" : "Full Name"}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
              />
            </div>

            {registerRole === "company" && (
              <div>
                <label>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            )}

            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
              />
            </div>

            {registerRole === "worker" && (
              <>
                <div>
                  <label>Worker Type</label>
                  <select
                    value={workerType}
                    onChange={(e) => setWorkerType(e.target.value)}
                  >
                    <option>Delivery Partner</option>
                    <option>Warehouse Worker</option>
                    <option>Store Operations</option>
                    <option>Inventory Support</option>
                    <option>Event Support</option>
                    <option>Other Gig Work</option>
                  </select>
                </div>

                <div>
                  <label>Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="Delivery, Navigation, Customer Handling"
                  />
                </div>
              </>
            )}

            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
              />
            </div>

            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span>GigForce Workforce Network</span>
        </div>
      </div>
    </div>
  );
};
/* =========================================================
   APP
========================================================= */

function App() {

  const storedUser = localStorage.getItem("gigforce_user");
  const storedRole = localStorage.getItem("gigforce_role");

  let parsedUser = null;

  try {
    parsedUser = storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch {
    parsedUser = null;
  }

  const [isAuthenticated, setIsAuthenticated] =
    useState(
      Boolean(
        getAuthToken() && storedRole
      )
    );

  const [currentUser, setCurrentUser] =
    useState(parsedUser);

  const [role, setRole] =
    useState(storedRole || "company");

  const [activePage, setActivePage] =
    useState("dashboard");

  const [requests, setRequests] = useState([]);
  const [workerJobs, setWorkerJobs] = useState([]);
const [workerJobsLoading, setWorkerJobsLoading] = useState(false);
const [workerAssignments, setWorkerAssignments] = useState([]);
const [workerAssignmentsLoading, setWorkerAssignmentsLoading] = useState(false);
const [workerProfile, setWorkerProfile] = useState(null);
const [workerProfileLoading, setWorkerProfileLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  
  const [selectedDetailsRequest, setSelectedDetailsRequest] = useState(null);

  const [toast, setToast] = useState("");

  const [requestForm, setRequestForm] = useState({
    workType: "Delivery Support",
    location: "",
    workersRequired: "",
    duration: "4 Hours",
    date: "Today",
    priority: "Medium",
  });

  /* =========================================================
     LOAD COMPANY REQUESTS FROM BACKEND
  ========================================================= */

  const loadCompanyRequests = async () => {
    const token = getAuthToken();

    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/company/my-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load workforce requests.");
      }

      setRequests(data.requests.map(normalizeApiRequest));
    } catch (error) {
      console.error("My Requests API error:", error);
      showToast("Could not load live requests.");
    }
  };

  useEffect(() => {
    if (role === "company") {
      loadCompanyRequests();
    }
  }, [role]);
useEffect(() => {
  if (role !== "worker") return;

  if (activePage === "dashboard" || activePage === "jobs") {
    loadWorkerJobs();
  }

  if (activePage === "dashboard" || activePage === "assignments") {
    loadWorkerAssignments();
  }

  if (activePage === "profile") {
    loadWorkerProfile();
  }
}, [role, activePage]);

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };
  const loadCompanyDashboard = async () => {
  try {
    const token = getAuthToken();

    const response = await fetch(
      `${API_BASE_URL}/company/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load dashboard"
      );
    }

    return data.dashboard;
  } catch (error) {
    console.error(
      "Company dashboard error:",
      error
    );

    return null;
  }
};
const loadWorkerJobs = async () => {
const token = getWorkerAuthToken();
  if (!token) {
    showToast("Worker login token not found.");
    return;
  }

  setWorkerJobsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/worker/jobs`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Failed to load worker jobs.");
    }

    setWorkerJobs(data.jobs.map(normalizeApiRequest));
  } catch (error) {
    console.error("Worker Jobs API error:", error);
    showToast(error.message || "Could not load available jobs.");
  } finally {
    setWorkerJobsLoading(false);
  }
};
const loadWorkerAssignments = async () => {
const token = getWorkerAuthToken();
  if (!token) {
    showToast("Worker login token not found.");
    return;
  }

  setWorkerAssignmentsLoading(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/worker/assignments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load assignments."
      );
    }

    setWorkerAssignments(data.assignments || []);
  } catch (error) {
    console.error(
      "Worker Assignments API error:",
      error
    );

    showToast(
      error.message ||
        "Could not load your assignments."
    );
  } finally {
    setWorkerAssignmentsLoading(false);
  }
};
const loadWorkerProfile = async () => {
const token = getWorkerAuthToken();
  if (!token) {
    showToast("Worker login token not found.");
    return;
  }

  setWorkerProfileLoading(true);

  try {
    const response = await fetch(
      `${API_BASE_URL}/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to load profile."
      );
    }

    setWorkerProfile(data.user);
  } catch (error) {
    console.error(
      "Worker Profile API error:",
      error
    );

    showToast(
      error.message ||
        "Could not load your profile."
    );
  } finally {
    setWorkerProfileLoading(false);
  }
};
  /* =========================================================
     STATS
  ========================================================= */

  const totalRequests = requests.length;

  const openRequests = requests.filter(
  (request) =>
    request.status === "Open" ||
    request.status === "Partially Assigned"
).length;

  const workersRequested = requests.reduce(
    (total, request) => total + Number(request.workersRequired || 0),
    0
  );

  const workersAvailable = workers.filter(
    (worker) => worker.availability === "Available"
  ).length;

  /* =========================================================
     CREATE WORKFORCE REQUEST
  ========================================================= */

  const handleRequestChange = (event) => {
    const { name, value } = event.target;

    setRequestForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const createWorkforceRequest = async (event) => {
    event.preventDefault();

    if (
      !requestForm.location.trim() ||
      !requestForm.workersRequired ||
      Number(requestForm.workersRequired) <= 0
    ) {
      showToast("Please enter location and workers required.");
      return;
    }

const token = getAuthToken();
    if (!token) {
      showToast("Please login as a company first.");
      return;
    }

    const dateMap = {
      Today: 0,
      Tomorrow: 1,
      "Within 3 Days": 3,
      "Next Week": 7,
    };

    const requiredDate = new Date();
    requiredDate.setDate(
      requiredDate.getDate() + (dateMap[requestForm.date] ?? 0)
    );

    try {
      const response = await fetch(`${API_BASE_URL}/workforce-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          workType: requestForm.workType,
          location: requestForm.location.trim(),
          workersRequired: Number(requestForm.workersRequired),
          duration: requestForm.duration,
          requiredDate: requiredDate.toISOString(),
          priority: requestForm.priority,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create workforce request.");
      }

      setRequestForm({
        workType: "Delivery Support",
        location: "",
        workersRequired: "",
        duration: "4 Hours",
        date: "Today",
        priority: "Medium",
      });

      await loadCompanyRequests();
      showToast("Workforce request created successfully.");
      setActivePage("requests");
    } catch (error) {
      console.error("Create request API error:", error);
      showToast(error.message || "Could not create workforce request.");
    }
  };

  /* =========================================================
     COMPLETE REQUEST
  ========================================================= */


  /* =========================================================
     WORKER MATCHING / ASSIGNMENT
  ========================================================= */

 

 const acceptJob = async (requestId) => {
  const token = getWorkerAuthToken();

  if (!token) {
    showToast("Please login as a worker first.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/worker/jobs/${requestId}/accept`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to accept job."
      );
    }

    showToast("Job accepted successfully 🚀");

    // Refresh available jobs
    await loadWorkerJobs();

    // Refresh my assignments
    await loadWorkerAssignments();
  } catch (error) {
    console.error("Accept Job API error:", error);

    showToast(
      error.message || "Could not accept job."
    );
  }
};
  /* =========================================================
     ROLE CHANGE
  ========================================================= */

/* =========================================================
   AUTHENTICATION
========================================================= */

const handleLoginSuccess = (user) => {
  setCurrentUser(user);
  setRole(user.role);
  setActivePage("dashboard");
  setIsAuthenticated(true);
};

const handleLogout = () => {
  localStorage.removeItem("gigforce_token");
  localStorage.removeItem("gigforce_role");
  localStorage.removeItem("gigforce_user");

  localStorage.removeItem("gigforce_admin_token");
  localStorage.removeItem("gigforce_worker_token");
  localStorage.removeItem("token");

  setCurrentUser(null);
  setRole("company");
  setActivePage("dashboard");
  setIsAuthenticated(false);
};

  /* =========================================================
     PAGE TITLE
  ========================================================= */

  const pageInfo = useMemo(() => {
    if (role === "company") {
      const pages = {
        dashboard: {
          title: "Workforce Dashboard",
          subtitle: "Manage your on-demand workforce requirements",
        },
        request: {
          title: "Request Workers",
          subtitle: "Create a new workforce requirement",
        },
        requests: {
          title: "My Requests",
          subtitle: "Track and manage your workforce requests",
        },
        workers: {
          title: "Available Workers",
          subtitle: "Browse workers available for your requirements",
        },
      };

      return pages[activePage] || pages.dashboard;
    }

    if (role === "worker") {
      const pages = {
        dashboard: {
          title: "Worker Dashboard",
          subtitle: "Find and manage your gig work opportunities",
        },
        jobs: {
          title: "Available Jobs",
          subtitle: "Browse workforce opportunities near you",
        },
        assignments: {
          title: "My Assignments",
          subtitle: "Track your accepted workforce assignments",
        },
        profile: {
          title: "My Profile",
          subtitle: "Manage your worker profile",
        },
      };

      return pages[activePage] || pages.dashboard;
    }

    const pages = {
      dashboard: {
        title: "Admin Dashboard",
        subtitle: "Monitor workforce operations across the platform",
      },
      requests: {
        title: "Workforce Requests",
        subtitle: "Manage incoming workforce requirements",
      },
      workers: {
        title: "Workers",
        subtitle: "Manage registered delivery and gig workers",
      },
      companies: {
        title: "Companies",
        subtitle: "Manage B2B company accounts",
      },
    };

    return pages[activePage] || pages.dashboard;
  }, [role, activePage]);

  /* =========================================================
     SIDEBAR
  ========================================================= */

  const renderSidebar = () => {
    let menu = [];

    if (role === "company") {
      menu = [
        ["dashboard", "Dashboard"],
        ["request", "Request Workers"],
        ["requests", "My Requests"],
        ["workers", "Available Workers"],
      ];
    }

    if (role === "worker") {
      menu = [
        ["dashboard", "Dashboard"],
        ["jobs", "Available Jobs"],
        ["assignments", "My Assignments"],
        ["profile", "My Profile"],
      ];
    }

    if (role === "admin") {
      menu = [
        ["dashboard", "Dashboard"],
        ["requests", "Workforce Requests"],
        ["workers", "Workers"],
        ["companies", "Companies"],
      ];
    }

    return (
      <aside className="sidebar">
        <div className="sidebar-label">
          {role === "company"
            ? "Company"
            : role === "worker"
              ? "Worker"
              : "Administration"}
        </div>

        {menu.map(([page, label]) => (
          <button
            key={page}
            className={`sidebar-item ${
              activePage === page ? "active" : ""
            }`}
            onClick={() => setActivePage(page)}
          >
            {label}
          </button>
        ))}

        <div className="sidebar-bottom">
          <div className="status-card">
            <p>Platform Status</p>

            <strong>
              <span className="status-dot"></span>
              All systems operational
            </strong>
          </div>
        </div>
      </aside>
    );
  };

  /* =========================================================
     HEADER
  ========================================================= */

  const renderHeader = () => {
    return (
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">G</div>

          <div>
            <h1>GigForce</h1>
            <p>B2B Workforce Platform</p>
          </div>
        </div>

        <div className="header-account">
  <div className="header-user">
    <strong>
      {currentUser?.name || "User"}
    </strong>

    <span>
      {role === "admin"
        ? "Administrator"
        : role === "worker"
          ? "Worker"
          : "Company"}
    </span>
  </div>

  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    Logout
  </button>
</div>
      </header>
    );
  };

  /* =========================================================
     REQUEST CARD
  ========================================================= */

  const RequestCard = ({ request, workerMode = false }) => {
    const assignedWorkers = request.assignedWorkers || [];
    const assignedCount = Number(request.assignedCount ?? assignedWorkers.length);
    const remainingWorkers = Number(
      request.workersRemaining ??
        Math.max(Number(request.workersRequired) - assignedCount, 0)
    );

    return (
      <div className="request-card">
        <div className="request-top">
          <div className="company-mini">
            <div className="mini-logo">{request.initials}</div>
            <div>
              <strong>{request.company}</strong>
              <span>{request.workType}</span>
            </div>
          </div>

          <span
            className={`priority priority-${request.priority.toLowerCase()}`}
          >
            {request.priority}
          </span>
        </div>

        <h3 className="request-title">{request.workType}</h3>

        <span className="request-status">{request.status}</span>

        <div className="request-details">
          <div>
            <span>📍 Location</span>
            <strong>{request.location}</strong>
          </div>

          <div>
            <span>♙ Workers</span>
            <strong>{request.workersRequired} workers</strong>
          </div>

          <div>
            <span>⏱ Duration</span>
            <strong>{request.duration}</strong>
          </div>

          <div>
            <span>📅 Date</span>
            <strong>{request.date}</strong>
          </div>
        </div>

        {assignedCount > 0 && (
          <div className="assigned-worker">
            👥 Assigned Workers: <strong>{assignedCount}</strong>
            <div className="assigned-worker-list">
              {assignedWorkers.map((worker) => (
                <span key={worker.id}>{worker.name}</span>
              ))}
            </div>
            {remainingWorkers > 0 && (
              <small>{remainingWorkers} workers still required</small>
            )}
          </div>
        )}

        <div className="card-actions">
          {workerMode && request.status !== "Assigned" ? (
            <button
              className="primary-btn"
              onClick={() => acceptJob(request.id)}
            >
              Accept Job
            </button>
          ) : (
            <button
              className="secondary-btn"
              onClick={() => setSelectedDetailsRequest(request)}
            >
              View Details
            </button>
          )}


        </div>
      </div>
    );
  };

  /* =========================================================
     COMPANY DASHBOARD
  ========================================================= */

 const CompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await loadCompanyDashboard();

      if (data) {
        setDashboardData(data);
      }
    };

    loadDashboard();
  }, []);

  const totalRequests =
    Number(dashboardData?.total_requests || 0);

  const activeRequests =
    Number(dashboardData?.active_requests || 0);

  const workersRequested =
    Number(dashboardData?.workers_requested || 0);

  const workersAssigned =
    Number(dashboardData?.workers_assigned || 0);

  const workersCompleted =
    Number(dashboardData?.workers_completed || 0);

  const workersPending = Math.max(
    workersRequested -
      workersAssigned -
      workersCompleted,
    0
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            B2B WORKFORCE
          </div>

          <h1>Workforce Dashboard</h1>

          <p>
            Manage your delivery and gig workforce
            requirements from one place.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setActivePage("request")}
        >
          + Request Workers
        </button>
      </div>

      <div className="stats-grid">
        <Stat
          icon="◉"
          label="Total Requests"
          value={totalRequests}
        />

        <Stat
          icon="◷"
          label="Active Requests"
          value={activeRequests}
        />

        <Stat
          icon="♙"
          label="Workers Requested"
          value={workersRequested}
        />

        <Stat
          icon="✓"
          label="Workers Completed"
          value={workersCompleted}
        />
      </div>

      <div className="section-header">
        <div>
          <h2>Workforce Overview</h2>
          <p>
            Live assignment status from your workforce requests.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <Stat
          icon="👥"
          label="Workers Assigned"
          value={workersAssigned}
        />

        <Stat
          icon="✓"
          label="Workers Completed"
          value={workersCompleted}
        />

        <Stat
          icon="◷"
          label="Workers Pending"
          value={workersPending}
        />
      </div>

      <div className="section-header">
        <div>
          <h2>Recent Workforce Requests</h2>
          <p>
            Latest requirements raised by your company.
          </p>
        </div>

        <button
          className="text-btn"
          onClick={() => setActivePage("requests")}
        >
          View All
        </button>
      </div>

      <div className="request-grid">
        {requests.slice(0, 4).map((request) => (
          <RequestCard
            key={request.id}
            request={request}
          />
        ))}
      </div>
    </>
  );
};
  /* =========================================================
     REQUEST FORM
  ========================================================= */

  const renderRequestWorkers = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Company Portal</div>

            <h1>Request Workers</h1>

            <p>
              Tell us what workforce you need and where you need them.
            </p>
          </div>
        </div>

        <div className="form-layout">
          <div className="form-card">
            <h2>Create Workforce Request</h2>

            <p>
              Your requirement will be added to the platform and
              made available for suitable workers.
            </p>

            <form onSubmit={createWorkforceRequest}>
              <div className="form-grid">
                <div className="field">
                  <label>Work Type</label>

                  <select
                    name="workType"
                    value={requestForm.workType}
                    onChange={handleRequestChange}
                  >
                    <option>Delivery Support</option>
                    <option>Warehouse Support</option>
                    <option>Store Operations</option>
                    <option>Inventory Support</option>
                    <option>Event Support</option>
                    <option>Other Gig Work</option>
                  </select>
                </div>

                <div className="field">
                  <label>Location</label>

                  <input
                    name="location"
                    value={requestForm.location}
                    onChange={handleRequestChange}
                    placeholder="e.g. Hyderabad"
                  />
                </div>

                <div className="field">
                  <label>Workers Required</label>

                  <input
                    type="number"
                    min="1"
                    name="workersRequired"
                    value={requestForm.workersRequired}
                    onChange={handleRequestChange}
                    placeholder="e.g. 20"
                  />
                </div>

                <div className="field">
                  <label>Duration</label>

                  <select
                    name="duration"
                    value={requestForm.duration}
                    onChange={handleRequestChange}
                  >
                    <option>2 Hours</option>
                    <option>3 Hours</option>
                    <option>4 Hours</option>
                    <option>5 Hours</option>
                    <option>6 Hours</option>
                    <option>8 Hours</option>
                  </select>
                </div>

                <div className="field">
                  <label>Required Date</label>

                  <select
                    name="date"
                    value={requestForm.date}
                    onChange={handleRequestChange}
                  >
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Within 3 Days</option>
                    <option>Next Week</option>
                  </select>
                </div>

                <div className="field">
                  <label>Priority</label>

                  <select
                    name="priority"
                    value={requestForm.priority}
                    onChange={handleRequestChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-submit">
                <button type="submit" className="primary-btn">
                  Submit Workforce Request
                </button>
              </div>
            </form>
          </div>

          <div className="info-card">
            <div className="info-icon">⚡</div>

            <h3>How it works</h3>

            <p>
              Raise your workforce requirement and our platform
              makes it available to suitable delivery and gig
              workers.
            </p>

            <div className="process-step">
              <span>01</span>
              <p>Create your workforce requirement.</p>
            </div>

            <div className="process-step">
              <span>02</span>
              <p>Platform identifies available workers.</p>
            </div>

            <div className="process-step">
              <span>03</span>
              <p>Workers accept the available assignment.</p>
            </div>

            <div className="process-step">
              <span>04</span>
              <p>Your company receives the required workforce.</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  /* =========================================================
     MY REQUESTS
  ========================================================= */

  const MyRequests = () => {
  const totalRequests = requests.length;

  const openRequests = requests.filter(
    (request) =>
      request.status === "Open" ||
      request.status === "Partially Assigned"
  ).length;

  const workersRequested = requests.reduce(
    (total, request) =>
      total + Number(request.workersRequired || 0),
    0
  );

  const workersCompleted = requests.reduce(
    (total, request) =>
      total + Number(request.completedWorkers || 0),
    0
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">COMPANY PORTAL</div>

          <h1>My Requests</h1>

          <p>
            Track workforce requirements, assignments, and
            fulfillment status.
          </p>
        </div>

        <div className="page-actions">
          <button
            className="secondary-btn"
            onClick={loadCompanyRequests}
          >
            ↻ Refresh
          </button>

          <button
            className="primary-btn"
            onClick={() => setActivePage("request")}
          >
            + New Request
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <Stat
          icon="◉"
          label="Total Requests"
          value={totalRequests}
        />

        <Stat
          icon="◷"
          label="Open Requests"
          value={openRequests}
        />

        <Stat
          icon="♙"
          label="Workers Requested"
          value={workersRequested}
        />

        <Stat
          icon="✓"
          label="Workers Completed"
          value={workersCompleted}
        />
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◌</div>

          <h3>No workforce requests yet</h3>

          <p>
            Create your first workforce request to start
            finding gig workers.
          </p>

          <button
            className="primary-btn"
            onClick={() => setActivePage("request")}
          >
            + Create Request
          </button>
        </div>
      ) : (
        <div className="gigforce-requests-grid">
          {requests.map((request) => {
            const assigned =
              Number(request.assignedCount || 0);

            const completed =
              Number(request.completedWorkers || 0);

            const required =
              Number(request.workersRequired || 0);

            const remaining =
              Number(
                request.workersRemaining ??
                  Math.max(
                    required - assigned - completed,
                    0
                  )
              );

            const fulfilled =
              assigned + completed;

            const progress =
              required > 0
                ? Math.min(
                    (fulfilled / required) * 100,
                    100
                  )
                : 0;

            const status =
              request.status || "Open";

            return (
              <div
                className="gigforce-request-card"
                key={request.id}
              >
                <div className="gigforce-request-top">
                  <div>
                    <div className="request-number">
                      REQUEST #{request.id}
                    </div>

                    <h3>
                      {request.workType ||
                        "Workforce Request"}
                    </h3>
                  </div>

                  <span
                    className={`gigforce-request-status ${
                      status === "Open"
                        ? "status-open"
                        : status ===
                            "Partially Assigned"
                          ? "status-partial"
                          : status === "Assigned"
                            ? "status-assigned"
                            : status === "Completed"
                              ? "status-completed"
                              : ""
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="gigforce-request-info">
                  <div className="request-info-item">
                    <span>📍 Location</span>
                    <strong>
                      {request.location || "—"}
                    </strong>
                  </div>

                  <div className="request-info-item">
                    <span>👥 Required</span>
                    <strong>
                      {required}
                    </strong>
                  </div>

                  <div className="request-info-item">
                    <span>⏱ Duration</span>
                    <strong>
                      {request.duration || "—"}
                    </strong>
                  </div>

                  <div className="request-info-item">
                    <span>⚡ Priority</span>
                    <strong>
                      {request.priority || "—"}
                    </strong>
                  </div>
                </div>

                <div className="gigforce-workforce-section">
  <div className="workforce-progress-header">
    <div>
      <span className="workforce-progress-label">
        Workforce Fulfillment
      </span>

      <strong>
        {fulfilled} of {required} workers fulfilled
      </strong>
    </div>

    <span className="workforce-progress-percent">
      {Math.round(progress)}%
    </span>
  </div>

  <div className="workforce-progress">
    <div
      className="workforce-progress-fill"
      style={{
        width: `${progress}%`,
      }}
    />
  </div>

  <div className="workforce-breakdown">
    <div>
      <span>Assigned</span>
      <strong>{assigned}</strong>
    </div>

    <div>
      <span>Completed</span>
      <strong>{completed}</strong>
    </div>

    <div>
      <span>Remaining</span>
      <strong>{remaining}</strong>
    </div>
  </div>
</div>
                <div className="gigforce-request-footer">
                  <span>
                    📅{" "}
                    {request.requiredDate
                      ? new Date(
                          request.requiredDate
                        ).toLocaleDateString(
                          "en-IN"
                        )
                      : "Date not set"}
                  </span>

                  <span>
                    {request.companyName ||
                      "Your Company"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

  /* =========================================================
     AVAILABLE WORKERS / MATCHING
  ========================================================= */

const AvailableWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigningWorkerId, setAssigningWorkerId] = useState(null);

  const loadWorkers = async () => {
    const token = getAuthToken();

    if (!token) {
      showToast("Company login token not found.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/workers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load workers.");
      }

      setWorkers(data.workers || []);
    } catch (error) {
      console.error("Available Workers API error:", error);

      showToast(
        error.message || "Could not load available workers."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadRequests = async () => {
    const token = getAuthToken();

    if (!token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/company/my-requests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load workforce requests."
        );
      }

      const availableRequests = (data.requests || []).filter(
        (request) =>
          request.status === "Open" ||
          request.status === "Partially Assigned"
      );

      setRequests(availableRequests);

      if (availableRequests.length > 0) {
        setSelectedRequest(String(availableRequests[0].id));
      } else {
        setSelectedRequest("");
      }
    } catch (error) {
      console.error("Requests API error:", error);

      showToast(
        error.message || "Could not load workforce requests."
      );
    }
  };

  const assignWorker = async (workerId, workerName) => {
    const token = getAuthToken();

    if (!token) {
      showToast("Company login token not found.");
      return;
    }

    if (!selectedRequest) {
      showToast("Please select a workforce request first.");
      return;
    }

    setAssigningWorkerId(workerId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/workforce-requests/${selectedRequest}/assign`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            workerId: Number(workerId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to assign worker."
        );
      }

      showToast(`${workerName} assigned successfully 🚀`);

      await loadWorkers();
      await loadRequests();
    } catch (error) {
      console.error("Assign Worker API error:", error);

      showToast(
        error.message || "Could not assign worker."
      );
    } finally {
      setAssigningWorkerId(null);
    }
  };

  useEffect(() => {
    loadWorkers();
    loadRequests();
  }, []);

  const selectedRequestData = requests.find(
    (request) =>
      String(request.id) === String(selectedRequest)
  );

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-heading">
        <div>
          <div className="eyebrow">
            WORKFORCE MANAGEMENT
          </div>

          <h1>Available Workers</h1>

          <p>
            Find available workers and assign them to your
            workforce requests.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => {
            loadWorkers();
            loadRequests();
          }}
          disabled={loading}
        >
          {loading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {/* REQUEST SELECTOR */}
      {requests.length > 0 && (
        <div className="assignment-panel">
          <div className="assignment-panel-header">
            <div>
              <div className="assignment-label">
                WORKFORCE REQUEST
              </div>

              <h3>
                Select a request to assign workers
              </h3>
            </div>

            {selectedRequestData && (
              <div className="remaining-badge">
                {selectedRequestData.workers_remaining ?? 0}{" "}
                remaining
              </div>
            )}
          </div>

          <select
            className="request-select"
            value={selectedRequest}
            onChange={(event) =>
              setSelectedRequest(event.target.value)
            }
          >
            {requests.map((request) => (
              <option
                key={request.id}
                value={request.id}
              >
                Request #{request.id} —{" "}
                {request.work_type} —{" "}
                {request.location} —{" "}
                {request.workers_remaining ?? 0} remaining
              </option>
            ))}
          </select>
        </div>
      )}

      {/* WORKERS */}
      {loading ? (
        <div className="empty-state">
          <h3>Loading workers...</h3>

          <p>
            Fetching available workers from GigForce.
          </p>
        </div>
      ) : workers.length === 0 ? (
        <div className="empty-state">
          <h3>No workers available</h3>

          <p>
            There are currently no workers available
            for assignment.
          </p>
        </div>
      ) : (
        <div className="gigforce-workers-grid">
          {workers.map((worker) => (
            <div
              className="gigforce-worker-card"
              key={worker.id}
            >
              {/* CARD HEADER */}
              <div className="gigforce-worker-header">
                <div className="gigforce-worker-avatar">
                  {worker.name
                    ? worker.name
                        .charAt(0)
                        .toUpperCase()
                    : "W"}
                </div>

                <div className="gigforce-worker-title">
                  <h3>{worker.name}</h3>

                  <span className="gigforce-available">
                    <span className="available-dot">
                      ●
                    </span>
                    Available
                  </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="gigforce-worker-details">
                <div className="gigforce-detail">
                  <span>Worker Type</span>

                  <strong>
                    {worker.worker_type ||
                      "Not specified"}
                  </strong>
                </div>

                <div className="gigforce-detail">
                  <span>Location</span>

                  <strong>
                    {worker.city ||
                      "Not specified"}
                  </strong>
                </div>

                <div className="gigforce-detail">
                  <span>Phone</span>

                  <strong>
                    {worker.phone ||
                      "Not provided"}
                  </strong>
                </div>

                <div className="gigforce-detail gigforce-skills">
                  <span>Skills</span>

                  <strong>
                    {worker.skills ||
                      "Not specified"}
                  </strong>
                </div>
              </div>

              {/* ACTION */}
              <button
                className="gigforce-assign-btn"
                onClick={() =>
                  assignWorker(
                    worker.id,
                    worker.name
                  )
                }
                disabled={
                  !selectedRequest ||
                  assigningWorkerId === worker.id
                }
              >
                {assigningWorkerId === worker.id
                  ? "Assigning..."
                  : "Assign Worker"}
              </button>
            </div>
          ))}
        </div>
      )}

      {requests.length === 0 &&
        !loading &&
        workers.length > 0 && (
          <div className="gigforce-no-request">
            <strong>
              No open workforce requests
            </strong>

            <span>
              Create a workforce request before
              assigning workers.
            </span>
          </div>
        )}
    </>
  );
};

  /* =========================================================
     WORKER DASHBOARD
  ========================================================= */

  const WorkerDashboard = () => {
  const openJobs = workerJobs.filter(
    (request) =>
      request.status === "Open" ||
      request.status === "Partially Assigned"
  );

  const assignedJobs = workerAssignments.filter(
    (assignment) => assignment.assignment_status !== "Completed"
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Worker Dashboard</h1>
          <p>Find jobs and manage your workforce assignments.</p>
        </div>
      </div>

      <div className="stats-grid">
        <Stat
          icon="◉"
          label="Available Jobs"
          value={openJobs.length}
        />

        <Stat
          icon="✓"
          label="My Assignments"
          value={assignedJobs.length}
        />

        <Stat
          icon="▣"
          label="Completed Jobs"
          value={
            workerAssignments.filter(
              (assignment) =>
                assignment.assignment_status === "Completed"
            ).length
          }
        />

        <Stat
          icon="◷"
          label="Profile"
          value="Active"
        />
      </div>

      <div className="section-header">
        <div>
          <h2>Available Jobs</h2>
          <p>Latest workforce opportunities matching your profile.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={() => setActivePage("jobs")}
        >
          View All
        </button>
      </div>

      {workerJobsLoading ? (
        <div className="empty-state">
          Loading available jobs...
        </div>
      ) : openJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs available</h3>
          <p>New workforce opportunities will appear here.</p>
        </div>
      ) : (
        <div className="job-grid">
          {openJobs.slice(0, 4).map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              workerMode
            />
          ))}
        </div>
      )}
    </>
  );
};

  /* =========================================================
     AVAILABLE JOBS
  ========================================================= */

const AvailableJobs = () => {
  const openJobs = workerJobs.filter(
  (request) =>
    request.status === "Open" ||
    request.status === "Partially Assigned"
);

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worker Portal</div>

          <h1>Available Jobs</h1>

          <p>
            Choose workforce opportunities that match your availability.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadWorkerJobs}
          disabled={workerJobsLoading}
        >
          {workerJobsLoading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {workerJobsLoading ? (
        <div className="empty-state">
          <h3>Loading available jobs...</h3>
          <p>Fetching live workforce opportunities.</p>
        </div>
      ) : openJobs.length === 0 ? (
        <div className="empty-state">
          <h3>No available jobs</h3>
          <p>
            There are currently no workforce opportunities available.
          </p>
        </div>
      ) : (
        <div className="request-grid">
          {openJobs.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              workerMode
            />
          ))}
        </div>
      )}
    </>
  );
};
  /* =========================================================
     ASSIGNMENTS
  ========================================================= */

 const MyAssignments = () => {
  const handleCompleteAssignment = async (assignmentId) => {
    try {
      const token = getWorkerAuthToken();

      const response = await fetch(
`${API_BASE_URL}/worker/assignments/${assignmentId}/complete`,        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Failed to complete assignment",
         
        );
        return;
      }

      showToast(
        "Assignment completed successfully 🚀",
        
      );

      await loadWorkerAssignments();
    } catch (error) {
      console.error(
        "Complete assignment error:",
        error
      );

      showToast(
        "Unable to complete assignment",
        
      );
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORKER PORTAL</div>

          <h1>My Assignments</h1>

          <p>
            Track your accepted workforce assignments.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadWorkerAssignments}
          disabled={workerAssignmentsLoading}
        >
          {workerAssignmentsLoading
            ? "Loading..."
            : "↻ Refresh"}
        </button>
      </div>

      {workerAssignmentsLoading ? (
        <div className="empty-state">
          <h3>Loading assignments...</h3>

          <p>
            Fetching your latest assignments.
          </p>
        </div>
      ) : workerAssignments.length === 0 ? (
        <div className="empty-state">
          <h3>No assignments yet</h3>

          <p>
            Accept an available job to see your
            assignment here.
          </p>
        </div>
      ) : (
        <div className="request-grid">
          {workerAssignments.map((assignment) => {
            const isCompleted =
              assignment.assignment_status ===
              "Completed";

            return (
              <div
                className="request-card"
                key={assignment.assignment_id}
              >
                <div className="request-card-top">
                  <div>
                    <span className="eyebrow">
                      {assignment.priority}
                    </span>

                    <h3>
                      {assignment.company_name}
                    </h3>
                  </div>

                  <span
                    className={`status-badge ${
                      isCompleted
                        ? "status-completed"
                        : ""
                    }`}
                  >
                    {assignment.assignment_status}
                  </span>
                </div>

                <div className="request-details">
                  <div>
                    📦 <strong>Work</strong>
                    <span>
                      {assignment.work_type}
                    </span>
                  </div>

                  <div>
                    📍 <strong>Location</strong>
                    <span>
                      {assignment.location}
                    </span>
                  </div>

                  <div>
                    ⏱ <strong>Duration</strong>
                    <span>
                      {assignment.duration}
                    </span>
                  </div>

                  <div>
                    👥{" "}
                    <strong>Workers Required</strong>
                    <span>
                      {assignment.workers_required}
                    </span>
                  </div>

                  <div>
                    📅 <strong>Date</strong>
                    <span>
                      {assignment.required_date
                        ? new Date(
                            assignment.required_date
                          ).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="assignment-action">
                    <button
                      className="primary-btn complete-assignment-btn"
                      onClick={() =>
                        handleCompleteAssignment(
                          assignment.assignment_id
                        )
                      }
                    >
                      ✓ Mark Assignment Completed
                    </button>
                  </div>
                )}

                {isCompleted && (
                  <div className="assignment-completed-message">
                    ✓ Assignment completed successfully
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
  /* =========================================================
     PROFILE
  ========================================================= */

 const Profile = () => {
  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">WORKER PORTAL</div>
          <h1>My Profile</h1>
          <p>Your worker profile and account information.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadWorkerProfile}
          disabled={workerProfileLoading}
        >
          {workerProfileLoading ? "Loading..." : "↻ Refresh"}
        </button>
      </div>

      {workerProfileLoading ? (
        <div className="empty-state">
          <h3>Loading profile...</h3>
          <p>Fetching your latest profile information.</p>
        </div>
      ) : !workerProfile ? (
        <div className="empty-state">
          <h3>Profile not available</h3>
          <p>Unable to load your worker profile.</p>
        </div>
      ) : (
        <div className="profile-card">

          {/* PROFILE HEADER */}
          <div className="profile-main">
            <div className="large-avatar">
              {workerProfile.name
                ? workerProfile.name.charAt(0).toUpperCase()
                : "W"}
            </div>

            <div>
              <h2>{workerProfile.name}</h2>
              <p>GigForce Worker</p>
            </div>
          </div>

          {/* PROFILE TAGS */}
          <div className="profile-tags">
            <span>Worker ID #{workerProfile.id}</span>
            <span>
              {workerProfile.role === "worker"
                ? "Worker"
                : workerProfile.role}
            </span>
            <span>Active Account</span>
          </div>

          {/* PROFILE DETAILS */}
          <div className="profile-details">

            <div className="profile-detail-item">
              <span>Email</span>
              <strong>{workerProfile.email}</strong>
            </div>

            <div className="profile-detail-item">
              <span>Role</span>
              <strong>
                {workerProfile.role === "worker"
                  ? "Worker"
                  : workerProfile.role}
              </strong>
            </div>

            <div className="profile-detail-item">
              <span>Worker ID</span>
              <strong>#{workerProfile.id}</strong>
            </div>

            <div className="profile-detail-item">
              <span>Joined</span>
              <strong>
                {workerProfile.created_at
                  ? new Date(
                      workerProfile.created_at
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </strong>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
  /* =========================================================
     ADMIN DASHBOARD
  ========================================================= */

  const AdminDashboard = () => {
  const [adminStats, setAdminStats] = useState({
    total_workers: 0,
    available_workers: 0,
    busy_workers: 0,
    total_companies: 0,
    total_requests: 0,
    active_requests: 0,
    completed_requests: 0,
  });

  const [adminRequests, setAdminRequests] = useState([]);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    loadAdminDashboard();
  }, []);

  const loadAdminDashboard = async () => {
    setAdminLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        method: "GET",
       headers: {
  Authorization: `Bearer ${getAuthToken()}`,
  Accept: "application/json",
},
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load admin dashboard."
        );
      }

      setAdminStats(data.stats || {});

      setAdminRequests(
        (data.recent_requests || []).map((request) =>
          normalizeApiRequest(request)
        )
      );
    } catch (error) {
      console.error("Admin Dashboard API error:", error);
      showToast(error.message || "Could not load admin dashboard.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Administration</div>

          <h1>Admin Dashboard</h1>

          <p>Monitor the B2B workforce marketplace.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadAdminDashboard}
          disabled={adminLoading}
        >
          ↻ {adminLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="stats-grid">
        <Stat
          icon="◉"
          label="Total Requests"
          value={adminStats.total_requests}
        />

        <Stat
          icon="♙"
          label="Registered Workers"
          value={adminStats.total_workers}
        />

        <Stat
          icon="✓"
          label="Available Workers"
          value={adminStats.available_workers}
        />

        <Stat
          icon="▣"
          label="B2B Companies"
          value={adminStats.total_companies}
        />
      </div>

      <div className="section-header">
        <div>
          <h2>Latest Workforce Requests</h2>
          <p>Monitor incoming business requirements.</p>
        </div>
      </div>

      {adminLoading ? (
        <div className="empty-state">
          Loading workforce requests...
        </div>
      ) : adminRequests.length === 0 ? (
        <div className="empty-state">
          <h3>No workforce requests</h3>
          <p>New business requirements will appear here.</p>
        </div>
      ) : (
        <div className="request-grid">
          {adminRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
            />
          ))}
        </div>
      )}
    </>
  );
};

  /* =========================================================
     ADMIN REQUESTS
  ========================================================= */

 const AdminRequests = () => {
  const [adminRequests, setAdminRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminRequests();
  }, []);

  const loadAdminRequests = async () => {
    setLoading(true);

    try {
    const response = await fetch(`${API_BASE_URL}/admin/requests`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    Accept: "application/json",
  },
});

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load workforce requests."
        );
      }

      setAdminRequests(
        (data.requests || []).map((request) =>
          normalizeApiRequest(request)
        )
      );
    } catch (error) {
      console.error("Admin Requests API error:", error);

      showToast(
        error.message || "Could not load workforce requests."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Administration</div>

          <h1>Workforce Requests</h1>

          <p>
            Manage all workforce requirements from B2B companies.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadAdminRequests}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          Loading workforce requests...
        </div>
      ) : adminRequests.length === 0 ? (
        <div className="empty-state">
          <h3>No workforce requests</h3>

          <p>
            New business requirements will appear here.
          </p>
        </div>
      ) : (
        <div className="request-grid">
          {adminRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
            />
          ))}
        </div>
      )}
    </>
  );
};
  /* =========================================================
     ADMIN WORKERS
  ========================================================= */

 const AdminWorkers = () => {
  const [adminWorkers, setAdminWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminWorkers();
  }, []);

  const loadAdminWorkers = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/workers`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    Accept: "application/json",
  },
});

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load workers."
        );
      }

      setAdminWorkers(data.workers || []);
    } catch (error) {
      console.error("Admin Workers API error:", error);

      showToast(
        error.message || "Could not load workers."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Administration</div>

          <h1>Workers</h1>

          <p>Manage delivery partners and gig workers.</p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadAdminWorkers}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          Loading workers...
        </div>
      ) : adminWorkers.length === 0 ? (
        <div className="empty-state">
          <h3>No workers registered</h3>

          <p>
            Registered delivery and gig workers will appear here.
          </p>
        </div>
      ) : (
        <div className="worker-grid">
          {adminWorkers.map((worker) => {
            const name = worker.name || "Worker";

            const initials = name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                className="worker-card"
                key={worker.id}
              >
                <div className="worker-top">
                  <div className="avatar">
                    {initials}
                  </div>

                  <span
                    className={`availability ${
                      worker.availability === "Available"
                        ? "available"
                        : "busy"
                    }`}
                  >
                    {worker.availability || "Unknown"}
                  </span>
                </div>

                <h3>{name}</h3>

                <p>{worker.worker_type || "Gig Worker"}</p>

                <div className="worker-details">
                  <div>
                    <span>Location</span>
                    <strong>
                      {worker.city || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {worker.phone || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {worker.email || "—"}
                    </strong>
                  </div>

                  <div>
                    <span>Skills</span>
                    <strong>
                      {worker.skills || "—"}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
  /* =========================================================
     ADMIN COMPANIES
  ========================================================= */

  const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminCompanies();
  }, []);

  const loadAdminCompanies = async () => {
    setLoading(true);

    try {
      const response = await fetch(
  `${API_BASE_URL}/admin/companies`,
  {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
      Accept: "application/json",
    },
  }
);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load companies."
        );
      }

      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Admin Companies API error:", error);

      showToast(
        error.message || "Could not load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Administration</div>

          <h1>B2B Companies</h1>

          <p>
            Companies using the GigForce workforce network.
          </p>
        </div>

        <button
          className="secondary-btn"
          onClick={loadAdminCompanies}
          disabled={loading}
        >
          ↻ {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          Loading companies...
        </div>
      ) : companies.length === 0 ? (
        <div className="empty-state">
          <h3>No companies registered</h3>

          <p>
            B2B companies using GigForce will appear here.
          </p>
        </div>
      ) : (
        <div className="business-list">
          {companies.map((company) => (
            <div
              className="business-row"
              key={company.id}
            >
              <strong>
                {company.company_name}
              </strong>

              <span>
                {company.industry || "B2B Workforce"}
              </span>

              <span>
                {company.requests} requests
              </span>

              <span>
                {company.workers} workers
              </span>

              <span className="badge">
                {company.status || "Active"}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
  /* =========================================================
     ROUTER
  ========================================================= */

  const renderPage = () => {
    if (role === "company") {
      if (activePage === "request") {
return renderRequestWorkers();
      }

      if (activePage === "requests") {
        return <MyRequests />;
      }

      if (activePage === "workers") {
        return <AvailableWorkers />;
      }

      return <CompanyDashboard />;
    }

    if (role === "worker") {
      if (activePage === "jobs") {
        return <AvailableJobs />;
      }

      if (activePage === "assignments") {
        return <MyAssignments />;
      }

      if (activePage === "profile") {
        return <Profile />;
      }

      return <WorkerDashboard />;
    }

    if (activePage === "requests") {
      return <AdminRequests />;
    }

    if (activePage === "workers") {
      return <AdminWorkers />;
    }

    if (activePage === "companies") {
      return <AdminCompanies />;
    }

    return <AdminDashboard />;
  };


  const closeDetails = () => setSelectedDetailsRequest(null);
if (!isAuthenticated) {
  return (
    <LoginScreen
      onLogin={handleLoginSuccess}
    />
  );
}
  return (
    <div className="app">
      {renderHeader()}

      <div className="app-body">
        {renderSidebar()}

        <main className="main-content">{renderPage()}</main>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {selectedDetailsRequest && (
        <div className="details-overlay" onClick={closeDetails}>
          <div
            className="details-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="details-modal-header">
              <div>
                <div className="eyebrow">Workforce Request</div>
                <h2>{selectedDetailsRequest.company}</h2>
                <p>{selectedDetailsRequest.workType}</p>
              </div>

              <button className="modal-close" onClick={closeDetails}>
                ×
              </button>
            </div>

            <div className="details-status-row">
              <span className="request-status">
                {selectedDetailsRequest.status}
              </span>

              <span
                className={`priority priority-${selectedDetailsRequest.priority.toLowerCase()}`}
              >
                {selectedDetailsRequest.priority}
              </span>
            </div>

            <div className="details-grid">
              <div>
                <span>Location</span>
                <strong>{selectedDetailsRequest.location}</strong>
              </div>

              <div>
                <span>Workers Required</span>
                <strong>{selectedDetailsRequest.workersRequired}</strong>
              </div>

              <div>
                <span>Duration</span>
                <strong>{selectedDetailsRequest.duration}</strong>
              </div>

              <div>
                <span>Required Date</span>
                <strong>{selectedDetailsRequest.date}</strong>
              </div>
            </div>

            <div className="details-assigned">
  <div className="details-section-title">
    Workforce Progress
  </div>

  <div className="details-progress-grid">
    <div>
      <span>Required</span>
      <strong>
        {Number(selectedDetailsRequest.workersRequired || 0)}
      </strong>
    </div>

    <div>
      <span>Assigned</span>
      <strong>
        {Number(selectedDetailsRequest.assignedCount || 0)}
      </strong>
    </div>

    <div>
      <span>Completed</span>
      <strong>
        {Number(selectedDetailsRequest.completedWorkers || 0)}
      </strong>
    </div>

    <div>
      <span>Remaining</span>
      <strong>
        {Number(
          selectedDetailsRequest.workersRemaining ??
            Math.max(
              Number(selectedDetailsRequest.workersRequired || 0) -
                Number(selectedDetailsRequest.assignedCount || 0) -
                Number(selectedDetailsRequest.completedWorkers || 0),
              0
            )
        )}
      </strong>
    </div>
  </div>
</div>

            <div className="details-modal-footer">
              <button className="secondary-btn" onClick={closeDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   STAT COMPONENT
========================================================= */

function Stat({ icon, label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span className="stat-label">{label}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default App;