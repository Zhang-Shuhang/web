<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑属性" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div style="margin-left: 10px; margin-right: 10px">
      <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
        <el-form-item label="金属制品属性" prop="metal_property">
          <el-input placeholder="金属制品属性，必须跟后台一致" v-model="form.metal_property" clearable maxlength="70"></el-input>
        </el-form-item>
        <el-form-item label="材料类型(拖鞋鞋面)" prop="material_type_tx">
          <el-input placeholder="材料类型属性，必须跟后台一致" v-model="form.material_type_tx" clearable maxlength="200"></el-input>
        </el-form-item>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="木制品属性" prop="wooden_property">
              <el-input placeholder="木制品属性，必须跟后台一致" v-model="form.wooden_property" clearable maxlength="70"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="木制品国家" prop="wooden_country">
              <el-input placeholder="木制品国家，必须跟后台一致" v-model="form.wooden_country" clearable maxlength="70"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="木材重量" prop="wooden_weight">
              <el-input-number placeholder="木材重量 单位：Kg" style="width: 100%" v-model="form.wooden_weight" :min="0" :max="10" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="再生材料百分比" prop="recycle_percent">
              <el-input-number placeholder="单位：%" style="width: 100%" v-model="form.recycle_percent" :min="0" :max="100" :precision="2"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="medium" style="width: 100%" type="warning" @click="onUpdate">更新</el-button>
      </el-form>
    </div>
  </el-drawer>
</template>


<script>

import {categoryLoad, categoryUpdateProperty} from "@/api/product/category";

export default {
  name: 'TemuDlgCategoryEditProperty',
  props: {
    id: {
      type: Number,
    },
  },
  computed: {
  },
  watch: {},
  data() {
    return {
      form: this.emptyForm(),
    }
  },
  mixins: [],
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      Object.assign(this.form, this.emptyForm())

      if (!this.id) {
        return
      }

      let resp = await categoryLoad({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      Object.assign(this.form, resp.data)
    },
    async onUpdate() {
      let resp = await categoryUpdateProperty({...this.form})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    emptyForm() {
      return {
        id: undefined,
        metal_property: "",
        material_type_tx: "",
        max_per_box: 300,
        wooden_property: "",
        wooden_country: "",
        wooden_weight: undefined,
        recycle_percent: undefined,
      }
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