<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.warehouse_id" placeholder="请选择仓库" filterable clearable
                         style="width: 100%">
                <el-option v-for="(item, index) in warehouseOptions" :key="index"
                           :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="请输入产品名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku" v-model="searchInfo.sku" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="仓库名" prop="warehouse.name" align="center">
        </el-table-column>
        <el-table-column label="名字" prop="goods.name" align="center">
        </el-table-column>
        <el-table-column label="货号" prop="goods.sku" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.goods.image" v-if="row.goods && row.goods.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="最近更新时间" prop="updated_at" align="center">
          <div slot-scope="{row}">
            {{new Date(row.updated_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="库存" prop="count" align="center">
        </el-table-column>
        <el-table-column label="单位" prop="goods.unit" align="center">
        </el-table-column>
        <el-table-column label="公开状态" align="center">
          <div slot-scope="{row}">
            <template v-if="row.goods">
              {{row.goods.group_id === 0 ? "公开" : (groupId === row.goods.group_id ? "本司" : "他司")}}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%" type="primary" @click="openEditInventoryDlg(row)" plain>编辑</el-button>
            <el-button size="mini" style="width: 100%" type="primary" @click="openInventoryLogDlg(row)" plain>变更日志</el-button>
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

    <TemuDlgEditInventory :row="editInventoryDlg.row" :visible="editInventoryDlg.visible" @close="editInventoryDlg.visible=false" @update="getTableData"></TemuDlgEditInventory>
    <TemuDlgInventoryLogs :inventory_id="inventoryLogsDlg.inventoryId" :visible="inventoryLogsDlg.visible" @close="inventoryLogsDlg.visible=false" @update="getTableData"></TemuDlgInventoryLogs>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {factoryWarehouseInventoryListByPage} from "@/api/factory_warehouse/inventory";
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import TemuDlgEditInventory from "@/view/factory_warehouse/inventory/components/dlg_edit_inventory.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";
import {factoryWarehouseWarehouseList} from "@/api/factory_warehouse/warehouse";
import TemuDlgInventoryLogs from "@/view/factory_warehouse/inventory/components/dlg_inventory_logs.vue";

export default {
  components: {
    TemuDlgInventoryLogs,
    TemuDlgDiagramEdit,
    TemuDlgEditInventory,
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
      listApi: factoryWarehouseInventoryListByPage,
      selectRows: [],
      timeoutId: undefined,
      warehouseOptions: [],
      editInventoryDlg: {
        row: undefined,
        visible: false,
      },
      inventoryLogsDlg: {
        inventoryId: undefined,
        visible: false,
      }
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length <= 0) {
        return
      }

      let skus = this.selectRows.map((item) => {
        return item.sku
      })
      this.copy(skus.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    openEditInventoryDlg(row) {
      this.editInventoryDlg.row = row
      this.editInventoryDlg.visible = true
    },
    openInventoryLogDlg(row) {
      this.inventoryLogsDlg.inventoryId = row.id
      this.inventoryLogsDlg.visible = true
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await factoryWarehouseWarehouseList()
    if (!resp.code) {
      this.warehouseOptions = (resp.data || []).sort((a, b) => {
        return a.id - b.id
      })
    }

    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
</style>