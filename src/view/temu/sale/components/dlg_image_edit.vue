<template>
  <el-drawer :visible.sync="$attrs.visible" title="改图" @opened="onOpened" size="70%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div style="margin-bottom: 10px">
      <el-input v-model="search_content" placeholder="请输入Spu/Skc/Sku Ids/货号，空格分隔" style="width: 100%" clearable @keyup.enter.native="search">
        <el-select v-model="search_type" slot="prepend" style="width: 180px" placeholder="请选择">
          <el-option label="Spu/Skc/Sku Ids" value=""></el-option>
          <el-option label="货号" value="1"></el-option>
        </el-select>
      </el-input>
    </div>
    <el-tabs size="mini" v-model="activeName" type="border-card" :stretch="true" v-if="search_list.length > 1" closable @tab-remove="removeTab">
      <el-tab-pane :label="`产品: ${item}`" :name="item" v-for="item in search_list" :key="item"></el-tab-pane>
    </el-tabs>
    <div v-if="for_image" style="margin-top: 20px">
      <el-form :rules="formRules" ref="elForm" :model="form" size="mini" label-width="100px" label-position="left">
        <div style="margin-bottom: 20px">
          <div>
            <draggable v-model="form.images" class="el-upload-list el-upload-list--picture-card">
              <div style="display: inline-block; margin-left: 5px; margin-top: 5px; text-align: center" v-for="(s, index) in form.images" :key="index">
                <div>
                  <KdxImage :src="s.image" width="100px" height="100px"></KdxImage>
                </div>
                <div>
                  <el-switch v-model="s.selected"></el-switch>
                </div>
              </div>
            </draggable>
            <div style="float: right; display: block; margin-top: 10px">
              <el-upload :action="`/temu/account/upload_image?id=${account_id}`" :headers="{'x-token':token}" :show-file-list="false" :before-upload="beforeUpload"
                         accept=".png,.jpg" :on-success="handleSuccess2" :on-error="handleError" style="width: 100px; display: inline-block">
                <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
              </el-upload>

              <el-button size="mini" type="primary" style="width: 100px; margin-left: 10px" @click="openMultiDlgImageSelector">选择图片</el-button>
              <el-button size="mini" type="primary" style="width: 100px; margin-left: 10px" @click="clearImages">清空图片</el-button>
            </div>
          </div>
        </div>

        <el-table class="table-body" ref="multipleTable" :data="form.sku_list" border size="mini" max-height="500px" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
          <el-table-column label="货号" prop="ext_code" align="center">
          </el-table-column>
          <el-table-column label="单价" prop="price" align="center">
          </el-table-column>
          <el-table-column label="图片" prop="image" align="center">
            <div slot-scope="{row}">
              <KdxImage :src="row.image" width="60px" height="60px" v-if="row.image"></KdxImage>
            </div>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <div slot-scope="{row}">
              <el-upload :action="`/temu/account/upload_image?id=${account_id}`" :headers="{'x-token':token}" :show-file-list="false" :before-upload="beforeUpload"
                         accept=".png,.jpg" :on-success="(res) => {handleSuccess(row, res)}" :on-error="handleError" :style="{width: '100%'}">
                <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
              </el-upload>
              <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" @click="openSingleDlgImageSelector(row)">选择图片</el-button>
            </div>
          </el-table-column>
        </el-table>

        <div>
          <el-button size="medium" type="warning" style="width: 100%; height: 50px; margin-top: 20px" @click="submit">提交</el-button>
        </div>
      </el-form>
    </div>

    <TemuDlgImageSelector :sku="dlgMultiImageSelector.sku_code ? dlgMultiImageSelector.sku_code : sku_ext_code" :multiple="true" :update="dlgMultiImageSelector.update" :visible="dlgMultiImageSelector.visible" @close="dlgMultiImageSelector.visible=false"></TemuDlgImageSelector>
    <TemuDlgImageSelector :sku="dlgSingleImageSelector.sku_code ? dlgSingleImageSelector.sku_code : sku_ext_code" :update="dlgSingleImageSelector.update" :visible="dlgSingleImageSelector.visible" @close="dlgSingleImageSelector.visible=false"></TemuDlgImageSelector>
  </el-drawer>
</template>


<script>
import {saleQueryForImage, saleImageEdit} from "@/api/temu/sale";
import KdxImage from "@/components/image/image.vue";
import draggable from "vuedraggable";
import {mapGetters} from "vuex";
import TemuDlgImageSelector from "@/view/temu/components/dlg_image_selector.vue";
import {itemSameSkuCode} from "@/api/temu/sale_item";

