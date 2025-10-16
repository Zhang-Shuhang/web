<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑名字拼图元素" @opened="onOpened" size="60%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable></el-input>
      </el-form-item>
      <el-form-item label="加工类型" prop="type">
        <el-select v-model="form.type" placeholder="请输入加工类型" style="width: 100%" filterable clearable>
          <el-option label="UV加工" :value="0"></el-option>
          <el-option label="激光1加工" :value="1"></el-option>
          <el-option label="激光2加工" :value="2"></el-option>
          <el-option label="热转印-马克杯" :value="3"></el-option>
          <el-option label="名字拼图" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="Png宽度" prop="png_width">
            <el-input-number v-model="form.png_width" style="width: 100%" placeholder="请输入宽度" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Png高度" prop="png_height">
            <el-input-number v-model="form.png_height" style="width: 100%" placeholder="请输入高度" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="条码宽" prop="code_width">
            <el-input-number v-model="form.code_width" style="width: 100%" placeholder="请输入条码宽" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="条码高" prop="code_height">
            <el-input-number v-model="form.code_height" style="width: 100%" placeholder="请输入条码高" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="条码特殊链接" prop="code_special_url">
            <el-input v-model="form.code_special_url" placeholder="请输入条码特殊链接" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊条码X位置" prop="code_special_x">
            <el-input-number v-model="form.code_special_x" style="width: 100%" placeholder="请输入特殊条码X位置" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊条码Y位置" prop="code_special_y">
            <el-input-number v-model="form.code_special_y" style="width: 100%" placeholder="请输入特殊条码Y位置" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊条码宽" prop="code_special_width">
            <el-input-number v-model="form.code_special_width" style="width: 100%" placeholder="请输入特殊条码宽" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="特殊条码高" prop="code_special_height">
            <el-input-number v-model="form.code_special_height" style="width: 100%" placeholder="请输入特殊条码高" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排版几行" prop="row">
            <el-input-number v-model="form.row" style="width: 100%" placeholder="请输入排版几行" :min="0" :precision="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排版几列" prop="code_special_height">
            <el-input-number v-model="form.col" style="width: 100%" placeholder="请输入排版几列" :min="0" :precision="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="左上角X差" prop="up_left_x">
            <el-input-number v-model="form.up_left_x" style="width: 100%" placeholder="请输入左上角X差" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="左上角Y差" prop="up_left_y">
            <el-input-number v-model="form.up_left_y" style="width: 100%" placeholder="请输入左上角Y差" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="右侧相差" prop="gap_x">
            <el-input-number v-model="form.gap_x" style="width: 100%" placeholder="请输入右侧相差" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下侧相差" prop="gap_y">
            <el-input-number v-model="form.gap_y" style="width: 100%" placeholder="请输入下侧相差" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="X1偏移" prop="shrink_x1">
            <el-input-number v-model="form.shrink_x1" style="width: 100%" placeholder="请输入X1偏移" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Y1偏移" prop="shrink_y1">
            <el-input-number v-model="form.shrink_y1" style="width: 100%" placeholder="请输入Y1偏移" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="X2偏移" prop="shrink_x2">
            <el-input-number v-model="form.shrink_x2" style="width: 100%" placeholder="请输入X2偏移" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Y2偏移" prop="shrink_y2">
            <el-input-number v-model="form.shrink_y2" style="width: 100%" placeholder="请输入Y2偏移" :min="0" clearable></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单个加工脚本名" prop="single_action_name">
            <el-input v-model="form.single_action_name" placeholder="请输入单个加工脚本名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单个加工脚本组" prop="single_action_group">
            <el-input v-model="form.single_action_group" placeholder="请输入单个加工脚本组" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获得像素脚本名" prop="get_pixel_action_name">
            <el-input v-model="form.get_pixel_action_name" placeholder="请输入获得像素脚本名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获得像素脚本组" prop="get_pixel_action_group">
            <el-input v-model="form.get_pixel_action_group" placeholder="请输入获得像素脚本组" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行脚本名列表" prop="export_ps_action_names">
            <el-select v-model="form.export_ps_action_names" placeholder="请输入执行脚本名列表" multiple allow-create filterable clearable style="width: 100%">
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行脚本组" prop="export_ps_action_group">
            <el-input v-model="form.export_ps_action_group" placeholder="请输入执行脚本组" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{id ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>


<script>

import {mapGetters} from "vuex";
import {groupLoad, groupUpdate} from "@/api/customize/group";

export default {
  name: 'CustomizeDlgGroup',
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
      form: this.empty(),
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

      let resp = await groupUpdate(data)
      if (resp.code) {
        return
      }
      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    async onOpened() {
      if (this.id || this.copy_id) {
        let resp = await groupLoad({id: this.id || this.copy_id})
        if (resp.code) {
          this.handleBeforeClose()
          return
        }
        Object.assign(this.form, resp.data)
        if (this.copy_id) {
          this.form.id = undefined
        }
      } else {
        Object.assign(this.form, this.empty())
      }
    },
    empty() {
      return {
        type: 0,
        name: "",
        width: 100,
        height: 100,
        png_width: 1000,
        png_height: 1000,
        code_width: 700,
        code_height: 200,
        code_special_url: "",
        code_special_x: 0,
        code_special_y: 0,
        code_special_width: 0,
        code_special_height: 0,
        row: 1,
        col: 1,
        up_left_x: 0,
        up_left_y: 0,
        gap_x: 0,
        gap_y: 0,
        shrink_x1: 0,
        shrink_y1: 0,
        shrink_x2: 0,
        shrink_y2: 0,
        single_action_name: "",
        single_action_group: "",
        get_pixel_action_name: "",
        get_pixel_action_group: "",
        export_ps_action_names: [],
        export_ps_action_group: "",
      }
    }
  },
}
</script>
<style scoped lang="scss">
</style>