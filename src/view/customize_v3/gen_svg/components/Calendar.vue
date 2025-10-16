<template>
  <div style="display: flex; flex-direction: column; gap: 50px;">
    <el-form :model="form" :rules="rules" size="mini" label-width="100px" label-position="right">
      <el-form-item label="单元格宽度" prop="side_width">
        <el-input-number v-model="form.side_width" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="右边距" prop="right_margin">
        <el-input-number v-model="form.right_margin" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="下边距" prop="bottom_margin">
        <el-input-number v-model="form.bottom_margin" :precision="4" :min="1" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="天数颜色" prop="day_color">
        <el-color-picker v-model="form.day_color" style="width: 100%" color-format="hex"></el-color-picker>
      </el-form-item>
      <el-form-item label="天数字体" prop="day_font_family">
        <el-select v-model="form.day_font_family" placeholder="请选择字体" filterable style="width: 100%">
          <el-option v-for="item in fontList" :key="item.id" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示星期">
        <el-switch v-model="form.with_week" active-text="显示" inactive-text="不显示"></el-switch>
      </el-form-item>
      <el-form-item label="周日在前">
        <el-switch v-model="form.is_sun_first" active-text="第一列为周日" inactive-text="第一列为周一" @change="handleChangeFirstColumn"></el-switch>
      </el-form-item>
      <el-form-item label="星期文字">
        <el-input v-model="form.week_texts" type="textarea" :rows="7" placeholder="请输入内容" resize="none"> </el-input>
        <div style="color: gray; font-size: 12px;">
          必须有七行，从上到下，按是否“周日在前”，依次排列，可以随意修改一行的内容，但不要手动更换行的顺序
        </div>
      </el-form-item>
      <el-form-item label="星期颜色" prop="week_color">
        <el-color-picker v-model="form.week_color" style="width: 100%" color-format="hex"></el-color-picker>
      </el-form-item>
      <el-form-item label="星期字体" prop="week_font_family">
        <el-select v-model="form.week_font_family" placeholder="请选择字体" filterable style="width: 100%">
          <el-option v-for="item in fontList" :key="item.id" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 10%" type="primary" @click="saveConfig">保存配置</el-button>
      </el-form-item>
    </el-form>
    <div style="width: 100%; display: flex; justify-content: space-between;">
      <div id="calendar-canvas-wrap"></div>
      <div style="width: 50%; display: flex; flex-direction: column; gap: 10px; justify-content: space-between;">
        <el-date-picker v-model="date" type="month" placeholder="选择月" style="width: 100%;"> </el-date-picker>
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
import { fontList } from "@/api/customize_v3/font";

