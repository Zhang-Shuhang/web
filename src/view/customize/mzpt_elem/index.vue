<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label-width="0">
              <el-input placeholder="名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onCreate">创建</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center"></el-table-column>
        <el-table-column label="名字" prop="name" align="center"></el-table-column>
        <el-table-column label="字符" prop="letter" align="center"></el-table-column>
        <el-table-column label="宽" prop="width" align="center"></el-table-column>
        <el-table-column label="高" prop="height" align="center"></el-table-column>
        <el-table-column label="偏移X" prop="offset_x" align="center"></el-table-column>
        <el-table-column label="偏移Y" prop="offset_y" align="center"></el-table-column>
        <el-table-column label="外路径" prop="outer_path" align="center" width="220px">
          <div slot-scope="{row}">
            <svg xmlns='http://www.w3.org/2000/svg' :width='width(row)' :height='height(row)' :viewBox="`0 0 ${row.width} ${row.height}`" v-if="row.outer_path">
              <rect :width="row.width" :height="row.height" fill="none" stroke-width="1" stroke="red" />
              <g :transform="`translate(${row.offset_x} ${row.offset_y})`">
                <path :d="row.outer_path" stroke-width="1" style="stroke: rgb(255,0,0); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" />
              </g>
            </svg>
          </div>
        </el-table-column>
        <el-table-column label="内路径" prop="inner_path" align="center" width="220px">
          <div slot-scope="{row}">
            <svg xmlns='http://www.w3.org/2000/svg' :width='200' :height='height(row)' :viewBox="`0 0 ${row.width} ${row.height}`" v-if="row.inner_path">
              <path :d="row.inner_path" stroke-width="1" style="stroke: rgb(255,0,0); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" />
            </svg>
          </div>
        </el-table-column>
        <el-table-column label="图片" prop="inner_image" align="center">
          <div slot-scope="{row}">
            <img :src="row.inner_image" style="width: 100%; height: 100%" v-if="row.inner_image" />
          </div>
        </el-table-column>
        <el-table-column label="操作" prop="inner_image" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" style="width: 100%" @click="onEdit(row)">编辑</el-button>
            <el-button size="mini" type="primary" style="width: 100%" @click="onCopy(row)">复制</el-button>
          </div>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :style="{textAlign:'right'}"
          :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 50, 100, 200, 300, 500, 1000]"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, prev, next, jumper, sizes"
      ></el-pagination>

      <CustomizeDlgEditMzptElem :id="dlgMzptElem.id" :copy_id="dlgMzptElem.copy_id" :visible="dlgMzptElem.visible" @close="dlgMzptElem.visible=false" @suc="getTableData"></CustomizeDlgEditMzptElem>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {mzptElemListByPage} from "@/api/customize/mzpt_elem";
import CustomizeDlgEditMzptElem from "@/view/customize/components/dlg_mzpt_elem.vue";

export default {
  components: {
    CustomizeDlgEditMzptElem,
  },
  mixins: [infoList],
  computed: {
  },
  data() {
    return {
      listApi: mzptElemListByPage,

      dlgMzptElem: {
        id: 0,
        copy_id: 0,
        visible: false,
      },
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    onEdit(row) {
      this.dlgMzptElem.id = row.id
      this.dlgMzptElem.copy_id = 0
      this.dlgMzptElem.visible = true
    },
    onCopy(row) {
      this.dlgMzptElem.id = undefined
      this.dlgMzptElem.copy_id = row.id
      this.dlgMzptElem.visible = true
    },
    onCreate() {
      this.dlgMzptElem.id = undefined
      this.dlgMzptElem.copy_id = undefined
      this.dlgMzptElem.visible = true
    },
    width() {
      return 200
    },
    height(item) {
      return 200 * item.height / item.width
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
</style>