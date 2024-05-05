<template>
  <div class="image-manage">
    <Listview class="listview" v-bind="lvConfig" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive } from "vue"
// @ts-ignore
import { Listview } from "@laomao800/vue-listview"
import useDialog from "@caroundsky/el-plus-dialog-service"

import { baseUrlApi } from "@/utils"
import { getToken, formatToken } from "@/utils/auth"

import { Edit } from "@element-plus/icons-vue"
import Modal from "./modal.vue"

defineOptions({
  name: "ImageManage"
})

const filterModel = reactive({})
const filterButtons = [
  {
    text: "添加",
    type: "success",
    onClick: () => {
      useDialog({
        title: "添加图片",
        width: "800px",
        fullScreenEnable: false,
        content: <Modal />,
        buttons: [
          {
            label: "确认",
            type: "primary",
            loading: false,
            onClick: ({ vm }) => {
              vm.hide()
            }
          },
          {
            label: "取消",
            onClick: ({ vm }) => {
              vm.hide()
            }
          }
        ]
      })
    }
  }
]
const tableColumns = [
  {
    label: "图片",
    width: "150",
    prop: "url",
    render: ({ row }) => {
      return (
        <el-image
          style="width: 60px; height: 60px"
          src={row.url}
          fit="contain"
          preview-src-list={[row.url]}
          preview-teleported={true}
        />
      )
    }
  },
  {
    label: "图片名称",
    minWidth: "150",
    prop: "name"
  },
  {
    label: "标签",
    minWidth: "150",
    prop: "tag"
  },
  {
    label: "操作",
    width: "100",
    render: () => {
      return <elButton type="primary" size="small" icon={Edit} />
    }
  }
]

const lvConfig = ref({
  requestUrl: baseUrlApi("/images/query-page"),
  pagePosition: "right",
  height: "100%",
  requestConfig: {
    headers: {
      Authorization: formatToken(getToken().accessToken)
    }
  },
  usePage: {
    pageIndex: "pageIndex",
    pageSize: "pageSize"
  },
  contentDataMap: {
    items: "data.result",
    total: "data.total"
  },
  filterModel,
  filterButtons,
  tableColumns
})
</script>

<style lang="scss" scoped>
.image-manage {
  height: 91vh;
  &.main-content {
    margin: 0;
    padding: 10px;
  }
}
</style>
