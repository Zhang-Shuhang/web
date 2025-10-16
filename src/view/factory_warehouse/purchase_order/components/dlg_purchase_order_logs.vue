<template>
  <el-drawer :visible.sync="$attrs.visible" title="变化记录" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border min-height="500px" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="更新时间" prop="created_at" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.created_at).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="更新前" prop="before" align="center">
      </el-table-column>
      <el-table-column label="变化数值" prop="change" align="center">
      </el-table-column>
      <el-table-column label="更新后" prop="after" align="center">
      </el-table-column>
      <el-table-column label="操作人" prop="user_id" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary">{{row.user_id === userInfo.ID ? "自己" : row.user_id}}</el-tag>
        </div>
      </el-table-column>

<!--      user_id-->
<!--      :-->
<!--      16-->
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
import KdxImage from "@/components/image/image.vue";
import Upload from "@/view/components/upload.vue";
import infoList from '@/components/mixins/infoList'
import {mapGetters} from "vuex";
import {factoryWarehousePurchaseOrderLogListByPage} from "@/api/factory_warehouse/purchase_order_log";

export default {
  name: 'TemuDlgPurchaseOrderLogs',
  components: {Upload, KdxImage},
  props: {
    order_id: {
      type: String,
    },
    order_item_id: {
      type: Number,
    },
  },
  mixins: [infoList],
  watch: {},
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  data() {
    return {
      listApi: factoryWarehousePurchaseOrderLogListByPage,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.$set(this.searchInfo, "purchase_order_id", this.order_id);
      this.getTableData()
    },
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