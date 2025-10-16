<template>
  <el-button size="mini" style="margin-right: 10px" :type="message.count ? 'danger' : 'primary'" @click="jumpMessageIndex" :icon="isMobile ? 'el-icon-bell' : ''">{{messageBtnName()}}</el-button>
</template>
<script>
import {messageCount} from "@/api/message/message";

export default {
  name: 'MessageBox',
  props: {
  },
  data() {
    return {
      message: {
        count: 0,
      },
      isMobile: false,
    }
  },
  created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  },
  mounted() {
    this.updateMessageCount()
    setInterval(this.updateMessageCount, 300000)
  },
  methods: {
    async updateMessageCount() {
      let resp = await messageCount()
      if (resp.code) {
        return
      }

      this.message.count = resp.data
    },
    jumpMessageIndex() {
      this.$router.push({ name: "message_list", query: {}})
    },
    messageBtnName() {
      if (this.isMobile) {
        return ""
      }

      if (this.message.count > 0) {
        return `消息(${this.message.count})`
      }

      return "消息"
    }
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-button--mini, .el-button--mini.is-round {
  padding: 7px
}
</style>
