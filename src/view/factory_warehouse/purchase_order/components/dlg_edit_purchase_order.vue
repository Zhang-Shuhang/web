<template>
  <el-drawer :visible.sync="$attrs.visible" :title="isEdit ? '更新' : '创建'" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-form-item label-width="0">
        <el-select size="mini" v-model="form.warehouse_id" placeholder="请选择仓库" filterable
                   clearable style="width: 100%" @change="changeWarehouseId" :disabled="isEdit">
          <el-option v-for="(item, index) in warehouses" :key="index"
                     :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0">
        <el-select size="mini" v-model="form.provider_id" placeholder="请选择供应商" filterable
                   clearable style="width: 100%">
          <el-option v-for="(item, index) in providerOptions" :key="index"
                     :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0" v-if="isEdit">
        <el-select size="mini" v-model="form.tracking_numbers" placeholder="请输入物流跟踪号" allow-create multiple
                   filterable clearable style="width: 100%">
        </el-select>
      </el-form-item>
      <template v-if="isEdit || (form.warehouse_id && form.provider_id)">
        <el-table class="table-body" ref="multipleTable" :data="form.items" border size="mini"
                  :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
          <el-table-column label="商品" align="center">
            <div slot-scope="{row}">
              <el-select size="mini" v-model="row.goods_id" placeholder="请选择商品" filterable clearable
                         style="width: 100%" :disabled="isEdit">
                <el-option v-for="(item, index) in goodsOptions" :key="index" :label="`${item.name}-(${item.unit})`"
                           :value="item.id" v-if="item.group_id === warehouse.group_id"></el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column label="采购数量" align="center">
            <div slot-scope="{row}">
              <el-input-number size="mini" style="width: 100%" placeholder="采购数量" v-model="row.count"
                               :min="row.receive ? Number(row.receive) : 0" :step="1" :precision="4" clearable
                               filterable>
              </el-input-number>
            </div>
          </el-table-column>
          <el-table-column :label="isEdit ? '收货数量' : '操作'" align="center">
            <div slot="header">
              <div>
                {{isEdit ? '收货数量' : '操作'}}
              </div>
              <div v-if="isEdit">
                <div>
                  <el-button size="mini" type="primary" style="width: 100%" @click="allReceive">全部到货</el-button>
                </div>
                <div>
                  <el-button size="mini" type="primary" style="width: 100%" @click="allTerminal">全部终止</el-button>
                </div>
              </div>
            </div>
            <div slot-scope="{row}">
              <template v-if="isEdit">
                <el-input-number size="mini" style="width: 100%" placeholder="收货数量" v-model="row.receive" :min="0"
                                 :max="row.count ? Number(row.count) : 0" :step="1" :precision="4" clearable filterable>
                </el-input-number>
              </template>
              <template v-else>
                <el-button size="mini" type="primary" @click="addItem" style="width: 40%">添加</el-button>
                <el-button size="mini" type="danger" @click="deleteItem(row)" style="width: 40%"
                           v-if="form.items.length > 1">删除
                </el-button>
              </template>
            </div>
          </el-table-column>
        </el-table>
        <el-button size="medium" type="primary" @click="createOrSave"
                   style="width: 100%; height: 50px; margin-top: 5px">{{ isEdit ? "更新" : "创建" }}
        </el-button>
      </template>
    </el-form>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import Upload from "@/view/components/upload.vue";
import {
  factoryWarehousePurchaseOrderCreate,
  factoryWarehousePurchaseOrderUpdate
} from "@/api/factory_warehouse/purchase_order";
import {factoryWarehouseGoodsList} from "@/api/factory_warehouse/goods";
import {factoryWarehouseProviderList, factoryWarehouseProviderListByPage} from "@/api/factory_warehouse/provider";

export default {
  name: 'TemuDlgEditPurchaseOrder',
  components: {Upload, KdxImage},
  props: {
    row: {
      type: Object,
    },
    warehouses: {
      type: Array,
    },
  },
  watch: {},
  computed: {
    ...mapGetters("user", ["groupId"]),
    warehouse() {
      return this.warehouses.find((item) => {
        return item.id === this.form.warehouse_id
      });
    },
    isEdit() {
      return this.form.id && this.form.id !== ""
    }
  },
  data() {
    return {
      form: {
        id: undefined,
        warehouse_id: undefined,
        provider_id: undefined,
        tracking_numbers: [],
        items: []
      },

      goodsOptions: [],
      providerOptions: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      // 加载产品列表
      let resp = await factoryWarehouseGoodsList()
      if (resp.code) {
        return
      }
      this.goodsOptions = resp.data
      resp = await factoryWarehouseProviderList()
      if (resp.code) {
        return
      }
      this.providerOptions = resp.data

      if (this.row) {
        this.form.id = this.row.id
        this.form.warehouse_id = this.row.warehouse_id
        this.form.provider_id = this.row.provider_id
        if (this.row.tracking_numbers) {
          this.form.tracking_numbers = this.row.tracking_numbers.split(",")
        } else {
          this.form.tracking_numbers = []
        }
        this.form.items = []
        this.row.items.forEach(item => {
          let emptyItem = this.emptyItem()
          Object.assign(emptyItem, item)
          this.form.items.push(emptyItem)
        })
      } else {
        this.form.id = undefined
        this.form.warehouse_id = undefined
        this.form.provider_id = undefined
        this.form.tracking_numbers = []
        this.changeWarehouseId()
      }
    },
    emptyItem() {
      return {
        goods_id: undefined,
        count: undefined,
        receive: undefined,
      }
    },
    addItem() {
      this.form.items.push(this.emptyItem())
    },
    deleteItem(row) {
      this.$set(this.form, "items", this.form.items.filter(item => {
        return item !== row
      }))
    },
    changeWarehouseId() {
      this.form.items = []
      this.addItem()
    },
    allReceive() {
      this.form.items.forEach(item => {
        item.receive = item.count
      })
    },
    allTerminal() {
      this.form.items.forEach(item => {
        item.count = item.receive
      })
    },
    async createOrSave() {
      if (!this.form.warehouse_id) {
        this.$message.error("请选择仓库")
        return
      }

      if (this.form.items.length === 0) {
        this.$message.error("请填写采购需求")
        return
      }

      for (const row of this.form.items) {
        if (!row.goods_id) {
          this.$message.error("请选择需要采购的产品")
          return
        }

        if (row.count < 0) {
          this.$message.error("请填写需要采购的数量")
          return
        }

        if (row.receive < 0) {
          this.$message.error("请填写需要收到的数量")
          return
        }
      }

      let f = factoryWarehousePurchaseOrderCreate
      if (this.isEdit) {
        f = factoryWarehousePurchaseOrderUpdate
      }

      let data = {}
      data.id = this.form.id
      data.warehouse_id = this.form.warehouse_id
      data.provider_id = this.form.provider_id
      data.tracking_numbers = this.form.tracking_numbers
      data.items = []
      for (const item of this.form.items) {
        data.items.push({
          id: item.id,
          goods_id: item.goods_id,
          count: item.count,
          receive: item.receive,
        })
      }

      let resp = await f(data)
      if (resp.code) {
        return
      }

      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("update")
    },
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  }
}
</script>

<style scoped lang="scss">
</style>