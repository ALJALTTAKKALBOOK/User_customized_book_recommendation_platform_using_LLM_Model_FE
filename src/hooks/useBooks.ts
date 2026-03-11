import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';

// Mock data for demonstration
const MOCK_BOOKS = [
  { id: '1', title: '스프링 부트 핵심 가이드', genre: 'IT/프로그래밍', difficulty: '초급', author: '장정우' },
  { id: '2', title: '자바의 정석', genre: 'IT/프로그래밍', difficulty: '중급', author: '남궁성' },
];

export const useLibrary = () => {
  return useQuery<{ id: string, title: string, genre: string, difficulty: string, author: string }[]>({
    queryKey: ['library'],
    queryFn: async () => {
      // Simulate API call
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_BOOKS), 500));
    },
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (review: { bookId: string; content: string }) => {
      // In a real app: await apiClient.post('/reviews', review);
      // Simulate fast response
      return new Promise((resolve) => setTimeout(resolve, 100));
    },
    onSuccess: () => {
      // Invalidate queries if needed, but for immediate feedback we might just show a toast
      queryClient.invalidateQueries({ queryKey: ['library'] });
    },
  });
};
