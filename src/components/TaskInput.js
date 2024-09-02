
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button'; 
import './TaskInput.css';

function TaskInput({ onAddTask,editMode, taskToEdit}) {
    const [task, setTask] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef(null);
    useEffect(() => {
        if (editMode && taskToEdit) {
            setTask(taskToEdit.name); 
            inputRef.current.focus();
            inputRef.current.setSelectionRange(taskToEdit.name.length, taskToEdit.name.length);
        }
    }, [editMode, taskToEdit]);
    const handleInputChange = (e) => {
        let value = e.target.value.trimStart();
        value = value.replace(/\s+/g, ' ');  
        const specialCharPattern = /[`,./<>?;':"{}[()!@#$%^&*~+=_-]/;
        if (specialCharPattern.test(value)) {
            setErrorMessage('*Special Characters are not Allowed*');
            setTask(value.replace(specialCharPattern, ''));
        } else {
            setErrorMessage('');
            setTask(value); 
        }
      };
    const handleAddTask = () => {
        const trimmedTask = task.trim().replace(/\s+/g, ' ');
        if (task.trim() === '') {
            onAddTask('', 'warning');
        } else if (!errorMessage) {
            onAddTask(trimmedTask, 'success');
            setTask('');
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        }
    };
    return (
        <div className="task-input-container">
            <div className="input-button-container">
            <input
                type="text"
                className="task-input"
                placeholder="Enter your task..."
                value={task}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                ref={inputRef}
            />    
            <Button 
                onClick={handleAddTask} 
                label={editMode ? "Save" : "Add"} 
                className="add-task-button" 
            />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
}

export default TaskInput;
