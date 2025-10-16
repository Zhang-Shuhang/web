<template>
  <el-drawer :visible.sync="$attrs.visible" title="库存分配" @opened="onOpened" size="85%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title" class="title">
      <div style="float: left">
        <span v-if="stock">库存分配</span>
        <span style="color: red; font-size: 30px; font-weight: bolder" v-else>库存分配, 只可减少, 且不计入库存增减日志, 风险自担</span>
      </div>

      <div style="float: right; width: 200px; margin-right: 20px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button style="width: 100%" size="mini" type="primary" @click="refresh">刷新</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-table class="table-body" ref="multipleTable" :data="array" border min-height="20vh" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="账号" prop="variation.product.account.name" align="center" fixed>
      </el-table-column>
      <el-table-column label="状态" prop="variation.product.select.status" align="center" fixed>
        <template slot-scope="{row}">
          <div v-if="row.variation && row.variation.product && row.variation.product.select">
            <el-tag size="mini" effect="dark" :type="row.variation.product.select.status > 12 ? `danger` : `primary`">
              {{ selectStatusName(row.variation.product.select) }}
            </el-tag>

            <div v-if="row.variation.product.select.remark_types">
              原因: {{ row.variation.product.select.remark_types.join("\n") }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Skc" prop="variation.product.product_skc_id" align="center" fixed>
        <template slot-scope="{row}">
          {{ row.variation.product.product_skc_id }}
          <el-link type="primary"
                   :href="`https://www.temu.com/goods.html?goods_id=${row.variation.product.goods_id}&no_cache_id=egv4k`"
                   :underline="false" target="_blank" v-if="row.variation && row.variation.product">
            前端查看
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="Sku" prop="sku_id" align="center" fixed>
        <template slot-scope="{row}">
          {{ row.sku_id }}
          <div v-if="row.variation && row.variation.is_y2">
            <el-tag size="mini" type="danger" effect="dark">Y2</el-tag>
          </div>
          <div v-if="row.variation && !row.variation.is_y2">
            <el-tag size="mini" type="primary">半托管</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="货号" prop="variation.ext_code" align="center" fixed>
      </el-table-column>
      <el-table-column label="图片" align="center" fixed>
        <template slot-scope="{row}">
          <KdxImage :src="row.variation.thumb_url" v-if="row.variation"></KdxImage>
        </template>
      </el-table-column>
      <el-table-column label="价格" prop="variation.ext_code" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini" type="primary" v-if="row.variation">
            {{ (row.variation.supplier_price / 100).toFixed(2) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="仓库" prop="warehouse_id" align="center">
        <template slot-scope="{row}">
          <el-select size="mini" v-model="row.warehouse_id" placeholder="请选择仓库" filterable
                     :style="{width: '100%'}">
            <el-option v-for="(w, index) in row.warehouse_list" :key="index" :label="w.name" :value="w.id"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="当前库存" prop="stock_available" align="center">
      </el-table-column>
      <el-table-column label="调整库存" prop="add" align="center" width="150">
        <template slot="header">
          <div>调整库存</div>
          <div>
            <el-input-number size="mini" style="width: 100%" :precision="0" placeholder="调整" v-model="setting.stock"
                             clearable filterable @change="setStock"></el-input-number>
          </div>
        </template>
        <template slot-scope="{row}">
          <el-input-number size="mini" :min="-row.stock_available" :max="maxCanAllocate(row)" :step="1"
                           :precision="0" v-model="row.add" placeholder="调整库存，负数表示减少" style="width: 100%"
                           clearable></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="修改后库存" prop="add" align="center">
        <template slot-scope="{row}">
          {{ row.stock_available + row.add }}
        </template>
      </el-table-column>
      <el-table-column label="预售" prop="enable_pre_sale" align="center" width="200px">
        <template slot-scope="{row}">
          <template v-if="row.enable_pre_sale">
            <div>
              <el-date-picker size="mini" type="date" v-model="row.pre_sale_stock_delivery_day" :readonly="true"
                              format="yyyy/MM/dd" value-format="timestamp" :style="{width: '100%'}"
                              placeholder="补货日期(最迟7天)" clearable></el-date-picker>
            </div>
            <div>
              <el-input-number size="mini" :min="0" :step="1" :precision="0" v-model="row.target_pre_sale_stock"
                               placeholder="预售库存" style="width: 100%" clearable></el-input-number>
            </div>
            <el-row>
              <el-col :span="12">
                <el-button size="mini" type="danger" style="width: 100%" @click="disablePreSale(row)">关闭</el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" type="primary" style="width: 100%" @click="changeEnablePreSale(row)">更新
                </el-button>
              </el-col>
            </el-row>
          </template>
          <template v-else>
            <div>
              <el-date-picker size="mini" type="date" v-model="row.pre_sale_stock_delivery_day" format="yyyy/MM/dd"
                              value-format="timestamp" :style="{width: '100%'}" placeholder="补货日期(最迟7天)"
                              :picker-options="pickerOptions" clearable></el-date-picker>
            </div>
            <div>
              <el-input-number size="mini" :min="0" :step="1" :precision="0" v-model="row.target_pre_sale_stock"
                               placeholder="预售库存" style="width: 100%" clearable></el-input-number>
            </div>
            <div>
              <el-button size="mini" type="primary" style="width: 100%" @click="changeEnablePreSale(row)">开启
              </el-button>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="今日销量" prop="variation.daily_history.today" align="center">
      </el-table-column>
      <el-table-column label="昨日销量" prop="variation.daily_history.two_day" align="center">
      </el-table-column>
      <el-table-column label="前日销量" prop="variation.daily_history.three_day" align="center">
      </el-table-column>
      <el-table-column label="7日系数" prop="variation.daily_history.seven_day_coef" align="center">
        <template slot-scope="{row}">
          {{ row.variation && row.variation.daily_history ? row.variation.daily_history.seven_day_coef.toFixed(2) : 0 }}
        </template>
      </el-table-column>
      <el-table-column label="30日系数" prop="variation.daily_history.thirty_day_coef" align="center">
        <template slot-scope="{row}">
          {{
            row.variation && row.variation.daily_history ? row.variation.daily_history.thirty_day_coef.toFixed(2) : 0
          }}
        </template>
      </el-table-column>
      <el-table-column label="90日系数" prop="variation.daily_history.ninety_day_coef" align="center">
        <template slot-scope="{row}">
          {{
            row.variation && row.variation.daily_history ? row.variation.daily_history.ninety_day_coef.toFixed(2) : 0
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right">
        <template slot-scope="{row}">
          <div>
            <el-button style="width: 100%" size="mini" type="danger" @click="allocate(row)"
                       :disabled="!row.add || !row.warehouse_id">分配
            </el-button>
          </div>
          <div style="margin-top: 5px">
            <el-button style="width: 100%" size="mini" type="primary" @click="openDaily(row.sku_id)">订单统计
            </el-button>
          </div>
          <div style="margin-top: 5px">
            <el-button style="width: 100%" size="mini" type="primary"
                       @click="openCreateCoupon(row.variation.product_id)">创建优惠券
            </el-button>
          </div>
          <div style="margin-top: 5px">
            <el-button style="width: 100%" size="mini" type="primary" @click="openApply([row.variation.product_id])">
              活动报名
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-button size="medium" type="primary"
               style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999"
               @click="allocateAll">逐个分配
    </el-button>
    <el-button size="medium" type="warning"
               style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 180px; z-index: 9999"
               @click="clear">清空
    </el-button>

    <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
    <TemuDlgCouponApply :ids="dlgBatchCreateCoupon.ids" :visible="dlgBatchCreateCoupon.visible"
                        @close="dlgBatchCreateCoupon.visible=false"></TemuDlgCouponApply>
    <TemuDlgActivityProducts :ids="dlgActivityProduct.ids" :visible="dlgActivityProduct.visible"
                             @close="dlgActivityProduct.visible=false"></TemuDlgActivityProducts>
  </el-drawer>
</template>


<script>
import {semiAddEnablePreSale, semiAddPlatformStock, semiPlatformStock} from "@/api/temu/semi";
import {overseasWarehouseStock} from "@/api/oversea_warehouse/list";
import KdxImage from "@/components/image/image.vue";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";
import TemuDlgCouponApply from "@/view/temu/coupon/components/dlg_coupon_apply.vue";
import TemuDlgActivityProducts from "@/view/temu/activity/components/dlg_activity_products.vue";

export default {
  name: 'TemuDlgStockAllocate',
  components: {TemuDlgActivityProducts, TemuDlgCouponApply, TemuDlgDaily, KdxImage},
  mixins: [],
  props: {
    id: {
      type: String,
    },
    sku_ids: {
      type: Array,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      stock: undefined,
      setting: {
        stock: undefined,
      },
      array: [],

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now() || time.getTime() > Date.now() + 3600 * 1000 * 24* 7;
        },
        shortcuts: [
          {
            text: '7天后',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24* 7);
              picker.$emit('pick', date);
            }
          },
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          },
        ]
      },

      daily: {
        id: undefined,
        visible: false,
      },

      dlgBatchCreateCoupon: {
        ids: [],
        visible: false,
      },

      dlgActivityProduct: {
        ids: [],
        visible: false,
      },

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
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.refresh()
    },
    async refresh() {
      if (this.id) {
        let resp = await overseasWarehouseStock({id: this.id})
        if (resp.code) {
          return
        }
        this.stock = resp.data
      } else {
        this.stock = undefined
      }
      let resp = await semiPlatformStock({ids: this.sku_ids})
      if (resp.code) {
        return
      }

      resp.data.forEach((item) => {
        if (!item.warehouse_id && item.warehouse_list.length > 0) {
          item.warehouse_id = item.warehouse_list[0].id
        }
        item.add = 0
      })
      this.array = resp.data
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
    openCreateCoupon(productId) {
      this.dlgBatchCreateCoupon.ids = [productId]
      this.dlgBatchCreateCoupon.visible = true
    },
    allocate(row) {
      this.$confirm('请确认是否分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await semiAddPlatformStock({
          id: row.sku_id,
          add: row.add,
          stock_id: this.id,
          stock_available: row.stock_available,
          warehouse_id: row.warehouse_id
        })
        if (resp.code) {
          return
        }
        this.$message("操作成功")
        this.$emit("suc")
        this.refresh()
      })
    },
    clear() {
      this.array.forEach((item) => {
        item.add = -item.stock_available
      })
      this.allocateAll()
    },
    allocateAll() {
      let list = this.array.filter((item) => {
        return item.add !== 0
      })
      if (list.length <= 0) {
        this.$message.error("没有需要变更的")
        return
      }
      list.sort((a, b) => {
        return a.add < b.add ? -1 : 1
      })

      let semiTotalAdd = 0;
      let hasNotY2 = false
      for (const v of list) {
        if (!v.variation.is_y2) {
          hasNotY2 = true
        } else {
          if (v.add > 0) {
            semiTotalAdd += v.add
          }
        }
      }
      if (hasNotY2 && semiTotalAdd > 0) {
        if (!this.stock || (this.stock.count >= 0 && this.stock.count < semiTotalAdd)) {
          this.$message.error("库存不足，无法分配")
          return
        }
      }

      this.$confirm('请确认是否分配?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        for (const row of list) {
          let resp = await semiAddPlatformStock({
            id: row.sku_id,
            add: row.add,
            stock_id: this.id,
            stock_available: row.stock_available,
            warehouse_id: row.warehouse_id
          })
          if (resp.code) {
            this.refresh()
            return
          }

          row.add = 0
        }

        this.$message("操作成功")
        this.$emit("suc")
        this.refresh()
      })
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    openApply(productIds) {
      this.dlgActivityProduct.ids = productIds
      this.dlgActivityProduct.visible = true
    },
    disablePreSale(row) {
      this.$confirm('是否确认关闭预售，七天后才能再次开启', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        let resp = await semiAddEnablePreSale({id: row.sku_id, enable: false})
        if (resp.code) {
          return
        }

        this.$message("操作成功")
        this.refresh()
      })
    },
    changeEnablePreSale(row) {
      this.$confirm('是否确认开启预售?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async () => {
        let resp = await semiAddEnablePreSale({
          id: row.sku_id,
          enable: true,
          warehouse_id: row.warehouse_id,
          pre_sale_delivery_day: row.pre_sale_stock_delivery_day,
          current_pre_sale_stock_available: row.in_transit_pre_sale_stock,
          target_pre_sale_stock_available: row.target_pre_sale_stock,
          current_shipping_mode: row.shipping_mode
        })
        if (resp.code) {
          return
        }

        this.$message("操作成功")
        this.refresh()
      })
    },
    maxCanAllocate(row) {
      if (row.variation.is_y2) {
        return 10000
      }

      let count = Math.max(this.stock ? this.stock.real_stock_count : 0, 0)
      for (const v of this.array) {
        if (v === row) {
          continue
        }
        count -= v.add
      }
      return count
    },
    setStock() {
      let s = Number(this.setting.stock)
      if (!s) {
        return
      }
      this.array.forEach((item) => {
        item.add = s
      })
      this.setting.stock = undefined
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