<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="12">
            <el-form-item label-width="0">
              <el-input placeholder="产品名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onCreateOrEdit('create')">创建组合产品</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table
        class="table-body"
        ref="multipleTable"
        :data="tableData"
        :border="true"
        height="100%"
        @sort-change="sortChange"
        size="mini"
        :header-cell-style="{ 'background-color': 'black', color: '#fff' }"
        :default-expand-all="false"
      >
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="Id" align="center" prop="id" sortable="custom" width="300"> </el-table-column>
        <el-table-column label="名字" align="center" prop="name" sortable="custom"> </el-table-column>
        <el-table-column label="包含产品列表" align="center" prop="list" sortable="custom">
          <template v-slot="{ row }">
            <div style="display: flex;justify-content: center;align-items: center">
              <el-table :data="row.list" :border="true" size="mini" :header-cell-style="{ 'background-color': 'black', color: '#fff' }">
                <el-table-column type="index" align="center"> </el-table-column>
                <el-table-column label="产品名" prop="name" align="center" sortable="custom"> </el-table-column>
                <el-table-column label="产品数量" prop="count" align="center" sortable="custom"> </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <div slot-scope="{ row }">
            <el-button type="primary" size="mini" style="width: 100%" @click="onCreateOrEdit('edit', row)">
              编辑
            </el-button>
          </div>
        </el-table-column>
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

    <TemuDlgCombineProductEdit
      :visible="combineProductEditDlg.visible"
      :title="combineProductEditDlg.title"
      :type="combineProductEditDlg.type"
      :data="combineProductEditDlg.data"
      @close="
        () => {
          combineProductEditDlg.visible = false;
          this.getTableData();
        }
      "
    />
  </div>
</template>

<script>
import infoList from "@/components/mixins/infoList";
import { combineProductListByPage } from "@/api/product/combine_product";
import TemuDlgCombineProductEdit from "../components/dlg_combine_product_edit.vue";

export default {
  components: {
    TemuDlgCombineProductEdit,
  },
  mixins: [infoList],
  data() {
    return {
      combineProductEditDlg: {
        title: "",
        visible: false,
        data: {},
      },
    };
  },
  methods: {
    listApi: combineProductListByPage,
    onSubmit() {
      this.page = 1;
      this.getTableData();
    },
    onCreateOrEdit(type, data) {
      if (type === "create") {
        this.combineProductEditDlg = {
          title: "创建",
          visible: true,
          data: { id: 0, name: "", list: [{ name: "", count: 1 }] },
        };
      } else if (type === "edit") {
        this.combineProductEditDlg = {
          title: "编辑",
          visible: true,
          data,
        };
      }
    },
  },
  async created() {
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
