<template>
  <el-dialog :visible.sync="$attrs.visible" title="产品条码" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form :rules="toUploadRules" ref="elForm" :model="toUpload" size="mini" label-width="100px" label-position="left">
      <el-form-item label="Sku Id" prop="id" v-if="pt===0 && !userInfo.temu_upload_barcode_url">
        <el-input size="mini" v-model.number="toUpload.id" placeholder="请输入产品Sku Id" style="width: 100%" clearable :disabled="!is_create">
          <el-button slot="append" size="mini" style="width: 120px" type="primary" @click="genCode">服务器生成条码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="订单号: " prop="id" v-if="pt===1">
        <el-input size="mini" v-model.number="toUpload.id" placeholder="请输入产品Sku Id" style="width: 100%" clearable :disabled="!is_create">
          <el-button slot="append" size="mini" style="width: 120px" type="primary" @click="genCode">服务器生成条码</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="条码链接" prop="pdf_url">
        <el-input size="mini" v-model="toUpload.pdf_url" placeholder="请输入条码链接或者上传" style="width: 100%" clearable></el-input>
      </el-form-item>
      <el-upload drag :headers="{'x-token':token}" :action="`/sf-factory/item/upload`" class="el-upload" accept=".pdf" :on-success="handleSuccess" :on-error="handleError">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将条码文件拖到此处，或<em>点击上传条码</em></div>
      </el-upload>
      <el-button type="primary" style="width: 100%; margin-top: 20px" @click="set" :disabled="!toUpload.pdf_url">设置</el-button>
    </el-form>
  </el-dialog>
</template>


<script>
import {factoryItemUploadUrl} from "@/api/sf-factory/item";
import {factoryTaskUploadTemuBarcodeUrl, factoryTaskUploadTkBarcodeUrl} from "@/api/sf-factory/task";
import {mapGetters} from "vuex";
import {planGenCode} from "@/api/temu/plan_item";

export default {
  name: 'FDlgUploadBarcode',
  components: {},
  mixins: [],
  computed:{
    ...mapGetters("user", ["userInfo", "token"]),
  },
  props: {
    is_create: {
      type: Boolean,
    },
    pt: {
      type: Number,
    },
    id: {
      type: [Number, String],
    },
    pdf_url: {
      type: String,
    }
  },
  watch: {},
  data() {
    return {
      toUpload: {
        id: undefined,
        pdf_url: undefined,
      },

      toUploadRules: {
        id: [{
          required: true,
          message: '请输入Sku Id',
          trigger: 'blur'
        }],
        pdf_url: [{
          required: true,
          message: '请输入条码链接',
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
      this.toUpload.id = this.id
      this.toUpload.pdf_url = this.pdf_url
    },
    async genCode() {
      let resp = await planGenCode({id: this.toUpload.id, type: 2})
      if (resp.code === 0) {
        this.toUpload.pdf_url = resp.data.url
      }
    },
    set() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return

        if (!this.toUpload.pdf_url.endsWith(".pdf")) {
          this.$message("条码链接仅支持pdf文件")
          return
        }

        switch (this.pt) {
          case 0:
            if (!this.userInfo.temu_upload_barcode_url) {
              this.uploadItemUrl();
            } else {
              this.uploadTemuBarcodeUrl();
            }
            return
          case 1:
            this.uploadTkBarcodeUrl();
            return
        }
      })
    },
    async uploadTemuBarcodeUrl() {
      let resp = await factoryTaskUploadTemuBarcodeUrl({id: this.toUpload.id, url: this.toUpload.pdf_url})
      if (resp.code === 0) {
        if (this.is_create) {
          this.$message("创建成功")
        } else {
          this.$message("更新成功")
        }
        this.$emit('close', false)
      }
    },
    async uploadTkBarcodeUrl() {
      let resp = await factoryTaskUploadTkBarcodeUrl({id: this.toUpload.id, url: this.toUpload.pdf_url})
      if (resp.code === 0) {
        if (this.is_create) {
          this.$message("创建成功")
        } else {
          this.$message("更新成功")
        }
        this.$emit('close', false)
      }
    },
    async uploadItemUrl() {
      let resp = await factoryItemUploadUrl({id: this.toUpload.id, url: this.toUpload.pdf_url, is_create: this.is_create})
      if (resp.code === 0) {
        if (this.is_create) {
          this.$message("创建成功")
        } else {
          this.$message("更新成功")
        }
        this.$emit('close', false)
      }
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.toUpload.pdf_url = res.data.file.url
      this.$message("上传成功!");
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>