<template>
  <div>
    <ve-bar-chart :data="chartData" :settings="chartSettings" :height="150"/>
  </div>
</template>

<script>

export default {
  name: 'StockEstimated',
  components: {},
  props: {
    list: {
      type: Array,
    },
  },
  computed: {},
  watch: {
    list() {
      this.updateChartData()
    }
  },
  data() {
    return {
      chartData: {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: [
          {
            name: '起始数量',
            data: []
          },
          {
            name: '结束数量',
            data: []
          },
          {
            name: '入库量',
            data: []
          },
          {
            name: '断货天数',
            data: []
          }
        ]
      },
      chartSettings: {
        label: {
          // show: true,
          fontSize: '12',
          // fontWeight: 'bold'
        },
        smooth: true,
        legendOptions: {
          show: true,
        },
        showLine: ['起始数量', "结束数量", "入库量"],
        // yAxisLabelShow: false,
        // yAxisLineShow: false,
        xAxisLabelShow: false,
        xAxisLineShow: false,
        yAxisLabelColor: 'rgba(209, 10, 220, 1)',
        // xAxisLabelColor: 'rgba(14, 33, 237, 1)'
        secondMeaAxis: '断货天数',
      },
    }
  },
  mounted() {
  },
  methods: {
    updateChartData() {
      let chartData = {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: [
          {
            name: '起始数量',
            data: []
          },
          {
            name: '结束数量',
            data: []
          },
          {
            name: '入库量',
            data: []
          },
          {
            name: '断货天数',
            data: []
          }
        ]
      }

      for (const d of (this.list || [])) {
        chartData.dimensions.data.push(`${d.day}天后`)
        chartData.measures[0].data.push(d.start_count)
        chartData.measures[1].data.push(d.end_count)
        chartData.measures[2].data.push(d.in_bound_count ? d.in_bound_count : "")
        chartData.measures[3].data.push(d.dh_days > 0 ? 1 : 0)
      }

      this.chartData = chartData
    }
  },
  filters: {},
  async created() {
    this.updateChartData()
  }
}
</script>
<style scoped lang="scss">
</style>