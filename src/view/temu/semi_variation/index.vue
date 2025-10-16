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
                  <el-option :key="index"
                             :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"
                             v-if="item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_semi" placeholder="请选择半托或者Y2" filterable clearable style="width: 100%">
                <el-option label="半托" :value="1"></el-option>
                <el-option label="Y2" :value="2"></el-option>
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
              <el-input placeholder="Goods Ids，空格分隔" v-model="searchInfo.goods_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.select_status" placeholder="站点状态" multiple collapse-tags filterable
                         clearable
                         style="width: 100%">
                <el-option v-for="(op, index) in selectStatusOptions" :key="index" :label="op.name"
                           :value="op.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="是否限流中" v-model="searchInfo.is_search_limit" clearable filterable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="高价限流" :value="1"></el-option>
                <el-option label="高价限流(日常+活动)" :value="2"></el-option>
                <el-option label="高价限流(日常价)" :value="3"></el-option>
                <el-option label="即将高价限流" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="自动限流处理状态" v-model="searchInfo.auto_handle_search_limit_status" clearable filterable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="库存/价格成功" :value="1"></el-option>
                <el-option label="库存/价格失败" :value="2"></el-option>
                <el-option label="未设置" :value="3"></el-option>
                <el-option label="已设置" :value="4"></el-option>
              </el-select>
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
              <el-input size="mini" v-model="searchInfo.ext_code" clearable placeholder="货号，逗号分隔"
                        @keyup.enter.native="onSubmit">
              </el-input>
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
              <el-select v-model="searchInfo.product_types" placeholder="产品类型" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option label="备货" :value="1"></el-option>
                <el-option label="定制" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.has_stock" placeholder="是否有库存" filterable clearable
                         style="width: 100%">
                <el-option label="有库存" :value="1"></el-option>
                <el-option label="没库存" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.has_set_stock" placeholder="是否有设置库存" filterable clearable
                         style="width: 100%">
                <el-option label="有设置库存" :value="1"></el-option>
                <el-option label="没设置库存" :value="2"></el-option>
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
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-form-item label-width="0">
              <el-dropdown style="width: 100%" @command="handleCommand">
                <el-button type="primary" style="width: 100%">
                  更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="width: 250px">
                  <el-dropdown-item command="onDxmSync">同步店小秘</el-dropdown-item>
                  <el-dropdown-item command="openImageEdit" v-if="selectRows.length">改图</el-dropdown-item>
                  <el-dropdown-item command="openImageEditV2" v-if="selectRows.length">改图V2</el-dropdown-item>
                  <el-dropdown-item command="openBatchModifySkuCode">批量改货号</el-dropdown-item>
                  <el-dropdown-item command="downloadImages">下载图片列表</el-dropdown-item>
                  <el-dropdown-item command="createFromSaleItems" v-if="selectRows.length">批量复制上架
                  </el-dropdown-item>
                  <el-dropdown-item command="batchSync" v-if="selectRows.length">批量同步</el-dropdown-item>
                  <el-dropdown-item command="batchApplyActivity" v-if="hasActivityCanApplySelectRows.length">
                    批量申请活动
                  </el-dropdown-item>
                  <el-dropdown-item command="batchCreateCoupon" v-if="selectRows.length">批量优惠券</el-dropdown-item>
                  <el-dropdown-item command="exportSku" v-if="selectRows.length">导出最近8周数据</el-dropdown-item>
                  <el-dropdown-item command="oneKeyTransport" v-if="selectRows.length">一键迁移</el-dropdown-item>
                  <el-dropdown-item command="exportSelfCompareSearchLimit">导出内部高价限流</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                :default-expand-all="false"
                @selection-change="selectionChange" :summary-method="getSummaries" show-summary>
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="商品信息" width="150" align="center" prop="ext_code" :fixed="!isMobile">
          <div slot-scope="{row}">
            <div v-if="row.product && row.product.account">
              <el-tag size="mini" type="primary">账号: {{ row.product.account.name }}</el-tag>
            </div>
            <div>
              <el-tooltip size="mini" :content="row.product ? row.product.product_name : ''" placement="right">
                <div v-if="row.product && row.product.product_name.length >= 15">
                  {{ row.product.product_name.substring(0, 15) }}...
                </div>
                <div v-else-if="row.product">
                  {{ row.product.product_name }}
                </div>
              </el-tooltip>
            </div>
            <div v-if="row.product">
              <el-tag size="mini" type="primary" @click="copy(row.product.id.toString())">SPU: {{ row.product.id }}
              </el-tag>
            </div>
            <div v-if="row.product">
              <el-tag size="mini" type="primary" @click="copy(row.product.product_skc_id.toString())">SKC:
                {{ row.product.product_skc_id }}
              </el-tag>
            </div>
            <div>
              <el-popover placement="left" v-if="row.volume && row.weight" trigger="hover">
                <el-tag size="mini" style="width: 100%">{{ row.volume.len }}mm x {{ row.volume.width }}mm x
                  {{ row.volume.height }}mm / {{ row.weight.weight }}g
                </el-tag>
                <el-tag size="mini" type="primary" slot="reference" @click="copy(row.id.toString())">SKU: {{ row.id }}
                </el-tag>
              </el-popover>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="startEditSku(row.id, row.ext_code)"
                      v-if="editSku.id!==row.id">货号: {{ row.ext_code }}
              </el-tag>
              <template v-else>
                <el-input :ref="row.id" v-model="editSku.sku" @keyup.enter.native="updateSku" size="mini">
                </el-input>
                <el-row :gutter="5">
                  <el-col :span="12">
                    <el-button size="mini" style="width: 100%" type="warning" @click="updateSku"
                               icon="el-icon-success"></el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="mini" style="width: 100%" type="primary" @click="endEditSku"
                               icon="el-icon-error"></el-button>
                  </el-col>
                </el-row>
              </template>
            </div>
            <div>
              <el-tag size="mini" type="danger" effect="dark">售价: {{ row.currency_type }}
                {{ row.supplier_price / 100 }}
              </el-tag>
              <el-tag size="mini" type="danger" v-if="row.daily_history && row.daily_history.price">成本:
                ¥{{ row.daily_history.price.toFixed(2) }}
              </el-tag>
            </div>
            <div v-if="row.select">
              <el-tag size="mini" type="primary">买手: {{ row.select.buyer_name }}</el-tag>
            </div>
            <div v-if="row.product && row.product.leaf_cat">
              <el-tag size="mini" type="primary" effect="dark">类目: {{ row.product.leaf_cat.name }}</el-tag>
            </div>

            <el-tag size="mini" type="primary" v-if="row.select && row.select.added_to_site_time">
              加入站点: {{ new Date(row.select.added_to_site_time).toLocaleString() }}
            </el-tag>
            <div v-else>
              创建: {{ new Date(row.product.created_at).toLocaleDateString() }}
            </div>
            <div v-if="skuReview(row)">
              <el-tag size="mini" type="primary" v-if="row.daily_history && row.daily_history.review_count">
                Sku评分: {{ skuReview(row) }})
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="warning" v-if="row.product && row.product.purchase_stock_type===3">定制</el-tag>
              <el-tag size="mini" type="danger" effect="dark" v-if="row.is_y2">Y2</el-tag>
              <el-tag size="mini" type="primary" effect="dark" v-else>半</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center" :fixed="!isMobile">
          <div slot-scope="{row}">
            <KdxImage :src="row.thumb_url"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="220" align="center" :fixed="!isMobile">
          <div slot-scope="{row}">
            <div v-if="row.select">
              <el-tag size="mini" :type="selectStatusType(row.select.status)" effect="dark">
                {{ selectStatusName(row.select.status) }}
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="warning" effect="dark">{{ levelName(row) }}</el-tag>
            </div>
            <TemuSearchLimit :variation="row" :open-search-limit-dlg="openSearchLimitDlg"></TemuSearchLimit>
            <el-row>
              <el-col :span="12">
                <el-link type="primary"
                         :href="`https://www.temu.com/goods.html?goods_id=${row.product.goods_id}&no_cache_id=egv4k`"
                         :underline="false" target="_blank">
                  前端查看
                </el-link>
              </el-col>
              <el-col :span="12">
                <template v-if="row.product && row.product.account">
                  <StartBrowser :id="row.product.account.parent_id" :account_id="row.product.account_id"
                                st="width: 100%"
                                name="申请改图"
                                :open_url="`https://seller.kuajingmaihuo.com/goods/product-images?productId=${row.product.id}&from=selfTask`"></StartBrowser>
                </template>
              </el-col>
              <el-col :span="12" v-if="row.product">
                <el-button type="primary" size="mini" style="width: 100%" @click="openImageReview(row)">图审</el-button>
              </el-col>
              <el-col :span="12" v-if="row.product">
                <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">改图</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="batchSync([row])">同步</el-button>
              </el-col>
              <el-col :span="12">
                <el-button style="width: 100%" size="mini" type="primary" @click="openCreateCoupon(row.product_id)">
                  创建优惠券
                </el-button>
              </el-col>
              <el-col :span="12">
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
              <el-col :span="12">
                <div v-if="row.ban_produce">
                  <el-button size="mini" style="width: 100%" type="warning" @click="banProduce([row.id], false)">取消禁产</el-button>
                </div>
                <div v-else>
                  <el-button size="mini" style="width: 100%" type="primary" @click="banProduce([row.id], true)">设置禁产</el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="danger" @click="createProduct(row)">创建产品
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="warning"
                           @click="openActivityProductList(row.product_id)">
                  活动报名
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="warning"
                           @click="openActivityAppliedProductList([row.product_id])">活动记录
                </el-button>
              </el-col>
            </el-row>
            <div>
            </div>
            <!--                        <div v-if="row.dxm_goods_sku">-->
            <!--                            <el-button size="mini" type="primary" style="width: 100%" @click="genItemInfo(row.id)" plain>生成产品信息</el-button>-->
            <!--                        </div>-->
            <div v-if="row.daily_history && row.daily_history.review_count">
              <div style="width: 20%; display: inline-block">
                <el-tooltip :content="`1星(近15天: ${(row.daily_history.fifteen_day_one_star_coef*100).toFixed(1)}%)`"
                            placement="top">
                  <el-tag size="mini"
                          :type="row.daily_history.fifteen_day_one_star_coef > row.daily_history.one_star_coef ? 'danger' : 'primary'"
                          :effect="row.daily_history.fifteen_day_one_star_coef > row.daily_history.one_star_coef ? 'dark' : 'light'"
                          style="width: 100%" @click="openReviewDlg(row.id, 1)">
                    {{ (row.daily_history.one_star_coef * 100).toFixed(1) }}%
                  </el-tag>
                </el-tooltip>
              </div>
              <div style="width: 20%; display: inline-block">
                <el-tooltip :content="`2星(近15天: ${(row.daily_history.fifteen_day_two_star_coef*100).toFixed(1)}%)`"
                            placement="top">
                  <el-tag size="mini"
                          :type="row.daily_history.fifteen_day_two_star_coef > row.daily_history.two_star_coef ? 'danger' : 'primary'"
                          :effect="row.daily_history.fifteen_day_two_star_coef > row.daily_history.two_star_coef ? 'dark' : 'light'"
                          style="width: 100%" @click="openReviewDlg(row.id, 2)">
                    {{ (row.daily_history.two_star_coef * 100).toFixed(1) }}%
                  </el-tag>
                </el-tooltip>
              </div>
              <div style="width: 20%; display: inline-block">
                <el-tooltip :content="`3星(近15天: ${(row.daily_history.fifteen_day_three_star_coef*100).toFixed(1)}%)`"
                            placement="top">
                  <el-tag size="mini" type="primary" style="width: 100%" @click="openReviewDlg(row.id, 3)">
                    {{ (row.daily_history.three_star_coef * 100).toFixed(1) }}%
                  </el-tag>
                </el-tooltip>
              </div>
              <div style="width: 20%; display: inline-block">
                <el-tooltip :content="`4星(近15天: ${(row.daily_history.fifteen_day_four_star_coef*100).toFixed(1)}%)`"
                            placement="top">
                  <el-tag size="mini" type="primary" style="width: 100%" @click="openReviewDlg(row.id, 4)">
                    {{ (row.daily_history.four_star_coef * 100).toFixed(1) }}%
                  </el-tag>
                </el-tooltip>
              </div>
              <div style="width: 20%; display: inline-block">
                <el-tooltip :content="`5星(近15天: ${(row.daily_history.fifteen_day_five_star_coef*100).toFixed(1)}%)`"
                            placement="top">
                  <el-tag size="mini" type="primary" style="width: 100%" @click="openReviewDlg(row.id, 5)">
                    {{ (row.daily_history.five_star_coef * 100).toFixed(1) }}%
                  </el-tag>
                </el-tooltip>
              </div>
              <template v-if="row.product && row.product.account">
                <el-col :span="24">
                  <div>数据分析: </div>
                </el-col>
                <el-col :span="6">
                  <StartBrowser :id="row.product.account.parent_id" :account_id="row.product.account_id" :copy_content="row.product_id" st="width: 100%" open_url="https://agentseller-us.temu.com/main/act/data" name="活动"></StartBrowser>
                </el-col>
                <el-col :span="6">
                  <StartBrowser :id="row.product.account.parent_id" :account_id="row.product.account_id" :copy_content="row.product_id" st="width: 100%" open_url="https://agentseller-us.temu.com/main/business-opportunity" name="市场"></StartBrowser>
                </el-col>
                <el-col :span="6">
                  <StartBrowser :id="row.product.account.parent_id" :account_id="row.product.account_id" :copy_content="row.product_id" st="width: 100%" open_url="https://agentseller-us.temu.com/main/flux-analysis" name="流量"></StartBrowser>
                </el-col>
                <el-col :span="6">
                  <StartBrowser :id="row.product.account.parent_id" :account_id="row.product.account_id" :copy_content="row.product_id" st="width: 100%" open_url="https://agentseller.temu.com/main/data-center/goods-data" name="销量"></StartBrowser>
                </el-col>
              </template>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="海外库存" align="center" prop="semi_stock.sku_stock_quantity">
          <el-table-column label="库存" align="center" prop="semi_stock.sku_stock_quantity" width="100">
            <div slot-scope="{row}">
              <div v-if="row.semi_stock">
                {{ row.semi_stock.sku_stock_quantity }}
                <el-tag size="mini" type="danger" effect="dark" v-if="row.semi_stock.enable_pre_sale">预售</el-tag>
              </div>
              <el-row v-if="row.stock">
                <el-col :span="24">
                  <el-button type="primary" size="mini" style="width: 100%" @click="openAllocate(row)" plain>
                    分配
                  </el-button>
                </el-col>
                <el-col :span="24">
                  <el-button type="primary" size="mini" style="width: 100%" @click="opelDlgStockChanged(row.ext_code)"
                             plain>
                    库存变更记录
                  </el-button>
                </el-col>
                <el-col :span="24">
                  <el-button type="primary" size="mini" style="width: 100%" @click="openList(row.ext_code)" plain>
                    发货记录
                  </el-button>
                </el-col>
                <template v-if="row.stock">
                  <template v-if="!row.stock.setting || !row.stock.setting.no_limit_start_time">
                    <el-col :span="24" v-if="row.stock.real_stock_count >= 3">
                      <el-popover placement="left" trigger="click" @show="initNoLimit(row.stock)">
                        <el-input-number size="mini" :min="0" :max="set_auto_stock.max_no_limit_stock" :precision="0"
                                         style="width: 100%" v-model="set_auto_stock.no_limit_stock"
                                         placeholder="请输入自动分配的库存"></el-input-number>
                        <el-input-number size="mini" :min="0" :max="100000" :precision="0" style="width: 100%"
                                         v-model="set_auto_stock.no_limit_count"
                                         placeholder="请输入产品不限制的库存"></el-input-number>
                        <el-button size="mini" style="width: 100%" type="primary" @click="setNoLimitStart(row.stock)">
                          设置
                        </el-button>
                        <el-button slot="reference" size="mini" type="danger" style="width: 100%">设置自动库存
                        </el-button>
                      </el-popover>
                    </el-col>
                    <el-col :span="24">
                      <el-button size="mini" type="danger" style="width: 100%" @click="clear([row.stock])"
                                 v-if="!row.stock.setting || !row.stock.setting.is_clear">清仓
                      </el-button>
                      <el-button size="mini" type="primary" style="width: 100%" @click="clear([row.stock])"
                                 v-else-if="row.stock.setting && row.stock.setting.is_clear">解除清仓
                      </el-button>
                    </el-col>
                  </template>
                  <el-col :span="24" v-else>
                    <el-popover placement="left" trigger="click">
                      <el-descriptions style="margin-bottom: 10px" title="数据" :column="1" size="mini" border>
                        <el-descriptions-item>
                          <template slot="label">
                            分配的库存
                          </template>
                          {{ row.stock.setting.no_limit_stock }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            产品不限制的库存
                          </template>
                          {{ row.stock.setting.no_limit_count }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            每日最大出单量
                          </template>
                          {{ row.stock.setting.no_limit_per_day_count || "不限制"  }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            开始时间
                          </template>
                          {{ new Date(row.stock.setting.no_limit_start_time).toLocaleString() }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            出单量
                          </template>
                          {{ row.stock.setting.no_limit_sell_count }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                          <template slot="label">
                            出单层级
                          </template>
                          <el-tag size="mini" type="warning">
                            {{ noLimitLevelName(row.stock.setting.no_limit_level) }}
                          </el-tag>
                        </el-descriptions-item>
                      </el-descriptions>
                      <el-button size="mini" style="width: 100%" type="warning" @click="setNoLimitEnd(row.stock)">关闭
                      </el-button>
                      <el-button slot="reference" size="mini" type="danger" style="width: 100%">查看自动库存</el-button>
                    </el-popover>
                  </el-col>
                </template>
              </el-row>
            </div>
          </el-table-column>
          <el-table-column label="下一批货物上架" align="center" prop="stock.next_stock_days" min-width="150px">
            <div slot-scope="{row}">
              <div>
                <el-tag size="mini" type="primary" v-if="row.stock">距离天数: {{ row.stock.next_stock_days.toFixed(2) }}</el-tag>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="待发数量" align="center" prop="stock.not_ship_count">
          </el-table-column>
          <el-table-column label="库存详情" align="center">
            <el-table-column label="仓库" align="center" width="140px">
              <div class="item-container" slot-scope="{row}">
                <template v-if="row.stock && row.stock.inventories">
                  <template v-for="(v, index) in row.stock.inventories">
                    <div :class="index+1 === row.stock.inventories.length ? [`item`] : [`item`, `item-bottom`]"
                         v-if="v.available_stock || v.in_transit_stock">
                      <el-tag size="mini" type="warning">{{ v.warehouse ? v.warehouse.name : "-" }}</el-tag>
                    </div>
                  </template>
                </template>
              </div>
            </el-table-column>
            <el-table-column label="数量" align="center" prop="stock.real_stock_count">
              <div class="item-container" slot-scope="{row}">
                <template v-if="row.stock && row.stock.inventories">
                  <template v-for="(v, index) in row.stock.inventories">
                    <div :class="index+1 === row.stock.inventories.length ? [`item`] : [`item`, `item-bottom`]"
                         v-if="v.available_stock || v.in_transit_stock">
                      <el-tag size="mini" type="primary" effect="dark">{{ v.available_stock }}</el-tag>
                    </div>
                  </template>
                </template>
              </div>
            </el-table-column>
            <el-table-column label="在途" align="center">
              <div class="item-container" slot-scope="{row}">
                <template v-if="row.stock && row.stock.inventories">
                  <template v-for="(v, index) in row.stock.inventories">
                    <div :class="index+1 === row.stock.inventories.length ? [`item`] : [`item`, `item-bottom`]"
                         v-if="v.available_stock || v.in_transit_stock">
                      <el-tag size="mini" type="success" effect="dark">{{ v.in_transit_stock }}</el-tag>
                    </div>
                  </template>
                </template>
              </div>
            </el-table-column>
            <el-table-column label="销毁中" align="center">
              <div class="item-container" slot-scope="{row}">
                <template v-if="row.stock && row.stock.inventories">
                  <template v-for="(v, index) in row.stock.inventories">
                    <div :class="index+1 === row.stock.inventories.length ? [`item`] : [`item`, `item-bottom`]"
                         v-if="v.available_stock || v.in_transit_stock">
                      <el-tag size="mini" type="warning" effect="dark">
                        {{ v.destruction_stock }}
                      </el-tag>
                    </div>
                  </template>
                </template>
              </div>
            </el-table-column>
            <el-table-column label="占用中" align="center">
              <div class="item-container" slot-scope="{row}">
                <template v-if="row.stock && row.stock.inventories">
                  <template v-for="(v, index) in row.stock.inventories">
                    <div :class="index+1 === row.stock.inventories.length ? [`item`] : [`item`, `item-bottom`]"
                         v-if="v.available_stock || v.in_transit_stock">
                      <el-tag size="mini" type="success">{{ v.reserve_stock }}</el-tag>
                    </div>
                  </template>
                </template>
              </div>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="平台" align="center">
          <el-table-column label="退货数量" prop="daily_history.total_refund_count" sortable="custom" sort-by="total_refund_count" align="center">
          </el-table-column>
          <el-table-column label="销量系数" align="center">
            <el-table-column label="7系" prop="daily_history.seven_day_coef" sortable="custom"
                             align="center">
              <template slot="header">
                <el-tooltip content="7日系数">
                  <span>7系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.daily_history">
                  {{ row.daily_history.seven_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
            <el-table-column label="30系" prop="daily_history.thirty_day_coef" sortable="custom"
                             align="center">
              <template slot="header">
                <el-tooltip content="30日系数">
                  <span>30系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.daily_history">
                  {{ row.daily_history.thirty_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
            <el-table-column label="90系" prop="daily_history.ninety_day_coef" sortable="custom"
                             align="center">
              <template slot="header">
                <el-tooltip content="90日系数">
                  <span>90系</span>
                </el-tooltip>
              </template>
              <div slot-scope="{row}">
                <template v-if="row.daily_history">
                  {{ row.daily_history.ninety_day_coef.toFixed(2) }}
                </template>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="流量" align="center">
            <el-table-column label="图" align="center" width="300px">
              <div slot-scope="{row}">
                <template v-if="row.product">
                  <Daily :list="row.product.daily_semi_flow_list" :stack="{'用户': ['搜索','推荐']}" :field_names="['曝光','搜索','推荐']" :fields="['impression_count','search_expose_num','recommend_expose_num']" v-if="row.product.daily_semi_flow_list"></Daily>
                </template>
              </div>
            </el-table-column>
            <el-table-column label="今" prop="daily_history.today_impression" sortable="custom" sort-by="daily_history.today_impression" align="center">
            </el-table-column>
            <el-table-column label="差" prop="daily_history.two_day_impression_diff" sortable="custom" sort-by="daily_history.two_day_impression_diff" align="center">
            </el-table-column>
            <el-table-column label="昨" prop="daily_history.two_day_impression" sortable="custom" sort-by="daily_history.two_day_impression" align="center">
            </el-table-column>
            <el-table-column label="差" prop="daily_history.three_day_impression_diff" sortable="custom" sort-by="daily_history.three_day_impression_diff" align="center">
            </el-table-column>
            <el-table-column label="前" prop="daily_history.three_day_impression" sortable="custom" sort-by="daily_history.three_day_impression" align="center">
            </el-table-column>
            <el-table-column label="加购" prop="daily_history.add_cart_user_count_7d" sortable="custom" sort-by="daily_history.add_cart_user_count_7d" align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column label="销量" align="center">
            <el-table-column label="图" sortable="custom" align="center" width="300px">
              <div slot-scope="{row}">
                <Daily :list="row.records" :field_names="['单量']" :fields="['count']"></Daily>
              </div>
            </el-table-column>
            <el-table-column label="今" prop="daily_history.today" sortable="custom" sort-by="daily_history.today"
                             align="center">
            </el-table-column>
            <el-table-column label="差" prop="daily_history.two_day_diff" sortable="custom"
                             sort-by="daily_history.two_day_diff" align="center">
            </el-table-column>
            <el-table-column label="昨" prop="daily_history.two_day" sortable="custom" sort-by="daily_history.two_day"
                             align="center">
            </el-table-column>
            <el-table-column label="差" prop="daily_history.three_day_diff" sortable="custom"
                             sort-by="daily_history.three_day_diff" align="center">
            </el-table-column>
            <el-table-column label="前" prop="daily_history.three_day" sortable="custom"
                             sort-by="daily_history.three_day" align="center">
            </el-table-column>
            <el-table-column label="7" prop="daily_history.seven_day" sortable="custom"
                             sort-by="daily_history.seven_day" align="center">
            </el-table-column>
            <el-table-column label="周差" prop="daily_history.last_week_diff" sortable="custom"
                             sort-by="daily_history.last_week_diff" align="center">
            </el-table-column>
            <el-table-column label="30" prop="daily_history.thirty_day" sortable="custom"
                             align="center">
            </el-table-column>
            <el-table-column label="全" prop="daily_history.all" sortable="custom" align="center">
              <div slot-scope="{row}">
                <span style="font-size: 12px">
                {{ row.daily_history ? row.daily_history.all : 0 }}
                </span>
              </div>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="广告" align="center">
          <el-table-column label="日预算" prop="ad_product.budget" sortable="custom" align="center" width="100">
            <div slot-scope="{row}">
              <template v-if="row.ad_product">
                <span v-if="row.ad_product.budget >= 0">
                  {{ (row.ad_product.budget / 100).toFixed(2) }}
                </span>
                <span v-else>
                  不限
                </span>
                <el-button size="mini" icon="el-icon-edit" @click="openEditBudgetDlg([row])" circle></el-button>

                <div>
                  <el-row :gutter="5">
                    <el-col :span="24">
                      <el-button style="width: 100%" type="danger" size="mini" v-if="canStop(row)"
                                 @click="stopAds([row])">暂停广告
                      </el-button>
                      <el-button style="width: 100%" type="warning" size="mini" v-else-if="canStart(row)"
                                 @click="startAds([row])">打开广告
                      </el-button>
                    </el-col>
                    <el-col :span="24">
                      <el-button style="width: 100%" type="primary" size="mini" @click="openDailyDlg(row.product_id)">
                        广告历史数据
                      </el-button>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="目标投资回报率 (ROAS)" prop="ad_product.target_roas" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.ad_product">
                <template v-if="row.ad_product.target_roas > 0">
                  <el-tag size="mini" effect="dark" type="danger" v-if="row.ad_product.target_roas <= 5000">
                    {{ (row.ad_product.target_roas / 10000).toFixed(2) }}
                  </el-tag>
                  <el-tag size="mini" effect="dark" type="warning" v-else-if="row.ad_product.target_roas <= 7000">
                    {{ (row.ad_product.target_roas / 10000).toFixed(2) }}
                  </el-tag>
                  <el-tag size="mini" effect="dark" type="info" v-else-if="row.ad_product.target_roas <= 9000">
                    {{ (row.ad_product.target_roas / 10000).toFixed(2) }}
                  </el-tag>
                  <el-tag size="mini" effect="dark" type="success" v-else>
                    {{ (row.ad_product.target_roas / 10000).toFixed(2) }}
                  </el-tag>
                </template>
                <el-button size="mini" icon="el-icon-edit" @click="openEditRoasDlg([row])" circle></el-button>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="投资回报率 (ROAS)" prop="ad_product.roas" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.ad_product && row.ad_product.roas > 0">
                <el-tag size="mini" effect="dark" type="danger" v-if="row.ad_product.roas <= 5000">
                  {{ (row.ad_product.roas / 1000).toFixed(2) }}
                </el-tag>
                <el-tag size="mini" effect="dark" type="warning" v-else-if="row.ad_product.roas <= 7000">
                  {{ (row.ad_product.roas / 1000).toFixed(2) }}
                </el-tag>
                <el-tag size="mini" effect="dark" type="info" v-else-if="row.ad_product.roas <= 9000">
                  {{ (row.ad_product.roas / 1000).toFixed(2) }}
                </el-tag>
                <el-tag size="mini" effect="dark" type="success" v-else>
                  {{ (Math.min(row.ad_product.roas, 100000) / 1000).toFixed(2) }}
                </el-tag>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="花费" prop="ad_product.ad_spend" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.ad_product">
                {{ (row.ad_product.ad_spend / 100).toFixed(2) }}<span
                  v-if="row.ad_product.order_pay_cnt">({{
                  (row.ad_product.ad_spend / 100 / row.ad_product.order_pay_cnt).toFixed(2)
                }})</span>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="支付金额" prop="ad_product.order_pay_amt" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.ad_product">
                {{ (row.ad_product.order_pay_amt / 100).toFixed(2) }}<span
                  v-if="row.ad_product.order_pay_cnt">({{
                  (row.ad_product.order_pay_amt / 100 / row.ad_product.order_pay_cnt).toFixed(2)
                }})</span>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="曝光量" prop="ad_product.impr_cnt" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="点击" align="center">
            <el-table-column label="次数" prop="ad_product.clk_cnt" sortable="custom" align="center">
            </el-table-column>
            <el-table-column label="率(CTR)" prop="ad_product.ctr" sortable="custom" align="center">
              <div slot-scope="{row}">
                <template v-if="row.ad_product">
                  {{ (row.ad_product.ctr / 100).toFixed(2) }}%
                </template>
              </div>
            </el-table-column>
          </el-table-column>
          <el-table-column label="购物车" prop="ad_product.cart_cnt" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="订单量" prop="ad_product.order_pay_cnt" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.ad_product">
                {{ (row.ad_product.order_pay_cnt) }}
              </template>
            </div>
          </el-table-column>
          <el-table-column label="广告费比（ACOS）" prop="ad_product.acos" sortable="custom" align="center">
            <div slot-scope="{row}">
              <template v-if="row.ad_product">
                {{ (row.ad_product.acos / 100).toFixed(2) }}%
              </template>
            </div>
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
    <TemuDlgImageReview :id="imageReview.id" :visible="imageReview.visible"
                        @close="imageReview.visible=false"></TemuDlgImageReview>
    <FDlgUploadBarcode :is_create="toUpload.is_create" :id="toUpload.id" :pdf_url="toUpload.pdf_url"
                       :visible="toUpload.visible" @close="toUpload.visible=false"></FDlgUploadBarcode>
    <TemuDlgCustomize :account_id="dlgCustomize.account_id" :id="dlgCustomize.id"
                      :sku_ext_code="dlgCustomize.sku_ext_code" :visible="dlgCustomize.visible"
                      @close="closeCustomizeDlg"></TemuDlgCustomize>
    <TemuDlgReview :sku_id="review.id" :score="review.score" :visible="review.visible" @close="review.visible=false"
                   v-if="review.visible"></TemuDlgReview>
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
    <TemuDlgStockAllocate :id="allocate.id" :sku_ids="allocate.sku_ids" :visible="allocate.visible"
                          @close="allocate.visible=false" @suc="getTableData"></TemuDlgStockAllocate>
    <TemuDlgStockChangedRecord :sku_code="dlgStockChange.sku_code" :is_system="dlgStockChange.is_system"
                               :update="getTableData" :visible="dlgStockChange.visible"
                               @close="dlgStockChange.visible=false"></TemuDlgStockChangedRecord>
    <TemuDlgList :sku_code="dlgList.sku_code" :visible="dlgList.visible" @close="dlgList.visible=false"
                 v-if="dlgList.visible"></TemuDlgList>
    <TemuDlgAdEditBudget :rows="editBudget.rows" :visible="editBudget.visible" @close="editBudget.visible=false"
                         @suc="getTableData"></TemuDlgAdEditBudget>
    <TemuDlgAdHistory :table-data="dailyDlg.list" :visible="dailyDlg.visible"
                      @close="dailyDlg.visible=false"></TemuDlgAdHistory>
    <TemuDlgAdEditRoas :rows="editRoas.rows" :visible="editRoas.visible" @close="editRoas.visible=false"
                       @suc="getTableData"></TemuDlgAdEditRoas>
    <TemuDlgSearchLimit :id="searchLimitDlg.id" :visible="searchLimitDlg.visible" @close="searchLimitDlg.visible=false" @update="getTableData"></TemuDlgSearchLimit>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  saleItemBan,
  saleItemEditSku,
  saleItemBanProduce
} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image";
import TemuDlgPlans from "@/view/temu/components/dlg_plans";
import {accountList} from "@/api/temu/account";
import {dxmSync} from "@/api/dxm/sync";
import FDlgUploadBarcode from "@/view/sf-factory/components/dlg_upload_barcode.vue";
import TemuDlgCustomize from "@/view/temu/components/dlg_customize.vue";
import TemuDlgImageEdit from "@/view/temu/sale/components/dlg_image_edit.vue";
import TemuDlgImageReview from "@/view/temu/sale/components/dlg_image_review.vue";
import TemuDlgReview from "@/view/temu/review/dlg_review.vue";
import TemuDlgCert from "@/view/temu/sale/components/dlg_cert.vue";
import TemuDlgBatchModifySkuCode from "@/view/temu/sale/components/dlg_batch_modify_sku_code.vue";
import {saleDownloadImages} from "@/api/temu/sale";
import TemuDlgDownloadImages from "@/view/temu/sale/components/dlg_download_images.vue";
import {simpleProductCreateBySaleItem} from "@/api/temu/simple_product";
import TemuDlgSimpleProductUpload from "@/view/temu/simple_product/dlg_upload.vue";
import TemuDlgBatchAdjustPrice from "@/view/temu/sale/components/dlg_batch_adjust_price.vue";
import Daily from "@/view/components/daily.vue";
import TemuDlgCouponApply from "@/view/temu/coupon/components/dlg_coupon_apply.vue";
import TemuDlgActivityProducts from "@/view/temu/activity/components/dlg_activity_products.vue";
import TemuDlgActivityAppliedList from "@/view/temu/activity/components/dlg_activity_applied_list.vue";
import TemuDlgImageEditV2 from "@/view/temu/sale/components/dlg_image_edit_v2.vue";
import StartBrowser from "@/view/temu/components/start_browser.vue";
import DlgProductCreate from "@/view/product/components/dlg_create_product.vue";
import TemuDlgOneKeyTransport from "@/view/temu/product/components/dlg_one_key_transport.vue";
import {semiList} from "@/api/temu/semi";
import TemuDlgStockAllocate from "@/view/oversea_warehouse/components/dlg_stock_allocate.vue";
import TemuDlgStockChangedRecord from "@/view/oversea_warehouse/components/dlg_stock_changed.vue";
import TemuDlgList from "@/view/oversea_warehouse/components/dlg_list.vue";
import {
  overseasWarehouseClear,
  overseasWarehouseNoLimitEnd,
  overseasWarehouseNoLimitStart
} from "@/api/oversea_warehouse/list";
import TemuDlgAdEditBudget from "@/view/temu/ad/components/dlg_edit_budget.vue";
import {adProductDaily, adStart, adStop} from "@/api/temu/ad";
import TemuDlgAdHistory from "@/view/temu/ad/components/dlg_ad_history.vue";
import TemuDlgAdEditRoas from "@/view/temu/ad/components/dlg_edit_roas.vue";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";
import TemuDlgSearchLimit from "@/view/temu/components/dlg_search_limit.vue";
import {productSearchLimitSelfCompare, productSync} from "@/api/temu/product";
import {variationExport} from "@/api/temu/variation";
import TemuSearchLimit from "@/view/temu/components/search_limit.vue";

export default {
  components: {
    TemuSearchLimit,
    TemuDlgSearchLimit,
    TemuDlgDaily,
    TemuDlgAdEditRoas,
    TemuDlgAdHistory,
    TemuDlgAdEditBudget,
    TemuDlgList,
    TemuDlgStockChangedRecord,
    TemuDlgStockAllocate,
    TemuDlgOneKeyTransport,
    DlgProductCreate,
    StartBrowser,
    TemuDlgImageEditV2,
    TemuDlgCouponApply,
    TemuDlgActivityAppliedList,
    TemuDlgActivityProducts,
    Daily,
    TemuDlgBatchAdjustPrice,
    TemuDlgSimpleProductUpload,
    TemuDlgDownloadImages,
    TemuDlgBatchModifySkuCode,
    TemuDlgImageEdit,
    TemuDlgCert,
    TemuDlgReview,
    TemuDlgImageReview,
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
      listApi: semiList,
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

      dailyDlg: {
        list: [],
        visible: false,
      },

      editRoas: {
        rows: [],
        visible: false,
      },

      searchLimitDlg: {
        id: undefined,
        visible: false,
      },

      editBudget: {
        rows: [],
        visible: false,
      },

      set_auto_stock: {
        max_no_limit_stock: 10000,
        no_limit_stock: undefined,
        no_limit_count: undefined,
      },

      dlgList: {
        sku_code: "",
        visible: false,
      },

      dlgStockChange: {
        sku_code: "",
        is_system: false,
        visible: false,
      },

      allocate: {
        id: undefined,
        sku_ids: [],
        activity_applied_func: undefined,
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

      plans: {
        id: undefined,
        visible: false,
      },

      daily: {
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

      dlgCustomize: {
        account_id: undefined,
        id: undefined,
        sku_ext_code: undefined,
        visible: false,
      },

      toUpload: {
        is_create: false,
        id: undefined,
        pdf_url: undefined,
        visible: false,
      },

      accountOptions: [],
      tagOptions: [],
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

      selectStatusOptions: [
        {id: 10, name: "待下首单", type: "primary"},
        {id: 11, name: "已下首单", type: "primary"},
        {id: 12, name: "已加入站点", type: "success"},
        {id: 13, name: "已下架终止", type: "warning"},
        {id: 17, name: "已终止", type: "danger"},
      ],
    }
  },
  computed: {
    hasActivityCanApplySelectRows() {
      return this.selectRows.filter((item) => {
        return item.daily_history && item.daily_history.has_activity_can_apply
      })
    },
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
    openImageReview(row) {
      this.imageReview.id = row.product_id
      this.imageReview.visible = true
    },
    openImageEdit(row) {
      this.image_edit.content = String(row.id)
      this.image_edit.sku_code = row.sku_ext_code
      this.image_edit.visible = true
    },
    async oneKeyTransport(rows) {
      this.dlgOneKeyTransport.ids = [...new Set(rows.map((row) => {
        return row.product_id
      }))]
      this.dlgOneKeyTransport.visible = true
    },
    async exportSelfCompareSearchLimit() {
      let resp = await productSearchLimitSelfCompare()
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank");
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
      if (!row.daily_history) {
        return "新品"
      }
      let op = this.levelOptions.find(op => op.id === row.daily_history.level)
      if (!op) {
        return "新品"
      }
      return op.name
    },
    selectStatusName(status) {
      let op = this.selectStatusOptions.find(op => op.id === status)
      if (!op) {
        return `未知: ${status}`
      }
      return op.name
    },
    selectStatusType(status) {
      let op = this.selectStatusOptions.find(op => op.id === status)
      if (!op) {
        return ``
      }
      return op.type
    },
    selectionChange(val) {
      this.selectRows = val
      let ids = this.selectRows.map(s => s.product.product_skc_id)
      if (ids.length) {
        this.copy(ids.join((" ")))

        let extCodes = []
        this.selectRows.forEach((row) => {
          if (extCodes.indexOf(row.ext_code) < 0) {
            extCodes.push(row.ext_code)
          }
        })
        if (extCodes.length) {
          this.$message('货号是 ' + extCodes.join(" "))
        }

        let spuIds = []
        this.selectRows.forEach((row) => {
          if (spuIds.indexOf(row.product_id) < 0) {
            spuIds.push(row.product_id)
          }
        })
        if (spuIds.length) {
          this.$notify({
            title: "Spu Ids:",
            dangerouslyUseHTMLString: true,
            message: spuIds.join(" "),
            duration: 10000,
          });
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
    async banProduce(ids, is_ban) {
      let resp = await saleItemBanProduce({ids: ids, is_ban: is_ban})
      if (resp.code) {
        return
      }

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
    openReviewDlg(id, score) {
      this.review.id = id
      this.review.score = score
      this.review.visible = true
    },
    handleCommand(command) {
      switch (command) {
        case "onDxmSync": {
          this.onDxmSync()
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
            return item.product_id
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
            return item.product_id
          })
          this.dlgDownloadImages.visible = true
          return
        }
        case "createFromSaleItems": {
          this.uploadBySaleItem(this.selectRows)
          return
        }
        case "batchApplyActivity": {
          this.dlgActivityProduct.ids = this.hasActivityCanApplySelectRows.map((item) => {
            return item.product_id
          })
          this.dlgActivityProduct.visible = true
          return
        }
        case "batchSync": {
          this.batchSync(this.selectRows)
          return
        }
        case "batchCreateCoupon": {
          this.dlgBatchCreateCoupon.ids = this.selectRows.map((item) => {
            return item.product_id
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
        case "exportSelfCompareSearchLimit": {
          this.exportSelfCompareSearchLimit()
          return
        }
      }
    },
    openCreateCoupon(productId) {
      this.dlgBatchCreateCoupon.ids = [productId]
      this.dlgBatchCreateCoupon.visible = true
    },
    async downloadImages(list) {
      // 需要下载的列表
      let resp = await saleDownloadImages({
        ids: list.map((item) => {
          return item.product_id
        })
      })
      if (resp.code) {
        return
      }

      window.open(resp.data, "_BLANK")
      this.$message("生成成功")
    },
    createProduct(row) {
      this.dlgProductCreate.id = row.product_id
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
    async batchSync(rows) {
      let resp = await productSync({
        ids: rows.map((item) => {
          return item.product_id
        })
      })
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    async openActivityProductList(id) {
      this.dlgActivityProduct.ids = [id]
      this.dlgActivityProduct.visible = true
    },
    async openActivityAppliedProductList(ids) {
      this.dlgActivityAppliedProduct.ids = ids
      this.dlgActivityAppliedProduct.visible = true
    },
    skuReview(row) {
      if (row.review) {
        return `${row.review.count}(${row.review.score.toFixed(2)})`
      } else if (row.daily_history && row.daily_history.review_count) {
        return `${row.daily_history.review_count}(${row.daily_history.review_score.toFixed(2)})`
      } else {
        return ""
      }
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "daily_history.seven_day_coef") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.seven_day_coef : 0
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
        } else if (column.property === "daily_history.thirty_day_coef") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.thirty_day_coef : 0
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
        } else if (column.property === "daily_history.ninety_day_coef") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.ninety_day_coef : 0
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
        } else if (column.property === "daily_history.today") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.today : 0
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
        } else if (column.property === "daily_history.two_day_diff") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.two_day_diff : 0
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
        } else if (column.property === "daily_history.two_day") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.two_day : 0
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
        } else if (column.property === "daily_history.three_day_diff") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.three_day_diff : 0
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
        } else if (column.property === "daily_history.three_day") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.three_day : 0
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
        } else if (column.property === "daily_history.seven_day") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.seven_day : 0
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
        } else if (column.property === "daily_history.thirty_day") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.thirty_day : 0
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
        } else if (column.property === "daily_history.last_week_diff") {
          const values = data ? data.map(item => {
            return item.daily_history ? item.daily_history.last_week_diff : 0
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
    canStop(row) {
      return row.ad_product && (row.ad_product.ad_show_status === 8 || row.ad_product.ad_show_status === 1 || row.ad_product.ad_show_status === 2)
    },
    canStart(row) {
      return row.ad_product && row.ad_product.ad_show_status === 7
    },
    openAllocate(row) {
      this.allocate.id = row.ext_code
      this.allocate.sku_ids = [row.id]
      this.allocate.visible = true
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
    initNoLimit(row) {
      this.set_auto_stock.max_no_limit_stock = row.real_stock_count
      this.set_auto_stock.no_limit_stock = undefined
      this.set_auto_stock.no_limit_count = undefined
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

      let resp = await overseasWarehouseNoLimitStart({
        id: row.id,
        no_limit_stock: this.set_auto_stock.no_limit_stock,
        no_limit_count: this.set_auto_stock.no_limit_count
      })
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    clear(rows) {
      this.$confirm('请确认是否清仓?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await overseasWarehouseClear({
          ids: rows.map((row) => {
            return row.id
          })
        })
        if (resp.code) {
          return
        }
        this.getTableData()
      })
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
    async setNoLimitEnd(row) {
      let resp = await overseasWarehouseNoLimitEnd({id: row.id})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    openEditBudgetDlg(rows) {
      this.editBudget.rows = rows
      this.editBudget.visible = true
    },
    async stopAds(rows) {
      let ids = rows.map((item) => {
        return item.product_id
      })
      if (ids.length <= 0) {
        return
      }

      let resp = await adStop({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("暂停成功")
      this.getTableData()
    },
    async startAds(rows) {
      let ids = rows.map((item) => {
        return item.product_id
      })
      if (ids.length <= 0) {
        return
      }

      let resp = await adStart({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("启动成功")
      this.getTableData()
    },
    async openDailyDlg(productId) {
      let resp = await adProductDaily({id: productId})
      if (resp.code) {
        return
      }
      this.dailyDlg.list = resp.data
      this.dailyDlg.visible = true
    },
    openEditRoasDlg(rows) {
      this.editRoas.rows = rows
      this.editRoas.visible = true
    },
    openSearchLimitDlg(id) {
      this.searchLimitDlg.id = id
      this.searchLimitDlg.visible = true
    }
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
    this.$set(this.searchInfo, "select_status", [12, 13])
    this.$set(this.searchInfo, "has_stock", 1)

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