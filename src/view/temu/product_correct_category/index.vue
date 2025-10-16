<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_ids" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id" v-if="!item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids，空格分隔" v-model="searchInfo.skc_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids，空格分隔" v-model="searchInfo.sku_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input size="mini" v-model="searchInfo.ext_code" clearable placeholder="货号，逗号分隔" @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.correct_status" placeholder="层级" multiple collapse-tags filterable clearable
                         style="width: 100%">
                <el-option v-for="(item, index) in correctOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onBatchChangeCategory(canCorrectRows)" v-if="canCorrectRows.length > 0">批量纠正类目</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="account.name">
        </el-table-column>
        <el-table-column label="Spu Id" align="center" prop="id">
        </el-table-column>
        <el-table-column label="Skc Id" align="center" prop="product.product_skc_id">
        </el-table-column>
        <el-table-column label="主图" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.product.main_image_url" v-if="row.product"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="correct_status">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">
              {{ correctStatusName(row.correct_status) }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="当前类目" align="center">
          <div slot-scope="{row}">
            {{ categoryName(row.current_categories) }}
          </div>
        </el-table-column>
        <el-table-column label="目标类目" min-width="700px">
          <div slot-scope="{row}">
            <div v-for="(list, index) in row.recommend_categories" :key="index">
              <el-tag type="primary" size="mini">
                {{ categoryName(list) }}
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button type="primary" size="mini" @click="onBatchChangeCategory([row])" v-if="row.can_correct">纠正类目</el-button>
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

    <TemuDlgCorrectCategory :array="correctDlg.array" :visible="correctDlg.visible" @close="correctDlg.visible=false"></TemuDlgCorrectCategory>
  </div>
</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "@/api/temu/account";
import {productCorrectCategoryList, productCorrectCategorySync} from "@/api/temu/product_correct_category";
import KdxImage from "@/components/image/image.vue";
import TemuDlgCorrectCategory from "@/view/temu/product_correct_category/components/dlg_correct_category.vue";

export default {
  components: {
    TemuDlgCorrectCategory,
    KdxImage
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(() => {
          this.page = 1
          this.getTableData()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    canCorrectRows () {
      return (this.selectRows || []).filter((row) => {
        return row.can_correct
      })
    }
  },
  data() {
    return {
      listApi: productCorrectCategoryList,
      isMobile: false,

      timeoutId: undefined,

      accountOptions: [],

      selectRows: [],

      correctDlg: {
        array: [],
        visible: false,
      },

      correctOptions: [
        {id: 0, name: "待纠正"},
        {id: 1, name: "纠正中"},
        {id: 2, name: "待确认"},
        {id: 3, name: "纠正成功"},
        {id: 4, name: "无需纠正"},
        {id: 5, name: "所选类目不准确，待纠正"},
        {id: 6, name: "所选类目不准确，纠正成功"},
      ],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await productCorrectCategorySync()
      if (resp.code) {
        return
      }
      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    categoryName(list) {
      return list.map(item => {return item.name}).join(" > ")
    },
    onBatchChangeCategory(rows) {
      this.correctDlg.array = rows
      this.correctDlg.visible = true
    },
    correctStatusName(status) {
      let op = this.correctOptions.find(item => {return item.id === status})
      if (!op) {
        return `未知: {status}`
      }
      return op.name
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

    this.$set(this.searchInfo, "correct_status", [0])

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
</style>