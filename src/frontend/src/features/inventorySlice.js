import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } });

export const fetchInventory = createAsyncThunk('inventory/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/inventory/`, authHeader());
    return data;
  } catch (error) { return rejectWithValue(error.response.data); }
});

export const fetchDashboard = createAsyncThunk('inventory/fetchDashboard', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`${API_URL}/dashboard/`, authHeader());
    return data;
  } catch (error) { return rejectWithValue(error.response.data); }
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: { items: [], dashboard: null, isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.isLoading = true; })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchDashboard.pending, (state) => { state.isLoading = true; })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboard = action.payload;
      });
  },
});

export default inventorySlice.reducer;
