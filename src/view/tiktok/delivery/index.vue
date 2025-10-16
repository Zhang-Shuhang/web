<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="8" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         style="width: 100%">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.status" placeholder="请选择状态" filterable clearable
                         style="width: 100%">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-button type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-button type="primary" style="width: 100%" @click="onSync">同步</el-button>
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
                <div slot-scope="{row}">
                  <span style="font-size: 12px">{{ row.id }}</span>
                </div>
              </el-table-column>
              <el-table-column label="订单类型" prop="is_jit" align="center">
                <div slot-scope="{row}">
                  <el-tag size="mini" type="primary">{{ row.stock_mode === 2 ? "JIT" : "备货" }}</el-tag>
                </div>
              </el-table-column>
              <el-table-column label="Skc Id" align="center">
                <div slot-scope="{row}">
                  <span style="font-size: 12px">{{ row.skc_code }}</span>
                </div>
              </el-table-column>
              <el-table-column label="货号" prop="article_number" align="center">
                <div slot-scope="{row}">
                  <span style="font-size: 12px">{{ row.article_number }}</span>
                </div>
              </el-table-column>
              <el-table-column label="图片" align="center">
                <div slot-scope="{row}">
                  <KdxImage :src="row.product_img_urls[0]" v-if="row.product_img_urls && row.product_img_urls.length > 0"></KdxImage>
                </div>
              </el-table-column>
              <el-table-column label="发货数量" prop="delivery_quantity" align="center">
              </el-table-column>
              <el-table-column label="收货数量" prop="receive_quantity" align="center">
              </el-table-column>
              <el-table-column label="入库数量" prop="inbound_quantity" align="center">
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="订单号" prop="id" min-width="100px" align="center">
          <div slot-scope="{row}">
            <span style="font-size: 12px">{{ row.id }}</span>
            <div v-if="row.stock_mode === 2">
              <el-tag size="mini" type="primary">JIT</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <template v-if="row.items.length > 0">
              <KdxImage style="display: inline-block" :key="0" :src="row.items[0].product_img_urls[0]" v-if="row.items[0].product_img_urls && row.items[0].product_img_urls.length > 0"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="送货包裹数" prop="delivery_package_quantity" align="center">
        </el-table-column>
        <el-table-column label="产品数" align="center">
          <div slot-scope="{row}">
            {{ row.items.length }}
          </div>
        </el-table-column>
        <el-table-column label="送货数" align="center">
          <div slot-scope="{row}">
            {{deliveryCount(row.items)}}
          </div>
        </el-table-column>
        <el-table-column label="最迟发货时间" prop="deadline" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.deadline">{{ new Date(row.deadline).toLocaleString() }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="送货时间" prop="ship_time" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.ship_time">{{ new Date(row.ship_time).toLocaleString() }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="送达时间" prop="delivery_time" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.delivery_time">{{ new Date(row.delivery_time).toLocaleString() }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="入库时间" prop="inbound_time" align="center">
          <div slot-scope="{row}">
            <div v-if="row.inbound_time">
              <el-tag size="mini" type="primary">{{ new Date(row.inbound_time).toLocaleString() }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="质检时间" prop="inbound_time" align="center">
          <div slot-scope="{row}">
            <div v-if="row.qc_time">
              <el-tag size="mini" type="primary">{{ new Date(row.qc_time).toLocaleString() }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <div slot-scope="{row}">
            <div v-if="!row.info || row.info.suc !== 1">
              <el-button type="danger" size="mini" style="width: 100%" @click="onToFactory(row)" plain>
                同步任务去工厂({{row.info ? row.info.suc : 0}})
              </el-button>
              <div v-if="row.info && row.info.reason" style="font-size: 12px">
                原因: {{row.info.reason}}
              </div>
            </div>
            <div v-else>
              <el-tag size="mini" type="success" style="width: 100%">同步成功</el-tag>
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
  deliveryList, deliveryToFactory, deliverySync,
} from "@/api/tiktok/delivery";
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/tiktok/account";

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
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await deliverySync()
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async onToFactory(delivery) {
      let resp = await deliveryToFactory({id: delivery.id})
      if (resp.code) {
        return
      }

      this.$message("操作成功")
      this.getTableData()
    },
    deliveryCount(items) {
      let count = 0
      items.forEach((item) => {
        count += item.delivery_quantity
      })
      return count
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