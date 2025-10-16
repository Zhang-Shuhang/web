<template>
  <el-drawer :visible.sync="$attrs.visible" title="上传实拍标签" @opened="onOpened" size="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form size="mini" label-width="100px" label-position="right">
      <el-form-item label="实拍图">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-upload action="/temu/shout_real_picture/upload_file" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".png,.jpg" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
              <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
            </el-upload>
          </el-col>
        </el-row>

        <KdxImage :src="img" v-for="(img, index) in images" width="100px" height="100px" :key="index" style="margin-top: 5px"></KdxImage>
      </el-form-item>
    </el-form>

    <el-button type="primary" style="width: 100%; margin-top: 20px; height: 50px" size="mini" @click="onConfirm">确认</el-button>
  </el-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import KdxImage from "@/components/image/image.vue";
import {shoutRealPictureUpload} from "@/api/temu/shout_real_picture";

export default {
  name: 'TemuDlgBatchUpload',
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
      images: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      this.images = []
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.images.push(res.data.url)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    async onConfirm() {
      if (this.images.length < 0) {
        this.$message.error("粘贴在商品实物上的标签 未上传图片")
        return
      }
      if (this.images.length > 6) {
        this.$message.error("粘贴在商品实物上的标签 最多6张")
        return
      }

      let resp = await shoutRealPictureUpload({ids: this.ids, images: this.images})
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.$emit('update')
    }
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