<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品列表</span>
    </div>
    <div>
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
        <el-table-column :label="spec1Name" prop="spec1" align="center" v-if="value.spec_prop_id1">
        </el-table-column>
        <el-table-column :label="spec2Name" prop="spec2" align="center" v-if="value.spec_prop_id2">
        </el-table-column>
        <el-table-column label="敏感属性" prop="len" align="center" min-width="150px">
          <div slot-scope="{row}">
            <el-row>
              <el-col :span="8">
                <el-select size="mini" v-model="row.is_sensitive" placeholder="是否敏感" clearable
                           style="width: 100%" @change="onSensitiveChanged(row)">
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-select size="mini" v-model="row.sensitive_list" placeholder="请选择敏感性" multiple
                           collapse-tags
                           filterable clearable style="width: 100%" :disabled="row.is_sensitive <= 0">
                  <el-option label="纯电" :value="110001"></el-option>
                  <el-option label="内电" :value="120001"></el-option>
                  <el-option label="磁性" :value="130001"></el-option>
                  <el-option label="液体" :value="140001"></el-option>
                  <el-option label="粉末" :value="150001"></el-option>
                  <el-option label="膏体" :value="160001"></el-option>
                  <el-option label="刀具" :value="170001"></el-option>
                </el-select>
              </el-col>
            </el-row>

            <template v-if="row.is_sensitive">
              <el-input size="mini" placeholder="液体容量" v-model="row.max_liquid_capacity_hp"
                        v-if="row.sensitive_list.indexOf(140001)>=0">
                <template slot="prepend">液体容量</template>
                <template slot="append">ml</template>
              </el-input>
              <el-input size="mini" placeholder="储电容量" v-model="row.max_battery_capacity_hp"
                        v-if="row.sensitive_list.indexOf(110001)>=0 || row.sensitive_list.indexOf(120001)>=0">
                <template slot="prepend">储电容量</template>
                <template slot="append">wh</template>
              </el-input>
              <template v-if="row.sensitive_list.indexOf(170001)>=0">
                <el-input size="mini" placeholder="刀具长度" v-model="row.max_knife_length_hp">
                  <template slot="prepend">刀具长度</template>
                  <template slot="append">cm</template>
                </el-input>
                <el-input size="mini" placeholder="刀尖角度" v-model="row.knife_angle">
                  <template slot="prepend">刀尖角度</template>
                  <template slot="append">°</template>
                </el-input>
              </template>
            </template>
          </div>
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
        <el-table-column label="Sku 分类" prop="sku_classification" align="center" width="300px">
          <div slot-scope="{row}">
            <el-select size="mini" v-model="row.sku_classification" filterable style="width: 100%"
                       @change="skuClassificationChanged(row)">
              <el-option :key="1" label="单品" :value="1">
                <div>单品</div>
                <div class="sku-category_labelTips__1R78E">仅1件商品 (如1个碗、1对耳环)</div>
              </el-option>
              <el-option :key="2" label="同款多件装" :value="2">
                <div>同款多件装</div>
                <div class="sku-category_labelTips__1R78E">多件同规格同种类单品 (如2个相同的杯子)</div>
              </el-option>
              <el-option :key="3" label="混合套装" :value="3">
                <div>混合套装</div>
                <div class="sku-category_labelTips__1R78E">多件不同品类/规格单品 (如1个杯子+1个勺子)</div>
              </el-option>
            </el-select>
            <el-input size="mini" v-model.number="row.number_of_pieces" type="primary" placeholder="请输入"
                      :disabled="row.sku_classification === 1" clearable>
              <el-select size="mini" v-model="row.piece_unit_code" slot="append" placeholder="请选择"
                         style="width: 70px"
                         v-if="row.sku_classification === 1 || row.sku_classification === 2">
                <el-option label="件" :value="1"></el-option>
                <el-option label="双" :value="2"></el-option>
                <el-option label="包" :value="3"></el-option>
              </el-select>
              <el-select size="mini" v-model="row.piece_unit_code" slot="append" placeholder="请选择"
                         style="width: 70px" v-if="row.sku_classification === 3">
                <el-option label="件" :value="1"></el-option>
              </el-select>
            </el-input>
            <el-select size="mini" v-model="row.individually_packed" filterable style="width: 100%"
                       v-if="row.sku_classification === 2 || row.sku_classification === 3">
              <el-option :key="1" label="是独立包装" :value="1">
              </el-option>
              <el-option :key="2" label="不是独立包装" :value="0">
              </el-option>
            </el-select>
            <div v-if="row.sku_classification === 3">
              <el-row :gutter="1">
                <template v-for="(ac, index) in row.accessories">
                  <el-col :span="8">
                    <el-select size="mini" placeholder="请选择" v-model="ac.vid" filterable style="width: 100%" remote :remote-method="searchSkuAccessories" @change="changeSkuAccessory(ac)">
                      <el-option v-for="(item, index) in skuAccessoriesOptions" :key="index" :label="item.value" :value="item.vid"></el-option>
                      <template v-if="ac.vid && !existAccessoryOption(ac.vid)">
                        <el-option :key="-1" :label="ac.value" :value="ac.vid"></el-option>
                      </template>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-input size="mini" style="width: 100%" v-model.number="ac.num" type="primary" placeholder="请输入">
                    </el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-button size="mini" style="width: 100%" type="primary" @click="deleteAccessory(row, ac)" :disabled="row.accessories.length <= 1">删除</el-button>
                  </el-col>
                </template>
              </el-row>
              <el-button size="mini" type="primary" @click="addAccessory(row)">添加</el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="价格(¥)" prop="price" align="center">
          <div slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="row.price" :min="0"
                             :precision="2"></el-input-number>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" v-if="value.spec_prop_id1"
                       @click="set(row, 'spec1')">更新同{{ spec1Name }}
            </el-button>
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" v-if="value.spec_prop_id2"
                       @click="set(row, 'spec2')">更新同{{ spec2Name }}
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

