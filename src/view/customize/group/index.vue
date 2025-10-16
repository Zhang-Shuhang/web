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
        <el-table-column label="宽" prop="png_width" align="center"></el-table-column>
        <el-table-column label="高" prop="png_height" align="center"></el-table-column>
        <el-table-column label="行" prop="row" align="center"></el-table-column>
        <el-table-column label="列" prop="col" align="center"></el-table-column>
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

      <CustomizeDlgGroup :id="dlgGroup.id" :copy_id="dlgGroup.copy_id" :visible="dlgGroup.visible" @close="dlgGroup.visible=false" @suc="getTableData"></CustomizeDlgGroup>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {groupListByPage} from "@/api/customize/group";
import CustomizeDlgGroup from "@/view/customize/components/dlg_group.vue";

export default {
  components: {
    CustomizeDlgGroup,
  },
  mixins: [infoList],
  computed: {
  },
  data() {
    return {
      listApi: groupListByPage,

      dlgGroup: {
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
      this.dlgGroup.id = row.id
      this.dlgGroup.copy_id = 0
      this.dlgGroup.visible = true
    },
    onCopy(row) {
      this.dlgGroup.id = undefined
      this.dlgGroup.copy_id = row.id
      this.dlgGroup.visible = true
    },
    onCreate() {
      this.dlgGroup.id = undefined
      this.dlgGroup.copy_id = undefined
      this.dlgGroup.visible = true
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