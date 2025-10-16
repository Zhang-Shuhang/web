<template>
  <div style="padding: 100px 220px; display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; justify-content: space-between;">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="handleOpenEditDialog">编辑其他内容</el-button>
      <el-button type="success" icon="el-icon-check" size="small" @click="handleUpdateLoginSetting">提交</el-button>
    </div>
    <el-tabs v-model="tabsActiveName" type="border-card" closable @tab-remove="handleRemoveSetting">
      <el-tab-pane v-for="item of loginDataList" :key="item.name" :label="item.name" :name="item.name">
        <el-form label-suffix=":" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="item.name" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="首页">
            <el-input v-model="item.home" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="匹配网址">
            <el-input v-model="item.url" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="是否稳定">
            <el-switch v-model="item.stable" :disabled="true"></el-switch>
          </el-form-item>
          <div style="padding: 0 20px;">
            <el-collapse v-model="collapseActiveName" accordion>
              <el-collapse-item v-for="(el, index) of item.account" :key="index" :title="`账号${index + 1}`" :name="index" style="margin-bottom: 10px;">
                <div style="padding: 10px;">
                  <div v-for="(e, i) of el" :key="i">
                    <el-card shadow="hover" style="margin-bottom: 10px;">
                      <div style="margin: 0 0 20px 20px; display: flex; align-items: center; gap: 20px;">
                        <div style="font-size: 16px;">配置项 {{ i + 1 }}</div>
                        <el-tag>{{ e.type }}</el-tag>
                        <el-link v-if="e.type === 'cookie'" :underline="false" type="success" disabled>{{ e.domain }}</el-link>
                      </div>
                      <el-form-item label="Key" label-width="60px">
                        <el-input v-model="e.key" :disabled="true"></el-input>
                      </el-form-item>
                      <el-form-item label="值" label-width="60px">
                        <el-input v-model="e.value"></el-input>
                      </el-form-item>
                    </el-card>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加" :visible.sync="dialogVisible" width="50%">
      <div style="margin-bottom: 20px;">
        显示所有内容，自行找JSON格式化工具编辑后粘贴回来即可<br />添加基本格式为：{ "name": "", "home": "", "url": "", "stable": true, "account": [ [ { type:
        "", domain?: "", key: "", value: "" } ] ] }，type只能为localStorage或cookie
      </div>
      <el-input type="textarea" :rows="24" placeholder="请输入内容" v-model="textarea"> </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddLoginSetting">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateLoginSetting, loadLoginSetting } from "@/api/tool/browser-data";

export default {
  name: "login-data",
  components: {},
  mixins: [],
  watch: {},
  data() {
    return {
      DATAKEY: "browser-data",
      tabsActiveName: "",
      collapseActiveName: 0,
      loginDataList: [],
      dialogVisible: false,
      textarea: "",
    };
  },
  methods: {
    async handleAddLoginSetting() {
      try {
        JSON.parse(this.textarea);
      } catch (error) {
        return this.$message({ type: "error", msg: "JSON格式错误, 无法添加" });
      }

      let newSetting = JSON.parse(this.textarea);

      if (!Array.isArray(newSetting)) {
        this.$message({ type: "error", msg: "JSON格式错误, 不是数组" });
      }

      this.loginDataList = newSetting;
      this.dialogVisible = false;
      this.textarea = "";
    },
    async handleRemoveSetting(name) {
      this.$confirm("此操作将删除该网站配置, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.loginDataList = this.loginDataList.filter((item) => item.name !== name);
      });
    },
    async handleUpdateLoginSetting() {
      const data = await updateLoginSetting({ id: this.DATAKEY, value: JSON.stringify(this.loginDataList) });
      if (data.code === 0) this.$message({ type: "success", message: "更新成功" });
      else this.$message({ type: "error", msg: "更新失败" });
      await this.handleLoadLoginSetting();
    },
    handleOpenEditDialog() {
      this.textarea = JSON.stringify(this.loginDataList);
      this.dialogVisible = true;
    },
    async handleLoadLoginSetting() {
      const data = await loadLoginSetting({ id: this.DATAKEY });
      if (data.code === 0 && data.data) {
        this.loginDataList = JSON.parse(data.data);
        this.tabsActiveName = this.loginDataList.length > 0 ? this.loginDataList[0].name : "";
      } else this.$message({ type: "error", msg: "获取数据失败" });
    },
  },
  mounted() {
    this.handleLoadLoginSetting();
  },
};
</script>

<style scoped>
::v-deep .el-collapse,
::v-deep .el-collapse-item__wrap {
  border: none;
}

::v-deep .el-collapse-item__header {
  zoom: 1.1;
  padding: 0 30px;
  background-color: #f5f7fa;
  border: 1px #dcdfe6 solid;
  border-radius: 10px;

  &:hover {
    background-color: #ebeef5;
  }
}

::v-deep .el-collapse-item__header.is-active {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

::v-deep .el-collapse-item__content {
  padding: 0;
  border: 1px #dcdfe6 solid;
  border-radius: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
