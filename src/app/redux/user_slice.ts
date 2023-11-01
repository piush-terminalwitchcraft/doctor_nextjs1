// "use client"

import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "../utils/constant";
import { Certificate, Convert, Doctor } from "../utils/doctorModel";
import { Admin } from "../utils/adminModel";
import { User } from "../utils/userModel";

interface LoginParams {
    mobileNo: string;
    countryCode: string;
}

interface UserState {
    user: User,
    loading: boolean,
    error: string | null,
    success: boolean | null,
    message: string | null,
}

interface setAdminPayload {
    user: User
}


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: {},
        loading: false,
        error: null,
        success: null,
        message: null,
    } as UserState,

    reducers: {

        //  Set doctor details
        setUser: (state, action: PayloadAction<setAdminPayload>) => {
            const { user } = action.payload;
            state.user = user;
            console.log(current(state));
        },

        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(userLogin.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            state.user = action.payload.data as User;
        });
        builder.addCase(userLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(updateUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(updateUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            state.user = action.payload.data as User;
        });
        builder.addCase(updateUser.rejected, (state, action) => {
            console.log(action)
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });

    },
});

// api calls / signup 
export const userLogin = createAsyncThunk<any, any, {state: any}>(
    'user/login',
    async (payload, thunkAPI) => {
        try {
            const { mobileNo, countryCode } = payload;

            thunkAPI.dispatch(setLoading(true));

            // Define the request headers
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
            };

            const data = {
                mobileNo,
                countryCode,
            };
            const response = await axios.post(`${BASE_URL}/user/login`, data, { headers });

            // thunkAPI.dispatch(setUser(response.data as User));
            return response.data;
        } catch (error: any) {

            // Dispatch the setError action to handle errors
            thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));

            return thunkAPI.rejectWithValue(error.response.data);
        } finally {
            // Dispatch the setLoading action to indicate that the request has completed
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

// patch update user 

export const updateUser = createAsyncThunk<any, any, {state: any}>(
    'user/updateUser',
    async (payload, thunkAPI) => {
        try {
            const { user } = payload;
            const token = thunkAPI.getState().user.user.token;
            console.log('Token ', token)
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ${token}`,
            };
            const response = await axios.patch(`${BASE_URL}/user`, payload, { headers });
            // thunkAPI.dispatch(setUser(response.data as User));
            console.log('Here bro ', response)
            return response.data;
        } catch (error: any) {
            console.log(payload); 
            console.log('Error hai ', error)
            // thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
            return thunkAPI.rejectWithValue(error.response.data);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

// /user/upload  
export const uploadPhoto = createAsyncThunk<any, {file: File}, {state: any}>(
    'user/uploadPhoto',
    async (payload, thunkAPI) => {
        const token = thunkAPI.getState().user.user.data.token;
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': `Bearer ${token}`,
        };
        const body = new FormData();
        body.append('photo', payload.file);
        try {
            const response = await axios.post(`${BASE_URL}/user/upload`, body, { headers });
            // thunkAPI.dispatch(setUser(response.data as User));
            return response.data;
        } catch (error: any) {
            thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
            return thunkAPI.rejectWithValue(error.response.data);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);


export const
    {
        setUser,
        setError,
        setLoading,
    } = userSlice.actions;
export default userSlice.reducer;
function dispatch(arg0: { payload: boolean; type: "user/setLoading"; }) {
    throw new Error("Function not implemented.");
}

