<template>
  <el-dialog :visible.sync="$attrs.visible" :title="`退货记录(${id})`" width="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="单号" prop="id" align="center">
      </el-table-column>
      <el-table-column label="物流" prop="logistics_type_desc" align="center">
      </el-table-column>
      <el-table-column label="物流单号" prop="express_de_livery_sn" align="center">
        <div slot-scope="{row}">
          <el-link size="mini" type="primary" :href="`https://kuaidi100.com/result.jsp?nu=${row.express_de_livery_sn}`" target="_blank">{{row.express_de_livery_sn}}</el-link>
        </div>
      </el-table-column>
      <el-table-column label="状态" prop="package_status_desc" align="center">
      </el-table-column>
      <el-table-column label="付款方式" prop="pay_method_desc" align="center">
      </el-table-column>
      <el-table-column label="数量" prop="return_supplier_quantity" align="center">
      </el-table-column>
      <el-table-column label="原因" prop="return_supplier_reason_desc" align="center">
      </el-table-column>
      <el-table-column label="联系人" prop="contactName" align="center">
      </el-table-column>
      <el-table-column label="联系人电话" prop="contactPhone" align="center">
      </el-table-column>
      <el-table-column label="原因2" prop="reason" align="center">
      </el-table-column>
      <el-table-column label="退件物流费用" prop="goods_refund_cost.amount" align="center">
        <div slot-scope="{row}">
          <el-tag type="primary" size="small" v-if="row.goods_refund_cost">¥ {{row.goods_refund_cost.amount.toFixed(2)}}</el-tag>
          <el-button type="primary" size="mini" @click="queryRefundList(row.express_de_livery_sn)" v-if="queryRefundList">查退货记录</el-button>
        </div>
      </el-table-column>
      <el-table-column label="打包结束时间" align="center">
        <div slot-scope="{row}">
          {{new Date(row.package_finish_time).toLocaleString()}}
        </div>
      </el-table-column>
      <el-table-column label="包裹发出时间" align="center">
        <div slot-scope="{row}">
          {{new Date(row.outbound_time).toLocaleString()}}
        </div>
      </el-table-column>
      <el-table-column label="退货列表" width="400" align="center">
        <div slot-scope="{row}">
          <el-table class="table-body" ref="multipleTable" :data="row.items" border height="100%"
                    size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
            <el-table-column label="所属产品" prop="item_images" align="center" v-if="showOwnerProduct">
              <div slot-scope="{row}">
                <div v-for="(item, index) in row.item_images" :key="index">
                  <el-tag size="small" type="primary">{{item.id}}</el-tag>
                </div>
              </div>
            </el-table-column>
            <el-table-column label="图片" prop="thumbUrl" align="center">
              <div slot-scope="{row}">
                <KdxImage :src="row.thumbUrl" width="60px" height="60px"></KdxImage>
              </div>
            </el-table-column>
            <el-table-column label="数量" prop="return_supplier_quantity" align="center">
            </el-table-column>
            <el-table-column label="是否本产品" align="center">
              <div slot-scope="{row}">
                <el-tag type="primary" v-if="image && row.thumbUrl.indexOf(image) >= 0">
                  本产品
                </el-tag>
                <el-tag type="danger" v-else>
                  非本产品
                </el-tag>
              </div>
            </el-table-column>
          </el-table>
        </div>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgReturnRecord',
  components: {KdxImage},
  mixins: [],
  props: {
    id: {
      type: String,
    },
    image: {
      type: String,
    },
    list: {
      type: Array,
    },
    queryRefundList: {
      type: Function,
    },
    showOwnerProduct: {
      type: Boolean,
      default: true,
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
}
</script>
<style scoped lang="scss">
</style>