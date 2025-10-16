<template>
    <div>
        <div class="search-term">
            <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
              <el-row :gutter="5">
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable style="width: 100%">
                      <el-option value=""></el-option>
                      <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
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
                        <el-select v-model="searchInfo.tags" placeholder="请选择标记" multiple collapse-tags filterable clearable style="width: 100%">
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
                <el-col :xs="12" :sm="6" :lg="4">
                  <el-form-item label-width="0">
                    <el-input size="mini" v-model="searchInfo.sku_code" clearable placeholder="货号，逗号分隔">
                      <el-select class="select" slot="prepend" v-model="searchInfo.sku_code_type" filterable style="width: 60px">
                        <el-option label="精确" value=""></el-option>
                        <el-option label="模糊" :value="1"></el-option>
                        <el-option label="右模" :value="2"></el-option>
                        <el-option label="左模" :value="3"></el-option>
                        <el-option label="全匹配" :value="4"></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :xs="12" :sm="6" :lg="4">
                  <el-form-item label-width="0">
                    <el-input size="mini" v-model="searchInfo.exclude_sku_code" clearable placeholder="排除货号，逗号分隔">
                      <el-select class="select" slot="prepend" v-model="searchInfo.exclude_sku_code_type" filterable style="width: 60px">
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
                <el-col :xs="12" :sm="6" :lg="3">
                  <el-form-item label-width="0">
                    <el-select v-model="searchInfo.stock_types" placeholder="库存类型" multiple collapse-tags filterable clearable style="width: 100%">
                      <el-option label="VMI" :value="1"></el-option>
                      <el-option label="JIT" :value="2"></el-option>
                      <el-option label="定制" :value="3"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="8" :sm="4" :lg="2">
                  <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
                </el-col>
                <el-col :xs="4" :sm="2" :lg="2">
                  <el-form-item label-width="0">
                    <el-dropdown style="width: 100%" @command="handleCommand">
                      <el-button type="primary" style="width: 100%">
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown" style="width: 250px">
                        <el-dropdown-item command="downloadImages">下载图片列表</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>

            <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                      :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
                <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
                <el-table-column label="商品信息" width="230" align="center" prop="sku_ext_code" sortable="custom" sort-by="sku_ext_code" :fixed="!isMobile">
                    <div slot-scope="{row}">
                        <div v-if="row.sale && row.sale.account">
                            <el-tag size="mini" type="primary">账号: {{row.sale.account.name}}</el-tag>
                        </div>
                        <div v-if="row.sale">
                            <el-tag size="mini" type="primary" @click="copy(row.sale.id.toString())">SPU: {{row.sale.id}}</el-tag>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(7, row.sale.id)"></i>
                        </div>
                        <div v-if="row.sale">
                            <el-tag size="mini" type="primary" @click="copy(row.sale.product_skc_id.toString())">SKC: {{row.sale.product_skc_id}}</el-tag>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(1, row.sale.product_skc_id)"></i>
                        </div>
                        <div>
                            <el-popover placement="left" v-if="row.volume && row.weight" trigger="hover">
                              <el-tag size="mini" style="width: 100%">{{row.volume.len}}mm x {{row.volume.width}}mm x {{row.volume.height}}mm / {{row.weight.weight}}g</el-tag>
                              <el-tag size="mini" type="primary" slot="reference" @click="copy(row.id.toString())">SKU: {{row.id}}</el-tag>
                            </el-popover>
                            <i class="el-icon-search" style="margin-left: 5px; color: red" @click="changeSearchCond(2, row.id)"></i>
                        </div>
                        <div>
                            <el-tag size="mini" type="primary">货号: {{ row.sku_ext_code }}</el-tag>
                        </div>
                        <div>
<!--                            <el-tag size="mini" type="danger" effect="dark">售价: {{row.currency_type}} {{row.supplier_price/100}}</el-tag>-->
                            <el-tag size="mini" type="danger" v-if="row.daily_history && row.daily_history.price">成本: ¥{{row.daily_history.price.toFixed(2)}}</el-tag>
                        </div>

                        <div v-if="row.review_count">
                          <el-tag size="mini" type="primary">Skc评分: {{row.review_count }}({{ row.review_score.toFixed(2) }})</el-tag>
                          <br>
                          <el-tag size="mini" type="primary" v-if="row.daily_history && row.daily_history.review_count">
                            Sku评分: {{ row.daily_history.review_count }}({{ row.daily_history.review_score.toFixed(2) }})
                          </el-tag>
                        </div>
                    </div>
                </el-table-column>
                <el-table-column label="变体图" width="100" align="center" :fixed="!isMobile">
                    <div slot-scope="{row}">
                        <template v-if="row.item_image">
                            <KdxImage :src="row.item_image.image"></KdxImage>
                        </template>
                    </div>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center" :fixed="!isMobile">
                    <div slot-scope="{row}">
                      <div>
                        <el-tag size="mini" type="warning" effect="dark">{{levelName(row)}}</el-tag>
                      </div>
                      <div>
                        <el-link type="primary" :href="`https://www.temu.com/goods.html?goods_id=${row.sale.goods_id}&no_cache_id=egv4k`" :underline="false" target="_blank">
                          前端查看
                        </el-link>
                      </div>
                      <el-col :span="12">
                        <el-button type="primary" size="mini" style="width: 100%" @click="openCountryDaily(row.sale_id)" plain>国家订单</el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.id)" plain>订单</el-button>
                      </el-col>
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
                        <el-tag type="primary" size="mini" v-for="(t, index) in row.tags" :key="index" :disable-transitions="false">{{t.user_id ? `${t.content}-私` : `${t.content}-共`}}</el-tag>
                      </div>
                    </div>
                </el-table-column>
                <el-table-column label="平台" align="center">
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
                  <el-table-column label="销量" align="center">
                    <el-table-column label="今" prop="daily_history.today" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="差" prop="daily_history.two_day_diff" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="昨" prop="daily_history.two_day" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="差" prop="daily_history.three_day_diff" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="前" prop="daily_history.three_day" sortable="custom" sort-by="today" align="center">
                    </el-table-column>
                    <el-table-column label="7" prop="daily_history.seven_day" sortable="custom" sort-by="today" align="center">
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

        <TemuDlgCountryDaily :id="country_daily.id" :visible="country_daily.visible" @close="country_daily.visible=false"></TemuDlgCountryDaily>
        <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
        <TemuDlgDownloadImages :ids="dlgDownloadImages.ids" :visible="dlgDownloadImages.visible" @close="dlgDownloadImages.visible=false"></TemuDlgDownloadImages>
        <TemuDlgReview :sku_id="review.id" :score="review.score" :visible="review.visible" @close="review.visible=false" v-if="review.visible"></TemuDlgReview>
    </div>

