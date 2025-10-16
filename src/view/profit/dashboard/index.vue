<template>
  <div>
    <DateSelectTabs @change-tab="getStatisticsList"/>
    
    <el-table :data="showTableData" stripe style="width: 100%"
      :header-cell-style="{ 'background-color': 'black', 'color': '#fff' }" show-summary :summary-method="getSummaries">
      <el-table-column align="center" prop="account.platform" label="平台" sortable>
        <template slot-scope="{row}">
          <el-tag size="small" type="primary" @click="jumpAccount(row.account.platform)" v-if="row.account">
            {{ row.account.platform }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="account.name" label="账号" min-width="150px">
        <template slot="header">
          <div>账号</div>

          <el-select v-model="accounts" placeholder="请选择账号" multiple collapse-tags filterable
                     clearable style="width: 100%">
            <template v-for="(item, index) in tableData">
              <el-option :key="index" :label="item.account.name"
                         :value="item.account_id" v-if="item.account"></el-option>
            </template>
          </el-select>
        </template>
        <template slot-scope="{row}">
          <el-tag size="small" type="primary" @click="jumpAccount(row.account.platform, row.account.id)"
            v-if="row.account">{{ row.account.name }}
          </el-tag>
          <i class="el-icon-data-line" style="color: red; margin-left: 10px"
            @click="openDataLineDlg(row.account_id)"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="account.info.us_ratio" label="美区占比" sortable>
        <template slot-scope="{row}">
          <div v-if="row.account && row.account.info && row.account.info.us_ratio">
            <el-tag size="mini" type="danger" effect="dark">{{row.account.info.us_ratio.toFixed(1)}}%</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单量">
        <el-table-column align="center" prop="total_count" label="总" sortable></el-table-column>
        <el-table-column align="center" prop="total_not_set_count" label="未设置" sortable>
          <template slot-scope="{row}">
            <el-tag type="primary" @click="jumpAccount(row.account.platform)" v-if="row.account">
              {{ row.total_not_set_count }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="vmi_total_count" label="VMI" sortable></el-table-column>
        <el-table-column align="center" prop="jit_total_count" label="JIT" sortable></el-table-column>
        <el-table-column align="center" prop="custom_total_count" label="定制" sortable></el-table-column>
        <el-table-column align="center" prop="semi_total_count" label="半托" sortable></el-table-column>
        <el-table-column align="center" prop="y2_total_count" label="Y2" sortable></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="单量统计" width="300px">
        <template slot="header">
          <div>单量统计</div>

          <el-button size="mini" type="primary" @click="export90Day">
            导出最近90天
          </el-button>
        </template>
        <div slot-scope="{row}">
          <Daily :list="row.daily_list"></Daily>
        </div>
      </el-table-column>
      <el-table-column align="center" label="营收">
        <el-table-column align="center" prop="total_gmv" label="总">
          <template slot-scope="{row}">
            {{ row.total_gmv.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_avg_gmv" label="平均">
          <template slot-scope="{row}">
            {{ row.total_avg_gmv.toFixed(1) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="净收入">
        <el-table-column align="center" prop="total_net_income" label="总">
          <template slot-scope="{row}">
            {{ row.total_net_income.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_avg_net_income" label="平均">
          <template slot-scope="{row}">
            {{ row.total_avg_net_income.toFixed(1) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="成本">
        <el-table-column align="center" prop="total_cost" label="总">
          <template slot-scope="{row}">
            {{ row.total_cost.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_avg_cost" label="平均">
          <template slot-scope="{row}">
            {{ row.total_avg_cost.toFixed(1) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="费用">
        <el-table-column align="center" prop="total_fee" label="总">
          <template slot-scope="{row}">
            {{ row.total_fee.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_avg_fee" label="平均">
          <template slot-scope="{row}">
            {{ row.total_avg_fee.toFixed(1) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="利润">
        <el-table-column align="center" prop="total_profit" label="总">
          <template slot-scope="{row}">
            {{ row.total_profit.toFixed(1) }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_avg_profit" label="平均">
          <template slot-scope="{row}">
            {{ row.total_avg_profit.toFixed(1) }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="仓库">
        <el-table-column align="center" prop="total_stock" label="数量">
        </el-table-column>
        <el-table-column align="center" prop="total_stock_cost" label="金额">
          <template slot-scope="{row}">
            {{ row.total_stock_cost.toFixed(1) }}
          </template>
        </el-table-column>
      </el-table-column>
      <!--            <el-table-column label="总" align="center">-->
      <!--            </el-table-column>-->
      <!--            <el-table-column label="非广告" align="center">-->
      <!--                <el-table-column align="center" prop="direct_count" label="单量"></el-table-column>-->
      <!--                <el-table-column align="center" label="营收">-->
      <!--                    <el-table-column align="center" prop="direct_gmv" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_gmv.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="direct_avg_gmv" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_avg_gmv.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="净收入">-->
      <!--                    <el-table-column align="center" prop="direct_net_income" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_net_income.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="direct_avg_net_income" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_avg_net_income.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="成本">-->
      <!--                    <el-table-column align="center" prop="direct_cost" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_cost.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="direct_avg_cost" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_avg_cost.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="费用">-->
      <!--                    <el-table-column align="center" prop="direct_fee" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_fee.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="direct_avg_fee" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_avg_fee.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="利润">-->
      <!--                    <el-table-column align="center" prop="direct_profit" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_profit.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="direct_avg_profit" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.direct_avg_profit.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--            </el-table-column>-->
      <!--            <el-table-column label="广告" align="center">-->
      <!--                <el-table-column align="center" prop="ad_count" label="单量"></el-table-column>-->
      <!--                <el-table-column align="center" label="营收">-->
      <!--                    <el-table-column align="center" prop="ad_gmv" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_gmv.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="ad_avg_gmv" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_avg_gmv.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="净收入">-->
      <!--                    <el-table-column align="center" prop="ad_net_income" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_net_income.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="ad_avg_net_income" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_avg_net_income.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="成本">-->
      <!--                    <el-table-column align="center" prop="ad_cost" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_cost.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="ad_avg_cost" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_avg_cost.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="费用">-->
      <!--                    <el-table-column align="center" prop="ad_fee" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_fee.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="ad_avg_fee" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_avg_fee.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--                <el-table-column align="center" label="利润">-->
      <!--                    <el-table-column align="center" prop="ad_profit" label="总">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_profit.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                    <el-table-column align="center" prop="ad_avg_profit" label="平均">-->
      <!--                        <template slot-scope="{row}">-->
      <!--                            {{row.ad_avg_profit.toFixed(1)}}-->
      <!--                        </template>-->
      <!--                    </el-table-column>-->
      <!--                </el-table-column>-->
      <!--            </el-table-column>-->
    </el-table>

    <KdxDlgProfitAccountDataLine :id="dlgProfitDataLine.id" :visible="dlgProfitDataLine.visible"
      @close="dlgProfitDataLine.visible = false"></KdxDlgProfitAccountDataLine>
  </div>
</template>
<script>
import {profitStatisticsListAccount, profitStatisticsListExportAccount} from "@/api/profit/statistics";
import KdxDlgProfitAccountDataLine from "@/view/profit/components/dlg_account_data_line.vue";
import Daily from "@/view/components/daily.vue";
import DateSelectTabs from "@/view/profit/components/date_select_tabs.vue";

export default {
  components: { Daily, KdxDlgProfitAccountDataLine, DateSelectTabs },
  data() {
    return {
      tableData: [],
      accounts: [],
      dlgProfitDataLine: {
        id: undefined,
        visible: false,
      }
    };
  },
  computed: {
    showTableData() {
      if (!this.accounts || this.accounts.length === 0) {
        return this.tableData
      }
      return this.tableData.filter(item => {return this.accounts.indexOf(item.account_id) >= 0})
    }
  },
  methods: {
    async getStatisticsList(start_time, end_time) {
      let resp = await profitStatisticsListAccount({ start_time, end_time })
      if (resp.code === 0) {
        this.tableData = resp.data
      }
    },
    jumpAccount(pt, id = 0) {
      this.$router.push({ name: `${pt}_profit_list`, query: { pt: pt, id: id } })
    },
    openDataLineDlg(accountId) {
      this.dlgProfitDataLine.id = accountId
      this.dlgProfitDataLine.visible = true
    },
    async export90Day() {
      let resp = await profitStatisticsListExportAccount()
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank")
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      let total_count, direct_count, ad_count = 0
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (column.property === "total_count") {
          total_count = values.reduce((a, b) => a + b, 0)
        } else if (column.property === "direct_count") {
          direct_count = values.reduce((a, b) => a + b, 0)
        } else if (column.property === "ad_count") {
          ad_count = values.reduce((a, b) => a + b, 0)
        }
        if (column.label === "总" || column.label === "未设置" || column.label === "单量" || column.label === "数量" || column.label === "金额"
          || column.label === "VMI" || column.label === "JIT" || column.label === "定制" || column.label === "半托" || column.label === "Y2") {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        }
      });

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        if (column.label === "平均") {
          if (column.property.startsWith("total_")) {
            sums[index] = sums[index - 1] / total_count
          } else if (column.property.startsWith("direct_")) {
            sums[index] = sums[index - 1] / direct_count
          } else if (column.property.startsWith("ad_")) {
            sums[index] = sums[index - 1] / ad_count
          }
          sums[index] = sums[index].toFixed(1)
        }
      });

      return sums;
    }
  }
};
</script>
<style scoped>
::v-deep .el-tabs__content {
  display: none;
}
</style>