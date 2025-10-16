<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :span="3">
            <el-select size="mini" v-model="searchInfo.accounts" placeholder="账号" multiple collapse-tags filterable clearable :style="{width: '100%'}">
              <template v-for="(item, index) in accountOptions">
                <el-option :key="index" :label="item.name" :value="item.id" v-if="item.is_semi"></el-option>
              </template>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select size="mini" v-model="searchInfo.status" placeholder="状态" multiple collapse-tags filterable clearable :style="{width: '100%'}">
              <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select size="mini" v-model="searchInfo.ad_phase" placeholder="学习阶段" filterable clearable :style="{width: '100%'}">
              <el-option label="" value=""></el-option>
              <el-option label="学习中" :value="1"></el-option>
              <el-option label="学习完成" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-date-picker
                v-model="searchInfo.date"
                type="daterange"
                align="right"
                size="mini"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                style="width: 100%">
            </el-date-picker>
          </el-col>
          <el-col :span="3">
            <el-input size="mini" placeholder="Spu Ids" v-model="searchInfo.spu_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input size="mini" placeholder="Goods Ids" v-model="searchInfo.goods_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-input size="mini" placeholder="货号" v-model="searchInfo.ext_codes" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小目标ROAS" v-model.number="searchInfo.min_roas" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大目标ROAS" v-model.number="searchInfo.max_roas" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小实际ROAS" v-model.number="searchInfo.min_real_roas" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大实际ROAS" v-model.number="searchInfo.max_real_roas" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小订单量" v-model.number="searchInfo.min_order_cnt" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大订单量" v-model.number="searchInfo.max_order_cnt" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小广告花费" v-model.number="searchInfo.min_ad_spend" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大广告花费" v-model.number="searchInfo.max_ad_spend" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小销售额" v-model.number="searchInfo.min_ad_payment_amt" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大销售额" v-model.number="searchInfo.max_ad_payment_amt" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小广告日预算" v-model.number="searchInfo.min_budget" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大广告日预算" v-model.number="searchInfo.max_budget" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :span="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :span="2" v-if="canStartRows.length>0">
            <el-button size="mini" type="warning" style="width: 100%" @click="startAds(canStartRows)">打开</el-button>
          </el-col>
          <el-col :span="2" v-if="canStopRows.length>0">
            <el-button size="mini" type="danger" style="width: 100%" @click="stopAds(canStopRows)">暂停</el-button>
          </el-col>
          <el-col :span="2" v-if="selectRows.length>0">
            <el-button size="mini" type="primary" style="width: 100%" @click="openEditBudgetDlg(selectRows)">设置日预算</el-button>
          </el-col>
          <el-col :span="2" v-if="selectRows.length>0">
            <el-button size="mini" type="primary" style="width: 100%" @click="openEditRoasDlg(selectRows)">设置回报率(ROAS)</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="product.account.name" align="center">
        </el-table-column>
        <el-table-column label="产品信息" align="center" width="200">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" typ="primary">Spu Id: {{row.product_id}}</el-tag>
            </div>
            <div>
              <el-tag size="mini" typ="primary" v-if="row.product">Goods Id: {{row.product.goods_id}}</el-tag>
            </div>
            <div>
              <el-tag size="mini" typ="primary" effect="dark" v-if="row.product">状态: {{statusName(row.product.ad_show_status)}}</el-tag>
            </div>
            <div>
              <el-tag size="mini" typ="primary" v-if="row.product">学习阶段: {{row.product.ad_phase === 0 ? "学习中" : "学习完成"}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品图" prop="product.goods_image_url" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.product.goods_image_url" v-if="row.product"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="变体" align="center" width="150">
          <div class="item-container" slot-scope="{row}">
            <template v-if="row.product && row.product.product">
              <div :class="index+1 === row.product.product.variations.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(variation, index) in row.product.product.variations" :key="index">
                <div>
                  <el-tag type="primary" size="mini">{{ variation.id }}</el-tag>
                </div>
                <div>
                  <el-tag type="primary" size="mini">{{ variation.ext_code }}</el-tag>
                </div>
                <div>
                  <el-tag type="primary" size="mini">价格: {{ (variation.supplier_price/100).toFixed(2) }}</el-tag>
                </div>
                <div v-if="variation.semi_stock">
                  <el-tag type="primary" size="mini">库存: {{ variation.semi_stock.sku_stock_quantity }}</el-tag>
                </div>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="海外仓(所有同类产品)" align="center">
          <el-table-column label="库存" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.product && row.product.product">
                <div :class="index+1 === row.product.product.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(variation, index) in row.product.product.variations" :key="index">
                  <div v-if="variation.stock">
                    <el-tag :type="variation.stock.real_stock_count >= 100 ? `primary` : `danger`" effect="dark" size="mini">库存: {{ variation.stock.real_stock_count }}</el-tag>
                  </div>
                  <div v-if="variation.stock">
                    <el-tag type="primary" size="mini">待发量: {{ variation.stock.not_ship_count }}</el-tag>
                  </div>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="今" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.product && row.product.product">
                <div :class="index+1 === row.product.product.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(variation, index) in row.product.product.variations" :key="index">
                  <div v-if="variation.stock">
                    <el-tag type="primary" size="mini">{{ variation.stock.today }}</el-tag>
                  </div>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="昨" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.product && row.product.product">
                <div :class="index+1 === row.product.product.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(variation, index) in row.product.product.variations" :key="index">
                  <div v-if="variation.stock">
                    <el-tag type="primary" size="mini">{{ variation.stock.two_day }}</el-tag>
                  </div>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="前" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.product && row.product.product">
                <div :class="index+1 === row.product.product.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(variation, index) in row.product.product.variations" :key="index">
                  <div v-if="variation.stock">
                    <el-tag type="primary" size="mini">{{ variation.stock.three_day }}</el-tag>
                  </div>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="7系" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.product && row.product.product">
                <div :class="index+1 === row.product.product.variations.length ? [`item`] : [`item`, `item-bottom`]"
                     v-for="(variation, index) in row.product.product.variations" :key="index">
                  <div v-if="variation.stock">
                    <el-tag type="primary" size="mini">{{ variation.stock.seven_day_coef.toFixed(2) }}</el-tag>
                  </div>
                </div>
              </template>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="广告日预算" prop="budget" align="center">
          <div slot-scope="{row}">
            <template v-if="row.product">
              <span v-if="row.product.budget >= 0">
                {{(row.product.budget/100).toFixed(2)}}
              </span>
              <span v-else>
                不限
              </span>
              <el-button size="mini" icon="el-icon-edit"  @click="openEditBudgetDlg([row])" circle></el-button>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="目标广告投资回报率 (ROAS)" prop="target_roas" align="center">
          <div slot-scope="{row}">
            <template v-if="row.product">
              <template v-if="row.product.target_roas > 0">
                <el-tag size="mini" effect="dark" type="danger" v-if="row.product.target_roas <= 5000">{{(row.product.target_roas/10000).toFixed(2)}}</el-tag>
                <el-tag size="mini" effect="dark" type="warning" v-else-if="row.product.target_roas <= 7000">{{(row.product.target_roas/10000).toFixed(2)}}</el-tag>
                <el-tag size="mini" effect="dark" type="info" v-else-if="row.product.target_roas <= 9000">{{(row.product.target_roas/10000).toFixed(2)}}</el-tag>
                <el-tag size="mini" effect="dark" type="success" v-else>{{(row.product.target_roas/10000).toFixed(2)}}</el-tag>
              </template>
              <el-button size="mini" icon="el-icon-edit" @click="openEditRoasDlg([row])" circle></el-button>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="广告投资回报率 (ROAS)" prop="real_roas" align="center">
          <div slot-scope="{row}">
            <template v-if="row.roas > 0">
              <el-tag size="mini" effect="dark" type="danger" v-if="row.roas <= 5000">{{(row.roas/1000).toFixed(2)}}</el-tag>
              <el-tag size="mini" effect="dark" type="warning" v-else-if="row.roas <= 7000">{{(row.roas/1000).toFixed(2)}}</el-tag>
              <el-tag size="mini" effect="dark" type="info" v-else-if="row.roas <= 9000">{{(row.roas/1000).toFixed(2)}}</el-tag>
              <el-tag size="mini" effect="dark" type="success" v-else>{{(row.roas/1000).toFixed(2)}}</el-tag>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="广告花费" prop="ad_spend" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{(row.ad_spend/100).toFixed(2)}}<span v-if="row.order_pay_cnt">({{(row.ad_spend/100/row.order_pay_cnt).toFixed(2)}})</span>
          </div>
        </el-table-column>
        <el-table-column label="支付金额" prop="order_pay_amt" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{(row.order_pay_amt/100).toFixed(2)}}<span v-if="row.order_pay_cnt">({{(row.order_pay_amt/100/row.order_pay_cnt).toFixed(2)}})</span>
          </div>
        </el-table-column>
        <el-table-column label="曝光量" prop="impr_cnt" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="点击" align="center">
          <el-table-column label="次数" prop="clk_cnt" align="center" sortable="custom">
          </el-table-column>
          <el-table-column label="率(CTR)" prop="ctr" align="center" sortable="custom">
            <div slot-scope="{row}">
              {{(row.ctr/100).toFixed(2)}}%
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="购物车" prop="cart_cnt" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="订单量" prop="order_pay_cnt" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{(row.order_pay_cnt)}}
          </div>
        </el-table-column>
        <el-table-column label="广告费比（ACOS）" prop="acos" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{(row.acos/100).toFixed(2)}}%
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button style="width: 100%" type="danger" size="mini" v-if="canStop(row)" @click="stopAds([row])">暂停</el-button>
            <el-button style="width: 100%" type="warning" size="mini" v-else-if="canStart(row)" @click="startAds([row])">打开</el-button>
            <el-button style="width: 100%; margin-top: 5px" type="primary" size="mini" @click="openDailyDlg(row.product_id)">历史数据</el-button>
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

      <TemuDlgAdEditBudget :rows="editBudget.rows" :visible="editBudget.visible" @close="editBudget.visible=false" @suc="getTableData"></TemuDlgAdEditBudget>
      <TemuDlgAdEditRoas :rows="editRoas.rows" :visible="editRoas.visible" @close="editRoas.visible=false" @suc="getTableData"></TemuDlgAdEditRoas>
      <TemuDlgAdHistory :table-data="dailyDlg.list" :visible="dailyDlg.visible" @close="dailyDlg.visible=false"></TemuDlgAdHistory>
    </div>
  </div>

