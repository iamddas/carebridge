import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import requestApi from '../api/request.api';

const REQUESTS_QUERY_KEY = ['requests'];

export const useRequests = (params = {}) => {
  return useQuery({
    queryKey: [...REQUESTS_QUERY_KEY, params],
    queryFn: () => requestApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRequestById = (id) => {
  return useQuery({
    queryKey: [...REQUESTS_QUERY_KEY, id],
    queryFn: () => requestApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useMyRequests = (params = {}) => {
  return useQuery({
    queryKey: [...REQUESTS_QUERY_KEY, 'my-requests', params],
    queryFn: () => requestApi.getMyRequests(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestData) => requestApi.create(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
};

export const useUpdateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => requestApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
};

export const useDeleteRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => requestApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => requestApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REQUESTS_QUERY_KEY });
    },
  });
};
