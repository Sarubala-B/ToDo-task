
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TaskInput from '../components/TaskInput';
import Button from '../components/Button'; 

// Mock the Button component
jest.mock('../components/Button', () => ({ onClick, label, className }) => (
    <button onClick={onClick} className={className}>{label}</button>
));

describe('TaskInput Component', () => {
    test('renders the input field', () => {
        render(<TaskInput onAddTask={() => {}} />);
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        expect(inputElement).toBeInTheDocument();
    });

    test('renders the Add button', () => {
        render(<TaskInput onAddTask={() => {}} />);
        const addButton = screen.getByText(/Add/i);
        expect(addButton).toBeInTheDocument();
    });

    test('allows user to enter text in the input field', () => {
        render(<TaskInput onAddTask={() => {}} />);
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        
        fireEvent.change(inputElement, { target: { value: 'New Task' } });
        expect(inputElement.value).toBe('New Task');
    });

    test('calls onAddTask with input value when Add button is clicked', () => {
        const mockOnAddTask = jest.fn();
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        fireEvent.change(inputElement, { target: { value: 'New Task' } });
        
        const addButton = screen.getByText(/Add/i);
        fireEvent.click(addButton);
        
        expect(mockOnAddTask).toHaveBeenCalledWith('New Task');
        expect(inputElement.value).toBe('');
    });
    test('calls onAddTask with input value when Enter key is pressed', () => {
        const mockOnAddTask = jest.fn();
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        fireEvent.change(inputElement, { target: { value: 'New Task' } });
        
        fireEvent.keyPress(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
        
        expect(mockOnAddTask).toHaveBeenCalledWith('New Task');
        expect(inputElement.value).toBe('');
    });
    test('does not call onAddTask if input is empty or only spaces', () => {
        const mockOnAddTask = jest.fn();
        render(<TaskInput onAddTask={mockOnAddTask} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        
        fireEvent.change(inputElement, { target: { value: '   ' } });
        const addButton = screen.getByText(/Add/i);
        fireEvent.click(addButton);
        
        expect(mockOnAddTask).not.toHaveBeenCalled();
    });
});
describe('TaskInput Component - Edit Functionality', () => {
    test('populates input field with task name when in edit mode', () => {
        const taskToEdit = { name: 'Edit Task' };
        render(<TaskInput editMode={true} taskToEdit={taskToEdit} onAddTask={() => {}} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        expect(inputElement.value).toBe('Edit Task');
    });

    test('focuses on input field and moves cursor to the end of task name in edit mode', () => {
        const taskToEdit = { name: 'Edit Task' };
        render(<TaskInput editMode={true} taskToEdit={taskToEdit} onAddTask={() => {}} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        expect(inputElement.selectionStart).toBe(taskToEdit.name.length);
        expect(inputElement.selectionEnd).toBe(taskToEdit.name.length);
    });

    test('changes button label to "Save" when in edit mode', () => {
        const taskToEdit = { name: 'Edit Task' };
        render(<TaskInput editMode={true} taskToEdit={taskToEdit} onAddTask={() => {}} />);
        
        const saveButton = screen.getByText(/Save/i);
        expect(saveButton).toBeInTheDocument();
    });

    test('calls onAddTask with updated task name when Save button is clicked in edit mode', () => {
        const mockOnAddTask = jest.fn();
        const taskToEdit = { name: 'Edit Task' };
        
        render(<TaskInput editMode={true} taskToEdit={taskToEdit} onAddTask={mockOnAddTask} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        fireEvent.change(inputElement, { target: { value: 'Updated Task' } });
        
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);
        
        expect(mockOnAddTask).toHaveBeenCalledWith('Updated Task');
        expect(inputElement.value).toBe('');
    });
});
describe('Button Component', () => {
    test('renders the button with the correct label', () => {
        render(<Button label="Click Me" onClick={() => {}} />);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toBeInTheDocument();
    });

    test('applies the custom className correctly', () => {
        render(<Button label="Click Me" className="custom-class" onClick={() => {}} />);
        const buttonElement = screen.getByText(/Click Me/i);
        expect(buttonElement).toHaveClass('custom-class');
    });

    test('calls onClick handler when button is clicked', () => {
        const mockOnClick = jest.fn();
        render(<Button label="Click Me" onClick={mockOnClick} />);
        
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick if onClick is not provided', () => {
        const mockOnClick = jest.fn();
        render(<Button label="Click Me" />);
        
        const buttonElement = screen.getByText(/Click Me/i);
        fireEvent.click(buttonElement);
        
        expect(mockOnClick).not.toHaveBeenCalled();
    });
});
describe('Special Character Validation', () => {
    test('displays an error message when special characters are entered', () => {
        render(<TaskInput onAddTask={() => {}} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        
        fireEvent.change(inputElement, { target: { value: 'Task with @#$%' } });
        
        const errorMessage = screen.getByText('*Special Characters are not Allowed*');
        expect(errorMessage).toBeInTheDocument();
    });

    test('removes special characters from the input value', () => {
        render(<TaskInput onAddTask={() => {}} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        
        fireEvent.change(inputElement, { target: { value: 'Task with @#$%' } });
        
        expect(inputElement.value).toBe('Task with ');
    });

    test('does not display an error message when valid input is provided', () => {
        render(<TaskInput onAddTask={() => {}} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        
        fireEvent.change(inputElement, { target: { value: 'Valid Task' } });
        
        const errorMessage = screen.queryByText('*Special Characters are not Allowed*');
        expect(errorMessage).not.toBeInTheDocument();
    });

    test('clears the error message when the input is corrected', () => {
        render(<TaskInput onAddTask={() => {}} />);
        
        const inputElement = screen.getByPlaceholderText(/Enter your task.../i);
        
        fireEvent.change(inputElement, { target: { value: 'Task with @#$%' } });
        let errorMessage = screen.getByText('*Special Characters are not Allowed*');
        expect(errorMessage).toBeInTheDocument();
        
        fireEvent.change(inputElement, { target: { value: 'Corrected Task' } });
        errorMessage = screen.queryByText('*Special Characters are not Allowed*');
        expect(errorMessage).not.toBeInTheDocument();
    });
});
