<template>
  <el-drawer :visible.sync="$attrs.visible" title="发货列表" @opened="onOpened" :size="isMobile ? '100%' : '80%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="Skc Id" prop="product_id" align="center">
      </el-table-column>
      <el-table-column label="变体 Id" prop="variation_id" align="center">
      </el-table-column>
      <el-table-column label="数量" prop="count" align="center">
      </el-table-column>
      <el-table-column label="是否处理" prop="is_handled" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini">{{row.is_handled ? "已处理" : "未处理"}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="是否成功" prop="success" align="center">
        <div slot-scope="{row}">
          <el-tag :type="row.success ? 'success' : 'warning'" size="mini">{{row.success ? "成功" : "失败"}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="结果" prop="result" align="center">
      </el-table-column>
    </el-table>

    <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :style="{textAlign:'right'}"
            :page-sizes="[5, 10, 20, 30, 50, 100, 200, 300, 500, 1000]"
            :total="total"
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total, prev, next, jumper, sizes"
    ></el-pagination>
  </el-drawer>
</template>


<script>
import infoList from '@/components/mixins/infoList'
import {suggestList} from "@/api/shein/suggest";

export default {
  name: 'SheinDlgApplyList',
  components: {},
  mixins: [infoList],
  props: {
    variation_id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      listApi: suggestList,
      isMobile: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.$set(this.searchInfo, "variation_id", this.variation_id)
      this.page = 1
      this.getTableData()
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
</style>