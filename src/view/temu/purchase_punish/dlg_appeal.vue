<template>
  <el-drawer :visible.sync="$attrs.visible" title="申诉详情" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form size="mini" label-width="120px" label-position="right">
      <el-card>
        <div slot="header" class="clearfix">
          <span>违规信息</span>
        </div>
        <div>
          <el-form-item label="违规金额(数量)">
            {{ punishAmount }}
          </el-form-item>
          <template v-if="detail && detail.result">
            <el-form-item label="订单号">
              {{ detail.result.mmspurchaseOrderViolationInfoVO.subPurchaseOrderSn }}
              <el-button size="mini" type="primary" @click="openQcDetail(detail.result.mmspurchaseOrderViolationInfoVO.subPurchaseOrderSn)">查看质检结果</el-button>
            </el-form-item>
            <el-form-item label="Sku Id">
              {{ detail.result.mmspurchaseOrderViolationInfoVO.productSkuId }}
            </el-form-item>
            <template v-if="detail.plan">
              <el-form-item label="JIT/定制">
                {{ detail.plan.is_custom_goods ? "定制" : detail.plan.purchase_stock_type === 1 ? "JIT" : "普通" }}
              </el-form-item>
              <el-form-item label="货号">
                {{ extCode }}
              </el-form-item>
              <el-form-item label="数量">
                {{ purchaseQuantity }}
              </el-form-item>
              <el-form-item label="下单时间">
                {{ new Date(detail.plan.created_at).toLocaleString() }}
              </el-form-item>
              <el-form-item label="发货时间">
                {{ new Date(detail.plan.deliver_time).toLocaleString() }}
              </el-form-item>
              <el-form-item label="收货仓库">
                {{ detail.plan.receive_warehouse_name }}
              </el-form-item>
              <el-form-item label="收货时间">
                {{ new Date(detail.plan.receive_time).toLocaleString() }}
              </el-form-item>
            </template>
            <el-form-item label="确认物流" v-if="detail.confirm_logistic">
              <el-link :href="`https://www.sf-express.com/chn/sc/waybill/waybill-detail/${detail.confirm_logistic}`"
                       target="_blank">{{ detail.confirm_logistic }}
              </el-link>
            </el-form-item>
            <el-form-item label="疑似物流" v-if="detail.maybe_logistics && detail.maybe_logistics.length">
              <el-link
                  :href="`https://www.sf-express.com/chn/sc/waybill/waybill-detail/${detail.maybe_logistics.join(',')}`"
                  target="_blank">{{ detail.maybe_logistics.join(" ") }}
              </el-link>
            </el-form-item>
            <el-form-item label="备货件数">
              {{ detail.result.mmspurchaseOrderViolationInfoVO.stockQuantity }}
            </el-form-item>
            <el-form-item label="缺货件数">
              {{ detail.result.mmspurchaseOrderViolationInfoVO.lackQuantity }}
            </el-form-item>
            <el-form-item label="质量问题件数">
              {{ detail.result.mmspurchaseOrderViolationInfoVO.unqualifiedQuantity }}
            </el-form-item>
          </template>
        </div>
      </el-card>
      <el-card>
        <div slot="header" class="clearfix">
          <span>申诉信息</span>
        </div>
        <div>
          <el-form-item label="申诉时间" v-if="detail && detail.result && detail.result.appealTime">
            <span>{{ new Date(detail.result.appealTime).toLocaleString() }}</span>
          </el-form-item>
          <el-form-item label="申请原因">
            <el-input type="textarea" style="width: 100%" placeholder="申请原因" v-model="form.reason"
                      :disabled="!canUploadImage" clearable :autosize="{ minRows: 4, maxRows: 30 }" maxlength="250"
                      show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="申诉材料">
            <div>
              <div v-for="(image, index) in form.images" style="display: inline-block; margin-right: 10px" :key="index">
                <div>
                  <KdxImage :src="image"></KdxImage>
                </div>
                <el-button size="mini" type="primary" @click="deleteImage(index)" v-if="canUploadImage">删除</el-button>
              </div>
              <el-upload :action="`/temu/account/upload_agent_image?id=${account_id}&tag=punish-voucher`" :headers="{'x-token':token}"
                         :show-file-list="false" accept=".png,.jpg" :on-success="handleSuccess" :on-error="handleError"
                         v-if="canUploadImage">
                <el-button size="mini" type="primary">上传图片</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </div>
      </el-card>
    </el-form>

    <el-button type="primary" style="width: 100%; margin-top: 20px; height: 50px" size="mini" @click="onAppeal"
               v-if="canUploadImage">申诉
    </el-button>


    <TemuDlgQc :visible="qc_detail.visible" :id="qc_detail.id" @close="qc_detail.visible=false"></TemuDlgQc>
  </el-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import {purchasePunishQuery, purchasePunishReply} from "@/api/temu/purchase_punish";
