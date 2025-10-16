<template>
  <el-drawer :visible.sync="$attrs.visible" title="上架产品" @opened="onOpened" size="100%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <template slot="title">
      <div style="float: left">
        上架产品
      </div>
    </template>
    <el-tabs size="mini" v-model="active_sequence" type="border-card" :stretch="true" v-if="search_list.length > 1" closable @tab-remove="removeTab" @change="changeTab">
      <el-tab-pane :label="`产品: ${item.name}`" :name="`${item.sequence}`" v-for="item in search_list" :key="item.sequence"></el-tab-pane>
    </el-tabs>
    <el-form class="table-form" ref="elForm" size="mini" label-width="100px" label-position="right" style="margin-top: 10px">
      <el-form-item label="模板列表">
        <el-select v-model="template_ids" placeholder="模板" multiple filterable clearable style="width: 100%; margin-bottom: 10px" @change="changeTab">
          <el-option v-for="(item, index) in sorted_template_list" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="英文标题">
        <el-input type="textarea" placeholder="英文标题" v-model="title" clearable maxlength="250" show-word-limit :autosize="{ minRows: 3, maxRows: 100 }"></el-input>
      </el-form-item>
      <el-form-item label="英文标题记录" v-if="titles && titles.length > 0">
        <div v-for="(t, index) in titles" :key="index">
          <el-tag size="mini" type="primary" v-if="canCopyTitle" @click="copyText(t)">{{t}}</el-tag>
          <el-tag size="mini" type="primary" class="can_not_select" v-else>{{t}}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="产品" v-if="active">
        <el-table class="table-body" ref="multipleTable" :data="array" border size="mini" height="70vh" :header-cell-style="{'background-color': 'black', 'color': '#FFF'}" min-height="500px">
          <el-table-column label="名字" prop="name" align="center" width="120px">
          </el-table-column>
          <el-table-column label="账号" align="center" width="180px">
            <div slot-scope="{row}">
              <el-select v-model="row.account_id" placeholder="请选择账号" clearable filterable style="width: 100%">
                <el-option v-for="(item, index) in accounts" :key="index" :label="item.is_semi ? `${item.name}[半托管]` : item.name"
                           :value="item.id"></el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column label="图片" align="center" min-width="350px">
            <template slot="header">
              <div>图片</div>
              <el-row :gutter="5" style="margin-top: 5px">
                <el-col :span="11">
                  <el-input v-model.number="rand_count" placeholder="请输入图片数">
                    <el-button slot="append" type="primary" @click="randImageIndex('主图', rand_count)" style="width: 150px">随机主图</el-button>
                  </el-input>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" @click="variationUseMainImage" style="width: 100%">变体图用主图</el-button>
                </el-col>
                <el-col :span="11">
                  <el-input v-model.number="rand_scene_count" placeholder="请输入图片数">
                    <el-button slot="append" type="primary" @click="randImageIndex('场景', rand_scene_count)" style="width: 150px">随机场景图</el-button>
                  </el-input>
                </el-col>
              </el-row>
              <el-row :gutter="5" style="margin-top: 5px">
                <el-col :span="6">
                  <el-input v-model.number="contain_name" placeholder="请输入包含名字">
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="randImageByName(contain_name, true)" :disabled="!contain_name" style="width: 100%">选择包含{{ contain_name ? contain_name : "名字" }}的图片</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="randImageByName(contain_name, false)" :disabled="!contain_name" style="width: 100%">取消选择包含{{ contain_name ? contain_name : "名字" }}的图片</el-button>
                </el-col>
                <el-col :span="6">
                  <el-switch style="display: block" v-model="only_selected" active-text="仅显示选中" inactive-text="全显示"></el-switch>
                </el-col>
              </el-row>
              <el-row :gutter="5" style="margin-top: 5px">
                <el-col :span="6">
                  <el-button type="primary" @click="move('场景')" style="width: 100%">主图后移</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="move('主图')" style="width: 100%">主图前移</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="move('主图')" style="width: 100%">场景后移</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="move('场景')" style="width: 100%">场景前移</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="5" style="margin-top: 5px">
                <el-col :span="6">
                  <el-input v-model.number="moveImage.name" placeholder="请输入包含名字" style="width: 100%"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input-number v-model.number="moveImage.position" :min="1" :max="active.user_images.images.length" placeholder="请输入移动的位置" style="width: 100%"></el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="moveByImage" style="width: 100%">移动</el-button>
                </el-col>
                <el-col :span="6">
                  <el-button type="primary" @click="moveByImageToMainImageAfter" style="width: 100%">移动到主图后</el-button>
                </el-col>
              </el-row>
            </template>
            <div slot-scope="scope">
              <draggable v-model="scope.row.imageSelected" class="el-upload-list el-upload-list--picture-card" @end="onEnd(scope.row)">
                <template v-for="(s, index) in scope.row.imageSelected">
                  <div style="display: inline-block; margin-left: 5px; margin-top: 5px" :key="index" v-if="!only_selected || s.selected">
                    <el-tooltip placement="top" :content="s.name">
                      <div class="img-wrap">
                        <i class="close el-icon-close" @click="s.selected = false"></i>
                        <KdxImage :src="s.image" width="80px" height="80px"></KdxImage>
                      </div>
                    </el-tooltip>
                    <div>
                      <el-switch v-model="s.selected"></el-switch>
                    </div>
                    <template v-if="scope.$index+1 === array.length">
                      <hr>

                      <div style="margin-top: 15px">
                        <el-button size="mini" type="primary" @click="select(index, true)">全选本列</el-button>
                      </div>
                      <div style="margin-top: 5px">
                        <el-button size="mini" type="primary" @click="select(index, false)">反选本列</el-button>
                      </div>
                      <div style="margin-top: 5px">
                        <el-button size="mini" type="primary" @click="moveByIndex(index, index-1)" :disabled="index === 0">左移</el-button>
                      </div>
                      <div style="margin-top: 5px">
                        <el-button size="mini" type="primary" @click="moveByIndex(index, index+1)" :disabled="index === scope.row.imageSelected.length-1">右移</el-button>
                      </div>
                      <div style="margin-top: 5px">
                        <el-button size="mini" type="primary" @click="copy(index)">复制本列</el-button>
                      </div>
                    </template>
                  </div>
                </template>
              </draggable>
            </div>
          </el-table-column>
          <el-table-column label="变体" align="center" width="300px">
            <el-table-column label="货号" align="center">
              <div slot-scope="{row}">
                <div v-for="(variation, index) in row.variations" :key="index">
                  <el-input size="mini" v-model="variation.ext_code"></el-input>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="图片" align="center">
              <div slot-scope="{row}">
                <div v-for="(variation, index) in row.variations" :key="index">
                  <el-select v-model="variation.index" placeholder="请选择变体图" style="width: 100%">
                    <el-option style="height: 80px; width: 300px;"
                               v-for="item in row.imageSelected"
                               :key="item.index"
                               :label="item.name"
                               :value="item.index">
                      <span style="float: left">{{ item.name }}</span>
                      <KdxImage style="float: right; color: #8492a6; font-size: 13px" :src="item.image"></KdxImage>
                    </el-option>
                  </el-select>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="规格1" align="center">
              <div slot-scope="{row}">
                <div v-for="(variation, index) in row.variations" :key="index">
                  <el-input size="mini" v-model="variation.spec1_name" :disabled="true"></el-input>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="规格2" align="center">
              <div slot-scope="{row}">
                <div v-for="(variation, index) in row.variations" :key="index">
                  <el-input size="mini" v-model="variation.spec2_name" :disabled="true"></el-input>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="价格" align="center">
              <div slot-scope="{row}">
                <div v-for="(variation, index) in row.variations" :key="index">
                  <el-input-number size="mini" v-model="variation.price" :min="0" :step="1" :precision="2" :max="10000" style="width: 100%" placeholder="价格"></el-input-number>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <div slot-scope="{row}">
                <div v-for="(variation, index) in row.variations" :key="index">
                  <el-input-number size="mini" v-model="variation.stock" :min="0" :step="1" :precision="0" :max="10000" style="width: 100%" placeholder="价格"></el-input-number>
                </div>
              </div>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%; height: 50px; margin-top: 5px" size="medium" type="primary" @click="upload">上架</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import {
  simpleProductTemplateList,
  simpleProductTemplates,
  simpleProductUpload
} from "@/api/tiktok/simple_product";
import KdxImage from "@/components/image/image.vue";
import draggable from "vuedraggable";
import {mapGetters} from "vuex";

