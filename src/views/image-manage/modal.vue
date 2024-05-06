<template>
  <div class="images-modal">
    <el-form ref="formRef" :model="form" label-width="100px">
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
import { reactive, computed, ref } from "vue"
import { addImage, modifyImage } from "@/api/images-manage"
import { message } from "@/utils/message"
import type { FormInstance } from "element-plus"

defineOptions({
  name: "ImagesModal"
})

const { rowData } = defineProps(["rowData"])

const isEdit = computed(() => {
  return !!rowData
})

const formRef = ref<FormInstance>()

const form = reactive({
  url: "",
  name: "",
  desc: "",
  tag: null
})

Object.assign(form, rowData)

function submit({ loading, search }) {
  formRef.value.validate(async valid => {
    if (valid) {
      loading(true)
      const { success } = isEdit.value
        ? await modifyImage({ id: rowData.id, ...form }).catch(() =>
            loading(false)
          )
        : await addImage(form).catch(() => loading(false))
      if (!success) return
      message(`${isEdit.value ? "保存" : "添加"}成功`, { type: "success" })
      search()
    }
  })
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
