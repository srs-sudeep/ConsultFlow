import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth API
export const authApi = {
  login: () => {
    window.location.href = `${API_BASE_URL}/auth/login`
  },
  logout: async () => {
    await api.post('/auth/logout')
    window.location.href = '/login'
  },
  getMe: () => api.get('/auth/me'),
}

// Workflow API
export const workflowApi = {
  create: (data: { 
    name: string
    actions: string[]
    actionConfigs?: Record<string, any>
    canvasData?: { nodes: any[]; edges: any[] }
    trigger?: string
  }) => api.post('/workflow', data),
  getAll: () => api.get('/workflow'),
  getOne: (id: string) => api.get(`/workflow/${id}`),
  run: (id: string, data: any) => api.post(`/workflow/run/${id}`, data),
  delete: (id: string) => api.delete(`/workflow/${id}`),
}

// MOM API
export const momApi = {
  generate: (meetingNotes: string) => api.post('/mom/generate', { meetingNotes }),
}

// Logs API
export const logsApi = {
  getAll: (params?: { limit?: number; skip?: number }) =>
    api.get('/logs', { params }),
  getOne: (id: string) => api.get(`/logs/${id}`),
}

export default api

