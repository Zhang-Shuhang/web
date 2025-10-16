<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <template v-if="show_other">
            <el-col :xs="12" :sm="6" :lg="2">
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
                <el-select v-model="searchInfo.status" placeholder="状态" multiple filterable clearable collapse-tags
                           :style="{width: '100%'}">
                  <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.is_unqualified" placeholder="质检" filterable clearable
                           :style="{width: '100%'}">
                  <el-option v-for="(item, index) in qualifiedOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-date-picker type="date" v-model="searchInfo.send_start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="发货开始日期" unlink-panels clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-date-picker type="date" v-model="searchInfo.send_end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="发货结束日期" unlink-panels clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="质检开始日期" unlink-panels clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="质检结束日期" unlink-panels clearable></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.stock_type" placeholder="JIT/定制/VMI" filterable clearable
                           :style="{width: '100%'}">
                  <el-option v-for="(item, index) in stockTypeOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.is_late" placeholder="是否延迟到货" filterable clearable
                           :style="{width: '100%'}">
                  <el-option label="延迟到货" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.is_close_jit" placeholder="是否JIT转备货" filterable clearable
                           :style="{width: '100%'}">
                  <el-option label="JIT转备货" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="4">
              <el-form-item label-width="0">
                <el-input-number style="width: 100%" :min="0" :precision="0" :step="1" v-model="searchInfo.order_create_days" placeholder="订单创建天数">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.other_cond" placeholder="其他" multiple filterable clearable collapse-tags
                           :style="{width: '100%'}">
                  <el-option v-for="(item, index) in otherCondOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="3">
              <el-form-item label-width="0">
                <el-input placeholder="Skc Ids" v-model="searchInfo.skc_id" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="3">
              <el-form-item label-width="0">
                <el-input placeholder="Sku Ids" v-model="searchInfo.sku_id" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="3">
              <el-form-item label-width="0">
                <el-input placeholder="订单号" v-model="searchInfo.plan_id" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="show_other">
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.inbound_return" placeholder="是否入库退供" filterable clearable
                           :style="{width: '100%'}">
                  <el-option label=""></el-option>
                  <el-option label="入库退供" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="3">
              <el-form-item label-width="0">
                <el-input placeholder="货号" v-model="searchInfo.sku_ext_code" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-input placeholder="退件id" v-model="searchInfo.return_ids" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-input placeholder="退件物流" v-model="searchInfo.return_express_sn" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onBatchAddFht" v-if="selectRows.length">批量加入发货台</el-button>
              <el-button type="primary" :style="{width: '100%'}" @click="onSync" v-else>全部加入发货台</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="isMobile">
          <el-col :span="24">
            <el-button :style="{width: '100%', height: '20px', 'padding-top': '0px', 'padding-bottom': '0px'}"
                       @click="show_other=true" icon="el-icon-arrow-down" v-if="!show_other"></el-button>
            <el-button :style="{width: '100%', height: '20px', 'padding-top': '0px', 'padding-bottom': '0px'}"
                       @click="show_other=false" icon="el-icon-arrow-up" v-if="show_other"></el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="商品信息" min-width="250px" align="center">
          <div slot-scope="{row}">
            <el-form label-position="left" label-width="70px" class="form-info">
              <el-form-item label="账号" v-if="row.item.sale && row.item.sale.account">
                <div>{{ row.item.sale.account.name }}</div>
              </el-form-item>
              <el-form-item label="订单号">
                <div>{{ row.plan_id }}</div>
              </el-form-item>
              <el-form-item label="Skc Id">
                <div>{{ row.item.sale.product_skc_id }}</div>
              </el-form-item>
              <el-form-item label="Sku Id">
                <div>{{ row.product_sku_id }}</div>
              </el-form-item>
              <el-form-item label="状态">
                <div>{{ statusName(row.status) }}</div>
              </el-form-item>
              <el-form-item label="Sku">
                <div>{{ row.item.sku_ext_code }}</div>
              </el-form-item>
              <el-form-item label="变体" v-if="row.item.item_image">
                <span>{{ row.item.item_image.name }}</span>
              </el-form-item>
              <el-form-item label="小秘Sku" v-if="row.item && row.item.dxm_goods_sku">
                <span>{{ row.item.dxm_goods_sku.sku }}</span>
              </el-form-item>
              <el-form-item label="类目" v-if="row.item && row.item.sale">
                <span>{{ row.item.sale.category }}</span>
              </el-form-item>
              <el-form-item label="买手" v-if="row.item && row.item.select">
                <span>{{ row.item.select.buyer_name }}</span>
              </el-form-item>
            </el-form>
            <template v-if="row.item.daily_history.share_dxm">
              <el-tag size="mini" type="danger" effect="dark">共享库存</el-tag>
            </template>
            <template v-if="row.plan.purchase_stock_type==1">
              <el-tag size="mini" type="warning" v-if="row.plan.purchase_stock_type==1">JIT</el-tag>
            </template>
            <template v-if="row.plan.urgency_type===1">
              <el-tag size="mini" type="warning">紧急备货单</el-tag>
            </template>
            <template v-else-if="row.plan.urgency_type===0">
              <el-tag size="mini" type="warning">普通备货单</el-tag>
            </template>
            <template v-if="row.plan.is_custom_goods">
              <el-tag size="mini" type="warning">定制品备货单</el-tag>
            </template>
            <template v-if="row.plan.is_first">
              <el-tag size="mini" type="warning">首</el-tag>
            </template>
            <template>
              <span v-if="row.item.sale.is_ad_product">
                <el-tag size="mini" type="success" effect="dark">站外广告</el-tag>
              </span>
              <span v-for="(item, index) in row.item.sale.ad_type_list" :key="index">
                <template v-if="item === 1">
                  <el-tag size="mini" type="warning">普通广告</el-tag>
                </template>
                <template v-else-if="item === 2">
                  <el-tag size="mini" type="danger">高级广告</el-tag>
                </template>
                <template v-else-if="item === 0">
                  <el-tag size="mini" type="primary">无广告</el-tag>
                </template>
              </span>
            </template>
            <template v-if="row.status === 1 && !row.plan.is_can_join_deliver_platform && row.plan.delivery_order_sn">
              <el-tag size="mini" type="warning">已加入发货单列表</el-tag>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <div slot-scope="{row}">
            <el-form label-position="top">
              <el-form-item label="主图">
                <KdxImage :src="row.item.sale.product_skc_picture" width="60px" height="60px"></KdxImage>
              </el-form-item>
              <el-form-item label="变体图" v-if="row.item.item_image">
                <KdxImage :src="row.item.item_image.image" width="60px" height="60px"></KdxImage>
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="数量" prop="purchase_quantity" align="center" min-width="150px">
          <div slot-scope="{row}">
            <el-form label-position="left" label-width="130px">
              <el-form-item label="待发货数">
                <div>{{row.purchase_quantity}}</div>
              </el-form-item>
              <el-form-item label="交货数量">
                <div>{{row.deliver_quantity}}</div>
              </el-form-item>
              <el-form-item label="实收数量">
                <div>{{row.real_receive_authentic_quantity}}</div>
              </el-form-item>
              <el-form-item label="次品数量">
                <div>{{row.defective_quantity}}</div>
              </el-form-item>
              <el-form-item label="销售管理-收货" v-if="row.detail">
                <div>{{row.detail.real_receive_authentic_quantity}}</div>
              </el-form-item>
              <el-form-item label="销售管理-上架" v-if="row.detail">
                <div>{{row.detail.onShelfQcQuantity}}</div>
              </el-form-item>
              <el-form-item label="修复" v-if="row.status > 3">
                <el-tag size="mini" type="primary" v-if="row.real_receive">{{row.real_receive.quantity}}</el-tag>
                <TemuDlgPlanItemRealReceive :id="row.id" :count="row.real_receive_authentic_quantity > 0 ? row.real_receive_authentic_quantity : row.deliver_quantity" @update="getTableData"></TemuDlgPlanItemRealReceive>
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="店小秘" align="center" min-width="150px">
          <div slot-scope="{row}">
            <el-form label-position="left" label-width="90px">
              <el-form-item label="总在途" v-if="row.item && row.item.daily_history">
                <div v-if="row.item.daily_history.is_jg">{{ row.item.daily_history.jg_on_way_count }}</div>
                <div v-else>{{ row.item.daily_history.on_way_count }}</div>
              </el-form-item>
              <el-form-item label="总入仓">
                <div>{{ row.item.daily_history.kcl_count }}</div>
              </el-form-item>
              <el-form-item label="总发出">
                <el-tag type="primary" size="small" v-if="row.item.daily_history.share_dxm">
                  {{ row.item.daily_history.total_plan_count }}({{ row.item.daily_history.other_total_plan_count }})
                </el-tag>
                <el-tag type="primary" size="small" v-else>{{ row.item.daily_history.total_plan_count }}</el-tag>
              </el-form-item>
              <el-form-item label="仓内剩余">
                <div>{{ row.item.daily_history.real_inventory_in_warehouse }}</div>
              </el-form-item>
              <el-form-item label="最多可加工">
                <div>{{ row.item.daily_history.jg_kcl_count }}</div>
              </el-form-item>
              <el-form-item label="总剩余">
                <div>{{ row.item.daily_history.real_inventory }}</div>
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="Vmi" align="center" min-width="150px">
          <div slot-scope="{row}">
            <el-form label-position="left" label-width="70px">
              <el-form-item label="待发(量)">
                <el-tag type="primary" size="small">
                  {{ row.item.daily_history.wait_delivery_inventory_num }}({{ row.item.daily_history.other_wait_delivery_inventory_num }})
                </el-tag>
              </el-form-item>
              <el-form-item label="待发(件)">
                <div>{{ row.item.vmi_wait_delivery_num }}</div>
              </el-form-item>
              <el-form-item label="在途">
                {{ row.item.vmi_transportation_num }}
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="仓内库存" align="center" min-width="150px">
          <div slot-scope="{row}">
            <el-form label-position="left" label-width="70px">
              <el-form-item label="仓内">
                {{row.item.sales_inventory_num}}
              </el-form-item>
              <el-form-item label="不可用">
                <div>{{ row.item.unavailable_warehouse_inventory_num }}</div>
              </el-form-item>
              <el-form-item label="已发货">
                {{ row.item.wait_receive_num }}
              </el-form-item>
              <el-form-item label="待质检">
                {{ row.item.wait_qc_num }}
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="质检" align="center" min-width="200px">
          <div slot-scope="{row}">
            <el-form label-position="left" label-width="70px">
