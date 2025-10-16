<template>
    <div>
        <div class="search-term">
            <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
              <el-row :gutter="5">
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                      <el-option v-for="(item, index) in accountOptions" :key="index" :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.categories" placeholder="请选择类目" multiple collapse-tags filterable clearable style="width: 100%">
                      <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-row>
                      <el-col :span="8">
                        <el-select class="select" size="mini" v-model="searchInfo.include_tag" style="width: 100%;">
                          <el-option label="含" :value="true"></el-option>
                          <el-option label="不含" :value="false"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="16">
                        <el-select v-model="searchInfo.tags" placeholder="请选择标签" multiple collapse-tags filterable clearable style="width: 100%">
                          <el-option v-for="(item, index) in tagOptions" :key="index" :value="item.content" :label="item.user_id ? `${item.content}-私` : `${item.content}-共`">
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
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-input placeholder="小秘Sku" v-model="searchInfo.dxm_goods_sku" clearable filterable @keyup.enter.native="onSubmit">
                      <el-select class="select" v-model="searchInfo.dxm_goods_sku_type" slot="prepend" filterable style="width: 60px">
                        <el-option label="精确" value=""></el-option>
                        <el-option label="模糊" :value="1"></el-option>
                        <el-option label="右模" :value="2"></el-option>
                        <el-option label="左模" :value="3"></el-option>
                        <el-option label="全匹配" :value="4"></el-option>
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
                      <el-option label="" value=""></el-option>
                      <el-option label="未禁售" :value="1"></el-option>
                      <el-option label="已禁售" :value="2"></el-option>
                      <el-option label="已禁售-手动" :value="3"></el-option>
                      <el-option label="已禁售-单量过低" :value="4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="1">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_ban_produce" placeholder="是否禁产" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="未禁产" :value="1"></el-option>
                      <el-option label="已禁产" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.select_status" placeholder="站点状态" filterable clearable style="width: 100%">
                      <el-option label="待下首单" :value="10"></el-option>
                      <el-option label="已下首单" :value="11"></el-option>
                      <el-option label="已加入站点" :value="12"></el-option>
                      <el-option label="已下架终止" :value="13"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-input placeholder="买手名字" v-model="searchInfo.buyer_name" clearable filterable @keyup.enter.native="onSubmit">
                      <el-select class="select" v-model="searchInfo.buyer_name_type" slot="prepend" filterable style="width: 60px">
                        <el-option label="精确" value=""></el-option>
                        <el-option label="模糊" :value="1"></el-option>
                        <el-option label="右模" :value="2"></el-option>
                        <el-option label="左模" :value="3"></el-option>
                        <el-option label="全匹配" :value="4"></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="5">
                  <el-form-item label-width="0">
                    <el-input size="mini" v-model="searchInfo.sku_code" clearable placeholder="货号，逗号分隔" @keyup.enter.native="onSubmit">
                      <el-select class="select" slot="prepend" v-model="searchInfo.sku_code_type" filterable style="width: 60px">
                        <el-option label="精确" value=""></el-option>
                        <el-option label="模糊" :value="1"></el-option>
                        <el-option label="右模" :value="2"></el-option>
                        <el-option label="左模" :value="3"></el-option>
                        <el-option label="全匹配" :value="4"></el-option>
                      </el-select>

                      <el-select size="mini" v-model="searchInfo.sku_codes" slot="append" placeholder="货号分类选择" multiple collapse-tags filterable clearable style="width: 150px">
                        <el-option
                            v-for="item in skuCodeOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="5">
                  <el-form-item label-width="0">
                    <el-input size="mini" v-model="searchInfo.exclude_sku_code" clearable placeholder="排除货号，逗号分隔" @keyup.enter.native="onSubmit">
                      <el-select class="select" slot="prepend" v-model="searchInfo.exclude_sku_code_type" filterable style="width: 60px">
                        <el-option label="精确" value=""></el-option>
                        <el-option label="模糊" :value="1"></el-option>
                        <el-option label="右模" :value="2"></el-option>
                        <el-option label="左模" :value="3"></el-option>
                        <el-option label="全匹配" :value="4"></el-option>
                      </el-select>

                      <el-select size="mini" v-model="searchInfo.exclude_sku_codes" slot="append" placeholder="排除货号分类选择" multiple collapse-tags filterable clearable style="width: 150px">
                        <el-option
                            v-for="item in skuCodeOptions"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.bei_huo_days" placeholder="备货天数" multiple collapse-tags filterable clearable style="width: 100%">
                      <el-option v-for="(item, index) in beiHuoDaysCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable style="width: 100%">
                      <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_hot" placeholder="热销款" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="热销款" :value="1"></el-option>
                      <el-option label="非热销款" :value="2"></el-option>
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
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_factory" placeholder="是否工厂" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="工厂" :value="1"></el-option>
                      <el-option label="非工厂" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.stock_types" placeholder="库存类型" multiple collapse-tags filterable clearable style="width: 100%">
                      <el-option label="VMI" :value="1"></el-option>
                      <el-option label="JIT" :value="2"></el-option>
                      <el-option label="定制" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.ad_type" placeholder="广告类型" filterable clearable style="width: 100%">
                      <el-option label="高级广告" :value="1"></el-option>
                      <el-option label="普通广告" :value="2"></el-option>
                      <el-option label="无广告" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_buy_today" placeholder="今日是否采购" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="今日未采购" :value="1"></el-option>
                      <el-option label="今日已采购" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-input-number v-model="searchInfo.no_order_days" placeholder="多少天未出单" size="mini" style="width: 100%" :min="0" :precision="0"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select placeholder="是否禁止备货" v-model="searchInfo.is_reduce_price_pass" clearable filterable style="width: 100%">
                      <el-option label="禁止备货" :value="1"></el-option>
                      <el-option label="未禁止备货" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
<!--                <el-col :xs="12" :sm="6" :lg="2">-->
<!--                  <el-form-item label-width="0">-->
<!--                    <el-select placeholder="是否有活动可以申请" v-model="searchInfo.has_activity_can_apply" clearable filterable style="width: 100%">-->
<!--                      <el-option label="" value=""></el-option>-->
<!--                      <el-option label="有活动" :value="true"></el-option>-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
                <el-col :xs="12" :sm="6" :lg="2">
                  <el-form-item label-width="0">
                    <el-select placeholder="是否限流中" v-model="searchInfo.is_search_limit" clearable filterable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="高价限流" :value="1"></el-option>
<!--                      <el-option label="高价限流(日常+活动)" :value="2"></el-option>-->
<!--                      <el-option label="高价限流(日常价)" :value="3"></el-option>-->
<!--                      <el-option label="即将高价限流" :value="4"></el-option>-->
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
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_dxm_match" placeholder="是否配对" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="已配对" :value="1"></el-option>
                      <el-option label="未配对" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_image_processed" placeholder="图审状态" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="图审已过" :value="1"></el-option>
                      <el-option label="图审未过" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-select placeholder="资质上传" v-model="searchInfo.need_upload_cert" clearable filterable style="width: 100%">
                      <el-option label="无需上传资质" :value="1"></el-option>
                      <el-option label="需上传资质" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
