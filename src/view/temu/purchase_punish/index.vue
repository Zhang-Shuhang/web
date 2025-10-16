<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_id" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-select v-model="searchInfo.status" placeholder="处理进度" filterable clearable
                       :style="{width: '100%'}">
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-select v-model="searchInfo.punish_types" placeholder="违规类型" filterable clearable multiple collapse-tags
                       :style="{width: '100%'}">
              <el-option v-for="(item, index) in punishTypeOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="发货WB单号(空格分隔)" v-model="searchInfo.plan_ids" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="运单号" v-model="searchInfo.express_delivery_sn" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSync">同步</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openAppealDlg(selectRows)">批量申诉</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="50" align="center" fixed :selectable="checkSelectable"></el-table-column>
        <el-table-column align="center" label="账号" prop="account.name"></el-table-column>
        <el-table-column align="center" label="违规编号" prop="id"></el-table-column>
        <el-table-column align="center" label="订单号" prop="sub_purchase_order_sn"></el-table-column>
        <el-table-column align="center" label="进度" prop="punish_status">
          <template slot-scope="{row}">
            {{statusName(row.punish_status)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="违规类型" prop="punish_second_type_desc">
          <template slot-scope="{row}">
            {{row.punish_type_desc}}({{row.punish_second_type_desc}})
          </template>
        </el-table-column>
        <el-table-column align="center" label="违规结束时间" prop="violation_end_time">
          <template slot-scope="{row}">
            {{new Date(row.violation_end_time).toLocaleString()}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="违规金额" prop="punishAmount">
          <template slot-scope="{row}">
            ¥{{(row.punish_amount/100).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="发货物流" prop="delivery_order.expressCompany">
        </el-table-column>
        <el-table-column align="center" label="物流单号">
          <template slot-scope="{row}">
            <div v-if="row.delivery_order">
              <el-tag type="primary" v-if="row.delivery_order.expressDeliverySn">
                平台物流: {{row.delivery_order.expressDeliverySn}}
              </el-tag>
              <el-tag type="warning" v-else-if="row.delivery_order.attach_logistic">
                附带物流: {{row.delivery_order.attach_logistic.logistic}}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="openDetailDlg(row)">{{row.punishStatus === 0 ? '申诉' : '查看详情'}}</el-button>
          </template>
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

      <TemuDlgAppeal :row="dlgAppeal.row" :rows="dlgAppeal.rows" :visible="dlgAppeal.visible" @close="dlgAppeal.visible = false" @update="getTableData"></TemuDlgAppeal>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "@/api/temu/account";
import {purchasePunishList, purchasePunishSync} from "@/api/temu/purchase_punish";
import TemuDlgAppeal from "@/view/temu/purchase_punish/dlg_appeal.vue";

export default {
  components: {
    TemuDlgAppeal,
  },
  mixins: [infoList],
  computed: {
    // 能否平台发货
    ids() {
      let list = []
      this.selectRows.forEach((item) => {
        list.push(item.id)
      })
      return list
    },
  },
  watch: {
    searchInfo: {
      handler() {
        this.onSubmit()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: purchasePunishList,

      accountOptions: [],

      punishTypeOptions: [
        {id: "质量问题", name: "质量问题"},
        {id: "延迟到货", name: "延迟到货"},
        {id: "到货缺货", name: "到货缺货"},
      ],

      statusOptions: [
        {id: 1, name: "公示中"},
        {id: 2, name: "已取消违规处理"},
        {id: 4, name: "已按违规处理"},
        {id: 5, name: "逾期未申诉，平台处理中"},
        {id: 6, name: "已申诉，平台处理中"},
        {id: 7, name: "申诉驳回，平台处理中"},
      ],

      dlgAppeal: {
        row: undefined,
        rows: [],
        visible: false,
      },

      selectRows: [],
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length > 0) {
        this.copy(this.ids.join(" "))
      }
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    statusName(tp) {
      let item = this.statusOptions.find((item) => {return item.id === tp+1})
      if (!item) {
        return `未知类型: ${tp}`
      }
      return item.name
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await purchasePunishSync({id: this.searchInfo.account_id})
      if (resp.code) {
        return
      }
      this.$message("同步成功")
      this.getTableData()
    },
    openDetailDlg(row) {
      this.dlgAppeal.row = row
      this.dlgAppeal.rows = []
      this.dlgAppeal.visible = true
    },
    openAppealDlg(rows) {
      this.dlgAppeal.row = undefined
      this.dlgAppeal.rows = rows
      this.dlgAppeal.visible = true
    },
    checkSelectable(row) {
      return row.punish_status === 0 || row.punish_status === 5
    },
  },
  filters: {},
  mounted() {
    this.pageSize = 100
  },
  async created() {
    this.$set(this.searchInfo, "status", 1)

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
    height: 85px;
    padding: 0px;
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    font-weight: 900;
    height: 13px;
    line-height: 13px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

::v-deep .el-table .cell {
  padding: 0;
}
</style>