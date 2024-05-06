import { http } from "@/utils/http"

type Result = {
  success: boolean
  data: Array<any>
}

export const modifyImage = data => {
  return http.request<Result>("post", "/images/modify-image", { data })
}

export const addImage = data => {
  return http.request<Result>("post", "/images/add-image", { data })
}

export const delImage = id => {
  return http.request<{
    success: boolean
    data: {
      message: string
    }
  }>("post", "/images/del-image", { data: { id } })
}
