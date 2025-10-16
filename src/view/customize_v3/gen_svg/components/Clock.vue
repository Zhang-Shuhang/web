<template>
  <div style="display: flex; flex-direction: column; gap: 50px;">
    <el-form :model="form" :rules="rules" size="mini" label-width="100px" label-position="right">
      <el-form-item label="表盘" prop="dial">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 80%; display: flex; flex-direction: column;">
            <el-input style="width: 100%" v-model="form.dial" placeholder="表盘链接" clearable></el-input>
            <el-image :src="form.dial" fit="fill" style="width: 80px; height: 80px"></el-image>
          </div>
          <el-upload
            action="/temu/upload/upload"
            :headers="{ 'x-token': token }"
            :show-file-list="false"
            accept=".png,.jpg"
            :on-success="
              (res) => {
                handleImageSuccess('dial', res);
              }
            "
            :on-error="handleError"
            style="width: 15%"
          >
            <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="时针" prop="hour_hand">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 80%; display: flex; flex-direction: column;">
            <el-input style="width: 100%" v-model="form.hour_hand" placeholder="时针链接" clearable></el-input>
            <el-image :src="form.hour_hand" fit="fill" style="width: 80px; height: 80px"></el-image>
          </div>
          <el-upload
            action="/temu/upload/upload"
            :headers="{ 'x-token': token }"
            :show-file-list="false"
            accept=".png,.jpg"
            :on-success="
              (res) => {
                handleImageSuccess('hour_hand', res);
              }
            "
            :on-error="handleError"
            style="width: 15%"
          >
            <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="分针" prop="minute_hand">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 80%; display: flex; flex-direction: column;">
            <el-input style="width: 100%" v-model="form.minute_hand" placeholder="分针链接" clearable></el-input>
            <el-image :src="form.minute_hand" fit="fill" style="width: 80px; height: 80px"></el-image>
          </div>
          <el-upload
            action="/temu/upload/upload"
            :headers="{ 'x-token': token }"
            :show-file-list="false"
            accept=".png,.jpg"
            :on-success="
              (res) => {
                handleImageSuccess('minute_hand', res);
              }
            "
            :on-error="handleError"
            style="width: 15%"
          >
            <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="秒针" prop="second_hand">
        <div style="display: flex; justify-content: space-between;">
          <div style="width: 80%; display: flex; flex-direction: column;">
            <el-input style="width: 100%" v-model="form.second_hand" placeholder="秒针链接" clearable></el-input>
            <el-image :src="form.second_hand" fit="fill" style="width: 80px; height: 80px"></el-image>
          </div>
          <el-upload
            action="/temu/upload/upload"
            :headers="{ 'x-token': token }"
            :show-file-list="false"
            accept=".png,.jpg"
            :on-success="
              (res) => {
                handleImageSuccess('second_hand', res);
              }
            "
            :on-error="handleError"
            style="width: 15%"
          >
            <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="圆点半径" prop="circle_radius">
        <el-input-number v-model="form.circle_radius" :precision="4" :min="0" style="width: 100%"></el-input-number>
        <div style="color: gray; font-size: 12px;">不需要圆点时，请把此值置0</div>
      </el-form-item>
      <el-form-item label="圆点颜色" prop="circle_color">
        <el-color-picker v-model="form.circle_color" style="width: 100%" color-format="hex"></el-color-picker>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 10%" type="primary" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
    <div style="width: 100%; display: flex; justify-content: space-between;">
      <div id="clock-canvas-wrap"></div>
      <div style="width: 50%; display: flex; flex-direction: column; gap: 10px; justify-content: space-between;">
        <el-input v-model="time" placeholder="请输入内容，两种格式，14:30或14:30:20，不带秒默认为0秒"></el-input>
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

const originFormData = {
  dial: "https://image.szkdx.work/upload/2025/9/26/0/48/a5d30617-9f77-4205-aaa5-42dd60d18966.png",
  hour_hand: "https://image.szkdx.work/upload/2025/9/26/0/48/1f71c004-849f-4db1-ac7c-4040f08024e5.png",
  minute_hand: "https://image.szkdx.work/upload/2025/9/26/0/48/c4b3cb61-6086-4899-b619-59490c82e2d5.png",
  second_hand: "https://image.szkdx.work/upload/2025/9/26/0/49/eead6e34-cafd-4e43-96a0-ea92486728e0.png",
  circle_radius: 20,
  circle_color: "#000000",
};

