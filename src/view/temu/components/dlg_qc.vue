<template>
  <el-drawer :visible.sync="$attrs.visible" title="质检结果" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="qc_detail ? qc_detail.flaw_vo_list : []" border height="100%"
              size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="疵点" prop="flawNameDesc" align="center">
      </el-table-column>
      <el-table-column label="问题备注" prop="remark" align="center">
      </el-table-column>
      <el-table-column label="程度" prop="flawDegreeDesc" align="center">
      </el-table-column>
      <el-table-column label="质检结果" prop="flawDesc" align="center">
      </el-table-column>
      <el-table-column label="疵点图" align="center">
        <div slot-scope="{row}">
          <KdxImage v-for="(item, index) in row.attachments" style="display: inline-block" :key="index" :src="item"></KdxImage>
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {getPlanQcResult} from "@/api/temu/plan";

export default {
  name: 'TemuDlgQc',
  components: {KdxImage},
  props: {
    id: {
      type: String,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      qc_detail: {
        flaw_vo_list: [],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.qc_detail = {
        flaw_vo_list: [],
      }
      // 请求数据 TODO
      let resp = await getPlanQcResult({id: this.id})
      if (resp.code) {
        return
      }

      this.qc_detail = resp.data
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