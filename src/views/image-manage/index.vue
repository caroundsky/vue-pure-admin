<template>
  <div class="image-manage">
    <Listview class="listview" v-bind="lvConfig" ref="listview" />
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted, computed } from "vue"
// @ts-ignore
import { Listview } from "@laomao800/vue-listview"
import useDialog from "@caroundsky/el-plus-dialog-service"
import { Edit, Delete } from "@element-plus/icons-vue"
import Modal from "./modal.vue"

import { baseUrlApi } from "@/utils"
import { getToken, formatToken } from "@/utils/auth"
import dayjs from "dayjs"
import { message } from "@/utils/message"
import { useEventListener, useDebounceFn } from "@vueuse/core"

import { delImage, getTag } from "@/api/images-manage"

import CosSdk from "./cosSDK"

const $cos = new CosSdk()

defineOptions({
  name: "ImageManage"
})

const listview = ref(null)
const tagList = ref([])

const filterModel = reactive({
  timeRange: [],
  tagList: []
})
const filterFields = [
  {
    label: "月相片份",
    type: "monthRange",
    model: "timeRange",
    componentAttrs: {
      valueFormat: "YYYY-MM"
    }
  },
  {
    label: "标签",
    type: "select",
    model: "tagList",
    multiple: true,
    width: 200,
    options: tagList
  }
]
const filterButtons = [
  {
    text: "添加",
    type: "success",
    onClick: () => handleModal()
  }
]
const tableColumns = [
  {
    label: "相片",
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
    label: "相片名称",
    minWidth: "150",
    prop: "name"
  },
  {
    label: "描述",
    minWidth: "150",
    prop: "desc",
    "show-overflow-tooltip": true
  },
  {
    label: "标签",
    minWidth: "150",
    formatter: row => {
      return tagListMap.value[row.tag]
    }
  },
  {
    label: "相片月份",
    width: "150",
    prop: "time_range"
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
              delImage(row.id).then(({ success, data }) => {
                if (success) {
                  message(data.message, { type: "success" })
                  listview.value.search(true)
                  $cos.delCosImg(row.key)
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
  requestUrl: baseUrlApi("/images/query-page"),
  pagePosition: "right",
  // height: "100%",
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
  tableColumns,
  filterFields
})

function handleModal(type = "add", row?) {
  const isEdit = type === "edit"
  useDialog({
    title: `${isEdit ? "编辑" : "添加"}图片`,
    width: "800px",
    fullScreenEnable: false,
    content: <Modal row-data={row} tag-list={tagList} />,
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

const tagListMap = computed(() => {
  return tagList.value.reduce((result, cur) => {
    result[cur.id] = cur.tag
    return result
  }, {})
})

onMounted(() => {
  getTag().then(({ data }) => {
    tagList.value = data.map(item => {
      return {
        label: item.tag,
        value: item.id,
        ...item
      }
    })
  })
})

useEventListener(
  window,
  "resize",
  useDebounceFn(() => {
    listview.value.updateLayout()
  }, 100)
)
</script>

<style lang="scss" scoped>
.image-manage {
  &.main-content {
    margin: 0;
    padding: 10px 10px 0 10px;
  }
}
</style>
