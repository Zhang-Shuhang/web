<template>
  <el-drawer :visible.sync="$attrs.visible" title="发货列表" @opened="onOpened" :size="isMobile ? '100%' : '85%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        发货列表
      </div>
      <div style="display: block; float: right">
        <el-select size="mini" v-model="searchInfo.type" placeholder="类型" filterable clearable @change="getTableData(page, pageSize)">
          <el-option label="" value=""></el-option>
          <el-option label="加急" :value="1"></el-option>
          <el-option label="JIT" :value="2"></el-option>
          <el-option label="定制" :value="3"></el-option>
          <el-option label="备货" :value="4"></el-option>
        </el-select>
        <el-select size="mini" v-model="searchInfo.status" placeholder="状态" multiple filterable clearable collapse-tags @change="getTableData(page, pageSize)">
          <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
        <el-select size="mini" v-model="searchInfo.other_cond" placeholder="其他" multiple filterable clearable collapse-tags @change="getTableData(page, pageSize)">
          <el-option v-for="(item, index) in otherCondOptions" :key="index" :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="mini" @click="copyPlanIds" v-if="tableData.length">复制备货单号</el-button>
      </div>
    </div>
    <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="备货单信息" prop="plan_id" align="center">
      </el-table-column>
      <el-table-column label="类型" prop="plan_id" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" effect="dark">{{typeName(row)}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <div slot-scope="{row}">
          {{statusName(row.status)}}
        </div>
      </el-table-column>
      <el-table-column label="下单数量" prop="purchase_quantity" align="center"></el-table-column>
      <el-table-column label="送货" prop="deliver_quantity" align="center"></el-table-column>
      <el-table-column label="已上架已质检数量" prop="real_receive_authentic_quantity" align="center">
        <el-table-column label="平台" prop="real_receive_authentic_quantity" align="center">
          <div slot-scope="{row}">
            {{row.real_receive_authentic_quantity}}
          </div>
        </el-table-column>
        <el-table-column label="销售管理-收货" prop="detail.real_receive_authentic_quantity" align="center">
        </el-table-column>
        <el-table-column label="销售管理-上架" prop="detail.onShelfQcQuantity" align="center">
        </el-table-column>
        <el-table-column label="修复" align="center">
          <div slot-scope="{row}">
            <div v-if="row.status > 3">
              <el-tag size="mini" type="primary" v-if="row.real_receive">{{row.real_receive.quantity}}</el-tag>
              <TemuDlgPlanItemRealReceive :id="row.id" :count="row.real_receive_authentic_quantity > 0 ? row.real_receive_authentic_quantity : row.deliver_quantity" @update="onSubmit"></TemuDlgPlanItemRealReceive>
            </div>
          </div>
        </el-table-column>
      </el-table-column>
      <el-table-column label="单号" prop="plan.delivery_order_sn" align="center">
        <div slot-scope="{row}">
          <el-link v-if="row.plan && row.plan.delivery_order_sn" @click="queryTraceInfo(row.plan_id)" type="primary">{{ row.plan.delivery_order_sn }}</el-link>
        </div>
      </el-table-column>
      <el-table-column label="发货时间" prop="deliver_time" align="center">
        <div slot-scope="{row}">
          <div v-if="row.plan && row.plan.deliver_time">
            {{new Date(row.plan.deliver_time).toLocaleString()}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="工厂状态" prop="status_name" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-if="row.status_name">{{ row.status_name }}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="工厂标记完成时间" prop="complete_time" align="center">
        <div slot-scope="{row}">
          <div v-if="row.complete_time">
            {{new Date(row.complete_time).toLocaleString()}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="是否加入发货台" prop="is_can_join_deliver_platform" align="center" min-width="200px">
        <div slot-scope="{row}">
          <el-tag size="mini" type="danger" v-if="row.is_can_join_deliver_platform">
            未加入发货台
          </el-tag>
          <el-tag size="mini" type="success" v-else-if="row.delivery_order_sn">
            已加入发货台({{row.delivery_order_sn}})
          </el-tag>
          <el-tag size="mini" type="warning" v-else>
            已加入发货台
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column label="发货单号" prop="delivery_order_sn" align="center">
      </el-table-column>
      <el-table-column label="是否可以今日加入" prop="today_can_deliver" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-if="row.today_can_deliver">今日可加入</el-tag>
          <el-tag size="mini" type="danger" v-else>今日不可加入</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <div slot-scope="{row}">
          <div v-if="row.status===1">
            <el-row v-if="row.is_can_join_deliver_platform">
              <el-col :span="12">
                <el-button size="mini" type="primary" style="width: 100%" @click="onJoinDeliveryGoodsOrderPlatform(row.id)">加入发货台</el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" type="primary" style="width: 100%" @click="onAllJoinDeliveryGoodsOrderPlatform" plain>全部加入发货台</el-button>
              </el-col>
            </el-row>
          </div>
          <div v-if="canZf(row.status)">
            <template v-if="row.qc_detail && row.return_records && row.return_records.length">
              <el-row>
                <el-col :span="12">
                  <el-tag :type="row.qc_detail.qc_result === 1 ? 'primary' : 'danger'" style="width: 100%" effect="dark" size="medium">{{row.qc_detail.qc_result === 1 ? "合格" : "不合格"}}</el-tag>
                </el-col>
                <el-col :span="12" v-if="row.qc_detail.result.flaw_vo_list && row.qc_detail.result.flaw_vo_list.length">
                  <el-button size="mini" type="primary" style="width: 100%" @click="openQcDetail(row)">查看质检结果</el-button>
                </el-col>
              </el-row>
              <div v-if="showJoinBtn && row.plan && row.plan.delivery_order">
                <el-tag size="mini" type="primary" v-if="row.plan.delivery_order.info">已加入待处理({{row.plan.delivery_order.info.user_id}})</el-tag>
                <el-button size="mini" type="primary" v-else @click="join(row.plan.delivery_order.id)">加入待处理</el-button>
              </div>
              <el-row v-if="row.qc_detail">
                <el-col :span="12">
                  <el-button size="mini" type="danger" style="width: 100%" @click="openReturnRecords(row)" plain>退货记录[{{row.return_records.length}}条]</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button size="mini" type="danger" style="width: 100%" @click="cancelZf(row.id)" plain v-if="row.zf">取消作废({{row.zf.count}})</el-button>
                  <el-button size="mini" type="danger" style="width: 100%" @click="openZf(row.id)" plain v-else>作废</el-button>
                </el-col>
              </el-row>
            </template>
            <template v-else>
              <el-button size="mini" type="danger" style="width: 100%" @click="cancelZf(row.id)" plain v-if="row.zf">取消作废({{row.zf.count}})</el-button>
              <el-button size="mini" type="danger" style="width: 100%" @click="openZf(row.id)" plain v-else>作废</el-button>
            </template>
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

    <el-dialog :visible.sync="zf.visible" title="作废" width="40%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :close="()=>{zf.visible=false}">
      <div>
        <el-input-number size="mini" v-model="zf.count" placeholder="作废数量" :precision="0" style="width: 100%" clearable></el-input-number>
        <div style="height: 30px"></div>
        <el-button size="mini" type="danger" style="width: 100%" @click="onZf">作废</el-button>
      </div>
    </el-dialog>

    <TemuDlgTraceInfo :visible="traceInfo.visible" :id="traceInfo.id" @close="traceInfo.visible=false"></TemuDlgTraceInfo>

    <el-dialog :visible.sync="return_records.visible" :title="`退货记录(${return_records.id})`" width="80%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :close="()=>{return_records.visible=false}">
      <el-table class="table-body" ref="multipleTable" :data="return_records.list" border height="100%"
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
        <el-table-column label="联系人" prop="contact_name" align="center">
        </el-table-column>
        <el-table-column label="联系人电话" prop="contact_phone" align="center">
        </el-table-column>
        <el-table-column label="原因2" prop="reason" align="center">
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
              <el-table-column label="图片" prop="thumbUrl" align="center">
                <div slot-scope="{row}">
                  <KdxImage :src="row.thumbUrl" width="60px" height="60px"></KdxImage>
                </div>
              </el-table-column>
              <el-table-column label="数量" prop="return_supplier_quantity" align="center">
              </el-table-column>
              <el-table-column label="是否本产品" align="center">
                <div slot-scope="{row}">
                  <el-tag type="primary" v-if="return_records.image && row.thumbUrl.indexOf(return_records.image) >= 0">
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

    <TemuDlgQc :visible="qc_detail.visible" :id="qc_detail.id" @close="qc_detail.visible=false"></TemuDlgQc>

  </el-drawer>
</template>


<script>
import infoList from '@/components/mixins/infoList'
import {
  planItemList,
  planJoinDeliveryGoodsOrderPlatform,
  planJoinDeliveryGoodsOrderPlatformBySkuId,
  planZf
} from "@/api/temu/plan_item";
import KdxImage from "@/components/image/image.vue";
import {Notification} from "element-ui";
import TemuDlgQc from "@/view/temu/components/dlg_qc.vue";
import TemuDlgPlanItemRealReceive from "@/view/temu/components/dlg_plan_item_real_receive.vue";
import {deliveryOrderJoin} from "@/api/temu/delivery_order";
import TemuDlgTraceInfo from "@/view/temu/components/dlg_trace_info.vue";

export default {
  name: 'TemuDlgPlans',
  components: {TemuDlgTraceInfo, TemuDlgPlanItemRealReceive, TemuDlgQc, KdxImage},
  mixins: [infoList],
  props: {
    id: {
      type: Number,
    },
    defaultStatus: {
      type: Array,
    },
    showJoinBtn: {
      type: Boolean,
      default: false,
    }
  },
  computed: {},
  watch: {
    "searchInfo.status"() {
      this.onSubmit()
    },
    "searchInfo.other_cond"() {
      this.onSubmit()
    },
  },
  data() {
    return {
      listApi: planItemList,
      isMobile: false,

      zf: {
        id: undefined,
        count: 1,
        visible: false,
      },

      traceInfo: {
        id: undefined,
        visible: false,
      },

      return_records: {
        id: "",
        image: "",
        list: [],
        visible: false
      },

      qc_detail: {
        id: "",
        visible: false
      },

      statusOptions: [
        {id: 0, name: "待接单"},
        {id: 1, name: "待发货"},
        {id: 2, name: "已送货"},
        {id: 3, name: "已收货"},
        {id: 5, name: "质检全部退回"},
        {id: 6, name: "已验收"},
        {id: 7, name: "已入库"},
        {id: 8, name: "已作废"},
        {id: 9, name: "已超时"},
      ],

      otherCondOptions: [
        {id: 1, name: "到货不符"},
        {id: 14, name: "到货偏少"},
        {id: 20, name: "到货少于实际"},
        {id: 21, name: "到货少于实际(无修正)"},
        {id: 19, name: "外发"},
        {id: 22, name: "工厂"},
        {id: 2, name: "未设置优先级"},
        {id: 3, name: "有设置优先级"},
        {id: 10, name: "已加入发货台"},
        {id: 11, name: "未加入发货台"},
        {id: 12, name: "有退件记录"},
        {id: 15, name: "今日可加入"},
        {id: 16, name: "今日不可加入"},
        {id: 17, name: "已加入发货单列表"},
        {id: 18, name: "未加入发货单列表"},
        {id: 4, name: "已预打包"},
        {id: 5, name: "未预打包"},
        {id: 13, name: "4天前发货"},
      ],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.tableData = []
      this.$set(this.searchInfo, "sku_id", this.id)
      this.$set(this.searchInfo, "status", this.defaultStatus)
      this.page = 1
      this.onSubmit()
    },
    onSubmit() {
      if (!this.searchInfo.sku_id) {
        return
      }
      this.getTableData()
    },
    typeName(row) {
      if (!row.plan) {
        return "未知"
      }

      if (row.plan.is_custom_goods) {
        return "定制"
      }
      if (row.plan.purchase_stock_type) {
        return "JIT"
      }
      if (row.plan.urgency_type) {
        return "加急"
      }

      return "VMI"
    },
    statusName(status) {
      switch (status) {
      case 0:
        return "待接单"
      case 1:
        return "待发货"
      case 2:
        return "已送货"
      case 3:
        return "已收货"
      case 4:
        return ""
      case 5:
        return "质检全部退回"
      case 6:
        return "已验收"
      case 7:
        return "已入库"
      case 8:
        return "已作废"
      case 9:
        return "已超时"
      }
      return "未知"
    },
    canZf(status) {
      switch (status) {
      case 2:
        return true
      case 3:
        return true
      case 6:
        return true
      case 7:
        return true
      case 9:
        return true
      }
      return false
    },
    async onJoinDeliveryGoodsOrderPlatform(id) {
      let resp = await planJoinDeliveryGoodsOrderPlatform({id: id})
      if (resp.code === 0) {
        this.$message("操作成功")
      }
    },
    async onAllJoinDeliveryGoodsOrderPlatform() {
      let resp = await planJoinDeliveryGoodsOrderPlatformBySkuId({id: this.id})
      if (resp.code === 0) {
        if (resp.data) {
          Notification({
            showClose: true,
            message: resp.data.join("\n"),
            offset: 150,
            duration: 15000,
            type: 'error'
          })
          this.$message("部分操作成功")
        } else {
          this.$message("操作成功")
        }
      }
    },
    openZf(id) {
      this.zf.id = id
      this.zf.count = 1
      this.zf.visible = true
    },
    async cancelZf(id) {
      let resp = await planZf({id: id})
      if (resp.code === 0) {
        this.$message("取消成功")
        this.onSubmit()
      }
    },
    async onZf() {
      let resp = await planZf({id: this.zf.id, count: this.zf.count})
      if (resp.code === 0) {
        this.zf.visible = false
        this.$message("作废成功")
        this.onSubmit()
      }
    },
    queryTraceInfo(id) {
      this.traceInfo.id = id
      this.traceInfo.visible = true
    },
    openReturnRecords(row) {
      if (row.item && row.item.item_image) {
        this.return_records.image = row.item.item_image.image
      } else {
        this.return_records.image = ""
      }
      this.return_records.id = row.plan_id
      this.return_records.list = row.return_records
      this.return_records.visible = true
    },
    openQcDetail(row) {
      this.qc_detail.id = row.plan_id
      this.qc_detail.visible = true
    },
    copyPlanIds() {
      if (this.tableData.length <= 0) {
        this.$message("没有单号可以复制")
        return
      }

      let list = []
      this.tableData.forEach((item)=>{
        list.push(item.plan_id)
      })
      this.$copyText(list.join(" ")).then( () => {
        this.$message('复制成功')
        this.handleBeforeClose()
      }, function () {
        this.$message.error('复制失败')
      })
    },
    async join(id) {
      let resp = await deliveryOrderJoin({ids: [id]})
      if (resp.code) {
        return
      }

      this.onSubmit()
    }
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
::v-deep .el-drawer__header {
  margin-bottom: 0px !important;
}
</style>