import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getRequests,
    getRequestById,
    getMyRequests,
    getAcceptedByMe,
    createRequest,
    updateRequest,
    deleteRequest,
    acceptRequest,
    completeRequest,
} from '../api/helpRequestApi';
import { showSuccess } from '../utils/toast';

const ALL_REQUEST_KEYS = [['requests'], ['my-requests'], ['accepted-by-me']];

function useRequestMutation(mutationFn, { successMessage, onSuccess, ...rest } = {}) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: (...args) => {
            ALL_REQUEST_KEYS.forEach((key) =>
                queryClient.invalidateQueries({ queryKey: key })
            );
            if (successMessage) showSuccess(successMessage);
            onSuccess?.(...args);
        },
        ...rest,
    });
}

export function useRequests(status) {
    return useQuery({
        queryKey: ['requests', status ?? 'ALL'],
        queryFn: () => getRequests(status === 'ALL' ? null : status),
    });
}

export function useRequest(id) {
    return useQuery({
        queryKey: ['requests', Number(id)],
        queryFn: () => getRequestById(id),
        enabled: !!id,
    });
}

export function useMyRequests() {
    return useQuery({
        queryKey: ['my-requests'],
        queryFn: getMyRequests,
    });
}

export function useAcceptedByMe() {
    return useQuery({
        queryKey: ['accepted-by-me'],
        queryFn: getAcceptedByMe,
    });
}

export function useCreateRequest(options = {}) {
    return useRequestMutation(createRequest, { successMessage: 'Request created', ...options });
}

export function useUpdateRequest(options = {}) {
    return useRequestMutation(updateRequest, { successMessage: 'Request updated', ...options });
}

export function useDeleteRequest(options = {}) {
    return useRequestMutation(deleteRequest, { successMessage: 'Request deleted', ...options });
}

export function useAcceptRequest(options = {}) {
    return useRequestMutation(acceptRequest, { successMessage: 'Request accepted', ...options });
}

export function useCompleteRequest(options = {}) {
    return useRequestMutation(completeRequest, { successMessage: 'Request marked complete', ...options });
}
