<template>
  <el-drawer :visible.sync="$attrs.visible" :title="`${info.expressCompanyName}-${info.trackingNumber}`" @opened="onOpened" :size="isMobile ? '100%' : '80%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="info.traceDetailInfoList" border min-height="20vh" @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="时间" prop="time" align="center">
      </el-table-column>
      <el-table-column label="信息" prop="info" align="center">
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import infoList from '@/components/mixins/infoList'
import {
  planItemQueryExpressTraceInfo,
} from "@/api/temu/plan_item";

export default {
  name: 'TemuDlgTraceInfo',
  components: {},
  mixins: [infoList],
  props: {
    id: {
      type: String,
    },
  },
  computed: {},
  data() {
    return {
      isMobile: false,
      info: {
        traceDetailInfoList: [],
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await planItemQueryExpressTraceInfo({id: this.id})
      if (resp.code) {
        return
      }

      this.info = resp.data
    },
  },
  mounted() {
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
::v-deep .el-drawer__header {
  margin-bottom: 0px !important;
}
</style>