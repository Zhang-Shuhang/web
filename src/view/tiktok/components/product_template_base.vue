<template>
  <div>
    <el-form-item label="模板名字">
      <el-input size="mini" style="width: 100%; margin-right: 5px; display: inline-block" placeholder="模板名字"
                v-model="value.name"></el-input>
    </el-form-item>
    <el-form-item label="匹配货号前缀">
      <el-select v-model="value.name_prefixes" placeholder="请选择默认匹配货号前缀" allow-create multiple
                 filterable clearable :style="{width: '100%'}">
      </el-select>
    </el-form-item>
  </div>
</template>
<script>

export default {
  name: 'TiktokProductTemplateBase',
  components: {},
  mixins: [],
  props: ['value'],
  data() {
    return {
    }
  },
  computed: {
  },
  watch: {},
  methods: {
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.value.guide_file = res.data.url
      this.$message(`上传成功，支持: ${res.data.languages.join(", ")} 语言`)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>