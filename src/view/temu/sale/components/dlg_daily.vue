<template>
  <el-drawer :visible.sync="$attrs.visible" title="每日统计" @opened="onOpened" :size="isMobile ? '100%' : '50%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="showTable">
      <el-table-column label="日期" prop="date" align="center">
      </el-table-column>
      <el-table-column label="单量" prop="count" align="center">
      </el-table-column>
    </el-table>
    <ve-line-chart :data="chartData" :settings="chartSettings" v-else />
    <div slot="title" class="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        每日统计
      </div>
      <el-switch style="display: block; float: right; height: 24px; line-height: 22px" v-model="showTable" active-text="表格" inactive-text="折线"></el-switch>
    </div>
  </el-drawer>
</template>

<script>
import {saleItemDailyList} from "@/api/temu/sale_item";

export default {
  name: 'TemuDlgDaily',
  components: {},
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      isMobile: false,
      showTable: true,
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
          fontWeight: 'bold'
        },
        smooth: true,
        legendOptions: {
          show: false,
        },
        yAxisLabelShow: false,
        yAxisLineShow: false,
        xAxisLabelShow: false,
        xAxisLineShow: false,
        yAxisLabelColor: 'rgba(209, 10, 220, 1)',
        xAxisLabelColor: 'rgba(14, 33, 237, 1)'
      },
      tableData: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await saleItemDailyList({id: this.id})
      if (resp.code) {
        return
      }

      if (resp.data) {
        this.tableData = resp.data.slice().reverse()
      } else {
        this.tableData = []
      }

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

      for (const d of resp.data) {
        chartData.dimensions.data.push(d.date)
        chartData.measures[0].data.push(d.count)
      }

      this.chartData = chartData
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
    this.pageSize = 100
  }
}
</script>
<style scoped lang="scss">
</style>