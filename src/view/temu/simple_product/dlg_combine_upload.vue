<template>
  <el-drawer :visible.sync="$attrs.visible" title="上架产品" @opened="onOpened" size="100%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <template slot="title">
      <div style="float: left">
        上架组合产品
      </div>
      <div style="float: right">
        <el-button size="mini" type="primary" @click="openCreateTemplate" style="margin-right: 20px">创建模板</el-button>
      </div>
    </template>
    <el-form class="table-form" ref="elForm" size="mini" label-width="100px" label-position="right" style="margin-top: 10px">
      <el-form-item label="模板列表">
        <el-select v-model="template_id" placeholder="模板" filterable clearable style="width: 100%; margin-bottom: 10px" @change="changeTab">
          <el-option v-for="(item, index) in template_list" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="英文标题">
        <el-input type="textarea" placeholder="英文标题" v-model="title" clearable maxlength="250" show-word-limit :autosize="{ minRows: 3, maxRows: 100 }"></el-input>
      </el-form-item>
      <el-form-item label="英文标题记录">
        <div v-for="(t, index) in titles" :key="index">
          <el-tag size="mini" type="primary" v-if="canCopyTitle" @click="copyText(t)">{{t}}</el-tag>
          <el-tag size="mini" type="primary" class="can_not_select" v-else>{{t}}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="规格1前缀">
        <el-input v-model="spec1_prefix" style="width: 100%" clearable placeholder="sku前缀，必填" @change="onSpec1PrefixChanged"></el-input>
      </el-form-item>
      <el-form-item label="是否自动上传">
        <el-switch v-model="is_auto_upload"></el-switch>
      </el-form-item>
      <el-form-item label="产品">
        <el-table class="table-body" ref="multipleTable" :data="array" border size="mini" height="70vh" :header-cell-style="{'background-color': 'black', 'color': '#FFF'}" min-height="500px">
          <el-table-column label="名字" prop="name" align="center" width="120px">
          </el-table-column>
          <el-table-column label="账号" align="center" width="180px">
            <div slot-scope="{row}">
              <el-select v-model="row.account_id" placeholder="请选择账号" clearable filterable style="width: 100%" @change="updateSemiInfo(row)">
                <el-option v-for="(item, index) in accounts" :key="index" :label="item.is_semi ? `${item.name}[半托管]` : item.name"
                           :value="item.id"></el-option>
              </el-select>
            </div>
          </el-table-column>
          <el-table-column label="半托管" align="center" width="150px">
            <div slot-scope="{row}">
              <div v-if="account(row.account_id) && account(row.account_id).is_semi">
                <el-select v-model="row.site_id" placeholder="请选择站点" filterable clearable :style="{width: '100%'}">
                  <template v-for="(item, index) in siteList">
                    <el-option :key="index" :label="item.name" :value="item.id" v-if="item.match_semi_managed"></el-option>
                  </template>
                </el-select>
                <el-select v-model="row.freight_template_id" placeholder="请选择运费模板" filterable clearable :style="{width: '100%'}">
                  <template v-for="(item, index) in freightTemplateList">
                    <el-option :key="index" :label="item.name" :value="item.id" v-if="item.account_id === row.account_id"></el-option>
                  </template>
                </el-select>
                <el-select v-model="row.warehouse_id" placeholder="请选择仓库" filterable clearable :style="{width: '100%'}">
                  <template v-for="(item, index) in warehouseList">
                    <el-option :key="index" :label="item.name" :value="item.id" v-if="item.account_id === row.account_id"></el-option>
                  </template>
                </el-select>
                <el-select v-model="row.ship_days" placeholder="请选择发货天数" filterable clearable :style="{width: '100%'}">
                  <el-option label="2天(定制为3天)" :value="2"></el-option>
                  <el-option label="9天" :value="9"></el-option>
                </el-select>
                <el-input-number size="mini" v-model="row.stock" :min="0" :step="1" :precision="0" :max="10000" style="width: 100%" placeholder="初始库存"></el-input-number>
              </div>
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
                <el-col :span="8">
                  <el-input v-model.number="contain_name" placeholder="请输入包含名字">
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" @click="randImageByName(contain_name)" :disabled="!contain_name" style="width: 100%">选择包含{{ contain_name ? contain_name : "名字" }}的图片</el-button>
                </el-col>
                <el-col :span="8">
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
                    <el-option style="height: 80px; width: 400px;"
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
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button style="width: 100%; height: 50px; margin-top: 5px" size="medium" type="primary" @click="upload">上架</el-button>
      </el-form-item>

      <TemuDlgCreateTemplate :visible="dlgCreateTemplate.visible" @close="dlgCreateTemplate.visible=false" @suc="syncTemplateList"></TemuDlgCreateTemplate>
    </el-form>
  </el-drawer>