<!--              {{row}}-->
              <el-form-item label="下单时间">
                <div>{{ new Date(row.created_at).toLocaleString() }}</div>
              </el-form-item>
              <hr>
              <el-form-item label="发货时间">
                <div v-if="row.plan.deliver_time">{{ new Date(row.plan.deliver_time).toLocaleString() }}</div>
                <div v-else>-</div>
              </el-form-item>
              <el-form-item label="发货单号">
                <el-link v-if="row.plan.delivery_order_sn" @click="queryTraceInfo(row.plan_id)" type="primary">{{ row.plan.delivery_order_sn }}</el-link>
                <div v-else>-</div>
              </el-form-item>
              <el-form-item label="发货仓库" v-if="row.plan && row.plan.delivery_order && row.plan.delivery_order.delivery_address_label">
                <div>{{ row.plan.delivery_order.delivery_address_label }}</div>
              </el-form-item>
              <hr>
              <el-form-item label="收货时间">
                <div v-if="row.plan.receive_time">{{ new Date(row.plan.receive_time).toLocaleString() }}</div>
                <div v-else>-</div>
              </el-form-item>
              <el-form-item label="收货仓库">
                <div v-if="row.plan.receive_warehouse_name">{{ row.plan.receive_warehouse_name }}</div>
                <div v-else>-</div>
              </el-form-item>
              <hr>

              <template v-if="row.plan.delivery_by_jit_kv && row.plan.delivery_by_jit_kv.delivery_by_jit">
                <el-form-item label="发货费用">
                  <el-tag size="small" type="primary">¥ {{ row.plan.delivery_by_jit_kv.delivery_by_jit.amount }}</el-tag>
                </el-form-item>
                <el-form-item label="发货单号">
                  <el-tag size="small" type="primary">{{ row.plan.delivery_by_jit_kv.delivery_by_jit.id }}</el-tag>
                </el-form-item>
                <el-form-item label="发货包括">
