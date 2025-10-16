<template>
  <div>
    <div style="display: flex; justify-content: center; margin: 20px 0;">
      <el-radio-group v-model="radio">
        <el-radio-button label="登录数据"></el-radio-button>
        <el-radio-button label="拦截数据"></el-radio-button>
      </el-radio-group>
    </div>
    <LoginData v-show="radio === '登录数据'" />
    <InterceptData v-show="radio === '拦截数据'" />
  </div>
</template>

<script>
import LoginData from "./components/login_data.vue";
import InterceptData from "./components/intercept_data.vue";

export default {
  name: "browser-data",
  components: { LoginData, InterceptData },
  mixins: [],
  watch: {},
  data() {
    return {
      radio: "登录数据",
    };
  },
  methods: {},
  filters: {},
  mounted() {},
  async created() {},
};
</script>

<style scoped lang="scss"></style>
