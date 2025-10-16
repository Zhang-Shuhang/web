<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量改货号" @opened="onOpened" size="70%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div style="margin-bottom: 10px">
      <el-input type="textarea" :rows="10" style="width: 100%" placeholder="请输入 新货号 老货号" v-model="content"
                clearable :autosize="{ minRows: 10, maxRows: 100 }"></el-input>
    </div>
    <el-button size="medium" type="warning" style="width: 100%; height: 50px; margin-top: 20px" @click="submit">提交</el-button>
  </el-drawer>
</template>

<script>

import {itemBatchModifySkuCode} from "@/api/temu/sale_item";

export default {
  name: 'TemuDlgBatchModifySkuCode',
  components: {},
  mixins: [],
  props: {},
  watch: {
    content() {
    },
  },
  computed: {
  },
  data() {
    return {
      content: "",
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
    },
    async submit() {
      let list = this.content.split("\n")

      let datas = []
      for (const v of list) {
        let array = v.split(" ")
        if (array.length !== 2) {
          array = v.split(",")
          if (array.length !== 2) {
            array = v.split("\r")
            if (array.length !== 2) {
              this.$message("参数错误: " + v)
              return
            }
          }
        }

        datas.push({s1: array[0], s2: array[1]})
      }

      // 操作
      let resp = await itemBatchModifySkuCode(datas)
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit('update')
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