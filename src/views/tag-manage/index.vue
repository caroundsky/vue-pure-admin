<template>
  <div class="image-manage">
    <Listview class="listview" v-bind="lvConfig" ref="listview" />
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue"
// @ts-ignore
import { Listview } from "@laomao800/vue-listview"

import { baseUrlApi } from "@/utils"
import dayjs from "dayjs"
import { getToken, formatToken } from "@/utils/auth"

defineOptions({
  name: "TagManage"
})

const tableColumns = [
  {
    label: "标签",
    minWidth: "150",
    prop: "tag"
  },
  {
    label: "更新时间",
    minWidth: "150",
    prop: "update_time",
    formatter: row =>
      row.update_time
        ? dayjs(row.update_time).format("YYYY-MM-DD HH:mm:ss")
        : ""
  }
]

const lvConfig = ref({
  requestUrl: baseUrlApi("/images/query-tag"),
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
