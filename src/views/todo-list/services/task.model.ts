export class TaskModel {
    id?: number;
    title: string;
    completed: boolean;
    description?: string;

    constructor() {
        this.title = '';
        this.completed = false;
    }
}

export class SearchTaskModel {
    q?: string;
    title_like?: string;
    completed?: boolean;
    _sort?: 'title' | 'completed' | 'description';
    _order?: 'asc' | 'desc';
}
