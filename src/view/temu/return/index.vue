<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="请选择状态" filterable :style="{width: '100%'}">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids" v-model="searchInfo.skc_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids" v-model="searchInfo.sku_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="订单号" v-model="searchInfo.plan_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="小秘Sku" v-model="searchInfo.dxm_goods_sku" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="退件id" v-model="searchInfo.return_ids" clearable filterable @keyup.enter.native="onSubmit('return_ids')" ref="return_ids">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="退件物流" v-model="searchInfo.return_express_sn" clearable filterable @keyup.enter.native="onSubmit('return_express_sn')" ref="return_express_sn">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.other_cond" placeholder="其他条件" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in otherCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.reason" placeholder="原因" allow-create collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in reasonOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="canAllocateRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="allocateIds(canAllocateRows)">批量分配箱号</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="canYyclRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openYyclDlg(canYyclRows)">批量运营处理</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="canCkclRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openCkclDlg(canCkclRows)">批量仓库处理</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="canThrowAwayRows.length">
            <el-form-item label-width="0">
              <el-button type="danger" size="mini" :style="{width: '100%'}" @click="onThrowAway(canThrowAwayRows)">批量弃货</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="canConfirmRows.length">
            <el-form-item label-width="0">
              <el-button type="warning" size="mini" :style="{width: '100%'}" @click="onConfirm(canConfirmRows)">批量确认</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3" v-if="canPrintRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onPrint(canPrintRows)">批量打印</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSync">同步</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange" show-summary :summary-method="getSummaries">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="退件信息" prop="package_sn" align="center" width="240px">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" type="primary" v-if="row.account">{{row.account.name}}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary">{{row.package_sn}}</el-tag>
              <i class="el-icon-search" style="margin-left: 5px; color: red" @click="searchPackageSn(row.package_sn)"></i>
            </div>
            <div>
              <el-link :underline="false" size="mini" type="primary" @click="searchPlanId(row.plan_item_id)">查看发货</el-link>
              <el-tag size="mini" type="danger" effect="dark">合计退回数: {{calcReturnCount(row)}}</el-tag>
            </div>
            <template v-if="row.record">
              <hr>
              <el-link :underline="false" size="mini" type="primary" :href="`https://kuaidi100.com/result.jsp?nu=${row.record.express_de_livery_sn}`" target="_blank">退货物流: {{row.record.express_de_livery_sn}}</el-link>
              <div>
                <el-tag size="mini" type="primary" v-if="row.record.goods_refund_cost">退货物流费: ¥{{row.record.goods_refund_cost.amount}}</el-tag>
                <el-tag size="mini" type="primary">退货状态: {{row.record.package_status_desc}}</el-tag>
              </div>
              <div>
                <el-button size="mini" type="danger" @click="openReturnRecords(row)">退货记录[{{row.record.items.length}}种]</el-button>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="商品信息" prop="product_skc_id" align="center" width="200px">
          <div slot-scope="{row}">
            <el-form :ref="`Info-${row.id}`" label-position="left" label-width="60px">
              <el-form-item label="Skc Id">
                <div style="line-height: 28px">{{ row.product_skc_id }}</div>
              </el-form-item>
              <el-form-item label="Sku Id">
                <div style="line-height: 28px">{{ row.product_sku_id }}</div>
              </el-form-item>
              <el-form-item label="Sku" v-if="row.item">
                <div style="line-height: 28px">{{ row.item.sku_ext_code }}</div>
              </el-form-item>
              <el-form-item label="小秘" v-if="row.item && row.item.dxm_goods_sku">
                <div style="line-height: 28px">{{ row.item.dxm_goods_sku.sku }}</div>
              </el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="图片" width="100" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.thumb_url" width="60px" height="60px"></KdxImage>
          </div>
        </el-table-column>
