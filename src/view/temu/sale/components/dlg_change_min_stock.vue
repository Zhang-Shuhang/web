<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量改库存" @opened="onOpened" size="70%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="Spu Id" prop="product_id" align="center">
      </el-table-column>
      <el-table-column label="Sku Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="货号" prop="ext_code" align="center">
      </el-table-column>
      <el-table-column label="图片" align="center">
        <div slot-scope="{row}">
          <div v-if="row.thumb_url">
            <KdxImage :src="row.thumb_url"></KdxImage>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="最低库存" prop="min_stock" align="center">
        <template slot="header">
          <span>最低库存</span>
          <el-input size="mini" v-model="form.min_stock" @keyup.enter.native="setMinStock">
            <el-button slot="append" icon="el-icon-search" @click="setMinStock"></el-button>
          </el-input>
        </template>
        <div slot-scope="{row}">
          <el-input-number size="mini" style="width: 100%" v-model="row.min_stock" :min="0" :precision="0"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column label="7日系数倍数" prop="seven_coef" align="center">
        <template slot="header">
          <span>7日系数倍数</span>
          <el-input size="mini" v-model="form.seven_coef" @keyup.enter.native="setSevenCoef">
            <el-button slot="append" icon="el-icon-search" @click="setSevenCoef"></el-button>
          </el-input>
        </template>
        <div slot-scope="{row}">
          <el-input-number size="mini" style="width: 100%" v-model="row.seven_coef" :min="0" :precision="0"></el-input-number>
        </div>
      </el-table-column>
      <el-table-column label="原因" prop="reason" align="center">
        <div slot-scope="{row}">
          <span v-if="row.reason">
            {{row.reason}}
          </span>
          <span v-else>
            -
          </span>
        </div>
      </el-table-column>
    </el-table>
    <el-button size="medium" type="warning" style="width: 100%; height: 50px; margin-top: 20px" @click="submit">提交</el-button>
  </el-drawer>
</template>

<script>

import {itemChangeMinStocks} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgChangeMinStock',
  components: {KdxImage},
  mixins: [],
  props: {
    rows: {
      type: Array,
    },
    items: {
      type: Array,
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
      list: [],

      form: {
        min_stock: 10000,
        seven_coef: 10,
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let list = []

      if (this.rows) {
        for (const row of this.rows) {
          if (row.virtual_stock) {
            list.push({...row, min_stock: row.virtual_stock.min_stock, seven_coef: row.virtual_stock.seven_coef, reason: ""})
          } else {
            list.push({...row, min_stock: 0, seven_coef: 0, reason: ""})
          }
        }
      }

      if (this.items) {
        for (let i = 0; i < this.items.length; i++) {
          let row = this.items[i]
          if (row.virtual_stock) {
            list.push({product_id: row.sale_id, id: row.id, ext_code: row.sku_ext_code, thumb_url: row.item_image ? row.item_image.image : "", min_stock: row.virtual_stock.min_stock, seven_coef: row.virtual_stock.seven_coef, reason: ""})
          } else {
            list.push({product_id: row.sale_id, id: row.id, ext_code: row.sku_ext_code, thumb_url: row.item_image ? row.item_image.image : "", min_stock: 0, seven_coef: 0, reason: ""})
          }
        }
      }
      this.list = list
    },
    submit() {
      this.$confirm('确认设置自动库存，有一定的危险, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let datas = []
            this.list.forEach((item) => {
              datas.push({id: item.id, min: item.min_stock, seven_coef: item.seven_coef})
            })
            let resp = await itemChangeMinStocks(datas)
            if (resp.code) {
              return
            }

            if (resp.data && resp.data.length > 0) {
              resp.data.forEach(item => {
                let t = this.list.find((v) => {return v.id === item.id})
                if (!t) {
                  return
                }
                t.reason = item.reason
              })
              let texts = []
              resp.data.forEach((d) => {
                texts.push(`${d.id}-原因: ${d.reason}`)
              })
              this.$notify({
                title: "添加失败产品",
                dangerouslyUseHTMLString: true,
                message: texts.join("\n"),
                duration: 15000,
              });
            } else {
              this.$message("操作成功")
            }
            this.list = this.list.filter(item => item.reason)
            if (!this.list.length) {
              this.$emit("suc")
              this.handleBeforeClose()
            }
          })
    },
    setMinStock() {
      this.list.forEach((item) => {
        item.min_stock = this.form.min_stock
      })
    },
    setSevenCoef() {
      this.list.forEach((item) => {
        item.seven_coef = this.form.seven_coef
      })
    }
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