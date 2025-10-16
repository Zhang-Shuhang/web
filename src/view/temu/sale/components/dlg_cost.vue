<template>
  <el-dialog :visible.sync="$attrs.visible" title="设置成本" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form :rules="toSetRules" ref="elForm" :model="toSet" size="mini" label-width="100px" label-position="left">
      <el-form-item label="成本(¥)" prop="min_cost">
        <el-input-number size="mini" v-model="toSet.price" placeholder="请输入成本" :min="0" :precision="2" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-button type="primary" style="width: 100%; margin-top: 20px" @click="set">设置</el-button>
    </el-form>
  </el-dialog>
</template>


<script>
import {saleItemSetPrice} from "@/api/temu/sale_item";

export default {
  name: 'TemuDlgCost',
  components: {},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      toSet: {
        price: undefined,
      },

      toSetRules: {
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.toSet.price = undefined
    },
    set() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return

        let resp = await saleItemSetPrice({id: this.id, price: this.toSet.price})
        if (resp.code === 0) {
          this.$message("操作成功")
          this.$emit('close', false)
        }
      })
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