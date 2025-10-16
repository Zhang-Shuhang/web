<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_id" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="状态" filterable clearable :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.company_name" placeholder="请选择物流" filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in expressOptions" :key="index" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.other_cond" placeholder="其他条件" filterable clearable :style="{width: '100%'}">
                <el-option label="1天内过期" :value="1"></el-option>
                <el-option label="2天内过期" :value="2"></el-option>
                <el-option label="3天内过期" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.platform_mark_complete" placeholder="是否平台已处理" filterable clearable :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option label="平台已自动处理" :value="1"></el-option>
                <el-option label="平台未自动处理" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="最小重量差(kg)" v-model="searchInfo.min_weight" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="最大重量差(kg)" v-model="searchInfo.max_weight" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange" show-summary :summary-method="getSummaries">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="发货批号" prop="batch_sn" align="center" width="150px">
        </el-table-column>
        <el-table-column label="账号" prop="account.name" align="center" width="150px">
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" width="160px">
          <div slot-scope="{row}">
            <div>{{statusName(row.status)}}</div>
            <el-tag size="mini" type="danger" v-if="new Date(row.expire_time).getFullYear() > 1000">
              过期: {{new Date(row.expire_time).toLocaleString()}}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="物流公司" prop="company_name" align="center" width="150px">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.company_name}}</span>
          </div>
        </el-table-column>
        <el-table-column label="物流单号" prop="tracking_number" align="center" width="150px">
        </el-table-column>
        <el-table-column label="我方重" prop="delivery_weight" align="center" width="100px">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.delivery_weight/1000}} kg</span>
          </div>
        </el-table-column>
        <el-table-column label="物流方重" prop="real_express_weight" align="center" width="100px">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.real_express_weight/1000}} kg</span>
          </div>
        </el-table-column>
        <el-table-column label="重量差" prop="weight_diff" align="center" width="100px">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.weight_diff/1000}} kg</span>
          </div>
        </el-table-column>
        <el-table-column label="发货地址" prop="delivery_address" align="center">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.delivery_address}}</span>
          </div>
        </el-table-column>
        <el-table-column label="我方上报" align="center">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.feedback_detail}}</span>
          </div>
        </el-table-column>
        <el-table-column label="物流回应" align="center">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.logistics_feedback_result_remark}}</span>
          </div>
        </el-table-column>
        <el-table-column label="平台回应" align="center">
          <div slot-scope="{row}">
            <span class="fs-12 lh-15">{{row.platform_audit_result_remark}}</span>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <template v-if="row.status === 1">
<!--              <el-button size="mini" style="width: 100%" type="primary" @click="confirm(row.id)">同意</el-button>-->
              <el-popover
                  placement="left"
                  trigger="click">
                <el-input type="textarea" style="width: 100%" v-model="reject_reason"></el-input>
                <el-button size="mini" style="width: 100%" type="primary" @click="reject(row.id)">拒绝</el-button>

                <el-button slot="reference" size="mini" style="width: 100%" type="primary" plain>拒绝</el-button>
              </el-popover>
            </template>
            <template v-else-if="row.status === 3">
<!--              <el-button size="mini" style="width: 100%" type="primary" @click="confirm(row.id)">认可</el-button>-->
              <el-button size="mini" style="width: 100%" type="primary" @click="reject(row.id)" plain>提交平台处理</el-button>
            </template>

            <el-button size="mini" style="width: 100%" type="primary" @click="sync(row.id)">同步</el-button>
            <el-button size="mini" style="width: 100%; margin-top: 5px" type="primary" @click="openDetail(row)">详情</el-button>
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

    <TemuDlgExpressWeightFeedbackDetail :row="detail.row" :visible="detail.visible" @close="detail.visible=false"></TemuDlgExpressWeightFeedbackDetail>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "../../../api/temu/account";
import {
  expressWeightFeedbackConfirm,
  expressWeightFeedbackExpressList,
  expressWeightFeedbackList,
  expressWeightFeedbackReject,
  expressWeightFeedbackSync
} from "@/api/temu/express_weight_feedback";
import TemuDlgExpressWeightFeedbackDetail
  from "@/view/temu/express_weight_feedback/components/dlg_express_weight_feedback_detail.vue";

export default {
  components: {
    TemuDlgExpressWeightFeedbackDetail,
  },
  mixins: [infoList],
  computed:{
    canDelivery() {
      return this.checkCanDelivery(this.selectRows)
    },
    canJoinRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (this.canJoin(item)) {
          list.push(item)
        }
      })

      return list
    },
    canConfirmRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (item.info && item.info.status === 1) {
          list.push(item.deliveryOrderSn)
        }
      })

      return list
    },
    canBackRows() {
      let list = []

      this.selectRows.forEach((item) => {
        if (item.info && item.info.status < 3) {
          list.push(item.deliveryOrderSn)
        }
      })

      return list
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
      listApi: expressWeightFeedbackList,

      accountOptions: [],
      expressOptions: [],

      reject_reason: "",

      detail: {
        row: undefined,
        visible: false,
      },

      statusOptions: [
        {id: 1, name: "异常待确认"},
        {id: 2, name: "已提交异常反馈,待物流商处理"},
        {id: 3, name: "物流商处理完成"},
        {id: 4, name: "平台介入处理中"},
        {id: 5, name: "平台处理完成"},
        {id: 6, name: "卖家已确认"},
        {id: 7, name: "卖家超期自动确认"},
        {id: 8, name: "物流介入处理，卖家确认或超时自动确认"},
      ],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    confirm(id) {
      this.$confirm('请确认是否同意，请注意，处理有问题，会导致损失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        let resp = await expressWeightFeedbackConfirm({id: id})
        if (resp.code) {
          return
        }

        this.$message("同意成功")
        this.getTableData()
      })
    },
    reject(id) {
      if (!this.reject_reason) {
        this.$message.error("请输入拒绝原因")
        return
      }

      this.$confirm('请确认是否拒绝', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async () => {
        let resp = await expressWeightFeedbackReject({id: id, reason: this.reject_reason})
        if (resp.code) {
          return
        }

        this.$message("拒绝成功")
        this.getTableData()
      })
    },
    async sync(id) {
      let resp = await expressWeightFeedbackSync({id: id})
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    async openDetail(row) {
      this.detail.row = row
      this.detail.visible = true
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let ids = []
      this.selectRows.forEach((item) => {
        ids.push(item.tracking_number)
      })
      this.copy("物流单号: " + ids.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    statusName(status) {
      for (const statusOption of this.statusOptions) {
        if (statusOption.id === status) {
          return statusOption.name
        }
      }
      return `未知(${status})`
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "weight_diff") {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = (sums[index]/1000).toFixed(2) + " kg"
        }
      });

      return sums;
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "platform_mark_complete", 2)
    this.pageSize = 100

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }

    resp = await expressWeightFeedbackExpressList()
    if (resp.code === 0) {
      this.expressOptions = resp.data
    }

    this.onSubmit()
  },
  updated() {
    this.$nextTick(()=>{
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
      height: 85px;
      padding: 0px;
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

  ::v-deep .el-form-item__content:after, .el-form-item__content:before {
    display: table;
  }

  ::v-deep .el-form-item__content {
    line-height: 28px;
    position: relative;
    font-size: 12px;
  }

  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  ::v-deep .el-row {
    padding: 0px;
  }

  ::v-deep .select .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }

  ::v-deep .select .el-input__suffix {
    display: none;
  }

  .div-op-btn {
    .el-button--mini, .el-button--mini.is-round {
      padding: 3px 15px;
    }
  }
  ::v-deep .el-upload--text {
    width: 100%;
  }
</style>