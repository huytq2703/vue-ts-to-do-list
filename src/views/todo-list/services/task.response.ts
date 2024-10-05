import { ApiResponse } from '@/responses/api.response';
import { TaskModel } from './task.model';

export class TasksResponse extends ApiResponse {
    tasks: TaskModel[];

    constructor() {
        super();
        this.tasks = [];
    }
}