<!--                  <template v-for="(sn, index) in row.plan.delivery_by_jit_kv.delivery_by_jit.sub_purchase_order_sn">-->
<!--                    <div :key="index">-->
<!--                      <el-tag size="small" type="primary">{{ sn }}</el-tag>-->
<!--                    </div>-->
<!--                  </template>-->
                  <el-button type="primary" style="width: 100%" size="mini" @click="queryPlans(row.plan.delivery_by_jit_kv.delivery_by_jit.sub_purchase_order_sn)">查询</el-button>
                </el-form-item>
                <hr>
              </template>

              <template v-if="row.qc_detail">
                <el-form-item label="结果">
                  <el-tag :type="row.qc_detail.qc_result === 1 ? 'primary' : 'danger'" effect="dark" size="small">{{row.qc_detail.qc_result === 1 ? "合格" : "不合格"}}</el-tag>
                </el-form-item>
                <el-form-item label="质检Id">
                  <div>{{ row.qc_detail.result.qc_bill_no }}</div>
                </el-form-item>
                <el-form-item label="质检组">
                  <div>{{ row.qc_detail.result.qc_group_name }}</div>
                </el-form-item>
                <el-form-item label="质检时间">
                  <div>{{ new Date(row.qc_detail.result.qc_end_time).toLocaleString() }}</div>
                </el-form-item>
                <el-form-item v-if="row.qc_detail && row.qc_detail.result.flaw_vo_list && row.qc_detail.result.flaw_vo_list.length">
                  <el-button size="mini" style="width: 100%" type="primary" @click="openQcDetail(row)">查看质检结果</el-button>
                </el-form-item>
              </template>
              <el-form-item v-if="row.return_records && row.return_records.length">
                <el-button size="mini" style="width: 100%" type="danger" @click="openReturnRecords(row)">退货记录[{{row.return_records.length}}]</el-button>
              </el-form-item>
              <el-form-item label="结果" v-else>
                <div>-</div>
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <div v-if="row.status===1">
              <el-tag size="mini" type="success" style="width: 100%" effect="dark" v-if="!row.plan.is_can_join_deliver_platform">已加入发货台{{row.delivery_order_sn ? `-${row.delivery_order_sn}` : ``}}</el-tag>
              <el-button type="warning" size="mini" style="width: 100%" @click="onJoinDeliveryGoodsOrderPlatform(row.id)" plain v-else>加入发货台</el-button>
            </div>
            <div v-if="row.bind_record">
              <el-button size="mini" type="danger" style="width: 100%" @click="confirm(row.bind_record.id)" v-if="canConfirm(row)">待确认({{row.bind_record.quantity}})</el-button>
              <el-tag size="mini" type="danger" style="width: 100%" effect="dark" v-else>已确认无误({{row.bind_record.quantity}})</el-tag>
            </div>

            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="genCode(row.item.id, 0)" plain>
                生成条码
              </el-button>
            </div>
            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="genCode(row.item.id, 1)" plain>
                生成普货70x50条码
              </el-button>
            </div>
            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="genCode(row.item.id, 2)" plain>
                生成自定规则条码
              </el-button>
            </div>
            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="genPlanItemCode(row.id)" plain>
                生成包裹码
              </el-button>
            </div>
            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="sync(row.plan_id)">同步</el-button>
            </div>
            <el-col :span="12" v-if="row.item">
              <el-button type="primary" size="mini" style="width: 100%" @click="openImageReview(row)">图审</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">改图</el-button>
            </el-col>

            <div style="width: 100%; margin-top: 5px">
              <el-upload :action="`/temu/plan_item/gen_item_code_fcc`" :headers="{'x-token':token}" :show-file-list="false"
                         accept=".pdf" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
                <el-button size="small" :style="{width: '100%'}" type="primary">生成Fcc条码</el-button>
              </el-upload>
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

    <el-dialog :visible.sync="zf.visible" title="作废" width="40%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :close="()=>{zf.visible=false}">
      <div>
        <el-input-number size="mini" v-model="zf.count" placeholder="作废数量" :precision="0" style="width: 100%" clearable></el-input-number>
        <div style="height: 30px"></div>
        <el-button size="mini" type="danger" style="width: 100%" @click="onZf">作废</el-button>
      </div>
    </el-dialog>

    <TemuDlgTraceInfo :visible="traceInfo.visible" :id="traceInfo.id" @close="traceInfo.visible=false"></TemuDlgTraceInfo>
    <TemuDlgQc :visible="qc_detail.visible" :id="qc_detail.id" @close="qc_detail.visible=false"></TemuDlgQc>
    <TemuDlgGenScript :visible="gen_script.visible" :id="gen_script.id" @close="gen_script.visible=false"></TemuDlgGenScript>
    <TemuDlgFixInventory :sku="fixInventory.sku" :old_left_count="fixInventory.old_left_count" :visible="fixInventory.visible" @close="closeFixInventoryDlg"></TemuDlgFixInventory>
    <TemuDlgReturnRecord :visible="return_records.visible" :id="return_records.id" :image="return_records.image" :list="return_records.list" :queryRefundList="queryRefundList" @close="return_records.visible=false"></TemuDlgReturnRecord>
    <TemuDlgImageReview :id="imageReview.id" :visible="imageReview.visible" @close="imageReview.visible=false"></TemuDlgImageReview>
    <TemuDlgImageEdit :content="image_edit.content" :sku_ext_code="image_edit.sku_code" :visible="image_edit.visible" @close="image_edit.visible=false"></TemuDlgImageEdit>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  planItemList,
  planGenCode,
  planGenItemCode,
  planJoinDeliveryGoodsOrderPlatform,
  planBatchJoinDeliveryGoodsOrderPlatform,
  planZf
} from "@/api/temu/plan_item";
import {allBatchJoinDeliveryGoodsOrderPlatform} from "@/api/temu/plan_item";
import KdxImage from "@/components/image/image";
import {saleItemFirstOrder} from "../../../api/temu/sale_item";
import {accountList} from "../../../api/temu/account";
import {dxmAddToPlan} from "../../../api/dxm/plan";
import {planItemSync} from "../../../api/temu/plan_item";
import {planConfirm, planCountDown} from "../../../api/temu/plan";
import {Notification} from 'element-ui';
import {mapGetters} from "vuex";
import TemuDlgFixInventory from "@/view/temu/components/dlg_fix_inventory.vue";
import TemuDlgReturnRecord from "@/view/temu/components/dlg_return_record.vue";
import TemuDlgQc from "@/view/temu/components/dlg_qc.vue";
import TemuDlgPlanItemRealReceive from "@/view/temu/components/dlg_plan_item_real_receive.vue";
import TemuDlgTraceInfo from "@/view/temu/components/dlg_trace_info.vue";
import TemuDlgImageEdit from "@/view/temu/sale/components/dlg_image_edit.vue";
import TemuDlgImageReview from "@/view/temu/sale/components/dlg_image_review.vue";
import TemuDlgGenScript from "@/view/temu/plan_item/components/dlg_script.vue";

