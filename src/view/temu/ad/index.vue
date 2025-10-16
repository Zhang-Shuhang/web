<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label-width="0">
              <el-date-picker
                  v-model="searchInfo.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="6">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" show-summary :summary-method="getSummaries">
        <el-table-column label="账号" prop="report.account.name" align="center">
        </el-table-column>
        <el-table-column label="广告花费" prop="ad_spend" align="center" sortable>
          <div slot-scope="{row}">
            {{ (row.ad_spend / 100).toFixed(2) }}
          </div>
        </el-table-column>
        <el-table-column label="支付金额" prop="order_pay_amt" align="center" sortable>
          <div slot-scope="{row}">
            {{ (row.order_pay_amt / 100).toFixed(2) }}
          </div>
        </el-table-column>
        <el-table-column label="曝光量" prop="impr_cnt" align="center" sortable>
        </el-table-column>
        <el-table-column label="点击" align="center">
          <el-table-column label="次数" prop="clk_cnt" align="center" sortable>
          </el-table-column>
          <el-table-column label="率(CTR)" prop="ctr" align="center" sortable>
            <div slot-scope="{row}">
              {{ (row.ctr / 100).toFixed(2) }}%
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="购物车" prop="cart_cnt" align="center" sortable>
        </el-table-column>
        <el-table-column label="订单量" prop="order_pay_cnt" align="center" sortable>
        </el-table-column>
        <el-table-column label="广告投资回报率 (ROAS)" prop="roas" align="center" sortable>
          <div slot-scope="{row}">
            <template v-if="row.roas > 0">
              <el-tag size="mini" effect="dark" type="danger" v-if="row.roas <= 5000">
                {{ (row.roas / 1000).toFixed(2) }}
              </el-tag>
              <el-tag size="mini" effect="dark" type="warning" v-else-if="row.roas <= 7000">
                {{ (row.roas / 1000).toFixed(2) }}
              </el-tag>
              <el-tag size="mini" effect="dark" type="info" v-else-if="row.roas <= 9000">
                {{ (row.roas / 1000).toFixed(2) }}
              </el-tag>
              <el-tag size="mini" effect="dark" type="success" v-else>{{ (row.roas / 1000).toFixed(2) }}</el-tag>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="广告费比（ACOS）" prop="acos" align="center" sortable>
          <div slot-scope="{row}">
            {{ (row.acos / 100).toFixed(2) }}%
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button style="width: 100%; margin-top: 5px" type="primary" size="mini" @click="openDailyDlg(row.account_id)">历史数据</el-button>
          </div>
        </el-table-column>
      </el-table>

      <TemuDlgAdHistory :table-data="dailyDlg.list" :visible="dailyDlg.visible" @close="dailyDlg.visible=false"></TemuDlgAdHistory>
    </div>
  </div>

</template>

<script>

import {adReportDaily, adReportList} from "@/api/temu/ad";
import TemuDlgAdHistory from "@/view/temu/ad/components/dlg_ad_history.vue";

export default {
  components: {TemuDlgAdHistory},
  mixins: [],
  data() {
    return {
      searchInfo: {},
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const end = new Date();
            end.setTime(end.getTime() - 3600 * 1000 * 24);
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      tableData: [],

      dailyDlg: {
        list: [],
        visible: false,
      },
    }
  },
  computed: {},
  methods: {
    async onSubmit() {
      let resp = await adReportList(this.searchInfo)
      if (resp.code) {
        return
      }

      this.tableData = resp.data
    },
    async openDailyDlg(accountId) {
      let resp = await adReportDaily({id: accountId})
      if (resp.code) {
        return
      }
      this.dailyDlg.list = resp.data
      this.dailyDlg.visible = true
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "order_pay_cnt") {
          const values = data ? data.map(item => { return item.order_pay_cnt }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总计: " + sums[index].toFixed(0)
        }
        if (column.property === "ad_spend") {
          const values = data ? data.map(item => { return item.ad_spend }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总花费: " + (sums[index]/100).toFixed(2)
        }
        if (column.property === "order_pay_amt") {
          const values = data ? data.map(item => { return item.order_pay_amt }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总支付: " + (sums[index]/100).toFixed(2)
        }
      });

      return sums;
    },
  },
  async created() {
    this.$set(this.searchInfo, "date", [new Date(), new Date()])
    this.onSubmit()
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
</style>