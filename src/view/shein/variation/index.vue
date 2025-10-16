<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="请选择状态" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" v-model="searchInfo.search_content" clearable filterable
                        @keyup.enter.native="onSubmit">
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable :style="{width: '130px'}">
                  <el-option v-for="(item, index) in searchCondOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.other_cond" placeholder="其他条件" multiple collapse-tags filterable
                         clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in orderedOtherCondOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.title" type="primary" placeholder="标题" clearable
                        @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onDxmSync">同步店小秘</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="canBatchApplySelectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onBatchApply(canBatchApplySelectRows)">批量备货</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"  @selection-change="selectionChange"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="商品信息" width="240" align="center" fixed>
          <div slot-scope="{row}">
            <div v-if="row.product.account">
              <el-tag size="mini" type="primary">账号: {{ row.product.account.name }}</el-tag>
            </div>
            <div>
              <el-tooltip size="mini" :content="row.product.product_name_ch" placement="right">
                <div v-if="row.product.product_name_ch.length >= 25">
                  {{ row.product.product_name_ch.substring(0, 25) }}...
                </div>
                <div v-else>
                  {{ row.product.product_name_ch }}
                </div>
              </el-tooltip>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product.spu_name)">Spu Code: {{
                  row.product.spu_name
                }}
              </el-tag>
              <i class="el-icon-search" style="margin-left: 5px; color: red"
                 @click="changeSearchCond(1, row.product.spu_name)"></i>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product_id)">Skc Id: {{ row.product_id }}</el-tag>
              <i class="el-icon-search" style="margin-left: 5px; color: red"
                 @click="changeSearchCond(2, row.product_id)"></i>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.id)">Sku Id: {{ row.id }}</el-tag>
              <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(3, row.id)"></i>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.bei_huo ? row.bei_huo.supplierCode : row.product.supplier_code)">货号:
                {{ row.bei_huo ? row.bei_huo.supplierCode : row.product.supplier_code }}
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary">状态: {{ status(row.product.shelf_status) }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="danger" effect="dark">售价: ¥ {{ row.cost }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="danger" v-if="row.statistic && row.statistic.price">成本:
                {{ row.statistic.price.toFixed(2) }}
              </el-tag>
            </div>
            <div v-if="row.dxm_goods_sku">
              <el-tag size="mini" type="primary" @click="copy(row.dxm_goods_sku.sku)">
                小秘:{{
                  row.dxm_goods_sku.sku.length > 20 ? row.dxm_goods_sku.sku.substring(0, 20) + ".." : row.dxm_goods_sku.sku
                }}
                x {{ row.dxm_goods_sku.count > 0 ? row.dxm_goods_sku.count : 1 }}
              </el-tag>
              <i class="el-icon-search" style="margin-left: 5px; color: red"
                 @click="jumpGoods(row.dxm_goods_sku.sku)"></i>
            </div>
            <div v-else>
              <el-tag size="mini" type="danger">未配对店小秘</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary">创建时间: {{ new Date(row.product.created_at).toLocaleDateString() }}
              </el-tag>
            </div>
            <div v-if="row.bei_huo">
              <el-tag size="mini" type="primary" v-if="row.bei_huo.goodsLevelName">层级: {{ row.bei_huo.goodsLevelName }}</el-tag>
              <el-tag size="mini" type="primary" v-if="row.bei_huo.oldGoodsLevelName">旧层级: {{ row.bei_huo.oldGoodsLevelName }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center" fixed>
          <div slot-scope="{row}">
            <template v-if="row.product && row.product.main_image">
              <KdxImage :src="row.product.main_image"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed>
          <div slot-scope="{row}">
            <div>
              <el-link type="primary" :href="`https://us.shein.com/pdsearch/${row.product_id}`" :underline="false"
                       target="_blank">
                前端查看
              </el-link>
            </div>

            <el-row>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain>发货
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单
                </el-button>
              </el-col>
              <el-col :span="24">
                <el-button type="danger" size="mini" style="width: 100%" @click="openDxmGoods(row.id)"
                           v-if="row.statistic && row.statistic.is_jg">配对|加工
                </el-button>
                <el-button type="primary" size="mini" style="width: 100%" @click="openDxmGoods(row.id)" plain v-else>
                  配对
                </el-button>
              </el-col>
            </el-row>
            <div v-if="!row.dxm_goods_sku">
              <el-button type="primary" size="mini" style="width: 100%" @click="genFirstOrder(row.id)" plain>
                生成首单
              </el-button>
            </div>
            <div v-else>
              <el-button type="primary" size="mini" style="width: 100%" @click="openAddToBuyPlan(row)" plain
                         v-if="row.buy_record">生成采购(今日已采)
              </el-button>
              <el-button type="warning" size="mini" style="width: 100%" @click="openAddToBuyPlan(row)" plain v-else>
                生成采购(今日未采)
              </el-button>
            </div>
            <div v-if="row.ban">
              <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, false)">取消禁售</el-button>
            </div>
            <div v-else>
              <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, true)">设置禁售</el-button>
            </div>
            <template v-if="row.statistic">
              <div>
                <el-button size="mini" style="width: 100%" type="primary" @click="onBatchApply([row])" v-if="row.statistic.can_apply_suggest" plain>申请备货({{row.statistic.suggest_num}})</el-button>
              </div>
              <div>
                <el-button size="mini" style="width: 100%" type="primary" @click="openApplyList(row.id)" v-if="row.statistic.apply_times" plain>备货记录({{row.statistic.apply_times}})</el-button>
              </div>
            </template>
            <!--              <el-row v-if="row.statistic.total_plan_count > 0">-->
            <!--                <el-col :span="12">-->
            <!--                  <el-button type="primary" size="mini" style="width: 100%"-->
            <!--                             @click="reqStock(row.sale.product_skc_id, row.id)" plain>备(Sku)-->
            <!--                  </el-button>-->
            <!--                </el-col>-->
            <!--                <el-col :span="12">-->
            <!--                  <el-button type="primary" size="mini" style="width: 100%"-->
            <!--                             @click="reqStock(row.sale.product_skc_id, 0)" plain>备(Skc)-->
            <!--                  </el-button>-->
            <!--                </el-col>-->
            <!--              </el-row>-->
            <!--              <div v-else>-->
            <!--                <el-button type="primary" size="mini" style="width: 100%"-->
            <!--                           @click="reqStock(row.sale.product_skc_id, 0)" plain>申请备货(单Skc)-->
            <!--                </el-button>-->
            <!--              </div>-->
          </div>
        </el-table-column>

        <el-table-column label="备货" align="center">
          <el-table-column label="逻辑" prop="statistic.bei_huo_days" sortable="custom" align="center">
            <div slot-scope="{row}">
              {{ row.bei_huo.goodsDate }} + {{ row.bei_huo.stockDate }}
            </div>
          </el-table-column>

          <el-table-column prop="statistic.custom_available_sale_days" sortable="custom" align="center">
            <template slot="header">
              总可售天数
              <el-tooltip content="仓内可售天数+在途可售天数">
                <i class="el-icon-info"></i>
              </el-tooltip>
            </template>
            <div slot-scope="{row}">
              <div v-if="row.statistic">
                {{ row.statistic.custom_available_sale_days.toFixed(2) }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="仓内可售天数" align="center">
            <el-table-column label="平台" prop="bei_huo.ableSaleDays" sortable="custom" align="center">
            </el-table-column>
            <el-table-column label="我" prop="statistic.custom_available_sale_days_from_inventory" sortable="custom"
                             align="center">
              <template slot="header">
                我
                <el-tooltip content="含发货在途">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.statistic">
                  <el-tag size="small" type="danger" effect="dark"
                          v-if="row.statistic.custom_available_sale_days_from_inventory <= 4">
                    {{ row.statistic.custom_available_sale_days_from_inventory.toFixed(2) }}
                  </el-tag>
                  <el-tag size="small" type="warning" effect="dark"
                          v-else-if="row.statistic.custom_available_sale_days_from_inventory <= 8">
                    {{ row.statistic.custom_available_sale_days_from_inventory.toFixed(2) }}
                  </el-tag>
                  <el-tag size="small" type="success" v-else>
                    {{ row.statistic.custom_available_sale_days_from_inventory.toFixed(2) }}
                  </el-tag>
                </template>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="建议采购量" prop="statistic.custom_real_advice_quantity" sortable="custom" sort-by="today" align="center">
            <div slot-scope="{row}">
              <template v-if="row.statistic">
                <el-tag size="small" type="danger" effect="dark" v-if="row.statistic.custom_real_advice_quantity">
                  {{row.statistic.custom_real_advice_quantity}}
                </el-tag>
                <el-tag size="small" type="success" v-else>
                  {{row.statistic.custom_real_advice_quantity}}
                </el-tag>
              </template>
            </div>
          </el-table-column>
          <!--              <el-row v-if="row.statistic.total_plan_count > 0">-->
          <!--                <el-col :span="12">-->
          <!--                  <el-button type="primary" size="mini" style="width: 100%"-->
          <!--                             @click="reqStock(row.sale.product_skc_id, row.id)" plain>备(Sku)-->
          <!--                  </el-button>-->
          <!--                </el-col>-->
          <!--                <el-col :span="12">-->
          <!--                  <el-button type="primary" size="mini" style="width: 100%"-->
          <!--                             @click="reqStock(row.sale.product_skc_id, 0)" plain>备(Skc)-->
          <!--                  </el-button>-->
          <!--                </el-col>-->
          <!--              </el-row>-->
          <!--              <div v-else>-->
          <!--                <el-button type="primary" size="mini" style="width: 100%"-->
          <!--                           @click="reqStock(row.sale.product_skc_id, 0)" plain>申请备货(单Skc)-->
          <!--                </el-button>-->
          <!--              </div>-->
          <!--          </div>-->
        </el-table-column>
        <el-table-column label="店小秘" align="center">
          <el-table-column label="在途" prop="statistic.on_way_count" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.statistic">
                <el-tooltip content="加工在途(采购在途)" placement="right" v-if="row.statistic.is_jg">
                  <div>{{ row.statistic.on_way_count }}({{ row.statistic.jg_on_way_count }})</div>
                </el-tooltip>
                <div v-else>{{ row.statistic.on_way_count }}</div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="入仓" prop="statistic.kcl_count" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="发出" prop="statistic.total_plan_count" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.statistic">
                <el-tag type="primary" v-if="row.statistic.share_dxm">
                  {{ row.statistic.total_plan_count }}({{ row.statistic.other_total_plan_count }})
                </el-tag>
                <el-tag type="primary" v-else>{{ row.statistic.total_plan_count }}</el-tag>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="剩余" prop="statistic.real_inventory_in_warehouse" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag type="primary" v-if="row.statistic">{{ row.statistic.real_inventory_in_warehouse }}</el-tag>
            </div>
          </el-table-column>
          <el-table-column label="最多可加工" prop="statistic.jg_kcl_count" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="剩余+在途" prop="statistic.real_inventory" sortable="custom" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <el-table-column label="库存" align="center">
            <el-table-column label="仓内" align="center" prop="bei_huo.stock" sortable="custom">
            </el-table-column>
            <el-table-column label="在途" align="center" prop="bei_huo.onWayAmount" sortable="custom">
            </el-table-column>
<!--            <el-table-column label="待入" align="center" prop="bei_huo.waitWarehousingNum" sortable="custom">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="未发" align="center" prop="bei_huo.disdeliveredNum" sortable="custom">-->
<!--            </el-table-column>-->
          </el-table-column>
          <el-table-column label="销量" align="center">
            <el-table-column label="7系" prop="statistic.seven_day_coef" sortable="custom" sort-by="today"
                             align="center">
              <template slot="header">
                <el-tooltip content="7日系数">
                  <span>7系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.statistic">
                  {{ row.statistic.seven_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
            <el-table-column label="今" prop="statistic.today" sortable="custom" sort-by="today" align="center">
            </el-table-column>
            <el-table-column label="差" prop="statistic.two_day_diff" sortable="custom" sort-by="today" align="center">
            </el-table-column>
            <el-table-column label="昨" prop="statistic.two_day" sortable="custom" sort-by="today" align="center">
            </el-table-column>
            <el-table-column label="差" prop="statistic.three_day_diff" sortable="custom" sort-by="today"
                             align="center">
            </el-table-column>
            <el-table-column label="前" prop="statistic.three_day" sortable="custom" sort-by="today" align="center">
            </el-table-column>
            <el-table-column label="7" prop="statistic.seven_day" sortable="custom" sort-by="today" align="center">
            </el-table-column>
            <el-table-column label="30" prop="statistic.thirty_day" sortable="custom" sort-by="today" align="center">
            </el-table-column>
            <el-table-column label="全" prop="statistic.all" sortable="custom" sort-by="today" align="center">
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

    <SheinDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></SheinDlgDaily>
    <SheinDlgDxmGoods :id="dxmGoods.id" :visible="dxmGoods.visible" @close="dxmGoods.visible=false"
                      @update="getTableData"></SheinDlgDxmGoods>
    <SheinDlgDeliveryItems :id="plans.id" :visible="plans.visible" @close="plans.visible=false"></SheinDlgDeliveryItems>
    <SheinDlgBatchApply :rows="batchApply.rows" :visible="batchApply.visible" @close="batchApply.visible=false"></SheinDlgBatchApply>
    <SheinDlgApplyList :variation_id="applyList.variation_id" :visible="applyList.visible" @close="applyList.visible=false"></SheinDlgApplyList>

    <el-dialog :visible.sync="addPlan.visible" title="生成采购" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl"
               :before-close="()=>{addPlan.visible=false}">
      <el-input-number size="mini" v-model="addPlan.count" placeholder="请输入数量" :min="1" :precision="0"
                       style="width: 100%" clearable></el-input-number>
      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="addToBuyPlan">生成采购
      </el-button>
    </el-dialog>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  variationList,
} from "@/api/shein/variation";
import KdxImage from "@/components/image/image";
import SheinDlgDaily from "./components/dlg_daily";
import SheinDlgDxmGoods from "./components/dlg_dxm_goods";
import {variationFirstOrder, variationAddBuyRecord, variationBan} from "../../../api/shein/variation";
import {accountList} from "../../../api/shein/account";
import {dxmAddToPlan} from "../../../api/dxm/plan";
import {dxmSync} from "../../../api/dxm/sync";
import {dxmGoodsId} from "@/api/dxm/goods";
import SheinDlgDeliveryItems from "@/view/shein/components/dlg_delivery_items.vue";
import SheinDlgBatchApply from "@/view/shein/components/dlg_batch_apply.vue";
import SheinDlgApplyList from "@/view/shein/components/dlg_apply_list.vue";

export default {
  components: {
    SheinDlgApplyList,
    SheinDlgBatchApply,
    SheinDlgDeliveryItems,
    SheinDlgDaily,
    SheinDlgDxmGoods,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: variationList,

      plans: {
        id: undefined,
        visible: false,
      },

      applyList: {
        variation_id: undefined,
        visible: false,
      },

      daily: {
        id: undefined,
        visible: false,
      },

      cost: {
        id: undefined,
        visible: false,
      },

      dxmGoods: {
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

      addPlan: {
        item_id: undefined,
        multi: undefined,
        count: undefined,
        sku: undefined,
        visible: false,
      },

      toUpload: {
        is_create: false,
        id: undefined,
        pdf_url: undefined,
        visible: false,
      },

      accountOptions: [],
      searchCondOptions: [
        {id: 1, name: "Spu Code"},
        {id: 2, name: "Skc Id"},
        {id: 3, name: "Sku Id"},
        {id: 4, name: "小秘sku"},
        {id: 5, name: "小秘sku模糊"},
      ],
      statusOptions: [
        {id: "ON_SHELF", name: "已上架"},
        {id: "SOLD_OUT", name: "已售罄"},
        {id: "WAIT_SHELF", name: "待上架"},
      ],
      otherCondOptions: [
        {id: 23, name: "未禁售"},
        {id: 24, name: "已禁售"},
        {id: 17, name: "加工商品"},
        {id: 18, name: "今日未采购"},
        {id: 19, name: "今日已采购"},
        {id: 2, name: "已断货"},
        {id: 3, name: "未配对"},
        {id: 31, name: "已配对"},
        {id: 21, name: "小秘剩余>0"},
        {id: 22, name: "小秘总剩余>0"},
        {id: 58, name: "小秘总剩余=0"},
        {id: 25, name: "待发件为0"},
        {id: 33, name: "待发件>0"},
        {id: 26, name: "总发出为0"},
        {id: 54, name: "总发出>0"},
        {id: 27, name: "仓内可售天数>0"},
        {id: 32, name: "仓内可售天数<=4天"},
        {id: 55, name: "仓内可售天数<=8天"},
        {id: 56, name: "仓内可售天数<=12天"},
        {id: 57, name: "在途>0"},
        {id: 59, name: "建议备货>0"},
        {id: 60, name: "可申请备货"},
      ],

      selectRows: [],
      batchApply: {
        rows: [],
        visible: false
      }
    }
  },
  computed: {
    canBatchApplySelectRows() {
      return this.selectRows.filter((item) => {
        if (!item.statistic) {
          return false
        }

        return item.statistic.can_apply_suggest
      })
    },
    orderedOtherCondOptions() {
      const selected = this.searchInfo.other_cond // 当前选中的选项
      if (!selected) {
        return this.otherCondOptions
      }
      const options = this.otherCondOptions // 所有选项
      const ordered = []
      // 遍历选项，将选中的选项排在前面，未选中的选项排在后面
      options.forEach((option) => {
        const index = selected.indexOf(option.id)
        if (index > -1) {
          if (ordered[index]) {
            ordered.push(ordered[index])
          }
          ordered[index] = option
        }
      })
      options.forEach((option) => {
        const index = selected.indexOf(option.id)
        if (index === -1) {
          ordered.push(option)
        }
      })
      return ordered
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    openApplyList(id) {
      this.applyList.variation_id = id
      this.applyList.visible = true
    },
    openPlans(id) {
      this.plans.id = id
      this.plans.visible = true
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    openCost(id) {
      this.cost.id = id
      this.cost.visible = true
    },
    openDxmGoods(id) {
      this.dxmGoods.id = id
      this.dxmGoods.visible = true
    },
    async genFirstOrder(id) {
      let resp = await variationFirstOrder({id: id})
      if (resp.code) {
        return
      }

      this.getTableData() // 同步数据

      this.$message("生成成功，请配对、采购后将该订单搁置")
      window.open("https://www.dianxiaomi.com/order/index.htm", "_target")
    },
    async openAddToBuyPlan(item) {
      this.addPlan.item_id = item.id
      let multi = 1
      if (item.dxm_goods_sku && item.dxm_goods_sku.count) {
        multi = item.dxm_goods_sku.count
      }
      this.addPlan.multi = multi
      this.addPlan.count = Math.max(1, item.statistic.custom_real_advice_quantity) // 最少采购一个
      this.addPlan.sku = item.dxm_goods_sku.sku
      this.addPlan.visible = true
    },
    async addToBuyPlan() {
      let count = Math.max(1, this.addPlan.count * this.addPlan.multi) // 最少采购一个
      let resp = await dxmAddToPlan({sku: this.addPlan.sku, count: count, platform: "SHEIN"})
      if (resp.code) {
        return
      }

      if (!resp.data.suc) {
        this.$message.error("加入失败")
        return
      }

      this.$message("加入成功，我将跳转")

      this.addPlan.visible = false

      if (resp.data.is_jg) {
        window.open("https://www.dianxiaomi.com/processSku/index.htm?type=1", "_blank")
      }

      await variationAddBuyRecord({id: this.addPlan.item_id})
      this.getTableData()
    },
    async reqStock(id, skuId) {
      this.stock.id = id
      this.stock.sku_id = skuId
      this.stock.visible = true
    },
    async reqStockBySku(sku) {
      this.stockBySku.sku = sku
      this.stockBySku.visible = true
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
    async onBatchApply(rows) {
      this.batchApply.rows = rows
      this.batchApply.visible = true
    },
    status(s) {
      for (const op of this.statusOptions) {
        if (op.id === s) {
          return op.name
        }
      }
      return s
    },
    changeSearchCond(cond, content) {
      if (cond !== 6) {
        this.$set(this.searchInfo, "search_cond", cond)
        this.$set(this.searchInfo, "search_content", content)
        this.getTableData()
        return
      }

      let routeUrl = this.$router.resolve({
        name: "shein_variation_list",
        query: {
          "cond": cond,
          "content": content,
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    async jumpGoods(sku) {
      this.copy(sku)

      let resp = await dxmGoodsId({id: sku})
      if (resp.code) {
        return
      }

      // 跳转
      window.open(`https://www.dianxiaomi.com/dxmCommodityProduct/index.htm?id=${resp.data}`, "_target")
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async ban(id, is_ban) {
      let resp = await variationBan({id: id, is_ban: is_ban})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    onCreate(id) {
      this.toUpload.is_create = true
      this.toUpload.id = id
      this.toUpload.pdf_url = undefined
      this.toUpload.visible = true
    },
    selectionChange(val) {
      this.selectRows = val
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "search_cond", 2)
    this.$set(this.searchInfo, "other_cond", [23])

    if (this.$route.query && this.$route.query.cond && this.$route.query.content) {
      this.$set(this.searchInfo, "search_cond", Number(this.$route.query.cond))
      this.$set(this.searchInfo, "search_content", this.$route.query.content)
    }

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
</style>