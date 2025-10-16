<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index"
                           :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="类目" v-model="searchInfo.category_id" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option :label="op.name" :value="op.id" v-for="(op, index) in categoryOptions"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="需要补充商品属性" v-model="searchInfo.property_ids" filterable clearable
                         style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option :label="op.name" :value="op.id" v-for="(op, index) in propertyOptions"
                           :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否工厂" v-model="searchInfo.is_factory" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="工厂" :value="1"></el-option>
                <el-option label="非工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2" v-if="canBatchRows.length > 0">
            <el-button size="mini" type="warning" style="width: 100%" @click="openBatchDlg(canBatchRows)">批量修改</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="id" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="类目" prop="category_name" align="center" sortable="custom">
          <div slot-scope="{row}">
            <div @click="clickCategoryName(row)">
              {{ row.category_name }}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="缺失属性" prop="property_names" align="center" sortable="custom">
          <div slot-scope="{row}">
            <div @click="clickPropertyNames(row)">
              {{ row.property_names }}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" prop="image" align="center">
          <div slot-scope="{row}">
            <KdxImage style="display: inline-block" :src="row.image" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="warning" style="width: 100%" @click="openBatchDlg([row])">修改</el-button>
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

    <TemuDlgBatchAdjustTask :category_id="dlgBatch.category_id" :account_id="dlgBatch.account_id" :property_ids="dlgBatch.property_ids"
                            :spu_ids="dlgBatch.spu_ids" :visible="dlgBatch.visible"
                            @suc="getTableData" @close="dlgBatch.visible=false"></TemuDlgBatchAdjustTask>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "@/api/temu/account";
import {adjustTaskCategories, adjustTaskList, adjustTaskProperties, adjustTaskSync} from "@/api/temu/adjust_task";
import TemuDlgBatchAdjustTask from "@/view/temu/adjust_task/components/dlg_adjust_task.vue";

export default {
  name: 'TemuDlgAdjust',
  components: {
    TemuDlgBatchAdjustTask,
    KdxImage
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(() => {
          this.page = 1
          this.getTableData()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: adjustTaskList,

      timeoutId: undefined,

      accountOptions: [],
      categoryOptions: [],
      propertyOptions: [],
      selectRows: [],

      dlgBatch: {
        category_id: undefined,
        account_id: undefined,
        property_ids: [],
        spu_ids: [],
        visible: false,
      },
    }
  },
  computed: {
    canBatchRows() {
      let list = []
      for (const row of this.selectRows) {
        if (list.length !== 0 && (row.property_ids !== list[0].property_ids || row.category_id !== list[0].category_id)) {
          return []
        }

        list.push(row)
      }
      return list
    },
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await adjustTaskSync()
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    clickCategoryName(row) {
      this.$set(this.searchInfo, "category_id", row.category_id)
      this.getTableData()
    },
    clickPropertyNames(row) {
      this.$set(this.searchInfo, "property_ids", row.property_ids)
      this.getTableData()
    },
    async syncAccounts() {
      let resp = await accountList()
      if (resp.code === 0) {
        this.accountOptions = resp.data
      }
    },
    async syncCategories() {
      let resp = await adjustTaskCategories()
      if (resp.code === 0) {
        this.categoryOptions = resp.data
      }
    },
    async syncProperties() {
      let resp = await adjustTaskProperties()
      if (resp.code === 0) {
        this.propertyOptions = resp.data
      }
    },
    openBatchDlg(rows) {
      this.dlgBatch.category_id = rows[0].category_id
      this.dlgBatch.account_id = rows[0].account_id
      this.dlgBatch.property_ids = rows[0].property_ids.split(",").map((v) => {
        return Number(v)
      })
      this.dlgBatch.spu_ids = rows.map((item) => item.id)
      this.dlgBatch.visible = true
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.syncAccounts()
    this.syncCategories()
    this.syncProperties()
    this.getTableData()
  },
}
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

::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}

.button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  height: 24px;
  line-height: 22px;
  width: 100%;
  vertical-align: bottom;
}

::v-deep .select .el-input--suffix .el-input__inner {
  padding-right: 0px;
}

::v-deep .select .el-input__suffix {
  display: none;
}

.input-right-zero {
  padding-right: 0px !important;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 100px;
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

.height_100 {
  height: 100%;
}
</style>