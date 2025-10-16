<template>
  <el-drawer :visible.sync="$attrs.visible" :title="isEdit ? '编辑' : '创建'" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{isEdit ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import Upload from "@/view/components/upload.vue";
import {factoryWarehouseProviderCreate, factoryWarehouseProviderUpdate} from "@/api/factory_warehouse/provider";

export default {
  name: 'TemuDlgEditProvider',
  components: {Upload, KdxImage},
  props: {
    row: {
      type: Object,
    },
  },
  watch: {},
  computed: {
    ...mapGetters("user", ["groupId"]),
    isEdit() {
      return this.form.id > 0
    }
  },
  data() {
    return {
      form: this.emptyForm(),
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      if (this.row) {
        Object.assign(this.form, this.row)
      } else {
        Object.assign(this.form, this.emptyForm())
      }
    },
    emptyForm() {
      return {
        id: 0,
        name: "",
      }
    },
    uploadImage(newImage) {
      this.form.image = newImage
    },
    async createOrSave() {
      if (!this.form.name) {
        this.$message.error("请输入名字")
        return
      }
      let data = {...this.form}

      let f = factoryWarehouseProviderCreate
      if (this.isEdit) {
        f = factoryWarehouseProviderUpdate
      }

      let resp = await f(data)
      if (resp.code) {
        return
      }

      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("update")
    },
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  }
}
</script>

<style scoped lang="scss">
</style>