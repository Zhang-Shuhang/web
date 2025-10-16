<template>
  <el-drawer :visible.sync="$attrs.visible" :title="isEdit ? '编辑' : '创建'" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="120px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name" placeholder="请输入名字" clearable maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="工厂类型" prop="group_id" v-if="!isEdit">
        <el-select v-model="form.group_id" placeholder="请选择是否公开" style="width: 100%" filterable>
          <el-option label="公开" :value="0"></el-option>
          <el-option label="本司" :value="groupId" v-if="groupId>0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工厂" prop="factory_id" v-if="!isEdit">
        <el-select v-model="form.factory_id" placeholder="请选择所属工厂" style="width: 100%" filterable>
          <el-option :label="f.name" :value="f.id" v-for="(f, index) in factories"></el-option>
        </el-select>
      </el-form-item>
      <el-button size="medium" type="primary" @click="createOrSave" style="width: 100%; height: 50px; margin-top: 5px">{{isEdit ? "更新" : "创建"}}</el-button>
    </el-form>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import Upload from "@/view/components/upload.vue";
import {factoryWarehouseWarehouseCreate, factoryWarehouseWarehouseUpdate} from "@/api/factory_warehouse/warehouse";

export default {
  name: 'TemuDlgEditWarehouse',
  components: {Upload, KdxImage},
  props: {
    row: {
      type: Object,
    },
    factories: {
      type: Array,
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
        group_id: this.groupId,
      }
    },
    async createOrSave() {
      if (!this.form.name) {
        this.$message.error("请输入名字")
        return
      }
      if (!this.form.factory_id) {
        this.$message.error("请选择工厂")
        return
      }
      let data = {...this.form}

      let f = factoryWarehouseWarehouseCreate
      if (this.isEdit) {
        f = factoryWarehouseWarehouseUpdate
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