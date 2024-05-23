import { localForage } from "@/utils/localforage"
import { message } from "@/utils/message"
import COS from "cos-js-sdk-v5"

import { sts } from "@/api/user"
import { tinypng } from "@/api/images-manage"

let proxy
const $localForage = localForage()

export default class CosSdk {
  cos_sdk_local = null
  static count: any = null

  private $cos

  get isExpired() {
    const expiredTime = this.cos_sdk_local.expiredTime
    const nowTime = Math.floor(new Date().getTime() / 1000)
    return nowTime - expiredTime >= 0
  }

  constructor() {
    if (proxy) return proxy
    this.init()
      .then(() => {
        if (this.$cos) return
        const { credentials, startTime, expiredTime } = this.cos_sdk_local
        this.$cos = new COS({
          getAuthorization: function (options, callback) {
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              StartTime: startTime,
              ExpiredTime: expiredTime
            })
          }
        })
      })
      .finally(() => {
        proxy = this
      })
  }

  async init() {
    const cos_sdk_local: any = await $localForage.getItem("cos-sdk")
    this.cos_sdk_local = cos_sdk_local
    if (this.cos_sdk_local && !this.isExpired) {
      return
    }
    const { success, data } = await sts()
    if (!success) return
    $localForage.setItem("cos-sdk", data)
    this.cos_sdk_local = data
  }

  compressImg(file: File) {
    const formData = new FormData()
    const { name, type } = file
    formData.append("file", file)
    return new Promise(async resolve => {
      const blob = await tinypng(formData)
      const tinyFile = new File([blob], name, {
        lastModified: new Date().getTime(),
        type
      })
      const { Location, Key } = await this.upload(tinyFile)
      resolve({ Location, Key })
    })
  }

  upload(file: File) {
    return new Promise<any>((resolve, reject) => {
      const Key = `pic/${file.name}`
      this.$cos.uploadFile(
        {
          Bucket: "" /* 填入您自己的存储桶，必须字段 */,
          Region: "ap-guangzhou" /* 存储桶所在地域，例如ap-beijing，必须字段 */,
          Key /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
          Body: file /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        },
        function (err, data) {
          if (err) {
            message("上传失败，" + err, { type: "error" })
            reject(err)
          } else {
            if (data.statusCode === 200) {
              const Location = `//cos.caroundsky.site${data.Location.split("ap-guangzhou.myqcloud.com")[1]}`
              resolve({
                Location,
                Key
              })
            } else {
              message("上传失败，" + data, { type: "error" })
              reject(data)
            }
          }
        }
      )
    })
  }

  delCosImg(key) {
    if (!key) return
    this.$cos.deleteObject(
      {
        Bucket: "home-1317978552",
        Region: "ap-guangzhou",
        Key: key
      },
      function (err, data) {
        console.log(err || data)
      }
    )
  }
}
