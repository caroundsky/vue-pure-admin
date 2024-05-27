<template>
  <div class="image-manage">
    <Listview class="listview" v-bind="lvConfig" ref="listview" />
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
// @ts-ignore
import { Listview } from "@laomao800/vue-listview"
import useDialog from "@caroundsky/el-plus-dialog-service"

import { baseUrlApi } from "@/utils"
import dayjs from "dayjs"
import { getToken, formatToken } from "@/utils/auth"
import { delTag } from "@/api/images-manage"

import { Edit, Delete } from "@element-plus/icons-vue"
import Modal from "./modal.vue"
import { message } from "@/utils/message"

defineOptions({
  name: "TagManage"
})

const listview = ref(null)
const filterButtons = [
  {
    text: "添加",
    type: "success",
    onClick: () => handleModal()
  }
]
const tableColumns = [
  {
    label: "标签",
    minWidth: "150",
    prop: "tag"
  },
  {
    label: "排序",
    prop: "sort"
  },
  {
    label: "更新时间",
    minWidth: "150",
    prop: "update_time",
    formatter: row =>
      row.update_time
        ? dayjs(row.update_time).format("YYYY-MM-DD HH:mm:ss")
        : ""
  },
  {
    label: "操作",
    width: "110",
    render: ({ row }) => {
      return (
        <div>
          <el-button
            type="primary"
            size="small"
            icon={Edit}
            onClick={() => handleModal("edit", row)}
          />
          <el-popconfirm
            title="确认删除吗?"
            onConfirm={() =>
              delTag(row.id).then(({ success, data }) => {
                if (success) {
                  message(data.message, { type: "success" })
                  listview.value.search(true)
                }
              })
            }
          >
            {{
              reference: () => {
                return <el-button type="danger" size="small" icon={Delete} />
              }
            }}
          </el-popconfirm>
        </div>
      )
    }
  }
]

const lvConfig = ref({
  requestUrl: baseUrlApi("/images/query-tag"),
  pagePosition: "right",
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
  tableColumns,
  filterButtons
})

function handleModal(type = "add", row?) {
  const isEdit = type === "edit"
  useDialog({
    title: `${isEdit ? "编辑" : "添加"}标签`,
    width: "500px",
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
              // @ts-ignore
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
  &.main-content {
    margin: 0;
    padding: 10px 10px 0 10px;
  }
}
</style>
