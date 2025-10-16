<template>
  <el-drawer :visible.sync="$attrs.visible" title="Y2订单分配" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="订单信息" align="center">
        <div slot-scope="{row}" style="font-size: 12px">
          <div v-if="row.account">
            <el-tag size="mini" type="primary">账号: {{ row.account.name }}({{ row.account.is_semi ? "半托管" : "全托管" }})</el-tag>
          </div>
          <div>
            <el-tag size="mini" type="primary" @click="copy(row.id.toString())">订单Id: {{ row.id }}</el-tag>
          </div>
          <div>
            {{ row.is_eu ? "欧洲站" : "美国站" }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="收货人" align="center">
        <div slot-scope="{row}">
          <template v-if="row.address">
            <div style="font-size: 12px">
              <div>
                收货人：{{ row.address.receipt_name }}
              </div>
              <div>
                联系方式：{{ row.address.mobile }}
              </div>
              <div>
                收货地址：{{row.address.address_line1}} {{row.address.address_line2}}, {{ row.address.region_name1 }}, {{ row.address.region_name2 }}, {{ row.address.region_name3 }}, {{row.address.post_code}}
              </div>
            </div>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="产品信息" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === showItems(row.items).length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in showItems(row.items)" :key="index">
            <el-row>
              <el-col :span="8">
                <div style="margin: 5px">
                  <KdxImage :src="item.thumb_url" width="100%" height="100%"></KdxImage>
                </div>
              </el-col>
              <el-col :span="16">
                <div>
                  Sku: {{ item.product_sku_id }}
                </div>
                <div>
                  Sku Code: {{ item.ext_code }}
                </div>
                <div>
                  数量: {{ item.quantity }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="重量（磅：lb）｜体积信息（英寸：in）" align="center">
        <div slot="header" class="clearfix">
          <div>重量（磅：lb）｜体积信息（英寸：in）</div>
          <el-select size="mini" v-model="form.warehouse_names" placeholder="请选择发货仓库" multiple collapse-tags filterable clearable style="width: 100%">
            <el-option v-for="(item, index) in warehouseNameList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
          <el-select size="mini" v-model="form.ship_company_ids" placeholder="请选择发货渠道" multiple collapse-tags filterable clearable style="width: 100%">
            <el-option label="GOFO" :value="998264950"></el-option>
            <el-option label="UniUni" :value="732613859"></el-option>
            <el-option label="USPS" :value="960246690"></el-option>
          </el-select>
          <el-button size="mini" type="primary" style="width: 100%" @click="submit">提交</el-button>
        </div>
        <div slot-scope="{row}">
          <el-row>
            <el-col :span="12">
              重量(lb)
            </el-col>
            <el-col :span="12">
              <el-input-number size="mini" placeholder="重量(lb)" v-model="row.weight" :precision="2" @change="resetChannel(row)"></el-input-number>
            </el-col>
            <el-col :span="12">
              长(inch)
            </el-col>
            <el-col :span="12">
              <el-input-number size="mini" placeholder="长(inch)" v-model="row.length" :precision="2" :min="0.01" :max="20" @change="resetChannel(row)"></el-input-number>
            </el-col>
            <el-col :span="12">
              宽(inch)
            </el-col>
            <el-col :span="12">
              <el-input-number size="mini" placeholder="宽(inch)" v-model="row.width" :precision="2" :min="0.01" :max="20" @change="resetChannel(row)"></el-input-number>
            </el-col>
            <el-col :span="12">
              高(inch)
            </el-col>
            <el-col :span="12">
              <el-input-number size="mini" placeholder="高(inch)" v-model="row.height" :precision="2" :min="0.01" :max="20" @change="resetChannel(row)"></el-input-number>
            </el-col>
          </el-row>
        </div>
      </el-table-column>
    </el-table>

  </el-drawer>
</template>


<script>
import {
  semiOrderQuerySkuHistoryPackage, semiOrderY2Allocate
} from "@/api/temu/semi_order";
import KdxImage from "@/components/image/image.vue";
import {semiWarehouseList} from "@/api/temu/semi";

export default {
  name: 'TemuDlgY2Allocator',
  components: {KdxImage},
  props: {
    rows: {
      type: Array,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      providerList: [],
      list: [],
      selectWarehouseName: undefined,
      warehouseNameList: [],
      accountIds: [],

      form: {
        warehouse_names: [],
        ship_company_ids: [],
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await semiWarehouseList()
      if (resp.code) {
        return
      }
      let warehouseMap = new Map()
      let warehouseNameList = []
      resp.data.forEach((w) => {
        let array = warehouseMap.get(w.account_id) || []
        array.push(w)
        warehouseMap.set(w.account_id, array)
        if (w.name.indexOf("-") >= 0 && warehouseNameList.indexOf(w.name) < 0) {
          warehouseNameList.push(w.name)
        }
      })
      this.warehouseNameList = warehouseNameList
      let accountIds = []
      this.rows.forEach(row => {
        if (accountIds.indexOf(row.account_id) < 0) {
          accountIds.push(row.account_id)
        }
      })
      this.accountIds = accountIds

      let list = this.rows.map((v) => {
        return {
          ...v,
          length: undefined,
          width: undefined,
          height: undefined,
          dimension_unit: "in",
          weight: undefined,
          weight_unit: "lb",
          warehouse: undefined,
          warehouseList: warehouseMap.get(v.account_id) || [],
          channel: undefined,
          channelList: [],
        }
      }).sort((a, b) => {
        return a.items[0].product_sku_id - b.items[0].product_sku_id
      })

      // 查询尺寸
      await this.updateWeightAndDimension(list)

      this.list = list
    },
    showItems(items) {
      return items.filter(item => {return item.fulfillment_mode === 0})
    },
    async updateWeightAndDimension(list) {
      let accountMap = new Map();
      (list || []).forEach((row) => {
        let mp = accountMap.get(row.account_id)
        if (!mp) {
          mp = new Map();
          accountMap.set(row.account_id, mp)
        }
        row.items.forEach((item) => {
          mp.set(item.sku_id, item.product_sku_id)
        })
      })
      let data = []
      for (let [key, value] of accountMap.entries()) {
        let accountData = {}
        accountData.account_id = key
        accountData.list = []

        for (let [skuId, productSkuId] of value.entries()) {
          accountData.list.push({
            sku_id: skuId,
            product_sku_id: productSkuId,
          })
        }
        data.push(accountData)
      }

      let resp = await semiOrderQuerySkuHistoryPackage(data)
      if (resp.code) {
        return
      }

      let mp = new Map();
      resp.data.forEach((v) => {
        mp.set(v.product_sku_id, v)
      })
      list.forEach((v) => {
        let showItems = this.showItems(v.items)

        showItems.forEach((item) => {
          item.info = mp.get(item.product_sku_id)
        })

        v.weight = 0

        for (const item of showItems) {
          if (!item.info) {
            continue
          }

          if (item.fulfillment_mode !== 0) {
            continue
          }

          let info = item.info
          let unitWeights = []
          if (info.warehouse_info) {
            unitWeights.push(info.warehouse_info.weight)
          }
          if (info.history_info) {
            unitWeights.push(info.history_info.weight)
          }
          if (info.sku_info) {
            unitWeights.push(info.sku_info.weight)
          }
          if (unitWeights.length <= 0) {
            continue
          }

          let unitWeight = Math.min(...unitWeights)
          v.weight += unitWeight * showItems[0].quantity
        }

        if (showItems.length !== 1) {
          return
        }
        if (!showItems[0].info) {
          return
        }

        let info = showItems[0].info
        if (info.warehouse_info) {
          v.length = info.warehouse_info.length
          v.width = info.warehouse_info.width
          v.height = info.warehouse_info.height * showItems[0].quantity
        } else if (info.history_info) {
          v.length = info.history_info.length
          v.width = info.history_info.width
          v.height = info.history_info.height * showItems[0].quantity
        } else if (info.sku_info) {
          v.length = info.sku_info.length
          v.width = info.sku_info.width
          v.height = info.sku_info.height * showItems[0].quantity
        }
      })
      list.forEach((v) => {
        if (v.width || v.width || v.height) {
          return
        }
        v.length = 9
        v.width = 5
        v.height = 3
      })
    },
    resetChannel(row) {
      row.channel = undefined
    },
    // 提交
    async submit() {
      for (const row of this.list) {
        if (!row.weight) {
          this.$message.error(`${row.id} 请输入重量`)
          return
        }
        if (!row.length) {
          this.$message.error(`${row.id} 请输入长度`)
          return
        }
        if (!row.width) {
          this.$message.error(`${row.id} 请输入宽度`)
          return
        }
        if (!row.height) {
          this.$message.error(`${row.id} 请输入高度`)
          return
        }
      }

      if (!this.form.warehouse_names) {
        this.$message.error("请选择发货仓库")
        return
      }
      if (!this.form.ship_company_ids) {
        this.$message.error("请选择发货渠道")
        return
      }

      let data = {}
      data.warehouse_names = this.form.warehouse_names
      data.ship_company_ids = this.form.ship_company_ids
      data.orders = []

      this.list.forEach((item) => {
        let order = {}

        order.id = item.id
        order.height = String(item.height)
        order.length = String(item.length)
        order.width = String(item.width)
        order.dimension_unit = item.dimension_unit
        order.weight = String(item.weight)
        order.weight_unit = item.weight_unit

        data.orders.push(order)
      })
      let resp = await semiOrderY2Allocate(data)
      if (resp.code) {
        return
      }

      this.$message("处理成功")
      window.open(resp.data, "_blank");
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
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 100px;
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
</style>