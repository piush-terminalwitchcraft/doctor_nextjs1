// "use client"

import { configureStore } from '@reduxjs/toolkit';
import doctorReducer from './doctor_slice';
import adminReducer from './admin_slice';
import userReducer from './user_slice';  

export const store = configureStore({
    reducer: {
        doctor: doctorReducer,
        admin: adminReducer,
        user: userReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    // devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>;