export default {
  name: "Calendar",
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
        dial: [
          {
            required: true,
            message: "请选择表盘图片",
            trigger: "blur",
          },
        ],
        hour_hand: [
          {
            required: true,
            message: "请选择时针图片",
            trigger: "blur",
          },
        ],
        minute_hand: [
          {
            required: true,
            message: "请选择秒针图片",
            trigger: "blur",
          },
        ],
        circle_radius: [
          {
            required: true,
            message: "请输入圆点半径",
            trigger: "blur",
          },
        ],
        circle_color: [
          {
            required: true,
            message: "请选择圆点颜色",
            trigger: "blur",
          },
        ],
      },
      time: "",
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

      let parentElement = document.getElementById("clock-canvas-wrap");
      parentElement.appendChild(canvasElement);

      this.cvs = new fabric.Canvas(canvasElement, {
        width: 500,
        height: 500,
        backgroundColor: "lightblue",
      });
    },
    saveConfig() {
      this.$emit("save", "clock", this.form);
    },
    async generateSvg() {
      if (!this.time) return this.$message.error("没有输入时间");

      const timeList = this.time
        .trim()
        .split(":")
        .filter(Boolean);

      if (timeList.length !== 2 && timeList.length !== 3) return this.$message.error("输入时间格式错误");

      for (let i = 0; i < timeList.length; i++) if (Number.isNaN(Number(timeList[i]))) return this.$message.error("输入时间格式错误，存在一位不为数字");

      this.cvs.remove(...this.cvs.getObjects());
      const {
        dial: dial,
        hour_hand: hourHand,
        minute_hand: minuteHand,
        second_hand: secondHand,
        circle_radius: circleRadius,
        circle_color: circleColor,
      } = this.form;

      let targetDate = new Date(`1970-01-01T${this.time}`);

      const hour = targetDate.getHours() % 12;
      const minute = targetDate.getMinutes();
      const second = targetDate.getSeconds();

      const hourAngle = (hour + minute / 60 + second / 3600) * 30; // 每小时30度
      const minuteAngle = (minute + second / 60) * 6; // 每分钟6度
      const secondAngle = second * 6; // 每秒6度

      const dialImg = await new Promise((resolve) => fabric.Image.fromURL(dial, resolve, { crossOrigin: "anonymous" }));
      dialImg.set({ top: 0, left: 0, originX: "center", originY: "center" });
      this.cvs.add(dialImg);

      const hourImg = await new Promise((resolve) => fabric.Image.fromURL(hourHand, resolve, { crossOrigin: "anonymous" }));
      hourImg.set({ top: 0, left: 0, originX: "center", originY: "center", angle: hourAngle });
      this.cvs.add(hourImg);
      const minuteImg = await new Promise((resolve) => fabric.Image.fromURL(minuteHand, resolve, { crossOrigin: "anonymous" }));
      minuteImg.set({ top: 0, left: 0, originX: "center", originY: "center", angle: minuteAngle });
      this.cvs.add(minuteImg);
      if (secondHand) {
        const secondImg = await new Promise((resolve) => fabric.Image.fromURL(secondHand, resolve, { crossOrigin: "anonymous" }));
        secondImg.set({ top: 0, left: 0, originX: "center", originY: "center", angle: secondAngle });
        this.cvs.add(secondImg);
      }

      const circle = new fabric.Circle({ top: 0, left: 0, originX: "center", originY: "center", radius: circleRadius, fill: circleColor });
      this.cvs.add(circle);

      const group = new fabric.Group(this.cvs.getObjects());

      let cilpTop = (group.height - dialImg.height) / 2;
      let cilpLeft = (group.width - dialImg.width) / 2;
      const dataURL = group.toDataURL({ top: cilpTop, left: cilpLeft, width: dialImg.width, height: dialImg.height });
      let img = await new Promise((resolve) => fabric.Image.fromURL(dataURL, resolve));

      let svg = img.toSVG();

      svg =
        `<?xml version="1.0" encoding="UTF-8" standalone="no" ?>
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${group.width}" height="${group.height}" xml:space="preserve">` +
        svg +
        `</svg>`;

      const blob = new Blob([svg], { type: "text/svg+xml" });
      const url = URL.createObjectURL(blob);

      this.placeSvgToCanvas(url);
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
        let scale = svgWidth >= svgHeight ? (0.9 * cvsWidth) / svgWidth : (0.9 * cvsHeight) / svgHeight;
        svg.scale(scale);
        this.cvs.add(svg);
        this.cvs.viewportCenterObject(svg);
      });
      this.$message.success("svg生成成功");
    },
    async confirmUse() {
      if (!this.svgUrl) return this.$message.error("还没有生成");

      const response = await fetch(this.svgUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append("file", blob, "image.svg");

      const res = await fetch("/temu/upload/upload", { method: "POST", headers: { "x-token": this.token }, body: formData });
      if (!res.ok) return this.$message.error("使用失败，上传图片失败");

      const data = await res.json();
      const url = data.data;

      this.cvs.remove(...this.cvs.getObjects());
      URL.revokeObjectURL(this.svgUrl);

      this.$emit("confirm", url);
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
