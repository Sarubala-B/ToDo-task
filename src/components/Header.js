import React, { useState, useEffect } from 'react';
import './Header.css';
import TaskInput from './TaskInput';
import Tabs from './Tabs';
import Button from './Button';
import TaskCheckbox from './TaskCheckbox';
import ConfirmationDialog from './ConfirmationDialog';
import Toast from './Toast';

function App() {
    const [tasks, setTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [editMode, setEditMode] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    const handleAddTask = (taskName, type = 'success') => {
        const normalizedTaskName = taskName.trim().toLowerCase();
        // Check for duplicate task
        const isDuplicate = tasks.some(task => task.name.trim().toLowerCase() === normalizedTaskName);

        if (isDuplicate) {
            setToastMessage('Task already exists');
            setToastType('warning');
            return; // Prevent adding the task
        }
        if (type === 'warning') {
            setToastMessage('Task cannot be empty');
            setToastType('warning');
            return;
        }
        if (editMode) {
            if (taskName === taskToEdit.name) {
                setToastMessage('No changes in the Task');
                setToastType('info'); 
            } else {
                const updatedTasks = tasks.map(task =>
                    task === taskToEdit ? { ...task, name: taskName } : task
                );
                setTasks(updatedTasks);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                setToastMessage('Task Updated Successfully');
                setToastType('success');
            }
            setEditMode(false); 
            setTaskToEdit(null);  
        } else {
        const newTask = { name: taskName, status: 'In-progress' };
        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setToastMessage('Task Added Successfully');
        setToastType('success');
        }
    };

    const handleToastClose = () => {
        setToastMessage(''); 
    };

    const handleEditTask = (task) => {
        setEditMode(true);
        setTaskToEdit(task);
    };

    const handleToggleTaskStatus = (index) => {
        const updatedTasks = [...tasks];
        const task = updatedTasks[index];

        task.status = task.status === 'In-progress' ? 'Completed' : 'In-progress';
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setToastMessage(task.status === 'Completed' ? 'Task Marked as Completed' : 'Task Marked as In-Progress');
        setToastType('info'); // Set the type for status updates
    };

    const handleDeleteTask = (taskToDelete) => {
        const updatedTasks = tasks.filter(task => task !== taskToDelete);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setToastMessage('Task Deleted Successfully');
        setToastType('error');
        setTaskToDelete(null);
    };
  
    const handleOpenDeleteDialog = (task) => {
        setTaskToDelete(task);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            handleDeleteTask(taskToDelete);
        }
    };
  
    const taskCounts = {
        all: tasks.length,
        inProgress: tasks.filter(task => task.status === 'In-progress').length,
        completed: tasks.filter(task => task.status === 'Completed').length
    };

    const filteredTasks = tasks.filter(task => {
        if (activeTab === 'All') return true;
        if (activeTab === 'In-progress') return task.status === 'In-progress';
        if (activeTab === 'Completed') return task.status === 'Completed';
        return false;
    });

    return (
        <div className="MainContent">
            <div className="App">
                <header className="App-header">
                    <h1>Todo List</h1>
                </header>	  
                <TaskInput 
                onAddTask={handleAddTask} 
                editMode={editMode} 
                taskToEdit={taskToEdit} 
                />
                <Tabs 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                taskCounts={taskCounts}
                />
                <Toast message={toastMessage} type={toastType} onClose={handleToastClose} />
                <div className="task-list-header">
                    <h2 className="task-list-heading">List of Tasks</h2>
                    <h2 className="task-actions-heading">Actions</h2>
                </div>
            
                {filteredTasks.length === 0 ? (
                    <p className="no-tasks-message">No Tasks Available</p>
                    ) : (
                    <div className="task-list">
                    {filteredTasks.map((task) => {
                    const originalIndex = tasks.indexOf(task);
                    return (
                        <div key={originalIndex} className="task-container">
                            <div className="task-content">
                                <TaskCheckbox
                                    task={task}
                                    onToggle={() => handleToggleTaskStatus(originalIndex)}
                                    onDelete={handleOpenDeleteDialog}
                                />
                                <p className="task-name">{task.name}</p>
                                <div className="task-actions">
                                <Button label="Edit" className="edit-button" onClick={() => handleEditTask(task)}  />
                                <Button label="Delete" className="delete-button" onClick={() => handleOpenDeleteDialog(task)} />
                                </div>
                            </div>
                        </div>
                    );
                    })}
                    </div>         
                )}
                {taskToDelete && (
                    <ConfirmationDialog
                    message={`Are you sure you want to delete this task?`}
                    taskName={taskToDelete.name}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setTaskToDelete(null)}
                    />
                )}
            </div>
        </div>
    );
}

export default App;
