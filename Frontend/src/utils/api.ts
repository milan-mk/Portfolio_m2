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
      let errorMsg = data?.error || data?.message;
      if (!errorMsg) {
        if (response.status === 503) {
          errorMsg = 'Database is currently unavailable. Please try again shortly.';
        } else if (response.status === 502 || response.status === 504) {
          errorMsg = 'Citadel Backend is unreachable. Please verify the backend server is running on port 5000.';
        } else {
          errorMsg = `Server responded with status ${response.status}.`;
        }
      }
      return {
        success: false,
        error: errorMsg,
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
