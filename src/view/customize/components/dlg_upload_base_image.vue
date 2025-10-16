<template>
  <el-drawer :visible.sync="$attrs.visible" title="测试" @opened="onOpened" size="60%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="80px" label-position="right">
      <el-form-item label="图片名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入图片名字" clearable></el-input>
      </el-form-item>
      <el-form-item v-if="form.name">
        <el-upload :action="`/customize_v2/base_image/update?name=${form.name}`" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png" :on-success="handleSuccess" :on-error="handleError" style="width: 100%">
          <el-button size="mini" style="width: 100%" type="primary">
            上传底图
          </el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>

import {mapGetters} from "vuex";

export default {
  name: 'CustomizeDlgUploadBaseImage',
  components: {},
  mixins: [],
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  data() {
    return {
      form: {
        name: '',
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.form.name = ""
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.$message("上传成功!");
      this.$emit("suc")
      this.handleBeforeClose()
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
}
</script>
<style scoped lang="scss">
</style>