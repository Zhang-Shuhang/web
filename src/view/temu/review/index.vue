<template>
  <div :class="[is_dlg ? 'height_100' : '']">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.scores" placeholder="评分" multiple filterable clearable collapse-tags
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in scoreOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Id" v-model="searchInfo.skc_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Id" v-model="searchInfo.sku_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.has_pictures" placeholder="是否有图片" filterable clearable :style="{width: '100%'}">
                <el-option label=""></el-option>
                <el-option label="有图片" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.has_videos" placeholder="是否有视频" filterable clearable :style="{width: '100%'}">
                <el-option label=""></el-option>
                <el-option label="有视频" :value="true"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onAnalyze">分析本页</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" height="100%">
        <el-table-column label="账号" prop="account.name" align="center" width="100px">
        </el-table-column>
        <el-table-column label="产品图片" align="center" width="80px">
          <div slot-scope="{row}">
            <KdxImage :src="row.item.item_image.image" width="60px" height="60px" v-if="row.item && row.item.item_image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="产品信息" align="center" width="120px">
          <div slot-scope="{row}">
            <div v-if="row.item && row.item.daily_history">
              <div>
                <el-tag size="mini" type="warning" effect="dark">{{levelName(row.item)}}</el-tag>
              </div>
              <div>
                <el-tag size="mini" type="primary">7系: {{row.item.daily_history.seven_day_coef.toFixed(2)}}</el-tag>
              </div>
              <div>
                <el-tag size="mini" type="primary">30系: {{row.item.daily_history.thirty_day_coef.toFixed(2)}}</el-tag>
              </div>
              <div style="font-size: 12px">
                Sku评分: {{ row.item.daily_history.review_count }}({{ row.item.daily_history.review_score.toFixed(2) }})
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="评分" prop="score" align="center" width="160px">
          <div slot-scope="{row}">
            <el-rate v-model="row.score" disabled show-score text-color="#ff9900"></el-rate>
          </div>
        </el-table-column>
        <el-table-column label="评价信息" prop="comment">
          <div slot-scope="{row}" style="margin-left: 10px">
            <div style="font-size: 12px">
              Skc: {{row.product_skc_id}}
            </div>
            <div style="font-size: 12px">
              Sku: {{row.product_sku_id}}
            </div>
            <div style="font-size: 12px" v-if="row.item">
              货号: {{row.item.sku_ext_code}}
            </div>
            <div style="font-size: 12px">
              {{row.comment ? row.comment : "暂无文字评论"}}
            </div>
            <div v-if="row.pictures">
              <KdxImage style="display: inline-block" width="60px" height="60px" :src="image" v-for="(image, index) in row.pictures" :key="index"></KdxImage>
            </div>
            <div v-if="row.videos">
              <el-link type="primary" :href="video" v-for="(video, index) in row.videos" :key="index" target="_blank">视频{{index+1}}</el-link>
            </div>
            <div style="font-size: 12px">
              评价时间: {{new Date(row.created_at).toLocaleString()}}
            </div>
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
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "../../../api/temu/account";
import {mapGetters} from "vuex";
import {reviewList} from "@/api/temu/review";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuReview',
  components: {
    KdxImage
  },
  mixins: [infoList],
  computed:{
    ...mapGetters("user", ["token"]),
  },
  props: {
    sku_id: {
      type: Number,
    },
    score: {
      type: Number,
    },
    is_dlg: {
      type: Boolean,
    }
  },
  data() {
    return {
      listApi: reviewList,

      accountOptions: [],

      scoreOptions: [
        {id: 1, name: "1星"},
        {id: 2, name: "2星"},
        {id: 3, name: "3星"},
        {id: 4, name: "4星"},
        {id: 5, name: "5星"},
      ],
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    levelName(row) {
      if (!row) {
        return "新品"
      }

      if (!row.daily_history) {
        return "新品"
      }

      switch (row.daily_history.level) {
        case -1:
          return "淘汰1类"
        case -2:
          return "淘汰2类"
        case -3:
          return "淘汰3类"
        case -10:
          return "已下架"
        case 1:
          return "1类品"
        case 2:
          return "2类品"
        case 3:
          return "3类品"
        case 4:
          return "小爆品"
        case 5:
          return "中爆品"
        case 6:
          return "大爆品"
        case 7:
          return "超级爆品"
      }
      return "新品"
    },
    onAnalyze() {
      let array = [`作为一名资深电商卖家，你需要进行评论分析。请根据以下要求回答以下问题：

尽可能使用精炼并提炼产品优缺点，以及统计对应优缺点的出现的次数，并根据优缺点次数降序排列

下面是客户的评价：`]
      for (const d of this.tableData) {
        if (d.comment && array.length <= 100) {
          array.push(d.comment)
        }
      }
      if (array.length <= 0) {
        this.$message("当前没有评价内容")
        return
      }
      this.copy(array.join("\n"))
      window.open("https://chatgpt.debus.xyz/", "_fastgpt")
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    if (this.sku_id) {
      this.$set(this.searchInfo, "sku_id", this.sku_id)
    }
    if (this.score) {
      this.$set(this.searchInfo, "scores", [this.score])
    }

    if (this.$route.query) {
      if (this.$route.query.return_ids) {
        this.$set(this.searchInfo, "return_ids", this.$route.query.return_ids)
      }
      if (this.$route.query.plan_id) {
        this.$set(this.searchInfo, "plan_id", this.$route.query.plan_id)
      }
    }

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  },
}
</script>
<style scoped lang="scss">
  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  ::v-deep .el-row {
    padding: 0px;
  }

  .height_100 {
    height: 100%;
  }
</style>