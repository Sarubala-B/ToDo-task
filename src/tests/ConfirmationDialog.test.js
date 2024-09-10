import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationDialog from '../components/ConfirmationDialog';
import TaskCheckbox from '../components/TaskCheckbox';

describe('ConfirmationDialog', () => {
  const message = 'Are you sure you want to delete this task?';
  const taskName = 'Test Task';
  const onConfirm = jest.fn(); //mocking that creates a fake function
  const onCancel = jest.fn();

  beforeEach(() => {   
    // eslint-disable-next-line testing-library/no-render-in-setup
    render( //render a react component into a virtual dom for testing
      <ConfirmationDialog
        message={message}
        taskName={taskName}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );
  });

  test('renders the confirmation dialog with the correct message and task name', () => {
    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText(`"Test Task"`)).toBeInTheDocument();
  });

  test('triggers the onConfirm callback when "Yes" button is clicked', () => {
    const yesButton = screen.getByText('Yes');
    fireEvent.click(yesButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('triggers the onCancel callback when "No" button is clicked', () => {
    const noButton = screen.getByText('No');
    fireEvent.click(noButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('applies the correct classes to the buttons', () => {
    const yesButton = screen.getByText('Yes');
    expect(yesButton).toHaveClass('yes-button');
    const noButton = screen.getByText('No');
    expect(noButton).toHaveClass('no-button');
  });
});
describe('TaskCheckbox', () => {
    const task = { name: 'Test Task', status: 'In-progress' };
    const onToggle = jest.fn();
  
    test('renders checkbox with correct initial status', () => {
      render(<TaskCheckbox task={task} onToggle={onToggle} />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
    test('calls onToggle callback and hides the dialog when "Yes" is clicked in the dialog', () => {
      render(<TaskCheckbox task={task} onToggle={onToggle} />);
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByText('Yes'));
      expect(onToggle).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Are you sure you want to mark the task as completed?')).not.toBeInTheDocument();
    });
  
    test('hides the dialog when "No" is clicked', () => {
      render(<TaskCheckbox task={task} onToggle={onToggle} />);
      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByText('No'));
      expect(screen.queryByText('Are you sure you want to mark the task as completed?')).not.toBeInTheDocument();
    });
  
    test('displays the correct message in the dialog when task status is "Completed"', () => {
      const completedTask = { ...task, status: 'Completed' };    
      render(<TaskCheckbox task={completedTask} onToggle={onToggle} />);
      fireEvent.click(screen.getByRole('checkbox'));
      expect(screen.getByText('Are you sure you want to revert the task to In-progress?')).toBeInTheDocument();
    });
  });