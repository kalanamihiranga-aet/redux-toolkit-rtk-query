import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from "axios";

const BASE_URL = 'https://registry.npmjs.org/-/v1';

export enum RepositoryStatus {
    IDLE = 'idle',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error',
}

export interface RepositoryObject {
    objects: RepositoryObjectDetail;
}

export interface RepositoryObjectDetail {
    package: RepositoryObjectPackage;
    score: Object;
    searchScore: number;
}

export interface RepositoryObjectPackage {
    name: String;
    scope: string;
    version: string;
    description: string;
}

export interface RepositoriesState {
    repositories: RepositoryObjectDetail[];
    status: RepositoryStatus.IDLE | RepositoryStatus.PENDING | RepositoryStatus.SUCCESS | RepositoryStatus.ERROR;
    error: any
}

const initialState: RepositoriesState = {
    repositories: [],
    status: RepositoryStatus.IDLE,
    error: null
};

export const fetchRepositories = createAsyncThunk('repositories/fetchRepositories', async (term: string) => {
    const response = await axios.get(BASE_URL + `/search?text=${term}`);
    return response.data.objects;
});

export const repositoriesSlice = createSlice({
    name: 'repositories',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchRepositories.pending, (state) => {
            state.status = RepositoryStatus.PENDING;
        }).addCase(fetchRepositories.fulfilled, (state: RepositoriesState, action: PayloadAction<RepositoryObjectDetail[]>) => {
            state.status = RepositoryStatus.SUCCESS;
            state.repositories = action.payload;
        }).addCase(fetchRepositories.rejected, (state, action) => {
            state.status = RepositoryStatus.ERROR;
            state.error = action.error.message;
        });
    }
});

export const selectAllRepositories = (state: RepositoriesState) => state.repositories;
export const getRepositoryState = (state: RepositoriesState) => state.status;
export const getRepositoryError = (state: RepositoriesState) => state.error;
export default repositoriesSlice.reducer;