<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品列表</span>
    </div>
    <div v-if="value && value.dxm_data">
      <el-table class="table-body" ref="multipleTable" :data="value.sku_list" border min-height="500px"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column label="前缀货号" prop="prefixSku" align="center">
          <div slot-scope="{row}">
            <el-input size="mini" style="width: 100%" v-model="row.prefixSku" placeholder="不填写，没有前缀"></el-input>
          </div>
        </el-table-column>
        <el-table-column label="附带货号(_分隔)" prop="appendSku" align="center">
          <div slot-scope="{row}">
            <el-input size="mini" style="width: 100%" v-model="row.appendSku" placeholder="不填写为产品名"></el-input>
          </div>
        </el-table-column>
        <el-table-column label="变体图名字" prop="imageName" align="center">
          <div slot-scope="{row}">
            <el-input size="mini" style="width: 100%" v-model="row.imageName"
                      placeholder="不填写为第一张图片"></el-input>
          </div>
        </el-table-column>
        <el-table-column :label="value.dxm_data.option1" prop="spec1Name" align="center" v-if="value.dxm_data.option1">
        </el-table-column>
        <el-table-column :label="value.dxm_data.option2" prop="spec2Name" align="center" v-if="value.dxm_data.option2">
        </el-table-column>
        <el-table-column label="长(cm)" prop="len" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.len" :min="0"
                             :precision="0"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="宽(cm)" prop="width" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.width" :min="0" :max="row.len"
                             :precision="0"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="高(cm)" prop="height" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.height" :min="0" :max="row.width"
                             :precision="0"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="重(g)" prop="weight" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.weight" :min="0"
                             :precision="0"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="价格(¥)" prop="price" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.price" :min="0"
                             :precision="2"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="库存" prop="stock" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.stock" :min="0"
                             :precision="0"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" v-if="value.dxm_data.option1"
                       @click="set(row, 'spec1Name')">更新同{{ value.dxm_data.option1 }}
            </el-button>
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" v-if="value.dxm_data.option2"
                       @click="set(row, 'spec2Name')">更新同{{ value.dxm_data.option2 }}
            </el-button>
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" @click="set(row, '')">
              更新所有
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'TiktokProductSkuList',
  components: {},
  mixins: [],
  props: ['value'],
  data() {
    return {}
  },
  watch: {},
  methods: {
    set(row, key) {
      this.value.sku_list.forEach((item) => {
        if (key && item[key] !== row[key]) {
          return
        }
        item.len = row.len
        item.width = row.width
        item.height = row.height
        item.weight = row.weight
        item.price = row.price
        item.stock = row.stock
      })
    },
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