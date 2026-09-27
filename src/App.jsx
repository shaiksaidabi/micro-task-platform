import { useMemo, useState } from "react";
import "./App.css";

const starterTasks = [
  {
    id: 1,
    title: "Stock Unloading",
    business: "FreshMart Store",
    location: "2.1 km away",
    duration: "30 min",
    pay: 300,
    workers: 2,
    category: "Retail",
    urgency: "High",
    status: "Available",
  },
  {
    id: 2,
    title: "Shelf Restocking",
    business: "Daily Basket",
    location: "1.8 km away",
    duration: "25 min",
    pay: 250,
    workers: 2,
    category: "Retail",
    urgency: "Medium",
    status: "Available",
  },
  {
    id: 3,
    title: "Emergency Flyer Distribution",
    business: "QuickBite",
    location: "1.4 km away",
    duration: "45 min",
    pay: 400,
    workers: 3,
    category: "Marketing",
    urgency: "Critical",
    status: "Available",
  },
  {
    id: 4,
    title: "Store Promotion",
    business: "Urban Cafe",
    location: "2.5 km away",
    duration: "40 min",
    pay: 350,
    workers: 2,
    category: "Marketing",
    urgency: "High",
    status: "Available",
  },
  {
    id: 5,
    title: "Inventory Counting",
    business: "DailyNeeds",
    location: "3.2 km away",
    duration: "20 min",
    pay: 200,
    workers: 2,
    category: "Inventory",
    urgency: "Medium",
    status: "Available",
  },
  {
    id: 6,
    title: "Barcode Stock Check",
    business: "ValueMart",
    location: "2.7 km away",
    duration: "30 min",
    pay: 280,
    workers: 2,
    category: "Inventory",
    urgency: "Medium",
    status: "Available",
  },
  {
    id: 7,
    title: "Parcel Sorting",
    business: "QuickShip Hub",
    location: "3.6 km away",
    duration: "45 min",
    pay: 350,
    workers: 2,
    category: "Warehouse",
    urgency: "High",
    status: "Available",
  },
  {
    id: 8,
    title: "Packing Assistance",
    business: "LocalKart Warehouse",
    location: "4.1 km away",
    duration: "35 min",
    pay: 300,
    workers: 2,
    category: "Warehouse",
    urgency: "Medium",
    status: "Available",
  },
  {
    id: 9,
    title: "Event Setup Helper",
    business: "City Events",
    location: "2.9 km away",
    duration: "60 min",
    pay: 450,
    workers: 2,
    category: "Events",
    urgency: "High",
    status: "Available",
  },
  {
    id: 10,
    title: "Booth Assistance",
    business: "Market Expo",
    location: "3.3 km away",
    duration: "50 min",
    pay: 400,
    workers: 2,
    category: "Events",
    urgency: "Medium",
    status: "Available",
  },
];

const categories = [
  "All",
  "Retail",
  "Marketing",
  "Inventory",
  "Warehouse",
  "Events",
];