</template>

<script>

import {adProductDaily, adProductList, adStart, adStop} from "@/api/temu/ad";
import infoList from "@/components/mixins/infoList";
import KdxImage from "@/components/image/image.vue";
import {accountList} from "@/api/temu/account";
import TemuDlgAdEditBudget from "@/view/temu/ad/components/dlg_edit_budget.vue";
import TemuDlgAdEditRoas from "@/view/temu/ad/components/dlg_edit_roas.vue";
import TemuDlgAdHistory from "@/view/temu/ad/components/dlg_ad_history.vue";

export default {
  components: {TemuDlgAdHistory, TemuDlgAdEditRoas, TemuDlgAdEditBudget, KdxImage},
  mixins: [infoList],
  data() {
    return {
      listApi: adProductList,

      accountOptions: [],
      statusOptions: [
        {id: 0, name: "账户资金不足"},
        {id: 1, name: "到达日预算"},
        {id: 2, name: "商品售罄"},
        {id: 3, name: "商品下架"},
        {id: 4, name: "审核中"},
        {id: 5, name: "审核驳回"},
        {id: 7, name: "手动暂停"},
        {id: 8, name: "投放中"},
        {id: 9, name: "已删除"},
      ],
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

      selectRows: [],

      dailyDlg: {
        list: [],
        visible: false,
      },

      editBudget: {
        rows: [],
        visible: false,
      },
      
      editRoas: {
        rows: [],
        visible: false,
      }
    }
  },
  computed: {
    canStartRows() {
      return this.selectRows.filter((row) => {
        return this.canStart(row)
      })
    },
    canStopRows() {
      return this.selectRows.filter((row) => {
        return this.canStop(row)
      })
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      this.getTableData()
    },
    statusName(status) {
      let op = this.statusOptions.find(item => item.id === status)
      if (!op) {
        return `未知状态: ${status}`
      }
      return op.name
    },
    selectionChange(val) {
      this.selectRows = val
    },
    openEditBudgetDlg(rows) {
      this.editBudget.rows = rows
      this.editBudget.visible = true
    },
    openEditRoasDlg(rows) {
      this.editRoas.rows = rows
      this.editRoas.visible = true
    },
    async stopAds(rows) {
      let ids = rows.map((item) => {return item.product_id})
      if (ids.length <= 0) {
        return
      }

      let resp = await adStop({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("暂停成功")
      this.getTableData()
    },
    async startAds(rows) {
      let ids = rows.map((item) => {return item.product_id})
      if (ids.length <= 0) {
        return
      }

      let resp = await adStart({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("启动成功")
      this.getTableData()
    },
    canStop(row) {
      return row.product && (row.product.ad_show_status === 8 || row.product.ad_show_status === 1 || row.product.ad_show_status === 2)
    },
    canStart(row) {
      return row.product && row.product.ad_show_status === 7
    },
    async openDailyDlg(productId) {
      let resp = await adProductDaily({id: productId})
      if (resp.code) {
        return
      }
      this.dailyDlg.list = resp.data
      this.dailyDlg.visible = true
    }
  },
  async created() {
    this.$set(this.searchInfo, "date", [new Date(), new Date()])
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 95px;
    padding: 0;
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
</style>