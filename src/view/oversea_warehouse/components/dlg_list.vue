<template>
  <el-drawer :visible.sync="$attrs.visible" title="发货记录" @opened="onOpened" size="90%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <TemuOverseaList :sku_code="sku_code" :is_receive="1" :is_dlg="true"></TemuOverseaList>
  </el-drawer>
</template>


<script>
  import TemuOverseaList from "@/view/oversea_warehouse/list.vue";

  export default {
    name: 'TemuDlgList',
    components: {TemuOverseaList},
    mixins: [],
    props: {
      sku_code: {
        type: String,
      },
    },
    computed: {},
    watch: {},
    data() {
      return {}
    },
    methods: {
      handleBeforeClose() {
        this.$emit('close', false)
      },
      async onOpened() {
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