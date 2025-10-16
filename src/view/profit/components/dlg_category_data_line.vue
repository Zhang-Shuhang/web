<template>
  <el-drawer :visible.sync="$attrs.visible" title="类目数据" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <ve-line-chart :data="chartData" :settings="chartSettings" />
  </el-drawer>
</template>
<script>

import {profitListCategory} from "@/api/profit/list";

export default {
  name: 'KdxDlgProfitCategoryDataLine',

  data() {
    return {
      chartData: {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: [{
          name: '单量',
          data: []
        }]
      },
      chartSettings: {
        smooth: true,
        yAxisLabelColor: 'rgba(209, 10, 220, 1)',
        xAxisLabelColor: 'rgba(14, 33, 237, 1)'
      },
    };
  },
  watch: {},
  props: {
    category: {
      type: String,
    },
  },
  created() {},
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      // 请求数据
      let params = {}
      params.page_size = 1000
      params.categories = [this.category]
      let resp = await profitListCategory(params)
      if (resp.code) {
        return
      }

      this.tableData = resp.data.list

      let chartData = {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: [{
          name: '单量',
          data: []
        }]
      }

      for (let i = resp.data.list.length - 1; i >= 0; i--) {
        let d = resp.data.list[i]
        chartData.dimensions.data.push(d.date)
        chartData.measures[0].data.push(d.total_count)
      }

      this.chartData = chartData
    },
  },
}
</script>
