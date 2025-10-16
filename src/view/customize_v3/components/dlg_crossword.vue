<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑配置" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :rules="toSetRules" :model="form" size="mini" label-width="100px"
             label-position="right">
      <el-form-item label="未交叉底图" prop="image">
        <el-input style="width: 100%" v-model="form.image" placeholder="未交叉底图链接" clearable></el-input>
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="(res) => {handleImageSuccess('image', res)}"
                   :on-error="handleError" style="width: 100%">
          <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="交叉底图" prop="cross_image">
        <el-input style="width: 100%" v-model="form.cross_image" placeholder="交叉底图链接" clearable></el-input>
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="(res) => {handleImageSuccess('cross_image', res)}"
                   :on-error="handleError" style="width: 100%">
          <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="图片宽度" prop="image_width">
        <el-input-number v-model="form.image_width" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="图片间隔" prop="image_gap">
        <el-input-number v-model="form.image_gap" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="文字颜色" prop="color">
        <el-color-picker style="width: 100%" color-format="hex" v-model="form.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="是否右下角生成数字" prop="with_num">
        <el-switch v-model="form.with_num" active-text="生成" inactive-text="不生成"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%" type="primary" @click="save">保存并关闭</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>

export default {
  name: 'CustomizeDlgCrossword',
  components: {},
  mixins: [],
  props: {
    cfg: {
      type: Object,
    },
    token: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      form: this.emptyForm(),

      toSetRules: {
        image: [{
          required: true,
          message: '请输入或上传未交叉图片链接',
          trigger: 'blur'
        }],
        cross_image: [{
          required: true,
          message: '请输入或上传交叉图片链接',
          trigger: 'blur'
        }],
        image_width: [{
          required: true,
          message: '请输入图片宽度',
          trigger: 'blur'
        }],
        image_gap: [{
          required: true,
          message: '请输入图片间隔',
          trigger: 'blur'
        }],
        color: [{
          required: true,
          message: '请输入文字颜色',
          trigger: 'blur'
        }],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      Object.assign(this.form, this.cfg || this.emptyForm())
    },
    handleImageSuccess(key, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form[key] = res.data
    },
    handleError(err) {
      this.fullscreenLoading = false
      this.$message.error("上传失败!" + err);
    },
    save() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return

        this.$emit('update', this.form)
        this.handleBeforeClose()
      })
    },
    emptyForm() {
      return {
        image: "https://image.szkdx.work/upload/2025/5/27/2/18/5e15514d-6707-47ce-8e64-760f6f3ed80b.png",
        cross_image: "https://image.szkdx.work/upload/2025/5/27/2/15/560e22cc-7c46-45ad-8df2-7fc5a0ef2531.png",
        image_width: 33.4638,
        image_gap: 3.1291,
        color: "#FFFFFF",
        with_num: false,
      }
    }
  },
}
</script>
<style scoped lang="scss">
</style>