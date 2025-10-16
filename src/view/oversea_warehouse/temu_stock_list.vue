<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="货号, 空格分隔，带空格是精确查找，不带是模糊查找" v-model="searchInfo.sku_code" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu/Skc列表" v-model="searchInfo.skc_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否工厂" v-model="searchInfo.is_factory" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="工厂" :value="1"></el-option>
                <el-option label="非工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="半托/Y2" v-model="searchInfo.has_semi" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="仅半托" :value="1"></el-option>
                <el-option label="仅Y2" :value="2"></el-option>
                <el-option label="半托+Y2" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="预售" v-model="searchInfo.has_enable_pre_sale" filterable clearable style="width: 100%">
                <el-option label="已开启预售" :value="1"></el-option>
                <el-option label="已关闭预售" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小数量" v-model.number="searchInfo.min_count" style="width: 100%" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大数量" v-model.number="searchInfo.max_count" style="width: 100%" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小可售天数" v-model.number="searchInfo.min_available_days" style="width: 100%" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大可售天数" v-model.number="searchInfo.max_available_days" style="width: 100%" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="请选择条件" v-model="searchInfo.select_status" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="有库存但是已下架" :value="1"></el-option>
                <el-option label="有库存但是已终止" :value="2"></el-option>
                <el-option label="有销量但是2天内要断货" :value="102"></el-option>
                <el-option label="有销量但是3天内要断货" :value="103"></el-option>
                <el-option label="10天内会断货" :value="110"></el-option>
                <el-option label="15天内会断货" :value="115"></el-option>
                <el-option label="20天内会断货" :value="120"></el-option>
                <el-option label="存在待创建首单" :value="220"></el-option>
                <el-option label="存在已创建首单" :value="221"></el-option>
                <el-option label="有设置自动库存" :value="300"></el-option>
                <el-option label="未设置自动库存" :value="301"></el-option>
                <el-option label="疑似库存有问题" :value="400"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否禁售" v-model="searchInfo.is_ban" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="已禁售" :value="1"></el-option>
                <el-option label="未禁售" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否清仓" v-model="searchInfo.is_clear" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="已清仓" :value="1"></el-option>
                <el-option label="未清仓" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否库存+在途为0" v-model="searchInfo.is_stock_zero" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="库存非0" :value="1"></el-option>
                <el-option label="库存为0" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSyncStock">同步最新库存</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="openBeiHuoDlg([])">查看备货列表</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button type="primary" size="mini" style="width: 100%" @click="opelDlgStockChanged(undefined)">
              系统收货记录
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="onExport">导出</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2" v-if="selectRows.length">
            <el-button size="mini" type="danger" style="width: 100%" @click="clear(selectRows)">批量清仓/解除</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-switch style="height: 24px; line-height: 22px" v-model="searchInfo.show_estimate" active-text="显示预估" inactive-text="不显示" @change="()=>{getTableData()}"></el-switch>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="true"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column type="expand" v-if="searchInfo.show_estimate" fixed>
          <template slot-scope="{row}">
            <div style="margin: 0 10px 40px 10px">
              <StockEstimated :list="row.estimates"></StockEstimated>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="货号" align="center" prop="id" sortable="custom" fixed>
          <div slot-scope="{row}">
            {{row.id}}
            <div>
              <el-tag size="mini" type="primary" effect="dark" v-if="row.has_semi">半</el-tag>
              <el-tag size="mini" type="danger" effect="dark" v-if="row.has_y2">Y2</el-tag>
              <el-tag size="mini" type="danger" effect="dark" v-if="row.pre_sale_count > 0">预售</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center" fixed>
          <div slot-scope="{row}">
            <KdxImage :src="row.image.url" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
<!--        <el-table-column label="库存" align="center">-->
          <el-table-column label="海外库存" align="center">
            <el-table-column label="总" align="center" prop="total_count" sortable="custom">
            </el-table-column>
            <el-table-column label="剩余" align="center" prop="count" sortable="custom">
            </el-table-column>
          </el-table-column>
