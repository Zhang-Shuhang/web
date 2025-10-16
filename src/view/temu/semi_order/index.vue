<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="item.name" :value="item.id" v-if="item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="请选择订单状态" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_at" format="yyyy/MM/dd" value-format="yyyy/MM/dd"
                              :style="{width: '100%'}" placeholder="出单开始时间" unlink-panels
                              clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_at" format="yyyy/MM/dd" value-format="yyyy/MM/dd"
                              :style="{width: '100%'}" placeholder="出单结束时间" unlink-panels
                              clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.ship_start_at" format="yyyy/MM/dd"
                              value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="发货开始时间"
                              unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.ship_end_at" format="yyyy/MM/dd" value-format="yyyy/MM/dd"
                              :style="{width: '100%'}" placeholder="发货结束时间" unlink-panels
                              clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.condition" placeholder="请选择条件" filterable clearable
                         style="width: 100%">
                <el-option label="需变更地址" :value="1"></el-option>
                <el-option label="待取消" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.fulfillment_mode" placeholder="发货模式" filterable clearable
                         style="width: 100%">
                <el-option label="卖家履约" :value="1"></el-option>
                <el-option label="合作对接仓履约" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_y2" placeholder="订单类型" filterable clearable style="width: 100%">
                <el-option label="Y2" :value="1"></el-option>
                <el-option label="半托管" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.track_abnormal_flag" placeholder="订单状态" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option label="收货地址不一致" :value="3"></el-option>
                <el-option label="疑似有误" :value="2"></el-option>
                <el-option label="查无轨迹" :value="1"></el-option>
                <el-option label="轨迹过早" :value="6"></el-option>
                <el-option label="未揽收" :value="5"></el-option>
                <el-option label="智能轨迹助手已介入" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="订单id，空格分隔" v-model="searchInfo.order_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="物流单号，空格分隔" v-model="searchInfo.tracking_numbers" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_customize" placeholder="是否定制" collapse-tags
                         filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="定制" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Id，空格分隔" v-model="searchInfo.spu_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Id，空格分隔" v-model="searchInfo.skc_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Id，空格分隔" v-model="searchInfo.sku_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小售价" v-model.number="searchInfo.min_price" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大售价" v-model.number="searchInfo.max_price" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4" v-if="canSeeSemiOrderProfit">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小利润" v-model.number="searchInfo.min_profit" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大利润" v-model.number="searchInfo.max_profit" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">
              {{ selectRows.length ? "同步选中" : searchInfo.account ? "同步所选账号" : "同步" }}
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="getCancelList">获得待取消列表</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2" v-if="selectRows.length">
            <el-button size="mini" type="danger" style="width: 100%" @click="syncAddress(selectRows)">强制同步订单地址
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2" v-if="canBatchOnlineSendList.length > 0">
            <el-button size="mini" type="danger" style="width: 100%"
                       @click="openOnlineBatchSend(canBatchOnlineSendList)">批量在线下单
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2" v-if="canBatchY2SendList.length > 0">
            <el-button size="mini" type="danger" style="width: 100%" @click="openY2Allocator(canBatchY2SendList)">生成Y2渠道
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2" v-if="canCombine">
            <el-button size="mini" type="danger" style="width: 100%" @click="syncDxmForCombine(selectRows)">
              合并订单去店小秘
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2" v-else-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="syncDxm(selectRows, true)">
              拆分订单去店小秘
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-upload action="/temu/semi_order/batch_combine_send" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".xlsx" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handleError"
                       style="width: 100%">
              <el-button size="mini" style="width: 100%" type="warning">合并订单发货</el-button>
            </el-upload>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-upload action="/temu/semi_order/batch_split_send" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".xlsx" :before-upload="beforeUpload" :on-success="handleSplitSuccess"
                       :on-error="handleError" style="width: 100%">
              <el-button size="mini" style="width: 100%" type="warning">拆分订单发货</el-button>
            </el-upload>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-upload action="/temu/semi_order/batch_file_send" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".xlsx" :before-upload="beforeUpload" :on-success="handleFileSuccess"
                       :on-error="handleError" style="width: 100%">
              <el-button size="mini" style="width: 100%" type="warning">单个发货</el-button>
            </el-upload>
          </el-col>
          <!--          <el-col :xs="8" :sm="3" :lg="2">-->
          <!--            <el-button size="mini" type="primary" style="width: 100%" @click="hzcExcept(true)">合作仓异常重试</el-button>-->
          <!--          </el-col>-->
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="getChargeBackQueryList">拒付清单
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="getHzcExcept">合作仓异常数量
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="exportY2OrderAccounts">Y2未发货账号
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="danger" style="width: 100%" @click="hzcExcept(false)">合作仓异常转自发货
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="allocate">生成订单处理</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="allocateDlg.visible = true">查看分配记录
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="exportOrders(selectRows)">导出订单
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="2">
            <el-upload action="/temu/semi_order/upload_wanb" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".xlsx" :before-upload="beforeUpload" :on-success="handleFileSuccess"
                       :on-error="handleError" style="width: 100%">
              <el-button size="mini" style="width: 100%" type="warning">上传万邦费用</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="订单信息" align="center" prop="sku_ext_code" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            <div v-if="row.account">
              <el-tag size="mini" type="primary">账号: {{ row.account.name }}({{
                  row.account.is_semi ? "半托管" : "全托管"
                }})
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.id.toString())">订单Id: {{ row.id }}</el-tag>
            </div>
            <div>
              {{ row.is_eu ? "欧洲站" : "美国站" }}
            </div>
            <div>
              {{ statusName(row.order_status) }}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="时间" align="center" width="250px" prop="expect_delivery_end_time" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            <div>
              出单时间: {{ new Date(row.created_at).toLocaleString() }}
            </div>
            <div v-if="row.order_status > 1">
              最晚发货时间: {{ new Date(row.expect_ship_latest_time).toLocaleString() }}
            </div>
            <div v-if="row.shipping_time">
              发货时间: {{ new Date(row.shipping_time).toLocaleString() }}
            </div>
            <div>
              承诺妥投时间: {{ new Date(row.expect_delivery_end_time).toLocaleString() }}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="收货人" align="center" width="300px">
          <div slot-scope="{row}">
            <template v-if="row.address">
              <div style="font-size: 12px">
                <div>
                  收货人：{{ row.address.receipt_name }}
                </div>
                <div>
                  联系方式：{{ row.address.mobile }}
                </div>
                <div>
                  收货地址：{{ row.address.address_line1 }} {{ row.address.address_line2 }}, {{
                    row.address.region_name1
                  }}, {{ row.address.region_name2 }}, {{ row.address.region_name3 }}, {{ row.address.post_code }}
                </div>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="物流信息" align="center" min-width="300px">
          <div slot-scope="{row}">
            <div style="font-size: 12px" v-for="(w, index) in row.waybill_info_list" :key="index">
              <div>
                包裹号: {{ w.id }}
              </div>
              <div>
                {{ w.ship_company.name }}, {{ w.tracking_number }}
              </div>
              <div>
                {{ w.reason_dec }}
              </div>
              <div>
                <el-button type="primary" size="mini" :style="{width: '80%'}"
                           @click="openPackageTrackingDlg(row.id, w.id)">查看物流
                </el-button>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品信息" align="center" width="300px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.items" :key="index">
              <el-row>
                <el-col :span="8">
                  <div style="margin: 5px">
                    <KdxImage :src="item.thumb_url" width="100%" height="100%"></KdxImage>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div style="font-size: 12px">
                    Sku: {{ item.product_sku_id }}
                  </div>
                  <div style="font-size: 12px">
                    {{ item.ext_code }} x {{ item.quantity }}<span style="color: white; background-color: red" v-if="item.cancel_quantity">({{-item.cancel_quantity}})</span>
                  </div>
                  <div style="font-size: 12px">
                    <el-tag size="mini" type="primary" effect="dark" v-if="item.is_customize">定制</el-tag>
                  </div>
                  <div v-if="row.order_status === 2">
                    <el-button size="mini" type="danger" @click="productDown(item, row)">申请下架</el-button>
                    <el-button size="mini" type="primary" @click="lackStockApply(item)">申请缺货</el-button>
                    <!--                    semiOrderLackStockApply-->
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="利润" align="center" width="300px" v-if="canSeeSemiOrderProfit">
          <div slot-scope="{row}">
            <template v-if="row.fee">
              <div class="finance-details">
                <div class="detail-row" v-for="(item, index) in (row.fee.fees || [])" :key="index">
                  <div class="detail-label">{{ item.name }}</div>
                  <div :class="['detail-value', item.amount > 0 ? 'income' : 'expense']">{{item.currency_code}}: <span class="currency" v-if="item.amount>0">+</span>{{item.amount.toFixed(2)}}</div>
                </div>

                <div class="profit-divider"></div>

                <div class="detail-row">
                  <div class="detail-label">利润</div>
                  <div :class="['detail-value', row.fee.profit > 0 ? 'income' : 'expense']">CNY: <span class="currency" v-if="row.fee.profit>0">+</span>{{row.fee.profit.toFixed(2)}}</div>
                </div>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <div slot-scope="{row}">
            <div v-if="row.address">
              <el-button type="primary" size="mini" style="width: 100%" @click="syncDxm([row], true)" plain>
                拆分订单去店小秘
              </el-button>
            </div>
            <div v-if="row.order_status === 2">
              <el-button type="primary" size="mini" style="width: 100%" @click="openSendDlg([row.id])" plain>
                发货{{ row.dxm_tracking_number }}
              </el-button>
            </div>
            <div v-if="row.cancel_orders">
              <el-tag type="danger" size="mini">待取消</el-tag>
            </div>
            <div v-if="row.change_address_status">
              <el-button type="danger" size="mini" style="width: 100%" @click="onChangeAddress([row], true)" plain>
                同意变更地址
              </el-button>
              <el-button type="danger" size="mini" style="width: 100%" @click="onChangeAddress([row], false)" plain>
                拒绝变更地址
              </el-button>
            </div>
            <!--              <el-col :span="12">-->
            <!--                <el-button type="primary" size="mini" style="width: 100%" @click="openImageReview(row)">图审</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">改图</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">配对</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">生成首单</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">禁售</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">复制上架</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">备货</el-button>-->
            <!--              </el-col>-->
            <!--              <el-col :span="12">-->
            <!--                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">标记</el-button>-->
            <!--              </el-col>-->
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

    <TemuDlgPackageTracking :id="packageTrackingDlg.id" :waybill_id="packageTrackingDlg.waybill_id"
                            :visible="packageTrackingDlg.visible"
                            @close="packageTrackingDlg.visible=false"></TemuDlgPackageTracking>
    <TemuDlgPackageSend :ids="sendDlg.ids" :visible="sendDlg.visible" @close="sendDlg.visible=false"
                        @update="getTableData"></TemuDlgPackageSend>
    <TemuDlgAllocateList :visible="allocateDlg.visible" @close="allocateDlg.visible=false"></TemuDlgAllocateList>
    <TemuDlgOnlineBatchSend :rows="dlgOnlineBatchSend.rows" :visible="dlgOnlineBatchSend.visible"
                            @close="dlgOnlineBatchSend.visible=false"></TemuDlgOnlineBatchSend>
    <TemuDlgY2Allocator :rows="dlgY2Allocator.rows" :visible="dlgY2Allocator.visible"
                            @close="dlgY2Allocator.visible=false"></TemuDlgY2Allocator>
    <TemuDlgSendCustomerService :list="customerServiceSendDlg.rows" :tool_id="customerServiceSendDlg.tool_id"
                                :visible="customerServiceSendDlg.visible"
                                @close="customerServiceSendDlg.visible=false"></TemuDlgSendCustomerService>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "@/api/temu/account";
