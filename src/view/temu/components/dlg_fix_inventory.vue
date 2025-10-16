<template>
  <el-dialog :visible.sync="$attrs.visible" :title="`修复库存(${sku})`" @opened="onOpened" width="60%"
               :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-input-number size="mini" v-model="new_left_count" placeholder="请输入数量" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
    <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="onFixInventory">设置</el-button>
  </el-dialog>
</template>


<script>
import {saleItemDxmInventoryFix} from "@/api/temu/sale_item";

export default {
  name: 'TemuDlgFixInventory',
  components: {},
  mixins: [],
  props: {
    sku: {
      type: String,
    },
    old_left_count: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      new_left_count: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.new_left_count = undefined
    },
    async onFixInventory() {
      let resp = await saleItemDxmInventoryFix({sku: this.sku, old_left_count: this.old_left_count, new_left_count: this.new_left_count})
      if (resp.code) {
        return
      }
      this.$message("修改成功")
      this.$emit('close', false)
    },
  },
}
</script>
<style scoped lang="scss">
</style>