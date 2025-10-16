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
        <el-table-column label="色彩" prop="colors" align="center">
          <div slot-scope="{row}">
            <div style="background-color: lightblue">
              <div v-for="(color, index) in row.colors" :key="index">
                <span :style="`color: ${color}`">{{color}}</span>
              </div>
            </div>
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

      <CustomizeDlgEditMzptColorSeries :id="dlgMzptColorSeries.id" :copy_id="dlgMzptColorSeries.copy_id" :visible="dlgMzptColorSeries.visible" @close="dlgMzptColorSeries.visible=false" @suc="getTableData"></CustomizeDlgEditMzptColorSeries>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {mzptColorSeriesListByPage} from "@/api/customize/mzpt_color_series";
import CustomizeDlgEditMzptColorSeries from "@/view/customize/components/dlg_mzpt_color_series.vue";

export default {
  components: {
    CustomizeDlgEditMzptColorSeries,
  },
  mixins: [infoList],
  computed: {
  },
  data() {
    return {
      listApi: mzptColorSeriesListByPage,

      dlgMzptColorSeries: {
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
      this.dlgMzptColorSeries.id = row.id
      this.dlgMzptColorSeries.copy_id = 0
      this.dlgMzptColorSeries.visible = true
    },
    onCopy(row) {
      this.dlgMzptColorSeries.id = undefined
      this.dlgMzptColorSeries.copy_id = row.id
      this.dlgMzptColorSeries.visible = true
    },
    onCreate() {
      this.dlgMzptColorSeries.id = undefined
      this.dlgMzptColorSeries.copy_id = undefined
      this.dlgMzptColorSeries.visible = true
    },
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