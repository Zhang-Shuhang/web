<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6" :lg="4">
            <el-date-picker v-model="searchInfo.start_time" type="date" style="width: 100%" placeholder="开始时间"
                            format="yyyy-MM-dd" value-format="yyyy/M/d">
            </el-date-picker>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-date-picker v-model="searchInfo.end_time" type="date" style="width: 100%" placeholder="结束时间"
                            format="yyyy-MM-dd" value-format="yyyy/M/d">
            </el-date-picker>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="8">
            <el-input placeholder="货号" v-model="searchInfo.sku" clearable filterable>
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column align="center" prop="sku" label="货号" min-width="150px">
        </el-table-column>
        <el-table-column align="center" prop="image" label="图片" min-width="150px">
          <template slot-scope="{row}">
            <KdxImage :src="row.image" v-if="row.image"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="total_count" label="数量" sortable="custom">
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
import {profitStatisticsListSku, profitStatisticsListSkuTotal} from "@/api/profit/statistics";
import KdxImage from "@/components/image/image";

export default {
  components: {
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: profitStatisticsListSku,
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.query()
    },
    query() {
      this.getTableData()
      this.queryTotal()
    },
    async queryTotal() {
      let resp = await profitStatisticsListSkuTotal(this.searchInfo)
      if (resp.code) {
        return
      }

      this.$message(`合计: ${resp.data} 个`)
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let timeArray = this.$route.query.time
    if (timeArray === undefined || timeArray === null || timeArray.length !== 2) {
      let curDate = new Date().toLocaleDateString()
      timeArray = []
      timeArray.push(curDate)
      timeArray.push(curDate)
    }
    this.$set(this.searchInfo, "start_time", timeArray[0])
    this.$set(this.searchInfo, "end_time", timeArray[1])
    this.query()
  }
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
</style>