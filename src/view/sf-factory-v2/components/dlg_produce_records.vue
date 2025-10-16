<template>
  <el-drawer :visible.sync="$attrs.visible" title="打印记录"  @opened="onOpened" size="75%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.created_at).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="打印id列表" align="center" width="600">
        <div slot-scope="{row}">
          <div style="font-size: 12px" @click="copy(row.ids.join(' '))">
            {{row.ids.join(",")}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="Pdf" align="center">
        <div slot-scope="{row}">
          <el-link size="mini" type="primary" :href="pdfUrl(row)" :underline="false" target="_blank">链接</el-link>
        </div>
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
import {factoryTaskGroupProduceRecords} from "@/api/sf-factory-v2/task_group";

export default {
  name: 'DlgProduceRecords',
  mixins: [infoList],
  computed:{
  },
  props: {
  },
  watch: {},
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await factoryTaskGroupProduceRecords()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }
      this.tableData = resp.data
    },
    pdfUrl(row) {
      return window.location.origin + '/sf-factory-v2/' + row.uri
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
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