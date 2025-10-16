<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :xs="8" :sm="6" :lg="3">-->
<!--            <el-form-item label-width="0">-->
<!--              <el-select v-model="searchInfo.status" placeholder="请选择状态" filterable clearable-->
<!--                         :style="{width: '100%'}">-->
<!--                <el-option value=""></el-option>-->
<!--                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"-->
<!--                           :value="item.id"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.stock_mode" placeholder="请选择库存类型" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option :label="v.name" :value="v.id" v-for="(v, index) in stockModeOptions" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.jit_statue" placeholder="请选择JIT状态" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in jitStatueOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.level" placeholder="请选择评级" multiple collapse-tags filterable clearable
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" v-model="searchInfo.search_content" clearable filterable
                        @keyup.enter.native="onSubmit">
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable :style="{width: '100px'}">
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
          <el-col :xs="12" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小可售天数" v-model="searchInfo.available_min" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大可售天数" v-model="searchInfo.available_max" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="18">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.title" type="primary" placeholder="标题" clearable
                        @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onDxmSync">同步店小秘</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" @selection-change="selectionChange"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="商品信息" width="260" align="center" fixed>
          <template #header>
            <div>
              <div>商品信息</div>
              <div style="display: flex;">
                <el-button type="primary" size="mini" @click="handleSelectionCopyInfo('spu')">复制spu</el-button>
                <el-button type="primary" size="mini" @click="handleSelectionCopyInfo('skc')">复制skc</el-button>
                <el-button type="primary" size="mini" @click="handleSelectionCopyInfo('sku')">复制sku</el-button>
              </div>
            </div>
          </template>
          <div slot-scope="{row}">
            <div v-if="row.product.account">
              <el-tag size="mini" type="primary">账号: {{ row.product.account.name }}</el-tag>
            </div>
            <div>
              <el-tooltip size="mini" :content="row.product.product_name" placement="right">
                <div v-if="row.product.product_name.length >= 25">
                  {{ row.product.product_name.substring(0, 25) }}...
                </div>
                <div v-else>
                  {{ row.product.product_name }}
                </div>
              </el-tooltip>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product.spu_code)">Spu Code: {{ row.product.spu_code }}</el-tag>
              <i class="el-icon-search" style="margin-left: 5px; color: red"
                 @click="changeSearchCond(1, row.product.spu_code)"></i>
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
<!--            <div v-if="row.product">-->
<!--              <el-tag size="mini" type="primary" effect="dark">买手: {{ row.product.buyer_name }}</el-tag>-->
<!--            </div>-->
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.article_number)">货号: {{ row.article_number }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary">库存模式: {{ stockModeName(row.product.stock_mode) }}</el-tag>
            </div>
