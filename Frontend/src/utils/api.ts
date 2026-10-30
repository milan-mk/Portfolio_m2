/**
 * API service for interacting with Citadel Portfolio Backend
 */

export interface MessagePayload {
  name: string;
  email: string;
  orders: string;
  role?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const sendRecruitmentMessage = async (
  payload: MessagePayload
): Promise<ApiResponse> => {
  const url = `${API_BASE}/api/messages`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error: data?.error || `Request failed with status ${response.status}`,
      };
    }

    return {
      success: true,
      message: data?.message || 'Missive dispatched successfully!',
      data: data?.data,
    };
  } catch (error: any) {
    console.error('API connection failure:', error);
    return {
      success: false,
      error:
        'Could not reach the Citadel Backend server. Please ensure the backend is running (port 5000) and MongoDB is connected.',
    };
  }
};