</template>

<script>
import {
  simpleProductCombineUpload,
  simpleProductTemplate,
  simpleProductTemplateList,
} from "@/api/temu/simple_product";
import KdxImage from "@/components/image/image.vue";
import draggable from "vuedraggable";
import TemuDlgCreateTemplate from "@/view/temu/components/dlg_create_template.vue";
import {siteList} from "@/api/temu/site";
import {semiFreightTemplateList, semiWarehouseList} from "@/api/temu/semi";
import {mapGetters} from "vuex";

export default {
  name: 'TemuDlgSimpleProductCombineUpload',
  components: {TemuDlgCreateTemplate, KdxImage, draggable},
  mixins: [],
  props: {
    list: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("user", ["token", "canCopyTitle"]),
    template() {
      return this.template_list.find((item) => {
        return this.template_id === item.id
      })
    },
  },
  data() {
    return {
      title: "",
      titles: [],
      is_auto_upload: true,
      accounts: [],
      siteList: [],
      freightTemplateList: [],
      warehouseList: [],
      array: [],

      rand_type: "主图",
      rand_count: 1,
      rand_scene_count: 3,

      contain_name: "",
      only_selected: false,

      search_list: [],
      template_list: [],
      template_id: [],

      spec1_prefix: "Style",

      dlgCreateTemplate: {
        visible: false,
      },

      letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    }
  },
  methods: {
    openCreateTemplate() {
      this.dlgCreateTemplate.visible = true
    },
    handleBeforeClose() {
      this.$emit('close', false)
    },
    randImageByName(name) {
      this.array.forEach((row) => {
        for (const s of row.imageSelected) {
          s.selected = s.name.indexOf(name) >= 0
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
      if (!this.title) {
        this.$message.error("请输入标题")
        return
      }
      let uploadArray = []
      let extCodes = []

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
          if (extCodes.indexOf(v.ext_code) >= 0) {
            this.$message.error(`存在重复的货号: ${v.ext_code}`)
            return
          }
          extCodes.push(v.ext_code)
          info.variations.push({
            id: v.id,
            name: v.name,
            ext_code: v.ext_code,
            parent_spec1_id: v.parent_spec1_id,
            spec1_name: v.spec1_name,
            parent_spec2_id: v.parent_spec2_id,
            spec2_name: v.spec2_name,
            len: v.len,
            width: v.width,
            height: v.height,
            weight: v.weight,
            sku_classification: v.sku_classification,
            number_of_pieces: v.number_of_pieces,
            piece_unit_code: v.piece_unit_code,
            individually_packed: v.individually_packed,
            image: s.image,
            price: v.price,
          })
        })
        uploadArray.push(info)
      }
      if (uploadArray.length <= 0) {
        this.$message("上传列表为空，无法上传")
        return
      }
      let resp = await simpleProductCombineUpload({id: this.template.id, name: this.template.name, title: this.title, is_auto_upload: this.is_auto_upload, list: uploadArray}) // TODO
      if (resp.code) {
        return
      }

      this.$message("上传成功")
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
    async syncSiteList() {
      let resp = await siteList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.siteList = resp.data
    },
    async syncFreightTemplateList() {
      let resp = await semiFreightTemplateList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.freightTemplateList = resp.data
    },
    async syncWarehouseList() {
      let resp = await semiWarehouseList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.warehouseList = resp.data
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
      this.spec1_prefix = "Style"
      this.is_auto_upload = true

      this.array = []

      await this.syncTemplateList()
      await this.syncSiteList()
      await this.syncFreightTemplateList()
      await this.syncWarehouseList()

      this.changeTab()
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
          let d = v.imageSelected[i]
          this.$set(v.imageSelected, i, v.imageSelected[i1])
          this.$set(v.imageSelected, i1, d)
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
    copyText(text) {
      this.$copyText(text).then( () => {
        this.$message('复制成功')
      }, function () {
        this.$message.error('复制失败')
      })
    },
    updateSemiInfo(data) {
      let ac = this.account(data.account_id)
      if (ac && ac.is_semi) {
        for (const s of this.siteList) {
          if (s.match_semi_managed) {
            data.site_id = s.id
            break
          }
        }
        for (const s of this.freightTemplateList) {
          if (s.account_id === data.account_id) {
            data.freight_template_id = s.id
            break
          }
        }
        for (const s of this.warehouseList) {
          if (s.account_id === data.account_id) {
            data.warehouse_id = s.id
            break
          }
        }
        data.ship_days = 9
        data.stock = 1000
      } else {
        data.site_id = undefined
        data.freight_template_id = undefined
        data.warehouse_id = undefined
        data.ship_days = undefined
        data.stock = undefined
      }
    },
    async syncTemplateParams() {
      if(!this.template) {
        return
      }
      if(this.template.params) {
        return
      }
      let resp = await simpleProductTemplate({id: this.template.id})
      if (resp.code) {
        return
      }

      this.template.params = resp.data
    },
    async changeTab() {
      this.title = ""

      this.titles = []
      for (const v of this.list) {
        if (!v.titles) {
          continue
        }

        for (let t of v.titles) {
          this.titles.push(t)
        }
      }

      this.$set(this, "array", [])

      await this.syncTemplateParams()

      if (this.template) {
        let d = this.template

        let cfg = d.params

        let data = {...d}
        data.imageSelected = []
        data.variations = []
        let indexSeq = 0
        for (let i = 0; i < this.list.length; i++) {
          let v = this.list[i]

          let imageSelected = []
          for (let j = 0; j < v.user_images.images.length; j++) {
            if (v.user_images.names[j].indexOf(".png") >= 0) {
              continue
            }

            if (v.name.startsWith("HB-")) {
              if (v.user_images.names[j].indexOf("目标") >= 0) {
                continue
              }
              if (v.user_images.names[j].indexOf("变体图") >= 0) {
                continue
              }
            } else if (v.name.startsWith("MKB-")) {
              if (v.user_images.names[j].indexOf("04-细节图01") >= 0) {
                continue
              }
            }

            let selected = i === 0
            if (v.name.startsWith("MZPT-") || v.name.startsWith("MZPT(3)-")) {
              if (v.user_images.names[j].indexOf("04-定制图") >= 0) {
                selected = false
              }
            } else if (v.name.startsWith("MPDZ-")) {
              if (v.user_images.names[j].indexOf("05-定制流程图") >= 0) {
                selected = false
              }
            } else if (v.name.startsWith("MPDZJG-")) {
              if (v.user_images.names[j].indexOf("05-定制流程图") >= 0) {
                selected = false
              }
            }
            imageSelected.push({image: v.user_images.images[j], selected: selected, name: v.name + "_" + v.user_images.names[j], index: indexSeq++})
          }

          for (const skuReq of cfg.sku_list) {
            let index = imageSelected[0].index

            let extCode = v.name
            if (skuReq.appendSku) {
              extCode += "_" + skuReq.appendSku
            }
            if (skuReq.prefixSku) {
              extCode = skuReq.prefixSku + extCode
            }
            for (let j = 0; j < imageSelected.length; j++) {
              if (v.name + "_" + skuReq.imageName === imageSelected[j].name) {
                index = imageSelected[j].index
                break;
              }
            }
            data.variations.push({
              id: v.id,
              name: v.name,
              ext_code: extCode,
              letter_index: i,
              base_spec1_name: skuReq.spec1Name,
              spec1_name: skuReq.spec1Name,
              spec2_name: skuReq.spec2Name,
              index: index,
              price: skuReq.price,
              parent_spec1_id: skuReq.parentSpec1Id,
              parent_spec2_id: skuReq.parentSpec2Id,
              len: skuReq.len,
              width: skuReq.width,
              height: skuReq.height,
              weight: skuReq.weight,
              sku_classification: skuReq.sku_classification,
              number_of_pieces: skuReq.number_of_pieces,
              piece_unit_code: skuReq.piece_unit_code,
              individually_packed: skuReq.individually_packed,
            })
          }

          data.imageSelected.push(...imageSelected)
        }

        if (d.default_account_id) {
          data.account_id = d.default_account_id
        }

        this.updateSemiInfo(data)
        this.array.push(data)
        this.onSpec1PrefixChanged()

        this.move('主图')
      }
    },
    onSpec1PrefixChanged() {
      for (let i = 0; i < this.array.length; i++) {
        let item = this.array[i]
        item.variations.forEach((variation) => {
          if (this.spec1_prefix) {
            variation.spec1_name = this.spec1_prefix + " " + this.getLetter(variation.letter_index) + " " + variation.base_spec1_name
          } else {
            variation.spec1_name = variation.base_spec1_name
          }
        })
      }
    },
    getLetter(i) {
      let letter = this.letters[i % this.letters.length]
      let j = Math.floor(i / this.letters.length)
      if (j > 0) {
        letter = this.getLetter(j-1) + letter
      }

      return letter
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