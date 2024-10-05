// ApiClient handles all API interactions using Axios.
// It manages the token, sets up request/response interceptors,
// and provides methods for GET, POST, PUT, DELETE requests.

import { useAppStore } from '@/store/app.store';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
    private instance: AxiosInstance;
    private token: string | null;
    private store = useAppStore();

    constructor() {
        this.token = localStorage.getItem('token'); // Initialize token from localStorage
        this.instance = axios.create({
            // Create an Axios instance with default config
            baseURL: import.meta.env.VITE_API_URL,
            headers: { 'Content-Type': 'application/json' }
        });

        this.initializeRequestInterceptor(); // Add request interceptor
        this.initializeResponseInterceptor(); // Add response interceptor
    }

    // Set or remove token, and update localStorage
    public setToken(token: string | null) {
        this.token = token;
        token ? localStorage.setItem('token', token) : localStorage.removeItem('token');
    }

    // Request interceptor to include token and update loading state
    private initializeRequestInterceptor() {
        this.instance.interceptors.request.use(
            (config) => {
                if (this.token && config.headers) {
                    config.headers['Authorization'] = `Bearer ${this.token}`;
                }
                this.store.increaseRequest(); // Track loading state
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    // Response interceptor to handle errors and update loading state
    private initializeResponseInterceptor() {
        this.instance.interceptors.response.use(
            (response) => {
                this.store.decreaseRequest(); // Track loading state
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    console.error('Unauthorized - Redirect to login'); // Handle token expiration
                }
                this.store.decreaseRequest();
                return Promise.reject(error);
            }
        );
    }

    // GET request
    public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return (await this.instance.get<T>(url, this.buildConfig(config))).data;
    }

    // POST request
    public async post<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        return (await this.instance.post<T>(url, data, this.buildConfig(config))).data;
    }

    // PUT request
    public async put<T>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> {
        return (await this.instance.put<T>(url, data, this.buildConfig(config))).data;
    }

    // DELETE request
    public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return (await this.instance.delete<T>(url, this.buildConfig(config))).data;
    }

    // Build custom request config, handling token and optional removal
    private buildConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
        const customConfig = { ...config, headers: { ...config?.headers } };

        if (this.token) {
            // Ensure that headers exists and add Authorization token
            (customConfig.headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
        }

        if (config?.headers?.removeToken) {
            delete (customConfig.headers as Record<string, any>)['Authorization']; // Remove token if flagged
        }

        // Clean up the removeToken flag
        delete (customConfig.headers as Record<string, any>)['removeToken'];

        return customConfig;
    }
}

const apiClient = new ApiClient();
export default apiClient;
