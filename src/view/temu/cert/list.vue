<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="请选择状态" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.cert_type" placeholder="请选择证书类型" multiple collapse-tags
                         filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in certOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids" v-model="searchInfo.product_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.sku_code" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync(selectRows || [])">{{ selectRows.length ? "同步选中" : "同步全部(预计3分钟)" }}</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="3" v-if="batchEditList.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="openDetailDlg(batchEditList)">批量编辑</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="sale_id" align="center">
        </el-table-column>
        <el-table-column label="货号" align="center">
          <div slot-scope="{row}" style="font-size: 12px">
            <div v-if="row.product">
              <div v-for="(item, index) in row.product.variations" :key="index">
                {{item.ext_code}}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="商品图片" align="center">
          <div slot-scope="{row}" style="font-size: 12px">
            <KdxImage :src="row.product.main_image_url" v-if="row.product"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="资质名称" prop="cert_name" align="center">
        </el-table-column>
        <el-table-column label="资质中文名" prop="show_name" align="center">
        </el-table-column>
        <el-table-column label="上传状态" prop="upload_status" align="center">
          <div slot-scope="{row}">
            {{uploadStatusName(row.upload_status)}}
          </div>
        </el-table-column>
        <el-table-column label="下架时间" align="center">
          <div slot-scope="{row}">
            {{new Date(row.off_sale_exc_date).toLocaleDateString()}}
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <div v-if="row.upload_status === 1 || row.upload_status === 3">
              <el-button type="primary" size="mini" style="width: 100%" @click="openDetailDlg([row])" plain>
                编辑
              </el-button>
            </div>
            <div v-else>
              <el-button type="primary" size="mini" style="width: 100%" @click="openDetailDlg([row])" plain>
                查看详情
              </el-button>
            </div>
            <div>
              <el-button type="primary" size="mini" style="width: 100%" @click="onSync([row])" plain>
                同步
              </el-button>
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

    <TemuDlgUploadCert :ids="uploadCertDlg.ids" :visible="uploadCertDlg.visible" @close="uploadCertDlg.visible=false"></TemuDlgUploadCert>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {certItemCertTypeList, certItemList, certItemSync} from "@/api/temu/sale_cert_item";
import TemuDlgUploadCert from "@/view/temu/cert/components/dlg_upload_cert.vue";

export default {
  components: {
    TemuDlgUploadCert,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    batchEditList() {
      if (this.selectRows.length <= 0) {
        return []
      }
      for (const row of this.selectRows) {
        if (row.cert_type !== this.selectRows[0].cert_type) {
          return []
        }
      }
      return this.selectRows
    },
  },
  data() {
    return {
      listApi: certItemList,

      selectRows: [],

      accountOptions: [],
      certOptions: [],
      statusOptions: [
        {id: 1, name: "待上传"},
        {id: 2, name: "上传中"},
        {id: 3, name: "上传失败"},
        {id: 4, name: "上传成功"},
        {id: 5, name: "待更新"},
      ],

      uploadCertDlg: {
        ids: [],
        visible: false,
      }
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    statusName(status) {
      let op = this.statusOptions.find((item) => {
        return item.id === status
      })
      if (!op) {
        return `未知状态: ${status}`
      }
      return op.name
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.sale_id
      })
      this.copy(ids.join(" "))
    },
    uploadStatusName(status) {
      let op = this.statusOptions.find((item) => {return item.id === status})
      if (!op) {
        return `未知: ${status}`
      }
      return op.name
    },
    openDetailDlg(rows) {
      this.uploadCertDlg.ids = rows.map((item) => {return item.id})
      this.uploadCertDlg.visible = true
    },
    async onSync(rows) {
      let resp = await certItemSync({ids: rows.map((item) => {return item.sale_id})})
      if (resp.code) {
        return
      }
      this.getTableData()
      if (rows.length > 0) {
        this.$message("同步成功!")
      } else {
        this.$message("同步预计要3分钟左右，请等候!")
      }
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 20
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    resp = await certItemCertTypeList()
    if (resp.code === 0) {
      this.certOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 130px;
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

::v-deep .el-row {
  padding: 0;
}

::v-deep .el-table .cell {
  padding: 0;
}

.el-row {
  padding-top: 0px;
  padding-bottom: 0px;
}

::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}

.button-new-tag {
  height: 24px;
  line-height: 22px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  height: 24px;
  line-height: 22px;
  width: 100%;
  vertical-align: bottom;
}

::v-deep .select .el-input--suffix .el-input__inner {
  padding-right: 0px;
}

::v-deep .select .el-input__suffix {
  display: none;
}

.input-right-zero {
  padding-right: 0px !important;
}

.one-line {
  display: inline-block;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
}

.two-line {
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; //行数
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>