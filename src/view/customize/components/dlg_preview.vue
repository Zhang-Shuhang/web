<template>
  <el-drawer :visible.sync="$attrs.visible" title="预览" @opened="onOpened" :size="`${this.width+10}px`"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div slot="title" class="title">
      <div style="float: left">
        <span>预览</span>
      </div>

      <div style="float: right">
        <el-button style="width: 100px; margin-right: 20px" size="mini" type="primary" @click="confirmGen">确认生成</el-button>
      </div>
    </div>
    <el-tabs v-model="activeName" type="border-card" :stretch="true">
      <el-tab-pane :label="item.name" :name="item.name" v-for="(item, index) in list" :key="index"></el-tab-pane>
    </el-tabs>

    <div style="margin-top: 5px; margin-left: 5px;" v-if="active">
      <div v-html="svg(active)"></div>
    </div>
  </el-drawer>
</template>


<script>

import {customizeOrderGen} from "@/api/customize/order";

export default {
  name: 'CustomizeDlgPreview',
  components: {},
  mixins: [],
  computed: {
    active() {
      return this.list.find((item) => {return item.name === this.activeName})
    }
  },
  props: {
    width: {
      type: Number,
    },
    id: {
      type: Number,
    },
    list: {
      type: Array,
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
      if (this.list.length) {
        this.activeName = this.list[0].name
      }
      this.confirmGen()
    },
    svg(item) {
      return item.svg.replace("<svg", `<svg style="background-color:lightblue"`)
    },
    confirmGen() {
      this.$confirm('确认生成, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            const res = await customizeOrderGen({id: this.id, list: this.list})
            if (res.code) {
              return
            }
            this.$message("确认成功")
            this.handleBeforeClose()
            this.$emit("suc")
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