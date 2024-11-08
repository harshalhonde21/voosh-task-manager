import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
  task: null,
  loading: false,
  error: null,
  success: false,
};

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    // Create Task actions
    createTaskRequest(state) {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    createTaskSuccess(state, action) {
  state.loading = false;
  if (Array.isArray(state.tasks)) {
    state.tasks.push(action.payload.task);
  } else {
    state.tasks = [action.payload.task]; // Reinitialize as an array if needed
  }
  state.success = true;
}
,
    createTaskFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },

    // Fetch All Tasks actions
    fetchTasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action) {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch Task by ID actions
    fetchTaskByIdRequest(state) {
      state.loading = true;
      state.error = null;
      state.task = null;
    },
    fetchTaskByIdSuccess(state, action) {
      state.loading = false;
      state.task = action.payload;
    },
    fetchTaskByIdFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.task = null;
    },

    // Update Task actions
    updateTaskRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateTaskSuccess(state, action) {
      state.loading = false;
      const index = state.tasks.findIndex((task) => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    updateTaskFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete Task actions
    deleteTaskRequest(state) {
      state.loading = true;
      state.error = null;
    },
    deleteTaskSuccess(state, action) {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    },
    deleteTaskFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // Change Progress actions
    updateTaskProgressRequest(state) {
      state.loading = true;
      state.error = null;
    },
    updateTaskProgressSuccess(state, action) {
      state.loading = false;
      const index = state.tasks.findIndex((task) => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index].progress = action.payload.progress;
      }
    },
    updateTaskProgressFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  fetchTaskByIdRequest,
  fetchTaskByIdSuccess,
  fetchTaskByIdFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
  updateTaskProgressRequest,
  updateTaskProgressSuccess,
  updateTaskProgressFailure,
} = taskSlice.actions;

// Export reducer
export default taskSlice.reducer;
