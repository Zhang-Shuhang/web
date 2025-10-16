<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.platform" multiple collapse-tags clearable filterable :style="{width: '100%'}">
                <el-option v-for="(item, index) in platformOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_hide_complete" clearable filterable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="隐藏已完成" :value="1"></el-option>
                <el-option label="显示未扫描" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="任务编号" v-model="searchInfo.batch_group_ids" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="生产序号" v-model="searchInfo.item_ids" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids" v-model="searchInfo.sku_ids" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.ext_codes" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4">
            <el-form-item label-width="0">
              <el-button type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="4" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="exportItems">导出勾选</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="平台" prop="platform" align="center" width="100">
          <div slot-scope="{row}">
            <el-tag size="mini" effect="dark" v-if="row.platform===0">Temu</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===1">Tiktok</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===2">Shein</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===3">外发</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===4">亚马逊</el-tag>
            <el-tag size="mini" effect="dark" v-else-if="row.platform===5">Temu Y2</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="任务编号" prop="group_id" align="center" width="120">
        </el-table-column>
        <el-table-column label="生产序号" prop="id" align="center" width="120">
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center" width="100">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="唯一Id" prop="unique_id" align="center">
        </el-table-column>
        <el-table-column label="Sku Id" prop="sku_id" align="center">
        </el-table-column>
        <el-table-column label="货号" prop="ext_code" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <el-link size="mini" type="primary" :href="row.image" :underline="false" target="_blank">图片</el-link>
          </div>
        </el-table-column>
        <el-table-column label="条码" align="center">
          <div slot-scope="{row}">
            <el-link size="mini" type="primary" :href="row.barcode ? row.barcode.pdf_url : row.code_url" :underline="false" target="_blank" v-if="row.barcode || row.code_url">条码</el-link>
          </div>
        </el-table-column>
        <el-table-column label="打印时间" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.printed_time">{{ new Date(row.printed_time).toLocaleString() }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="是否生成图纸" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">{{ row.is_generate_diagram > 0 ? `已生成(${row.is_generate_diagram === 1 ? '无法排版' : row.is_generate_diagram})` : "未生成" }}</el-tag>
            <div v-if="row.generate_dir">
              <el-button size="mini" type="primary" @click="copy(row.generate_dir)">复制生成目录</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="开始生产时间" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.start_producing_time">{{ new Date(row.start_producing_time).toLocaleString() }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" :type="row.is_cancel ? 'primary' : 'danger'" @click="cancel(row.id)">{{row.is_cancel ? "继续生产" : "取消生产"}}</el-button>
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
import {
  factoryBatchItems, factoryBatchItemsExport
} from "@/api/sf-factory-v2/batch";

export default {
  components: {
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.inited) {
          this.onSubmit()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: factoryBatchItems,

      platformOptions: [
        {id: 0, name: "Temu"},
        {id: 1, name: "Tiktok"},
        {id: 2, name: "Shein"},
        {id: 3, name: "外发"},
        {id: 4, name: "亚马逊"},
        {id: 5, name: "Temu Y2"},
        {id: 6, name: "京东"},
      ],

      inited: false,

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
    async exportItems() {
      let resp = await factoryBatchItemsExport({ids: this.selectRows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank");
    },
  },
  async created() {
    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "is_hide_complete", 2)
    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 28px;
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

::v-deep .el-table .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}
</style>