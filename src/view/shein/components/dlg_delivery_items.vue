<template>
  <el-drawer :visible.sync="$attrs.visible" title="发货列表" @opened="onOpened" :size="isMobile ? '100%' : '80%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="发货Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="下单数量" prop="deliveryQuantity" align="center"></el-table-column>
<!--      <el-table-column label="时间" prop="created_at" align="center">-->
<!--        <div slot-scope="{row}">-->
<!--          <span style="font-size: 12px">{{new Date(row.created_at).toLocaleString()}}</span>-->
<!--        </div>-->
<!--      </el-table-column>-->
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
import {deliveryItemList} from "@/api/shein/delivery";

export default {
  name: 'SheinDlgDeliveryItems',
  mixins: [infoList],
  props: {
    id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      listApi: deliveryItemList,
      isMobile: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.$set(this.searchInfo, "variation_id", this.id)
      this.page = 1
      this.getTableData()
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  }
}
</script>
<style scoped lang="scss">
</style>