export default {
  name: 'TemuPlanItem',
  components: {
    TemuDlgImageReview,
    TemuDlgImageEdit,
    TemuDlgTraceInfo,
    TemuDlgPlanItemRealReceive,
    TemuDlgQc,
    TemuDlgReturnRecord,
    TemuDlgFixInventory,
    TemuDlgGenScript,
    KdxImage
  },
  mixins: [infoList],
  computed:{
    ...mapGetters("user", ["token"]),
  },
  props: {
    plan_ids: {
      type: Array, // 发货单号
    },
  },
  data() {
    return {
      listApi: planItemList,
      isMobile: false,
      show_other: true,

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
        visible: false,
      },

      imageReview: {
        id: undefined,
        visible: false,
      },

      image_edit: {
        sku_id: undefined,
        sku_code: undefined,
        visible: false,
      },

      fixInventory: {
        sku: undefined,
        old_left_count: undefined,
        visible: false,
      },

      accountOptions: [],

      statusOptions: [
        {id: 0, name: "待接单"},
        {id: 1, name: "待发货"},
        {id: 2, name: "已送货"},
        {id: 3, name: "已收货"},
        {id: 5, name: "质检全部退回"},
        {id: 6, name: "已验收"},
        {id: 7, name: "已入库"},
        {id: 8, name: "已作废"},
        {id: 9, name: "已超时"},
      ],
      qualifiedOptions: [
        {id: 1, name: "不合格"},
        {id: 2, name: "合格"},
        {id: 3, name: "未质检"},
      ],
      stockTypeOptions: [
        {id: 1, name: "JIT"},
        {id: 2, name: "定制"},
        {id: 3, name: "VMI"},
      ],
      searchCondOptions: [
        {id: 1, name: "Skc Id"},
        {id: 2, name: "Sku Id"},
        {id: 3, name: "店小秘商品sku"},
      ],
      otherCondOptions: [
        {id: 1, name: "到货不符"},
        {id: 14, name: "到货偏少"},
        {id: 20, name: "到货少于实际"},
        {id: 21, name: "到货少于实际(无修正)"},
        {id: 19, name: "外发"},
        {id: 22, name: "工厂"},
        {id: 25, name: "本人发货"},
        {id: 23, name: "本人发货-已确认"},
        {id: 24, name: "本人发货-未确认"},
        {id: 2, name: "未设置优先级"},
        {id: 3, name: "有设置优先级"},
        {id: 10, name: "已加入发货台"},
        {id: 11, name: "未加入发货台"},
        {id: 12, name: "有退件记录"},
        {id: 15, name: "今日可加入"},
        {id: 16, name: "今日不可加入"},
        {id: 17, name: "已加入发货单列表"},
        {id: 18, name: "未加入发货单列表"},
        {id: 4, name: "已预打包"},
        {id: 5, name: "未预打包"},
        {id: 13, name: "4天前发货"},
        {id: 26, name: "10天前发货"},
        {id: 27, name: "20天前发货"},
      ],

      traceInfo: {
        id: undefined,
        visible: false,
      },

      zf: {
        id: undefined,
        count: 1,
        visible: false,
      },

      qc_detail: {
        id: "",
        visible: false
      },

      gen_script: {
        id: undefined,
        visible: false
      },

      return_records: {
        id: "",
        image: "",
        list: [],
        visible: false
      },

      selectRows: []
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

      this.$message("生成成功，请配对、采购后将该订单搁置")
      window.open("https://www.dianxiaomi.com/order/index.htm", "_target")
    },
    async addToBuyPlan(item) {
      let count = Math.max(1, item.daily_history.custom_real_advice_quantity) // 最少采购一个
      let resp = await dxmAddToPlan({sku: item.dxm_goods_sku.sku, count: count, platform: "TEMU"})
      if (resp.code) {
        return
      }

      if (!resp.data.suc) {
        this.$message.error("加入失败")
        return
      }

      this.$message("加入成功，我将跳转")
      window.open("https://www.dianxiaomi.com/dxmPurchasePlan/purchasePlan.htm", "_target")
    },
    async reqStock(id) {
      this.stock.id = id
      this.stock.visible = true
    },
    async onSync() {
      let resp = await allBatchJoinDeliveryGoodsOrderPlatform()
      if (resp.code !== 0) {
        return
      }

      this.$message("同步成功，请不要过快同步: " + resp.data)
    },
    changeSearchCond(cond, content) {
      this.$set(this.searchInfo, "search_cond", cond)
      this.$set(this.searchInfo, "search_content", content)
      this.getTableData()
    },
    async genCode(id, type) {
      let resp = await planGenCode({id: id, type: type})
      if (resp.code === 0) {
        window.open(`${resp.data.url}`, "_BLANK")
      }
    },
    async genPlanItemCode(id, type) {
      let resp = await planGenItemCode({id: id, type: type})
      if (resp.code === 0) {
        window.open(`${resp.data}`, "_BLANK")
      }
    },
    statusName(status) {
      switch (status) {
        case 0:
          return "待接单"
        case 1:
          return "待发货"
        case 2:
          return "已送货"
        case 3:
          return "已收货"
        case 4:
          return ""
        case 5:
          return "质检全部退回"
        case 6:
          return "已验收"
        case 7:
          return "已入库"
        case 8:
          return "已作废"
        case 9:
          return "已超时"
      }
      return "未知"
    },
    canConfirm(row) {
      if (row.bind_record.confirm) {
        return false
      }
      switch (row.status) {
        case 2:
          return true
        case 3:
          return true
        case 6:
          return true
        case 7:
          return true
        case 9:
          return true
      }
      return false
    },
    async sync(id) {
      let resp = await planItemSync({id})
      if (resp.code) {
        return
      }
      this.getTableData()
    },
    async countDown(id, priority) {
      let data = {id}
      if (priority === 0) {
        data.is_today = true
      } else if (priority === 2) {
        data.is_remove = true
      }
      let resp = await planCountDown(data)
      if (resp.code) {
        return
      }
      this.getTableData()
    },
    async openGenScriptDlg(id) {
      this.gen_script.id = id
      this.gen_script.visible = true
    },
    openZf(id) {
      this.zf.id = id
      this.zf.count = 1
      this.zf.visible = true
    },
    async confirm(id) {
      let resp = await planConfirm({id: id})
      if (resp.code === 0) {
        this.$message("确认成功")
        this.getTableData()
      }
    },
    async onZf() {
      let resp = await planZf({id: this.zf.id, count: this.zf.count})
      if (resp.code === 0) {
        this.zf.visible = false
        this.$message("作废成功")
        this.getTableData()
      }
    },
    openQcDetail(row) {
      this.qc_detail.id = row.plan_id
      this.qc_detail.visible = true
    },
    openReturnRecords(row) {
      if (row.item && row.item.item_image) {
        this.return_records.image = row.item.item_image.image
      } else {
        this.return_records.image = ""
      }
      this.return_records.id = row.plan_id
      this.return_records.list = row.return_records
      this.return_records.visible = true
    },
    async onJoinDeliveryGoodsOrderPlatform(id) {
      let resp = await planJoinDeliveryGoodsOrderPlatform({id: id})
      if (resp.code === 0) {
        this.$message("操作成功")
        this.getTableData()
      }
    },
    async queryRefundList(sn) {
      this.$set(this.searchInfo, "return_express_sn", sn)
      this.getTableData()
      this.return_records.visible = false
    },
    onBatchAddFht() {
      if (this.selectRows.length <= 0) {
        return
      }

      let ids = []
      this.selectRows.forEach((item) => {
        ids.push(item.plan.id)
      })

      this.$confirm('确认批量加入发货台?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await planBatchJoinDeliveryGoodsOrderPlatform({ids: ids})
            if (resp.code === 0) {

              if (resp.data) {
                Notification({
                  showClose: true,
                  message: resp.data.join("\n"),
                  offset: 150,
                  duration: 15000,
                  type: 'error'
                })
                this.$message("部分操作成功")
              } else {
                this.$message("操作成功")
              }
              this.getTableData()
            }
          })
    },
    queryTraceInfo(id) {
      this.traceInfo.id = id
      this.traceInfo.visible = true
    },
    selectionChange(val) {
      this.selectRows = val
    },
    checkSelectable (row) {
      return row.status === 1
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    queryPlans(list) {
      this.$set(this.searchInfo, "plan_id", list.join(" "))
      this.getTableData()
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.getTableData()
      if (res.data) {
        window.open(`${res.data}`, "_BLANK")
      } else {
        this.$message("上传成功!");
      }
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    closeFixInventoryDlg() {
      this.fixInventory.visible = false
      this.$router.push({ query: {} })
    },
    openImageReview(row) {
      this.imageReview.id = row.item.sale_id
      this.imageReview.visible = true
    },
    openImageEdit(row) {
      this.image_edit.content = String(row.product_sku_id)
      this.image_edit.sku_code = row.ext_code
      this.image_edit.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
    this.$set(this.searchInfo, "search_cond", 1)

    if (this.plan_ids && this.plan_ids.length > 0) {
      this.$set(this.searchInfo, "plan_id", this.plan_ids.join(" "))
    }

    if (this.$route.query) {
      // 打开弹窗
      if (this.$route.query.fix_inventory_sku && this.$route.query.fix_inventory_old_count) {
        setTimeout(()=>{
          this.fixInventory.sku = this.$route.query.fix_inventory_sku
          this.fixInventory.old_left_count = Number(this.$route.query.fix_inventory_old_count)
          this.fixInventory.visible = true
        }, 1000)
      }
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
  ::v-deep .el-form-item__label {
    line-height: unset;
    color: #99a9bf;
  }

  ::v-deep .el-form-item__content {
    line-height: unset;
  }

  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  .form-info {
    line-height: 16px;
    font-size: 12px;
  }
</style>