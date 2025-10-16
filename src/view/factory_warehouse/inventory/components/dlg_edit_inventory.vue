<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑库存" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-form-item label="库存" prop="count">
        <el-input-number v-model="form.count" placeholder="请输入新的库存" style="width: 100%" clearable :precision="4" :min="0" :max="100000000"></el-input-number>
      </el-form-item>
      <el-button size="medium" type="primary" @click="update" style="width: 100%; height: 50px; margin-top: 5px">更新</el-button>
    </el-form>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import Upload from "@/view/components/upload.vue";
import {factoryWarehouseInventoryUpdate} from "@/api/factory_warehouse/inventory";

export default {
  name: 'TemuDlgEditInventory',
  components: {Upload, KdxImage},
  props: {
    row: {
      type: Object,
    },
  },
  watch: {},
  computed: {
  },
  data() {
    return {
      form: this.emptyForm(),
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.form.id = this.row.id
      this.form.count = this.row.count
    },
    emptyForm() {
      return {
        id: 0,
        count: 0,
      }
    },
    async update() {
      if (!this.form.count) {
        this.$message.error("请输入新的库存")
        return
      }

      let resp = await factoryWarehouseInventoryUpdate({id: this.form.id, new_count: this.form.count})
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