<!--                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">-->
<!--                  <el-form-item label-width="0">-->
<!--                    <el-select placeholder="需要资质国家" v-model="searchInfo.cert_country" filterable style="width: 100%">-->
<!--                      <el-option label="美国" :value="1"></el-option>-->
<!--                      <el-option label="加拿大" :value="2"></el-option>-->
<!--                      <el-option label="英国" :value="3"></el-option>-->
<!--                      <el-option label="法国" :value="4"></el-option>-->
<!--                      <el-option label="德国" :value="5"></el-option>-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小可售天数" v-model="searchInfo.sale_days_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大可售天数" v-model="searchInfo.sale_days_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小建议备货量" v-model="searchInfo.advice_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大建议备货量" v-model="searchInfo.advice_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小建议采购量" v-model="searchInfo.buy_count_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大建议采购量" v-model="searchInfo.buy_count_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="仓内最小可售天数" v-model="searchInfo.sale_inventory_days_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="仓内最大可售天数" v-model="searchInfo.sale_inventory_days_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小小秘剩余" v-model="searchInfo.dxm_left_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大小秘剩余" v-model="searchInfo.dxm_left_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小小秘总剩余" v-model="searchInfo.dxm_total_left_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大小秘总剩余" v-model="searchInfo.dxm_total_left_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小待发件" v-model="searchInfo.wait_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大待发件" v-model="searchInfo.wait_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小总发出" v-model="searchInfo.total_plan_count_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大总发出" v-model="searchInfo.total_plan_count_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最小在途" v-model="searchInfo.on_way_min" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                      <el-input class="input-right-zero" placeholder="最大在途" v-model="searchInfo.on_way_max" clearable filterable @keyup.enter.native="onSubmit">
                      </el-input>
                    </el-col>
                  </el-form-item>
                </el-col>
