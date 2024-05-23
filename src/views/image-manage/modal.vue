<template>
  <div class="images-modal">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item label="相片地址：" prop="url">
        <template v-if="form.url">
          <el-input
            v-model="form.url"
            placeholder="请输入图片地址"
            disabled
            style="width: 80%; margin-right: 10px"
          />
          <el-button type="primary" @click="form.url = ''">
            重新上传
          </el-button>
        </template>
        <el-upload
          v-else
          ref="uploadRef"
          :limit="1"
          :with-credentials="true"
          accept=".jpg,.png,.jpeg"
          :http-request="handleUpload"
          :auto-upload="false"
          style="width: 100%"
        >
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>

      <el-form-item label="压缩图片：">
        <el-switch
          v-model="zipImg"
          inline-prompt
          active-text="是"
          inactive-text="否"
        />
        <span
          v-if="CosSdk.count !== null"
          style="font-size: 12px; margin-left: 10px"
          >可压缩次数：{{ remainTime }}</span
        >
      </el-form-item>

      <el-form-item
        label="相片名称："
        prop="name"
        :rules="[
          { required: true, trigger: 'blur', message: '请输入图片名称' }
        ]"
      >
        <el-input v-model="form.name" placeholder="请输入图片名称" />
      </el-form-item>

      <el-form-item
        label="标签："
        prop="tag"
        :rules="[{ required: true, trigger: 'blur', message: '请选择标签' }]"
      >
        <el-select v-model="form.tag" placeholder="请选择标签">
          <el-option
            v-for="item in tagList"
            :key="item.id"
            :label="item.tag"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="日期：" prop="time_range">
        <el-date-picker
          v-model="form.time_range"
          type="month"
          value-format="YYYY-MM"
          placeholder="月份"
        />
      </el-form-item>

      <el-form-item label="描述：" prop="desc">
        <el-input
          v-model="form.desc"
          type="textarea"
          placeholder="请输入简述"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="tsx">
import { reactive, computed, toRefs, ref } from "vue"
import { addImage, modifyImage } from "@/api/images-manage"
import { message } from "@/utils/message"
import type { FormInstance, UploadInstance } from "element-plus"
import getImgWH from "get-img-wh"

import CosSdk from "./cosSDK"

defineOptions({
  name: "ImagesModal"
})

const $cos = new CosSdk()
const uploadRef = ref<UploadInstance>()
const zipImg = ref(true)
const remainTime = computed(() => {
  if (CosSdk.count) {
    return 500 - CosSdk.count
  } else {
    return ""
  }
})

const props = defineProps(["rowData", "tagList"])
const { rowData, tagList } = toRefs(props)

const isEdit = computed(() => {
  return !!rowData.value
})

const formRef = ref<FormInstance>()

const form = reactive({
  url: "",
  key: "",
  name: "",
  desc: "",
  tag: null,
  time_range: null
})

Object.assign(form, rowData.value)

const proxyDialog = reactive({
  loading: (load: boolean) => {},
  search: () => {}
})
function submit({ loading, search }) {
  proxyDialog.loading = loading
  proxyDialog.search = search

  formRef.value.validate(async valid => {
    if (valid) {
      if (form.url) {
        formSubmit({
          width: rowData.value.width,
          height: rowData.value.height
        })
      } else {
        uploadRef.value!.submit()
      }
    }
  })
}

async function formSubmit({ width, height }) {
  if (!form.url) {
    message(`未检测到图片地址，请重新上传`, { type: "warning" })
    return
  }
  // @ts-ignore
  const { success } = isEdit.value
    ? await modifyImage({
        id: rowData.value.id,
        ...form,
        width,
        height
      }).catch(() => proxyDialog.loading(false))
    : await addImage({
        ...form,
        width,
        height
      }).catch(() => proxyDialog.loading(false))
  if (!success) return
  message(`${isEdit.value ? "编辑" : "添加"}成功`, { type: "success" })
  proxyDialog.search()
}

async function handleUpload({ file }) {
  const { width, height } = await getImgWH(file).catch(err => {
    message("图片读取失败，请重新上传", { type: "warning" })
  })
  if (!width || !height) {
    message("图片宽高读取失败，请重新上传", { type: "warning" })
    return
  }
  proxyDialog.loading(true)
  if (zipImg.value) {
    $cos
      .compressImg(file)
      .then(({ Location, Key }: any) => {
        form.url = Location
        form.key = Key
        formSubmit({ width, height })
      })
      .finally(() => {
        proxyDialog.loading(false)
      })
  } else {
    $cos
      .upload(file)
      .then(({ Location, Key }: any) => {
        form.url = Location
        form.key = Key
        formSubmit({ width, height })
      })
      .finally(() => {
        proxyDialog.loading(false)
      })
  }
}

defineExpose({
  submit
})
</script>

<style lang="scss" scoped>
.images-modal {
  padding: 20px 40px 10px;
}
</style>
