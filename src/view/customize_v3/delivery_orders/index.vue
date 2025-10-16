<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="2">
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
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="查看订单" v-model="searchInfo.only_self" filterable clearable style="width: 100%">
                <el-option label="全部"></el-option>
                <el-option label="自己" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="FH单号" v-model="searchInfo.delivery_order_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.ext_codes" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="WB单号" v-model="searchInfo.plan_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="箱唛号" v-model="searchInfo.xm_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="工厂单号" v-model="searchInfo.factory_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="生产单号" v-model="searchInfo.produce_nos" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="selectRows">
            <el-button size="mini" type="primary" style="width: 100%" @click="onPb">排版</el-button>
          </el-col>
<!--          <el-col :xs="6" :sm="6" :lg="3">-->
<!--            <el-button size="mini" type="primary" style="width: 100%" @click="dlgPbRecords.visible = true">排版记录-->
<!--            </el-button>-->
<!--          </el-col>-->
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="syncCustomizeOrder">同步定制信息
            </el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="onBatchEdit">批量编辑</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="onExport">导出图片</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="canMatchRows.length">
            <el-button size="mini" type="danger" style="width: 100%" @click="onMatch">自动匹配图纸</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="openExportDlg">导出记录</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onMarkComplete">标记完成</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="openJsxGenerateDlg">生成jsx</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" show-summary
                :summary-method="getSummaries" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="箱唛Id" prop="detail_id" align="center"></el-table-column>
        <el-table-column label="定制Id" prop="fulfillment_product_sku_id" align="center"></el-table-column>
        <el-table-column label="SkuId" prop="product_sku_id" align="center"></el-table-column>
        <el-table-column label="货号" prop="variation.ext_code" align="center">
          <div slot-scope="{row}">
            <template v-if="row.variation && row.variation.ext_code">
              <div>{{row.variation.ext_code}}</div>
              <el-button type="primary" size="mini" style="width: 100%" @click="batchCustomize(row.variation.ext_code)" plain>设置定制配置</el-button>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="数量" prop="count" align="center"></el-table-column>
        <el-table-column label="图片" prop="variation.thumb_url" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.variation.thumb_url" v-if="row.variation"></KdxImage>
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
        <el-table-column label="定制文字" prop="text" align="center">
          <div slot-scope="{row}">
            <div v-for="(t, index) in meta(row.order, 'Text').split(`\n`)" :key="index">
              {{ t }}
            </div>
          </div>
        </el-table-column>
        <!--        <el-table-column label="用户上传图" prop="text" align="center">-->
        <!--          <div slot-scope="{row}">-->
        <!--            <KdxImage width="100%" height="100%" :src="meta(row.order, `Image.UserUpload`)" v-if="meta(row.order, `Image.UserUpload`)"></KdxImage>-->
        <!--          </div>-->
        <!--        </el-table-column>-->
        <!--        <el-table-column label="用户选择图" prop="text" align="center">-->
        <!--          <div slot-scope="{row}">-->
        <!--            <KdxImage width="100%" height="100%" :src="meta(row.order, `Image.UserSelect`)" v-if="meta(row.order, `Image.UserSelect`)"></KdxImage>-->
        <!--          </div>-->
        <!--        </el-table-column>-->
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
        <el-table-column label="操作" prop="inner_image" align="center">
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
      <CustomizeDlgPbRecords :visible="dlgPbRecords.visible"
                             @close="dlgPbRecords.visible=false"></CustomizeDlgPbRecords>
      <CustomizeDlgExportList :visible="exportDlg.visible" @close="exportDlg.visible=false"></CustomizeDlgExportList>
      <TemuDlgBatchCustomize :ext_codes="batchCustomizeDlg.ext_codes" :visible="batchCustomizeDlg.visible" @close="batchCustomizeDlg.visible=false" @suc="getTableData"></TemuDlgBatchCustomize>
      <CustomizeDlgJsxGenerate :array="jsxGenerateDlg.array" :visible="jsxGenerateDlg.visible" @close="jsxGenerateDlg.visible=false"></CustomizeDlgJsxGenerate>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {
  customizeDeliveryOrdersList,
  customizeDeliveryOrdersPb,
  customizeDeliveryOrdersSync
} from "@/api/customize_v3/delivery_order";
import CustomizeDlgPbRecords from "@/view/customize_v3/components/dlg_pb_record.vue";
import {customizeOrderExport, customizeOrderMarkComplete, customizeOrderMatch} from "@/api/customize_v3/order";
import CustomizeDlgEditorV3 from "@/view/customize_v3/editor.vue";
import CustomizeDlgExportList from "@/view/customize_v3/components/dlg_export_list.vue";
import TemuDlgBatchCustomize from "@/view/temu/product/components/dlg_batch_customize.vue";
import CustomizeDlgJsxGenerate from "@/view/customize_v3/components/dlg_jsx_generate.vue";

