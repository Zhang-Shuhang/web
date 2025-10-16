<template>
  <el-drawer :visible.sync="$attrs.visible" title="上架产品记录" @opened="onOpened" size="80%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="产品id" v-model="searchInfo.simple_product_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="产品名" v-model="searchInfo.simple_product_name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.template_ids" placeholder="模板列表" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in template_list" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_zf" placeholder="是否作废" clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="未作废" :value="2"></el-option>
                <el-option label="已作废" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_self" placeholder="是否本人操作" clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="本人" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" height="100%" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
          <template slot-scope="{row}">
            <div v-if="row.account" @click="clickAccountName(row.account.id)">
              {{row.account.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模板名" prop="template.name" align="center">
          <template slot-scope="{row}">
            <div v-if="row.template" @click="clickTemplateName(row.template.id)">
              {{row.template.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品名" prop="simple_product.name" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="product_id" align="center" min-width="100px">
        </el-table-column>
        <el-table-column label="Skc Id" prop="product_skc_id" align="center" min-width="100px">
        </el-table-column>
        <el-table-column label="Sku Id" prop="product_sku_id" align="center" min-width="100px">
        </el-table-column>
        <el-table-column label="是否作废" prop="is_zf" align="center" min-width="100px">
          <template slot-scope="{row}">
            <el-tag size="mini">{{row.is_zf ? "已作废" : "未作废"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="上架时间" prop="created_at" align="center" min-width="100px">
          <template slot-scope="{row}">
            <el-tag size="mini">{{new Date(row.created_at).toLocaleString()}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="{row}">
            <el-button style="width: 100%" size="mini" type="danger" @click="onZf(row)" v-if="!row.is_zf">作废</el-button>
          </template>
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

  </el-drawer>
</template>

<script>
import {
  simpleProductTemplateListSimple,
  simpleProductUploadRecordList, simpleProductUploadZf
} from "@/api/temu/simple_product";
import infoList from "@/components/mixins/infoList";

export default {
  name: 'TemuDlgSimpleProductUploadRecords',
  components: {},
  mixins: [infoList],
  props: {
    accountOptions: {
      type: Array,
    },
    product_ids: {
      type: Array,
    },
    obj: {
      type: Object,
    },
  },
  computed: {},
  watch: {
    searchInfo: {
      handler() {
        this.page = 1
        this.getTableData()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: simpleProductUploadRecordList,

      selectRows: [],
      template_list: [],
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      if (this.product_ids.length) {
        this.$set(this.searchInfo, "simple_product_id", this.product_ids.join(" "))
      } else if (this.obj) {
        this.$set(this.searchInfo, "simple_product_id", this.obj.id)
      } else {
        this.$set(this.searchInfo, "simple_product_id", undefined)
      }
      this.$set(this.searchInfo, "is_zf", 2)

      let resp = await simpleProductTemplateListSimple()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }
      this.template_list = resp.data

      this.getTableData()
    },
    onZf(row) {
      this.$confirm('请确认是否作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await simpleProductUploadZf({id: row.id})
            if (resp.code) {
              return
            }

            this.$message("作废成功")
            this.getTableData()
          })
    },
    selectionChange(val) {
      this.selectRows = val
      let ids = []
      for (const row of this.selectRows) {
        if (ids.indexOf(row.product_skc_id) >= 0) {
          continue
        }
        ids.push(row.product_skc_id)
      }
      if (ids.length) {
        this.copy(ids.join((" ")))
      }
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    clickAccountName(accountId) {
      this.searchInfo.accounts = [accountId]
      this.getTableData()
    },
    clickTemplateName(templateId) {
      this.searchInfo.template_ids = [templateId]
      this.getTableData()
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())
  }
}
</script>
<style scoped lang="scss">
  .img-wrap {
    position: relative;
  }
  .img-wrap .close {
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 100;
    color: white;
    font-size: 16px;
    background-color: red;
    border-radius: 10px;
    opacity: 0.8;
  }

  ::v-deep .el-input-group__append .el-button {
    border-color: #409EFF;
    background-color: #409EFF;
    color: white;
  }
</style>