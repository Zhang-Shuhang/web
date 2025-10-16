<template>
  <el-drawer :visible.sync="$attrs.visible" :title="id ? `调整包裹信息(${id})` : `调整包裹信息`" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="detail.deliveryOrderDetails" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="detail" :span-method="objectSpanMethod">
      <el-table-column label="SKU ID" align="center">
        <span slot-scope="{row}">
          {{row.productSkuId}}
        </span>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <span slot-scope="{row}">
          <template v-if="item(row.productSkuId)">
            <KdxImage :src="item(row.productSkuId).thumb_url" width="60px" height="60px"></KdxImage>
          </template>
        </span>
      </el-table-column>
      <el-table-column label="属性集" align="center">
        <span slot-scope="{row}">
          {{specList(row).join(" / ")}}
        </span>
      </el-table-column>
      <el-table-column label="最大" align="center">
        <span slot-scope="{row}">
          {{row.skuDeliveryQuantityMaxLimit}}
        </span>
      </el-table-column>
      <el-table-column label="包裹设置" align="center" min-width="150px">
        <div slot-scope="{row, $index}">
          <div v-for="(item, index) in packageArray[$index]" :key="index">
            <span style="font-size: 14px; line-height: 28px; height: 28px">
              包裹: {{index+1}}
            </span>
            <el-input-number size="mini" v-model="item.skuNum" :min="0" :max="row.skuDeliveryQuantityMaxLimit" :step="1"></el-input-number>
            <i class="el-icon-delete" style="margin-left: 5px; line-height: 28px; height: 28px" v-if="packageArray[$index].length > 1" @click="deletePackage($index, index)"></i>
          </div>
          <el-button size="mini" type="primary" @click="clearPackages(row, $index)">清空</el-button>
        </div>
      </el-table-column>
      <el-table-column label="包裹" align="center" min-width="150px">
        <div slot-scope="{row, $index}">
          <el-button size="mini" style="width: 100%" type="primary" @click="addPackage(row, $index)">添加包裹</el-button>
          <el-row style="margin-top: 5px">
            <el-col :span="8">
              <el-input-number size="mini" v-model="row.packageSkuNum" style="width: 100%" :min="0" :max="row.skuDeliveryQuantityMaxLimit" :step="1"></el-input-number>
            </el-col>
            <el-col :span="8">
              <el-input-number size="mini" v-model="row.addPackageCount" style="width: 100%" :min="0" :max="row.skuDeliveryQuantityMaxLimit" :step="1"></el-input-number>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" style="width: 100%" type="primary" @click="batchAddPackage(row, $index)" :disable="row.packageSkuNum <= 0 || row.addPackageCount <= 0">批量添加</el-button>
            </el-col>
          </el-row>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px">
        <div>
          <el-button size="mini" style="width: 100%" type="primary" @click="savePackage">确认</el-button>
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {deliveryOrderPackageDetail, deliveryOrderSavePackage} from "@/api/temu/delivery_order";

export default {
  name: 'TemuDlgSavePackages',
  components: {KdxImage},
  props: {
    id: {
      type: String, // 发货单号
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      detail: undefined,
      items: [],
      packageArray: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    maxLimit(id) {
      if (!this.detail) {
        return 0
      }

      for (const d of this.detail.deliveryOrderDetails) {
        if (d.productSkuId === id) {
          return d.skuDeliveryQuantityMaxLimit
        }
      }
      return 0
    },
    async onOpened() {
      let resp = await deliveryOrderPackageDetail({id: this.id})
      if (resp.code) {
        return
      }

      this.packageArray = []
      this.detail = resp.data.detail
      this.items = resp.data.items
      let dataMap = new Map()
      for (const d of this.detail.packageDetails) {

        for (const item of d.packageDetails) {
          let d = dataMap.get(item.productSkuId)
          if (!d) {
            d = []
          }
          d.push({id: item.productSkuId, skuNum: item.skuNum})

          dataMap.set(item.productSkuId, d)
        }
      }

      this.detail.deliveryOrderDetails.forEach((detail) => {
        detail.addPackageCount = 1
        detail.packageSkuNum = detail.skuDeliveryQuantityMaxLimit

        let array = dataMap.get(detail.productSkuId)
        if (!array) {
          this.packageArray.push([{id: detail.productSkuId, skuNum: 0}])
        } else {
          this.packageArray.push(array)
        }
      })
    },
    item(productSkuId) {
      let originId = productSkuId
      if (this.detail) {
        out:
        for (const d of this.detail.packageDetails) {
          for (const d2 of d.packageDetails) {
            if (d2.personalText && originId === d2.productSkuId) {
              originId = d2.productOriginalSkuId
              break out
            }
          }
        }
      }
      for (const item of this.items) {
        if (item.id === originId) {
          return item
        }
      }

      return undefined
    },
    deletePackage(i1, i2) {
      this.packageArray[i1].splice(i2, 1)
    },
    addPackage(row, index) {
      this.packageArray[index].push({id: row.productSkuId, skuNum: 0})
    },
    batchAddPackage(row, index) {
      if (!row.addPackageCount) {
        return
      }

      this.$set(this.packageArray, index, [])
      for (let i = 0; i < row.addPackageCount; i++) {
        let left = this.maxLimit(row.productSkuId) - i * row.packageSkuNum
        let count = row.packageSkuNum
        if (count > left) {
          count = left
        }
        this.packageArray[index].push({id: row.productSkuId, skuNum: count})
      }
    },
    clearPackages(row, index) {
      this.$set(this.packageArray, index, [{id: row.productSkuId, skuNum: 0}])
    },
    specList(row) {
      let list = []

      row.englishSecondarySpecVOList.forEach((item) => {
        list.push(item.specName)
      })

      return list
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex !== 6 || !this.detail || !this.detail.deliveryOrderDetails) {
        return
      }

      if (rowIndex % this.detail.deliveryOrderDetails.length === 0) {
        return {
          rowspan: this.detail.deliveryOrderDetails.length,
          colspan: 1
        };
      } else {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
    },
    async savePackage() {
      let list = []
      for (const detailArray of this.packageArray) {
        let totalCount = 0

        let id = detailArray[0].id

        for (let i = 0; i < detailArray.length; i++) {
          let pkg = detailArray[i]
          if (pkg.skuNum < 0) {
            this.$message(`${pkg.id} 第 ${i+1} 个包裹，数量非法!`)
            return
          }

          totalCount += pkg.skuNum

          if (pkg.skuNum) {
            list.push({"productSkuId": pkg.id, "skuNum": pkg.skuNum})
          }
        }

        if (totalCount) {
          let maxLimit = this.maxLimit(id)
          if (totalCount > maxLimit) {
            this.$message(`${id} 总量超出最大限制: ${maxLimit}!`)
            return
          }
        } else {
          list.push({"productSkuId": detailArray[0].id, "skuNum": 0})
        }
      }

      // 检查
      let resp = await deliveryOrderSavePackage({id: this.id, list: list})
      if (resp.code) {
        return
      }

      this.$emit('success', true)
      this.handleBeforeClose()
      this.$message("添加成功")
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