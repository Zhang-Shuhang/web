<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="8" :sm="8" :lg="8">
            <el-form-item label-width="0">
              <el-select placeholder="请选择分类" v-model="searchInfo.categories" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="8">
            <el-form-item label-width="0">
              <el-select placeholder="请选择条件" v-model="searchInfo.other_cond" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option label="" value=""></el-option>
                <el-option label="生产中" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="8">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column label="货号" prop="id" align="center" min-width="100px">
          <div slot-scope="{row}">
            <el-tag size="mini" :type="idType(row)" effect="dark">{{row.id}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="分类" prop="category" align="center">
        </el-table-column>
        <el-table-column label="生产状态" align="center" min-width="110px">
          <div slot-scope="{row}">
            <div>
              <el-tag size-mini>生产中: {{row.prepare_not_complete_count}}</el-tag>
            </div>
            <div>
              <el-tag size-mini>待生产: {{row.confirm_count}}</el-tag>
            </div>
<!--            <div>-->
<!--              <el-tag size-mini>待处理: {{row.init_count}}</el-tag>-->
<!--            </div>-->
          </div>
        </el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <div slot-scope="{row}">
            <div>
              <el-button size="mini" style="width: 100%" type="primary" @click="complete(row)" plain>标记完成</el-button>
            </div>
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
import {factoryTaskGroupCategoryList} from "@/api/sf-factory-v2/task_group";
import {produceSortComplete, produceSortList} from "@/api/sf-factory-v2/statistic";

export default {
  components: {
  },
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(()=>{
          this.page = 1
          this.getTableData()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  mixins: [infoList],
  data() {
    return {
      listApi: produceSortList,
      categoryOptions: [],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    idType(row) {
      let d = row.plat_and_real_way_days
      if (row.from) {
        d = row.from_plat_and_real_way_days
      }
      if (d <= 2) {
        return "danger"
      } else if (d <= 4) {
        return "warning"
      }
      return "primary"
    },
    async complete(row) {
      let resp = produceSortComplete({id: row.id})
      if (resp.code) {
        return
      }

      this.$message("标记成功")
      this.getTableData()
    },
    async syncCategoryList() {
      let resp = await factoryTaskGroupCategoryList()
      if (resp.code) {
        return
      }

      this.categoryOptions = resp.data
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "other_cond", [1])

    this.pageSize = 100

    this.syncCategoryList()

    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
</style>