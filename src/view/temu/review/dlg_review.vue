<template>
  <el-drawer :visible.sync="$attrs.visible" title="评价管理" @opened="onOpened" size="90%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <TemuReview :sku_id="sku_id" :score="score" :is_dlg="true"></TemuReview>
  </el-drawer>
</template>


<script>
import TemuReview from "@/view/temu/review/index.vue";

export default {
  name: 'TemuDlgReview',
  components: {TemuReview},
  mixins: [],
  props: {
    sku_id: {
      type: Number,
    },
    score: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
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