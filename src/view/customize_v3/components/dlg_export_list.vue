<template>
  <el-drawer :visible.sync="$attrs.visible" title="图片导出列表" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border height="100%" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
      <el-table-column label="Id" align="center" prop="id">
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.created_at).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="下载链接" align="center">
        <div slot-scope="{row}">
          <el-link size="mini" type="primary" :href="row.url" :underline="false" target="_blank" v-if="row.url">下载</el-link>
        </div>
      </el-table-column>
      <el-table-column label="原因" prop="reason" align="center">
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script>

import {customizeOrderExportList} from "@/api/customize_v3/order";

export default {
  name: 'CustomizeDlgExportList',
  components: {},
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
      let resp = await customizeOrderExportList()
      if (resp.code) {
        return
      }
      this.list = resp.data
    },
  },
}
</script>
<style scoped lang="scss">
</style>