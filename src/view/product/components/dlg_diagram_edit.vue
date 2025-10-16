<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
      <el-form-item label="材质">
        <el-select v-model="form.print_material" placeholder="请选择打印材质" filterable clearable :style="{width: '100%'}">
          <el-option label="" value=""></el-option>
          <el-option v-for="(item, index) in printMaterialOptions" :key="index" :label="item.id" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%; height: 40px" type="warning" @click="onUpdate">更新</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>

import {diagramUpdatePrintMaterial} from "@/api/product/diagram";

export default {
  name: 'TemuDlgDiagramEdit',
  props: {
    ids: {
      type: Array,
      required: true,
    },
    printMaterialOptions: {
      type: Array,
      required: true,
    },
  },
  watch: {},
  data() {
    return {
      form: this.emptyForm(),
    }
  },
  mixins: [],
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      Object.assign(this.form, this.emptyForm())
    },
    async onUpdate() {
      let resp = await diagramUpdatePrintMaterial({ids: this.ids, print_material: this.form.print_material})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    emptyForm() {
      return {
        print_material: "",
      }
    },
    async syncAccessoryList() {
      let resp = await accessoryList()
      if (resp.code) {
        return
      }
      this.accessoryList = resp.data
    },
    deleteAccessory(item) {
      this.form.accessory_list = this.form.accessory_list.filter((v) => {return v !== item})
    },
    addAccessory() {
      this.form.accessory_list.push({id: undefined, count: undefined})
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