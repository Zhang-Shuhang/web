<template>
  <el-dialog :visible.sync="$attrs.visible" title="每日统计" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border height="50vh" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="日期" prop="date" align="center">
      </el-table-column>
      <el-table-column label="曝光量" prop="expose_cnt" align="center">
      </el-table-column>
      <el-table-column label="点击率" prop="click_rate" align="center">
        <div slot-scope="{row}">
          {{rate(row.click_rate)}}
        </div>
      </el-table-column>
      <el-table-column label="访客数" prop="expose_uv" align="center">
      </el-table-column>
      <el-table-column label="加车数" prop="cart_uv" align="center">
      </el-table-column>
      <el-table-column label="加车率" prop="cart_rate" align="center">
        <div slot-scope="{row}">
          {{rate(row.cart_rate)}}
        </div>
      </el-table-column>
      <el-table-column label="转换率" prop="conversion_rate" align="center">
        <div slot-scope="{row}">
          {{rate(row.conversion_rate)}}
        </div>
      </el-table-column>
      <el-table-column label="购买人数" prop="buying_user_cnt" align="center">
      </el-table-column>
      <el-table-column label="销量" prop="sale_cnt" align="center">
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
import {variationDailyList} from "@/api/tiktok/variation";

export default {
  name: 'TiktokDlgDaily',
  components: {},
  props: {
    id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      tableData: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await variationDailyList({id: this.id})
      if (resp.code) {
        return
      }

      this.tableData = resp.data
    },
    rate(r) {
      if (!r) {
        return "0.00%"
      }

      return (r*100).toFixed(2) + "%"
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.pageSize = 100
  }
}
</script>
<style scoped lang="scss">
</style>