export default {
  components: {
    CustomizeDlgJsxGenerate,
    TemuDlgBatchCustomize,
    CustomizeDlgExportList,
    CustomizeDlgEditorV3,
    CustomizeDlgPbRecords,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    canMatchRows() {
      return (this.selectRows || []).filter(row => row.order && (row.order.status === 0 || row.order.status === 2));
    }
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
        visible: false,
      },

      dlgPbRecords: {
        visible: false,
      },

      selectRows: [],

      exportDlg: {
        visible: false,
      },

      jsxGenerateDlg: {
        array: [],
        visible: false,
      },

      batchCustomizeDlg: {
        ext_codes: [],
        visible: false,
      },
    }
  },
  methods: {
    onPb() {
      if (this.selectRows.length <= 0) {
        this.$message.error("请选择需要打印的产品")
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.id
      })
      this.$confirm('是否确认排版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await customizeDeliveryOrdersPb({ids: ids})
        if (resp.code) {
          return
        }

        this.$message("任务排期成功，请稍后查看排版队列")
        this.getTableData()
      })
    },
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
    async openExportDlg() {
      this.exportDlg.visible = true
    },
    async openJsxGenerateDlg() {
      this.jsxGenerateDlg.array = []
      this.selectRows.forEach((item) => {
        let data = {}
        data.id = item.fulfillment_product_sku_id
        data.texts = []
        let texts = this.meta(item.order, 'Text').split(`\n`)
        for (let i = 0; i < texts.length; i++) {
          data.texts.push({
            key: `[Line${i+1}]`,
            value: texts[i],
          })
        }
        this.jsxGenerateDlg.array.push(data)
      })
      this.jsxGenerateDlg.visible = true
    },
    async onMatch() {
      if (this.canMatchRows.length <= 0) {
        this.$message.error("请选择需要匹配的订单")
        return
      }
      let data = {
        ids: [...new Set(this.canMatchRows.filter(item => {
          return item.order
        }).map((item) => {
          return item.order.id
        }))]
      }
      let resp = await customizeOrderMatch(data)
      if (resp.code) {
        return
      }
      this.$message("匹配结束")
      this.getTableData()
    },
    async onExport() {
      if (this.selectRows.length <= 0) {
        this.$message.error("请选择需要编辑的参数")
        return
      }
      let data = {}
      data.ids = this.selectRows.map((item) => {
        return item.id
      })
      data.order_ids = [...new Set(this.selectRows.filter(item => {
        return item.order
      }).map((item) => {
        return item.order.id
      }))]
      let resp = await customizeOrderExport(data)
      if (resp.code) {
        return
      }
      this.$message("导出中，请查看导出列表")
    },
    openDlgOrderEditor(order) {
      this.dlgOrder.ids = [order.id]
      this.dlgOrder.visible = true
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
      return item.personal_text.split(separator ? separator : '\n').filter((item) => {
        return item !== ""
      })
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
    onMarkComplete() {
      this.$confirm('是否确认标记完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await customizeOrderMarkComplete()
            if (resp.code) {
              return
            }

            this.$message("标记成功")
            this.getTableData()
          })
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
    this.pageSize = 500
    this.$set(this.searchInfo, "status", 0)
    this.$set(this.searchInfo, "only_self", 1)
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