/**
 * 从URI中获取域名或者ip地址
 * @param uri
 */
export const domainNameFromUri = (uri: string): string => {
  const urlArr = uri.split("/")
  return urlArr[0].includes("http") ? `${urlArr[0]}//${urlArr[2]}` : urlArr[0]
}

/**
 * 去掉url的参数
 * @param url
 * @returns {any}
 */
export function removeUrlParams(url: string): string {
  if (url) {
    url = url.replace(/#/, "")
    if (url.indexOf("?") !== -1) {
      return url.substring(0, url.indexOf("?"))
    }
  }
  return url
}

/**
 * 根据URL获取图片格式
 * @param url
 */
export const imageTypeFromUrl = (url: string): string => {
  return removeUrlParams(url)?.split(".").pop()
}

/**
 * 将image标签转为base64编码
 */
export type ImageToBase64Props = {
  image: HTMLImageElement
  width?: number // 宽度 默认图片宽度
  height?: number // 高度 默认图片高度
  type?: ImageType // 图片类型 默认'image/png'
  opacity?: number // 透明度 默认1
}
export const imageToBase64 = ({
  image,
  width,
  height,
  type,
  opacity
}: ImageToBase64Props) => {
  const canvas = document.createElement("canvas")
  const currentWidth = width || image.width
  const currentHeight = height || image.height
  canvas.width = currentWidth
  canvas.height = currentHeight
  canvas?.getContext("2d")?.drawImage(image, 0, 0, currentWidth, currentHeight)
  return toBase64({
    canvas,
    type: type || "image/png",
    encoderOptions: opacity
  })
}

export const isUndefined = val => {
  return typeof val === "undefined"
}
/**
 * 基于canvas进行图片转换成base64
 * @param canvas
 * @param type
 * @param encoderOptions
 */
export const toBase64 = ({ canvas, type, encoderOptions }): string => {
  if (canvas?.toDataURL) {
    const base64Str = canvas.toDataURL(
      type || "image/png",
      isUndefined(encoderOptions) ? 1 : encoderOptions
    )
    canvas = null
    return base64Str
  }
  return ""
}

/**
 * imageUrlToBase64转base64
 * @param url
 * @param isProxy 是否需要前端处理代理 默认为true 如果服务端配置好允许跨域 则可设置为false
 */
type ImageUrlToBase64 = (url: string, isProxy: boolean) => Promise<string>
type ImageType = "image/png" | "image/jpeg" | "image/jpg" | "image/webp"
export const imageUrlToBase64: ImageUrlToBase64 = (
  url: string,
  isProxy = true
) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    // image.setAttribute("crossOrigin", "Anonymous")
    const currentSrc = isProxy ? url?.replace(domainNameFromUri(url), "") : url
    image.src = currentSrc
    image.onload = () => {
      const type = `image/${imageTypeFromUrl(url)}` as ImageType
      const base64 = imageToBase64({
        image,
        type: type
      })
      resolve(base64)
    }
    image.onerror = () => {
      reject(new Error(`image by ${url} error`))
    }
  })
  //   var canvas = document.createElement("canvas"),
  //     ctx = canvas.getContext("2d"),
  //     img = new Image()

  //   // img.crossOrigin = "Anonymous"
  //   img.setAttribute("crossOrigin", "Anonymous")
  //   img.onload = function () {
  //     console.log(img)
  //     canvas.height = img.height
  //     canvas.width = img.width
  //     ctx.drawImage(img, 0, 0)
  //     var dataURL = canvas.toDataURL("image/png")
  //     canvas = null
  //     resolve(dataURL)
  //   }
  //   img.src = url + "?time=" + new Date().valueOf()
  // })
}

/**
 * base64 转blob
 * @param dataurl
 */
export const base642Blob = (dataurl: string) => {
  let arr: any = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * blob转file
 * @param theBlob
 * @param fileName
 */
export const blob2File = (theBlob: any, fileName: any) => {
  theBlob.lastModifiedDate = new Date()
  theBlob.name = fileName
  return theBlob
}

/**
 * base64转file类型
 * @param dataurl
 */
export const base642File = (base64: string): File => {
  return blob2File(base642Blob(base64), Date.now())
}