function App() {
  const [role, setRole] = useState("Worker");
  const [tasks, setTasks] = useState(starterTasks);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    business: "",
    location: "",
    duration: "30 min",
    pay: "",
    workers: 1,
    category: "Retail",
    urgency: "Medium",
  });

  const notify = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 2200);
  };

  const updateTask = (id, status) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );

    if (status === "Accepted") {
      notify("Task accepted successfully!");
    }

    if (status === "Completed") {
      notify("Task marked as completed!");
    }
  };

  const createTask = (e) => {
    e.preventDefault();

    const newTask = {
      ...form,
      id: Date.now(),
      pay: Number(form.pay),
      workers: Number(form.workers),
      status: "Available",
      location: form.location || "Nearby",
    };

    setTasks((current) => [newTask, ...current]);

    setForm({
      title: "",
      business: "",
      location: "",
      duration: "30 min",
      pay: "",
      workers: 1,
      category: "Retail",
      urgency: "Medium",
    });

    setShowForm(false);
    notify("Micro-task published successfully!");
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        task.title.toLowerCase().includes(searchValue) ||
        task.business.toLowerCase().includes(searchValue) ||
        task.category.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "All" || task.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [tasks, search, category]);

  const available = tasks.filter(
    (task) => task.status === "Available"
  );

  const accepted = tasks.filter(
    (task) => task.status === "Accepted"
  );

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  );

  return (
    <div className="app">

      {message && <div className="toast">{message}</div>}

      {/* NAVBAR */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">M</div>

          <div>
            <h2>MicroTask</h2>
            <span>10-Minute Dispatch</span>
          </div>
        </div>

        <div className="nav-actions">
          <span className="online">
            <span></span>
            Platform Online
          </span>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setShowForm(false);
            }}
          >
            <option>Worker</option>
            <option>Business</option>
            <option>Admin</option>
          </select>
        </div>
      </header>

      <main className="container">

        {/* HERO */}
        <section className="hero">
          <div>
            <p className="eyebrow">
              ON-DEMAND MICRO WORK
            </p>

            <h1>
              Small tasks.
              <br />
              <span>Quick earnings.</span>
            </h1>

            <p className="hero-text">
              A hyperlocal platform connecting nearby businesses
              with workers for short-duration micro-shifts.
            </p>

            <div className="hero-pills">
              <span>⚡ 10–60 min gigs</span>
              <span>📍 Nearby workers</span>
              <span>💰 Quick opportunities</span>
            </div>
          </div>

          <div className="hero-stat">
            <strong>{available.length}</strong>
            <span>Live tasks</span>
          </div>
        </section>

        {/* ================= WORKER ================= */}
        {role === "Worker" && (
          <>
            <section className="section-heading">
              <div>
                <p className="eyebrow">WORKER DASHBOARD</p>
                <h2>Find your next micro-gig</h2>
                <p>
                  Choose tasks based on location, duration and pay.
                </p>
              </div>
            </section>

            <div className="worker-stats">
              <div>
                <span>Available</span>
                <strong>{available.length}</strong>
              </div>

              <div>
                <span>Active</span>
                <strong>{accepted.length}</strong>
              </div>

              <div>
                <span>Completed</span>
                <strong>{completed.length}</strong>
              </div>

              <div>
                <span>Today's Earnings</span>
                <strong>₹850</strong>
              </div>
            </div>

            <div className="toolbar">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks or businesses..."
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="section-heading">
              <div>
                <h2>Available near you</h2>
                <p>
                  {filteredTasks.length} opportunities found
                </p>
              </div>
            </div>

            <div className="task-grid">
              {filteredTasks.length === 0 ? (
                <div className="empty">
                  <div>⌕</div>
                  <h3>No tasks found</h3>
                  <p>
                    Try another search or category.
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div className="task-card" key={task.id}>

                    <div className="task-top">
                      <span className="category">
                        {task.category}
                      </span>

                      <span className="status">
                        {task.status}
                      </span>
                    </div>

                    <h3>{task.title}</h3>

                    <p className="business">
                      {task.business}
                    </p>

                    <div className="task-info">
                      <span>📍 {task.location}</span>
                      <span>⏱ {task.duration}</span>
                    </div>

                    <div className="urgency">
                      <span>Urgency</span>
                      <b>{task.urgency}</b>
                    </div>

                    <div className="task-bottom">
                      <div>
                        <small>PAY</small>
                        <strong>₹{task.pay}</strong>
                      </div>

                      {task.status === "Available" ? (
                        <button
                          onClick={() =>
                            updateTask(task.id, "Accepted")
                          }
                        >
                          Accept Task →
                        </button>
                      ) : (
                        <span className="accepted-label">
                          {task.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <section className="active-section">
              <div className="section-heading">
                <div>
                  <h2>My active tasks</h2>
                  <p>Manage your accepted work.</p>
                </div>
              </div>

              {accepted.length === 0 ? (
                <div className="empty">
                  <div>✓</div>
                  <h3>No active tasks</h3>
                  <p>
                    Accept a task to start earning.
                  </p>
                </div>
              ) : (
                accepted.map((task) => (
                  <div className="active-task" key={task.id}>
                    <div>
                      <span className="category">
                        {task.category}
                      </span>

                      <h3>{task.title}</h3>

                      <p>
                        {task.business} · {task.duration} · ₹
                        {task.pay}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        updateTask(task.id, "Completed")
                      }
                    >
                      Mark Completed
                    </button>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {/* ================= BUSINESS ================= */}
        {role === "Business" && (
          <section>

            <div className="section-heading">
              <div>
                <p className="eyebrow">BUSINESS DASHBOARD</p>
                <h2>Dispatch work in minutes</h2>
                <p>
                  Create short shifts and reach nearby workers.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Close Form" : "+ Create Task"}
              </button>
            </div>

            {showForm && (
              <form
                className="task-form"
                onSubmit={createTask}
              >
                <h3>Create a Micro Task</h3>

                <input
                  placeholder="Task title"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Business name"
                  required
                  value={form.business}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      business: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      location: e.target.value,
                    })
                  }
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                >
                  {categories
                    .filter((item) => item !== "All")
                    .map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                </select>

                <select
                  value={form.duration}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration: e.target.value,
                    })
                  }
                >
                  <option>10 min</option>
                  <option>20 min</option>
                  <option>30 min</option>
                  <option>45 min</option>
                  <option>60 min</option>
                </select>

                <select
                  value={form.urgency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      urgency: e.target.value,
                    })
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Payment ₹"
                  required
                  value={form.pay}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      pay: e.target.value,
                    })
                  }
                />

                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Workers required"
                  value={form.workers}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      workers: e.target.value,
                    })
                  }
                />

                <button
                  className="primary-btn"
                  type="submit"
                >
                  Publish Task
                </button>
              </form>
            )}

            <div className="business-stats">
              <div>
                <span>Total Tasks</span>
                <strong>{tasks.length}</strong>
              </div>

              <div>
                <span>Available</span>
                <strong>{available.length}</strong>
              </div>

              <div>
                <span>Accepted</span>
                <strong>{accepted.length}</strong>
              </div>

              <div>
                <span>Completed</span>
                <strong>{completed.length}</strong>
              </div>
            </div>

            <div className="business-list">
              {tasks.map((task) => (
                <div
                  className="business-row"
                  key={task.id}
                >
                  <div>
                    <span className="category">
                      {task.category}
                    </span>

                    <h3>{task.title}</h3>

                    <p>
                      {task.business} · {task.duration} · ₹
                      {task.pay} · {task.workers} workers
                    </p>
                  </div>

                  <span className="badge">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ================= ADMIN ================= */}
        {role === "Admin" && (
          <section>

            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  ADMIN CONTROL CENTER
                </p>

                <h2>Platform Overview</h2>

                <p>
                  Monitor tasks, workers and business activity.
                </p>
              </div>
            </div>

            <div className="business-stats">
              <div>
                <span>Total Tasks</span>
                <strong>{tasks.length}</strong>
              </div>

              <div>
                <span>Active Workers</span>
                <strong>128</strong>
              </div>

              <div>
                <span>Businesses</span>
                <strong>24</strong>
              </div>

              <div>
                <span>Completed Today</span>
                <strong>{completed.length + 86}</strong>
              </div>
            </div>

            <div className="admin-panel">
              <h3>Live Task Activity</h3>

              {tasks.map((task) => (
                <div
                  className="business-row"
                  key={task.id}
                >
                  <div>
                    <span className="category">
                      {task.category}
                    </span>

                    <h3>{task.title}</h3>

                    <p>
                      {task.business} · {task.location}
                    </p>
                  </div>

                  <span className="badge">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

export default App;