<script setup lang="ts">
import { useToastr } from '@/composables';
import { defineEmits, defineExpose, ref, watch } from 'vue';

import { FormComponent } from '@/views/todo-list/components';
import { TaskModel, TaskService } from '@/views/todo-list/services';

type AfterSaveEmitType = { (e: 'afterSaveEmit'): void };
const afterSaveEmit = defineEmits<AfterSaveEmitType>();

const toast = useToastr();
const taskService = new TaskService();

const modalUpdateVisible = ref(false);
const emptyTask = new TaskModel();
const task = ref<TaskModel>(emptyTask);

watch(modalUpdateVisible, (visible) => {
    visible ? onShow() : onClose();
});

const onSubmit = (data: TaskModel) => {
    if (!data) return;

    taskService
        .updateTask(data)
        .then(() => {
            toast.success({ message: 'Task updated successfully.' });
            afterSaveEmit('afterSaveEmit');
        })
        .catch((e) => {
            toast.error({ message: `Error: ${e.message}` });
        });
};

const onShow = () => {
    // TODO: Additional logic when the modal is shown (if necessary)
};

const onClose = () => {
    task.value = emptyTask; // Reset the task
};

const getTask = (id: number) => {
    taskService
        .getTask(id)
        .then((response) => {
            task.value = response; // Set the task to be updated
            modalUpdateVisible.value = true; // Show the modal
        })
        .catch(() => {
            toast.error({ message: 'Unable to retrieve task information.' });
        });
};

defineExpose({
    openModal: (taskId: number) => {
        if (!taskId) {
            toast.info({ message: 'Please select a task to update.' });
            return;
        }

        getTask(taskId); // Fetch the task details
    },
    closeModal: () => (modalUpdateVisible.value = false)
});
</script>

<template>
    <Dialog v-model:visible="modalUpdateVisible" maximizable modal header="Update Task" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <FormComponent v-model="task" @cancel="modalUpdateVisible = false" @submit="onSubmit($event)" />
    </Dialog>
</template>
