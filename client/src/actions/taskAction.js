import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
  updateTaskProgressRequest,
  updateTaskProgressSuccess,
  updateTaskProgressFailure,
} from '../redux/taskSlice';

const API_URL = import.meta.env.VITE_API_URL; // Your backend API URL

// Create Task
export const createTask = (taskData) => async (dispatch) => {
  try {
    dispatch(createTaskRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send token
      },
    };

    const response = await axios.post(`${API_URL}/api/v2/tasks/create-task`, taskData, config);

    if (response.status === 201) {
      dispatch(createTaskSuccess({ task: response.data.task }));
      toast.success(response.data.message);
    }
  } catch (err) {
    dispatch(createTaskFailure(err.response ? err.response.data.message : err.message));
    toast.error(err.response ? err.response.data.message : err.message);
    console.log(err.response ? err.response.data.message : err.message);
  }
};


// Fetch Tasks
export const fetchTasks = () => async (dispatch) => {
  try {
    dispatch(fetchTasksRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the token is in localStorage
      },
    };

    // Fetch the tasks from the API
    const response = await axios.get(`${API_URL}/api/v2/tasks/getAllTasks`, config);

    if (response.status === 200) {
      const { tasks } = response.data; // Destructuring to get tasks directly

      console.log('TODO tasks:', tasks.filter(task => task.progress === 'todo'));
      console.log('INPROGRESS tasks:', tasks.filter(task => task.progress === 'inprogress'));
      console.log('COMPLETE tasks:', tasks.filter(task => task.progress === 'complete'));
      dispatch(fetchTasksSuccess({ tasks }));
    }
  } catch (err) {
    const errorMessage = err.response ? err.response.data.message : err.message; // Extract the error message
    dispatch(fetchTasksFailure(errorMessage));
    toast.error(errorMessage); // Display error message in toast
  }
};

// Update Task
export const updateTask = (taskId, taskData) => async (dispatch) => {
  try {
    dispatch(updateTaskRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send token
      },
    };

    const response = await axios.put(`${API_URL}/api/v2/tasks/update-task/${taskId}`, taskData, config);

    if (response.status === 200) {
      dispatch(updateTaskSuccess({ task: response.data.task }));
      toast.success(response.data.message);
    }
  } catch (err) {
    dispatch(updateTaskFailure(err.response ? err.response.data.message : err.message));
    toast.error(err.response ? err.response.data.message : err.message);
  }
};

// Delete Task
export const deleteTask = (taskId) => async (dispatch) => {
  try {
    dispatch(deleteTaskRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send token
      },
    };

    const response = await axios.delete(`${API_URL}/api/v2/tasks/delete-task/${taskId}`, config);

    if (response.status === 200) {
      dispatch(deleteTaskSuccess({ taskId }));
      toast.success(response.data.message);
    }
  } catch (err) {
    dispatch(deleteTaskFailure(err.response ? err.response.data.message : err.message));
    toast.error(err.response ? err.response.data.message : err.message);
  }
};


export const updateTaskProgress = (taskId, progressData) => async (dispatch) => {
    try {
      dispatch(updateTaskProgressRequest());
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Send token
        },
      };
  
      const response = await axios.put(`${API_URL}/api/v2/tasks/progress-change/${taskId}/progress`, progressData, config);
  
      if (response.status === 200) {
        dispatch(updateTaskProgressSuccess({ task: response.data.task }));
        toast.success(response.data.message);
      }
    } catch (err) {
      dispatch(updateTaskProgressFailure(err.response ? err.response.data.message : err.message));
      toast.error(err.response ? err.response.data.message : err.message);
    }
  };