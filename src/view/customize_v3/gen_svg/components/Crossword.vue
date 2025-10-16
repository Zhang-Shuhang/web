<template>
  <div style="display: flex; flex-direction: column; gap: 50px;">
    <el-form :model="form" :rules="rules" size="mini" label-width="100px" label-position="right">
      <el-form-item label="未交叉底图" prop="image">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 80%; display: flex; flex-direction: column;">
            <el-input style="width: 100%" v-model="form.image" placeholder="未交叉底图链接" clearable></el-input>
            <el-image :src="form.image" fit="fill" style="width: 80px; height: 80px"></el-image>
          </div>
          <el-upload
            action="/temu/upload/upload"
            :headers="{ 'x-token': token }"
            :show-file-list="false"
            accept=".png,.jpg"
            :on-success="
              (res) => {
                handleImageSuccess('image', res);
              }
            "
            :on-error="handleError"
            style="width: 15%"
          >
            <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="交叉底图" prop="cross_image">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 80%; display: flex; flex-direction: column;">
            <el-input style="width: 100%" v-model="form.cross_image" placeholder="交叉底图链接" clearable></el-input>
            <el-image :src="form.cross_image" fit="fill" style="width: 80px; height: 80px"></el-image>
          </div>
          <el-upload
            action="/temu/upload/upload"
            :headers="{ 'x-token': token }"
            :show-file-list="false"
            accept=".png,.jpg"
            :on-success="
              (res) => {
                handleImageSuccess('cross_image', res);
              }
            "
            :on-error="handleError"
            style="width: 15%"
          >
            <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="图片宽度" prop="image_width">
        <el-input-number v-model="form.image_width" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="图片间隔" prop="image_gap">
        <el-input-number v-model="form.image_gap" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="文字颜色" prop="color">
        <el-color-picker style="width: 100%" color-format="hex" v-model="form.color"></el-color-picker>
      </el-form-item>
      <el-form-item label="右下角数字" prop="with_num">
        <el-switch v-model="form.with_num" active-text="生成" inactive-text="不生成"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 10%" type="primary" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
    <div style="width: 100%; display: flex; justify-content: space-between;">
      <div id="crossword-canvas-wrap"></div>
      <div style="width: 50%; display: flex; flex-direction: column; gap: 10px; justify-content: space-between;">
        <el-input v-model="textarea" type="textarea" :rows="10" placeholder="请输入内容"> </el-input>
        <div style="align-self: end;">
          <el-button type="primary" @click="generateSvg">生成</el-button>
          <el-button type="primary" @click="confirmUse">确定使用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import { customizeOrderCrossword } from "@/api/customize_v3/order";

const originFormData = {
  image: "https://image.szkdx.work/upload/2025/5/27/2/18/5e15514d-6707-47ce-8e64-760f6f3ed80b.png",
  cross_image: "https://image.szkdx.work/upload/2025/5/27/2/15/560e22cc-7c46-45ad-8df2-7fc5a0ef2531.png",
  image_width: 33.4638,
  image_gap: 3.1291,
  color: "#FFFFFF",
  with_num: false,
};

export default {
  name: "Crossword",
  props: {
    config: {
      type: Object,
    },
    token: {
      type: String,
    },
  },
  data() {
    return {
      form: JSON.parse(JSON.stringify(originFormData)),
      rules: {
        image: [
          {
            required: true,
            message: "请输入或上传未交叉图片链接",
            trigger: "blur",
          },
        ],
        cross_image: [
          {
            required: true,
            message: "请输入或上传交叉图片链接",
            trigger: "blur",
          },
        ],
        image_width: [
          {
            required: true,
            message: "请输入图片宽度",
            trigger: "blur",
          },
        ],
        image_gap: [
          {
            required: true,
            message: "请输入图片间隔",
            trigger: "blur",
          },
        ],
        color: [
          {
            required: true,
            message: "请输入文字颜色",
            trigger: "blur",
          },
        ],
      },
      textarea: "",
      cvs: null,
      svgUrl: "",
    };
  },
  methods: {
    async initCanvas() {
      fabric.Object.prototype.borderColor = "orange";
      fabric.Object.prototype.cornerStyle = "circle";
      fabric.Object.prototype.cornerColor = "white";
      fabric.Object.prototype.cornerSize = 10;
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStrokeColor = "gray";

      let canvasElement = document.createElement("canvas");

      let parentElement = document.getElementById("crossword-canvas-wrap");
      parentElement.appendChild(canvasElement);

      this.cvs = new fabric.Canvas(canvasElement, {
        width: 500,
        height: 500,
        backgroundColor: "lightblue",
      });
    },
    saveConfig() {
      this.$emit("save", "crossword", this.form);
    },
    async generateSvg() {
      let data = { ...this.form };

      data.texts = this.textarea.split("\n").filter(Boolean);
      if (data.texts.length <= 0) return this.$message.error("请输入要生成的文本");

      let resp = await customizeOrderCrossword(data);
      if (resp.code) return;

      this.placeSvgToCanvas(resp.data);
    },
    placeSvgToCanvas(url) {
      this.svgUrl = url;
      this.cvs.remove(...this.cvs.getObjects());
      fabric.loadSVGFromURL(this.svgUrl, (objects, options) => {
        let svg = fabric.util.groupSVGElements(objects, options);
        svg.set("originX", "center");
        svg.set("originY", "center");
        svg.set("hasControls", false);
        let cvsWidth = this.cvs.getWidth();
        let cvsHeight = this.cvs.getHeight();
        let svgWidth = svg.width * svg.scaleX;
        let svgHeight = svg.height * svg.scaleY;
        let scale = svgWidth >= svgHeight ? (0.95 * cvsWidth) / svgWidth : (0.95 * cvsHeight) / svgHeight;
        svg.scale(scale);
        this.cvs.add(svg);
        this.cvs.viewportCenterObject(svg);
      });
      this.$message.success("svg生成成功");
    },
    confirmUse() {
      if (!this.svgUrl) return this.$message.error("还没有生成");
      this.$emit("confirm", this.svgUrl);
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    handleImageSuccess(key, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return;
      }
      this.$message.success("上传成功!" + res.msg);
      this.form[key] = res.data;
    },
  },
  watch: {
    config: {
      handler(newValue) {
        Object.assign(this.form, newValue || JSON.parse(JSON.stringify(originFormData)));
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.initCanvas();
  },
};
</script>

<style scoped lang="scss"></style>
