import React, { useState } from "react";
import { FaBars, FaHome, FaEllipsisV, FaSearch, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

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

  const filteredItems = historyItems.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuClick = (index) => {
    setShowMenu((prev) => (prev === index ? null : index));
  };

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
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div key={index} className="history-item-container">
                  <div className="history-item" onClick={() => onHistoryItemClick(item)}>
                    <p className="history-date">{item.date}</p>
                    <p>{item.description.slice(0, 30)}...</p>
                  </div>
                  <div className="menu-container">
                    <FaEllipsisV className="menu-icon" onClick={() => handleMenuClick(index)} />
                    {showMenu === index && (
                      <div className="dropdown-menu">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            const newName = prompt("Enter a new name:", item.description);
                            if (newName) onRenameItem(index, newName);
                            setShowMenu(null);
                          }}
                        >
                          <FaEdit className="dropdown-icon" />
                          Rename
                        </div>
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            onDeleteItem(index);
                            setShowMenu(null);
                          }}
                        >
                          <FaTrashAlt className="dropdown-icon delete-icon" />
                          Delete
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-history">No history is available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default History;
