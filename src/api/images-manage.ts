import { http } from "@/utils/http"

type Result = {
  success: boolean
  data: Array<any>
}

export const modifyImage = (id) => {
  return http.request<Result>("post", "/images/modify-image", { data: id })
}
