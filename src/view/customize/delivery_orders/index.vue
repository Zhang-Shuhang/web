<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="请选择定制状态" v-model="searchInfo.order_status" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option label="待处理" :value="1"></el-option>
                <el-option label="自动成功" :value="2"></el-option>
                <el-option label="手动成功" :value="3"></el-option>
                <el-option label="失败" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="查看订单" v-model="searchInfo.only_self" filterable clearable style="width: 100%">
                <el-option label="全部"></el-option>
                <el-option label="自己" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="FH单号" v-model="searchInfo.delivery_order_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="WB单号" v-model="searchInfo.plan_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="箱唛号" v-model="searchInfo.xm_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="工厂单号" v-model="searchInfo.factory_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows">
            <el-button size="mini" type="primary" style="width: 100%" @click="onPb">排版</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="dlgPbRecords.visible = true">排版记录</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="syncCustomizeOrder">同步定制信息</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="onBatchEdit">批量编辑</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onMarkComplete">标记完成</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" show-summary :summary-method="getSummaries" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="箱唛Id" prop="detail_id" align="center"></el-table-column>
        <el-table-column label="定制Id" prop="fulfillment_product_sku_id" align="center"></el-table-column>
        <el-table-column label="SkuId" prop="product_sku_id" align="center"></el-table-column>
        <el-table-column label="货号" prop="variation.ext_code" align="center"></el-table-column>
        <el-table-column label="数量" prop="count" align="center"></el-table-column>
        <el-table-column label="图片" prop="variation.thumb_url" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.variation.thumb_url" v-if="row.variation"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="定制数据" align="center">
          <el-table-column label="状态" align="center">
            <div slot-scope="{row}">
              <div v-if="row.order">
                {{statusName(row.order.status)}}

                <div style="font-size: 12px; color: red" v-if="row.order.fail_reason">
                  失败原因: {{row.order.fail_reason}}
                </div>
              </div>
              <div v-else>
                <el-tag type="danger" effect="dark">未同步到定制单</el-tag>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="定制内容" prop="personal_text" align="center" width="300px">
            <div slot-scope="{row}">
              <template v-if="row.order">
                <template v-if="row.order.personal_text">
                  <div v-for="(t, index) in personalTextList(row.order)" :key="index">
                    <el-tag size="mini" :type="personalTextList(row.order).length > (row.order.items ? row.order.items.length : 0) ? 'danger' : 'primary'" effect="dark">第{{index+1}}段: {{t}}[长: {{t.length}}]</el-tag>
                  </div>
                </template>
                <el-row :gutter="5">
                  <el-col :span="8">
                    <KdxImage :src="row.order.user_upload_image" width="100%" height="100%" v-if="row.order.user_upload_image"></KdxImage>
                  </el-col>
                  <el-col :span="8">
                    <KdxImage :src="row.order.user_select_image" width="100%" height="100%" v-if="row.order.user_select_image"></KdxImage>
                  </el-col>
                  <el-col :span="8">
                    <KdxImage :src="row.order.preview_image" width="100%" height="100%" v-if="row.order.preview_image"></KdxImage>
                  </el-col>
                </el-row>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="加工图" align="center" width="200px">
            <template slot-scope="{row}">
              <div style="background-color: lightblue" v-if="row.order">
                <KdxImage :src="row.order.thumbnail_svg_url" width="100%" height="100%" v-if="row.order.thumbnail_svg_url"></KdxImage>
                <div style="width: 100%; height: 100%" v-html="row.order.thumbnail_svg" v-else-if="row.order.thumbnail_svg"></div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" prop="inner_image" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" style="width: 100%" @click="openDlgOrderEditor(row.order)" v-if="row.order">编辑</el-button>
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

      <CustomizeDlgEditor :order_id="dlgOrder.id" :visible="dlgOrder.visible" @close="dlgOrder.visible=false" @suc="editSuc"></CustomizeDlgEditor>
      <CustomizeDlgPbRecords :visible="dlgPbRecords.visible" @close="dlgPbRecords.visible=false"></CustomizeDlgPbRecords>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import CustomizeDlgEditor from "@/view/customize/editor.vue";
import {
  customizeDeliveryOrdersList,
  customizeDeliveryOrdersPb,
  customizeDeliveryOrdersSync
} from "@/api/customize/delivery_order";
import CustomizeDlgPbRecords from "@/view/customize/components/dlg_pb_record.vue";
import {customizeOrderMarkComplete} from "@/api/customize/order";

export default {
  components: {
    CustomizeDlgPbRecords,
    CustomizeDlgEditor,
    KdxImage
  },
  mixins: [infoList],
  computed: {
  },
  watch: {
    searchInfo: {
      handler() {
        this.page = 1
        this.getTableData()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: customizeDeliveryOrdersList,

      statusOptions: [
        {id: 0, name: "待审核"},
        {id: 1, name: "待处理"},
        {id: 2, name: "待发货"},
        {id: 3, name: "待收货"},
        {id: 4, name: "已收货"},
      ],

      dlgOrder: {
        ids: [],
        id: 0,
        visible: false,
      },

      dlgPbRecords: {
        visible: false,
      },

      selectRows: [],
    }
  },
  methods: {
    onPb() {
      if (this.selectRows.length <= 0) {
        this.$message.error("请选择需要打印的产品")
        return
      }

      let ids = this.selectRows.map((item) => {return item.id})
      this.$confirm('是否确认排版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async ()=>{
            let resp = await customizeDeliveryOrdersPb({ids: ids})
            if (resp.code) {
              return
            }

            this.$message("任务排期成功，请稍后查看排版队列")
            this.getTableData()
          })
    },
    selectionChange(val) {
      this.selectRows = val
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    statusName(s) {
      switch (s) {
        case 0: {
          return "待处理"
        }
        case 1: {
          return "自动成功"
        }
        case 2: {
          return "手动成功"
        }
        case 3: {
          return "失败"
        }
      }
    },
    onBatchEdit() {
      if (this.selectRows.length <= 0) {
        this.$message.error("请选择需要编辑的参数")
        return
      }
      this.dlgOrder.ids = this.selectRows.filter(item => {return item.order}).map((item) => {return item.order.id})
      this.dlgOrder.id = this.dlgOrder.ids[0]
      this.dlgOrder.ids.splice(0, 1)
      this.dlgOrder.visible = true
    },
    openDlgOrderEditor(order) {
      this.dlgOrder.ids = []
      this.dlgOrder.id = order.id
      this.dlgOrder.visible = true
    },
    editSuc() {
      if (this.dlgOrder.ids.length) {
        setTimeout(() => {
          this.dlgOrder.id = this.dlgOrder.ids[0]
          this.dlgOrder.ids.splice(0, 1)
          this.dlgOrder.visible = true
        }, 500)
      } else {
        this.getTableData()
      }
    },
    async syncCustomizeOrder() {
      let resp = await customizeDeliveryOrdersSync()
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    personalTextList(item) {
      let separator = "\n"
      if (item.separator) {
        separator = item.separator
      }
      return item.personal_text.split(separator ? separator : '\n').filter((item)=>{return item !== ""})
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "count") {
          const values = data ? data.map(item => { return item.count }) : [];
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总计: " + sums[index].toFixed(0)
        }
      });

      return sums;
    },
    onMarkComplete() {
      this.$confirm('是否确认标记完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async ()=>{
            let resp = await customizeOrderMarkComplete()
            if (resp.code) {
              return
            }

            this.$message("标记成功")
            this.getTableData()
          })
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 20
    this.$set(this.searchInfo, "status", 0)
    this.$set(this.searchInfo, "only_self", 1)
    this.getTableData()
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
</style>