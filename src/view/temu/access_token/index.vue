<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :span="4" :offset="16">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
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
              <el-tag size="mini" type="primary" @click="copy(account.name)">
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
        <el-table-column label="领星" align="center">
          <el-table-column label="美区token" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
                <el-button type="primary" size="mini" @click="copyToken(account.id, 'ub_us_token')" style="width: 100%">
                  复制
                </el-button>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="店小秘" align="center">
          <el-table-column label="欧区token" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
                <el-button type="primary" size="mini" @click="copyToken(account.id, 'dxm_eu_token')"
                           style="width: 100%">复制
                </el-button>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column label="美区token" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
                <el-button type="primary" size="mini" @click="copyToken(account.id, 'dxm_us_token')"
                           style="width: 100%">复制
                </el-button>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column label="全球token" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
                <el-button type="primary" size="mini" @click="copyToken(account.id, 'dxm_agent_token')"
                           style="width: 100%">复制
                </el-button>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column label="产品token" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.accounts.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(account, index) in row.accounts" :key="index">
                <el-button type="primary" size="mini" @click="copyToken(account.id, 'dxm_token')" style="width: 100%">
                  复制
                </el-button>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
import {userList} from "@/api/temu/user";
import {accountToken} from "@/api/temu/account";

export default {
  components: {},
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
    }
  },
  methods: {
    async onSubmit() {
      let resp = await userList()
      if (resp.code === 0) {
        this.list = resp.data
      }
    },
    async copyToken(id, key) {
      let resp = await accountToken({id: id, key: key})
      if (resp.code) {
        return
      }

      this.copy(resp.data)
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message.info('复制成功')
      }, function () {
        this.$message.error('复制失败')
      })
    },
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
    height: 40px;
    padding: 5px;
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