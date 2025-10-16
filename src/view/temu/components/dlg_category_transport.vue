<template>
  <el-drawer :visible.sync="$attrs.visible" title="一键类目迁移上架" @opened="onOpened" size="30%" :modal-append-to-body="true"
             :append-to-body="true" :before-close="handleBeforeClose">
    <div style="margin: 0 10px 0 10px">
      <el-row :gutter="5">
        <el-col :span="24">
          <el-select v-model="setting.account_ids" placeholder="上架账号(可为空)" multiple collapse-tags filterable style="width: 100%">
            <template v-for="(item, index) in accounts">
              <el-option :key="index" :label="item.name" :value="item.id" v-if="item.is_semi"></el-option>
            </template>
          </el-select>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" style="height: 40px; width: 100%;" @click="selectCategory">选择类目并提交</el-button>
        </el-col>
      </el-row>
    </div>

    <TemuDlgProductCategoryProperties :default_account_id="dlgCategoryProperties.account_id" :can_change_account="false" :confirm="dlgCategoryProperties.confirm" :visible="dlgCategoryProperties.visible" @close="dlgCategoryProperties.visible=false"></TemuDlgProductCategoryProperties>
  </el-drawer>
</template>

<script>

import KdxImage from "@/components/image/image.vue";
import TemuDlgProductCategoryProperties from "@/view/temu/components/product_category_properties.vue";
import {accountList} from "@/api/temu/account";
import {semiGetY2AutoTransportSetting, semiUpdateY2AutoTransportSetting} from "@/api/temu/semi";

export default {
  name: 'TemuDlgCategoryTransport',
  components: {TemuDlgProductCategoryProperties, KdxImage},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  data() {
    return {
      accounts: [],

      setting: {
        account_ids: [],
      },

      dlgCategoryProperties: {
        account_id: undefined,
        confirm: undefined,
        visible: false,
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let accountListResp = await accountList()
      if (accountListResp.code) {
        return
      }
      this.accounts = accountListResp.data

      let resp = await semiGetY2AutoTransportSetting({id: this.id})
      if (resp.code) {
        return
      }

      this.setting.account_ids = []

      if (resp.data.exist) {
        this.setting.account_ids = resp.data.data.account_ids
      }
    },
    selectCategory() {
      let ac = this.accounts.find((item) => {return item.is_semi})
      if (!ac) {
        this.$message.error("没有半托管账号")
        return
      }

      this.dlgCategoryProperties.account_id = ac.id
      this.dlgCategoryProperties.confirm = (event) => {
        this.submit(event)
      }
      this.dlgCategoryProperties.visible = true
    },
    async submit(event) {
      let data = {}

      data.id = this.id
      data.account_ids = this.setting.account_ids
      data.cat_id = event.cat_id
      data.cat_ids = event.cat_ids
      data.properties = event.real_properties

      let resp = await semiUpdateY2AutoTransportSetting(data)
      if (resp.code) {
        return
      }

      this.handleBeforeClose()
      this.dlgCategoryProperties.visible = false
      this.$emit('update')
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>