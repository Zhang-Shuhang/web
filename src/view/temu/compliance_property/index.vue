<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="5" :sm="5" :lg="5">
            <el-form-item label-width="0">
              <el-select placeholder="账号" v-model="searchInfo.accounts" clearable filterable multiple style="width: 100%;">
                <el-option v-for="item in accountInfoList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :lg="5">
            <el-form-item label-width="0">
              <el-select placeholder="任务状态" v-model="searchInfo.task_status" clearable filterable multiple style="width: 100%;">
                <el-option label="待上传" :value="2"> </el-option>
                <el-option label="上传成功" :value="3"> </el-option>
                <el-option label="上传中" :value="4"> </el-option>
                <el-option label="待确认" :value="5"> </el-option>
                <el-option label="上传失败" :value="11"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :lg="5">
            <el-form-item label-width="0">
              <el-select placeholder="任务类型" v-model="searchInfo.task_types" clearable filterable multiple style="width: 100%;">
                <el-option v-for="item in taskTypeList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="3" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="3" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
          <el-col :xs="3" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onBatchUpdate">批量更新</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        class="table-body"
        ref="multipleTable"
        :data="tableData"
        :border="true"
        height="100%"
        size="mini"
        :header-cell-style="{ 'background-color': 'black', color: '#fff' }"
        :default-expand-all="false"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="ID" align="center" prop="id" sortable="custom" width="300"> </el-table-column>
        <el-table-column label="账号名" align="center" prop="account.name" sortable="custom"> </el-table-column>
        <el-table-column label="类目名" align="center" prop="cat_name" sortable="custom"> </el-table-column>
        <el-table-column label="任务名" align="center" prop="task_name" sortable="custom"> </el-table-column>
        <el-table-column label="商品ID" align="center" prop="goods_id" sortable="custom">
          <template slot-scope="{ row }">
            <el-link type="primary" :href="`https://temu.com/goods.html?goods%20id=${row.goods_id}&no%20cache%20id=egv4k`" target="_blank">
              {{ row.goods_id }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="产品ID" align="center" prop="product_id" sortable="custom"> </el-table-column>
        <el-table-column label="是否在售" align="center" prop="on_sale" sortable="custom">
          <template slot-scope="{ row }">
            <div style="display: flex; justify-content: center; align-items: center">
              <div
                style="width: 10px; height: 10px; margin-right: 8px; border-radius: 100%;"
                :style="{ 'background-color': row.on_sale ? 'green' : 'red' }"
              ></div>
              <div>{{ row.on_sale ? "在售" : "不在售" }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="设置的值" align="center" prop="set_value" sortable="custom"> </el-table-column>
      </el-table>

      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :style="{ textAlign: 'right' }"
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
import infoList from "@/components/mixins/infoList";
import { accountList } from "@/api/temu/account";
import {
  updateCompliancePropertyForBatch,
  getCompliancePropertyList,
  syncCompliancePropertyData,
  getCompliancePropertyTypeList,
} from "@/api/temu/compliance_property";

export default {
  mixins: [infoList],
  data() {
    return {
      accountInfoList: [],
      taskTypeList: [],
      searchInfo: {
        accounts: [],
        task_status: [],
        task_types: [4, 25, 60, 61],
      },
      batchUpdateIds: [],
    };
  },
  methods: {
    listApi: getCompliancePropertyList,
    onSubmit() {
      this.page = 1;
      this.getTableData();
    },
    async onSync() {
      await syncCompliancePropertyData();
      this.getTableData();
    },
    handleSelectionChange(val) {
      this.batchUpdateIds = val.map((item) => item.id);
    },
    async onBatchUpdate() {
      await updateCompliancePropertyForBatch({ ids: this.batchUpdateIds });
      this.getTableData();
    },
    async getAccountInfoList() {
      this.accountInfoList = (await accountList()).data.map((item) => ({ label: item.name, value: item.id }));
    },
    async getTaskTypeList() {
      this.taskTypeList = (await getCompliancePropertyTypeList()).data;
    },
  },

  async created() {
    this.getTaskTypeList();
    this.getAccountInfoList();
    this.getTableData();
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-row {
  padding: 0;
}

::v-deep .el-table .cell {
  padding: 0;
}

.el-row {
  padding-top: 0px;
  padding-bottom: 0px;
}

::v-deep .el-form-item,
.el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}
</style>
