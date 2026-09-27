import { useMemo, useState } from "react";
import "./App.css";

/* =========================================================
   INITIAL DATA
========================================================= */

const initialRequests = [
  {
    id: 1,
    company: "QuickCommerce",
    initials: "QC",
    workType: "Delivery Support",
    location: "Hyderabad",
    workersRequired: 20,
    duration: "6 Hours",
    date: "Today",
    priority: "High",
    status: "Open",
    assignedWorkers: [],
  },
  {
    id: 2,
    company: "FlashKart",
    initials: "FK",
    workType: "Warehouse Support",
    location: "Madhapur",
    workersRequired: 15,
    duration: "4 Hours",
    date: "Today",
    priority: "Medium",
    status: "Open",
    assignedWorkers: [],
  },
  {
    id: 3,
    company: "RapidRetail",
    initials: "RR",
    workType: "Delivery Support",
    location: "Gachibowli",
    workersRequired: 12,
    duration: "5 Hours",
    date: "Tomorrow",
    priority: "High",
    status: "Open",
    assignedWorkers: [],
  },
  {
    id: 4,
    company: "CityMart",
    initials: "CM",
    workType: "Store Operations",
    location: "Kukatpally",
    workersRequired: 8,
    duration: "3 Hours",
    date: "Tomorrow",
    priority: "Low",
    status: "Open",
    assignedWorkers: [],
  },
];

const initialWorkers = [
  {
    id: 1,
    name: "Rahul Kumar",
    initials: "RK",
    location: "Hyderabad",
    type: "Delivery Partner",
    experience: "2 Years",
    rating: "4.8",
    availability: "Available",
  },
  {
    id: 2,
    name: "Arjun Reddy",
    initials: "AR",
    location: "Madhapur",
    type: "Gig Worker",
    experience: "1.5 Years",
    rating: "4.7",
    availability: "Available",
  },
  {
    id: 3,
    name: "Vikram Singh",
    initials: "VS",
    location: "Gachibowli",
    type: "Delivery Partner",
    experience: "3 Years",
    rating: "4.9",
    availability: "Busy",
  },
  {
    id: 4,
    name: "Sanjay Kumar",
    initials: "SK",
    location: "Kukatpally",
    type: "Gig Worker",
    experience: "1 Year",
    rating: "4.6",
    availability: "Available",
  },
  {
    id: 5,
    name: "Imran Ali",
    initials: "IA",
    location: "Secunderabad",
    type: "Delivery Partner",
    experience: "2.5 Years",
    rating: "4.8",
    availability: "Available",
  },
];

/* =========================================================
   APP
========================================================= */

