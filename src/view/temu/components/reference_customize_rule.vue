<template>
  <el-popover placement="right" trigger="click" @show="handleGetReferenceTableData">
    <div>
      <el-input
        style="width: 100%; margin-bottom: 10px;"
        v-model="referenceSearchName"
        placeholder="查询要引用的配置名"
        size="mini"
        @input="handleGetReferenceTableData"
      />
      <div style="width: 100%; margin-bottom: 10px;">
        <el-checkbox v-model="replaceImage">同步替换底图</el-checkbox>
        <el-checkbox v-model="replaceOverlayImage">同步替换蒙版图</el-checkbox>
      </div>
      <el-table :data="referenceTableData" border size="mini" :header-cell-style="{ 'background-color': 'black', color: '#fff' }" :default-expand-all="false">
        <el-table-column label="ID" align="center" prop="id" sortable="custom" width="200"> </el-table-column>
        <el-table-column label="货号" align="center" prop="name" sortable="custom" width="300"> </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <div slot-scope="{ row }">
            <el-button type="success" size="mini" style="width: 150px" plain @click="handleUseReferenceRule(row)">引用此配置</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <template slot="reference">
      <el-button type="warning" size="mini">引用配置</el-button>
    </template>
  </el-popover>
</template>

<script>
import { customizeListByPage } from "@/api/temu/customize";
import { throttle } from "@/utils/throttle.js";

export default {
  name: "ReferenceCustomizeRule",

  data() {
    return {
      referenceTableData: [],
      referenceSearchName: "",

      replaceImage: true,
      replaceOverlayImage: true,
    };
  },
  methods: {
    handleGetReferenceTableData: throttle(async function() {
      const data = await customizeListByPage({ page: 1, page_size: 20, is_ok: 1, name: this.referenceSearchName });
      if (data.data.list) this.referenceTableData = data.data.list;
    }, 500),
    handleUseReferenceRule({ surfaces, image, overlay_image }) {
      this.referenceSearchName = "";
      let obj = { surfaces, image, overlay_image };
      if (!this.replaceImage) delete obj.image;
      if (!this.replaceOverlayImage) delete obj.overlay_image;
      this.$emit("reference", obj);
    },
  },
};
</script>
<style scoped lang="scss">
.main {
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;

  .top {
    width: 100%;
    height: 6%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .bottom {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-around;

    .container {
      width: 50%;
      height: 100%;

      .canvas-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }

    .collapse-wrap {
      width: 700px;
    }
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px !important;
}
</style>
