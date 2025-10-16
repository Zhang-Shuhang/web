<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑名字拼图元素" @opened="onOpened" size="60%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="80px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable></el-input>
      </el-form-item>
      <el-form-item label="路径1" prop="path1">
        <el-input v-model="form.path1" placeholder="请输入路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="路径2" prop="path2">
        <el-input v-model="form.path2" placeholder="请输入路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="路径3" prop="path3">
        <el-input v-model="form.path3" placeholder="请输入路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="路径4" prop="path4">
        <el-input v-model="form.path4" placeholder="请输入路径" clearable></el-input>
      </el-form-item>

      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{id ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>


<script>

import {mzptStandLoad, mzptStandUpdate} from "@/api/customize/mzpt_stand";
import {fabric} from "fabric";

export default {
  name: 'CustomizeDlgEditMzptStand',
  components: {},
  mixins: [],
  computed: {
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
        name: '',
        path1: '',
        path2: '',
        path3: '',
        path4: '',
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async createOrSave() {
      let data = {id: this.id, name: this.form.name, paths: []}
      if (!data.name) {
        this.$message.error("请输入名字")
        return
      }

      // 计算路径
      if (this.form.path1) {
        let path = new fabric.Path(this.form.path1);
        data.paths.push({path: this.form.path1, width: path.width, height: path.height})
      }
      if (this.form.path2) {
        let path = new fabric.Path(this.form.path2);
        data.paths.push({path: this.form.path2, width: path.width, height: path.height})
      }
      if (this.form.path3) {
        let path = new fabric.Path(this.form.path3);
        data.paths.push({path: this.form.path3, width: path.width, height: path.height})
      }
      if (this.form.path4) {
        let path = new fabric.Path(this.form.path4);
        data.paths.push({path: this.form.path4, width: path.width, height: path.height})
      }

      let resp = await mzptStandUpdate(data)
      if (resp.code) {
        return
      }
      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    async onOpened() {
      if (this.id || this.copy_id) {
        let resp = await mzptStandLoad({id: this.id || this.copy_id})
        if (resp.code) {
          this.handleBeforeClose()
          return
        }
        this.form.name = resp.data.name

        for (let i = 0; i < resp.data.paths.length; i++) {
          this.form[`path${i+1}`] = resp.data.paths[i].path
        }
      } else {
        this.form.name = ''
        this.form.path1 = ''
        this.form.path2 = ''
        this.form.path3 = ''
        this.form.path4 = ''
      }
    },
  },
}
</script>
<style scoped lang="scss">
</style>