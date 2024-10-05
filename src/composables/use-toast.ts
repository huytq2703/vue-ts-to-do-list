import { useToast } from 'primevue/usetoast';

interface messages {
    title?: string;
    message?: string;
}

export function useToastr() {
    const toast = useToast();

    function success(messages: messages) {
        const title = messages?.title ?? 'Success';

        toast.add({ severity: 'success', summary: title, detail: messages?.message, life: 3000 });
    }

    function info(messages: messages) {
        const title = messages?.title ?? 'Information';

        toast.add({ severity: 'info', summary: title, detail: messages?.message, life: 3000 });
    }

    function warn(messages: messages) {
        const title = messages?.title ?? 'Warning';

        toast.add({ severity: 'warn', summary: title, detail: messages?.message, life: 3000 });
    }

    function error(messages: messages) {
        const title = messages?.title ?? 'Error';

        toast.add({ severity: 'error', summary: title, detail: messages?.message, life: 3000 });
    }

    return { success, info, warn, error };
}