<!--        <el-table-column label="数量" prop="purchase_quantity" align="center" min-width="130px">-->
<!--          <div slot-scope="{row}">-->
<!--            <template v-if="row.plan_item">-->
<!--              <el-form :ref="`Quantity-${row.id}`" label-position="left" label-width="70px">-->
<!--                <el-form-item label="待发货数">-->
<!--                  <div>{{row.plan_item.purchase_quantity}}</div>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="交货数量">-->
<!--                  <div>{{row.plan_item.deliver_quantity}}</div>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="实收数量">-->
<!--                  <div>-->
<!--                    {{row.plan_item.real_receive ? row.plan_item.real_receive.quantity : row.plan_item.real_receive_authentic_quantity}}-->
<!--                    <TemuDlgPlanItemRealReceive :id="row.plan_item_id" :count="row.plan_item.real_receive_authentic_quantity > 0 ? row.plan_item.real_receive_authentic_quantity : row.plan_item.deliver_quantity" @update="getTableData"></TemuDlgPlanItemRealReceive>-->
<!--                  </div>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="次品数量">-->
<!--                  <div>{{row.plan_item.defective_quantity}}</div>-->
<!--                </el-form-item>-->
<!--              </el-form>-->
<!--            </template>-->
<!--          </div>-->
<!--        </el-table-column>-->
        <el-table-column label="原因" prop="remark" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.remark">
              {{row.remark}}
            </el-tag>
            <div v-for="(item, index) in row.reason_desc" :key="index">
              <el-tag size="mini" type="warning">
                {{item}}
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="出仓数量" prop="quantity" align="center">
          <div slot-scope="{row}">
            <div>
              <el-popover placement="left" trigger="click">
                <el-input-number size="mini" style="width: 100%" placeholder="输入新的数量" v-model="edit.count" :min="0" :precision="0"></el-input-number>
                <el-button size="mini" style="width: 100%" type="primary" @click="updateEditCount(row)">修改</el-button>

                <div slot="reference" style="width: auto">
                  <el-tag size="mini" type="primary">{{row.fix ? row.fix.quantity : row.quantity}}</el-tag>
                  <i class="el-icon-edit"></i>
                </div>
              </el-popover>
            </div>
            <div v-if="row.record">
              <el-tag size="mini" type="primary">退货总数: {{row.record.return_supplier_quantity}}</el-tag>
            </div>
            <div>
              出仓时间: {{new Date(row.outbound_time).toLocaleDateString()}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="质检结果" align="center" min-width="160px">
          <div slot-scope="{row}">
            <template v-if="row.qc_detail">
              <el-form :ref="`Qc-${row.id}`" label-position="left" label-width="70px">
                <el-form-item label="结果">
                  <el-tag :type="row.qc_detail.qc_result === 1 ? 'primary' : 'danger'" effect="dark" size="small">{{row.qc_detail.qc_result === 1 ? "合格" : "不合格"}}</el-tag>
                </el-form-item>
                <el-form-item label="质检Id">
                  <div>{{ row.qc_detail.result.qc_bill_no }}</div>
                </el-form-item>
                <el-form-item label="质检组">
                  <div>{{ row.qc_detail.result.qc_group_name }}</div>
                </el-form-item>
              </el-form>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini">{{statusName(row.info)}}</el-tag>
            <div v-if="row.info">
              <div>
                <el-tag size="mini" type="warning" effect="dark">分配箱号: {{row.info.allocate_id}}</el-tag>
              </div>
              <div v-if="row.info.status === 1 || row.info.status === 2">
                处理意见: {{row.info.handling_opinions}}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <div style="margin-top: 5px; margin-bottom: 5px">
              <div v-if="row.confirm">
                <el-tag size="small" type="success" effect="dark">确认收到(用户: {{row.confirm.user_id}})</el-tag>
                <el-tag size="small" type="success" effect="dark">收到时间: {{new Date(row.confirm.created_at).toLocaleDateString()}}</el-tag>
              </div>

              <el-button type="primary" size="mini" style="width: 100%;" @click="allocateIds([row])" v-if="canAllocate(row)">分配箱号</el-button>
              <el-button type="primary" size="mini" style="width: 100%; margin-top: 5px" @click="openYyclDlg([row])" v-if="canYycl(row)">运营处理</el-button>
              <el-button type="primary" size="mini" style="width: 100%; margin-top: 5px" @click="openCkclDlg([row])" v-if="canCkcl(row)">仓库处理</el-button>
              <el-button type="danger" size="mini" style="width: 100%; margin-top: 5px" @click="onThrowAway([row])" v-if="canThrowAway(row)">弃货</el-button>
              <el-button type="warning" size="mini" style="width: 100%; margin-top: 5px" @click="onConfirm([row])" v-if="canConfirm(row)">确认</el-button>
              <el-button type="primary" size="mini" style="width: 100%; margin-top: 5px" @click="onPrint([row])" v-if="canPrint(row)">打印</el-button>
            </div>
            <div v-if="row.qc_detail && row.qc_detail.result.flaw_vo_list && row.qc_detail.result.flaw_vo_list.length">
              <el-button size="mini" style="width: 100%" type="primary" @click="openQcDetail(row)">查看质检结果</el-button>
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
    </div>

    <TemuDlgQc :visible="qc_detail.visible" :id="qc_detail.id" @close="qc_detail.visible=false"></TemuDlgQc>
    <TemuDlgReturnRecord :visible="return_records.visible" :id="return_records.id" :image="return_records.image" :list="return_records.list" :queryRefundList="queryRefundList" :showOwnerProduct="false" @close="return_records.visible=false"></TemuDlgReturnRecord>

    <el-dialog :visible.sync="handlingOpinionsDlg.visible" :title="handlingOpinionsDlg.title" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl"
               :before-close="()=>{handlingOpinionsDlg.visible=false}">
      <el-input type="textarea" :rows="10" size="mini" v-model="handlingOpinionsDlg.handling_opinions" placeholder="请输入原因" style="width: 100%" clearable></el-input>
      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="confirmHandlingOpinions">确认</el-button>
    </el-dialog>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  planItemSync,
  planJoinDeliveryGoodsOrderPlatform,
} from "@/api/temu/plan_item";
import {
  returnRecordList,
  returnRecordConfirm,
  returnRecordFix,
  returnRecordAllocateId,
  returnRecordSetYycl,
  returnRecordSetCkcl,
  returnRecordSetThrowAway,
  returnRecordSetConfirm,
  returnRecordSync
} from "@/api/temu/return_records";
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {mapGetters} from "vuex";
import TemuDlgReturnRecord from "@/view/temu/components/dlg_return_record.vue";
import TemuDlgQc from "@/view/temu/components/dlg_qc.vue";

