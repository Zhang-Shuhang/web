<template>
  <el-drawer :visible.sync="$attrs.visible" title="创建产品" @opened="onOpened" size="50%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div>
      <el-form class="table-form" ref="elForm" :model="info" size="mini" label-width="130px" label-position="right">
        <el-form-item label="货号" prop="name">
          <el-input v-model="info.ext_code"></el-input>
        </el-form-item>
        <el-form-item label="是否公开" prop="only_self">
          <el-switch v-model="info.only_self" active-text="不公开" inactive-text="公开"></el-switch>
        </el-form-item>
        <el-form-item label="图片" prop="name">
          <div style="width: 200px; height: 250px; margin: 10px; display: inline-block" v-for="(image, index) in info.images">
            <div style="width: 200px; height: 200px">
              <KdxImage :src="image" width="200px" height="200px"></KdxImage>
            </div>
            <div>
              <el-input v-model="info.names[index]"></el-input>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width: 100%; height: 50px" @click="create">创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {saleQueryImages} from "@/api/temu/sale";
import {productCreate} from "@/api/product/product";

export default {
  name: 'DlgProductCreate',
  components: {KdxImage},
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      info: {
        images: [],
        names: [],
        ext_code: "",
        only_self: false,
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await saleQueryImages({id: this.id})
      if (resp.code) {
        return
      }

      Object.assign(this.info, resp.data)
    },
    async create() {
      if (!this.info.ext_code) {
        this.$message.error("请输入货号")
        return
      }

      if (this.info.images.length < 5) {
        this.$message.error("图片不足，最少要5张")
        return
      }

      let resp = await productCreate({name: this.info.ext_code, images: this.info.images, names: this.info.names, only_self: this.info.only_self})
      if (resp.code) {
        return
      }

      this.$message("创建成功")
      this.handleBeforeClose()
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