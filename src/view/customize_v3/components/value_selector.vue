<template>
  <div>
    <el-row :gutter="5">
      <el-col :span="18">
        <slot></slot>
      </el-col>
      <el-col :span="3">
        <el-badge :value="list.length ? list.length : ''" :max="99" style="width: 100%; display: inline-block">
          <el-button size="mini" type="primary" icon="el-icon-setting" style="width: 100%" @click="visible = true"></el-button>
        </el-badge>
      </el-col>
      <el-col :span="3">
        <el-button size="mini" type="primary" style="width: 100%; display: inline-block" icon="el-icon-refresh" @click="refreshIfNeed"></el-button>
      </el-col>
    </el-row>

    <DlgValueSelectorV3 :data-list="dataList" :method-options="methodOptions" :value-type="valueType" :values="values" :list="list"
                      :refresh="refreshIfNeed" @update="update" :visible="visible" @close="visible=false"></DlgValueSelectorV3>
  </div>
</template>

<script>
import DlgValueSelectorV3 from "@/view/customize_v3/components/dlg_value_selector.vue";

export default {
  name: 'ValueSelectorV3',
  components: {DlgValueSelectorV3},
  mixins: [],
  props: {
    dataList: {
      type: Array,
      required: true,
    },
    methodOptions: {
      type: Array,
      required: true,
    },
    valueType: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
    },
    list: {
      type: Array,
      default: () => [],
    },
    refresh: {
      type: Function,
    },
  },
  data() {
    return {
      visible: false,
    }
  },
  methods: {
    update(event) {
      this.$emit('update', event)
    },
    refreshIfNeed() {
      if (this.refresh) {
        this.refresh()
      }
    }
  },
}
</script>

<style scoped lang="scss">
.div {
  width: calc(100% - 120px);
  display: inline-block;
}

::v-deep .el-badge__content.is-fixed {
  right: 15px;
}

::v-deep .el-badge {
  vertical-align: baseline;
}
</style>