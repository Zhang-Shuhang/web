<template>
  <el-drawer :visible.sync="$attrs.visible" title="上传实拍标签" @opened="onOpened" size="60%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form size="mini" label-width="100px" label-position="right">
      <el-form-item label="生产进度">
        <div style="display: inline-block">
          <el-radio v-model="form.finish" :label="true">已完成</el-radio>
        </div>
        <div style="display: inline-block; margin-left: 30px">
          <el-radio v-model="form.finish" :label="false">未完成</el-radio>
        </div>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" style="width: 100%" placeholder="备注" v-model="form.remark" clearable :autosize="{ minRows: 3, maxRows: 30 }"></el-input>
      </el-form-item>
    </el-form>

    <el-button type="primary" style="width: 100%; margin-top: 20px; height: 50px" size="mini" @click="onConfirm">确认</el-button>
  </el-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import {producePlanUpdate} from "@/api/temu/produce_plan";

export default {
  name: 'TemuDlgUpdateStatus',
  components: {},
  props: {
    rows: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  data() {
    return {
      form: {
        finish: false,
        remark: "",
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      this.form.finish = false
      this.form.remark = ""
    },
    async onConfirm() {
      for (const row of this.rows) {
        let resp = await producePlanUpdate({id: row.id, finish: this.form.finish, reason: this.form.remark})
        if (resp.code) {
          return
        }

        this.$message(`${row.id} 已操作完成!`)
      }
      this.handleBeforeClose()
      this.$emit("update")
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.pageSize = 100
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>