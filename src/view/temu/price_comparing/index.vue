<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index"
                           :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select placeholder="请选择状态" v-model="searchInfo.status" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="待确认邀约" :value="1"></el-option>
                <el-option label="竞价中" :value="2"></el-option>
                <el-option label="待平台确认结果" :value="3"></el-option>
                <el-option label="竞价成功" :value="4"></el-option>
                <el-option label="竞价失败" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="货号，模糊搜索" v-model="searchInfo.sku_code" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync(selectRows)">同步</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="2" v-if="selectRows.length > 0">
            <el-button size="mini" type="warning" style="width: 100%" @click="batchConfirm(selectRows)">批量同意
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable"
                         fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="Id" prop="order_id" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="产品id" prop="product_id" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center" sortable="custom">
          <div slot-scope="{row}">
            <el-tag type="primary" size="medium" effect="dark">{{ statusName(row) }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="类目" prop="product_name" align="center" sortable="custom">
          <div slot-scope="{row}">
            <span class="show_line">
              {{ row.product_name }}
            </span>
          </div>
        </el-table-column>
        <el-table-column label="标题" prop="product_cat_name" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="图片" prop="product_images" align="center" width="350px">
          <div slot-scope="{row}">
            <KdxImage style="display: inline-block" width="80px" height="80px" :src="img" v-for="(img, index) in row.product_images"
                      :key="index"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="同款数" prop="product_count" align="center">
        </el-table-column>
        <el-table-column label="当前供货价" prop="supplier_price" align="center">
          <div slot-scope="{row}">
            <el-tag type="primary" size="medium" effect="dark">{{ (row.supplier_price / 100).toFixed(2) }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="建议价" prop="recommended_price" align="center">
          <div slot-scope="{row}">
            <el-tag type="danger" size="medium" effect="dark" v-if="row.recommended_price">
              {{ (row.recommended_price / 100).toFixed(2) }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="warning" style="width: 100%" @click="batchConfirm([row])"
                       v-if="checkSelectable(row)">同意
            </el-button>
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync([row])">同步</el-button>
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
import KdxImage from "@/components/image/image";
import {accountList} from "@/api/temu/account";
import {
  productPriceComparingConfirm,
  productPriceComparingList,
  productPriceComparingSync
} from "@/api/temu/price_comparing";

export default {
  name: 'TemuDlgAdjust',
  components: {
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
  data() {
    return {
      listApi: productPriceComparingList,

      timeoutId: undefined,

      accountOptions: [],
      selectRows: [],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync(rows) {
      let ids = rows.map((item) => {
        return item.id
      })
      let resp = await productPriceComparingSync({ids: ids})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    checkSelectable(row) {
      return row.status === 2 && row.confirm_inviting_status === 0
    },
    async syncAccounts() {
      let resp = await accountList()
      if (resp.code === 0) {
        this.accountOptions = resp.data
      }
    },
    async batchConfirm(list) {
      this.$confirm('请确认是否同意(只同意竞价，不降价)?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = list.map((item) => {
          return item.id
        })
        let resp = await productPriceComparingConfirm({ids: ids})
        if (resp.code) {
          return
        }
        this.getTableData()
      })
    },
    statusName(row) {
      if (row.status === 2 && row.confirm_inviting_status === 0) {
        return "待确认邀约"
      } else if (row.status === 2 && row.confirm_inviting_status === 1) {
        return "竞价中"
      } else if (row.status === 3) {
        return "待平台确认结果"
      } else if (row.status === 4) {
        return "竞价成功"
      } else if (row.status === 5) {
        return "竞价失败"
      }
      return `未知状态: ${row.status}`
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.syncAccounts()
    if (this.$route.query && this.$route.query.spu_ids) {
      this.$set(this.searchInfo, "spu_ids", this.$route.query.spu_ids)
    }
    this.getTableData()
  },
}
</script>
<style scoped lang="scss">
.show_line {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box; //作为弹性伸缩盒子模型显示。
  -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
  -webkit-line-clamp: 5; //显示的行
}
</style>