<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="12">
            <el-form-item label-width="0">
              <el-input placeholder="产品名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="Id" align="center" prop="id" sortable="custom">
        </el-table-column>
        <el-table-column label="名字" align="center" prop="name" sortable="custom">
        </el-table-column>
        <el-table-column label="图片" align="center" prop="images" sortable="custom" min-width="500px">
          <div slot-scope="{row}">
            <el-table class="table-body" ref="multipleTable" :data="row.user_images_list" border height="100%" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="row.user_images_list && row.user_images_list.length > 0">
              <el-table-column label="图片" align="center" prop="images">
                <div slot-scope="{row}">
                  <el-image
                      style="width: 80px; height: 80px"
                      :src="`${image}?imageView2/2/w/200/q/70`"
                      :preview-src-list="previewImageList(row.images, index)"
                      v-for="(image, index) in row.images" :key="index">
                  </el-image>
                </div>
              </el-table-column>
              <el-table-column label="详情图" align="center" prop="detail_images">
                <div slot-scope="{row}">
                  <el-image
                      style="width: 80px; height: 80px"
                      :src="`${image}?imageView2/2/w/200/q/70`"
                      :preview-src-list="previewImageList(row.detail_images, index)"
                      v-for="(image, index) in row.detail_images" :key="index">
                  </el-image>
                </div>
              </el-table-column>
            </el-table>
          </div>
        </el-table-column>
        <el-table-column label="加工图" align="center" sortable="custom">
          <el-table-column label="UV图" align="center" sortable="custom" width="100px">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.diagrams.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(diagram, index) in row.diagrams" :key="index">
                <KdxImage :src="diagram.png_thumb_url" v-if="diagram.png_thumb_url"></KdxImage>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="切割图" align="center" sortable="custom" width="100px">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.diagrams.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(diagram, index) in row.diagrams" :key="index">
                <KdxImage :src="diagram.svg_url" v-if="diagram.svg_url"></KdxImage>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="数量" align="center" sortable="custom" width="100px">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.diagrams.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(diagram, index) in row.diagrams" :key="index">
                {{diagram.count}}
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="配件" align="center" prop="accessories" sortable="custom">
          <div slot-scope="{row}">
            <div v-for="(item, index) in row.accessories" :key="index">
              <el-tag type="primary" size="mini">{{ item.accessory ? item.accessory.name : `未知: ${item.accessory_id}` }} x {{ item.count }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="特殊备注" align="center" prop="special_desc" sortable="custom">
          <div slot-scope="{row}">
            <div style="font-size: 12px">
              {{row.special_desc}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品说明" align="center" prop="url" sortable="custom">
          <div slot-scope="{row}">
            <div style="font-size: 12px">
              <el-link size="mini" type="primary" :href="row.url" :underline="false" target="_blank" v-if="row.url">说明</el-link>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <div slot-scope="{row}">
            <el-button type="primary" size="mini" style="width: 100%" @click="onEdit(row.id)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" style="width: 100%; margin-top: 5px" @click="downloadDiagram(row.id)" v-if="row.diagrams && row.diagrams.length > 0">
              下载加工图
            </el-button>
          </div>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :style="{textAlign:'right'}"
          :page-sizes="[5, 10, 20, 30, 50, 100, 200, 300, 500, 1000]"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, prev, next, jumper, sizes"
      ></el-pagination>
    </div>

    <TemuDlgProductEdit :id="productEditDlg.id" :visible="productEditDlg.visible" @close="productEditDlg.visible=false" @update="getTableData"></TemuDlgProductEdit>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {mapGetters} from "vuex";
import {productDownloadDiagram, productListByPage} from "@/api/product/product";
import TemuDlgProductEdit from "@/view/product/components/dlg_product_edit.vue";

export default {
  components: {
    TemuDlgProductEdit,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: productListByPage,

      selectRows: [],

      productEditDlg: {
        id: undefined,
        is_copy: false,
        visible: false,
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token", "canNotSeePrice"]),
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    onEdit(id) {
      this.productEditDlg.id = id
      this.productEditDlg.visible = true
    },
    async downloadDiagram(id) {
      let resp = await productDownloadDiagram({id})
      if (resp.code) {
        return
      }

      window.open(window.location.origin + "/product_sys/" + resp.data, "_BLANK")
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    previewImageList(images, index) {
      if(index===0) {
        return images
      }

      let result = []
      for (let i = 0; i < images.length; i++) {
        result.push(images[(i+index) % images.length])
      }
      return result
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 100px;
    padding: 0px;
  }

  .item-bottom {
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    height: 24px;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

::v-deep .el-row {
  padding: 0;
}

::v-deep .el-table .cell {
  padding: 0;
}

.el-row {
  padding-top: 0px;
  padding-bottom: 0px;
}

::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}

.button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  height: 24px;
  line-height: 22px;
  width: 100%;
  vertical-align: bottom;
}

::v-deep .select .el-input--suffix .el-input__inner {
  padding-right: 0px;
}

::v-deep .select .el-input__suffix {
  display: none;
}

.input-right-zero {
  padding-right: 0px !important;
}

.one-line {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
}

.two-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

::v-deep .el-upload--text {
  width: 100%;
}
</style>