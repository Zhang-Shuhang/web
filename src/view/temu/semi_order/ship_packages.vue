<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="item.name" :value="item.id" v-if="item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="订单id，空格分隔" v-model="searchInfo.order_sns" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="包裹号，空格分隔" v-model="searchInfo.pk_ids" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="运单号，空格分隔" v-model="searchInfo.tracking_numbers" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select size="mini" v-model="searchInfo.ship_company" placeholder="物流公司，模糊搜索" filterable clearable style="width: 100%" @change="onSubmit">
                <el-option label="Usps" value="usps"></el-option>
                <el-option label="Fedex" value="fedex"></el-option>
                <el-option label="Ups" value="ups"></el-option>
                <el-option label="Gofo" value="gofo"></el-option>
                <el-option label="UniUni" value="uniuni"></el-option>
                <el-option label="SpeedX" value="speedx"></el-option>
                <el-option label="OnTrac" value="ontrac"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select size="mini" v-model="searchInfo.warehouse_names" placeholder="请选择发货仓库" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in warehouseNameList" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select size="mini" v-model="searchInfo.has_pdf" placeholder="是否有pdf" filterable clearable style="width: 100%" @change="onSubmit">
                <el-option label="有Pdf" :value="1"></el-option>
                <el-option label="没Pdf" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="4" v-if="selectWinitRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="exportWinit(selectWinitRows)">导出万邑通</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="4" v-if="selectUbRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="exportUb(selectUbRows)">导出领星</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="4" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="exportAll(selectRows)">导出全部</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="account.name" sortable="custom">
        </el-table-column>
        <el-table-column label="包裹号" align="center" prop="id" sortable="custom">
          <template slot="header">
            <div>包裹号</div>
            <el-button size="mini" type="primary" @click="copySelect('id')" v-if="selectRows.length">复制所选</el-button>
          </template>
          <div slot-scope="{row}">
            {{row.id}}
          </div>
        </el-table-column>
        <el-table-column label="运单号" align="center" prop="tracking_number" sortable="custom">
          <template slot="header">
            <div>运单号</div>
            <el-button size="mini" type="primary" @click="copySelect('tracking_number')" v-if="selectRows.length">复制所选</el-button>
          </template>
          <div slot-scope="{row}">
            <el-link size="mini" type="primary" :href="row.pdf.pdf_url" :underline="false" target="_blank" v-if="row.pdf">{{row.tracking_number}}</el-link>
            <div v-else-if="row.tracking_number">{{row.tracking_number}}</div>
            <div v-else-if="row.shipping_label_status === 2" style="color: red">下单失败</div>

            <div>
              <el-tag type="primary" size="mini">{{row.shipping_company_name}}({{row.ship_product_name}})</el-tag>
            </div>
            <div>
              <el-tag type="warning" size="mini">{{row.online_estimated_text}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="下单时间" align="center" prop="tracking_number" sortable="custom">
          <div slot-scope="{row}">
            {{new Date(row.label_call_time*1000).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="发货仓库" align="center" prop="warehouse.name" sortable="custom">
        </el-table-column>
        <el-table-column label="订单号" align="center">
          <template slot="header">
            <div>订单号</div>
            <el-button size="mini" type="primary" @click="copySelectOrderId" v-if="selectRows.length">复制所选</el-button>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.order_send_info_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.order_send_info_list" :key="index">
              <el-tag size="mini" type="primary">{{ item.parent_order_sn }}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品信息" align="center" width="300px">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.order_send_info_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.order_send_info_list" :key="index">
              <div>
                Sku: {{ item.product_sku_id }}
              </div>
              <div v-if="item.variation">
                Sku Code: {{ item.variation.ext_code }}
              </div>
              <div>
                数量: {{ item.quantity }}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.order_send_info_list.length ? [`item`] : [`item`, `item-bottom`]"
                 v-for="(item, index) in row.order_send_info_list" :key="index">
              <KdxImage :src="item.thumb_url" width="80px" height="80px"></KdxImage>
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
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {
  semiOrderExportAll,
  semiOrderExportUb,
  semiOrderExportWinit,
  semiOrderShipPackageList, semiOrderSyncShipPackageList,
} from "@/api/temu/semi_order";
import {semiWarehouseList} from "@/api/temu/semi";

export default {
  components: {
    KdxImage
  },
  mixins: [infoList],
  computed: {
    selectWinitRows() {
      return this.selectRows.filter((row) => {
        return row.warehouse && row.warehouse.name.indexOf("万邑通") >= 0
      })
    },
    selectUbRows() {
      return this.selectRows.filter((row) => {
        return row.warehouse && row.warehouse.name.indexOf("领星") >= 0
      })
    },
  },
  data() {
    return {
      listApi: semiOrderShipPackageList,
      accountOptions: [],
      selectRows: [],
      warehouseNameList: [],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await semiOrderSyncShipPackageList()
      if (resp.code) {
        return
      }

      this.$message("请求成功，请稍后再查询")
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      this.copySelect('id')
    },
    async exportWinit(rows) {
      let resp = await semiOrderExportWinit({ids: rows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }

      this.$message("导出成功")
      window.open(resp.data, "_blank")
    },
    async exportUb(rows) {
      let resp = await semiOrderExportUb({ids: rows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }

      this.$message("导出成功")
      window.open(resp.data, "_blank")
    },
    async exportAll(rows) {
      let resp = await semiOrderExportAll({ids: rows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }

      this.$message("导出成功")
      window.open(resp.data, "_blank")
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    copySelect(key) {
      let ids = this.selectRows.map((item) => {
        return item[key]
      })
      this.copy(ids.join("\n"))
    },
    copySelectOrderId() {
      let ids = []
      this.selectRows.forEach((item) => {
        item.order_send_info_list.forEach((item) => {
          if (ids.indexOf(item.parent_order_sn) >= 0) {
            return
          }
          ids.push(item.parent_order_sn)
        })
      })
      this.copy(ids.join("\n"))
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

    resp = await semiWarehouseList()
    if (resp.code === 0) {
      let warehouseNameList = []
      resp.data.forEach((w) => {
        if (w.name.indexOf("-") >= 0 && warehouseNameList.indexOf(w.name) < 0) {
          warehouseNameList.push(w.name)
        }
      })
      this.warehouseNameList = warehouseNameList
    } else {
      this.warehouseNameList = []
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
    height: 90px;
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

::v-deep .el-upload--text {
  width: 100%;
}
</style>