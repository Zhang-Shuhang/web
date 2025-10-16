<template>
  <el-drawer title="生成SVG" :visible="visible" :append-to-body="true" size="50%" @opened="onOpened" @close="() => $emit('update:visible', false)">
    <div style="width: 100%; height: 100%; padding: 0 30px;">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="填字游戏" name="1">
          <Crossword :config="crosswordForm" :token="token" @save="handleSaveConfig" @confirm="handleConfirmUse" />
        </el-tab-pane>
        <el-tab-pane label="日历" name="2">
          <Calendar :config="calendarForm" :token="token" @save="handleSaveConfig" @confirm="handleConfirmUse" />
        </el-tab-pane>
        <el-tab-pane label="时钟" name="3">
          <Clock :config="clockForm" :token="token" @save="handleSaveConfig" @confirm="handleConfirmUse" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script>
import Crossword from "./components/Crossword.vue";
import Calendar from "./components/Calendar.vue";
import Clock from "./components/Clock.vue";

export default {
  name: "GenSvg",
  components: { Crossword, Calendar, Clock },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    svgConfig: {
      type: Object,
      default: null,
    },
    token: {
      type: String,
    },
  },
  data() {
    return {
      activeName: "1",

      crosswordForm: null,
      calendarForm: null,
      clockForm: null,
    };
  },
  methods: {
    onOpened() {
      if (!this.svgConfig.svg) return;
      const { svg } = this.svgConfig;
      this.crosswordForm = svg.crossword ? JSON.parse(JSON.stringify(svg.crossword)) : null;
      this.calendarForm = svg.calendar ? JSON.parse(JSON.stringify(svg.calendar)) : null;
      this.clockForm = svg.clock ? JSON.parse(JSON.stringify(svg.clock)) : null;
    },
    handleSaveConfig(configType, config) {
      if (configType === "crossword") {
        this.$emit("change", this.svgConfig.id, { crossword: config });
      } else if (configType === "calendar") {
        this.$emit("change", this.svgConfig.id, { calendar: config });
      } else if (configType === "clock") {
        this.$emit("change", this.svgConfig.id, { clock: config });
      }
    },
    handleConfirmUse(url) {
      this.$emit("use", this.svgConfig.id, url);
    },
  },
};
</script>

<style scoped lang="scss"></style>
