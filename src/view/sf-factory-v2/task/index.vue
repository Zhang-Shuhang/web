<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" filterable :style="{width: '100%'}">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.platform" multiple collapse-tags clearable filterable :style="{width: '100%'}">
                <el-option v-for="(item, index) in platformOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" ref="search_content" v-model="searchInfo.search_content" clearable filterable @keyup.enter.native="onSubmit">
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable :style="{width: '100px'}">
                  <el-option v-for="(item, index) in searchCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="分类" v-model="searchInfo.categories" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="加急状态" v-model="searchInfo.urgent_status" filterable clearable :style="{width: '100%'}">
                <el-option label="" value=""></el-option>
                <el-option label="非加急" :value="1"></el-option>
                <el-option label="加急" :value="2"></el-option>
                <el-option label="履约考核" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="是否必发" v-model="searchInfo.must_send" filterable :style="{width: '100%'}">
                <el-option label="不着急24小时内发出" :value="1"></el-option>
                <el-option label="24小时内必发" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="订单类型" v-model="searchInfo.order_type" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option label="定制" :value="1"></el-option>
                <el-option label="JIT" :value="2"></el-option>
                <el-option label="普通" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="是否自行配送" v-model="searchInfo.self_delivery" filterable clearable :style="{width: '100%'}">
                <el-option label="" value=""></el-option>
                <el-option label="自行配送" :value="1"></el-option>
                <el-option label="非自行配送" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="是否隐藏" v-model="searchInfo.is_hide" filterable clearable :style="{width: '100%'}">
                <el-option label="未隐藏" :value="1"></el-option>
                <el-option label="已隐藏" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="userInfo.group_id">
            <el-col :xs="8" :sm="8" :lg="2" v-if="searchInfo.status === 0">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.sub_warehouse" placeholder="仓库" filterable clearable style="width: 100%">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(item, index) in subWarehouseOptions" :key="index" :label="item.name"
                             :value="item.name">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; margin-left: 30px; color: #8492a6; font-size: 13px">非自配: {{ item.count }} 个 - 自配: {{ item.self_delivery_count }} 个 - {{ item.un_printed_count }} 个自配未打印</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable style="width: 100%">
                  <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-input placeholder="<=该评价" v-model="searchInfo.max_review" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-input placeholder="最大仓内可售天数(前端过滤)" v-model="max_sale_days" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="searchInfo.status === 2">
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-select placeholder="其他条件" v-model="searchInfo.other_cond" filterable clearable :style="{width: '100%'}">
                  <el-option label="" value=""></el-option>
                  <el-option label="任务组部分完成" :value="1"></el-option>
                  <el-option label="任务组全部未完成" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.create_start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="创建开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.create_end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="创建结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="searchInfo.status === 3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="searchInfo.status === 3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="searchInfo.status === 1">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openProduceRecordsDlg">查看打入生产中记录</el-button>
            </el-form-item>
          </el-col>
