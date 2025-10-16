<template>
  <div :class="[is_dlg ? 'height_100' : '']">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index"
                           :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids，空格分隔" v-model="searchInfo.skc_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids，空格分隔" v-model="searchInfo.sku_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="货号，模糊搜索" v-model="searchInfo.ext_codes" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="3" v-if="selectRows.length > 0">
            <el-button size="mini" type="primary" style="width: 100%" @click="openApply(selectRows)">报名</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="id" sortable align="center">
        </el-table-column>
        <el-table-column label="Sku" prop="id" sortable align="center" width="150px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.variations" :key="index">
              <div>
                {{item.id}}
              </div>
              <div>
                <el-tag size="mini">{{item.ext_code}}</el-tag>
              </div>
              <KdxImage :src="item.thumb_url"></KdxImage>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <el-table-column label="销量系数" align="center">
            <el-table-column label="7系" prop="daily_history.seven_day_coef" sortable="custom" sort-by="today" align="center">
              <template slot="header">
                <el-tooltip content="7日系数">
                  <span>7系</span>
                </el-tooltip>
              </template>
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.seven_day_coef.toFixed(2)}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.seven_day_coef.toFixed(2)}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="30系" prop="daily_history.thirty_day_coef" sortable="custom" sort-by="today" align="center">
              <template slot="header">
                <el-tooltip content="30日系数">
                  <span>30系</span>
                </el-tooltip>
              </template>
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.thirty_day_coef.toFixed(2)}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.thirty_day_coef.toFixed(2)}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="90系" prop="daily_history.ninety_day_coef" sortable="custom" sort-by="today" align="center">
              <template slot="header">
                <el-tooltip content="90日系数">
                  <span>90系</span>
                </el-tooltip>
              </template>
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.ninety_day_coef.toFixed(2)}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.ninety_day_coef.toFixed(2)}}
                  </template>
                </div>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="销量" align="center">
            <el-table-column label="图" prop="daily_history.today" sortable="custom" sort-by="today" align="center" width="300px">
              <div slot-scope="{row}">
              </div>
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <Daily :list="item.daily_list" :field_names="['单量']" :fields="['count']" :chart-height="175"></Daily>
                </div>
                <div class="footer">
                </div>
              </div>
            </el-table-column>
            <el-table-column label="今" prop="daily_history.today" sortable="custom" sort-by="daily_history.today" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.today}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.today}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="差" prop="daily_history.two_day_diff" sortable="custom" sort-by="daily_history.two_day_diff" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.two_day_diff}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.two_day_diff}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="昨" prop="daily_history.two_day" sortable="custom" sort-by="daily_history.two_day" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.two_day}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.two_day}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="差" prop="daily_history.three_day_diff" sortable="custom" sort-by="daily_history.three_day_diff" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.three_day_diff}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.three_day_diff}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="前" prop="daily_history.three_day" sortable="custom" sort-by="daily_history.three_day" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.three_day}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.three_day}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="7" prop="daily_history.seven_day" sortable="custom" sort-by="daily_history.seven_day" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.seven_day}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.seven_day}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="30" prop="daily_history.thirty_day" sortable="custom" sort-by="daily_history.thirty_day" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.thirty_day}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.thirty_day}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="全" prop="daily_history.all" sortable="custom" sort-by="daily_history.all" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.all}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.all}}
                  </template>
                </div>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="最高" align="center">
            <el-table-column label="7" prop="daily_history.seven_day_max" sortable="custom" sort-by="daily_history.seven_day_max" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.seven_day_max}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.seven_day_max}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="30" prop="daily_history.thirty_day_max" sortable="custom" sort-by="daily_history.thirty_day_max" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.thirty_day_max}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.thirty_day_max}}
                  </template>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="全" prop="daily_history.all_max" sortable="custom" sort-by="daily_history.all_max" align="center">
              <div class="item-container" slot-scope="{row}">
                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(item, index) in row.variations" :key="index">
                  <template v-if="item.daily_history">
                    {{item.daily_history.all_max}}
                  </template>
                </div>
                <div class="footer">
                  <template v-if="row.daily_history">
                    {{row.daily_history.all_max}}
                  </template>
                </div>
              </div>
            </el-table-column>
          </el-table-column>