import {simpleProductAccessoryPageQuery} from "@/api/temu/simple_product";

export default {
  name: 'TemuProductSkuList',
  components: {},
  mixins: [],
  props: ['value'],
  computed: {
    spec1Name() {
      let d = this.value.sku_spec_list.find((item) => {
        return item.parentSpecId === this.value.spec_prop_id1
      })
      return d ? d.parentSpecName : "规格1"
    },
    spec2Name() {
      let d = this.value.sku_spec_list.find((item) => {
        return item.parentSpecId === this.value.spec_prop_id2
      })
      return d ? d.parentSpecName : "规格2"
    },
  },
  data() {
    return {
      skuAccessoriesOptions: []
    }
  },
  watch: {},
  methods: {
    onSensitiveChanged(row) {
      if (row.is_sensitive) {
        return
      }
      row.sensitive_list = []
    },
    skuClassificationChanged(row) {
      row.number_of_pieces = 1
      row.individually_packed = 0
      row.piece_unit_code = 1
      this.$set(row, 'accessories', []);
      if (row.sku_classification === 3) {
        this.addAccessory(row)
      }
    },
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
        item.sku_classification = row.sku_classification
        item.number_of_pieces = row.number_of_pieces
        item.piece_unit_code = row.piece_unit_code
        item.accessories = row.accessories
        item.individually_packed = row.individually_packed
        item.is_sensitive = row.is_sensitive
        item.sensitive_list = row.sensitive_list
        item.max_battery_capacity_hp = row.max_battery_capacity_hp
        item.max_liquid_capacity_hp = row.max_liquid_capacity_hp
        item.max_knife_length_hp = row.max_knife_length_hp
        item.knife_angle = row.knife_angle
      })
    },
    async searchSkuAccessories(query) {
      let resp = await simpleProductAccessoryPageQuery({id: query})
      this.loading = false;
      if (resp.code) {
        return
      }
      this.skuAccessoriesOptions = resp.data
    },
    existAccessoryOption(vid) {
      return this.skuAccessoriesOptions.find((item) => {return item.vid === vid})
    },
    changeSkuAccessory(ac) {
      let op = this.skuAccessoriesOptions.find((item) => {return item.vid === ac.vid})
      if (op) {
        ac.vid = op.vid
        ac.unit_code = op.unit_code
        ac.value = op.value
        ac.num = 1
      } else {
        ac.vid = undefined
        ac.value = undefined
        ac.unit_code = undefined
      }
    },
    deleteAccessory(row, item) {
      row.accessories = row.accessories.filter(v => v !== item);
    },
    addAccessory(row) {
      if (!row.accessories) {
        this.$set(row, 'accessories', []); // 初始化数组
      }
      row.accessories.push({
        vid: undefined,
        name: undefined,
        num: 0,
        unit_code: undefined,
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
</style>