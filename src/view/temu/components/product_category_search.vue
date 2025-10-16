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
      <el-autocomplete v-model="form.category" placeholder="请输入类目名字" :fetch-suggestions="searchCategory" @select="handleSelect" style="width: 100%" clearable>
        <template slot-scope="{ item }">
          <div>
            {{ categoryName(item) }}
          </div>
        </template>
      </el-autocomplete>
    </el-form-item>
  </div>
</template>

<script>

import {simpleProductCategorySearch} from "@/api/temu/simple_product";
import {accountList} from "@/api/temu/account";

export default {
  name: 'TemuProductCategorySearch',
  components: {},
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
        category: undefined,
      }
    }
  },
  methods: {
    async searchCategory(query, cb) {
      if (!query) {
        cb([])
        return
      }

      let resp = await simpleProductCategorySearch({text: this.form.category})
      if (resp.code) {
        cb([])
        return
      }

      cb(resp.data)
    },
    categoryName(item) {
      let array = []
      if (item.cat1NodeVO) {
        array.push(item.cat1NodeVO.catName)
      }
      if (item.cat2NodeVO) {
        array.push(item.cat2NodeVO.catName)
      }
      if (item.cat3NodeVO) {
        array.push(item.cat3NodeVO.catName)
      }
      if (item.cat4NodeVO) {
        array.push(item.cat4NodeVO.catName)
      }
      if (item.cat5NodeVO) {
        array.push(item.cat5NodeVO.catName)
      }
      if (item.cat6NodeVO) {
        array.push(item.cat6NodeVO.catName)
      }
      if (item.cat7NodeVO) {
        array.push(item.cat7NodeVO.catName)
      }
      if (item.cat8NodeVO) {
        array.push(item.cat8NodeVO.catName)
      }
      if (item.cat9NodeVO) {
        array.push(item.cat9NodeVO.catName)
      }
      if (item.cat10NodeVO) {
        array.push(item.cat10NodeVO.catName)
      }

      return array.join(" > ")
    },
    handleSelect(target) {
      let catId = undefined
      let cat_ids = []
      let catNames = []
      if (target.cat1NodeVO) {
        catId = target.cat1NodeVO.catId;
        catNames.push(target.cat1NodeVO.catName)
        cat_ids.push(target.cat1NodeVO.catId)
      }
      if (target.cat2NodeVO) {
        catId = target.cat2NodeVO.catId;
        catNames.push(target.cat2NodeVO.catName)
        cat_ids.push(target.cat2NodeVO.catId)
      }
      if (target.cat3NodeVO) {
        catId = target.cat3NodeVO.catId;
        catNames.push(target.cat3NodeVO.catName)
        cat_ids.push(target.cat3NodeVO.catId)
      }
      if (target.cat4NodeVO) {
        catId = target.cat4NodeVO.catId;
        catNames.push(target.cat4NodeVO.catName)
        cat_ids.push(target.cat4NodeVO.catId)
      }
      if (target.cat5NodeVO) {
        catId = target.cat5NodeVO.catId;
        catNames.push(target.cat5NodeVO.catName)
        cat_ids.push(target.cat5NodeVO.catId)
      }
      if (target.cat6NodeVO) {
        catId = target.cat6NodeVO.catId;
        catNames.push(target.cat6NodeVO.catName)
        cat_ids.push(target.cat6NodeVO.catId)
      }
      if (target.cat7NodeVO) {
        catId = target.cat7NodeVO.catId;
        catNames.push(target.cat7NodeVO.catName)
        cat_ids.push(target.cat7NodeVO.catId)
      }
      if (target.cat8NodeVO) {
        catId = target.cat8NodeVO.catId;
        catNames.push(target.cat8NodeVO.catName)
        cat_ids.push(target.cat8NodeVO.catId)
      }
      if (target.cat9NodeVO) {
        catId = target.cat9NodeVO.catId;
        catNames.push(target.cat9NodeVO.catName)
        cat_ids.push(target.cat9NodeVO.catId)
      }
      if (target.cat10NodeVO) {
        catId = target.cat10NodeVO.catId;
        catNames.push(target.cat10NodeVO.catName)
        cat_ids.push(target.cat10NodeVO.catId)
      }

      this.$emit("select", {account_id: this.form.account_id, cat_id: catId, cat_ids: cat_ids, cat_name: catNames.join(" > ")})
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

    this.form.category = undefined
  }
}
</script>