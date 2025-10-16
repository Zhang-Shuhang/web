<template>
  <el-drawer :visible.sync="$attrs.visible" title="编辑" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
      <el-form-item label="名字" prop="name">
        {{ form.name }}
      </el-form-item>
      <div>
        <el-form-item label="配件" prop="accessory_list">
          <div v-for="(item, index) in form.accessory_list" :key="index">
            <el-col :span="12">
              <el-select size="mini" v-model="item.id" placeholder="请选择配件" filterable clearable style="width: 100%;">
                <el-option v-for="(accessory, idx) in accessoryList" :key="idx" :label="accessory.name" :value="accessory.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input-number style="width: 100%" v-model="item.count" placeholder="配件数量" :min="1" :precision="0"></el-input-number>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" style="width: 100%" size="mini" @click="deleteAccessory(item)">删除配件</el-button>
            </el-col>
          </div>
          <el-col :span="4" :offset="20">
            <el-button type="primary" style="width: 100%" size="mini" @click="addAccessory">添加配件</el-button>
          </el-col>
        </el-form-item>
        <el-form-item label="特殊备注" prop="special_desc">
          <el-input type="textarea" placeholder="产品特殊信息" v-model="form.special_desc" clearable maxlength="250" show-word-limit :autosize="{ minRows: 3, maxRows: 100 }"></el-input>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button size="medium" style="width: 100%; height: 100px" type="warning" @click="onUpdate">更新</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>

import {mapGetters} from "vuex";
import {accessoryList} from "@/api/product/accessory";
import {productLoad, productUpdate} from "@/api/product/product";

export default {
  name: 'TemuDlgProductEdit',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters("user", ["canUpdateProductCategoryPrice", "canSetProductOk"]),
  },
  watch: {},
  data() {
    return {
      form: this.emptyForm(),
      accessoryList: [],
      packageMaterialList: [],
      metaMaterialList: [],
      techList: [],
    }
  },
  mixins: [],
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.syncAccessoryList()
      Object.assign(this.form, this.emptyForm())
      if (!this.id) {
        return
      }

      let resp = await productLoad({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      Object.assign(this.form, resp.data)
      for (const v of resp.data.accessories) {
        this.form.accessory_list.push({id: v.accessory_id, count: v.count})
      }
    },
    async onUpdate() {
      let resp = await productUpdate({...this.form})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    emptyForm() {
      return {
        accessory_list: [],
        special_desc: "",
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