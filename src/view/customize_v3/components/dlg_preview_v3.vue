<template>
  <el-drawer :visible.sync="$attrs.visible" :title="`预览: ${id}`" @opened="onOpened" :size="`${Math.floor(800)}px`"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose" :destroy-on-close="true">
    <div slot="title" class="title">
      <div style="float: left">
        <span>预览: {{id}}</span>
      </div>

      <div style="float: right">
        <el-button style="width: 100px; margin-right: 20px" size="mini" type="primary" @click="confirmGen">确认生成</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card" :stretch="true">
      <el-tab-pane label="UV图" name="UV图"></el-tab-pane>
      <el-tab-pane label="切割图" name="切割图" v-if="cut_svg"></el-tab-pane>
    </el-tabs>

    <div style="margin-top: 5px; margin-left: 5px; background-color: #BAE0FF;">
      <div v-html="uv_svg" style="background-color:lightblue" v-if="activeName === 'UV图'"></div>
      <div v-html="cut_svg" style="background-color:lightblue" v-else-if="activeName === '切割图'"></div>
    </div>
  </el-drawer>
</template>


<script>

export default {
  name: 'CustomizeDlgPreviewV3',
  components: {},
  mixins: [],
  props: {
    id: {
      type: String,
    },
    uv_svg: {
      type: String,
    },
    cut_svg: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
  },
  watch: {},
  data() {
    return {
      activeName: undefined,
    }
  },
  mounted() {
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.activeName = "UV图"

      this.confirmGen()
    },
    confirmGen() {
      this.$confirm('预览无误，继续下一个面或者生成, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            this.$message("确认成功")
            this.handleBeforeClose()
            this.$emit("suc", {uv_svg: this.uv_svg, cut_svg: this.cut_svg, width: this.width, height: this.height})
          })
    }
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-tabs__content {
  display: none;
}
</style>