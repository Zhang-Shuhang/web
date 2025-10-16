<template>
  <el-drawer :visible.sync="$attrs.visible" title="一键迁移" @opened="onOpened" size="80%" :modal-append-to-body="true"
             :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center" :selectable="checkSelectable" fixed></el-table-column>
      <el-table-column label="商品信息" prop="image" align="center" width="200px">
        <div slot-scope="{row}">
          <div>
            Spu: {{ row.id }}
          </div>
          <div style="white-space: nowrap; width: 100%; overflow: hidden; text-overflow:ellipsis;">
            {{ row.title }}
          </div>
          <div>
            类目: {{ row.category_name }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="图片" prop="image" align="center" width="100px">
        <div slot-scope="{row}">
          <KdxImage :src="row.image"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="上架账号" align="center">
        <template slot="header">
          <div>上架账号</div>

          <el-select size="mini" v-model="setting.accountId" placeholder="账号" filterable style="width: 100%" @change="setAccountId">
            <template v-for="(item, index) in accounts">
              <el-option :key="index" :label="item.name" :value="item.id"></el-option>
            </template>
          </el-select>
        </template>
        <div slot-scope="{row}">
          {{ accountName(row) }}
        </div>
      </el-table-column>
      <el-table-column label="半托管" align="center" v-if="isSemiAccount(setting.accountId)">
        <template slot="header">
          <div>半托管</div>

          <template>
            <el-row :gutter="5">
              <el-col :span="12">
                <el-select size="mini" v-model="setting.siteId" placeholder="请选择站点" filterable style="width: 100%"
                           @change="setSiteId">
                  <template v-for="(item, index) in siteList">
                    <el-option :key="index" :label="item.name" :value="item.id"
                               v-if="item.match_semi_managed"></el-option>
                  </template>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select size="mini" v-model="setting.warehouseId" placeholder="请选择仓库" filterable
                           style="width: 100%" @change="setWarehouseId">
                  <template v-for="(item, index) in warehouseList">
                    <el-option :key="index" :label="item.name" :value="item.id"
                               v-if="item.account_id === setting.accountId"></el-option>
                  </template>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select size="mini" v-model="setting.freightTemplateId" placeholder="请选择运费模板" filterable
                           style="width: 100%" @change="setFreightTemplateId">
                  <template v-for="(item, index) in freightTemplateList">
                    <el-option :key="index" :label="item.name" :value="item.id"
                               v-if="item.account_id === setting.accountId"></el-option>
                  </template>
                </el-select>
              </el-col>
              <el-col :span="12">
                <el-select size="mini" v-model="setting.shipDays" placeholder="请选择发货天数" filterable
                           style="width: 100%" @change="setShipDays">
                  <el-option label="2天(定制为3天)" :value="2"></el-option>
                  <el-option label="9天" :value="9"></el-option>
                </el-select>
              </el-col>
            </el-row>
            <div>
              <el-input-number size="mini" style="width: 100%" :precision="0" placeholder="库存" v-model="setting.stock"
                               clearable filterable @change="setStock"></el-input-number>
            </div>
          </template>
        </template>
        <div slot-scope="{row}">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-select size="mini" v-model="row.site_id" placeholder="请选择站点" filterable style="width: 100%"
                         v-if="isSemiAccount(row.account_id)">
                <template v-for="(item, index) in siteList">
                  <el-option :key="index" :label="item.name" :value="item.id"
                             v-if="item.match_semi_managed"></el-option>
                </template>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select size="mini" v-model="row.warehouse_id" placeholder="请选择仓库" filterable style="width: 100%"
                         v-if="isSemiAccount(row.account_id)">
                <template v-for="(item, index) in warehouseList">
                  <el-option :key="index" :label="item.name" :value="item.id"
                             v-if="item.account_id === row.account_id"></el-option>
                </template>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select size="mini" v-model="row.freight_template_id" placeholder="请选择运费模板" filterable
                         style="width: 100%" v-if="isSemiAccount(row.account_id)">
                <template v-for="(item, index) in freightTemplateList">
                  <el-option :key="index" :label="item.name" :value="item.id"
                             v-if="item.account_id === row.account_id"></el-option>
                </template>
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-select size="mini" v-model="row.ship_days" placeholder="请选择发货天数" filterable style="width: 100%"
                         v-if="isSemiAccount(row.account_id)">
                <el-option label="2天(定制为3天)" :value="2"></el-option>
                <el-option label="9天" :value="9"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <div>
            <el-input-number size="mini" style="width: 100%" :precision="0" placeholder="库存" v-model="row.stock"
                             clearable filterable v-if="isSemiAccount(row.account_id)"></el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="信息" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.variations" :key="index">
            <div style="font-size: 12px">
              {{ item.ext_code }}
            </div>
            <div>
              <el-tag size="mini" style="width: 100%">
                {{ item.len }}x{{ item.width }}x{{ item.height }}mm/{{ item.weight }}g
              </el-tag>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="变体图" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.variations" :key="index">
            <KdxImage :src="item.image" width="80px" height="80px"></KdxImage>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="申报价格" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.variations" :key="index">
            <el-input-number size="mini" :precision="2" :min="minPrice(row, item)" v-model="item.target_price"></el-input-number>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="mini" type="primary" style="width: 100%" @click="selectCategory([row])" v-if="row.account_id">提交</el-button>
          <el-button size="mini" type="danger" style="width: 100%; margin-top: 5px" @click="deleteRow(row)">删除</el-button>
        </div>
      </el-table-column>
    </el-table>

    <div style="position: absolute; right: 20px; bottom: 300px; z-index: 9999" v-if="selectRows.length > 0">
      <el-button size="medium" type="primary" style="height: 100px; width: 100px;" @click="selectCategory(selectRows)">提交
      </el-button>
    </div>

    <TemuDlgProductCategoryProperties :default_account_id="dlgCategoryProperties.account_id" :can_change_account="false" :confirm="dlgCategoryProperties.confirm" :visible="dlgCategoryProperties.visible" @close="dlgCategoryProperties.visible=false"></TemuDlgProductCategoryProperties>
  </el-drawer>
</template>

<script>

import {productOneKeyTransport} from "@/api/temu/product";
import {semiFreightTemplateList, semiWarehouseList} from "@/api/temu/semi";
import KdxImage from "@/components/image/image.vue";
import {siteList} from "@/api/temu/site";
import {simpleProductOneKeyTransportUpload} from "@/api/temu/simple_product";
import TemuDlgProductCategoryProperties from "@/view/temu/components/product_category_properties.vue";

export default {
  name: 'TemuDlgOneKeyTransport',
  components: {TemuDlgProductCategoryProperties, KdxImage},
  mixins: [],
  props: {
    ids: {
      type: Array,
      required: true,
    },
    accounts: {
      type: Array,
      required: true,
    },
  },
  computed: {},
  data() {
    return {
      list: [],
      siteList: [],
      freightTemplateList: [],
      warehouseList: [],
      selectRows: [],

      setting: {
        accountId: undefined,
        siteId: undefined,
        warehouseId: undefined,
        freightTemplateId: undefined,
        shipDays: undefined,
        stock: undefined,
      },

      dlgCategoryProperties: {
        account_id: undefined,
        confirm: undefined,
        visible: false,
      }
    }
  },
  methods: {
    checkSelectable(row) {
      return row.account_id
    },
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.setting.accountId = undefined
      this.setting.siteId = undefined
      this.setting.warehouseId = undefined
      this.setting.freightTemplateId = undefined
      this.setting.shipDays = undefined
      this.setting.stock = undefined
      this.selectRows = []

      this.syncSiteList()
      this.syncFreightTemplateList()
      this.syncWarehouseList()

      let resp = await productOneKeyTransport({ids: this.ids})
      if (resp.code) {
        return
      }
      this.list = resp.data
    },
    async syncSiteList() {
      let resp = await siteList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.siteList = resp.data
    },
    async syncFreightTemplateList() {
      let resp = await semiFreightTemplateList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.freightTemplateList = resp.data
    },
    async syncWarehouseList() {
      let resp = await semiWarehouseList()
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.warehouseList = resp.data
    },
    setAccountId() {
      this.setting.siteId = undefined
      this.setting.warehouseId = undefined
      this.setting.freightTemplateId = undefined
      this.setting.shipDays = undefined
      this.setting.stock = undefined

      this.list.forEach((row) => {
        row.account_id = this.setting.accountId
        row.site_id = undefined
        row.warehouse_id = undefined
        row.freight_template_id = undefined
        row.ship_days = undefined

        row.variations.forEach((item) => {
          item.target_price = this.minPrice(row, item)
        })
      })
    },
    setSiteId() {
      this.list.forEach((item) => {
        item.site_id = this.setting.siteId
      })
    },
    setWarehouseId() {
      this.list.forEach((item) => {
        item.warehouse_id = this.setting.warehouseId
      })
    },
    setFreightTemplateId() {
      this.list.forEach((item) => {
        item.freight_template_id = this.setting.freightTemplateId
      })
    },
    setShipDays() {
      this.list.forEach((row) => {
        row.ship_days = this.setting.shipDays
        row.variations.forEach((item) => {
          item.target_price = Math.max(this.minPrice(row, item), item.target_price)
        })
      })
    },
    setStock() {
      let s = Number(this.setting.stock)
      if (!s) {
        return
      }
      this.list.forEach((item) => {
        item.stock = s
      })
    },
    deleteRow(row) {
      this.list = this.list.filter((item) => {
        return item !== row
      })
    },
    accountName(row) {
      if (!row.account_id) {
        return ""
      }

      let ac = this.accounts.find((item) => {
        return item.id === row.account_id
      })
      if (!ac) {
        return ""
      }

      return ac.name
    },
    isSemiAccount(accountId) {
      if (!accountId) {
        return false
      }

      let ac = this.accounts.find((item) => {
        return item.id === accountId
      })
      if (!ac) {
        return false
      }

      return ac.is_semi
    },
    selectionChange(val) {
      this.selectRows = val
    },
    minPrice(row, item) {
      if (this.isSemiAccount(row.account_id)) {
        if (row.ship_days === 9) {
          return item.advice_semi_y2_price
        }
        return item.advice_semi_price
      }
      return item.advice_price
    },
    selectCategory(rows) {
      this.dlgCategoryProperties.account_id = this.setting.accountId
      this.dlgCategoryProperties.confirm = (event) => {
        this.submit(rows, event)
      }
      this.dlgCategoryProperties.visible = true
    },
    submit(rows, event) {
      if (rows.length <= 0) {
        this.$message.error("请选择要提交的产品!")
        return
      }

      let list = []
      for (const row of rows) {
        if (!row.account_id) {
          this.$message.error(`${row.id} 没有选择店铺!`)
          return
        }
        if (this.isSemiAccount(row.account_id)) {
          if (!row.freight_template_id) {
            this.$message.error(`${row.id} 没有选择运费模板!`)
            return
          }
          if (!row.warehouse_id) {
            this.$message.error(`${row.id} 没有选择发货仓!`)
            return
          }
          if (!row.site_id) {
            this.$message.error(`${row.id} 没有选择站点!`)
            return
          }
          if (row.ship_days !== 2 && row.ship_days !== 9) {
            this.$message.error(`${row.id} 请选择发货天数!`)
            return
          }
          if (row.stock < 0) {
            this.$message.error(`${row.id} 库存不能小于0!`)
            return
          }
        }

        let data = {}

        data.id = row.id
        data.title = row.title
        data.account_id = row.account_id
        data.site_id = row.site_id
        data.freight_template_id = row.freight_template_id
        data.warehouse_id = row.warehouse_id
        data.ship_days = row.ship_days
        data.stock = row.stock
        data.variations = []
        data.cat_id = event.cat_id
        data.cat_ids = event.cat_ids
        data.properties = event.real_properties

        for (const variation of row.variations) {
          if (variation.target_price <= 0) {
            this.$message.error(`${row.id}-${variation.ext_code} 价格太低了!`)
            return
          }
          data.variations.push({id: variation.id, price: variation.target_price})
        }

        list.push(data)
      }

      this.$confirm('请确认是否一键迁移?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await simpleProductOneKeyTransportUpload(list)
        if (resp.code) {
          return
        }

        for (const row of rows) {
          this.deleteRow(row)
        }
      })
    },
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 80px;
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

::v-deep .el-upload--text {
  width: 100%;
}

</style>