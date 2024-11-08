import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrashAlt, FaEdit, FaEye } from 'react-icons/fa';  // Importing React Icons
import "../css/Task.css";
import interact from 'interactjs';

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
        } else {
          // Add new task
          response = await axios.post('https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/create-task', 
            { title, content }, {
              headers: {
                Authorization: `Bearer ${token}`,  // Add the token to the request headers
              },
            });
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
      }
    }
  };


  const [draggedTask, setDraggedTask] = useState(null);


  useEffect(() => {
    // Fetch tasks on initial render
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/getAllTasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data.tasks);
      } catch (err) {
        setError('Error fetching tasks: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Initialize interact.js for draggable elements
    interact('.task')
      .draggable({
        listeners: {
          start(event) {
            const taskElement = event.target;
            const taskId = taskElement.dataset.taskId;
            setDraggedTask(taskId);
            taskElement.style.opacity = '0.5';
          },
          move(event) {
            event.target.style.transform = `translate(${event.dx}px, ${event.dy}px)`;
          },
          end(event) {
            event.target.style.opacity = '1';
            event.target.style.transform = 'none';
            setDraggedTask(null);
          },
        },
        inertia: true, // Adds a bit of momentum at the end of drag
      });

    // Initialize interact.js for drop zones
    interact('.task-column').dropzone({
      ondragenter(event) {
        event.target.classList.add('drag-over');
      },
      ondragleave(event) {
        event.target.classList.remove('drag-over');
      },
      ondrop(event) {
        const newProgress = event.target.dataset.progress;
        handleDrop(draggedTask, newProgress);
        event.target.classList.remove('drag-over');
      },
    });
  }, [draggedTask]);




  const handleDragStart = (e, task) => {
    e.target.classList.add('dragging');
    e.dataTransfer.setData('taskId', task._id);
    
    // For touch devices
    if (e.type === 'touchstart') {
        e.currentTarget.style.opacity = '0.5';
        // Prevent default to avoid issues with touch
        e.preventDefault();
    }
};

const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    
    // Reset opacity for touch devices
    if (e.type === 'touchend') {
        e.currentTarget.style.opacity = '1';
    }
};

const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default to allow drop
    const column = e.target.closest('.task-column');
    if (column) {
        column.classList.add('drag-over'); 
    }
};

const handleDrop = async (e, newProgress) => {
    e.preventDefault();
    const column = e.target.closest('.task-column');
    if (column) {
        column.classList.remove('drag-over'); // Remove drop area highlight
    }

    const taskId = e.dataTransfer.getData('taskId') || e.target.dataset.taskId; // Handle touch data retrieval
    if (taskId) {
        try {
            const token = getAuthToken();  // Retrieve the token for this request
            await axios.put(`https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/progress-change/${taskId}/progress`, { progress: newProgress }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Re-fetch tasks after updating
            const response = await axios.get('https://voosh-task-manager-f6en.onrender.com/api/v2/tasks/getAllTasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTasks(response.data.tasks);
        } catch (err) {
            setError('Error updating task: ' + err.message);
        }
    }
};

const handleDragLeave = (e) => {
    const column = e.target.closest('.task-column');
    if (column) {
        column.classList.remove('drag-over'); // Remove drop area highlight when drag leaves
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

      <div className="task-columns">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div
              className="task-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'todo')}
              onDragLeave={handleDragLeave}
            >
              <h2 style={{color:'black', fontSize:'20px'}}>TODO</h2>
              {Array.isArray(tasks.todo) && tasks.todo.length > 0 ? (
                tasks.todo.map((task) => (
                  <div
                    key={task._id}
                    className="task-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd} 
                  >
                    {task.title}
                    <div className="task-actions">
                      <FaEye onClick={() => handleViewTask(task)} />
                      <FaEdit onClick={() => handleUpdateTask(task)} />
                      <FaTrashAlt onClick={() => handleDeleteTask(task._id)} />
                    </div>
                  </div>
                ))
              ) : (
                <div>No tasks found for this column</div>
              )}
            </div>

            <div
              className="task-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'inprogress')}
              onDragLeave={handleDragLeave}
            >
              <h2 style={{color:'black', fontSize:'20px'}}>IN PROGRESS</h2>
              {Array.isArray(tasks.inprogress) && tasks.inprogress.length > 0 ? (
                tasks.inprogress.map((task) => (
                  <div
                    key={task._id}
                    className="task-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    {task.title}
                    <div className="task-actions">
                      <FaEye onClick={() => handleViewTask(task)} />
                      <FaEdit onClick={() => handleUpdateTask(task)} />
                      <FaTrashAlt onClick={() => handleDeleteTask(task._id)} />
                    </div>
                  </div>
                ))
              ) : (
                <div>No tasks found for this column</div>
              )}
            </div>

            <div
              className="task-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'complete')}
              onDragLeave={handleDragLeave} 
            >
              <h2 style={{color:'black', fontSize:'20px'}}>COMPLETE</h2>
              {Array.isArray(tasks.complete) && tasks.complete.length > 0 ? (
                tasks.complete.map((task) => (
                  <div
                    key={task._id}
                    className="task-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd} 
                  >
                    {task.title}
                    <div className="task-actions">
                      <FaEye onClick={() => handleViewTask(task)} />
                      <FaEdit onClick={() => handleUpdateTask(task)} />
                      <FaTrashAlt onClick={() => handleDeleteTask(task._id)} />
                    </div>
                  </div>
                ))
              ) : (
                <div>No tasks found for this column</div>
              )}
            </div>
          </>
        )}
      </div>



      {/* Modal for task details */}
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

export default Task;
