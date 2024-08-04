import api, { toFormData, toReadableResponse, toUrlSearchParams } from "@/libs/api-client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Student {
    id: number;
    name: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ListStudentPayload {
    page?: number;
    search: string;
    per_page?: number;
    [key: string]: string | number | boolean | undefined | null;
}

interface ListStudentResponse {
    data: {
        data: Student[];
        per_page: number;
        current_page: number;
        total: number;
        to: number;
    };
    message?: string;
}


export const list = createAsyncThunk(
    'student/list',
    async (payload: ListStudentPayload, { rejectWithValue }) => {
        try {
            const parameters = toUrlSearchParams(payload);
            const response = await api.get(`students?${parameters}`).json<ListStudentResponse>();
            return toReadableResponse('completed', response);
        } catch (e: any) {
            if (e.response && e.response.json) {
                const errorResponse = await e.response.json();
                return rejectWithValue({ message: errorResponse.message });
            }
        }
    }
);

export const create = createAsyncThunk(
    'student/create',
    async (payload: { name: string, status: string, image: File | null | undefined }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('name', payload.name);
            formData.append('status', payload.status);
            if (payload.image) {
                formData.append('image', payload.image);
            }
            const response = await api.post('students',
                { body: formData }
            ).json<{ data: Student, success: boolean, message: string[] }>();
            return await toReadableResponse('completed', response);
        } catch (error: any) {
            if (error.response && error.response.json) {
                const errorResponse = await error.response.json();
                return rejectWithValue({ message: errorResponse.message });
            }
        }
    }
)

export const Delete = createAsyncThunk(
    'student/delete',
    async (payload: { id: number }, { rejectWithValue }) => {
        try {
            const response = await api.delete(
                `students/${payload.id}`
            ).json();
            return await toReadableResponse('completed', response);
        } catch (e: any) {
            if (e.response && e.response.json) {
                const errorResponse = await e.response.json();
                return rejectWithValue({ message: errorResponse.message });
            }
        }
    }
);

export const getStudentID = createAsyncThunk(
    'student/get',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.get(
                `students/${id}`
            ).json();
            return await toReadableResponse('completed', response);
        } catch (e: any) {
            if (e.response && e.response.json) {
                const errorResponse = await e.response.json();
                return rejectWithValue({ message: errorResponse.message });
            }
        }

    }
)

export const Update = createAsyncThunk(
    'student/update',
    async (payload: { id: number, _method: string, name: string, status: string, image: File | null | undefined }, { rejectWithValue }) => {
        try {
            payload['_method'] = 'PUT';
            const response = await api.post(`students/${payload.id}`, {
                body: toFormData(payload)
            }).json();
            return await toReadableResponse('completed', response);
        } catch (e: any) {
            if (e.response && e.response.json) {
                const errorResponse = await e.response.json();
                return rejectWithValue({ message: errorResponse.message, success: errorResponse.success });
            }
        }
    }
);

const initialState = {
    students: [] as Student[],
    currentPage: 1,
    perPage: 5,
    totalPages: 0,
    totalItems: 0,
    search: '',
    success: false,
    message: '',
    isLoading: false
}

const studentSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        setItemPerPage(state, action) {
            state.perPage = action.payload;
        },
        setSearch(state, action) {
            state.search = action.payload;
        },
        setPage(state, action) {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(list.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(list.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.students = action.payload?.data.data;
                state.perPage = action.payload?.data.per_page;
                state.currentPage = action.payload?.data.current_page;
                state.totalPages = action.payload?.data.to;
                state.totalItems = action.payload?.data.total;
            })
            .addCase(list.rejected, (state) => {
                state.isLoading = false;
                state.success = false;
                state.message = 'Failed to fetch students.';
            })

            .addCase(create.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = '';
            })
            .addCase(create.fulfilled, (state, action: any) => {
                state.isLoading = false;
                state.success = true;
                state.students.push(action.payload.data);
            })
            .addCase(create.rejected, (state, action: any) => {
                state.isLoading = false;
                state.success = false;
                state.message = action.payload?.message || 'Unknown error occurred';
            })

            .addCase(Delete.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = '';
            })
            .addCase(Delete.fulfilled, (state, action: any) => {
                state.isLoading = false;
                state.success = true;
                state.students = state.students.filter(student => student.id !== action.meta.arg.id);
            })
            .addCase(Delete.rejected, (state, action: any) => {
                state.isLoading = false;
                state.success = false;
                state.message = action.payload?.message || 'Unknown error occurred';
            })

            .addCase(getStudentID.pending, (state) => {
                state.isLoading = true;
                state.success = false;
            })
            .addCase(getStudentID.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(getStudentID.rejected, (state, action: any) => {
                state.isLoading = false;
                state.success = false;
                state.message = action.payload?.message || 'Unknown error occurred';
            })

            .addCase(Update.pending, (state) => {
                state.isLoading = true;
                state.success = false;
                state.message = '';
            })
            .addCase(Update.fulfilled, (state) => {
                state.isLoading = false;
                state.success = true;
            })
            .addCase(Update.rejected, (state, action: any) => {
                state.isLoading = false;
                state.success = false;
                state.message = action.payload?.message || 'Unknown error occurred';
            })
    },
});

export const {
    setItemPerPage,
    setSearch,
    setPage
} = studentSlice.actions;

export default studentSlice.reducer;
