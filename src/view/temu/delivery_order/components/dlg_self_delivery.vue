<template>
  <el-drawer :visible.sync="$attrs.visible" title="装箱+自行配送" @opened="onOpened" size="50%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="账号" prop="account_name" align="center">
      </el-table-column>
      <el-table-column label="发货仓库" prop="count" align="center">
        <div slot-scope="{row}">
          <el-select size="mini" v-model="row.delivery_address_id" filterable style="width: 100%" @focus="()=>{syncAddressInfo(row)}">
            <el-option v-for="(item, index) in row.supplierAddressOptions" :key="index" :label="item.addressLabel"
                       :value="item.id">
              <!--            :disabled="item.townCode <= 0"-->
              <span style="float: left">{{ item.addressLabel }}</span>
              <span
                  style="float: right; color: #8492a6; font-size: 13px">{{ item.cityName }}-{{ item.districtName }}-{{
                  item.addressDetail
                }}{{ item.isDefault ? "(默认)" : "" }}<span v-if="item.times" style="color: red; font-weight: bold">[发货 {{item.times}} 次]</span></span>
            </el-option>
          </el-select>
        </div>
      </el-table-column>
      <el-table-column label="选择主账号" align="center">
        <div slot-scope="{row}">
          <el-radio v-model="main_account_id" :label="row.account_id">{{row.account_name}}</el-radio>
        </div>
      </el-table-column>
    </el-table>

    <div style="margin-top: 30px">
      <el-button type="primary" :style="{width: '100%'}" @click="confirm" :disabled="disabled">确认</el-button>
    </div>
  </el-drawer>
</template>


<script>
import {
  deliveryOrderQuerySupplierAddressInfo,
} from "@/api/temu/delivery_order";

export default {
  name: 'TemuDlgSelfDelivery',
  components: {},
  props: {
    rows: {
      type: Array, // 发货单号
    },
  },
  computed: {
    disabled() {
      if (!this.main_account_id) {
        return true
      }
      let cityCode, districtCode, provinceCode
      for (const form of this.list) {
        if (!form.delivery_address_id) {
          return true
        }

        let addr = form.supplierAddressOptions.find((item) => {
          return item.id === form.delivery_address_id
        })
        if (!provinceCode && !districtCode && !cityCode) {
          districtCode = addr.districtCode
          cityCode = addr.cityCode
          provinceCode = addr.provinceCode
          continue
        }

        if (addr.districtCode !== districtCode) {
          return true
        }
        if (addr.cityCode !== cityCode) {
          return true
        }
        if (addr.provinceCode !== provinceCode) {
          return true
        }
      }
      return false
    },
    main() {
      if (!this.main_account_id) {
        return undefined
      }
      for (const form of this.list) {
        if (form.account_id === this.main_account_id) {
          return form
        }
      }
      return undefined
    },
    selfDeliveryList() {
      if (!this.main_account_id) {
        return undefined
      }

      let list = []
      for (const item of this.list) {
        if (item.account_id !== this.main_account_id) {
          list.push(item)
        }
      }
      return list
    }
  },
  data() {
    return {
      list: [],
      main_account_id: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.main_account_id = this.rows[0].account_id
      this.list = []

      out:
          for (const order of this.rows) {
            for (const form of this.list) {
              if (form.account_id === order.account_id) {
                form.orders.push(order)
                continue out
              }
            }

            this.list.push({
              account_id: order.account_id,
              account_name: order.account.name,
              delivery_address_id: undefined,
              supplierAddressOptions: [],
              orders: [order],
            })
          }
    },
    async syncAddressInfo(form) {
      if (form.supplierAddressOptions && form.supplierAddressOptions.length > 0) {
        return
      }
      // 同步地址，选择默认地址
      let ids = []
      form.orders.forEach((order) => {
        ids.push(order.deliveryOrderSn)
      })
      let resp = await deliveryOrderQuerySupplierAddressInfo({id: form.account_id, ids: ids})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.$set(form, "supplierAddressOptions", resp.data)
    },
    confirm() {
      // 打开发货面板
      let data = {
        main: this.main,
        self: this.selfDeliveryList,
      }
      this.$emit('confirm', data)
      this.handleBeforeClose()
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
</style>