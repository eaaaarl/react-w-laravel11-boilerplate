import { configureStore } from "@reduxjs/toolkit";
import studentReducer from "@/stores/slices/studentSlice";
import authSlice from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        student: studentReducer,
        auth: authSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
