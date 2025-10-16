<template>
  <div :style="{height: `${charWrapHeight}px`, position: 'relative' }">
    <vue-lazy-component>
      <ve-line-chart :data="chartData" :settings="chartSettings" :height="chartHeight" :legendVisible="false" :style="{ position: 'relative', top: '-40px' }" />
    </vue-lazy-component>
  </div>
</template>

<script>

export default {
  name: 'Daily',
  components: {},
  props: {
    list: {
      type: Array,
    },
    fields: {
      type: Array,
    },
    field_names: {
      type: Array,
    },
    chartHeight: {
      type: Number,
      default: 250,
    },
    stack: {
      type: Object,
      default: undefined,
    }
  },
  computed: {},
  watch: {
    list() {
      setTimeout(this.updateChartData, 500)
    }
  },
  data() {
    return {
      charWrapHeight : this.chartHeight - 40,
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
        label: {
          show: true,
          fontSize: '12',
          // fontWeight: 'bold'
        },
        smooth: true,
        legendOptions: {
          show: false,
        },
        toolbox: {
          show: false,
        },
        yAxisLabelShow: false,
        yAxisLineShow: false,
        xAxisLabelShow: false,
        xAxisLineShow: false,
        yAxisLabelColor: 'rgba(209, 10, 220, 1)',
        // xAxisLabelColor: 'rgba(14, 33, 237, 1)'
      },
    }
  },
  mounted() {
  },
  methods: {
    updateChartData() {
      this.chartSettings.stack = this.stack
      let chartData = {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: []
      }
      let field_names = this.field_names
      if (!field_names || field_names.length <= 0) {
        field_names = ["总", "VMI", "JIT", "定制", "半托", "Y2"]
      }
      for (let i = 0; i < field_names.length; i++) {
        chartData.measures.push({ name: field_names[i], data: [] })
      }

      let fields = this.fields
      if (!fields || fields.length <= 0) {
        fields = ["count", "vmi_count", "jit_count", "custom_count", "semi_count", "y2_count"]
      }
      for (const d of (this.list || [])) {
        chartData.dimensions.data.push(d.date)

        for (let i = 0; i < fields.length; i++) {
          chartData.measures[i].data.push(d[fields[i]])
        }
      }

      this.chartData = chartData
    }
  },
  filters: {},
  async created() {
    setTimeout(this.updateChartData, 1000 + Math.floor(Math.random() * 3000))
  }
}
</script>
<style scoped lang="scss"></style>