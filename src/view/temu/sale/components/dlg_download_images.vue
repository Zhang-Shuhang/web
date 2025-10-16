<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量下载图片" @opened="onOpened" size="70%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div style="margin-bottom: 10px">
      <el-row>
        <el-col :span="12">
          <el-input type="textarea" :rows="10" style="width: 100%" placeholder="请输入 id, 以回车区分" v-model="idContent"
                    clearable :autosize="{ minRows: 10, maxRows: 30 }"></el-input>
        </el-col>
        <el-col :span="12">
          <el-input type="textarea" :rows="10" style="width: 100%" placeholder="请输入 货号, 以回车区分" v-model="extCodeContent"
                    clearable :autosize="{ minRows: 10, maxRows: 30 }"></el-input>
        </el-col>
      </el-row>
    </div>
    <el-button size="medium" type="warning" style="width: 100%; height: 50px; margin-top: 20px" @click="submit">提交</el-button>
  </el-drawer>
</template>

<script>

import {saleDownloadImages} from "@/api/temu/sale";

export default {
  name: 'TemuDlgDownloadImages',
  components: {},
  mixins: [],
  props: {
    ids: {
      type: Array,
    },
    ext_codes: {
      type: Array,
    },
  },
  data() {
    return {
      idContent: "",
      extCodeContent: "",
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.idContent = ""
      if (this.ids.length) {
        this.idContent = this.ids.join("\n")
      }

      this.extCodeContent = ""
      if (this.ext_codes.length) {
        this.extCodeContent = this.ext_codes.join("\n")
      }
    },
    async submit() {
      let ids = this.idContent ? this.idContent.split("\n").map((item) => {return Number(item)}) : []
      let extCodes = this.extCodeContent ? this.extCodeContent.split("\n") : []
      if (ids.length === 0 && extCodes.length === 0) {
        this.$message.error("请求列表为空")
        return
      }

      // 操作
      let resp = await saleDownloadImages({ids: ids, ext_codes: extCodes})
      if (resp.code) {
        return
      }

      this.$message("下载成功")
      window.open(resp.data, "_BLANK")
      this.handleBeforeClose()
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-drawer__body {
  padding: 10px;
}

::v-deep .el-tabs__content {
  display: none;
}
</style>