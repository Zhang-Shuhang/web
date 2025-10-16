<template>
  <el-drawer :visible.sync="$attrs.visible" :title="id ? '编辑' : '创建'" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
      <el-form-item label="名字" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="image">
        <Upload @image="uploadImage"></Upload>
        <KdxImage :src="form.image" v-if="form.image"></KdxImage>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%" type="primary" @click="onCreate" v-if="!id">创建</el-button>
        <el-button size="medium" style="width: 100%" type="warning" @click="onUpdate" v-else>更新</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>

import KdxImage from "@/components/image/image.vue";
import {
  metaMaterialCreate,
  metaMaterialLoad, metaMaterialUpdate,
} from "@/api/product/meta_material";
import Upload from "@/view/components/upload.vue";

export default {
  name: 'TemuDlgMetaMaterialEdit',
  components: {Upload, KdxImage},
  props: {
    id: {
      type: Number,
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

      let resp = await metaMaterialLoad({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      Object.assign(this.form, resp.data)
    },
    async onCreate() {
      let resp = await metaMaterialCreate({...this.form})
      if (resp.code) {
        return
      }

      this.$message("创建成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    async onUpdate() {
      let resp = await metaMaterialUpdate({...this.form})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.$emit("update")
      this.handleBeforeClose()
    },
    uploadImage(newImage) {
      this.form.image = newImage
    },
    emptyForm() {
      return {
        name: '',
        image: "",
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