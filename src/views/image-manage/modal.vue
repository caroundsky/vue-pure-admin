<template>
  <div class="images-modal">
    <el-form :model="form" label-width="100px">
      <el-form-item
        label="图片地址："
        prop="url"
        :rules="[
          { required: true, trigger: 'blur', message: '请输入图片地址' }
        ]"
      >
        <el-input v-model="form.url" placeholder="请输入图片地址" />
      </el-form-item>

      <el-form-item
        label="图片名称："
        prop="name"
        :rules="[
          { required: true, trigger: 'blur', message: '请输入图片名称' }
        ]"
      >
        <el-input v-model="form.name" placeholder="请输入图片名称" />
      </el-form-item>

      <el-form-item
        label="描述："
        prop="desc"
        :rules="[{ required: true, trigger: 'blur', message: '请输入描述' }]"
      >
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
import { reactive } from "vue"
import { modifyImage } from "@/api/images-manage"
import { message } from "@/utils/message"

defineOptions({
  name: "ImagesModal"
})

const { rowData } = defineProps(["rowData"])

const form = reactive({
  url: "",
  name: "",
  desc: "",
  tag: null
})

Object.assign(form, rowData)

async function submit({ loading, search }) {
  loading(true)
  const { success } = await modifyImage({ id: rowData.id, ...form }).catch(() =>
    loading(false)
  )
  if (!success) return
  message("保持成功", { type: "success" })
  search()
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
