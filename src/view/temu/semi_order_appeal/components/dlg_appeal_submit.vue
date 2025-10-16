<template>
  <el-drawer :visible.sync="$attrs.visible" title="申诉" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="data.items" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="data">
      <el-table-column label="Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="订单id" prop="order_id" align="center">
      </el-table-column>
      <el-table-column label="金额" prop="punish_amount" align="center">
      </el-table-column>
      <el-table-column label="时间" prop="operationTimeStr" align="center">
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import {semiOrderAppealLoad} from "@/api/temu/semi_order_appeal";

export default {
  name: 'TemuDlgAppealSubmit',
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      data: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await semiOrderAppealLoad({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.data = resp.data
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