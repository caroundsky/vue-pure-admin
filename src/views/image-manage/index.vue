<template>
  <div class="image-manage">
    <Listview class="listview" v-bind="lvConfig" ref="listview" />
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

const listview = ref(null)
const filterModel = reactive({})
const filterButtons = [
  {
    text: "添加",
    type: "success",
    onClick: () => handleModal()
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
    label: "更新时间",
    minWidth: "150",
    prop: "updateTime"
  },
  {
    label: "操作",
    width: "100",
    render: ({ row }) => {
      return (
        <elButton
          type="primary"
          size="small"
          icon={Edit}
          onClick={() => handleModal("edit", row)}
        />
      )
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

function handleModal(type = "add", row?) {
  const isEdit = type === "edit"
  useDialog({
    title: `${isEdit ? "编辑" : "添加"}图片`,
    width: "800px",
    fullScreenEnable: false,
    content: <Modal row-data={row} />,
    buttons: [
      {
        label: "保存",
        type: "primary",
        loading: false,
        onClick: ({ vm, component, ctx }) => {
          component.submit({
            loading(loading: boolean) {
              ctx.loading = loading
            },
            search: () => {
              vm.hide()
              listview.value.search(true)
            }
          })
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