<!--          <el-col :xs="8" :sm="8" :lg="2" v-if="searchInfo.status === 0">-->
<!--            <el-form-item label-width="0">-->
<!--              <el-upload :action="`/sf-factory-v2/task_group/upload`" :headers="{'x-token':token}" :show-file-list="false"-->
<!--                         accept=".pdf" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">-->
<!--                <el-button size="mini" :style="{width: '100%'}" type="primary">上传Temu箱唛</el-button>-->
<!--              </el-upload>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :xs="8" :sm="8" :lg="2" v-if="userInfo.group_id && searchInfo.status === 0">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="queryCapacity">查看容量</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="userInfo.group_id && searchInfo.status === 0">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateJingDongDlg">创建京东采购单</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="canBatchConfirm.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onConfirm(canBatchConfirm)">加入待生产/生产中</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="canOneKeyUploadBarcodeList.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="oneKeyUploadBarcode(canOneKeyUploadBarcodeList)">批量一键上传条码</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="selectRows.length && searchInfo.status === 0">
            <el-form-item label-width="0">
              <el-button type="danger" :style="{width: '100%'}" @click="onDelete(selectRows)">批量删除</el-button>
            </el-form-item>
          </el-col>
          <template v-if="searchInfo.status === 1">
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintLit.length">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onPrint(canPrintLit)">生成加工单</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canBackLit.length">
              <el-form-item label-width="0">
                <el-button type="danger" size="mini" :style="{width: '100%'}" @click="onBack(canBackLit)">打回待处理</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintGroupPdfLit.length">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onPrintGroupPdf(canPrintGroupPdfLit)">生成任务组箱唛单</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintJit">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onPrintJit(selectRows, 0)">生成Temu平台Jit加工单</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintJit">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onPrintJit(selectRows, 1)">生成TikTok平台Jit加工单</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintJit">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onPrintJit(selectRows, 5)">生成Temu Y2平台Jit加工单</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintJit">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onCompleteJit(selectRows)">标记Jit完成</el-button>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="searchInfo.status === 3">
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-button type="primary" :style="{width: '100%'}" @click="calcStatistics">类目统计</el-button>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="searchInfo.status === 2">
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-button type="primary" :style="{width: '100%'}" @click="onOpenBarcodeUrlDlg">扫码生成条码</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onOpenCompleteDlg">扫码完成订单</el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="8" :sm="8" :lg="2" v-if="canPrintJit">
              <el-form-item label-width="0">
                <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onCompleteJit(selectRows)">标记Jit完成</el-button>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="filterTableData" border height="100%" @sort-change="sortChange" size="mini" show-summary :summary-method="getSummaries"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="平台" prop="platform" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" effect="dark">{{ platformName(row.platform) }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Id" prop="id" align="center">
          <div slot-scope="{row}">
            {{row.id}}
            <template v-if="searchInfo.status <= 0">
              <div v-if="!row.is_hide">
                <el-button size="mini" type="danger" @click="hide(row)">隐藏</el-button>
              </div>
              <div v-else>
                <el-button size="mini" type="warning" @click="hide(row)">显示</el-button>
              </div>
              <div v-if="row.is_jit">
                <el-button size="mini" type="danger" @click="cancelJit(row)">取消jit</el-button>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="物流单号" prop="logistic" align="center" width="220px">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.sub_warehouse_name">{{row.sub_warehouse_name}}</el-tag>
            <div style="font-size: 12px" v-if="row.express_company">{{row.express_company}}</div>
            <el-link size="mini" type="primary" :href="`https://kuaidi100.com/?nu=${row.logistic}`" :underline="false" target="_blank">
              {{ row.logistic }}</el-link>
            <div v-if="row.attach_to_logistic">
              共物流: {{row.attach_to_logistic}}
            </div>

            <div v-if="row.status <= 1">
              <el-button size="mini" type="primary" @click="changeUrgentStatus(row)" v-if="row.urgent_status<=1">{{row.urgent_status ? "取消加急" : "设置加急"}}</el-button>
            </div>
            <div v-if="row.urgent_status === 1">
              <el-tag size="mini" type="primary">加急</el-tag>
            </div>
            <div v-else-if="row.urgent_status === 2">
              <el-tag size="mini" type="danger" effect="dark">履约考核</el-tag>
            </div>

            <div v-if="row.status <= 1">
              <el-button size="mini" :type="row.must_send ? 'danger' : 'primary'" @click="changeMustSend(row)">{{row.must_send ? "取消24小时必发" : `24小时必发`}}</el-button>
            </div>
            <div v-else>
              <el-tag size="mini" :type="row.must_send ? 'danger' : 'primary'">{{row.must_send ? `24小时必发: ${new Date(row.must_send).toLocaleString()}` : "取消24小时必发"}}</el-tag>
            </div>

            <div v-if="row.jj_name">
              <hr>
              <el-button type="primary" size="mini" @click="openJjWindow(row)" plain>打印加急单</el-button>
              <el-button type="primary" size="mini" @click="printGroupXms(row)" plain>打印箱唛</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="上传时间" prop="created_at" align="center">
          <div slot-scope="{row}">
            <div style="font-size: 12px">{{new Date(row.created_at).toLocaleString()}}</div>
          </div>
        </el-table-column>
        <el-table-column label="待生产时间" prop="confirm_time" align="center" sortable="custom">
          <div slot-scope="{row}">
            <div style="font-size: 12px" v-if="row.confirm_time">{{new Date(row.confirm_time).toLocaleString()}}</div>
          </div>
        </el-table-column>
        <el-table-column label="生产中时间" prop="prepare_time" align="center" sortable="custom">
          <div slot-scope="{row}">
            <div style="font-size: 12px" v-if="row.prepare_time">
              {{new Date(row.prepare_time).toLocaleString()}}
              <div v-if="row.prepare_factory">
                <el-tag size="mini" type="primary" effect="dark">{{row.prepare_factory}}</el-tag>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="箱唛Id" prop="xm_id" min-width="200px" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <div>
                <span style="font-size: 12px">
                  {{item.id}}
                </span>
                <el-tag size="small" type="primary" effect="dark">{{item.is_first ? "首" : "返"}}</el-tag>
                <template v-if="item.diagram">
                  <el-tag size="small" type="info" effect="dark" v-if="item.diagram.has">工</el-tag>
                  <el-tag size="small" type="info" effect="dark" v-if="item.diagram.big_count">大: {{ item.diagram.big_count }}</el-tag>
                  <el-tag size="small" type="info" effect="dark" v-if="item.diagram.has_w1">W1</el-tag>
                  <el-tag size="small" type="info" effect="dark" v-if="item.diagram.has_sp">SP</el-tag>
                </template>
                <el-tag size="small" type="primary" effect="dark" style="margin-left: 3px" v-if="item.is_custom">定制</el-tag>
              </div>
              <template v-if="row.platform !== 3 && row.platform !== 5">
                <span style="font-size: 12px" v-if="item.plan_id" @click="openPlanItemsDrawer(item.plan_id)">
                  备货单: {{item.plan_id}}
                </span>
                <template v-if="item.pdf_url">
                  <el-button type="primary" size="mini" @click="openXmWindow(item)" plain>打印箱唛</el-button>
                </template>
                <template v-else>
                  <el-tag type="danger" size="mini" effect="dark">请上传箱唛</el-tag>
                </template>
              </template>
            </div>
            <div class="footer">
              总计装: {{row.express_package_num}}箱
            </div>
          </div>
        </el-table-column>
        <el-table-column label="Skc" prop="skc" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              {{item.skc}}
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="Sku Id" prop="sku_id" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              {{item.sku_id}}
              <div v-if="row.platform === 0 && row.status === 0">
                <el-button type="danger" size="mini" v-if="needUploadBarcodePdf(row, item)" @click="uploadBarcode(row, item)">上传条码</el-button>
              </div>
              <div v-if="codeUrl(row, item)">
                <el-button type="primary" size="mini" @click="openWindow(codeUrl(row, item))" plain>打印条码</el-button>
              </div>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="Sku Code" prop="sku_code" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              {{item.sku_code}}
              <div v-if="item.review">
                <el-tag size="mini" type="success" v-if="item.review >= 4.7">评分: {{item.review.toFixed(2)}}({{item.review_count}})</el-tag>
                <el-tag size="mini" type="primary" v-else-if="item.review >= 4.4">评分: {{item.review.toFixed(2)}}({{item.review_count}})</el-tag>
                <el-tag size="mini" type="warning" effect="dark" v-else-if="item.review >= 4">评分: {{item.review.toFixed(2)}}({{item.review_count}})</el-tag>
                <el-tag size="mini" type="danger" effect="dark" v-else>评分: {{item.review.toFixed(2)}}({{item.review_count}})</el-tag>
              </div>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="层级" align="center" v-if="userInfo.group_id">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.history">
                <el-tag size="mini" type="warning" effect="dark">{{levelName(item)}}</el-tag>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="可售天数" align="center" v-if="userInfo.group_id" min-width="120px">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.history">
                <div>
                  <span style="display:none;">
                    {{realCanSaleDays = item.history.custom_available_sale_days_from_sale_inventory + onWayCoef(item)}}
                  </span>
                  <el-tooltip :content="`仓内可售: ${item.history.custom_available_sale_days_from_sale_inventory.toFixed(2)} 天`" placement="left">
                    <el-tag size="mini" type="danger" effect="dark" v-if="realCanSaleDays <= 4">仓内可售+在途: {{realCanSaleDays.toFixed(2)}}</el-tag>
                    <el-tag size="mini" type="warning" effect="dark" v-else-if="realCanSaleDays <= 8">仓内可售+在途: {{realCanSaleDays.toFixed(2)}}</el-tag>
                    <el-tag size="mini" type="success" v-else>仓内可售+在途: {{realCanSaleDays.toFixed(2)}} 天</el-tag>
                  </el-tooltip>
                </div>
<!--                <div>-->
<!--                  <el-tag size="mini" type="danger" effect="dark" v-if="item.history.custom_available_sale_days_from_inventory <= 4">总可售: {{item.history.custom_available_sale_days_from_inventory.toFixed(2)}}</el-tag>-->
<!--                  <el-tag size="mini" type="warning" effect="dark" v-else-if="item.history.custom_available_sale_days_from_inventory <= 8">总可售: {{item.history.custom_available_sale_days_from_inventory.toFixed(2)}}</el-tag>-->
<!--                  <el-tag size="mini" type="success" v-else>总可售: {{item.history.custom_available_sale_days_from_inventory.toFixed(2)}} 天</el-tag>-->
<!--                </div>-->
              </template>
            </div>
            <div class="footer">
              <template v-if="row.platform === 0">
                <el-tag size="mini" type="danger" effect="dark" v-if="minCanSaleDays(row.list) <= 4">
                  仓内最低可售: {{minCanSaleDays(row.list).toFixed(2)}}
                </el-tag>
                <el-tag size="mini" type="warning" effect="dark" v-else-if="minCanSaleDays(row.list) <= 8">
                  仓内最低可售: {{minCanSaleDays(row.list).toFixed(2)}}
                </el-tag>
                <el-tag size="mini" type="success" v-else>
                  仓内最低可售: {{minCanSaleDays(row.list).toFixed(2)}}
                </el-tag>
              </template>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="加工数据" align="center" v-if="userInfo.group_id" min-width="150px">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.history">
                <div v-if="jgInfo(`待处理`, item, item.not_shipped_count-item.confirm_count-item.prepare_count)">
                  <el-tag size="mini" type="primary">{{jgInfo("待处理", item, item.not_shipped_count-item.confirm_count-item.prepare_count)}}</el-tag>
                </div>
                <div v-if="jgInfo(`待生产`, item, item.confirm_count)">
                  <el-tag size="mini" type="primary">{{jgInfo("待生产", item, item.confirm_count)}}</el-tag>
                </div>
                <div v-if="jgInfo(`生产中`, item, item.prepare_count)">
                  <el-tag size="mini" type="primary">{{jgInfo("生产中", item, item.prepare_count)}}</el-tag>
                </div>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="系数" align="center" v-if="userInfo.group_id">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.history">
                <div>
                  <el-tag size="mini" type="warning">库存: {{(item.history.seven_day_coef * item.history.custom_available_sale_days_from_sale_inventory).toFixed(0)}}</el-tag>
                </div>
                <div>
                  <el-tag size="mini" type="primary" effect="dark">7系: {{item.history.seven_day_coef.toFixed(2)}}</el-tag>
                </div>
                <div>
                  <el-tag size="mini" type="primary" effect="dark">30系: {{item.history.thirty_day_coef.toFixed(2)}}</el-tag>
                </div>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="美区占比" align="center" v-if="userInfo.group_id">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.history">
                <el-tag size="mini" type="danger" effect="dark" v-if="item.history.us_ratio >= 40">{{item.history.us_ratio.toFixed(1)}}%</el-tag>
                <el-tag size="mini" type="warning" v-else-if="item.history.us_ratio >= 30">{{item.history.us_ratio.toFixed(1)}}%</el-tag>
                <el-tag size="mini" type="primary" v-else>{{item.history.us_ratio.toFixed(1)}}%</el-tag>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="查看" align="center" v-if="userInfo.group_id">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.history">
                <el-button type="primary" size="mini" @click="openDaily(item.sku_id)" plain>订单</el-button>
                <el-button type="primary" size="mini" @click="openPlans(item.sku_id)" plain>发货</el-button>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" prop="image" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.image">
                <KdxImage :src="item.image" width="60px" height="60px"></KdxImage>
              </template>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>
        <el-table-column label="数量" prop="count" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <div>
                {{item.count}}
              </div>
              <el-popover placement="left" trigger="click" v-if="row.status === 0">
                <el-input-number size="mini" style="width: 100%" v-model="new_count" :min="1" :precision="0"></el-input-number>
                <el-button size="mini" style="width: 100%" type="primary" @click="changeCount(item)">修改</el-button>
                <el-button slot="reference" size="mini" type="primary" plain>修改</el-button>
              </el-popover>
            </div>
            <div class="footer">
              总计: {{countSum(row.list)}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="分类" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.list" :key="index">
              <template v-if="item.category_id">
                <el-tag size="mini" type="primary">{{categoryName(item.category_id)}}</el-tag>
              </template>
              <template v-else>
                <el-tag size="mini" type="warning">无分类</el-tag>
              </template>
              <V2CompSetGroup :categoryOptions="categoryOptions" :id="item.id" :category_id="item.category_id" @success="onSubmit"></V2CompSetGroup>
            </div>
            <div class="footer"></div>
          </div>
        </el-table-column>

        <el-table-column label="操作" width="120px" align="center">
          <div slot-scope="{row}">
            <div v-if="row.status === 0">
              <div v-if="canOneKeyUploadBarcode(row)">
                <el-button size="mini" style="width: 100%;margin-top: 5px" type="danger" @click="oneKeyUploadBarcode([row])">一键上传条码</el-button>
              </div>
              <el-button size="mini" style="width: 100%;margin-top: 5px" type="primary" @click="onConfirm([row])" v-if="canJoinProduce(row)">加入待生产/生产中</el-button>
              <div>
                <el-button size="mini" style="width: 100%;margin-top: 5px" type="danger" @click="onDelete([row])">删除</el-button>
              </div>
            </div>
            <div v-if="checkCanPrint(row)">
              <el-button size="mini" type="primary" style="width: 100%;margin-top: 5px" @click="onPrint([row])">生成加工单</el-button>
            </div>
            <div v-if="checkCanBack(row)">
              <el-button size="mini" type="danger" style="width: 100%;margin-top: 5px" @click="onBack([row])">打回待处理</el-button>
            </div>
            <div v-if="checkCanPrintGroupPdf(row)">
              <el-button size="mini" type="primary" style="width: 100%;margin-top: 5px" @click="onPrintGroupPdf([row])">生成任务组箱唛单</el-button>
            </div>
            <div class="item-container" v-if="row.status >= 2">
              <div class="item" v-for="(item, index) in row.list" :key="index">
                <el-tag size="mini" type="primary" :style="{width: '100%'}" v-if="item.complete_time">已完成({{new Date(item.complete_time).toLocaleString()}})</el-tag>
                <el-button size="mini" type="primary" :style="{width: '100%'}" @click="onComplete(item)" v-else>标记完成</el-button>
              </div>
              <div class="footer">
                {{completeProgress(row)}}
              </div>
            </div>
            <template v-if="userInfo.group_id > 0 && row.status <= 0 && row.platform === 0 && row.express_package_num===1 && row.express_company !== '自行配送' && !row.self_delivery">
              <div v-if="row.list.length === 1">
                <el-button style="width: 100%; margin-top: 5px" size="mini" type="warning" @click="joinSelfDelivery(row)">加入自行配送</el-button>
              </div>
              <div v-else-if="row.list.length > 1">
                <el-button style="width: 100%; margin-top: 5px" size="mini" type="warning" @click="broke(row)">打散</el-button>
              </div>
            </template>
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

    <FV2DlgUploadBarcode :is_create="toUpload.is_create" :id="toUpload.id" :pdf_url="toUpload.pdf_url" :visible="toUpload.visible" @close="closeToUpload"></FV2DlgUploadBarcode>
    <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
    <TemuDlgPlans :id="plans.id" :visible="plans.visible" @close="plans.visible=false"></TemuDlgPlans>
    <DlgProduceRecords :visible="dlgProduceRecords.visible" @close="dlgProduceRecords.visible=false"></DlgProduceRecords>
    <EmbedDrawer :visible="embedDrawer.visible" @close="embedDrawer.visible=false" width="80%" :component="embedDrawer.comp" :component-props="embedDrawer.props" :component-events="embedDrawer.events"></EmbedDrawer>
    <DlgCreateTaskGroup :platforms="platformOptions" :platform="dlgCreateJingDong.platform" :visible="dlgCreateJingDong.visible" @close="dlgCreateJingDong.visible=false" @update="getTableData"></DlgCreateTaskGroup>

    <el-dialog :visible.sync="barcodeUrlDlg.visible" title="扫码打印条码" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="()=>{barcodeUrlDlg.visible=false}">
      <!-- 自动打印机列表 -->
      <div v-if="barcodeUrlDlg.visible">
        <el-select size="mini" v-model="barcodeUrlDlg.default_name" placeholder="请选择自动打印打印机" filterable clearable style="width: 100%">
          <el-option label="" value=""></el-option>
          <el-option v-for="(item, index) in getPrinterList()" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </div>

      <el-input size="mini" ref="barcodeUrlDlgId" v-model="barcodeUrlDlg.id" placeholder="请输入id" style="width: 100%" clearable @keyup.enter.native="openBarcodeUrl"></el-input>

      <div v-for="(v, index) in barcodeUrlDlg.recent_list" :key="index">
        <el-link :underline="false" target="_blank" :href="v.url">{{v.name}}</el-link>
      </div>

      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="openBarcodeUrl">确认并完成</el-button>
    </el-dialog>

    <el-dialog :visible.sync="completeTaskDlg.visible" title="扫码完成订单" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="()=>{completeTaskDlg.visible=false}">
      <el-input size="mini" ref="completeTaskDlgId" v-model="completeTaskDlg.id" placeholder="请输入id" style="width: 100%" clearable @keyup.enter.native="completeTask"></el-input>
      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="completeTask">确定</el-button>
    </el-dialog>
  </div>

</template>

<script>

import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";

const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();

import infoList from '@/components/mixins/infoList'
import {
  factoryTaskBarcodeUrl,
  factoryTaskChangeCount,
  factoryTaskComplete,
} from "@/api/sf-factory-v2/task";
import KdxImage from "@/components/image/image";
import {mapGetters} from "vuex";
import FV2DlgUploadBarcode from "@/view/sf-factory-v2/components/dlg_upload_barcode.vue";
import V2CompSetGroup from "@/view/sf-factory-v2/components/comp_set_group.vue";
import {
  factoryTaskChangMustSend,
  factoryTaskGroupBack,
  factoryTaskGroupCalcStatistics,
  factoryTaskGroupChangeUrgentStatus, factoryTaskGroupCompleteJit,
  factoryTaskGroupConfirm,
  factoryTaskGroupDelete, factoryTaskGroupHide, factoryTaskGroupJit,
  factoryTaskGroupList,
  factoryTaskGroupPrepare,
  factoryTaskGroupPrint,
  factoryTaskGroupPrintGroup, factoryTaskGroupPrintJit, factoryTaskGroupPrintXms,
  factoryTaskGroupQueryCapacity,
  factoryTaskGroupSyncToCustomize,
  factoryTaskGroupWarehouseList,
} from "@/api/sf-factory-v2/task_group";
import {factoryItemOneKeyGenBarcode} from "@/api/sf-factory-v2/item";
import TemuDlgPlans from "@/view/temu/components/dlg_plans.vue";
import {selfDeliveryAddToList, selfDeliveryBroke} from "@/api/sf-factory-v2/self_delivery";
import {getLodop} from "@/utils/LodopFuncs";
import {categoryList} from "@/api/product/category";
import DlgProduceRecords from "@/view/sf-factory-v2/components/dlg_produce_records.vue";
import TemuPlanItem from "@/view/temu/plan_item/index.vue";
import {factoryDownloadByUrl} from "@/api/sf-factory-v2/download";
import EmbedDrawer from "@/view/components/embed_drawer.vue";
import DlgCreateTaskGroup from "@/view/sf-factory-v2/components/dlg_create_task_group.vue";

export default {
  name: 'FactoryTask',
  components: {
    DlgCreateTaskGroup,
    EmbedDrawer,
    DlgProduceRecords,
    TemuDlgPlans,
    TemuPlanItem,
    TemuDlgDaily,
    V2CompSetGroup,
    FV2DlgUploadBarcode,
    KdxImage
  },
  computed:{
    ...mapGetters("user", ["userInfo", "token", "allowBack", "allowFactoryPlanItem"]),
    canPrintLit() {
      return this.selectRows.filter((item) => {
        return this.checkCanPrint(item)
      })
    },
    canBackLit() {
      return this.selectRows.filter((item) => {
        return this.checkCanBack(item)
      })
    },
    canPrintGroupPdfLit() {
      return this.selectRows.filter((item) => {
        return this.checkCanPrintGroupPdf(item)
      })
    },
    canPrintJit() {
      return this.selectRows.length > 0 && !this.selectRows.find((item) => {
        return item.is_custom || !item.is_jit // 有定制或者非jit的单，就不可以
      })
    },
    canBatchConfirm() {
      return this.selectRows.filter((item) => {
        return item.status === 0 && ((item.platform === 0 && item.is_jit) || item.platform === 3 || (item.platform === 5 && item.is_jit))
      })
    },
    canOneKeyUploadBarcodeList() {
      return this.selectRows.filter((item) => {
        return this.canOneKeyUploadBarcode(item)
      })
    },
    filterTableData() {
      if (!this.min_sale_days && !this.max_sale_days) {
        return this.tableData
      }

      return this.tableData.filter((row) => {
        if (this.min_sale_days) {
          if (this.minCanSaleDays(row.list) < Number(this.min_sale_days)) {
            return false
          }
        }

        if (this.max_sale_days) {
          for (const t of row.list) {
            if (!t.history) {
              continue
            }

            if (t.history.custom_available_sale_days_from_sale_inventory + this.onWayWithoutProduceCoef(t) <= Number(this.max_sale_days)) {
              return true
            }

          }

          return false
        }

        return true
      })
    },
  },
  mixins: [infoList],
  props: {
    sku_ids: {
      type: Array, // 发货单号
    },
    status: {
      type: Number,
    }
  },
  watch: {
    searchInfo: {
      handler() {
        if (!this.initOk) {
          return
        }

        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(()=>{
          this.onSubmit()
        }, 300)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: this.getDataList,

      initOk: false,

      searchCondOptions: [
        {id: 1, name: "Id"},
        {id: 2, name: "箱唛Id"},
        {id: 3, name: "物流单号"},
        {id: 4, name: "Skc Ids"},
        {id: 5, name: "Sku Ids"},
        {id: 6, name: "Sku Codes"},
        {id: 7, name: "收货仓库"},
        {id: 8, name: "WB单号"},
      ],

      categoryOptions: [],
      subWarehouseOptions: [],
      platformOptions: [
        {id: 0, name: "Temu"},
        {id: 1, name: "Tiktok"},
        {id: 2, name: "Shein"},
        {id: 3, name: "外发"},
        {id: 4, name: "亚马逊"},
        {id: 5, name: "Temu Y2"},
        {id: 6, name: "京东"},
      ],
      statusOptions: [],

      selectRows: [],

      min_sale_days: undefined,
      max_sale_days: undefined,

      toUpload: {
        is_create: false,
        pt: undefined,
        id: undefined,
        pdf_url: undefined,
        visible: false,
      },

      embedDrawer: {
        comp: undefined,
        props: {},
        events: {},
        visible: false,
      },

      daily: {
        id: undefined,
        visible: false,
      },

      plans: {
        id: undefined,
        visible: false,
      },

      dlgCreateJingDong: {
        platform: undefined,
        visible: false,
      },

      barcodeUrlDlg: {
        default_name: undefined,
        id: undefined,
        visible: false,
        recent_list: [],
      },

      completeTaskDlg: {
        id: undefined,
        visible: false,
      },

      dlgProduceRecords: {
        visible: false,
      },

      new_count: 1,
      timeoutId: undefined,

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
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
      // this.$refs['search_content'].select()
    },
    openProduceRecordsDlg() {
      this.dlgProduceRecords.visible = true
    },
    getPrinterList() {
      let lodop = getLodop()
      if (!lodop) {
        return [];
      }

      let nameList = []
      for(let i = 0 ; i < lodop.GET_PRINTER_COUNT(); i++){
        const pName = lodop.GET_PRINTER_NAME(i);
        if(pName !== "导出为WPS PDF"){
          nameList.push(pName)
        }
      }
      return nameList
    },
    getDataList(params) {
      this.syncSubWarehouseList()
      return factoryTaskGroupList(params)
    },
    platformName(p) {
      let op = this.platformOptions.find((item) => {return item.id === p})
      if (!op) {
        return `未知 ${p}`
      }
      return op.name
    },
    async queryCapacity() {
      let resp = await factoryTaskGroupQueryCapacity()

      if (resp.code) {
        return
      }

      let array = []
      resp.data.forEach((item) => {
        array.push(`${item.name} 待生产+生产中: ${item.count} 个，库容: ${item.limit}`)
      })

      this.$notify({
        title: `库容查询结果: `,
        dangerouslyUseHTMLString: true,
        message: `${array.join("<br>")}`,
        duration: 5000,
        offset: 200
      });
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.getTableData()
      if (res.data) {
        this.$message.error(res.data.join("\n"));
      } else {
        this.$message("上传成功!");
      }
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    openCreateJingDongDlg() {
      this.dlgCreateJingDong.platform = 6
      this.dlgCreateJingDong.visible = true
    },
    openPlanItemsDrawer(planId) {
      if (!this.allowFactoryPlanItem) {
        return
      }

      if (!planId || !planId.startsWith("WB")) {
        return
      }

      this.embedDrawer.props = {plan_ids: [planId]}
      this.embedDrawer.comp = TemuPlanItem
      this.embedDrawer.visible = true
    },
    selectionChange(val) {
      this.selectRows = val

      let ids = []
      let logisticList = []
      this.selectRows.forEach((item) => {
        ids.push(item.id)
        if (item.express_company !== "自行配送" && logisticList.indexOf(item.logistic) < 0) {
          logisticList.push(item.logistic)
        }
      })
      if (ids.length > 0) {
        this.copy(ids.join(" "))
        if (logisticList.length > 0) {
          this.$message(`发货物流是: ${logisticList.join(" ")}`)
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
    uploadBarcode(row, item) {
      this.toUpload.is_create = true
      this.toUpload.pt = row.platform
      switch (row.platform) {
        case 0:
          if (!this.userInfo.temu_upload_barcode_url) {
            this.toUpload.id = item.sku_id
          } else {
            this.toUpload.id = item.id
          }
          break
        case 1:
          this.toUpload.id = item.id
          break
      }
      this.toUpload.pdf_url = ""
      this.toUpload.visible = true
    },
    closeToUpload() {
      this.toUpload.visible=false
      this.getTableData()
    },
    async changeCount(row) {
      let resp = await factoryTaskChangeCount({id: row.id, new_count: this.new_count})
      if (resp.code) {
        return
      }
      this.getTableData()
      this.$message("操作成功")
    },
    canJoinProduce(row) {
      if (row.status !== 0) {
        return false
      }

      // if (row.platform === 0 && !row.is_custom && row.urgent_status) {
      //   let minCanSaleDays = 999
      //   row.list.forEach((item) => {
      //     if (item.history && item.history.custom_available_sale_days_from_sale_inventory + this.onWayWithoutProduceCoef(item) < minCanSaleDays) {
      //       minCanSaleDays = item.history.custom_available_sale_days_from_sale_inventory + this.onWayWithoutProduceCoef(item)
      //     }
      //   })
      //   if (minCanSaleDays >= 9) {
      //     return false
      //   }
      // }

      for (let i = 0; i < row.list.length; i++) {
        let v = row.list[i]

        if (this.needUploadBarcodePdf(row, v)) {
          return false
        }
        if (row.is_custom) {
          if (!row.has_sync_to_customize) {
            return false
          }
          if (!row.jj_name) {
            return false
          }
        }
        switch (row.platform) {
          case 0:
            if (!v.category_id) {
              return false
            }
            if (!v.pdf_url) {
              return false
            }
            continue
          case 6:
            if (!v.category_id) {
              return false
            }
        }
      }
      return true
    },
    checkCanPrint(row) {
      return row.status === 1 && (row.platform === 3 ? row.has_print_pdf : !row.is_jit && !row.is_custom);
    },
    checkCanBack(row) {
      return row.status === 1 && this.allowBack;
    },
    checkCanPrintGroupPdf(row) {
      return row.status === 1 && row.has_pdf
    },
    async onConfirm(list) {
      if (!list || list.length <= 0) {
        return
      }

      // 确认
      let ids = list.map(s=>s.id);
      let resp = await factoryTaskGroupConfirm({ids: ids})
      if (resp.code) {
        return
      }

      this.getTableData()
      this.$message("操作成功")
    },
    async onSyncToCustomize(list) {
      if (!list || list.length <= 0) {
        return
      }

      // 确认
      let ids = list.map(s=>s.id);
      let resp = await factoryTaskGroupSyncToCustomize({ids: ids})
      if (resp.code) {
        return
      }

      this.getTableData()
      this.$message("操作成功")
    },
    onDelete(list) {
      if (!list || list.length <= 0) {
        return
      }

      // 确认
      this.$confirm('请确认是否删除该生产任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let ids = list.map(s=>s.id);
            let resp = await factoryTaskGroupDelete({ids: ids})
            if (resp.code) {
              return
            }

            this.getTableData()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
    },
    onPrint(list) {
      if (!list || list.length <= 0) {
        return
      }

      this.$confirm('请确认是否加入生产中?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 确认
            let ids = list.map(s=>s.id);
            let resp = await factoryTaskGroupPrint({ids: ids})
            if (resp.code) {
              return
            }

            let suffix = resp.data.filepath

            resp = await factoryTaskGroupPrepare({ids: ids, callback_id: resp.data.callback_id})
            if (resp.code) {
              return
            }

            window.open(window.location.origin + "/sf-factory-v2/" + suffix, "_BLANK")

            this.$message("操作成功")
            this.getTableData()
          })
    },
    onBack(list) {
      if (!list || list.length <= 0) {
        return
      }

      this.$confirm('请确认是否打回待处理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 确认
            let ids = list.map(s=>s.id);
            let resp = await factoryTaskGroupBack({ids: ids})
            if (resp.code) {
              return
            }

            this.$message("操作成功")
            this.getTableData()
          })
    },
    onPrintGroupPdf(list) {
      if (!list || list.length <= 0) {
        return
      }

      this.$confirm('请确认是否生成任务组箱唛?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 确认
            let ids = list.map(s=>s.id);
            let resp = await factoryTaskGroupPrintGroup({ids: ids})
            if (resp.code) {
              return
            }

            window.open(window.location.origin + "/sf-factory-v2/" + resp.data, "_BLANK")

            this.$message("操作成功")
            this.getTableData()
          })
    },
    onPrintJit(list, platform) {
      if (!list || list.length <= 0) {
        return
      }

      this.$confirm('请确认是否加入生产中?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 确认
            let ids = list.map(s=>s.id);
            let resp = await factoryTaskGroupPrintJit({ids: ids, platform: platform})
            if (resp.code) {
              return
            }

            window.open(window.location.origin + "/sf-factory-v2/" + resp.data, "_BLANK")

            this.$message("操作成功")
            this.getTableData()
          })
    },
    onCompleteJit(list) {
      if (!list || list.length <= 0) {
        return
      }

      this.$confirm('请确认是否完成jit?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            // 确认
            let ids = list.map(s=>s.id);
            let resp = await factoryTaskGroupCompleteJit({ids: ids})
            if (resp.code) {
              return
            }

            this.$message("操作成功")
            this.getTableData()
          })
    },
    async onComplete(item) {
      let resp = await factoryTaskComplete({id: item.id})
      if (resp.code) {
        return
      }

      this.$message("操作成功")
      this.getTableData()

      this.handleSpeak(resp.data)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "count") {
          const values = data.map(item => {
            let c = 0
            item.list.forEach((v)=>{
              c+= v.count
            })
            return c
          });
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总计: " + sums[index].toFixed(0)
        } else if (column.property === "xm_id") {
          const values = data.map(item => {
            return item.express_package_num
          });
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总计: " + sums[index].toFixed(0) + " 箱"
        }
      });

      return sums;
    },
    async syncCategoryList() {
      let resp = await categoryList()
      if (resp.code) {
        return
      }

      this.categoryOptions = resp.data
    },
    async syncSubWarehouseList() {
      let resp = await factoryTaskGroupWarehouseList()
      if (resp.code) {
        return
      }

      this.subWarehouseOptions = resp.data
    },
    async changeUrgentStatus(row) {
      let newStatus = 1
      if (row.urgent_status) {
        newStatus = 0
      }

      let resp = await factoryTaskGroupChangeUrgentStatus({id: row.id, status: newStatus})
      if (resp.code) {
        return
      }

      this.$message("更新状态成功")
      this.getTableData()
    },
    async changeMustSend(row) {
      let resp = await factoryTaskChangMustSend({id: row.id, must: row.must_send <= 0})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.getTableData()
    },
    broke(row) {
      this.$confirm('非常危险操作，请确定是否打散?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await selfDeliveryBroke({id: row.id})
            if (resp.code) {
              return
            }

            this.$message("打散成功")
            this.getTableData()
          })
    },
    joinSelfDelivery(row) {
      this.$confirm('请确认是否加入自行配送?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await selfDeliveryAddToList({id: row.id})
            if (resp.code) {
              return
            }

            this.$message("加入自行配送成功")
            this.getTableData()
          })
    },
    countSum(list) {
      let count = 0

      list.forEach((item) => {
        count += item.count
      })

      return count
    },
    onOpenCompleteDlg() {
      this.completeTaskDlg.visible = true
      setTimeout(()=>{
        this.$refs['completeTaskDlgId'].select()
      }, 200)
    },
    async completeTask() {
      setTimeout(()=>{this.$refs['completeTaskDlgId'].select()}, 200)

      let resp = await factoryTaskComplete({id: this.completeTaskDlg.id})
      if (resp.code) {
        return
      }
      this.getTableData()
      this.$message("操作完成")
    },
    onOpenBarcodeUrlDlg() {
      this.barcodeUrlDlg.visible = true
      setTimeout(()=>{
        this.$refs['barcodeUrlDlgId'].select()
      }, 200)
    },
    async openBarcodeUrlWithId(id) {
      setTimeout(()=>{this.$refs['barcodeUrlDlgId'].select()}, 200)

      let resp = await factoryTaskBarcodeUrl({id: id})
      if (resp.code) {
        return
      }

      if (this.barcodeUrlDlg.default_name) {
        let LODOP = getLodop();

        let totalCount = resp.data.code_count
        if (totalCount >= 10000) {
          this.$message.error("不支持一次打印超过10000份")
          return
        }

        let pdf = await this.downloadPDF(resp.data.url)
        const printCount = 50
        for (let i = 0; i < 200; i++) {
          LODOP.PRINT_INIT("打印");

          LODOP.SET_PRINTER_INDEX(this.barcodeUrlDlg.default_name);
          LODOP.SET_PRINT_PAGESIZE(resp.data.code_orient,0,0,"");//纸张设置为自定义模式
          LODOP.SET_PRINT_STYLEA(0, "PDFScalMode", 1);
          // if (resp.data.code_width && resp.data.code_height) {
            // LODOP.SET_PRINT_PAGESIZE(resp.data.code_orient, resp.data.code_width, resp.data.code_height, "");
          // }
          LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", pdf);
          if (totalCount <= printCount) {
            LODOP.SET_PRINT_COPIES(totalCount);
          } else {
            LODOP.SET_PRINT_COPIES(printCount);
          }

          // 要么预览，要么打印，只能使用一个
          LODOP.PRINT(); // 打印

          totalCount -= printCount
          if (totalCount <= 0) {
            break
          }
        }
      } else {
        window.open(resp.data.url, "_blank")
      }

      this.barcodeUrlDlg.recent_list.push({name: id, url: resp.data.url})
      if (this.barcodeUrlDlg.recent_list.length > 3) {
        this.barcodeUrlDlg.recent_list.shift()
      }

      this.$message("操作完成")
      this.getTableData()
      this.handleSpeak(resp.data)
    },
    async downloadPDF(url) {
      let resp = await factoryDownloadByUrl({url: url})
      if (resp.code) {
        return
      }
      return resp.data
    },
    // 语音播报的函数
    handleSpeak(data) {
      let text = ""
      if (data.is_all_complete) {
        text = `任务组 ${data.group_id}, 全部完成，物流是 ${data.express_company}，请装箱`
      } else {
        text = `任务组 ${data.group_id}, ${data.count}个任务, 完成${data.complete_count}个`
      }
      this.handleSpeakByText(text)
    },
    handleSpeakByText(text) {
      msg.text = text;     // 文字内容: 小朋友，你是否有很多问号
      msg.lang = "zh-CN";  // 使用的语言:中文
      msg.volume = 2;      // 声音音量：1
      msg.rate = 1;        // 语速：1
      msg.pitch = 1;       // 音高：1
      synth.speak(msg);    // 播放
    },
    async openBarcodeUrl() {
      this.openBarcodeUrlWithId(this.barcodeUrlDlg.id)
    },
    hide(row) {
      if (row.is_jit) {
        this.$message.error("JIT不可以隐藏")
        return
      }
      if (row.is_custom) {
        this.$message.error("定制不可以隐藏")
        return
      }

      this.$confirm('是否确认隐藏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        let resp = await factoryTaskGroupHide({id: row.id})
        if (resp.code) {
          return
        }

        this.getTableData()
      })
    },
    cancelJit(row) {
      if (!row.is_jit) {
        this.$message.error("不是jit，不可以射设置为非jit")
        return
      }

      this.$confirm('是否确认取消JIT，取消后只有管理员才可以恢复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async ()=>{
        let resp = await factoryTaskGroupJit({id: row.id})
        if (resp.code) {
          return
        }

        this.getTableData()
      })
    },
    async calcStatistics() {
      let resp = await factoryTaskGroupCalcStatistics({start_time: this.searchInfo.start_time, end_time: this.searchInfo.end_time})
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank");
      this.$message("导出成功")
    },
    completeProgress(row) {
      let completeCount = 0
      if (row.complete_time) {
        completeCount = row.list.length
      } else {
        row.list.forEach((item) => {
          if (item.complete_time) {
            completeCount++
          }
        })
      }
      return `完成: ${completeCount}/${row.list.length}`
    },
    openWindow(url) {
      window.open(url, "_blank")
    },
    openXmWindow(item) {
      window.open(item.pdf_url, "_BLANK")
    },
    openJjWindow(item) {
      window.open(window.location.origin + "/sf-factory-v2/" + item.jj_name, "_BLANK")
    },
    async printGroupXms(item) {
      // 打印条码
      let resp = await factoryTaskGroupPrintXms({id: item.id})
      if (resp.code) {
        return
      }
      window.open(window.location.origin + "/sf-factory-v2/" + resp.data, "_BLANK")
    },
    needUploadBarcodePdf(row, item) {
      switch (row.platform) {
        case 0:
          if (item.is_custom) {
            return false
          }
          return !item.code
        case 5:
          return false
        case 6:
          return false
      }

      return !item.barcode_pdf_url
    },
    async oneKeyUploadBarcode(rows) {
      let skuIds = []
      for (const row of rows) {
        for (const item of row.list) {
          if (this.needUploadBarcodePdf(row, item)) {
            if (skuIds.indexOf(item.sku_id) >= 0) {
              continue
            }

            skuIds.push(item.sku_id)
          }
        }
      }

      // 生成
      let resp = await factoryItemOneKeyGenBarcode({ids: skuIds})
      if (resp.code) {
        this.$message("创建出错")
        return
      }
      this.$message("创建成功")
      this.getTableData()
    },
    canOneKeyUploadBarcode(row) {
      if (row.platform!==0) {
        return false
      }

      for (const item of row.list) {
        if (!this.needUploadBarcodePdf(row, item)) {
          continue
        }
        return true
      }

      return false
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    openPlans(id) {
      this.plans.id = id
      this.plans.visible = true
    },
    notShipped(item) {
      if (!item.history.seven_day_coef) {
        if (item.count === item.not_shipped_count) {
          return `仅本单没发, 能加${item.not_shipped_count}天库存`
        } else {
          return `${item.not_shipped_count}个没发出, 能加${item.not_shipped_count}天库存`
        }
      } else {
        if (item.count === item.not_shipped_count) {
          return `仅本单没发, 能加${(item.not_shipped_count/item.history.seven_day_coef).toFixed(1)}天库存`
        } else {
          return `${item.not_shipped_count}个没发出, 能加${(item.not_shipped_count/item.history.seven_day_coef).toFixed(1)}天库存`
        }
      }
    },
    countAddDays(item, count) {
      if (item.history.seven_day_coef) {
        return (count/item.history.seven_day_coef).toFixed(2)
      } else {
        return count
      }
    },
    jgInfo(msg, item, count) {
      if (!count) {
        return ""
      }

      return `${msg} 数量: ${count}, 可加: ${this.countAddDays(item, count)} 天`
    },
    onWayCoef(item) {
      let d = item.history.custom_available_sale_days_from_inventory-item.history.custom_available_sale_days_from_sale_inventory - this.countAddDays(item, item.not_shipped_count)

      if (d < 0) {
        d = 0
      }

      return d
    },
    onWayWithoutProduceCoef(item) {
      let d = item.history.custom_available_sale_days_from_inventory-item.history.custom_available_sale_days_from_sale_inventory - this.countAddDays(item, item.not_shipped_count - item.confirm_count - item.prepare_count)

      if (d < 0) {
        d = 0
      }

      return d
    },
    minCanSaleDays(list) {
      let minCanSaleDays = 999
      list.forEach((item) => {
        if (item.history && item.history.custom_available_sale_days_from_sale_inventory + this.onWayCoef(item) < minCanSaleDays) {
          minCanSaleDays = item.history.custom_available_sale_days_from_sale_inventory + this.onWayCoef(item)
        }
      })
      return minCanSaleDays
    },
    levelName(row) {
      if (!row.history) {
        return "新品"
      }

      let op = this.levelOptions.find((item) => {
        return item.id === row.history.level
      })
      if (op) {
        return op.name
      }
      return "新品"
    },
    categoryName(id) {
      let c = this.categoryOptions.find((item) => {
        return item.id === id
      })
      if (!c) {
        return `未知类目: ${id}`
      }
      return c.name
    },
    codeUrl(row, item) {
      if (row.platform===0) {
        return item.code ? item.code.pdf_url : ""
      }
      if (item.barcode_pdf_url) {
        return item.barcode_pdf_url
      }
      if (item.barcode) {
        return item.barcode.url
      }
      return ""
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    if (this.userInfo.group_id) {
      this.pageSize = 100
    } else {
      this.pageSize = 50
    }

    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())
    let createStartTime = new Date(c.getTime() - 50 * 24 * 60 * 60 * 1000)
    this.$set(this.searchInfo, "create_start_time", createStartTime.toLocaleDateString())
    this.$set(this.searchInfo, "create_end_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "order_type", [3])
    this.$set(this.searchInfo, "is_hide", 1)
    this.$set(this.searchInfo, "must_send", 2)

    this.$set(this.searchInfo, "search_cond", 1)

    if (this.sku_ids && this.sku_ids.length > 0) {
      this.$set(this.searchInfo, "search_cond", 5)
      this.$set(this.searchInfo, "search_content", this.sku_ids.join(" "))
    }

    if (this.userInfo.group_id > 0) {
      this.$set(this.searchInfo, "status", 0)
      if (this.status) {
        this.$set(this.searchInfo, "status", this.status)
      }
      this.statusOptions = [
        {id: 0, name: "待处理"},
        {id: 1, name: "待生产"},
        {id: 2, name: "生产中"},
        {id: 3, name: "已完成"},
      ]
    } else {
      this.$set(this.searchInfo, "status", 1)
      if (this.status > 0) {
        this.$set(this.searchInfo, "status", this.status)
      }
      this.statusOptions = [
        {id: 1, name: "待生产"},
        {id: 2, name: "生产中"},
        {id: 3, name: "已完成"},
      ]
    }

    this.syncCategoryList()
    this.syncSubWarehouseList()

    this.getTableData()

    this.initOk = true
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 70px;
    padding: 0px;
    font-size: 12px;
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    height: 24px;
    font-weight: bold;
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

::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}

</style>