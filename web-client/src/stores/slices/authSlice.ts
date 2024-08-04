import api, { toReadableResponse } from "@/libs/api-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface LoginAuthPayload {
    email: string,
    password: string
}

export const Login = createAsyncThunk(
    'auth/login',
    async (payload: LoginAuthPayload, { rejectWithValue }) => {
        try {
            const response = await api.post('auth/login', {
                json: payload
            }).json<{ data: string }>();
            /*  return toReadableResponse('completed', response); */
            return response.data;
        } catch (e) {
            return rejectWithValue(await toReadableResponse('error', e));
        }
    }
);


export const Refresh = createAsyncThunk(
    'auth/refresh',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await api.get('auth/refresh').json<{ data: string }>();
            return response.data;
        } catch (e: any) {
            if (e.status === 401) {  // Only remove auth for unauthorized errors
                dispatch(removeAuth());
            }
            return rejectWithValue(await toReadableResponse('error', e));
        }
    }
)
export const Logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('auth/logout').json();
            return toReadableResponse('completed', response);
        } catch (e) {
            return rejectWithValue(await toReadableResponse('error', e));
        }
    }
);

const initialState = {
    isAuthenticated: !!localStorage.getItem('access_token'),
    accessToken: localStorage.getItem('access_token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        establishAuth: (state, action) => {
            const { user, accessToken } = action.payload;
            state.user = { ...user };
            state.accessToken = accessToken;
            state.isAuthenticated = true;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));
        },
        disabledAuth: (state) => {
            state.isAuthenticated = false;
        },
        removeAuth: (state) => {
            console.log("authSlice: removeAuth called");
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            state.accessToken = null;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(Login.fulfilled, (state, action) => {
                const { user, access_token }: any = action.payload;
                state.user = { ...user };
                state.accessToken = access_token;
                state.isAuthenticated = true;
                // i want to add establishAuth in here?
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user', JSON.stringify(user));

            })
            .addCase(Refresh.fulfilled, (state, action) => {
                const { user, access_token }: any = action.payload;
                state.user = { ...user };
                state.accessToken = access_token;
                state.isAuthenticated = true;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('user', JSON.stringify(user));
            })
            .addCase(Logout.fulfilled, (state) => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                state.accessToken = null;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});
export const { establishAuth, disabledAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;
