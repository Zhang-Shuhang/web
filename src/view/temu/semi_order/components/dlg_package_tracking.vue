<template>
  <el-drawer :visible.sync="$attrs.visible" title="物流信息" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="地址" prop="operationAddress" align="center">
      </el-table-column>
      <el-table-column label="信息" prop="operationContent" align="center">
      </el-table-column>
      <el-table-column label="时间" prop="operationTimeStr" align="center">
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {getPlanQcResult} from "@/api/temu/plan";
import {semiOrderPackageTracking} from "@/api/temu/semi_order";

export default {
  name: 'TemuDlgPackageTracking',
  components: {KdxImage},
  props: {
    id: {
      type: String,
    },
    waybill_id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await semiOrderPackageTracking({id: this.id, waybill_id: this.waybill_id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.list = resp.data
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