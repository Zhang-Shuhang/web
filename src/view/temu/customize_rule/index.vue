<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="4">
            <el-input style="width: 100%" v-model="searchInfo.name" placeholder="请输入查询配置名" size="mini" clearable/>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-select v-model="searchInfo.is_ok" placeholder="是否初始化" style="width: 100%" size="mini" filterable clearable>
              <el-option label="" value=""></el-option>
              <el-option label="已经初始化" :value="1"></el-option>
              <el-option label="未初始化" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-select v-model="searchInfo.only_self" placeholder="是否自己" style="width: 100%" size="mini" filterable clearable>
              <el-option label="" value=""></el-option>
              <el-option label="自己" :value="1"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="4">
            <el-button style="width: 100%" type="primary" size="mini" @click="onSubmit">查询
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="4">
            <el-button style="width: 100%" type="primary" size="mini" :disabled="!customizeBatchEditDlg.rows.length" @click="customizeBatchEditDlg.visible = true">批量操作
            </el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" border height="92%" size="mini"
                :header-cell-style="{ 'background-color': 'black', 'color': '#fff' }" :default-expand-all="false" @selection-change="selection => customizeBatchEditDlg.rows = selection" @sort-change="sortChange">
        <el-table-column align="center" type="selection" width="55">
        </el-table-column>
        <el-table-column label="ID" align="center" prop="id" sortable="custom" width="200">
        </el-table-column>
        <el-table-column label="货号" align="center" prop="name" sortable="custom">
        </el-table-column>
        <el-table-column label="是否初始化" align="center" prop="is_ok" sortable="custom">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.is_ok">已初始化</el-tag>
            <el-tag size="mini" type="danger" effect="dark" v-else>未初始化</el-tag>
          </div>
        </el-table-column>
        <el-table-column 
          label="最后更新时间" 
          align="center" 
          prop="updated_at" 
          sortable="custom" 
          :formatter="(row) => row.updated_at === row.created_at ? '-' : new Date(row.updated_at).toLocaleString()"
        >
        </el-table-column>
        <el-table-column label="底图" align="center" prop="image" sortable="custom">
          <div slot-scope="{row}">
            <KdxImage :src="row.image" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="蒙版图" align="center" prop="overlay_image" sortable="custom">
          <div slot-scope="{row}">
            <KdxImage :src="row.overlay_image" v-if="row.overlay_image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <div slot-scope="{row}">
            <el-row>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="openCustomizeEditDlg(row)" plain>编辑</el-button>
              </el-col>
              <el-col :span="12">
                <el-button type="primary" size="mini" style="width: 100%" @click="batchCustomize(row.name)" plain>设置定制配置</el-button>
              </el-col>
            </el-row>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :style="{textAlign:'right'}"
          :page-sizes="[10, 20, 30, 50, 100, 200, 300, 500, 1000]"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, prev, next, jumper, sizes"
      ></el-pagination>

      <TemuDlgCustomizeEdit :edit="canvasDrawer.row" :visible="canvasDrawer.visible" @suc="getTableData" @close="canvasDrawer.visible=false"></TemuDlgCustomizeEdit>
      <TemuDlgCustomizeBatchEdit :edit="customizeBatchEditDlg.rows" :visible="customizeBatchEditDlg.visible" @suc="getTableData" @close="customizeBatchEditDlg.visible=false"></TemuDlgCustomizeBatchEdit>
      <TemuDlgBatchCustomize :ext_codes="batchCustomizeDlg.ext_codes" :visible="batchCustomizeDlg.visible" @close="batchCustomizeDlg.visible=false" @suc="getTableData"></TemuDlgBatchCustomize>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {customizeListByPage} from '@/api/temu/customize';
import TemuDlgCustomizeEdit from "@/view/temu/components/dlg_customize_edit.vue";
import TemuDlgCustomizeBatchEdit from "@/view/temu/components/dlg_customize_batch_edit.vue";
import KdxImage from "@/components/image/image.vue";
import TemuDlgBatchCustomize from "@/view/temu/product/components/dlg_batch_customize.vue";

export default {
  components: {TemuDlgBatchCustomize, KdxImage, TemuDlgCustomizeEdit, TemuDlgCustomizeBatchEdit},
  mixins: [infoList],
  data() {
    return {
      listApi: customizeListByPage,
      
      canvasDrawer: {
        row: undefined,
        visible: false
      },

      customizeBatchEditDlg: {
        rows: [],
        visible: false
      },

      batchCustomizeDlg: {
        ext_codes: [],
        visible: false,
      },
    }
  },
  methods: {
    openCustomizeEditDlg(row) {
      this.canvasDrawer.row = row
      this.canvasDrawer.visible = true
    },
    async batchCustomize(name) {
      this.batchCustomizeDlg.ext_codes = [name]
      this.batchCustomizeDlg.visible = true
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