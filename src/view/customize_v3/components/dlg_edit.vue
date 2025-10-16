<template>
  <el-drawer :visible.sync="$attrs.visible" title="调整定制信息" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="分隔符" prop="separator">
        <el-input v-model="form.separator"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%" type="primary" @click="onCreate">调整</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>

import {customizeUpdate} from "@/api/customize_v3/list";

export default {
  name: 'CustomizeDlgEditV3',
  components: {},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
    name: {
      type: String,
    },
    separator: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      form: {
        name: '',
        separator: "",
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.form.name = this.name
      this.form.separator = this.separator
    },
    onCreate() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return

        let resp = await customizeUpdate({id: this.id, ...this.form})
        if (resp.code) {
          return
        }

        this.$message("更新成功")
        this.handleBeforeClose()
        this.$emit("suc")
      })
    }
  },
}
</script>
<style scoped lang="scss">
</style>