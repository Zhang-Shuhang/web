<template>
  <el-drawer :visible.sync="$attrs.visible" title="排版记录" @opened="onOpened" size="85%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        排版记录
      </div>
      <div style="display: block; float: right">
        <el-button type="primary" size="mini" @click="onSubmit">查询</el-button>
      </div>
    </div>
    <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="排版列表" prop="ids" align="center">
        <div slot-scope="{row}">
          <div>
            <el-tag size="mini" type="primary">{{row.ids.length}} 个箱唛</el-tag>
          </div>
          <div>
            <el-tag size="mini" type="primary">{{row.task_ids.length}} 个货</el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="任务部分" prop="task_part" align="center">
        <div slot-scope="{row}">
          <div v-if="row.task_part_success">
            <el-link size="mini" type="primary" :href="taskPartUrl(row)" :underline="false" target="_blank">任务包</el-link>
          </div>
          <el-tag size="mini" type="danger" effect="dark" v-else-if="row.fail_reason">
            失败
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column label="箱唛部分" prop="xm_part" align="center">
        <div slot-scope="{row}">
          <div v-if="row.task_part_success">
            <div v-if="row.xm_part_success">
              <el-link size="mini" type="primary" :href="xmPartUrl(row)" :underline="false" target="_blank">箱唛包</el-link>
            </div>
            <el-tag size="mini" type="danger" effect="dark" v-else-if="row.fail_reason">
              <el-button size="mini" type="warning" @click="genXm(row)">重新生成</el-button>
            </el-tag>
            <div v-else>
              <el-button size="mini" type="primary" @click="genXm(row)">生成</el-button>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="失败原因" prop="fail_reason" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.created_at).toLocaleString() }}
        </div>
      </el-table-column>
    </el-table>

    <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :style="{textAlign:'right'}"
        :page-sizes="[5, 10, 20, 30, 50, 100, 200, 300, 500, 1000]"
        :total="total"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, prev, next, jumper, sizes"
    ></el-pagination>
  </el-drawer>
</template>


<script>
import infoList from '@/components/mixins/infoList'
import {customizeDeliveryOrdersPbList} from "@/api/customize/delivery_order";
import {deliveryOrderCustomizePb} from "@/api/temu/delivery_order";

export default {
  name: 'CustomizeDlgPbRecords',
  components: {},
  mixins: [infoList],
  props: {
  },
  computed: {},
  watch: {
  },
  data() {
    return {
      listApi: customizeDeliveryOrdersPbList,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.onSubmit()
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    taskPartUrl(row) {
      if (row.task_part.startsWith("http")) {
        return row.task_part
      }
      return window.location.origin + "/customize/result/" + row.task_part
    },
    xmPartUrl(row) {
      return window.location.origin + "/temu/result/" + row.xm_part
    },
    async genXm(row) {
      let resp = await deliveryOrderCustomizePb({id: row.id})
      if (resp.code) {
        return
      }

      this.$message("操作成功，请稍后重新查询")
      this.getTableData()
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
::v-deep .el-drawer__header {
  margin-bottom: 0px !important;
}
</style>