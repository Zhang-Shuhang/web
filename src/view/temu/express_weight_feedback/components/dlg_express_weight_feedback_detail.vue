<template>
  <el-dialog :visible.sync="$attrs.visible" title="详情" @opened="onOpened" width="75%"
               :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border min-height="600px" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="row">
      <el-table-column label="发货信息" align="center" min-width="110px">
        <div slot-scope="{row}">
          <div v-if="row.account">
            <el-tag size="mini">{{row.account.name}}</el-tag>
          </div>
          <div class="fs-12 lh-15" @click="copy(row.deliveryOrderSn)">
            <el-link type="primary" v-if="row.status">{{ row.deliveryOrderSn }}</el-link>
            <template v-else>{{ row.deliveryOrderSn }}</template>
          </div>
          <div>
            <el-tag size="mini" effect="dark">{{row.status === 0 ? "待装箱发货" : row.status === 1 ? "待收货" : "已收货"}}</el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="商品信息" align="center" min-width="245px">
        <div slot-scope="{row}">
          <div style="display: flex">
            <div>
              <KdxImage :src="row.product.main_image_url" v-if="row.product"></KdxImage>
            </div>
            <div style="padding-left: 5px; text-align: left">
              <div class="fs-12 lh-15" @click="copy(row.subPurchaseOrderSn)">
                备货单号: {{row.subPurchaseOrderSn}}
              </div>
              <div class="fs-12 lh-15" @click="copy(row.productSkcId.toString())">
                Skc: {{row.productSkcId}}
              </div>
              <!--                <div>-->
              <!--                  <el-tag size="mini">待装箱发货</el-tag>-->
              <!--                </div>-->
              <div>
                <el-tag size="mini" type="danger" effect="dark" v-if="row.isCustomProduct">定制</el-tag>
                <el-tag size="mini" type="warning" effect="dark" v-if="row.urgencyType">加急</el-tag>
                <el-tag size="mini" type="primary">{{row.isFirst ? "首" : "返"}}</el-tag>
                <el-tag size="mini" :type="row.purchaseStockType ? 'warning' : 'primary'" effect="dark">{{row.purchaseStockType ? "JIT" : "VMI"}}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="发货信息" align="center" min-width="180px">
        <div slot-scope="{row}">
          <div class="fs-12 lh-15">
            发货数量: {{row.deliverSkcNum}}({{row.skcPurchaseNum}})件
          </div>
          <el-tag size="mini" v-if="row.delivery_address_label">发货地址: {{ row.delivery_address_label }}</el-tag>
          <el-tag size="mini" v-if="row.deliverTime">发货时间: {{ new Date(row.deliverTime).toLocaleString() }}</el-tag>
          <el-tag size="mini" v-if="row.receiveTime">收货时间: {{ new Date(row.receiveTime).toLocaleString() }}</el-tag>
          <el-tag size="mini" @click="copy(row.subWarehouseName)">收货仓库: {{row.subWarehouseName}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="包裹号" align="center" min-width="140px">
        <div slot-scope="{row}">
                  <span class="item" v-for="(item, index) in row.details" :key="index">
                    <span class="fs-12 lh-15" @click="copy(item.id)">
                      {{item.id}}-{{item.skcNum}}
                    </span>
                  </span>
        </div>
      </el-table-column>
      <el-table-column label="详情" align="center" min-width="120px">
        <div slot-scope="{row}">
          <div class="item-container">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <div class="fs-12 lh-15">
                <span @click="copy(item.id.toString())">Sku: {{item.id}}</span>
              </div>
              <div class="fs-12 lh-15" v-if="item.ext_code">
                <el-tag size="mini" @click="copy(item.ext_code)">货号: {{item.ext_code}}</el-tag>
              </div>
              <div v-if="item.dxm_goods_sku">
                <el-tag size="mini" @click="copy(item.dxm_goods_sku.sku)">小秘: {{item.dxm_goods_sku.sku}}</el-tag>
              </div>
              <div v-else>
                <el-tag type="danger" size="mini" style="width: 100%" effect="dark" @click="openDxmGoods(item.id)">配对</el-tag>
              </div>
              <div class="div-op-btn">
                <el-tag type="primary" size="mini" effect="dark" v-if="item.daily_history && item.daily_history.is_factory">工厂</el-tag>
                <el-tag size="mini" type="warning" effect="dark">{{levelName(item)}}</el-tag>
                <!--                <el-button size="mini" style="width: 100%" type="primary" @click="printLabelCode(item.id)">打印条码</el-button>-->
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <div slot-scope="{row}">
          <div class="item-container">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <KdxImage :src="item.thumb_url" width="60px" height="60px"></KdxImage>
            </div>
            <div class="footer">
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="包裹" align="center" min-width="120px">
        <template slot="header">
          <span>包裹</span>
          <div>
            <el-tag size="mini" effect="dark" type="warning">总重: {{(totalWeight(list)/1000)}}kg({{boxCount(list)}}件)/{{totalCount(list)}}个</el-tag>
          </div>
        </template>
        <div slot-scope="{row}">
          <div class="item-container">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <div class="fs-12 lh-15">
                {{detailsBoxCount(row, item.id).join(", ")}}
              </div>
              <template v-if="item.weight">
                <div class="fs-12 lh-15" v-if="item.weight.weight">
                  重: {{item.weight.weight}}g/个
                </div>
                <div class="fs-12 lh-15" v-else>
                  重: {{item.weight.weight}}g/个
                </div>
              </template>
            </div>
            <div class="footer">
              <el-tag size="mini" effect="dark">重: {{(totalWeight([row])/1000)}}kg({{boxCount([row])}}件)/{{totalCount([row])}}个</el-tag>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="体积" align="center" min-width="120px">
        <template slot="header">
          <span>体积</span>
          <div>
            <el-tag size="mini" effect="dark" type="warning">总体积: {{(totalVolume(list))}}/6000={{(totalVolume(list)/6000)}}kg</el-tag>
          </div>
        </template>
        <div slot-scope="{row}">
          <div class="item-container">
            <div class="item" v-for="(item, index) in items(row)" :key="index">
              <template v-if="item.volume">
                <el-tag size="mini" style="width: 100%">{{item.volume.len}}mm x {{item.volume.width}}mm x {{item.volume.height}}mm</el-tag>
              </template>
            </div>
            <div class="footer">
              <el-tag size="mini" effect="dark">体积: {{(totalVolume([row]))}}</el-tag>
            </div>
          </div>
        </div>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
import {saleItemDxmInventoryFix} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image.vue";
import {expressWeightFeedbackDetail} from "@/api/temu/express_weight_feedback";

export default {
  name: 'TemuDlgExpressWeightFeedbackDetail',
  components: {KdxImage},
  mixins: [],
  props: {
    row: {
      type: Object,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.list = []
      let resp = await expressWeightFeedbackDetail({id: this.row.id})
      if (resp.code) {
        return
      }

      this.list = resp.data
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    totalWeight(rows) {
      if (!rows) {
        return
      }

      let total = 0

      rows.forEach((row) => {
        row.details.forEach((detail) => {
          if (detail.item && detail.item.weight) {
            total += detail.sku_num * detail.item.weight.weight
          }
        })
      })
      return total.toFixed(1)
    },
    totalVolume(rows) {
      if (!rows) {
        return
      }

      let total = 0

      rows.forEach((row) => {
        row.details.forEach((detail) => {
          if (detail.item && detail.item.volume) {
            total += detail.sku_num * detail.item.volume.len * detail.item.volume.width * detail.item.volume.height / 1000
          }
        })
      })
      return total.toFixed(1)
    },
    totalCount(rows) {
      if (!rows) {
        return
      }

      let total = 0

      rows.forEach((row) => {
        row.details.forEach((detail) => {
          total += detail.sku_num
        })
      })
      return total
    },
    boxCount(rows) {
      if (!rows) {
        return
      }

      let total = 0

      rows.forEach((row) => {
        total += row.details.length
      })
      return total
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
    items(row) {
      let list = []

      row.details.forEach((detail) => {
        if (!detail.item) {
          return
        }

        for (let i = 0; i < list.length; i++) {
          let item = list[i]

          if (item.id === detail.item.id) {
            return
          }
        }

        list.push(detail.item)
      })

      return list
    },
    details(row, id) {
      let list = []

      row.details.forEach((detail) => {
        if (detail.product_sku_id !== id) {
          return
        }
        list.push(detail)
      })

      return list
    },
    detailsBoxCount(row, id) {
      let list = this.details(row, id)

      let mp = new Map()

      list.forEach((item) => {
        let c = mp.get(item.sku_num)
        if (!c) {
          c = 1
        } else {
          c++
        }
        mp.set(item.sku_num, c)
      })

      let result = []
      mp.forEach(function(value, key) {
        result.push(`${value}件${key}个`)
      })

      return result
    },
  },
}
</script>
<style scoped lang="scss">
</style>