<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.category_id" placeholder="请选择类目" filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in categoryOptions" :key="index" :label="`${item.name}${item.print_material_id ? '('+item.print_material_id+')' : ''}`"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.print_material" placeholder="请选择打印材质" filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in printMaterialOptions" :key="index" :label="item.id"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.has_png" placeholder="请选择是否有Png" filterable clearable :style="{width: '100%'}">
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.has_svg" placeholder="请选择是否有Svg" filterable clearable :style="{width: '100%'}">
                <el-option label="有" :value="1"></el-option>
                <el-option label="没有" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="6">
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
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="Id" align="center" prop="id" sortable="custom">
        </el-table-column>
        <el-table-column label="名字" align="center" prop="name" sortable="custom">
        </el-table-column>
        <el-table-column label="产品Id" align="center" prop="product.id" sortable="custom">
        </el-table-column>
        <el-table-column label="产品名" align="center" prop="product.name" sortable="custom">
        </el-table-column>
        <el-table-column label="打印材质" align="center" sortable="custom">
          <div class="item-container" slot-scope="{row}">
            {{printMaterial(row)}}
          </div>
        </el-table-column>
        <el-table-column label="UV图" align="center" sortable="custom">
          <div class="item-container" slot-scope="{row}">
            <KdxImage :src="row.png_thumb_url" style="background-color: lightblue" v-if="row.png_thumb_url"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="切割图" align="center" sortable="custom">
          <div class="item-container" slot-scope="{row}">
            <KdxImage :src="row.svg_url" style="background-color: lightblue" v-if="row.svg_url"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="数量" align="center" sortable="custom">
          <div class="item-container" slot-scope="{row}">
            {{row.count}}
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

    <el-button size="medium" type="primary" style="height: 40px; width: 180px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" v-if="selectRows.length > 0" @click="onEdit">修改打印材质</el-button>
    <TemuDlgDiagramEdit :ids="productDiagramEdit.ids" :printMaterialOptions="printMaterialOptions" :visible="productDiagramEdit.visible" @close="productDiagramEdit.visible=false" @update="getTableData"></TemuDlgDiagramEdit>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {diagramListByPage} from "@/api/product/diagram";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";
import {categoryList} from "@/api/product/category";
import {printMaterialList} from "@/api/product/print_material";

export default {
  components: {
    TemuDlgDiagramEdit,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: diagramListByPage,

      categoryOptions: [],
      printMaterialOptions: [],

      selectRows: [],

      productDiagramEdit: {
        ids: [],
        visible: false,
      }
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    printMaterial(row) {
      if (row.print_material_id) {
        return row.print_material_id
      }
      if (row.product && row.product.category && row.product.category.print_material_id) {
        return `${row.product.category.print_material_id}(类目)`
      } else {
        return `未知打印材质`
      }
    },
    onEdit() {
      this.productDiagramEdit.ids = this.selectRows.map(item => {return item.id})
      this.productDiagramEdit.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await categoryList()
    if (!resp.code) {
      this.categoryOptions = resp.data
    }
    resp = await printMaterialList()
    if (!resp.code) {
      this.printMaterialOptions = resp.data
    }

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