<template>
  <el-drawer :visible.sync="$attrs.visible" title="上架产品" @opened="onOpened" size="100%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <template slot="title">
      <div style="float: left">
        上架产品
      </div>
      <div style="float: right; width: 250px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-button size="mini" type="primary" @click="openCreateTemplate" style="width: 100%">创建模板</el-button>
          </el-col>
          <el-col :span="12">
            <el-switch style="height: 24px; line-height: 22px" v-model="is_default_y2" active-text="Y2" inactive-text="半托"></el-switch>
          </el-col>
        </el-row>
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
      <el-form-item label="英文标题记录">
        <div v-for="(t, index) in titles" :key="index">
          <el-tag size="mini" type="primary" v-if="canCopyTitle" @click="copyText(t)">{{t}}</el-tag>
          <el-tag size="mini" type="primary" class="can_not_select" v-else>{{t}}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="是否自动上传">
        <el-switch v-model="is_auto_upload"></el-switch>
      </el-form-item>
      <el-form-item label="主图视频">
        <el-row :gutter="5" style="width: 400px">
          <el-col :span="12" v-if="carouse_video">
            <div>
              <video width="100%" controls :src="carouse_video.url"></video>
            </div>
            <div style="margin: 5px">
              <el-button size="mini" type="primary" style="width: 100%" @click="cancelVideo('carouse_video')">删除</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector('carouse_video')">选择主图视频</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="详情视频">
        <el-row :gutter="5" style="width: 400px">
          <el-col :span="12" v-if="detail_video">
            <div>
              <video width="100%" controls :src="detail_video.url"></video>
            </div>
            <div style="margin: 5px">
              <el-button size="mini" type="primary" style="width: 100%" @click="cancelVideo('detail_video')">删除</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector('detail_video')">选择详情视频</el-button>
          </el-col>
        </el-row>
      </el-form-item>
<!--      <el-form-item label="GPT生成标题">-->
<!--        <el-row :gutter="5">-->
<!--          <el-col :span="22">-->
<!--            <el-input type="textarea" placeholder="问题内容" v-model="content" clearable style="width: 100%" :autosize="{ minRows: 3, maxRows: 100 }">-->
<!--            </el-input>-->
<!--          </el-col>-->
<!--          <el-col :span="2">-->
<!--            <KdxImage :src="image_url" width="100%" height="100%"></KdxImage>-->
<!--            <el-select v-model="image_url" placeholder="请选择待分析图" style="width: 100%" v-if="active">-->
<!--              <el-option style="height: 80px; width: 300px;"-->
<!--                         v-for="(item, index) in active.user_images.images"-->
<!--                         :key="index"-->
<!--                         :value="item">-->
<!--                <span style="float: left">{{ active.user_images.names[index] }}</span>-->
<!--                <KdxImage style="float: right; color: #8492a6; font-size: 13px" :src="item"></KdxImage>-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--        <el-button size="mini" type="primary" style="width: 100%;height: 50px" @click="gptGen">GPT生成</el-button>-->
<!--      </el-form-item>-->
      <el-form-item label="产品" v-if="active">
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
                  <el-select v-model="variation.name" placeholder="请选择变体图" style="width: 100%">
                    <el-option style="height: 80px; width: 300px;"
                               v-for="item in row.imageSelected"
                               :key="item.index"
                               :label="item.name"
                               :value="item.name">
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
      <TemuDlgVideoSelector :visible="dlgSelectVideo.visible" @close="dlgSelectVideo.visible=false" @select="selectVideo"></TemuDlgVideoSelector>
    </el-form>
  </el-drawer>
</template>

<script>
import {
  simpleProductTemplateList,
  simpleProductTemplates,
  simpleProductUpload
} from "@/api/temu/simple_product";
import KdxImage from "@/components/image/image.vue";
import draggable from "vuedraggable";
import {chatgptChatV2} from "@/api/chat/api";
import TemuDlgCreateTemplate from "@/view/temu/components/dlg_create_template.vue";
import {siteList} from "@/api/temu/site";
import {semiFreightTemplateList, semiWarehouseList} from "@/api/temu/semi";
import {mapGetters} from "vuex";
import TemuDlgVideoSelector from "@/view/temu/components/dlg_video_selector.vue";

