<template>
  <el-dialog :visible.sync="$attrs.visible" title="证书需求" @opened="onOpened" width="70%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border min-height="20vh" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="资质名称" prop="cert_name" align="center">
      </el-table-column>
      <el-table-column label="资质中文名" prop="show_name" align="center">
      </el-table-column>
      <el-table-column label="资质上传状态" prop="upload_status" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini" :type="uploadStatusType(row)" effect="dark">{{uploadStatusName(row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="资质适用国家地区" prop="allow_site_desc" align="center">
      </el-table-column>
      <el-table-column label="售卖影响" align="center" min-width="200px">
        <template slot-scope="{row}">
          <div style="color: red">
            {{effect(row)}}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
import {saleCert} from "@/api/temu/sale";

export default {
  name: 'TemuDlgCert',
  components: {},
  mixins: [],
  props: {
    id: {
      type: Number,
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
      this.list = []
    },
    async onOpened() {
      let resp = await saleCert({id: this.id})
      if (resp.code) {
        return
      }

      this.list = resp.data
    },
    effect(row) {
      if (!row.certWarnType) {
        return ""
      }
      if (row.expectPunishExecuteTime) {
        return `请在${new Date(row.expectPunishExecuteTime).toLocaleDateString()}前上传资质，否则将被下架${row.allow_site_desc}国家地区`
      }
      return `请尽快上传资质，否则有被下架${row.allow_site_desc}国家地区的风险`
    },
    uploadStatusName(row) {
      switch (row.upload_status) {
        case 1:
          return "待上传"
        case 2:
          return "上传中"
        case 3:
          return "上传失败"
        case 4:
          return "上传成功"
        case 5:
          return "待更新"
      }
      return `未知[${row.upload_status}]`
    },
    uploadStatusType(row) {
      if (row.upload_status === 4) {
        return "success"
      }
      return "danger"
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