<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids" v-model="searchInfo.skc_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids" v-model="searchInfo.sku_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.auto_review" placeholder="是否自动同意" filterable clearable :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option label="到点自动同意" :value="1"></el-option>
                <el-option label="自动拒绝" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.price_type" placeholder="价格跟原价关系" filterable clearable :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option label="涨价了" :value="1"></el-option>
                <el-option label="降价了" :value="-1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSync">同步</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="danger" size="mini" :style="{width: '100%'}" @click="onBatchAccept">批量同意</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onBatchReject">批量拒绝</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="调价单号" prop="price_order_sn" align="center" min-width="120px">
          <div slot-scope="{row}">
            <el-tag size="mini">{{row.price_order_sn}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini">{{row.status === 1 ? "待卖家确认" : `其他: ${row.status}`}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Skc" prop="skc_id" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="来源" prop="source" align="center">
        </el-table-column>
        <el-table-column label="自动同意时间" align="center">
          <div slot-scope="{row}">
            <template v-if="row.auto_review !== 2">
              {{new Date(row.order_create_time+24*60*60*1000).toLocaleString()}}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="调价原因" prop="adjust_reason" align="center">
          <div slot-scope="{row}">
            <div>
              {{row.adjust_reason}}
            </div>
            <template v-if="row.activity_end_time">
              <hr>
              <div>
                结束时间: {{new Date(row.activity_end_time).toLocaleString()}}
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="发起时间" align="center">
          <div slot-scope="{row}">
            {{new Date(row.order_create_time).toLocaleDateString()}}
          </div>
        </el-table-column>
        <el-table-column label="Sku Id" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              {{item.productSkuId}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="Sku" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              {{item.spec}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              <KdxImage :src="item.item.item_image.image" v-if="item.item && item.item.item_image"></KdxImage>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="原价格" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              {{item.priceCurrency}} {{(item.price/100).toFixed(2)}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="成本" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              <template v-if="item.item && item.item.daily_history">
                CNY {{item.item.daily_history.price.toFixed(2)}}
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="调整后申报价格" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              {{row.price_currency}} {{(item.price / 100).toFixed(2)}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="平台仓内库存" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              <template v-if="item.item">
                {{item.item.sales_inventory_num}}
              </template>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="小秘" align="center">
          <el-table-column label="剩余" align="center">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.items" :key="index">
                <template v-if="item.item && item.item.daily_history">
                  {{item.item.daily_history.real_inventory_in_warehouse}}
                </template>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column label="采购在途" align="center">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.items" :key="index">
                <template v-if="item.item && item.item.daily_history">
                  {{item.item.daily_history.on_way_count}}
                </template>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="层级" prop="level" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              <el-tag size="mini" type="warning" effect="dark">{{levelName(item.item)}}</el-tag>
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="7系" prop="seven_day_coef" align="center">
          <template slot="header">
            <el-tooltip content="7日系数">
              <span>7系</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              {{item.item && item.item.daily_history ? item.item.daily_history.seven_day_coef.toFixed(2) : "0.00"}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="30系" prop="thirty_day_coef" align="center">
          <template slot="header">
            <el-tooltip content="30日系数">
              <span>30系</span>
            </el-tooltip>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              {{item.item && item.item.daily_history ? item.item.daily_history.thirty_day_coef.toFixed(2) : "0.00"}}
            </div>
            <div class="footer">
            </div>
          </div>
        </el-table-column>
        <el-table-column label="每日销量" align="center">
          <div class="item-container" slot-scope="{row}">
            <div class="item" v-for="(item, index) in row.items" :key="index">
              <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(item.productSkuId)" plain>订单</el-button>
            </div>
            <div class="footer">
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

    <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {priceAdjustList, priceAdjustReply, priceAdjustSync} from "@/api/temu/price_adjust";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";

export default {
  components: {
    TemuDlgDaily,
    KdxImage
  },
  mixins: [infoList],
  computed:{
  },
  data() {
    return {
      listApi: priceAdjustList,

      accountOptions: [],

      selectRows: [],

      daily: {
        id: undefined,
        visible: false,
      },

      levelOptions: [
        {id: 7, name: "超级爆品"},
        {id: 6, name: "大爆品"},
        {id: 5, name: "中爆品"},
        {id: 4, name: "小爆品"},
        {id: 3, name: "3类品"},
        {id: 2, name: "2类品"},
        {id: 1, name: "1类品"},
        {id: 0, name: "新品"},
        {id: -1, name: "淘汰1类"},
        {id: -2, name: "淘汰2类"},
        {id: -3, name: "淘汰3类"},
        {id: -10, name: "已下架"},
      ],
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    async onSync() {
      let resp = await priceAdjustSync()
      if (resp.code) {
        return
      }

      this.$message("同步成功，请等待后台执行")
    },
    selectionChange(val) {
      this.selectRows = val
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    onBatchAccept() {
      if (this.selectRows.length <= 0) {
        return
      }

      let ids = []
      this.selectRows.forEach((item) => {
        ids.push(item.id)
      })

      this.$confirm('请确认是否同意?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await priceAdjustReply({ids: ids, result: 1})
            if (resp.code) {
              return
            }

            this.$message("同意成功")
            this.getTableData()
          })
    },
    onBatchReject() {
      if (this.selectRows.length <= 0) {
        return
      }

      let ids = []
      this.selectRows.forEach((item) => {
        ids.push(item.id)
      })

      this.$confirm('请确认是否拒绝?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await priceAdjustReply({ids: ids, result: 2, reason: "价格过低"})
            if (resp.code) {
              return
            }

            this.$message("拒绝成功")
            this.getTableData()
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
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  },
}
</script>
<style scoped lang="scss">
  ::v-deep .el-table .cell {
    padding-left: 0px !important;
    padding-right: 0px !important;
  }

  ::v-deep .el-form-item__content:after, .el-form-item__content:before {
    display: table;
  }

  ::v-deep .el-form-item__content {
    line-height: 28px;
    position: relative;
    font-size: 12px;
  }

  ::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
    margin-bottom: 0px;
  }

  ::v-deep .el-row {
    padding: 0px;
  }

  ::v-deep .select .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }

  ::v-deep .select .el-input__suffix {
    display: none;
  }

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
      height: 24px;
      font-size: 12px;
      line-height: 24px;
      padding-bottom: 0;
      padding-top: 0;
    }
  }
</style>