<template>
  <el-drawer :visible.sync="$attrs.visible" title="生成Jsx需要配置" @opened="onOpened" :size="`${Math.floor(800)}px`"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose"
             :destroy-on-close="true">
    <div style="margin: 5px">
      <el-input style="width: 100%" type="textarea" :autosize="{ minRows: 10, maxRows: 50 }" v-model="jsx"
                placeholder="请输入jsx" clearable></el-input>
      <el-button style="width: 100%; height: 40px" type="primary" :disabled="!jsx" @click="confirmGen">生成</el-button>
    </div>
  </el-drawer>
</template>
<script>

import {customizeOrderGenJsx} from "@/api/customize_v3/order";

export default {
  name: 'CustomizeDlgJsxGenerate',
  components: {},
  mixins: [],
  props: {
    array: {
      type: Array,
    },
  },
  watch: {},
  data() {
    return {
      jsx: "",
    }
  },
  mounted() {
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.jsx = ""
    },
    async confirmGen() {
      if (this.jsx.indexOf("[Id]") < 0) {
        this.$message.error("JSX 中竟然没包括 [Id]")
        return
      }

      for (const item of this.array) {
        for (const text of item.texts) {
          if (this.jsx.indexOf(text.key) < 0) {
            this.$message.error(`JSX 中竟然没包括 ${text.key}`)
            return
          }
        }
      }

      let contentArray = []
      for (const item of this.array) {
        for (const text of item.texts) {
          if (this.jsx.indexOf(text.key) < 0) {
            this.$message.error(`JSX 中竟然没包括 ${text.key}`)
            return
          }
        }
        let content = this.jsx.replaceAll("[Id]", item.id)
        for (const text of item.texts) {
          content = content.replaceAll(text.key, this.firstUp(text.value))
        }
        contentArray.push({
          id: item.id,
          content: content,
        })
      }

      let resp = await customizeOrderGenJsx(contentArray)
      if (resp.code) {
        return
      }
      this.$message("请求成功")
      window.open(`${resp.data}`, "_BLANK")
    },
    firstUp(text) {
      let newStr = text.split(" ");
      for (let i = 0; i < newStr.length; i++) {
        newStr[i] = newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
      }
      return newStr.join(" ")
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制成功')
      }, function () {
        this.$message.error('复制失败')
      })
    },
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__content {
  display: none;
}
</style>