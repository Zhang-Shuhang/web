<template>
  <el-drawer :visible.sync="$attrs.visible" :title="isEdit ? '编辑' : '创建'" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="Sku" prop="sku">
        <el-input v-model="form.sku" placeholder="请输入货号" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <Upload @image="uploadImage"></Upload>
        <KdxImage :src="form.image" v-if="form.image"></KdxImage>
      </el-form-item>
      <el-form-item label="重量(g)" prop="weight" v-if="!form.is_combine">
        <el-input-number v-model="form.weight" placeholder="请输入单位(平方米/米/件)数据的重量(g)" :min="0" :precision="0"></el-input-number>
      </el-form-item>
      <el-form-item label="加工类型" prop="group_id" v-if="!isEdit">
        <el-select v-model="form.group_id" placeholder="请选择是否公开" style="width: 100%" filterable>
          <el-option label="公开" :value="0"></el-option>
          <el-option label="本司" :value="groupId" v-if="groupId>0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单位" prop="unit">
        <el-select v-model="form.unit" placeholder="请选择单位" style="width: 100%" filterable>
          <el-option label="件" value="件"></el-option>
          <el-option label="平方米" value="平方米"></el-option>
          <el-option label="平方分米" value="平方分米"></el-option>
          <el-option label="米" value="米"></el-option>
          <el-option label="厘米" value="厘米"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否组合" prop="is_combine">
        <el-select v-model="form.is_combine" placeholder="请选择是否组合" style="width: 100%" @change="changeIsCombine" filterable :disabled="isEdit">
          <el-option label="单品" :value="false"></el-option>
          <el-option label="组合" :value="true"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="组合列表" prop="is_combine" v-if="form.is_combine">
        <el-row>
          <template v-for="(item, index) in form.combine_goods_list">
            <el-col :span="8" :key="index">
              <el-select size="mini" v-model="item.id" placeholder="请选择商品" filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in goodsOptions" :key="index" :label="`${item.name}-(${item.unit})`" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input-number style="width: 100%" v-model="item.count" placeholder="配件数量" :min="0" :precision="4"></el-input-number>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" type="primary" @click="addCombineGoods">添加</el-button>
              <el-button size="mini" type="danger" @click="deleteCombineGoods(item)" v-if="form.combine_goods_list.length > 1">删除</el-button>
            </el-col>
          </template>
        </el-row>
      </el-form-item>
      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{isEdit ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import Upload from "@/view/components/upload.vue";
import {
  factoryWarehouseGoodsCreate,
  factoryWarehouseGoodsList,
  factoryWarehouseGoodsUpdate
} from "@/api/factory_warehouse/goods";

export default {
  name: 'TemuDlgEditGoods',
  components: {Upload, KdxImage},
  props: {
    row: {
      type: Object,
    },
  },
  watch: {},
  computed: {
    ...mapGetters("user", ["groupId"]),
    isEdit() {
      return this.form.id > 0
    }
  },
  data() {
    return {
      form: this.emptyForm(),
      goodsOptions: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await factoryWarehouseGoodsList({is_combine: 1})
      if (resp.code) {
        return
      }
      this.goodsOptions = resp.data

      if (this.row) {
        this.form = this.emptyForm()
        this.form.id = this.row.id
        this.form.name = this.row.name
        this.form.sku = this.row.sku
        this.form.image = this.row.image
        this.form.unit = this.row.unit
        this.form.weight = this.row.weight
        this.form.group_id = this.row.group_id
        this.form.is_combine = this.row.is_combine
        for (let i = 0; i < this.row.combine_goods_ids.length; i++) {
          this.form.combine_goods_list.push({
            id: this.row.combine_goods_ids[i],
            count: this.row.combine_goods_counts[i],
          })
        }
        Object.assign(this.form, this.row)
      } else {
        Object.assign(this.form, this.emptyForm())
      }
    },
    emptyForm() {
      return {
        id: 0,
        name: "",
        sku: "",
        image: undefined,
        unit: "件",
        group_id: this.groupId,
        weight: 0,
        is_combine: false,
        combine_goods_list: []
      }
    },
    emptyCombineGoods() {
      return {
        id: undefined,
        count: undefined,
      }
    },
    addCombineGoods() {
      this.form.combine_goods_list.push(this.emptyCombineGoods())
    },
    deleteCombineGoods(item) {
      this.$set(this.form, "combine_goods_list", this.form.combine_goods_list.filter(v => {return v !== item}))
    },
    changeIsCombine() {
      if (!this.form.is_combine) {
        return
      }
      this.form.combine_goods_list = [this.emptyCombineGoods()]
    },
    uploadImage(newImage) {
      this.form.image = newImage
    },
    async createOrSave() {
      if (!this.form.sku) {
        this.$message.error("请输入货号")
        return
      }
      if (!this.form.name) {
        this.$message.error("请输入名字")
        return
      }

      let data = {...this.form, is_combine: this.form.is_combine, combine_goods_ids: [], combine_goods_counts: []}
      if (this.form.is_combine) {
        if (this.form.combine_goods_list.length <= 0) {
          this.$message.error("起码要选择一个商品")
          return
        }

        for (const cg of this.form.combine_goods_list) {
          if (!cg.id) {
            this.$message.error("没选择商品!")
            return
          }

          if (cg.count <= 0) {
            this.$message.error("没有填写数量!")
            return
          }

          data.combine_goods_ids.push(cg.id)
          data.combine_goods_counts.push(cg.count)
        }
      }

      let f = factoryWarehouseGoodsCreate
      if (this.isEdit) {
        f = factoryWarehouseGoodsUpdate
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