import {
  semiOrderAllocate,
  semiOrderCancelList, semiOrderChangeAddress, semiOrderChargeBackQueryList, semiOrderExport,
  semiOrderExportY2OrderAccounts, semiOrderLackStockApply,
  semiOrderList, semiOrderShipModeException,
  semiOrderSync, semiOrderSyncAddress,
  semiOrderSyncDxm,
  semiOrderSyncDxmForCombine, semiOrderUpdateShipMode
} from "@/api/temu/semi_order";
import TemuDlgPackageTracking from "@/view/temu/semi_order/components/dlg_package_tracking.vue";
import {mapGetters} from "vuex";
import TemuDlgPackageSend from "@/view/temu/semi_order/components/dlg_package_send.vue";
import TemuDlgAllocateList from "@/view/temu/semi_order/components/dlg_allocate_list.vue";
import TemuDlgOnlineBatchSend from "@/view/temu/semi_order/components/dlg_online_batch_send.vue";
import TemuDlgSendCustomerService from "@/view/temu/components/dlg_send_customer_service.vue";
import TemuDlgY2Allocator from "@/view/temu/semi_order/components/dlg_y2_allocator.vue";

export default {
  components: {
    TemuDlgY2Allocator,
    TemuDlgSendCustomerService,
    TemuDlgOnlineBatchSend,
    TemuDlgAllocateList,
    TemuDlgPackageSend,
    TemuDlgPackageTracking,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: semiOrderList,

      selectRows: [],

      accountOptions: [],
      statusOptions: [
        {id: 1, name: "平台处理中"},
        {id: 2, name: "待发货"},
        {id: 4, name: "已发货"},
        {id: 5, name: "已签收"},
        {id: 3, name: "已取消"},
        {id: 41, name: "部分发货"},
      ],

      packageTrackingDlg: {
        id: undefined,
        waybill_id: undefined,
        visible: false,
      },

      dlgOnlineBatchSend: {
        rows: [],
        visible: false,
      },

      dlgY2Allocator: {
        rows: [],
        visible: false,
      },

      sendDlg: {
        ids: [],
        visible: false,
      },

      customerServiceSendDlg: {
        rows: [],
        tool_id: 0,
        visible: false,
      },

      allocateDlg: {
        visible: false,
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token", "canSeeSemiOrderProfit"]),
    canBatchOnlineSendList() {
      return (this.selectRows || []).filter((row) => {
        let hasSelfFulfill = false;
        for (const item of row.items) {
          if (item.fulfillment_mode === 0) {
            hasSelfFulfill = true;
            break
          }
        }
        return (row.order_status === 2 || row.order_status === 41) && hasSelfFulfill
      })
    },
    canBatchY2SendList() {
      return (this.selectRows || []).filter((row) => {
        let hasSelfFulfill = false;
        for (const item of row.items) {
          if (item.fulfillment_mode === 0) {
            hasSelfFulfill = true;
            break
          }
        }
        return row.is_y2 && (row.order_status === 2 || row.order_status === 41) && hasSelfFulfill
      })
    },
    canCombine() {
      let list = this.selectRows
      if (list.length <= 1) {
        return false
      }

      let mp = new Map()

      for (const v of list) {
        if (v.order_status !== 2) {
          return false
        }

        let addr = v.address
        if (!addr) {
          return false
        }

        let key = v.account_id + addr.receipt_name + addr.region_name1 + addr.region_name2 + addr.region_name3 + addr.address_line1 + addr.address_line2 + addr.post_code
        let count = mp.get(key)

        mp.set(key, count ? count + 1 : 1)
      }

      for (const k of mp.keys()) {
        if (mp.get(k) < 2) {
          return false
        }
      }

      return true
    }
  },
  methods: {
    semiOrderCancelList,
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let data = {}
      if (this.selectRows.length) {
        data.ids = this.selectRows.map(item => {
          return item.id
        })
      } else if (this.searchInfo.account) {
        data.account_id = this.searchInfo.account
      }
      let resp = await semiOrderSync(data)
      if (resp.code) {
        return
      }
      this.$message("同步成功")
      this.getTableData()
    },
    statusName(status) {
      let op = this.statusOptions.find((item) => {
        return item.id === status
      })
      if (!op) {
        return `未知状态: ${status}`
      }
      return op.name
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.id
      })
      this.copy(ids.join(" "))

      let trackingNumbers = []
      this.selectRows.forEach((item) => {
        item.waybill_info_list.forEach((w) => {
          trackingNumbers.push(w.tracking_number)
        })
      })
      if (trackingNumbers.length) {
        this.$notify({
          title: "物流单号",
          dangerouslyUseHTMLString: true,
          message: trackingNumbers.join("\n"),
          duration: 10000,
        });
      }
    },
    openPackageTrackingDlg(id, waybill_id) {
      this.packageTrackingDlg.id = id
      this.packageTrackingDlg.waybill_id = waybill_id
      this.packageTrackingDlg.visible = true
    },
    async syncAddress(rows) {
      let resp = await semiOrderSyncAddress({
        ids: rows.map((item) => {
          return item.id
        })
      })
      if (resp.code) {
        this.getTableData()
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    openOnlineBatchSend(rows) {
      this.dlgOnlineBatchSend.rows = rows
      this.dlgOnlineBatchSend.visible = true
    },
    openY2Allocator(rows) {
      this.dlgY2Allocator.rows = rows
      this.dlgY2Allocator.visible = true
    },
    async syncDxmForCombine(rows) {
      let resp = await semiOrderSyncDxmForCombine({
        ids: rows.map((item) => {
          return item.id
        })
      })
      if (resp.code) {
        this.getTableData()
        return
      }

      this.$message(resp.data)
      this.getTableData()
    },
    async syncDxm(rows, split) {
      let resp = await semiOrderSyncDxm({
        ids: rows.map((item) => {
          return item.id
        }), split
      })
      if (resp.code) {
        this.getTableData()
        return
      }

      this.$message(resp.data)
      this.getTableData()
    },
    async allocate() {
      let resp = await semiOrderAllocate()
      if (resp.code) {
        return
      }

      this.$message("分配成功，已自动下载")
      window.open(resp.data, "_blank")
    },
    async exportOrders(rows) {
      let resp = await semiOrderExport({
        ids: rows.map((item) => {
          return item.id
        })
      })
      if (resp.code) {
        return
      }

      this.$message("导出成功")
      window.open(resp.data, "_blank")
    },
    async getHzcExcept() {
      let resp = await semiOrderShipModeException()
      if (resp.code) {
        return
      }

      this.$notify({
        title: "合作仓异常数量",
        dangerouslyUseHTMLString: true,
        message: (resp.data || []).map((item) => {return `<div>${item}</div>`}).join("\n"),
        duration: 0,
      });
      this.copy(resp.data.join("\n"))
    },
    async exportY2OrderAccounts() {
      let resp = await semiOrderExportY2OrderAccounts()
      if (resp.code) {
        return
      }

      this.$message("请求成功")
      window.open(`${resp.data}`, "_BLANK")
    },
    async getChargeBackQueryList() {
      let resp = await semiOrderChargeBackQueryList()
      if (resp.code) {
        return
      }

      this.$notify({
        title: "拒付列表",
        dangerouslyUseHTMLString: true,
        message: (resp.data || []).map((item) => {return `<div>${item}</div>`}).join("\n"),
        duration: 0,
      });
      this.copy(resp.data.join("\n"))
    },
    hzcExcept(reSubmit) {
      this.$confirm('请确认是否异常转自发货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await semiOrderUpdateShipMode({is_re_submit: reSubmit})
        if (resp.code) {
          return
        }

        this.$message(resp.msg)
      })
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async getCancelList() {
      let resp = await semiOrderCancelList()
      if (resp.code) {
        return
      }

      this.copy(resp.data.join(" "))
    },
    openSendDlg(ids) {
      this.sendDlg.ids = ids
      this.sendDlg.visible = true
    },
    onChangeAddress(list, agree) {
      this.$confirm(`请确认是否${agree ? "同意" : "拒绝"}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await semiOrderChangeAddress({
          ids: list.map((item) => {
            return item.id
          }), agree: agree
        })
        if (resp.code) {
          return
        }

        this.$message("操作成功")
        this.getTableData()
      })
    },
    beforeUpload() {
      this.fullscreenLoading = true
      return true
    },
    handleSuccess(res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.$message("上传成功!");
      this.getTableData()
    },
    handleSplitSuccess(res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.$message("上传成功!");
      this.getTableData()
    },
    handleFileSuccess(res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      if (res.data && res.data > 0) {
        this.$message(`上传成功: ${res.data}条!`);
      } else {
        this.$message("上传成功!");
      }
      this.getTableData()
    },
    handleError(err) {
      this.fullscreenLoading = false
      this.$message.error("上传失败!" + err);
    },
    productDown(item, row) {
      this.customerServiceSendDlg.rows = [
        {
          account_id: row.account_id,
          name: item.goods_name,
          img: item.thumb_url,
          dataId: `${item.product_skc_id}`,
        }
      ]
      this.customerServiceSendDlg.tool_id = 2406230000031
      this.customerServiceSendDlg.visible = true
    },
    async lackStockApply(item) {
      this.$confirm('确认申请缺货, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        let resp = await semiOrderLackStockApply({ids: [item.id]})
        if (resp.code) {
          return
        }

        this.$message("申请成功")
        this.getTableData()
      })
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 20
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
    height: 100px;
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

.one-line {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.two-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

::v-deep .el-upload--text {
  width: 100%;
}

.finance-card {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.card-header {
  background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
  color: white;
  padding: 25px 30px;
  text-align: center;
}

.card-header h1 {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 1px;
}

.card-header p {
  opacity: 0.9;
  margin-top: 8px;
  font-size: 14px;
}

.finance-details {
  padding: 5px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  flex: 1;
  text-align: right;
  padding-right: 20px;
  font-weight: 500;
  color: #333;
  font-size: 12px;
}

.detail-value {
  flex: 1;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
}

.income {
  color: green;
}

.expense {
  color: red;
}

.profit-divider {
  height: 2px;
  background: linear-gradient(to right, transparent, #3498db, transparent);
  margin: 5px 0;
}

.profit-row {
  display: flex;
  justify-content: space-between;
  padding: 15px 0 5px;
  font-weight: bold;
}

.profit-label {
  flex: 1;
  text-align: right;
  padding-right: 20px;
  font-size: 18px;
  color: #2c3e50;
}

.profit-value {
  flex: 1;
  text-align: left;
  font-size: 18px;
  color: #2980b9;
}

.currency {
}

.footer-note {
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-size: 13px;
  border-top: 1px solid #f0f0f0;
  background-color: #f9f9f9;
}
</style>