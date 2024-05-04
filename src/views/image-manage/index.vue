<template>
  <div class="image-manage">
    <Listview v-bind="lvConfig" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Listview } from "@laomao800/vue-listview"
import { ref, reactive } from "vue"

import { baseUrlApi } from "@/utils"
import { getToken, formatToken } from "@/utils/auth"

defineOptions({
  name: "ImageManage"
})

const filterModel = reactive({})
const tableColumns = [
  {
    label: "业务来源单号",
    minWidth: "150",
    prop: "customerOrderNo"
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
    items: "result.results",
    total: "result.total"
  },
  filterModel,
  tableColumns
})
</script>

<style lang="scss" scoped>
.image-manage {
  height: 100%;
  &.main-content {
    margin: 0;
    padding: 10px;
  }
}
</style>
