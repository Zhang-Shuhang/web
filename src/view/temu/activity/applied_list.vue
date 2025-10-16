<template>
  <div :class="[is_dlg ? 'height_100' : '']">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in accountOptions" :key="index"
                           :label="`${item.name}(${item.is_semi ? '半托管' : '全托管'})`" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.activity_ids" placeholder="请选择长期活动" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in activityOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.thematic_ids" placeholder="请选择限时活动" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option v-for="(item, index) in thematicOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids，空格分隔" v-model="searchInfo.spu_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids，空格分隔" v-model="searchInfo.skc_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Ids，空格分隔" v-model="searchInfo.sku_ids" clearable filterable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select size="mini" style="width: 100%" v-model="searchInfo.session_status" clearable filterable>
                <el-option label="" :key="0" value=""></el-option>
                <el-option label="未开始" :key="1" :value="1"></el-option>
                <el-option label="进行中" :key="2" :value="2"></el-option>
                <el-option label="已结束" :key="3" :value="3"></el-option>
                <el-option label="申请失败" :key="4" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="4" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="product_id" sortable align="center">
        </el-table-column>
        <el-table-column label="Skc Id" prop="product_skc_id" sortable align="center">
        </el-table-column>
        <el-table-column label="长期活动名" prop="activity.name" align="center">
        </el-table-column>
        <el-table-column label="限时活动名" prop="thematic.name" align="center">
          <div slot-scope="{row}">
            <template v-if="row.thematic">
              <div>
                {{ row.thematic.name }}
              </div>
              <el-tag size="mini" type="primary" effect="dark" v-for="(tag, index) in row.thematic.activity_label_list" :key="index">{{tag}}</el-tag>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="活动时间" prop="start_time" sortable align="center">
          <div slot-scope="{row}">
            {{ new Date(row.start_time).toLocaleString() }} - {{ new Date(row.end_time).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column label="报名时间" prop="created_at" sortable align="center">
          <div slot-scope="{row}">
            {{ new Date(row.created_at).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column label="活动库存" prop="activity_stock" sortable align="center">
        </el-table-column>
        <el-table-column label="剩余活动库存" prop="activity_remain_stock_per" sortable align="center">
          <div slot-scope="{row}">
            <template v-if="!row.can_edit_stock">
              {{row.activity_remain_stock}}
            </template>
            <template v-else>
              <div v-if="edit.id !== row.id" @click="edit.id = row.id; edit.add_stock = 0">
                {{row.activity_remain_stock}}
              </div>
              <div v-else>
                <el-input-number size="mini" style="width: 100%" :min="0" :precision="0" placehodler="输入新增库存" v-model="edit.add_stock"></el-input-number>
                <el-row>
                  <el-col :span="12">
                    <el-button size="mini" type="primary" style="width: 100%" @click="edit.id=undefined">取消</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="mini" type="warning" style="width: 100%" @click="updateAddStock">提交</el-button>
                  </el-col>
                </el-row>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="活动状态" prop="session_status" align="center">
          <div slot-scope="{row}">
            {{sessionStatusName(row.enroll_status, row.session_status)}}
          </div>
        </el-table-column>
        <el-table-column label="活动产品" align="center">
          <el-table-column label="Sku Id" prop="variation_id" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(v, index) in row.variations" :key="index">
                {{ v.variation_id }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="货号" prop="ext_code" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(v, index) in row.variations" :key="index">
                {{ v.ext_code }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="图片" prop="thumb_url" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(v, index) in row.variations" :key="index">
                <template v-if="v.variation">
                  <KdxImage :src="v.variation.thumb_url"></KdxImage>
                </template>
              </div>
            </div>
          </el-table-column>
          <el-table-column label="日常价" prop="daily_price" align="center">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(v, index) in row.variations" :key="index">
                {{ (v.daily_price/100).toFixed(2) }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="活动价" prop="activity_price" align="center" width="240px">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(v, index) in row.variations" :key="index">
                {{ (v.activity_price/100).toFixed(2) }}

                <div>
                  <el-button size="mini" type="danger" v-if="editPrice.variation !== v" @click="startEditPrice(row, v)">
                    调价
                  </el-button>
                  <div v-else>

                    <el-input-number size="mini" style="width: 100%" :min="2" :precision="2" :step="0.01"
                                     :max="v.activity_price/100-0.01" placehodler="输入新价格"
                                     v-model="editPrice.price"></el-input-number>
                    <el-row>
                      <el-col :span="8">
                        <el-button size="mini" type="primary" style="width: 100%" @click="editPrice.variation=undefined">取消
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="danger" style="width: 100%" plain @click="rejectPrice(row.product_id)">拒调价</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="danger" style="width: 100%" @click="updateItemPriceByActivityId">
                          提交
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" prop="activity_price" align="center">
          <div slot-scope="{row}">
            <el-button type="primary" size="mini" style="width: 100%" @click="openDaily(row)" plain>
              订单统计
            </el-button>
            <el-button type="danger" size="mini" style="width: 100%" @click="applyLeaveActivity(row.id)" plain v-if="row.enroll_status !== 2 && (row.session_status === 1 || row.session_status === 2)">
              申请退出活动
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
import {activityAddStock, activityAppliedProductList, activityLeave, activityList} from "@/api/temu/activity";
import TemuDlgMultiDaily from "@/view/temu/sale/components/dlg_multi_daily.vue";
import StartBrowser from "@/view/temu/components/start_browser.vue";
import {itemUpdatePrice} from "@/api/temu/sale_item";
import {priceAdjustRejectById} from "@/api/temu/price_adjust";

export default {
  name: 'TemuActivityAppliedList',
  components: {
    StartBrowser,
    TemuDlgMultiDaily,
    KdxImage
  },
  props: {
    spu_ids: {
      type: Array,
    },
    sku_ids: {
      type: Array,
    },
    is_dlg: {
      type: Boolean,
    }
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
      listApi: activityAppliedProductList,

      timeoutId: undefined,

      accountOptions: [],
      activityOptions: [],
      selectRows: [],

      daily: {
        sku_ids: [],
        visible: false,
      },

      edit: {
        id: undefined,
        add_stock: 0,
      },

      editPrice: {
        row: undefined,
        variation: undefined,
        price: undefined,
      }
    }
  },
  computed: {
    thematicOptions() {
      let list = []
      this.activityOptions.forEach((item) => {
        if (item.thematic_list) {
          list.push(...item.thematic_list)
        }
      })
      return list
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
    },
    openDaily(row) {
      this.daily.sku_ids = row.variations.map((item) => {return item.variation_id})
      this.daily.visible = true
    },
    sessionStatusName(enrollStatus, sessionStatus) {
      if (enrollStatus === 2) {
        return "报名失败"
      }

      switch (sessionStatus) {
        case 1:
          return "未开始"
        case 2:
          return "进行中"
        case 3:
          return "已结束"
        case 4:
          return "申请失败/已退出"
      }
      return `未知: ${sessionStatus}`
    },
    async updateAddStock() {
      let resp = await activityAddStock({id: this.edit.id, add_stock: this.edit.add_stock})
      if (resp.code) {
        return
      }
      this.edit.id = undefined
      this.getTableData()
    },
    applyLeaveActivity(id) {
      this.$confirm('请确认是否退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await activityLeave({id: id})
        if (resp.code) {
          return
        }
        this.getTableData()
      })
    },
    startEditPrice(row, variation) {
      this.editPrice.row = row
      this.editPrice.variation = variation
      this.editPrice.price = variation.activity_price / 100
    },
    updateItemPriceByActivityId() {
      // 根据活动id改价
      this.$confirm('确认调整价格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await itemUpdatePrice({
          id: this.editPrice.variation.variation_id,
          price: this.editPrice.price,
          reason: 2,
          activity_invitation_id: this.editPrice.row.id,
          activity_price: this.editPrice.variation.activity_price,
          site_id: 100
        })
        if (resp.code) {
          return
        }
        this.getTableData()
      })
    },
    async rejectPrice(productId) {
      // 批量拒绝调价
      let resp = await priceAdjustRejectById({spu_ids: [productId]})
      if (resp.code) {
        return
      }

      this.$message("拒绝成功!")
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

    this.$set(this.searchInfo, "session_status", 2)

    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })

    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    resp = await activityList()
    if (resp.code === 0) {
      this.activityOptions = resp.data
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