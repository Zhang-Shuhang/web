<template>
  <el-drawer :visible.sync="$attrs.visible" title="纠正类目" @opened="onOpened" size="90%" :modal-append-to-body="true"
             :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="账号" align="center" prop="account.name">
      </el-table-column>
      <el-table-column label="Spu Id" align="center" prop="id">
      </el-table-column>
      <el-table-column label="Skc Id" align="center" prop="product.product_skc_id">
      </el-table-column>
      <el-table-column label="主图" align="center">
        <div slot-scope="{row}">
          <KdxImage :src="row.product.main_image_url" v-if="row.product"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="当前类目" align="center">
        <div slot-scope="{row}">
          {{ categoryName(row.current_categories) }}
        </div>
      </el-table-column>
      <el-table-column label="目标类目" width="800px">
        <template slot="header">
          <el-select size="mini" v-model="selectCategoryId" placeholder="请选择类目" filterable style="width: 100%" @change="setSelectCategoryId">
            <el-option size="mini" v-for="(list, index) in allCategories" :key="index" :label="categoryName(list)" :value="list[list.length-1].id"></el-option>
          </el-select>
        </template>
        <div slot-scope="{row}">
          <el-radio-group v-model="row.select_category_index" size="mini">
            <el-radio v-for="(list, index) in row.recommend_categories" :key="index" :label="index">{{ categoryName(list) }}</el-radio>
          </el-radio-group>
        </div>
      </el-table-column>
      <el-table-column label="原因" align="center">
        <div slot-scope="{row}">
          {{ row.reason || "-" }}
        </div>
      </el-table-column>
    </el-table>

    <div style="height: 120px; width: 150px; position: absolute; right: 20px; bottom: 300px; z-index: 9999; display: flex; flex-direction: column; align-items: center; gap: 6px;">
      <el-button size="lager" type="success" style="width: 100%; margin: 0; zoom: 1.1" @click="submit">提交</el-button>
    </div>
  </el-drawer>
</template>

<script>

import KdxImage from "@/components/image/image.vue";
import TemuDlgProductCategoryProperties from "@/view/temu/components/product_category_properties.vue";
import {productCorrectCategoryCorrect} from "@/api/temu/product_correct_category";

export default {
  name: 'TemuDlgCorrectCategory',
  components: {TemuDlgProductCategoryProperties, KdxImage},
  mixins: [],
  props: {
    array: {
      type: Array,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      list: [],
      allCategories: [],
      selectCategoryId: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.selectCategoryId = undefined
      this.list = []
      this.allCategories = []

      let categoryMap = new Map()
      for (const v of this.array) {
        this.list.push({
          ...v,
          select_category_index: undefined,
          reason: undefined,
        })

        v.recommend_categories.forEach(list => {
          categoryMap.set(this.categoryName(list), list)
        })
      }
      categoryMap.forEach((value) => {
        this.allCategories.push(value)
      })
    },
    categoryName(list) {
      return list.map(item => {return item.name}).join(" > ")
    },
    setSelectCategoryId() {
      this.list.forEach((row) => {
        for (let i = 0; i < row.recommend_categories.length; i++) {
          let list = row.recommend_categories[i]
          if (list[list.length-1].id === this.selectCategoryId) {
            row.select_category_index = i
            break
          }
        }
      })
      this.selectCategoryId = undefined
    },
    async submit() {
      for (const v of this.list) {
        if (v.select_category_index >= 0) {
          continue
        }

        this.$message.error(`产品: ${v.id} 没有选择`)
        return
      }

      for (const v of this.list) {
        let resp = await productCorrectCategoryCorrect({id: v.id, cat_ids: v.recommend_categories[v.select_category_index].map((item) => {return item.id})})
        if (resp.code) {
          return
        }

        if (resp.data.suc) {
          // 删除
          this.list = this.list.filter((item) => {return item !== v})
        } else {
          v.reason = resp.data.reason
        }
      }
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>