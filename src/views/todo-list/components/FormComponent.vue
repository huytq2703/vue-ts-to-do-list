<script setup lang="ts">
import { TaskModel } from '@/views/todo-list/services';
import { computed, defineProps, reactive, ref } from 'vue';

const props = defineProps<{
    modelValue: TaskModel;
}>();
const emit = defineEmits(['submit', 'cancel']);

const submitted = ref<boolean>(false);
const titleError = computed(() => (!internalTask.title && submitted.value ? 'Please enter a title.' : undefined));
const internalTask = reactive<TaskModel>(props.modelValue);

const onCancel = () => {
    emit('cancel');
};

const onSubmit = (close: boolean = false) => {
    submitted.value = true;

    if (titleError.value) {
        emit('submit', false); // Emit false if there's an error
        return;
    }

    emit('submit', internalTask); // Emit the task object
    if (close) {
        emit('cancel'); // Close if requested
    }
    submitted.value = false; // Reset the submitted flag
};
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-2">
            <label for="title">Title <span class="text-red-700">*</span></label>
            <InputText id="title" v-model="internalTask.title" :invalid="!!titleError" :maxlength="150" />
            <Message v-if="titleError" severity="error">{{ titleError }}</Message>
        </div>

        <div class="flex flex-col gap-2">
            <label for="desc">Description</label>
            <Textarea id="desc" v-model="internalTask.description" rows="5" cols="30" :maxlength="500" />
        </div>

        <div class="flex items-center gap-2">
            <Checkbox inputId="isCompleted" v-model="internalTask.completed" name="category" binary />
            <label for="isCompleted">Task completed</label>
        </div>
    </div>

    <div class="flex justify-end gap-2 mt-3">
        <Button type="button" label="Cancel" severity="secondary" @click="onCancel()" />
        <Button type="button" label="Save" @click="onSubmit()" />
        <Button type="button" label="Save & Close" @click="onSubmit(true)" />
    </div>
</template>
