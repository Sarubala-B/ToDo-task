import React, { useState, useEffect, useRef} from 'react';
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
    const taskListRef = useRef(null);

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);
    
    useEffect(() => {
        if (taskListRef.current) {
            taskListRef.current.scrollTop = 0;
        }
    }, [tasks]);

    const handleEditTask = (task) => {
        setEditMode(true);
        setTaskToEdit(task);
    };
    const handleAddTask = (taskName, type = 'success') => {
        const normalizedTaskName = taskName.trim().toLowerCase();
        const isDuplicate = !editMode && tasks.some(task => task.name.trim().toLowerCase() === normalizedTaskName);
        if (taskName.trim() === '') {
            setToastMessage('Task cannot be empty');
            setToastType('warning');
            return;
        }
        if (editMode) {
            if (taskName === taskToEdit.name) {
                setToastMessage('No changes in the Task');
                setToastType('info');
            } else if (isDuplicate) {
                setToastMessage('Task already exists');
                setToastType('warning');
            } else {
                const updatedTasks = tasks.filter(task => task !== taskToEdit);
                const editedTask = { ...taskToEdit, name: taskName };
                updatedTasks.unshift(editedTask);
                setTasks(updatedTasks);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                setToastMessage('Task Updated Successfully');
                setToastType('success');
                // Switch to 'All' tab when a new task is added
                if (activeTab !== 'All') {
                    setActiveTab('All');
                }
            }
            setEditMode(false);
            setTaskToEdit(null);
        } else {
            if (isDuplicate) {
                setToastMessage('Task already exists');
                setToastType('warning');
            } else if (type === 'warning') {
                setToastMessage('Task cannot be empty');
                setToastType('warning');
            } else {
                const newTask = { name: taskName, status: 'In-progress' };
                const updatedTasks = [newTask, ...tasks];
                setTasks(updatedTasks);
                localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                setToastMessage('Task Added Successfully');
                setToastType('success');
                // Switch to 'All' tab when a new task is added
                if (activeTab !== 'All') {
                    setActiveTab('All');
                }
            }
        }
    }; 

    const handleToastClose = () => {
        setToastMessage(''); 
    };

    const handleToggleTaskStatus = (index) => {
        const updatedTasks = [...tasks];
        const task = updatedTasks[index];
        const oldStatus = task.status;
        const newStatus = oldStatus === 'In-progress' ? 'Completed' : 'In-progress';
        task.status = newStatus;
        
        updatedTasks.splice(index, 1);
        updatedTasks.unshift(task);
        setTasks(updatedTasks);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        setToastMessage(task.status === 'Completed' ? 'Task Marked as Completed' : 'Task Marked as In-Progress');
        setToastType('info'); // Set the type for status updates
        // Automatically switch tabs based on the new status
        if (activeTab === 'In-progress' && newStatus === 'Completed') {
            setActiveTab('Completed');
        } else if (activeTab === 'Completed' && newStatus === 'In-progress') {
            setActiveTab('In-progress');
        }
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
            // Reset edit mode and clear taskToEdit
            if (taskToDelete === taskToEdit) {
                setEditMode(false);
                setTaskToEdit(null);
            }
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
                    <div className="task-list" ref={taskListRef}>
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