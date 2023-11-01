// "use client"

import { PayloadAction, createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "../utils/constant";
import { Certificate, Clinic, Convert, Doctor } from "../utils/doctorModel";


interface LoginParams {
    mobileNo: number;
    countryCode: string;
}

interface UserState {
    doctor: Doctor,
    loading: boolean,
    error: string | null,
    success: boolean | null,
    message: string | null,
}

interface setUserPayload {
    user: Doctor
}

interface UpdateCertificatePayload {
    doctorCertificates: Certificate[]
}


export const doctorSlice = createSlice({
    name: 'user',
    initialState: {
        doctor: {},
        loading: false,
        error: null,
        success: null,
        message: null,
    } as UserState,

    reducers: {

        //  Set doctor details
        setUser: (state, action: PayloadAction<setUserPayload>) => {
            const { user } = action.payload;
            state.doctor = user;
            console.log(current(state));
        },

        updateCertificate: (state, action: PayloadAction<UpdateCertificatePayload>) => {
            const { doctorCertificates } = action.payload;
            state.doctor.data.certificate = doctorCertificates;
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
        builder.addCase(getDoctorData.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        });
        builder.addCase(getDoctorData.fulfilled, (state, action) => {
            console.log(action.payload.data)
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            state.doctor = action.payload.data as Doctor;
        });
        builder.addCase(getDoctorData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        });
        builder.addCase(uploadCertificate.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        }
        );
        builder.addCase(uploadCertificate.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // state.doctor.data.certificate = action.payload.data as Certificate[];
        }
        );
        builder.addCase(uploadCertificate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        }
        );
        builder.addCase(updateDoctor.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        }
        );
        builder.addCase(updateDoctor.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            state.doctor = action.payload.data as Doctor;
        }
        );
        builder.addCase(updateDoctor.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        }
        );
        builder.addCase(addTherapy.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        }
        );
        builder.addCase(addTherapy.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // state.doctor.therapy.push(action.payload.data as string);
        }
        );
        builder.addCase(addTherapy.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        }
        );
        builder.addCase(getTherapies.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = null;
            state.message = null;
        }
        );
        builder.addCase(getTherapies.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = true;
            state.message = null;
            // state.doctor.data.therapy = action.payload.data as string[];
        }
        );
        builder.addCase(getTherapies.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.success = false;
            state.message = null;
        }
        );

    },
});

// api calls 
export const getDoctorData = createAsyncThunk<any,LoginParams,  {state: any}>(
    'doctor/login',
    async (payload, thunkAPI) => {
        try {
            const { mobileNo, countryCode } = payload;

            thunkAPI.dispatch(setLoading(true));

            const response = await axios.post(`${BASE_URL}/doctor/login`, { mobileNo, countryCode });

            // thunkAPI.dispatch(setUser(response.data as Doctor));
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

export const uploadCertificate = createAsyncThunk<any, {file: File}, {state: any}>(
    'doctor/uploadCertificate',
    async (payload, thunkAPI) => {
        console.log(thunkAPI.getState().doctor.doctor.token);
        const token = thunkAPI.getState().doctor.doctor.token;
        const headers = {
            'Content-Type': 'multipart/form-data',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Authorization': `Bearer ${token}`
        }; 
        const body = new FormData();
        body.append('photo', payload.file);
        try {
            const response = await axios.post(`${BASE_URL}/doctor/upload`, body, { headers: headers });
            return response.data;
        }
        catch (error) {
            console.log(error);
        }
        finally {
            thunkAPI.dispatch(setLoading(false));
        }
    }
);

export const updateDoctor = createAsyncThunk<any, {
    fullName: string,
    email: string,
    clinics: Clinic[]
    therapy: string[]
}, {state: any}>(
    'doctor/updateDoctor',
    async (payload, thunkAPI) => {
        try{
            const token = thunkAPI.getState().doctor.doctor.token;
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Host': 'localhost:3000',
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.post(`${BASE_URL}/doctor/update`, payload, { headers: headers });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally   {
            thunkAPI.dispatch(setLoading(false));
        }

    }
); 

export const addTherapy = createAsyncThunk<any, any, {state: any}>(
    'doctor/addTherapy',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().doctor.doctor.token;
            const headers = {
                'Content-Type': 'multipart/form-data',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ${token}`
            };

            const body = new FormData();
            body.append('therapy', payload.name);
            body.append('description', payload.description);
            body.append('testimonials', payload.testimonials);
            body.append('photos', payload.photos);
            body.append('videoLink', payload.video);
            body.append('advantages', payload.advantages);

            const response = await axios.post(`${BASE_URL}/doctor/add-therapy`, body, { headers: headers });
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }

    }   
);

export const getTherapies = createAsyncThunk<any, any,  {state: any}>(
    'doctor/getTherapies',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().doctor.doctor.token;
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`${BASE_URL}/doctor/therapies`, { headers: headers }); 
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }

    }
);

export const getPatients  = createAsyncThunk<any, any, {state: any}>(
    'doctor/getPatients',
    async (payload, thunkAPI) => {
        try {
            const token = thunkAPI.getState().doctor.doctor.token;
            const headers = {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Authorization': `Bearer ${token}`
            };
            const response = await axios.get(`${BASE_URL}/doctor/users`, { headers: headers });
            return response.data;
        } catch (error) {
            console.log(error);
        } finally {
            thunkAPI.dispatch(setLoading(false));
        }

    }
)


export const
    {
        setUser,
        updateCertificate,
        setError,
        setLoading,
    } = doctorSlice.actions;
export default doctorSlice.reducer;
