<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="请输入供应商名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateDlg">创建供应商</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center">
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="最近更新时间" prop="updated_at" align="center">
          <div slot-scope="{row}">
            {{new Date(row.updated_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%" type="primary" @click="openEditProviderDlg(row)" plain>编辑</el-button>
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

    <TemuDlgEditProvider :row="editProviderDlg.row" :visible="editProviderDlg.visible" @close="editProviderDlg.visible=false" @update="getTableData"></TemuDlgEditProvider>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {factoryWarehouseProviderListByPage} from "@/api/factory_warehouse/provider";
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import TemuDlgEditProvider from "@/view/factory_warehouse/provider/components/dlg_edit_provider.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";

export default {
  components: {
    TemuDlgDiagramEdit,
    TemuDlgEditProvider,
    KdxImage
  },
  computed: {
    ...mapGetters("user", ["groupId"]),
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (!this.inited) {
          return
        }
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(this.onSubmit, 200)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: factoryWarehouseProviderListByPage,
      selectRows: [],
      timeoutId: undefined,
      editProviderDlg: {
        row: undefined,
        visible: false,
      }
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    openCreateDlg() {
      this.editProviderDlg.row = undefined
      this.editProviderDlg.visible = true
    },
    openEditProviderDlg(row) {
      this.editProviderDlg.row = row
      this.editProviderDlg.visible = true
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
</style>