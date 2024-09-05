import React from 'react';
import './Tabs.css'; 
import Button from './Button';

const Tabs = ({ activeTab, setActiveTab, taskCounts }) => {
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs-container">
            <div className="tabs">
                <Button
                className={`tab-button ${activeTab === 'All' ? 'active' : ''}`}
                onClick={() => handleTabClick('All')}
                label={`All (${taskCounts.all})`}
                />
                <Button
                className={`tab-button ${activeTab === 'In-progress' ? 'active' : ''}`}
                onClick={() => handleTabClick('In-progress')}
                label={`In-progress (${taskCounts.inProgress})`}
                />
                <Button
                className={`tab-button ${activeTab === 'Completed' ? 'active' : ''}`}
                onClick={() => handleTabClick('Completed')}
                label={`Completed (${taskCounts.completed})`}
                />
            </div>
            <div className="tab-content">
               
            </div>
        </div>
    );
};

export default Tabs;
