<template>
  <el-drawer :visible.sync="$attrs.visible" title="在线下单" @opened="onOpened" size="80%"
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
      <el-table-column label="发货仓库" prop="warehouse" align="center">
        <div slot="header" class="clearfix">
          发货仓库
          <el-select size="mini" v-model="selectWarehouseName" placeholder="请选择发货仓库" filterable clearable @change="setAllWarehouseName"
                     :style="{width: '100%'}">
            <el-option v-for="(item, index) in warehouseNameList" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <div slot-scope="{row}">
          <el-select size="mini" v-model="row.warehouse" placeholder="请选择发货仓库" filterable clearable @change="resetChannel(row)"
                     :style="{width: '100%'}">
            <el-option v-for="(item, index) in row.warehouseList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </el-table-column>
      <el-table-column label="物流渠道" prop="channel" align="center">
        <div slot="header" class="clearfix">
          物流渠道
          <div>
            <el-button size="mini" type="primary" @click="setAllChannel(4, [998264950, 732613859, 960246690])">低于4$GOGO/Uniuni/USPS</el-button>
            <el-button size="mini" type="primary" @click="setAllChannel(5, [998264950, 732613859, 960246690])">低于5$GOGO/Uniuni/USPS</el-button>
            <el-button size="mini" type="primary" @click="setAllChannel(6, [998264950, 732613859, 960246690])">低于6$GOGO/Uniuni/USPS</el-button>
            <el-button size="mini" type="primary" @click="setAllChannel(4, [960246690])">低于4$USPS</el-button>
            <el-button size="mini" type="primary" @click="setAllChannel(5, [960246690])">低于5$USPS</el-button>
            <el-button size="mini" type="primary" @click="setAllChannel(6, [960246690])">低于6$USPS</el-button>
          </div>
        </div>
        <div slot-scope="{row}">
          <el-select size="mini" v-model="row.channel" placeholder="请选择物流渠道" filterable clearable remote @focus="()=>{syncChannelList(row)}" :remote-method="()=>{syncChannelList(row)}"
                     :style="{width: '100%'}">
            <el-option v-for="(item, index) in row.channelList" :key="index" :label="`${item.shipping_company_name}(${item.ship_product_name})[${item.online_estimated_vo.estimated_text}]`"
                       :value="item.channel_id"></el-option>
          </el-select>
        </div>
      </el-table-column>
    </el-table>

    <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="submit">提交</el-button>
  </el-drawer>
</template>


<script>
import {
  semiOrderOnlineBatchSend,
  semiOrderQueryShippingProviderOptional,
  semiOrderQuerySkuHistoryPackage
} from "@/api/temu/semi_order";
import KdxImage from "@/components/image/image.vue";
import {semiWarehouseList} from "@/api/temu/semi";

export default {
  name: 'TemuDlgOnlineBatchSend',
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
    async syncChannelList(row) {
      row.channelList = []
      row.channel = undefined

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
      if (!row.warehouse) {
        this.$message.error(`${row.id} 请选择仓库`)
        return
      }

      let data = {}

      data.account_id = row.account_id
      data.dimension_unit = row.dimension_unit
      data.length = String(row.length)
      data.width = String(row.width)
      data.height = String(row.height)
      data.weight_unit = row.weight_unit
      data.weight = String(row.weight)
      data.need_signature_service = false
      data.order_sn_list = this.showItems(row.items).map((v) => { return v.id })
      data.warehouse_id = row.warehouse

      let resp = await semiOrderQueryShippingProviderOptional(data)
      if (resp.code) {
        return
      }
      row.channelList = resp.data
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
    },
    setAllWarehouseName() {
      this.list.forEach((item) => {
        let w = item.warehouseList.find((w) => {return w.name === this.selectWarehouseName})
        if (w) {
          item.warehouse = w.id
        } else {
          item.warehouse = undefined
        }
        this.resetChannel(item)
      })
      this.selectWarehouseName = ""
    },
    resetChannel(row) {
      row.channel = undefined
    },
    setAllChannel(maxPrice, shipCompanyIds) {
      this.list.forEach(async (row) => {
        await this.syncChannelList(row)
        let c = row.channelList.find((channel) => {
          return channel.online_estimated_vo.semi_total_charge_amount_si <= maxPrice * 100000 && shipCompanyIds.indexOf(channel.ship_company_id) >= 0
        })
        if (c) {
          row.channel = c.channel_id
        } else {
          row.channel = undefined
        }
      })
    },
    // 提交
    submit() {
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
        if (!row.warehouse) {
          this.$message.error(`${row.id} 请选择仓库`)
          return
        }
        if (!row.channel) {
          this.$message.error(`${row.id} 请选择物流渠道`)
          return
        }
      }

      this.$confirm('请确认是否提交?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        for (const accountId of this.accountIds) {
          let data = {}
          data.send_type = 0
          data.shipping_label_ship_type = 1
          data.send_request_list = []

          this.list.forEach((item) => {
            if (item.account_id !== accountId) {
              return
            }

            // 操作
            let c = item.channelList.find((channel) => {return channel.channel_id === item.channel})
            let w = item.warehouseList.find((w) => {return w.id === item.warehouse})

            let sendRequest = {}
            sendRequest.shipping_label_ship_type = data.shipping_label_ship_type
            sendRequest.ship_company_name = c.shipping_company_name
            sendRequest.shipping_label_action = 0
            sendRequest.zone_id = c.zone_id
            sendRequest.faraway_type = c.faraway_type
            sendRequest.channel_id = c.channel_id
            sendRequest.channel_id_version = c.channel_id_version
            sendRequest.service_code = c.service_code
            sendRequest.ship_company_id = c.ship_company_id
            sendRequest.ship_logistics_type = c.ship_logistics_type
            sendRequest.ship_product_name = c.ship_product_name
            sendRequest.recommend_req_sn = c.recommend_req_sn
            sendRequest.recommend_res_sn = c.recommend_res_sn
            sendRequest.estimated_text = c.online_estimated_vo.estimated_text

            sendRequest.height = String(item.height)
            sendRequest.length = String(item.length)
            sendRequest.width = String(item.width)
            sendRequest.dimension_unit = item.dimension_unit
            sendRequest.weight = String(item.weight)
            sendRequest.weight_unit = item.weight_unit
            sendRequest.warehouse_id = w.id
            sendRequest.warehouse_name = w.name
            sendRequest.timezone = "" // TODO


            sendRequest.order_send_info_list = []

            item.items.forEach((v) => {
              sendRequest.order_send_info_list.push({
                "order_sn": v.id,
                "parent_order_sn": item.id,
                "goods_id": v.goods_id,
                "sku_id": String(v.sku_id),
                "quantity": v.quantity,
              })
            })

            data.send_request_list.push(sendRequest)
          })
          if (data.send_request_list.length <= 0) {
            return
          }

          let resp = await semiOrderOnlineBatchSend({account_id: accountId, payload: data})
          if (resp.code) {
            return
          }

          this.list = this.list.filter((item) => { return item.account_id !== accountId })
        }

        this.$message("发货成功")
      })
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