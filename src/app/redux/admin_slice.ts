// "use client"

import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "../utils/constant";
import { Certificate, Convert, Doctor } from "../utils/doctorModel";
import { Admin } from "../utils/adminModel";


interface LoginParams {
    email: string;
    password: string;
}

interface AdminState {
    admin: Admin,
    loading: boolean,
    error: string | null,
    success: boolean | null,
    message: string | null,
}

interface setAdminPayload {
    user: Admin
}


export const adminSlice = createSlice({
    name: 'user',
    initialState: {
        admin: {},
        loading: false,
        error: null,
        success: null,
        message: null,
    } as AdminState,

    reducers: {

        //  Set doctor details
        setUser: (state, action: PayloadAction<setAdminPayload>) => {
            const { user } = action.payload;
            state.admin = user;
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
        builder.addCase(adminLogin.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(adminLogin.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            state.admin = action.payload.data as Admin;
        });
        builder.addCase(adminLogin.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(fetchDoctors.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(fetchDoctors.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            console.log(action.payload.data);
        });
        builder.addCase(fetchDoctors.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(updateDoctorStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(updateDoctorStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // console.log(action.payload.data);
        });
        builder.addCase(updateDoctorStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(fetchTherapies.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(fetchTherapies.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // console.log(action.payload.data);
        });
        builder.addCase(fetchTherapies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(acceptTherapy.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(acceptTherapy.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // console.log(action.payload.data);
        });
        builder.addCase(acceptTherapy.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(addTherapy.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(addTherapy.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // console.log(action.payload.data);
        });
        builder.addCase(addTherapy.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });


    },
});

// api calls 
export const adminLogin = createAsyncThunk<any, LoginParams>(
    'admin/login',
    async (payload, thunkAPI) => {
        try {
            const { email, password } = payload;

            thunkAPI.dispatch(setLoading(true));
            // Define the request headers
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
            };

            const data = {
                username: email,
                password: password,
            };
            const response = await axios.post(`${BASE_URL}/admin/login`, data, { headers });
            console.log(response.data);
            // thunkAPI.dispatch(setUser(response.data as Admin));
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

export const fetchDoctors = createAsyncThunk<any, void, {state: any}>(
    'admin/fetchDoctors',
    async (payload, thunkAPI ) => {
        try {
            // console.log('Thunk ',thunkAPI.getState().admin.admin.token);
            thunkAPI.dispatch(setLoading(true));
            const token = thunkAPI.getState().admin.admin.token;
            // console.log('Thunk ',thunkAPI);
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`${BASE_URL}/admin/doctors`, { headers });
            console.log(response.data);
            return response.data;

        }
        catch (error: any) {
            thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
        } finally  { 
            thunkAPI.dispatch(setLoading(false));
        }
    })

/*
/admin/status-doctor api call with body  {
    "doctorId": "64e791f2c9eb2d598d2cf850",
    "status": "accepted"
    // "status": "rejected"
}
*/

export const fetchTherapies = createAsyncThunk<any, void, {state: any}>(
    'admin/fetchTherapies',
    async (payload, thunkAPI ) => {
        try {
            const token = thunkAPI.getState().admin.admin.token;
            console.log(thunkAPI.getState())
            thunkAPI.dispatch(setLoading(true));
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ${token}`
            }
            const response = await axios.get(`${BASE_URL}/admin/therapies`, { headers });
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
        } finally  {
            thunkAPI.dispatch(setLoading(false));
        }
    }
)

export const updateDoctorStatus = createAsyncThunk<any, {doctorId: string, status: string}, {state: any}>(
    'admin/updateDoctorStatus',
    async (payload, thunkAPI ) => {
        try {
            console.log('Thunk ',thunkAPI.getState().admin.admin.token);
            thunkAPI.dispatch(setLoading(true));
            const token = thunkAPI.getState().admin.admin.token;
            console.log('Thunk ',thunkAPI);
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Authorization': `Bearer ${token}`
            }
            const data = {
                doctorId: payload.doctorId,
                status: payload.status,
            }
            const response = await axios.post(`${BASE_URL}/admin/status-doctor`, data, { headers });
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
        } finally  {
            thunkAPI.dispatch(setLoading(false));
        }
    })
    
    export const addTherapy = createAsyncThunk<any, {therapy: any}, {state: any}>(
        'admin/addTherapy',
        async (payload, thunkAPI ) => {
            try {
                const token = thunkAPI.getState().admin.admin.token;
                // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4ZGM4ODMxZjQ4MGY1Yjg2YzUyMTYiLCJ1c2VybmFtZSI6ImFkbWluQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiMTIzYWJjIiwiY3JlYXRlZEF0IjoiMjAyMy0wOC0yNVQxNjo1MzoyOC43MDdaIiwidXBkYXRlZEF0IjoiMjAyMy0wOC0yNVQxNjo1MzoyOC43MDdaIiwiX192IjowLCJpYXQiOjE2OTU3ODc5OTd9.6aYrLAYeaDP-tLa4cTP4mOHtFiOWc99B58NmzNJ58bc';
                console.log(token);
            thunkAPI.dispatch(setLoading(true));
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ${token}`
            }
            //  body multipart 
            const body = new FormData();
            body.append('therapy', payload.therapy.name);
            body.append('description', payload.therapy.description);
            body.append('testimonials', payload.therapy.testimonials);
            body.append('photos', payload.therapy.photos);
            body.append('videoLink', payload.therapy.video);
            body.append('advantages', payload.therapy.advantages);
            
            const response = await axios.post(`${BASE_URL}/admin/add-therapy`, body, { headers });
            console.log(response.data);
            return response.data;
            
        } catch (error: any) {
            thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
        } finally  {
            thunkAPI.dispatch(setLoading(false));
        }
    }
    )
    
    export const acceptTherapy = createAsyncThunk<any, {therapyId: string, status: string}, {state: any}>(
        'admin/acceptTherapy',
        async (payload, thunkAPI ) => {
            try {
                const token = thunkAPI.getState().admin.admin.token;
                thunkAPI.dispatch(setLoading(true));
                const headers = {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Authorization': `Bearer ${token}`
                }
                //  body 
                /**
                 * {
        "therapyId": "650c52ea51e32927cacd38ae",
        "status": "accepted"
    }
                 */
    
                const body = {
                    therapyId: payload.therapyId,
                    status: payload.status,
                }
    
                const response = await axios.post(`${BASE_URL}/admin/status-therapy`, body, { headers });
                console.log(response.data);
                return response.data;
    
            } catch (error: any) {
                thunkAPI.dispatch(setError(error.response ? error.response.data : 'An error occurred'));
            } finally  {
                thunkAPI.dispatch(setLoading(false));
            }
        }
    )
    export const
    {
        setUser,
        setError,
        setLoading,
    } = adminSlice.actions;
export default adminSlice.reducer;
function dispatch(arg0: { payload: boolean; type: "user/setLoading"; }) {
    throw new Error("Function not implemented.");
}

