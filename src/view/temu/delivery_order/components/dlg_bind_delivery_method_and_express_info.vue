<template>
  <el-drawer :visible.sync="$attrs.visible" title="装箱发货" @opened="onOpened" size="60%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-tabs v-model="form.delivery_method" type="border-card" :stretch="true" v-if="!fix_address_id">
      <el-tab-pane :label="not_shipped_count ? `自行配送(${not_shipped_count})` : `自行配送`" name="1"></el-tab-pane>
      <el-tab-pane label="平台物流" name="2"></el-tab-pane>
    </el-tabs>

    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="230px" label-position="left"
             style="margin-left: 20px; margin-top: 30px">
      <template v-if="form.delivery_method === '1'">
        <el-form-item label="发货总箱数" prop="package_num">
          <el-input-number size="mini" v-model="form.package_num" :min="1" :step="1" :max="num" :precision="0"
                           style="width: 100%"></el-input-number>
        </el-form-item>
      </template>
      <template v-if="form.delivery_method === '2'">
        <el-form-item :label="`发货总重量(kg)[平台重: ${(originWeight/1000).toFixed(1)}kg]`" prop="total_weight">
          <el-input-number size="mini" v-model="form.total_weight" :min="1" :step="1" :precision="0"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="发货总箱数" prop="package_num">
          <el-input-number size="mini" v-model="form.package_num" :min="1" :step="1" :max="num" :precision="0"
                           style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="发货仓库" prop="delivery_address_id">
          <el-select v-model="form.delivery_address_id" filterable style="width: 100%" :disabled="fix_address_id>0">
            <el-option v-for="(item, index) in supplierAddressOptions" :key="index" :label="item.addressLabel"
                       :value="item.id">
              <!--            :disabled="item.townCode <= 0"-->
              <span style="float: left">{{ item.addressLabel }}</span>
              <span
                  style="float: right; color: #8492a6; font-size: 13px">{{ item.cityName }}-{{ item.districtName }}-{{
                  item.addressDetail
                }}{{ item.isDefault ? "(默认)" : "" }}<span v-if="item.times" style="color: red; font-weight: bold">[发货 {{item.times}} 次]</span></span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司" prop="express_company_id">
          <el-col :span="22">
            <el-select v-model="form.express_company_id" filterable style="width: 100%">
              <el-option v-for="(item, index) in expressCompanyOptions" :key="index"
                         :label="`${item.expressCompanyName}(${item.minSupplierChargeAmount}-${item.maxSupplierChargeAmount}元)`"
                         :value="item.expressCompanyId">
                <span style="float: left">{{ item.expressCompanyName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">费用: {{
                    item.minSupplierChargeAmount
                  }}-{{ item.maxSupplierChargeAmount }}元</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button icon="el-icon-refresh-right" @click="syncRecommendExpressCompany" style="width: 100%" type="primary" size="mini">刷新</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="是否今天" prop="is_today">
          <el-select v-model="form.is_today" filterable style="width: 100%">
            <el-option label="今天" :value="true"></el-option>
            <el-option label="明天" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="小时" prop="hour">
          <el-select v-model="form.hour" filterable style="width: 100%">
            <template v-for="(hour, index) in [9,10,11,12,13,14,15,16,17,18]">
              <el-option :key="index"
                         :label="`${hour}点55分`" :value="hour" v-if="!form.is_today || (hour >= min_hour && hour <= max_hour)"></el-option>
            </template>
          </el-select>
        </el-form-item>
      </template>
      <el-form-item label-width="0" style="margin-top: 30px">
        <el-button type="primary" style="width: 100%; height: 40px" @click="bind" :disabled="disabled">确认发货</el-button>
      </el-form-item>
    </el-form>

    <div style="margin-top: 20px">
      <el-table class="table-body" ref="multipleTable" :data="rows ? rows : []" border max-height="600px" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column label="发货Id" align="center" min-width="110px">
          <template slot-scope="{row}">
            <div v-if="row.account">
              <el-tag size="mini">{{ row.account.name }}</el-tag>
            </div>
            <div class="fs-12 lh-15">
              {{ row.deliveryOrderSn }}
            </div>
            <div>
              <el-tag size="mini" effect="dark">
                {{ row.status === 0 ? "待装箱发货" : row.status === 1 ? "待收货" : "已收货" }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品信息" align="center" min-width="245px">
          <template slot-scope="{row}">
            <div style="display: flex; margin-left: 10px">
              <div>
                <KdxImage :src="row.product.main_image_url" width="60px" height="60px" v-if="row.product"></KdxImage>
              </div>
              <div style="padding-left: 5px; text-align: left">
                <div class="fs-12 lh-15">
                  备货单号: {{ row.subPurchaseOrderSn }}
                </div>
                <div class="fs-12 lh-15">
                  Skc: {{ row.productSkcId }}
                </div>
                <div>
                  <el-tag size="mini" type="danger" effect="dark" v-if="row.urgencyType">加急</el-tag>
                  <el-tag size="mini" type="primary">{{ row.isFirst ? "首" : "返" }}</el-tag>
                  <el-tag size="mini" :type="row.purchaseStockType ? 'warning' : 'primary'" effect="dark">
                    {{ row.purchaseStockType ? "JIT" : "VMI" }}
                  </el-tag>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发货信息" align="center" min-width="180px">
          <div slot-scope="{row}">
            <div class="fs-12 lh-15">
              发货数量: {{ row.deliverSkcNum }}({{ row.skcPurchaseNum }})件
            </div>
            <el-tag size="mini">收货仓库: {{ row.subWarehouseName }}</el-tag>
            <el-tag size="mini" type="danger" effect="dark" v-if="row.endTime">过期时间:
              {{ new Date(row.endTime).toLocaleString() }}
            </el-tag>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {
  deliveryOrderBind, deliveryOrderPrint, deliveryOrderPrintSelfDelivery,
  deliveryOrderQueryRecommendExpressCompany,
  deliveryOrderQuerySupplierAddressInfo, deliveryOrderSyncFactory,
} from "@/api/temu/delivery_order";
import {selfDeliveryNotShippedCount} from "@/api/sf-factory-v2/self_delivery";

export default {
  name: 'TemuDlgBindDeliveryMethodAndExpress',
  components: {KdxImage},
  props: {
    rows: {
      type: Array, // 发货单号
    },
    fix_address_id: {
      type: Number, // 重量
    },
    weight: {
      type: Number, // 重量
    },
    originWeight: {
      type: Number, // 重量
      default: 0,
    },
    num: {
      type: Number, // 箱数
    },
    isJitOrCustom: {
      type: Boolean, // 是jit或定制
    }
  },
  computed: {
    ids() {
      let ids = []

      this.rows.forEach((item) => {
        ids.push(item.deliveryOrderSn)
      })

      return ids
    },
    allIds() {
      let ids = []

      this.rows.forEach((item) => {
        ids.push(item.deliveryOrderSn)
      })

      return ids
    },
    hasUnsaleable() {
      for (const row of this.rows) {
        for (const detail of row.details) {
          if (detail.item != null && detail.item.return_item != null && detail.item.return_item.thirty_day_total_count) {
            return true
          }
        }
      }

      return false
    },
    disabled() {
      if (this.form.delivery_method === "2") {
        if (this.form.total_weight < 1) {
          return true
        }

        if (!this.form.express_company_id) {
          return true
        }

        if (!this.form.delivery_address_id) {
          return true
        }

        if (this.form.package_num < 1) {
          return true
        }
      }

      return false
    },
    express() {
      if (!this.form.express_company_id) {
        return undefined
      }

      for (const op of this.expressCompanyOptions) {
        if (op.expressCompanyId === this.form.express_company_id) {
          return op
        }
      }

      return undefined
    },
    is_factory() {
      if (!this.form.delivery_address_id) {
        return false
      }

      for (const op of this.supplierAddressOptions) {
        if (op.id === this.form.delivery_address_id) {
          return op.cityName.indexOf("娄底") >= 0 && op.districtName.indexOf("双峰") >= 0 // && op.addressDetail.indexOf("经开区") >= 0
        }
      }

      return false
    },
    is_self() {
      if (!this.form.delivery_address_id) {
        return false
      }

      for (const op of this.supplierAddressOptions) {
        if (op.id === this.form.delivery_address_id) {
          return op.cityName.indexOf("深圳") >= 0 && op.districtName.indexOf("龙华") >= 0 // && op.addressDetail.indexOf("401") >= 0
        }
      }

      return false
    },
    sub_warehouse_name() {
      if (this.rows.length <= 0) {
        return ""
      }
      return this.rows[0].subWarehouseName
    },
  },
  watch: {
    "form.total_weight"() {
      this.syncRecommendExpressCompany()
    },
    "form.delivery_address_id"() {
      this.syncRecommendExpressCompany()
    },
    "form.package_num"() {
      this.syncRecommendExpressCompany()
    },
    "form.express_company_id"() {
      this.onExpressCompanyChanged()
    },
  },
  data() {
    return {
      form: {
        delivery_method: "2",
        total_weight: 1,
        package_num: 1,
        delivery_address_id: undefined,
        express_company_id: undefined,
        is_today: true,
        hour: 18,
      },

      supplierAddressOptions: [],
      expressCompanyOptions: [],
      not_shipped_count: 0,

      min_hour: 9,
      max_hour: 23,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      // 请求该仓库3天以前有多少个没有打印的单号 TODO
      this.form.delivery_method = "2"
      this.form.total_weight = Math.floor(this.weight / 1000)
      if (this.form.total_weight < 1) {
        this.form.total_weight = 1
      }
      this.form.package_num = this.num
      if (this.form.package_num < 1) {
        this.form.package_num = 1
      }

      this.form.is_today = true
      this.form.hour = 18
      this.form.delivery_address_id = this.fix_address_id
      this.form.express_company_id = undefined
      this.form.supplierAddressOptions = []
      this.form.expressCompanyOptions = []

      const now = new Date();  // 创建 Date 对象
      const hours = now.getHours();  // 获取当前小时（24小时制）
      if (this.isJitOrCustom) {
        if (hours < 15) {
          this.form.hour = 17 // 17.55处理
        } else {
          this.form.is_today = false // 明天
          this.form.hour = 13 // 13.55处理
        }
      } else if (hours >= 19) {
        this.form.is_today = false // 到明天去处理
      }

      this.min_hour = new Date().getHours()
      if (this.min_hour < 9) {
        this.min_hour = 9
      }
      this.max_hour = 23

      this.syncAddressInfo()

      this.getSubWarehouseNotShippedCount()
    },
    onExpressCompanyChanged() {
      this.min_hour = new Date().getHours()
      if (this.min_hour < 9) {
        this.min_hour = 9
      }

      if (this.form.hour <= this.min_hour) {
        this.form.hour = this.min_hour
      }

      this.max_hour = 23

      if (this.form.express_company_id) {
        if (this.express && this.express.latestAppointmentTime) {
          this.max_hour = new Date(this.express.latestAppointmentTime).getHours()
          return
        }
      }
    },
    async syncAddressInfo() {
      // 同步地址，选择默认地址
      let resp = await deliveryOrderQuerySupplierAddressInfo({id: this.rows[0].operate_id, ids: this.ids})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.supplierAddressOptions = resp.data
    },
    async syncRecommendExpressCompany() {
      if (!this.form.total_weight || !this.form.delivery_address_id || !this.form.package_num) {
        this.expressCompanyOptions = []
        this.form.express_company_id = undefined
        return
      }

      let resp = await deliveryOrderQueryRecommendExpressCompany({
        ids: this.ids,
        weight: this.form.total_weight,
        delivery_address_id: this.form.delivery_address_id,
        package_num: this.form.package_num
      })
      if (resp.code) {
        return
      }

      this.expressCompanyOptions = resp.data
      this.form.express_company_id = undefined

      if (this.is_factory) {
        this.form.hour = 18
      } else {
        this.form.hour = 18
      }
    },
    bind() {
      this.$confirm(!this.is_self && this.hasUnsaleable ? '疑似有退件在仓库，请确认是否从仓库外装箱发货?' : '请确认是否装箱发货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(this.confirmBind)
    },
    async confirmBind() {
      if (this.form.delivery_method === "2") {
        if (!this.express) {
          this.$message("请选择物流")
          return
        }

        if (this.form.total_weight < 1) {
          this.$message("请填写重量")
          return
        }
      }

      if (this.form.package_num < 1) {
        this.$message("请填写箱数")
        return
      }

      if (!this.form.delivery_address_id) {
        this.$message("请选择发货地址")
        return
      }

      let data = {}
      data.ids = this.ids
      data.delivery_method = this.form.delivery_method
      data.express_package_num = this.form.package_num

      if (this.form.delivery_method === "2") {
        data.delivery_address_id = this.form.delivery_address_id
        data.predict_total_package_weight = this.form.total_weight
        data.express_company_id = this.express.expressCompanyId
        data.express_company_name = this.express.expressCompanyName
        data.standby_express = this.express.standbyExpress
        data.min_supplier_charge_amount = this.express.minSupplierChargeAmount
        data.max_supplier_charge_amount = this.express.maxSupplierChargeAmount
        data.predict_id = this.express.predictId
        data.is_today = this.form.is_today
        data.hour = this.form.hour
      }
      data.is_factory = this.is_factory

      let r = await deliveryOrderBind(data)
      if (r.code) {
        return
      }

      this.$message("确认发货成功")

      if (this.is_factory) {
        this.$confirm('请确认是否同步任务去工厂?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
            .then(async () => {
              let resp = await deliveryOrderSyncFactory({id: r.data})
              if (resp.code) {
                return
              }

              this.$message(`同步成功，请前往工厂页面查看，工厂当前剩余任务空间: ${resp.data} 个`)
              this.getTableData()
            })
      } else {
        this.$confirm('请确认是否打印箱唛号?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
            .then(async () => {
              let resp = await deliveryOrderPrint({ids: this.allIds, package_num: this.form.package_num})
              if (resp.code) {
                return
              }

              window.open(`${resp.data}`, "_BLANK")
            })
      }

      this.$emit("success")
      this.handleBeforeClose()
    },
    async getSubWarehouseNotShippedCount() {
      let resp = await selfDeliveryNotShippedCount({id: this.sub_warehouse_name})
      if (resp.code) {
        return
      }

      this.not_shipped_count = resp.data
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__content {
  display: none;
}
</style>