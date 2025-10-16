<template>
  <el-drawer :visible.sync="$attrs.visible"  title="扫码查看产品" :size="isMobile ? '100%' : '75%'" @opened="onOpened"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px" label-position="top" style="margin-left: 10px">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-input size="mini" ref="itemId" v-model="form.id" placeholder="请扫码/手动输入任务编号" style="width: 100%" clearable @keyup.enter.native="query"></el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" style="width: 100%;" size="mini" @click="query">确定</el-button>
        </el-col>
      </el-row>
      <el-tabs v-model="tabName" type="border-card" :stretch="true">
        <el-tab-pane label="定制图" name="customize_image" v-if="form.customize_image"></el-tab-pane>
        <el-tab-pane label="产品图" name="images" v-if="form.images"></el-tab-pane>
        <el-tab-pane label="说明书" name="sms" v-if="form.sms"></el-tab-pane>
      </el-tabs>

      <iframe style="width: 100%; height: 80vh" :src="form.customize_image" v-if="form.customize_image && tabName === 'customize_image'"></iframe>
      <template v-if="form.images && tabName === 'images'">
        <KdxElImage style="display: inline-block" width="400px" height="400px" v-for="(img, index) in form.images" :src="img" :key="index"></KdxElImage>
      </template>
      <iframe style="width: 100%; height: 80vh" :src="form.sms" v-if="form.sms && tabName === 'sms'"></iframe>
    </el-form>
  </el-drawer>
</template>

<script>

import {factoryBatchGetItem, factoryBatchItem} from "@/api/sf-factory-v2/batch";
import KdxElImage from "@/components/image/el_image.vue";

export default {
  name: 'DlgItem',
  components: {KdxElImage},
  mixins: [],
  watch: {},
  data() {
    return {
      form: {
        id: undefined,
        customize_image: "",
        images: [],
        sms: "",
      },

      isMobile: false,
      tabName: "customize_image",

      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let ref = this.$refs['itemId']
      setTimeout(()=>{
        ref.select()
      }, 100)
    },
    async query() {
      let resp = await factoryBatchGetItem({id: this.form.id})
      if (resp.code) {
        return
      }

      this.form.customize_image = resp.data.customize_image
      this.form.images = resp.data.images
      this.form.sms = resp.data.sms

      if (this.form.customize_image) {
        this.tabName = "customize_image"
      } else if (this.form.images) {
        this.tabName = "images"
      } else if (this.form.sms) {
        this.tabName = "sms"
      }

      let ref = this.$refs['itemId']
      setTimeout(()=>{
        ref.select()
      }, 200)
    },
  },
  mounted() {
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

::v-deep .el-table .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}

::v-deep .el-tabs--border-card>.el-tabs__content {
  padding: 0px !important;
}
</style>