<template>
  <el-drawer :visible.sync="$attrs.visible" title="每日统计" @opened="onOpened" :size="isMobile ? '100%' : '70%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="showTable">
      <el-table-column label="日期" prop="date" align="center">
      </el-table-column>
      <el-table-column align="center" v-for="(header, index) in tableHeaders" :key="index">
        <template slot="header">
          <span @click="copy(`${header.product_sku_id}`)">{{header.key}}</span>
          <div v-if="header.image">
            <KdxImage :src="header.image"></KdxImage>
          </div>
        </template>
        <div slot-scope="{row}">
          {{row.counts[index]}}
        </div>
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
import {saleItemMultiDailyList} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgMultiDaily',
  components: {KdxImage},
  props: {
    sku_ids: {
      type: Array,
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
      tableHeaders: [],
      tableData: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
      this.tableHeaders = []
      this.tableData = []
    },
    async onOpened() {
      let resp = await saleItemMultiDailyList({ids: this.sku_ids})
      if (resp.code) {
        return
      }

      resp.data = resp.data || []

      let chartData = {
        dimensions: {
          name: '日期',
          data: []
        },
        measures: []
      }
      let headers = []
      for (const d of resp.data) {
        d.count_map = new Map(Object.entries(d.count_map))
        let dates = d.count_map.keys()
        for (const date of dates) {
          if (chartData.dimensions.data.indexOf(date) < 0) {
            chartData.dimensions.data.push(date)
          }
        }
        chartData.measures.push({
          name: d.key,
          data: [],
        })
        headers.push(d)
      }
      chartData.dimensions.data.sort((a, b) => {return a - b})

      let tableData = []
      for (const date of chartData.dimensions.data) {
        let data = {}
        data.date = date
        data.counts = []
        for (let i = 0; i < resp.data.length; i++) {
          let d = resp.data[i]
          let count = d.count_map.get(date) || 0
          chartData.measures[i].data.push(count)
          data.counts.push(count)
        }
        tableData.push(data)
      }

      this.chartData = chartData
      this.tableHeaders = headers
      this.tableData = tableData.reverse()
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
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