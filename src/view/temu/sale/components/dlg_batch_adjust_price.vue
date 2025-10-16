<template>
  <el-drawer :visible.sync="$attrs.visible" :title="`批量还价${activity_name ? '(' + activity_name + ')' : ''}`" @opened="onOpened" size="70%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div style="margin-bottom: 10px">
      <el-select v-model="reason" placeholder="请选择原因" filterable  :style="{width: '100%'}">
        <el-option label="JIT转备货" :value="1"></el-option>
        <el-option label="降价清仓" :value="2"></el-option>
        <el-option label="降价提升竞争力" :value="3"></el-option>
        <el-option label="促销" :value="4"></el-option>
      </el-select>
    </div>
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="账号" prop="sale.account.name" align="center">
      </el-table-column>
      <el-table-column label="Skc Id" prop="sale.product_skc_id" align="center">
      </el-table-column>
      <el-table-column label="Sku Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="货号" prop="sku_ext_code" align="center">
      </el-table-column>
      <el-table-column label="图片" align="center">
        <div slot-scope="{row}">
          <div v-if="row.item_image">
            <KdxImage :src="row.item_image.image"></KdxImage>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="原价" align="center">
        <div slot-scope="{row}">
          {{(row.supplier_price / 100).toFixed(2)}}
        </div>
      </el-table-column>
      <el-table-column label="新价格" align="center">
        <template slot="header">
          <div>新价格</div>
          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="reduce001">统一降价1分</el-button>
          </div>
        </template>
        <div slot-scope="{row}">
          <el-input-number size="mini" v-model="row.new_price" placeholder="请输入新的价格" :step="0.01" :min="0" :max="row.supplier_price/100" :precision="2" style="width: 100%"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column label="结果" prop="result" align="center">
      </el-table-column>
    </el-table>
    <el-button size="medium" type="warning" style="width: 100%; height: 50px; margin-top: 20px" @click="submit">提交</el-button>
  </el-drawer>
</template>

<script>

import {itemUpdatePrice} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgBatchAdjustPrice',
  components: {KdxImage},
  mixins: [],
  props: {
    rows: {
      type: Array,
    },
    activity_invitation_id: {
      type: Number,
    },
    activity_name: {
      type: String,
    },
  },
  watch: {
    content() {
    },
  },
  computed: {
  },
  data() {
    return {
      reason: 1,
      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.reason = 1
      let list = []
      for (const row of this.rows) {
        list.push({...row, new_price: row.supplier_price/100, result: ""})
      }
      this.list = list
    },
    reduce001() {
      this.list.forEach((item) => {
        item.new_price = (item.supplier_price - 1) / 100
      })
    },
    submit() {
      this.$confirm('确认降价，非常危险操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            for (const v of this.list) {
              if (v.result === "成功") {
                continue
              }

              // 操作
              let data = {}
              data.id = v.id
              data.price = v.new_price
              data.reason = this.reason
              let resp = await itemUpdatePrice(data)
              if (resp.code) {
                v.reason = resp.msg
                return
              }
              v.reason = "成功"
            }

            this.$message("操作成功")
          })
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-drawer__body {
  padding: 10px;
}

::v-deep .el-tabs__content {
  display: none;
}
</style>