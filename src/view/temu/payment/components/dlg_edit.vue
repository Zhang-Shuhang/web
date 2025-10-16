<template>
  <el-dialog :visible.sync="$attrs.visible" title="更新Cookie" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" :rules="toUpdateRules" ref="elForm" :model="toUpdate" size="mini" label-width="100px" label-position="right">
      <el-form-item label-width="0">
        <el-input type="textarea" :rows="5" v-model="toUpdate.cookie" placeholder="cookie" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" style="width: 100%; margin-top: 20px" @click="update">更新</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import {userUpdate} from "@/api/temu/user";

export default {
  name: 'TemuDlgEdit',
  components: {},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      toUpdate: {
        cookie: "",
      },

      toUpdateRules: {
        cookie: [{
          required: true,
          message: '请输入cookie',
          trigger: 'blur'
        }],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
    },
    async update() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return

        let resp = await userUpdate({id: this.id, cookie: this.toUpdate.cookie})
        if (resp.code === 0) {
          this.$message("更新成功")
          this.$emit('update', true)
          this.$emit('close', false)
        }
      })
    },
  },
  mounted() {
  },
  filters: {},
  async update() {
  }
}
</script>
<style scoped lang="scss">
</style>