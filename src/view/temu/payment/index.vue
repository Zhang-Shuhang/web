<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :span="4" :offset="16">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="create.visible=true">创建</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="list" border height="100%" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column label="主体id" prop="id" align="center" width="150px">
        </el-table-column>
        <el-table-column label="主体账号" prop="name" align="center" width="150px">
        </el-table-column>
        <el-table-column label="id" prop="id" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              {{ account.id }}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag size="mini" type="primary">
                {{ account.name }}
              </el-tag>
              <el-tag size="mini" type="primary" effect="dark" v-if="account.has_jit">
                [JIT]
              </el-tag>
              <el-tag size="mini" type="success" effect="dark" v-if="account.has_custom">
                [定制]
              </el-tag>
              <el-tag size="mini" type="warning" effect="dark" v-if="account.is_semi">
                [半托管]
              </el-tag>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="预估待结算销售额" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag type="primary" v-if="account.wallet">¥ {{ account.wallet.wait_settle_amount.toFixed(2) }}</el-tag>
            </div>
            <div class="footer">
              {{walletAmount(row.accounts, "wait_settle_amount")}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="美区冻结" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag type="danger" effect="dark" v-if="account.wallet && account.wallet.us_site_balance">¥ {{ account.wallet.us_site_balance.toFixed(2) }}</el-tag>
            </div>
            <div class="footer">
              {{walletAmount(row.accounts, "us_site_balance")}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="其他站点" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag type="warning" v-if="account.wallet && account.wallet.other_site_balance">¥ {{ account.wallet.other_site_balance.toFixed(2) }}</el-tag>
            </div>
            <div class="footer">
              {{walletAmount(row.accounts, "other_site_balance")}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="总提现" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag type="primary" v-if="account.wallet">¥ {{ (account.wallet.total_cash_amount || 0).toFixed(2) }}</el-tag>
            </div>
            <div class="footer">
              {{walletAmount(row.accounts, "total_cash_amount")}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="可提现" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag type="primary" v-if="account.wallet">¥ {{ account.wallet.available_balance.toFixed(2) }}</el-tag>
            </div>
            <div class="footer">
              {{walletAmount(row.accounts, "available_balance")}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-button size="mini" :type="account.is_today_apply_payment ? 'warning' : 'primary'" style="margin-left: 5px" @click="onPaymentApply(account.id, account.is_semi)">
                {{ account.is_today_apply_payment ? "已提现" : "提现" }}
              </el-button>
              <el-button size="mini" type="primary" style="margin-left: 5px" @click="openCashRecordListDlg(account.id)">
                提现记录
              </el-button>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
      </el-table>
    </div>

    <TemuDlgCashRecords :account_id="dlgCashRecordList.account_id" :account-options="accounts" :visible="dlgCashRecordList.visible" @close="dlgCashRecordList.visible=false"></TemuDlgCashRecords>
    <TemuDlgApply :id="apply.id" :is_semi="apply.is_semi" :visible="apply.visible" @close="apply.visible=false" @update="onSuccess"></TemuDlgApply>
  </div>

</template>

<script>
import TemuDlgApply from "@/view/temu/account/components/dlg_apply.vue";
import {userCheck} from "@/api/temu/user";
import {paymentUserList} from "@/api/temu/payment";
import TemuDlgCashRecords from "@/view/temu/payment/components/dlg_cash_records.vue";

export default {
  components: {
    TemuDlgCashRecords,
    TemuDlgApply,
  },
  mixins: [],
  computed: {
    accounts() {
      let list = []

      this.list.forEach((v) => {
        list.push(...v.accounts)
      })

      return list
    }
  },
  data() {
    return {
      list: [],
      create: {
        visible: false,
      },

      edit: {
        id: 0,
        visible: false,
      },

      dlgCashRecordList: {
        account_id: undefined,
        visible: false,
      },

      apply: {
        id: 0,
        is_semi: false,
        visible: false,
      },
    }
  },
  methods: {
    async onSuccess() {
      await this.onSubmit()

      for (const u of this.list) {
        let exist = false
        for (const a of u.accounts) {
          if (a.id === this.apply.id) {
            exist = true
            break
          }
        }
        if (!exist) {
          continue
        }

        for (const account of u.accounts) {
          if (account.id === this.apply.id || account.is_today_apply_payment) {
            continue
          }

          this.apply.id = account.id
          this.apply.visible = true
          break
        }

        break
      }
    },
    async onSubmit() {
      let resp = await paymentUserList()
      if (resp.code === 0) {
        this.list = resp.data
      }
    },
    onEdit(id) {
      this.edit.id = id
      this.edit.visible = true
    },
    openCashRecordListDlg(account_id) {
      this.dlgCashRecordList.account_id = account_id
      this.dlgCashRecordList.visible = true
    },
    onPaymentApply(id, is_semi) {
      this.apply.id = id
      this.apply.is_semi = is_semi
      this.apply.visible = true
    },
    walletAmount(accounts, field) {
      let amount = 0
      for (const account of accounts) {
        if (account.wallet) {
          amount += account.wallet[field] || 0
        }
      }
      return `合计 ￥ ${amount.toFixed(2)}`
    },
    async check(id) {
      let resp = await userCheck({id: id})
      if (resp.code) {
        return
      }

      this.$message("检查成功")
      this.onSubmit()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.onSubmit()
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 32px;
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
</style>