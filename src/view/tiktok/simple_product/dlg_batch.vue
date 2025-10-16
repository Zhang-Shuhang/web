<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量导出" @opened="onOpened" size="100%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="array" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="名字" prop="name" align="center" width="100px">
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center" width="500px">
        <div slot-scope="{row}">
          <el-input type="textarea" :rows="5" v-model="row.title"></el-input>
          <el-tag @click="setTitle(row, title)" size="mini" type="primary" v-for="(title, index) in (row.titles || [])" :key="index">
            {{title}}
          </el-tag>
        </div>
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
            <el-col :span="5">
              <el-button type="primary" @click="move('场景')" style="width: 100%">主图后移</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="move('主图')" style="width: 100%">主图前移</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="move('主图')" style="width: 100%">场景后移</el-button>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" @click="move('场景')" style="width: 100%">场景前移</el-button>
            </el-col>
            <el-col :span="4">
              <el-button type="warning" @click="unselectAll" style="width: 100%">全部不选</el-button>
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
          <el-select v-model="row.variationIndex" placeholder="请选择变体图" style="width: 100%">
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
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <div slot-scope="{row}">
          <el-button type="warning" @click="remove(row)">移除</el-button>
        </div>
      </el-table-column>
    </el-table>

    <el-button size="medium" type="primary" style="height: 40px; width: 200px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="exportTiktokExcel">导出Tiktok</el-button>
    <el-button size="medium" type="primary" style="height: 40px; width: 200px; position: absolute; right: 20px; bottom: 250px; z-index: 9999" @click="exportTemuExcel">导出Temu</el-button>
    <div style="height: 40px; width: 200px; position: absolute; right: 20px; bottom: 200px; z-index: 9999">
      <el-popover placement="bottom" trigger="click">
        <el-input v-model="blind.name" size="mini" style="width: 100%" placeholder="盲盒名字(MH-)">
        </el-input>
        <el-button size="medium" type="primary" style="width: 100%" @click="exportBlindExcel" :disabled="!blind.name">导出</el-button>
        <el-button slot="reference" size="medium" type="primary" style="width: 100%" icon="el-icon-edit">导出盲盒</el-button>
      </el-popover>
    </div>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {
  simpleProductExportBlindExcel,
  simpleProductExportTemuExcel,
  simpleProductExportTiktokExcel
} from "@/api/temu/simple_product";
import draggable from "vuedraggable";

export default {
  name: 'DlgBatchExport',
  components: {draggable, KdxImage},
  mixins: [],
  props: {
    list: {
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

      blind: {
        name: "",
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      this.array = []

      for (const v of this.list) {
        let data = {...v}
        data.name = v.name
        data.title = v.title
        data.titles = v.titles
        data.images = v.user_images.images
        data.imageSelected = []
        for (let j = 0; j < v.user_images.images.length; j++) {
          if (v.user_images.names[j].indexOf(".png") >= 0) {
            continue
          }

          let selected = true
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
          data.imageSelected.push({image: v.user_images.images[j], selected: selected, name: v.user_images.names[j], index: j})
        }
        data.variationIndex = 0
        this.array.push(data)
      }
    },
    setTitle(row, title) {
      row.title = title
      this.$message("设置成功!")
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
    unselectAll() {
      this.array.forEach((row) => {
        for (let i = 0; i < row.imageSelected.length; i++) {
          row.imageSelected[i].selected = false
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
    async exportTiktokExcel() {
      let list = []
      for (const v of this.array) {
        let selectedImages = []
        for (const s of v.imageSelected) {
          if (s.selected) {
            selectedImages.push(v.images[s.index])
          }
        }
        if (selectedImages.length < 4) {
          this.$message.error(`${v.name} 图片最少要选择4张!`)
          return
        }

        // if (!v.title) {
        //   this.$message.error(`${v.name} 请输入标题!`)
        //   return
        // }

        list.push({
          name: v.name,
          title: v.title,
          images: selectedImages,
          variation_image: v.images[v.variationIndex],
        })
      }

      let resp = await simpleProductExportTiktokExcel(list)
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank")
    },
    async exportTemuExcel() {
      let list = []
      for (const v of this.array) {
        let selectedImages = []
        for (const s of v.imageSelected) {
          if (s.selected) {
            selectedImages.push(v.images[s.index])
          }
        }
        if (selectedImages.length < 5) {
          this.$message.error(`${v.name} 图片最少要选择5张!`)
          return
        }

        // if (!v.title) {
        //   this.$message.error(`${v.name} 请输入标题!`)
        //   return
        // }

        list.push({
          name: v.name,
          title: v.title,
          images: selectedImages,
          variation_image: v.images[v.variationIndex],
        })
      }

      let resp = await simpleProductExportTemuExcel(list)
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank")
    },
    async exportBlindExcel() {
      let imageList = []
      let sizeImageList = []
      let names = []
      for (const v of this.array) {
        let selectedImages = []
        for (const s of v.imageSelected) {
          if (s.selected) {
            if (s.name.indexOf("尺寸") >= 0) {
              sizeImageList.push(v.images[s.index])
            } else {
              selectedImages.push(v.images[s.index])
            }
          }
        }
        if (selectedImages.length !== 1) {
          this.$message.error(`${v.name} 盲盒只能选择一张主图，整体只能选择一张尺寸图!`)
          return
        }

        imageList.push(selectedImages[0])
        names.push(v.name)
      }

      if (sizeImageList.length !== 1) {
        this.$message.error(`盲盒整体只能选择一张尺寸图!`)
        return
      }

      let resp = await simpleProductExportBlindExcel({name: this.blind.name, names: names, image_list: imageList, size_image: sizeImageList[0]})
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank")
    },
    variationUseMainImage() {
      this.array.forEach((item) => {
        for (let i = 0; i < item.imageSelected.length; i++) {
          let d = item.imageSelected[i]
          if (d.selected) {
            item.variationIndex = d.index
            break
          }
        }
      })
    },
    select(index, select) {
      this.array.forEach((item) => {
        if (index < item.imageSelected.length) {
          item.imageSelected[index].selected = select
        }
      })
    },
    moveByIndex(i1, i2) {
      this.array.forEach((v) => {
        let d = v.imageSelected[i2]
        if (i1 < v.imageSelected.length && i2 < v.imageSelected.length) {
          this.$set(v.imageSelected, i2, v.imageSelected[i1])
          this.$set(v.imageSelected, i1, d)
        }
      })
    },
    copy(index) {
      this.array.forEach((v) => {
        if (index >= v.imageSelected.length) {
          return
        }
        let d = v.imageSelected[index]
        let newData = {image: d.image, selected: d.selected, name: d.name, index: d.index}
        this.$set(v.imageSelected, v.imageSelected.length, newData)
      })
    },
    remove(row) {
      this.array = this.array.filter((item) => {
        return item !== row
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
      } else {
        data.site_id = undefined
        data.freight_template_id = undefined
        data.warehouse_id = undefined
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
</style>