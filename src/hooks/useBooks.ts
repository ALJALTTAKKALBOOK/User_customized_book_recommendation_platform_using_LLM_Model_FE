import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useToastStore } from '../store/useToastStore';

// --- [인터페이스 정의] ---
export interface BookAddRequest {
  book_id: number;
  category: string;
}

export interface ReviewUpdateRequest {
  category: string; // 책의 소분류 (예: OS, 네트워크)
  feeling_difficulty: string;
  learned_content?: string;
  hard_content?: string;
}

const API_BASE_URL = '/api/read-books/';

// 1. 내 서재에 책 담기
export const useBooks = () => {
  const [isAdding, setIsAdding] = useState(false);
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  const addBookToLibrary = async (data: BookAddRequest) => {
    setIsAdding(true);
    try {
      const response = await axios.post(API_BASE_URL, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      addToast('내 서재에 담겼습니다!', 'success');
      queryClient.invalidateQueries({ queryKey: ['library'] });
      return response.data;
    } catch (error) {
      addToast('서재 담기에 실패했습니다.', 'error');
      throw error;
    } finally {
      setIsAdding(false);
    }
  };

  return { addBookToLibrary, isAdding };
};

// 2. 리뷰 작성 및 AI 분석 (레벨업)
export const useUpdateReview = () => {
  const addToast = useToastStore((state) => state.addToast);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ readBookId, data }: { readBookId: number; data: ReviewUpdateRequest }) => {
      // 💡 1. 주소 끝에 슬래시(/)를 제거합니다. (백엔드 라우터와 일치)
      const response = await axios.patch(`/api/read-books/${readBookId}/review`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      return response.data;
    },
    onSuccess: () => {
      addToast('기록이 저장되었습니다! AI 분석 후 레벨이 업데이트됩니다.', 'success');
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['library'] });
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      }, 2000);
    },
    onError: (error: any) => {
      // 💡 에러 발생 시 백엔드가 뭐라고 하는지 콘솔에 구체적으로 찍습니다.
      console.error("422 에러 상세 원인:", error.response?.data?.detail);
      addToast('기록 저장에 실패했습니다. 입력 내용을 확인해 주세요.', 'error');
    },
  });
};
// 3. 내 서재 목록 불러오기
export const useLibrary = () => {
  return useQuery({
    queryKey: ['library'],
    queryFn: async () => {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
  });
};

// 4. 실시간 유저 역량 프로필 불러오기 (마이페이지용)
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await axios.get('/api/users/me/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    },
  });
};