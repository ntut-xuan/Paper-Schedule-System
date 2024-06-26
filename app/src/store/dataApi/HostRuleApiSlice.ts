import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HostRulePayloadType, HostRulePayloadWithIdType } from "../../type/host/HostRuleType";
import { RootState } from "../store";
import { HostRuleService } from "./WebService/HostRuleService";

export const hostRuleApiSlice = createSlice({
    name: "hostRuleApiSlice",
    initialState: {},
    reducers: {}
})

export const addHostRule = createAsyncThunk(
    'hostRuleApi/addHostRule',
    async (payload: HostRulePayloadType, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HostRuleService(token);
            const res = await service.addHostRule(payload)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`hostRuleApi/addHostRule: ${err}`)
            })
        }
    }
)

export const getHostRules = createAsyncThunk(
    'hostRuleApi/getHostRules',
    async (_, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HostRuleService(token);
            const res = await service.getHostRules()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`hostRuleApi/getHostRules: ${err}`)
            })
        }
    }
)

export const getHostRule = createAsyncThunk(
    'hostRuleApi/getHostRules',
    async (hostRule: number, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HostRuleService(token);
            const res = await service.getHostRule(hostRule)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`hostRuleApi/getHostRules: ${err}`)
            })
        }
    }
)

export const getHostRuleUserCount = createAsyncThunk(
    'hostRuleApi/getHostRules',
    async (hostRuleId: number, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HostRuleService(token);
            const res = await service.getHostRuleUserCount(hostRuleId)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`hostRuleApi/getHostRules: ${err}`)
            })
        }
    }
)

export const removeHostRule = createAsyncThunk(
    'hostRuleApi/removeHostRule',
    async (hostRuleId: number, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HostRuleService(token);
            const res = await service.removeHostRule(hostRuleId)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`hostRuleApi/getHostRules: ${err}`)
            })
        }
    }
)

export const editHostRule = createAsyncThunk(
    'hostRuleApi/addHostRule',
    async (payload: HostRulePayloadWithIdType, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HostRuleService(token);
            const res = await service.editHostRule(payload)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`hostRuleApi/addHostRule: ${err}`)
            })
        }
    }
)
