<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.sub_warehouse" clearable filterable style="width: 100%">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in subWarehouseOptions" :key="index" :label="item.name" :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">仓库Id: {{ item.id }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_printed" clearable filterable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="未打印" :value="1"></el-option>
                <el-option label="已打印" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.used_start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="使用开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.used_end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="使用结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_delivery" clearable filterable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="已签收" :value="1"></el-option>
                <el-option label="未签收" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_self_delivery" clearable filterable style="width: 100%" placeholder="是否自行配送">
                <el-option value=""></el-option>
                <el-option label="自行配送" :value="1"></el-option>
                <el-option label="非自行配送" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="箱唛号" v-model="searchInfo.xm_id" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="仓库id" v-model.number="searchInfo.sub_warehouse_id" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="print(selectRows)">批量打印</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="是否自行配送" prop="is_self_delivery" align="center" width="120px">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">{{row.is_self_delivery ? '自行配送' : '非自行配送'}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="物流公司" prop="express_company" align="center" width="120px">
        </el-table-column>
        <el-table-column label="物流单号" prop="id" align="center" width="150px">
          <div slot-scope="{row}">
            <el-link size="mini" type="primary" :href="`https://kuaidi100.com/result.jsp?nu=${row.id}`" target="_blank">{{row.id}}</el-link>
          </div>
        </el-table-column>
        <el-table-column label="收货仓库" prop="sub_warehouse_name" align="center" width="150px">
        </el-table-column>
        <el-table-column label="打印次数" prop="printed_times" align="center" width="100px">
        </el-table-column>
        <el-table-column label="使用时间" prop="real_used_time" align="center" width="150px">
          <div slot-scope="{row}">
            <template v-if="row.real_used_time">
              {{new Date(row.real_used_time).toLocaleString()}}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="最后一条信息" prop="last_message" align="center">
        </el-table-column>
        <el-table-column label="最后一条信息时间" prop="last_message_time" align="center" width="150px">
          <div slot-scope="{row}">
            <template v-if="row.last_message_time">
              {{new Date(row.last_message_time).toLocaleString()}}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <div slot-scope="{row}">
            <div v-if="row.is_self_delivery">
              <el-button size="mini" style="width: 100%" type="primary" @click="print([row])" plain>打印</el-button>
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
import {selfDeliveryList, selfDeliveryPrint, selfDeliveryWarehouseList} from "@/api/sf-factory-v2/self_delivery";

export default {
  components: {
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        this.onSubmit()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: selfDeliveryList,

      subWarehouseOptions: [],
      selectRows: [],
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
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async print(rows) {
      let printed_times = 0
      rows.forEach((item) => {
        if (item.printed_times) {
          printed_times = item.printed_times
        }
      })
      if (printed_times) {
        this.$confirm("此操作可能多次打印该运单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
            .then(()=>{this.doPrint(rows)})
      } else {
        this.doPrint(rows)
      }
    },
    async doPrint(rows) {
      let ids = []
      rows.forEach((item) => {ids.push(item.id)})
      let resp = await selfDeliveryPrint({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("打印成功")

      window.open(window.location.origin + "/sf-factory-v2/" + resp.data, "_BLANK")
      this.getTableData()
    },
    checkSelectable(row) {
      return row.is_self_delivery
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "is_printed", 1)
    this.$set(this.searchInfo, "is_self_delivery", 1)

    let resp = await selfDeliveryWarehouseList()
    if (!resp.code) {
      this.subWarehouseOptions = resp.data
    }

    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}
</style>