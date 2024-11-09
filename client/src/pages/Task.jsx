import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';  // Importing React Icons
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; 
import toast from 'react-hot-toast';

import "../css/Task.css";

const Task = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tasks, setTasks] = useState({});  // Store grouped tasks by progress
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // To handle task updates and views
  const [showModal, setShowModal] = useState(false); // To control modal visibility

  // Function to get the auth token from localStorage (or wherever you store it)
  const getAuthToken = () => {
    return localStorage.getItem('token');  // Adjust if you're storing the token elsewhere
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = getAuthToken();  // Retrieve the token
        const response = await axios.get('https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/getAllTasks', {
          headers: {
            Authorization: `Bearer ${token}`,  // Add the token to the request headers
          },
        });
        if (response.data.success) {
          setTasks(response.data.tasks);  // Grouped tasks by progress
        } else {
          setError('Failed to fetch tasks.');
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('No tasks found for this user.');
        } else {
          setError('Error fetching tasks: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleAddOrUpdateTask = async () => {
    if (title && content) {
      try {
        const token = getAuthToken();  // Retrieve the token for this request
        let response;

        if (selectedTask) {
          // Update existing task
          response = await axios.put(`https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/update-task/${selectedTask._id}`, 
            { title, content }, {
              headers: {
                Authorization: `Bearer ${token}`,  // Add the token to the request headers
              },
            });

            toast.success('Task updated successfully!');
        } else {
          // Add new task
          response = await axios.post('https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/create-task', 
            { title, content }, {
              headers: {
                Authorization: `Bearer ${token}`,  // Add the token to the request headers
              },
            });

            toast.success('Task added successfully!');
        }

        const newTask = response.data.task;  // Assuming the new task data is in `response.data.task`

        // Immediately update the state without re-fetching all tasks
        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          const status = selectedTask ? selectedTask.progress : 'todo';  // Update the existing task's column
          
          if (selectedTask) {
            // Replace the old task with the updated task
            updatedTasks[status] = updatedTasks[status].map(task =>
              task._id === selectedTask._id ? newTask : task
            );
          } else {
            // Add new task to the 'todo' column
            updatedTasks[status] = [...(updatedTasks[status] || []), newTask];
          }
          return updatedTasks;
        });

        // Clear the form inputs
        setTitle('');
        setContent('');
        setSelectedTask(null);  // Clear selected task after updating
      } catch (err) {
        setError('Error adding/updating task: ' + err.message);
        toast.error('Error adding/updating task: ' + err.message);
      }
    }
  };


  const handleDeleteTask = async (taskId) => {
    try {
      const token = getAuthToken();
      await axios.delete(`https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/delete-task/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Task deleted successfully')

      // Remove deleted task from the state
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        ['todo', 'inprogress', 'complete'].forEach((status) => {
          updatedTasks[status] = updatedTasks[status]?.filter(task => task._id !== taskId);
        });
        return updatedTasks;
      });
    } catch (err) {
      setError('Error deleting task: ' + err.message);
      toast.error('Error deleting task: ' + err.message);
      
    }
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setContent(task.content);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true); // Open modal when eye icon is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  const formatDate = (date) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Kolkata', // Ensures IST timezone
    };
    // Convert the date to a formatted string in IST (dd-mm-yyyy)
    const formattedDate = new Date(date).toLocaleDateString('en-IN', options);

    return formattedDate; // This will return date in dd-mm-yyyy format
  };

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
  
    // Check if the drop is outside any column or dropped in the same column
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }
  
    // Update task progress in state immediately
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const movedTask = updatedTasks[source.droppableId].find(task => task._id === draggableId);
  
      if (movedTask) {
        // Remove from source column
        updatedTasks[source.droppableId] = updatedTasks[source.droppableId].filter(task => task._id !== draggableId);
        // Update the task's progress locally
        movedTask.progress = destination.droppableId;
        // Add to destination column
        updatedTasks[destination.droppableId] = [...(updatedTasks[destination.droppableId] || []), movedTask];
      }
  
      return updatedTasks;
    });
  
    // Update task progress on the server asynchronously
    const updateTaskProgressInAPI = async () => {
      try {
        const token = getAuthToken();
        await axios.put(`https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/update-task/${draggableId}`, 
          { progress: destination.droppableId }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      } catch (err) {
        setError('Error updating task progress: ' + err.message);
        toast.error('Failed to update task on server');
      }
    };
  
    updateTaskProgressInAPI(); // Call the async function
  };
  

  return (
    <div className="task-page">
      <div className="add-task">
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddOrUpdateTask}>
          {selectedTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-columns">
          {loading ? (
            <div>Loading...</div>
          ) : (
            ['todo', 'inprogress', 'complete'].map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    className="task-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h2 style={{ color: 'black', fontSize: '20px' }}>{status.toUpperCase()}</h2>
                    {Array.isArray(tasks[status]) && tasks[status].length > 0 ? (
                      tasks[status].map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div
                              className="task-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <h3>{task.title}</h3>
                              <div className='btn-action'>
                              <button style={{border:'none'}} onClick={() => handleUpdateTask(task)}><FaEdit /></button>
                              <button style={{border:'none'}} onClick={() => handleDeleteTask(task._id)}><FaTrashAlt /></button>
                              <button style={{border:'none'}} onClick={() => handleViewTask(task)}><FaEye /></button></div>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p>No tasks</p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))
          )}
        </div>
      </DragDropContext>

      {showModal && selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <h2 className='model-title'>{selectedTask.title}</h2>
            <p className='model-content'>{selectedTask.content}</p>
            <p className='model-create'>Task Created: {formatDate(selectedTask.createdAt)}</p>
            <p className='model-update'>Task Updated: {formatDate(selectedTask.updatedAt)}</p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Task
