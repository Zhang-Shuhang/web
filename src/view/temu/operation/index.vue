<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index"
                           :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker
                  v-model="searchInfo.date"
                  type="daterange"
                  align="right"
                  size="mini"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions"
                  style="width: 100%">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.type" placeholder="操作类型" filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in opTypeOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.success" placeholder="是否成功" filterable clearable style="width: 100%">
                <el-option label="成功" :value="1"></el-option>
                <el-option label="失败" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="account.name">
        </el-table-column>
        <el-table-column label="类型" align="center" prop="type" sort-by="sku_ext_code">
          <div slot-scope="{row}">
            {{opTypeName(row)}}
          </div>
        </el-table-column>
        <el-table-column label="操作Id" align="center" prop="ref_id">
        </el-table-column>
        <el-table-column label="状态" align="center" prop="fail_result">
          <div slot-scope="{row}">
            <el-tag v-if="row.success" size="mini" type="primary">成功</el-tag>
            <div v-else style="color: red; font-size: 12px">{{row.fail_result}}</div>
          </div>
        </el-table-column>
        <el-table-column label="时间" align="center" prop="created_at">
          <div slot-scope="{row}">
            {{ new Date(row.created_at).toLocaleString() }}
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
import {accountList} from "@/api/temu/account";
import {temuOperationList} from "@/api/temu/operation";

export default {
  components: {},
  mixins: [infoList],
  data() {
    return {
      listApi: temuOperationList,
      isMobile: false,

      accountOptions: [],
      opTypeOptions: [
        {id: 1, name: "实拍图"},
        {id: 2, name: "合规"},
        {id: 3, name: "证书"},
      ],

      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const end = new Date();
            end.setTime(end.getTime() - 3600 * 1000 * 24);
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  computed: {},
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    opTypeName(row) {
      let op = this.opTypeOptions.find(item => {return item.id === row.type})
      if (op) {
        return op.name
      }
      return `未知: ${row.type}`
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

    this.pageSize = 100

    this.$set(this.searchInfo, "date", [new Date(), new Date()])
    this.$set(this.searchInfo, "success", 2)

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
</style>