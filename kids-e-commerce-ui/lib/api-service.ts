import { axiosInstance } from './axios-instance'

export class APIError extends Error {
  status: number
  data: unknown

  constructor(status: number, message: string, data?: unknown) {
    super(message)
    this.status = status
    this.data = data
  }
}

export const productApiService = {
  async createProduct(formData: FormData) {
    try {
      const res = await axiosInstance.post('/AdminProduct', formData)
      return res.data
    } catch (err: any) {
      const status = err?.response?.status ?? 0
      const data = err?.response?.data
      const message = err?.response?.data?.message ?? err.message ?? 'Request failed'
      throw new APIError(status, message, data)
    }
  },

  async getAllProducts() {
    try {
      const res = await axiosInstance.get('/AdminProduct')
      return res.data
    } catch (err: any) {
      const status = err?.response?.status ?? 0
      const data = err?.response?.data
      const message = err?.response?.data?.message ?? err.message ?? 'Request failed'
      throw new APIError(status, message, data)
    }
  },
}
