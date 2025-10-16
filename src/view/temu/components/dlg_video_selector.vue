<template>
  <el-drawer :visible.sync="$attrs.visible" title="选择视频" @opened="onOpened" size="70%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title" class="title">
      <div style="float: left">
        <span>选择视频</span>
      </div>

      <div style="float: right">
        <el-row :span="5" style="width: 1000px">
          <el-col :span="6">
            <el-select v-model="searchInfo.account" placeholder="请选择账号" size="mini" multiple collapse-tags filterable clearable style="width: 100%">
              <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="searchInfo.ratio" placeholder="请选择视频比例" size="mini" filterable clearable style="width: 100%">
              <el-option label="1:1" value="1:1"></el-option>
              <el-option label="16:9" value="16:9"></el-option>
              <el-option label="9:16" value="9:16"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input style="width: 100%" size="mini" placeholder="请输入名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit"></el-input>
          </el-col>
          <el-col :span="4">
            <el-button style="width: 100%;" size="mini" type="primary" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :span="4">
            <el-button style="width: 100%;" size="mini" type="primary" @click="onSync">同步</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <div>
      <el-row>
        <el-col :xs="12" :sm="6" :lg="6" v-for="(v, index) in tableData" :key="index" style="display: inline-block;">
          <div style="padding: 10px; border: 1px solid lightgray">
            <KdxImage :src="v.first_image_url" width="100%" height="100%"></KdxImage>
            <div style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align: center; margin: 5px 0 5px 0;">
              {{v.name}}
            </div>
            <div style="margin: 0 5px 5px 5px;">
              <el-button size="mini" type="primary" style="width: 100%" @click="select(v)">选择</el-button>
            </div>
            <div style="margin: 0 5px 5px 5px;">
              <el-button size="mini" type="primary" style="width: 100%" @click="watchVideo(v)">查看[{{v.ratio}}]({{(v.duration/1000).toFixed(2)}}秒)</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :style="{textAlign:'right'}"
        :total="total"
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, prev, next, jumper"
    ></el-pagination>
  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import infoList from "@/components/mixins/infoList";
import {videoList, videoSync} from "@/api/temu/video";
import {accountList} from "@/api/temu/account";

export default {
  name: 'TemuDlgVideoSelector',
  components: {KdxImage},
  props: {
    id: {
      type: String,
    },
  },
  mixins: [infoList],
  computed: {},
  watch: {},
  data() {
    return {
      listApi: videoList,
      accountOptions: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      if (this.accountOptions.length===0) {
        let resp = await accountList()
        if (resp.code === 0) {
          this.accountOptions = resp.data
        }
      }
      this.getTableData()
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await videoSync()
      if (resp.code) {
        return
      }

      this.$message("同步中，请等待1-2分钟")
      this.getTableData()
    },
    select(row) {
      this.$emit('select', row)
      this.handleBeforeClose()
    },
    watchVideo(row) {
      window.open(row.url, "_blank")
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.$set(this.searchInfo, "page_size", 12)
  }
}
</script>
<style scoped lang="scss">
</style>