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
        <el-table-column label="路径" prop="paths" align="center" width="520px">
          <div slot-scope="{row}">
            <div v-for="(item, index) in row.paths" :key="index">
              <svg xmlns='http://www.w3.org/2000/svg' :width="500" :height='height(item)' :viewBox="`0 0 ${item.width} ${item.height}`">
                <path :d="item.path" stroke-width="1" style="stroke: rgb(255,0,0); stroke-width: 10; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: none; fill-rule: nonzero; opacity: 1;" />
              </svg>
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

      <CustomizeDlgEditMzptStand :id="dlgMzptStand.id" :copy_id="dlgMzptStand.copy_id" :visible="dlgMzptStand.visible" @close="dlgMzptStand.visible=false" @suc="getTableData"></CustomizeDlgEditMzptStand>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {mzptStandListByPage} from "@/api/customize_v3/mzpt_stand";
import CustomizeDlgEditMzptStand from "@/view/customize_v3/components/dlg_mzpt_stand.vue";

export default {
  components: {
    CustomizeDlgEditMzptStand,
  },
  mixins: [infoList],
  computed: {
  },
  data() {
    return {
      listApi: mzptStandListByPage,

      dlgMzptStand: {
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
      this.dlgMzptStand.id = row.id
      this.dlgMzptStand.copy_id = 0
      this.dlgMzptStand.visible = true
    },
    onCopy(row) {
      this.dlgMzptStand.id = undefined
      this.dlgMzptStand.copy_id = row.id
      this.dlgMzptStand.visible = true
    },
    onCreate() {
      this.dlgMzptStand.id = undefined
      this.dlgMzptStand.copy_id = undefined
      this.dlgMzptStand.visible = true
    },
    height(item) {
      return 500 * item.height / item.width
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