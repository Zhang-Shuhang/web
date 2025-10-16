<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.start_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="预约时间开始日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="预约时间结束日期" unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.type" placeholder="请选择类型" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option label="备货" :value="1"></el-option>
                <el-option label="定制" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.skc_ids" type="primary" placeholder="Skc Ids" clearable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.delivery_ids" type="primary" placeholder="发货单号" clearable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input v-model="searchInfo.express_ids" type="primary" placeholder="物流单号" clearable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="syncDeliveries">同步发货单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <el-table class="table-body" ref="multipleTable" :data="row.items" border height="100%" @sort-change="sortChange" size="mini"
                      :header-cell-style="{'background-color': 'lightblue', 'color': '#fff'}">
              <el-table-column label="订单Id" prop="id" align="center">
              </el-table-column>
              <el-table-column label="Skc Id" prop="skc" align="center">
              </el-table-column>
              <el-table-column label="Sku Id" prop="skuCode" align="center">
              </el-table-column>
              <el-table-column label="货号" prop="supplierSku" align="center">
              </el-table-column>
              <el-table-column label="图片" align="center">
                <div slot-scope="{row}">
                  <KdxImage :src="row.thumbUrl" v-if="row.thumbUrl"></KdxImage>
                </div>
              </el-table-column>
              <el-table-column label="发货数量" prop="deliveryQuantity" align="center">
              </el-table-column>
              <el-table-column label="实际收货" prop="storageQuantity" align="center">
              </el-table-column>
              <el-table-column label="次品" prop="defectiveQuantity" align="center">
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="account.name" width="240" align="center">
        </el-table-column>
        <el-table-column label="发货单号" width="240" align="center">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" type="primary">{{ row.deliveryCode }}</el-tag>
            </div>
            <div>
              <el-tag size="mini" type="warning">{{ row.is_custom ? "定制" : "备货" }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="物流" width="240" align="center">
          <div slot-scope="{row}">
            <div>
              <el-link style="font-size: 12px" :underline="false" size="mini" type="primary" :href="`https://kuaidi100.com/result.jsp?nu=${row.expressCode}`" target="_blank">{{ row.expressCompanyName }} {{ row.expressCode }}</el-link>
            </div>
            <div>
              <el-tag size="mini" type="primary">预约时间: {{ new Date(row.reserveParcelTime).toLocaleString() }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" min-width="350px" align="center">
          <div slot-scope="{row}">
            <template v-for="(item, index) in row.items">
              <KdxImage style="display: inline-block" :key="index" :src="item.thumbUrl" v-if="item.thumbUrl"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="订单数" align="center">
          <div slot-scope="{row}">
            {{ row.items.length }}
          </div>
        </el-table-column>
        <el-table-column label="送货数" align="center">
          <div slot-scope="{row}">
            {{ calcDeliveryQuantity(row.items) }}
          </div>
        </el-table-column>
        <el-table-column label="入库数" align="center">
          <div slot-scope="{row}">
            {{ storageQuantity(row) }}
          </div>
        </el-table-column>
        <el-table-column label="发货时间" prop="addTime" align="center">
          <div slot-scope="{row}">
            {{new Date(row.addTime).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="到货时间" prop="receiptTime" align="center">
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <div v-if="row.is_custom" style="margin-bottom: 5px">
              <div v-if="row.to_customize && row.to_customize.suc">
                <el-tag size="mini" type="success" style="width: 100%">已同步</el-tag>
              </div>
              <div v-else>
                <el-button type="primary" size="mini" style="width: 100%" @click="onToCustomize(row)">
                  同步任务去定制
                </el-button>
                <div style="font-size: 12px; color: red" v-if="row.to_customize && row.to_customize.fail_reason">
                  失败原因: {{row.to_customize.fail_reason}}
                </div>
              </div>
            </div>
            <div v-if="!row.info">
              <el-button :type="toFactoryBtnType(row)" size="mini" style="width: 100%" @click="onToFactory(row)">
                同步任务去工厂
              </el-button>
            </div>
            <div v-else>
              <el-tag size="mini" type="success" style="width: 100%">已同步({{row.info.suc}})</el-tag>
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
import {
  deliveryList,
  deliverySync, deliveryToCustomize, deliveryToFactory,
} from "@/api/shein/delivery";
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/shein/account";

export default {
  components: {
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: deliveryList,

      accountOptions: [],
      statusOptions: [
        // {id: "ON_SHELF", name: "已上架"},
        // {id: "SOLD_OUT", name: "已售罄"},
        // {id: "WAIT_SHELF", name: "待上架"},
      ],
    }
  },
  computed: {
  },
  methods: {
    toFactoryBtnType(row) {
        if (!row.expressList) {
          return "primary"
        }

      for (const e of row.expressList) {
        if (e.senderAddress.indexOf("双峰") >= 0) {
          return "danger"
        }
      }
      return "primary"
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async onToCustomize(row) {
      let resp = await deliveryToCustomize({id: row.id})
      if (resp.code) {
        return
      }

      this.$message("操作成功，请等待执行!")
      this.getTableData()
    },
    async onToFactory(row) {
      let resp = await deliveryToFactory({id: row.id})
      if (resp.code) {
        return
      }

      this.$message("操作成功，请等待执行!")
      this.getTableData()
    },
    calcDeliveryQuantity(items) {
      let count = 0
      items.forEach((item) => {
        count += item.deliveryQuantity
      })
      return count
    },
    storageQuantity(row) {
      let storageQuantity = 0
      for (const item of row.items) {
        storageQuantity += item.storageQuantity
      }

      return storageQuantity
    },
    async syncDeliveries() {
      let resp = await deliverySync()
      if (resp.code) {
        return
      }
      this.$message("同步成功，请等待服务器同步，请不要频繁点击同步")
      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let c = new Date()
    this.$set(this.searchInfo, "start_time", c.toLocaleDateString())
    this.$set(this.searchInfo, "end_time", c.toLocaleDateString())

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
</style>