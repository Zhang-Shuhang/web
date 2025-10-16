<template>
  <el-drawer :visible.sync="$attrs.visible" :title="is_create || is_copy ? `创建规则` : `修改规则`" @opened="onOpened" size="40%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="130px" label-position="right">
      <el-form-item label="规则名字" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="货号前缀">
        <el-select v-model="form.prefixes" placeholder="如: YD-,MYD-" multiple allow-create filterable clearable style="width: 100%">
        </el-select>
      </el-form-item>
      <el-form-item label="条码宽" prop="width">
        <el-input-number v-model="form.width" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="条码高" prop="height">
        <el-input-number v-model="form.height" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片" prop="attach_image_url">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.attach_image_url" v-if="form.attach_image_url" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item label="附加图片起始点X" prop="attach_x">
        <el-input-number v-model="form.attach_x" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片起始点Y" prop="attach_y">
        <el-input-number v-model="form.attach_y" style="width: 100%" :min="100" :max="form.height"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片宽度" prop="attach_width">
        <el-input-number v-model="form.attach_width" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片高度" prop="attach_height">
        <el-input-number v-model="form.attach_height" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片2" prop="attach_image_url2">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess2" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.attach_image_url2" v-if="form.attach_image_url2" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%; margin-top: 10px; height: 50px" type="primary" @click="add">{{ is_create ? "创建" : "更新" }}</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import KdxImage from "@/components/image/image.vue";
import {labelCodeRuleAdd} from "@/api/tiktok/label_code_rule";

export default {
  name: 'TikotkDlgLabelCodeRule',
  components: {KdxImage},
  props: {
    is_create: {
      type: Boolean,
    },
    is_copy: {
      type: Boolean,
    },
    row: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  data() {
    return {
      form: {
        name: "",
        prefixes: [],
        width: 700,
        height: 500,
        attach_image_url: "",
        attach_image_url2: "",
        attach_x: 0,
        attach_y: 190,
        attach_width: 700,
        attach_height: 300,
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      if (this.is_create) {
        this.form = {
          name: "",
          prefixes: [],
          width: 700,
          height: 500,
          attach_image_url: "",
          attach_image_url2: "",
          attach_x: 0,
          attach_y: 190,
          attach_width: 700,
          attach_height: 300,
        }
      } else {
        this.form = {
          name: this.row.name,
          prefixes: this.row.prefixes || [],
          width: this.row.width,
          height: this.row.height,
          attach_image_url: this.row.attach_image_url,
          attach_image_url2: this.row.attach_image_url2,
          attach_x: this.row.attach_x,
          attach_y: this.row.attach_y,
          attach_width: this.row.attach_width,
          attach_height: this.row.attach_height,
        }
      }
    },
    async add() {
      let data = {}
      if (!this.is_create && !this.is_copy) {
        data.id = this.row.id
        data.version = this.row.version
      }
      data.name = this.form.name
      data.prefixes = this.form.prefixes
      data.width = this.form.width
      data.height = this.form.height
      data.attach_image_url = this.form.attach_image_url
      data.attach_image_url2 = this.form.attach_image_url2
      data.attach_x = this.form.attach_x
      data.attach_y = this.form.attach_y
      data.attach_width = this.form.attach_width
      data.attach_height = this.form.attach_height
      if (!data.name) {
        this.$message("请输入名字")
        return
      }
      if (data.prefixes.length <= 0) {
        this.$message("前缀起码要填写一个")
        return
      }
      if (!data.attach_image_url) {
        this.$message("请上传图片")
        return
      }
      let resp = await labelCodeRuleAdd(data)
      if (resp.code) {
        return
      }

      // 操作
      this.handleBeforeClose()
      this.$emit('update')
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.attach_image_url = res.data
    },
    handleSuccess2(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.attach_image_url2 = res.data
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.pageSize = 100
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>