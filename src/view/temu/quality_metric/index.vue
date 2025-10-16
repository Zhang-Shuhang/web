<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.site" placeholder="请选择站点" filterable style="width: 100%">
                <el-option v-for="(item, index) in agentSellerSiteOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="站点" prop="site" align="center" min-width="120px">
          <div slot-scope="{row}">
            {{siteName(row)}}
          </div>
        </el-table-column>
        <el-table-column label="近90天品质售后率" prop="qlty_afs_ordr_rate_90_d" align="center" sortable>
          <div slot-scope="{row}">
            <el-tag size="mini" :type="ordrRateType(row.qlty_afs_ordr_rate_90_d)">{{(row.qlty_afs_ordr_rate_90_d*100).toFixed(2)}}%</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="近90天店铺评价均分" prop="avg_score_90_d" align="center" sortable>
          <div slot-scope="{row}">
            <el-tag size="mini" :type="scoreType(row.avg_score_90_d)" v-if="row.avg_score_90_d>0">{{row.avg_score_90_d.toFixed(2)}}</el-tag>
          </div>
        </el-table-column>
      </el-table>
    </div>

  </div>

</template>

<script>
import {accountList} from "@/api/temu/account";
import {qualityMetricList} from "@/api/temu/quality_metric";

export default {
  components: {
  },
  mixins: [],
  computed:{
  },
  data() {
    return {
      accountOptions: [],
      agentSellerSiteOptions: [
        {id: 1, name: "美国"},
        {id: 2, name: "欧洲"},
        {id: 0, name: "非欧美"},
      ],

      searchInfo: {
        site: 0,
        accounts: [],
      },
      tableData: [],
    }
  },
  methods: {
    async onSubmit() {
      let resp = await qualityMetricList(this.searchInfo);
      if (resp.code) {
        return
      }

      this.tableData = resp.data;
    },
    siteName(row) {
      let op = this.agentSellerSiteOptions.find((op) => {return op.id === row.site})
      if (op) {
        return op.name
      }
      return `未知: ${row.site}`
    },
    ordrRateType(v) {
      if (v <= 0.01) {
        return "success"
      } else if (v <= 0.03) {
        return "primary"
      } else if (v <= 0.05) {
        return "warning"
      } else {
        return "danger"
      }
    },
    scoreType(v) {
      if (v >= 4.7) {
        return "success"
      } else if (v >= 4.5) {
        return "primary"
      } else if (v >= 4.4) {
        return "warning"
      } else {
        return "danger"
      }
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.onSubmit()
  },
}
</script>
<style scoped lang="scss">
  ::v-deep .el-table .cell {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  ::v-deep .el-form-item__content:after, .el-form-item__content:before {
    display: table;
  }

  ::v-deep .el-form-item__content {
    line-height: 28px;
    position: relative;
    font-size: 12px;
  }

  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  ::v-deep .el-row {
    padding: 0px;
  }

  ::v-deep .select .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }

  ::v-deep .select .el-input__suffix {
    display: none;
  }

  .item-container {
    .item {
      width: 100%;
      background-color: #fff;
      box-sizing: border-box;
      height: 85px;
      padding: 0px;
      border-bottom: 1px solid lightblue;
    }

    .footer {
      background: lightblue;
      height: 24px;
      font-size: 12px;
      line-height: 24px;
      padding-bottom: 0;
      padding-top: 0;
    }
  }
</style>