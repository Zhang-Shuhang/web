<template>
  <div>
    <template v-if="variation && variation.search_limit">
      <el-tag size="mini" type="danger" effect="dark" @click="openSearchLimitDlg(variation.id)"
              v-if="variation.search_limit.type === 1">
        高价限流(日常+活动)({{ new Date(variation.search_limit.created_at).toLocaleString() }})
      </el-tag>
      <el-tag size="mini" type="danger" effect="dark" @click="openSearchLimitDlg(variation.id)"
              v-else-if="variation.search_limit.type === 2">
        高价限流(日常价)({{ new Date(variation.search_limit.created_at).toLocaleString() }})
      </el-tag>
      <el-tag size="mini" type="danger" effect="dark" @click="openSearchLimitDlg(variation.id)"
              v-else-if="variation.search_limit.type === 3">
        即将高价限流({{ new Date(variation.search_limit.end_time).toLocaleString() }})
      </el-tag>
    </template>
    <template v-else-if="variation">
      <el-button size="mini" type="danger" style="width: 100%" @click="openSearchLimitDlg(variation.id)">
        设置自动高价限流
      </el-button>
    </template>
  </div>
</template>

<script>

export default {
  name: 'TemuSearchLimit',
  props: {
    variation: {
      type: Object,
    },
    openSearchLimitDlg: {
      type: Function
    }
  },
}
</script>
<style scoped lang="scss">
</style>