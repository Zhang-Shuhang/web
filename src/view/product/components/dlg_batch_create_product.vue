<template>
  <el-drawer
    :visible.sync="$attrs.visible"
    title="批量创建产品"
    @opened="onOpened"
    size="90%"
    stripe
    :modal-append-to-body="true"
    :append-to-body="true"
    :before-close="handleBeforeClose"
  >
    <el-table class="table-body" ref="singleTable" :data="list" border size="mini" :header-cell-style="{ 'background-color': 'black', color: '#fff' }">
      <el-table-column label="货号" prop="ext_code" align="center" width="500">
        <div slot-scope="{ row }">
          <el-input v-model="row.ext_code" size="mini"></el-input>
        </div>
      </el-table-column>
      <el-table-column label="是否公开" prop="only_self" align="center" width="150">
        <div slot-scope="{ row }">
          <el-switch v-model="row.only_self" active-text="不公开" inactive-text="公开"></el-switch>
        </div>
      </el-table-column>
      <el-table-column label="图片" prop="names" align="center">
        <div slot-scope="{ row }">
          <div v-for="(image, index) in row.images" :key="image" style="width: 120px; height: 150px; margin: 10px; display: inline-block; position: relative;">
            <div style="position: absolute; z-index: 9999; right: 0;">
              <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="handleDeleteImage(row, index)"></el-button>
            </div>
            <div style="width: 120px; height: 120px">
              <KdxImage :src="image" width="120px" height="120px"></KdxImage>
            </div>
            <div>
              <el-input v-model="row.names[index]" size="mini"></el-input>
            </div>
          </div>
        </div>
      </el-table-column>
    </el-table>
    <div style="margin: 20px 20px 0 0; display: flex; justify-content: end;">
      <el-button type="primary" @click="handleBatchCreate">批量创建</el-button>
    </div>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import { saleQueryImages } from "@/api/temu/sale";
import { productCreate } from "@/api/product/product";

export default {
  name: "TemuDlgBatchCustomize",
  components: { KdxImage },
  mixins: [],
  props: {
    ids: {
      type: Array,
    },
  },
  watch: {},
  computed: {},
  data() {
    return {
      list: [],
    };
  },
  methods: {
    handleBeforeClose() {
      this.$emit("close", false);
    },
    async onOpened() {
      let response = await Promise.all(this.ids.map((item) => saleQueryImages({ id: item })));

      if (!Array.isArray(response)) return this.$message.error("获取数据失败，请重试");

      let errData = response.find((item) => item.code !== 0);
      if (errData) return this.$message.error(`获取数据失败，${errData.msg}，检查或重试`);

      this.list = response.map((item) => ({ ...item.data, only_self: true }));
    },
    handleDeleteImage(row, index) {
      if (row.images.length <= 5) return this.$message.error("图片不可少于5张");
      row.images.splice(index, 1);
      row.names.splice(index, 1);
    },
    async handleBatchCreate() {
      let response = await Promise.all(this.list.map((item) => productCreate({ ...item, name: item.ext_code })));

      if (!Array.isArray(response)) return this.$message.error("存在产品创建失败，需要检查重试");

      let errData = response.find((item) => item.code !== 0);
      if (errData) return this.$message.error(`存在产品创建失败，需要检查重试，${errData.msg}`);

      this.$message.success("批量创建成功");
      this.handleBeforeClose();
      this.list = [];
    },
  },
  filters: {},
  async created() {},
};
</script>
<style scoped lang="scss"></style>
