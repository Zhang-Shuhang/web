<template>
  <el-drawer
    :visible.sync="$attrs.visible"
    @opened="onOpened"
    title="批量编辑图文定制"
    size="70%"
    :modal-append-to-body="true"
    :append-to-body="true"
    direction="rtl"
    :before-close="handleBeforeClose"
  >
    <div class="main">
      <div style="display: flex; justify-content: end; margin: 0 20px 10px 0;">
        <ReferenceCustomizeRule @reference="handleBatchReferenceRule" />
      </div>
      <el-table :data="tableDataList" border size="mini" :header-cell-style="{ 'background-color': 'black', color: '#fff' }" :default-expand-all="false">
        <el-table-column label="ID" align="center" prop="id" sortable="custom" width="180"> </el-table-column>
        <el-table-column label="货号" align="center" prop="name" sortable="custom"> </el-table-column>
        <el-table-column label="是否初始化" align="center" prop="is_ok" sortable="custom" width="180">
          <div slot-scope="{ row }">
            <el-tag size="mini" type="primary" v-if="row.is_ok">已初始化</el-tag>
            <el-tag size="mini" type="danger" effect="dark" v-else>未初始化</el-tag>
          </div>
        </el-table-column>
        <el-table-column
          label="最后更新时间"
          align="center"
          prop="updated_at"
          sortable="custom"
          width="260"
          :formatter="(row) => (row.updated_at === row.created_at ? '-' : new Date(row.updated_at).toLocaleString())"
        >
        </el-table-column>
        <el-table-column label="底图" align="center" prop="image" sortable="custom">
          <div slot-scope="{ row }" v-if="row.image" style="display: flex; justify-content: center; align-items: center; gap: 10px">
            <KdxImage :src="row.image"></KdxImage>
            <el-button type="primary" size="mini" @click="handleStartSelectImage(row, true)">更改</el-button>
          </div>
        </el-table-column>
        <el-table-column label="蒙版图" align="center" prop="overlay_image" sortable="custom">
          <div slot-scope="{ row }" v-if="row.overlay_image" style="display: flex; justify-content: center; align-items: center; gap: 10px">
            <KdxImage :src="row.overlay_image"></KdxImage>
            <el-button type="primary" size="mini" @click="handleStartSelectImage(row, false)">更改</el-button>
          </div>
        </el-table-column>
        <el-table-column label="是否有区域配置" align="center" prop="overlay_image" sortable="custom">
          <div slot-scope="{ row }">
            <el-tag v-if="row.surfaces.length" type="success">已有区域配置</el-tag>
            <el-tag v-else type="info">无区域配置</el-tag>
          </div>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: end; margin: 10px 20px 60px 0;">
        <el-button type="success" @click="handleSubmitBatchEdit">提交</el-button>
      </div>
    </div>

    <TemuDlgImageSelector :sku="currentChangeImageData.name" :visible="imageSelectDrawer" :update="handleChangeImage" @close="imageSelectDrawer = false" />
  </el-drawer>
</template>

<script>
import TemuDlgImageSelector from "@/view/temu/components/dlg_image_selector.vue";
import KdxImage from "@/components/image/image.vue";
import ReferenceCustomizeRule from "@/view/temu/components/reference_customize_rule.vue";
import { customizeEdit } from "@/api/temu/customize";

export default {
  name: "TemuDlgCustomizeBatchEdit",
  components: { TemuDlgImageSelector, KdxImage, ReferenceCustomizeRule },
  mixins: [],
  props: {
    edit: {
      type: Array,
    },
  },
  watch: {},
  data() {
    return {
      tableDataList: [],

      imageSelectDrawer: false,

      currentChangeImageData: {}, // 当前正在更改图片链接的对象

      isChangeImage: true, // 为true表示更改底图，false表示更改蒙版图
    };
  },
  methods: {
    handleBeforeClose() {
      this.$emit("close", false);
    },
    onOpened() {
      this.tableDataList = this.edit;
    },
    handleBatchReferenceRule(rule) {
      this.tableDataList = this.tableDataList.map((item) => ({ ...item, ...rule }));
    },
    handleStartSelectImage(row, type) {
      this.currentChangeImageData = row;
      this.isChangeImage = type;
      this.imageSelectDrawer = true;
    },
    handleChangeImage(url) {
      if (this.isChangeImage) this.currentChangeImageData.image = url;
      else this.currentChangeImageData.overlay_image = url;
    },
    async handleSubmitBatchEdit() {
      const list = await Promise.all(
        this.tableDataList.map((item) =>
          customizeEdit(Object.fromEntries(Object.entries(item).filter(([key]) => !["created_at", "is_ok", "name", "updated_at"].includes(key))))
        )
      );

      if (!Array.isArray(list) && list.msg) return this.$message.error(`存在项目操作失败，原因：${list.msg}`);
      if (!Array.isArray(list)) return this.$message.error(`存在项目操作失败，未知原因`);

      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.$emit("suc");
      this.handleBeforeClose();
    },
  },
  mounted() {},
  filters: {},
  async created() {},
};
</script>
<style scoped lang="scss"></style>
