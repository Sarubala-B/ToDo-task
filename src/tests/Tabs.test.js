import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Tabs from '../components/Tabs';

const TabsWithState = ({ initialActiveTab = 'All', taskCounts = { all: 0, inProgress: 0, completed: 0 } }) => {
    const [activeTab, setActiveTab] = useState(initialActiveTab);
    return <Tabs activeTab={activeTab} setActiveTab={setActiveTab} taskCounts={taskCounts} />;
};

describe('Tabs Component', () => {
    test('renders all tabs with correct task counts', () => {
        render(<TabsWithState taskCounts={{ all: 5, inProgress: 3, completed: 2 }} />);
    
        expect(screen.getByText(/All \(5\)/i)).toBeInTheDocument();
        expect(screen.getByText(/In-progress \(3\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Completed \(2\)/i)).toBeInTheDocument();
    });

    test('activates the "All" tab by default', () => {
        const setActiveTab = jest.fn(); // Mock function
        render(<Tabs activeTab="All" setActiveTab={setActiveTab} taskCounts={{ all: 0, inProgress: 0, completed: 0 }} />);    
        const allTabButton = screen.getByText(/All/i);
        fireEvent.click(allTabButton);

        expect(setActiveTab).toHaveBeenCalledWith('All');
        expect(allTabButton).toHaveClass('active');
        expect(screen.queryByText(/In-progress/i)).not.toHaveClass('active');
        expect(screen.queryByText(/Completed/i)).not.toHaveClass('active');
    });

    test('activates the "In-progress" tab when clicked', () => {
        render(<TabsWithState taskCounts={{ all: 0, inProgress: 3, completed: 0 }} />);   
        const inProgressTabButton = screen.getByText(/In-progress/i);
        fireEvent.click(inProgressTabButton);
    
        expect(inProgressTabButton).toHaveClass('active');
        expect(screen.queryByText(/All/i)).not.toHaveClass('active');
        expect(screen.queryByText(/Completed/i)).not.toHaveClass('active');
    });

    test('activates the "Completed" tab when clicked', () => {
        render(<TabsWithState taskCounts={{ all: 0, inProgress: 0, completed: 2 }} />);    
        const completedTabButton = screen.getByText(/Completed/i);
        fireEvent.click(completedTabButton);
    
        expect(completedTabButton).toHaveClass('active');
        expect(screen.queryByText(/All/i)).not.toHaveClass('active');
        expect(screen.queryByText(/In-progress/i)).not.toHaveClass('active');
    });
});
