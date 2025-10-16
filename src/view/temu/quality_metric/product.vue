<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select v-model="searchInfo.site" placeholder="请选择站点" filterable style="width: 100%">
              <el-option v-for="(item, index) in agentSellerSiteOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select v-model="searchInfo.levels" placeholder="请选择品质层级" multiple collapse-tags filterable style="width: 100%">
              <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-input size="mini" placeholder="Spu Ids" v-model="searchInfo.spu_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-input size="mini" placeholder="Skc Ids" v-model="searchInfo.skc_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-input size="mini" placeholder="Sku Ids" v-model="searchInfo.sku_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-input size="mini" placeholder="货号" v-model="searchInfo.ext_codes" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小品质分" v-model.number="searchInfo.min_score"
                        clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大品质分" v-model.number="searchInfo.max_score"
                        clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @sort-change="sortChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="站点" prop="site" align="center" min-width="120px">
          <div slot-scope="{row}">
            {{siteName(row)}}
          </div>
        </el-table-column>
        <el-table-column label="Spu Id" prop="product_id" align="center">
          <div slot-scope="{row}">
            <el-link type="primary" :href="`https://www.temu.com/goods.html?goods_id=${row.goods_id}&no_cache_id=egv4k`" :underline="false" target="_blank">
              {{row.product_id}}
            </el-link>
          </div>
        </el-table-column>
        <el-table-column label="产品图" prop="product.main_image" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.product.main_image_url" v-if="row.product"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="品质分" prop="goods_afs_score" align="center" sortable>
          <div slot-scope="{row}">
            <el-tag size="mini" :type="levelType(row.level)">{{row.goods_afs_score.toFixed(2)}}</el-tag>
            <div>
              <el-button size="mini" type="primary" @click="openDlgQualityTrend(row.product_id)">查看</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="品质售后次数" prop="qlty_afs_ord_cnt" align="center" sortable>
          <div slot-scope="{row}">
            {{row.qlty_afs_ord_cnt}}
          </div>
        </el-table-column>
        <el-table-column label="品质售后率" prop="qlty_afs_ordr_rate" align="center" sortable>
          <div slot-scope="{row}">
            {{(row.qlty_afs_ordr_rate*100).toFixed(3)}}%
          </div>
        </el-table-column>
        <el-table-column label="评价数" prop="rev_cnt" align="center" sortable>
          <div slot-scope="{row}">
            {{row.rev_cnt}}
          </div>
        </el-table-column>
        <el-table-column label="平均评分" prop="avg_rev_scr" align="center" sortable>
          <div slot-scope="{row}">
            {{row.avg_rev_scr.toFixed(2)}}
          </div>
        </el-table-column>
        <el-table-column label="售后问题" prop="probl_afs_item_list" align="center">
          <div slot-scope="{row}">
            <div style="font-size: 12px; color: red" v-for="(item, index) in row.probl_afs_item_list" :key="index">
              {{item}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="负向评价类型" prop="probl_rev_item_list" align="center">
          <div slot-scope="{row}">
            <div style="font-size: 12px; color: red" v-for="(item, index) in row.probl_rev_item_list" :key="index">
              {{item}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="负向评价关键词" prop="bad_keywords_list" align="center">
          <div slot-scope="{row}">
            <div style="font-size: 12px; color: red" v-for="(item, index) in row.bad_keywords_list" :key="index">
              {{item}}
            </div>
          </div>
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

    <DlgQualityTrend :id="dlgQualityTrend.id" :visible="dlgQualityTrend.visible" @close="dlgQualityTrend.visible=false"></DlgQualityTrend>
  </div>

</template>

<script>
import {accountList} from "@/api/temu/account";
import {qualityMetricProductList} from "@/api/temu/quality_metric";
import infoList from "@/components/mixins/infoList";
import KdxImage from "@/components/image/image.vue";
import DlgQualityTrend from "@/view/temu/quality_metric/dlg_quality_trend.vue";

export default {
  components: {
    DlgQualityTrend,
    KdxImage
  },
  mixins: [infoList],
  computed:{
  },
  data() {
    return {
      listApi: qualityMetricProductList,

      accountOptions: [],
      agentSellerSiteOptions: [
        {id: 1, name: "美国"},
        {id: 2, name: "欧洲"},
        {id: 0, name: "非欧美"},
      ],
      levelOptions: [
        {id: 0, name: "差", type: "danger"},
        {id: 1, name: "中", type: "warning"},
        {id: 2, name: "良", type: "primary"},
        {id: 3, name: "优", type: "success"},
      ],

      dlgQualityTrend: {
        id: undefined,
        visible: false,
      }
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    siteName(row) {
      let op = this.agentSellerSiteOptions.find((op) => {return op.id === row.site})
      if (op) {
        return op.name
      }
      return `未知: ${row.site}`
    },
    levelType(level) {
      let op = this.levelOptions.find((op) => {return op.level === level})
      if (!op) {
        return `未知: ${level}`
      }
      return op.type
    },
    openDlgQualityTrend(id) {
      this.dlgQualityTrend.id = id;
      this.dlgQualityTrend.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.$set(this.searchInfo, "site", 0)
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