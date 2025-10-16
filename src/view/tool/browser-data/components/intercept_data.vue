<template>
  <div style="padding: 100px 220px; display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; justify-content: flex-end;">
      <el-button type="success" icon="el-icon-check" size="small" @click="handleUpdateLoginSetting">提交</el-button>
    </div>
    <el-input type="textarea" v-model="interceptData" :rows="30" placeholder="请输入内容" :spellcheck="false" style="font-size: 16px;" />
  </div>
</template>

<script>
import { updateLoginSetting, loadLoginSetting } from "@/api/tool/browser-data";

export default {
  name: "intercept-data",
  components: {},
  mixins: [],
  watch: {},
  data() {
    return {
      DATAKEY: "intercept-data",
      interceptData: "",
    };
  },
  methods: {
    async handleUpdateLoginSetting() {
      const data = await updateLoginSetting({ id: this.DATAKEY, value: JSON.stringify(this.interceptData.split("\n").map((item) => item.trim())) });
      if (data.code === 0) this.$message({ type: "success", message: "更新成功" });
      else this.$message({ type: "error", msg: "更新失败" });
      await this.handleLoadLoginSetting();
    },
    async handleLoadLoginSetting() {
      const data = await loadLoginSetting({ id: this.DATAKEY });
      if (data.code === 0 && data.data) {
        this.interceptData = JSON.parse(data.data).join("\n");
      } else this.$message({ type: "error", msg: "获取数据失败" });
    },
  },
  mounted() {
    this.handleLoadLoginSetting();
  },
};
</script>

<style scoped></style>
