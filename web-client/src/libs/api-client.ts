
import ky from "ky";

const BASE_URL = `http://127.0.0.1:8000/api`;
const api = ky.extend({
    prefixUrl: BASE_URL,
    timeout: false,
    headers: {
        "Access-Control-Allow-Origin": '*'
    },
    hooks: {
        beforeRequest: [
            request => {
                const token = window.localStorage.getItem('access_token');
                if (token) {
                    request.headers.set('Authorization', `Bearer ${token}`);
                }
            }
        ]
    }
});

type payload = {
    [key: string]: string | number | boolean | undefined | null | Array<string>;
}

export const toUrlSearchParams = (payload: payload) => {
    const queries: Array<string> = [];
    Object.entries(payload).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value) {
                value.forEach((val, index) => {
                    queries.push(`${key}[${index}]=${encodeURIComponent(val.toString()).replace(/20%/g, '+')}`);
                })
            }
        } else if (value !== null && value !== undefined) {
            queries.push(`${key}=${encodeURIComponent(value.toString()).replace(/20%/g, '+')}`);
        }
    })
    return queries.join('&');
}

export const toFormData = (object: any) => {
    const formData = new FormData();
    function appendFormData(data: any, rootKey: any) {
        if (Array.isArray(data)) {
            data.forEach((value, index) => {
                appendFormData(value, `${rootKey}[${index}]`);
            })
        } else if (typeof data === 'object' && data !== null && !(data instanceof File)) {
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    if (rootKey === '') {
                        appendFormData(data[key], key);
                    } else {
                        appendFormData(data[key], `${rootKey}[${key}]`);
                    }
                }
            }
        } else {
            if (data !== null) {
                formData.append(rootKey, data);
            }
        }
    }
    appendFormData(object, '');
    return formData;
}

export const toReadableResponse = async (type: string, body: any) => {
    if (type === 'completed') {
        return {
            success: true,
            message: body.message,
            data: body.data
        }
    }

    if (type === 'error') {
        try {
            const error = await body.response.json();
            return {
                success: false,
                message: error.message || 'An error occurred.',
                data: error.data || null
            };
        } catch {
            return {
                success: false,
                message: 'An error occurred.',
                data: null
            };
        }
    }

    return {
        success: false,
        message: 'Server error.'
    }
}

export default api;