export default {
  name: 'TiktokDlgSimpleProductUpload',
  components: {KdxImage, draggable},
  mixins: [],
  props: {
    list: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("user", ["token", "canCopyTitle"]),
    active() {
      return this.search_list.find((item) => {return String(item.sequence) === this.active_sequence})
    },
    templates() {
      return this.template_list.filter((item) => {
        return this.template_ids.indexOf(item.id) >= 0
      })
    },
    sorted_template_list() {
      return this.template_list
    }
  },
  watch: {
    active() {
      this.changeTab()
    },
  },
  data() {
    return {
      title: "",
      titles: [],
      image_url: "",
      accounts: [],
      array: [],

      rand_type: "主图",
      rand_count: 1,
      rand_scene_count: 3,

      contain_name: "",
      only_selected: false,

      moveImage: {
        name: "尺寸",
        position: 2,
      },

      search_list: [],
      template_list: [],
      template_ids: [],

      active_sequence: "0",
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    randImageByName(name, contains) {
      this.array.forEach((row) => {
        for (const s of row.imageSelected) {
          s.selected = s.name.indexOf(name) >= 0 === contains
        }
      })
    },
    randImageIndex(rand_type, rand_count) {
      this.array.forEach((row) => {
        // 随机主图
        let indexes = []

        for (let i = 0; i < row.imageSelected.length; i++) {
          let s = row.imageSelected[i]
          if (s.name.indexOf(rand_type) >= 0) {
            indexes.push(i)
          }
        }

        let selectIndexes = []
        if (indexes.length <= rand_count) {
          selectIndexes = indexes
        } else {
          let allIndexes = indexes.filter(()=>{return true})
          for (let j = 0; j < rand_count; j++) {
            let randIndex = Math.floor(Math.random() * allIndexes.length)
            let index = allIndexes[randIndex]
            selectIndexes.push(index)
            allIndexes.splice(randIndex, 1)
          }
        }

        for (const index of indexes) {
          row.imageSelected[index].selected = selectIndexes.indexOf(index) >= 0
        }
      })
    },
    async upload() {
      let uploadArray = []

      for (const item of this.array) {
        if (!item.account_id) {
          continue
        }

        let images = []
        for (const image of item.imageSelected) {
          if (image.selected) {
            images.push(image.image)
          }
        }
        let info = {
          id: item.id,
          name: item.name,
          images: images,
          account_id: item.account_id,
          variations: [],
          site_id: item.site_id,
          freight_template_id: item.freight_template_id,
          ship_days: item.ship_days,
          stock: item.stock,
          warehouse_id: item.warehouse_id,
        }
        item.variations.forEach((v) => {
          let s = item.imageSelected.find((item) => {
            return item.index === v.index
          })
          info.variations.push({option1_id: v.option1_id, spec1_name: v.spec1_name, option2_id: v.option2_id, spec2_name: v.spec2_name, ext_code: v.ext_code, image: s.image, price: v.price, stock: v.stock, len: v.len, width: v.width, height: v.height, weight: v.weight})
        })
        uploadArray.push(info)
      }
      if (uploadArray.length <= 0) {
        this.$message("上传列表为空，无法上传")
        return
      }
      let resp = await simpleProductUpload({
        id: this.active.id,
        name: this.active.name,
        title: this.title,
        is_auto_upload: this.is_auto_upload,
        carouse_video_id: this.carouse_video ? this.carouse_video.id : 0,
        detail_video_id: this.detail_video ? this.detail_video.id : 0,
        list: uploadArray,
      })
      if (resp.code) {
        return
      }

      this.$message("上传成功")

      this.removeTab(this.active_sequence)
    },
    onEnd() {
      //here  emit dragList TODO
    },
    async syncTemplateList() {
      let resp = await simpleProductTemplateList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.template_list = resp.data.template_list
      this.accounts = resp.data.account_list
    },
    account(id) {
      return this.accounts.find((item) => {return item.id === id})
    },
    async onOpened() {
      this.search_list = []
      for (let i = 0; i < this.list.length; i++) {
        let v = this.list[i]
        v.sequence = i
        this.search_list.push(v)
      }
      this.search_list = this.list.map((item) => {
        return item
      })

      this.title = ""
      this.is_auto_upload = true

      this.array = []

      await this.syncTemplateList()

      if (this.active && this.active.link) {
        window.open(this.active.link, "_BLANK")
      }

      if (this.search_list.length) {
        this.active_sequence = String(this.search_list[0].sequence)

        let ids = []
        for (const d of this.template_list) {
          if (d.name_prefixes) {
            let exist = false
            for (const namePrefix of d.name_prefixes) {
              if (this.active.name.toLowerCase().startsWith(namePrefix.toLowerCase())) {
                exist = true
                break
              }
            }
            if (!exist) {
              continue
            }
            ids.push(d.id)
          }
        }
        this.$set(this, "template_ids", ids)
        this.changeTab()
      }
    },
    moveByImage() {
      this.array.forEach((v) => {
        for (const s of v.imageSelected) {
          if (s.name.indexOf(this.moveImage.name) < 0) {
            continue
          }

          this.moveByIndex(s.index, this.moveImage.position-1)
          break
        }
      })
    },
    moveByImageToMainImageAfter() {
      this.array.forEach((v) => {
        for (const s of v.imageSelected) {
          if (s.name.indexOf(this.moveImage.name) < 0) {
            continue
          }

          this.moveByIndex(s.index, v.imageSelected.findLastIndex(item => item.name.includes("主图")) + 1)
          break
        }
      })
    },
    move(firstName) {
      for (const v of this.array) {
        let indexes = []
        for (let i = 0; i < v.imageSelected.length; i++) {
          let item = v.imageSelected[i]
          if (item.name.indexOf(firstName) >= 0) {
            indexes.push(i)
          }
        }
        for (let i = 0; i < indexes.length; i++) {
          let i1 = indexes[i]
          this.moveByIndex(i, i1)
        }
      }
    },
    variationUseMainImage() {
      this.array.forEach((item) => {
        for (let i = 0; i < item.imageSelected.length; i++) {
          let d = item.imageSelected[i]
          if (d.selected) {
            item.variations.forEach((v) => {
              v.index = d.index
            })
            break
          }
        }
      })
    },
    select(index, select) {
      this.array.forEach((item) => {
        item.imageSelected[index].selected = select
      })
    },
    moveByIndex(i1, i2) {
      this.array.forEach((v) => {
        let v2 = v.imageSelected[i2]
        let v1 = v.imageSelected[i1]
        v1.index = i2
        v2.index = i1
        this.$set(v.imageSelected, i2, v1)
        this.$set(v.imageSelected, i1, v2)
      })
    },
    copy(index) {
      this.array.forEach((v) => {
        let d = v.imageSelected[index]
        let newData = {image: d.image, selected: d.selected, name: d.name, index: d.index}
        this.$set(v.imageSelected, v.imageSelected.length, newData)
      })
    },
    removeTab(tab) {
      let index = this.search_list.findIndex((item) => {
        return String(item.sequence) === tab
      })
      if (index < 0) {
        return
      }

      this.search_list = this.search_list.filter((item) => {
        return String(item.sequence) !== tab
      })

      let l = this.search_list.length
      if (l <= 0) {
        this.handleBeforeClose()
        return
      }

      this.$message(`剩余: ${l} 个`)

      if (index < l) {
        this.active_sequence = String(this.search_list[index].sequence)
      } else {
        this.active_sequence = String(this.search_list[l-1].sequence)
      }
      this.changeTab()
    },
    copyText(text) {
      this.$copyText(text).then( () => {
        this.$message('复制成功')
      }, function () {
        this.$message.error('复制失败')
      })
    },
    async syncTemplateParams() {
      if(this.template_ids.length <= 0) {
        return
      }

      let isNeed = false
      for (const template of this.templates) {
        if (!template.params) {
          isNeed = true
          break
        }
      }

      if (!isNeed) {
        return
      }

      let resp = await simpleProductTemplates({ids: this.template_ids})
      if (resp.code) {
        return
      }

      this.templates.forEach((template) => {
        let info = resp.data.find((item)=>{ return item.id === template.id })
        if (info.params) {
          this.$set(template, "params", info.params)
        }
      })
    },
    async changeTab() {
      if (!this.active) {
        this.array = []
        return
      }

      let lastTitle = this.title
      this.title = ""
      if (this.active) {
        this.titles = this.active.titles || []

        if (this.active.title && this.titles.indexOf(this.active.title) < 0) {
          this.titles.push(this.active.title)
        }
      } else {
        this.titles = []
      }

      this.image_url = this.active.user_images.images[0]

      await this.syncTemplateParams()

      this.$set(this, "array", [])
      for (let i = 0; i < this.templates.length; i++) {
        let d = this.templates[i]

        let cfg = d.params

        let data = {...d}
        data.imageSelected = []
        for (let j = 0; j < this.active.user_images.images.length; j++) {
          if (this.active.user_images.names[j].indexOf(".png") >= 0) {
            continue
          }

          let selected = true
          if (this.active.name.startsWith("HB-")) {
            if (this.active.user_images.names[j].indexOf("目标") >= 0) {
              continue
            }
            if (this.active.user_images.names[j].indexOf("变体图") >= 0) {
              continue
            }
          } else if (this.active.name.startsWith("MKB-")) {
            if (this.active.user_images.names[j].indexOf("04-细节图01") >= 0) {
              continue
            }
          }

          if (this.active.name.startsWith("MZPT-") || this.active.name.startsWith("MZPT(3)-")) {
            if (this.active.user_images.names[j].indexOf("04-定制图") >= 0) {
              selected = false
            }
          } else if (this.active.name.startsWith("MPDZ-")) {
            if (this.active.user_images.names[j].indexOf("05-定制流程图") >= 0) {
              selected = false
            }
          } else if (this.active.name.startsWith("MPDZJG-")) {
            if (this.active.user_images.names[j].indexOf("05-定制流程图") >= 0) {
              selected = false
            }
          }
          data.imageSelected.push({image: this.active.user_images.images[j], selected: selected, name: this.active.user_images.names[j], index: j})
        }
        if (d.default_account_id) {
          data.account_id = d.default_account_id
        }

        data.variations = []
        for (const skuReq of cfg.sku_list) {
          let index = 0

          let extCode = this.active.name
          if (skuReq.appendSku) {
            extCode += "_" + skuReq.appendSku
          }
          if (skuReq.prefixSku) {
            extCode = skuReq.prefixSku + extCode
          }
          for (let j = 0; j < this.active.user_images.images.length; j++) {
            if (skuReq.imageName === this.active.user_images.names[j]) {
              index = j
              break;
            }
          }
          data.variations.push({ext_code: extCode, option1_id: skuReq.option1Id, spec1_name: skuReq.spec1Name, option2_id: skuReq.option2Id, spec2_name: skuReq.spec2Name, index: index, price: skuReq.price, stock: skuReq.stock, len: skuReq.len, width: skuReq.width, height: skuReq.height, weight: skuReq.weight})
        }
        this.array.push(data)
      }
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
  .img-wrap {
    position: relative;
  }
  .img-wrap .close {
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 100;
    color: white;
    font-size: 16px;
    background-color: red;
    border-radius: 10px;
    opacity: 0.8;
  }

  ::v-deep .el-input-group__append .el-button {
    border-color: #409EFF;
    background-color: #409EFF;
    color: white;
  }

  ::v-deep .el-tabs__content {
    display: none;
  }

  .can_not_select {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
</style>