const originFormData = {
  side_width: 33.4638,
  right_margin: 10,
  bottom_margin: 5,
  day_color: "#FFFFFF",
  day_font_family: "Times New Roman",
  with_week: true,
  is_sun_first: false,
  week_texts: "Mon\nTue\nWed\nThu\nFri\nSat\nSun",
  week_color: "#FFFFFF",
  week_font_family: "Times New Roman",
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
        side_width: [
          {
            required: true,
            message: "请输入单元格边长",
            trigger: "blur",
          },
        ],
        right_margin: [
          {
            required: true,
            message: "请输入右边距",
            trigger: "blur",
          },
        ],
        bottom_margin: [
          {
            required: true,
            message: "请输入下边距",
            trigger: "blur",
          },
        ],
        day_color: [
          {
            required: true,
            message: "请输入文字颜色",
            trigger: "blur",
          },
        ],
        day_font_family: [
          {
            required: true,
            message: "请选择字体",
            trigger: "blur",
          },
        ],
        week_texts: [
          {
            required: true,
            message: "请输入代表星期的文字",
            trigger: "blur",
          },
        ],
        week_color: [
          {
            required: true,
            message: "请输入文字颜色",
            trigger: "blur",
          },
        ],
        week_font_family: [
          {
            required: true,
            message: "请选择字体",
            trigger: "blur",
          },
        ],
      },
      fontList: [],
      date: "",
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

      let parentElement = document.getElementById("calendar-canvas-wrap");
      parentElement.appendChild(canvasElement);

      this.cvs = new fabric.Canvas(canvasElement, {
        width: 500,
        height: 500,
        backgroundColor: "lightblue",
      });
    },
    saveConfig() {
      this.$emit("save", "calendar", this.form);
    },
    async generateSvg() {
      if (!this.date) return this.$message.error("没有选择月份");
      this.cvs.remove(...this.cvs.getObjects());
      const {
        side_width: sideWidth,
        right_margin: rightMargin,
        bottom_margin: bottomMargin,
        day_color: dayColor,
        day_font_family: dayFontFamily,
        with_week: withWeek,
        is_sun_first: isSunFirst,
        week_texts: weekTexts,
        week_color: weekColor,
        week_font_family: weekFontFamily,
      } = this.form;

      let targetDate = new Date(this.date);
      const dayStrList = [],
        week = Array(7).fill(null);
      const firstDay = targetDate.getDay();
      const daysInMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).getDate();

      if (isSunFirst) {
        for (let day = 1; day <= daysInMonth; day++) {
          week[(firstDay + day - 1) % 7] = day;
          if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
            dayStrList.push([...week]);
            week.fill(null);
          }
        }
      } else {
        let offset = firstDay === 0 ? 6 : firstDay - 1;
        let currentDay = 1;
        while (currentDay <= daysInMonth) {
          week.fill(null);
          for (let i = offset; i < 7 && currentDay <= daysInMonth; i++) {
            week[i] = currentDay++;
          }
          dayStrList.push([...week]);
          offset = 0;
        }
      }

      if (weekTexts.split("\n").filter(Boolean).length !== 7) return this.$message.error("代表星期的文字个数不为七");
      const weekStrList = weekTexts.split("\n").filter(Boolean);

      const dayfontFamilyItem = this.fontList.find((item) => item.name === dayFontFamily);
      const weekfontFamilyItem = this.fontList.find((item) => item.name === weekFontFamily);
      if (!dayfontFamilyItem || !weekfontFamilyItem) return this.$message.error("字体加载失败");
      let dayFontFile = new FontFace(dayfontFamilyItem.name, `url('${dayfontFamilyItem.url}')`);
      let weekFontFile = new FontFace(weekfontFamilyItem.name, `url('${weekfontFamilyItem.url}')`);
      document.fonts.add(dayFontFile);
      document.fonts.add(weekFontFile);
      try {
        await dayFontFile.load();
        await weekFontFile.load();
      } catch (error) {
        return this.$message.error("字体加载失败: " + error);
      }

      if (withWeek) {
        let fontSize = 30;
        let num = 0;
        const maxWidth = sideWidth * 0.95;
        const minWidth = sideWidth * 0.9;
        const maxHeight = sideWidth * 0.75;
        const minHeight = sideWidth * 0.7;
        while (num < 50) {
          const text = new fabric.Text(weekStrList[Math.floor((weekStrList.length - 1) / 2)], { fontFamily: weekFontFamily, fontSize });
          if (text.width > maxWidth || text.height > maxHeight) {
            fontSize -= 2;
            if (fontSize <= 0) {
              return this.$message.error("设定的边长太小或给定的星期文字太长，最小的字体大小依然无法容纳");
            }
          } else if (text.width < minWidth && text.height < minHeight) {
            fontSize += 2;
          } else {
            break;
          }
          num++;
        }

        for (let i = 0; i < weekStrList.length; i++) {
          const left = (i + 1 / 2) * sideWidth + i * rightMargin;
          const rect = new fabric.Rect({ width: sideWidth, height: sideWidth, top: sideWidth / 2, left, opacity: 0, originX: "center", originY: "center" });
          this.cvs.add(rect);

          const text = new fabric.Text(weekStrList[i]);
          text.set({ left, top: sideWidth / 2, fontSize, fontFamily: weekFontFamily, fill: weekColor, originX: "center", originY: "center" });

          this.cvs.add(text);
        }
      }

      let fontSize = 30;
      let num = 0;
      const maxWidth = sideWidth * 0.65;
      const minWidth = sideWidth * 0.55;
      while (num < 50) {
        const text = new fabric.Text("30", { fontFamily: dayFontFamily, fontSize });
        if (text.width > maxWidth) {
          fontSize -= 2;
          if (fontSize <= 0) {
            return this.$message.error("设定的边长太小，最小的字体大小依然无法容纳");
          }
        } else if (text.width < minWidth) {
          fontSize += 2;
        } else {
          break;
        }
        num++;
      }

      for (let i = 0; i < dayStrList.length; i++) {
        for (let j = 0; j < dayStrList[i].length; j++) {
          const top = (i + 1 / 2) * sideWidth + (withWeek ? sideWidth : 0) + (i + 1) * bottomMargin;
          const left = (j + 1 / 2) * sideWidth + j * rightMargin;

          const rect = new fabric.Rect({ width: sideWidth, height: sideWidth, top, left, opacity: 0, originX: "center", originY: "center" });
          this.cvs.add(rect);

          if (!dayStrList[i][j]) continue;

          const text = new fabric.Text(String(dayStrList[i][j]));
          text.set({ left, top, fontSize, fontFamily: dayFontFamily, fill: dayColor, originX: "center", originY: "center" });

          this.cvs.add(text);
        }
      }

      const group = new fabric.Group(this.cvs.getObjects());
      group.scale(3);
      const dataURL = group.toDataURL();
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
    handleChangeFirstColumn(value) {
      const weekList = this.form.week_texts.split("\n").filter(Boolean);
      if (value) {
        weekList.unshift(weekList[weekList.length - 1]);
        weekList.splice(weekList.length - 1, 1);
      } else {
        weekList.push(weekList[0]);
        weekList.splice(0, 1);
      }
      this.form.week_texts = weekList.join("\n");
    },
    async getFontList() {
      let resp = await fontList();
      if (resp.code) {
        return;
      }
      this.fontList = resp.data || [];
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
    this.getFontList();
  },
};
</script>

<style scoped lang="scss"></style>
