
import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from '../components/Header';


beforeEach(() => {
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.setItem = jest.fn();
});

describe('local Storage', () => {
    test('loads tasks from localStorage on initial render', () => {
        const mockTasks = [
            { name: 'Task 1', status: 'In-progress' },
            { name: 'Task 2', status: 'In-progress' }
        ];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
    
    test('does not load any tasks if localStorage is empty', () => {
        localStorage.getItem.mockReturnValue(null);
        render(<App />);
        const taskItems = screen.queryAllByRole('listitem');
        expect(taskItems.length).toBe(0); 
    });
    test('updates localStorage after adding a task', () => {
      render(<App />);
      const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
      fireEvent.change(inputElement, { target: { value: 'Task from Test' } });
      const addButtonElement = screen.getByText(/Add/i);
      fireEvent.click(addButtonElement);
  
      expect(localStorage.setItem).toHaveBeenCalledWith(
          'tasks',
          JSON.stringify([{name: 'Task from Test', status: 'In-progress' }])
      );
  });
  
});
describe('App Component', () => {
    test('renders the Todo List header', () => {
        render(<App />);
        const headerElement = screen.getByText(/Todo List/i);
        expect(headerElement).toBeInTheDocument();
    });

    test('renders the TaskInput component', () => {
        render(<App />);
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        expect(inputElement).toBeInTheDocument();
    });

    test('adds a task when Add button is clicked', () => {
        render(<App />);
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        fireEvent.change(inputElement, { target: { value: 'New Task' } });
        const addButtonElement = screen.getByText(/Add/i);
        fireEvent.click(addButtonElement);

        expect(inputElement.value).toBe(''); // Check if input is cleared
    });
    test('adds a task and it appears in the task list', () => {
      render(<App />);
      const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
      fireEvent.change(inputElement, { target: { value: 'New Task' } });
      const addButtonElement = screen.getByText(/Add/i);
      fireEvent.click(addButtonElement);
  
      expect(screen.getByText('New Task')).toBeInTheDocument();
  });
  test('displays "No Tasks Available" when task list is empty', () => {
    localStorage.getItem.mockReturnValue(JSON.stringify([]));
    render(<App />);
    expect(screen.getByText('No Tasks Available')).toBeInTheDocument();
});
test('persists tasks after page reload', () => {
  const mockTasks = [{ name: 'Persisted Task', status: 'In-progress' }];
  localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
  render(<App />);
  
  expect(screen.getByText('Persisted Task')).toBeInTheDocument();
});
test('renders tasks with correct structure including Edit and Delete buttons', () => {
  const mockTasks = [{ name: 'Task 1', status: 'In-progress' }];
  localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
  render(<App />);
  
  expect(screen.getByText('Task 1')).toBeInTheDocument();
  expect(screen.getByText('Edit')).toBeInTheDocument();
  expect(screen.getByText('Delete')).toBeInTheDocument();
});

});
describe('Task Filtering', () => {
    test('shows all tasks when the active tab is "All"', () => {
      const mockTasks = [
        { name: 'Task 1', status: 'In-progress' },
        { name: 'Task 2', status: 'Completed' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));  
      render(<App />);

      fireEvent.click(screen.getByText(/All/i));
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  
    test('shows only "In-progress" tasks when the active tab is "In-progress"', () => {
      const mockTasks = [
        { name: 'Task 1', status: 'In-progress' },
        { name: 'Task 2', status: 'Completed' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));  
      render(<App />);

      fireEvent.click(screen.getByText(/In-progress/i));
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
    });
  
    test('shows only "Completed" tasks when the active tab is "Completed"', () => {
      const mockTasks = [
        { name: 'Task 1', status: 'In-progress' },
        { name: 'Task 2', status: 'Completed' }
      ];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));  
      render(<App />);

      fireEvent.click(screen.getByText(/Completed/i));
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
});
describe('toggle status', () => {
    beforeEach(() => {
      localStorage.clear();
    });
    test('toggles task status from In-progress to Completed and updates localStorage', () => {
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText('Enter your task...'), { target: { value: 'Test Task' } });
        fireEvent.click(screen.getByText('Add'));

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        fireEvent.click(checkbox);
        expect(screen.getByText('Are you sure you want to mark the task as completed?')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Yes'));
        expect(checkbox).toBeChecked();
        setTimeout(() => {
          const storedTasks = localStorage.getItem('tasks');
          expect(storedTasks).not.toBeNull(); 
          if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            // eslint-disable-next-line jest/no-conditional-expect
            expect(tasks[0].status).toBe('Completed');
          }
        }, 100);
      });
    
      test('toggles task status from Completed to In-progress and updates localStorage', () => {
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText('Enter your task...'), { target: { value: 'Test Task' } });
        fireEvent.click(screen.getByText('Add'));
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        fireEvent.click(screen.getByText('Yes'));
        expect(checkbox).toBeChecked();
        fireEvent.click(checkbox);
        expect(screen.getByText('Are you sure you want to revert the task to In-progress?')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Yes'));
        expect(checkbox).not.toBeChecked();
        setTimeout(() => {
          const storedTasks = localStorage.getItem('tasks');
          expect(storedTasks).not.toBeNull();
          if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            // eslint-disable-next-line jest/no-conditional-expect
            expect (tasks[0].status).toBe('In-progress');
          }
        }, 100);
      });    
  });
  describe('Edit Task Functionality', () => {

    test('enters edit mode when Edit button is clicked', () => {
      const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
      render(<App />);
      fireEvent.click(screen.getByText('Edit'));
      const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
      expect(inputElement.value).toBe('Task to Edit');
      expect(screen.getByText(/Save/i)).toBeInTheDocument();
    });
  
    test('saves the edited task and exits edit mode', () => {
      const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
      render(<App />);
      fireEvent.click(screen.getByText('Edit'));
      const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
      fireEvent.change(inputElement, { target: { value: 'Updated Task Name' } });
      fireEvent.click(screen.getByText(/Save/i));
      expect(screen.getByText('Updated Task Name')).toBeInTheDocument();
      expect(screen.getByText(/Add/i)).toBeInTheDocument();
    });
  
    test('correctly updates localStorage after editing a task', () => {
      const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
      render(<App />);
      fireEvent.click(screen.getByText('Edit'));
      const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
      fireEvent.change(inputElement, { target: { value: 'Updated Task Name' } });
      fireEvent.click(screen.getByText(/Save/i));
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'tasks',
        JSON.stringify([{ name: 'Updated Task Name', status: 'In-progress' }])
      );
    });
  });
  describe('Delete Functionality', () => {
    beforeEach(() => {
      localStorage.clear();
    });
  
    test('opens the confirmation dialog when delete button is clicked', () => {
      const mockTasks = [{ name: 'Task 1', status: 'In-progress' }];
      localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
      render(<App />); 
      fireEvent.click(screen.getByText(/Delete/i));
      expect(screen.getByText('Are you sure you want to delete this task?')).toBeInTheDocument();
    });
  
    test('cancels deletion when "No" is clicked in confirmation dialog', async () => {
        const mockTasks = [{ name: 'Task 1', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);     
        fireEvent.click(screen.getByText(/Delete/i));
        const noButton = await screen.findByText(/No/i);
        fireEvent.click(noButton);
        expect(screen.getByText('Task 1')).toBeInTheDocument();
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        expect(storedTasks[0].status).toBe('In-progress');
      });
      
      test('deletes the task and updates localStorage when "Yes" is clicked', () => {
        const mockTasks = [{ name: 'Task 1', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
      
        fireEvent.click(screen.getByText(/Delete/i));
        fireEvent.click(screen.getByText(/Yes/i));
      
        expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'tasks',
          JSON.stringify([])
        );
      });
  });
  describe('Add function', () => {
    test('displays info toast when editing a task with no changes', () => {
        // Arrange
        const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
        
        // Act
        // Click the Edit button to enter edit mode
        fireEvent.click(screen.getByText('Edit'));
        
        // Change the input field to the same name
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        fireEvent.change(inputElement, { target: { value: 'Task to Edit' } });
        
        // Click the Save button
        fireEvent.click(screen.getByText(/Save/i));
        
        // Assert
        // Check that the toast message is displayed with the correct message
        expect(screen.getByText('No changes in the Task')).toBeInTheDocument();
        expect(screen.getByText('No changes in the Task').classList.contains('toast-info')).toBe(true);
    });
    test('shows toast message for duplicate task', () => {
        render(<App />);
    
        // Simulate adding a new task
        const taskInput = screen.getByPlaceholderText('Enter your task...'); // Ensure this placeholder matches your input
        const addButton = screen.getByText('Add'); // Ensure this button text matches your button
    
        // Add a task
        fireEvent.change(taskInput, { target: { value: 'Test Task' } });
        fireEvent.click(addButton);
    
        // Try adding the same task again
        fireEvent.change(taskInput, { target: { value: 'Test Task' } });
        fireEvent.click(addButton);
    
        // Verify the toast message for duplicate task is displayed
        expect(screen.getByText('Task already exists')).toBeInTheDocument();
        expect(screen.getByText('Task already exists').classList.contains('toast-warning')).toBe(true);
    });
    test('switches to "All" tab when a new task is added', () => {
        render(<App />);
        
        // Switch to 'Completed' tab to start with
        const completedTab = screen.getByText(/completed/i);
        fireEvent.click(completedTab);
        expect(completedTab).toHaveClass('active'); // Updated to match the actual class
      
        // Add a task
        const input = screen.getByPlaceholderText(/Enter your task.../i);
        fireEvent.change(input, { target: { value: 'New Task' } });
        const addButton = screen.getByText(/add/i);
        fireEvent.click(addButton);
        
        // Expect the 'All' tab to be active
        const allTab = screen.getByText(/all/i);
        expect(allTab).toHaveClass('active'); // Updated to match the actual class
      });
});
