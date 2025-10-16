<template>
  <el-dialog :visible.sync="$attrs.visible" title="发货列表" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border min-height="20vh" @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="发货id" prop="shipment.id" align="center">
      </el-table-column>
      <el-table-column label="状态" prop="shipment.status" align="center" width="240px">
      </el-table-column>
      <el-table-column label="是否发货" align="center">
        <template slot-scope="{row}">
          <el-tag v-if="row.received_quantity || (row.shipment && row.shipment.custom)">
            已发货
          </el-tag>
          <el-tag type="danger" v-else>
            未发货
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请发货量" prop="declared_quantity" align="center">
      </el-table-column>
      <el-table-column label="收到数量" prop="received_quantity" align="center">
      </el-table-column>
      <el-table-column label="预期外数量" prop="unexpected_quantity" align="center">
      </el-table-column>
      <el-table-column label="上架数量" prop="on_sale_quantity" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <div>
            <el-link size="mini" type="primary" :href="`https://global-selling.mercadolibre.com/shipping/inbounds/${row.shipment.id}/details`" :underline="false" target="_blank">跳转</el-link>
          </div>
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
  </el-dialog>
</template>


<script>
  import infoList from '@/components/mixins/infoList'
  import {shipmentUnitList} from "@/api/mkd/shipment_unit";

  export default {
    name: 'MkdDlgShipmentUnits',
    components: {},
    mixins: [infoList],
    props: {
      variation_id: {
        type: Number,
      },
    },
    computed: {},
    watch: {},
    data() {
      return {
        listApi: shipmentUnitList,
      }
    },
    methods: {
      handleBeforeClose() {
        this.$emit('close', false)
      },
      async onOpened() {
        this.$set(this.searchInfo, "variation_id", this.variation_id)
        this.$set(this.searchInfo, "page", 1)
        this.$set(this.searchInfo, "page_size", 50)

        this.getTableData()
      }
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