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
                <el-option v-for="(item, index) in accountOptions" :key="index"
                           :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.select_status" placeholder="请选择选品状态" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in selectStatusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_semi" placeholder="请选择半托/全托" filterable clearable style="width: 100%">
                <el-option label="全托" :value="1"></el-option>
                <el-option label="半托" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_y2" placeholder="请选择Y2/非Y2" filterable clearable style="width: 100%">
                <el-option label="Y2" :value="1"></el-option>
                <el-option label="非Y2" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.categories" placeholder="请选择类目" multiple collapse-tags filterable
                         clearable style="width: 100%" remote :remote-method="searchCategoryList">
                <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_updating" placeholder="是否信息修改中" filterable clearable style="width: 100%">
                <el-option label="修改中" :value="1"></el-option>
                <el-option label="未修改" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-row>
                <el-col :span="8">
                  <el-select class="select" size="mini" v-model="searchInfo.include_tag" style="width: 100%;">
                    <el-option :key="0" label="含" :value="true"></el-option>
                    <el-option :key="1" label="不含" :value="false"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="16">
                  <el-select v-model="searchInfo.tags" placeholder="请选择标记" multiple collapse-tags filterable
                             clearable style="width: 100%">
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
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids，空格分隔" v-model="searchInfo.skc_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids，空格分隔" v-model="searchInfo.sku_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="小秘Sku" v-model="searchInfo.dxm_goods_sku" clearable filterable
                        @keyup.enter.native="onSubmit">
                <el-select class="select" v-model="searchInfo.dxm_goods_sku_type" slot="prepend" filterable
                           style="width: 60px">
                  <el-option label="精确" :key="0" value=""></el-option>
                  <el-option label="模糊" :key="1" :value="1"></el-option>
                  <el-option label="右模" :key="2" :value="2"></el-option>
                  <el-option label="左模" :key="3" :value="3"></el-option>
                  <el-option label="全匹配" :key="4" :value="4"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Goods Ids，空格分隔" v-model="searchInfo.goods_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="1">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_ban" placeholder="是否禁售" filterable clearable style="width: 100%">
                <el-option :key="0" label="" value=""></el-option>
                <el-option :key="1" label="未禁售" :value="1"></el-option>
                <el-option :key="2" label="已禁售" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="1">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_ban_produce" placeholder="是否禁产" filterable clearable style="width: 100%">
                <el-option :key="0" label="" value=""></el-option>
                <el-option :key="1" label="未禁产" :value="1"></el-option>
                <el-option :key="2" label="已禁产" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="买手名字" v-model="searchInfo.buyer_name" clearable filterable
                        @keyup.enter.native="onSubmit">
                <el-select class="select" v-model="searchInfo.buyer_name_type" slot="prepend" filterable
                           style="width: 60px">
                  <el-option :key="0" label="精确" value=""></el-option>
                  <el-option :key="1" label="模糊" :value="1"></el-option>
                  <el-option :key="2" label="右模" :value="2"></el-option>
                  <el-option :key="3" label="左模" :value="3"></el-option>
                  <el-option :key="4" label="全匹配" :value="4"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input size="mini" v-model="searchInfo.sku_code" clearable placeholder="货号，逗号分隔"
                        @keyup.enter.native="onSubmit">
                <el-select class="select" slot="prepend" v-model="searchInfo.sku_code_type" filterable
                           style="width: 60px">
                  <el-option :key="0" label="精确" value=""></el-option>
                  <el-option :key="1" label="模糊" :value="1"></el-option>
                  <el-option :key="2" label="右模" :value="2"></el-option>
                  <el-option :key="3" label="左模" :value="3"></el-option>
                  <el-option :key="4" label="全匹配" :value="4"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input size="mini" v-model="searchInfo.exclude_sku_code" clearable placeholder="排除货号，逗号分隔"
                        @keyup.enter.native="onSubmit">
                <el-select class="select" slot="prepend" v-model="searchInfo.exclude_sku_code_type" filterable
                           style="width: 60px">
                  <el-option :key="0" label="精确" value=""></el-option>
                  <el-option :key="1" label="模糊" :value="1"></el-option>
                  <el-option :key="2" label="右模" :value="2"></el-option>
                  <el-option :key="3" label="左模" :value="3"></el-option>
                  <el-option :key="4" label="全匹配" :value="4"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_factory" placeholder="是否工厂" filterable clearable
                         style="width: 100%">
                <el-option :key="0" label="" value=""></el-option>
                <el-option :key="1" label="工厂" :value="1"></el-option>
                <el-option :key="2" label="非工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.product_type" placeholder="产品类型" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option :key="0" label="备货" :value="1"></el-option>
                <el-option :key="1" label="JIT" :value="2"></el-option>
                <el-option :key="2" label="定制" :value="3"></el-option>
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
              <el-select placeholder="是否违规" v-model="searchInfo.is_punish" clearable filterable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="违规" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="资质上传" v-model="searchInfo.need_upload_cert" clearable filterable
                         style="width: 100%">
                <el-option :key="0" label="无需上传资质" :value="1"></el-option>
                <el-option :key="1" label="需上传资质" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="是否签约" v-model="searchInfo.is_sign" clearable filterable
                         style="width: 100%">
                <el-option :key="0" label="" value=""></el-option>
                <el-option :key="1" label="已签" :value="1"></el-option>
                <el-option :key="2" label="未签" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!--          <el-col :xs="12" :sm="6" :lg="3">-->
          <!--            <el-form-item label-width="0">-->
          <!--              <el-input class="input-right-zero" placeholder="条码Id，空格分隔" v-model="searchInfo.label_codes"-->
          <!--                        clearable filterable></el-input>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="申请jit" v-model="searchInfo.apply_jit_status" clearable filterable
                         style="width: 100%">
                <el-option :key="0" label="" value=""></el-option>
                <el-option :key="1" label="开通jit" :value="1"></el-option>
                <el-option :key="2" label="开通中" :value="2"></el-option>
                <el-option :key="3" label="不可开通" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="平台还价" v-model="searchInfo.reply_price" clearable filterable
                        @keyup.enter.native="onSubmit">
                <el-select class="select" v-model="searchInfo.reply_price_type" slot="prepend" filterable
                           style="width: 60px">
                  <el-option label="<=" :key="0" value=""></el-option>
                  <el-option label=">=" :key="1" :value="1"></el-option>
                  <el-option label="<" :key="2" :value="2"></el-option>
                  <el-option label=">" :key="3" :value="3"></el-option>
                  <el-option label="=" :key="4" :value="4"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input placeholder="最小库存" v-model="searchInfo.min_stock" clearable filterable
                          @keyup.enter.native="onSubmit"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input placeholder="最大库存" v-model="searchInfo.max_stock" clearable filterable
                          @keyup.enter.native="onSubmit"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.title" type="primary" placeholder="标题" clearable
                        @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-dropdown style="width: 100%" @command="handleCommand">
                <el-button type="primary" style="width: 100%">
                  更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" style="width: 250px">
                  <el-dropdown-item command="onDxmSync">同步店小秘</el-dropdown-item>
                  <el-dropdown-item command="openImageEdit">改图</el-dropdown-item>
                  <el-dropdown-item command="openBatchModifySkuCode">批量改货号</el-dropdown-item>
                  <el-dropdown-item command="openChangeMinStock" v-if="changeMinStockRows.length">批量调整JIT/定制库存
                  </el-dropdown-item>
                  <el-dropdown-item command="openChangeSemiStock" v-if="changeSemiStockRows.length">批量调整半托管库存
                  </el-dropdown-item>
                  <el-dropdown-item command="openReplyPrice" v-if="replyPriceRows.length">批量还价</el-dropdown-item>
                  <el-dropdown-item command="createFromSaleItems" v-if="selectRows.length">复制上架</el-dropdown-item>
                  <el-dropdown-item command="batchSync" v-if="selectRows.length">批量同步</el-dropdown-item>
                  <el-dropdown-item command="batchOpenJit" v-if="canOpenJitRows.length">批量开通jit</el-dropdown-item>
                  <el-dropdown-item command="batchCustomize" v-if="customizeSelectRows.length">批量设置定制配置
                  </el-dropdown-item>
                  <el-dropdown-item command="batchAddSite" v-if="selectRows.length">商品发布到站点</el-dropdown-item>
                  <el-dropdown-item command="batchProductDown" v-if="selectRows.length">商品下架</el-dropdown-item>
                  <el-dropdown-item command="batchPriceRefresh" v-if="selectRows.length">价格刷新</el-dropdown-item>
                  <el-dropdown-item command="batchOpenJitV2" v-if="canOpenJitRows.length">批量客服开通jit</el-dropdown-item>
                  <el-dropdown-item command="oneKeyTransport" v-if="selectRows.length">一键迁移</el-dropdown-item>
                  <el-dropdown-item command="batchCreate" v-if="selectRows.length">批量创建</el-dropdown-item>
                  <el-dropdown-item command="batchExportTitle" v-if="selectRows.length">批量导出标题</el-dropdown-item>
                  <el-dropdown-item command="batchUpdateCompliance" v-if="selectRows.length">批量更新合规</el-dropdown-item>
                  <el-dropdown-item command="batchUpdateShoutRealPicture" v-if="selectRows.length">批量更新实拍图</el-dropdown-item>
                  <el-dropdown-item command="batchBan" v-if="canBanIds.length">批量禁售</el-dropdown-item>
                  <el-dropdown-item command="batchCancelBan" v-if="canCancelBanIds.length">批量取消禁售</el-dropdown-item>
                  <el-dropdown-item command="batchY2" v-if="canY2Rows.length">批量Y2(9天时效)</el-dropdown-item>
                  <el-dropdown-item command="batchSemi" v-if="canSemiRows.length">批量半托管(2天时效)</el-dropdown-item>
                  <el-dropdown-item command="batchVideo" v-if="selectRows.length">批量视频</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="account.name">
        </el-table-column>
        <el-table-column label="商品信息" align="center" prop="sku_ext_code">
          <div slot-scope="{row}">
            <div>
              <el-tooltip size="mini" :content="row.product_name" placement="right">
                <el-tag size="mini" type="primary" class="one-line">{{ row.product_name }}</el-tag>
              </el-tooltip>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.id.toString())">SPU: {{ row.id }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" @click="copy(row.product_skc_id.toString())">SKC:
                {{ row.product_skc_id }}
              </el-tag>
            </div>
            <div v-if="row.review">
              <el-tag size="mini" type="primary">评分: {{ skcReview(row) }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="其他信息" align="center" prop="sku_ext_code" sort-by="sku_ext_code">
          <div slot-scope="{row}">
            <div v-if="row.leaf_cat">
              <el-tag size="mini">类目: {{ row.leaf_cat.name }}</el-tag>
            </div>
            <div v-if="row.select">
              <el-tag size="mini">买手: {{ row.select.buyer_name }}</el-tag>
            </div>
            <div v-if="row.select && row.select.punish_count">
              <el-tooltip :content="row.select.punish_list.join(', ')">
                <el-tag size="mini" type="danger" effect="dark">违规</el-tag>
              </el-tooltip>
            </div>
            <div>
              <el-tag size="mini" type="warning" effect="dark">选品状态: {{ selectStatusName(row.select) }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="warning" effect="dark" v-if="row.product_type === 2">
                {{ `JIT(${row.jit && row.jit.is_confirm ? "已签" : "未签"})` }}
              </el-tag>
              <el-tag size="mini" type="warning" effect="dark" v-else-if="row.product_type === 3">
                {{ `定制(${row.personalization && row.personalization.is_confirm ? "已签" : "未签"})` }}
              </el-tag>
              <el-tag size="mini" type="primary" effect="dark" v-else>备货</el-tag>
              <el-tag size="mini" type="warning" effect="dark" v-if="row.is_semi">半托管</el-tag>
              <el-tag size="mini" type="warning" effect="dark" v-else>全托管</el-tag>
              <el-tag size="mini" type="danger" effect="dark" v-if="row.is_y2">Y2</el-tag>
              <el-tag size="mini" type="warning" effect="dark" v-if="row.is_updating">信息修改中</el-tag>
            </div>
            <div v-if="row.cert_punish">
              <el-tooltip :content="row.cert_punish.punish_region_names.join(',')">
                <el-tag size="mini" type="primary" effect="dark">
                  {{
                    new Date(row.cert_punish.punish_time).toLocaleString()
                  }}下架{{ row.cert_punish.punish_region_names.length }}个站点
                </el-tag>
              </el-tooltip>
            </div>
            <div v-if="row.select">
              <div v-if="row.select.termination_reason_list">
                <el-tag size="mini" type="danger" effect="dark">
                  终止原因: {{ row.select.termination_reason_list.join("/") }}
                </el-tag>
              </div>
              <div v-if="row.select.remark_types">
                <el-tag size="mini" type="danger" effect="dark">
                  运营备注: {{ row.select.remark_types.join("/") }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="主图" align="center" prop="sku_ext_code">
          <div slot-scope="{row}">
            <KdxImage :src="row.main_image_url"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="Sku" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              {{ variation.id }}
              <div v-if="variation.search_limit">
                <el-tag size="mini" type="danger" effect="dark" v-if="variation.search_limit.type === 1">高价限流(日常+活动)</el-tag>
                <el-tag size="mini" type="danger" effect="dark" v-if="variation.search_limit.type === 2">高价限流(日常价)</el-tag>
                <el-tag size="mini" type="danger" effect="dark" v-else-if="variation.search_limit.type === 3">即将高价限流({{new Date(variation.search_limit.end_time).toLocaleString()}})</el-tag>
              </div>
              <div v-if="variation.review">
                <el-tag size="mini" type="primary">评分: {{ skuReview(variation) }}</el-tag>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="货号" align="center" min-width="130px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              <el-tag size="mini" type="primary" @click="startEditSku(variation.id, variation.ext_code)"
                      v-if="editSku.id!==variation.id">{{ variation.ext_code }}
              </el-tag>
              <template v-else>
                <el-input :ref="variation.id" v-model="editSku.sku" @keyup.enter.native="updateSku" size="mini">
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
              <div v-if="variation.spec1_name">
                <el-tag size="mini" type="primary">{{ variation.spec1_name }}</el-tag>
              </div>
              <div v-if="variation.spec2_name">
                <el-tag size="mini" type="primary">{{ variation.spec2_name }}</el-tag>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="变体图" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              <KdxImage :src="variation.thumb_url" width="60px" height="60px"></KdxImage>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="体积/重量" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              <el-tag size="mini" type="primary" v-if="variation.volume">
                {{ variation.volume.len / 10 }}cm*{{ variation.volume.width / 10 }}cm*{{
                  variation.volume.height / 10
                }}cm({{ variation.volume.is_platform ? "平" : "自" }})
              </el-tag>
              /
              <el-tag size="mini" type="primary" v-if="variation.weight">
                {{ variation.weight.weight }}g({{ variation.weight.is_platform ? "平" : "自" }})
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="价格" align="center" width="200px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              <div>
                {{ variation.currency_type }} {{ (variation.supplier_price / 100).toFixed(2) }}

                <div v-if="row.select">
                  <div v-if="!row.select.review_infos || row.select.review_infos.length <= 0">
                    <el-tag size="mini" type="warning">价格申报中</el-tag>
                  </div>
                  <template v-else>
                    <div v-for="(info, index) in row.select.review_infos" :key="index">
                      <template v-for="(review, index) in info.reviews">
                        <div :key="index" v-if="review.id === variation.id">
                          <div v-if="info.price">
                            <el-tag size="mini" type="primary">
                              价格: {{ (info.price.supply_price / 100).toFixed(2) }} / 还价:
                              {{ (info.price.suggest_supply_price / 100).toFixed(2) }} [{{info.times}}次]
                            </el-tag>
                          </div>
                          <div v-if="info.status === 0">
                            <el-tag size="mini" type="warning">价格申报中[{{info.times}} 次]</el-tag>
                          </div>
                          <div v-else-if="info.status === 3">
                            <el-tag size="mini" type="warning">已失效[{{info.times}} 次]</el-tag>
                          </div>
                          <div v-else-if="info.status === 1">
                            <el-button size="mini" type="warning" @click="onReplyPrice(row, [info])">还价</el-button>
                          </div>
                        </div>
                      </template>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="库存" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              <div v-if="!variation.ban && !variation.ban_produce">
                <div v-if="!variation.is_semi && variation.normal_stock">
                  虚拟库存: {{ variation.normal_stock.virtual_stock }}
                  <el-button size="mini" type="primary" @click="openChangeMinStock([variation])" plain>调整</el-button>
                </div>
                <div v-else-if="variation.semi_stock">
                  库存: {{ variation.semi_stock.sku_stock_quantity }}
                  <el-button size="mini" type="primary" @click="openChangeSemiStock([variation])" plain>调整</el-button>
                </div>
                <div v-else>
                  -
                </div>
              </div>
              <div v-if="variation.ban">
                <el-button size="mini" type="primary" @click="ban([variation.id], false)">取消禁售</el-button>
              </div>
              <div v-else>
                <el-button size="mini" type="primary" @click="ban([variation.id], true)">设置禁售</el-button>
              </div>
              <div v-if="variation.ban_produce">
                <el-button size="mini" type="warning" @click="banProduce([variation.id], false)">取消禁产</el-button>
              </div>
              <div v-else>
                <el-button size="mini" type="primary" @click="banProduce([variation.id], true)">设置禁产</el-button>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="标记" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(variation, index) in row.variations" :key="index">
              <el-tag type="primary" size="mini" v-for="(t, index) in variation.tags" :key="index"
                      @close="handleRemoveTag(t.id)"
                      closable :disable-transitions="false">{{ t.user_id ? `${t.content}-私` : `${t.content}-共` }}
              </el-tag>

              <el-autocomplete
                  class="input-new-tag"
                  v-if="input.visible && input.id === variation.id"
                  v-model="input.value"
                  :placeholder="input.is_pub ? '所有人可见' : '自己可见'"
                  :ref="`tagConfirm_${variation.id}`"
                  size="mini"
                  :maxlength="10"
                  @keyup.enter.native="handleInputConfirm"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
              >
                <template slot-scope="{ item }">
                  <div>{{ item.user_id ? `${item.content}-私` : `${item.content}-共` }}</div>
                </template>
                <el-select size="mini" v-model="input.is_pub" slot="prepend" placeholder="请选择" style="width: 60px;">
                  <el-option label="共" :value="true"></el-option>
                  <el-option label="私" :value="false"></el-option>
                </el-select>
                <el-button slot="append" size="mini" type="primary" @click="handleInputConfirm"
                           icon="el-icon-success"></el-button>
                <el-button slot="append" size="mini" type="primary" @click="closeInput"
                           icon="el-icon-error"></el-button>
              </el-autocomplete>
              <template v-else>
                <template v-if="variation.tags.length">
                  <el-button type="primary" class="button-new-tag" size="mini" @click="showInput(variation)"
                             icon="el-icon-plus"></el-button>
                </template>
                <div v-else>
                  <el-button type="primary" class="button-new-tag" style="width: 100%;" size="mini"
                             @click="showInput(variation)">+标签
                  </el-button>
                </div>
              </template>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <div slot-scope="{row}">
            <div v-if="row.select">
              <div>
                <el-tag type="primary" size="mini">
                  创建时间：{{ new Date(row.created_at).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.selected_time">
                  选品时间：{{ new Date(row.select.selected_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.sample_post_time">
                  可寄样时间：{{ new Date(row.select.sample_post_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.sample_posting_finished_time">
                  寄样完成时间：{{ new Date(row.select.sample_posting_finished_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.qc_completed_time">
                  审版完成时间：{{ new Date(row.select.qc_completed_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.price_verification_time">
                  价格确认时间：{{ new Date(row.select.price_verification_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.first_purchase_time">
                  首单创建时间：{{ new Date(row.select.first_purchase_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="primary" size="mini" v-if="row.select.added_to_site_time">
                  加入站点时间：{{ new Date(row.select.added_to_site_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="danger" effect="dark" size="mini" v-if="row.select.un_published_time">
                  下架时间：{{ new Date(row.select.un_published_time).toLocaleString() }}
                </el-tag>
              </div>
              <div>
                <el-tag type="danger" effect="dark" size="mini" v-if="row.select.terminated_time">
                  终止时间：{{ new Date(row.select.terminated_time).toLocaleString() }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-row>
              <!--              <el-col :span="12">-->
              <!--                <el-button type="primary" size="mini" style="width: 100%" @click="openCountryDaily(row.id)" plain>-->
              <!--                  国家订单-->
              <!--                </el-button>-->
              <!--              </el-col>-->
              <!--              <el-col :span="12">-->
              <!--                <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单-->
              <!--                </el-button>-->
              <!--              </el-col>-->
              <el-col :span="24">
                <el-button type="primary" size="mini" style="width: 100%" @click="batchSync([row])" plain>同步
                </el-button>
              </el-col>
              <el-col :span="24"
                      v-if="canOpenJit(row)">
                <el-button type="warning" size="mini" style="width: 100%" @click="batchOpenJit([row])"
                           :disabled="!canOpenJit(row)" plain>开通jit
                </el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="danger" @click="createProduct(row)">创建产品</el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="primary" @click="oneKeyTransport([row])">迁移</el-button>
              </el-col>
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
    <TemuDlgOpenJitFail :list="dlgOpenJit.list" :visible="dlgOpenJit.visible" @close="dlgOpenJit.visible=false"></TemuDlgOpenJitFail>
    <TemuDlgOneKeyTransport :ids="dlgOneKeyTransport.ids" :accounts="accountOptions" :visible="dlgOneKeyTransport.visible" @close="dlgOneKeyTransport.visible=false"></TemuDlgOneKeyTransport>
    <KdxDlgScanner :visible="scanner.visible" @close="scanner.visible=false"
                   @result="handleScannerResult"></KdxDlgScanner>
    <TemuDlgStockBatch :account-options="accountOptions" :ids="[stock.id]" :sku_ids="stock.sku_id ? [stock.sku_id] : []"
                       :visible="stock.visible" @close="stock.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :dxm_sku="stockBySku.sku" :visible="stockBySku.visible"
                       @close="stockBySku.visible=false"></TemuDlgStockBatch>
    <TemuDlgStockBatch :account-options="accountOptions" :ids="stockBatch.ids" :visible="stockBatch.visible"
                       @close="stockBatch.visible=false"></TemuDlgStockBatch>
    <TemuDlgImageEdit :content="image_edit.content" :sku_ext_code="image_edit.sku_code" :visible="image_edit.visible"
                      @close="image_edit.visible=false"></TemuDlgImageEdit>
    <TemuDlgBatchModifySkuCode :visible="batchModifySkuCodeDlg.visible" @close="batchModifySkuCodeDlg.visible=false"
                               @update="getTableData"></TemuDlgBatchModifySkuCode>
    <TemuDlgBatchAdjustPrice :rows="batchAdjustPriceDlg.rows" :visible="batchAdjustPriceDlg.visible"
                             @close="batchAdjustPriceDlg.visible=false"
                             @update="getTableData"></TemuDlgBatchAdjustPrice>
    <TemuDlgDownloadImages :ids="dlgDownloadImages.ids" :visible="dlgDownloadImages.visible"
                           @close="dlgDownloadImages.visible=false"></TemuDlgDownloadImages>
    <TemuDlgChangeMinStock :rows="dlgChangeMinStockRows.list" :visible="dlgChangeMinStockRows.visible"
                           @close="dlgChangeMinStockRows.visible=false" @suc="getTableData"></TemuDlgChangeMinStock>
    <TemuDlgStockAllocate :sku_ids="dlgChangeSemiStockRows.sku_ids" :visible="dlgChangeSemiStockRows.visible"
                          @close="dlgChangeSemiStockRows.visible=false" @suc="getTableData"></TemuDlgStockAllocate>
    <TemuDlgSimpleProductUpload :list="uploadDlg.array" :visible="uploadDlg.visible" @close="uploadDlg.visible=false"
                                @suc="getTableData"></TemuDlgSimpleProductUpload>
    <TemuDlgBatchReplyPrice :rows="dlgPriceReviews.list" :visible="dlgPriceReviews.visible"
                            @close="dlgPriceReviews.visible=false"
                            @suc="getTableData"></TemuDlgBatchReplyPrice>
    <TemuDlgBatchCustomize :ids="batchCustomizeDlg.ids" :visible="batchCustomizeDlg.visible"
                           @close="batchCustomizeDlg.visible=false"
                           @suc="getTableData"></TemuDlgBatchCustomize>
    <TemuDlgSendCustomerService :list="customerServiceSendDlg.rows" :tool_id="customerServiceSendDlg.tool_id"
                                :visible="customerServiceSendDlg.visible"
                                @close="customerServiceSendDlg.visible=false"></TemuDlgSendCustomerService>
    <DlgProductCreate :id="dlgProductCreate.id"  :visible="dlgProductCreate.visible" @close="dlgProductCreate.visible=false"></DlgProductCreate>
    <DlgProductBatchCreate :ids="dlgProductBatchCreate.ids"  :visible="dlgProductBatchCreate.visible" @close="dlgProductBatchCreate.visible=false"></DlgProductBatchCreate>
    <TemuDlgVideoBatch :ids="dlgBatchVideo.ids" :visible="dlgBatchVideo.visible" @close="dlgBatchVideo.visible=false" @suc="getTableData"></TemuDlgVideoBatch>
  </div>

</template>

<script>
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import infoList from '@/components/mixins/infoList'
import {
  saleItemBan,
  saleItemDxmInventoryFix,
  saleItemEditSku,
  itemChangeMinStock,
  itemAddVirtualStock, saleItemBanProduce
} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image";
import TemuDlgPlans from "@/view/temu/components/dlg_plans";
import TemuDlgDaily from "@/view/temu/sale/components//dlg_daily";
import TemuDlgCost from "@/view/temu/sale/components//dlg_cost";
import TemuDlgDxmGoods from "@/view/temu/sale/components//dlg_dxm_goods";
import {accountList} from "../../../api/temu/account";
import {dxmSync} from "../../../api/dxm/sync";
import {dxmGoodsId} from "@/api/dxm/goods";
import FDlgUploadBarcode from "@/view/sf-factory/components/dlg_upload_barcode.vue";
import TemuDlgFixInventory from "@/view/temu/components/dlg_fix_inventory.vue";
import TemuDlgCustomize from "@/view/temu/components/dlg_customize.vue";
import {itemCountDown} from "@/api/temu/sale_item";
import {tagList, tagRemove, tagAdd} from "@/api/temu/tag";
import KdxDlgScanner from "@/view/components/scanner.vue";
import TemuDlgImageEdit from "@/view/temu/sale/components/dlg_image_edit.vue";
import TemuDlgImageReview from "@/view/temu/sale/components/dlg_image_review.vue";
import TemuDlgStockBatch from "@/view/temu/sale/components/dlg_stock_batch.vue";
import {stockSync} from "@/api/temu/stock";
import TemuDlgReview from "@/view/temu/review/dlg_review.vue";
import TemuDlgCountryDaily from "@/view/temu/sale/components/dlg_country_daily.vue";
import TemuDlgBatchModifySkuCode from "@/view/temu/sale/components/dlg_batch_modify_sku_code.vue";
import {saleDownloadImages} from "@/api/temu/sale";
import TemuDlgDownloadImages from "@/view/temu/sale/components/dlg_download_images.vue";
import {simpleProductCreateBySaleItem} from "@/api/temu/simple_product";
import TemuDlgSimpleProductUpload from "@/view/temu/simple_product/dlg_upload.vue";
import TemuDlgBatchAdjustPrice from "@/view/temu/sale/components/dlg_batch_adjust_price.vue";
import TemuDlgChangeMinStock from "@/view/temu/sale/components/dlg_change_min_stock.vue";
import {
  productBatchEditShipment,
  productList,
  productOpenJit,
  productSync
} from "@/api/temu/product";
import TemuDlgStockAllocate from "@/view/oversea_warehouse/components/dlg_stock_allocate.vue";
import TemuDlgBatchReplyPrice from "@/view/temu/product/components/dlg_batch_reply_price.vue";
import TemuDlgBatchCustomize from "@/view/temu/product/components/dlg_batch_customize.vue";
import TemuDlgSendCustomerService from "@/view/temu/components/dlg_send_customer_service.vue";
import TemuDlgOpenJitFail from "@/view/temu/product/components/dlg_open_jit_fail.vue";
import DlgProductCreate from "@/view/product/components/dlg_create_product.vue";
import TemuDlgOneKeyTransport from "@/view/temu/product/components/dlg_one_key_transport.vue";
import DlgProductBatchCreate from "@/view/product/components/dlg_batch_create_product.vue";
import {updateCompliancePropertyForBatch} from "@/api/temu/compliance_property";
import {shoutRealPictureUploadByPrefix} from "@/api/temu/shout_real_picture";
import TemuDlgVideoBatch from "@/view/temu/components/dlg_video_batch.vue";
import TemuDlgVideoSelector from "@/view/temu/components/dlg_video_selector.vue";
import {categoryListSearchLeaf} from "@/api/temu/category";
import {Notification} from "element-ui";

export default {
  components: {
    TemuDlgVideoSelector,
    TemuDlgVideoBatch,
    TemuDlgOneKeyTransport,
    DlgProductCreate,
    TemuDlgOpenJitFail,
    TemuDlgSendCustomerService,
    TemuDlgBatchCustomize,
    TemuDlgBatchReplyPrice,
    TemuDlgStockAllocate,
    TemuDlgChangeMinStock,
    TemuDlgBatchAdjustPrice,
    TemuDlgSimpleProductUpload,
    TemuDlgDownloadImages,
    TemuDlgBatchModifySkuCode,
    TemuDlgImageEdit,
    TemuDlgCountryDaily,
    TemuDlgReview,
    TemuDlgStockBatch,
    TemuDlgImageReview,
    KdxDlgScanner,
    TemuDlgFixInventory,
    TemuDlgCustomize,
    FDlgUploadBarcode,
    TemuDlgCost,
    TemuDlgDaily,
    TemuDlgPlans,
    TemuDlgDxmGoods,
    KdxImage,
    DlgProductBatchCreate
  },
  mixins: [infoList],
  // watch: {
  //   searchInfo: {
  //     handler() {
  //       if (this.timeoutId) {
  //         clearTimeout(this.timeoutId)
  //         this.timeoutId = undefined
  //       }
  //       this.timeoutId = setTimeout(()=>{
  //         this.page = 1
  //         this.getTableData()
  //       }, 1000)
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },
  data() {
    return {
      listApi: productList,
      isMobile: false,
      show_other: false,

      timeoutId: undefined,

      selectRows: [],
      uploadDlg: {
        array: [],
        visible: false,
      },

      editSku: {
        id: undefined,
        sku: undefined,
      },

      image_edit: {
        sku_id: undefined,
        sku_code: undefined,
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

      dlgChangeSemiStockRows: {
        sku_ids: [],
        visible: false,
      },

      batchModifySkuCodeDlg: {
        visible: false,
      },

      batchAdjustPriceDlg: {
        rows: [],
        visible: false,
      },

      customerServiceSendDlg: {
        rows: [],
        tool_id: 0,
        visible: false,
      },

      dlgProductCreate: {
        id: undefined,
        visible: false,
      },

      batchCustomizeDlg: {
        ids: [],
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

      dlgOpenJit: {
        list: [],
        visible: false,
      },

      dlgOneKeyTransport: {
        ids: [],
        visible: false,
      },

      dlgJit: {
        id: undefined,
        visible: false,
      },

      dlgBatchVideo: {
        ids: [],
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

      dlgPriceReviews: {
        list: [],
        visible: false
      },

      virtual_stock: {
        add: 0,
        min: 0,
        seven_coef: 0,
      },

      accountOptions: [],
      categoryOptions: [],
      tagOptions: [],
      selectStatusOptions: [
        {id: 1, name: "未发布"},
        {id: 14, name: "未发布-待修改"},
        {id: 15, name: "未发布-修改完成"},
        {id: 16, name: "未发布"},
        {id: 3, name: "待寄样"},
        {id: 4, name: "寄样中"},
        {id: 5, name: "审版中"},
        {id: 6, name: "审版不合格"},
        {id: 7, name: "价格申报中"},
        {id: 9, name: "价格已作废"},
        {id: 10, name: "待创建首单"},
        {id: 11, name: "已创建首单"},
        {id: 12, name: "已发布到站点"},
        {id: 13, name: "已下架"},
        {id: 17, name: "已终止"},
      ],
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

      dlgProductBatchCreate: {
        ids: [],
        visible: false,
      }
    }
  },
  computed: {
    changeMinStockRows() {
      let items = []
      for (const row of this.selectRows) {
        if (row.product_type === 2 || row.product_type === 3) {
          items.push(...row.variations)
        }
      }
      return items
    },
    changeSemiStockRows() {
      let items = []
      for (const row of this.selectRows) {
        if (row.is_semi) {
          items.push(...row.variations)
        }
      }
      return items
    },
    customizeSelectRows() {
      return (this.selectRows || []).filter((item) => {
        return item.product_type === 3
      })
    },
    canOpenJitRows() {
      return (this.selectRows || []).filter((item) => {
        return this.canOpenJit(item)
      })
    },
    canY2Rows() {
      return (this.selectRows || []).filter((item) => {
        return item.is_semi && !item.is_y2
      })
    },
    canSemiRows() {
      return (this.selectRows || []).filter((item) => {
        return item.is_semi && item.is_y2
      })
    },
    canBanIds() {
      let ids = [];
      (this.selectRows || []).forEach((item) => {
        item.variations.forEach((v) => {
          if (!v.ban) {
            ids.push(v.id)
          }
        })
      })
      return ids
    },
    canCancelBanIds() {
      let ids = [];
      (this.selectRows || []).forEach((item) => {
        item.variations.forEach((v) => {
          if (v.ban) {
            ids.push(v.id)
          }
        })
      })
      return ids
    },
    replyPriceRows() {
      let list = []
      for (const row of this.selectRows) {
        if (!row.select || row.select.status !== 7) {
          continue
        }

        for (const info of row.select.review_infos) {
          if (info.status !== 1) {
            continue
          }

          if (!info.price) {
            continue
          }

          for (const review of info.reviews) {
            let variation = row.variations.find((item) => {
              return review.id === item.id
            })
            if (!variation) {
              continue
            }

            review.variation = variation
          }

          list.push(info)
        }
      }
      return list
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
    selectStatusName(row) {
      if (!row) {
        return "待选品"
      }
      let op = this.selectStatusOptions.find((item) => {
        return item.id === row.status
      })
      if (op) {
        return op.name
      }
      return `未知状态: ${row.status}`
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
      this.imageReview.id = row.id
      this.imageReview.visible = true
    },
    canOpenJit(row) {
      return !row.is_semi && row.product_type === 1 && row.select && (row.select.apply_jit_status === 1 || row.select.apply_jit_status === 2)
    },
    openImageEdit(row) {
      this.image_edit.content = String(row.id)
      this.image_edit.sku_code = row.sku_ext_code
      this.image_edit.visible = true
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
    selectionChange(val) {
      this.selectRows = val
      let ids = this.selectRows.map(s => s.product_skc_id)
      if (ids.length) {
        this.copy(ids.join((" ")))

        let extCodes = []
        let variationIds = []
        this.selectRows.forEach((row) => {
          row.variations.forEach((variation) => {
            if (extCodes.indexOf(variation.ext_code) < 0) {
              extCodes.push(variation.ext_code)
            }
            variationIds.push(variation.id)
          })
        })
        if (extCodes.length > 0) {
          Notification({
            showClose: true,
            dangerouslyUseHTMLString: true,
            title: '货号是',
            message: extCodes.join(" "),
            offset: 150,
            duration: 15000,
            type: 'info'
          })
        }
        if (variationIds.length > 0) {
          setTimeout(() => {
            Notification({
              showClose: true,
              dangerouslyUseHTMLString: true,
              title: 'Sku Ids是',
              message: variationIds.join(" "),
              offset: 150,
              duration: 15000,
              type: 'info'
            })
          }, 100)
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
          this.show_other = true
          this.$set(this.searchInfo, "spu_ids", content)
          break
        }
        case 9: {
          this.show_other = true
          this.$set(this.searchInfo, "label_codes", content)
          break
        }
      }
      this.getTableData()
    },
    // 回复
    onReplyPrice(row, infos) {
      let list = []
      for (const info of infos) {
        if (info.status !== 1) {
          continue
        }

        if (!info.price) {
          this.$message.error("没有找到还价")
          return
        }

        for (const review of info.reviews) {
          let variation = row.variations.find((item) => {
            return review.id === item.id
          })
          if (!variation) {
            this.$message.error("没找到产品")
            return
          }

          review.variation = variation
        }

        list.push(info)
      }
      if (list.length <= 0) {
        this.$message.error("当前没有需要还价的")
        return
      }

      this.dlgPriceReviews.list = list
      this.dlgPriceReviews.visible = true
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
    async ban(ids, is_ban) {
      let resp = await saleItemBan({ids: ids, is_ban: is_ban})
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
    async batchEditShipment(rows, isY2) {
      let resp = await productBatchEditShipment({ids: rows.map((item) => {return item.id}), is_y2: isY2})
      if (resp.code) {
        return
      }

      this.batchSync(rows)
    },
    batchVideo(rows) {
      this.dlgBatchVideo.ids = rows.map((item) => {return item.id})
      this.dlgBatchVideo.visible = true
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
        if (item.sale) {
          ids.push(item.sale.product_skc_id)
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
      this.syncTags()
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
        this.syncTags()
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
    async syncTags() {
      let resp = await tagList()
      if (resp.code === 0) {
        this.tagOptions = resp.data
      }
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
    async searchCategoryList(query) {
      if (!query) {
        return
      }

      let resp = await categoryListSearchLeaf({query: query})
      if (resp.code) {
        this.$message.error("搜索出错")
        return
      }

      this.categoryOptions = resp.data
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
          this.image_edit.content = this.selectRows.map((item) => {
            return String(item.id)
          }).join(" ")
          this.image_edit.sku_code = undefined
          this.image_edit.visible = true
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
          this.openChangeMinStock(this.changeMinStockRows)
          return
        }
        case "openChangeSemiStock": {
          this.openChangeSemiStock(this.changeSemiStockRows)
          return
        }
        case "openReplyPrice": {
          this.dlgPriceReviews.list = this.replyPriceRows
          this.dlgPriceReviews.visible = true
          return
        }
        case "createFromSaleItems": {
          this.uploadBySaleItem(this.selectRows)
          return
        }
        case "batchSync": {
          this.batchSync(this.selectRows)
          return
        }
        case "batchOpenJit": {
          this.batchOpenJit(this.canOpenJitRows)
          return
        }
        case "batchAddSite": {
          this.batchCustomerServiceSend(this.selectRows, 2406230000016, 1)
          return
        }
        case "batchProductDown": {
          this.batchCustomerServiceSend(this.selectRows, 2406230000031, 1)
          return
        }
        case "batchPriceRefresh": {
          this.batchCustomerServiceSend(this.selectRows, 2406280000031, 2)
          return
        }
        case "batchOpenJitV2": {
          this.batchCustomerServiceSend(this.canOpenJitRows, 2407170000010, 1)
          return
        }
        case "oneKeyTransport": {
          this.oneKeyTransport(this.selectRows)
          return
        }
        case "batchCustomize": {
          this.batchCustomize(this.customizeSelectRows)
          return
        }
        case "batchCreate": {
          this.dlgProductBatchCreate.ids = this.selectRows.map(item => item.id);
          this.dlgProductBatchCreate.visible = true
          return
        }
        case "batchUpdateCompliance": {
          this.batchUpdateCompliance(this.selectRows)
          return
        }
        case "batchUpdateShoutRealPicture": {
          this.batchUpdateShoutRealPicture(this.selectRows)
          return
        }
        case "batchBan": {
          this.ban(this.canBanIds, true)
          return
        }
        case "batchCancelBan": {
          this.ban(this.canCancelBanIds, false)
          return
        }
        case "batchY2": {
          this.batchEditShipment(this.canY2Rows, true)
          return
        }
        case "batchSemi": {
          this.batchEditShipment(this.canSemiRows, false)
          return
        }
        case "batchVideo": {
          this.batchVideo(this.selectRows)
          return
        }
        case "batchExportTitle": {
          const data = this.selectRows.map(item => {
            return item.variations.map(el => {
              return { 
                name: item.product_name, 
                skc: item.product_skc_id, 
                ext_code: el.ext_code 
              }
            })
          }).flat();
          const workbook = new ExcelJS.Workbook();
          const sheet1 = workbook.addWorksheet("sheet1");
          sheet1.columns = [
            { header: "货号", key: "ext_code", width: 20 },
            { header: "SKC", key: "skc", width: 20 },
            { header: "标题", key: "name", width: 150 },
          ]
          data.forEach((item) => sheet1.addRow(item))
          workbook.xlsx.writeBuffer().then((buffer) => {
            FileSaver.saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${new Date().toLocaleString()}.xlsx`);
          });
          return
        }
      }
    },
    openChangeMinStock(rows) {
      this.dlgChangeMinStockRows.list = rows
      this.dlgChangeMinStockRows.visible = true
    },
    openChangeSemiStock(rows) {
      this.dlgChangeSemiStockRows.sku_ids = rows.map((item) => {
        return item.id
      })
      this.dlgChangeSemiStockRows.visible = true
    },
    skcReview(row) {
      if (row.review) {
        return `${row.review.count}(${row.review.score.toFixed(2)})`
      } else {
        return ""
      }
    },
    skuReview(row) {
      if (row.review) {
        return `${row.review.count}(${row.review.score.toFixed(2)})`
      } else {
        return ""
      }
    },
    showVirtualStock(row) {
      this.virtual_stock.min = row.virtual_stock.min_stock
      this.virtual_stock.seven_coef = row.virtual_stock.seven_coef
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
    async uploadBySaleItem(items) {
      let ids = []
      items.forEach((item) => {
        item.variations.forEach((v) => {
          ids.push(v.id)
        })
      })
      let resp = await simpleProductCreateBySaleItem({ids: ids})
      if (resp.code) {
        return
      }
      this.uploadDlg.array = resp.data
      this.uploadDlg.visible = true
    },
    async batchSync(rows) {
      let resp = await productSync({
        ids: rows.map((item) => {
          return item.id
        })
      })
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    batchCustomerServiceSend(rows, toolId, dataType) {
      if (dataType === 1) {
        this.customerServiceSendDlg.rows = rows.map((item) => {
          return {
            account_id: item.account_id,
            name: item.product_name,
            img: item.main_image_url,
            dataId: `${item.product_skc_id}`,
          }
        })
      } else {
        let list = []
        for (const row of rows) {
          for (const variation of row.variations) {
            list.push({
              account_id: row.account_id,
              name: row.product_name,
              img: variation.thumb_url,
              dataId: `${variation.id}`,
            })
          }
        }
        this.customerServiceSendDlg.rows = list
      }
      this.customerServiceSendDlg.tool_id = toolId
      this.customerServiceSendDlg.visible = true
    },
    async batchOpenJit(rows) {
      let resp = await productOpenJit({
        ids: rows.map((item) => {
          return item.id
        })
      })
      if (resp.code) {
        return
      }

      if (resp.data && resp.data.length > 0) {
        this.dlgOpenJit.list = resp.data
        this.dlgOpenJit.visible = true
      }

      this.$message("开启成功")
      this.getTableData()
    },
    async oneKeyTransport(rows) {
      this.dlgOneKeyTransport.ids = rows.map((row) => {return row.id})
      this.dlgOneKeyTransport.visible = true
    },
    async batchCustomize(list) {
      this.batchCustomizeDlg.ids = list.map((item) => {
        return item.id
      })
      this.batchCustomizeDlg.visible = true
    },
    async batchUpdateCompliance(rows) {
      let resp = await updateCompliancePropertyForBatch({ ids: rows.map((item) => {return item.id}) });
      if (resp.code) {
        return
      }

      this.$message("操作成功")
    },
    async batchUpdateShoutRealPicture(rows) {
      let resp = await shoutRealPictureUploadByPrefix({spu_ids: rows.map((item) => {return item.id}) });
      if (resp.code) {
        return
      }

      this.$message("操作成功")
    },
    createProduct(row) {
      this.dlgProductCreate.id = row.id
      this.dlgProductCreate.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

    this.$set(this.searchInfo, "reply_price_type", "")

    this.$set(this.searchInfo, "is_ban", 1)
    // this.$set(this.searchInfo, "select_status", 12)
    this.$set(this.searchInfo, "dxm_goods_sku_type", "")
    this.$set(this.searchInfo, "buyer_name_type", "")
    this.$set(this.searchInfo, "sku_code_type", 1)
    this.$set(this.searchInfo, "exclude_sku_code_type", 1)

    this.$set(this.searchInfo, "search_cond", 1)
    this.$set(this.searchInfo, "include_tag", true)
    this.$set(this.searchInfo, "other_cond", [23])

    // TODO
    if (this.$route.query && this.$route.query.dxm_sku) {
      this.$set(this.searchInfo, "dxm_goods_sku_type", 1)
      this.$set(this.searchInfo, "dxm_goods_sku", this.$route.query.dxm_sku)
    }

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    // resp = await categoryExistList()
    // if (resp.code === 0) {
    //   this.categoryOptions = resp.data
    // }
    this.syncTags()
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
    height: 80px;
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

.el-row {
  padding: 0;
  display: flex;
  flex-wrap: wrap;

  .el-col > label {
    line-height: 30px;
    text-align: right;
    width: 80%;
    padding-right: 15px;
    display: inline-block;
  }

  .line {
    line-height: 30px;
    text-align: center;
  }
}
</style>