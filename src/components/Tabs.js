import React from 'react';
import './Tabs.css'; // Make sure you create this CSS file for styling

const Tabs = ({ activeTab, setActiveTab, taskCounts }) => {
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'All' ? 'active' : ''}`}
          onClick={() => handleTabClick('All')}
        >
          All ({taskCounts.all})
        </button>
        <button
          className={`tab-button ${activeTab === 'In-progress' ? 'active' : ''}`}
          onClick={() => handleTabClick('In-progress')}
        >
          In-progress ({taskCounts.inProgress})
        </button>
        <button
          className={`tab-button ${activeTab === 'Completed' ? 'active' : ''}`}
          onClick={() => handleTabClick('Completed')}
        >
          Completed ({taskCounts.completed})
        </button>
      </div>
      <div className="tab-content">
        {/* Content is rendered in Header.js based on the selected tab */}
      </div>
    </div>
  );
};

export default Tabs;
