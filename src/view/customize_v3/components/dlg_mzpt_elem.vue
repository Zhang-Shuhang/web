<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑名字拼图元素" @opened="onOpened" size="60%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="80px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable></el-input>
      </el-form-item>
      <el-form-item label="字母" prop="name">
        <el-input v-model="form.letter" placeholder="请输入字母，区别大小写" clearable maxlength="1" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="宽度" prop="width">
        <el-input-number v-model="form.width" style="width: 100%" placeholder="请输入宽度" :min="0" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="高度" prop="height">
        <el-input-number v-model="form.height" style="width: 100%" placeholder="请输入高度" :min="0" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="偏移X" prop="offset_x">
        <el-input-number v-model="form.offset_x" style="width: 100%" placeholder="请输入偏移X" :min="0" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="偏移Y" prop="offset_y">
        <el-input-number v-model="form.offset_y" style="width: 100%" placeholder="请输入偏移Y" :min="0" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="外路径" prop="outer_path">
        <el-input v-model="form.outer_path" placeholder="请输入外路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="内路径" prop="inner_path">
        <el-input v-model="form.inner_path" placeholder="请输入内路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="路径内图片" prop="inner_image">
        <el-row :gutter="5">
          <el-col :span="18">
            <el-input v-model="form.inner_image" placeholder="路径内图片" clearable></el-input>
          </el-col>
          <el-col :span="6">
            <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".png,.jpg" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
              <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>

      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{id ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>


<script>

import {mapGetters} from "vuex";
import {mzptElemLoad, mzptElemUpdate} from "@/api/customize_v3/mzpt_elem";
import {fabric} from "fabric";

export default {
  name: 'CustomizeDlgEditMzptElemV3',
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
        letter: '',
        width: 0,
        height: 0,
        offset_x: 0,
        offset_y: 0,
        outer_path: undefined,
        inner_path: undefined,
        inner_image: undefined,
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
      if (!data.width) {
        this.$message.error("请输入宽度")
        return
      }
      if (!data.height) {
        this.$message.error("请输入高度")
        return
      }
      if (data.offset_x < 0) {
        this.$message.error("请输入偏移X")
        return
      }
      if (data.offset_y < 0) {
        this.$message.error("请输入偏移Y")
        return
      }
      // if (!data.outer_path) {
      //   this.$message.error("请输入外路径")
      //   return
      // }

      // 计算路径
      if (data.outer_path) {
        let path = new fabric.Path(data.outer_path);
        data.outer_width = path.width
        data.outer_height = path.height
      }
      if (data.inner_path) {
        let path = new fabric.Path(data.inner_path);
        data.inner_width = path.width
        data.inner_height = path.height
      }

      let resp = await mzptElemUpdate(data)
      if (resp.code) {
        return
      }
      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    async onOpened() {
      if (this.id || this.copy_id) {
        let resp = await mzptElemLoad({id: this.id || this.copy_id})
        if (resp.code) {
          this.handleBeforeClose()
          return
        }
        this.form.id = this.id
        this.form.name = resp.data.name
        this.form.letter = resp.data.letter
        this.form.width = resp.data.width
        this.form.height = resp.data.height
        this.form.offset_x = resp.data.offset_x
        this.form.offset_y = resp.data.offset_y
        this.form.outer_path = resp.data.outer_path
        this.form.inner_path = resp.data.inner_path
        this.form.inner_image = resp.data.inner_image
      } else {
        this.form.id = undefined
        this.form.name = ''
        this.form.letter = ''
        this.form.width = 0
        this.form.height = 0
        this.form.offset_x = 0
        this.form.offset_y = 0
        this.form.outer_path = undefined
        this.form.inner_path = undefined
        this.form.inner_image = undefined
      }
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.inner_image = res.data
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>