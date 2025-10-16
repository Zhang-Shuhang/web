<template>
  <el-drawer :visible.sync="$attrs.visible" title="每日国家统计(统计Skc)" @opened="onOpened" :size="isMobile ? '100%' : '80%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="showTable">
      <el-table-column label="日期" prop="date" align="center">
      </el-table-column>
      <el-table-column :label="header.name" align="center" v-for="(header, index) in headers" :key="index">
        <template slot-scope="{row}">
          {{getQuantity(row, header.id)}}
        </template>
      </el-table-column>
    </el-table>
    <ve-line-chart :data="chartData" :settings="chartSettings" :height="700" v-else />
    <div slot="title" class="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        每日国家统计(统计Skc)
      </div>
      <el-switch style="display: block; float: right; height: 24px; line-height: 22px" v-model="showTable" active-text="表格" inactive-text="折线"></el-switch>
    </div>
  </el-drawer>
</template>

<script>
import {saleCountryRecords} from "@/api/temu/sale";

export default {
  name: 'TemuDlgCountryDaily',
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
        smooth: true,
        yAxisLabelColor: 'rgba(209, 10, 220, 1)',
        xAxisLabelColor: 'rgba(14, 33, 237, 1)'
      },
      headers: [],
      tableData: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    getQuantity(row, id) {
      for (const v of row.list) {
        if (v.id === id) {
          return v.quantity
        }
      }
      return 0
    },
    async onOpened() {
      let resp = await saleCountryRecords({id: this.id})
      if (resp.code) {
        return
      }

      if (resp.data) {
        this.headers = resp.data.headers
        this.tableData = resp.data.rows
      } else {
        this.headers = []
        this.tableData = []
      }

      let chartData = {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: []
      }

      for (const d of this.tableData) {
        chartData.dimensions.data.push(d.date)
      }
      chartData.dimensions.data = chartData.dimensions.data.reverse()

      for (const header of this.headers) {
        let dataArray = []
        for (const d of this.tableData) {
          let quantity = 0
          for (const v of d.list) {
            if (v.id === header.id) {
              quantity = v.quantity
              break
            }
          }
          dataArray.push(quantity)
        }
        chartData.measures.push({name: header.name, data: dataArray.reverse()})
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