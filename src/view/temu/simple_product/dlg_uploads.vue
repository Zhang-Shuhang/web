<template>
  <el-drawer :visible.sync="$attrs.visible" title="上架列表" @opened="onOpened" size="85%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="产品id" v-model="searchInfo.simple_product_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="产品名" v-model="searchInfo.simple_product_name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.template_ids" placeholder="模板列表" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in template_list" :key="index" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.executed" placeholder="是否执行" clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="未执行" :value="2"></el-option>
                <el-option label="已执行" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_success" placeholder="是否成功" clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="未成功" :value="2"></el-option>
                <el-option label="成功" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="完成结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_self" placeholder="是否本人操作" clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="本人" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows.length > 0">
            <el-form-item label-width="0">
              <el-button type="warning" size="mini" :style="{width: '100%'}" @click="onRetry(selectRows)">重试</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows.length > 0">
            <el-form-item label-width="0">
              <el-button type="danger" size="mini" :style="{width: '100%'}" @click="selectCategory(selectRows)">变更账号类目</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" height="100%" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
          <template slot-scope="{row}">
            <div v-if="row.account" @click="clickAccountName(row.account.id)">
              {{row.account.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="模板名" prop="template.name" align="center">
          <template slot-scope="{row}">
            <div v-if="row.template" @click="clickTemplateName(row.template.id)">
              {{row.template.name}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品名" prop="sku_name" align="center">
        </el-table-column>
        <el-table-column label="标题" prop="title" min-width="300px" align="center">
          <template slot-scope="{row}">
            <div v-if="edit.id!==row.id" style="font-size: 12px" @click="edit.id=row.id">
              {{row.title}}
            </div>
            <div v-else>
              <el-input type="textarea" :rows="5" v-model="row.title" placeholder="cookie" clearable></el-input>
              <el-row>
                <el-col :span="12">
                  <el-button size="mini" type="primary" style="width: 100%" @click="edit.id=undefined">取消</el-button>
                </el-col>
                <el-col :span="12">
                  <el-button size="mini" type="warning" style="width: 100%" @click="updateUpload(row)">提交</el-button>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="图片列表" prop="images" align="center" min-width="300px">
          <template slot-scope="{row}">
            <KdxImage style="display: inline-block" :src="img" v-for="(img, index) in row.images" :key="index"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column label="主图视频" prop="carouse_video" align="center" min-width="150px">
          <template slot-scope="{row}">
            <div v-if="row.carouse_video">
              <div>
                <video width="100%" controls :src="row.carouse_video.url"></video>
              </div>
              <div style="margin: 5px">
                <el-row :gutter="5" style="width: 100%">
                  <el-col :span="12">
                    <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector(row, 'carouse_video')">选择</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="mini" type="warning" style="width: 100%" @click="cancelVideo(row, 'carouse_video')">删除</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else>
              <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector(row, 'carouse_video')">选择</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="详情视频" prop="detail_video" align="center" min-width="150px">
          <template slot-scope="{row}">
            <div v-if="row.detail_video">
              <div>
                <video width="100%" controls :src="row.detail_video.url"></video>
              </div>
              <div style="margin: 5px">
                <el-row :gutter="5" style="width: 100%">
                  <el-col :span="12">
                    <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector(row, 'detail_video')">选择</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="mini" type="warning" style="width: 100%" @click="cancelVideo(row, 'detail_video')">删除</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-else>
              <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector(row, 'detail_video')">选择</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否执行" prop="executed" align="center" min-width="100px">
          <template slot-scope="{row}">
            <el-tag size="mini" type="danger" effect="dark" v-if="row.is_zf">已作废</el-tag>
            <el-tag size="mini" v-else>{{row.executed ? "已执行" : "未执行"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作结果" prop="success" align="center">
          <template slot-scope="{row}">
            <div v-if="row.success">
              成功
            </div>
            <div v-else-if="row.fail_reason">
              {{row.fail_reason}}
            </div>
            <div v-else>
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="{row}">
            <el-button style="width: 100%" size="mini" type="danger" @click="onRetry([row])" v-if="!row.is_zf && row.executed && !row.success">重试</el-button>
            <el-button style="width: 100%" size="mini" type="danger" @click="onZf(row)" v-if="!row.is_zf && !row.success">作废</el-button>
            <el-button style="width: 100%" type="danger" size="mini" @click="selectCategory([row])" v-if="!row.is_zf && !row.success">变更账号类目</el-button>
          </template>
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

    <TemuDlgVideoSelector :visible="dlgSelectVideo.visible" @close="dlgSelectVideo.visible=false" @select="selectVideo"></TemuDlgVideoSelector>
    <TemuDlgProductCategoryProperties :default_account_id="dlgCategoryProperties.account_id" :can_change_account="false" :confirm="dlgCategoryProperties.confirm" :visible="dlgCategoryProperties.visible" @close="dlgCategoryProperties.visible=false"></TemuDlgProductCategoryProperties>
  </el-drawer>
</template>

<script>
import {
  simpleProductTemplateListSimple,
  simpleProductUpdateUpload, simpleProductUploadChangeCategory,
  simpleProductUploadList,
  simpleProductUploadRetry,
  simpleProductZf
} from "@/api/temu/simple_product";
import infoList from "@/components/mixins/infoList";
import KdxImage from "@/components/image/image.vue";
import TemuDlgVideoSelector from "@/view/temu/components/dlg_video_selector.vue";
import TemuDlgProductCategoryProperties from "@/view/temu/components/product_category_properties.vue";

export default {
  name: 'TemuDlgSimpleProductUploads',
  components: {TemuDlgProductCategoryProperties, TemuDlgVideoSelector, KdxImage},
  mixins: [infoList],
  props: {
    accountOptions: {
      type: Array,
    },
    product_ids: {
      type: Array,
    },
    obj: {
      type: Object,
    },
  },
  computed: {},
  watch: {
    searchInfo: {
      handler() {
        this.page = 1
        this.getTableData()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: simpleProductUploadList,

      selectRows: [],
      template_list: [],

      edit: {
        id: undefined,
      },

      dlgSelectVideo: {
        row: undefined,
        video_field: "",
        visible: false,
      },

      dlgCategoryProperties: {
        account_id: undefined,
        confirm: undefined,
        visible: false,
      }
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      if (this.product_ids.length) {
        this.$set(this.searchInfo, "simple_product_id", this.product_ids.join(" "))
      } else if (this.obj) {
        this.$set(this.searchInfo, "simple_product_id", this.obj.id)
      } else {
        this.$set(this.searchInfo, "simple_product_id", undefined)
      }
      this.$set(this.searchInfo, "is_success", 2)

      let resp = await simpleProductTemplateListSimple()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }
      this.template_list = resp.data

      this.getTableData()
    },
    onRetry(rows) {
      this.$confirm('请确认是否重试?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await simpleProductUploadRetry({ids: rows.filter((item)=>{return item.executed && !item.success}).map((item)=>{return item.id})})
            if (resp.code) {
              return
            }

            this.$message("重试成功")
            this.getTableData()
          })
    },
    onZf(row) {
      this.$confirm('请确认是否重试?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await simpleProductZf({id: row.id})
            if (resp.code) {
              return
            }

            this.$message("作废成功")
            this.getTableData()
          })
    },
    selectionChange(val) {
      this.selectRows = val
    },
    selectCategory(rows) {
      let list = rows.filter((item)=>{return !item.is_zf && !item.success})

      if (list.length <= 0) {
        this.$message.error("请选择未上传的")
        return
      }

      let accountIds = [...new Set(list.map((item)=>{return item.account_id}))]
      if (accountIds.length !== 1) {
        this.$message.error("一次只能修改一个账号的")
        return
      }

      this.dlgCategoryProperties.account_id = accountIds[0]
      this.dlgCategoryProperties.confirm = async (event) => {
        let resp = await simpleProductUploadChangeCategory({
          ids: list.map((item)=>{return item.id}),
          cat_ids: event.cat_ids,
          properties: event.real_properties,
        })
        if (resp.code) {
          return
        }

        this.$message("更新成功")
      }
      this.dlgCategoryProperties.visible = true
    },
    async updateUpload(row) {
      let resp = await simpleProductUpdateUpload({id: row.id, update: {title: row.title}})
      if (resp.code) {
        return
      }
      this.edit.id = undefined
      this.$message("更新成功")
      this.getTableData()
    },
    clickAccountName(accountId) {
      this.searchInfo.accounts = [accountId]
      this.getTableData()
    },
    clickTemplateName(templateId) {
      this.searchInfo.template_ids = [templateId]
      this.getTableData()
    },
    checkSelectable(row) {
      return !row.is_zf
    },
    openDlgVideoSelector(row, field) {
      this.dlgSelectVideo.row = row
      this.dlgSelectVideo.video_field = field
      this.dlgSelectVideo.visible = true
    },
    async selectVideo(video) {
      // 更新
      let data = {id: this.dlgSelectVideo.row.id, update: {}}
      data.update[this.dlgSelectVideo.video_field + "_id"] = video.id
      let resp = await simpleProductUpdateUpload(data)
      if (resp.code) {
        return
      }

      this.$message("设置成功")
      this.dlgSelectVideo.row[this.dlgSelectVideo.video_field] = video
    },
    async cancelVideo(row, field) {
      let data = {id: row.id, update: {}}
      data.update[field+"_id"] = undefined
      let resp = await simpleProductUpdateUpload(data)
      if (resp.code) {
        return
      }

      this.$message("取消成功")
      row[field] = undefined
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())
  }
}
</script>
<style scoped lang="scss">
  .img-wrap {
    position: relative;
  }
  .img-wrap .close {
    position: absolute;
    top: -5px;
    right: -5px;
    z-index: 100;
    color: white;
    font-size: 16px;
    background-color: red;
    border-radius: 10px;
    opacity: 0.8;
  }

  ::v-deep .el-input-group__append .el-button {
    border-color: #409EFF;
    background-color: #409EFF;
    color: white;
  }
</style>