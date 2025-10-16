<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_id" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-select v-model="searchInfo.is_factory" placeholder="请选择是否工厂" filterable clearable
                       :style="{width: '100%'}">
              <el-option value=""></el-option>
              <el-option label="工厂" :value="1"></el-option>
              <el-option label="非工厂" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-select v-model="searchInfo.is_finish" placeholder="请选择是否完成" filterable clearable
                       :style="{width: '100%'}">
              <el-option value=""></el-option>
              <el-option label="已完成" :value="1"></el-option>
              <el-option label="未完成" :value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-select v-model="searchInfo.activity_types" placeholder="请选择生产建议类型" filterable clearable multiple collapse-tags
                       :style="{width: '100%'}">
              <el-option value=""></el-option>
              <el-option :label="item.name" :value="item.id" v-for="(item, index) in activityTypeOptions" :key="index"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.sku_code" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids" v-model="searchInfo.skc_ids" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="searchInfo.account_id">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSync">同步当前账号</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="addProgress(selectRows)">新增进度</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="50" align="center" fixed></el-table-column>
        <el-table-column align="center" label="账号" prop="account.name"></el-table-column>
        <el-table-column align="center" label="生产建议ID" prop="id"></el-table-column>
        <el-table-column align="center" label="Spu Id" prop="productId"></el-table-column>
        <el-table-column align="center" label="Skc Id" prop="productSkcId"></el-table-column>
        <el-table-column align="center" label="生产建议信息" width="240px">
          <div slot-scope="{row}">
            <div>
              生产周期：<el-tag type="primary" size="mini">{{row.producePeriod}}</el-tag>
            </div>
            <div>
              生产量可售天数：<el-tag type="primary" size="mini">{{row.productDays}}</el-tag>
            </div>
            <div>
              时间：<el-tag type="primary" size="mini">{{new Date(row.createOrderTime).toLocaleString()}}</el-tag>
            </div>
            <div v-if="row.expectFinishTime">
              要求完成时间：<el-tag type="primary" size="mini">{{new Date(row.expectFinishTime).toLocaleString()}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column align="center" label="生产建议类型">
          <div slot-scope="{row}">
            <el-tag type="warning" size="mini">{{activityType(row)}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column align="center" label="SKU信息">
          <el-table-column align="center" label="Sku Id">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.details" :key="index">
                {{item.productSkuId}}
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="Sku Code">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.details" :key="index">
                <template v-if="item.item">
                  {{item.item.sku_ext_code}}
                </template>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="图片">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.details" :key="index">
                <template v-if="item.item && item.item.item_image">
                  <KdxImage :src="item.item.item_image.image"></KdxImage>
                </template>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="建议生产数" prop="totalCount">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.details" :key="index">
                <template v-if="item.item">
                  {{item.adviceProduceNum}}
                </template>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="剩余件数" prop="availableNum">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.details" :key="index">
                <template v-if="item.item">
                  {{item.availableNum}}
                </template>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="关联备货单">
            <el-table-column align="center" label="待发货数" prop="waitDeliveryNum">
              <div class="item-container" slot-scope="{row}">
                <div class="item" v-for="(item, index) in row.details" :key="index">
                  {{item.waitDeliveryNum}}
                </div>
                <div class="footer">
                </div>
              </div>
            </el-table-column>
            <el-table-column align="center" label="已送货数" prop="deliveredNum">
              <div class="item-container" slot-scope="{row}">
                <div class="item" v-for="(item, index) in row.details" :key="index">
                  {{item.deliveredNum}}
                </div>
                <div class="footer">
                </div>
              </div>
            </el-table-column>
            <el-table-column align="center" label="合计" prop="availableNum">
              <div class="item-container" slot-scope="{row}">
                <div class="item" v-for="(item, index) in row.details" :key="index">
                  {{item.waitDeliveryNum+item.deliveredNum}}
                </div>
                <div class="footer">
                </div>
              </div>
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="生产进度维护">
          <div slot-scope="{row}">
            <div v-if="row.statusUpdateTime">
              <div>
                生产进度: <el-tag size="mini" type="primary">{{row.finish ? "已完成" : "未完成"}}</el-tag>
              </div>
              <div>
                维护时间: {{new Date(row.statusUpdateTime).toLocaleString()}}
              </div>
              <div v-if="row.remark">
                备注内容: {{row.remark}}
              </div>
            </div>

            <el-button size="mini" style="width: 100%" type="primary" @click="addProgress([row])">新增进度</el-button>
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

      <TemuDlgUpdateStatus :rows="dlgUpdateStatus.rows" :visible="dlgUpdateStatus.visible" @close="dlgUpdateStatus.visible = false" @update="getTableData"></TemuDlgUpdateStatus>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "@/api/temu/account";
import {producePlanList, producePlanSync} from "@/api/temu/produce_plan";
import TemuDlgUpdateStatus from "@/view/temu/produce_plan/dlg_update_status.vue";

export default {
  components: {
    TemuDlgUpdateStatus,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    // 能否平台发货
    ids() {
      let list = []
      this.selectRows.forEach((item) => {
        list.push(item.id)
      })
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
      listApi: producePlanList,

      accountOptions: [],

      dlgUpdateStatus: {
        rows: undefined,
        visible: false,
      },

      selectRows: [],

      activityTypeOptions: [
        {id: "common", name: "常规"},
        {id: "yearEndPurchase", name: "年底备货"},
      ]
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await producePlanSync({id: this.searchInfo.account_id})
      if (resp.code) {
        return
      }
      this.$message("同步成功")
    },
    activityType(row) {
      let s = this.activityTypeOptions.find((s)=>{
        return row.activityType === s.id
      })
      if (!s) {
        return `未知类型: ${row.activityType}`
      }
      return s.name
    },
    addProgress(rows) {
      if (rows.length <= 0) {
        return
      }
      this.dlgUpdateStatus.rows = rows
      this.dlgUpdateStatus.visible = true
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }

    this.pageSize = 100
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
    height: 85px;
    padding: 0px;
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    font-weight: 900;
    height: 13px;
    line-height: 13px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

::v-deep .el-table .cell {
  padding: 0;
}
</style>