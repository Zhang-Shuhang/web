<template>
  <el-dialog width="50%" :visible.sync="$attrs.visible" title="调整广告日预算" @opened="onOpened" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="edit" size="medium" label-width="100px" label-position="right">
      <el-form-item label="日预算">
        <el-input-number size="medium" :min="200" :max="1000" :precision="2" style="width: 100%" v-model="edit.budget"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" style="width: 100%" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import {adModify} from "@/api/temu/ad";

export default {
  name: 'TemuDlgAdEditBudget',
  props: {
    rows: {
      type: Array,
    },
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
      edit: {
        budget: undefined,
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.edit.budget = 200
    },
    async submit() {
      let data = {ids: this.rows.map(item => item.product_id), budget: Number(this.edit.budget*100)}
      let resp = await adModify(data)
      if (resp.code) {
        return
      }

      if (resp.data) {
        this.$message.error(resp.data)
      } else {
        this.$message("设置成功")
      }
      this.$emit("suc")
      this.handleBeforeClose()
    }
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>