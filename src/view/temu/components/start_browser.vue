<template>
  <el-button size="mini" type="primary" :style="st" @click="start">{{ name }}</el-button>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name: 'StartBrowser',
  props: {
    id: {
      type: Number,
    },
    account_id: {
      type: Number,
    },
    st: {
      type: String,
    },
    copy_content: {
      type: String | Number,
    },
    name: {
      type: String,
      default: "启动浏览器",
    },
    open_url: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters("user", ["token", "userInfo"]),
  },
  watch: {},
  data() {
    return {
      qc_detail: {
        flaw_vo_list: [],
      },
    }
  },
  methods: {
    async start() {
      if (this.copy_content) {
        let c = `${this.copy_content}`
        this.$copyText(c).then( () => {
          this.$message('复制 ' + c + ' 成功')
        }, function () {
          this.$message.error('复制 ' + c + ' 失败')
        })
      }
      fetch(`http://localhost:9527/open?id=${this.id}&user_token=${this.token}&user_id=${this.userInfo.ID}&open_shop=${this.account_id}&open_url=${encodeURIComponent(this.open_url)}&origin=${window.location.origin}`, {
        "method": "GET",
        "mode": "no-cors",
      }).then(async (response) => {
        const data = await response.json()
        if (!response.ok) throw new Error(`${data.error || "未知错误"}`)
        this.$message("启动中")
      }).catch((err) => {
        this.$message.error(`启动失败: ${err}`)
      });
    },
  },
}
</script>