<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_ids" placeholder="请选择账号" multiple filterable clearable
                         collapse-tags :style="{width: '100%'}">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker v-model="searchInfo.start_time" type="date" style="width: 100%" placeholder="开始时间"
                              format="yyyy-MM-dd" value-format="yyyy/M/d">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker v-model="searchInfo.end_time" type="date" style="width: 100%" placeholder="结束时间"
                              format="yyyy-MM-dd" value-format="yyyy/M/d">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="8">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" v-model="searchInfo.search_content" clearable filterable>
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable clearable
                           :style="{width: '100px'}">
                  <el-option v-for="(item, index) in searchCondOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column align="center" label="产品" min-width="150px" fixed>
          <template slot-scope="{row}">
            <el-tag size="small" type="primary">账号: {{ row.account.name }}</el-tag>
            <br>
            <el-tag size="small" type="primary">Sku Id: {{ row.product.id }}</el-tag>
            <KdxImage :src="row.product.image"></KdxImage>
            <el-tooltip :content="row.product.title">
              <div v-if="row.product.title.length >= 20">
                {{ row.product.title.substring(0, 20) }}...
              </div>
              <div v-else>
                {{ row.product.title }}
              </div>
            </el-tooltip>
            <el-tag size="small" type="primary">Sku: {{ row.product.sku }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="总" align="center">
          <el-table-column align="center" label="单量">
            <el-table-column align="center" prop="total_count" label="总" sortable="custom"></el-table-column>
            <el-table-column align="center" prop="total_not_set_count" label="未设置" sortable="custom">
              <template slot-scope="{row}">
                <el-tag type="primary" @click="jumpAccount(row.account.platform)">{{ row.total_not_set_count }}</el-tag>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="营收">
            <el-table-column align="center" prop="total_gmv" label="总" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_gmv.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="total_avg_gmv" label="平均" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_avg_gmv.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="净收入">
            <el-table-column align="center" prop="total_net_income" label="总" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_net_income.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="total_avg_net_income" label="平均" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_avg_net_income.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="成本">
            <el-table-column align="center" prop="total_cost" label="总" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_cost.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="total_avg_cost" label="平均" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_avg_cost.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="费用">
            <el-table-column align="center" prop="total_fee" label="总" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_fee.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="total_avg_fee" label="平均" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_avg_fee.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="利润">
            <el-table-column align="center" prop="total_profit" label="总" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_profit.toFixed(1) }}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="total_avg_profit" label="平均" sortable="custom">
              <template slot-scope="{row}">
                {{ row.total_avg_profit.toFixed(1) }}
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column align="center" label="操作">
          </el-table-column>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :style="{textAlign:'right'}"
          :page-sizes="[5, 10, 20, 30, 50, 100, 200, 300, 500, 1000]"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, prev, next, jumper, sizes"
      ></el-pagination>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {profitStatisticsListProduct} from "@/api/profit/statistics";
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";

export default {
  components: {
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: profitStatisticsListProduct,

      accountOptions: [],
      searchCondOptions: [
        {id: 1, name: "Sku Id"},
        {id: 2, name: "标题模糊"},
      ],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    let timeArray = this.$route.query.time
    if (timeArray === undefined || timeArray === null || timeArray.length !== 2) {
      let curDate = new Date().toLocaleDateString()
      timeArray = []
      timeArray.push(curDate)
      timeArray.push(curDate)
    }
    this.$set(this.searchInfo, "start_time", timeArray[0])
    this.$set(this.searchInfo, "end_time", timeArray[1])
    this.$set(this.searchInfo, "platforms", ["TEMU"])

    this.$set(this.searchInfo, "search_cond", 1)
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-row {
  padding: 0;
}

::v-deep .el-table .cell {
  padding: 0;
}

.el-row {
  padding-top: 0px;
  padding-bottom: 0px;
}

::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}
</style>