<!--                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">-->
<!--                  <el-form-item label-width="0">-->
<!--                    <el-col :span="11">-->
<!--                      <el-input class="input-right-zero" placeholder="最小1星率" v-model="searchInfo.one_star_rate_min" clearable filterable @keyup.enter.native="onSubmit">-->
<!--                      </el-input>-->
<!--                    </el-col>-->
<!--                    <el-col class="line" :span="2">-</el-col>-->
<!--                    <el-col :span="11">-->
<!--                      <el-input class="input-right-zero" placeholder="最大1星率" v-model="searchInfo.one_star_rate_max" clearable filterable @keyup.enter.native="onSubmit">-->
<!--                      </el-input>-->
<!--                    </el-col>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
<!--                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">-->
<!--                  <el-form-item label-width="0">-->
<!--                    <el-select v-model="searchInfo.is_jg" placeholder="是否加工商品" filterable clearable style="width: 100%">-->
<!--                      <el-option label="" value=""></el-option>-->
<!--                      <el-option label="加工商品" :value="1"></el-option>-->
<!--                      <el-option label="非加工商品" :value="2"></el-option>-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-input class="input-right-zero" placeholder="条码Id，空格分隔" v-model="searchInfo.label_codes" clearable filterable></el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.is_dh" placeholder="是否断货" filterable clearable style="width: 100%">
                      <el-option label="" value=""></el-option>
                      <el-option label="已断货" :value="1"></el-option>
                      <el-option label="未断货" :value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="3" v-if="show_other">
                  <el-form-item label-width="0">
                    <el-input v-model="searchInfo.title" type="primary" placeholder="标题" clearable @keyup.enter.native="onSubmit"></el-input>
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
                        <el-dropdown-item command="syncAdvice">同步备货</el-dropdown-item>
                        <el-dropdown-item command="openStockBatch">批量备货</el-dropdown-item>
                        <el-dropdown-item command="openImageEdit" v-if="selectRows.length">改图</el-dropdown-item>
                        <el-dropdown-item command="openImageEditV2" v-if="selectRows.length">改图V2</el-dropdown-item>
                        <el-dropdown-item command="openBatchModifySkuCode">批量改货号</el-dropdown-item>
                        <el-dropdown-item command="openBatchAdjustPrice" v-if="selectRows.length">批量调价</el-dropdown-item>
                        <el-dropdown-item command="downloadImages">下载图片列表</el-dropdown-item>
                        <el-dropdown-item command="openChangeMinStock" v-if="changeMinStockRows.length">批量调整JIT/定制库存</el-dropdown-item>
                        <el-dropdown-item command="createFromSaleItems" v-if="selectRows.length">批量复制上架</el-dropdown-item>
                        <el-dropdown-item command="batchApplyActivity" v-if="hasActivityCanApplySelectRows.length">批量申请活动</el-dropdown-item>
                        <el-dropdown-item command="batchCreateCoupon" v-if="selectRows.length">批量优惠券</el-dropdown-item>
                        <el-dropdown-item command="exportSku" v-if="selectRows.length">导出最近8周数据</el-dropdown-item>
                        <el-dropdown-item command="oneKeyTransport" v-if="selectRows.length">一键迁移</el-dropdown-item>
                        <el-dropdown-item command="exportSelfCompareSearchLimit">导出内部高价限流</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="4" :lg="2">
                  <el-button size="mini" type="primary" style="width: 100%" @click="show_other=!show_other">
                    {{ show_other ? '收起' : '更多' }}
                  </el-button>
                </el-col>
              </el-row>
            </el-form>

            <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                      :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange" :summary-method="getSummaries" show-summary>
                <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
                <el-table-column label="商品信息" width="230" align="center" prop="sku_ext_code" sortable="custom" sort-by="sku_ext_code" :fixed="!isMobile">
                    <div slot-scope="{row}">
                        <div v-if="row.sale && row.sale.account">
                            <el-tag size="mini" type="primary">账号: {{row.sale.account.name}}</el-tag>
                        </div>
                        <div>
                            <el-tooltip size="mini" :content="row.product ? row.product.product_name : ''" placement="right">
                                <div v-if="row.product && row.product.product_name.length >= 15">
                                    {{row.product.product_name.substring(0, 15)}}...
                                </div>
                                <div v-else-if="row.sale">
                                    {{row.product.product_name}}
                                </div>
                            </el-tooltip>
                        </div>
                        <div v-if="row.sale">
                            <el-tag size="mini" type="primary" @click="copy(row.sale.id.toString())">SPU: {{row.sale.id}}</el-tag>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(7, row.sale.id)"></i>
                        </div>
                        <div v-if="row.sale">
                            <el-tag size="mini" type="primary" @click="copy(row.sale.product_skc_id.toString())">SKC: {{row.sale.product_skc_id}}</el-tag>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(1, row.sale.product_skc_id)"></i>
                            <el-button type="primary" size="mini" style="display: inline-block; padding: 3px 10px" @click="reqStock(row.sale.product_skc_id, 0)" plain>备</el-button>
                        </div>
                        <div>
                            <el-popover placement="left" v-if="row.volume && row.weight" trigger="hover">
                              <el-tag size="mini" style="width: 100%">{{row.volume.len}}mm x {{row.volume.width}}mm x {{row.volume.height}}mm / {{row.weight.weight}}g</el-tag>
                              <el-tag size="mini" type="primary" slot="reference" @click="copy(row.id.toString())">SKU: {{row.id}}</el-tag>
                            </el-popover>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(2, row.id)"></i>
                            <el-button type="primary" size="mini" style="display: inline-block; padding: 3px 10px" @click="reqStock(row.sale.product_skc_id, row.id)" plain>备</el-button>
                        </div>
                        <div>
                            <el-tag size="mini" type="primary" @click="startEditSku(row.id, row.sku_ext_code)" v-if="editSku.id!==row.id">货号: {{ row.sku_ext_code }}</el-tag>
                            <template v-else>
                              <el-input :ref="row.id" v-model="editSku.sku" @keyup.enter.native="updateSku" size="mini">
                              </el-input>
                              <el-row :gutter="5">
                                <el-col :span="12">
                                  <el-button size="mini" style="width: 100%" type="warning" @click="updateSku" icon="el-icon-success"></el-button>
                                </el-col>
                                <el-col :span="12">
                                  <el-button size="mini" style="width: 100%" type="primary" @click="endEditSku" icon="el-icon-error"></el-button>
                                </el-col>
                              </el-row>
                            </template>
                        </div>
                        <div v-if="row.item_image">
                            <el-tag size="mini" type="primary">变体: {{ row.item_image.name }}</el-tag>
                        </div>
                        <div>
                            <el-tag size="mini" type="danger" effect="dark">售价: {{row.currency_type}} {{row.supplier_price/100}}</el-tag>
                            <el-tag size="mini" type="danger" v-if="row.daily_history && row.daily_history.price">成本: ¥{{row.daily_history.price.toFixed(2)}}</el-tag>
                        </div>
                        <div v-if="row.dxm_goods_sku">
                            <el-tag size="mini" type="primary" @click="copy(row.dxm_goods_sku.sku)">小秘:{{row.dxm_goods_sku.sku.length > 15 ? row.dxm_goods_sku.sku.substring(0, 15) + ".." : row.dxm_goods_sku.sku}} x {{row.dxm_goods_sku.count > 0 ? row.dxm_goods_sku.count : 1}}</el-tag>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="jumpGoods(row.dxm_goods_sku.sku)"></i>
                            <el-button type="primary" size="mini" style="display: inline-block; padding: 3px 10px" @click="reqStockBySku(row.dxm_goods_sku.sku)" plain>备</el-button>
                        </div>
                        <div v-else>
                            <el-tag size="mini" type="danger">未配对店小秘</el-tag>
                        </div>
                        <div v-if="row.select">
                            <el-tag size="mini" type="primary">买手: {{ row.select.buyer_name }}</el-tag>
                        </div>
                        <div>
                            <el-tag size="mini" type="primary" effect="dark">类目: {{row.sale.category}}</el-tag>
                        </div>
                        <div>
                            <el-tag size="mini" type="warning" effect="dark" v-if="row.sale.close_jit_status === 1">调价中</el-tag>
                            <el-tag size="mini" type="danger" effect="dark" v-else-if="row.sale.close_jit_status === 2">备货中</el-tag>
                            <el-tag size="mini" type="primary" effect="dark" v-else>待调价</el-tag>

                          <div v-if="row.sale && row.sale.auto_close_jit_end_time">
                            <el-tag size="mini" type="warning" effect="dark">自动关JIT: {{new Date(row.sale.auto_close_jit_end_time).toLocaleString()}}</el-tag>
                          </div>
                        </div>

                        <el-tag size="mini" type="primary" v-if="row.select && row.select.added_to_site_time">
                            加入站点: {{new Date(row.select.added_to_site_time).toLocaleString()}}
                        </el-tag>
                        <div v-else>
                            创建: {{new Date(row.sale.created_at).toLocaleDateString()}}
                        </div>
                        <div v-if="row.sale.picture_audit_status !== 2">
                          <el-tag size="mini" type="danger">图审未过</el-tag>
                        </div>
                        <template v-else>
                          <div v-if="skcReview(row)">
                            <el-tag size="mini" type="primary">Skc评分: {{skcReview(row)}}</el-tag>
                          </div>
                          <div v-if="skuReview(row)">
                            <el-tag size="mini" type="primary" v-if="row.daily_history && row.daily_history.review_count">
                              Sku评分: {{ skuReview(row) }})
                            </el-tag>
                          </div>
                          <div>
                            <el-tag size="mini" type="warning" v-if="row.sale.purchase_stock_type==1">JIT</el-tag>

                            <el-tag size="mini" type="warning" v-if="row.is_advice_stock">建议备货</el-tag>
                            <el-tag size="mini" type="primary" v-if="row.today_apply_stock_num">今日已备货</el-tag>
                            <el-tag size="mini" type="warning" effect="dark" v-if="row.sale && row.sale.hot_tag">热销款</el-tag>
                            <span v-if="row.sale.is_ad_product">
                              <el-tag size="mini" type="success" effect="dark">站外广告</el-tag>
                            </span>
                            <span v-for="(item, index) in row.sale.ad_type_list" :key="index">
                                  <el-tag size="mini" type="warning" v-if="item === 1">普通广告</el-tag>
                                  <el-tag size="mini" type="danger" v-else-if="item === 2">高级广告</el-tag>
                                  <el-tag size="mini" type="primary" v-else-if="item === 0">无广告</el-tag>
                            </span>
                          </div>
                        </template>
                    </div>
                </el-table-column>
                <el-table-column label="图片" width="100" align="center" :fixed="!isMobile">
                    <div slot-scope="{row}">
                        <template v-if="row.variation">
                            <div>变体图</div>
                            <KdxImage :src="row.variation.thumb_url"></KdxImage>
                        </template>
                        <div>主图</div>
                        <KdxImage :src="row.sale.product_skc_picture"></KdxImage>
                    </div>
                </el-table-column>
                <el-table-column label="操作" width="220" align="center" :fixed="!isMobile">
                    <div slot-scope="{row}">
                        <div>
                          <el-tag size="mini" type="warning" effect="dark">{{levelName(row)}}</el-tag>
                        </div>
                        <div v-if="row.daily_history && row.daily_history.us_ratio">
                          <el-tag size="mini" type="danger" effect="dark">美区占比: {{row.daily_history.us_ratio.toFixed(1)}}%</el-tag>
                        </div>
                        <div v-if="row.sale && row.sale.cert">
                          <el-tag size="mini" type="danger" effect="dark" @click="openCertDlg(row.sale_id)">{{certStatus(row)}}</el-tag>
                        </div>
                        <TemuSearchLimit :variation="row" :open-search-limit-dlg="openSearchLimitDlg"></TemuSearchLimit>
                        <div v-if="row.product">
                          <template v-for="(m, index) in row.product.quality_metric_list">
                            <el-tooltip :content="`品质分: ${siteName(m.site)}`" :key="index" v-if="m.goods_afs_score>0">
                              <el-tag size="mini" :type="goodsAfsScoreType(m.goods_afs_score)" effect="dark">{{siteName(m.site)}}:{{m.goods_afs_score.toFixed(2)}}</el-tag>
                            </el-tooltip>
                          </template>
                        </div>
                        <el-row>
                          <el-col :span="12">
                              <el-link type="primary" :href="`https://www.temu.com/goods.html?goods_id=${row.sale.goods_id}&no_cache_id=egv4k`" :underline="false" target="_blank">
                                  前端查看
                              </el-link>
                          </el-col>
                          <el-col :span="12">
                            <template v-if="row.sale && row.sale.account">
                              <StartBrowser :id="row.sale.account.parent_id" :account_id="row.sale.account_id" st="width: 100%" name="申请改图" :open_url="`https://seller.kuajingmaihuo.com/goods/product-images?productId=${row.sale.id}&from=selfTask`"></StartBrowser>
                            </template>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">
                              <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain v-if="row.daily_history">发货({{row.daily_history.join_count}}|{{row.daily_history.today_can_join}})</el-button>
                              <el-button type="primary" size="mini" style="width: 100%" @click="openPlans(row.id)" plain v-else>发货</el-button>
                          </el-col>
                          <el-col :span="6" v-if="row.sale">
                              <el-button type="primary" size="mini" style="width: 100%" @click="openImageReview(row)">图审</el-button>
                          </el-col>
                          <el-col :span="6" v-if="row.sale">
                              <el-button type="warning" size="mini" style="width: 100%" @click="openImageEdit(row)">改图</el-button>
                          </el-col>
                          <el-col :span="12">
                              <el-button type="primary" size="mini" style="width: 100%" @click="openCountryDaily(row.sale_id)" plain>国家订单</el-button>
                          </el-col>
                          <el-col :span="12">
                              <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单</el-button>
                          </el-col>
                          <el-col :span="12">
                              <el-button type="danger" size="mini" style="width: 100%" @click="openDxmGoods(row.id)" v-if="row.daily_history && row.daily_history.is_jg">配对|加工</el-button>
                              <el-button type="primary" size="mini" style="width: 100%" @click="openDxmGoods(row.id)" plain v-else>配对</el-button>
                          </el-col>
                          <el-col :span="12">
                            <el-button style="width: 100%" size="mini" type="primary" @click="openCreateCoupon(row.sale_id)">创建优惠券
                            </el-button>
                          </el-col>
                        </el-row>
                        <div>
                        </div>
                        <div v-if="row.daily_history && row.daily_history.level === -3">
                            <el-button type="primary" size="mini" style="width: 100%" @click="levelReset(row.id)">升级层级</el-button>
                        </div>
                        <template v-if="!row.ban">
                          <div v-if="!row.dxm_goods_sku">
                              <el-button type="primary" size="mini" style="width: 100%" @click="genFirstOrder(row.id)" plain>生成首单</el-button>
                          </div>
                          <div v-else>
                              <el-tag type="warning" size="mini" style="width: 100%" effect="dark" v-if="row.daily_history && row.daily_history.level <= -3">淘汰产品暂不支持采购</el-tag>
                              <el-button type="primary" size="mini" style="width: 100%" @click="openAddToBuyPlan(row)" plain v-else-if="row.buy_record">生成采购(今日已采)</el-button>
                              <el-button type="warning" size="mini" style="width: 100%" @click="openAddToBuyPlan(row)" plain v-else>生成采购(今日未采)</el-button>
                          </div>
                          <div v-if="row.daily_history && row.daily_history.share_dxm">
                            <el-button size="mini" type="danger" style="width: 100%" @click="changeSearchCond(3, row.dxm_goods_sku.sku)">共享库存</el-button>
                          </div>
                          <div v-if="!row.is_reduce_price_pass">
                            <el-button type="danger" size="mini" style="width: 100%" @click="jumpReducePriceNotPass(row.id)">禁止备货</el-button>
                          </div>
                          <div v-if="row.sale && row.sale.price_comparing && row.sale.price_comparing.status !== 4">
                            <el-button type="danger" size="mini" style="width: 100%" @click="jumpPriceComparing(row.sale_id)">竞价中</el-button>
                          </div>
                        </template>
                        <el-row>
                          <el-col :span="12">
                            <div v-if="row.ban">
                              <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, false)">取消禁售{{row.ban.type === 0 ? "(手动)" : "(单量不足)"}}</el-button>
                            </div>
                            <div v-else>
                              <el-button size="mini" style="width: 100%" type="primary" @click="ban(row.id, true)">设置禁售</el-button>
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
                            <el-button size="mini" style="width: 100%" type="danger" @click="createProduct(row)">创建产品</el-button>
                          </el-col>
                          <el-col :span="12">
                            <el-button size="mini" style="width: 100%" type="text" @click="uploadBySaleItem([row])">复制上架</el-button>
                          </el-col>
                          <el-col :span="12">
                            <el-button size="mini" style="width: 100%" type="warning" @click="openActivityProductList(row.sale_id)">活动报名</el-button>
                          </el-col>
                          <el-col :span="12">
                            <el-button size="mini" style="width: 100%" type="warning" @click="openActivityAppliedProductList([row.sale_id])">活动记录</el-button>
                          </el-col>
                        </el-row>
                        <div>
                        </div>
