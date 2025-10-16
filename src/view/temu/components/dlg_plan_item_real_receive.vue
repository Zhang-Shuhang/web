<template>
  <span>
    <i class="el-icon-edit" v-if="id !== fix_id" @click="startEdit"></i>
    <template v-if="id === fix_id">
      <el-input :ref="id" v-model.number="new_count" @keyup.enter.native="updateEditCount" size="mini">
        <el-button slot="append" size="mini" type="primary" @click="updateEditCount" icon="el-icon-success"></el-button>
        <el-button slot="append" style="margin-left: 10px" size="mini" type="primary" @click="endEditCount" icon="el-icon-error"></el-button>
      </el-input>
    </template>
  </span>
</template>


<script>
import {
  planItemFix
} from "@/api/temu/plan_item";

export default {
  name: 'TemuDlgPlanItemRealReceive',
  mixins: [],
  props: {
    id: {
      type: String,
    },
    count: {
      type: Number,
    }
  },
  data() {
    return {
      fix_id: undefined,
      new_count: 0,
    }
  },
  methods: {
    startEdit() {
      this.fix_id = this.id
      this.new_count = this.count
    },
    async updateEditCount() {
      // 请求修改数量 TODO
      let resp = await planItemFix({id: this.id, quantity: this.new_count})
      if (resp.code) {
        return
      }

      this.$message("修改成功")
      this.endEditCount()
      this.$emit('update')
    },
    endEditCount() {
      this.fix_id = ""
      this.new_count = undefined
    }
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