<template>
  <el-dialog :visible.sync="$attrs.visible" title="提现" @opened="onOpened" :width="isMobile ? `100%` : `60%`"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="info" size="mini" label-width="90px" label-position="left" v-if="info">
      <el-form-item label="提现银行">
        {{info.superBankName}}
      </el-form-item>
      <el-form-item label="提现账号">
        {{info.bankAccountName}}
      </el-form-item>
      <el-form-item label="银行卡后缀">
        {{info.bankAccountSuffix}}
      </el-form-item>
      <el-form-item label="可提现金额">
        {{info.currencyType}} {{info.availableBalance}}
      </el-form-item>
      <el-form-item label="提现金额">
        <el-input-number :min="info.minLimit" :max="Math.min(info.maxLimit, info.availableBalance)" :step="100" :precision="0" v-model="apply_amount" placeholder="提现金额" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="验证码">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-input v-model="code" placeholder="验证码" style="width: 100%" clearable></el-input>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 100%;" @click="send" :disabled="left_time>0">获得验证码({{info.bankPhoneNum}})<template v-if="left_time">({{left_time}})</template></el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" style="width: 100%; margin-top: 20px" @click="apply" :disabled="!code">提现</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import {paymentApply, paymentInfo, paymentSend} from "@/api/temu/payment";

export default {
  name: 'TemuDlgApply',
  components: {},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
    is_semi: {
      type: Boolean,
    }
  },
  computed: {},
  watch: {},
  data() {
    return {
      info: undefined,
      apply_amount: 1000,
      code: undefined,
      isMobile: false,
      next_auto_apply_time: 0,
      left_time: 0,
      auto_apply: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
      this.closeAutoApply()
    },
    async onOpened() {
      let resp = await paymentInfo({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }
      this.info = resp.data
      if (this.is_semi) {
        this.apply_amount = this.info.availableBalance - 1000
        this.apply_amount -= this.apply_amount % 1000
      } else {
        this.apply_amount = this.info.availableBalance - 500
        this.apply_amount -= this.apply_amount % 100
      }
      this.code = undefined

      this.closeAutoApply()
      this.startAutoApply()
    },
    startAutoApply() {
      this.auto_apply = setTimeout(async () => {
        if (Date.now() > this.next_auto_apply_time) {
          await this.send()
        }
        this.left_time = Math.max(Math.ceil((this.next_auto_apply_time - Date.now()) / 1000), 0)
        this.startAutoApply()
      }, 1000)
    },
    closeAutoApply() {
      if (this.auto_apply) {
        clearTimeout(this.auto_apply)
        this.auto_apply = undefined
      }
    },
    async send() {
      let resp = await paymentSend({id: this.id, account_index: this.info.accountIndex, withdraw_amount: this.apply_amount})
      if (resp.code) {
        return
      }
      this.next_auto_apply_time = Date.now() + 60000
      this.$message("已发送")
    },
    async apply() {
      let resp = await paymentApply({id: this.id, account_index: this.info.accountIndex, withdraw_amount: this.apply_amount, verify_code: this.code})
      if (resp.code) {
        return
      }
      this.$message("申请成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
  },
  mounted() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  },
  filters: {},
  async update() {
  }
}
</script>
<style scoped lang="scss">
</style>