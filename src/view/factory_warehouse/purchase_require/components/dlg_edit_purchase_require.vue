<template>
  <el-drawer :visible.sync="$attrs.visible" title="创建" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-row :gutter="5" v-for="(row, index) in form.list" :key="index">
        <el-col :span="6">
          <el-select size="mini" v-model="row.goods_id" placeholder="请选择商品" filterable clearable style="width: 100%">
            <el-option v-for="(item, index) in goodsOptions" :key="index" :label="`${item.name}-(${item.unit})`" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input-number size="mini" style="width: 100%" placeholder="采购数量" v-model="row.quantity" :min="0" :step="1" :precision="2" clearable filterable>
          </el-input-number>
        </el-col>
        <el-col :span="6">
          <el-select size="mini" v-model="row.priority" placeholder="请选择优先级" filterable clearable style="width: 100%">
            <el-option label="" value=""></el-option>
            <el-option v-for="(item, index) in priorityOptions" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="addRequire" style="width: 40%">添加</el-button>
          <el-button size="mini" type="danger" @click="deleteRequire(row)" style="width: 40%" v-if="form.list.length > 1">删除</el-button>
        </el-col>
      </el-row>
      <el-button size="medium" type="primary" @click="create" style="width: 100%; height: 50px; margin-top: 5px">创建</el-button>
    </el-form>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import Upload from "@/view/components/upload.vue";
import {factoryWarehousePurchaseRequireCreate} from "@/api/factory_warehouse/purchase_require";
import {factoryWarehouseGoodsList} from "@/api/factory_warehouse/goods";

export default {
  name: 'TemuDlgEditPurchaseRequire',
  components: {Upload, KdxImage},
  props: {
    row: {
      type: Object,
    },
  },
  watch: {},
  computed: {
    ...mapGetters("user", ["groupId"]),
  },
  data() {
    return {
      form: {
        list: []
      },

      goodsOptions: [],
      priorityOptions: [
        {id: 1, name: "低"},
        {id: 2, name: "中"},
        {id: 3, name: "高"},
      ],
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
      this.form.list = [this.emptyRequire()]
    },
    emptyRequire() {
      return {
        goods_id: undefined,
        quantity: undefined,
        priority: 2,
      }
    },
    addRequire() {
      this.form.list.push(this.emptyRequire())
    },
    deleteRequire(row) {
      this.$set(this.form, "list", this.form.list.filter(item => {return item !== row}))
    },
    goodsUnit(goodsId) {
      let goods = this.goodsOptions.find(item => {return item.id === goodsId})
      if (!goods) {
        return ``
      }
      return goods.unit
    },
    async create() {
      if (this.form.list.length === 0) {
        this.$message.error("请填写采购需求")
        return
      }

      for (const row of this.form.list) {
        if (!row.goods_id) {
          this.$message.error("请选择需要采购的产品")
          return
        }
        if (!row.quantity) {
          this.$message.error("请选择需要采购的数量")
          return
        }
      }

      let resp = await factoryWarehousePurchaseRequireCreate(this.form.list)
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