<template>
  <el-drawer :visible.sync="$attrs.visible" title="分配记录" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center">
        <template slot-scope="{row}">
          {{new Date(row.created_at).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updated_at" align="center">
        <template slot-scope="{row}">
          {{new Date(row.updated_at).toLocaleString()}}
        </template>
      </el-table-column>
      <el-table-column label="失败原因" prop="fail_reason" align="center">
      </el-table-column>
      <el-table-column label="文件链接" prop="file_url" align="center">
        <template slot-scope="{row}">
          <el-link size="mini" type="primary" :href="row.file_url" :underline="false" target="_blank" v-if="row.file_url">下载</el-link>
        </template>
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
import {semiOrderAllocateList} from "@/api/temu/semi_order";
import infoList from "@/components/mixins/infoList";

export default {
  name: 'TemuDlgAllocateList',
  computed: {},
  watch: {},
  data() {
    return {
      listApi: semiOrderAllocateList,
    }
  },
  mixins: [infoList],
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.page = 1
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