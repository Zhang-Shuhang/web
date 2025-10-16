<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.operate_account" placeholder="请选择操作账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <template v-for="(item, index) in sortAccountOptions">
                  <el-option :key="index" :label="item.name" :value="item.id">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; margin-left: 30px; color: #8492a6; font-size: 13px">
                      待处理: {{ accountOrderCount(item.id) }} 个
                      <template v-if="accountJitOrderCount(item.id)">
                        JIT: {{ accountJitOrderCount(item.id) }} 个
                      </template>
                      <template v-if="accountCustomizeOrderCount(item.id)">
                        定制: {{ accountCustomizeOrderCount(item.id) }} 个
                      </template>
                    </span>
                  </el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="状态" filterable :style="{width: '100%'}">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.warehouse_id" placeholder="请选择仓库" filterable clearable
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in warehouseOptions" :key="index"
                           :label="factorySubWarehouseId(item.name) ? `${item.name}[工厂仓: ${factorySubWarehouseId(item.name)}]` : item.name"
                           :value="item.id">
                  <span style="float: left">{{
                      factorySubWarehouseId(item.name) ? `${item.name}[工厂仓: ${factorySubWarehouseId(item.name)}]` : item.name
                    }}</span>
                  <span style="float: right; margin-left: 30px; color: #8492a6; font-size: 13px"
                        v-if="userInfo.group_id">{{ item.count }} 个 - {{ notUsedCount(item.name) }} 个未使用物流单号 - {{
                      notShippedCount(item.name)
                    }} 个未发出订单</span>
                  <span style="float: right; margin-left: 30px; color: #8492a6; font-size: 13px" v-else>{{ item.count }} 个</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-row>
                <el-col :span="6">
                  <el-select class="select" size="mini" v-model="searchInfo.include_tag" style="width: 100%;">
                    <el-option label="含" :value="true"></el-option>
                    <el-option label="不含" :value="false"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="18">
                  <el-select v-model="searchInfo.tags" placeholder="请选择标记" multiple collapse-tags filterable
                             clearable :style="{width: '100%'}">
                    <el-option v-for="(item, index) in tagOptions" :key="index" :value="item.content"
                               :label="item.user_id ? `${item.content}-私` : `${item.content}-共`">
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="发货单(FH 开头)" v-model="searchInfo.delivery_order_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="排除发货单(FH 开头)" v-model="searchInfo.exclude_delivery_order_ids" clearable
                        filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids" v-model="searchInfo.skc_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids" v-model="searchInfo.sku_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="WB单号" v-model="searchInfo.plan_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.urgency_type" placeholder="普通/加急/JIT/定制" multiple filterable
                         clearable collapse-tags :style="{width: '100%'}">
                <el-option v-for="(item, index) in urgencyTypeOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.sku_code" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <!--              <el-input placeholder="小秘Sku" v-model="searchInfo.dxm_goods_sku" clearable filterable @keyup.enter.native="onSubmit">-->
              <!--              </el-input>-->
              <el-select v-model="searchInfo.inbound_return" placeholder="是否入库退供" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="" value=""></el-option>
                <el-option label="入库退供" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :xs="12" :sm="6" :lg="3">-->
          <!--            <el-form-item label-width="0">-->
          <!--              <el-select v-model="searchInfo.other_cond" placeholder="其他条件" multiple collapse-tags filterable clearable :style="{width: '100%'}">-->
          <!--                <el-option v-for="(item, index) in otherCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :xs="12" :sm="6" :lg="3">-->
          <!--            <el-form-item label-width="0">-->
          <!--              <el-select v-model="searchInfo.is_dxm_match" placeholder="是否小秘配对" filterable clearable :style="{width: '100%'}">-->
          <!--                <el-option label="未小秘配对" :value="1"></el-option>-->
          <!--                <el-option label="已小秘配对" :value="2"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.less_than_hour" placeholder="待收货剩余时间" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="剩余低于72小时" :value="1"></el-option>
                <el-option label="超出72小时" :value="2"></el-option>
                <el-option label="剩余低于96小时" :value="3"></el-option>
                <el-option label="超出96小时" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :xs="12" :sm="6" :lg="3">-->
          <!--            <el-form-item label-width="0">-->
          <!--              <el-select v-model="searchInfo.is_self" placeholder="是否我加入" filterable clearable :style="{width: '100%'}">-->
          <!--                <el-option value=""></el-option>-->
          <!--                <el-option v-for="(item, index) in isSelfOptions" :key="index" :label="item.name" :value="item.id"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_first" placeholder="是否首单" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in isFirstOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_printed" placeholder="是否打印" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in printedOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :xs="12" :sm="6" :lg="3">-->
          <!--            <el-form-item label-width="0">-->
          <!--              <el-select v-model="searchInfo.end_in_3_hour" placeholder="是否3小时内过期" filterable clearable :style="{width: '100%'}">-->
          <!--                <el-option label="3小时内过期" :value="1"></el-option>-->
          <!--                <el-option label="非3小时内过期" :value="2"></el-option>-->
          <!--              </el-select>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.in_fulfilment_punish" placeholder="是否履约考核" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="履约考核" :value="1"></el-option>
                <el-option label="非履约考核" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.sale_days" placeholder="可售天数" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="0-6" :value="1"></el-option>
                <el-option label="6-10" :value="2"></el-option>
                <el-option label=">10" :value="3"></el-option>
                <el-option label="0-8" :value="4"></el-option>
                <el-option label="8-12" :value="5"></el-option>
                <el-option label="12-18" :value="6"></el-option>
                <el-option label=">20" :value="10"></el-option>
                <el-option label="0-3" :value="7"></el-option>
                <el-option label="3-6" :value="8"></el-option>
                <el-option label="6-8" :value="9"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_factory" placeholder="是否工厂" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="非工厂" :value="1"></el-option>
                <el-option label="工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_ban" placeholder="是否禁售" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="未禁售" :value="1"></el-option>
                <el-option label="已禁售" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_ban_produce" placeholder="是否禁产" filterable clearable
                         :style="{width: '100%'}">
                <el-option label="未禁产" :value="1"></el-option>
                <el-option label="已禁产" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
              <!--              <el-select v-model="searchInfo.self_delivery" placeholder="是否自行配送" filterable clearable :style="{width: '100%'}">-->
              <!--                <el-option label="自行配送" :value="1"></el-option>-->
              <!--                <el-option label="非自行配送" :value="2"></el-option>-->
              <!--              </el-select>-->
            </el-form-item>
          </el-col>
          <!--          <el-col :xs="12" :sm="6" :lg="3">-->
          <!--            <el-form-item label-width="0">-->
          <!--              <el-input placeholder="自行配送id，空格分隔" v-model="searchInfo.self_delivery_task_ids" clearable filterable @keyup.enter.native="onSubmit">-->
          <!--              </el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="物流单号" v-model="searchInfo.express_delivery_sn" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="箱唛单号(PC开头的)" v-model="searchInfo.xm_sn" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="searchInfo.status === 2 ? 2 : 3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="searchInfo.status === 2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}"
                         @click="openBindDeliveryMethodAndExpressInfoDlg(selectRows)" :disabled="!canPlatformDelivery">
                批量装箱发货
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="searchInfo.status === 2 && userInfo.group_id">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="bindSelfDelivery(selectRows)"
                         :disabled="!canSelfDelivery">批量自行配送
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="searchInfo.status === 2 ? 1 : 3">
            <el-form-item label-width="0">
              <el-upload :action="`/temu/delivery_order/trans_xm`" :headers="{'x-token':token}" :show-file-list="false"
                         accept=".pdf" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
                <el-button size="mini" :style="{width: '100%'}" type="primary">重组</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="searchInfo.status === 2 ? 2 : 3">
            <el-form-item label-width="0">
              <el-dropdown style="width: 100%" @command="handleCommand">
                <el-button type="primary" style="width: 100%">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="width: 250px">
                  <el-dropdown-item command="sync0">同步待装箱发货</el-dropdown-item>
                  <el-dropdown-item command="sync1">同步待收货</el-dropdown-item>
                  <el-dropdown-item command="sync2">同步已收货</el-dropdown-item>
                  <el-dropdown-item command="syncDxm">同步店小秘</el-dropdown-item>
                  <el-dropdown-item command="batchJoin" v-if="canJoinRows.length">批量加入待处理</el-dropdown-item>
                  <!--                  <el-dropdown-item command="batchJoinSelfDelivery" v-if="canJoinSelfDeliveryRows.length">批量加入自行配送</el-dropdown-item>-->
                  <el-dropdown-item command="batchLeaveSelfDelivery" v-if="canLeaveSelfDeliveryRows.length">
                    批量退出自行配送
                  </el-dropdown-item>
                  <el-dropdown-item command="allocateInventoryOut" v-if="searchInfo.status === 1">分配外发(可售＜备货)
                  </el-dropdown-item>
                  <el-dropdown-item command="allocateInventoryFactory" v-if="searchInfo.status === 1">
                    分配工厂(可售＜Min(备货,配置值))
                  </el-dropdown-item>
                  <el-dropdown-item command="allocateInventorySelf" v-if="searchInfo.status === 1">分配仓库(可售＜备货)
                  </el-dropdown-item>
                  <el-dropdown-item command="batchConfirm" v-if="userInfo.can_batch_confirm && canConfirmRows.length">
                    批量强制加入待发货
                  </el-dropdown-item>
                  <el-dropdown-item command="batchBack" v-if="canBackRows.length">批量打回待审核</el-dropdown-item>
                  <el-dropdown-item command="batchCancel" v-if="selectRows.length">批量取消发货单</el-dropdown-item>
                  <el-dropdown-item command="batchPrint" v-if="canPrintRows.length">批量打印</el-dropdown-item>
                  <el-dropdown-item command="exportWarehouseAddr">导出仓库地址</el-dropdown-item>
                  <el-dropdown-item command="addToDeliverOrders">一键发货台加入发货单</el-dropdown-item>
                  <el-dropdown-item command="syncForJitAndCustomize">同步定制+JIT</el-dropdown-item>
                  <el-dropdown-item command="watchJitAndCustomize">查看定制+JIT</el-dropdown-item>
                  <el-dropdown-item command="notifyJit">检查JIT</el-dropdown-item>
                  <el-dropdown-item command="openBindRecordList">查看发货记录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>
        <!--        <el-row>-->
        <!--          <el-col :lg="10">-->
        <!--            <el-form-item label-width="0">-->
        <!--              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">测试</el-button>-->
        <!--            </el-form-item>-->
        <!--          </el-col>-->
        <!--        </el-row>-->
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="发货信息" align="center" min-width="110px">
          <template slot-scope="{row}">
            <div v-if="row.account">
              <el-tag size="mini">账号: {{ row.account.name }}</el-tag>
              <div v-if="row.operate_account">
                <el-tag size="mini">操作账号: {{ row.operate_account.name }}</el-tag>
              </div>
            </div>
            <div class="fs-12 lh-15" @click="copy(row.deliveryOrderSn)">
              <el-link @click="queryTraceInfo(row.subPurchaseOrderSn)" type="primary" v-if="row.status">
                {{ row.deliveryOrderSn }}
              </el-link>
              <template v-else>{{ row.deliveryOrderSn }}</template>
            </div>
            <div>
              <el-tag size="mini" effect="dark">
                {{ row.status === 0 ? "待装箱发货" : row.status === 1 ? "待收货" : "已收货" }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="center" min-width="245px">
          <template slot-scope="{row}">
            <div style="display: flex">
              <div>
                <KdxImage :src="row.product.main_image_url" v-if="row.product"></KdxImage>
              </div>
              <div style="padding-left: 5px; text-align: left">
                <div class="fs-12 lh-15" @click="copy(row.subPurchaseOrderSn)">
                  备货单号: {{ row.subPurchaseOrderSn }}
                </div>
                <div class="fs-12 lh-15" @click="copy(row.productSkcId.toString())">
                  Skc: {{ row.productSkcId }}
                </div>
                <!--                <div>-->
                <!--                  <el-tag size="mini">待装箱发货</el-tag>-->
                <!--                </div>-->
                <div>
                  <el-tag size="mini" type="danger" effect="dark" v-if="row.isCustomProduct">定制</el-tag>
                  <el-tag size="mini" type="warning" effect="dark" v-if="row.urgencyType">加急</el-tag>
                  <el-tag size="mini" type="primary">{{ row.isFirst ? "首" : "返" }}</el-tag>
                  <el-tag size="mini" :type="row.purchaseStockType ? 'warning' : 'primary'" effect="dark">
                    {{ row.purchaseStockType ? "JIT" : "VMI" }}
                  </el-tag>
                  <template v-if="row.info">
                    <el-tag size="mini">状态: {{ statusName(row.info.status) }}</el-tag>
                    <el-tag size="mini" type="success" v-if="row.info.user_id">用户: {{ row.info.user_id }} 加入
                    </el-tag>
                    <el-tag size="mini" type="danger" effect="dark" v-if="row.info.task_id">自行配送Id:
                      {{ row.info.task_id }}
                    </el-tag>
                    <template v-if="row.expressDeliverySn">
                      <el-tag size="mini">{{ row.expressCompany }}</el-tag>
                      <el-tag size="mini" @click="copy(row.expressDeliverySn)">
                        {{ row.expressDeliverySn }}({{ row.expressPackageNum }}箱)
                      </el-tag>
                    </template>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货信息" align="center" min-width="180px">
          <div slot-scope="{row}">
            <div class="fs-12 lh-15">
              发货数量: {{ row.deliverSkcNum }}({{ row.skcPurchaseNum }})件
            </div>
            <el-tag size="mini" v-if="row.delivery_address_label">发货地址: {{ row.delivery_address_label }}</el-tag>
            <el-tag size="mini" v-if="row.deliverTime">发货时间: {{
                new Date(row.deliverTime).toLocaleString()
              }}
            </el-tag>
            <el-tag size="mini" @click="copy(row.subWarehouseName)">收货仓库: {{ row.subWarehouseName }}</el-tag>
            <el-tag size="mini" v-if="userInfo.group_id">未使用: {{ notUsedCount(row.subWarehouseName) }} 未发出:
              {{ notShippedCount(row.subWarehouseName) }}
            </el-tag>
            <el-tag size="mini" v-if="row.receiveTime">收货时间: {{
                new Date(row.receiveTime).toLocaleString()
              }}
            </el-tag>
            <el-tag size="mini" type="danger" effect="dark" v-if="row.expect_latest_deliver_time">最迟发货:
              {{ new Date(row.expect_latest_deliver_time).toLocaleString() }}
            </el-tag>
            <el-tag size="mini" effect="dark" v-if="row.expect_latest_arrival_time">最迟妥投:
              {{ new Date(row.expect_latest_arrival_time).toLocaleString() }}
            </el-tag>
            <el-tag size="mini" type="danger" effect="dark" v-if="row.endTime">过期时间:
              {{ new Date(row.endTime).toLocaleString() }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}" class="div-op-btn">
            <div>
              <el-button size="mini" style="width: 100%" type="primary" @click="openSavePackages(row)"
                         v-if="!row.isPrintBoxMark">调整包裹信息
              </el-button>
            </div>
            <div class="mb-3" v-if="!row.info">
              <el-button size="mini" style="width: 100%" type="primary" @click="join([row])" v-if="canJoin(row)">
                加入待处理
              </el-button>
            </div>
            <template v-else>
              <!--              <div class="mb-3" v-if="row.info.status === 2">-->
              <!--                <el-button size="mini" style="width: 100%" type="primary" @click="setSelfDelivery([row], true)" v-if="canJoinSelfDelivery(row)">加入自行配送</el-button>-->
              <!--                <el-button size="mini" style="width: 100%" type="warning" @click="setSelfDelivery([row], false)" v-if="canLeaveSelfDelivery(row)">退出自行配送</el-button>-->
              <!--              </div>-->
              <div class="mb-3 lh-15" v-if="row.info.status === 1">
                <el-button size="mini" style="width: 100%" type="primary" @click="confirm([row.deliveryOrderSn])">
                  强制加入待发货
                </el-button>
              </div>
              <div class="mb-3 lh-15" v-if="row.info.status < 3">
                <el-button size="mini" style="width: 100%" type="primary" @click="back([row.deliveryOrderSn])">
                  打回待审核
                </el-button>
              </div>
              <!--              <div class="mb-3 lh-15" v-if="row.info.status >= 2">-->
              <!--                <el-button size="mini" style="width: 100%" type="primary" @click="print([row])">打印</el-button>-->
              <!--              </div>-->
            </template>
            <div class="mb-3 lh-15" v-if="!row.info || row.info.status < 3">
              <el-button size="mini" style="width: 100%" type="primary" @click="syncById([row.deliveryOrderSn])">同步
              </el-button>
            </div>
            <div class="lh-15" v-if="checkCanSelfDelivery([row])">
              <el-button size="mini" style="width: 100%" type="warning"
                         @click="openBindDeliveryMethodAndExpressInfoDlg([row])">装箱发货
              </el-button>
            </div>
            <!--            <div class="lh-15" v-if="row.status">-->
            <!--              <el-button size="mini" style="width: 100%" type="warning" @click="syncFactory(row)">同步去工厂</el-button>-->
            <!--            </div>-->
            <!--            <div class="mb-3">-->
            <!--              <el-button size="mini" style="width: 100%" type="danger" @click="cancel([row])">取消发货单</el-button>-->
            <!--            </div>-->
          </div>
        </el-table-column>
        <el-table-column label="包裹号" align="center" min-width="140px">
          <div slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.details" :key="index">
              <div class="fs-12 lh-15" @click="copy(item.id)">
                {{ item.id }}-{{ item.skcNum }}
              </div>
            </div>
            <el-tag size="mini" :type="row.isPrintBoxMark ? 'danger' : 'primary'">
              {{ row.isPrintBoxMark ? "已打印" : "未打印" }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="详情" align="center" min-width="120px">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <div class="fs-12 lh-15">
                <span @click="copy(item.id.toString())">Sku: {{ item.id }}</span>
              </div>
              <div class="fs-12 lh-15" v-if="item.ext_code">
                <el-tag size="mini" @click="copy(item.ext_code)">货号: {{ item.ext_code }}</el-tag>
              </div>
              <template v-if="!item.daily_history || !item.daily_history.is_factory">
                <div v-if="item.dxm_goods_sku">
                  <el-tag size="mini" @click="copy(item.dxm_goods_sku.sku)">小秘: {{ item.dxm_goods_sku.sku }}</el-tag>
                </div>
                <div v-else>
                  <el-tag type="danger" size="mini" style="width: 100%" effect="dark" @click="openDxmGoods(item.id)">
                    配对
                  </el-tag>
                </div>
              </template>
              <div class="div-op-btn">
                <template v-if="userInfo.group_id > 0">
                  <el-tag size="mini" effect="dark" type="danger">
                    售价: {{ (item.supplier_price / 100).toFixed(1) }}
                  </el-tag>
                </template>
                <el-tag type="primary" size="mini" effect="dark"
                        v-if="item.daily_history && item.daily_history.is_factory">工厂
                </el-tag>
                <el-tag size="mini" type="warning" effect="dark">{{ levelName(item) }}</el-tag>
                <template v-if="bigDiagramsCount(item.ext_code)">
                  <el-tag size="mini" type="info" effect="dark">大板 {{ bigDiagramsCount(item.ext_code) }} 个</el-tag>
                </template>
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <KdxImage :src="item.thumb_url" width="60px" height="60px"></KdxImage>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="标记" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <template v-if="(item.tags && item.tags.length)">
                <el-tag type="primary" size="mini" v-for="(t, index) in item.tags" :key="index"
                        @close="handleRemoveTag(t.id)"
                        closable :disable-transitions="false">{{ t.user_id ? `${t.content}-私` : `${t.content}-共` }}
                </el-tag>
                <hr>
              </template>
              <div v-if="item.ban">
                <el-button size="mini" style="width: 100%" type="primary" @click="ban(item.id, false)">取消禁售
                </el-button>
              </div>
              <div v-else>
                <el-button size="mini" style="width: 100%" type="primary" @click="ban(item.id, true)">设置禁售
                </el-button>
              </div>
              <div v-if="item.ban_produce">
                <el-button size="mini" style="width: 100%" type="warning" @click="banProduce(item.id, false)">取消禁产
                </el-button>
              </div>
              <div v-else>
                <el-button size="mini" style="width: 100%" type="primary" @click="banProduce(item.id, true)">设置禁产
                </el-button>
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="包裹" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <div class="fs-12 lh-15">
                {{ detailsBoxCount(row, item.id).join(", ") }}
              </div>
              <template v-if="item.weight">
                <hr>
                <div class="fs-12 lh-15">
                  重: {{ item.weight.weight }}g/个
                </div>
              </template>
            </div>
            <div class="footer">
              <el-tag size="mini" effect="dark">重:
                {{ (totalWeight([row]) / 1000).toFixed(1) }}kg({{ boxCount([row]) }}件)
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="逻辑" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item fs-12 lh-15" v-for="(detail, index) in details(row)" :key="index">
              <template v-if="detail.sale_item">
                {{ detail.sale_item.purchase_config }}
              </template>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="总可售天" prop="custom_available_sale_days" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item fs-12 lh-15" v-for="(item, index) in items(row)" :key="index">
              <template v-if="item.daily_history">
                {{ item.daily_history.custom_available_sale_days.toFixed(2) }}
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="平台可售天" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item fs-12 lh-15" v-for="(item, index) in items(row)" :key="index">
              <template v-if="item.daily_history">
                <el-tag size="mini" type="danger" effect="dark"
                        v-if="item.daily_history.custom_available_sale_days_from_inventory <= 4">
                  {{ item.daily_history.custom_available_sale_days_from_inventory.toFixed(2) }}
                </el-tag>
                <el-tag size="mini" type="warning" effect="dark"
                        v-else-if="item.daily_history.custom_available_sale_days_from_inventory <= 8">
                  {{ item.daily_history.custom_available_sale_days_from_inventory.toFixed(2) }}
                </el-tag>
                <el-tag size="mini" type="success" v-else>
                  {{ item.daily_history.custom_available_sale_days_from_inventory.toFixed(2) }}
                </el-tag>
              </template>
              <div>
                <el-tag size="mini" type="primary">
                  +{{ addSaleDays(row, item.id) }}
                </el-tag>
              </div>
              <div>
                <el-tag size="mini" :type="totalAddSaleDaysType(row, item)" effect="dark"
                        v-if="totalAddSaleDays(row, item.id)">
                  +{{ totalAddSaleDays(row, item.id).toFixed(2) }}
                </el-tag>
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="店小秘" align="center" min-width="120px">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <template v-if="item.daily_history">
                <div class="fs-12 lh-15">
                  <el-tooltip content="加工在途(采购在途)" placement="right"
                              v-if="item.daily_history.is_jg">
                    <span>采购在途: {{ item.daily_history.on_way_count }}({{
                        item.daily_history.jg_on_way_count
                      }})</span>
                  </el-tooltip>
                  <span v-else>采购在途: {{ item.daily_history.on_way_count }}</span>
                </div>
                <div>
                  <el-tag size="mini" type="primary">
                    仓内剩余: {{ item.daily_history.real_inventory_in_warehouse }}
                  </el-tag>
                  <template v-if="item.daily_history && item.dxm_goods_sku">
                    <template v-if="item.dxm_goods_sku.inventory_fix">
                      <el-tooltip :content="`修改库存数量(${item.dxm_goods_sku.inventory_fix.change_count})`"
                                  placement="right">
                        <el-tag type="primary" effect="dark" size="mini"
                                @click="cancelFixInventory(item.dxm_goods_sku.sku)">取消
                        </el-tag>
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <el-tag type="primary" effect="dark" size="mini"
                              @click="openFixInventoryDlg(item.dxm_goods_sku.sku, item.daily_history.real_inventory_in_warehouse)">
                        修
                      </el-tag>
                    </template>
                  </template>
                </div>
                <div>
                  <el-tag size="mini" type="primary">
                    最多可加: {{ item.daily_history.jg_kcl_count }}
                  </el-tag>
                </div>
                <div>
                  <el-tag size="mini" type="danger" effect="dark">
                    占用: {{ occupy_count(row.details, item.id) }}({{ occupy_per(row.details, item) }}%)
                  </el-tag>
                </div>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="库存" align="center" min-width="100px">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(detail, index) in details(row)" :key="index">
              <template v-if="detail.sale_item">
                <div class="fs-12 lh-15">仓内: {{ detail.sale_item.sales_inventory_num }}</div>
                <div class="fs-12 lh-15">不可用: {{ detail.sale_item.unavailable_warehouse_inventory_num }}</div>
                <div class="fs-12 lh-15">已发货: {{ detail.sale_item.wait_receive_num }}</div>
                <div class="fs-12 lh-15">待质检: {{ detail.sale_item.wait_qc_num }}</div>
                <div class="fs-12 lh-15">在途: {{ detail.sale_item.vmi_transportation_num }}</div>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="退件" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <template v-if="item.return_item && item.return_item.thirty_day_total_count">
                <template v-if="item.return_item.thirty_day_total_count !== item.return_item.seven_day_total_count">
                  <div class="fs-12 lh-15">
                    <el-tag size="mini" type="primary" effect="dark">30退件:
                      {{ item.return_item.thirty_day_total_count }}
                    </el-tag>
                  </div>
                  <div class="fs-12 lh-15">
                    <el-tooltip :content="`滞销量: ${item.return_item.thirty_day_unsaleable_quantity}`"
                                placement="right">
                      <el-tag size="mini" type="warning" effect="dark">30确认:
                        {{ item.return_item.thirty_day_confirm_total_count }}
                      </el-tag>
                    </el-tooltip>
                  </div>
                </template>
                <template v-if="item.return_item.seven_day_total_count">
                  <div class="fs-12 lh-15">
                    <el-tag size="mini" type="primary" effect="dark">7退件:
                      {{ item.return_item.seven_day_total_count }}
                    </el-tag>
                  </div>
                  <div class="fs-12 lh-15">
                    <el-tooltip :content="`滞销量: ${item.return_item.seven_day_unsaleable_quantity}`"
                                placement="right">
                      <el-tag size="mini" type="warning" effect="dark">7确认:
                        {{ item.return_item.seven_day_confirm_total_count }}
                      </el-tag>
                    </el-tooltip>
                  </div>
                </template>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="7系" prop="seven_day_coef" align="center">
          <template slot="header">
            <el-tooltip content="7日系数">
              <span>7系</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              {{ item.daily_history.seven_day_coef.toFixed(2) }}
              <div>
                <el-button size="mini" type="primary" @click="openDaily(item.id)">订单</el-button>
              </div>
              <div>
                <el-button type="primary" size="mini" @click="openPlans(item.id)">发货</el-button>
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="30系" prop="thirty_day_coef" align="center">
          <template slot="header">
            <el-tooltip content="30日系数">
              <span>30系</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              {{ item.daily_history.thirty_day_coef.toFixed(2) }}
            </div>
            <div class="footer">
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

    <TemuDlgSavePackages :id="savePackage.id" :visible="savePackage.visible" @close="savePackage.visible=false"
                         @success="updateTableDataDelay"></TemuDlgSavePackages>
    <TemuDlgBindDeliveryMethodAndExpress :fix_address_id="bindDeliveryMethodAndExpressInfoDlg.fix_address_id"
                                         :rows="bindDeliveryMethodAndExpressInfoDlg.rows"
                                         :weight="totalWeight(bindDeliveryMethodAndExpressInfoDlg.all)"
                                         :originWeight="totalOriginWeight(bindDeliveryMethodAndExpressInfoDlg.all)"
                                         :num="boxCount(bindDeliveryMethodAndExpressInfoDlg.all)"
                                         :is-jit-or-custom="bindDeliveryMethodAndExpressInfoDlg.isJitOrCustom"
                                         :visible="bindDeliveryMethodAndExpressInfoDlg.visible"
                                         @close="bindDeliveryMethodAndExpressInfoDlg.visible=false"
                                         @success="updateTableDataDelay"></TemuDlgBindDeliveryMethodAndExpress>
    <TemuDlgSelfDelivery :rows="bindDeliveryMethodAndExpressInfoSelfDeliveryDlg.rows"
                         :visible="bindDeliveryMethodAndExpressInfoSelfDeliveryDlg.visible"
                         @close="bindDeliveryMethodAndExpressInfoSelfDeliveryDlg.visible=false"
                         @confirm="confirmBindDeliverySelfDelivery"></TemuDlgSelfDelivery>
    <TemuDlgBindRecordList :account-options="accountOptions" :visible="bindRecordList.visible"
                           @close="bindRecordList.visible=false"></TemuDlgBindRecordList>
    <TemuDlgDxmGoods :id="dxmGoods.id" :visible="dxmGoods.visible" @close="dxmGoods.visible=false"></TemuDlgDxmGoods>
    <TemuDlgFixInventory :sku="fixInventory.sku" :old_left_count="fixInventory.old_left_count"
                         :visible="fixInventory.visible" @close="closeFixInventoryDlg"></TemuDlgFixInventory>
    <TemuDlgTraceInfo :visible="traceInfo.visible" :id="traceInfo.id"
                      @close="traceInfo.visible=false"></TemuDlgTraceInfo>
    <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
    <TemuDlgPlans :id="plans.id" :visible="plans.visible" @close="plans.visible=false"></TemuDlgPlans>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {mapGetters} from "vuex";
import {
  deliveryOrderAddToFhdlb,
  deliveryOrderAllocateInventoryFactory,
  deliveryOrderAllocateInventoryOut, deliveryOrderAllocateInventorySelf,
  deliveryOrderBack, deliveryOrderBind, deliveryOrderCancel,
  deliveryOrderConfirm, deliveryOrderExportWarehouseAddr,
  deliveryOrderJoin,
  deliveryOrderList, deliveryOrderNotifyJit, deliveryOrderPrint, deliveryOrderSetSelfDelivery,
  deliveryOrderSync, deliveryOrderSyncForJitAndCustomize,
  deliveryOrderWarehouseList
} from "@/api/temu/delivery_order";
import TemuDlgSavePackages from "@/view/temu/delivery_order/components/dlg_save_packages.vue";
import {tagList, tagRemove} from "@/api/temu/tag";
import TemuDlgBindRecordList from "@/view/temu/delivery_order/components/dlg_bind_record_list.vue";
import {saleItemBan, saleItemBanProduce, saleItemDxmInventoryFix} from "@/api/temu/sale_item";
import TemuDlgDxmGoods from "@/view/temu/sale/components/dlg_dxm_goods.vue";
import {dxmSync} from "@/api/dxm/sync";
import TemuDlgFixInventory from "@/view/temu/components/dlg_fix_inventory.vue";
import TemuDlgTraceInfo from "@/view/temu/components/dlg_trace_info.vue";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";
import TemuDlgSelfDelivery from "@/view/temu/delivery_order/components/dlg_self_delivery.vue";
import TemuDlgPlans from "@/view/temu/components/dlg_plans.vue";
import {selfDeliveryAllNotShippedCount} from "@/api/sf-factory-v2/self_delivery";
import {productBigDiagramList} from "@/api/product/product";
import TemuDlgBindDeliveryMethodAndExpress
  from "@/view/temu/delivery_order/components/dlg_bind_delivery_method_and_express_info.vue";
import pLimit from 'p-limit';

export default {
  name: 'TemuDeliveryOrderList',
  props: {
    sku_ids: {
      type: Array, // 发货单号
    },
  },
  components: {
    TemuDlgPlans,
    TemuDlgSelfDelivery,
    TemuDlgDaily,
    TemuDlgTraceInfo,
    TemuDlgFixInventory,
    TemuDlgDxmGoods,
    TemuDlgBindRecordList,
    TemuDlgBindDeliveryMethodAndExpress,
    TemuDlgSavePackages,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    sortAccountOptions() {
      let list = []
      if (this.accountOrderCountOptions) {
        this.accountOrderCountOptions.forEach((item) => {
          if (!this.accountOptions) {
            return
          }
          let op = this.accountOptions.find((v) => {
            return v.id === item.id
          })
          if (op) {
            list.push(op)
          }
        })
      }
      if (this.accountOptions) {
        this.accountOptions.forEach((item) => {
          if (list.find((v) => {
            return item.id === v.id
          })) {
            return
          }

          list.push(item)
        })
      }

      return list
    },
    // 能否平台发货
    canPlatformDelivery() {
      return this.checkCanPlatformDelivery(this.selectRows)
    },
    // 能否自行配送
    canSelfDelivery() {
      return this.checkCanSelfDelivery(this.selectRows)
    },
    hasJit() {
      for (const row of this.selectRows) {
        if (row.purchaseStockType) {
          return true
        }
      }
      return false
    },
    hasCustom() {
      for (const row of this.selectRows) {
        if (row.isCustomProduct) {
          return true
        }
      }
      return false
    },
    canJoinRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (this.canJoin(item)) {
          list.push(item)
        }
      })

      return list
    },
    canPrintRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (this.canPrint(item)) {
          list.push(item)
        }
      })

      return list
    },
    canJoinSelfDeliveryRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (this.canJoinSelfDelivery(item)) {
          list.push(item)
        }
      })

      return list
    },
    canLeaveSelfDeliveryRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (this.canLeaveSelfDelivery(item)) {
          list.push(item)
        }
      })

      return list
    },
    canConfirmRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (item.info && item.info.status === 1) {
          list.push(item.deliveryOrderSn)
        }
      })

      return list
    },
    canBackRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (item.info && item.info.status < 3) {
          list.push(item.deliveryOrderSn)
        }
      })

      return list
    }
  },
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
          // this.syncTags()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: this.getDataList,

      accountOptions: [],
      accountOrderCountOptions: [],
      allNotShippedCountOptions: [],
      warehouseOptions: [],
      tagOptions: [],
      bigDiagrams: [],
      timeoutId: undefined,

      statusOptions: [
        {id: 0, name: "待审核"},
        {id: 1, name: "待处理"},
        {id: 2, name: "待发货"},
        {id: 3, name: "待收货"},
        {id: 4, name: "已收货"},
      ],

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

      savePackage: {
        id: undefined,
        visible: false,
      },

      bindDeliveryMethodAndExpressInfoDlg: {
        fix_address_id: undefined,
        rows: [],
        self_delivery_list: [],
        all: [],
        isJitOrCustom: false,
        visible: false,
      },

      bindDeliveryMethodAndExpressInfoSelfDeliveryDlg: {
        rows: [],
        visible: false,
      },

      bindRecordList: {
        visible: false,
      },

      dxmGoods: {
        id: undefined,
        visible: false,
      },

      fixInventory: {
        sku: undefined,
        old_left_count: undefined,
        visible: false,
      },

      traceInfo: {
        id: undefined,
        visible: false,
      },

      selectRows: [],

      urgencyTypeOptions: [
        {id: 1, name: "普通"},
        {id: 2, name: "加急"},
        {id: 3, name: "定制"},
        {id: 4, name: "JIT"}
      ],
      printedOptions: [
        {id: 1, name: "未打印"},
        {id: 2, name: "已打印"}
      ],
      isSelfOptions: [
        {id: true, name: "我加入"},
      ],
      isFirstOptions: [
        {id: 1, name: "首单"},
        {id: 2, name: "返单"},
      ],
      otherCondOptions: [],

      daily: {
        id: undefined,
        visible: false,
      },

      plans: {
        id: undefined,
        visible: false,
      },
    }
  },
  methods: {
    canJoin(item) {
      if (item.info) {
        return false
      }

      let can = true
      for (const detail of item.details) {
        if (!detail.item || !detail.item.dxm_goods_sku) {
          can = false
          break
        }
      }

      return can
    },
    canPrint(item) {
      if (!item.info) {
        return false
      }

      if (item.info.status < 2) {
        return false
      }

      return true
    },
    canJoinSelfDelivery(item) {
      if (!item.info) {
        return false
      }

      if (item.info.status !== 2) {
        return false
      }

      if (item.info.task_id) {
        return false
      }

      return true
    },
    canLeaveSelfDelivery(item) {
      if (!item.info) {
        return false
      }

      if (item.info.status !== 2) {
        return false
      }

      if (!item.info.task_id) {
        return false
      }

      return true
    },
    getDataList(params) {
      this.syncWarehouseList(params)
      this.syncAllNotShippedCount(params)
      return deliveryOrderList(params)
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    items(row) {
      let list = []

      row.details.forEach((detail) => {
        if (!detail.item) {
          return
        }

        for (let i = 0; i < list.length; i++) {
          let item = list[i]

          if (item.id === detail.item.id) {
            return
          }
        }

        list.push(detail.item)
      })

      return list
    },
    details(row) {
      let list = []

      row.details.forEach((detail) => {
        if (!detail.item) {
          return
        }

        for (let i = 0; i < list.length; i++) {
          let d = list[i]

          if (d.item.id === detail.item.id) {
            return
          }
        }

        list.push(detail)
      })

      return list
    },
    detailsBoxCount(row, id) {
      let list = row.details.filter((detail) => {
        return detail.product_sku_id === id
      })

      let mp = new Map()

      list.forEach((item) => {
        let c = mp.get(item.sku_num)
        if (!c) {
          c = 1
        } else {
          c++
        }
        mp.set(item.sku_num, c)
      })

      let result = []
      mp.forEach(function (value, key) {
        result.push(`${value}件${key}个`)
      })

      return result
    },
    openSavePackages(row) {
      this.savePackage.id = row.deliveryOrderSn
      this.savePackage.visible = true
    },
    openFixInventoryDlg(sku, oldLeftCount) {
      this.fixInventory.sku = sku
      this.fixInventory.old_left_count = oldLeftCount
      this.fixInventory.visible = true
    },
    factorySubWarehouseId(name) {
      let item = this.allNotShippedCountOptions.find((v) => {
        return v.name === name
      })
      if (!item) {
        return 0
      }
      return item.id
    },
    notUsedCount(name) {
      let item = this.allNotShippedCountOptions.find((v) => {
        return v.name === name
      })
      if (!item) {
        return 0
      }
      return item.not_used_count
    },
    notShippedCount(name) {
      let item = this.allNotShippedCountOptions.find((v) => {
        return v.name === name
      })
      if (!item) {
        return 0
      }
      return item.not_shipped_count
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
    async join(rows) {
      let ids = []
      rows.forEach((row) => {
        ids.push(row.deliveryOrderSn)
      })
      let resp = await deliveryOrderJoin({ids: ids})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async setSelfDelivery(rows, set) {
      let ids = []
      rows.forEach((row) => {
        ids.push(row.deliveryOrderSn)
      })
      let resp = await deliveryOrderSetSelfDelivery({ids: ids, set: set})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    confirm(ids) {
      this.$confirm('请确认是否强制加入待发货，有日志记录，请注意不要造成库存严重积压', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await deliveryOrderConfirm({ids: ids})
            if (resp.code) {
              return
            }

            this.getTableData()
          })
    },
    async complete(ids) {
      // TODO
      let resp = await deliveryOrderConfirm({ids: ids})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.$message("上传成功!");
      window.open(res.data, '_blank');

      this.getTableData()
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    back(ids) {
      this.$confirm('请确认是否打回?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await deliveryOrderBack({ids: ids})
            if (resp.code) {
              return
            }

            this.getTableData()
          })
    },
    cancel(rows) {
      this.$confirm('请确认是否取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let ids = []
            rows.forEach((row) => {
              ids.push(row.deliveryOrderSn)
            })
            let resp = await deliveryOrderCancel({ids: ids})
            if (resp.code) {
              return
            }

            this.updateTableDataDelay()
          })
    },
    print(rows) {
      this.$confirm('请确认是否打印，如果打印，将不能再调整包裹?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let ids = []
            rows.forEach((row) => {
              ids.push(row.deliveryOrderSn)
            })
            let resp = await deliveryOrderPrint({ids: ids})
            if (resp.code) {
              return
            }

            window.open(resp.data, "_BLANK")
            this.updateTableDataDelay()
          })
    },
    accountOrderCount(id) {
      if (!this.accountOrderCountOptions) {
        return 0
      }

      let op = this.accountOrderCountOptions.find((item) => {
        return item.id === id
      })
      if (!op) {
        return 0
      }
      return op.count
    },
    accountJitOrderCount(id) {
      if (!this.accountOrderCountOptions) {
        return 0
      }

      let op = this.accountOrderCountOptions.find((item) => {
        return item.id === id
      })
      if (!op) {
        return 0
      }
      return op.jit_count
    },
    accountCustomizeOrderCount(id) {
      if (!this.accountOrderCountOptions) {
        return 0
      }

      let op = this.accountOrderCountOptions.find((item) => {
        return item.id === id
      })
      if (!op) {
        return 0
      }
      return op.customize_count
    },
    checkCanPlatformDelivery(rows) {
      if (!rows.length) {
        return false
      }

      let accountId = undefined
      let subWarehouseId = undefined

      for (const row of rows) {
        if (!row.info) {
          return false
        }

        if (row.info.status !== 2) {
          return false
        }

        if (!accountId) {
          accountId = row.operate_id
          subWarehouseId = row.subWarehouseId
          continue
        }

        if (accountId !== row.operate_id) {
          return false
        }

        if (subWarehouseId !== row.subWarehouseId) {
          return false
        }
      }

      return true
    },
    checkCanSelfDelivery(rows) {
      if (!rows.length) {
        return false
      }

      for (const row of rows) {
        if (!row.info) {
          return false
        }

        if (row.info.status !== 2) {
          return false
        }
      }

      return true
    },
    async allocateInventoryOut() {
      this.$confirm('请确认是否分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 分配库存
            let resp = await deliveryOrderAllocateInventoryOut()
            if (resp.code) {
              return
            }

            this.$message("分配成功")
            this.getTableData()
          })
    },
    async allocateInventorySelf() {
      this.$confirm('请确认是否分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 分配库存
            let resp = await deliveryOrderAllocateInventorySelf()
            if (resp.code) {
              return
            }

            this.$message("分配成功")
            this.getTableData()
          })
    },
    allocateInventoryFactory() {
      this.$confirm('请确认是否分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 分配库存
            let resp = await deliveryOrderAllocateInventoryFactory()
            if (resp.code) {
              return
            }

            this.$message("分配成功")
            this.getTableData()
          })
    },
    async syncWarehouseList(params) {
      let resp = await deliveryOrderWarehouseList(params)
      if (resp.code) {
        return
      }

      this.warehouseOptions = resp.data.warehouse_list
      this.accountOrderCountOptions = resp.data.account_list
    },
    async syncAllNotShippedCount(data) {
      if (!this.userInfo.group_id) {
        return
      }
      let resp = await selfDeliveryAllNotShippedCount(data)
      if (resp.code) {
        return
      }

      this.allNotShippedCountOptions = resp.data || []
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let totalWeight = this.totalWeight(this.selectRows) / 1000
      let totalOriginWeight = this.totalOriginWeight(this.selectRows) / 1000
      let totalCount = this.totalCount(this.selectRows)
      let ids = []
      this.selectRows.forEach((item) => {
        ids.push(item.deliveryOrderSn)
      })
      this.copy(ids.join(" "))
      this.$message.success(`产品平台重: ${totalOriginWeight.toFixed(1)}kg, 总重: ${totalWeight.toFixed(1)}kg, 总共: ${this.boxCount(this.selectRows)}个箱唛, 总共: ${totalCount} 个货`)
    },
    checkSelectable(row) {
      return !row.confirm
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    statusName(status) {
      for (const statusOption of this.statusOptions) {
        if (statusOption.id === status) {
          return statusOption.name
        }
      }
      return `未知(${status})`
    },
    bigDiagramsCount(name) {
      let d = (this.bigDiagrams || []).find((item) => {
        return item.name === name
      })
      if (!d) {
        return 0
      }
      return d.count
    },
    async syncBigDiagrams() {
      let resp = await productBigDiagramList()
      if (resp.code === 0) {
        this.bigDiagrams = resp.data
      }
    },
    async syncTags() {
      let resp = await tagList()
      if (resp.code === 0) {
        this.tagOptions = resp.data
      }
    },
    async handleRemoveTag(id) {
      // 请求删除
      let resp = await tagRemove({id: id})
      if (resp.code) {
        return
      }

      this.$message("删除成功")
      this.getTableData()
      // this.syncTags()
    },
    updateTableDataDelay() {
      setTimeout(this.getTableData, 3000) // 3 秒后同步
    },
    occupy_count(details, id) {
      for (const detail of details) {
        if (detail.product_sku_id === id) {
          return detail.occupy_count
        }
      }
      return 0
    },
    occupy_per(details, item) {
      if (!item.daily_history) {
        return 0
      }

      let base = item.daily_history.real_inventory_in_warehouse + item.daily_history.jg_kcl_count
      if (base <= 0) {
        return "∞"
      }
      let count = this.occupy_count(details, item.id)
      if (count <= 0) {
        return 0
      }
      let per = count / base * 100
      return per.toFixed(0)
    },
    async sync(status) {
      let resp = await deliveryOrderSync({status: status})
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.onSubmit()
    },
    async syncById(ids) {
      let resp = await deliveryOrderSync({status: -1, ids: ids})
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.onSubmit()
    },
    bindSelfDelivery(rows) {
      this.$confirm('请确认是否自行配送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 一条条请求，一条条同步
        let mp = new Map()
        rows.forEach((item) => {
          let key = item.operate_id + item.subWarehouseName + item.purchaseStockType
          let array = mp.get(key)
          if (!array) {
            array = []
          }
          array.push(item)
          mp.set(key, array)
        })

        // 创建所有请求的 Promise 数组
        const limit = pLimit(5); // 最大并发数

        const promises = [];
        for (const array of mp.values()) {
          promises.push(limit(async () => {
            // 构造请求数据
            const data = {
              ids: array.map(item => item.deliveryOrderSn),
              delivery_method: 1,
              express_package_num: 1,
              is_factory: true
            };

            try {
              const r = await deliveryOrderBind(data);

              // 如果接口返回错误码，抛出异常
              if (r.code) {
                throw new Error(`业务错误: ${r.code}`);
              }

              return r;
            } catch (error) {
              // 捕获网络错误或业务错误
              console.error("请求失败:", error.message);
              throw error; // 重新抛出以触发 Promise.allSettled
            }
          }));
        }

        try {
          // 并发执行所有请求
          const results = await Promise.allSettled(promises);
          // 检查是否有任何请求失败
          const hasFailure = results.some(result =>
              result.status === 'rejected' ||
              (result.status === 'fulfilled' && result.value.code)
          );
          if (hasFailure) {
            this.$message("部分发货成功")
          } else {
            this.$message("确认发货成功")
          }
        } catch (error) {
          // 任意请求失败即触发 catch
          console.log(error)
          // 可选择 return 或 throw 中断流程（根据业务需求）
        } finally {
          this.updateTableDataDelay();
        }
      })
    },
    openBindDeliveryMethodAndExpressInfoDlg(rows) {
      this.bindDeliveryMethodAndExpressInfoDlg.rows = rows
      this.bindDeliveryMethodAndExpressInfoDlg.self_delivery_list = []
      this.bindDeliveryMethodAndExpressInfoDlg.all = rows
      this.bindDeliveryMethodAndExpressInfoDlg.isJitOrCustom = false
      for (const row of rows) {
        if (row.isCustomProduct || row.purchaseStockType) {
          this.bindDeliveryMethodAndExpressInfoDlg.isJitOrCustom = true
          break
        }
      }
      this.bindDeliveryMethodAndExpressInfoDlg.visible = true
    },
    confirmBindDeliverySelfDelivery(event) {
      this.bindDeliveryMethodAndExpressInfoDlg.fix_address_id = event.main.delivery_address_id
      this.bindDeliveryMethodAndExpressInfoDlg.rows = event.main.orders
      this.bindDeliveryMethodAndExpressInfoDlg.isJitOrCustom = false
      for (const row of this.bindDeliveryMethodAndExpressInfoDlg.rows) {
        if (row.isCustomProduct || row.purchaseStockType) {
          this.bindDeliveryMethodAndExpressInfoDlg.isJitOrCustom = true
          break
        }
      }
      this.bindDeliveryMethodAndExpressInfoDlg.self_delivery_list = event.self
      this.bindDeliveryMethodAndExpressInfoDlg.all = [...event.main.orders]
      this.bindDeliveryMethodAndExpressInfoDlg.self_delivery_list.forEach((item) => {
        this.bindDeliveryMethodAndExpressInfoDlg.all.push(...item.orders)
      })
      this.bindDeliveryMethodAndExpressInfoDlg.visible = true
    },
    openBindDeliveryMethodAndExpressInfoBySelfDlg(rows) {
      this.bindDeliveryMethodAndExpressInfoSelfDeliveryDlg.rows = rows
      this.bindDeliveryMethodAndExpressInfoSelfDeliveryDlg.visible = true
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
    queryTraceInfo(id) {
      this.traceInfo.id = id
      this.traceInfo.visible = true
    },
    handleCommand(command) {
      switch (command) {
        case "sync0": {
          this.sync([0])
          return
        }
        case "sync1": {
          this.sync([1, 6])
          return
        }
        case "sync2": {
          this.sync([2])
          return
        }
        case "syncDxm": {
          this.onDxmSync()
          return
        }
        case "batchJoin": {
          this.join(this.canJoinRows)
          return
        }
        case "batchJoinSelfDelivery": {
          this.setSelfDelivery(this.canJoinSelfDeliveryRows, true)
          return
        }
        case "batchLeaveSelfDelivery": {
          this.setSelfDelivery(this.canLeaveSelfDeliveryRows, false)
          return
        }
        case "allocateInventoryOut": {
          this.allocateInventoryOut()
          return
        }
        case "allocateInventoryFactory": {
          this.allocateInventoryFactory()
          return
        }
        case "allocateInventorySelf": {
          this.allocateInventorySelf()
          return
        }
        case "openBindDeliveryMethodAndExpressInfoDlg": {
          this.openBindDeliveryMethodAndExpressInfoDlg(this.selectRows)
          return
        }
        case "openBindDeliveryMethodAndExpressInfoBySelfDlg": {
          this.openBindDeliveryMethodAndExpressInfoBySelfDlg(this.selectRows)
          return
        }
        case "batchBack": {
          this.back(this.canBackRows)
          return
        }
        case "batchConfirm": {
          this.confirm(this.canConfirmRows)
          return
        }
        case "batchCancel": {
          this.cancel(this.selectRows)
          return
        }
        case "batchPrint": {
          this.print(this.selectRows)
          return
        }
        case "openBindRecordList": {
          this.bindRecordList.visible = true
          return
        }
        case "exportWarehouseAddr": {
          this.exportWarehouseAddr()
          return
        }
        case "addToDeliverOrders": {
          this.addToDeliverOrders()
          return
        }
        case "syncForJitAndCustomize": {
          this.syncForJitAndCustomize()
          return
        }
        case "watchJitAndCustomize": {
          this.watchJitAndCustomize()
          return
        }
        case "notifyJit": {
          this.notifyJit()
          return
        }
      }
    },
    watchJitAndCustomize() {
      this.$set(this.searchInfo, "status", 2)
      this.$set(this.searchInfo, "is_factory", undefined)
      this.$set(this.searchInfo, "search_cond", undefined)
      this.$set(this.searchInfo, "is_ban", undefined)
      this.$set(this.searchInfo, "levels", [])
      this.$set(this.searchInfo, "urgency_type", [3, 4])
      this.pageSize = 1000
      this.getTableData()
    },
    async syncForJitAndCustomize() {
      let resp = await deliveryOrderSyncForJitAndCustomize()
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async notifyJit() {
      let resp = await deliveryOrderNotifyJit()
      if (resp.code) {
        return
      }
    },
    async addToDeliverOrders() {
      let resp = await deliveryOrderAddToFhdlb()
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async exportWarehouseAddr() {
      let resp = await deliveryOrderExportWarehouseAddr()
      if (resp.code) {
        return
      }

      this.$message("导出成功")
      window.open(resp.data, "_blank")
    },
    totalWeight(rows) {
      let total = 0

      rows.forEach((row) => {
        row.details.forEach((detail) => {
          if (detail.item && detail.item.weight) {
            total += detail.sku_num * detail.item.weight.weight
          }
        })
      })
      return total
    },
    totalOriginWeight(rows) {
      let total = 0

      rows.forEach((row) => {
        row.details.forEach((detail) => {
          if (detail.item && detail.item.weight) {
            total += detail.sku_num * detail.item.weight.weight
          }
        })
      })
      return total
    },
    totalCount(rows) {
      let total = 0

      rows.forEach((row) => {
        row.details.forEach((detail) => {
          total += detail.sku_num
        })
      })
      return total
    },
    boxCount(rows) {
      let total = 0

      rows.forEach((row) => {
        total += row.details.length
      })
      return total
    },
    async ban(id, is_ban) {
      let resp = await saleItemBan({id: id, is_ban: is_ban})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async banProduce(id, is_ban) {
      let resp = await saleItemBanProduce({ids: [id], is_ban: is_ban})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    openDxmGoods(id) {
      this.dxmGoods.id = id
      this.dxmGoods.visible = true
    },
    levelName(row) {
      if (!row) {
        return "新品"
      }

      if (!row.daily_history) {
        return "新品"
      }

      let item = this.levelOptions.find((item) => {
        return item.id === row.daily_history.level
      })
      if (!item) {
        return "非法"
      }
      return item.name
    },
    addSaleDays(row, skuId) {
      let total = 0
      row.details.forEach((detail) => {
        if (detail.product_sku_id === skuId) {
          if (detail.item && detail.item.daily_history && detail.item.daily_history.seven_day_coef) {
            total += detail.sku_num / detail.item.daily_history.seven_day_coef
          } else {
            total += detail.sku_num
          }
        }
      })
      return total.toFixed(2)
    },
    totalAddSaleDays(row, skuId) {
      for (const detail of row.details) {
        if (detail.product_sku_id === skuId) {
          return detail.total_add_sale_days
        }
      }
      return 0
    },
    totalAddSaleDaysType(row, item) {
      let totalDays = (item.daily_history ? item.daily_history.custom_available_sale_days_from_inventory : 0) + this.totalAddSaleDays(row, item.id)
      if (totalDays >= 20) {
        return "danger"
      }
      return "warning"
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    openPlans(id) {
      this.plans.id = id
      this.plans.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "status", 0)
    this.$set(this.searchInfo, "include_tag", false)
    // this.$set(this.searchInfo, "tags", ["外发"])
    // this.$set(this.searchInfo, "is_factory", 1)
    this.$set(this.searchInfo, "search_cond", 1)
    this.$set(this.searchInfo, "is_ban", 1)
    this.$set(this.searchInfo, "is_ban_produce", 1)
    this.$set(this.searchInfo, "self_delivery", 2)
    // this.$set(this.searchInfo, "levels", [-3,-2,-1,0,1,2,3,4,5,6,7])
    this.$set(this.searchInfo, "urgency_type", [1, 2])
    // this.$set(this.searchInfo, "urgency_type", [1, 2])

    if (this.sku_ids && this.sku_ids.length > 0) {
      this.$set(this.searchInfo, "sku_ids", this.sku_ids.join(" "))
    }

    if (this.$route.query) {
      if (this.$route.query.return_ids) {
        this.$set(this.searchInfo, "return_ids", this.$route.query.return_ids)
      }
      if (this.$route.query.plan_id) {
        this.$set(this.searchInfo, "plan_id", this.$route.query.plan_id)
      }
    }

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }

    this.syncBigDiagrams()
    this.syncTags()
    this.onSubmit()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
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

.div-op-btn {
  .el-button--mini, .el-button--mini.is-round {
    padding: 3px 15px;
  }
}

::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled) {
  &:hover {
    border: none !important;
    background-color: red !important;
    color: white;
  }
}
</style>