<template>
  <el-drawer :visible.sync="$attrs.visible" title="产品品质分趋势" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <ve-line-chart :data="chartData" :settings="chartSettings"/>
  </el-drawer>
</template>

<script>
import {qualityMetricProductTrend} from "@/api/temu/quality_metric";

export default {
  name: 'DlgQualityTrend',

  data() {
    return {
      chartData: {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: [{
          name: '品质分',
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
    id: {
      type: Number,
    },
  },
  created() {
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      // 请求数据
      let resp = await qualityMetricProductTrend({id: this.id})
      if (resp.code) {
        return
      }

      let chartData = {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: [{
          name: '品质分',
          data: []
        }]
      }

      if (resp.data) {
        for (let i = 0; i < resp.data.length; i++) {
          let d = resp.data[i]
          chartData.dimensions.data.push(d.statDate)
          chartData.measures[0].data.push(d.goodsAfsScore.toFixed(2))
        }
      }

      this.chartData = chartData
    },
  },
}
</script>
