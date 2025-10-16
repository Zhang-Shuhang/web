<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="货号, 空格分隔，带空格是精确查找，不带是模糊查找" v-model="searchInfo.sku_code" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否工厂" v-model="searchInfo.is_factory" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="工厂" :value="1"></el-option>
                <el-option label="非工厂" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最小数量" v-model.number="searchInfo.min_count" style="width: 100%" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-col>
              <el-col class="line" :span="2">-</el-col>
              <el-col :span="11">
                <el-input class="input-right-zero" placeholder="最大数量" v-model.number="searchInfo.max_count" style="width: 100%" clearable filterable @keyup.enter.native="onSubmit"></el-input>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否禁售" v-model="searchInfo.is_ban" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="已禁售" :value="1"></el-option>
                <el-option label="未禁售" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否库存+在途为0" v-model="searchInfo.is_stock_zero" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="库存非0" :value="1"></el-option>
                <el-option label="库存为0" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="openBeiHuoDlg([])">查看备货列表</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <el-button type="primary" size="mini" style="width: 100%" @click="opelDlgStockChanged(undefined)">
              系统收货记录
            </el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2" v-if="selectRows.length">
            <el-button size="mini" type="primary" style="width: 100%" @click="onExport">导出</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="true"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column type="expand" v-if="searchInfo.show_estimate" fixed>
          <template slot-scope="{row}">
            <div style="margin: 0 10px 40px 10px">
              <StockEstimated :list="row.estimates"></StockEstimated>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="货号" align="center" prop="id" sortable="custom" fixed>
        </el-table-column>
        <el-table-column label="图片" align="center" fixed>
          <div slot-scope="{row}">
            <KdxImage :src="row.image.url" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
<!--        <el-table-column label="库存" align="center">-->
          <el-table-column label="海外库存" align="center">
            <el-table-column label="总" align="center" prop="total_count" sortable="custom">
            </el-table-column>
            <el-table-column label="剩余" align="center" prop="count" sortable="custom">
            </el-table-column>
          </el-table-column>
