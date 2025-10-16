<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑名字拼图元素" @opened="onOpened" size="60%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="80px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable></el-input>
      </el-form-item>
      <el-form-item label="色系" prop="colors">
        <el-select v-model="form.colors" placeholder="请输入色系" multiple allow-create filterable clearable style="width: 100%">
        </el-select>
      </el-form-item>

      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{id ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>

<script>

import {mapGetters} from "vuex";
import {mzptColorSeriesLoad, mzptColorSeriesUpdate} from "@/api/customize_v3/mzpt_color_series";

export default {
  name: 'CustomizeDlgEditMzptColorSeriesV3',
  components: {},
  mixins: [],
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  props: {
    id: {
      type: Number,
    },
    copy_id: {
      type: Number,
    },
  },
  data() {
    return {
      form: {
        id: undefined,
        name: '',
        colors: [],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async createOrSave() {
      let data = {...this.form}
      if (!data.name) {
        this.$message.error("请输入名字")
        return
      }
      if (!data.colors) {
        this.$message.error("请输入色彩列表")
        return
      }

      let resp = await mzptColorSeriesUpdate(data)
      if (resp.code) {
        return
      }
      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    async onOpened() {
      if (this.id || this.copy_id) {
        let resp = await mzptColorSeriesLoad({id: this.id || this.copy_id})
        if (resp.code) {
          this.handleBeforeClose()
          return
        }
        this.form.id = this.id
        this.form.name = resp.data.name
        this.form.colors = resp.data.colors
      } else {
        this.form.id = undefined
        this.form.name = ''
        this.form.colors = []
      }
    },
  },
}
</script>
<style scoped lang="scss">
</style>