import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app-store', () => {
    const totalRequest = ref(0);

    const increaseRequest = () => {
        totalRequest.value++;
    };

    const decreaseRequest = () => {
        totalRequest.value--;
    };
    return {
        totalRequest,
        increaseRequest,
        decreaseRequest
    };
});
