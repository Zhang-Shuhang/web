<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="3" :lg="3" :offset="isMobile ? 12 : 18">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="3" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateDlg">创建工厂仓库</el-button>
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
        <el-table-column label="所属工厂" prop="factory_id" align="center">
          <div slot-scope="{row}">
            {{factoryName(row.factory_id)}}
          </div>
        </el-table-column>
        <el-table-column label="公开状态" align="center">
          <div slot-scope="{row}">
            {{row.group_id === 0 ? "公开" : (groupId === row.group_id ? "本司" : "他司")}}
          </div>
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
            <el-button size="mini" style="width: 100%" type="primary" @click="openEditWarehouseDlg(row)" plain>编辑</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>

    <TemuDlgEditWarehouse :row="editWarehouseDlg.row" :factories="factoryOptions" :visible="editWarehouseDlg.visible" @close="editWarehouseDlg.visible=false" @update="onSubmit"></TemuDlgEditWarehouse>
  </div>

</template>

<script>
import {factoryWarehouseWarehouseList} from "@/api/factory_warehouse/warehouse";
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import TemuDlgEditWarehouse from "@/view/factory_warehouse/warehouse/components/dlg_edit_warehouse.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";
import {factoryWarehouseFactoryList} from "@/api/factory_warehouse/factory";

export default {
  components: {
    TemuDlgDiagramEdit,
    TemuDlgEditWarehouse,
    KdxImage
  },
  computed: {
    ...mapGetters("user", ["groupId"]),
  },
  mixins: [],
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
      searchInfo: {
        name: "",
      },
      tableData: [],
      selectRows: [],
      timeoutId: undefined,
      isMobile: false,
      factoryOptions: [],
      editWarehouseDlg: {
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
    async onSubmit() {
      let resp = await factoryWarehouseWarehouseList(this.searchInfo)
      if(resp.code) {
        return
      }
      this.tableData = resp.data
    },
    openCreateDlg() {
      this.editWarehouseDlg.row = undefined
      this.editWarehouseDlg.visible = true
    },
    openEditWarehouseDlg(row) {
      this.editWarehouseDlg.row = row
      this.editWarehouseDlg.visible = true
    },
    factoryName(id) {
      let op = this.factoryOptions.find((item) => item.id === id)
      if (op) {
        return op.name
      }
      return `未知: ${id}`
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

    let resp = await factoryWarehouseFactoryList()
    if (!resp.code) {
      this.factoryOptions = resp.data
    }

    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
</style>