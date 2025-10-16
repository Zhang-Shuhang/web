<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.type" placeholder="请选择条件" filterable style="width: 100%">
                <el-option label="生产任务编号" :value="0"></el-option>
                <el-option label="定制+JIT生产任务" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.ids" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openDlgAuditList">记录</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2" v-if="canSelectCreate">
            <el-form-item label-width="0">
              <el-button type="warning" :style="{width: '100%'}" @click="create">创建</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="0">
              <el-button type="warning" :style="{width: '100%'}" @click="downloadImages">下载图片</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item label-width="0">
              <el-button type="danger" :style="{width: '100%'}" @click="notifyJit">检查JIT</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="货号" prop="sku_code" align="center" sortable>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <template v-if="row.image">
              <KdxImage :src="row.image"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="是否有图纸" prop="has_diagram" align="center" sortable>
          <div slot-scope="{row}">
            <el-tag size="mini" :type="row.has_diagram ? 'primary' : 'warning'">
              {{row.has_diagram ? "有" : "无"}}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="总数量" prop="total_count" align="center" sortable>
        </el-table-column>
        <el-table-column label="大板" align="center">
          <el-table-column label="一板套数" prop="diagram.big_count" align="center" sortable>
            <div slot-scope="{row}">
              <el-tag v-if="row.diagram && row.diagram.big_count" size="mini" type="primary">
                {{row.diagram.big_count}}
              </el-tag>
            </div>
          </el-table-column>
          <el-table-column label="张数" prop="big_count" align="center" sortable>
            <div slot-scope="{row}">
              <div v-if="row.diagram && row.diagram.big_count">
                <el-tag size="mini" type="primary" effect="dark">{{row.big_count}}</el-tag>
                <el-button size="mini" type="danger" v-if="row.diagram.big_count * row.big_count < row.total_count" @click="overProduce(row)">超出生产</el-button>
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="单个排版" align="center">
          <el-table-column label="工具排版" prop="diagram.has" align="center" sortable>
            <div slot-scope="{row}">
              <template v-if="row.left_count">
                <el-tag v-if="row.diagram && row.diagram.has" size="mini" type="primary">
                  可工具排版
                </el-tag>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="W1" prop="diagram.has_w1" align="center" sortable>
            <div slot-scope="{row}">
              <template v-if="row.left_count">
                <el-tag v-if="row.diagram && row.diagram.has_w1" size="mini" type="primary">
                  有W1图纸
                </el-tag>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="SP" prop="diagram.has_sp" align="center" sortable>
            <div slot-scope="{row}">
              <template v-if="row.left_count">
                <el-tag v-if="row.diagram && row.diagram.has_sp" size="mini" type="primary">
                  有SP图纸
                </el-tag>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="剩余是否使用工具排版" prop="left_can_tool_print" align="center" sortable>
            <div slot-scope="{row}">
              <template v-if="row.has_diagram && row.left_count">
                <el-select v-model="row.left_can_tool_print" filterable :style="{width: '100%'}">
                  <el-option label="工具排版" :value="true"></el-option>
                  <el-option label="W1排版" :value="false" v-if="row.diagram && row.diagram.has_w1"></el-option>
                </el-select>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="排版数量" prop="left_count" align="center" sortable>
            <div slot-scope="{row}">
              <template v-if="row.left_count">
                <el-tag v-if="row.has_diagram" size="mini" type="primary" effect="dark">{{row.left_count}}</el-tag>
                <el-button size="mini" type="danger" v-if="allowLack" @click="lack(row)">该部分不再生产</el-button>
              </template>
            </div>
          </el-table-column>
        </el-table-column>
      </el-table>

      <DlgAuditList :visible="dlgAuditList.visible" @close="dlgAuditList.visible=false"></DlgAuditList>
      <TemuDlgDownloadImages :ids="dlgDownloadImages.ids" :ext_codes="dlgDownloadImages.ext_codes" :visible="dlgDownloadImages.visible" @close="dlgDownloadImages.visible=false"></TemuDlgDownloadImages>
    </div>
  </div>

