<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="8" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.platform" multiple collapse-tags clearable filterable :style="{width: '100%'}">
                <el-option v-for="(item, index) in platformOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_hide_complete" clearable filterable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="隐藏已完成" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="任务编号" v-model="searchInfo.batch_group_ids" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openScanPrintCodeAndXmDlg">扫描打印条码/箱唛</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openScanPrintCodeAndXmV2Dlg">扫描打印条码/箱唛V2</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openItemDlg">查找产品</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="平台" prop="platform" align="center" width="100">
          <div slot-scope="{row}">
            <el-tag size="mini" effect="dark" v-if="row.platform===0">Temu</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===1">Tiktok</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===2">Shein</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===3">外发</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===4">亚马逊</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===5">Temu Y2</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="信息" prop="id" align="center" width="120">
          <div slot-scope="{row}">
            <div>
              {{row.id}}
              <el-tag type="primary" size="mini" v-if="row.is_customize">定制</el-tag>
              <el-tag type="primary" size="mini" v-else-if="row.is_jit">JIT</el-tag>
            </div>
            <div>
              <el-button size="mini" type="primary" @click="hide(row.id)">隐藏</el-button>
            </div>
            <div style="margin-top: 5px" v-if="row.is_jit">
              <el-button size="mini" type="warning" @click="checkDiagram(row.id)">检查图纸</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center" width="100">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="任务包" align="center" width="100">
          <div slot-scope="{row}">
            <el-link size="mini" type="primary" :href="row.zip_url" :underline="false" target="_blank" v-if="row.zip_url">任务包</el-link>
          </div>
        </el-table-column>
        <el-table-column label="装箱Id" align="center" width="100">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              {{ box.id }}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="收货仓" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              {{ box.code }}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="物流" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              {{ box.express_sn }}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品数/未打印/未扫描" align="center" width="150px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-tag type="primary" size="mini">{{box.total_item_count}}/{{box.total_not_print_count}}/{{box.total_not_scan_count}}</el-tag>
            </div>
            <div class="footer">
              <el-tag type="primary" size="mini">{{row.total_item_count}}/{{row.total_not_print_count}}/{{row.total_not_scan_count}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="未生成图纸" align="center" width="100px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-tag type="danger" size="mini" effect="dark" v-if="box.total_not_generate_diagram">{{box.total_not_generate_diagram}}</el-tag>
              <el-tag type="primary" size="mini" v-else>全部生成</el-tag>
            </div>
            <div class="footer">
              <el-tag type="danger" size="mini" effect="dark" v-if="row.total_not_generate_diagram">{{row.total_not_generate_diagram}}</el-tag>
              <el-tag type="primary" size="mini" v-else>全部生成</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="未生产中" align="center" width="100px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-tag type="danger" size="mini" effect="dark" v-if="box.total_not_start_producing">{{box.total_not_start_producing}}</el-tag>
              <el-tag type="primary" size="mini" v-else>全部生产中</el-tag>
            </div>
            <div class="footer">
              <el-tag type="danger" size="mini" effect="dark" v-if="row.total_not_start_producing">{{row.total_not_start_producing}}</el-tag>
              <el-tag type="primary" size="mini" v-else>全部生产中</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="箱唛打印进度" align="center" width="220px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-tag type="primary" size="mini" v-if="box.print_count < box.package_count">{{box.print_count}}/{{box.package_count}}</el-tag>
              <el-tag type="success" size="mini" effect="dark" v-else>{{box.print_count}}/{{box.package_count}}</el-tag>
            </div>
            <div class="footer">
              进度: {{row.print_count}}/{{row.package_count}}
              <el-tooltip content="最晚打印时间" v-if="row.last_print_time">
                <el-tag size="mini" type="primary">
                  ({{new Date(row.last_print_time).toLocaleString()}})
                </el-tag>
              </el-tooltip>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="装箱扫描进度" align="center" width="220px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-tag type="success" size="mini" effect="dark" v-if="box.is_printed">全部扫描({{box.package_count}}/{{box.package_count}})</el-tag>
              <template v-else>
                <el-tag type="primary" size="mini">{{box.scan_count}}/{{box.package_count}}</el-tag>
                <el-button style="margin-left: 10px" type="primary" size="mini" @click="resetPackage(box.id)" v-if="box.scan_count">重置进度</el-button>
              </template>
            </div>
            <div class="footer">
              进度: {{row.scan_count}}/{{row.package_count}}
              <el-tooltip content="最晚扫描时间" v-if="row.last_scan_time">
                <el-tag size="mini" type="primary">
                  ({{new Date(row.last_scan_time).toLocaleString()}})
                </el-tag>
              </el-tooltip>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="加急/物流面单" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-link size="mini" type="primary" :href="box.code_url" :underline="false" target="_blank" v-if="box.code_url">打印加急</el-link>
              <template v-if="box.log_pdf_url">
                / <el-link size="mini" type="primary" :href="box.log_pdf_url" :underline="false" target="_blank">打印物流</el-link>
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.box_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(box, index) in row.box_list" :key="index">
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-button size="mini" style="width: 100%" type="primary" @click="openPackageListDlg(box.id)" plain>查看</el-button>
                </el-col>
                <el-col :span="16">
                  <el-button size="mini" style="width: 100%" type="primary" @click="openScanPrintJjDlg(box.id)" plain>扫描打印加急单</el-button>
                </el-col>
              </el-row>
            </div>
            <div class="footer">
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

    <DlgBatchPackages :box_id="dlgBatchPackages.box_id" :visible="dlgBatchPackages.visible" @close="dlgBatchPackages.visible=false"></DlgBatchPackages>
    <DlgScanPrintCodeAndXm :visible="dlgScanPrintCodeAndXm.visible" @close="dlgScanPrintCodeAndXm.visible=false" @update="queryTableData"></DlgScanPrintCodeAndXm>
    <DlgScanPrintCodeAndXmV2 :visible="dlgScanPrintCodeAndXmV2.visible" @close="dlgScanPrintCodeAndXmV2.visible=false" @update="queryTableData"></DlgScanPrintCodeAndXmV2>
    <DlgScanPrintJj :box_id="dlgScanPrintJj.box_id" :visible="dlgScanPrintJj.visible" @close="dlgScanPrintJj.visible=false" @update="queryTableData"></DlgScanPrintJj>
    <DlgItem :visible="dlgItem.visible" @close="dlgItem.visible=false" @update="queryTableData"></DlgItem>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  factoryBatchHide,
  factoryBatchList,
  factoryBatchNotifyNoDiagram,
  factoryBatchResetPackage
} from "@/api/sf-factory-v2/batch";
import DlgBatchPackages from "@/view/sf-factory-v2/components/dlg_batch_packages.vue";
import DlgScanPrintCodeAndXm from "@/view/sf-factory-v2/components/dlg_scan_print_code_and_xm.vue";
import DlgScanPrintCodeAndXmV2 from "@/view/sf-factory-v2/components/dlg_scan_print_code_and_xm_v2.vue";
import DlgScanPrintJj from "@/view/sf-factory-v2/components/dlg_scan_print_jj.vue";
import DlgItem from "@/view/sf-factory-v2/components/dlg_item.vue";

