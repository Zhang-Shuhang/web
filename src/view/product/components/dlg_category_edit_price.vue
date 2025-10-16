<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑价格" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div style="margin-left: 10px; margin-right: 10px">
      <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
        <el-form-item label="成本(￥)" prop="cost" v-if="canSetProductOk">
          <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.cost"></el-input-number>
        </el-form-item>
        <el-form-item label="Vmi建议价格(￥)" prop="vmi_price">
          <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.vmi_price"></el-input-number>
        </el-form-item>
        <el-form-item label="Vmi最低价格(￥)" prop="vmi_min_price">
          <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.vmi_min_price"></el-input-number>
        </el-form-item>
        <el-form-item label="Jit建议价格(￥)" prop="jit_price">
          <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.jit_price"></el-input-number>
        </el-form-item>
        <el-form-item label="Jit最低价格(￥)" prop="jit_min_price">
          <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.jit_min_price"></el-input-number>
        </el-form-item>
        <el-form-item label="Vmi/Jit活动最低(￥)" prop="activity_min_price">
          <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.activity_min_price" :disabled="!canSetProductOk"></el-input-number>
        </el-form-item>
        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="半托建议价格(￥)" prop="semi_price">
              <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.semi_price"></el-input-number>
            </el-form-item>
            <el-form-item label="半托最低价格(￥)" prop="semi_min_price">
              <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.semi_min_price"></el-input-number>
            </el-form-item>
            <el-form-item label="半托活动最低(￥)" prop="semi_activity_min_price">
              <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.semi_activity_min_price" :disabled="!canSetProductOk"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Y2建议价格(￥)" prop="semi_y2_price">
              <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.semi_y2_price"></el-input-number>
            </el-form-item>
            <el-form-item label="Y2最低价格(￥)" prop="semi_y2_min_price">
              <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.semi_y2_min_price"></el-input-number>
            </el-form-item>
            <el-form-item label="Y2活动最低(￥)" prop="semi_y2_activity_min_price">
              <el-input-number :min="0" :precision="2" style="width: 100%" v-model="form.semi_y2_activity_min_price" :disabled="!canSetProductOk"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="medium" style="width: 100%" type="warning" @click="onUpdate">更新</el-button>
      </el-form>
    </div>
  </el-drawer>
</template>


<script>

import {categoryLoad, categoryUpdatePrice} from "@/api/product/category";
import {mapGetters} from "vuex";

export default {
  name: 'TemuDlgCategoryEditPrice',
  props: {
    id: {
      type: Number,
    },
  },
  data() {
    return {
      form: this.emptyForm(),
    }
  },
  mixins: [],
  computed: {
    ...mapGetters("user", ["canSetProductOk"]),
  },
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
      let resp = await categoryUpdatePrice({...this.form})
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
        cost: 0,
        vmi_price: 0,
        vmi_min_price: 0,
        semi_price: 0,
        semi_min_price: 0,
        semi_activity_min_price: 0,
        semi_y2_price: 0,
        semi_y2_min_price: 0,
        semi_y2_activity_min_price: 0,
        jig_price: 0,
        jig_min_price: 0,
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