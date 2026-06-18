import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authHeader = () => {
  const token = localStorage.getItem('access');
  return { headers: { Authorization: `Bearer ${token}` } };
};

export const fetchReceipts = createAsyncThunk('receipts/fetchReceipts', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/receipts/`, authHeader());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchDashboard = createAsyncThunk('receipts/fetchDashboard', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard/`, authHeader());
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

const receiptsSlice = createSlice({
  name: 'receipts',
  initialState: {
    items: [],
    dashboard: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipts.pending, (state) => { state.isLoading = true; })
      .addCase(fetchReceipts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      });
  },
});

export default receiptsSlice.reducer;
