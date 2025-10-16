<template>
  <div>
    <DateSelectTabs @change-tab="getStatisticsList"/>

    <el-table :data="tableData" stripe style="width: 100%"
      :header-cell-style="{ 'background-color': 'black', 'color': '#fff' }">
      <el-table-column align="center" prop="tag" label="标签" min-width="100px">
        <template slot-scope="{row}">
          <el-tag size="small" type="primary">{{ row.tag }}</el-tag>
          <i class="el-icon-data-line" style="color: red; margin-left: 10px" @click="openDataLineDlg(row.tag)"></i>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单量">
        <el-table-column align="center" prop="total_count" label="总" sortable="custom"></el-table-column>
        <el-table-column align="center" prop="total_not_set_count" label="未设置" sortable="custom">
          <template slot-scope="{row}">
            <el-tag size="mini" type="primary">{{ row.total_not_set_count }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="vmi_total_count" label="VMI" sortable="custom"></el-table-column>
        <el-table-column align="center" prop="jit_total_count" label="JIT" sortable="custom"></el-table-column>
        <el-table-column align="center" prop="custom_total_count" label="定制" sortable="custom"></el-table-column>
        <el-table-column align="center" prop="semi_total_count" label="半托" sortable="custom"></el-table-column>
        <el-table-column align="center" prop="y2_total_count" label="Y2" sortable></el-table-column>
      </el-table-column>
      <el-table-column align="center" label="单量统计" width="300px">
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
    </el-table>
    <el-pagination :current-page="page" :page-size="pageSize" :style="{ textAlign: 'right' }"
      :page-sizes="[5, 10, 20, 30, 50, 100, 200, 300, 500, 1000]" :total="total" background
      @current-change="handleCurrentChange" @size-change="handleSizeChange"
      layout="total, prev, next, jumper, sizes"></el-pagination>

    <KdxDlgProfitTagDataLine :tags="dlgProfitDataLine.tags" :visible="dlgProfitDataLine.visible"
      @close="dlgProfitDataLine.visible = false"></KdxDlgProfitTagDataLine>
  </div>
</template>
<script>
import { profitStatisticsListTag } from "../../../api/profit/statistics";
import KdxDlgProfitTagDataLine from "@/view/profit/components/dlg_tag_data_line.vue";
import Daily from "@/view/components/daily.vue";
import infoList from "@/components/mixins/infoList";
import DateSelectTabs from "@/view/profit/components/date_select_tabs.vue";

export default {
  components: { Daily, KdxDlgProfitTagDataLine, DateSelectTabs },
  mixins: [infoList],
  data() {
    return {
      listApi: profitStatisticsListTag,

      activeName: 'd1',
      tabList: [],
      dlgProfitDataLine: {
        tags: [],
        visible: false,
      }
    };
  },
  methods: {
    async getStatisticsList(start_time, end_time) {
      this.$set(this.searchInfo, "start_time", start_time)
      this.$set(this.searchInfo, "end_time", end_time)

      this.getTableData()
    },
    openDataLineDlg(tag) {
      this.dlgProfitDataLine.tags = [tag]
      this.dlgProfitDataLine.visible = true
    },
  }
};
</script>
<style scoped>
::v-deep .el-tabs__content {
  display: none;
}

::v-deep .el-table td {
  padding: 0;
}
</style>