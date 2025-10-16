<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :span="12">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" ref="search_content" v-model="searchInfo.search_content" clearable filterable @keyup.enter.native="onSubmit">
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable :style="{width: '100px'}">
                  <el-option v-for="(item, index) in searchCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onCreate">创建</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column label="Sku Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="货号" prop="sku_code" align="center">
        </el-table-column>
        <el-table-column label="图片" prop="image" align="center">
          <div slot-scope="{row}">
            <template v-if="row.image">
              <KdxImage :src="row.image"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center">
          <div slot-scope="{row}">
            <div>
              <el-button size="mini" style="width: 100%" type="primary" @click="edit(row)" plain>编辑</el-button>
            </div>
            <div>
              <el-button size="mini" style="width: 100%" type="primary" @click="openCodeUrl(row)" plain>打印条码</el-button>
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

    <FDlgUploadBarcode :is_create="toUpload.is_create" :id="toUpload.id" :pdf_url="toUpload.pdf_url" :visible="toUpload.visible" @close="toUpload.visible=false"></FDlgUploadBarcode>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {factoryItemList} from "@/api/sf-factory/item";
import KdxImage from "@/components/image/image";
import FDlgUploadBarcode from "@/view/sf-factory/components/dlg_upload_barcode.vue";

export default {
  components: {
    FDlgUploadBarcode,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: factoryItemList,

      searchCondOptions: [
        {id: 1, name: "Sku Id"},
      ],

      toUpload: {
        is_create: false,
        id: undefined,
        pdf_url: undefined,
        visible: false,
      },
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
      this.$refs['search_content'].select()
    },
    edit(item) {
      this.toUpload.is_create = false
      this.toUpload.id = item.id
      this.toUpload.pdf_url = item.pdf_url
      this.toUpload.visible = true
    },
    openCodeUrl(item) {
      window.open(item.pdf_url, "_blank")
    },
    onCreate() {
      this.toUpload.is_create = true
      this.toUpload.id = undefined
      this.toUpload.pdf_url = undefined
      this.toUpload.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "search_cond", 1)
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
</style>