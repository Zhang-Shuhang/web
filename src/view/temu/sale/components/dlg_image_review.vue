<template>
  <el-drawer :visible.sync="$attrs.visible" title="审核记录" @opened="onOpened" size="80%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-tabs v-model="status" :stretch="true">
      <el-tab-pane :label="item.label" :name="item.name" v-for="(item, index) in tabList" :key="index"></el-tab-pane>
    </el-tabs>

    <el-table class="table-body" ref="multipleTable" :data="reqData ? reqData.detailList : []" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="商品信息" min-width="130px" align="center" fixed>
        <div slot-scope="{row}">
          <KdxImage :src="row.mainUrl"></KdxImage>
          <el-tag size="mini" type="primary">Spu: {{row.productId}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="类型" align="center" fixed>
        <div class="item-container" slot-scope="{row}">
          <div class="item" v-for="(task, index) in row.taskList" :key="index">
            <el-tag size="mini" type="primary" effect="dark">{{type(task.taskType)}}</el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="图/文/视频详情" min-width="400px" align="center">
        <div class="item-container" slot-scope="{row}">
          <div class="item" v-for="(task, index) in row.taskList" :key="index">
            <div v-if="task.taskType === 0">
              <KdxImage width="60px" height="60px" :src="image" v-for="(image, index) in task.productImages" :key="index" style="display: inline-block"></KdxImage>
            </div>
            <div v-else-if="task.taskType === 1">
              <KdxImage width="60px" height="60px" :src="image" v-for="(image, index) in task.productImages" :key="index" style="display: inline-block"></KdxImage>
            </div>
            <div v-else-if="task.taskType === 2">
              图文修改
            </div>
            <div v-else-if="task.taskType === 3">
              <el-link size="mini" type="primary" :href="task.productVideo" target="_blank">查看视频</el-link>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="审核状态" min-width="100px" align="center">
        <div class="item-container" slot-scope="{row}">
          <div class="item" v-for="(task, index) in row.taskList" :key="index">
            <el-tag size="mini" :type="statusType(task.governStatus, task.taskStatus)" effect="dark">{{statusName(task.governStatus, task.taskStatus)}}</el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="图片原因" min-width="100px" align="center">
        <div class="item-container" slot-scope="{row}">
          <div class="item" v-for="(task, index) in row.taskList" :key="index">
            <el-tag size="mini" type="danger" effect="dark" v-for="(tag, index) in task.tagList" :key="index">
              {{tag.desc}}
            </el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="最新原因" min-width="100px" align="center">
        <div class="item-container" slot-scope="{row}">
          <div class="item" v-for="(task, index) in row.taskList" :key="index">
            <el-tag size="mini" type="danger">
              {{task.latestRejectReason ? task.latestRejectReason : '-'}}
            </el-tag>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="任务时间" min-width="100px" align="center">
        <div class="item-container" slot-scope="{row}">
          <div class="item" v-for="(task, index) in row.taskList" :key="index">
            <el-tag size="mini" type="primary">
              {{new Date(task.createdAt).toLocaleString()}}
            </el-tag>
          </div>
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>

import {itemImageReview} from "@/api/temu/sale_item";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgImageReview',
  components: {KdxImage},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
  },
  computed: {
  },
  watch: {
    status() {
      this.onOpened()
    }
  },
  data() {
    return {
      status: '2',
      tabList: [
        {label: '待上传', name: '1'},
        {label: '一审中', name: '2'},
        {label: '一审通过', name: '3'},
      ],

      reqData: undefined,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await itemImageReview({id: this.id, status: this.status})
      if (resp.code) {
        return
      }

      this.reqData = resp.data
    },
    type(tp) {
      switch (tp) {
        case 0:
          return "轮播图"
        case 1:
          return "变体图"
        case 2:
          return "详情"
        case 3:
          return "视频"
      }

      return "未知"
    },
    statusName(governStatus, taskStatus) {
      switch (taskStatus) {
        case 1:
          return "待一审"
        case 2:
          return "一审中"
        case 3:
          if (governStatus === 0) {
            return "一审通过"
          } else if (governStatus === 1) {
            return "二审通过"
          } else if (governStatus === 2) {
            return "待更新"
          } else if (governStatus === 3) {
            return "二审中"
          }
      }

      return "未知"
    },
    statusType(governStatus, taskStatus) {
      switch (taskStatus) {
        case 1:
          return "warning"
        case 2:
          return "danger"
        case 3:
          if (governStatus === 0) {
            return "success"
          } else if (governStatus === 1) {
            return "success"
          } else if (governStatus === 3) {
            return "danger"
          }
      }

      return "danger"
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
.item-container {

  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 80px;
    padding: 5px;
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    font-weight: 900;
    height: 44px;
    line-height: 44px;
    padding-bottom: 0;
    padding-top: 0;
  }
}
</style>