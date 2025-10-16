<template>
  <el-drawer :visible.sync="$attrs.visible" :title="id ? '编辑' : '创建'" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
      <el-form-item label="打印材料" prop="id">
        <el-input v-model="form.id" :disabled="id"></el-input>
      </el-form-item>
      <el-form-item label="能否旋转" prop="can_rotate">
        <el-switch style="display: block" v-model="form.can_rotate" active-text="可旋转" inactive-text="不可旋转"></el-switch>
      </el-form-item>
      <el-form-item label="动作列表(顺序执行)" prop="ps_action_names">
        <el-select v-model="form.ps_action_names" placeholder="动作列表" multiple allow-create filterable clearable style="width: 100%">
          <el-option label="选择像素" value="选择像素" :key="0"></el-option>
          <el-option label="缩减3像素" value="缩减3像素" :key="1"></el-option>
          <el-option label="W1通道" value="W1通道" :key="2"></el-option>
          <el-option label="SP通道" value="SP通道" :key="3"></el-option>
          <el-option label="CMYK" value="CMYK" :key="4"></el-option>
          <el-option label="RGB" value="RGB" :key="5"></el-option>
          <el-option label="DPI改为360" value="DPI改为360" :key="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Ai动作列表(顺序执行)" prop="ai_action_names">
        <el-select v-model="form.ai_action_names" placeholder="动作列表" multiple allow-create filterable clearable style="width: 100%">
          <el-option label="选择像素" value="选择像素" :key="0"></el-option>
          <el-option label="缩减3像素" value="缩减3像素" :key="1"></el-option>
          <el-option label="W1通道" value="W1通道" :key="2"></el-option>
          <el-option label="SP通道" value="SP通道" :key="3"></el-option>
          <el-option label="CMYK" value="CMYK" :key="4"></el-option>
          <el-option label="RGB" value="RGB" :key="5"></el-option>
          <el-option label="DPI改为360" value="DPI改为360" :key="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="DPI" prop="id">
        <el-select v-model="form.dpi" placeholder="DPI" style="width: 100%">
          <el-option label="72" :value="72" :key="0"></el-option>
          <el-option label="144" :value="144" :key="1"></el-option>
          <el-option label="216" :value="216" :key="2"></el-option>
          <el-option label="288" :value="288" :key="3"></el-option>
          <el-option label="300" :value="300" :key="4"></el-option>
          <el-option label="360" :value="360" :key="5"></el-option>
          <el-option label="432" :value="432" :key="6"></el-option>
          <el-option label="504" :value="504" :key="7"></el-option>
          <el-option label="576" :value="576" :key="8"></el-option>
          <el-option label="648" :value="648" :key="9"></el-option>
          <el-option label="720" :value="720" :key="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="文件类型" prop="save_type">
        <el-select v-model="form.save_type" placeholder="文件类型" style="width: 100%">
          <el-option label="tif" value="tif" :key="0"></el-option>
          <el-option label="psd" value="psd" :key="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="默认工厂" prop="default_factory">
        <el-select v-model="form.default_factory" placeholder="默认工厂" style="width: 100%">
          <el-option label="一厂" value="一厂" :key="0"></el-option>
          <el-option label="二厂" value="二厂" :key="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="自动启动" prop="is_auto_start">
        <el-select v-model="form.is_auto_start" placeholder="是否自动启动" style="width: 100%">
          <el-option label="自动" :value="1" :key="0"></el-option>
          <el-option label="手工" :value="0" :key="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仅切割" prop="only_cut">
        <el-select v-model="form.only_cut" placeholder="是否仅切割" style="width: 100%">
          <el-option label="是" :value="1" :key="0"></el-option>
          <el-option label="不是" :value="0" :key="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%" type="primary" @click="onCreate" v-if="!id">创建</el-button>
        <el-button size="medium" style="width: 100%" type="warning" @click="onUpdate" v-else>更新</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>

import {printMaterialCreate, printMaterialLoad, printMaterialUpdate} from "@/api/product/print_material";

export default {
  name: 'TemuDlgPrintMaterialEdit',
  components: {},
  props: {
    id: {
      type: String,
    },
  },
  computed: {
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
      if (!this.id) {
        return
      }

      let resp = await printMaterialLoad({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      Object.assign(this.form, resp.data)
    },
    async onCreate() {
      let resp = await printMaterialCreate({...this.form})
      if (resp.code) {
        return
      }

      this.$message("创建成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    async onUpdate() {
      let resp = await printMaterialUpdate({...this.form})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    emptyForm() {
      return {
        id: "",
        can_rotate: true,
        ps_action_names: ["选择像素", "缩减3像素", "W1通道", "CMYK"],
        ai_action_names: [],
        dpi: 720,
        save_type: "tif",
        default_factory: "二厂",
        is_auto_start: true,
        only_cut: false,
      }
    }
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