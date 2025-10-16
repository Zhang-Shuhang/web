<template>
  <el-drawer
      :title="title"
      :visible.sync="drawerVisible"
      :direction="direction"
      :size="width"
      :before-close="handleClose"
      :destroy-on-close="true"
      custom-class="embed-drawer"
  >
    <div class="drawer-content-container">
      <div class="component-container" v-if="component">
        <component class="component-container"
            v-if="drawerVisible"
            :is="component"
            :key="componentKey"
            v-bind="componentProps"
            v-on="componentEvents"
        />
      </div>
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: 'EmbedDrawer',
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: '内容面板'
    },
    component: {
      type: [Object, String],
    },
    componentProps: {
      type: Object,
      default: () => ({})
    },
    componentEvents: {
      type: Object,
      default: () => ({})
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    width: {
      type: [String, Number],
      default: '50%'
    }
  },
  data() {
    return {
      drawerVisible: false,
      componentKey: 0
    }
  },
  watch: {
    visible(newVal) {
      this.drawerVisible = newVal
      if (newVal) {
        // 强制重新创建组件实例
        this.componentKey++
      }
    },
    drawerVisible(newVal) {
      this.$emit('update:visible', newVal)
    }
  },
  methods: {
    handleClose(done) {
      // 这里可以添加关闭前的逻辑确认
      this.$emit('close', false)
      done()
    }
  }
}
</script>

<style scoped>
.drawer-content-container {
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;
}

.component-container {
  height: 100%;
}
</style>

<style>
.embed-drawer .el-drawer__body {
  overflow-y: auto;
}
</style>