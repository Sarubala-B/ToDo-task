
import React, { useState } from 'react';
import ConfirmationDialog from './ConfirmationDialog';

function TaskCheckbox({ task, onToggle }) {
  const [showDialog, setShowDialog] = useState(false);

  const handleCheckboxChange = () => {
    setShowDialog(true);
  };

  const handleConfirm = () => {
    setShowDialog(false);
    onToggle();
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  return (
    <>
      <input
        type="checkbox"
        checked={task.status === 'Completed'}
        onChange={handleCheckboxChange}
      />
      {showDialog && (
        <ConfirmationDialog
          message={
            task.status === 'In-progress'
              ? 'Are you sure you want to mark the task as completed?'
              : 'Are you sure you want to revert the task to In-progress?'
          }
          taskName={task.name}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

export default TaskCheckbox;
