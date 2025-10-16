<template>
  <el-drawer :visible.sync="$attrs.visible" :title="isCreate ? '创建' : '编辑'" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div style="margin-left: 10px; margin-right: 10px">
      <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-input v-model="form.image"></el-input>
          <Upload @image="uploadImage"></Upload>
          <KdxImage :src="form.image" v-if="form.image"></KdxImage>
        </el-form-item>
        <el-form-item label="前缀" prop="prefix">
          <el-input v-model="form.prefix" :disabled="!isCreate"></el-input>
        </el-form-item>
        <el-form-item label="后缀(可为空)" prop="suffix">
          <el-input v-model="form.suffix" :disabled="!isCreate"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)" prop="weight">
          <el-input-number v-model="form.weight" style="width: 100%" :min="0" :step="1" :precision="1"></el-input-number>
        </el-form-item>
        <el-row :gutter="5">
          <el-col :span="8">
            <el-form-item label="长(CM)" prop="length">
              <el-input-number v-model="form.length" style="width: 100%" :min="0" :step="1" :precision="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="宽(CM)" prop="width">
              <el-input-number v-model="form.width" style="width: 100%" :min="0" :step="1" :precision="1"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高(CM)" prop="height">
              <el-input-number v-model="form.height" style="width: 100%" :min="0" :step="1" :precision="1"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="是否定制" prop="is_customize">
          <el-switch v-model="form.is_customize"></el-switch>
        </el-form-item>
        <el-form-item label="可否工具排版" prop="can_not_tool_print">
          <el-switch v-model="form.can_not_tool_print" active-text="不可工具排版" inactive-text="可工具排版"></el-switch>
        </el-form-item>
        <el-form-item label="打印材质" prop="print_material_id">
          <el-autocomplete v-model="form.print_material_id" placeholder="请输入打印材质" :fetch-suggestions="searchPrintMaterial" @select="handleSelectPrintMaterial" style="width: 100%" clearable>
            <template slot-scope="{ item }">
              <div>{{ item }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <div>
          <el-form-item label="工艺" prop="techs">
            <el-select size="mini" v-model="form.tech_ids" multiple collapse-tags filterable clearable style="width: 100%;">
              <el-option v-for="(item, index) in techList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品组成" prop="goods_list">
            <div v-for="(item, index) in form.goods_list" :key="index">
              <el-col :span="4">
                <el-select size="mini" v-model="item.id" placeholder="请选择原材料" filterable clearable style="width: 100%;">
                  <el-option v-for="(g, idx) in goodsList" :key="idx" :label="`${g.name}(${g.unit})`" :value="g.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input-number style="width: 100%" v-model="item.count" placeholder="数量" :min="0" :precision="4"></el-input-number>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.include_ext_codes" placeholder="包含货号" allow-create multiple filterable clearable style="width: 100%">
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-select v-model="item.exclude_ext_codes" placeholder="不包含货号" allow-create multiple filterable clearable style="width: 100%">
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-checkbox size="mini" v-model="item.need_scan_confirm">需要打包确认</el-checkbox>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" style="width: 100%" size="mini" @click="deleteGoods(item)">删除产品组成</el-button>
              </el-col>
            </div>
            <el-col :span="4" :offset="20">
              <el-button type="primary" style="width: 100%" size="mini" @click="addGoods">添加产品</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="原材料" prop="meta_materials" v-if="form.meta_material_list.length > 0">
            <div v-for="(item, index) in form.meta_material_list" :key="index">
              <el-col :span="12">
                <el-select size="mini" v-model="item.id" placeholder="请选择原材料" filterable clearable style="width: 100%;">
                  <el-option v-for="(meta_material, idx) in metaMaterialList" :key="idx" :label="meta_material.name" :value="meta_material.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input-number style="width: 100%" v-model="item.count" placeholder="原材料数量" :min="1" :precision="0"></el-input-number>
              </el-col>
              <el-col :span="4">
                <el-button type="danger" style="width: 100%" size="mini" @click="deleteMetaMaterial(item)">删除原材料</el-button>
              </el-col>
            </div>
          </el-form-item>
          <el-form-item label="配件" prop="accessory_list" v-if="form.accessory_list.length > 0">
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
          </el-form-item>
          <el-form-item label="包装" prop="package_materials" v-if="form.package_material_ids.length > 0">
            <el-select size="mini" v-model="form.package_material_ids" multiple collapse-tags filterable clearable style="width: 100%;">
              <el-option v-for="(item, index) in packageMaterialList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="简单备注" prop="special_desc">
            <el-input placeholder="简单备注" v-model="form.special_desc" clearable maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="详细描述" prop="detail_desc">
            <el-input type="textarea" placeholder="详细描述" v-model="form.detail_desc" clearable maxlength="250" show-word-limit :autosize="{ minRows: 3, maxRows: 100 }"></el-input>
          </el-form-item>
          <el-form-item label="每箱上限" prop="max_per_box">
            <el-input-number placeholder="每箱最多装多少个" style="width: 100%" v-model="form.max_per_box" :min="0" :max="1000" :precision="0"></el-input-number>
          </el-form-item>
        </div>
        <el-button size="medium" style="width: 100%" type="primary" @click="onCreate" v-if="!form.id">创建</el-button>
        <el-button size="medium" style="width: 100%" type="warning" @click="onUpdate" v-else>更新</el-button>
      </el-form>
    </div>
  </el-drawer>
</template>


<script>

import {categoryCreate, categoryLoad, categoryUpdateBase} from "@/api/product/category";
import {mapGetters} from "vuex";
import KdxImage from "@/components/image/image.vue";
import {accessoryList} from "@/api/product/accessory";
import {techList} from "@/api/product/tech";
import {packageMaterialList} from "@/api/product/package_material";
import {metaMaterialList} from "@/api/product/meta_material";
import Upload from "@/view/components/upload.vue";
import {printMaterialList} from "@/api/product/print_material";
import {factoryWarehouseGoodsList} from "@/api/factory_warehouse/goods";

export default {
  name: 'TemuDlgCategoryEdit',
  components: {Upload, KdxImage},
  props: {
    id: {
      type: Number,
    },
    is_copy: {
      type: Boolean,
    },
  },
  computed: {
    ...mapGetters("user", ["canUpdateProductCategoryPrice", "canSetProductOk"]),
    isCreate() {
      return !this.form.id
    }
  },
  watch: {},
  data() {
    return {
      form: this.emptyForm(),
      accessoryList: [],
      packageMaterialList: [],
      metaMaterialList: [],
      techList: [],
      printMaterialList: [],
      goodsList: [],
    }
  },
  mixins: [],
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.syncAccessoryList()
      this.syncPackageMaterialList()
      this.syncMetaMaterialList()
      this.syncTechList()
      this.syncPrintMaterialList()
      this.syncGoodsList()
      Object.assign(this.form, this.emptyForm())

      if (!this.id) {
        return
      }

      let resp = await categoryLoad({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      Object.assign(this.form, resp.data)

      if (this.is_copy || !this.id) {
        this.form.id = undefined
      }
      for (const v of (resp.data.techs || [])) {
        this.form.tech_ids.push(v.tech_id)
      }
      for (const v of (resp.data.package_materials || [])) {
        this.form.package_material_ids.push(v.package_material_id)
      }
      for (const v of (resp.data.meta_materials || [])) {
        this.form.meta_material_list.push({id: v.meta_material_id, count: v.count})
      }
      for (const v of (resp.data.accessories || [])) {
        this.form.accessory_list.push({id: v.accessory_id, count: v.count})
      }
      let goodsList = []
      for (const v of (resp.data.goods_list || [])) {
        goodsList.push({id: v.goods_id, count: Number(v.count), exclude_ext_codes: v.exclude_ext_codes, include_ext_codes: v.include_ext_codes, need_scan_confirm: v.need_scan_confirm })
      }
      this.form.goods_list = goodsList
    },
    async onCreate() {
      let resp = await categoryCreate({...this.form})
      if (resp.code) {
        return
      }

      this.$message("创建成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    handleSelectPrintMaterial(item) {
      this.form.print_material_id = item
    },
    searchPrintMaterial(query, cb) {
      if (!query) {
        cb(this.printMaterialList)
        return
      }

      cb(this.printMaterialList.filter((item) => {
        return item.indexOf(query) >= 0
      }))
    },
    async onUpdate() {
      let resp = await categoryUpdateBase({...this.form})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    emptyForm() {
      return {
        id: undefined,
        name: '',
        image: "",
        prefix: "",
        suffix: "",
        can_not_tool_print: false,
        print_material_id: "",
        scale: 10,
        is_customize: false,
        tech_ids: [],
        goods_list: [],
        meta_material_list: [],
        package_material_ids: [],
        accessory_list: [],
        special_desc: "",
        detail_desc: "",
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
      }
    },
    async syncAccessoryList() {
      let resp = await accessoryList()
      if (resp.code) {
        return
      }
      this.accessoryList = resp.data
    },
    async syncPackageMaterialList() {
      let resp = await packageMaterialList()
      if (resp.code) {
        return
      }
      this.packageMaterialList = resp.data
    },
    async syncMetaMaterialList() {
      let resp = await metaMaterialList()
      if (resp.code) {
        return
      }
      this.metaMaterialList = resp.data
    },
    async syncTechList() {
      let resp = await techList()
      if (resp.code) {
        return
      }
      this.techList = resp.data
    },
    async syncPrintMaterialList() {
      let resp = await printMaterialList()
      if (resp.code) {
        return
      }
      this.printMaterialList = resp.data.map((item) => { return item.id })
    },
    async syncGoodsList() {
      let resp = await factoryWarehouseGoodsList()
      if (resp.code) {
        return
      }
      this.goodsList = resp.data
    },
    deleteAccessory(item) {
      this.form.accessory_list = this.form.accessory_list.filter((v) => {return v !== item})
    },
    addAccessory() {
      this.form.accessory_list.push({id: undefined, count: undefined})
    },
    deleteMetaMaterial(item) {
      this.form.meta_material_list = this.form.meta_material_list.filter((v) => {return v !== item})
    },
    addMetaMaterial() {
      this.form.meta_material_list.push({id: undefined, count: undefined})
    },
    deleteGoods(item) {
      this.form.goods_list = this.form.goods_list.filter((v) => {return v !== item})
    },
    addGoods() {
      this.form.goods_list.push({id: undefined, count: undefined, include_ext_codes: [], exclude_ext_codes: [], need_scan_confirm: false})
    },
    uploadImage(newImage) {
      this.form.image = newImage
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