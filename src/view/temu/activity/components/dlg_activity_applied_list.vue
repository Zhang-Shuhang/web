<template>
  <el-drawer :visible.sync="$attrs.visible" title="活动报名记录" @opened="onOpened" size="75%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <TemuActivityAppliedList :spu_ids="spu_ids" :sku_ids="sku_ids" :is_dlg="true"></TemuActivityAppliedList>
  </el-drawer>
</template>

<script>

import infoList from "@/components/mixins/infoList";
import TemuActivityAppliedList from "@/view/temu/activity/applied_list.vue";

export default {
  name: 'TemuDlgActivityAppliedList',
  components: {TemuActivityAppliedList},
  mixins: [infoList],
  props: {
    spu_ids: {
      type: Array,
    },
    sku_ids: {
      type: Array,
    },
  },
  computed: {
  },
  data() {
    return {
      isMobile: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
    },
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-drawer__body {
  padding: 10px;
}

::v-deep .el-tabs__content {
  display: none;
}
::v-deep .el-drawer__header {
  margin-bottom: 12px;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 30px;
    padding: 0px;
  }

  .item-bottom {
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    height: 24px;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

</style>