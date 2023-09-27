import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async function (id, { dispatch }) {
    try {
      const response = await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${id}`
      );
      if (!response.data || response.status < 200 || response.status >= 300) {
        throw new Error("Request failed with status code " + response.status);
      }
      dispatch(removeTodo({ id }));
    } catch (error) {
      throw error;
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async function (id, { dispatch, getState, rejectWithValue }) {
    const todo = getState().todosRed.todos.find((todo) => todo.id === id);

    try {
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${id}`,
        { completed: !todo.completed },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status !== 200) {
        throw new Error("Can't toggle status. Server error");
      }

      dispatch(toggleTodoComplete({ id }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async function () {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos?_limit=10"
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  async function (text, { rejectWithValue, dispatch }) {
    try {
      const todo = {
        title: text,
        userId: Math.random(),
        completed: false,
      };

      const response = await axios.post(
        "https://jsonplaceholder.typicode.com/todos",
        todo,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.data || response.status < 200 || response.status >= 300) {
        throw new Error("failed to add " + response.status);
      }

      const data = await response.data;
      dispatch(addTodo(data));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const setError = (state, action) => {
  console.log(action.error.message);
  state.status = "rejected";
  state.error = action.error.message;
};

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
    toggleTodoComplete(state, action) {
      const toggledTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggledTodo.completed = !toggledTodo.completed;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state, action) => {
      state.status = "loading";
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "resolved";
      state.todos = action.payload;
    },
    [fetchTodos.rejected]: setError,
    [deleteTodo.rejected]: setError,
    [toggleStatus.rejected]: setError,
  },
});

const { addTodo, removeTodo, toggleTodoComplete } = todoSlice.actions;
export default todoSlice.reducer;