</template>

<script>
    import infoList from '@/components/mixins/infoList'
    import {
      saleItemList,
    } from "@/api/temu/sale_item";
    import KdxImage from "@/components/image/image";
    import TemuDlgDaily from "./components/dlg_daily";
    import {accountList} from "../../../api/temu/account";
    import {categoryExistList} from "../../../api/temu/category";
    import {dxmGoodsId} from "@/api/dxm/goods";
    import {tagList} from "@/api/temu/tag";
    import {saleDownloadImages} from "@/api/temu/sale";
    import TemuDlgCountryDaily from "@/view/temu/sale/components/dlg_country_daily.vue";
    import TemuDlgReview from "@/view/temu/review/dlg_review.vue";
    import TemuDlgDownloadImages from "@/view/temu/sale/components/dlg_download_images.vue";

    export default {
        components: {
          TemuDlgReview,
          TemuDlgDownloadImages,
          TemuDlgCountryDaily,
            TemuDlgDaily,
            KdxImage
        },
        mixins: [infoList],
        data() {
            return {
                listApi: saleItemList,
                isMobile: false,

                selectRows: [],

                dlgDownloadImages: {
                  ids: [],
                  visible: false,
                },

                country_daily: {
                  id: undefined,
                  visible: false,
                },

                daily: {
                    id: undefined,
                    visible: false,
                },

                review: {
                  id: undefined,
                  score: undefined,
                  visible: false,
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
            }
        },
        computed: {
        },
        methods: {
            onSubmit() {
                this.page = 1
                this.getTableData()
            },
            openCountryDaily(id) {
              this.country_daily.id = id
              this.country_daily.visible = true
            },
            openDaily(id) {
                this.daily.id = id
                this.daily.visible = true
            },
            levelName(row) {
              if (!row.daily_history) {
                return "新品"
              }

              switch (row.daily_history.level) {
                case -1:
                  return "淘汰1类"
                case -2:
                  return "淘汰2类"
                case -3:
                  return "淘汰3类"
                case -10:
                  return "已下架"
                case 1:
                  return "1类品"
                case 2:
                  return "2类品"
                case 3:
                  return "3类品"
                case 4:
                  return "小爆品"
                case 5:
                  return "中爆品"
                case 6:
                  return "大爆品"
                case 7:
                  return "超级爆品"
              }
              return "新品"
            },
            selectionChange(val) {
              this.selectRows = val
              let ids = this.selectRows.map(s=>s.sale.product_skc_id)
              if (ids.length) {
                this.copy(ids.join((" ")))
              }
            },
            changeSearchCond(cond, content) {
              switch (cond) {
                case 1: {
                  this.$set(this.searchInfo, "skc_ids", content)
                  return
                }
                case 2: {
                  this.$set(this.searchInfo, "sku_ids", content)
                  return
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
                  return
                }
                case 9: {
                  this.$set(this.searchInfo, "label_codes", content)
                  return
                }
              }
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
            async syncTags() {
              let resp = await tagList()
              if (resp.code === 0) {
                this.tagOptions = resp.data
              }
            },
            handleCommand(command) {
              switch (command) {
                case "downloadImages": {
                  this.dlgDownloadImages.ids = this.selectRows.map((item)=>{return item.sale_id})
                  this.dlgDownloadImages.visible = true
                  return
                }
              }
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
            openReviewDlg(id, score) {
              this.review.id = id
              this.review.score = score
              this.review.visible = true
            },
        },
        filters: {},
        mounted() {
        },
        async created() {
            this.$bus.on('mobile', isMobile => {
              this.isMobile = isMobile
            })

            this.$set(this.searchInfo, "is_ban", 1)
            this.$set(this.searchInfo, "dxm_goods_sku_type", "")
            this.$set(this.searchInfo, "sku_code_type", 1)
            this.$set(this.searchInfo, "exclude_sku_code_type", 1)
            this.$set(this.searchInfo, "is_factory", 1)

            this.$set(this.searchInfo, "search_cond", 1)
            this.$set(this.searchInfo, "include_tag", true)

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