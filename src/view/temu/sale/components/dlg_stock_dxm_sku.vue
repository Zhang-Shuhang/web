<template>
  <el-dialog :visible.sync="$attrs.visible" title="申请备货(共享)" @opened="onOpened" width="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" :data="toSet.list" border size="mini" min-height="300px" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="账号" prop="item.sale.account.name" width="80" align="center" fixed>
      </el-table-column>
      <el-table-column label="主图" width="80" align="center" fixed>
        <div slot-scope="{row}">
          <KdxImage :src="row.item.sale.product_skc_picture" width="60px" height="60px"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="变体图" width="80" align="center" fixed>
        <div slot-scope="{row}">
          <template v-if="row.item.item_image">
            <KdxImage :src="row.item.item_image.image" width="60px" height="60px"></KdxImage>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="产品" align="center" prop="item.sku_ext_code" width="120" sortable fixed>
      </el-table-column>
      <el-table-column label="Skc Id" align="center" prop="item.sale.product_skc_id" width="120" sortable fixed>
      </el-table-column>
      <el-table-column label="Sku Id" align="center" prop="productSkuId" width="120" sortable fixed>
      </el-table-column>
      <el-table-column label="层级" align="center" prop="productSkuId" fixed>
        <div slot-scope="{row}">
          <el-tag size="mini" type="warning" effect="dark">{{levelName(row.item)}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="可发货" align="center" fixed>
        <div slot-scope="{row}">
          <el-tag type="primary" v-if="row.applyUpperBoundInSkcScope">{{row.applyLowerBoundInSkcScope}}-{{row.applyUpperBoundInSkcScope}}</el-tag>
          <el-tag type="primary" v-else>{{row.applyUpperBound}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="供货价" align="center">
        <div slot-scope="{row}">
          {{ row.currencyType }}{{ row.supplierPrice/100 }}
        </div>
      </el-table-column>
      <el-table-column label="申请发货" align="center" width="180px" fixed>
        <div slot-scope="{row}">
          <el-input-number size="mini" v-model="row.to_send" :min="0" :max="row.applyUpperBound ? row.applyUpperBound : row.applyUpperBoundInSkcScope" :step="1"></el-input-number>
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
            <template v-if="row.item.daily_history">
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
      <el-table-column label="店小秘" align="center">
        <el-table-column label="总在途" prop="item.daily_history.on_way_count" sortable="custom" align="center">
          <div slot-scope="{row}">
            <template v-if="row.item && row.item.daily_history">
              <el-tooltip content="加工在途(采购在途)" placement="right" v-if="row.item.daily_history.is_jg">
                <div>{{ row.item.daily_history.on_way_count }}({{ row.item.daily_history.jg_on_way_count }})</div>
              </el-tooltip>
              <div v-else>{{ row.item.daily_history.on_way_count }}</div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="总入仓" prop="item.daily_history.kcl_count" sortable="custom" align="center">
        </el-table-column>
        <el-table-column label="总发出" prop="item.daily_history.total_plan_count" sortable="custom" align="center">
          <div slot-scope="{row}">
            <el-tag type="primary" v-if="row.item.daily_history.share_dxm">{{row.item.daily_history.total_plan_count}}({{row.item.daily_history.other_total_plan_count}})</el-tag>
            <el-tag type="primary" v-else>{{row.item.daily_history.total_plan_count}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="仓内剩余" prop="item.daily_history.real_inventory_in_warehouse" sortable="custom" align="center">
        </el-table-column>
        <el-table-column label="最多可加工" prop="item.daily_history.jg_kcl_count" sortable="custom" align="center">
        </el-table-column>
        <el-table-column label="总剩余" prop="item.daily_history.real_inventory" sortable="custom" align="center">
        </el-table-column>
      </el-table-column>
      <el-table-column label="库存" align="center">
        <el-table-column label="仓内" align="center">
          <el-table-column label="仓内" prop="item.sales_inventory_num" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="不可用" prop="item.unavailable_warehouse_inventory_num" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="已发货" prop="item.wait_receive_num" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="待质检" prop="item.wait_qc_num" sortable="custom" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column label="Vmi" align="center">
          <el-table-column label="待发(量)" prop="item.daily_history.wait_delivery_inventory_num" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="待发(件)" prop="item.vmi_wait_delivery_num" sortable="custom" align="center">
          </el-table-column>
          <el-table-column label="在途" prop="item.vmi_transportation_num" sortable="custom" align="center">
          </el-table-column>
        </el-table-column>
      </el-table-column>
      <el-table-column label="销量" align="center">
        <el-table-column label="7日系数" prop="item.daily_history.seven_day_coef" sortable="custom" sort-by="today" align="center">
          <div slot-scope="{row}">
            <template v-if="row.item.daily_history">
              {{row.item.daily_history.seven_day_coef.toFixed(2)}}
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
    </el-table>
    <el-row style="margin-top: 20px" :gutter="20">
      <el-col :span="8">
        <el-switch style="display: block" v-model="split" active-text="每个Sku请求一次" inactive-text="整体请求一次">
        </el-switch>
      </el-col>
      <el-col :span="8">
        <el-input-number v-model="times" :step="1" :min="1" :max="30" style="width: 100%"></el-input-number>
      </el-col>
      <el-col :span="8">
        <el-button type="primary" style="width: 100%;" @click="apply">申请</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {queryByDxmSku, create} from "@/api/temu/stock";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgStockDxmSku',
  components: {KdxImage},
  mixins: [],
  props: {
    sku: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      toSet: {
        list: [],
      },
      times: 0,
      split: true,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.toSet.list = []

      let resp = await queryByDxmSku({content: this.sku})
      if (resp.code) {
        return
      }

      for (const v of resp.data) {
        this.toSet.list.push(v)
      }

      this.times = 1
      this.split = true
    },
    async apply() {
      let quantity_map = new Map()
      for (const v of this.toSet.list) {
        if (v.to_send > 0) {
          let d = quantity_map.get(v.item.sale.product_skc_id)
          if (!d) {
            d = new Map()
            quantity_map.set(v.item.sale.product_skc_id, d)
          }
          d.set(v.productSkuId, v.to_send)
        }
      }

      let failCount = 0
      for (const k of quantity_map.keys()) {
        let v = quantity_map.get(k)
        let resp = await create({skc_id: k, quantity_map: Object.fromEntries(v), times: this.times, split: this.split})
        if (resp.code === 0) {
          this.$message("申请成功, skc: " + k)
        } else {
          failCount ++
        }
      }
      if (failCount <= 0) {
        this.$emit('close', false)
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