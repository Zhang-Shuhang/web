<template>
  <el-drawer
    :visible.sync="$attrs.visible"
    :title="title"
    size="40%"
    :modal-append-to-body="true"
    :append-to-body="true"
    direction="rtl"
    :before-close="handleBeforeClose"
    @opened="onOpened"
  >
    <el-form
      class="table-form"
      ref="form"
      :model="form"
      :rules="{
        name: [{ required: true, message: '请输入组合产品名', trigger: 'blur' }],
      }"
      size="mini"
      label-width="100px"
      label-position="right"
      :validate-on-rule-change="false"
      style="width: 90%; height: 85%; margin: 0 auto;"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="ID" prop="id">
            <el-input v-model.number="form.id" placeholder="产品ID由系统自动生成" size="small" :disabled="true" style="width: 95%;"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="19">
          <el-form-item label="组合产品名" prop="name">
            <el-input v-model="form.name" placeholder="请输入组合产品名" size="small" style="width: 95%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button type="primary" size="small" style="width: 100%;" @click="handleGenerateCombineProductName">生成产品名</el-button>
        </el-col>
      </el-row>
      <div class="product_list">
        <el-row>
          <span class="product_list_title">包含产品列表</span>
        </el-row>
        <el-scrollbar style="height: 90%" ref="scrollbar">
          <el-row v-for="(item, index) in form.list" :key="index">
            <el-col :span="1">
              <el-form-item :label="`${index + 1}`" label-width="70px"></el-form-item>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-form-item label="产品名" :prop="`list[${index}].name`" :rules="[{ required: true, message: '请输入产品名', trigger: 'change' }]">
                <el-select v-model="item.name" placeholder="请输入产品名" allow-create filterable remote :remote-method="handleUpdateImageListOption">
                  <el-option v-for="el in imageList" :key="el.id" :label="el.name" :value="el.name">
                    <span>{{ el.name }}</span>
                    <img :src="el.url" style="height:32px; float: right; background-color: lightblue;" />
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-form-item
                label="产品数量"
                :prop="`list[${index}].count`"
                :rules="[{ type: 'number', min: 1, message: '产品数量必须大于0', trigger: 'blur' }]"
              >
                <el-input-number v-model.number="item.count" placeholder="请输入产品数量" style="width: 100%;" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="2" :offset="1">
              <el-button type="danger" size="mini" @click="handleDeleteProduct(index)">
                <i class="el-icon-delete" style="font-size: 14px;"></i>
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2" :offset="11">
              <el-button type="primary" size="mini" style="width: 100px;" @click="handleAddProduct">
                <div style="display: flex; justify-content: center; align-items: center;">
                  <i class="el-icon-plus" style="font-size: 14px;"></i>
                  <span>添加</span>
                </div>
              </el-button>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <el-form-item>
        <el-button size="medium" style="width: 18%; height: 40px; margin: 40px 0; position: relative; left: 80%; " type="success" @click="handleCreateOREdit">
          {{ title }}完成
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import { combineProductGenId, combineProductUpdate, getImageList } from "@/api/product/combine_product";

export default {
  name: "TemuDlgCombineProductEdit",
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {},
      imageList: [],
    };
  },
  methods: {
    handleBeforeClose() {
      this.$emit("close", false);
    },
    onOpened() {
      this.handleUpdateImageListOption();
      this.form = this.$props.data;
    },
    async handleUpdateImageListOption(query) {
      if (query === "") return;
      const data = await getImageList({ page: 1, page_size: 50, name: query });
      if (data.data.list) {
        this.imageList = data.data.list.map((item) => {
          let url;
          if (item.image) url = item.image;
          else if (item.diagrams[0].png_url) url = item.diagrams[0].png_url;
          else if (item.diagrams[0].svg_url) url = item.diagrams[0].svg_url;
          return {
            id: item.id,
            name: item.name,
            url,
          };
        });
      } else this.imageList = [];
    },
    async handleGenerateCombineProductName() {
      const data = await combineProductGenId();
      if (data.code === 0) {
        this.form.name = data.data;
        this.$message.success("生成成功，已自动填充!!!");
      } else this.$message.error(`生成失败, ${data.msg}，检查或重试!!!`);
    },
    handleAddProduct() {
      this.form.list.push({
        name: "",
        count: 0,
      });
    },
    handleDeleteProduct(index) {
      if (this.form.list.length === 1) return this.$message.error("至少保留一个产品!!!");
      this.form.list.splice(index, 1);
    },
    async handleCreateOREdit() {
      this.$refs[`form`].validate(async (valid) => {
        if (valid) {
          const data = await combineProductUpdate(this.form);
          if (data.code === 0) {
            this.$message.success("操作成功!!!");
            this.handleBeforeClose();
          } else this.$message.error(`操作失败, ${data.msg}!!!`);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.product_list {
  height: 90%;
  margin: 0 auto;
  padding-top: 20px;
  box-sizing: border-box;
  border: 2px #d4d7de solid;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;

  &_title {
    font-size: 16px;
    margin: 0 auto 20px;
  }

  &_index {
    font-size: 18px;
    position: relative;
    left: 0;
  }
}

::v-deep .el-form-item {
  margin-bottom: 24px !important;
}
</style>