function App() {
  const [role, setRole] = useState("company");

  const [activePage, setActivePage] = useState("dashboard");

  const [requests, setRequests] = useState(initialRequests);
  const [workers, setWorkers] = useState(initialWorkers);
  const [selectedRequestId, setSelectedRequestId] = useState(initialRequests[0].id);
  const [selectedDetailsRequestId, setSelectedDetailsRequestId] = useState(null);

  const [toast, setToast] = useState("");

  const [requestForm, setRequestForm] = useState({
    workType: "Delivery Support",
    location: "",
    workersRequired: "",
    duration: "4 Hours",
    date: "Today",
    priority: "Medium",
  });

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
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

  const createWorkforceRequest = (event) => {
    event.preventDefault();

    if (
      !requestForm.location.trim() ||
      !requestForm.workersRequired ||
      Number(requestForm.workersRequired) <= 0
    ) {
      showToast("Please enter location and workers required.");
      return;
    }

    const companyName = "Your Company";

    const newRequest = {
      id: Date.now(),
      company: companyName,
      initials: "YC",
      workType: requestForm.workType,
      location: requestForm.location.trim(),
      workersRequired: Number(requestForm.workersRequired),
      duration: requestForm.duration,
      date: requestForm.date,
      priority: requestForm.priority,
      status: "Open",
      assignedWorkers: [],
    };

    setRequests((previous) => [newRequest, ...previous]);

    setRequestForm({
      workType: "Delivery Support",
      location: "",
      workersRequired: "",
      duration: "4 Hours",
      date: "Today",
      priority: "Medium",
    });

    showToast("Workforce request created successfully.");

    setActivePage("requests");
  };

  /* =========================================================
     COMPLETE REQUEST
  ========================================================= */

const markComplete = (requestId) => {
  const targetRequest = requests.find(
    (request) => request.id === requestId
  );

  if (!targetRequest) return;

  const assignedWorkerIds = (targetRequest.assignedWorkers || []).map(
    (worker) => worker.id
  );

  // Complete the request AND clear assigned workers
  setRequests((previous) =>
    previous.map((request) =>
      request.id === requestId
        ? {
            ...request,
            status: "Completed",
            assignedWorkers: [],
          }
        : request
    )
  );

  // Release assigned workers
  if (assignedWorkerIds.length > 0) {
    setWorkers((previous) =>
      previous.map((worker) =>
        assignedWorkerIds.includes(worker.id)
          ? {
              ...worker,
              availability: "Available",
            }
          : worker
      )
    );
  }

  showToast(
    assignedWorkerIds.length > 0
      ? "Request completed. Assigned workers are now available."
      : "Workforce request marked as completed."
  );
};

  /* =========================================================
     WORKER MATCHING / ASSIGNMENT
  ========================================================= */

  const assignWorkerToRequest = (requestId, workerId) => {
    const worker = workers.find((item) => item.id === workerId);

    if (!worker) return;

    const targetRequest = requests.find((request) => request.id === requestId);

    if (!targetRequest) return;

    const assignedWorkers = targetRequest.assignedWorkers || [];

    if (assignedWorkers.some((item) => item.id === workerId)) {
      showToast(`${worker.name} is already assigned.`);
      return;
    }

    if (assignedWorkers.length >= Number(targetRequest.workersRequired)) {
      showToast("This workforce request is already fully staffed.");
      return;
    }

    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== requestId) return request;

        const updatedAssignedWorkers = [
          ...(request.assignedWorkers || []),
          {
            id: worker.id,
            name: worker.name,
            initials: worker.initials,
          },
        ];

        return {
          ...request,
          assignedWorkers: updatedAssignedWorkers,
          status:
            updatedAssignedWorkers.length >= Number(request.workersRequired)
              ? "Assigned"
              : "Partially Assigned",
        };
      })
    );

    setWorkers((previous) =>
      previous.map((item) =>
        item.id === workerId
          ? { ...item, availability: "Busy" }
          : item
      )
    );

    showToast(`${worker.name} assigned successfully.`);
  };

  const acceptJob = (requestId) => {
  const currentWorker = workers.find((worker) => worker.id === 1);

  if (!currentWorker) {
    showToast("Worker profile not found.");
    return;
  }

  const targetRequest = requests.find(
    (request) => request.id === requestId
  );

  if (!targetRequest) return;

  const assignedWorkers = targetRequest.assignedWorkers || [];

  // Prevent duplicate assignment
  if (assignedWorkers.some((worker) => worker.id === currentWorker.id)) {
    showToast("You are already assigned to this job.");
    return;
  }

  // Check whether the request still needs workers
  if (
    assignedWorkers.length >= Number(targetRequest.workersRequired)
  ) {
    showToast("This workforce request is already fully assigned.");
    return;
  }

  // Add current worker to this request
  const updatedAssignedWorkers = [
    ...assignedWorkers,
    currentWorker,
  ];

  const isFullyAssigned =
    updatedAssignedWorkers.length >=
    Number(targetRequest.workersRequired);

  setRequests((previous) =>
    previous.map((request) =>
      request.id === requestId
        ? {
            ...request,
            assignedWorkers: updatedAssignedWorkers,
            status: isFullyAssigned
              ? "Assigned"
              : "Partially Assigned",
          }
        : request
    )
  );

  // Worker becomes busy
  setWorkers((previous) =>
    previous.map((worker) =>
      worker.id === currentWorker.id
        ? {
            ...worker,
            availability: "Busy",
          }
        : worker
    )
  );

  showToast("Job accepted successfully.");
};
  /* =========================================================
     ROLE CHANGE
  ========================================================= */

  const changeRole = (newRole) => {
    setRole(newRole);
    setActivePage("dashboard");
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

        <div className="role-switch">
          <button
            className={role === "company" ? "active" : ""}
            onClick={() => changeRole("company")}
          >
            Company
          </button>

          <button
            className={role === "worker" ? "active" : ""}
            onClick={() => changeRole("worker")}
          >
            Worker
          </button>

          <button
            className={role === "admin" ? "active" : ""}
            onClick={() => changeRole("admin")}
          >
            Admin
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
    const assignedCount = assignedWorkers.length;
    const remainingWorkers = Math.max(
      Number(request.workersRequired) - assignedCount,
      0
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
              onClick={() => setSelectedDetailsRequestId(request.id)}
            >
              View Details
            </button>
          )}

          {!workerMode && request.status !== "Assigned" && (
            <button
              className="small-btn"
              onClick={() => markComplete(request.id)}
            >
              Mark Complete
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
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">B2B Workforce</div>

            <h1>Workforce Dashboard</h1>

            <p>
              Manage your delivery and gig workforce requirements
              from one place.
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
          <Stat icon="◉" label="Total Requests" value={totalRequests} />

          <Stat icon="◷" label="Open Requests" value={openRequests} />

          <Stat
            icon="♙"
            label="Workers Requested"
            value={workersRequested}
          />

          <Stat
            icon="✓"
            label="Workers Available"
            value={workersAvailable}
          />
        </div>

        <div className="section-header">
          <div>
            <h2>Recent Workforce Requests</h2>
            <p>Latest requirements raised by your company</p>
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
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     REQUEST FORM
  ========================================================= */

  const RequestWorkers = () => {
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
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Company Portal</div>

            <h1>My Requests</h1>

            <p>Track all workforce requirements raised by your company.</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => setActivePage("request")}
          >
            + New Request
          </button>
        </div>

        <div className="stats-grid">
          <Stat icon="◉" label="Total Requests" value={totalRequests} />

          <Stat icon="◷" label="Open Requests" value={openRequests} />

          <Stat
            icon="♙"
            label="Workers Requested"
            value={workersRequested}
          />

          <Stat
            icon="✓"
            label="Workers Available"
            value={workersAvailable}
          />
        </div>

        <div className="request-grid">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     AVAILABLE WORKERS / MATCHING
  ========================================================= */

  const AvailableWorkers = () => {
    const openRequests = requests.filter(
      (request) =>
        request.status !== "Assigned" &&
        (request.assignedWorkers || []).length < Number(request.workersRequired)
    );

    const selectedRequest = requests.find(
      (request) => request.id === Number(selectedRequestId)
    );

    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Workforce Network</div>
            <h1>Available Workers</h1>
            <p>Match available workers with your open workforce requirements.</p>
          </div>
        </div>

        <div className="matching-bar">
          <div>
            <strong>Select a workforce request</strong>
            <p>Choose a request before assigning workers.</p>
          </div>
          <select
            value={selectedRequestId}
            onChange={(event) => setSelectedRequestId(Number(event.target.value))}
          >
            {openRequests.length === 0 ? (
              <option value="">No open requests</option>
            ) : (
              openRequests.map((request) => (
                <option key={request.id} value={request.id}>
                  {request.company} • {request.location} • {request.workersRequired} workers
                </option>
              ))
            )}
          </select>
        </div>

        {selectedRequest && (
          <div className="matching-summary">
            <span>
              <strong>{selectedRequest.company}</strong> — {selectedRequest.workType}
            </span>
            <span>📍 {selectedRequest.location}</span>
            <span>
              👥 {(selectedRequest.assignedWorkers || []).length} / {selectedRequest.workersRequired} assigned
            </span>
          </div>
        )}

        <div className="worker-grid">
          {workers.map((worker) => {
            const assignedToSelected =
              selectedRequest?.assignedWorkers?.some((item) => item.id === worker.id);
            const requestFull =
              selectedRequest &&
              (selectedRequest.assignedWorkers || []).length >=
                Number(selectedRequest.workersRequired);

            return (
              <div className="worker-card" key={worker.id}>
                <div className="worker-top">
                  <div className="avatar">{worker.initials}</div>
                  <span
                    className={`availability ${
                      worker.availability === "Available" ? "available" : "busy"
                    }`}
                  >
                    {worker.availability}
                  </span>
                </div>

                <h3>{worker.name}</h3>
                <p>{worker.type}</p>

                <div className="worker-details">
                  <div>
                    <span>Location</span>
                    <strong>{worker.location}</strong>
                  </div>
                  <div>
                    <span>Experience</span>
                    <strong>{worker.experience}</strong>
                  </div>
                  <div>
                    <span>Rating</span>
                    <strong>⭐ {worker.rating}</strong>
                  </div>
                </div>

                <button
                  className="full-btn"
                  disabled={
                    !selectedRequest ||
                    worker.availability !== "Available" ||
                    assignedToSelected ||
                    requestFull
                  }
                  onClick={() =>
                    assignWorkerToRequest(selectedRequest.id, worker.id)
                  }
                >
                  {assignedToSelected
                    ? "Already Assigned"
                    : worker.availability !== "Available"
                      ? "Currently Busy"
                      : requestFull
                        ? "Request Fully Staffed"
                        : "Assign Worker"}
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  /* =========================================================
     WORKER DASHBOARD
  ========================================================= */

  const WorkerDashboard = () => {
    const openJobs = requests.filter(
      (request) => request.status === "Open"
    );

    const assignedJobs = requests.filter(
      (request) => request.status === "Assigned"
    );

    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Worker Portal</div>

            <h1>Worker Dashboard</h1>

            <p>Find flexible delivery and gig work opportunities.</p>
          </div>

          <button
            className="primary-btn"
            onClick={() => setActivePage("jobs")}
          >
            Find Jobs
          </button>
        </div>

        <div className="stats-grid">
          <Stat icon="◉" label="Available Jobs" value={openJobs.length} />

          <Stat
            icon="✓"
            label="My Assignments"
            value={assignedJobs.length}
          />

          <Stat icon="★" label="Rating" value="4.8" />

          <Stat icon="₹" label="This Month" value="₹12K" />
        </div>

        <div className="section-header">
          <div>
            <h2>Available Jobs</h2>
            <p>Latest workforce opportunities</p>
          </div>

          <button
            className="text-btn"
            onClick={() => setActivePage("jobs")}
          >
            View All
          </button>
        </div>

        <div className="job-grid">
          {openJobs.slice(0, 4).map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              workerMode
            />
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     AVAILABLE JOBS
  ========================================================= */

const AvailableJobs = () => {
  const openJobs = requests.filter(
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

            <p>Choose workforce opportunities that match your availability.</p>
          </div>
        </div>

        <div className="request-grid">
          {openJobs.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              workerMode
            />
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     ASSIGNMENTS
  ========================================================= */

  const MyAssignments = () => {
  const currentWorkerId = 1;

  const assigned = requests.filter((request) =>
    (request.assignedWorkers || []).some(
      (worker) => worker.id === currentWorkerId
    )
  );

  return (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">Worker Portal</div>

          <h1>My Assignments</h1>

          <p>Workforce assignments you have accepted.</p>
        </div>
      </div>

      {assigned.length === 0 ? (
        <div className="empty-state">
          <h3>No assignments yet</h3>

          <p>
            Accept an available job to see your assignment here.
          </p>
        </div>
      ) : (
        <div className="request-grid">
          {assigned.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              workerMode={false}
            />
          ))}
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
            <div className="eyebrow">Worker Portal</div>

            <h1>My Profile</h1>

            <p>Your worker profile and availability information.</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-main">
            <div className="large-avatar">RK</div>

            <div>
              <h2>Rahul Kumar</h2>

              <p>Delivery Partner • Hyderabad</p>
            </div>
          </div>

          <div className="profile-tags">
            <span>Delivery</span>
            <span>Warehouse</span>
            <span>Store Operations</span>
            <span>Available</span>
          </div>
        </div>
      </>
    );
  };

  /* =========================================================
     ADMIN DASHBOARD
  ========================================================= */

  const AdminDashboard = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Administration</div>

            <h1>Admin Dashboard</h1>

            <p>Monitor the B2B workforce marketplace.</p>
          </div>
        </div>

        <div className="stats-grid">
          <Stat icon="◉" label="Total Requests" value={totalRequests} />

          <Stat icon="♙" label="Registered Workers" value={workers.length} />

          <Stat
            icon="✓"
            label="Available Workers"
            value={workersAvailable}
          />

          <Stat icon="▣" label="B2B Companies" value="4" />
        </div>

        <div className="section-header">
          <div>
            <h2>Latest Workforce Requests</h2>
            <p>Monitor incoming business requirements.</p>
          </div>
        </div>

        <div className="request-grid">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     ADMIN REQUESTS
  ========================================================= */

  const AdminRequests = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Administration</div>

            <h1>Workforce Requests</h1>

            <p>Manage all workforce requirements from B2B companies.</p>
          </div>
        </div>

        <div className="request-grid">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     ADMIN WORKERS
  ========================================================= */

  const AdminWorkers = () => {
    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Administration</div>

            <h1>Workers</h1>

            <p>Manage delivery partners and gig workers.</p>
          </div>
        </div>

        <div className="worker-grid">
          {workers.map((worker) => (
            <div className="worker-card" key={worker.id}>
              <div className="worker-top">
                <div className="avatar">{worker.initials}</div>

                <span
                  className={`availability ${
                    worker.availability === "Available"
                      ? "available"
                      : "busy"
                  }`}
                >
                  {worker.availability}
                </span>
              </div>

              <h3>{worker.name}</h3>

              <p>{worker.type}</p>

              <div className="worker-details">
                <div>
                  <span>Location</span>
                  <strong>{worker.location}</strong>
                </div>

                <div>
                  <span>Experience</span>
                  <strong>{worker.experience}</strong>
                </div>

                <div>
                  <span>Rating</span>
                  <strong>⭐ {worker.rating}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     ADMIN COMPANIES
  ========================================================= */

  const AdminCompanies = () => {
    const companies = [
      {
        name: "QuickCommerce",
        industry: "Quick Commerce",
        requests: 8,
        workers: 42,
        status: "Active",
      },
      {
        name: "FlashKart",
        industry: "E-Commerce",
        requests: 6,
        workers: 28,
        status: "Active",
      },
      {
        name: "RapidRetail",
        industry: "Retail",
        requests: 4,
        workers: 19,
        status: "Active",
      },
      {
        name: "CityMart",
        industry: "Retail",
        requests: 3,
        workers: 12,
        status: "Active",
      },
    ];

    return (
      <>
        <div className="page-heading">
          <div>
            <div className="eyebrow">Administration</div>

            <h1>B2B Companies</h1>

            <p>Companies using the GigForce workforce network.</p>
          </div>
        </div>

        <div className="business-list">
          {companies.map((company) => (
            <div className="business-row" key={company.name}>
              <strong>{company.name}</strong>

              <span>{company.industry}</span>

              <span>{company.requests} requests</span>

              <span>{company.workers} workers</span>

              <span className="badge">{company.status}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  /* =========================================================
     ROUTER
  ========================================================= */

  const renderPage = () => {
    if (role === "company") {
      if (activePage === "request") {
        return <RequestWorkers />;
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

  const selectedDetailsRequest = requests.find(
    (request) => request.id === selectedDetailsRequestId
  );

  const closeDetails = () => setSelectedDetailsRequestId(null);

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
              <div className="details-section-title">Assigned Workers</div>

              {(selectedDetailsRequest.assignedWorkers || []).length === 0 ? (
                <p>No workers assigned yet.</p>
              ) : (
                <div className="assigned-worker-list">
                  {selectedDetailsRequest.assignedWorkers.map((worker) => (
                    <span key={worker.id}>{worker.name}</span>
                  ))}
                </div>
              )}

              <p>
                {Math.max(
                  Number(selectedDetailsRequest.workersRequired) -
                    (selectedDetailsRequest.assignedWorkers || []).length,
                  0
                )}{" "}
                workers still required
              </p>
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