export default {
  components: {
    DlgItem,
    DlgScanPrintJj,
    DlgScanPrintCodeAndXm,
    DlgScanPrintCodeAndXmV2,
    DlgBatchPackages,
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.inited) {
          this.onSubmit()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: factoryBatchList,

      platformOptions: [
        {id: 0, name: "Temu"},
        {id: 1, name: "Tiktok"},
        {id: 2, name: "Shein"},
        {id: 3, name: "外发"},
        {id: 4, name: "亚马逊"},
        {id: 5, name: "Temu Y2"},
        {id: 6, name: "京东"},
      ],

      inited: false,

      dlgBatchPackages: {
        box_id: undefined,
        visible: false,
      },
      dlgScanPrintJj: {
        box_id: undefined,
        visible: false,
      },
      dlgScanPrintCodeAndXm: {
        visible: false,
      },
      dlgScanPrintCodeAndXmV2: {
        visible: false,
      },
      dlgItem: {
        visible: false,
      },
      selectRows: [],
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.id
      })
      this.copy(ids.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    openPackageListDlg(boxId) {
      this.dlgBatchPackages.box_id = boxId
      this.dlgBatchPackages.visible = true
    },
    onSubmit() {
      this.page = 1
      this.queryTableData()
    },
    openScanPrintCodeAndXmDlg() {
      this.dlgScanPrintCodeAndXm.visible = true
    },
    openScanPrintCodeAndXmV2Dlg() {
      this.dlgScanPrintCodeAndXmV2.visible = true
    },
    openItemDlg() {
      this.dlgItem.visible = true
    },
    openScanPrintJjDlg(id) {
      this.dlgScanPrintJj.box_id = id
      this.dlgScanPrintJj.visible = true
    },
    resetPackage(boxId) {
      this.$confirm("确认是否重置扫描进度?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
            let resp = await factoryBatchResetPackage({id: boxId})
            if (resp.code) {
              return
            }

            this.queryTableData()
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
    },
    hide(groupId) {
      this.$confirm("确认是否隐藏?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
            let resp = await factoryBatchHide({id: groupId})
            if (resp.code) {
              return
            }

            this.queryTableData()
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
    },
    async checkDiagram(groupId) {
      let resp = await factoryBatchNotifyNoDiagram({id: groupId})
      if (resp.code) {
        return
      }
      this.$message("消息已发送到企业微信，请注意查收")
    },
    async queryTableData(page = this.page, page_size = this.pageSize) {
      await this.getTableData(page, page_size)
      this.notifyLsatFourSame()
      return
    },
    notifyLsatFourSame() {
      let list = this.tableData.filter((v) => {return v.platform===0})
      if (list.length <= 0) {
        return
      }

      // 收集所有express_sn并去重
      const allExpressSNs = list.flatMap(item =>
          item.box_list.map(box => box.express_sn)
      ).filter((sn) => {return sn !== ""});
      const uniqueSNs = [...new Set(allExpressSNs)];

      // 按后四位分组
      const groups = {};
      uniqueSNs.forEach(sn => {
        const lastFour = sn.slice(-4);
        if (!groups[lastFour]) {
          groups[lastFour] = [];
        }
        groups[lastFour].push(sn);
      });

      // 筛选出后四位重复的组（至少两个不同express_sn）
      let existGroups = Object.values(groups).filter(group => group.length >= 2).map(group => group.join(", ")).join("\n");
      if (existGroups) {
        this.$message.error(`存在后四位重复的物流单号，请务必注意提醒物流商: ${existGroups}`)

        this.$notify({
          title: `存在后四位重复的物流单号，请务必注意提醒物流商:`,
          dangerouslyUseHTMLString: true,
          message: existGroups,
          duration: 10000,
        });
      }
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())
    this.queryTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 28px;
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

::v-deep .el-table .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}
</style>