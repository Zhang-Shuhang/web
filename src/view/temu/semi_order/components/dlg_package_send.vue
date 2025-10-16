<template>
  <el-drawer :visible.sync="$attrs.visible" title="提交物流" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="订单号" prop="id" align="center">
      </el-table-column>
      <el-table-column label="物流单号" prop="tracking_number" align="center">
        <div slot-scope="{row}">
          <el-input size="mini" v-model="row.tracking_number" style="width: 100%"></el-input>
        </div>
      </el-table-column>
      <el-table-column label="物流渠道" prop="ship_company_id" align="center">
        <div slot-scope="{row}">
          <el-select size="mini" v-model="row.ship_company_id" placeholder="请选择渠道" filterable clearable
                     :style="{width: '100%'}">
            <el-option v-for="(item, index) in providerList" :key="index" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </div>
      </el-table-column>
    </el-table>

    <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="submit">提交</el-button>
  </el-drawer>
</template>


<script>
import {semiOrderBatchSend, semiOrderQueryUsShippingProvider} from "@/api/temu/semi_order";

export default {
  name: 'TemuDlgPackageSend',
  props: {
    ids: {
      type: Array,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      providerList: [],
      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await semiOrderQueryUsShippingProvider()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.providerList = resp.data

      let list = []
      for (const id of this.ids) {
        list.push({
          id: id,
          tracking_number: undefined,
          ship_company_id: undefined,
        })
      }
      this.list = list
    },
    // 提交
    async submit() {
      for (const v of this.list) {
        if (!v.ship_company_id) {
          this.$message.error(`${v.id} 没有选择物流渠道`)
          return
        }
        if (!v.tracking_number) {
          this.$message.error(`${v.id} 没有填写物流单号`)
          return
        }
      }

      let resp = await semiOrderBatchSend(this.list)
      if (resp.code) {
        return
      }

      this.$message("发货成功")
      this.$emit("update")
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