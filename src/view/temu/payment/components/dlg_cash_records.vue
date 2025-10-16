<template>
  <el-drawer :visible.sync="$attrs.visible" title="提现记录" @opened="onOpened" size="80%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div slot="title" class="title">
      <div style="float: left">
        <span>提现记录</span>
      </div>

      <div style="float: right; width: 80%">
        <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
          <el-row :gutter="5">
            <el-col :span="4" :offset="12">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.account_id" size="mini" placeholder="请选择账号" style="width: 100%" filterable clearable>
                  <el-option value=""></el-option>
                  <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.status_codes" size="mini" placeholder="状态" style="width: 100%" multiple collapse-tags filterable clearable>
                  <el-option label="发起申请" :value="0"></el-option>
                  <el-option label="银行处理中" :value="2"></el-option>
                  <el-option label="提现成功" :value="3"></el-option>
                  <el-option label="提现失败 资金已退回" :value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button size="mini" type="primary" @click="onSubmit" style="width: 100%">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <el-table class="table-body" ref="multipleTable" :data="tableData" border height="85vh" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="主体账号" prop="name" align="center">
        <div slot-scope="{row}">
          {{accountName(row.account_id)}}
        </div>
      </el-table-column>
      <el-table-column label="提现" prop="create_time" align="center">
        <div slot-scope="{row}">
          {{new Date(row.create_time).toLocaleString()}}
        </div>
      </el-table-column>
      <el-table-column label="提现金额" prop="withdraw_cash_amount" align="center">
      </el-table-column>
      <el-table-column label="提现状态" prop="withdraw_cash_status" align="center">
      </el-table-column>
      <el-table-column label="收款账户" prop="beneficiary_account" align="center">
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
  </el-drawer>
</template>

<script>

import infoList from "@/components/mixins/infoList";
import {paymentCashRecordList} from "@/api/temu/payment";

export default {
  name: 'TemuDlgCashRecords',
  components: {},
  mixins: [infoList],
  props: {
    account_id: {
      type: Number,
    },
    accountOptions: {
      type: Array,
    },
  },
  computed: {
  },
  data() {
    return {
      listApi: paymentCashRecordList,
      selectRows: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      if (this.account_id) {
        this.$set(this.searchInfo, "account_id", this.account_id)
      } else {
        this.$set(this.searchInfo, "account_id", "")
      }
      this.pageSize = 100
      this.getTableData()
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    accountName(id) {
      let account = this.accountOptions.find((item) => item.id === id)
      if (!account) {
        return `未知账号: ${id}`
      }
      return account.name
    }
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-drawer__body {
  padding: 10px;
}

::v-deep .el-tabs__content {
  display: none;
}
::v-deep .el-drawer__header {
  margin-bottom: 12px;
}

</style>