<!--          <el-table-column label="自发" align="center">-->
<!--            <el-table-column label="总" align="center" prop="total_self_count" sortable="custom">-->
<!--            </el-table-column>-->
<!--            <el-table-column label="剩余" align="center" prop="self_count" sortable="custom">-->
<!--            </el-table-column>-->
<!--          </el-table-column>-->
<!--        </el-table-column>-->
        <el-table-column label="在途库存" align="center">
          <el-table-column label="空运" align="center" prop="on_way_airfreight_count" sortable="custom">
          </el-table-column>
          <el-table-column label="海运" align="center" prop="on_way_ship_count" sortable="custom">
          </el-table-column>
        </el-table-column>
        <el-table-column label="下一批货物上架" align="center" prop="next_stock_days" min-width="150px" sortable="custom">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" type="primary">距离天数: {{row.next_stock_days.toFixed(2)}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="库存详情" align="center">
          <el-table-column label="仓库" align="center" width="140px">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="warning">{{v.warehouse ? v.warehouse.name : "-"}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="数量" align="center" prop="real_stock_count" sortable="custom">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="primary" effect="dark">{{v.available_stock}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
          <el-table-column label="在途" align="center">
            <div class="item-container" slot-scope="{row}">
              <template v-if="row.inventories">
                <div :class="index+1 === row.inventories.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.inventories" :key="index">
                  <el-tag size="mini" type="success" effect="dark">{{v.in_transit_stock}}</el-tag>
                </div>
              </template>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="建议备货量" align="center">
          <el-table-column label="空运(15天)" align="center" prop="advice_count" sortable="custom">
          </el-table-column>
          <el-table-column label="海运(30天)" align="center" prop="ship_advice_count" sortable="custom">
          </el-table-column>
        </el-table-column>
        <el-table-column label="备货中数量" align="center" prop="bei_huo_count" sortable="custom">
        </el-table-column>
        <el-table-column label="采购中数量" align="center" prop="confirm_bei_huo_count" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <div slot-scope="{row}">
            <el-row :gutter="5">
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button type="warning" size="mini" style="width: 100%" @click="openBeiHuoDlg([row.id])" plain>
                    备货
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button type="primary" size="mini" style="width: 100%" @click="opelDlgStockChanged(row.id)" plain>
                    变更记录
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button type="primary" size="mini" style="width: 100%" @click="openList(row.id)" plain>
                    发货记录
                  </el-button>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-popover placement="left" trigger="click">
                    <el-input size="mini" style="width: 100%" v-model="image_url" placeholder="请输入图片链接"></el-input>
                    <el-button size="mini" style="width: 100%" type="primary" @click="setStockImage(row)">设置</el-button>
                    <el-button slot="reference" size="mini" type="primary" style="width: 100%">修改图片</el-button>
                  </el-popover>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="margin-top: 5px">
                  <el-button size="mini" type="danger" style="width: 100%" v-if="!row.setting || !row.setting.is_ban" @click="ban(row, true)">禁止销售</el-button>
                  <el-button size="mini" type="danger" style="width: 100%" v-else @click="ban(row, false)">允许销售</el-button>
                </div>
              </el-col>
            </el-row>
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

    <TemuDlgStockChangedRecord :sku_code="dlgStockChange.sku_code" :is_system="dlgStockChange.is_system" :update="getTableData" :visible="dlgStockChange.visible" @close="dlgStockChange.visible=false"></TemuDlgStockChangedRecord>
    <TemuDlgList :sku_code="dlgList.sku_code" :visible="dlgList.visible" @close="dlgList.visible=false" v-if="dlgList.visible"></TemuDlgList>
    <TemuDlgStockBeiHuo :ids="beiHuoDlg.ids" :visible="beiHuoDlg.visible" @close="beiHuoDlg.visible=false" @update="getTableData"></TemuDlgStockBeiHuo>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {
  overseasWarehouseBan,
  overseasWarehouseExportStock,
  overseasWarehouseSetStockImage,
  overseasWarehouseStockList
} from "@/api/oversea_warehouse/list";
import TemuDlgStockChangedRecord from "@/view/oversea_warehouse/components/dlg_stock_changed.vue";
import TemuDlgList from "@/view/oversea_warehouse/components/dlg_list.vue";
import TemuDlgStockBeiHuo from "@/view/oversea_warehouse/components/dlg_stock_bei_huo.vue";
import {mapGetters} from "vuex";

export default {
  components: {
    TemuDlgStockBeiHuo,
    TemuDlgList,
    TemuDlgStockChangedRecord,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(()=>{
          this.page = 1
          this.getTableData()
        }, 300)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: overseasWarehouseStockList,

      selectRows: [],

      timeoutId: undefined,

      dlgStockChange: {
        sku_code: "",
        is_system: false,
        visible: false,
      },

      dlgList: {
        sku_code: "",
        visible: false,
      },

      beiHuoDlg: {
        ids: [],
        visible: false,
      },

      image_url: undefined,
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onExport() {
      let resp = await overseasWarehouseExportStock({ids: this.selectRows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }
      this.$message("导出成功，服务器只保留1天")
      window.open(resp.data, "_blank")
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.id
      })
      this.copy(ids.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    opelDlgStockChanged(skuCode) {
      this.dlgStockChange.sku_code = skuCode
      this.dlgStockChange.is_system = !skuCode
      this.dlgStockChange.visible = true
    },
    openList(skuCode) {
      this.dlgList.sku_code = skuCode
      this.dlgList.visible = true
    },
    async ban(row, is_ban) {
      let resp = await overseasWarehouseBan({id: row.id, is_ban: is_ban})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async setStockImage(row) {
      if (!this.image_url) {
        this.$message.error("请输入图片链接")
        return
      }
      let resp = await overseasWarehouseSetStockImage({id: row.id, url: this.image_url})
      if (resp.code) {
        return
      }
      this.image_url = ""
      this.$message("设置成功")
      this.getTableData()
    },
    openBeiHuoDlg(ids) {
      this.beiHuoDlg.ids = ids
      this.beiHuoDlg.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 20
    this.$set(this.searchInfo, "is_ban", 2)
    this.$set(this.searchInfo, "is_stock_zero", 1)
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
    height: 25px;
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
</style>