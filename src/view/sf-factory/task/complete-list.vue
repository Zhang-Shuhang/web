<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-select placeholder="请选择分类" v-model="searchInfo.group" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in groupOptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" ref="search_content" v-model="searchInfo.search_content" clearable filterable @keyup.enter.native="onSubmit">
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable :style="{width: '100px'}">
                  <el-option v-for="(item, index) in searchCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="calcStatistics">分类统计</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini" show-summary :summary-method="getSummaries"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="平台" prop="platform" align="center">
          <div slot-scope="{row}">
            <el-tag size="small" effect="dark" v-if="row.platform===0">Temu</el-tag>
            <el-tag size="small" effect="dark" v-else-if="row.platform===1">Tiktok</el-tag>
            <el-tag size="small" effect="dark" v-else-if="row.platform===2">Shein</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Id" prop="id" align="center">
          <div slot-scope="{row}">
            {{row.id}}
            <div>
              <el-tag size="mini" type="primary">{{row.is_first ? "首" : "返"}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="分类" min-width="150px" align="center">
          <div slot-scope="{row}">
            <template v-if="row.group">
              <el-tag size="mini" type="primary">{{row.group.name}}</el-tag>
            </template>
            <template v-else>
              <el-tag size="mini" type="warning">无分类</el-tag>
            </template>
            <CompSetGroup :id="row.id" :name="row.group ? row.group.name : ''" @success="onSubmit"></CompSetGroup>
          </div>
        </el-table-column>
        <el-table-column label="Skc" prop="skc" align="center">
        </el-table-column>
        <el-table-column label="Sku Id" prop="sku_id" align="center">
        </el-table-column>
        <el-table-column label="Sku Code" prop="sku_code" align="center">
        </el-table-column>
        <el-table-column label="物流单号" prop="logistic" align="center" width="220px">
          <div slot-scope="{row}">
            <div style="font-size: 12px">{{row.logistic}}</div>
          </div>
        </el-table-column>
        <el-table-column label="图片" prop="image" align="center">
          <div slot-scope="{row}">
            <template v-if="row.image">
              <KdxImage :src="row.image" width="60px" height="60px"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="数量" prop="count" align="center"></el-table-column>
        <el-table-column label="日期" prop="date" align="center"></el-table-column>
        <el-table-column label="上传时间" prop="date" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleDateString()}}
          </div>
        </el-table-column>
        <el-table-column label="完成时间" prop="date" align="center">
          <div slot-scope="{row}">
            {{new Date(row.complete_time).toLocaleDateString()}} {{new Date(row.complete_time).toLocaleTimeString()}}
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
import {factoryTaskCalcStatistics, factoryTaskList} from "@/api/sf-factory/task";
import KdxImage from "@/components/image/image";
import {mapGetters} from "vuex";
import {groupList} from "@/api/sf-factory/group";
import CompSetGroup from "@/view/sf-factory/components/comp_set_group.vue";

export default {
  components: {
    CompSetGroup,
    KdxImage
  },
  computed:{
    ...mapGetters("user", ["token"]),
  },
  mixins: [infoList],
  data() {
    return {
      listApi: factoryTaskList,

      searchCondOptions: [
        {id: 1, name: "Id"},
      ],
      groupOptions: [],

      selectRows: [],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
      this.$refs['search_content'].select()
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.getTableData()
      if (res.data) {
        this.$message.error(res.data.join("\n"));
      } else {
        this.$message("上传成功!");
      }
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    selectionChange(val) {
      this.selectRows = val
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "count") {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总计 " + sums[index].toFixed(0) + " 个"
        }
        if (column.property === "id") {
          sums[index] = "总计 " + data.length + " 箱"
        }
      });

      return sums;
    },
    async syncGroupList() {
      let resp = await groupList()
      if (resp.code) {
        return
      }

      this.groupOptions = resp.data
    },
    async calcStatistics() {
      let resp = await factoryTaskCalcStatistics({start_time: this.searchInfo.start_time, end_time: this.searchInfo.end_time})
      if (resp.code) {
        return
      }

      if (!resp.data) {
        return
      }

      let array = []
      resp.data.forEach((item) => {
        array.push(`${item.name ? item.name : "无分类"} 发送: ${item.count} 个`)
      })

      this.$notify({
        title: `${this.searchInfo.start_time ? this.searchInfo.start_time : "从开始"} 到 ${this.searchInfo.end_time ? this.searchInfo.end_time : "现在"}累计发送: `,
        dangerouslyUseHTMLString: true,
        message: `${array.join("<br>")}`,
        duration: 10000,
      });
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())

    this.$set(this.searchInfo, "search_cond", 1)
    this.$set(this.searchInfo, "status", 3)

    this.syncGroupList()

    this.getTableData()
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>