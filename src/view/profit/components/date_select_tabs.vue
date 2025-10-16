<template>
  <el-tabs v-model="activeName" type="border-card" :stretch="true" @tab-click="handleTabClick">
    <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabList" :key="index"></el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  name: "KdxDateSelectTabs",
  data() {
    return {
      activeName: "DAY-今",
      tabList: [],
    };
  },
  props: {},
  created() {
    // 日期选择格式分成五种类型，各种类型的start_time和end_time算法不同
    const dateLabels = {
      DAY: ["今", "昨", "前", "大前", "大大前", "大大大前"],
      PERIOD: ["7天", "30天"],
      MONTH: [],
      YEAR: [],
      ALL: ["全"],
    };

    const now = new Date();
    const nowYear = now.getFullYear();

    // 自动生成MONTH和YEAR类型，保证更新
    loop: for (let year = nowYear; year >= 2022; year--) {
      dateLabels.YEAR.push(`${year}`);
      for (let month = year === nowYear ? now.getMonth() + 1 : 12; month > 0; month--) {
        if (year === 2022 && month < 8) break loop;
        dateLabels.MONTH.push(`${year}${month < 10 ? "0" + month : month}`);
      }
    }

    this.tabList = Object.keys(dateLabels).reduce((last, key) => {
      last.push(
        ...dateLabels[key].map((item) => {
          return {
            label: item,
            name: `${key}-${item}`,
          };
        })
      );
      return last;
    }, []);

    this.handleTabClick();
  },
  methods: {
    handleTabClick() {
      const { start_time, end_time } = this.dateFormatConversion(this.activeName);
      this.$emit("change-tab", start_time, end_time);
    },
    dateFormatConversion(str) {
      const [key, value] = str.split("-");
      return this.calcStartTimeAndEndTime(key, value);
    },
    calcStartTimeAndEndTime(type, value) {
      let start_time = new Date(), end_time = new Date();

      if (type === "DAY") {
        switch (value) {
          case "今": break;
          case "昨": start_time.setDate(new Date().getDate() - 1); break;
          case "前": start_time.setDate(new Date().getDate() - 2); break;
          case "大前": start_time.setDate(new Date().getDate() - 3); break;
          case "大大前": start_time.setDate(new Date().getDate() - 4); break;
          case "大大大前": start_time.setDate(new Date().getDate() - 5); break;
        }
        end_time = start_time;
      } else if (type === "PERIOD") {
        switch (value) {
          case "7天": start_time.setDate(new Date().getDate() - 6); break;
          case "30天": start_time.setDate(new Date().getDate() - 29); break;
        }
      } else if (type === "MONTH") {
        start_time = new Date(`${value.slice(0, 4)}-${value.slice(4, 6)}`);
        end_time = new Date(`${value.slice(0, 4)}`, `${value.slice(4, 6)}`, 0);
      } else if (type === "YEAR") {
        start_time = new Date(`${value}`);
        end_time = new Date(`${value}`, 11, 31);
      } else if (type === "ALL") {
        start_time = new Date('2022-01-01');
        end_time = new Date();
      }

      return {
        start_time: start_time.toLocaleDateString(),
        end_time: end_time.toLocaleDateString(),
      }
    },
  },
};
</script>
