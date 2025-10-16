<template>
  <el-dialog :visible.sync="$attrs.visible" :title="`生成脚本(${id})`" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <template v-if="plan">
      <el-form :model="content" label-width="150px" ref="contentForm" label-position="left">
        <el-form-item label="重量(kg):" prop="weight">
          <el-input-number size="mini" v-model="content.weight" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="今日收货:" prop="is_today">
          <el-switch style="display: block" v-model="content.is_today" active-text="今日收货" inactive-text="明日收货">
          </el-switch>
        </el-form-item>
        <el-form-item label="拿货时间:" prop="pick_hour">
          <el-input-number size="mini" v-model="content.pick_hour" :min="0" :precision="0" style="width: 100%" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="仓库:" prop="warehouse">
          <el-input size="mini" placeholder="不填，为默认仓库" v-model="content.warehouse" :min="0" :precision="0" style="width: 100%" clearable></el-input>
        </el-form-item>
        <el-form-item label="默认选择物流:" prop="logistic_default_list">
          <el-select size="mini" clearable multiple filterable placeholder="请选择" v-model="content.logistic_default_list">
            <el-option label="顺丰" value="顺丰"></el-option>
            <el-option label="跨越" value="跨越"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div style="margin-bottom: 10px"></div>
    </template>

    <el-table class="table-body" ref="multipleTable" :data="content.list" border min-height="20vh" size="mini"
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
              <el-input-number size="mini" v-model="row.array[index]" placeholder="数量" :min="0" :max="max(row.purchase_quantity)" :precision="0" style="width: 100%" clearable></el-input-number>
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
    </el-table>

    <el-button type="primary" style="width: 100%; height: 40px; margin-top: 30px" @click="submit">生成</el-button>
  </el-dialog>
</template>


<script>
import {genPlan, genPlanScript} from "@/api/temu/plan";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgGenScript',
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
      plan: undefined,
      content: {
        id: undefined,
        weight: 1,
        is_today: false,
        pick_hour: "20",
        warehouse: undefined,
        logistic_default_list: ["顺丰", "跨越"],
        list: [],
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.content = {
        id: undefined,
        weight: 1,
        is_today: false,
        pick_hour: "20",
        warehouse: undefined,
        logistic_default_list: ["顺丰", "跨越"],
        list: [],
      }
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await genPlan({id: this.id})
      if (resp.code) {
        return
      }

      this.content.id = this.id

      this.plan = resp.data

      for (const v of this.plan.items) {
        let d = {...v}
        if (!d.array || d.array.length <= 0) {
          d.array = [this.max(d.purchase_quantity)]
        }
        d.add_count = 1
        d.per_count = d.purchase_quantity
        this.content.list.push(d)
      }
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
      let data = {...this.content}
      data.items = new Map()
      data.list = undefined
      this.content.list.forEach((item) => {
        data.items[item.product_sku_id] = {
          id: item.product_sku_id,
          array: item.array,
        }
      })
      let resp = await genPlanScript(data)
      if (resp.code) {
        return
      }

      this.$copyText(resp.data).then( () => {
        this.$message('复制成功')
        window.open(`https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk/create`, "_BLANK")
      }, function () {
        this.$message.error('复制失败')
      })
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
::v-deep .el-form-item__label {
  text-align: right;
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 25px !important;
  padding: 0 12px 0 0;
  -webkit-box-sizing: border-box;
}

::v-deep .el-form-item__content {
  line-height: 25px !important;
  position: relative;
  font-size: 14px;
}

::v-deep .el-form-item {
  margin-bottom: 10px !important;
}
</style>