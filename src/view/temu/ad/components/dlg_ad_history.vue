<template>
  <el-drawer :visible.sync="$attrs.visible" title="广告历史记录" @opened="onOpened" size="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="singleTable" :data="tableData" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="日期" prop="date" align="center">
      </el-table-column>
      <el-table-column label="广告投资回报率 (ROAS)" prop="real_roas" align="center">
        <div slot-scope="{row}">
          <template v-if="row.roas > 0">
            <el-tag size="mini" effect="dark" type="danger" v-if="row.roas <= 5000">{{(row.roas/1000).toFixed(2)}}</el-tag>
            <el-tag size="mini" effect="dark" type="warning" v-else-if="row.roas <= 7000">{{(row.roas/1000).toFixed(2)}}</el-tag>
            <el-tag size="mini" effect="dark" type="info" v-else-if="row.roas <= 9000">{{(row.roas/1000).toFixed(2)}}</el-tag>
            <el-tag size="mini" effect="dark" type="success" v-else>{{(row.roas/1000).toFixed(2)}}</el-tag>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="广告花费" prop="ad_spend" align="center" sortable="custom">
        <div slot-scope="{row}">
          {{(row.ad_spend/100).toFixed(2)}}<span v-if="row.order_pay_cnt">({{(row.ad_spend/100/row.order_pay_cnt).toFixed(2)}})</span>
        </div>
      </el-table-column>
      <el-table-column label="支付金额" prop="order_pay_amt" align="center" sortable="custom">
        <div slot-scope="{row}">
          {{(row.order_pay_amt/100).toFixed(2)}}<span v-if="row.order_pay_cnt">({{(row.order_pay_amt/100/row.order_pay_cnt).toFixed(2)}})</span>
        </div>
      </el-table-column>
      <el-table-column label="曝光量" prop="impr_cnt" align="center" sortable="custom">
      </el-table-column>
      <el-table-column label="点击" align="center">
        <el-table-column label="次数" prop="clk_cnt" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="率(CTR)" prop="ctr" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{(row.ctr/100).toFixed(2)}}%
          </div>
        </el-table-column>
      </el-table-column>
      <el-table-column label="购物车" prop="cart_cnt" align="center" sortable="custom">
      </el-table-column>
      <el-table-column label="订单量" prop="order_pay_cnt" align="center" sortable="custom">
        <div slot-scope="{row}">
          {{(row.order_pay_cnt)}}
        </div>
      </el-table-column>
      <el-table-column label="广告费比（ACOS）" prop="acos" align="center" sortable="custom">
        <div slot-scope="{row}">
          {{(row.acos/100).toFixed(2)}}%
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
  export default {
    name: 'TemuDlgAdHistory',
    components: {},
    props: {
      tableData: {
        type: Array,
      },
    },
    computed: {},
    watch: {},
    data() {
      return {
      }
    },
    methods: {
      handleBeforeClose() {
        this.$emit('close', false)
      },
      async onOpened() {
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