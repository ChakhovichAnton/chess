import { User } from "../types"
import api from "../utils/axios"

export const getUser = async (userId: number) => {
  const res = await api.get(`/api/account/user/${userId}/`)
  return res.data as User
}