<!--            <div>-->
<!--              <el-tag size="mini" type="primary">状态: {{ status(row.product.status) }}</el-tag>-->
<!--            </div>-->
            <div>
              <el-tag size="mini" type="warning" effect="dark" v-if="row.statistic && row.statistic.product_sales_level">
                评级: {{ row.statistic.product_sales_level }}
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="danger" effect="dark">售价: ¥ {{ row.price.toFixed(2) }}</el-tag>
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
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center" fixed>
          <div slot-scope="{row}">
            <template v-if="row.product && row.product.pic_set">
              <KdxImage :src="row.product.pic_set[0]"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed>
          <div slot-scope="{row}">
            <el-row>
              <!--              <el-col :span="12">-->
              <!--                <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain>发货-->
              <!--                </el-button>-->
              <!--              </el-col>-->
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="danger" size="mini" style="width: 100%" @click="openDxmGoods(row.id)"
                           v-if="row.statistic.is_jg">配对|加工
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

        <el-table-column label="标记" min-width="300px" align="center">
          <div slot-scope="{row}">
            <template v-if="row.statistic">
              <template v-for="(tag, index) in row.statistic.tag_name_list">
                <el-tag size="mini" type="danger" :key="index" v-if="row.show_all || index <= 10">
                  {{tag}}
                </el-tag>
              </template>
              <div v-if="row.statistic.tag_name_list && row.statistic.tag_name_list.length > 10">
                <el-button size="mini" type="primary" @click="show(row)">{{ row.show_all ? "收缩" : "更多" }}</el-button>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="备货" align="center">
          <el-table-column label="逻辑" prop="statistic.bei_huo_days" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.bei_huo">
                {{ row.bei_huo.safety_stock_days }} + {{row.bei_huo.vendor_lead_time}} + {{ row.bei_huo.stock_days }}
              </template>
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
                {{row.statistic.custom_available_sale_days.toFixed(2)}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="仓内可售天数" align="center">
            <el-table-column label="平台" prop="bei_huo.can_sell_days" sortable="custom" align="center">
              <div slot-scope="{row}">
                <template v-if="row.bei_huo">
                  {{ row.bei_huo.can_sell_days > 999 ? 999 : row.bei_huo.can_sell_days }}
                </template>
              </div>
            </el-table-column>
            <el-table-column label="我" prop="statistic.custom_available_sale_days_from_inventory" sortable="custom" align="center">
              <template slot="header">
                我
                <el-tooltip content="含发货在途">
                  <i class="el-icon-info"></i>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.statistic">
                  <el-tag size="small" type="danger" effect="dark" v-if="row.statistic.custom_available_sale_days_from_inventory <= 4">
                    {{row.statistic.custom_available_sale_days_from_inventory.toFixed(2)}}
                  </el-tag>
                  <el-tag size="small" type="warning" effect="dark" v-else-if="row.statistic.custom_available_sale_days_from_inventory <= 8">
                    {{row.statistic.custom_available_sale_days_from_inventory.toFixed(2)}}
                  </el-tag>
                  <el-tag size="small" type="success" v-else>
                    {{row.statistic.custom_available_sale_days_from_inventory.toFixed(2)}}
                  </el-tag>
                </template>
              </div>
            </el-table-column>
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
            <el-table-column label="仓内" align="center" prop="bei_huo.sale_stock_td" sortable="custom">
            </el-table-column>
            <el-table-column label="待接单" align="center" prop="bei_huo.wait_sup_confirm_pur_qty_td" sortable="custom">
            </el-table-column>
            <el-table-column label="未发货" align="center" prop="bei_huo.confirmed_onway_stock_td" sortable="custom">
            </el-table-column>
            <el-table-column label="已发货" align="center" prop="bei_huo.delivery_onway_stock_td" sortable="custom">
            </el-table-column>
            <el-table-column label="今日已下单" align="center" prop="bei_huo.already_pur_ord_qty_today" sortable="custom">
            </el-table-column>
            <el-table-column label="建议备货数" align="center" prop="statistic.custom_advice_quantity" sortable="custom">
              <div slot-scope="{row}">
                <div v-if="row.statistic && row.statistic.custom_advice_quantity > 0">
                  <el-tag size="mini" type="primary" effect="dark">{{row.statistic.custom_advice_quantity}}</el-tag>
                  <div>
                    <el-popover placement="left" trigger="click" @show="advice.count = row.statistic.custom_advice_quantity">
                      <div>
                        请输入备货数量:
                      </div>
                      <el-input-number size="mini" style="width: 100%" v-model="advice.count" :min="0" :precision="0"></el-input-number>
                      <el-button size="mini" style="width: 100%" type="primary" @click="confirmAdvice(row)">确认</el-button>
                      <el-button slot="reference" size="mini" type="primary">备</el-button>
                    </el-popover>
                  </div>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="可补货" align="center" prop="bei_huo.replenishment_quantity_max" sortable="custom">
              <div slot-scope="{row}">
                <template v-if="row.bei_huo">
                  {{row.bei_huo.replenishment_quantity_min}}-{{row.bei_huo.replenishment_quantity_max}}
                </template>
              </div>
            </el-table-column>
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

    <TiktokDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TiktokDlgDaily>
    <TiktokDlgDxmGoods :id="dxmGoods.id" :visible="dxmGoods.visible" @close="dxmGoods.visible=false" @update="getTableData"></TiktokDlgDxmGoods>

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
  variationCreateRequisition,
  variationList,
} from "@/api/tiktok/variation";
import KdxImage from "@/components/image/image";
import TiktokDlgDaily from "./components/dlg_daily";
import TiktokDlgDxmGoods from "./components/dlg_dxm_goods";
import {variationFirstOrder, variationAddBuyRecord} from "../../../api/tiktok/variation";
import {accountList} from "../../../api/tiktok/account";
import {dxmAddToPlan} from "../../../api/dxm/plan";
import {dxmSync} from "../../../api/dxm/sync";
import {dxmGoodsId} from "@/api/dxm/goods";

