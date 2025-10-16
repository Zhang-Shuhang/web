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
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.categories" placeholder="请选择类目" multiple collapse-tags filterable
                         clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
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
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.bei_huo_days" placeholder="备货天数" multiple collapse-tags filterable
                         clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in beiHuoDaysCondOptions" :key="index" :label="item.name"
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
          <el-col :xs="8" :sm="6" :lg="1">
            <el-form-item label-width="0">
              <el-switch v-model="searchInfo.only_wait" active-text="只显示有待发"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="2">
            <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="2">
            <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onDxmSync">同步店小秘</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <!--                <el-table-column type="index" width="50" align="center" fixed></el-table-column>-->
        <el-table-column label="商品信息" width="120" align="center" fixed>
          <div slot-scope="{row}">
            <span style="font-size: 12px" @click="copy(row.id)">{{row.id}}</span>
            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="jumpGoods(row.id)"></i>

            <div v-if="row.image">
              <KdxImage :src="row.image"></KdxImage>
            </div>

            <el-button size="mini" type="danger" style="width: 100%" @click="markAsProcess(row.process.id, 0, true)" v-if="row.process">取消今日已处理</el-button>
            <el-button size="mini" type="primary" style="width: 100%" @click="markAsProcess(row.id, 1, false)" v-else>标记今日已处理</el-button>
          </div>
        </el-table-column>
        <el-table-column label="店小秘" align="center">
          <el-table-column label="在途" prop="on_way_count" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tooltip content="加工在途(采购在途)" placement="right"
                          v-if="row.is_jg">
                <div>{{ row.on_way_count }}({{ row.jg_on_way_count }})</div>
              </el-tooltip>
              <div v-else>{{ row.on_way_count }}</div>
            </div>
          </el-table-column>
          <el-table-column label="入仓" prop="kcl_count" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="实收" prop="total_plan_count" sortable="custom" align="center">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                {{history.total_plan_count}}
              </div>
              <div class="footer">
                  {{row.total_plan_count}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="退回" prop="total_return_count" sortable="custom" align="center">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                {{history.total_return_count}}({{history.total_unconfirmed_return_count}})
              </div>
              <div class="footer">
                {{row.total_return_count}}({{row.total_unconfirmed_return_count}})
              </div>
            </div>
          </el-table-column>
          <el-table-column label="剩余" prop="real_inventory_in_warehouse" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag type="primary">{{ row.real_inventory_in_warehouse }}
              </el-tag>
              <div v-if="row.inventory_fix">
                <template v-if="row.inventory_fix">
                  <el-tooltip :content="`修改库存数量(${row.inventory_fix.change_count})`"
                              placement="right">
                    <el-button type="primary" size="mini" style="width: 100%"
                               @click="cancelFixInventory(row.id)">取消
                    </el-button>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-button type="primary" size="mini" style="width: 100%"
                             @click="openFixInventoryDlg(row.id, row.real_inventory_in_warehouse)">
                    修
                  </el-button>
                </template>
              </div>
              <template v-else>
                <el-button type="primary" size="mini" style="width: 100%" @click="openFixInventoryDlg(row.id, row.real_inventory_in_warehouse)">修</el-button>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="最多加" width="90px" prop="jg_kcl_count" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="总剩余" width="90px" prop="real_inventory" sortable="custom" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="产品" width="120" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              <div v-if="history.item && history.item.sale && history.item.sale.account">
                <el-tag size="mini" type="primary">
                  {{history.item.sale.account.name}}
                </el-tag>
              </div>
              <div v-if="history.item && history.item.sale">
                <el-tag size="mini" type="primary" @click="copy(history.item && history.item.sale.product_skc_id.toString())">SKC: {{history.item && history.item.sale.product_skc_id}}</el-tag>
              </div>
              <div>
                <el-tag size="mini" type="primary" @click="copy(history.id.toString())"> SKU: {{history.id}} </el-tag>
              </div>
              <div v-if="history.item">
                <el-tag size="mini" type="primary" @click="copy(history.item.sku_ext_code)">货号: {{ history.item.sku_ext_code }}</el-tag>
              </div>
              <div v-if="history.item && history.item.sale">
                <el-tag size="mini" type="danger" v-if="history.item.sale.picture_audit_status !== 2">图审未过</el-tag>
                <el-tag size="mini" type="primary" v-else>图审已过</el-tag>
              </div>
<!--              <div v-if="history.item && history.item.review_count">-->
<!--                <el-tag size="mini" type="primary">评分: {{ history.item.review_count }}({{ history.item.review_score.toFixed(2) }})</el-tag>-->
<!--              </div>-->
            </div>
            <div class="footer">
              <el-button type="primary" size="mini" style="width: 100%" @click="copyAllSkc(row)">复制所有Skc</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              <el-link type="primary" :href="`https://www.temu.com/goods.html?goods_id=${history.item.sale.goods_id}&no_cache_id=egv4k`" :underline="false" target="_blank" v-if="history.item && history.item.sale && history.item.sale.account">
                前端查看
              </el-link>
              <div>
                <el-button type="primary" size="mini" style="width: 100%; height: 24px; line-height: 22px; padding: 0px" @click="openPlans(history.id)">发货({{history.join_count}})</el-button>
              </div>
            </div>
            <div class="footer">
              加入发货台({{row.join_count}})
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              <template v-if="history.item && history.item.item_image">
                <KdxImage :src="history.item.item_image.image"></KdxImage>
              </template>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="逻辑" prop="sales.bei_huo_days" sortable="custom" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              <template v-if="history.item">
                {{history.item.purchase_config}}
              </template>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="可售天数" prop="custom_available_sale_days_from_inventory" sortable="custom" align="center">
          <template slot="header">
            <el-tooltip content="含发货在途">
            <span>可售天数</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              <el-tag size="small" type="danger" effect="dark" v-if="history.custom_available_sale_days_from_inventory <= 4">
                {{history.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="history.custom_available_sale_days_from_inventory <= 8">
                {{history.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{history.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
            </div>
            <div class="footer">
              <el-tag size="small" type="danger" effect="dark" v-if="row.custom_available_sale_days_from_inventory <= 4">
                {{row.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="row.custom_available_sale_days_from_inventory <= 8">
                {{row.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{row.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="Vmi" align="center">
          <el-table-column label="待发(量)" width="100px" prop="wait_delivery_inventory_num" sortable="custom" align="center">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.wait_delivery_inventory_num}}
                </template>
              </div>
              <div class="footer">
                {{row.wait_delivery_inventory_num}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="待发(件)" width="100px" prop="vmi_wait_delivery_num" sortable="custom" align="center">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.vmi_wait_delivery_num}}
                </template>
              </div>
              <div class="footer">
                {{row.vmi_wait_delivery_num}}
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <el-table-column label="仓内" align="center" prop="sales_inventory_num" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.sales_inventory_num}}
                </template>
              </div>
              <div class="footer">
                {{row.sales_inventory_num}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="不可用" width="90px" align="center" prop="unavailable_warehouse_inventory_num" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.unavailable_warehouse_inventory_num}}
                </template>
              </div>
              <div class="footer">
                {{row.unavailable_warehouse_inventory_num}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="已发货" width="90px" align="center" prop="wait_receive_num" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.wait_receive_num}}
                </template>
              </div>
              <div class="footer">
                {{row.wait_receive_num}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="待质检" width="90px" align="center" prop="wait_qc_num" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.wait_qc_num}}
                </template>
              </div>
              <div class="footer">
                {{row.wait_qc_num}}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="在途" width="90px" align="center" prop="vmi_transportation_num" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(history, index) in row.histories" :key="index">
                <template v-if="history.item">
                  {{history.item.vmi_transportation_num}}
                </template>
              </div>
              <div class="footer">
                {{row.vmi_transportation_num}}
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="7系" prop="seven_day_coef" sortable="custom" sort-by="today" align="center">
          <template slot="header">
            <el-tooltip content="7日系数">
              <span>7系</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              {{history.seven_day_coef.toFixed(2)}}
            </div>
            <div class="footer">
              {{row.seven_day_coef.toFixed(2)}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="30系" prop="thirty_day_coef" sortable="custom" sort-by="today" align="center">
          <template slot="header">
            <el-tooltip content="30日系数">
              <span>30系</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(history, index) in row.histories" :key="index">
              {{history.thirty_day_coef.toFixed(2)}}
            </div>
            <div class="footer">
              {{row.thirty_day_coef.toFixed(2)}}
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

    <TemuDlgPlans :id="plans.id" :visible="plans.visible" :default-status="[1]" @close="plans.visible=false" :show-join-btn="true"></TemuDlgPlans>
    <TemuDlgStockBatch :account-options="accountOptions" :ids="[stock.id]" :sku_ids="stock.sku_id ? [stock.sku_id] : []" :visible="stock.visible" @close="stock.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :dxm_sku="stockBySku.sku" :visible="stockBySku.visible" @close="stockBySku.visible=false"></TemuDlgStockBatch>
    <FDlgUploadBarcode :is_create="toUpload.is_create" :id="toUpload.id" :pdf_url="toUpload.pdf_url"
                       :visible="toUpload.visible" @close="toUpload.visible=false"></FDlgUploadBarcode>
    <TemuDlgFixInventory :sku="fixInventory.sku" :old_left_count="fixInventory.old_left_count"
                         :visible="fixInventory.visible" @close="closeFixInventoryDlg"></TemuDlgFixInventory>

    <el-dialog :visible.sync="addPlan.visible" title="生成采购" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl"
               :before-close="()=>{addPlan.visible=false}">
      <el-input-number size="mini" v-model="addPlan.count" placeholder="请输入数量" :min="1" :precision="0"
                       style="width: 100%" clearable></el-input-number>
      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="addToBuyPlan">生成采购
      </el-button>
    </el-dialog>

    <KdxDlgScanner :visible="scanner.visible" @close="scanner.visible=false"
                   @result="handleScannerResult"></KdxDlgScanner>

  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  saleItemDxmGoodsStatisticList,
  saleItemDxmInventoryFix,
  saleItemInfo,
  saleItemEditSku, saleItemDxmGoodsProcess
} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image";
import TemuDlgPlans from "@/view/temu/components/dlg_plans";
import {saleItemFirstOrder, saleItemAddBuyRecord} from "../../../api/temu/sale_item";
import {accountList} from "../../../api/temu/account";
import {categoryExistList} from "../../../api/temu/category";
import {dxmAddToPlan} from "../../../api/dxm/plan";
import {dxmSync} from "../../../api/dxm/sync";
import {dxmGoodsId} from "@/api/dxm/goods";
import FDlgUploadBarcode from "@/view/sf-factory/components/dlg_upload_barcode.vue";
import TemuDlgFixInventory from "@/view/temu/components/dlg_fix_inventory.vue";
import KdxDlgScanner from "@/view/components/scanner.vue";
import TemuDlgStockBatch from "@/view/temu/sale/components/dlg_stock_batch.vue";

export default {
  components: {
    TemuDlgStockBatch,
    KdxDlgScanner,
    TemuDlgFixInventory,
    FDlgUploadBarcode,
    TemuDlgPlans,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: saleItemDxmGoodsStatisticList,

      editSku: {
        id: undefined,
        sku: undefined,
      },

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

      addPlan: {
        item_id: undefined,
        multi: undefined,
        count: undefined,
        sku: undefined,
        visible: false,
      },

      fixInventory: {
        sku: undefined,
        old_left_count: undefined,
        visible: false,
      },

      toUpload: {
        is_create: false,
        id: undefined,
        pdf_url: undefined,
        visible: false,
      },

      productTraverse: {
        status: 0,
        type: 0,
        process_list: [],
      },

      scanner: {
        visible: false
      },

      accountOptions: [],
      categoryOptions: [],
      searchCondOptions: [
        {id: 7, name: "Spu Id"},
        {id: 1, name: "Skc Id"},
        {id: 2, name: "Sku Id"},
        {id: 3, name: "小秘sku"},
        {id: 4, name: "小秘sku模糊"},
        {id: 5, name: "Goods Id"},
        {id: 6, name: "买手"},
        {id: 8, name: "Sku code模糊"},
        {id: 9, name: "条码Id"},
      ],
      beiHuoDaysCondOptions: [
        {id: 11, name: ">=11天"},
        {id: 10, name: "10天"},
        {id: 9, name: "9天"},
        {id: 8, name: "8天"},
        {id: 7, name: "7天"},
        {id: 6, name: "6天"},
        {id: 5, name: "5天"},
        {id: 4, name: "4天"},
        {id: 3, name: "3天"},
        {id: 0, name: "0天"},
      ],
      otherCondOptions: [
        {id: 62, name: "已加入发货台"},
        {id: 23, name: "未禁售"},
        {id: 24, name: "已禁售"},
        {id: 59, name: "今日必发"},
        {id: 60, name: "今日非必发"},
        {id: 63, name: "非共享产品"},
        {id: 64, name: "共享产品"},
        {id: 65, name: "今日已处理"},
        {id: 66, name: "今日未处理"},
        {id: 25, name: "待发件为0"},
        {id: 33, name: "待发件>0"},
        {id: 26, name: "总发出为0"},
        {id: 54, name: "总发出>0"},
        {id: 21, name: "小秘剩余>0"},
        {id: 22, name: "小秘总剩余>0"},
        {id: 58, name: "小秘总剩余=0"},
        {id: 61, name: "小秘总剩余<0"},
        {id: 27, name: "仓内可售天数>0"},
        {id: 32, name: "仓内可售天数<=4天"},
        {id: 55, name: "仓内可售天数>4且<=8天"},
        {id: 56, name: "仓内可售天数>8且<=12天"},
        {id: 52, name: "JIT"},
        {id: 53, name: "非JIT"},
        {id: 17, name: "加工商品"},
        {id: 28, name: "排除镜子"},
        {id: 29, name: "排除勺子"},
        {id: 30, name: "排除夜灯"},
        {id: 39, name: "排除美妆"},
        {id: 50, name: "排除怀表"},
        {id: 35, name: "镜子"},
        {id: 36, name: "勺子"},
        {id: 37, name: "夜灯"},
        {id: 38, name: "美妆"},
        {id: 51, name: "怀表"},
        {id: 1, name: "待下首单(无发货计划)"},
        {id: 7, name: "待下首单(有发货计划)"},
        {id: 48, name: "图审未过"},
        {id: 49, name: "图审已过"},
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
    async genFirstOrder(id) {
      let resp = await saleItemFirstOrder({id: id})
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
      if (item.dxm_goods_sku && item.count) {
        multi = item.count
      }
      this.addPlan.multi = multi
      this.addPlan.count = Math.max(1, item.custom_real_advice_quantity) // 最少采购一个
      this.addPlan.sku = item.sku
      this.addPlan.visible = true
    },
    async addToBuyPlan() {
      let count = Math.max(1, this.addPlan.count * this.addPlan.multi) // 最少采购一个
      let resp = await dxmAddToPlan({sku: this.addPlan.sku, count: count, platform: "TEMU"})
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

      await saleItemAddBuyRecord({id: this.addPlan.item_id})
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
    changeSearchCond(cond, content) {
      if (cond !== 3) {
        this.$set(this.searchInfo, "search_cond", cond)
        this.$set(this.searchInfo, "search_content", content)
        this.getTableData()
        return
      }

      let routeUrl = this.$router.resolve({
        name: "temu_sale_list",
        query: {
          "cond": cond,
          "content": content,
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    async genItemInfo(id) {
      let resp = await saleItemInfo({id: id})
      if (resp.code) {
        return
      }
      window.open(resp.data, '_blank');
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
    copyAllSkc(row) {
      let ids = []
      row.histories.forEach((history) => {
        if (history.item && history.item.sale) {
          if (ids.indexOf(history.item.sale.product_skc_id) < 0) {
            ids.push(history.item.sale.product_skc_id)
          }
        }
      })
      this.copy(ids.join(" "))
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async markAsProcess(id, day, is_cancel) {
      let resp = await saleItemDxmGoodsProcess({id: id, day: day, is_cancel: is_cancel})
      if (resp.code) {
        return
      }

      this.$message("操作成功")
      this.getTableData()
    },
    openFixInventoryDlg(sku, oldLeftCount) {
      this.fixInventory.sku = sku
      this.fixInventory.old_left_count = oldLeftCount
      this.fixInventory.visible = true
    },
    async cancelFixInventory(sku) {
      let resp = await saleItemDxmInventoryFix({sku: sku, is_cancel: true})
      if (resp.code) {
        return
      }
      this.$message("取消成功")
      this.getTableData()
    },
    closeFixInventoryDlg() {
      this.fixInventory.visible = false
      this.getTableData()
    },
    onCreate(id) {
      this.toUpload.is_create = true
      this.toUpload.id = id
      this.toUpload.pdf_url = undefined
      this.toUpload.visible = true
    },
    endTraverse() {
      this.$set(this.searchInfo, "item_traverse_type", 0)
      this.$set(this.searchInfo, "traverse_list", [])
      this.productTraverse.status = 0
    },
    startTraverse(tp) {
      this.$set(this.searchInfo, "item_traverse_type", tp)
      this.$set(this.searchInfo, "traverse_list", [])
      this.productTraverse.status = 1

      this.getNextItemTraverse()
    },
    async getNextItemTraverse() {
      // 请求
      await this.getTableData()

      if (!this.tableData.length) {
        this.$message("已经处理完毕，将自动结束遍历")
        return
      }

      let traverse_list = this.searchInfo.traverse_list
      if (!traverse_list) {
        traverse_list = []
        this.$set(this.searchInfo, "traverse_list", traverse_list)
      }

      if (this.searchInfo.item_traverse_type !== 2) {
        traverse_list.push(this.tableData[0].sku_ext_code)
      } else {
        traverse_list.push(this.tableData[0].sku)
      }
    },
    startEditSku(id, sku) {
      this.editSku.id = id
      this.editSku.sku = sku

      this.$nextTick(() => {
        let ref = this.$refs[id]
        if (ref) {
          ref.focus(); // 视图出现后使input获取焦点
        }
      })
    },
    endEditSku() {
      this.editSku.id = undefined
      this.editSku.sku = undefined
    },
    async updateSku() {
      let resp = await saleItemEditSku({id: this.editSku.id, new_sku_ext_code: this.editSku.sku})
      if (resp.code) {
        return
      }
      this.$message("更新成功")
      this.getTableData()
      this.endEditSku()
    },
    openScannerReturnIdDlg() {
      this.scanner.visible = true
    },
    handleScannerResult(text) {
      this.changeSearchCond(9, text)
      this.scanner.visible = false
      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "search_cond", 1)
    this.$set(this.searchInfo, "other_cond", [23, 33, 62, 66])

    if (this.$route.query && this.$route.query.cond && this.$route.query.content) {
      this.$set(this.searchInfo, "search_cond", Number(this.$route.query.cond))
      this.$set(this.searchInfo, "search_content", this.$route.query.content)
    }

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    resp = await categoryExistList()
    if (resp.code === 0) {
      this.categoryOptions = resp.data
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

.item-container {

  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 120px;
    padding: 5px;
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    font-weight: 900;
    height: 44px;
    line-height: 44px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

::v-deep .el-table td {
  padding: 0px !important;
}
</style>