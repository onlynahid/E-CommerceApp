import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

const STORAGE_KEYS = {
  TOKEN: 'ayyuaz_token',
  USER: 'ayyuaz_user',
}

export const axiosInstance = axios.create({
  baseURL: 'https://localhost:7038/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    // ✅ Default Accept ok
    Accept: 'application/json',
    // ❌ Content-Type default vermirik (FormData-ya mane olur)
  },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ JWT token injection
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // ✅ FormData detection
    const isFormData =
      typeof FormData !== 'undefined' && config.data instanceof FormData

    if (isFormData) {
      // ✅ FormData olanda Content-Type-i SİL
      // Axios özü multipart boundary əlavə edəcək
      delete (config.headers as any)['Content-Type']
      delete (config.headers as any)['content-type']
    } else {
      // ✅ JSON requestlər üçün Content-Type təmin et
      // (GET-lərdə body olmaya bilər; problem yaratmır)
      if (!(config.headers as any)['Content-Type'] && !(config.headers as any)['content-type']) {
        ;(config.headers as any)['Content-Type'] = 'application/json'
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // ✅ Network / CORS / backend down
    if (!error.response) {
      console.error('Network error:', {
        message: error.message,
        code: error.code,
      })
      return Promise.reject(error)
    }

    const status = error.response.status

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      console.warn('401 Unauthorized → token cleared')
      // istəsən redirect:
      // window.location.href = '/admin/login'
    }

    if (status === 403) {
      console.warn('403 Forbidden')
    }

    return Promise.reject(error)
  }
)