export default {
  components: {
    TiktokDlgDaily,
    TiktokDlgDxmGoods,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: variationList,

      selectRows: [],

      plans: {
        id: undefined,
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

      advice: {
        count: undefined,
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
        {id: 2000, name: "待维护"},
        {id: 3000, name: "待送样"},
        {id: 4000, name: "审版中"},
        {id: 4010, name: "待修改"},
        {id: 5000, name: "核价中"},
        {id: 5010, name: "价格确认"},
        {id: 6010, name: "待完善信息"},
        {id: 7000, name: "待下单"},
        {id: 8000, name: "已下单"},
        {id: 8100, name: "已上架"},
        {id: 8200, name: "已下架"},
        {id: 1000, name: "已取消"},
      ],
      jitStatueOptions: [
        {id: 1, name: "JIT测款成功"},
        {id: 2, name: "JIT测款中"},
        {id: 4, name: "JIT测款成功-持续JIT"},
        {id: 5, name: "JIT暂停测款"},
        {id: 6, name: "JIT测款终止-转备货"},
        {id: 7, name: "爆品缺货转JIT"},
      ],
      stockModeOptions: [
        {id: 1, name: "备货"},
        {id: 2, name: "JIT"},
      ],
      levelOptions: [
        {id: "S", name: "S"},
        {id: "A", name: "A"},
        {id: "B", name: "B"},
        {id: "C", name: "C"},
        {id: "D", name: "D"},
        {id: "E", name: "E"},
      ],
      otherCondOptions: [
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
      ]
    }
  },
  computed: {
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
    selectionChange(val) {
      this.selectRows = val
      let ids = this.selectRows.map(s=>s.id)
      if (ids.length) {
        this.copy(ids.join((" ")))
      }
    },
    handleSelectionCopyInfo(type) {
      let ids = [];
      if(type === 'spu') ids = this.selectRows.map(item => item.product.spu_code)
      else if(type === 'skc') ids = this.selectRows.map(item => item.product_id)
      else if(type === 'sku') ids = this.selectRows.map(item => item.id)
      if (ids.length) {
        this.copy(ids.join((" ")))
      }
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
      let resp = await dxmAddToPlan({sku: this.addPlan.sku, count: count, platform: "TIKTOK"})
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
    show(row) {
      if (row.show_all) {
        row.show_all = false
        return
      }

      this.$set(row, "show_all", true)
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
    status(s) {
      for (const op of this.statusOptions) {
        if (op.id === s) {
          return op.name
        }
      }
      return s
    },
    stockModeName(s) {
      let op = this.stockModeOptions.find((item) => {
        return item.id === s
      })
      if (op) {
        return op.name
      }
      return `未知: ${s}`
    },
    changeSearchCond(cond, content) {
      if (cond !== 6) {
        this.$set(this.searchInfo, "search_cond", cond)
        this.$set(this.searchInfo, "search_content", content)
        this.getTableData()
        return
      }

      let routeUrl = this.$router.resolve({
        name: "tiktok_variation_list",
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
    onCreate(id) {
      this.toUpload.is_create = true
      this.toUpload.id = id
      this.toUpload.pdf_url = undefined
      this.toUpload.visible = true
    },
    async confirmAdvice(row) {
      if (this.advice.count <= 0) {
        this.$message.error("请输入备货量")
        return
      }
      let resp = await variationCreateRequisition({id: row.id, count: this.advice.count})
      if (resp.code) {
        return
      }
      this.$message("备货成功，请注意该商品10分钟内都无法继续备货")
      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "search_cond", 2)

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