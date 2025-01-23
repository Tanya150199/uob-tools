import React, { useState, useEffect } from "react";
import { FaBars, FaHome, FaEllipsisH, FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import moment from "moment";

const History = ({
  isSidebarCollapsed,
  toggleSidebar,
  historyItems,
  onHistoryItemClick,
  onDeleteItem,
  onRenameItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const [groupedItems, setGroupedItems] = useState({});

  // Group history items based on time
  const groupHistoryItems = (items) => {
    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: [],
    };

    const now = moment(); // Current time

    items.forEach((item) => {
      // Parse date with the format "DD/MM/YYYY"
      const itemDate = moment(item.date, "DD/MM/YYYY", true); // 'true' enables strict parsing

      if (!itemDate.isValid()) {
        console.error(`Invalid date format: ${item.date}`);
        return; // Skip invalid dates
      }

      const isToday = now.isSame(itemDate, "day");
      const isYesterday = now.diff(itemDate, "days") === 1;
      const within7Days = now.diff(itemDate, "days") <= 7;

      if (isToday) {
        groups.Today.push(item);
      } else if (isYesterday) {
        groups.Yesterday.push(item);
      } else if (within7Days) {
        groups["Previous 7 Days"].push(item);
      } else {
        groups.Older.push(item);
      }
    });

    return groups;
  };

  // Dynamically update grouped history
  useEffect(() => {
    // Initial grouping
    setGroupedItems(groupHistoryItems(historyItems));

    // Re-group every minute to ensure accuracy
    const interval = setInterval(() => {
      setGroupedItems(groupHistoryItems(historyItems));
    }, 60000); // 1-minute interval

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [historyItems]);

  const handleMenuClick = (index) => {
    setShowMenu((prev) => (prev === index ? null : index));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowMenu(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={`history-panel ${isSidebarCollapsed ? "collapsed" : ""}`}>
      <div className="history-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        {!isSidebarCollapsed && (
          <>
            <Link to="/" className="home-icon">
              <FaHome />
            </Link>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search history"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {!isSidebarCollapsed && (
        <>
          {/* Static Links Section */}
          <hr className="history-divider" />

          <div className="static-links">
            <a
              href="https://www.bath.ac.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="history-item static-item"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src="/face-logo-white.png"
                alt="UoB Logo"
                style={{ width: "30px", height: "30px" }}
              />
              Official UoB
            </a>
            <a
              href="https://www.bath.ac.uk/corporate-information/job-evaluation/"
              target="_blank"
              rel="noopener noreferrer"
              className="history-item static-item"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src="/face-logo-white.png"
                alt="HERA Logo"
                style={{ width: "30px", height: "30px" }}
              />
              HERA Job Evaluation
            </a>
          </div>

          <hr className="history-divider" />

          {/* Dynamic History Section */}
          <div className="history-section">
            {Object.keys(groupedItems).map((group) =>
              groupedItems[group].length > 0 ? (
                <div key={group}>
                  <h4 className="history-subtitle">{group}</h4>
                  {groupedItems[group].map((item, index) => (
                    <div
                      key={index}
                      className="history-item-container"
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}
                    >
                      <div
                        className="history-item"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering outside click
                          onHistoryItemClick(item);
                        }}
                        style={{
                          maxHeight: "4rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "70%", // Shorten text width
                          padding: "0.5rem",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <p style={{ fontSize: "1rem", fontWeight: "400", margin: 0, marginLef: "2px" }}>
                          {item.description.length > 100
                            ? `${item.description.slice(0, 100)}...`
                            : item.description}
                        </p>
                      </div>
                      <div
                        className="menu-container"
                        style={{ position: "relative", width: "2rem", textAlign: "center" }}
                      >
                        <FaEllipsisH
                          className="menu-icon"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering outside click
                            handleMenuClick(index);
                          }}
                        />
                        {showMenu === index && (
                          <div
                            className="dropdown-menu"
                            style={{
                              position: "absolute",
                              top: "2rem",
                              right: "0",
                              backgroundColor: "#fff",
                              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                              padding: "10px",
                              borderRadius: "8px",
                              zIndex: 10,
                              minWidth: "120px",
                            }}
                          >
                            <div
                              className="dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent closing dropdown
                                const newName = prompt("Enter a new name:", item.description);
                                if (newName) onRenameItem(index, newName);
                                setShowMenu(null);
                              }}
                              style={{
                                padding: "5px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                color: "#333",
                              }}
                            >
                              <FaEdit className="dropdown-icon" /> Rename
                            </div>
                            <div
                              className="dropdown-item"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent closing dropdown
                                onDeleteItem(index);
                                setShowMenu(null);
                              }}
                              style={{
                                padding: "5px",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                color: "red",
                              }}
                            >
                              <FaTrashAlt className="dropdown-icon delete-icon" /> Delete
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null
            )}

            {/* No History Placeholder */}
            {Object.keys(groupedItems).every(
              (group) => groupedItems[group].length === 0
            ) && <p className="no-history">No history is available</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
