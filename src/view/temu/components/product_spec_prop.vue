<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品规格</span>
    </div>
    <div>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="规格1">
            <el-select v-model="value.spec_prop_id1" placeholder="请选择规格1" filterable clearable style="width: 100%">
              <el-option v-for="(item, index) in value.sku_spec_list" :key="index" :label="item.parentSpecName"
                         :value="item.parentSpecId" :disabled="item.parentSpecId === value.spec_prop_id2"></el-option>
            </el-select>

            <el-select v-model="value.spec_values1" :placeholder="spec1Name" allow-create multiple filterable clearable
                       style="width: 100%">
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="规格2">
            <el-select v-model="value.spec_prop_id2" placeholder="请选择规格2" filterable clearable style="width: 100%">
              <el-option v-for="(item, index) in value.sku_spec_list" :key="index" :label="item.parentSpecName"
                         :value="item.parentSpecId" :disabled="item.parentSpecId === value.spec_prop_id1"></el-option>
            </el-select>

            <el-select v-model="value.spec_values2" :placeholder="spec2Name" allow-create multiple filterable clearable
                       style="width: 100%">
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>

import {simpleProductSkuSpecParentList} from "@/api/temu/simple_product";

export default {
  name: 'TemuProductSpecProp',
  components: {},
  mixins: [],
  props: ['value'],
  data() {
    return {
      sku_spec_list: [],
    }
  },
  computed: {
    spec1Name() {
      let d = this.sku_spec_list.find((item) => {
        return item.parentSpecId === this.value.spec_prop_id1
      })
      return d ? d.parentSpecName : "规格1"
    },
    spec2Name() {
      let d = this.sku_spec_list.find((item) => {
        return item.parentSpecId === this.value.spec_prop_id2
      })
      return d ? d.parentSpecName : "规格2"
    },
  },
  watch: {
    "value.spec_prop_id1"() {
      this.createSkuSpecList()
    },
    "value.spec_prop_id2"() {
      this.createSkuSpecList()
    },
    "value.spec_values1"() {
      this.createSkuSpecList()
    },
    "value.spec_values2"() {
      this.createSkuSpecList()
    },
  },
  methods: {
    createSkuSpecList() {
      // 创建 Spec Values TODO

      let l1 = []
      if (this.value.spec_prop_id1) {
        l1 = [...this.value.spec_values1]
      }
      if (l1.length <= 0) {
        l1.push("")
      }
      let l2 = []
      if (this.value.spec_prop_id2) {
        l2 = [...this.value.spec_values2]
      }
      if (l2.length <= 0) {
        l2.push("")
      }

      for (const v1 of l1) {
        for (const v2 of l2) {
          // 操作
          let p = this.getSkuSpec(v1, v2)
          if (p) {
            continue
          }

          // 创建一个
          this.value.sku_list.push(
              {
                parentSpec1Id: this.value.spec_prop_id1,
                parentSpec2Id: this.value.spec_prop_id2,
                prefixSku: "",
                appendSku: "",
                imageName: "",

                spec1: v1,
                spec2: v2,
                len: undefined,
                width: undefined,
                height: undefined,
                weight: undefined,
                price: undefined,

                sku_classification: 1,
                number_of_pieces: 1,
                individually_packed: 0,
                piece_unit_code: 1,

                is_sensitive: 0,
                sensitive_list: [],
                max_battery_capacity_hp: 0,
                max_liquid_capacity_hp: 0,
                max_knife_length_hp: 0,
                knife_angle: 0,

                accessories: [],
              }
          )
        }

        for (let i = this.value.sku_list.length - 1; i >= 0; i--) {
          let s = this.value.sku_list[i]
          if (l1.indexOf(s.spec1) >= 0 && l2.indexOf(s.spec2) >= 0) {
            continue
          }

          // 删除
          this.value.sku_list.splice(i, 1)
        }
      }
    },
    getSkuSpec(v1, v2) {
      for (const s of this.value.sku_list) {
        if (s.spec1 === v1 && s.spec2 === v2) {
          return s
        }
      }
      return undefined
    },
  },
  beforeDestroy() {
  },
  async created() {
    this.$bus.$on("notifyCreateSkuSpecList", async (f) => {
      this.createSkuSpecList()
      if (f) {
        await f()
      }
    })
    let resp = await simpleProductSkuSpecParentList()
    if (resp.code) {
      return
    }

    this.sku_spec_list = resp.data
  }
}
</script>
<style scoped lang="scss">
</style>