import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});


// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Handle successful responses
        return response;
    },
    (error) => {
        // Handle response errors
        console.error("Response error:", error);
        if (error.response) {
            // Handle specific HTTP status codes
            switch (error.response.status) {
                case 401:
                    console.error("Unauthorized: Redirect to login");
                    // Example: Redirect to login page
                    // window.location.href = "/login";
                    break;
                case 403:
                    console.error("Forbidden: You don't have permission");
                    break;
                case 404:
                    console.error("Not Found: Check the URL");
                    break;
                default:
                    console.error("Server Error:", error.response.data);
            }
        }
        return Promise.reject(error);
    }
);
