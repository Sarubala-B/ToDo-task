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
            inputRef.current.focus(); //set the focus for typing for placing the cursor
            inputRef.current.setSelectionRange(taskToEdit.name.length, taskToEdit.name.length);
        } else {
            // Reset input field and button when not in edit mode
            setTask('');
            setErrorMessage('');
        }
    }, [editMode, taskToEdit]);
    const handleInputChange = (e) => { //input field's onchange event
        let value = e.target.value.trimStart();
        value = value.replace(/\s+/g, ' ');  //replaces many whitespace to single space
        const specialCharPattern = /[.,/<>?;':"{}[\]()!@#$%^&*~+=_-]/g;
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
        if (trimmedTask === '') {
            onAddTask('', 'warning');
        } else {
            onAddTask(trimmedTask, 'success');
            setTask('');
            setErrorMessage(''); // Clear the error message after adding the task
        }
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddTask();
        } else {
            // This else statement is added for coverage purposes only.
            console.log(`Unhandled key press: ${e.key}`);
        }
    };
    return (
        <div className="task-input-container">
            <div className="input-button-container">
                <input
                type="text"
                className="task-input"
                placeholder="Enter the task"
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
    ); //checks for the truthness of errorMessage and then p tag will render
}

export default TaskInput;