<!--          <el-table-column label="自发" align="center">-->
<!--            <el-table-column label="总" align="center" prop="total_self_count" sortable="custom">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="剩余" align="center" prop="self_count" sortable="custom">-->
<!--            </el-table-column>-->
<!--          </el-table-column>-->
<!--        </el-table-column>-->
        <el-table-column label="在途库存" align="center">
          <el-table-column label="空运" align="center" prop="on_way_airfreight_count" sortable="custom">
          </el-table-column>
          <el-table-column label="海运" align="center" prop="on_way_ship_count" sortable="custom">
          </el-table-column>
        </el-table-column>
        <el-table-column label="产品占用库存" align="center" prop="product_occupy_count" sortable="custom">
        </el-table-column>
        <el-table-column label="超出了" align="center" prop="over_count" sortable="custom">
          <div slot-scope="{row}">
            <el-tag size="mini" :type="row.over_count ? 'danger' : 'primary'">{{row.over_count ? "超出" : "未超出"}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="今日" align="center" prop="today" sortable="custom">
        </el-table-column>
        <el-table-column label="昨日" align="center" prop="two_day" sortable="custom">
        </el-table-column>
        <el-table-column label="前日" align="center" prop="three_day" sortable="custom">
        </el-table-column>
        <el-table-column label="7系" align="center" prop="seven_day_coef" sortable="custom">
          <div slot-scope="{row}">
            {{row.seven_day_coef.toFixed(2)}}
          </div>
        </el-table-column>
        <el-table-column label="30系" align="center" prop="thirty_day_coef" sortable="custom">
          <div slot-scope="{row}">
            {{row.thirty_day_coef.toFixed(2)}}
          </div>
        </el-table-column>
        <el-table-column label="可售天数" align="center">
          <el-table-column label="剩余库存" align="center" prop="stock_available_days" sortable="custom">
            <div slot-scope="{row}">
              {{row.stock_available_days.toFixed(2)}}
            </div>
          </el-table-column>
          <el-table-column label="在途+采购+库存" align="center" prop="available_days" sortable="custom">
            <div slot-scope="{row}">
              {{row.available_days.toFixed(2)}}
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="下一批货物上架" align="center" prop="next_stock_days" min-width="150px" sortable="custom">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" type="primary">距离天数: {{row.next_stock_days.toFixed(2)}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="待发数量" align="center" prop="not_ship_count" sortable="custom">
        </el-table-column>
        <el-table-column label="库存详情" align="center">
          <el-table-column label="仓库" align="center" width="140px">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="warning">{{v.warehouse ? v.warehouse.name : "-"}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="real_stock_count" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="primary" effect="dark">{{v.available_stock}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="在途" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="success" effect="dark">{{v.in_transit_stock}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="销毁中" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="warning" effect="dark" v-if="v.destruction_stock">{{v.destruction_stock}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="占用中" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="success">{{v.reserve_stock}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="建议备货量" align="center">
          <el-table-column label="空运(15天)" align="center" prop="advice_count" sortable="custom">
          </el-table-column>
          <el-table-column label="海运(30天)" align="center" prop="ship_advice_count" sortable="custom">
          </el-table-column>
        </el-table-column>
        <el-table-column label="备货中数量" align="center" prop="bei_huo_count" sortable="custom">
          <div slot-scope="{row}">
            {{row.bei_huo_count}}

            <div v-if="row.bei_huo_count">
              <el-button size="mini" type="warning" @click="confirmBeiHuo(row)"> 确认采购 </el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="采购中数量" align="center" prop="confirm_bei_huo_count" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <div slot-scope="{row}">
            <el-row :gutter="5">
              <el-col :span="24">
                <div>
                  <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.bind_list)" plain>
                    销量{{row.bind_list && row.bind_list.length ? `(绑${row.bind_list.length}个)` : `(未绑)`}}
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button type="warning" size="mini" style="width: 100%" @click="openBeiHuoDlg([row.id])" plain>
                    备货
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12" v-if="row.bind_list.length">
                <div style="margin-top: 5px">
                  <el-button type="primary" size="mini" style="width: 100%" @click="openAllocate(row)" plain>
                    分配
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button type="primary" size="mini" style="width: 100%" @click="opelDlgStockChanged(row.id)" plain>
                    变更记录
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button type="primary" size="mini" style="width: 100%" @click="openList(row.id)" plain>
                    发货记录
                  </el-button>
                </div>
              </el-col>
  <!--            <el-col :span="12">-->
  <!--              <div style="margin-top: 5px">-->
  <!--                <el-button type="primary" size="mini" style="width: 100%" @click="openStockEstimated(row.id)" plain>-->
  <!--                  预估-->
  <!--                </el-button>-->
  <!--              </div>-->
  <!--            </el-col>-->
<!--              <el-col :span="12">-->
<!--                <div style="margin-top: 5px">-->
<!--                  <el-button type="danger" size="mini" style="width: 100%" @click="onFixStock(row.id)" plain>-->
<!--                    修复库存-->
<!--                  </el-button>-->
<!--                </div>-->
<!--              </el-col>-->
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-popover placement="left" trigger="click">
                    <el-input size="mini" style="width: 100%" v-model="image_url" placeholder="请输入图片链接"></el-input>
                    <el-button size="mini" style="width: 100%" type="primary" @click="setStockImage(row)">设置</el-button>
                    <el-button slot="reference" size="mini" type="primary" style="width: 100%">修改图片</el-button>
                  </el-popover>
                </div>
              </el-col>
              <template v-if="!row.setting || !row.setting.no_limit_start_time">
                <el-col :span="12" v-if="row.real_stock_count >= 3">
                  <div style="margin-top: 5px">
                    <el-popover placement="left" trigger="click" @show="initNoLimit(row)">
                      <el-input-number size="mini" :min="0" :max="set_auto_stock.max_no_limit_stock" :precision="0" style="width: 100%" v-model="set_auto_stock.no_limit_stock" placeholder="请输入自动分配的库存"></el-input-number>
                      <el-input-number size="mini" :min="0" :max="100000" :precision="0" style="width: 100%" v-model="set_auto_stock.no_limit_count" placeholder="请输入产品不限制的库存"></el-input-number>
                      <el-input-number size="mini" :min="0" :max="2000" :precision="0" style="width: 100%" v-model="set_auto_stock.no_limit_per_day_count" placeholder="每日最大出单量"></el-input-number>
                      <el-button size="mini" style="width: 100%" type="primary" @click="setNoLimitStart(row)">设置</el-button>
                      <el-button slot="reference" size="mini" type="danger" style="width: 100%">设置自动库存</el-button>
                    </el-popover>
                  </div>
                </el-col>
              </template>
              <el-col :span="12" v-else>
                <div style="margin-top: 5px">
                  <el-popover placement="left" trigger="click">
                    <el-descriptions style="margin-bottom: 10px" title="数据" :column="1" size="mini" border>
                      <el-descriptions-item>
                        <template slot="label">
                          分配的库存
                        </template>
                        {{ row.setting.no_limit_stock }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          产品不限制的库存
                        </template>
                        {{ row.setting.no_limit_count }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          每日最大出单量
                        </template>
                        {{ row.setting.no_limit_per_day_count || "不限制"  }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          开始时间
                        </template>
                        {{new Date(row.setting.no_limit_start_time).toLocaleString()}}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          出单量
                        </template>
                        {{ row.setting.no_limit_sell_count }}
                      </el-descriptions-item>
                      <el-descriptions-item>
                        <template slot="label">
                          出单层级
                        </template>
                        <el-tag size="mini" type="warning">
                          {{ noLimitLevelName(row.setting.no_limit_level) }}
                        </el-tag>
                      </el-descriptions-item>
                    </el-descriptions>
                    <el-button size="mini" style="width: 100%" type="warning" @click="setNoLimitEnd(row)">关闭</el-button>
                    <el-button slot="reference" size="mini" type="danger" style="width: 100%">查看自动库存</el-button>
                  </el-popover>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button size="mini" type="danger" style="width: 100%" v-if="!row.setting || !row.setting.is_ban" @click="ban(row, true)">禁止销售</el-button>
                  <el-button size="mini" type="danger" style="width: 100%" v-else @click="ban(row, false)">允许销售</el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button size="mini" type="danger" style="width: 100%" @click="clear([row])" v-if="!row.setting || !row.setting.is_clear">清仓</el-button>
                  <el-button size="mini" type="primary" style="width: 100%" @click="clear([row])" v-else-if="row.setting && row.setting.is_clear">解除清仓</el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button size="mini" style="width: 100%" type="warning" @click="openActivityAppliedProductList(row)">活动记录</el-button>
                </div>
              </el-col>
            </el-row>
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

    <TemuDlgStockChangedRecord :sku_code="dlgStockChange.sku_code" :is_system="dlgStockChange.is_system" :update="getTableData" :visible="dlgStockChange.visible" @close="dlgStockChange.visible=false"></TemuDlgStockChangedRecord>
    <TemuDlgMultiDaily :sku_ids="daily.sku_ids" :visible="daily.visible" @close="daily.visible=false"></TemuDlgMultiDaily>
    <TemuDlgStockAllocate :id="allocate.id" :sku_ids="allocate.sku_ids" :visible="allocate.visible" @close="allocate.visible=false" @suc="getTableData"></TemuDlgStockAllocate>
    <TemuDlgList :sku_code="dlgList.sku_code" :visible="dlgList.visible" @close="dlgList.visible=false" v-if="dlgList.visible"></TemuDlgList>
    <TemuDlgStockEstimated :id="stockEstimated.id" :visible="stockEstimated.visible" @close="stockEstimated.visible=false" @suc="getTableData"></TemuDlgStockEstimated>
    <TemuDlgStockBeiHuo :ids="beiHuoDlg.ids" :visible="beiHuoDlg.visible" @close="beiHuoDlg.visible=false" @update="getTableData"></TemuDlgStockBeiHuo>
    <TemuDlgActivityAppliedList :spu_ids="dlgActivityAppliedProduct.spu_ids" :sku_ids="dlgActivityAppliedProduct.sku_ids" :visible="dlgActivityAppliedProduct.visible" @close="dlgActivityAppliedProduct.visible=false" @suc="getTableData" v-if="dlgActivityAppliedProduct.visible"></TemuDlgActivityAppliedList>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {
  overseasWarehouseBan, overseasWarehouseClear, overseasWarehouseConfirmBeiHuo,
  overseasWarehouseExportStock, overseasWarehouseFixStock, overseasWarehouseNoLimitEnd, overseasWarehouseNoLimitStart,
  overseasWarehouseSetStockImage,
  overseasWarehouseStockList,
  overseasWarehouseSyncStock
} from "@/api/oversea_warehouse/list";
import TemuDlgStockChangedRecord from "@/view/oversea_warehouse/components/dlg_stock_changed.vue";
import TemuDlgMultiDaily from "@/view/temu/sale/components/dlg_multi_daily.vue";
import TemuDlgStockAllocate from "@/view/oversea_warehouse/components/dlg_stock_allocate.vue";
import TemuDlgList from "@/view/oversea_warehouse/components/dlg_list.vue";
import TemuDlgStockEstimated from "@/view/oversea_warehouse/components/dlg_stock_estimated.vue";
import StockEstimated from "@/view/oversea_warehouse/components/stock_estimated.vue";
import TemuDlgStockBeiHuo from "@/view/oversea_warehouse/components/dlg_stock_bei_huo.vue";
import {mapGetters} from "vuex";
import {accountList} from "@/api/temu/account";
import TemuDlgActivityAppliedList from "@/view/temu/activity/components/dlg_activity_applied_list.vue";

export default {
  components: {
    TemuDlgActivityAppliedList,
    TemuDlgStockBeiHuo,
    StockEstimated,
    TemuDlgStockEstimated,
    TemuDlgList,
    TemuDlgStockAllocate,
    TemuDlgMultiDaily,
    TemuDlgStockChangedRecord,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(()=>{
          this.page = 1
          this.getTableData()
        }, 300)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: overseasWarehouseStockList,

      selectRows: [],

      accountOptions: [],

      timeoutId: undefined,

      dlgStockChange: {
        sku_code: "",
        is_system: false,
        visible: false,
      },

      dlgList: {
        sku_code: "",
        visible: false,
      },

      dlgActivityAppliedProduct: {
        spu_ids: [],
        sku_ids: [],
        visible: false,
      },

      stockEstimated: {
        id: "",
        visible: false,
      },

      beiHuoDlg: {
        ids: [],
        visible: false,
      },

      image_url: undefined,

      set_auto_stock: {
        max_no_limit_stock: 10000,
        no_limit_stock: undefined,
        no_limit_count: undefined,
        no_limit_per_day_count: undefined,
      },

      daily: {
        sku_ids: [],
        visible: false,
      },

      allocate: {
        id: undefined,
        sku_ids: [],
        activity_applied_func: undefined,
        visible: false,
      },
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSyncStock() {
      let resp = await overseasWarehouseSyncStock()
      if (resp.code) {
        return
      }
      this.$message("同步成功")
      this.getTableData()
    },
    async onExport() {
      let resp = await overseasWarehouseExportStock({ids: this.selectRows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }
      this.$message("导出成功，服务器只保留1天")
      window.open(resp.data, "_blank")
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
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    opelDlgStockChanged(skuCode) {
      this.dlgStockChange.sku_code = skuCode
      this.dlgStockChange.is_system = !skuCode
      this.dlgStockChange.visible = true
    },
    openList(skuCode) {
      this.dlgList.sku_code = skuCode
      this.dlgList.visible = true
    },
    openStockEstimated(skuCode) {
      this.stockEstimated.id = skuCode
      this.stockEstimated.visible = true
    },
    openDaily(bind_list) {
      this.daily.sku_ids = bind_list.map((item) => {return item.id})
      this.daily.visible = true
    },
    async confirmBeiHuo(row) {
      let resp = await overseasWarehouseConfirmBeiHuo({ids: [row.id], is_confirm: true, count: row.bei_huo_count})
      if (resp.code) {
        return
      }

      this.$message("确认成功")
      this.getTableData()
    },
    openAllocate(row) {
      this.allocate.id = row.id
      this.allocate.sku_ids = row.bind_list.map((item) => {return item.id})
      this.allocate.visible = true
    },
    onFixStock(id) {
      this.$confirm('请确认是否强制修复库存，请注意在途库存务必入库, 账号未过期，数据有同步', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
            let resp = await overseasWarehouseFixStock({id: id})
            if (resp.code) {
              return
            }

            this.getTableData()
          })
    },
    initNoLimit(row) {
      this.set_auto_stock.max_no_limit_stock = row.real_stock_count
      this.set_auto_stock.no_limit_stock = undefined
      this.set_auto_stock.no_limit_count = undefined
      this.set_auto_stock.no_limit_per_day_count = undefined
    },
    async ban(row, is_ban) {
      let resp = await overseasWarehouseBan({id: row.id, is_ban: is_ban})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async setNoLimitEnd(row) {
      let resp = await overseasWarehouseNoLimitEnd({id: row.id})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async setNoLimitStart(row) {
      if (this.set_auto_stock.no_limit_stock <= 0) {
        this.$message.error("自动分配库存必须>0")
        return
      }
      if (this.set_auto_stock.no_limit_count <= 0) {
        this.$message.error("自动分配不限制库存必须>0")
        return
      }

      let resp = await overseasWarehouseNoLimitStart({id: row.id, no_limit_stock: this.set_auto_stock.no_limit_stock, no_limit_count: this.set_auto_stock.no_limit_count, no_limit_per_day_count: this.set_auto_stock.no_limit_per_day_count})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async setStockImage(row) {
      if (!this.image_url) {
        this.$message.error("请输入图片链接")
        return
      }
      let resp = await overseasWarehouseSetStockImage({id: row.id, url: this.image_url})
      if (resp.code) {
        return
      }
      this.image_url = ""
      this.$message("设置成功")
      this.getTableData()
    },
    openBeiHuoDlg(ids) {
      this.beiHuoDlg.ids = ids
      this.beiHuoDlg.visible = true
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.inner_image = res.data
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    noLimitLevelName(level) {
      switch (level) {
        case 0:
          return "低(0-50%)"
        case 1:
          return "中(超50%)"
        case 2:
          return "高(超75%)"
      }

      return `未知: ${level}`
    },
    async openActivityAppliedProductList(row) {
      this.dlgActivityAppliedProduct.spu_ids = []
      this.dlgActivityAppliedProduct.sku_ids = row.bind_list.map((item) => {return item.id})
      this.dlgActivityAppliedProduct.visible = true
    },
    clear(rows) {
      this.$confirm('请确认是否清仓?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await overseasWarehouseClear({ids: rows.map((row) => {return row.id})})
        if (resp.code) {
          return
        }
        this.getTableData()
      })
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 20
    this.$set(this.searchInfo, "is_ban", 2)
    this.$set(this.searchInfo, "is_stock_zero", 1)
    this.getTableData()

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 25px;
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
  text-overflow:ellipsis;
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
</style>