<template>
  <el-dialog width="50%" :visible.sync="$attrs.visible" title="调整广告回报率(ROAS)" @opened="onOpened" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="edit" size="medium" label-width="100px" label-position="right">
      <el-form-item label="日预算">
        <div>
          <el-input-number size="medium" :min="3" :max="50" :precision="2" :step="0.01" style="width: 100%" v-model="edit.roas"></el-input-number>
        </div>
        <div v-if="adBid">
          <div v-for="(pred, index) in adBid.pred_list" :key="index">
            设置ROAS: {{(pred.roas_value/10000).toFixed(2)}}, {{pred.desc}}，7天预计带来订单: {{pred.order_predict_info.percent_delta}}, 曝光: {{pred.impr_predict_info.percent_delta}}
          </div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" style="width: 100%" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import {adGetBid, adModify} from "@/api/temu/ad";

export default {
  name: 'TemuDlgAdEditRoas',
  props: {
    rows: {
      type: Array,
    },
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
      edit: {
        roas: undefined,
      },
      adBid: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.edit.roas = 8
      this.adBid = undefined

      if (this.rows.length !== 1) {
        return
      }

      let resp = await adGetBid({ids: [this.rows[0].product_id]})
      if (resp.code) {
        this.$message.error("获得推荐回报率出错")
        return
      }

      if (resp.data && resp.data.length > 0) {
        this.adBid = resp.data[0]
      }
    },
    async submit() {
      let data = {ids: this.rows.map(item => item.product_id), roas: Number(this.edit.roas*10000)}
      let resp = await adModify(data)
      if (resp.code) {
        return
      }

      if (resp.data) {
        this.$message.error(resp.data)
      } else {
        this.$message("设置成功")
      }
      this.$emit("suc")
      this.handleBeforeClose()
    }
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>