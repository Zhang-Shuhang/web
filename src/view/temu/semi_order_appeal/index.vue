<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="item.name" :value="item.id" v-if="item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.progress" placeholder="请选择处理进度" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in progressOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.types" placeholder="请选择违规类型" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.except" placeholder="请选择异常类型" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in exceptOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="违规编号" v-model="searchInfo.ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="订单号" v-model="searchInfo.order_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange" show-summary :summary-method="getSummaries">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="account.name" sortable="custom">
        </el-table-column>
        <el-table-column label="Id" align="center" prop="id" sortable="custom">
        </el-table-column>
        <el-table-column label="违规类型" align="center" prop="type" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            {{typeName(row.type)}}
          </div>
        </el-table-column>
        <el-table-column label="异常类型" align="center" prop="exception" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            {{exceptionName(row.exception)}}
          </div>
        </el-table-column>
        <el-table-column label="违规数量" align="center" prop="count" sortable="custom">
        </el-table-column>
        <el-table-column label="预估违规金额" align="center" prop="excepted_amount" sortable="custom">
        </el-table-column>
        <el-table-column label="实际违规金额" align="center" prop="actual_amount" sortable="custom">
        </el-table-column>
        <el-table-column label="违规通知时间" align="center" prop="notify_time" sortable="custom">
        </el-table-column>
        <el-table-column label="申诉时间" align="center" prop="appeal_time" sortable="custom">
        </el-table-column>
        <el-table-column label="处理进度" align="center" prop="progress" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            <el-tag type="danger" size="mini" effec="dark" v-if="row.progress <= 1">
              {{new Date(row.auto_agree_time).toLocaleString()}} 时自动同意
            </el-tag>

            <el-tag type="primary" size="mini" effec="dark">
              {{progressName(row.progress)}}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" sortable="custom">
          <div slot-scope="{row}">
            <div>
              <el-button size="mini" style="width: 100%" type="primary" @click="openAppealSubmitDlg(row.id)" plain>查看详情</el-button>
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

    <TemuDlgAppealSubmit :id="appealSubmitDlg.id" :waybill_id="appealSubmitDlg.waybill_id" :visible="appealSubmitDlg.visible" @close="appealSubmitDlg.visible=false"></TemuDlgAppealSubmit>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "../../../api/temu/account";
import {mapGetters} from "vuex";
import {semiOrderAppealList, semiOrderAppealSync} from "@/api/temu/semi_order_appeal";
import TemuDlgAppealSubmit from "@/view/temu/semi_order_appeal/components/dlg_appeal_submit.vue";

export default {
  components: {
    TemuDlgAppealSubmit,
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(()=>{
          this.getTableData()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: semiOrderAppealList,

      selectRows: [],

      accountOptions: [],
      progressOptions: [
        {id: 0, name: "待申诉"},
        {id: 1, name: "待完善资料"},
        {id: 2, name: "平台处理中"},
        {id: 3, name: "处理完成"},
        {id: 4, name: "超时关闭申诉"},
      ],
      typeOptions: [
        {id: 1, name: "延迟到货"},
        {id: 2, name: "虚假交易"},
        {id: 3, name: "异常轨迹"},
        {id: 4, name: "虚假发货"},
        {id: 5, name: "缺货"},
        {id: 6, name: "欺诈发货"},
      ],
      exceptOptions: [
        {id: 1, name: "轨迹节点时间过早"},
        {id: 2, name: "异地签收"},
        {id: 6, name: "发货后长时间无物流轨迹"},
        {id: 0, name: "其他"},
      ],

      timeoutId: undefined,

      appealSubmitDlg: {
        id: undefined,
        visible: false,
      },

      sendDlg: {
        ids: [],
        visible: false,
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    typeName(type) {
      let d = this.typeOptions.find((item) => {
        return item.id === type
      })
      return d ? d.name : `未知类型: ${type}`
    },
    exceptionName(exception) {
      if (exception < 0) {
        return "-"
      }
      let d = this.exceptOptions.find((item) => {
        return item.id === exception
      })
      return d ? d.name : `未知异常: ${exception}`
    },
    progressName(progress) {
      let d = this.progressOptions.find((item) => {
        return item.id === progress
      })
      return d ? d.name : `未知进度: ${progress}`
    },
    async onSync() {
      let resp = await semiOrderAppealSync()
      if (resp.code) {
        return
      }
      this.$message("同步成功")
      this.getTableData()
    },
    getSummaries(param) {
      const {columns, data} = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }

        const values = data.map(item => Number(item[column.property]));
        if (column.property === "actual_amount") {
          sums[index] = values.reduce((a, b) => a + b, 0).toFixed(2);
        } else if (column.property === "excepted_amount") {
          sums[index] = values.reduce((a, b) => a + b, 0).toFixed(2);
        }
      });

      return sums;
    },

    statusName(status) {
      let op = this.statusOptions.find((item) => {
        return item.id === status
      })
      if (!op) {
        return `未知状态: ${status}`
      }
      return op.name
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.id
      })
      this.copy(ids.join(" "))

      let trackingNumbers = []
      this.selectRows.forEach((item) => {
        item.waybill_info_list.forEach((w) => {
          trackingNumbers.push(w.tracking_number)
        })
      })
      if (trackingNumbers.length) {
        this.$message(`物流单号: ${trackingNumbers.join(" ")}`)
      }
    },
    openAppealSubmitDlg(id) {
      this.appealSubmitDlg.id = id
      this.appealSubmitDlg.visible = true
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    handleSuccess(res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.$message("上传成功!");
      this.getTableData()
    },
    handleError(err) {
      this.fullscreenLoading = false
      this.$message.error("上传失败!" + err);
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 100
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 100px;
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

::v-deep .el-row {
  padding: 0;
}

::v-deep .el-table .cell {
  padding: 0;
}

.el-row {
  padding-top: 0px;
  padding-bottom: 0px;
}

::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}

.button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  height: 24px;
  line-height: 22px;
  width: 100%;
  vertical-align: bottom;
}

::v-deep .select .el-input--suffix .el-input__inner {
  padding-right: 0px;
}

::v-deep .select .el-input__suffix {
  display: none;
}

.input-right-zero {
  padding-right: 0px !important;
}

.one-line {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
}

.two-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

::v-deep .el-upload--text {
  width: 100%;
}
</style>