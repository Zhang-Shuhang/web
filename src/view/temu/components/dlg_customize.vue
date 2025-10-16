<template>
  <el-dialog :visible.sync="$attrs.visible" title="填写定制参数" @opened="onOpened" width="60%"
               :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form size="mini" label-width="120px" label-position="right">
      <el-form-item label="定制图片">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-upload :action="`/temu/account/upload_image?id=${account_id}`" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".png,.jpg" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
              <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
            </el-upload>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="primary" style="width: 100%" @click="openDlgImageSelector">选择图片</el-button>
          </el-col>
        </el-row>

        <KdxImage :src="preview_image" v-if="preview_image" width="500px" height="500px" style="margin-top: 5px"></KdxImage>
      </el-form-item>
      <el-form-item label="文字数量限制">
        <el-input-number size="mini" v-model="max_word_limit" placeholder="请输入限制字数" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="最低库存限制">
        <el-input-number size="mini" v-model="min_stock" placeholder="请输入最低库存限制" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="7日系数">
        <el-input-number size="mini" v-model="seven_coef" placeholder="请输入7日系数" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
      </el-form-item>
    </el-form>

    <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="onSetImage">设置</el-button>

    <TemuDlgImageSelector :sku="imageSelector.sku_code ? imageSelector.sku_code : sku_ext_code" :update="imageSelector.update" :visible="imageSelector.visible" @close="imageSelector.visible=false"></TemuDlgImageSelector>
  </el-dialog>
</template>


<script>
import TemuDlgImageSelector from "@/view/temu/components/dlg_image_selector.vue";
import {mapGetters} from "vuex";
import KdxImage from "@/components/image/image.vue";
import {saleCustomizeEdit} from "@/api/temu/sale";

export default {
  name: 'TemuDlgCustomize',
  components: {KdxImage, TemuDlgImageSelector},
  mixins: [],
  props: {
    account_id: {
      type: Number,
    },
    id: {
      type: Number,
    },
    sku_ext_code: {
      type: String,
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  data() {
    return {
      max_word_limit: undefined,
      preview_image: undefined,
      min_stock: undefined,
      seven_coef: undefined,

      imageSelector: {
        update: undefined,
        sku_code: undefined,
        visible: false
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.max_word_limit = undefined
      this.preview_image = undefined
    },
    openDlgImageSelector() {
      this.imageSelector.sku_code = this.sku_ext_code
      this.imageSelector.update = (url) => {
        this.preview_image = url
      }
      this.imageSelector.visible = true
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.preview_image = res.data.url
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    async onSetImage() {
      let resp = await saleCustomizeEdit({id: this.id, preview_image: this.preview_image, max_word_limit: this.max_word_limit, min_stock: this.min_stock, seven_coef: this.seven_coef})
      if (resp.code) {
        return
      }
      this.$message("修改成功")
      this.$emit('close', false)
    },
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>