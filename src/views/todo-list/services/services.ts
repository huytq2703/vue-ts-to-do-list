import apiClient from '@/core/api-client';
import { task_end_point } from './end-point';
import { SearchTaskModel, TaskModel } from './task.model';

export default class TaskService {
    private headers = {
        removeToken: true
    };

    // Fetch tasks with optional search parameters
    getTasks(searchParams: SearchTaskModel): Promise<TaskModel[]> {
        return apiClient.get<TaskModel[]>(task_end_point, {
            params: searchParams,
            headers: this.headers
        });
    }

    // Add a new task
    addTask(data: TaskModel): Promise<TaskModel> {
        return apiClient.post<TaskModel>(task_end_point, data, {
            headers: this.headers
        });
    }

    // Get a task by ID
    getTask(id: number): Promise<TaskModel> {
        return apiClient.get<TaskModel>(`${task_end_point}/${id}`, {
            headers: this.headers
        });
    }

    // Update an existing task
    async updateTask(data: TaskModel): Promise<TaskModel> {
        return await apiClient.put<TaskModel>(`${task_end_point}/${data.id}`, data, {
            headers: this.headers
        });
    }

    // Update existing tasks
    async updateTasks(data: TaskModel[]): Promise<TaskModel[]> {
        const updatePromises = data.map((task) => this.updateTask(task));
        return await Promise.all(updatePromises);
    }

    // Delete a task by ID
    deleteTask(id: number): Promise<void> {
        return apiClient.delete<void>(`${task_end_point}/${id}`, {
            headers: this.headers
        });
    }

    // Delete existing tasks
    async deleteTasks(ids: number[]): Promise<void[]> {
        const updatePromises = ids.map((id) => this.deleteTask(id));
        return await Promise.all(updatePromises);
    }
}
