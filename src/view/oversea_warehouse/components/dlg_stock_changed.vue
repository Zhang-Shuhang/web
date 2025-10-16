<template>
  <el-drawer :visible.sync="$attrs.visible" title="库存变更记录(3天内系统自动入库)" @opened="onOpened" size="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border height="85vh" @sort-change="sortChange"
              size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column label="货号" prop="sku_code" align="center">
      </el-table-column>
      <el-table-column label="来源编码" prop="stock_code_id" align="center">
      </el-table-column>
      <el-table-column label="可分配数量" prop="count" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini" type="warning" effect="dark">{{ row.count > 0 ? `+${row.count}` : row.count }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="原因" prop="reason" align="center">
      </el-table-column>
      <el-table-column label="Sku Id" prop="sku_id" align="center">
        <template slot-scope="{row}">
          <div v-if="row.sku_id">
            {{ row.sku_id }}
          </div>
          <div v-else>
            {{ row.string_sku_id }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" prop="user_id" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini" type="primary">
            {{ row.is_system ? "系统" : row.user_id }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" align="center">
        <template slot-scope="{row}">
          <el-tag size="mini">
            {{ new Date(row.created_at).toLocaleString() }}
          </el-tag>
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
  </el-drawer>
</template>


<script>
import infoList from '@/components/mixins/infoList'
import {overseasWarehouseStockChangeRecordList} from "@/api/oversea_warehouse/list";

export default {
  name: 'TemuDlgStockChangedRecord',
  components: {},
  mixins: [infoList],
  props: {
    sku_code: {
      type: String,
    },
    is_system: {
      type: Boolean,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      listApi: overseasWarehouseStockChangeRecordList,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.$set(this.searchInfo, "sku_code", this.sku_code)
      this.$set(this.searchInfo, "is_system", this.is_system ? 1 : 0)

      if (this.is_system) {
        // 创建当前时间的副本
        const threeDaysAgo = new Date();
        // 将日期减去3天（自动处理月份/年份变化）
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        this.$set(this.searchInfo, "start_time", threeDaysAgo.toLocaleDateString())
      }

      this.getTableData()
    },
    selectionChange(val) {
      if (!val || val.length <= 0) {
        return
      }

      let skuCodes = []
      val.forEach((item) => {
        if (skuCodes.indexOf(item.sku_code) >= 0) {
          return
        }
        skuCodes.push(item.sku_code)
      })
      this.copy(skuCodes.join(" "))
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>