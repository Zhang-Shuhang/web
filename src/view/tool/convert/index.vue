<template>
  <div>
    <div style="margin-top: 50px">
      <el-row :gutter="5">
        <el-col :span="16" :offset="4">
          <el-col :span="8">
            <span style="font-size: 34px; height: 36px; text-align: center; display: flex; justify-content: center; align-items: center;color: rgb(128,128,128)">cm 转 Inch:</span>
          </el-col>
          <el-col :span="8">
            <el-input-number size="medium" style="width: 100%" v-model="cm" :precision="2" :step="1" placeholder="请输入长度，单位为厘米"></el-input-number>
          </el-col>
          <el-col :span="8">
            <span style="font-size: 34px; height: 36px; text-align: center; display: flex; justify-content: center; align-items: center;" @click="copy(cm_to_inch_result)">{{cm_to_inch_result}}</span>
          </el-col>
        </el-col>
      </el-row>
      <el-row :gutter="5" style="margin-top: 10px">
        <el-col :span="16" :offset="4">
          <el-col :span="8">
            <span style="font-size: 34px; height: 36px; text-align: center; display: flex; justify-content: center; align-items: center;color: rgb(128,128,128)">Inch 转 cm:</span>
          </el-col>
          <el-col :span="8">
            <el-input-number size="medium" style="width: 100%" v-model="inch" :precision="2" :step="1" placeholder="请输入长度，单位为英尺"></el-input-number>
          </el-col>
          <el-col :span="8">
            <span style="font-size: 34px; height: 36px; text-align: center; display: flex; justify-content: center; align-items: center;" @click="copy(inch_to_cm_result)">{{inch_to_cm_result}}</span>
          </el-col>
        </el-col>
      </el-row>
    </div>
  </div>

</template>

<script>

export default {
  components: {
  },
  mixins: [],
  watch: {
    cm() {
      if (!this.cm) {
        this.cm_to_inch_result = ""
        return
      }

      let inch = this.cm / 2.54
      this.cm_to_inch_result = `${this.keep(this.cm)}cm / ${this.keep(inch)}inch`
      this.copy(this.cm_to_inch_result)
    },
    inch() {
      if (!this.inch) {
        this.inch_to_cm_result = ""
        return
      }

      let cm = this.inch * 2.54
      this.inch_to_cm_result = `${this.keep(cm)}cm / ${this.keep(this.inch)}inch`
      this.copy(this.inch_to_cm_result)
    },
  },
  data() {
    return {
      cm: undefined,
      cm_to_inch_result: "",
      inch: undefined,
      inch_to_cm_result: "",
    }
  },
  methods: {
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    keep(num) {
      return Math.round(num * 100) / 100
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>