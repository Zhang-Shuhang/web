<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`"
                             :value="item.id" v-if="!item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_ban" placeholder="是否禁售" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="未禁售" :value="1"></el-option>
                <el-option label="已禁售" :value="2"></el-option>
                <el-option label="已禁售-手动" :value="3"></el-option>
                <el-option label="已禁售-单量过低" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.select_status" placeholder="站点状态" filterable clearable
                         style="width: 100%">
                <el-option label="待下首单" :value="10"></el-option>
                <el-option label="已下首单" :value="11"></el-option>
                <el-option label="已加入站点" :value="12"></el-option>
                <el-option label="已下架终止" :value="13"></el-option>
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
              <el-input size="mini" v-model="searchInfo.ext_code" clearable placeholder="货号，逗号分隔"
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable
                         style="width: 100%">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_hot" placeholder="热销款" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="热销款" :value="1"></el-option>
                <el-option label="非热销款" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.close_jit_status" placeholder="JIT转备货进度" filterable clearable
                         style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="待调价" :value="1"></el-option>
                <el-option label="调价中" :value="2"></el-option>
                <el-option label="备货中" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_factory" placeholder="是否工厂" filterable clearable
                         style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="工厂" :value="1"></el-option>
                <el-option label="非工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.ad_type" placeholder="广告类型" filterable clearable style="width: 100%">
                <el-option label="高级广告" :value="1"></el-option>
                <el-option label="普通广告" :value="2"></el-option>
                <el-option label="无广告" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小建议备货量" v-model="searchInfo.advice_min"
                          clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大建议备货量" v-model="searchInfo.advice_max"
                          clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.title" type="primary" placeholder="标题" clearable
                        @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="syncAdvice">同步备货单</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="openStockBatch">批量备货</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="商品信息" width="230" align="center">
          <div slot-scope="{row}">
            <div v-if="row.account">
              <el-tag size="mini" type="primary">账号: {{ row.account.name }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product_id.toString())">SPU: {{
                  row.product_id
                }}
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.skc_id.toString())">SKC:
                {{ row.skc_id }}
              </el-tag>
              <el-button type="primary" size="mini" style="display: inline-block; padding: 3px 10px"
                         @click="reqStock(row.skc_id, 0)" plain>备
              </el-button>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.id.toString())">SKU: {{ row.id }}</el-tag>
              <el-button type="primary" size="mini" style="display: inline-block; padding: 3px 10px"
                         @click="reqStock(row.skc_id, row.id)" plain>备
              </el-button>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.variation.ext_code)" v-if="row.variation">货号:
                {{ row.variation.ext_code }}
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="danger" v-if="row.variation && row.variation.supplier_price">成本:
                ¥{{ (row.variation.supplier_price / 100).toFixed(2) }}
              </el-tag>
            </div>
            <div v-if="row.sale">
              <el-tag size="mini" type="warning" effect="dark" v-if="row.sale.close_jit_status === 1">调价中</el-tag>
              <el-tag size="mini" type="danger" effect="dark" v-else-if="row.sale.close_jit_status === 2">备货中
              </el-tag>
              <el-tag size="mini" type="primary" effect="dark" v-else>待调价</el-tag>

              <div v-if="row.sale.auto_close_jit_end_time">
                <el-tag size="mini" type="warning" effect="dark">自动关JIT:
                  {{ new Date(row.sale.auto_close_jit_end_time).toLocaleString() }}
                </el-tag>
              </div>
              <div v-if="row.sale.picture_audit_status !== 2">
                <el-tag size="mini" type="danger">图审未过</el-tag>
              </div>
            </div>
            <div v-if="row.product">
              创建: {{ new Date(row.product.created_at).toLocaleDateString() }}
            </div>
            <div v-if="skuReview(row)">
              <el-tag size="mini" type="primary">
                Sku评分: {{ skuReview(row) }})
              </el-tag>
            </div>
            <template>
              <div v-if="row.item">
                <el-tag size="mini" type="warning" v-if="row.item.is_advice_stock">建议备货</el-tag>
                <el-tag size="mini" type="primary" v-if="row.item.today_apply_stock_num">今日已备货</el-tag>
                <el-tag size="mini" type="warning" effect="dark" v-if="row.sale && row.sale.hot_tag">热销款</el-tag>
                <span v-if="row.sale.is_ad_product">
                    <el-tag size="mini" type="success" effect="dark">站外广告</el-tag>
                </span>
                <span v-for="(item, index) in row.sale.ad_type_list" :key="index">
                    <el-tag size="mini" type="warning" v-if="item === 1">普通广告</el-tag>
                    <el-tag size="mini" type="danger" v-else-if="item === 2">高级广告</el-tag>
                </span>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <div slot-scope="{row}">
            <template v-if="row.variation">
              <div>变体图</div>
              <KdxImage :src="row.variation.thumb_url"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" type="warning" effect="dark">{{ levelName(row) }}</el-tag>
            </div>
            <el-row>
              <el-col :span="24">
                <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain
                           v-if="row.history">
                  发货({{ row.history.join_count }}|{{ row.history.today_can_join }})
                </el-button>
                <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain v-else>发货
                </el-button>
              </el-col>
              <el-col :span="24">
                <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div v-if="row.ban">
                  <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, false)">
                    取消禁售{{ row.ban.type === 0 ? "(手动)" : "(单量不足)" }}
                  </el-button>
                </div>
                <div v-else>
                  <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, true)">设置禁售
                  </el-button>
                </div>
              </el-col>
              <el-col :span="24">
                <el-button size="mini" style="width: 100%" type="warning"
                           @click="openActivityAppliedProductList([row.product_id])">活动记录
                </el-button>
              </el-col>
            </el-row>
          </div>
        </el-table-column>
        <el-table-column label="备货" align="center">
          <el-table-column label="平台可售天数" align="center">
            <el-table-column label="Temu" prop="item.available_sale_days_from_inventory" align="center">
            </el-table-column>
            <el-table-column label="我" prop="history.custom_available_sale_days_from_inventory" align="center">
              <template slot="header">
                我
                <el-tooltip content="含发货在途+未发出">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.history">
                  <el-tag size="mini" type="danger" effect="dark"
                          v-if="row.history.custom_available_sale_days_from_inventory <= 4">
                    {{ row.history.custom_available_sale_days_from_inventory.toFixed(2) }}
                  </el-tag>
                  <el-tag size="mini" type="warning" effect="dark"
                          v-else-if="row.history.custom_available_sale_days_from_inventory <= 8">
                    {{ row.history.custom_available_sale_days_from_inventory.toFixed(2) }}
                  </el-tag>
                  <el-tag size="mini" type="success" v-else>
                    {{ row.history.custom_available_sale_days_from_inventory.toFixed(2) }}
                  </el-tag>
                </template>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column prop="history.custom_available_sale_days" align="center">
            <template slot="header">
              总可售天数
              <el-tooltip content="平台可售天数+在途可售天数">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <div slot-scope="{row}">
              <div v-if="row.history">
                {{ row.history.custom_available_sale_days.toFixed(2) }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="建议采购量" prop="history.custom_real_advice_quantity" align="center">
            <div slot-scope="{row}">
              <template v-if="row.history">
                <el-tag size="mini" type="danger" effect="dark" v-if="row.history.custom_real_advice_quantity">
                  {{ row.history.custom_real_advice_quantity }}
                </el-tag>
                <el-tag size="mini" type="success" v-else>
                  {{ row.history.custom_real_advice_quantity }}
                </el-tag>
              </template>
            </div>
          </el-table-column>
        </el-table-column>

        <el-table-column label="建议备货量" prop="max" sortable="custom" align="center">
        </el-table-column>
        <el-table-column label="库存" align="center">
          <el-table-column label="仓内" prop="item.sales_inventory_num" align="center">
          </el-table-column>
          <el-table-column label="不可用" prop="item.unavailable_warehouse_inventory_num" align="center">
          </el-table-column>
          <el-table-column label="已发货" prop="item.wait_receive_num" align="center">
          </el-table-column>
          <el-table-column label="待质检" prop="item.wait_qc_num" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="Vmi" align="center">
          <el-table-column label="待发(量)" prop="history.wait_delivery_inventory_num" align="center">
            <div slot-scope="{row}">
              <template v-if="row.history">
                <el-tag type="primary" v-if="row.history.share_dxm">
                  {{ row.history.wait_delivery_inventory_num }}({{ row.history.other_wait_delivery_inventory_num }})
                </el-tag>
                <el-tag type="primary" v-else>{{ row.history.wait_delivery_inventory_num }}</el-tag>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="待发(件)" prop="item.vmi_wait_delivery_num" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <el-table-column label="销量系数" align="center">
            <el-table-column label="7系" prop="history.seven_day_coef" align="center">
              <template slot="header">
                <el-tooltip content="7日系数">
                  <span>7系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.history">
                  {{ row.history.seven_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
            <el-table-column label="30系" prop="history.thirty_day_coef" align="center">
              <template slot="header">
                <el-tooltip content="30日系数">
                  <span>30系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.history">
                  {{ row.history.thirty_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
            <el-table-column label="90系" prop="history.ninety_day_coef" align="center">
              <template slot="header">
                <el-tooltip content="90日系数">
                  <span>90系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.history">
                  {{ row.history.ninety_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="销量" align="center">
            <el-table-column label="图" align="center" width="300px">
              <div slot-scope="{row}">
                <Daily :list="row.daily_list" :field_names="['单量']" :fields="['count']"></Daily>
              </div>
            </el-table-column>
            <el-table-column label="今" prop="history.today" align="center">
            </el-table-column>
            <el-table-column label="差" prop="history.two_day_diff" align="center">
            </el-table-column>
            <el-table-column label="昨" prop="history.two_day" align="center">
            </el-table-column>
            <el-table-column label="差" prop="history.three_day_diff" align="center">
            </el-table-column>
            <el-table-column label="前" prop="history.three_day" align="center">
            </el-table-column>
            <el-table-column label="7" prop="history.seven_day" align="center">
            </el-table-column>
            <el-table-column label="周差" prop="history.last_week_diff" align="center">
            </el-table-column>
            <el-table-column label="30" prop="history.thirty_day" align="center">
            </el-table-column>
            <el-table-column label="全" prop="history.all" align="center">
              <div slot-scope="{row}">
                        <span style="font-size: 12px" v-if="row.history">
                          {{ row.history.all }}
                        </span>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="最高" align="center">
            <el-table-column label="7" prop="history.seven_day_max" align="center">
            </el-table-column>
            <el-table-column label="30" prop="history.thirty_day_max" align="center">
            </el-table-column>
            <el-table-column label="全" prop="history.all_max" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="加购" align="center">
            <el-table-column label="7日" prop="item.in_cart_number_7d" align="center">
            </el-table-column>
            <el-table-column label="累计" prop="item.in_card_number" align="center">
            </el-table-column>
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

    <TemuDlgPlans :id="plans.id" :visible="plans.visible" @close="plans.visible=false"></TemuDlgPlans>
    <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
    <TemuDlgStockBatch :account-options="accountOptions" :ids="[stock.id]" :sku_ids="stock.sku_id ? [stock.sku_id] : []"
                       :visible="stock.visible" @close="stock.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :dxm_sku="stockBySku.sku" :visible="stockBySku.visible"
                       @close="stockBySku.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :ids="stockBatch.ids" :visible="stockBatch.visible"
                       @close="stockBatch.visible=false"></TemuDlgStockBatch>
    <TemuDlgActivityAppliedList :spu_ids="dlgActivityAppliedProduct.ids" :visible="dlgActivityAppliedProduct.visible"
                                @close="dlgActivityAppliedProduct.visible=false" @suc="getTableData"
                                v-if="dlgActivityAppliedProduct.visible"></TemuDlgActivityAppliedList>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  saleItemBan,
} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image";
import TemuDlgPlans from "@/view/temu/components/dlg_plans";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily";
import {accountList} from "@/api/temu/account";
import {dxmSync} from "@/api/dxm/sync";
import TemuDlgStockBatch from "@/view/temu/sale/components/dlg_stock_batch.vue";
import {stockSync} from "@/api/temu/stock";
import Daily from "@/view/components/daily.vue";
import TemuDlgActivityAppliedList from "@/view/temu/activity/components/dlg_activity_applied_list.vue";
import {itemAdviceList} from "@/api/temu/item_advice";

export default {
  components: {
    TemuDlgActivityAppliedList,
    Daily,
    TemuDlgStockBatch,
    TemuDlgDaily,
    TemuDlgPlans,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: itemAdviceList,

      timeoutId: undefined,

      selectRows: [],

      dlgActivityAppliedProduct: {
        ids: [],
        visible: false,
      },

      plans: {
        id: undefined,
        visible: false,
      },

      daily: {
        id: undefined,
        visible: false,
      },

      stock: {
        id: undefined,
        sku_id: undefined,
        visible: false,
      },

      stockBySku: {
        sku: undefined,
        visible: false,
      },

      stockBatch: {
        ids: [],
        visible: false
      },

      accountOptions: [],
      levelOptions: [
        {id: 7, name: "超级爆品"},
        {id: 6, name: "大爆品"},
        {id: 5, name: "中爆品"},
        {id: 4, name: "小爆品"},
        {id: 3, name: "3类品"},
        {id: 2, name: "2类品"},
        {id: 1, name: "1类品"},
        {id: 0, name: "新品"},
        {id: -1, name: "淘汰1类"},
        {id: -2, name: "淘汰2类"},
        {id: -3, name: "淘汰3类"},
        {id: -10, name: "已下架"},
      ],
    }
  },
  computed: {},
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    openPlans(id) {
      this.plans.id = id
      this.plans.visible = true
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    async reqStock(id, skuId) {
      this.stock.id = id
      this.stock.sku_id = skuId
      this.stock.visible = true
    },
    async onDxmSync() {
      let resp = await dxmSync()
      if (resp.code !== 0) {
        return
      }

      if (resp.data) {
        this.$message("同步成功，请不要过快同步")
      } else {
        this.$message("同步失败，请稍后再试")
      }
    },
    levelName(row) {
      if (!row.history) {
        return "新品"
      }
      let op = this.levelOptions.find(op => op.id === row.history.level)
      if (!op) {
        return "新品"
      }
      return op.name
    },
    selectionChange(val) {
      this.selectRows = val
      let ids = this.selectRows.map(s => s.sale.product_skc_id)
      if (ids.length) {
        this.copy(ids.join((" ")))

        let extCodes = []
        this.selectRows.forEach((row) => {
          if (extCodes.indexOf(row.sku_ext_code) < 0) {
            extCodes.push(row.sku_ext_code)
          }
        })
        if (extCodes.length) {
          this.$message('货号是 ' + extCodes.join(" "))
        }
      }
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async ban(id, is_ban) {
      let resp = await saleItemBan({id: id, is_ban: is_ban})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async syncAdvice() {
      let resp = await stockSync()
      if (resp.code) {
        return
      }

      this.$message("同步成功，请不要过快同步")
    },
    openStockBatch() {
      let ids = []
      this.selectRows.forEach((item) => {
        if (item.sale) {
          ids.push(item.sale.product_skc_id)
        }
      })
      this.stockBatch.ids = ids
      this.stockBatch.visible = true
    },
    async openActivityAppliedProductList(ids) {
      this.dlgActivityAppliedProduct.ids = ids
      this.dlgActivityAppliedProduct.visible = true
    },
    skuReview(row) {
      if (row.review) {
        return `${row.review.count}(${row.review.score.toFixed(2)})`
      } else {
        return ""
      }
    },
  },
  filters: {},
  mounted() {
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout()
    })
  },
  async created() {
    this.$set(this.searchInfo, "is_ban", 1)

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
</style>