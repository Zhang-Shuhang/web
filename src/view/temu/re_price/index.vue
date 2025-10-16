<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.id" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="cat_name" placeholder="请选择类目" filterable clearable
                         :style="{width: '100%'}">
                <el-option v-for="(item, index) in categories" :key="index" :label="item"
                           :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit" :disabled="!searchInfo.id">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onRePrice" :disabled="!searchInfo.id">还价</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="filterTableData" border height="100%"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="50" align="center" fixed></el-table-column>
        <el-table-column align="center" label="Skc 信息" prop="skcId">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">{{row.skcId}}</el-tag>
            <KdxImage :src="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column align="center" label="类目" prop="catName">
        </el-table-column>
        <el-table-column align="center" label="拒绝原因" prop="rejectRemark">
        </el-table-column>
        <el-table-column align="center" label="Sku Id">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.skuInfoList" :key="index">
              {{item.productSkuId}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column align="center" label="SKU属性集">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.skuInfoList" :key="index">
              {{item.spec}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column align="center" label="原价">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.skuInfoList" :key="index">
              {{(item.priceBeforeExchange/100).toFixed(2)}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column align="center" label="建议申报价格">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.skuInfoList" :key="index">
              {{(item.suggestSupplyPrice/100).toFixed(2)}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column align="center" label="还价">
          <template slot="header">
            <span>还价</span>
            <div>
              <el-input-number size="mini" style="width: 100%" placeholder="低于该价格" :min="0" :precision="2" v-model="form.less_than" clearable></el-input-number>
              <el-input-number size="mini" style="width: 100%" placeholder="设置该价格" :min="form.less_than" :precision="2" v-model="form.set_price" clearable></el-input-number>
              <el-button size="mini" type="primary" style="width: 100%" @click="setPrice" :disabled="!form.less_than || !form.set_price">设置</el-button>
            </div>
          </template>

          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.skuInfoList" :key="index">
              <el-input-number size="mini" v-model="item.re_price" placeholder="请输入新的价格" :min="item.suggestSupplyPrice/100" :precision="2" :max="item.priceBeforeExchange/100" style="width: 100%" clearable></el-input-number>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
import KdxImage from "@/components/image/image";
import {accountList} from "@/api/temu/account";
import {rePriceClick, rePriceList} from "@/api/temu/re_price";

export default {
  components: {
    KdxImage
  },
  mixins: [],
  computed: {
    skcIds() {
      let list = []
      this.selectRows.forEach((item) => {
        list.push(item.skcId)
      })
      return list
    },
    categories() {
      let list = []
      this.tableData.forEach((item) => {
        if (list.indexOf(item.catName) >= 0) {
          return
        }
        list.push(item.catName)
      })
      return list
    },
    filterTableData() {
      let list = []
      for (const item of this.tableData) {
        if (this.cat_name && item.catName !== this.cat_name) {
          continue
        }
        list.push(item)
      }
      return list
    },
  },
  watch: {
    searchInfo: {
      handler() {
        this.onSubmit()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      accountOptions: [],

      form: {
        less_than: undefined,
        set_price: undefined,
      },

      cat_name: "",

      tableData: [],

      selectRows: [],

      searchInfo: {
        id: undefined,
      },
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val

      if (this.skcIds.length) {
        this.copy(this.skcIds.join(" "))
      }
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async onSubmit() {
      if (!this.searchInfo.id) {
        return
      }
      let resp = await rePriceList(this.searchInfo)
      if (resp.code) {
        return
      }
      for (const d of resp.data) {
        for (const info of d.skuInfoList) {
          info.re_price = info.suggestSupplyPrice / 100
        }
      }
      this.tableData = resp.data
    },
    setPrice() {
      for (const d of this.filterTableData) {
        for (const info of d.skuInfoList) {
          if (info.suggestSupplyPrice > this.form.less_than * 100) {
            continue
          }
          info.re_price = this.form.set_price
        }
      }
    },
    onRePrice() {
      this.$confirm("此操作将还对应价格，请多次确认无误?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
            let items = []
            let ids = []
            for (const d of this.selectRows) {
              let s = {priceOrderId: d.id, items: []}
              for (const info of d.skuInfoList) {
                s.items.push({productSkuId: info.productSkuId, price: Math.ceil(info.re_price*100)})
              }
              items.push(s)
              ids.push(d.id)
            }
            const res = await rePriceClick({account_id: this.searchInfo.id, items: items});
            if (res.code !== 0) {
              return
            }

            this.$message("提交成功")
            for (const id of ids) {
              let index = this.tableData.findIndex((item) => {return item.id === id})
              if (index >= 0) {
                this.tableData.splice(index, 1)
              }
            }
            if (this.tableData.length <= 0) {
              this.onSubmit()
            }
          });
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
      if (this.accountOptions.length > 0) {
        this.searchInfo.id = this.accountOptions[0].id
        this.onSubmit()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 85px;
    padding: 0px;
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    font-weight: 900;
    height: 20px;
    line-height: 20px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

::v-deep .el-table .cell {
  padding: 0;
}
</style>