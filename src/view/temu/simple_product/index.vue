<template>
  <div :class="[is_dlg ? 'height_100' : '']">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="分组id，空格或者逗号分隔" v-model="searchInfo.group_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="货号，空格或者逗号分隔" v-model="searchInfo.sku_codes" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <template v-if="canUpload">
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.not_success_account_ids" placeholder="请选择未上架过的账号" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                  <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.upload_times_type" placeholder="是否有上架过" clearable style="width: 100%">
                  <el-option value=""></el-option>
                  <el-option label="未上架" value="1"></el-option>
                  <el-option label="有上架过" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.is_hide" placeholder="是否隐藏" clearable style="width: 100%">
                  <el-option value=""></el-option>
                  <el-option label="已隐藏" :value="1"></el-option>
                  <el-option label="未隐藏" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.is_reviewed" placeholder="是否过审" clearable style="width: 100%">
                  <el-option value=""></el-option>
                  <el-option label="已过审" :value="1"></el-option>
                  <el-option label="未过审" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-select v-model="searchInfo.is_public" placeholder="是否公开" clearable style="width: 100%">
                  <el-option value=""></el-option>
                  <el-option label="公开" :value="1"></el-option>
                  <el-option label="非公开" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-input placeholder="最小次数" v-model.number="searchInfo.min_times" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="6" :sm="6" :lg="2">
              <el-form-item label-width="0">
                <el-input placeholder="最大次数" v-model.number="searchInfo.max_times" clearable filterable @keyup.enter.native="onSubmit">
                </el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="标签" v-model="searchInfo.tag" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-input placeholder="标题" v-model.number="searchInfo.title" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="canUpload">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openAllUploadDlg">上架列表</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="canUpload">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openAllUploadRecordDlg">上架记录</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="canUpload && canUploadRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openUploadDlg(canUploadRows)">上架</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="canUpload && canUploadRows.length > 1">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openCombineUploadDlg(canUploadRows)">组合上架</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="canUpload && canReviewRows.length">
            <el-form-item label-width="0">
              <el-button type="danger" size="mini" :style="{width: '100%'}" @click="reviewOk(canReviewRows)">批量过审</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openAddTagsDlg">批量标签</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openBatch">批量导出</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" height="100%" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center" width="100px" sortable="custom" sort-by="id">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">{{row.id}}</el-tag>
            <div>
              {{row.user_images.user_ids === 0 ? "公开" : `非公开(${row.user_images.user_ids})`}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center" width="100px" sortable>
          <div slot-scope="{row}">
            <span style="font-size: 12px">{{row.name}}</span>
            <el-button type="primary" style="width: 100%" size="mini" @click="onQueryPriceRange(row.name)">价格范围</el-button>
          </div>
        </el-table-column>
        <el-table-column label="标签" prop="tags" align="center" width="200px">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-for="(tag, index) in row.tags" :key="index" @close="removeTag(tag.id)" closable>
              {{tag.tag}}
            </el-tag>
            <div style="margin-top: 10px">
              <el-button size="mini" type="primary" icon="el-icon-plus" @click="openAddTagDlg(row)"></el-button>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="分组id" prop="group_id" align="center" width="100px">
        </el-table-column>
        <el-table-column label="上传次数" prop="times" align="center" width="130px">
        </el-table-column>
        <el-table-column label="产品图" align="center">
          <div slot-scope="{row}">
            <template v-if="row.user_images">
              <el-image
                  style="width: 100px; height: 100px"
                  :src="`${image}?imageView2/2/w/200/q/70`"
                  :preview-src-list="previewImageList(row.user_images, 'images', index)"
                  v-for="(image, index) in row.user_images.images" :key="index">
              </el-image>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="详情图" align="center">
          <div slot-scope="{row}">
            <template v-if="row.user_images">
              <el-image
                  style="width: 100px; height: 100px"
                  :src="`${image}?imageView2/2/w/200/q/70`"
                  :preview-src-list="previewImageList(row.user_images, 'detail_images', index)"
                  v-for="(image, index) in row.user_images.detail_images" :key="index">
              </el-image>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="{row}">
            <div v-if="canUpload && row.can_upload">
              <el-button style="width: 100%" size="mini" type="primary" @click="openUploadDlg([row])" :disabled="!row.user_images.reviewer">上架</el-button>
            </div>
            <div v-if="canUpload">
              <el-button style="width: 100%;" size="mini" type="primary" @click="openUploadRecordDlg(row)">上架记录</el-button>
            </div>
            <div v-if="canUpload && row.can_upload">
              <el-button style="width: 100%" size="mini" type="primary" @click="hide(row)" v-if="row.user_images.is_hide">显示</el-button>
              <el-button style="width: 100%" size="mini" type="primary" @click="hide(row)" v-else>隐藏</el-button>
            </div>
            <div v-if="canUpload && row.can_upload">
              <el-button style="width: 100%" size="mini" type="primary" @click="copyImages(row)">复制图片</el-button>
            </div>
            <div v-if="canUpload && !row.user_images.reviewer">
              <el-button style="width: 100%" size="mini" type="danger" @click="reviewOk([row])">产品过审</el-button>
            </div>
            <div v-if="canUpload && row.can_upload">
              <el-button style="width: 100%" type="primary" size="mini" @click="downloadImageBatch(row.user_images.images, row.name)">批量下载</el-button>
            </div>
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

    <TemuDlgSimpleProductUpload :list="uploadDlg.array" :visible="uploadDlg.visible" @close="uploadDlg.visible=false" @suc="getTableData"></TemuDlgSimpleProductUpload>
    <TemuDlgSimpleProductCombineUpload :list="combineUploadDlg.array" :visible="combineUploadDlg.visible" @close="combineUploadDlg.visible=false" @suc="getTableData"></TemuDlgSimpleProductCombineUpload>
    <TemuDlgSimpleProductUploads :account-options="accountOptions" :product_ids="allUploadDlg.product_ids" :obj="allUploadDlg.obj" :visible="allUploadDlg.visible" @close="allUploadDlg.visible=false" @suc="getTableData"></TemuDlgSimpleProductUploads>
    <TemuDlgSimpleProductUploadRecords :account-options="accountOptions" :product_ids="uploadRecordDlg.product_ids" :obj="uploadRecordDlg.obj" :visible="uploadRecordDlg.visible" @close="uploadRecordDlg.visible=false" @suc="getTableData"></TemuDlgSimpleProductUploadRecords>
    <TemuDlgSimpleProductAddTags :list="addTagsDlgList" :remove-select="removeSelectAddTagProduct" :visible="addTagsDlg.visible" @close="addTagsDlg.visible=false" @update="getTableData"></TemuDlgSimpleProductAddTags>
    <DlgBatchExport :list="batchDlg.list" :visible="batchDlg.visible" @close="batchDlg.visible=false" @update="getTableData"></DlgBatchExport>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {mapGetters} from "vuex";
import {
  simpleProductList,
} from "@/api/temu/simple_product";
import TemuDlgSimpleProductUpload from "@/view/temu/simple_product/dlg_upload.vue";
import TemuDlgSimpleProductUploadRecords from "@/view/temu/simple_product/dlg_upload_records.vue";
import TemuDlgSimpleProductAddTags from "@/view/temu/simple_product/dlg_add_tags.vue";
import TemuDlgSimpleProductUploads from "@/view/temu/simple_product/dlg_uploads.vue";
import {accountList} from "@/api/temu/account";
import {variationGetPriceRange} from "@/api/temu/variation";
import {productHide, productRemoveTag, productReviewOk} from "@/api/product/product";
import DlgBatchExport from "@/view/temu/simple_product/dlg_batch.vue";
import TemuDlgSimpleProductCombineUpload from "@/view/temu/simple_product/dlg_combine_upload.vue";
import { downloadImageBatch } from "@/utils/downloadImg"

export default {
  name: 'TemuReview',
  components: {
    TemuDlgSimpleProductCombineUpload,
    DlgBatchExport,
    TemuDlgSimpleProductUploads,
    TemuDlgSimpleProductAddTags,
    TemuDlgSimpleProductUploadRecords,
    TemuDlgSimpleProductUpload,
  },
  mixins: [infoList],
  computed:{
    ...mapGetters("user", ["token", "canUpload"]),
    addTagsDlgList() {
      return (this.tableData || []).filter(item => {
        return (this.addTagsDlg.product_ids || []).indexOf(item.id) >= 0
      })
    },
    canUploadRows() {
      return this.selectRows.filter((item) => {
        return item.user_images.reviewer
      })
    },
    canReviewRows() {
      return this.selectRows.filter((item) => {
        return !item.user_images.reviewer
      })
    },
  },
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
      listApi: simpleProductList,

      uploadDlg: {
        array: undefined,
        visible: false,
      },

      combineUploadDlg: {
        array: undefined,
        visible: false,
      },

      allUploadDlg: {
        product_ids: [],
        obj: undefined,
        visible: false,
      },

      uploadRecordDlg: {
        product_ids: [],
        obj: undefined,
        visible: false,
      },

      addTagsDlg: {
        product_ids: [],
        visible: false,
      },

      batchDlg: {
        list: [],
        visible: false,
      },

      selectRows: [],
      accountOptions: [],
    }
  },
  methods: {
    downloadImageBatch,
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let names = this.selectRows.map((item) => {
        return item.name
      })
      this.copy(names.join(" "))
    },
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
    openUploadDlg(rows) {
      this.uploadDlg.array = rows
      this.uploadDlg.visible = true
    },
    openCombineUploadDlg(rows) {
      this.combineUploadDlg.array = rows
      this.combineUploadDlg.visible = true
    },
    openUploadRecordDlg(row) {
      this.uploadRecordDlg.product_ids = []
      this.uploadRecordDlg.obj = row
      this.uploadRecordDlg.visible = true
    },
    copyImages(row) {
      this.copy(row.user_images.images.join("\n"))
    },
    hide(row) {
      this.$confirm(`请确认是否${row.user_images.is_hide ? '显示' : '隐藏'}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await productHide({ids: [row.user_images.id]})
        if (resp.code) {
          return
        }

        this.$message("隐藏成功")
        this.getTableData()
      })
    },
    reviewOk(rows) {
      this.$confirm('请确认是否过审，请确保文字，图片没有问题，过审人会留下过审记录', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await productReviewOk({ids: rows.filter((item) => {return item.user_images}).map((item) => {return item.user_images.id})})
        if (resp.code) {
          return
        }

        this.$message("过审成功")
        this.getTableData()
      })
    },
    openAllUploadDlg() {
      this.allUploadDlg.product_ids = this.selectRows.map((item)=>{return item.id})
      this.allUploadDlg.obj = undefined
      this.allUploadDlg.visible = true
    },
    openAllUploadRecordDlg() {
      this.uploadRecordDlg.product_ids = this.selectRows.map((item)=>{return item.id})
      this.uploadRecordDlg.obj = undefined
      this.uploadRecordDlg.visible = true
    },
    openAddTagsDlg() {
      this.addTagsDlg.product_ids = this.selectRows.map((item)=>{return item.id})
      this.addTagsDlg.visible = true
    },
    openBatch() {
      this.batchDlg.list = this.selectRows
      this.batchDlg.visible = true
    },
    openAddTagDlg(row) {
      this.addTagsDlg.product_ids = [row.id]
      this.addTagsDlg.visible = true
    },
    async removeTag(id) {
      let resp = await productRemoveTag({ids: [id]})
      if (resp.code) {
        return
      }

      this.$message("删除成功")
      this.getTableData()
    },
    removeSelectAddTagProduct(removeId) {
      this.addTagsDlg.product_ids = this.addTagsDlg.product_ids.filter((id) => {return id !== removeId})
    },
    async onQueryPriceRange(name) {
      let resp = await variationGetPriceRange({name: name})
      if (resp.code) {
        return
      }

      if (resp.data.length <= 0) {
        this.$message("暂无上架记录")
        return
      }

      let list = []
      resp.data.forEach((item) => {
        list.push(`价: ${(item.price/100).toFixed(2)}, 体: ${item.len}x${item.width}x${item.height}, 重: ${item.weight}g, 量: ${item.count}`)
      })

      this.$notify({
        title: '价格/重量/体积范围',
        message: list.join("<br>"),
        duration: 10000,
        dangerouslyUseHTMLString: true,
      });
    },
    previewImageList(row, field, index) {
      let result = []

      let index2 = this.tableData.indexOf(row)
      if (index2 >= 0) {
        for (let i = index; i < row[field].length; i++) {
          result.push(row[field][i])
        }
        for (let j = index2+1; j < this.tableData.length; j++) {
          let data = this.tableData[j]
          result = result.concat(data[field])
        }
        for (let j = 0; j < index2; j++) {
          let data = this.tableData[j]
          result = result.concat(data[field])
        }
        for (let i = 0; i < index; i++) {
          result.push(row[field][i])
        }
      } else {
        for (let i = 0; i < row[field].length; i++) {
          result.push(row[field][(i+index) % row[field].length])
        }
      }
      return result
    }
  },
  async created() {
    this.$set(this.searchInfo, "is_hide", 2)

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