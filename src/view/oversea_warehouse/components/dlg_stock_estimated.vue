<template>
  <el-drawer :visible.sync="$attrs.visible" title="库存预估" @opened="onOpened" size="75%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border min-height="20vh" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="日期" prop="date" align="center">
      </el-table-column>
      <el-table-column label="开始数量" prop="start_count" align="center">
      </el-table-column>
      <el-table-column label="入库记录" prop="in_bound_list" align="center">
        <template slot-scope="{row}">
          <template v-if="row.in_bound_list">
            <el-tag v-for="(info, index) in row.in_bound_list" :key="index">
              {{info}}
            </el-tag>
          </template>
          <template v-else>
            -
          </template>
        </template>
      </el-table-column>
      <el-table-column label="销量" prop="today_sale" align="center">
      </el-table-column>
      <el-table-column label="结束数量" prop="end_count" align="center">
      </el-table-column>
      <el-table-column label="变更数量" prop="change_count" align="center">
      </el-table-column>
      <el-table-column label="断货天数" prop="dh_days" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini" type="danger" effect="dark" v-if="row.dh_days">{{row.dh_days}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import {overseasWarehouseStockEstimated} from "@/api/oversea_warehouse/list";
import infoList from '@/components/mixins/infoList'

export default {
  name: 'TemuDlgStockEstimated',
  mixins: [infoList],
  props: {
    id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      listApi: overseasWarehouseStockEstimated,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.$set(this.searchInfo, "id", this.id)
      this.getTableData()
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