export default {
  name: 'TemuDlgSimpleProductUpload',
  components: {TemuDlgVideoSelector, TemuDlgCreateTemplate, KdxImage, draggable},
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
    not_selected_templates() {
      return this.template_list.filter((item) => {
        return this.template_ids.indexOf(item.id) < 0
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
      is_auto_upload: true,
      carouse_video: undefined,
      detail_video: undefined,
      content: `Judging the European and American products in the figure, the main direction of judgment:
product_name use Chinese, product_material use Chinese, product_type use Chinese, festival_or_activity_involved use Chinese, target_group_for_receiving_gifts use Chinese.
Create an Amazon title with english and Chinese translate for the product with format: Format: Quantifier + core subject + imperial size (optional) + long-tail words (other core subjects/category words).
Don't repeat the description.
Output must follows this Json format:
{
\t"product_name":
\t"product_material":
\t"product_type":
\t"festivals_or_events_involved": []
\t"target_group_for_receiving_gifts": []
\t"cn_title":
\t"title":
}`,
      image_url: "",
      accounts: [],
      siteList: [],
      freightTemplateList: [],
      warehouseList: [],
      array: [],

      is_default_y2: false,

      rand_type: "主图",
      rand_count: 1,
      rand_scene_count: 3,

      contain_name: "",
      only_selected: false,

      search_list: [],
      template_list: [],
      template_ids: [],

      active_sequence: "0",

      dlgCreateTemplate: {
        visible: false,
      },
      dlgSelectVideo: {
        video_field: "",
        visible: false,
      }
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
            return item.name === v.name
          })
          info.variations.push({ext_code: v.ext_code, image: s.image, price: v.price})
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
      this.is_auto_upload = true

      this.array = []

      await this.syncTemplateList()
      await this.syncSiteList()
      await this.syncFreightTemplateList()
      await this.syncWarehouseList()

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
    async gptGen() {
      this.content = this.content.trim()

      if (!this.content) {
        this.$message("请输入问题")
        return
      }

      // {
      //   "type": "text",
      //     "text": "Judging the European and American products in the figure, the main direction of judgment: product name with Chinese, product material with Chinese, product type with Chinese, festival or activity involved with Chinese, Target group for receiving gifts with Chinese. Create an Amazon title with english and Chinese translate for the product with format: Format: Quantifier + core subject + imperial size (optional) + long-tail words (other core subjects/category words). Don'\''t repeat the description. Output follows this format: \n Product Name: \n Product material: \n Product Type: \n Festivals or events involved: \n Target group for receiving gifts: \n Amazon Title:"
      // },
      // {
      //   "type": "image_url",
      //     "image_url": {
      //   "url": "https://kj-img.pddpic.com/product/1fa32089c0/3a141aff-e433-466d-baa9-b14bff3b4777_1200x1200.jpeg"
      // }
      // }
      let resp = await chatgptChatV2([
          {
            type: "text",
            text: this.content,
          },
          {
            type: "image_url",
            image_url: {url: this.image_url},
          },
      ])
      if (resp.code) {
        return
      }

      this.title = resp.data
    },
    variationUseMainImage() {
      this.array.forEach((item) => {
        for (let i = 0; i < item.imageSelected.length; i++) {
          let d = item.imageSelected[i]
          if (d.selected) {
            item.variations.forEach((v) => {
              v.index = d.index
              v.name = d.name
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
            if (this.is_default_y2) {
              if (s.name.indexOf("Y2") < 0) {
                continue
              }
            } else {
              if (s.name.indexOf("Y2") >= 0) {
                continue
              }
            }
            data.warehouse_id = s.id
            break
          }
        }
        if (this.is_default_y2) {
          data.ship_days = 9
          data.stock = 10000
        } else {
          data.ship_days = 2
          data.stock = 0
        }
      } else {
        data.site_id = undefined
        data.freight_template_id = undefined
        data.warehouse_id = undefined
        data.ship_days = undefined
        data.stock = undefined
      }
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

        if (this.active.name && this.active.name.startsWith("MSGGS-")) {
          this.title = lastTitle
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
          if (this.active.user_images.names[j].indexOf("底图") >= 0) {
            // 底图默认不选
            selected = false
          } else if (this.active.name.startsWith("MZPT-") || this.active.name.startsWith("MZPT(3)-")) {
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

        this.updateSemiInfo(data)

        data.variations = []
        for (const skuReq of cfg.sku_list) {
          let index = 0
          let name = ""

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
              name = skuReq.imageName
              break;
            }
          }
          data.variations.push({ext_code: extCode, spec1_name: skuReq.spec1Name, spec2_name: skuReq.spec2Name, index: index, name: name ? name : this.active.user_images.names[0],price: skuReq.price})
        }
        this.array.push(data)
      }
    },
    openDlgVideoSelector(field) {
      this.dlgSelectVideo.video_field = field
      this.dlgSelectVideo.visible = true
    },
    selectVideo(video) {
      this.$data[this.dlgSelectVideo.video_field] = video
    },
    cancelVideo(field) {
      this.$data[field] = undefined
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