<!--                        <div v-if="row.dxm_goods_sku">-->
<!--                            <el-button size="mini" type="primary" style="width: 100%" @click="genItemInfo(row.id)" plain>生成产品信息</el-button>-->
<!--                        </div>-->
                        <div v-if="row.daily_history && row.daily_history.review_count">
                          <div style="width: 20%; display: inline-block">
                            <el-tooltip :content="`1星(近15天: ${(row.daily_history.fifteen_day_one_star_coef*100).toFixed(1)}%)`" placement="top">
                              <el-tag size="mini" :type="row.daily_history.fifteen_day_one_star_coef > row.daily_history.one_star_coef ? 'danger' : 'primary'" :effect="row.daily_history.fifteen_day_one_star_coef > row.daily_history.one_star_coef ? 'dark' : 'light'" style="width: 100%" @click="openReviewDlg(row.id, 1)">
                                {{(row.daily_history.one_star_coef*100).toFixed(1)}}%
                              </el-tag>
                            </el-tooltip>
                          </div>
                          <div style="width: 20%; display: inline-block">
                            <el-tooltip :content="`2星(近15天: ${(row.daily_history.fifteen_day_two_star_coef*100).toFixed(1)}%)`" placement="top">
                              <el-tag size="mini" :type="row.daily_history.fifteen_day_two_star_coef > row.daily_history.two_star_coef ? 'danger' : 'primary'" :effect="row.daily_history.fifteen_day_two_star_coef > row.daily_history.two_star_coef ? 'dark' : 'light'" style="width: 100%" @click="openReviewDlg(row.id, 2)">
                                {{(row.daily_history.two_star_coef*100).toFixed(1)}}%
                              </el-tag>
                            </el-tooltip>
                          </div>
                          <div style="width: 20%; display: inline-block">
                            <el-tooltip :content="`3星(近15天: ${(row.daily_history.fifteen_day_three_star_coef*100).toFixed(1)}%)`" placement="top">
                              <el-tag size="mini" type="primary" style="width: 100%" @click="openReviewDlg(row.id, 3)">
                                {{(row.daily_history.three_star_coef*100).toFixed(1)}}%
                              </el-tag>
                            </el-tooltip>
                          </div>
                          <div style="width: 20%; display: inline-block">
                            <el-tooltip :content="`4星(近15天: ${(row.daily_history.fifteen_day_four_star_coef*100).toFixed(1)}%)`" placement="top">
                              <el-tag size="mini" type="primary" style="width: 100%" @click="openReviewDlg(row.id, 4)">
                                {{(row.daily_history.four_star_coef*100).toFixed(1)}}%
                              </el-tag>
                            </el-tooltip>
                          </div>
                          <div style="width: 20%; display: inline-block">
                            <el-tooltip :content="`5星(近15天: ${(row.daily_history.fifteen_day_five_star_coef*100).toFixed(1)}%)`" placement="top">
                              <el-tag size="mini" type="primary" style="width: 100%" @click="openReviewDlg(row.id, 5)">
                                {{(row.daily_history.five_star_coef*100).toFixed(1)}}%
                              </el-tag>
                            </el-tooltip>
                          </div>
                        </div>
                        <div>
                          <el-tag type="primary" size="mini" v-for="(t, index) in row.tags" :key="index" @close="handleRemoveTag(t.id)"
                                  closable :disable-transitions="false">{{t.user_id ? `${t.content}-私` : `${t.content}-共`}}</el-tag>

                          <el-autocomplete
                              class="input-new-tag"
                              v-if="input.visible && input.id === row.id"
                              v-model="input.value"
                              :placeholder="input.is_pub ? '所有人可见' : '自己可见'"
                              :ref="`tagConfirm_${row.id}`"
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
                            <el-button slot="append" size="mini" type="primary" @click="handleInputConfirm" icon="el-icon-success"></el-button>
                            <el-button slot="append" size="mini" type="primary" @click="closeInput" icon="el-icon-error"></el-button>
                          </el-autocomplete>
                          <template v-else>
                            <template v-if="row.tags.length">
                              <el-button type="primary" class="button-new-tag" size="mini" @click="showInput(row)" icon="el-icon-plus"></el-button>
                            </template>
                            <div v-else>
                              <el-button type="primary" class="button-new-tag" style="width: 100%;" size="mini" @click="showInput(row)">+标签</el-button>
                            </div>
                          </template>
                        </div>
                        <template v-if="row.sale && row.sale.account">
                          <el-col :span="24">
                            <div>数据分析: </div>
                          </el-col>
                          <el-col :span="12">
                            <StartBrowser :id="row.sale.account.parent_id" :account_id="row.sale.account_id" :copy_content="row.sale_id" st="width: 100%" open_url="https://agentseller.temu.com/main/business-opportunity" name="市场分析"></StartBrowser>
                          </el-col>
                          <el-col :span="12">
                            <StartBrowser :id="row.sale.account.parent_id" :account_id="row.sale.account_id" :copy_content="row.sale_id" st="width: 100%" open_url="https://agentseller.temu.com/main/flux-analysis-full" name="流量分析"></StartBrowser>
                          </el-col>
                        </template>
                    </div>
                </el-table-column>
                <el-table-column label="备货" align="center">
                  <el-table-column label="逻辑" prop="sales.bei_huo_days" sortable="custom" align="center">
                    <div slot-scope="{row}">
                      {{ row.purchase_config }}
                    </div>
                  </el-table-column>
                  <el-table-column label="仓内+途天数" prop="daily_history.custom_available_sale_days_from_inventory_with_on_way" sortable="custom" align="center">
                    <div slot-scope="{row}">
                      <template v-if="row.daily_history">
                        <el-tag size="small" type="danger" effect="dark" v-if="row.daily_history.custom_available_sale_days_from_inventory_with_on_way <= 4">
                          {{row.daily_history.custom_available_sale_days_from_inventory_with_on_way.toFixed(2)}}
                        </el-tag>
                        <el-tag size="small" type="warning" effect="dark" v-else-if="row.daily_history.custom_available_sale_days_from_inventory_with_on_way <= 8">
                          {{row.daily_history.custom_available_sale_days_from_inventory_with_on_way.toFixed(2)}}
                        </el-tag>
                        <el-tag size="small" type="success" v-else>
                          {{row.daily_history.custom_available_sale_days_from_inventory_with_on_way.toFixed(2)}}
                        </el-tag>
                      </template>
                    </div>
                  </el-table-column>
                  <el-table-column label="平台可售天数" align="center">
                      <el-table-column label="Temu" prop="available_sale_days_from_inventory" sortable="custom" align="center">
                      </el-table-column>
                      <el-table-column label="我" prop="daily_history.custom_available_sale_days_from_inventory" sortable="custom" align="center">
                          <template slot="header">
                            我
                            <el-tooltip content="含发货在途+未发出">
                              <i class="el-icon-info"></i>
                            </el-tooltip>
                          </template>
                          <div slot-scope="{row}">
                              <template v-if="row.daily_history">
                                <el-tag size="mini" type="danger" effect="dark" v-if="row.daily_history.custom_available_sale_days_from_inventory <= 4">
                                  {{row.daily_history.custom_available_sale_days_from_inventory.toFixed(2)}}
                                </el-tag>
                                <el-tag size="mini" type="warning" effect="dark" v-else-if="row.daily_history.custom_available_sale_days_from_inventory <= 8">
                                  {{row.daily_history.custom_available_sale_days_from_inventory.toFixed(2)}}
                                </el-tag>
                                <el-tag size="mini" type="success" v-else>
                                  {{row.daily_history.custom_available_sale_days_from_inventory.toFixed(2)}}
                                </el-tag>
                              </template>
                          </div>
                      </el-table-column>
                  </el-table-column>
                  <el-table-column prop="daily_history.custom_available_sale_days" sortable="custom" align="center">
                    <template slot="header">
                      总可售天数
                      <el-tooltip content="平台可售天数+在途可售天数">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </template>
                    <div slot-scope="{row}">
                      <div v-if="row.daily_history">
                        {{row.daily_history.custom_available_sale_days.toFixed(2)}}
                      </div>
                    </div>
                  </el-table-column>
                  <el-table-column label="建议采购量" prop="daily_history.custom_real_advice_quantity" sortable="custom" sort-by="today" align="center">
                    <div slot-scope="{row}">
                      <template v-if="row.daily_history">
                        <el-tag size="mini" type="danger" effect="dark" v-if="row.daily_history.custom_real_advice_quantity">
                          {{row.daily_history.custom_real_advice_quantity}}
                        </el-tag>
                        <el-tag size="mini" type="success" v-else>
                          {{row.daily_history.custom_real_advice_quantity}}
                        </el-tag>
                      </template>
                    </div>
                  </el-table-column>
                </el-table-column>
