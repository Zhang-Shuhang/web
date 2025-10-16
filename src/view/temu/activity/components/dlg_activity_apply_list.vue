<template>
  <el-drawer :visible.sync="$attrs.visible" title="活动申请列表" @opened="onOpened" size="60%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
             label-position="right">
      <el-row :gutter="5">
        <el-col :xs="12" :sm="6" :lg="4">
          <el-form-item label-width="0">
            <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable
                       clearable style="width: 100%">
              <el-option v-for="(item, index) in accountOptions" :key="index"
                         :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="6" :lg="4">
          <el-form-item label-width="0">
            <el-select v-model="searchInfo.activity_ids" placeholder="请选择长期活动" multiple collapse-tags filterable
                       clearable style="width: 100%">
              <el-option v-for="(item, index) in activityOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="6" :lg="4">
          <el-form-item label-width="0">
            <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="6" :lg="4">
          <el-form-item label-width="0">
            <el-select size="mini" style="width: 100%" v-model="searchInfo.status" clearable filterable>
              <el-option label="待开始" :key="1" :value="1"></el-option>
              <el-option label="申请成功" :key="2" :value="2"></el-option>
              <el-option label="申请失败" :key="3" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="12" :sm="4" :lg="4">
          <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="账号" prop="account.name" align="center">
      </el-table-column>
      <el-table-column label="活动" prop="activity.name" align="center">
      </el-table-column>
      <el-table-column label="限时活动" prop="thematic.name" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.created_at).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="最后更新时间" prop="updated_at" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.updated_at).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="Spu Id" prop="product_id" align="center">
      </el-table-column>
      <el-table-column label="报名库存" prop="stock" align="center">
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-if="row.status === 0">待开始</el-tag>
          <el-tag size="mini" type="success" v-else-if="row.status === 1">成功</el-tag>
          <el-tag size="mini" type="danger" v-else-if="row.status === 2">失败</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="结果" prop="result" align="center">
        <div slot-scope="{row}">
          <div v-if="row.status === 2">
            {{row.result}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="用户id" prop="user_id" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="mini" type="primary" @click="reapply(row)" v-if="row.status === 2">重新申请</el-button>
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
  </el-drawer>
</template>

<script>

import infoList from "@/components/mixins/infoList";
import TemuActivityAppliedList from "@/view/temu/activity/applied_list.vue";
import {activityApplyRecordList, activityList, activityReApply} from "@/api/temu/activity";
import KdxImage from "@/components/image/image.vue";
import {accountList} from "@/api/temu/account";

export default {
  name: 'TemuDlgActivityApplyList',
  components: {KdxImage, TemuActivityAppliedList},
  mixins: [infoList],
  props: {
  },
  computed: {
  },
  data() {
    return {
      listApi: activityApplyRecordList,
      accountOptions: [],
      activityOptions: [],
      isMobile: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.page = 1
      this.pageSize = 10

      let resp = await accountList()
      if (resp.code === 0) {
        this.accountOptions = resp.data
      }

      resp = await activityList()
      if (resp.code === 0) {
        this.activityOptions = resp.data
      }

      this.getTableData()
    },
    reapply(row) {
      this.$confirm('确认是否再次申请?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(async ()=>{
        let resp = await activityReApply({ids: [row.id]})
        if (resp.code) {
          return
        }
        this.$message("申请成功")
        this.getTableData()
      })
    }
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
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

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 30px;
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

</style>