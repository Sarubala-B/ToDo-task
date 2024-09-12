import React from 'react';
import { render, screen, fireEvent,act,waitFor} from '@testing-library/react';
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
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
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
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        expect(inputElement).toBeInTheDocument();
    });

    test('adds a task when Add button is clicked', () => {
        render(<App />);
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        fireEvent.change(inputElement, { target: { value: 'New Task' } });
        const addButtonElement = screen.getByText(/Add/i);
        fireEvent.click(addButtonElement);

        expect(inputElement.value).toBe('');
    });
    test('adds a task and it appears in the task list', () => {
        render(<App />);
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
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
    test('toggles task status from In-progress to Completed, updates localStorage, and switches to Completed tab', () => {
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText('Enter the task'), { target: { value: 'Test Task' } });
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
            expect(screen.getByText('Completed (1)').classList.contains('active')).toBe(true);
        }, 100);
    });
  
    test('toggles task status from Completed to In-progress, updates localStorage, and switches to In-progress tab', () => {
        render(<App />);
        fireEvent.change(screen.getByPlaceholderText('Enter the task'), { target: { value: 'Test Task' } });
        fireEvent.click(screen.getByText('Add'));
  
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox); // Mark as completed
        fireEvent.click(screen.getByText('Yes'));
        expect(checkbox).toBeChecked();
  
        fireEvent.click(checkbox); // Revert to In-progress
        expect(screen.getByText('Are you sure you want to revert the task to In-progress?')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Yes'));
        expect(checkbox).not.toBeChecked();
  
        setTimeout(() => {
            const storedTasks = localStorage.getItem('tasks');
            expect(storedTasks).not.toBeNull();
            if (storedTasks) {
                const tasks = JSON.parse(storedTasks);
                // eslint-disable-next-line jest/no-conditional-expect
                expect(tasks[0].status).toBe('In-progress');
            }
            expect(screen.getByText('In-progress (1)').classList.contains('active')).toBe(true);
        }, 100);
    }); 
});

describe('Edit Task Functionality', () => {

    test('enters edit mode when Edit button is clicked', () => {
        const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
        fireEvent.click(screen.getByText('Edit'));
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        expect(inputElement.value).toBe('Task to Edit');
        expect(screen.getByText(/Save/i)).toBeInTheDocument();
    });
  
    test('saves the edited task and exits edit mode', () => {
        const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
        fireEvent.click(screen.getByText('Edit'));
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
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
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        fireEvent.change(inputElement, { target: { value: 'Updated Task Name' } });
        fireEvent.click(screen.getByText(/Save/i));
        expect(localStorage.setItem).toHaveBeenCalledWith(
            'tasks',
            JSON.stringify([{ name: 'Updated Task Name', status: 'In-progress' }])
        );
    });

    test('displays warning toast when trying to save a duplicate task', () => {
        const mockTasks = [
            { name: 'Existing Task', status: 'In-progress' },
            { name: 'Task to Edit', status: 'In-progress' }
        ];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);     
        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[1]);    
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        fireEvent.change(inputElement, { target: { value: 'Existing Task' } });
        fireEvent.click(screen.getByText(/Save/i));
        const toastElement = screen.getByText('Task already exists');
        expect(toastElement).toBeInTheDocument();
        expect(toastElement).toHaveClass('toast-warning');
    });
    test('switches to "All" tab after saving the edited task', async () => {
        const mockTasks = [
            { name: 'Task to Edit', status: 'In-progress' },
            { name: 'Another Task', status: 'Completed' }
        ];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
        await screen.findByText(/All/i);
        fireEvent.click(await screen.findByText(/Completed/i));
        const editButtons = screen.getAllByText(/Edit/i);
        fireEvent.click(editButtons[0]);
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        fireEvent.change(inputElement, { target: { value: 'Updated Task Name' } });
        fireEvent.click(screen.getByText(/Save/i));
        await waitFor(() => expect(screen.getByText(/All/i)).toHaveClass('active'));
        expect(screen.getByText('Updated Task Name')).toBeInTheDocument();
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
    test('sets editMode to false and taskToEdit to null if the taskToDelete is the same as taskToEdit', () => {
        const mockTasks = [{ name: 'Task 1', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));       
        render(<App />);
        fireEvent.click(screen.getByText(/Edit/i));
        expect(screen.getByDisplayValue('Task 1')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/Delete/i));
        fireEvent.click(screen.getByText(/Yes/i));
        expect(screen.queryByDisplayValue('Task 1')).not.toBeInTheDocument();
        expect(screen.queryByText(/No changes in the Task/i)).not.toBeInTheDocument(); 
    });
    
});

describe('Add function', () => {
    test('displays info toast when editing a task with no changes', () => {
        const mockTasks = [{ name: 'Task to Edit', status: 'In-progress' }];
        localStorage.getItem.mockReturnValue(JSON.stringify(mockTasks));
        render(<App />);
        fireEvent.click(screen.getByText('Edit'));
        const inputElement = screen.getByPlaceholderText(/Enter the task/i);
        fireEvent.change(inputElement, { target: { value: 'Task to Edit' } });
        fireEvent.click(screen.getByText(/Save/i));
        expect(screen.getByText('No changes in the Task')).toBeInTheDocument();
        expect(screen.getByText('No changes in the Task').classList.contains('toast-info')).toBe(true);
    });

    test('shows toast message for duplicate task', () => {
        render(<App />);
        const taskInput = screen.getByPlaceholderText('Enter the task');
        const addButton = screen.getByText('Add'); 
        fireEvent.change(taskInput, { target: { value: 'Test Task' } });
        fireEvent.click(addButton);
        fireEvent.change(taskInput, { target: { value: 'Test Task' } });
        fireEvent.click(addButton);
        expect(screen.getByText('Task already exists')).toBeInTheDocument();
        expect(screen.getByText('Task already exists').classList.contains('toast-warning')).toBe(true);
    });

    test('switches to "All" tab when a new task is added', () => {
        render(<App />);
        const completedTab = screen.getByText(/completed/i);
        fireEvent.click(completedTab);
        expect(completedTab).toHaveClass('active');
        const input = screen.getByPlaceholderText(/Enter the task/i);
        fireEvent.change(input, { target: { value: 'New Task' } });
        const addButton = screen.getByText(/add/i);
        fireEvent.click(addButton);
        const allTab = screen.getByText(/all/i);
        expect(allTab).toHaveClass('active');
    });
    test('displays warning toast when trying to add an empty task', () => {
        render(<App />);
        const taskInput = screen.getByPlaceholderText('Enter the task'); 
        const addButton = screen.getByText('Add');
        fireEvent.change(taskInput, { target: { value: '   ' } });
        fireEvent.click(addButton);
        expect(screen.getByText('Task cannot be empty')).toBeInTheDocument();
        expect(screen.getByText('Task cannot be empty').classList.contains('toast-warning')).toBe(true);
    });    
});

describe('handleToastClose function', () => {
    it('should clear the toast message after 3000 milliseconds', () => {
        jest.useFakeTimers();
        render(<App />);
        const input = screen.getByPlaceholderText(/Enter the task/i);
        const addButton = screen.getByText(/add/i);     
        fireEvent.change(input, { target: { value: 'Test Task' } });
        fireEvent.click(addButton);
        expect(screen.getByText('Task Added Successfully')).toBeInTheDocument();
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(screen.queryByText('Task Added Successfully')).not.toBeInTheDocument();
    });
});