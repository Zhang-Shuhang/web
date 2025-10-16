<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="请选择状态" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in statusOptions" :key="index"
                           :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.priority" placeholder="请选择优先级" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in priorityOptions" :key="index"
                           :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="产品Sku" v-model="searchInfo.goods_sku" clearable filterable
                        @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateDlg">创建采购需求</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="产品名" prop="goods.name" align="center">
        </el-table-column>
        <el-table-column label="产品Sku" prop="goods.sku" align="center">
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <div slot-scope="{row}">
            {{ new Date(row.created_at).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.goods.image" v-if="row.goods && row.goods.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="需要数量" prop="quantity" align="center">
          <div slot-scope="{row}">
            {{ row.quantity }}
            <template v-if="row.goods">{{ row.goods.unit }}</template>
          </div>
        </el-table-column>
        <el-table-column label="优先级" prop="priority" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" :type="priorityType(row.priority)" effect="dark">
              {{ priorityName(row.priority) }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <div slot-scope="{row}">
            {{ statusName(row.status) }}<template v-if="row.change_status_user_id"><el-tag size="mini" type="primary">({{row.change_status_user_id === userInfo.ID ? "自己" : "他人"}})</el-tag></template>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%" type="primary" @click="updatePurchaseRequire(row, 2)" plain v-if="row.status === 1">接单
            </el-button>
            <el-button size="mini" style="width: 100%" type="primary" @click="updatePurchaseRequire(row, 3)" plain v-if="row.status === 2">完成
            </el-button>
            <el-button size="mini" style="width: 100%" type="danger" @click="updatePurchaseRequire(row, 4)" v-if="row.status <= 2">删除
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

    <TemuDlgEditPurchaseRequire :row="editPurchaseRequireDlg.row" :visible="editPurchaseRequireDlg.visible"
                                @close="editPurchaseRequireDlg.visible=false"
                                @update="getTableData"></TemuDlgEditPurchaseRequire>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  factoryWarehousePurchaseRequireListByPage,
  factoryWarehousePurchaseRequireUpdate
} from "@/api/factory_warehouse/purchase_require";
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import TemuDlgEditPurchaseRequire
  from "@/view/factory_warehouse/purchase_require/components/dlg_edit_purchase_require.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";

export default {
  components: {
    TemuDlgDiagramEdit,
    TemuDlgEditPurchaseRequire,
    KdxImage
  },
  computed: {
    ...mapGetters("user", ["groupId", "userInfo"]),
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
      listApi: factoryWarehousePurchaseRequireListByPage,
      selectRows: [],
      timeoutId: undefined,
      statusOptions: [
        {id: 1, name: "待接单"},
        {id: 2, name: "已接单"},
        {id: 3, name: "已完成"},
        {id: 4, name: "已删除"},
      ],
      priorityOptions: [
        {id: 1, name: "低", type: "primary"},
        {id: 2, name: "中", type: "warning"},
        {id: 3, name: "高", type: "danger"},
      ],
      editPurchaseRequireDlg: {
        row: undefined,
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
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    openCreateDlg() {
      this.editPurchaseRequireDlg.row = undefined
      this.editPurchaseRequireDlg.visible = true
    },
    statusName(status) {
      let op = this.statusOptions.find(item => {
        return item.id === status
      })
      if (!op) {
        return `未知: ${status}`
      }
      return op.name
    },
    priorityName(priority) {
      let op = this.priorityOptions.find(item => {
        return item.id === priority
      })
      if (!op) {
        return `未知: ${priority}`
      }
      return op.name
    },
    priorityType(priority) {
      let op = this.priorityOptions.find(item => {
        return item.id === priority
      })
      if (!op) {
        return "primary"
      }
      return op.type
    },
    updatePurchaseRequire(row, status) {
      if (status === 4) {
        this.$confirm('是否确认删除?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(()=>{
          this.confirmUpdatePurchaseRequire(row, status)
        })
      } else {
        this.confirmUpdatePurchaseRequire(row, status)
      }
    },
    async confirmUpdatePurchaseRequire(row, status) {
      let resp = await factoryWarehousePurchaseRequireUpdate({id: row.id, status: status})
      if (resp.code) {
        return
      }
      this.$message("操作成功!")
      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "status", [1, 2, 3])
    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
</style>