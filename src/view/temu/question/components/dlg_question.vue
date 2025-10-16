<template>
  <el-drawer :visible.sync="$attrs.visible" :title="item ? `问题(${item.id})` : `问题`" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="70px" label-position="left" v-if="item" style="margin: 20px">
      <el-form-item label="客户名">
        {{item.creator_name}}
      </el-form-item>
      <el-form-item label="内容">
        {{item.desc}}
      </el-form-item>
      <el-form-item label="回复">
        <el-input type="textarea" :rows="5" v-model="form.answer" placeholder="请在此处回复用户" clearable :max="250"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="mini" style="width: 100%" :disabled="!form.answer" @click="answer">回复</el-button>
      </el-form-item>
      <el-form-item label="通用回复" style="margin-top: 20px">
        <el-button type="primary" size="mini" style="width: 100%" @click="setContent(a.content)" v-for="(a, index) in answerList" :key="index">{{a.label}}</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>


<script>
import {questionReply} from "@/api/temu/question";

export default {
  name: 'TemuDlgQuestion',
  components: {},
  mixins: [],
  props: {
    item: {
      type: Object,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      form: {
        answer: "",
      },

      answerList: [
        {label: "感谢您的反馈，祝您使用愉快", content: "Thank you for your feedback on our product. We hope you have a pleasant experience using it."},
        {label: "包裹未收到的问题，请联系官方", content: `Hello,
About package not receive problem, please consult TEMU official customer service
Thank you`},
        {label: "产品完全未收到，请联系官方", content: `Hello,
About the item all not include problem, please consult TEMU official customer service
Thank you`},
      ],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.form.answer = ""
    },
    async answer() {
      let resp = await questionReply({"id": this.item.id, "answer": this.form.answer})
      if (resp.code) {
        return
      }

      this.$message("操作成功")

      this.$emit("update")
      this.$emit('close', false)
    },
    setContent(content) {
      this.form.answer = content
    }
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