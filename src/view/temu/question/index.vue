<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.answer_status" placeholder="是否回答" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in answerStatusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="sync">同步</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center" min-width="100px">
        </el-table-column>
        <el-table-column label="Id" prop="id" align="center" width="80px">
        </el-table-column>
        <el-table-column label="客户名" prop="creator_name" align="center" width="100px">
        </el-table-column>
        <el-table-column label="客户类型" prop="creator_type" align="center" width="50px">
        </el-table-column>
        <el-table-column label="内容" prop="desc" align="center" min-width="300px">
        </el-table-column>
        <el-table-column label="是否回复" prop="has_answer" align="center">
          <div slot-scope="{row}">
            <el-tag type="primary" size="mini" v-if="row.has_answer">已处理</el-tag>
            <el-tag type="danger" size="mini" v-else>未处理</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="时间" prop="created_time" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_time).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="danger" style="width: 100%" @click="openReplyDlg(row)" v-if="!row.has_answer">回复</el-button>
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

    <TemuDlgQuestion :visible="reply.visible" :item="reply.item" @close="reply.visible=false" @update="getTableData"></TemuDlgQuestion>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {questionList, questionSync} from "@/api/temu/question";
import {accountList} from "../../../api/temu/account";
import {mapGetters} from "vuex";
import TemuDlgQuestion from "@/view/temu/question/components/dlg_question.vue";

export default {
  components: {
    TemuDlgQuestion,
  },
  mixins: [infoList],
  computed:{
    ...mapGetters("user", ["token"]),
  },
  data() {
    return {
      listApi: questionList,

      accountOptions: [],

      reply: {
        item: undefined,
        visible: false,
      },

      answerStatusOptions: [
        {id: 1, name: "未处理"},
        {id: 2, name: "已处理"},
      ],
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async sync(id) {
      let resp = await questionSync({id})
      if (resp.code) {
        return
      }
      this.getTableData()
    },
    openReplyDlg(item) {
      this.reply.item = item
      this.reply.visible = true
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "answer_status", 1)

    if (this.$route.query) {
      if (this.$route.query.return_ids) {
        this.$set(this.searchInfo, "return_ids", this.$route.query.return_ids)
      }
      if (this.$route.query.plan_id) {
        this.$set(this.searchInfo, "plan_id", this.$route.query.plan_id)
      }
    }

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  },
}
</script>
<style scoped lang="scss">
  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  ::v-deep .el-row {
    padding: 0px;
  }
</style>