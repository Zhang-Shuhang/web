<template>
  <el-drawer :visible.sync="$attrs.visible" :title="detail ? `${detail.cert_name}-${detail.show_name}` : ''" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px"
             label-position="right" v-if="detail">
      <div v-for="(item,index) in detail.cert_need_upload.cert_need_upload_items" :key="index">
        <el-card class="box-card">
          <template v-if="item.content_type === 4">
            <div slot="header" class="clearfix">
              <span>*产品实拍图</span>
            </div>
            <div>
              <el-form-item label="上传实拍图">
                <el-upload action="/temu/account/upload_file" :headers="{'x-token':token}" :show-file-list="false"
                           accept=".png,.jpg" :on-success="handleRealPictureSuccess" :on-error="handleError" :style="{width: '100%'}">
                  <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
                </el-upload>
                <div>
                  <el-tag type="warning" effect="dark">{{form.real_picture_check_result}}</el-tag>
                </div>
                <KdxImage :src="img" style="display: inline-block" v-for="(img, index) in form.real_pictures" :key="index"></KdxImage>
                <el-button style="width: 100px" type="primary" @click="clearRealPictures">清空实拍图</el-button>
              </el-form-item>
            </div>
          </template>
          <template v-else-if="item.content_type === 1">
            <div slot="header" class="clearfix">
              <span>*{{item.alias ? item.alias : '资质证书'}}</span>
            </div>
            <div>
              <el-form-item label="上传证书">
                <el-upload action="/temu/account/upload_file" :headers="{'x-token':token}"
                           accept=".png,.jpg,.pdf,.jpeg" :on-success="handleProductCertFilesSuccess" :on-error="handleError"
                           :on-remove="handleProductCertFileRemove" :style="{width: '100%'}" :file-list="form.product_cert_files">
                  <el-button size="mini" :style="{width: '100%'}" type="primary">上传文件</el-button>
                </el-upload>
              </el-form-item>
            </div>
          </template>
          <template v-else-if="item.content_type === 2">
            <div slot="header" class="clearfix">
              <span>*{{item.alias ? item.alias : '检测报告'}}</span>
            </div>
            <div>
              <el-form-item label="上传检测报告">
                <el-upload action="/temu/account/upload_file" :headers="{'x-token':token}"
                           accept=".png,.jpg,.pdf,.jpeg" :on-success="handleInspectReportFilesSuccess" :on-error="handleError"
                           :on-remove="handleInspectReportFileRemove" :style="{width: '100%'}" :file-list="form.inspect_report_files">
                  <el-button size="mini" :style="{width: '100%'}" type="primary">上传文件</el-button>
                </el-upload>
              </el-form-item>
            </div>
          </template>
          <template v-else>
            <div slot="header" class="clearfix">
              <span>*{{item.alias ? item.alias : `未知: ${item.content_type}`}}</span>
            </div>
          </template>
          <el-form-item label="拒绝原因" v-if="item.reject_reasons && item.reject_reasons.length">
            <div v-for="(reason, index) in item.reject_reasons" :key="index" style="color: red; font-size: 12px">
              {{reason}}
            </div>
          </el-form-item>
          <el-form-item label="上传示例" v-if="item.new_upload_example && item.new_upload_example.uploadExamplePicUrl">
            <KdxImage :src="img" style="display: inline-block" v-for="(img, index) in item.new_upload_example.uploadExamplePicUrl" :key="index"></KdxImage>
          </el-form-item>
          <el-form-item label="上传要求" v-if="item.new_upload_example && item.new_upload_example.uploadRequire">
            <div v-html="item.new_upload_example.uploadRequire">
            </div>
          </el-form-item>
        </el-card>
      </div>
      <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 100px" @click="onUpload">提交</el-button>
    </el-form>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {getPlanQcResult} from "@/api/temu/plan";
import {semiOrderPackageTracking} from "@/api/temu/semi_order";
import {certItemDetail, certItemUpload} from "@/api/temu/sale_cert_item";
import {mapGetters} from "vuex";

export default {
  name: 'TemuDlgUploadCert',
  components: {KdxImage},
  props: {
    ids: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  data() {
    return {
      detail: undefined,
      form: {
        real_picture_check_result: "",
        real_pictures: [],
        product_cert_files: [],
        inspect_report_files: [],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.form.real_pictures = []
      this.form.real_picture_check_result = ""
      this.form.product_cert_files = []
      this.form.inspect_report_files = []
      this.$emit('close', false)
    },
    async onOpened() {
      if (this.ids.length <= 0) {
        this.handleBeforeClose()
        return
      }

      let resp = await certItemDetail({id: this.ids[0]})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.detail = resp.data
      this.form.real_picture_check_result = this.detail.real_picture_check_result
      if (this.detail.real_pictures) {
        this.form.real_pictures = this.detail.real_pictures.map((item)=>{return item.image_url})
      }
      if (this.detail.product_cert_files) {
        this.form.product_cert_files = this.detail.product_cert_files.map((item)=>{return {"name": item.file_name, "url": item.file_url}})
      }
      if (this.detail.inspect_report_files) {
        this.form.inspect_report_files = this.detail.inspect_report_files.map((item)=>{return {"name": item.file_name, "url": item.file_url}})
      }
      this.detail.cert_need_upload.cert_need_upload_items.sort((a, b) => {
        if (a.content_type === 4) {
          return -1
        } else if (b.content_type === 4) {
          return 1
        }
        return a.content_type - b.content_type
      })
    },
    handleRealPictureSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.real_pictures.push(res.data.url)
    },
    handleProductCertFilesSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.product_cert_files.push(res.data)
    },
    handleProductCertFileRemove(file) {
      this.form.product_cert_files = this.form.product_cert_files.filter((item) => {
        return item.url !== file.url
      })
    },
    handleInspectReportFilesSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.inspect_report_files.push(res.data)
    },
    handleInspectReportFileRemove(file) {
      this.form.inspect_report_files = this.form.inspect_report_files.filter((item) => {
        return item.url !== file.url
      })
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    clearRealPictures() {
      this.form.real_pictures = []
    },
    async onUpload() {
      if (!this.detail) {
        return
      }

      for (const item of this.detail.cert_need_upload.cert_need_upload_items) {
        if (item.content_type === 4) {
          if (this.form.real_pictures.length <= 0) {
            this.$message("请上传实拍图")
            return
          }
        } else if (item.content_type === 2) {
          if (this.form.inspect_report_files.length <= 0) {
            this.$message(`请上传${item.alias || '检测报告'}`)
            return
          }
        } else if (item.content_type === 1) {
          if (this.form.product_cert_files.length <= 0) {
            this.$message(`请上传${item.alias || '资质证书'}`)
            return
          }
        }
      }

      let cert = {
        certType: this.detail.cert_type,
        productCertFiles: [],
        inspectReportFiles: [],
      }
      for (const f of this.form.product_cert_files) {
        cert.productCertFiles.push({
          fileName: f.name,
          fileUrl: f.url,
        })
      }
      for (const f of this.form.inspect_report_files) {
        cert.inspectReportFiles.push({
          fileName: f.name,
          fileUrl: f.url,
        })
      }
      let resp = await certItemUpload({ids: this.ids, real_pictures: this.form.real_pictures, cert: cert})
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.handleBeforeClose()
      this.$emit('update')
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
.el-form-item--mini .el-form-item__content, .el-form-item--mini .el-form-item__label {
  line-height: 18px !important;
}
</style>