<!--                <el-table-column label="备货" align="center">-->
<!--                  <el-table-column label="减剩余" prop="daily_history.temu_real_advice_quantity" sortable="custom" align="center">-->
<!--                  </el-table-column>-->
<!--                      <el-table-column label="减剩余+待发" prop="daily_history.temu_real_advice_quantity_with_bh" sortable="custom" align="center">-->
<!--                      </el-table-column>-->
<!--                <el-table-column label="建议备货" align="center">-->
<!--                    <el-table-column label="我" sortable="custom" align="center">-->
<!--                        <el-table-column label="建议" prop="daily_history.custom_advice_quantity" sortable="custom" align="center">-->
<!--                            <div slot-scope="{row}">-->
<!--                                <el-tag type="primary" v-if="row.daily_history.share_dxm">{{row.daily_history.custom_advice_quantity}}({{row.daily_history.other_custom_advice_quantity}})</el-tag>-->
<!--                                <el-tag type="primary" v-else>{{row.daily_history.custom_advice_quantity}}</el-tag>-->
<!--                            </div>-->
<!--                        </el-table-column>-->
<!--                        <el-table-column label="减剩余" prop="daily_history.custom_real_advice_quantity" sortable="custom" align="center">-->
<!--                        </el-table-column>-->
<!--                        <el-table-column label="减剩余+补货" prop="daily_history.custom_real_advice_quantity_with_bh" sortable="custom" align="center">-->
<!--                        </el-table-column>-->
<!--                    </el-table-column>-->
<!--                </el-table-column>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="店小秘" align="center">-->
<!--                  <el-table-column label="在途" prop="daily_history.on_way_count" sortable="custom" align="center">-->
<!--                    <div slot-scope="{row}">-->
<!--                      <template v-if="row.daily_history">-->
<!--                        <el-tooltip content="加工在途(采购在途)" placement="right" v-if="row.daily_history.is_jg">-->
<!--                          <div>{{ row.daily_history.on_way_count }}({{ row.daily_history.jg_on_way_count }})</div>-->
<!--                        </el-tooltip>-->
<!--                        <div v-else>{{ row.daily_history.on_way_count }}</div>-->
<!--                      </template>-->
<!--                    </div>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="入仓" prop="daily_history.kcl_count" sortable="custom" align="center">-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="实收" prop="daily_history.total_plan_count" sortable="custom" align="center">-->
<!--                    <div slot-scope="{row}">-->
<!--                      <template v-if="row.daily_history">-->
<!--                        <el-tag type="primary" v-if="row.daily_history.share_dxm">{{row.daily_history.total_plan_count}}({{row.daily_history.other_total_plan_count}})</el-tag>-->
<!--                        <el-tag type="primary" v-else>{{row.daily_history.total_plan_count}}</el-tag>-->
<!--                      </template>-->
<!--                    </div>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="退回" align="center">-->
<!--                    <el-table-column label="已收" prop="daily_history.total_return_count" sortable="custom" align="center">-->
<!--                    </el-table-column>-->
<!--                    <el-table-column label="未收" prop="daily_history.total_unconfirmed_return_count" sortable="custom" align="center">-->
<!--                    </el-table-column>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="剩余" prop="daily_history.real_inventory_in_warehouse" sortable="custom" align="center">-->
<!--                    <div slot-scope="{row}">-->
<!--                      <el-tag type="primary" v-if="row.daily_history">{{row.daily_history.real_inventory_in_warehouse}}</el-tag>-->
<!--                      <div v-if="row.dxm_goods_sku && row.daily_history">-->
<!--                        <template v-if="row.dxm_goods_sku.inventory_fix">-->
<!--                          <el-tooltip :content="`修改库存数量(${row.dxm_goods_sku.inventory_fix.change_count})`" placement="right">-->
<!--                            <el-button type="primary" size="mini" style="width: 100%" @click="cancelFixInventory(row.dxm_goods_sku.sku)">取消</el-button>-->
<!--                          </el-tooltip>-->
<!--                        </template>-->
<!--                        <template v-else>-->
<!--                          <el-button type="primary" size="mini" style="width: 100%" @click="openFixInventoryDlg(row.dxm_goods_sku.sku, row.daily_history.real_inventory_in_warehouse)">修</el-button>-->
<!--                        </template>-->
<!--                      </div>-->
<!--                    </div>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="最多可加工" prop="daily_history.jg_kcl_count" sortable="custom" align="center">-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="剩余+在途" prop="daily_history.real_inventory" sortable="custom" align="center">-->
<!--                  </el-table-column>-->
<!--                </el-table-column>-->
                <el-table-column label="建议备货量" prop="advice.max" sortable="custom" align="center">
                  <div slot-scope="{row}">
                    <template v-if="row.daily_history">
                      <el-tag type="primary" v-if="row.daily_history.share_dxm">{{row.advice ? row.advice.max : row.daily_history.advice_quantity}}({{row.daily_history.other_advice_quantity}})</el-tag>
                      <el-tag type="primary" v-else>{{row.advice ? row.advice.max : row.daily_history.advice_quantity}}</el-tag>
                    </template>
                  </div>
                </el-table-column>
                <el-table-column label="库存" align="center" width="120px" prop="sales_inventory_num" sortable="custom">
                    <div slot-scope="{row}">
                        <el-row v-if="row.normal_stock">
                          <el-col :span="12">虚拟库存</el-col>
                          <el-col :span="12">
                            <el-tag size="mini">{{row.normal_stock.virtual_stock}}</el-tag>
                          </el-col>
                          <el-col :span="12">
                            <el-popover placement="left" trigger="click">
                              <el-form :model="virtual_stock" size="mini" label-width="100px" label-position="left">
                                <el-form-item label="增加库存" prop="min_cost">
                                  <el-input-number size="mini" style="width: 100%" v-model="virtual_stock.add" :min="1" :precision="0"></el-input-number>
                                </el-form-item>
                              </el-form>
                              <el-button size="mini" style="width: 100%" type="primary" @click="addStock(row)">增加</el-button>
                              <el-button slot="reference" size="mini" type="primary" plain>加</el-button>
                            </el-popover>
                          </el-col>
                          <el-col :span="12">
                            <el-popover placement="left" trigger="click" @show="showVirtualStock(row)">
                              <el-form :model="virtual_stock" size="mini" label-width="100px" label-position="left">
                                <el-form-item label="最低库存" prop="min_cost">
                                  <el-input-number size="mini" style="width: 100%" v-model="virtual_stock.min" :min="0" :precision="0"></el-input-number>
                                </el-form-item>
                                <el-form-item label="7日系数倍数" prop="min_cost">
                                  <el-input-number size="mini" style="width: 100%" v-model="virtual_stock.seven_coef" :min="0" :precision="0"></el-input-number>
                                </el-form-item>
                              </el-form>
                              <el-button size="mini" style="width: 100%" type="primary" @click="changeMinStock(row)">调整</el-button>
                              <el-button slot="reference" size="mini" type="primary" plain>调</el-button>
                            </el-popover>
                          </el-col>
                        </el-row>
                        <el-row v-else>
                          <el-col :span="12">仓内</el-col>
                          <el-col :span="12"><el-tag size="mini">{{row.sales_inventory_num}}</el-tag></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">不可用</el-col>
                          <el-col :span="12"><el-tag size="mini">{{row.unavailable_warehouse_inventory_num}}</el-tag></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">已发货</el-col>
                          <el-col :span="12"><el-tag size="mini">{{row.wait_receive_num}}</el-tag></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">待质检</el-col>
                          <el-col :span="12"><el-tag size="mini">{{row.wait_qc_num}}</el-tag></el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="12">在途</el-col>
                          <el-col :span="12"><el-tag size="mini">{{row.vmi_transportation_num}}</el-tag></el-col>
                        </el-row>
                    </div>
                </el-table-column>
                <el-table-column label="Vmi" align="center">
                    <el-table-column label="待发(量)" prop="daily_history.wait_delivery_inventory_num" sortable="custom" align="center">
                        <div slot-scope="{row}">
                          <template v-if="row.daily_history">
                            <el-tag type="primary" v-if="row.daily_history.share_dxm">{{row.daily_history.wait_delivery_inventory_num}}({{row.daily_history.other_wait_delivery_inventory_num}})</el-tag>
                            <el-tag type="primary" v-else>{{row.daily_history.wait_delivery_inventory_num}}</el-tag>
                          </template>
                        </div>
                    </el-table-column>
                    <el-table-column label="待发(件)" prop="vmi_wait_delivery_num" sortable="custom" align="center">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="平台" align="center">
                  <el-table-column label="加购" align="center">
                    <el-table-column label="7日" prop="in_cart_number_7d" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="累计" prop="in_card_number" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="销量系数" align="center">
                    <el-table-column label="7系" prop="daily_history.seven_day_coef" sortable="custom" sort-by="today" align="center">
                      <template slot="header">
                        <el-tooltip content="7日系数">
                          <span>7系</span>
                        </el-tooltip>
                      </template>
                      <div slot-scope="{row}">
                        <template v-if="row.daily_history">
                          {{row.daily_history.seven_day_coef.toFixed(2)}}
                        </template>
                      </div>
                    </el-table-column>
                    <el-table-column label="30系" prop="daily_history.thirty_day_coef" sortable="custom" sort-by="today" align="center">
                      <template slot="header">
                        <el-tooltip content="30日系数">
                          <span>30系</span>
                        </el-tooltip>
                      </template>
                      <div slot-scope="{row}">
                        <template v-if="row.daily_history">
                          {{row.daily_history.thirty_day_coef.toFixed(2)}}
                        </template>
                      </div>
                    </el-table-column>
                    <el-table-column label="90系" prop="daily_history.ninety_day_coef" sortable="custom" sort-by="today" align="center">
                      <template slot="header">
                        <el-tooltip content="90日系数">
                          <span>90系</span>
                        </el-tooltip>
                      </template>
                      <div slot-scope="{row}">
                        <template v-if="row.daily_history">
                          {{row.daily_history.ninety_day_coef.toFixed(2)}}
                        </template>
                      </div>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="流量" align="center">
                    <el-table-column label="图" align="center" width="300px">
                      <div slot-scope="{row}">
                        <template v-if="row.product">
                          <Daily :list="row.product.daily_flow_list" :stack="{'用户': ['搜索','推荐','其他']}" :field_names="['曝光','搜索','推荐','其他']" :fields="['expose_num','search_expose_num','recommend_expose_num','other_expose_num']" v-if="!row.product.is_semi && row.product.daily_flow_list"></Daily>
                          <Daily :list="row.product.daily_semi_flow_list" :stack="{'用户': ['搜索','推荐']}" :field_names="['曝光','搜索','推荐']" :fields="['impression_count','search_expose_num','recommend_expose_num']" v-else-if="row.product.is_semi && row.product.daily_semi_flow_list"></Daily>
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
                  </el-table-column>
                  <el-table-column label="销量" align="center">
                    <el-table-column label="图" sortable="custom" sort-by="today" align="center" width="300px">
                      <div slot-scope="{row}">
                        <Daily :list="row.daily_list" :field_names="['单量']" :fields="['count']"></Daily>
                      </div>
                    </el-table-column>
                    <el-table-column label="今" prop="daily_history.today" sortable="custom" sort-by="daily_history.today" align="center">
                    </el-table-column>
                    <el-table-column label="差" prop="daily_history.two_day_diff" sortable="custom" sort-by="daily_history.two_day_diff" align="center">
                    </el-table-column>
                    <el-table-column label="昨" prop="daily_history.two_day" sortable="custom" sort-by="daily_history.two_day" align="center">
                    </el-table-column>
                    <el-table-column label="差" prop="daily_history.three_day_diff" sortable="custom" sort-by="daily_history.three_day_diff" align="center">
                    </el-table-column>
                    <el-table-column label="前" prop="daily_history.three_day" sortable="custom" sort-by="daily_history.three_day" align="center">
                    </el-table-column>
                    <el-table-column label="7" prop="daily_history.seven_day" sortable="custom" sort-by="daily_history.seven_day" align="center">
                    </el-table-column>
                    <el-table-column label="周差" prop="daily_history.last_week_diff" sortable="custom" sort-by="daily_history.last_week_diff" align="center">
                    </el-table-column>
                    <el-table-column label="30" prop="daily_history.thirty_day" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="全" prop="daily_history.all" sortable="custom" sort-by="today" align="center">
                      <div slot-scope="{row}">
                        <span style="font-size: 12px">
                        {{row.daily_history ? row.daily_history.all : 0}}({{ row.total_sale_volume }})
                        </span>
                      </div>
                    </el-table-column>
                  </el-table-column>
                  <el-table-column label="最高" align="center">
                    <el-table-column label="7" prop="daily_history.seven_day_max" sortable="custom" sort-by="seven_day_max" align="center">
                    </el-table-column>
                    <el-table-column label="30" prop="daily_history.thirty_day_max" sortable="custom" sort-by="thirty_day_max" align="center">
                    </el-table-column>
                    <el-table-column label="全" prop="daily_history.all_max" sortable="custom" sort-by="all_max" align="center">
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
<!--                <el-table-column label="统计" align="center">-->
<!--                  <el-table-column label="总销售额" prop="daily_history.total_revenue" sortable="custom" sort-by="daily_history.total_revenue" align="center" width="120px">-->
<!--                    <div slot-scope="{row}">-->
<!--                      <template v-if="row.daily_history">-->
<!--                        <el-tag type="primary">-->
<!--                          {{row.daily_history.total_revenue.toFixed(1)}}-->
<!--                        </el-tag>-->
<!--                        <br>-->
<!--                        <el-tag type="primary" v-if="row.daily_history.share_dxm">-->
<!--                          共享: {{row.daily_history.other_total_revenue.toFixed(1)}}-->
<!--                        </el-tag>-->
<!--                      </template>-->
<!--                    </div>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="总费用" prop="daily_history.total_cost" sortable="custom" sort-by="daily_history.total_cost" align="center" width="120px">-->
<!--                    <div slot-scope="{row}">-->
<!--                      <el-tag type="primary" v-if="row.daily_history">-->
<!--                        {{row.daily_history.total_cost.toFixed(1)}}-->
<!--                      </el-tag>-->
<!--                    </div>-->
<!--                  </el-table-column>-->
<!--                  <el-table-column label="总利润" prop="daily_history.total_profit" sortable="custom" sort-by="daily_history.total_profit" align="center" width="120px">-->
<!--                    <div slot-scope="{row}">-->
<!--                      <el-tag type="primary" v-if="row.daily_history">-->
<!--                        {{row.daily_history.total_profit.toFixed(1)}}-->
<!--                      </el-tag>-->
<!--                    </div>-->
<!--                  </el-table-column>-->
<!--                </el-table-column>-->
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
        <TemuDlgCountryDaily :id="country_daily.id" :visible="country_daily.visible" @close="country_daily.visible=false"></TemuDlgCountryDaily>
        <TemuDlgCost :id="cost.id" :visible="cost.visible" @close="cost.visible=false"></TemuDlgCost>
        <TemuDlgImageReview :id="imageReview.id" :visible="imageReview.visible" @close="imageReview.visible=false"></TemuDlgImageReview>
        <TemuDlgDxmGoods :id="dxmGoods.id" :visible="dxmGoods.visible" @close="dxmGoods.visible=false"></TemuDlgDxmGoods>
        <FDlgUploadBarcode :is_create="toUpload.is_create" :id="toUpload.id" :pdf_url="toUpload.pdf_url" :visible="toUpload.visible" @close="toUpload.visible=false"></FDlgUploadBarcode>
        <TemuDlgFixInventory :sku="fixInventory.sku" :old_left_count="fixInventory.old_left_count" :visible="fixInventory.visible" @close="closeFixInventoryDlg"></TemuDlgFixInventory>
        <TemuDlgCustomize :account_id="dlgCustomize.account_id" :id="dlgCustomize.id" :sku_ext_code="dlgCustomize.sku_ext_code" :visible="dlgCustomize.visible" @close="closeCustomizeDlg"></TemuDlgCustomize>
        <TemuDlgReview :sku_id="review.id" :score="review.score" :visible="review.visible" @close="review.visible=false" v-if="review.visible"></TemuDlgReview>

        <el-dialog :visible.sync="addPlan.visible" title="生成采购" width="60%"
                   :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="()=>{addPlan.visible=false}">
          <el-input-number size="mini" v-model="addPlan.count" placeholder="请输入数量" :min="1" :precision="0" style="width: 100%" clearable></el-input-number>
          <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="addToBuyPlan">生成采购</el-button>
        </el-dialog>

        <KdxDlgScanner :visible="scanner.visible" @close="scanner.visible=false" @result="handleScannerResult"></KdxDlgScanner>
        <TemuDlgStockBatch :account-options="accountOptions" :ids="[stock.id]" :sku_ids="stock.sku_id ? [stock.sku_id] : []" :visible="stock.visible" @close="stock.visible=false"></TemuDlgStockBatch>
        <TemuDlgStockBatch :account-options="accountOptions" :dxm_sku="stockBySku.sku" :visible="stockBySku.visible" @close="stockBySku.visible=false"></TemuDlgStockBatch>
        <TemuDlgStockBatch :account-options="accountOptions" :ids="stockBatch.ids" :visible="stockBatch.visible" @close="stockBatch.visible=false"></TemuDlgStockBatch>
        <TemuDlgCert :id="cert.id" :visible="cert.visible" @close="cert.visible=false"></TemuDlgCert>
        <TemuDlgImageEdit :content="image_edit.content" :sku_ext_code="image_edit.sku_code" :visible="image_edit.visible" @close="image_edit.visible=false"></TemuDlgImageEdit>
        <TemuDlgImageEditV2 :ids="image_edit_v2.ids" :visible="image_edit_v2.visible" @close="image_edit_v2.visible=false"></TemuDlgImageEditV2>
        <TemuDlgBatchModifySkuCode :visible="batchModifySkuCodeDlg.visible" @close="batchModifySkuCodeDlg.visible=false" @update="getTableData"></TemuDlgBatchModifySkuCode>
        <TemuDlgBatchAdjustPrice :rows="batchAdjustPriceDlg.rows" :visible="batchAdjustPriceDlg.visible" @close="batchAdjustPriceDlg.visible=false" @update="getTableData"></TemuDlgBatchAdjustPrice>
        <TemuDlgDownloadImages :ids="dlgDownloadImages.ids" :visible="dlgDownloadImages.visible" @close="dlgDownloadImages.visible=false"></TemuDlgDownloadImages>
        <TemuDlgChangeMinStock :items="dlgChangeMinStockRows.list" :visible="dlgChangeMinStockRows.visible" @close="dlgChangeMinStockRows.visible=false" @suc="getTableData"></TemuDlgChangeMinStock>
        <TemuDlgSimpleProductUpload :list="uploadDlg.array" :visible="uploadDlg.visible" @close="uploadDlg.visible=false" @suc="getTableData"></TemuDlgSimpleProductUpload>
        <TemuDlgActivityProducts :ids="dlgActivityProduct.ids" :visible="dlgActivityProduct.visible" @close="dlgActivityProduct.visible=false" @suc="getTableData"></TemuDlgActivityProducts>
        <TemuDlgActivityAppliedList :spu_ids="dlgActivityAppliedProduct.ids" :visible="dlgActivityAppliedProduct.visible" @close="dlgActivityAppliedProduct.visible=false" @suc="getTableData" v-if="dlgActivityAppliedProduct.visible"></TemuDlgActivityAppliedList>
        <TemuDlgCouponApply :ids="dlgBatchCreateCoupon.ids" :visible="dlgBatchCreateCoupon.visible" @close="dlgBatchCreateCoupon.visible=false" @suc="getTableData"></TemuDlgCouponApply>
        <DlgProductCreate :id="dlgProductCreate.id"  :visible="dlgProductCreate.visible" @close="dlgProductCreate.visible=false"></DlgProductCreate>
        <TemuDlgOneKeyTransport :ids="dlgOneKeyTransport.ids" :accounts="accountOptions" :visible="dlgOneKeyTransport.visible" @close="dlgOneKeyTransport.visible=false"></TemuDlgOneKeyTransport>
        <TemuDlgSearchLimit :id="searchLimitDlg.id" :visible="searchLimitDlg.visible" @close="searchLimitDlg.visible=false" @update="getTableData"></TemuDlgSearchLimit>
    </div>

