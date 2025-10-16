<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择定制状态" v-model="searchInfo.order_status" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option label="待处理" :value="1"></el-option>
                <el-option label="成功" :value="2"></el-option>
                <el-option label="失败" :value="3"></el-option>
                <el-option label="生成中" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="订单号" v-model="searchInfo.order_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="syncCustomizeOrder">同步定制信息
            </el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onDxmSync">同步店小秘
            </el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="onBatchEdit">批量编辑</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" show-summary
                :summary-method="getSummaries" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center"></el-table-column>
        <el-table-column label="订单号" prop="order_id" align="center"></el-table-column>
        <el-table-column label="货号" prop="ext_code" align="center"></el-table-column>
        <el-table-column label="图片" prop="image" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.image" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <div slot-scope="{row}">
            <div v-if="row.order">
              {{ statusName(row.order.status) }}

              <div style="font-size: 12px; color: red" v-if="row.order.fail_reason">
                失败原因: {{ row.order.fail_reason }}
              </div>
            </div>
            <div v-else>
              <el-tag type="danger" effect="dark">未同步到定制单</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品图" prop="text" align="center">
          <div slot-scope="{row}">
            <KdxImage width="100%" height="100%" :src="meta(row.order, `Image`)"
                      v-if="meta(row.order, `Image`)"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="定制文字" prop="text" align="center">
          <div slot-scope="{row}">
            <div v-for="(t, index) in meta(row.order, 'Text').split(`\n`)" :key="index">
              {{t}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="预览图" prop="text" align="center">
          <div slot-scope="{row}">
            <KdxImage width="100%" height="100%" :src="meta(row.order, `Image.Preview`)"
                      v-if="meta(row.order, `Image.Preview`)"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="加工图" align="center" sortable="custom" width="400px">
          <div slot-scope="{row}">
            <template v-if="row.order">
              <el-card class="box-card" v-for="(gen, index) in row.order.gen_list" :key="index">
                <div slot="header" class="clearfix">
                  <span>材质: {{gen.print_material}}(数量: {{gen.count}})</span>
                </div>
                <div>
                  <el-row :gutter="5">
                    <el-col :span="12">
                      <KdxImage width="100%" height="100%" style="background-color: lightblue" :src="gen.png_url" :imageViewWidth="1000" v-if="gen.png_url"></KdxImage>
                    </el-col>
                    <el-col :span="12">
                      <KdxImage width="100%" height="100%" style="background-color: lightblue" :src="gen.svg_url" v-if="gen.svg_url"></KdxImage>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" style="width: 100%" @click="openDlgOrderEditor(row.order)"
                       v-if="row.order">编辑
            </el-button>
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

      <CustomizeDlgEditorV3 :order_ids="dlgOrder.ids" :visible="dlgOrder.visible" @close="dlgOrder.visible=false"
                            @suc="getTableData"></CustomizeDlgEditorV3>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import CustomizeDlgEditorV3 from "@/view/customize_v3/editor.vue";
import {dxmSync} from "@/api/dxm/sync";
import {customizeSemiOrderList, customizeSemiOrderSync} from "@/api/customize_v3/semi";

export default {
  components: {
    CustomizeDlgEditorV3,
    KdxImage
  },
  mixins: [infoList],
  computed: {},
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
      listApi: customizeSemiOrderList,

      statusOptions: [
        {id: 0, name: "待审核"},
        {id: 1, name: "待处理"},
        {id: 2, name: "待发货"},
        {id: 3, name: "待收货"},
        {id: 4, name: "已收货"},
      ],

      dlgOrder: {
        ids: [],
        visible: false,
      },

      selectRows: [],
    }
  },
  methods: {
    meta(row, key) {
      if (!row) {
        return ""
      }

      if (!row.data_list) {
        return ""
      }

      let v = row.data_list.find((d) => {
        return d.id === key
      })
      if (!v) {
        return ""
      }
      return v.value
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
          return "成功"
        }
        case 2: {
          return "失败"
        }
        case 3: {
          return "生成中"
        }
      }
    },
    onBatchEdit() {
      if (this.selectRows.length <= 0) {
        this.$message.error("请选择需要编辑的参数")
        return
      }
      this.dlgOrder.ids = this.selectRows.filter(item => {
        return item.order
      }).map((item) => {
        return item.order.id
      })
      this.dlgOrder.visible = true
    },
    openDlgOrderEditor(order) {
      this.dlgOrder.ids = [order.id]
      this.dlgOrder.visible = true
    },
    async syncCustomizeOrder() {
      let resp = await customizeSemiOrderSync()
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async onDxmSync() {
      let resp = await dxmSync()
      if (resp.code !== 0) {
        return
      }

      if (resp.data) {
        this.$message("同步成功，请不要过快同步")
      } else {
        this.$message("同步失败，请稍后再试")
      }
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "count") {
          const values = data ? data.map(item => {
            return item.count
          }) : [];
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
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 500
    this.$set(this.searchInfo, "status", 0)
    this.getTableData()
  },
  updated() {
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 80px;
    padding: 0px;
  }

  .item-bottom {
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    height: 24px;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 0;
    padding-top: 0;
  }
}
::v-deep .el-card__body, .el-main {
  padding: 5px;
}
::v-deep .el-card__header {
  padding: 5px;
}
</style>