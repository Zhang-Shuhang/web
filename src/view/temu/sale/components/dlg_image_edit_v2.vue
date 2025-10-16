<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量改图V2" @opened="onOpened" size="100%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="array" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="Spu Id" prop="spu_id" align="center" width="100px">
      </el-table-column>
      <el-table-column label="图片" align="center">
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
      <el-table-column label="变体" align="center" width="350px">
        <div slot-scope="{row}">
          <template v-for="(variation, index) in row.variations">
            <div :key="index">
              <el-row>
                <el-col :span="12">
                      <span style="font-size: 20px">
                        {{variation.ext_code}}
                      </span>
                </el-col>
                <el-col :span="12">
                  <el-select size="mini" v-model="variation.image" placeholder="请选择变体图" style="width: 100%">
                    <el-option style="height: 80px; width: 300px;"
                               v-for="item in row.imageSelected"
                               :key="item.index"
                               :label="item.name"
                               :value="item.image">
                      <span style="float: left">{{ item.name }}</span>
                      <KdxImage style="float: right; color: #8492a6; font-size: 13px" :src="item.image"></KdxImage>
                    </el-option>
                  </el-select>
                </el-col>
              </el-row>
            </div>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <div slot-scope="{row}">
          <el-button type="warning" @click="remove(row)">移除</el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="batchSubmit">批量提交</el-button>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import draggable from "vuedraggable";
import {saleImageEdit, saleQueryImagesForEdit} from "@/api/temu/sale";

export default {
  name: 'TemuDlgImageEditV2',
  components: {draggable, KdxImage},
  mixins: [],
  props: {
    ids: {
      type: Array,
    },
  },
  computed: {},
  data() {
    return {
      loading: false,

      array: [],

      rand_type: "主图",
      rand_count: 1,
      rand_scene_count: 3,

      contain_name: "",
      only_selected: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      let resp = await saleQueryImagesForEdit({ids: this.ids})
      if (resp.code) {
        return
      }
      if (resp.data.not_found_product_ids) {
        this.$message.error(`没有加载到产品: ${resp.data.not_found_product_ids.join(" ")}`)
      }

      this.array = []

      for (const v of resp.data.list) {
        let data = {}
        data.spu_id = v.spu_id
        data.images = v.images
        data.design_images = v.design_images
        data.imageSelected = []
        let selectCount = 0
        for (let j = 0; j < v.design_images.length; j++) {
          if (v.names[j].indexOf(".png") >= 0) {
            continue
          }

          let selected = false
          if (data.images.indexOf(v.design_images[j]) >= 0) {
            selected = true
          }
          data.imageSelected.push({image: v.design_images[j], selected: selected, name: v.names[j], index: j})

          if (selected) {
            selectCount ++
          }
        }
        if (selectCount <= 0) {
          for (let j = 0; j < data.imageSelected.length; j++) {
            if (v.name.startsWith("HB-")) {
              if (data.imageSelected[j].name.indexOf("目标") >= 0) {
                continue
              }
              if (data.imageSelected[j].name.indexOf("变体图") >= 0) {
                continue
              }
            } else if (!v.name.startsWith("MKB-")) {
              if (data.imageSelected[j].name.indexOf("04-细节图01") >= 0) {
                continue
              }
            }

            let selected = true
            if (v.name.startsWith("MZPT-") || v.name.startsWith("MZPT(3)-")) {
              if (data.imageSelected[j].name.indexOf("04-定制图") >= 0) {
                selected = false
              }
            } else if (v.name.startsWith("MPDZ-")) {
              if (data.imageSelected[j].name.indexOf("05-定制流程图") >= 0) {
                selected = false
              }
            } else if (v.name.startsWith("MPDZJG-")) {
              if (data.imageSelected[j].name.indexOf("05-定制流程图") >= 0) {
                selected = false
              }
            }
            data.imageSelected[j].selected = selected
          }
        }
        data.variations = []
        for (const sku of v.sku_list) {
          let image = sku.image
          if (v.design_images.indexOf(image) < 0) {
            image = v.design_images[0]
          }
          data.variations.push({
            skc_id: sku.skc_id,
            sku_id: sku.sku_id,
            ext_code: sku.ext_code,
            image: image,
          })
        }
        this.array.push(data)
      }
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
          let allIndexes = indexes.filter(() => {
            return true
          })
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
    onEnd() {
      //here  emit dragList TODO
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
              v.image = d.image
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
    remove(row) {
      this.array = this.array.filter((item) => {
        return item != row
      })
    },
    copyText(text) {
      this.$copyText(text).then(() => {
        this.$message('复制成功')
      }, function () {
        this.$message.error('复制失败')
      })
    },
    async batchSubmit() {
      for (const v of this.array) {
        let data = {}
        data.spu_id = v.spu_id
        data.images = []
        v.imageSelected.forEach((item) => {
          if (item.selected) {
            data.images.push(item.image)
          }
        })
        data.sku_list = []
        for (const sku of v.variations) {
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

        this.remove(v)

        this.$message(`更新成功: ${v.spu_id}`)
      }
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