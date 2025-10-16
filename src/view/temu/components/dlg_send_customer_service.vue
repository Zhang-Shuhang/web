<template>
  <el-drawer :visible.sync="$attrs.visible" :title="op ? op.toolName : ''" @opened="onOpened" size="90%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="singleTable" :data="tableData" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="名字" prop="name" align="center">
      </el-table-column>
      <el-table-column label="图" align="center">
        <div slot-scope="{row}">
          <KdxImage :src="row.img" width="90px" height="90px" v-if="row.img"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="Id" prop="dataId" align="center">
      </el-table-column>
      <el-table-column label="结果" align="center">
        <div slot-scope="{row}">
          {{row.result}}
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="small" type="warning" style="width: 100%" @click="submit([row])">提交</el-button>
          <el-button size="small" type="primary" style="width: 100%;margin-top: 5px" @click="remove(row)">移除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="submit(tableData)">逐个提交</el-button>
  </el-drawer>
</template>

<script>

import KdxImage from "@/components/image/image.vue";
import {customerServiceSend} from "@/api/temu/customer_service";

export default {
  name: 'TemuDlgSendCustomerService',
  components: {KdxImage},
  mixins: [],
  props: {
    list: {
      type: Array,
      required: true,
    },
    tool_id: {
      type: Number,
      required: true,
    }
  },
  watch: {
  },
  computed: {
    op() {
      return this.op_list.find((item) => {
        return item.toolId === this.tool_id
      })
    }
  },
  data() {
    return {
      tableData: [],
      op_list: [
        {
          "toolType": 1,
          "toolId": 2406230000016,
          "toolName": "商品发布到站点",
          "algo1OperationType": 2,
          "algo2OperationType": 2,
          "dataIdType": 1,
          "feedbackType": 1,
          "feedbackProblemType": 26,
          "feedbackRemark": "上架，加入站点"
        },
        {
          "toolType": 1,
          "toolId": 2406230000031,
          "toolName": "商品下架",
          "algo1OperationType": 3,
          "algo2OperationType": 4,
          "dataIdType": 1,
          "feedbackType": 1,
          "feedbackProblemType": 27,
          "feedbackRemark": "下架"
        },
        {
          "toolType": 1,
          "toolId": 2406280000010,
          "toolName": "备货单申请作废",
          "algo1OperationType": 11,
          "algo2OperationType": 5,
          "dataIdType": 3,
          "feedbackType": 1,
          "feedbackProblemType": 25,
          "feedbackRemark": "取消备货，备货单作废"
        },
        {
          "toolType": 1,
          "toolId": 2406280000031,
          "toolName": "价格刷新",
          "algo1OperationType": 10,
          "algo2OperationType": 12,
          "dataIdType": 2,
          "feedbackType": 2,
          "feedbackProblemType": 42,
          "feedbackRemark": "【客服反馈：价格刷新】"
        },
        {
          "toolType": 1,
          "toolId": 2407170000010,
          "toolName": "申请开JIT",
          "algo1OperationType": 12,
          "algo2OperationType": 1,
          "dataIdType": 1,
          "feedbackType": 6,
          "feedbackProblemType": null,
          "feedbackRemark": "开JIT"
        }
      ]
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      if (!this.op) {
        this.$message.error("没找到操作类型")
        this.handleBeforeClose()
        return
      }

      this.tableData = this.list.map(item => {
        return {...item, result: ""}
      })
    },
    submit(list) {
      this.$confirm('确认操作，操作非常危险, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
            for (const v of list) {
              // 操作
              let data = {}
              data.account_id = v.account_id
              data.name = v.name
              data.img = v.img
              data.data_id = v.dataId
              data.data_type = this.op.dataIdType
              data.content_type = 7 // 写死
              data.tool_type = this.op.toolType
              data.tool_id = this.op.toolId
              let resp = await customerServiceSend(data)
              v.result = resp.msg
            }

            this.$message("操作成功")
          })
    },
    remove(row) {
      this.tableData = this.tableData.filter((item) => {return item !== row})
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>