export default {
  components: {
    TemuDlgQc,
    TemuDlgReturnRecord,
    KdxImage
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = undefined
        }
        this.timeout = setTimeout(() => {
          this.page = 1
          this.onSubmit()
        }, 500)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: returnRecordList,

      timeout: undefined,
      accountOptions: [],
      statusOptions: [
        {id: 0, name: "未处理"},
        {id: 1, name: "待运营处理"},
        {id: 2, name: "待仓库处理"},
        {id: 3, name: "已弃货"},
        {id: 4, name: "已确认"},
      ],

      edit: {
        count: undefined,
      },

      qc_detail: {
        id: "",
        visible: false
      },

      return_records: {
        id: "",
        image: "",
        list: [],
        visible: false
      },

      selectRows: [],

      handlingOpinionsDlg: {
        ids: [],
        title: "",
        handling_opinions: "",
        type: 0,
        visible: false
      },

      otherCondOptions: [
        {id: 1, name: "未确认"},
        {id: 2, name: "已确认"},
        {id: 3, name: "有作废记录"},
        {id: 4, name: "无作废记录"},
        {id: 5, name: "出仓不等于退货"},
        {id: 6, name: "出仓等于退货"},
        {id: 7, name: "实收不等于交货"},
        {id: 8, name: "实收小于交货"},
      ],
      reasonOptions: [
        {id: "滞销", name: "滞销"},
        {id: "退供", name: "退供"},
        {id: "质检不合格", name: "质检不合格"},
      ]
    }
  },
  computed:{
    ...mapGetters("user", ["token"]),
    canAllocateRows() {
      return this.selectRows.filter((item) => { return this.canAllocate(item) })
    },
    canYyclRows() {
      return this.selectRows.filter((item) => { return this.canYycl(item) })
    },
    canThrowAwayRows() {
      return this.selectRows.filter((item) => { return this.canThrowAway(item) })
    },
    canConfirmRows() {
      return this.selectRows.filter((item) => { return this.canConfirm(item) })
    },
    canCkclRows() {
      return this.selectRows.filter((item) => { return this.canCkcl(item) })
    },
    canPrintRows() {
      return this.selectRows.filter((item) => { return this.canPrint(item) })
    },
  },
  methods: {
    canAllocate(item) {
      return !item.info
    },
    canYycl(item) {
      return item.info && (item.info.status === 0 || item.info.status === 2)
    },
    canThrowAway(item) {
      return item.info && (item.info.status === 0 || item.info.status === 1 || item.info.status === 2)
    },
    canConfirm(item) {
      return item.info && (item.info.status === 0 || item.info.status === 1 || item.info.status === 2)
    },
    canCkcl(item) {
      return item.info && (item.info.status === 0 || item.info.status === 1)
    },
    canPrint(item) {
      return item.info
    },
    async onSync() {
      let resp = await returnRecordSync()
      if (resp.code) {
        return
      }
      this.$message("同步成功")
      this.getTableData()
    },
    async onSubmit(cond) {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = undefined
      }

      this.page = 1
      await this.getTableData()

      if (!cond) {
        cond = "return_ids"
      }
      let ref = this.$refs[cond]
      if (ref) {
        setTimeout(()=>{
          this.changeAllBrief()

          ref.select()
        }, 200)
      }
    },
    statusName(info) {
      if (!info) {
        return "未处理"
      }

      let op = this.statusOptions.find((item) => {return item.id === info.status})
      if (!op) {
        return "未知状态: " + info.status
      }

      return op.name
    },
    openQcDetail(row) {
      this.qc_detail.id = row.purchase_sub_order_sn
      this.qc_detail.visible = true
    },
    openReturnRecords(row) {
      this.return_records.image = row.thumb_url.split("?")[0]
      this.return_records.id = row.package_sn
      this.return_records.list = [row.record]
      this.return_records.visible = true
    },
    async onJoinDeliveryGoodsOrderPlatform(id) {
      let resp = await planJoinDeliveryGoodsOrderPlatform({id: id})
      if (resp.code === 0) {
        this.$message("操作成功")
        this.getTableData()
      }
    },
    async queryRefundList(sn) {
      this.$set(this.searchInfo, "return_express_sn", sn)
      this.getTableData()
      this.return_records.visible = false
    },
    selectionChange(val) {
      this.selectRows = val
    },
    checkSelectable (row) {
      return !row.confirm
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async sync(id) {
      let resp = await planItemSync({id})
      if (resp.code) {
        return
      }
      this.getTableData()
    },
    changeAllBrief() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    allocateIds(rows) {
      this.$confirm('确认分配箱号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = rows.map((item) => {return item.id})
        let resp = await returnRecordAllocateId({ids: ids})
        if (resp.code) {
          return
        }

        this.getTableData()
      })
    },
    async openYyclDlg(rows) {
      this.handlingOpinionsDlg.ids = rows.map((item) => {return item.id})
      this.handlingOpinionsDlg.title = "运营处理"
      this.handlingOpinionsDlg.handling_opinions = ""
      this.handlingOpinionsDlg.type = 1
      this.handlingOpinionsDlg.visible = true
    },
    async openCkclDlg(rows) {
      this.handlingOpinionsDlg.ids = rows.map((item) => {return item.id})
      this.handlingOpinionsDlg.title = "仓库处理"
      this.handlingOpinionsDlg.handling_opinions = ""
      this.handlingOpinionsDlg.type = 2
      this.handlingOpinionsDlg.visible = true
    },
    onThrowAway(rows) {
      this.$confirm('确认弃货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = rows.map((item) => {return item.id})
        let resp = await returnRecordSetThrowAway({ids: ids})
        if (resp.code) {
          return
        }

        this.getTableData()
      })
    },
    onConfirm(rows) {
      this.$confirm('是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = rows.map((item) => {return item.id})
        let resp = await returnRecordSetConfirm({ids: ids})
        if (resp.code) {
          return
        }

        this.getTableData()
      })
    },
    onPrint(rows) {
      let printWindow = window.open('', '_test', "height=500,width=500");
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      rows.forEach((item) => {
        printWindow.document.write('<div style="width: 400px; height: 400px; border-radius: 50%; border: 10px solid black; text-align: center; line-height: 200px"><div style="font-size: 100px; margin-top: 150px">');
        printWindow.document.write(item.info.allocate_id);
        printWindow.document.write('</div></div>');
      })
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    },
    recordConfirm(ids) {
      this.$confirm('此操作确认退件已收到, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            const res = await returnRecordConfirm({ids: ids})
            if (res.code) {
              return
            }

            this.$message({ type: 'success', message: '确认成功!' })

            this.getTableData()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
    },
    searchPackageSn(s) {
      let routeUrl = this.$router.resolve({
        name: "temu_return_list",
        query: {
          "return_ids": s,
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    searchPlanId(s) {
      let routeUrl = this.$router.resolve({
        name: "temu_return_list",
        query: {
          "plan_id": s,
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    calcReturnCount(row) {
      if (!row.plan_item || !row.plan_item.plan_return_records) {
        return 0
      }

      let totalQuantity = 0
      row.plan_item.plan_return_records.forEach((item)=>{
        totalQuantity += item.quantity
      })
      return totalQuantity
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.label === "出仓数量") {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "出仓数: " + sums[index].toFixed(0)
        }
      });

      return sums;
    },
    async updateEditCount(row) {
      // 请求修改数量
      let resp = await returnRecordFix({id: row.id, quantity: this.edit.count})
      if (resp.code) {
        return
      }

      this.$message("修改成功")
      this.getTableData()
      this.edit.count = undefined
    },
    confirmHandlingOpinions() {
      this.$confirm('是否确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp
        if (this.handlingOpinionsDlg.type === 1) {
          // 设置运营处理
          resp = await returnRecordSetYycl({ids: this.handlingOpinionsDlg.ids, handling_opinions: this.handlingOpinionsDlg.handling_opinions})
        } else if (this.handlingOpinionsDlg.type === 2) {
          // 设置运营处理
          resp = await returnRecordSetCkcl({ids: this.handlingOpinionsDlg.ids, handling_opinions: this.handlingOpinionsDlg.handling_opinions})
        } else {
          this.$message.error("无法处理的类型: " + this.handlingOpinionsDlg.type)
          return
        }
        if (resp.code) {
          return
        }
        this.handlingOpinionsDlg.visible = false
        this.getTableData()
      })
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "status", 0)
    this.$set(this.searchInfo, "search_cond", 1)

    if (this.$route.query) {
      if (this.$route.query.return_ids) {
        this.$set(this.searchInfo, "return_ids", this.$route.query.return_ids)
      }
      if (this.$route.query.plan_id) {
        this.$set(this.searchInfo, "plan_id", this.$route.query.plan_id)
      }
    }

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
  ::v-deep .el-form-item__label {
    line-height: unset;
    color: #99a9bf;
  }

  ::v-deep .el-form-item__content:after, .el-form-item__content:before {
    display: table;
  }

  ::v-deep .el-form-item__content {
    line-height: 28px;
    position: relative;
    font-size: 12px;
  }

  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  ::v-deep .el-row {
    padding: 0px;
  }

  ::v-deep .el-form-item__label {
    line-height: 28px !important;
  }
</style>