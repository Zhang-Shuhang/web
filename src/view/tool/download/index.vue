<template>
  <div>
    <div style="margin-top: 400px">
      <el-row :gutter="5">
        <el-col :span="16" :offset="4">
          <el-col :span="16">
            <el-input size="medium" style="width: 100%" v-model="url" :precision="2" :step="1" placeholder="请输入下载链接，仅支持freepik/creativefabrica"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button size="medium" type="primary" style="width: 100%; height: 30px" @click="download">下载</el-button>
          </el-col>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>

export default {
  components: {
  },
  mixins: [],
  watch: {
  },
  data() {
    return {
      url: undefined,
    }
  },
  methods: {
    download() {
      window.open(`https://download.debus.xyz/api/download?url=${encodeURIComponent(this.url)}`, "download"); //打开新窗口
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>