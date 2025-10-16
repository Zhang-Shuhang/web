<template>
  <el-dialog :visible.sync="$attrs.visible" title="店小秘匹配" @opened="onOpened" width="40%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form :rules="toSetRules" ref="elForm" :model="toSet" size="mini" label-width="100px" label-position="left">
      <el-form-item label="Sku" prop="min_cost">
        <el-autocomplete v-model="toSet.sku" placeholder="请输入Sku或名字" :fetch-suggestions="searchDxmGoods" @select="handleSelect" style="width: 100%" clearable>
          <template slot-scope="{ item }">
            <div>
              Sku: {{ item.sku }}
            </div>
            <div>
              <el-tag type="primary" size="small">名字: {{ item.name }}</el-tag>
            </div>
            <div>
              <el-tag type="primary" size="small">价格: {{ item.price }}</el-tag>
            </div>
            <div>
              <el-tag type="primary" size="small">重量: {{ item.weight }}g</el-tag>
            </div>
            <div v-if="item.img_url">
              <KdxImage :src="item.img_url" width="80px" height="80px"></KdxImage>
            </div>
          </template>
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="数量" prop="min_cost">
        <el-input-number size="mini" v-model="toSet.count" placeholder="请输入数量" :min="1" :max="1000" :precision="0" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="成本(¥)" prop="min_cost">
        <el-input-number size="mini" v-model="toSet.price" placeholder="请输入成本" :min="0" :precision="2" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-button type="primary" style="width: 100%; margin-top: 20px" @click="set">设置</el-button>
    </el-form>
  </el-dialog>
</template>


<script>
import {saleItemSetDxmGoodsSku} from "@/api/temu/sale_item";
import {dxmGoodsList} from "@/api/dxm/goods";
import KdxImage from "../../../../components/image/image";

export default {
  name: 'TemuDlgDxmGoods',
  components: {KdxImage},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      toSet: {
        sku: undefined,
        count: undefined,
        price: undefined,
      },

      toSetRules: {
        sku: [{
          required: true,
          message: '请输入Sku或名字',
          trigger: 'blur'
        }],
        price: [{
          required: true,
          message: '请输入价格',
          trigger: 'blur'
        }],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.toSet.sku = undefined
    },
    set() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return

        let resp = await saleItemSetDxmGoodsSku({id: this.id, sku: this.toSet.sku, count: this.toSet.count, price: this.toSet.price})
        if (resp.code === 0) {
          this.$message("操作成功")
          this.$emit('close', false)
        }
      })
    },
    async handleSelect(target) {
      this.toSet.sku = target.sku
      this.toSet.price = target.price
    },
    async searchDxmGoods(query, cb) {
      if (!query) {
        cb([])
        return
      }

      let resp = await dxmGoodsList({content: query, page: 1, page_size: 50})
      if (resp.code) {
        cb([])
        return
      }

      cb(resp.data.list)
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