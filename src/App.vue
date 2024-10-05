<script setup lang="ts">
import { useAppStore } from './store/app.store';

const appStore = useAppStore();
</script>

<template>
    <div v-if="appStore.totalRequest" class="fixed w-full h-full flex justify-center items-center" style="background-color: #00000057; z-index: 9999">
        <ProgressSpinner />
    </div>

    <router-view />
</template>
