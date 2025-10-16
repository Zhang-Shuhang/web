<template>
  <div>
    <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
               accept=".png,.jpg,.jpeg" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
      <el-button size="mini" :style="{width: '100%'}" type="primary">上传</el-button>
    </el-upload>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'Upload',
  components: {},
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  methods: {
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.$emit("image", res.data)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>