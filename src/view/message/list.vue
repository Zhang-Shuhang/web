<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_ids" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.type" placeholder="请选择类型" filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in messageTypeOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="请输入Id" v-model="searchInfo.id" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_self_confirm" placeholder="请选择处理情况" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="自己" :value="1"></el-option>
                <el-option label="未处理" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="账号名字" prop="account_name" align="center">
        </el-table-column>
        <el-table-column label="类型" prop="type" align="center">
          <div slot-scope="{row}">
            {{typeName(row.type)}}
          </div>
        </el-table-column>
        <el-table-column label="内容" align="center" min-width="400px">
          <div slot-scope="{row}">
            <template v-for="(html, index) in row.html">
              <div v-html="html" :key="index">
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" :type="row.confirm_user_id > 0 ? 'success' : 'primary'" effect="dark">
              {{row.confirm_user_id === 0 ? "未处理" : (userInfo.ID === row.confirm_user_id ? "自己" : `他人(${row.confirm_user_id})`)}}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%" type="primary" @click="confirm(row)" plain>确认</el-button>
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
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {mapGetters} from "vuex";
import {messageConfirm, messageList} from "@/api/message/message";
import {accountList as temuAccountList} from "@/api/temu/account";
import {accountList as sheinAccountList} from "@/api/shein/account";
import {accountList as tiktokAccountList} from "@/api/tiktok/account";

export default {
  components: {
  },
  computed: {
    ...mapGetters("user", ["groupId", "userInfo"]),
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (!this.inited) {
          return
        }
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(this.onSubmit, 200)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: messageList,
      selectRows: [],
      accountOptions: [],
      messageTypeOptions: [
        {id: 1, name: "质检不合格"},
        {id: 2, name: "图纸检查"},
      ],
      timeoutId: undefined,
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
    typeName(tp) {
      let op = this.messageTypeOptions.find((item) => {return item.id === tp})
      if (!op) {
        return `未知: ${tp}`
      }
      return op.name
    },
    confirm(row) {
      this.$confirm('是否确认？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async ()=>{
        let resp = await messageConfirm({ids: [row.id]})
        if (resp.code) {
          return
        }

        this.$message("确认成功")
        this.getTableData()
      })
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.accountOptions = []
    let accountListResp = await temuAccountList()
    if (accountListResp.code === 0) {
      this.accountOptions.push(...accountListResp.data)
    }

    accountListResp = await sheinAccountList()
    if (accountListResp.code === 0) {
      this.accountOptions.push(...accountListResp.data)
    }

    accountListResp = await tiktokAccountList()
    if (accountListResp.code === 0) {
      this.accountOptions.push(...accountListResp.data)
    }

    this.$set(this.searchInfo, "is_self_confirm", 2)

    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
</style>