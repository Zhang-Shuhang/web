<template>
  <el-dialog :visible.sync="$attrs.visible" title="创建" @opened="onOpened" width="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" :rules="toCreateRules" ref="elForm" :model="toCreate" size="mini" label-width="100px" label-position="right">
      <el-form-item label-width="0">
        <el-input v-model="toCreate.id" placeholder="账号id" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-input v-model="toCreate.name" type="primary" placeholder="名字" clearable></el-input>
      </el-form-item>
      <el-form-item label-width="0">
        <el-button type="primary" style="width: 100%; margin-top: 20px" @click="create">创建</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

import {accountCreate} from "@/api/shein/account";

export default {
  name: 'SheinDlgCreate',
  components: {},
  mixins: [],
  computed: {},
  watch: {},
  data() {
    return {
      toCreate: {
        id: undefined,
        name: "",
      },

      toCreateRules: {
        id: [{
          required: true,
          message: '请输入账号id',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请输入名字',
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
      this.toCreate.id = undefined
      this.toCreate.name = ""
    },
    async create() {
      this.$refs['elForm'].validate(async valid => {
        if (!valid) return

        let resp = await accountCreate({id: Number(this.toCreate.id), name: this.toCreate.name})
        if (resp.code === 0) {
          this.$message("创建成功")
          this.$emit('update')
          this.$emit('close', false)
        }
      })
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>