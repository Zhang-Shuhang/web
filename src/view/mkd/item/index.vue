<template>
    <div>
        <div class="search-term">
            <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
                <!-- 状态选择 -->
                <!-- 搜索标题 -->
                <el-row :gutter="15">
                    <el-col :span="4">
                        <el-form-item label-width="0">
                            <el-select v-model="searchInfo.account_ids" placeholder="账号" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label-width="0">
                            <el-select v-model="searchInfo.seller_ids" placeholder="地区" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in accountSiteOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label-width="0">
                            <el-select v-model="searchInfo.status_list" placeholder="条件" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                                <el-option v-for="(item, index) in statusOptions" :key="index" :label="statusZh(item)" :value="item"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label-width="0">
                            <el-input v-model="searchInfo.content" type="primary" clearable>
                                <el-select v-model="searchInfo.type" slot="prepend" placeholder="请选择" style="width: 130px">
                                    <el-option label="编号搜索" value="1"></el-option>
                                    <el-option label="标题搜索" value="2"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label-width="0">
                            <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                      :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
                <el-table-column width="200px" label="产品" prop="id" align="center" fixed>
                    <template slot-scope="{row}">
                        <div>
                            <el-tooltip :content="row.item.title">
                                <el-tag size="mini">{{row.item.id}}</el-tag>
                            </el-tooltip>
                        </div>
                        <div>
                            <el-tag size="mini">{{row.id}}</el-tag>
                        </div>
                        <div>
                            <el-tag size="mini">类目: {{row.item.category_id}}</el-tag>
                        </div>
                        <div>
                            <el-tag size="mini" :type="statusType(row.item.status)">状态: {{statusZh(row.item.status)}}</el-tag>
                        </div>
                        <div>
                            <el-tag size="mini" v-if="row.item.original_price">
                                售价: {{row.item.currency_id}} {{row.item.price}}/{{row.item.original_price}}
                            </el-tag>
                            <el-tag size="mini" v-else>
                                售价: {{row.item.currency_id}} {{row.item.price}}
                            </el-tag>
                        </div>
                        <div>
                            <el-tag size="mini">创建时间: {{new Date(row.item.created_at).toLocaleString()}}</el-tag>
                        </div>
                        <KdxImage :src="picture(row.item.pictures, id)" v-for="(id, index) in row.picture_ids" :key="index" v-show="index <= 0" style="display: inline-block"></KdxImage>
                    </template>
                </el-table-column>
                <el-table-column label="库存" align="center">
                    <el-table-column width="60px" label="可售" prop="stock.available_quantity" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="60px" label="可发" prop="stock.send_stock.can_send_stock" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="60px" label="在途" prop="stock.send_stock.waiting_arrival" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="60px" label="坏了" prop="stock.send_stock.unavailables" align="center" sortable="custom"></el-table-column>
                </el-table-column>
                <el-table-column label="备货建议" align="center">
                    <el-table-column label="空运(25天)" align="center">
                        <el-table-column width="50px" label="3" prop="stat.day3_ky_advice" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="5" prop="stat.day5_ky_advice" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="7" prop="stat.day7_ky_advice" align="center" sortable="custom"></el-table-column>
                    </el-table-column>
                    <el-table-column label="海运(80天)" align="center">
                        <el-table-column width="50px" label="3" prop="stat.day3_hy_advice" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="5" prop="stat.day5_hy_advice" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="7" prop="stat.day7_hy_advice" align="center" sortable="custom"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="广告" align="center">
                    <el-table-column width="150px" label="组" align="center">
                        <template slot-scope="{row}">
                            <template v-if="row.item && row.item.item_campaign && row.item.item_campaign.campaign">
                                <el-tag type="primary">{{row.item.item_campaign.campaign.name}}</el-tag>
                                <br>
                                <el-tag type="primary">{{row.item.item_campaign.campaign.status}}</el-tag>
                                <br>
                                <el-tag type="primary">{{row.item.item_campaign.campaign.strategy}}</el-tag>
                                <br>
                                <el-tag type="primary">{{row.item.item_campaign.campaign.acos_target}}%</el-tag>
                                <br>
                                <el-link size="mini" type="primary" :href="`https://global-selling.mercadolibre.com/advertising/product-ads/admin/dashboard?campaign_id=${row.item.item_campaign.campaign.id}`" :underline="false" target="_blank" v-if="row.item.permalink">跳转</el-link>
                            </template>
                            <el-tag type="danger" v-else>
                                没广告
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="费" align="center">
                        <el-table-column width="60px" label="2($)" prop="stat.day2_ad" align="center" sortable="custom">
                            <template slot-scope="{row}">
                                {{row.stat.day2_ad.toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column width="60px" label="3($)" prop="stat.day3_ad" align="center" sortable="custom">
                            <template slot-scope="{row}">
                                {{row.stat.day3_ad.toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column width="60px" label="4($)" prop="stat.day4_ad" align="center" sortable="custom">
                            <template slot-scope="{row}">
                                {{row.stat.day4_ad.toFixed(2)}}
                            </template>
                        </el-table-column>
                        <el-table-column width="65px" label="全($)" prop="stat.day_all_ad" align="center" sortable="custom">
                            <template slot-scope="{row}">
                                {{row.stat.day_all_ad.toFixed(2)}}
                            </template>
                        </el-table-column>
                    </el-table-column>
                    <el-table-column label="单" align="center">
                        <el-table-column width="50px" label="2" prop="stat.day2_ad_order" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="3" prop="stat.day3_ad_order" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="4" prop="stat.day4_ad_order" align="center" sortable="custom"></el-table-column>
                        <el-table-column width="50px" label="全" prop="stat.day_all_ad_order" align="center" sortable="custom"></el-table-column>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="销量" align="center">
                    <el-table-column width="50px" label="1" prop="stat.day1" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="2" prop="stat.day2" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="3" prop="stat.day3" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="4" prop="stat.day4" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="5" prop="stat.day5" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="6" prop="stat.day6" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="7" prop="stat.day7" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="8" prop="stat.day8" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="9" prop="stat.day9" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="10" prop="stat.day10" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="11" prop="stat.day11" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="12" prop="stat.day12" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="13" prop="stat.day13" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="14" prop="stat.day14" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="15" prop="stat.day15" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="30" prop="stat.day30" align="center" sortable="custom"></el-table-column>
                    <el-table-column width="50px" label="全" prop="stock.sold_quantity" align="center" sortable="custom"></el-table-column>
                </el-table-column>
                <el-table-column width="100px" label="操作" align="center" fixed>
                    <template slot-scope="{row}">
                        <div>
                            <el-link size="mini" type="primary" :href="row.item.permalink" :underline="false" target="_blank" v-if="row.item.permalink">前台查看</el-link>
                        </div>
                        <div>
                            <el-link size="mini" type="primary" :href="`https://global-selling.mercadolibre.com/listings/list?page=1&search=${row.item.id}&sort=`" :underline="false" target="_blank">后台查看</el-link>
                        </div>
                        <div>
                            <el-button size="mini" type="primary" plain @click="openShipmentUnisList(row.id)">发货列表</el-button>
                        </div>
                        <div>
                            <el-button size="mini" type="primary" plain>产品设置</el-button>
                        </div>
                        <div>
                            <el-button size="mini" type="primary" plain>每日订单</el-button>
                        </div>
                        <div>
                            <el-button size="mini" type="primary" plain>每日广告</el-button>
                        </div>
                        <div>
                            <el-button size="mini" type="primary" plain>每日流量</el-button>
                        </div>
                    </template>
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

        <MkdDlgShipmentUnits :variation_id="shipmentUnits.variation_id" :visible="shipmentUnits.visible" @close="shipmentUnits.visible=false"></MkdDlgShipmentUnits>
    </div>

</template>

<script>
    import infoList from '@/components/mixins/infoList'
    import {accountList} from "@/api/mkd/account";
    import {itemStatusList, itemList} from "@/api/mkd/item";
    import KdxImage from "@/components/image/image";
    import MkdDlgShipmentUnits from "../components/dlg_shipment_units";

    export default {
        components: {
            MkdDlgShipmentUnits,
            KdxImage
        },
        mixins: [infoList],
        data() {
            return {
                accountOptions: [],
                statusOptions: [],
                listApi: itemList,

                shipmentUnits: {
                    variation_id: 0,
                    visible: false,
                }
            }
        },
        computed: {
            accountSiteOptions() {
                let list = this.accountOptions
                if (this.searchInfo.account_ids && this.searchInfo.account_ids.length > 0) {
                    list = this.accountOptions.filter((v) => {
                        return this.searchInfo.account_ids.indexOf(v.id) >= 0
                    })
                }

                let siteList = []
                list.forEach((v)=>{
                    v.sites.forEach((d) => {
                        d.name = this.accountSiteLabel(v.name, d)
                        siteList.push(d)
                    })
                })

                return siteList
            }
        },
        methods: {
            onSubmit() {
                this.page = 1
                this.getTableData()
            },
            accountSiteLabel(accountName, item) {
                if (item.logistic_type === "remote") {
                    return `${accountName}-${item.site_id}-自发货`
                }
                return `${accountName}-${item.site_id}-FBM`
            },
            statusZh(status) {
                switch (status) {
                    case "active":
                        return "在售"
                    case "paused":
                        return "暂停"
                    case "under_review":
                        return "审核中"
                }
                return status
            },
            statusType(status) {
                switch (status) {
                    case "active":
                        return "primary"
                    case "paused":
                        return "danger"
                    case "under_review":
                        return "warning"
                }
                return "primary"
            },
            picture(list, id) {
                let v = list.find((v) => {
                    return v.id === id
                })
                if (!v) {
                    return ""
                }
                return v.url
            },
            openShipmentUnisList(id) {
                this.shipmentUnits.variation_id = id
                this.shipmentUnits.visible = true
            }
        },
        filters: {},
        mounted() {
        },
        async created() {
            // 请求账号列表
            this.$set(this.searchInfo, "type", "1")

            let accountListResp = await accountList()
            if (accountListResp.code === 0) {
                this.accountOptions = accountListResp.data.list
            }

            let statusListResp = await itemStatusList()
            if (statusListResp.code === 0) {
                this.statusOptions = statusListResp.data
            }
            this.getTableData()
        }
    }
</script>
<style scoped lang="scss">
</style>