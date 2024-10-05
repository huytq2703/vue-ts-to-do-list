<script setup lang="ts">
import { useToastr } from '@/composables';
import { FormComponent } from '@/views/todo-list/components';
import { TaskModel, TaskService } from '@/views/todo-list/services';
import { defineEmits, defineExpose, reactive, ref, watch } from 'vue';

type AfterSaveEmitType = { (e: 'afterSaveEmit'): void };

const taskService = new TaskService();
const toast = useToastr();
const modalAddVisible = ref(false);
const task = reactive<TaskModel>({
    title: '',
    description: '',
    completed: false
});
const emptyTask = new TaskModel();

const afterSaveEmit = defineEmits<AfterSaveEmitType>();

// Watcher to handle the visibility of the modal
watch(modalAddVisible, (visible) => {
    if (visible) {
        onShow();
    } else {
        onClose();
    }
});

// Handle form submission
const onSubmit = (data: TaskModel | false) => {
    if (!data) return;

    taskService
        .addTask(data)
        .then(() => {
            afterSaveEmit('afterSaveEmit');
            toast.success({ message: 'Task saved successfully!' });
            resetTask(); // Reset task after successful save
        })
        .catch(() => {
            toast.error({ message: 'Failed to save task.' });
        });
};

// Function to handle modal show
const onShow = () => {
    // TODO: Add additional logic here if needed
};

// Function to handle modal close
const onClose = () => {
    resetTask(); // Reset task when modal closes
};

// Function to reset the task object
const resetTask = () => {
    Object.assign(task, emptyTask);
};

// Expose methods for parent components
defineExpose({
    openModal: () => (modalAddVisible.value = true),
    closeModal: () => (modalAddVisible.value = false)
});
</script>

<template>
    <Dialog v-model:visible="modalAddVisible" maximizable modal header="Add New Task" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <FormComponent v-if="modalAddVisible" v-model="task" @cancel="modalAddVisible = false" @submit="onSubmit($event)" />
    </Dialog>
</template>