export default {
  name: 'TemuDlgImageEdit',
  components: {TemuDlgImageSelector, draggable, KdxImage},
  mixins: [],
  props: {
    content: {
      type: String,
      default: undefined,
    },
    sku_ext_code: {
      type: String,
      default: undefined,
    },
  },
  watch: {
    search_content() {
      this.search()
    },
    activeName: function () {
      this.changeTab()
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  data() {
    return {
      search_type: "",
      search_content: undefined,
      search_list: [],
      activeName: undefined,
      account_id: undefined,
      for_image: undefined,
      form: {
        images: [],
        sku_list: [],
      },
      formRules: {},

      dlgMultiImageSelector: {
        update: undefined,
        sku_code: undefined,
        visible: false
      },

      dlgSingleImageSelector: {
        update: undefined,
        sku_code: undefined,
        visible: false
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
      this.result = undefined
    },
    async onOpened() {
      this.search_type = ""
      this.search_content = this.content
      this.search_list = []
      this.activeName = ""
      this.account_id = undefined
      this.for_image = undefined
      this.search()
    },
    removeTab(tab) {
      let index = this.search_list.indexOf(tab)
      if (index < 0) {
        return
      }

      this.search_list = this.search_list.filter((item) => {
        return item !== tab
      })

      let l = this.search_list.length
      if (l <= 0) {
        this.handleBeforeClose()
        return
      }

      this.$message(`剩余: ${l} 个`)
      this.copy(this.search_list.join(" "))

      if (index < l) {
        this.activeName = this.search_list[index]
      } else {
        this.activeName = this.search_list[l-1]
      }
      this.changeTab()
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async changeTab() {
      if (!this.activeName) {
        this.for_image = undefined
        return
      }
      let resp = await saleQueryForImage({id: this.activeName})
      if (resp.code) {
        this.for_image = undefined
        return
      }

      this.account_id = resp.data.account_id
      let for_image = resp.data.result

      let form = {}
      form.product_id = for_image.productId
      form.images = []
      for_image.carouselImageUrls.forEach((image) => {
        form.images.push({image: image, selected: true})
      })

      form.sku_list = []
      for_image.productSkcList.forEach((skc) => {
        skc.productSkuList.forEach((sku) => {
          form.sku_list.push({
            skc_id: skc.productSkcId,
            sku_id: sku.productSkuId,
            ext_code: sku.extCode,
            price: (sku.supplierPrice/100).toFixed(2),
            image: sku.thumbUrl,
          })
        })
      })
      this.$set(this, "form", form)
      this.for_image = for_image
    },
    async search() {
      if (!this.search_content) {
        return
      }

      if (this.search_type === "1") {
        let resp = await itemSameSkuCode({id: this.search_content})
        if (resp.code) {
          return
        }

        this.search_list = resp.data.map((item) => {return String(item)})
      } else {
        this.search_list = this.search_content.split(" ").filter((item)=> {
          return item !== ""
        })
      }

      this.search_list = [...new Set(this.search_list)]
      if (this.search_list.indexOf(this.activeName) >= 0) {
        return
      }

      this.activeName = this.search_list[0]
      this.changeTab()
    },
    async submit() {
      let data = {}
      data.spu_id = this.form.product_id
      data.images = []
      this.form.images.forEach((item) => {
        if (item.selected) {
          data.images.push(item.image)
        }
      })
      data.sku_list = []
      for (const sku of this.form.sku_list) {
        data.sku_list.push({
          skc_id: sku.skc_id,
          sku_id: sku.sku_id,
          image: sku.image,
        })
      }
      let resp = await saleImageEdit(data)
      if (resp.code) {
        return
      }

      this.$message("更新成功")

      this.removeTab(this.activeName)
    },
    handleSuccess2(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.images.push({image: res.data.url, selected: true})
    },
    handleSuccess(row, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      row.image = res.data.url
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    openSingleDlgImageSelector(row) {
      this.dlgSingleImageSelector.sku_code = row.ext_code
      this.dlgSingleImageSelector.update = (url) => {
        row.image = url
      }
      this.dlgSingleImageSelector.visible = true
    },
    clearImages() {
      this.form.images = []
    },
    openMultiDlgImageSelector() {
      this.dlgMultiImageSelector.sku_code = this.form.sku_list.map((item) => {return item.ext_code}).join(" ")
      this.dlgMultiImageSelector.update = (urls) => {
        urls.reverse().forEach((url) => {
          this.form.images.push({image: url, selected: true})
        })
      }
      this.dlgMultiImageSelector.visible = true
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isLt2M) {
        this.$message.error('图片大小不能超过 5MB!');
      }

      return isLt2M
    }
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-drawer__body {
  padding: 10px;
}

::v-deep .el-tabs__content {
  display: none;
}
</style>