<template>
  <el-card class="box-card" v-if="value.size">
    <div slot="header" class="clearfix">
      <span>商品尺寸</span>
    </div>
    <div>
      <el-row :gutter="5">
        <el-col :span="4" v-for="(item, index) in value.size.sizeSpecMetaVO.elements" :key="index">
          <el-checkbox v-model="item.autoSelected" :true-label="1" :false-label="0" :disabled="item.necessary">
            {{ item.name }}({{ item.unit }})
          </el-checkbox>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-table :data="value.size_records" stripe style="width: 100%" border
                  :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
          <el-table-column align="center" :label="group.name"
                           v-for="(group, index) in value.size.sizeSpecMetaVO.groups" :key="index">
            <template slot-scope="{row}">
              {{ row[group.id] }}
            </template>
          </el-table-column>
          <template v-for="(element, index) in value.size.sizeSpecMetaVO.elements">
            <el-table-column align="center" :label="`${element.name}(${element.unit})`"
                             v-if="element.autoSelected" :key="index+value.size.sizeSpecMetaVO.groups.length">
              <template slot-scope="{row}">
                <el-input-number size="mini" style="width: 100%" v-model="row[element.id]" :min="0"
                                 :precison="2"></el-input-number>
              </template>
            </el-table-column>
          </template>
        </el-table>
      </el-row>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'TemuProductSize',
  components: {},
  mixins: [],
  props: ['value'],
  data() {
    return {}
  },
  watch: {
  },
  methods: {
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