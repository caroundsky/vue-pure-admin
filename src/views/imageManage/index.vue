<template>
  <!-- <Listview v-bind="lvConfig" /> -->
  <div>11</div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Listview } from "@laomao800/vue-listview";
// import { ref, reactive } from "vue";

defineOptions({
  name: "ImageManage"
});

// const { VITE_ENV } = import.meta.env;

// const filterModel = reactive({});
// const tableColumns = [
//   {
//     label: "业务来源单号",
//     minWidth: "150",
//     prop: "customerOrderNo"
//   }
// ];

// const lvConfig = ref({
//   requestUrl: `${VITE_ENV === "dev" ? "/api" : ""}/images/search-page`,
//   pagePosition: "right",
//   usePage: {
//     pageIndex: "pageIndex",
//     pageSize: "pageSize"
//   },
//   contentDataMap: {
//     items: "result.results",
//     total: "result.total"
//   },
//   filterModel,
//   tableColumns
// });
</script>
