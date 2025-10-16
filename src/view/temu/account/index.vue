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
<!--        <el-table-column label="主体id" prop="id" align="center" width="150px">-->
<!--        </el-table-column>-->
        <el-table-column label="主体账号" prop="name" align="center" width="150px">
        </el-table-column>
        <el-table-column label="中文名" prop="cn_name" align="center" width="150px">
        </el-table-column>
        <el-table-column label="是否有效" prop="valid" align="center" width="180px">
          <div slot-scope="{row}">
            <el-tag type="primary">{{ row.valid ? "有效" : "过期" }}</el-tag>

            <div style="font-size: 12px">
              下次重登: {{new Date(row.next_re_login_time).toLocaleString()}}
            </div>
            <div style="margin-top: 5px" v-if="canReLogin">
              <el-button size="mini" type="primary" @click="reLogin([row])">强制重登</el-button>
            </div>
            <div style="margin-top: 5px" v-if="canReLogin">
              <el-button size="mini" type="danger" @click="reLogin(list)">全部强制重登</el-button>
            </div>
<!--            <div style="margin-top: 5px">-->
<!--              <el-button size="mini" type="primary" @click="onEdit(row.id)">-->
<!--                编辑Cookie-->
<!--              </el-button>-->
<!--            </div>-->
            <div style="margin-top: 5px" v-if="canReLogin">
              <el-button size="mini" type="primary" @click="check(row.id)">检查过期</el-button>
            </div>
          </div>
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
        <el-table-column label="信息" align="center">
          <el-table-column label="名字" prop="name" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
                <el-row :gutter="5">
                  <el-col :span="12">
                    <el-tag size="mini" type="primary">
                      {{ account.name }}
                    </el-tag>
                  </el-col>
                  <el-col :span="12">
                    <StartBrowser :id="row.id" :account_id="account.id"></StartBrowser>
                  </el-col>
                </el-row>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column label="类型" prop="name" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
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
        </el-table-column>
        <el-table-column label="上新待确认数" prop="up_confirm_count" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              {{ account.up_confirm_count }}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="弃货金额" prop="discard_threshold" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag :type="account.discard_threshold ? `danger` : `primary`">
                {{ account.discard_threshold ? `金额>=${account.discard_threshold}` : "不弃货" }}
              </el-tag>
              <el-popover placement="left" trigger="click">
                <el-input-number size="mini" style="width: 100%" v-model="account.discard_threshold" :min="0"
                                 :precision="0"></el-input-number>
                <el-button size="mini" style="width: 100%" type="primary" @click="confirm(account)">确认</el-button>
                <el-button slot="reference" size="mini" type="primary" plain>设置</el-button>
              </el-popover>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
<!--        <el-table-column label="参与活动" prop="signed_protocol_names" align="center">-->
<!--          <div slot-scope="{row}">-->
<!--            <el-tag size="mini" type="primary" v-for="(item, index) in row.signed_protocol_names" :key="index">{{item.replace("规则", "")}}</el-tag>-->
<!--          </div>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="履约登记" prop="business_status" align="center">-->
<!--          <div slot-scope="{row}">-->
<!--            <div v-if="row.business_status">-->
<!--              <div v-if="row.business_type === 1">-->
<!--                <el-tag size="mini" type="warning">春节不履约: {{new Date(row.business_start_time).toLocaleDateString()}}-{{new Date(row.business_end_time).toLocaleDateString()}}</el-tag>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-table-column>-->
        <el-table-column label="是否半托管" prop="is_semi" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-tag :type="account.is_semi ? 'warning' : 'primary'">{{ account.is_semi ? "半托管" : "全托管" }}</el-tag>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(account, index) in row.accounts" :key="index">
              <el-row :gutter="5">
                <el-col :span="24">
                  <el-button size="mini" type="danger" @click="onDelete(account.id)" style="margin-left: 5px;width: 100%">
                    删除
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
      </el-table>
    </div>

    <TemuDlgCreate :visible="create.visible" @close="create.visible=false"></TemuDlgCreate>
    <TemuDlgEdit :id="edit.id" :visible="edit.visible" @close="edit.visible=false" @update="onSubmit"></TemuDlgEdit>
    <TemuDlgApply :id="apply.id" :is_semi="apply.is_semi" :visible="apply.visible" @close="apply.visible=false" @update="onSubmit"></TemuDlgApply>
  </div>

</template>

<script>
import {
  accountDelete,
  accountUpdateDiscard,
  accountUpdateByMap,
} from "@/api/temu/account";
import TemuDlgCreate from "./components/dlg_create";
import TemuDlgEdit from "./components/dlg_edit";
import TemuDlgApply from "@/view/temu/account/components/dlg_apply.vue";
import {userCheck, userList, userReLogin} from "@/api/temu/user";
import {mapGetters} from "vuex";
import StartBrowser from "@/view/temu/components/start_browser.vue";

export default {
  components: {
    StartBrowser,
    TemuDlgApply,
    TemuDlgEdit,
    TemuDlgCreate
  },
  mixins: [],
  computed: {
    ...mapGetters("user", ["canReLogin", "token", "userInfo"]),
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

      apply: {
        id: 0,
        is_semi: false,
        visible: false,
      },
    }
  },
  methods: {
    async onSubmit() {
      let resp = await userList()
      if (resp.code === 0) {
        this.list = resp.data
      }
    },
    onEdit(id) {
      this.edit.id = id
      this.edit.visible = true
    },
    onPaymentApply(id, is_semi) {
      this.apply.id = id
      this.apply.is_semi = is_semi
      this.apply.visible = true
    },
    onDelete(id) {
      this.$confirm("此操作将删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
            const res = await accountDelete({id: id});
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.onSubmit();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },
    async confirm(row) {
      let resp = await accountUpdateDiscard({id: row.id, threshold: row.discard_threshold})
      if (resp.code) {
        return
      }

      // 同步
      this.onSubmit()
    },
    walletAmount(accounts, field) {
      let amount = 0
      for (const account of accounts) {
        if (account.wallet) {
          amount += account.wallet[field]
        }
      }
      return `合计 ￥ ${amount.toFixed(2)}`
    },
    async reLogin(rows) {
      for (const row of rows) {
        let resp = await userReLogin({id: row.id})
        if (resp.code) {
          return
        }
      }

      this.$message("重登成功")
      this.onSubmit()
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