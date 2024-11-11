import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaEye } from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

import "../css/Task.css";

const Task = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [sortOrder, setSortOrder] = useState("asc");

  const getAuthToken = () => {
    return localStorage.getItem("token");
  };

  const sortTasks = (tasksArray) => {
    if (sortOrder === "asc") {
      return tasksArray.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return tasksArray.sort((a, b) => b.title.localeCompare(a.title));
    }
  };

  // Handle searching
  const searchTasks = (tasksArray) => {
    return tasksArray.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Add or update task logic remains unchanged

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // hook to fetch the tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = getAuthToken(); // Retrieve the token
        const response = await axios.get(
          "https://voosh-task-manager-wiej.onrender.com/api/v2/tasks/getAllTasks",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setTasks(response.data.tasks);
        } else {
          setError("Failed to fetch tasks.");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError("No tasks found for this user.");
        } else {
          setError("Error fetching tasks: " + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // function to add the task and update the task
  const handleAddOrUpdateTask = async () => {
    if (title && content) {
      try {
        const token = getAuthToken();
        let response;

        if (selectedTask) {
          // Update existing task
          response = await axios.put(
            `https://voosh-task-manager-wiej.onrender.com/api/v2/tasks/update-task/${selectedTask._id}`,
            { title, content },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          toast.success("Task updated successfully!");
        } else {
          // Add new task
          response = await axios.post(
            "https://voosh-task-manager-wiej.onrender.com/api/v2/tasks/create-task",
            { title, content },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          toast.success("Task added successfully!");
        }

        const newTask = response.data.task;

        setTasks((prevTasks) => {
          const updatedTasks = { ...prevTasks };
          const status = selectedTask ? selectedTask.progress : "todo";

          if (selectedTask) {
            updatedTasks[status] = updatedTasks[status].map((task) =>
              task._id === selectedTask._id ? newTask : task
            );
          } else {
            updatedTasks[status] = [...(updatedTasks[status] || []), newTask];
          }
          return updatedTasks;
        });

        setTitle("");
        setContent("");
        setSelectedTask(null);
      } catch (err) {
        setError("Error adding/updating task: " + err.message);
        toast.error("Error adding/updating task: " + err.message);
      }
    }
  };

  // function to delete tasks
  const handleDeleteTask = async (taskId) => {
    try {
      const token = getAuthToken();
      await axios.delete(
        `https://voosh-task-manager-wiej.onrender.com/api/v2/tasks/delete-task/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Task deleted successfully");

      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        ["todo", "inprogress", "complete"].forEach((status) => {
          updatedTasks[status] = updatedTasks[status]?.filter(
            (task) => task._id !== taskId
          );
        });
        return updatedTasks;
      });
    } catch (err) {
      setError("Error deleting task: " + err.message);
      toast.error("Error deleting task: " + err.message);
    }
  };

  const handleUpdateTask = (task) => {
    setSelectedTask(task);
    setTitle(task.title);
    setContent(task.content);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const formatDate = (date) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    };
    const formattedDate = new Date(date).toLocaleDateString("en-IN", options);

    return formattedDate;
  };

  // update the progress with progress api and some stuff related drag drop functionality
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      const movedTask = updatedTasks[source.droppableId].find(
        (task) => task._id === draggableId
      );

      if (movedTask) {
        updatedTasks[source.droppableId] = updatedTasks[
          source.droppableId
        ].filter((task) => task._id !== draggableId);
        movedTask.progress = destination.droppableId;
        updatedTasks[destination.droppableId] = [
          ...(updatedTasks[destination.droppableId] || []),
          movedTask,
        ];
      }

      return updatedTasks;
    });

    // after updating the task locally updated in server
    const updateTaskProgressInAPI = async () => {
      try {
        const token = getAuthToken();
        await axios.put(
          `https://voosh-task-manager-wiej.onrender.com/api/v2/tasks/update-task/${draggableId}`,
          { progress: destination.droppableId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        setError("Error updating task progress: " + err.message);
        toast.error("Failed to update task on server");
      }
    };

    updateTaskProgressInAPI();
  };

  return (
    <div className="task-page">
      <div className="search-sort">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <button onClick={handleSortChange}>
          Sort by Title ({sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
      </div>

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
          {selectedTask ? "Update Task" : "Add Task"}
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-columns">
          {loading ? (
            <div>Loading...</div>
          ) : (
            ["todo", "inprogress", "complete"].map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    className="task-column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h2 style={{ color: "black", fontSize: "20px" }}>
                      {status.toUpperCase()}
                    </h2>
                    {Array.isArray(tasks[status]) &&
                    tasks[status].length > 0 ? (
                      searchTasks(sortTasks(tasks[status])).map(
                        (task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="task-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <h3>{task.title}</h3>
                                <div className="btn-action">
                                  <button
                                    style={{ border: "none" }}
                                    onClick={() => handleUpdateTask(task)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    style={{ border: "none" }}
                                    onClick={() => handleDeleteTask(task._id)}
                                  >
                                    <FaTrashAlt />
                                  </button>
                                  <button
                                    style={{ border: "none" }}
                                    onClick={() => handleViewTask(task)}
                                  >
                                    <FaEye />
                                  </button>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        )
                      )
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
            <h2 className="model-title">{selectedTask.title}</h2>
            <p className="model-content">{selectedTask.content}</p>
            <p className="model-create">
              Task Created: {formatDate(selectedTask.createdAt)}
            </p>
            <p className="model-update">
              Task Updated: {formatDate(selectedTask.updatedAt)}
            </p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Task;
