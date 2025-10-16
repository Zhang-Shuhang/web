<template>
  <el-drawer :visible.sync="$attrs.visible" @opened="onOpened" size="90%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        创建模板
      </div>
      <div style="display: block; float: right; height: 24px; line-height: 22px" v-if="form.dxm_ref_id">
        <el-button size="mini" type="primary" @click="reSelectProduct">
          重选产品做为模板
        </el-button>
      </div>
    </div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
        <template v-if="!form.dxm_ref_id">
          <TiktokProductDxmSearch :default_account_id="form.default_account_id"
                                  @select="handleSelect"></TiktokProductDxmSearch>
        </template>
        <template v-else>
          <TiktokProductTemplateBase v-model="form"></TiktokProductTemplateBase>
          <TiktokProductSkuList v-model="form"></TiktokProductSkuList>

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>详情图</span>

              <div style="float: right">
                <el-row :gutter="5">
                  <el-col :span="12">
                    <el-select v-model="selectProduct" size="mini" placeholder="请选择产品" filterable clearable
                               style="width: 100%" @change="notifySelectProductChanged" remote
                               :remote-method="searchProductList" value-key="id">
                      <el-option :key="index" :label="p.name" :value="p" v-for="(p, index) in showProductList">
                        <div style="width: 300px">
                          <div style="float: left">{{ p.name }}</div>
                          <div style="float: right"
                               v-if="p.user_images_list && p.user_images_list.length > 0 && p.user_images_list[0].images.length > 0">
                            <KdxImage :src="p.user_images_list[0].images[0]" width="100%" height="28px"></KdxImage>
                          </div>
                        </div>
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="addImage">图片</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div>
              <el-table :data="form.details" stripe style="width: 100%" border
                        :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
                <el-table-column align="left" label="文字/图片" width="200px">
                  <template slot-scope="{row}">
                    <el-tag size="mini" type="primary">{{ row.is_text ? "文字" : `图片:${row.image_name}` }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="内容">
                  <template slot-scope="{row}">
                    <div v-if="row.is_text">
                      <el-row :gutter="5">
                        <el-col :span="18">
                          <el-input type="textarea" :rows="6" v-model="row.text" placeholder="请输入文本内容"
                                    clearable></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label-width="80" label="文字颜色" style="margin-bottom: 0px">
                            <el-color-picker v-model="row.font_color"></el-color-picker>
                          </el-form-item>
                          <el-form-item label-width="80" label="背景颜色" style="margin-bottom: 0px">
                            <el-color-picker v-model="row.background_color"></el-color-picker>
                          </el-form-item>
                          <el-form-item label-width="80" label="字体大小" style="margin-bottom: 0px">
                            <el-input-number v-model="row.font_size" :min="12" :max="100" :precision="0">
                            </el-input-number>
                          </el-form-item>
                          <el-form-item label-width="80" label="对齐方式" style="margin-bottom: 0px">
                            <el-radio-group v-model="row.align">
                              <el-radio-button label="left">靠左</el-radio-button>
                              <el-radio-button label="center">居中</el-radio-button>
                              <el-radio-button label="right">靠右</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-else>
                      <el-row :gutter="5">
                        <el-col :span="18">
                          <KdxImage :src="row.image" width="200px" height="100%" v-if="row.image"></KdxImage>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label-width="80" label="选择图片">
                            <el-select v-model="row.image_name" size="mini" placeholder="请选择详情图" filterable
                                       style="width: 100%"
                                       @change="notifyDetailChanged(row)">
                              <el-option :key="index" :label="p.name" :value="p.name"
                                         v-for="(p, index) in form.detail_options">
                                <div style="width: 300px">
                                  <div style="float: left">{{ p.name }}</div>
                                  <div style="float: right">
                                    <KdxImage :src="p.image" width="100%" height="28px"></KdxImage>
                                  </div>
                                </div>
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="操作" width="200px">
                  <template slot-scope="{row}">
                    <el-row :gutter="5">
                      <el-col :span="8">
                        <el-button size="mini" type="danger" style="width: 100%" @click="deleteDetail(row)">删除
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="primary" style="width: 100%" @click="moveDetail(row, -1)">上移
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="primary" style="width: 100%" @click="moveDetail(row, 1)">下移
                        </el-button>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>

          <el-button type="primary" size="mini" @click="create" style="width: 100%; height: 50px; margin-top: 10px">
            {{ edit ? "更新" : "创建" }}
          </el-button>
        </template>
      </el-form>
    </div>

  </el-drawer>
</template>

<script>
import {
  simpleProductSaveTemplate,
  simpleProductTemplate,
} from "@/api/tiktok/simple_product";
import KdxImage from "@/components/image/image.vue";
import {productListByPage} from "@/api/product/product";
import TemuProductProperties from "@/view/temu/components/product_properties.vue";
import TiktokProductTemplateBase from "@/view/tiktok/components/product_template_base.vue";
import TemuProductSpecProp from "@/view/temu/components/product_spec_prop.vue";
import TemuProductSize from "@/view/temu/components/product_size.vue";
import TiktokProductDxmSearch from "@/view/tiktok/components/tiktok_product_dxm_search.vue";
import TiktokProductSkuList from "@/view/tiktok/components/product_sku_list.vue";

export default {
  name: 'TiktokDlgCreateTemplate',
  components: {
    TiktokProductSkuList,
    TiktokProductDxmSearch,
    TemuProductSize,
    TemuProductSpecProp,
    TiktokProductTemplateBase,
    TemuProductProperties,
    KdxImage,
  },
  mixins: [],
  props: {
    edit: {
      type: Object,
    },
    copy: {
      type: Object,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      form: {
        name: "",
        category: "",
        default_account_id: undefined,
        name_prefixes: [],
        dxm_ref_id: undefined,
        dxm_data: undefined,
        prefix: undefined,

        sku_list: [],

        details: [], // 详情
        detail_options: [],
      },
      showProductList: [],
      selectProduct: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.form.name = ""
      this.form.cat_id = 0
      this.form.default_account_id = undefined
      this.form.name_prefixes = []
      this.form.prefix = undefined
      this.form.dxm_ref_id = undefined
      this.form.dxm_data = undefined
      this.form.sku_list = []
      this.form.details = []

      // 如果是编辑
      if (this.edit) {
        this.form.name = this.edit.name
        this.form.default_account_id = this.edit.default_account_id
        this.form.name_prefixes = this.edit.name_prefixes
        this.form.dxm_ref_id = this.edit.dxm_ref_id
        await this.initByParams(this.edit.id)
      } else if (this.copy) {
        this.form.name = this.copy.name
        this.form.default_account_id = this.copy.default_account_id
        this.form.name_prefixes = this.copy.name_prefixes
        this.form.dxm_ref_id = this.copy.dxm_ref_id
        await this.initByParams(this.copy.id)
      }
    },
    async initByParams(id) {
      let resp = await simpleProductTemplate({id: id})
      if (resp.code) {
        return
      }

      this.form.dxm_data = JSON.parse(resp.data.dxm_json)
      this.form.sku_list = resp.data.params.sku_list || []
      this.form.details = resp.data.params.details || []

      this.createSkuSpecList()
    },
    reSelectProduct() {
      this.form.dxm_ref_id = undefined
    },
    handleSelect(event) {
      this.form.default_account_id = event.account_id
      this.form.dxm_ref_id = event.id
      this.form.dxm_data = event.data

      // 创建sku list
      this.createSkuSpecList()
    },
    createSkuSpecList() {
      // 创建 Spec Values TODO

      let option1Map = new Map()
      let l1 = []
      if (this.form.dxm_data.option1) {
        for (const v of this.form.dxm_data.variationList) {
          if (v.option1 && l1.indexOf(v.option1) < 0) {
            l1.push(v.option1)
            option1Map.set(v.option1, v.option1Id)
          }
        }
      }
      if (l1.length <= 0) {
        l1.push("")
      }
      let option2Map = new Map()
      let l2 = []
      if (this.form.dxm_data.option2) {
        for (const v of this.form.dxm_data.variationList) {
          if (v.option2 && l2.indexOf(v.option2) < 0) {
            l2.push(v.option2)
            option2Map.set(v.option2, v.option2Id)
          }
        }
      }
      if (l2.length <= 0) {
        l2.push("")
      }

      for (const v1 of l1) {
        for (const v2 of l2) {
          // 操作
          let p = this.getSkuSpec(v1, v2)
          if (p) {
            continue
          }

          // 创建一个
          this.form.sku_list.push(
              {
                appendSku: "",
                prefixSku: "",
                imageName: "",
                option1Id: option1Map.get(v1),
                spec1Name: v1,
                option2Id: option2Map.get(v2),
                spec2Name: v2,
                len: undefined,
                width: undefined,
                height: undefined,
                weight: undefined,
                price: undefined,
                stock: undefined,
              }
          )
        }

        for (let i = this.form.sku_list.length - 1; i >= 0; i--) {
          let s = this.form.sku_list[i]
          if (l1.indexOf(s.spec1Name) >= 0 && l2.indexOf(s.spec2Name) >= 0) {
            continue
          }

          // 删除
          this.form.sku_list.splice(i, 1)
        }
      }
    },
    getSkuSpec(v1, v2) {
      for (const s of this.form.sku_list) {
        if (s.spec1Name === v1 && s.spec2Name === v2) {
          return s
        }
      }
      return undefined
    },
    async create() {
      if (!this.form.name) {
        this.$message.error("请输入模板名字")
        return
      }

      if (!this.form.default_account_id) {
        this.$message.error("请选择账号")
        return
      }

      let skuList = []
      let skus = []
      for (const s of this.form.sku_list) {
        let d = {
          len: s.len,
          width: s.width,
          height: s.height,
          weight: s.weight,
          stock: s.stock,
          appendSku: s.appendSku,
          prefixSku: s.prefixSku,
          imageName: s.imageName,
          price: s.price,
          option1Id: s.option1Id,
          spec1Name: s.spec1Name,
          option2Id: s.option2Id,
          spec2Name: s.spec2Name,
        }
        if (skus.indexOf(s.prefixSku+s.appendSku) >= 0) {
          this.$message.error("存在相同的Sku: " + s.prefixSku + " " + s.appendSku)
          return
        }
        skus.push(s.prefixSku+s.appendSku)
        skuList.push(d)
      }

      for (const detail of this.form.details) {
        if (!detail.image_name) {
          this.$message.error("图片详情，图片未选择")
          return
        }
      }

      let data = {}
      if (this.edit) {
        data.id = this.edit.id
      }
      data.name = this.form.name
      data.params = {}
      data.params.sku_list = skuList
      data.params.details = this.form.details
      data.default_account_id = this.form.default_account_id
      data.name_prefixes = this.form.name_prefixes
      data.dxm_ref_id = this.form.dxm_ref_id
      data.dxm_json = JSON.stringify(this.form.dxm_data)

      let resp = await simpleProductSaveTemplate(data)
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    async notifySelectProductChanged() {
      if (!this.selectProduct) {
        return
      }

      if (!this.selectProduct.user_images_list || this.selectProduct.user_images_list.length <= 0) {
        return
      }

      let userImages = this.selectProduct.user_images_list[0]
      let options = []
      let list = []
      userImages.detail_images.forEach((item, index) => {
        let option = {
          name: userImages.detail_image_names[index],
          image: item,
        }
        options.push(option)
        list.push({
          is_text: false,
          image_name: option.name,
          image: option.image,
        })
      })

      this.form.detail_options = options
      this.form.details = list
    },
    addImage() {
      this.form.details.push({
        image_name: "",
        image: "",
      })
    },
    notifyDetailChanged(row) {
      let op = this.form.detail_options.find((item) => {
        return item.name === row.image_name
      })
      if (op) {
        row.image = op.image
      }
    },
    async searchProductList(query) {
      let resp = await productListByPage({name: query, page_size: 100})
      if (resp.code) {
        return
      }
      this.showProductList = resp.data.list.filter((item) => {
        return item.user_images_list && item.user_images_list.length > 0 && item.user_images_list[0].detail_images && item.user_images_list[0].detail_images.length > 0
      })
    },
    deleteDetail(row) {
      this.form.details = this.form.details.filter((item) => {
        return item !== row
      })
    },
    moveDetail(row, change) {
      let oldIndex = this.form.details.findIndex((item) => {
        return item === row
      })
      if (oldIndex < 0) {
        return
      }

      let newIndex = oldIndex + change
      if (newIndex < 0) {
        return
      }
      if (newIndex >= this.form.details.length) {
        return
      }

      let old = this.form.details[newIndex]
      this.$set(this.form.details, newIndex, row)
      this.$set(this.form.details, oldIndex, old)
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
::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 5px !important;
}

::v-deep .el-card__body, .el-main {
  padding: 5px !important;
}

::v-deep .el-select-dropdown__item {
  width: 100% !important;
  height: 100% !important;
}
</style>