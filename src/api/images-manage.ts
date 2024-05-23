import { http } from "@/utils/http"
import CosSdk from "@/views/image-manage/cosSDK"

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

export const getTag = () => {
  return http.request<Result>("get", "/images/get-tag")
}

export const modifyTag = data => {
  return http.request<Result>("post", "/images/modify-tag", { data })
}

export const addTag = data => {
  return http.request<Result>("post", "/images/add-tag", { data })
}

export const delTag = id => {
  return http.request<{
    success: boolean
    data: {
      message: string
    }
  }>("post", "/images/del-tag", { data: { id } })
}

export const tinypng = file => {
  return http.request<any>(
    "post",
    "/images/tiny-images",
    {
      data: file,
      responseType: "blob",
      headers: {
        "Content-Type": "multipart/form-data"
      }
    },
    {
      beforeResponseCallback(res) {
        const count = res.headers["compression-count"]
        CosSdk.count = count
        return res
      }
    }
  )
}
