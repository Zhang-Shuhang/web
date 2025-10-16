<template>
  <div>
    <el-form-item label-width="0" v-if="can_change_account || !form.account_id">
      <el-select v-model="form.account_id" placeholder="请选择默认账号" filterable clearable
                 :style="{width: '100%'}">
        <template v-for="(item, index) in accountOptions">
          <el-option :key="index" :label="item.name" :value="item.id"></el-option>
        </template>
      </el-select>
    </el-form-item>
    <el-form-item label-width="0" v-if="form.account_id">
      <el-input v-model="form.spu_code" placeholder="请输入上架产品id" style="width: 100%" clearable
                @change="searchSpuCode" @keyup.enter.native="searchSpuCode">
      </el-input>
    </el-form-item>
    <div v-if="list">
      <el-table :data="list" stripe style="width: 100%"
                :header-cell-style="{ 'background-color': 'black', 'color': '#fff' }">
        <el-table-column align="center" prop="spuCode" label="产品id" sortable>
        </el-table-column>
        <el-table-column align="center" prop="mainImage" label="主图" sortable>
          <template slot-scope="{row}">
            <KdxImage :src="row.mainImage"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="mainImage" label="操作" sortable>
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" @click="load(row)">引用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

import {accountList} from "@/api/tiktok/account";
import {dxmTiktokSearch, dxmTiktokLoad} from "@/api/dxm/tiktok";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TiktokProductDxmSearch',
  components: {KdxImage},
  mixins: [],
  props: {
    default_account_id: {
      type: Number,
    },
    can_change_account: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      accountOptions: [],

      form: {
        account_id: undefined,
        spu_code: undefined,
      },

      list: []
    }
  },
  methods: {
    async searchSpuCode(query) {
      let account = this.accountOptions.find((ac) => ac.id === this.form.account_id);
      if (!account) {
        this.$message.error("请选择账号")
        return
      }

      let resp = await dxmTiktokSearch({shop_id: account.shop_id, spu_code: this.form.spu_code})
      if (resp.code) {
        return
      }

      this.list = resp.data
    },
    async load(row) {
      let resp = await dxmTiktokLoad({id: row.id})
      if (resp.code) {
        return
      }

      if (resp.data.picSetType !== "SpuWithSku") {
        this.$message.error("模板来源的产品必须选择 按SKU预览图, 而不应该选择 按SKC上传预览图!")
        return
      }

      this.$emit("select", {account_id: this.form.account_id, id: row.id, data: resp.data})
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.form.account_id = this.default_account_id

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }

    this.form.spu_code = undefined
  }
}
</script>