</template>

<script>
    import infoList from '@/components/mixins/infoList'
    import {
      saleItemBan,
      saleItemList,
      saleItemDxmInventoryFix,
      saleItemInfo,
      saleItemEditSku,
      saleItemLevelReset,
      itemChangeMinStock,
      itemAddVirtualStock,
      saleItemBanProduce
    } from "@/api/temu/sale_item";
    import KdxImage from "@/components/image/image";
    import TemuDlgPlans from "@/view/temu/components/dlg_plans";
    import TemuDlgDaily from "./components/dlg_daily";
    import TemuDlgCost from "./components/dlg_cost";
    import TemuDlgDxmGoods from "./components/dlg_dxm_goods";
    import {saleItemFirstOrder, saleItemAddBuyRecord} from "../../../api/temu/sale_item";
    import {accountList} from "../../../api/temu/account";
    import {categoryExistList} from "../../../api/temu/category";
    import {dxmAddToPlan} from "../../../api/dxm/plan";
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
    import TemuDlgSearchLimit from "@/view/temu/components/dlg_search_limit.vue";
    import {variationExport} from "@/api/temu/variation";
    import TemuSearchLimit from "@/view/temu/components/search_limit.vue";
    import {productSearchLimitSelfCompare} from "@/api/temu/product";

    export default {
        components: {
          TemuSearchLimit,
          TemuDlgSearchLimit,
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
          TemuDlgCost,
          TemuDlgDaily,
          TemuDlgPlans,
          TemuDlgDxmGoods,
          KdxImage
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
                listApi: saleItemList,
                isMobile: false,
                show_other: false,

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

                searchLimitDlg: {
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
                categoryOptions: [],
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
                ]
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
              return item.daily_history && item.daily_history.has_activity_can_apply
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
              this.addPlan.count = Math.max(1, item.daily_history.custom_real_advice_quantity) // 最少采购一个
              this.addPlan.sku = item.dxm_goods_sku.sku
              this.addPlan.visible = true
            },
            async oneKeyTransport(rows) {
              this.dlgOneKeyTransport.ids = [...new Set(rows.map((row) => {return row.sale_id}))]
              this.dlgOneKeyTransport.visible = true
            },
            async exportSelfCompareSearchLimit() {
              let resp = await productSearchLimitSelfCompare()
              if (resp.code) {
                return
              }

              window.open(resp.data, "_blank");
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
              if (!row.daily_history) {
                return "新品"
              }
              let op = this.levelOptions.find(op => op.id === row.daily_history.level)
              if (!op) {
                return "新品"
              }
              return op.name
            },
            selectionChange(val) {
              this.selectRows = val
              let ids = this.selectRows.map(s=>s.sale.product_skc_id)
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
              this.$copyText(text).then( () => {
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
            goodsAfsScoreType(score) {
              if (score >= 80) {
                return "primary"
              }
              if (score >= 60) {
                return "warning"
              }
              return "danger"
            },
            siteName(site) {
                switch (site) {
                  case 2:
                    return "欧"
                  case 3:
                    return "其他"
                  case 1:
                    return "美"
                }
                return "未知"
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
                  this.image_edit_v2.ids = this.selectRows.map((item)=>{return item.sale_id})
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
                  this.dlgDownloadImages.ids = this.selectRows.map((item)=>{return item.sale_id})
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
                  this.dlgActivityProduct.ids = this.hasActivityCanApplySelectRows.map((item) => {return item.sale_id})
                  this.dlgActivityProduct.visible = true
                  return
                }
                case "batchCreateCoupon": {
                  this.dlgBatchCreateCoupon.ids = this.selectRows.map((item) => {return item.sale_id})
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

              let resp = await itemChangeMinStock({id: row.id, min: this.virtual_stock.min, seven_coef: this.virtual_stock.seven_coef})
              if (resp.code) {
                return
              }

              this.$message("更新成功")
              this.getTableData()
            },
            async downloadImages(list) {
                // 需要下载的列表
              let resp = await saleDownloadImages({ids: list.map((item) => {return item.sale_id})})
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
              let ids = items.map((item) => { return item.id })
              let resp = await simpleProductCreateBySaleItem({ids: ids})
              if (resp.code) {
                return
              }
              this.uploadDlg.array = resp.data
              this.uploadDlg.visible = true
            },
            async exportSku(items) {
              let ids = items.map((item) => { return item.id })
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
              } else if(row.review_count) {
                return `${row.review_count}(${row.review_score.toFixed(2)})`
              } else {
                return ""
              }
            },
            skuReview(row) {
              if (row.review) {
                return `${row.review.count}(${row.review.score.toFixed(2)})`
              } else if(row.daily_history && row.daily_history.review_count) {
                return `${row.daily_history.review_count}(${row.daily_history.review_score.toFixed(2)})`
              } else {
                return ""
              }
            },
            getSummaries(param) {
              const { columns, data } = param;
              const sums = [];

              columns.forEach((column, index) => {
                if (column.property === "daily_history.seven_day_coef") {
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.seven_day_coef : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.thirty_day_coef : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.ninety_day_coef : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.today : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.two_day_diff : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.two_day : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.three_day_diff : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.three_day : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.seven_day : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.thirty_day : 0 }) : [];
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
                  const values = data ? data.map(item => { return item.daily_history ? item.daily_history.last_week_diff : 0 }) : [];
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

            this.$set(this.searchInfo, "is_ban", 1)
            // this.$set(this.searchInfo, "select_status", 12)
            // this.$set(this.searchInfo, "stock_types", [1, 2])
            this.$set(this.searchInfo, "dxm_goods_sku_type", "")
            this.$set(this.searchInfo, "buyer_name_type", "")
            this.$set(this.searchInfo, "sku_code_type", 1)
            this.$set(this.searchInfo, "exclude_sku_code_type", 1)

            this.$set(this.searchInfo, "search_cond", 1)
            this.$set(this.searchInfo, "include_tag", true)
            this.$set(this.searchInfo, "other_cond", [23])
            // this.$set(this.searchInfo, "levels", [-2,-1,0,1,2,3,4,5,6,7])

            // TODO
            if (this.$route.query && this.$route.query.dxm_sku) {
              this.$set(this.searchInfo, "dxm_goods_sku_type", 1)
              this.$set(this.searchInfo, "dxm_goods_sku", this.$route.query.dxm_sku)
            }

            let resp = await accountList()
            if (resp.code === 0) {
                this.accountOptions = resp.data
            }
            resp = await categoryExistList()
            if (resp.code === 0) {
                this.categoryOptions = resp.data
            }
            this.syncTags()
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