</template>

<script>
import {diagramCreate, diagramTaskList} from "@/api/sf-factory-v2/diagram";
import KdxImage from "@/components/image/image.vue";
import DlgAuditList from "@/view/sf-factory-v2/components/dlg_audit_list.vue";
import TemuDlgDownloadImages from "@/view/temu/sale/components/dlg_download_images.vue";
import {deliveryOrderNotifyJit} from "@/api/temu/delivery_order";

export default {
  components: {
    TemuDlgDownloadImages,
    DlgAuditList,
    KdxImage
  },
  computed: {
    canSelectCreate() {
      if (!this.selectRows || this.selectRows <= 0) {
        return false
      }
      for (const row of this.selectRows) {
        if (!row.has_diagram) {
          return false
        }
      }
      return true
    }
  },
  data() {
    return {
      selectRows: [],
      disableCopy: false,
      tableData: [],
      allowLack: true, // 不允许缺货
      searchInfo: {
        ids: undefined,
      },
      dlgDownloadImages: {
        ids: [],
        ext_codes: [],
        visible: false,
      },
      dlgAuditList: {
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

      if (this.disableCopy) {
        return
      }

      let skuCodes = this.selectRows.map((item) => {
        return item.sku_code
      })
      this.copy(skuCodes.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async onSubmit() {
      let resp = await diagramTaskList(this.searchInfo)
      if (resp.code) {
        return
      }
      this.tableData = resp.data.list
      this.allowLack = resp.data.allow_lack

      setTimeout(() => {
        this.disableCopy = true
        this.tableData.forEach((row) => {
          if (!row.has_diagram) {
            this.$refs.multipleTable.toggleRowSelection(row);
          }
        })
        this.disableCopy = false
        this.selectionChange(this.selectRows)
      }, 100)
    },
    overProduce(row) {
      if (row.diagram.big_count * row.big_count >= row.total_count) {
        return
      }
      row.big_count = Math.ceil(row.total_count/row.diagram.big_count)
      row.left_count = Math.max(0, row.total_count - row.diagram.big_count * row.big_count)
    },
    lack(row) {
      this.$confirm('是否确认不再生产?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(()=>{
        row.left_count = 0
      })
    },
    openDlgAuditList() {
      this.dlgAuditList.visible = true
    },
    downloadImages() {
      this.dlgDownloadImages.ids = (this.selectRows || []).map((item)=>{return item.sku_id})
      this.dlgDownloadImages.ext_codes = (this.selectRows || []).map((item)=>{return item.sku_code})
      this.dlgDownloadImages.visible = true
    },
    async notifyJit() {
      let resp = await deliveryOrderNotifyJit()
      if (resp.code) {
        return
      }

      this.$message("操作成功，请查看企微")
    },
    async create() {
      for (const row of this.selectRows) {
        if (!row.has_diagram) {
          this.$message.error(`没有加工图: ${row.sku_code}`)
          return
        }

        if (row.left_count > 0) {
          if (row.left_can_tool_print) {
            if (!row.diagram.has) {
              this.$message.error(`没有工具排版加工图: ${row.sku_code}`)
              return
            }
          } else {
            if (!row.diagram.has_w1) {
              this.$message.error(`没有W1加工图: ${row.sku_code}`)
              return
            }
          }
        }
      }
      let list = []
      this.selectRows.forEach((row) => {
        list.push({
          sku_code: row.sku_code,
          group_ids: row.group_ids,
          total_count: row.total_count,
          big_count: row.big_count,
          left_count: row.left_count,
          left_can_tool_print: row.left_can_tool_print,
        })
      })
      let resp = await diagramCreate(list)
      if (resp.code) {
        return
      }
      this.$message("创建成功，请查看记录确认")
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "type", 0)
    this.tableData = []
  }
}
</script>
<style scoped lang="scss">
::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}
</style>