import KdxImage from "@/components/image/image.vue";
import TemuDlgQc from "@/view/temu/components/dlg_qc.vue";

export default {
  name: 'TemuDlgAppeal',
  components: {TemuDlgQc, KdxImage},
  props: {
    row: {
      type: Object,
    },
    rows: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    canUploadImage() {
      return (this.row && (this.row.punish_status === 0 || this.row.punish_status === 5)) || this.rows.length
    },
    punishAmount() {
      if (this.row) {
        return `${(this.row.punish_amount / 100).toFixed(2)} 元`
      }

      let amount = 0
      this.rows.forEach((item) => {
        amount += item.punish_amount
      })
      return `${this.rows.length}个，合计: ${(amount / 100).toFixed(2)} 元`
    },
    account_id() {
      if (this.row) {
        return this.row.account_id
      }
      if (this.rows) {
        return this.rows[0].account_id
      }
      return 0
    },
    extCode() {
      if (!this.detail) {
        return ""
      }
      if (!this.detail.plan) {
        return ""
      }

      for (const item of this.detail.plan.items) {
        if (item.product_sku_id === this.detail.result.mmspurchaseOrderViolationInfoVO.productSkuId || item.fulfilment_product_sku_id === this.detail.result.mmspurchaseOrderViolationInfoVO.productSkuId) {
          return item.ext_code
        }
      }

      return ""
    },
    purchaseQuantity() {
      if (!this.detail) {
        return ""
      }
      if (!this.detail.plan) {
        return ""
      }

      for (const item of this.detail.plan.items) {
        if (item.product_sku_id === this.detail.result.mmspurchaseOrderViolationInfoVO.productSkuId || item.fulfilment_product_sku_id === this.detail.result.mmspurchaseOrderViolationInfoVO.productSkuId) {
          return item.purchase_quantity
        }
      }

      return ""
    }
  },
  watch: {},
  data() {
    return {
      form: {
        reason: "",
        images: [],
      },

      detail: undefined,

      qc_detail: {
        id: "",
        visible: false
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      if (this.row) {
        let resp = await purchasePunishQuery({id: this.row.id})
        if (resp.code) {
          return
        }

        if (resp.data.result.appealReason) {
          this.form.reason = resp.data.result.appealReason
          this.form.images = resp.data.result.appealMaterial || []
        } else if (this.form.reason) {
          this.$message("未更新原因跟图片")
        }
        this.detail = resp.data
      } else {
        this.form.reason = ""
        this.form.images = []
        this.detail = undefined
      }
    },
    async onAppeal() {
      if (!this.form.reason) {
        this.$message.error("请输入原因")
        return
      }

      if (!this.form.images.length) {
        this.$message.error("请上传图片")
        return
      }

      if (this.row) {
        let suc = await this.doAppeal(this.row.id, this.detail.result.appealSn, this.detail.result.version)
        if (!suc) {
          return
        }
      } else {
        for (const row of this.rows) {
          let appealSn = ""
          let version = 0
          if (row.punish_status !== 0) {
            let resp = await purchasePunishQuery({id: row.id})
            if (resp.code) {
              this.$emit("update")
              return
            }

            appealSn = resp.data.result.appealSn
            version = resp.data.result.version
          }

          let suc = await this.doAppeal(row.id, appealSn, version)
          if (!suc) {
            this.$emit("update")
            return
          }
        }
      }
      this.handleBeforeClose()
      this.$emit("update")
    },
    async doAppeal(id, appeal_sn, version) {
      let resp = await purchasePunishReply({
        id: id,
        appeal_sn: appeal_sn,
        version: version,
        reason: this.form.reason,
        images: this.form.images
      })
      return !resp.code;
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.images.push(res.data.url)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    deleteImage(index) {
      this.form.images.splice(index, 1)
    },
    openQcDetail(plan_id) {
      this.qc_detail.id = plan_id
      this.qc_detail.visible = true
    },
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
::v-deep .el-upload--text {
  width: 100%;
}
</style>