<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id" v-if="!item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids，空格分隔" v-model="searchInfo.skc_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids，空格分隔" v-model="searchInfo.sku_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
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
          <el-col :xs="12" :sm="6" :lg="2">
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
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input size="mini" v-model="searchInfo.ext_code" clearable placeholder="货号，逗号分隔" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable
                         style="width: 100%">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_factory" placeholder="是否工厂" filterable clearable
                         style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="工厂" :value="1"></el-option>
                <el-option label="非工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="是否禁止备货" v-model="searchInfo.is_reduce_price_pass" clearable filterable
                         style="width: 100%">
                <el-option label="禁止备货" :value="1"></el-option>
                <el-option label="未禁止备货" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="订单类型" v-model="searchInfo.product_types" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option label="备货" :value="1"></el-option>
                <el-option label="JIT" :value="2"></el-option>
                <el-option label="定制" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.close_jit_status" placeholder="JIT转备货进度" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="待调价" :value="1"></el-option>
                <el-option label="调价中" :value="2"></el-option>
                <el-option label="备货中" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小仓内+在途可售天数" v-model="searchInfo.min_sale_days" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大仓内+在途可售天数" v-model="searchInfo.max_sale_days" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小仓+途+生产中可售天数" v-model="searchInfo.prepare_min_sale_days" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大仓+途+生产中可售天数" v-model="searchInfo.prepare_max_sale_days" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小仓+途+生产中+待生产可售天数" v-model="searchInfo.confirm_min_sale_days" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大仓+途+生产中+待生产可售天数" v-model="searchInfo.confirm_max_sale_days" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小7系" v-model="searchInfo.min_seven_day_coef" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大7系" v-model="searchInfo.max_seven_day_coef" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="syncAdvice">同步备货</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length > 0 ">
            <el-button size="mini" type="primary" style="width: 100%" @click="openStockBatch">批量备货</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange" :summary-method="getSummaries" show-summary>
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="id" width="180px">
          <div slot-scope="{row}">
            <div v-if="row.account">
              {{row.account.name}}
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product_id.toString())">Spu: {{ row.product_id }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product_skc_id.toString())">Skc: {{ row.product_skc_id }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.id.toString())">Sku: {{ row.id }}</el-tag>
            </div>
            <div style="font-size: 12px">
              <el-tag size="mini" type="primary" @click="copy(row.ext_code)">货号: {{ row.ext_code }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="warning" effect="dark">{{ levelName(row) }}</el-tag>
            </div>
            <div v-if="row.variation && row.variation.product && row.variation.product.is_y2">
              <el-tag size="mini" type="warning" effect="dark">Y2</el-tag>
            </div>
            <div v-if="row.variation && row.variation.product">
              <el-tag size="mini" type="primary" v-if="row.variation.product.product_type === 1">备货</el-tag>
              <el-tag size="mini" type="primary" effect="dark" v-else-if="row.variation.product.product_type === 2">JIT</el-tag>
              <el-tag size="mini" type="warning" effect="dark" v-else-if="row.variation.product.product_type === 3">定制</el-tag>
            </div>
            <div v-if="row.variation && row.variation.sale && row.variation.product && row.variation.product.product_type === 2">
              <el-tag size="mini" type="warning" effect="dark" v-if="row.variation.sale.close_jit_status === 1">JIT: 调价中</el-tag>
              <el-tag size="mini" type="danger" effect="dark" v-else-if="row.variation.sale.close_jit_status === 2">JIT: 备货中</el-tag>
              <el-tag size="mini" type="primary" effect="dark" v-else>JIT: 待调价</el-tag>

              <div v-if="row.variation.sale.auto_close_jit_end_time">
                <el-tag size="mini" type="warning" effect="dark">自动关JIT: {{new Date(row.variation.sale.auto_close_jit_end_time).toLocaleString()}}</el-tag>
              </div>
            </div>
            <div v-if="skuReview(row)">
              <el-tag size="mini" type="primary" v-if="row.history && row.history.review_count">
                Sku评分: {{ skuReview(row) }})
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center" width="100px">
          <div slot-scope="{row}">
            <div v-if="row.variation">
              <KdxImage :src="row.variation.thumb_url"></KdxImage>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain v-if="row.history">发货({{row.history.join_count}}|{{row.history.today_can_join}})</el-button>
              <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain v-else>发货</el-button>
            </div>
            <el-row>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openCountryDaily(row.sale_id)" plain>国家订单</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单</el-button>
              </el-col>
            </el-row>
            <div v-if="row.ban">
              <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, false)">取消禁售{{row.ban.type === 0 ? "(手动)" : "(单量不足)"}}</el-button>
            </div>
            <div v-else>
              <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, true)">设置禁售</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="备货" align="center">
          <el-table-column label="逻辑" prop="variation.item.purchase_config" align="center">
          </el-table-column>
          <el-table-column label="仓内" prop="inventory_num_sale_days" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag size="small" type="danger" effect="dark" v-if="row.inventory_num_sale_days <= 4">
                {{ row.inventory_num_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="row.inventory_num_sale_days <= 8">
                {{ row.inventory_num_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{ row.inventory_num_sale_days.toFixed(2) }}
              </el-tag>
            </div>
          </el-table-column>
          <el-table-column label="仓+途" prop="inventory_and_on_way_sale_days" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag size="small" type="danger" effect="dark" v-if="row.inventory_and_on_way_sale_days <= 4">
                {{ row.inventory_and_on_way_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="row.inventory_and_on_way_sale_days <= 8">
                {{ row.inventory_and_on_way_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{ row.inventory_and_on_way_sale_days.toFixed(2) }}
              </el-tag>
            </div>
          </el-table-column>
          <el-table-column label="建议备货量" prop="advice_count" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag size="mini" type="primary">{{ row.advice_count }}</el-tag>
              <div>
                <el-button type="primary" size="mini" style="display: inline-block; padding: 3px 10px" @click="reqStock(row.product_skc_id, row.id)" plain>备</el-button>
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="工厂" align="center">
          <el-table-column label="生产中" align="center" prop="factory_prepare_count" sortable="custom">
            <div slot-scope="{row}">
              <el-tag size="mini" type="primary">{{ row.factory_prepare_count }}</el-tag>
              <div v-if="row.factory_prepare_count">
                <el-button size="mini" type="primary" @click="openFactory([row.id], 2)">
                  查看
                </el-button>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="仓+途+生产中" prop="factory_prepare_sale_days" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag size="small" type="danger" effect="dark" v-if="row.factory_prepare_sale_days <= 4">
                {{ row.factory_prepare_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="row.factory_prepare_sale_days <= 8">
                {{ row.factory_prepare_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{ row.factory_prepare_sale_days.toFixed(2) }}
              </el-tag>
            </div>
          </el-table-column>
          <el-table-column label="待生产" align="center" prop="factory_confirm_count" sortable="custom">
            <div slot-scope="{row}">
              <el-tag size="mini" type="primary">{{ row.factory_confirm_count }}</el-tag>
              <div v-if="row.factory_confirm_count">
                <el-button size="mini" type="primary" @click="openFactory([row.id], 1)">
                  查看
                </el-button>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="仓+途+生产中+待生产" prop="factory_confirm_sale_days" sortable="custom" align="center">
            <div slot-scope="{row}">
              <el-tag size="small" type="danger" effect="dark" v-if="row.factory_confirm_sale_days <= 4">
                {{ row.factory_confirm_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="row.factory_confirm_sale_days <= 8">
                {{ row.factory_confirm_sale_days.toFixed(2) }}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{ row.factory_confirm_sale_days.toFixed(2) }}
              </el-tag>
            </div>
          </el-table-column>
          <el-table-column label="待处理" align="center" prop="factory_wait_handle_count" sortable="custom">
            <div slot-scope="{row}">
              <el-tag size="mini" type="primary">{{ row.factory_wait_handle_count }}</el-tag>
              <div v-if="row.factory_wait_handle_count">
                <el-button size="mini" type="primary" @click="openFactory([row.id], 0)">
                  查看
                </el-button>
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="Temu仓" align="center" prop="inventory_num" sortable="custom">
          <el-table-column label="仓内" align="center" prop="inventory_num" sortable="custom">
          </el-table-column>
          <el-table-column label="不可用" align="center" prop="unavailable_inventory_num" sortable="custom">
          </el-table-column>
          <el-table-column label="标记发货" prop="wait_receive_num" align="center" sortable="custom">
          </el-table-column>
          <el-table-column label="真实在途" prop="real_on_way_count" align="center" sortable="custom">
          </el-table-column>
          <el-table-column label="疑似丢货" prop="may_lost_on_way_count" align="center" sortable="custom">
          </el-table-column>
          <el-table-column label="待发(量)" prop="history.wait_delivery_inventory_num" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="发货单列表" align="center" prop="in_fht_count" sortable="custom">
            <div slot-scope="{row}">
              <el-tag size="mini" type="primary">{{ row.in_fht_count }}</el-tag>
              <div v-if="row.in_fht_count">
                <el-button size="mini" type="primary" @click="openFhdlb([row.id])">
                  查看
                </el-button>
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <el-table-column label="销量系数" align="center">
            <el-table-column label="7系" prop="history.seven_day_coef" sortable="custom" sort-by="today"
                             align="center">
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
            <el-table-column label="30系" prop="history.thirty_day_coef" sortable="custom" sort-by="today"
                             align="center">
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
            <el-table-column label="90系" prop="history.ninety_day_coef" sortable="custom" sort-by="today"
                             align="center">
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
            <el-table-column label="图" sortable="custom" sort-by="today" align="center" width="300px">
              <div slot-scope="{row}">
                <Daily :list="row.daily_list" :field_names="['单量']" :fields="['count']"></Daily>
              </div>
            </el-table-column>
            <el-table-column label="今" prop="history.today" sortable="custom" sort-by="history.today"
                             align="center">
            </el-table-column>
            <el-table-column label="差" prop="history.two_day_diff" sortable="custom"
                             sort-by="history.two_day_diff" align="center">
            </el-table-column>
            <el-table-column label="昨" prop="history.two_day" sortable="custom" sort-by="history.two_day"
                             align="center">
            </el-table-column>
            <el-table-column label="差" prop="history.three_day_diff" sortable="custom"
                             sort-by="history.three_day_diff" align="center">
            </el-table-column>
            <el-table-column label="前" prop="history.three_day" sortable="custom"
                             sort-by="history.three_day" align="center">
            </el-table-column>
            <el-table-column label="7" prop="history.seven_day" sortable="custom"
                             sort-by="history.seven_day" align="center">
            </el-table-column>
            <el-table-column label="周差" prop="history.last_week_diff" sortable="custom"
                             sort-by="history.last_week_diff" align="center">
            </el-table-column>
            <el-table-column label="30" prop="history.thirty_day" sortable="custom" sort-by="today"
                             align="center">
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
    <TemuDlgCountryDaily :id="country_daily.id" :visible="country_daily.visible"
                         @close="country_daily.visible=false"></TemuDlgCountryDaily>
    <TemuDlgCost :id="cost.id" :visible="cost.visible" @close="cost.visible=false"></TemuDlgCost>
    <TemuDlgImageReview :id="imageReview.id" :visible="imageReview.visible"
                        @close="imageReview.visible=false"></TemuDlgImageReview>
    <TemuDlgDxmGoods :id="dxmGoods.id" :visible="dxmGoods.visible" @close="dxmGoods.visible=false"></TemuDlgDxmGoods>
    <FDlgUploadBarcode :is_create="toUpload.is_create" :id="toUpload.id" :pdf_url="toUpload.pdf_url"
                       :visible="toUpload.visible" @close="toUpload.visible=false"></FDlgUploadBarcode>
    <TemuDlgFixInventory :sku="fixInventory.sku" :old_left_count="fixInventory.old_left_count"
                         :visible="fixInventory.visible" @close="closeFixInventoryDlg"></TemuDlgFixInventory>
    <TemuDlgCustomize :account_id="dlgCustomize.account_id" :id="dlgCustomize.id"
                      :sku_ext_code="dlgCustomize.sku_ext_code" :visible="dlgCustomize.visible"
                      @close="closeCustomizeDlg"></TemuDlgCustomize>
    <TemuDlgReview :sku_id="review.id" :score="review.score" :visible="review.visible" @close="review.visible=false"
                   v-if="review.visible"></TemuDlgReview>

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
    <TemuDlgStockBatch :account-options="accountOptions" :ids="[stock.id]" :sku_ids="stock.sku_id ? [stock.sku_id] : []"
                       :visible="stock.visible" @close="stock.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :dxm_sku="stockBySku.sku" :visible="stockBySku.visible"
                       @close="stockBySku.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :ids="stockBatch.ids" :visible="stockBatch.visible"
                       @close="stockBatch.visible=false"></TemuDlgStockBatch>
    <TemuDlgCert :id="cert.id" :visible="cert.visible" @close="cert.visible=false"></TemuDlgCert>
    <TemuDlgImageEdit :content="image_edit.content" :sku_ext_code="image_edit.sku_code" :visible="image_edit.visible"
                      @close="image_edit.visible=false"></TemuDlgImageEdit>
    <TemuDlgImageEditV2 :ids="image_edit_v2.ids" :visible="image_edit_v2.visible"
                        @close="image_edit_v2.visible=false"></TemuDlgImageEditV2>
    <TemuDlgBatchModifySkuCode :visible="batchModifySkuCodeDlg.visible" @close="batchModifySkuCodeDlg.visible=false"
                               @update="getTableData"></TemuDlgBatchModifySkuCode>
    <TemuDlgBatchAdjustPrice :rows="batchAdjustPriceDlg.rows" :visible="batchAdjustPriceDlg.visible"
                             @close="batchAdjustPriceDlg.visible=false"
                             @update="getTableData"></TemuDlgBatchAdjustPrice>
    <TemuDlgDownloadImages :ids="dlgDownloadImages.ids" :visible="dlgDownloadImages.visible"
                           @close="dlgDownloadImages.visible=false"></TemuDlgDownloadImages>
    <TemuDlgChangeMinStock :items="dlgChangeMinStockRows.list" :visible="dlgChangeMinStockRows.visible"
                           @close="dlgChangeMinStockRows.visible=false" @suc="getTableData"></TemuDlgChangeMinStock>
    <TemuDlgSimpleProductUpload :list="uploadDlg.array" :visible="uploadDlg.visible" @close="uploadDlg.visible=false"
                                @suc="getTableData"></TemuDlgSimpleProductUpload>
    <TemuDlgActivityProducts :ids="dlgActivityProduct.ids" :visible="dlgActivityProduct.visible"
                             @close="dlgActivityProduct.visible=false" @suc="getTableData"></TemuDlgActivityProducts>
    <TemuDlgActivityAppliedList :spu_ids="dlgActivityAppliedProduct.ids" :visible="dlgActivityAppliedProduct.visible"
                                @close="dlgActivityAppliedProduct.visible=false" @suc="getTableData"
                                v-if="dlgActivityAppliedProduct.visible"></TemuDlgActivityAppliedList>
    <TemuDlgCouponApply :ids="dlgBatchCreateCoupon.ids" :visible="dlgBatchCreateCoupon.visible"
                        @close="dlgBatchCreateCoupon.visible=false" @suc="getTableData"></TemuDlgCouponApply>
    <DlgProductCreate :id="dlgProductCreate.id" :visible="dlgProductCreate.visible"
                      @close="dlgProductCreate.visible=false"></DlgProductCreate>
    <TemuDlgOneKeyTransport :ids="dlgOneKeyTransport.ids" :accounts="accountOptions"
                            :visible="dlgOneKeyTransport.visible"
                            @close="dlgOneKeyTransport.visible=false"></TemuDlgOneKeyTransport>
    <EmbedDrawer :visible="embedDrawer.visible" @close="embedDrawer.visible=false" width="80%" :component="embedDrawer.comp" :component-props="embedDrawer.props" :component-events="embedDrawer.events"></EmbedDrawer>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  saleItemBan,
  saleItemDxmInventoryFix,
  saleItemInfo,
  saleItemEditSku,
  saleItemLevelReset,
  itemChangeMinStock,
  itemAddVirtualStock
} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image";
import TemuDlgPlans from "@/view/temu/components/dlg_plans";
import {saleItemFirstOrder, saleItemAddBuyRecord} from "@/api/temu/sale_item";
import {accountList} from "@/api/temu/account";
import {dxmAddToPlan} from "@/api/dxm/plan";
import {dxmSync} from "@/api/dxm/sync";
import {dxmGoodsId} from "@/api/dxm/goods";
import FDlgUploadBarcode from "@/view/sf-factory/components/dlg_upload_barcode.vue";
import TemuDlgFixInventory from "@/view/temu/components/dlg_fix_inventory.vue";
import TemuDlgCustomize from "@/view/temu/components/dlg_customize.vue";
import {itemCountDown} from "@/api/temu/sale_item";
import {tagRemove, tagAdd} from "@/api/temu/tag";
import KdxDlgScanner from "@/view/components/scanner.vue";
import TemuDlgImageEdit from "@/view/temu/sale/components/dlg_image_edit.vue";
import TemuDlgImageReview from "@/view/temu/sale/components/dlg_image_review.vue";
import TemuDlgStockBatch from "@/view/temu/sale/components/dlg_stock_batch.vue";
import {stockSync} from "@/api/temu/stock";
import TemuDlgReview from "@/view/temu/review/dlg_review.vue";
import TemuDlgCert from "@/view/temu/sale/components/dlg_cert.vue";
import TemuDlgCountryDaily from "@/view/temu/sale/components/dlg_country_daily.vue";
import TemuDlgBatchModifySkuCode from "@/view/temu/sale/components/dlg_batch_modify_sku_code.vue";
import {saleDownloadImages} from "@/api/temu/sale";
import TemuDlgDownloadImages from "@/view/temu/sale/components/dlg_download_images.vue";
import {simpleProductCreateBySaleItem} from "@/api/temu/simple_product";
import TemuDlgSimpleProductUpload from "@/view/temu/simple_product/dlg_upload.vue";
import TemuDlgBatchAdjustPrice from "@/view/temu/sale/components/dlg_batch_adjust_price.vue";
import TemuDlgChangeMinStock from "@/view/temu/sale/components/dlg_change_min_stock.vue";
import Daily from "@/view/components/daily.vue";
import TemuDlgCouponApply from "@/view/temu/coupon/components/dlg_coupon_apply.vue";
import TemuDlgActivityProducts from "@/view/temu/activity/components/dlg_activity_products.vue";
import TemuDlgActivityAppliedList from "@/view/temu/activity/components/dlg_activity_applied_list.vue";
import TemuDlgImageEditV2 from "@/view/temu/sale/components/dlg_image_edit_v2.vue";
import StartBrowser from "@/view/temu/components/start_browser.vue";
import DlgProductCreate from "@/view/product/components/dlg_create_product.vue";
import TemuDlgOneKeyTransport from "@/view/temu/product/components/dlg_one_key_transport.vue";
import {variationStockInfoList, variationStockInfoSync} from "@/api/temu/variation_stock_info";
import TemuDlgCost from "@/view/temu/sale/components/dlg_cost.vue";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";
import TemuDeliveryOrderList from "@/view/temu/delivery_order/index.vue";
import TemuDlgDxmGoods from "@/view/temu/sale/components/dlg_dxm_goods.vue";
import {variationExport} from "@/api/temu/variation";
import EmbedDrawer from "@/view/components/embed_drawer.vue";
import FactoryTask from "@/view/sf-factory-v2/task/index.vue";

export default {
  components: {
    FactoryTask,
    EmbedDrawer,
    TemuDlgDxmGoods,
    TemuDlgDaily,
    TemuDeliveryOrderList,
    TemuDlgCost,
    TemuDlgOneKeyTransport,
    DlgProductCreate,
    StartBrowser,
    TemuDlgImageEditV2,
    TemuDlgCouponApply,
    TemuDlgActivityAppliedList,
    TemuDlgActivityProducts,
    Daily,
    TemuDlgChangeMinStock,
    TemuDlgBatchAdjustPrice,
    TemuDlgSimpleProductUpload,
    TemuDlgDownloadImages,
    TemuDlgBatchModifySkuCode,
    TemuDlgImageEdit,
    TemuDlgCountryDaily,
    TemuDlgCert,
    TemuDlgReview,
    TemuDlgStockBatch,
    TemuDlgImageReview,
    KdxDlgScanner,
    TemuDlgFixInventory,
    TemuDlgCustomize,
    FDlgUploadBarcode,
    TemuDlgPlans,
    KdxImage
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
      listApi: variationStockInfoList,
      isMobile: false,

      timeoutId: undefined,

      selectRows: [],
      uploadDlg: {
        array: [],
        visible: false,
      },

      dlgActivityProduct: {
        ids: [],
        visible: false,
      },

      dlgBatchCreateCoupon: {
        ids: [],
        visible: false,
      },

      dlgProductCreate: {
        id: undefined,
        visible: false,
      },

      dlgActivityAppliedProduct: {
        ids: [],
        visible: false,
      },

      editSku: {
        id: undefined,
        sku: undefined,
      },

      cert: {
        id: undefined,
        visible: false,
      },

      image_edit: {
        sku_id: undefined,
        sku_code: undefined,
        visible: false,
      },

      image_edit_v2: {
        spu_ids: [],
        visible: false,
      },

      dlgDownloadImages: {
        ids: [],
        visible: false,
      },

      dlgChangeMinStockRows: {
        list: [],
        visible: false,
      },

      batchModifySkuCodeDlg: {
        visible: false,
      },

      batchAdjustPriceDlg: {
        rows: [],
        visible: false,
      },

      review: {
        id: undefined,
        score: undefined,
        visible: false,
      },

      input: {
        id: undefined,
        is_pub: false,
        value: '',
        tags: [],
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

      country_daily: {
        id: undefined,
        visible: false,
      },

      cost: {
        id: undefined,
        visible: false,
      },

      dlgOneKeyTransport: {
        ids: [],
        visible: false,
      },

      imageReview: {
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

      dlgCustomize: {
        account_id: undefined,
        id: undefined,
        sku_ext_code: undefined,
        visible: false,
      },

      dlgJit: {
        id: undefined,
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

      stockBatch: {
        ids: [],
        visible: false
      },

      scanner: {
        visible: false
      },

      virtual_stock: {
        add: 0,
        min: 0,
        seven_coef: 0,
      },

      accountOptions: [],
      tagOptions: [],
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
      skuCodeOptions: [
        {value: "MZ-", name: "美妆"},
        {value: "YD-", name: "夜灯"},
        {value: "MYD-", name: "木底座夜灯"},
        {value: "HB0%-Regular,HB0%-Box", name: "怀表"},
        {value: "Mirror-%-%", name: "镜子"},
        {value: "Spoon-%-Regular,Spoon-%-Box", name: "勺子"},
        {value: "XBJ-", name: "心形摆件"},
        {value: "XNBJ-", name: "心形2摆件"},
        {value: "JBJ-", name: "九边形摆件"},
        {value: "FBJ-", name: "长方形摆件"},
        {value: "ZBJ-", name: "正方形摆件"},
        {value: "PBJ-", name: "拼图摆件"},
        {value: "PNBJ-", name: "拼图2摆件"},
        {value: "P3BJ-", name: "拼图3摆件"},
        {value: "P4BJ-", name: "拼图4摆件"},
        {value: "P5BJ-", name: "拼图5摆件"},
        {value: "P6BJ-", name: "拼图6摆件"},
        {value: "YGS-", name: "圆形挂饰"},
        {value: "YBGS-", name: "圆玻挂饰"},
        {value: "QB-", name: "钱包1"},
        {value: "QB3-", name: "钱包3"},
        {value: "QB5-", name: "钱包5"},
      ],
      otherCondOptions: [
        {id: 23, name: "未禁售"},
        {id: 24, name: "已禁售"},
        {id: 10, name: "待下首单"},
        {id: 11, name: "已下首单"},
        {id: 72, name: "已加入站点"},
        {id: 13, name: "已下架终止"},
        {id: 70, name: "热销款"},
        {id: 71, name: "非热销款"},
        {id: 73, name: "工厂"},
        {id: 74, name: "非工厂"},
        {id: 14, name: "普通广告"},
        {id: 15, name: "高级广告"},
        {id: 16, name: "无广告"},
        {id: 17, name: "加工商品"},
        {id: 18, name: "今日未采购"},
        {id: 19, name: "今日已采购"},
        {id: 1, name: "待下首单(无发货计划)"},
        {id: 7, name: "待下首单(有发货计划)"},
        {id: 2, name: "已断货"},
        {id: 3, name: "未配对"},
        {id: 31, name: "已配对"},
        {id: 48, name: "图审未过"},
        {id: 49, name: "图审已过"},
        {id: 4, name: "未设置成本"},
        {id: 5, name: "未出单有仓内库存"},
        {id: 6, name: "库存可售天数>0"},
        {id: 20, name: "建议备货量>0"},
        {id: 34, name: "建议备货量=0"},
        {id: 21, name: "小秘剩余>0"},
        {id: 22, name: "小秘总剩余>0"},
        {id: 58, name: "小秘总剩余=0"},
        {id: 59, name: "今日必发"},
        {id: 60, name: "今日非必发"},
        {id: 61, name: "建议采购量>0"},
        {id: 52, name: "JIT"},
        {id: 53, name: "非JIT"},
        {id: 25, name: "待发件为0"},
        {id: 33, name: "待发件>0"},
        {id: 26, name: "总发出为0"},
        {id: 54, name: "总发出>0"},
        {id: 27, name: "仓内可售天数>0"},
        {id: 32, name: "仓内可售天数<=4天"},
        {id: 55, name: "仓内可售天数<=8天"},
        {id: 56, name: "仓内可售天数<=12天"},
        {id: 57, name: "在途>0"},
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
        {id: 103, name: "1星率高于3%"},
        {id: 104, name: "1星率高于4%"},
        {id: 105, name: "1星率高于5%"},
        {id: 106, name: "1星率高于6%"},
        {id: 107, name: "1星率高于7%"},
        {id: 108, name: "1星率高于8%"},
        {id: 109, name: "1星率高于9%"},
        {id: 110, name: "近15天1星率高于全部1星率"},
        {id: 111, name: "近15天1星率低于全部1星率"},
        {id: 112, name: "待上传资质"},
        {id: 113, name: "已上传资质"},
        {id: 114, name: "上传资质失败"},
        {id: 115, name: "上传资质成功"},
        {id: 116, name: "美国需要资质"},
        {id: 117, name: "加拿大需要资质"},
        {id: 118, name: "英国需要资质"},
        {id: 119, name: "法国需要资质"},
        {id: 120, name: "德国需要资质"},
      ],

      embedDrawer: {
        comp: undefined,
        props: {},
        events: {},
        visible: false,
      }
    }
  },
  computed: {
    changeMinStockRows() {
      return this.selectRows.filter((item) => {
        return item.sale && item.sale.purchase_stock_type === 1
      })
    },
    hasActivityCanApplySelectRows() {
      return this.selectRows.filter((item) => {
        return item.history && item.history.has_activity_can_apply
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
    async onSync() {
      let resp = await variationStockInfoSync()
      if (resp.code) {
        return
      }
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
    openCountryDaily(id) {
      this.country_daily.id = id
      this.country_daily.visible = true
    },
    openCost(id) {
      this.cost.id = id
      this.cost.visible = true
    },
    openImageReview(row) {
      this.imageReview.id = row.sale_id
      this.imageReview.visible = true
    },
    openImageEdit(row) {
      this.image_edit.content = String(row.id)
      this.image_edit.sku_code = row.sku_ext_code
      this.image_edit.visible = true
    },
    async levelReset(id) {
      let resp = await saleItemLevelReset({id: id})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.getTableData() // 同步数据
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
      this.$message(`该产品为: ${this.levelName(item)}，请注意采购!`)
      this.addPlan.item_id = item.id
      let multi = 1
      if (item.dxm_goods_sku && item.dxm_goods_sku.count) {
        multi = item.dxm_goods_sku.count
      }
      this.addPlan.multi = multi
      this.addPlan.count = Math.max(1, item.history.custom_real_advice_quantity) // 最少采购一个
      this.addPlan.sku = item.dxm_goods_sku.sku
      this.addPlan.visible = true
    },
    async oneKeyTransport(rows) {
      this.dlgOneKeyTransport.ids = [...new Set(rows.map((row) => {
        return row.sale_id
      }))]
      this.dlgOneKeyTransport.visible = true
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
    changeSearchCond(cond, content) {
      switch (cond) {
        case 1: {
          this.$set(this.searchInfo, "skc_ids", content)
          break
        }
        case 2: {
          this.$set(this.searchInfo, "sku_ids", content)
          break
        }
        case 3: {
          let routeUrl = this.$router.resolve({
            name: "temu_sale_list",
            query: {
              "dxm_sku": content,
            }
          });
          window.open(routeUrl.href, '_blank');
          return
        }
        case 7: {
          this.$set(this.searchInfo, "spu_ids", content)
          break
        }
        case 9: {
          this.$set(this.searchInfo, "label_codes", content)
          break
        }
      }
      this.getTableData()
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
    openCustomize(row) {
      this.dlgCustomize.account_id = row.sale.account_id
      this.dlgCustomize.id = row.sale_id
      this.dlgCustomize.sku_ext_code = row.sku_ext_code
      this.dlgCustomize.visible = true
    },
    openJit(row) {
      this.dlgJit.id = row.sale_id
      this.dlgJit.visible = true
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
    closeCustomizeDlg() {
      this.dlgCustomize.visible = false
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
        traverse_list.push(this.tableData[0].dxm_goods_sku.sku)
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
    async countDown(id, cancel) {
      let data = {id: id, cancel: cancel}
      let resp = await itemCountDown(data)
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    openScannerReturnIdDlg() {
      this.scanner.visible = true
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
        if (item.variation && item.variation.product) {
          ids.push(item.variation.product.product_skc_id)
        }
      })
      this.stockBatch.ids = ids
      this.stockBatch.visible = true
    },
    handleScannerResult(text) {
      this.changeSearchCond(9, text)
      this.scanner.visible = false
      this.getTableData()
    },

    async handleRemoveTag(id) {
      // 请求删除
      let resp = await tagRemove({id: id})
      if (resp.code) {
        return
      }

      this.$message("删除成功")
      this.getTableData()
    },
    showInput(row) {
      this.input.id = row.id
      this.input.tags = row.tags
      this.input.visible = true;
      this.$nextTick(() => {
        this.$refs[`tagConfirm_${row.id}`].$refs.input.focus();
      });
    },

    async handleInputConfirm() {
      let inputValue = this.input.value;
      if (inputValue) {
        // 请求
        let existList = this.input.tags.filter((item) => {
          if (this.input.is_pub) {
            return item.content === inputValue
          } else {
            return item.user_id && item.content === inputValue
          }
        })
        if (existList && existList.length) {
          this.$message.error("已经存在，请不要再添加")
          return
        }

        let resp = await tagAdd({item_id: this.input.id, content: inputValue, is_pub: this.input.is_pub})
        if (resp.code) {
          return
        }

        this.$message("添加成功")
        this.getTableData()
      }
      this.input.id = undefined;
      this.input.visible = false;
      this.input.value = '';
    },
    closeInput() {
      this.input.id = undefined;
      this.input.visible = false;
      this.input.value = '';
    },
    querySearch(queryString, cb) {
      let results = this.tagOptions.filter((tag) => {
        if (queryString) {
          let contains = tag.content.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
          if (!contains) {
            return false
          }
        }

        if (this.input.tags) {
          for (const t of this.input.tags) {
            if (t.content === tag.content && t.user_id === tag.user_id) {
              return false
            }
          }
        }

        return true
      });
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    querySearchSkuCode(queryString, cb) {
      // let results = this.skuCodeOptions.filter((v) => {
      //   if (queryString) {
      //     let contains = v.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      //     if (!contains) {
      //       return false
      //     }
      //   }
      //
      //   return true
      // });
      // 调用 callback 返回建议列表的数据
      cb(this.skuCodeOptions);
    },
    handleSelect(item) {
      this.input.value = item.content
      this.handleInputConfirm()
    },
    handleSelectSkuCode(item) {
      if (this.searchInfo.sku_code) {
        this.$set(this.searchInfo, "sku_code", this.searchInfo.sku_code + "," + item.name)
      } else {
        this.$set(this.searchInfo, "sku_code", item.name)
      }
      this.$set(this.searchInfo, "sku_code_type", item.type)
    },
    handleSelectExcludeSkuCode(item) {
      if (this.searchInfo.exclude_sku_code) {
        this.$set(this.searchInfo, "exclude_sku_code", this.searchInfo.exclude_sku_code + "," + item.name)
      } else {
        this.$set(this.searchInfo, "exclude_sku_code", item.name)
      }
      this.$set(this.searchInfo, "exclude_sku_code_type", item.type)
    },
    openReviewDlg(id, score) {
      this.review.id = id
      this.review.score = score
      this.review.visible = true
    },
    jumpReducePriceNotPass(id) {
      let routeUrl = this.$router.resolve({
        name: "follow_feedback_list",
        query: {
          "sku_id": id,
        }
      });
      window.open(routeUrl.href, '_blank');
      return
    },
    jumpPriceComparing(id) {
      let routeUrl = this.$router.resolve({
        name: "temu_price_comparing",
        query: {
          "spu_ids": id,
        }
      });
      window.open(routeUrl.href, '_blank');
      return
    },
    openCertDlg(id) {
      this.cert.id = id
      this.cert.visible = true
    },
    certStatus(item) {
      return `需上传资质: ${item.sale.cert.not_suc_count}`
    },
    handleCommand(command) {
      switch (command) {
        case "onDxmSync": {
          this.onDxmSync()
          return
        }
        case "syncAdvice": {
          this.syncAdvice()
          return
        }
        case "openStockBatch": {
          this.openStockBatch()
          return
        }
        case "openImageEdit": {
          this.image_edit.content = undefined
          this.image_edit.sku_code = undefined
          this.image_edit.visible = true
          return
        }
        case "openImageEditV2": {
          this.image_edit_v2.ids = this.selectRows.map((item) => {
            return item.sale_id
          })
          this.image_edit_v2.visible = true
          return
        }
        case "openBatchModifySkuCode": {
          this.batchModifySkuCodeDlg.visible = true
          return
        }
        case "openBatchAdjustPrice": {
          this.batchAdjustPriceDlg.rows = this.selectRows
          this.batchAdjustPriceDlg.visible = true
          return
        }
        case "downloadImages": {
          this.dlgDownloadImages.ids = this.selectRows.map((item) => {
            return item.sale_id
          })
          this.dlgDownloadImages.visible = true
          return
        }
        case "openChangeMinStock": {
          this.dlgChangeMinStockRows.list = this.changeMinStockRows
          this.dlgChangeMinStockRows.visible = true
          return
        }
        case "createFromSaleItems": {
          this.uploadBySaleItem(this.selectRows)
          return
        }
        case "batchApplyActivity": {
          this.dlgActivityProduct.ids = this.hasActivityCanApplySelectRows.map((item) => {
            return item.sale_id
          })
          this.dlgActivityProduct.visible = true
          return
        }
        case "batchCreateCoupon": {
          this.dlgBatchCreateCoupon.ids = this.selectRows.map((item) => {
            return item.sale_id
          })
          this.dlgBatchCreateCoupon.visible = true
          return
        }
        case "exportSku": {
          this.exportSku(this.selectRows)
          return
        }
        case "oneKeyTransport": {
          this.oneKeyTransport(this.selectRows)
          return
        }
      }
    },
    openCreateCoupon(productId) {
      this.dlgBatchCreateCoupon.ids = [productId]
      this.dlgBatchCreateCoupon.visible = true
    },
    showVirtualStock(row) {
      if (row.virtual_stock) {
        this.virtual_stock.min = row.virtual_stock.min_stock
        this.virtual_stock.seven_coef = row.virtual_stock.seven_coef
      }
    },
    async addStock(row) {
      if (!this.virtual_stock.add) {
        this.$message.error("起码要加1个库存")
        return
      }

      let resp = await itemAddVirtualStock({id: row.id, add: this.virtual_stock.add})
      if (resp.code) {
        return
      }

      this.$message("添加成功")
      this.getTableData()
    },
    async changeMinStock(row) {
      if (this.virtual_stock.min < 0) {
        this.$message.error("最低库存最少要为0")
        return
      }
      if (this.virtual_stock.seven_coef < 0) {
        this.$message.error("7日系数倍数最少要为0")
        return
      }

      let resp = await itemChangeMinStock({
        id: row.id,
        min: this.virtual_stock.min,
        seven_coef: this.virtual_stock.seven_coef
      })
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.getTableData()
    },
    async downloadImages(list) {
      // 需要下载的列表
      let resp = await saleDownloadImages({
        ids: list.map((item) => {
          return item.sale_id
        })
      })
      if (resp.code) {
        return
      }

      window.open(resp.data, "_BLANK")
      this.$message("生成成功")
    },
    createProduct(row) {
      this.dlgProductCreate.id = row.sale_id
      this.dlgProductCreate.visible = true
    },
    async uploadBySaleItem(items) {
      let ids = items.map((item) => {
        return item.id
      })
      let resp = await simpleProductCreateBySaleItem({ids: ids})
      if (resp.code) {
        return
      }
      this.uploadDlg.array = resp.data
      this.uploadDlg.visible = true
    },
    async exportSku(items) {
      let ids = items.map((item) => {
        return item.id
      })
      let resp = await variationExport({ids: ids})
      if (resp.code) {
        return
      }
      this.$message("导出成功，服务器只保留1天")
      window.open(resp.data, "_blank")
    },
    async openActivityProductList(id) {
      this.dlgActivityProduct.ids = [id]
      this.dlgActivityProduct.visible = true
    },
    async openActivityAppliedProductList(ids) {
      this.dlgActivityAppliedProduct.ids = ids
      this.dlgActivityAppliedProduct.visible = true
    },
    skcReview(row) {
      if (row.sale && row.sale.review) {
        return `${row.sale.review.count}(${row.sale.review.score.toFixed(2)})`
      } else if (row.review_count) {
        return `${row.review_count}(${row.review_score.toFixed(2)})`
      } else {
        return ""
      }
    },
    skuReview(row) {
      if (row.review) {
        return `${row.review.count}(${row.review.score.toFixed(2)})`
      } else if (row.history && row.history.review_count) {
        return `${row.history.review_count}(${row.history.review_score.toFixed(2)})`
      } else {
        return ""
      }
    },
    openFhdlb(sku_ids) {
      this.embedDrawer.comp = TemuDeliveryOrderList
      this.embedDrawer.props = { sku_ids: sku_ids }
      this.embedDrawer.events = {}
      this.embedDrawer.visible = true
    },
    openFactory(sku_ids, status) {
      this.embedDrawer.comp = FactoryTask
      this.embedDrawer.props = { sku_ids: sku_ids, status: status }
      this.embedDrawer.events = {}
      this.embedDrawer.visible = true
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "history.seven_day_coef") {
          const values = data ? data.map(item => {
            return item.history ? item.history.seven_day_coef : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else if (column.property === "history.thirty_day_coef") {
          const values = data ? data.map(item => {
            return item.history ? item.history.thirty_day_coef : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else if (column.property === "history.ninety_day_coef") {
          const values = data ? data.map(item => {
            return item.history ? item.history.ninety_day_coef : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(2)
        } else if (column.property === "history.today") {
          const values = data ? data.map(item => {
            return item.history ? item.history.today : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.two_day_diff") {
          const values = data ? data.map(item => {
            return item.history ? item.history.two_day_diff : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.two_day") {
          const values = data ? data.map(item => {
            return item.history ? item.history.two_day : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.three_day_diff") {
          const values = data ? data.map(item => {
            return item.history ? item.history.three_day_diff : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.three_day") {
          const values = data ? data.map(item => {
            return item.history ? item.history.three_day : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.seven_day") {
          const values = data ? data.map(item => {
            return item.history ? item.history.seven_day : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.thirty_day") {
          const values = data ? data.map(item => {
            return item.history ? item.history.thirty_day : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        } else if (column.property === "history.last_week_diff") {
          const values = data ? data.map(item => {
            return item.history ? item.history.last_week_diff : 0
          }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = sums[index].toFixed(0)
        }
      });

      return sums;
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
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

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