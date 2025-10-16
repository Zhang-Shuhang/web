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
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids，空格分隔" v-model="searchInfo.skc_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select placeholder="状态" v-model="searchInfo.status" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option label="未开始" :value="1"></el-option>
                <el-option label="已开始" :value="2"></el-option>
                <el-option label="已结束/关闭" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
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
        <el-table-column label="Spu Id" prop="product_id" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="产品图" prop="carousel_image_urls" min-width="300px" align="center">
          <div slot-scope="{row}">
            <KdxImage style="display: inline-block" :src="item" v-for="(item, index) in row.carousel_image_urls" :key="index"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="开始时间" prop="begin_time" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{ new Date(row.begin_time).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column label="结束时间" prop="end_time" align="center" sortable="custom">
          <div slot-scope="{row}">
            <el-popover placement="left" trigger="click" v-if="row.can_operate">
              <el-date-picker type="date" v-model="form.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="新的结束日期" unlink-panels clearable></el-date-picker>
              <el-button size="mini" style="width: 100%" type="primary" @click="delay(row)">设置</el-button>
              <el-button slot="reference" size="mini" type="primary" plain>{{ new Date(row.end_time).toLocaleString() }}</el-button>
            </el-popover>
            <div v-else>
              {{new Date(row.end_time).toLocaleString()}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="发放数量" prop="punish_count" align="center" sortable="custom">
          <div slot-scope="{row}">
            <el-popover placement="left" trigger="click" v-if="row.can_operate">
              <el-input-number size="mini" :min="1" :precision="0" style="width: 100%" v-model="form.increase_count" placeholder="新增数量" clearable></el-input-number>
              <el-button size="mini" style="width: 100%" type="primary" @click="increase(row)">增加</el-button>
              <el-button slot="reference" size="mini" type="primary" plain>{{ row.punish_count }}</el-button>
            </el-popover>
            <div v-else>
              {{row.punish_count}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="领取数量" prop="claimed_count" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="使用数量" prop="use_count" align="center" sortable="custom">
        </el-table-column>
        <el-table-column label="金额" prop="coupon_amount" align="center" sortable="custom">
          <div slot-scope="{row}">
            {{ (row.coupon_amount/100).toFixed(2) }} {{ row.coupon_currency }}
          </div>
        </el-table-column>
        <el-table-column label="操作" prop="activity_price" align="center">
          <div slot-scope="{row}">
            <el-button type="primary" size="mini" style="width: 100%" @click="offline(row)" plain v-if="row.can_operate">
              关闭
            </el-button>
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

    <TemuDlgMultiDaily :sku_ids="daily.sku_ids" :visible="daily.visible" @close="daily.visible=false"></TemuDlgMultiDaily>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import TemuDlgMultiDaily from "@/view/temu/sale/components/dlg_multi_daily.vue";
import {couponDelay, couponIncrease, couponList, couponOffline, couponSync} from "../../../api/temu/coupon";

export default {
  name: 'TemuCouponList',
  components: {
    TemuDlgMultiDaily,
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
      listApi: couponList,

      timeoutId: undefined,

      accountOptions: [],
      selectRows: [],

      form: {
        end_time: "",
        increase_count: "",
      },

      daily: {
        sku_ids: [],
        visible: false,
      },
    }
  },
  computed: {},
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await couponSync()
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    offline(row) {
      this.$confirm('请确认是否关闭?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await couponOffline({id: row.id})
        if (resp.code) {
          return
        }

        this.getTableData()
      })
    },
    async delay(row) {
      let resp = await couponDelay({id: row.id, end_time: this.form.end_time})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async increase(row) {
      let resp = await couponIncrease({id: row.id, add_count: this.form.increase_count})
      if (resp.code) {
        return
      }

      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    if (this.spu_ids) {
      this.$set(this.searchInfo, "spu_ids", this.spu_ids.join(" "))
    }
    if (this.sku_ids) {
      this.$set(this.searchInfo, "sku_ids", this.sku_ids.join(" "))
    }

    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
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

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 100px;
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

.height_100 {
  height: 100%;
}
</style>