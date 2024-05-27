<template>
  <div class="images-modal">
    <el-form ref="formRef" :model="form" label-width="100px">
      <el-form-item
        label="标签："
        prop="tag"
        :rules="[{ required: true, trigger: 'blur', message: '请输入标签名' }]"
      >
        <el-input v-model="form.tag" placeholder="请输入标签名" />
      </el-form-item>

      <el-form-item label="排序：" prop="sort">
        <el-input-number v-model="form.sort" placeholder="请输入序号" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="tsx">
import { reactive, computed, toRefs, ref } from "vue"
import { addTag, modifyTag } from "@/api/images-manage"
import { message } from "@/utils/message"
import type { FormInstance } from "element-plus"

defineOptions({
  name: "ImagesModal"
})

const props = defineProps(["rowData"])
const { rowData } = toRefs(props)

const isEdit = computed(() => {
  return !!rowData.value
})

const formRef = ref<FormInstance>()

const form = reactive({
  tag: "",
  sort: 0
})

Object.assign(form, rowData.value)

function submit({ loading, search }) {
  formRef.value.validate(async valid => {
    if (valid) {
      loading(true)
      const { success } = isEdit.value
        ? await modifyTag({ id: rowData.value.id, ...form }).catch(() =>
            loading(false)
          )
        : await addTag(form).catch(() => loading(false))
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
