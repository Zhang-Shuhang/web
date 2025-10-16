<template>
  <el-drawer :visible.sync="$attrs.visible" title="申请备货" @opened="onOpened" size="100%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        申请备货
      </div>
      <div style="display: block; float: right; margin-right: 20px" v-if="accountOptions">
        <el-select v-model="searchInfo.account_id" placeholder="请选择账号" size="mini" filterable clearable>
          <el-option value=""></el-option>
          <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="mini"  @click="apply">批量申请</el-button>
      </div>
    </div>

    <el-table class="table-body" :data="tableData" border size="mini" min-height="300px" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="账号" prop="item.sale.account.name" width="80" align="center" fixed>
      </el-table-column>
      <el-table-column label="变体图" width="80" align="center" fixed>
        <div slot-scope="{row}">
          <template v-if="row.item && row.item.item_image && row.item.item_image.image">
            <KdxImage :src="row.item.item_image.image" width="60px" height="60px"></KdxImage>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="产品" align="center" prop="item.sku_ext_code" width="150" sortable fixed>
        <div slot-scope="{row}">
          <div>
            <el-tag type="primary" size="mini">
              Skc Id: {{row.productSkcId}}
            </el-tag>
          </div>
          <div>
            <el-tag type="primary" size="mini">
              Sku Id: {{row.productSkuId}}
            </el-tag>
          </div>
          <div>
            <el-tag type="primary" size="mini">
              货号: {{row.item.sku_ext_code}}
            </el-tag>
          </div>
          <div>
            <el-tag size="mini" type="warning" effect="dark">层级: {{levelName(row.item)}}</el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="可发货" align="center" fixed>
        <div slot-scope="{row}">
          <el-tag type="primary" size="mini">可发货: {{row.applyLowerBound}} - {{row.applyUpperBound}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="申请发货" align="center" min-width="150px" fixed>
        <template slot="header">
          <span>申请发货</span>
          <el-input size="mini" v-model="apply_count" @keyup.enter.native="setApplyCount">
            <el-button slot="append" icon="el-icon-search" @click="setApplyCount"></el-button>
          </el-input>
        </template>
        <div slot-scope="{row}">
          <el-input-number size="mini" v-model="row.to_send" :min="0" :max="row.applyUpperBound" :step="1" style="width: 100%"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column label="申请次数" align="center" min-width="110px" fixed>
        <template slot="header">
          <span>申请次数</span>
          <el-input size="mini" v-model="apply_times" @keyup.enter.native="setApplyTimes">
            <el-button slot="append" icon="el-icon-search" @click="setApplyTimes"></el-button>
          </el-input>
        </template>
        <div slot-scope="{row}">
          <el-input-number size="mini" v-model="row.times" :step="1" :min="1" :max="30" style="width: 100%"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column label="价格" align="center">
        <div slot-scope="{row}">
          <div v-if="row.item && row.item.currency_type && row.item.supplier_price">
            供货价: {{ row.item.supplier_price/100 }}
          </div>
          <div v-if="row.item && row.item.daily_history">
            成本: {{ row.item.daily_history.price.toFixed(1) }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="平台可售天数" align="center">
        <el-table-column label="Temu" prop="item.available_sale_days_from_inventory" sortable="custom" align="center">
        </el-table-column>
        <el-table-column label="我" prop="item.daily_history.custom_available_sale_days_from_inventory" sortable="custom" align="center">
          <template slot="header">
            我
            <el-tooltip content="含发货在途">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <div slot-scope="{row}">
            <template v-if="row.item && row.item.daily_history">
              <el-tag size="small" type="danger" effect="dark" v-if="row.item.daily_history.custom_available_sale_days_from_inventory <= 4">
                {{row.item.daily_history.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
              <el-tag size="small" type="warning" effect="dark" v-else-if="row.item.daily_history.custom_available_sale_days_from_inventory <= 8">
                {{row.item.daily_history.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
              <el-tag size="small" type="success" v-else>
                {{row.item.daily_history.custom_available_sale_days_from_inventory.toFixed(2)}}
              </el-tag>
            </template>
          </div>
        </el-table-column>
      </el-table-column>
      <el-table-column label="店小秘" align="center" min-width="120px">
        <div slot-scope="{row}">
          <template v-if="row.item && row.item.daily_history">
            <el-tooltip content="加工在途(采购在途)" placement="right" v-if="row.item.daily_history.is_jg">
              <el-tag type="primary" size="mini" >总在途: {{ row.item.daily_history.on_way_count }}({{ row.item.daily_history.jg_on_way_count }})</el-tag>
            </el-tooltip>
            <div v-else>
              <el-tag type="primary" size="mini" v-if="row.item && row.item.daily_history">
                总在途: {{ row.item.daily_history.on_way_count }}
              </el-tag>
            </div>

            <div>
              <el-tag type="primary" size="mini">
                总入仓: {{ row.item.daily_history.kcl_count }}
              </el-tag>
            </div>

            <div>
              <el-tag type="primary" size="mini" v-if="row.item.daily_history.share_dxm">总发出: {{row.item.daily_history.total_plan_count}}({{row.item.daily_history.other_total_plan_count}})</el-tag>
              <el-tag type="primary" size="mini" v-else>总发出: {{row.item.daily_history.total_plan_count}}</el-tag>
            </div>

            <div>
              <el-tag type="primary" size="mini">
                仓内剩余: {{row.item.daily_history.real_inventory_in_warehouse}}
              </el-tag>
            </div>
            <div>
              <el-tag type="primary" size="mini">
                最多可加工: {{row.item.daily_history.jg_kcl_count}}
              </el-tag>
            </div>
            <div>
              <el-tag type="primary" size="mini">
                总剩余: {{row.item.daily_history.real_inventory}}
              </el-tag>
            </div>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <div slot-scope="{row}">
          <template v-if="row.item">
            <div><el-tag type="primary" size="mini">仓内: {{row.item.sales_inventory_num}}</el-tag></div>
            <div><el-tag type="primary" size="mini">不可用: {{row.item.unavailable_warehouse_inventory_num}}</el-tag></div>
            <div><el-tag type="primary" size="mini">已发货: {{row.item.wait_receive_num}}</el-tag></div>
            <div><el-tag type="primary" size="mini">待质检: {{row.item.wait_qc_num}}</el-tag></div>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="Vmi" align="center">
        <div slot-scope="{row}">
          <template v-if="row.item">
            <div><el-tag type="primary" size="mini">待发(量): {{row.item.daily_history.wait_delivery_inventory_num}}</el-tag></div>
            <div><el-tag type="primary" size="mini">待发(件): {{row.item.vmi_wait_delivery_num}}</el-tag></div>
            <div><el-tag type="primary" size="mini">在途: {{row.vmi_transportation_num}}</el-tag></div>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="销量" align="center">
        <el-table-column label="7系" prop="item.daily_history.seven_day_coef" sortable="custom" sort-by="today" align="center">
          <template slot="header">
            <el-tooltip content="7日系数">
              <span>7系</span>
            </el-tooltip>
          </template>
          <div slot-scope="{row}">
            <template v-if="row.item && row.item.daily_history">
              {{row.item.daily_history.seven_day_coef.toFixed(2)}}
              <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row.productSkuId)" plain>订单</el-button>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="30系" prop="item.daily_history.thirty_day_coef" sortable="custom" sort-by="today" align="center">
          <template slot="header">
            <el-tooltip content="30日系数">
              <span>30系</span>
            </el-tooltip>
          </template>
          <div slot-scope="{row}">
            <template v-if="row.item && row.item.daily_history">
              {{row.item.daily_history.thirty_day_coef.toFixed(2)}}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="90系" prop="item.daily_history.ninety_day_coef" sortable="custom" sort-by="today" align="center">
          <template slot="header">
            <el-tooltip content="90日系数">
              <span>90系</span>
            </el-tooltip>
          </template>
          <div slot-scope="{row}">
            <template v-if="row.item && row.item.daily_history">
              {{row.item.daily_history.ninety_day_coef.toFixed(2)}}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="今" prop="item.daily_history.today" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="差" prop="item.daily_history.two_day_diff" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="昨" prop="item.daily_history.two_day" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="差" prop="item.daily_history.three_day_diff" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="前" prop="item.daily_history.three_day" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="7" prop="item.daily_history.seven_day" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="30" prop="item.daily_history.thirty_day" sortable="custom" sort-by="today" align="center">
        </el-table-column>
        <el-table-column label="全" prop="item.daily_history.all" sortable="custom" sort-by="today" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="100px" fixed="right">
        <div slot-scope="{row}">
          <el-button size="mini" type="warning" @click="remove(row)">移除</el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :style="{textAlign:'right'}"
        :page-sizes="[20, 50, 100]"
        :total="total"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, prev, next, jumper, sizes"
    ></el-pagination>

    <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
  </el-drawer>
</template>

<script>
import {stockBatch, create} from "@/api/temu/stock";
import KdxImage from "@/components/image/image.vue";
import infoList from "@/components/mixins/infoList";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";

export default {
  name: 'TemuDlgStockBatch',
  components: {TemuDlgDaily, KdxImage},
  mixins: [infoList],
  props: {
    accountOptions: {
      type: Array,
    },
    ids: {
      type: Array,
    },
    sku_ids: {
      type: Array,
    },
    dxm_sku: {
      type: String,
    },
  },
  computed: {},
  watch: {
    "searchInfo.account_id"() {
      this.page = 1
      this.getTableData()
    }
  },
  data() {
    return {
      listApi: stockBatch,

      apply_count: 0,
      apply_times: 1,

      daily: {
        id: undefined,
        visible: false,
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    setApplyCount() {
      this.tableData.forEach((item) => {
        item.to_send = this.apply_count
      })
    },
    setApplyTimes() {
      this.tableData.forEach((item) => {
        item.times = this.apply_times
      })
    },
    onOpened() {
      if (this.accountOptions.length <= 0) {
        return
      }

      if (this.ids) {
        this.$set(this.searchInfo, "ids", this.ids)
      }
      if (this.sku_ids) {
        this.$set(this.searchInfo, "sku_ids", this.sku_ids)
      }
      if (this.dxm_sku) {
        this.$set(this.searchInfo, "dxm_sku", this.dxm_sku)
      }

      this.page = 1
      this.pageSize = 100

      this.getTableData()
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    apply() {
      let quantity_map = new Map()
      let times_map = new Map()
      for (const v of this.tableData) {
        if (v.to_send > 0) {
          let d = quantity_map.get(v.productSkcId)
          if (!d) {
            d = new Map()
            quantity_map.set(v.productSkcId, d)
          }
          d.set(v.productSkuId, v.to_send)

          if (!times_map.get(v.productSkcId) || v.times > times_map.get(v.productSkcId)) {
            times_map.set(v.productSkcId, v.times)
          }
        }
      }

      for (const k of quantity_map.keys()) {
        let v = quantity_map.get(k)
        this.create(k, v, times_map.get(k))
      }
    },
    async create(k, v, times) {
      if (times < 1) {
        times = 1
      }
      let resp = await create({skc_id: k, quantity_map: Object.fromEntries(v), times: times, split: true})
      if (resp.code === 0) {
        this.$message("申请成功, skc: " + k)
      }
    },
    remove(item) {
      const index = this.tableData.indexOf(item);
      if (index > -1) {
        this.tableData.splice(index, 1);
      }
    },
    levelName(row) {
      if (!row) {
        return "新品"
      }

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
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>