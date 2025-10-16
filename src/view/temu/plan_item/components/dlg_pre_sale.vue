<template>
  <el-dialog :visible.sync="$attrs.visible" :title="`预备货(${id})`" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border min-height="20vh" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="备货单信息" prop="plan_id" align="center">
      </el-table-column>
      <el-table-column label="SkcId" prop="item.sale.product_skc_id" align="center">
      </el-table-column>
      <el-table-column label="SkuId" prop="item.id" align="center">
      </el-table-column>
      <el-table-column label="变体图" width="80px" align="center">
        <div slot-scope="{row}">
          <template v-if="row.item.item_image">
            <KdxImage :src="row.item.item_image.image" width="60px" height="60px"></KdxImage>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="辩题名" prop="item.class_name" align="center">
      </el-table-column>
      <el-table-column label="包裹数量" prop="weight" min-width="300px" align="center">
        <div slot-scope="{row}">
          <el-row v-for="(item, index) in row.array" :key="index">
            <el-col :span="20">
              <el-input-number size="mini" v-model="row.array[index]" placeholder="数量" :min="0" :max="max(row.max)" :precision="0" style="width: 100%" clearable></el-input-number>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" size="mini" style="width: 100%" @click="deleteNum(row, index)">删除</el-button>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-input-number size="mini" v-model="row.add_count" placeholder="批次" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
            </el-col>
            <el-col :span="8">
              <el-input-number size="mini" v-model="row.per_count" placeholder="数量" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="mini" style="width: 100%" @click="addEmpty(row)">添加</el-button>
            </el-col>
          </el-row>
        </div>
      </el-table-column>
      <el-table-column label="重量(kg)" prop="weight" min-width="200px" align="center">
        <div slot-scope="{row}">
          <el-input-number size="mini" v-model="row.weight" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
        </div>
      </el-table-column>
    </el-table>

    <el-button type="primary" style="width: 100%; height: 40px; margin-top: 30px" @click="submit">提交</el-button>
  </el-dialog>
</template>


<script>
import {getPlanPreSaleList, setPlanPreSaleList} from "@/api/temu/plan";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgPreSale',
  components: {KdxImage},
  mixins: [],
  props: {
    id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await getPlanPreSaleList({id: this.id})
      if (resp.code) {
        return
      }

      for (const d of resp.data) {
        if (!d.array || d.array.length <= 0) {
          d.array = [d.max]
        }
        d.add_count = 1
        d.per_count = d.max
      }

      this.list = resp.data
    },
    addEmpty(row) {
      if (!row.array) {
        this.$set(row, "array", [])
      }
      for (let i = 0; i < row.add_count; i++) {
        row.array.push(row.per_count)
      }
    },
    deleteNum(row, index) {
      row.array.splice(index, 1); // 2nd parameter means remove one item only
    },
    max(originMax) {
      let d = originMax*0.1
      if (d <= 10) {
        return originMax + 10
      }

      return originMax + Math.ceil(d)
    },
    async submit() {
      let list = []
      for (const item of this.list) {
        if (!item.array) {
          this.$message.error(`${item.id}: 没有设置数量`)
          return
        }

        list.push({
          id: item.id,
          array: item.array,
          weight: item.weight,
        })
      }

      let resp = await setPlanPreSaleList(list)
      if (resp.code) {
        return
      }

      window.open(`${resp.data}`, "_BLANK")
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