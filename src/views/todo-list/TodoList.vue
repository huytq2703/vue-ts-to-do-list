<script setup lang="ts">
import { useToastr } from '@/composables/use-toast';
import { SelectModel } from '@/core/model';
import { AddModalComponent, UpdateModalComponent } from '@/views/todo-list/components';
import { SearchTaskModel, TaskModel, TaskService } from '@/views/todo-list/services';
import { useConfirm } from 'primevue/useconfirm';
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue';

const taskService = new TaskService();
const toast = useToastr();
const confirm = useConfirm();
const addModal = useTemplateRef('addModal');
const updateModal = useTemplateRef('updateModal');

const tasks = ref<SearchTaskModel[]>([]);
const taskStatusFilter = ref<SelectModel | null>(null); // Initialize as null for better type handling
const selectedTasks = ref<TaskModel[]>([]);
const searchText = ref<string>('');

// Task status options
const taskStatuses = ref<SelectModel[]>([
    { label: 'Completed', value: true },
    { label: 'Incomplete', value: false }
]);

const hasSelectedTask = computed(() => selectedTasks.value.length > 0);

// Fetch tasks when component mounts
onMounted(() => getTasks());

// Watch for changes in filters and search text
watch([taskStatusFilter, searchText], () => getTasks());

// Functions to open modals
const onClickOpenAddModal = () => {
    addModal.value?.openModal();
};

const onClickOpenEditModal = (taskId: number) => {
    updateModal.value?.openModal(taskId);
};

// Fetch tasks from the service
const getTasks = async () => {
    const searchParams: SearchTaskModel = {
        completed: taskStatusFilter.value?.value !== undefined ? (taskStatusFilter.value?.value as boolean) : undefined,
        title_like: searchText.value || undefined, // Use undefined for empty string
        _order: 'asc',
        _sort: 'completed'
    };

    try {
        tasks.value = await taskService.getTasks(searchParams);
        selectedTasks.value = []; // Clear selection after fetching
    } catch (error) {
        toast.error({ message: 'Failed to retrieve task list.' });
    }
};

// Delete selected tasks
const onClickDelete = async () => {
    const ids = selectedTasks.value.map((task) => task.id as number);

    if (ids.length === 0) return; // Exit if no tasks are selected

    confirm.require({
        message: `Are you sure you want to delete ${ids.length} record(s)?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            try {
                await taskService.deleteTasks(ids);
                toast.success({ message: 'Tasks deleted successfully.' });
                getTasks(); // Refresh task list after deletion
            } catch (error) {
                toast.error({ message: 'Failed to delete tasks.' });
            }
        }
    });
};

// Get tag data for task completion status
const getTagData = (completed: boolean) => {
    return {
        severity: completed ? 'success' : 'danger',
        value: completed ? taskStatuses.value[0].label : taskStatuses.value[1].label
    };
};

// Toggle completion status for selected tasks
const toggleComplete = async (completed: boolean) => {
    const data = selectedTasks.value.map((task) => ({
        ...task,
        completed: completed
    }));

    if (data.length === 0) return; // Exit if no tasks are selected

    confirm.require({
        message: `Are you sure you want to update ${data.length} record(s)?`,
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'OK'
        },
        accept: async () => {
            try {
                await taskService.updateTasks(data);
                toast.success({ message: 'Tasks updated successfully.' });
                getTasks(); // Refresh task list after update
                selectedTasks.value = []; // Clear selection after update
            } catch (error) {
                toast.error({ message: 'Failed to update tasks.' });
            }
        }
    });
};
</script>

<template>
    <ConfirmPopup></ConfirmPopup>
    <div class="card">
        <div class="flex justify-between gap-2 mt-3">
            <h3 class="font-bold text-xl">To-do List</h3>
            <div class="flex gap-2">
                <Button label="Refresh" @click="getTasks" />
                <Button label="Add Task" @click="onClickOpenAddModal" />
            </div>
        </div>

        <div class="mt-3 custom-table">
            <DataTable v-model:selection="selectedTasks" :value="tasks" scrollable scrollHeight="640px" tableStyle="min-width: 50rem" showGridlines>
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <template #header>
                    <div class="flex justify-between">
                        <div class="flex gap-2">
                            <Button label="Mark as Completed" @click="toggleComplete(true)" :disabled="!hasSelectedTask" outlined />
                            <Button label="Mark as Incomplete" @click="toggleComplete(false)" severity="warn" :disabled="!hasSelectedTask" outlined />
                            <Button label="Delete" @click="onClickDelete" severity="danger" :disabled="!hasSelectedTask" outlined />
                        </div>

                        <div class="flex gap-2">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model.trim="searchText" placeholder="Keyword Search" @keyup.enter="getTasks" />
                            </IconField>
                            <Select v-model="taskStatusFilter" showClear :options="taskStatuses" optionLabel="label" placeholder="All" class="w-full md:w-56" />
                        </div>
                    </div>
                </template>

                <template #empty>
                    <div class="text-center">No tasks available. Please add a new task.</div>
                </template>

                <Column field="id" header="Id" class="text-center" style="width: 50px" />
                <Column field="title" header="Title" style="width: 300px" />
                <Column field="description" header="Description" />
                <Column field="completed" header="Completed" style="width: 100px">
                    <template #body="{ data }">
                        <Tag :value="getTagData(data.completed).value" :severity="getTagData(data.completed).severity" />
                    </template>
                </Column>

                <Column header="Actions" class="text-center" style="width: 70px">
                    <template #body="{ data }">
                        <div class="flex gap-2">
                            <Button icon="pi pi-pencil" v-tooltip="'Edit'" @click="onClickOpenEditModal(data.id)" />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>

    <!-- Modal Components -->
    <AddModalComponent ref="addModal" @afterSaveEmit="getTasks" />
    <UpdateModalComponent ref="updateModal" @afterSaveEmit="getTasks" />
</template>

<style lang="scss">
.custom-table {
    .text-center {
        text-align: center !important;

        .p-datatable-column-header-content {
            justify-content: center;
        }
    }

    thead {
        z-index: 995 !important;
    }
}
</style>