<!--          <el-table-column label="加购" align="center">-->
<!--            <el-table-column label="7日" prop="in_cart_number_7d" sortable="custom" sort-by="in_cart_number_7d" align="center">-->
<!--              <div class="item-container" slot-scope="{row}">-->
<!--                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"-->
<!--                     v-for="(item, index) in row.variations" :key="index">-->
<!--                  <template v-if="item.daily_history">-->
<!--                    {{item.daily_history.in_cart_number_7d}}-->
<!--                  </template>-->
<!--                </div>-->
<!--                <div class="footer">-->
<!--                  <template v-if="row.daily_history">-->
<!--                    {{row.daily_history.in_cart_number_7d}}-->
<!--                  </template>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="累计" prop="in_card_number" sortable="custom" sort-by="in_card_number" align="center">-->
<!--              <div class="item-container" slot-scope="{row}">-->
<!--                <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"-->
<!--                     v-for="(item, index) in row.variations" :key="index">-->
<!--                  {{item.in_card_number}}-->
<!--                </div>-->
<!--                <div class="footer">-->
<!--                  {{row.in_card_number}}-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-table-column>-->
<!--          </el-table-column>-->
        </el-table-column>
        <el-table-column label="操作" prop="activity_price" align="center">
          <div slot-scope="{row}">
            <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row)" plain>
              订单统计
            </el-button>
            <el-button type="primary" size="mini" style="width: 100%" @click="openApply([row])" plain>
              活动报名
            </el-button>
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

    <TemuDlgMultiDaily :sku_ids="daily.sku_ids" :visible="daily.visible" @close="daily.visible=false"></TemuDlgMultiDaily>
    <TemuDlgActivityProducts :ids="dlgActivityProduct.ids" :visible="dlgActivityProduct.visible" @close="dlgActivityProduct.visible=false" @suc="getTableData"></TemuDlgActivityProducts>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {activityAddStock, activityProductList, activitySync} from "@/api/temu/activity";
import TemuDlgMultiDaily from "@/view/temu/sale/components/dlg_multi_daily.vue";
import Daily from "@/view/components/daily.vue";
import TemuDlgActivityProducts from "@/view/temu/activity/components/dlg_activity_products.vue";

export default {
  name: 'TemuActivityAppliedList',
  components: {
    TemuDlgActivityProducts,
    Daily,
    TemuDlgMultiDaily,
    KdxImage
  },
  props: {
    spu_ids: {
      type: Array,
    },
    sku_ids: {
      type: Array,
    },
    is_dlg: {
      type: Boolean,
    }
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(() => {
          this.page = 1
          this.getTableData()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: activityProductList,

      timeoutId: undefined,

      accountOptions: [],
      selectRows: [],

      dlgActivityProduct: {
        ids: [],
        visible: false,
      },

      daily: {
        sku_ids: [],
        visible: false,
      },

      edit: {
        id: undefined,
        add_stock: 0,
      }
    }
  },
  computed: {},
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      this.$message("同步可能要很久，请耐心等待!")

      let resp = await activitySync()
      if (resp.code) {
        return
      }
      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    openDaily(row) {
      this.daily.sku_ids = row.variations.map((item) => {return item.id})
      this.daily.visible = true
    },
    openApply(rows) {
      this.dlgActivityProduct.ids = rows.map((row) => row.id)
      this.dlgActivityProduct.visible = true
    },
    sessionStatusName(status) {
      switch (status) {
        case 1:
          return "未开始"
        case 2:
          return "进行中"
        case 3:
          return "已结束"
        case 4:
          return "申请失败"
      }
      return `未知: ${status}`
    },
    async updateAddStock() {
      let resp = await activityAddStock({id: this.edit.id, add_stock: this.edit.add_stock})
      if (resp.code) {
        return
      }
      this.edit.id = undefined
      this.getTableData()
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    if (this.spu_ids) {
      this.$set(this.searchInfo, "spu_ids", this.spu_ids.join(" "))
    }
    if (this.sku_ids) {
      this.$set(this.searchInfo, "sku_ids", this.sku_ids.join(" "))
    }

    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

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

.button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  height: 24px;
  line-height: 22px;
  width: 100%;
  vertical-align: bottom;
}

::v-deep .select .el-input--suffix .el-input__inner {
  padding-right: 0px;
}

::v-deep .select .el-input__suffix {
  display: none;
}

.input-right-zero {
  padding-right: 0px !important;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 130px;
    padding: 0px;
  }

  .item-bottom {
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

.height_100 {
  height: 100%;
}
</style>