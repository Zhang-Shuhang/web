<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
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
              <el-input placeholder="订单id" v-model="searchInfo.order_id" clearable filterable
                        @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="物流单号" v-model="searchInfo.tracking_number" clearable filterable
                        @keyup.enter.native="onSubmit"></el-input>
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
          <el-col :xs="8" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateDlg">创建采购单</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="3">
            <div>
              <el-popover placement="left" trigger="click">
                <div>
                  <el-select size="mini" v-model="dxm.warehouse_id" placeholder="请选择仓库" filterable
                             clearable style="width: 100%">
                    <el-option v-for="(item, index) in warehouseOptions" :key="index"
                               :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </div>
                <div>
                  <el-input size="mini" style="width: 100%" v-model="dxm.po_number" placeholder="店小秘单号"></el-input>
                </div>
                <el-button size="mini" style="width: 100%" type="primary" @click="createFromDxm"
                           :disabled="!dxm.po_number || !dxm.warehouse_id">创建
                </el-button>
                <el-button slot="reference" size="mini" type="primary" style="width: 100%">同步店小秘</el-button>
              </el-popover>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="订单Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="仓库" prop="warehouse.name" align="center">
        </el-table-column>
        <el-table-column label="供应商" prop="provider.name" align="center">
        </el-table-column>
        <el-table-column label="物流单号" prop="tracking_numbers" align="center">
          <div slot-scope="{row}">
            <template v-if="row.tracking_numbers">
              <div v-for="(tn, index) in row.tracking_numbers.split(',')" :key="index">
                <el-link size="mini" type="primary" :href="`https://kuaidi100.com/result.jsp?nu=${tn}`" target="_blank">
                  {{ tn }}
                </el-link>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <div slot-scope="{row}">
            {{ new Date(row.created_at).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column label="产品名" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.items" :key="index">
              <div v-if="item.goods">
                {{ item.goods.name }}
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品图片" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.items" :key="index">
              <div v-if="item.goods">
                <KdxImage :src="item.goods.image" v-if="item.goods.image"></KdxImage>
              </div>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="量" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.items" :key="index">
              <div>
                {{ item.receive }} / {{ item.count }}
                <template v-if="item.goods">({{ item.goods.unit }})</template>
              </div>
            </div>
            <div class="footer">
              {{ totalReceive(row) }} / {{ totalCount(row) }}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <div style="margin-bottom: 5px">
              <el-button size="mini" type="primary" style="width: 100%" @click="openEditDlg(row)">更新</el-button>
            </div>
            <div style="margin-bottom: 5px">
              <el-button size="mini" type="danger" style="width: 100%" v-if="canDelete(row)">删除</el-button>
            </div>
            <div v-if="!canDelete(row)">
              <el-button size="mini" type="primary" style="width: 100%" @click="openPurchaseOrderLogDlg(row)">变更日志</el-button>
            </div>
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

    <TemuDlgEditPurchaseOrder :row="editPurchaseOrderDlg.row" :warehouses="warehouseOptions"
                              :visible="editPurchaseOrderDlg.visible"
                              @close="editPurchaseOrderDlg.visible=false"
                              @update="getTableData"></TemuDlgEditPurchaseOrder>
    <TemuDlgPurchaseOrderLogs :order_id="purchaseOrderLogDlg.purchaseOrderId" :order_item_id="purchaseOrderLogDlg.purchaseOrderItemId"
                              :visible="purchaseOrderLogDlg.visible"
                              @close="purchaseOrderLogDlg.visible=false"
                              @update="getTableData"></TemuDlgPurchaseOrderLogs>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  factoryWarehousePurchaseOrderCreateFromDxm,
  factoryWarehousePurchaseOrderListByPage
} from "@/api/factory_warehouse/purchase_order";
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import TemuDlgEditPurchaseOrder
  from "@/view/factory_warehouse/purchase_order/components/dlg_edit_purchase_order.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";
import {factoryWarehouseWarehouseList} from "@/api/factory_warehouse/warehouse";
import TemuDlgPurchaseOrderLogs from "@/view/factory_warehouse/purchase_order/components/dlg_purchase_order_logs.vue";

export default {
  components: {
    TemuDlgPurchaseOrderLogs,
    TemuDlgDiagramEdit,
    TemuDlgEditPurchaseOrder,
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
      listApi: factoryWarehousePurchaseOrderListByPage,
      selectRows: [],
      timeoutId: undefined,
      warehouseOptions: [],
      editPurchaseOrderDlg: {
        row: undefined,
        visible: false,
      },
      purchaseOrderLogDlg: {
        purchaseOrderId: undefined,
        purchaseOrderItemId: undefined,
        visible: false,
      },
      dxm: {
        warehouse_id: undefined,
        po_number: "",
      },
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length <= 0) {
        return
      }

      let orderIds = this.selectRows.map((item) => {
        return item.id
      })
      this.copy(orderIds.join(" "))
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    openCreateDlg() {
      this.editPurchaseOrderDlg.row = undefined
      this.editPurchaseOrderDlg.visible = true
    },
    openEditDlg(row) {
      this.editPurchaseOrderDlg.row = row
      this.editPurchaseOrderDlg.visible = true
    },
    openPurchaseOrderLogDlg(row) {
      this.purchaseOrderLogDlg.purchaseOrderId = row.id
      this.purchaseOrderLogDlg.purchaseOrderItemId = row.id
      this.purchaseOrderLogDlg.visible = true
    },
    async createFromDxm() {
      if (!this.dxm.warehouse_id) {
        this.$message.error("请选择仓库")
        return
      }
      if (!this.dxm.po_number) {
        this.$message.error("请填写店小秘采购单号")
        return
      }

      let resp = await factoryWarehousePurchaseOrderCreateFromDxm(this.dxm)
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    totalReceive(row) {
      let count = 0
      row.items.forEach(item => {
        count += Number(item.receive)
      })
      return count
    },
    totalCount(row) {
      let count = 0
      row.items.forEach(item => {
        count += Number(item.count)
      })
      return count
    },
    canDelete(row) {
      return this.totalReceive(row) == 0
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
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 85px;
    padding: 0px;
  }

  .item-bottom {
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background-color: lightblue;
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
</style>