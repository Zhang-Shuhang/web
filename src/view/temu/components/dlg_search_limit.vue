<template>
  <el-drawer :visible.sync="$attrs.visible" title="高价限流" @opened="onOpened" :size="isMobile ? '100%' : '70%'"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <template v-if="data">
      <el-tabs v-model="searchLimitTab" type="card" :stretch="true" v-if="data.has_search_limit">
        <el-tab-pane label="高价限流中" name="高价限流中"></el-tab-pane>
        <el-tab-pane label="配置" name="配置"></el-tab-pane>
      </el-tabs>

      <div style="padding: 0 25px;">
        <template v-if="searchLimitTab === '高价限流中'">
          <!-- 价格信息 -->
          <div class="price-info">
            <div class="price-card">
              <div class="price-label">原价</div>
              <div class="price-value">
                ¥{{ (data.origin_supply_price / 100).toFixed(2) }}
              </div>
            </div>

            <div class="price-card">
              <div class="price-label">建议价格</div>
              <div class="price-value">
                ¥{{ (data.target_supply_price / 100).toFixed(2) }}
              </div>
            </div>

            <div class="price-card">
              <div class="price-label">建议活动价格</div>
              <div class="price-value">
                ¥{{ (data.suggest_activity_supplier_price / 100).toFixed(2) }}
              </div>
            </div>

            <div class="price-card" v-if="data.site_list">
              <div class="price-label">高价限流站点</div>
              <div class="price-value" style="font-weight: 400 !important; font-size: 12px !important">
                <template v-for="(siteName, index) in data.site_list">
                  <span :key="index*2" v-if="isImportSite(siteName)" style="background-color: orange"> {{siteName}} </span>
                  <span :key="index*2+1" v-else> {{siteName}} </span>
                </template>
              </div>
            </div>

            <div class="price-card" v-if="data.similar_product_image">
              <div class="price-label" v-if="data.similar_product_self">自己同款: {{data.similar_product_sku_id}}</div>
              <div class="price-label" v-else>他人同款: {{data.similar_product_sku_id}}</div>
              <div class="price-value" style="font-weight: 400 !important; font-size: 12px !important">
                <KdxImage :src="data.similar_product_image" width="100%" height="100%"></KdxImage>
              </div>
            </div>
          </div>

          <!-- 顶部操作区域 -->
          <div
              style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding: 15px; background: linear-gradient(90deg, #f0f7ff 0%, #f8fbff 100%); border-radius: 8px;">
            <div>
              <span>需调价数量：</span>
              <span style="font-size: 20px; font-weight: bold; color: #1890ff;">{{ data.adjust_price_count }}</span>
            </div>
            <div v-if="data.adjust_price_count">
              <el-button type="danger" plain @click="rejectAllPriceAdjust">全部拒绝调价</el-button>
            </div>
          </div>

          <!-- 活动表格 -->
          <div class="table-header">
            <h3>活动列表</h3>
            <div>
              <el-row :gutter="5">
                <el-col :span="8">
                  <el-button size="mini" style="width: 100%" type="warning"
                             @click="openActivityProductList(data.product_id)">活动报名
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button size="mini" style="width: 100%" type="warning" @click="openActivityAppliedProductList">
                    活动记录
                  </el-button>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refresh">刷新</el-button>
                </el-col>
              </el-row>
            </div>
          </div>

          <el-table
              :data="data.marketing_activity_price_list"
              border
              stripe
              style="width: 100%; margin-bottom: 80px;"
              :header-cell-style="{ 'background-color': 'black', 'color': '#fff' }"
              height="calc(100vh - 400px)"
          >
            <el-table-column prop="activityInvitationName" label="活动名称" align="center">
              <template slot-scope="{row}">
                <div style="font-size: 12px">{{ row.activityInvitationName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="activityStartTime" label="开始时间" align="center">
              <template slot-scope="{row}">
                {{ new Date(row.activityStartTime).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="activityEndTime" label="结束时间" align="center">
              <template slot-scope="{row}">
                {{ new Date(row.activityEndTime).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="supplyPrice" label="活动价格" align="center">
              <template slot-scope="{row}">
                <!--              <el-input-number :min="info.minLimit" :max="Math.min(info.maxLimit, info.availableBalance)" :step="100" :precision="0" v-model="apply_amount" placeholder="提现金额" style="width: 100%" clearable></el-input-number>-->
                <span class="highlight-cell">¥{{ (row.supplyPrice / 100).toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
              <div slot-scope="{row}">
                <el-tag size="mini" type="primary">剩余库存: {{ row.remainCount }}</el-tag>
                <el-button type="primary" size="mini" @click="addStock(row)">+1</el-button>
              </div>
            </el-table-column>
            <el-table-column label="价格" align="center">
              <div slot-scope="{row}">
                <template v-if="row.supplyPrice >= data.suggest_activity_supplier_price">
                  <el-button size="mini" type="danger" v-if="edit.id !== row.activityInvitationId" @click="startEditPrice(row)">
                    调价
                  </el-button>
                  <div v-else>
                    <el-input-number size="mini" style="width: 100%" :min="2" :precision="2" :step="0.01"
                                     :max="data.suggest_activity_supplier_price/100-0.01" placehodler="输入新价格"
                                     v-model="edit.price"></el-input-number>
                    <el-row>
                      <el-col :span="12">
                        <el-button size="mini" type="primary" style="width: 100%" @click="edit.id=undefined">取消
                        </el-button>
                      </el-col>
                      <el-col :span="12">
                        <el-button size="mini" type="danger" style="width: 100%" @click="updateItemPriceByActivityId">
                          提交
                        </el-button>
                      </el-col>
                    </el-row>
                  </div>
                </template>
              </div>
            </el-table-column>
          </el-table>
        </template>
        <template v-else>
          <el-form class="table-form" ref="elForm" :model="cfg" size="mini" label-width="130px" label-position="left">
            <el-form-item label="自动增加库存">
              <el-input-number size="mini" style="width: 100%" :min="1" :max="5" :precision="0" :step="1" v-model="cfg.add_stock"></el-input-number>
            </el-form-item>
            <el-form-item label="加库存间隔">
              <el-select placeholder="订单类型" v-model="cfg.minute" filterable clearable style="width: 100%">
                <el-option label="3小时" :value="180"></el-option>
                <el-option label="4小时" :value="240"></el-option>
                <el-option label="6小时" :value="360"></el-option>
                <el-option label="8小时" :value="480"></el-option>
                <el-option label="10小时" :value="600"></el-option>
                <el-option label="12小时" :value="720"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="<=该库存自动调价">
              <el-input-number size="mini" style="width: 100%" :min="0" :max="5" :precision="0" :step="1" v-model="cfg.modify_price_if_stock_less"></el-input-number>
            </el-form-item>
            <el-form-item label=">=该价格自动调价">
              <el-input-number size="mini" style="width: 100%" :min="data && data.is_semi ? 5 : 1" :max="1000" :precision="2" :step="0.01" v-model="cfg.min_modify_price"></el-input-number>
            </el-form-item>
            <el-form-item label="下次执行时间" v-if="cfg.next_time">
              {{new Date(cfg.next_time).toLocaleString()}}
            </el-form-item>
            <el-form-item label="">
              <template v-if="cfg.has">
                <el-row :gutter="5">
                  <el-col :span="12">
                    <el-button size="medium" type="danger" style="width: 100%" @click="deleteCfg">删除</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="medium" type="primary" style="width: 100%" @click="updateCfg">更新</el-button>
                  </el-col>
                </el-row>
              </template>
              <template v-else>
                <el-button size="medium" type="primary" style="width: 100%" @click="updateCfg">创建</el-button>
              </template>
            </el-form-item>
          </el-form>

          <el-table
              :data="logs"
              border
              stripe
              style="width: 100%; margin-bottom: 80px; margin-top: 20px"
              :header-cell-style="{ 'background-color': 'black', 'color': '#fff' }"
              height="calc(100vh - 400px)"
          >
            <el-table-column prop="id" label="Id" align="center">
              <template slot-scope="{row}">
                {{row.id}}
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="时间" align="center">
              <template slot-scope="{row}">
                {{ new Date(row.created_at).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="content" label="操作日志" align="center">
              <template slot-scope="{row}">
                {{row.content}}
              </template>
            </el-table-column>
            <el-table-column label="操作用户" align="center">
              <template slot-scope="{row}">
                {{row.user_id || "系统"}}
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </template>

    <TemuDlgActivityProducts :ids="dlgActivityProduct.ids" :visible="dlgActivityProduct.visible"
                             @close="dlgActivityProduct.visible=false"></TemuDlgActivityProducts>
    <TemuDlgActivityAppliedList :sku_ids="dlgActivityAppliedProduct.ids" :visible="dlgActivityAppliedProduct.visible"
                                @close="dlgActivityAppliedProduct.visible=false"
                                v-if="dlgActivityAppliedProduct.visible"></TemuDlgActivityAppliedList>
  </el-drawer>
</template>


<script>
import TemuDlgActivityAppliedList from "@/view/temu/activity/components/dlg_activity_applied_list.vue";
import TemuDlgActivityProducts from "@/view/temu/activity/components/dlg_activity_products.vue";
import {priceAdjustRejectById} from "@/api/temu/price_adjust";
import {activityAddStock} from "@/api/temu/activity";
import {itemUpdatePrice} from "@/api/temu/sale_item";
import {productSearchLimit, productUpdateAutoHandleSearchLimit} from "@/api/temu/product";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgSearchLimit',
  components: {KdxImage, TemuDlgActivityProducts, TemuDlgActivityAppliedList},
  mixins: [],
  props: {
    id: {
      type: Number,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      data: undefined,

      isMobile: false,
      searchLimitTab: "高价限流中",

      dlgActivityProduct: {
        ids: [],
        visible: false,
      },

      dlgActivityAppliedProduct: {
        ids: [],
        visible: false,
      },

      edit: {
        id: undefined,
        row: undefined,
        price: undefined,
      },

      cfg: {
        add_stock: 1,
        minute: 360,
        modify_price_if_stock_less: 0,
        min_modify_price: 10,
        has: false,
        next_time: undefined,
      },

      logs: []
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onOpened() {
      this.refresh()
    },
    async refresh() {
      let resp = await productSearchLimit({id: this.id})
      if (resp.code) {
        this.handleBeforeClose()
        return
      }

      this.data = resp.data

      if (this.data.has_search_limit) {
        this.searchLimitTab = "高价限流中"
      } else {
        this.$message("无高价限流")
        this.searchLimitTab = "配置"
      }

      if (this.data.auto_handle_cfg) {
        this.cfg.add_stock = this.data.auto_handle_cfg.add_stock
        this.cfg.minute = this.data.auto_handle_cfg.minute
        this.cfg.modify_price_if_stock_less = this.data.auto_handle_cfg.modify_price_if_stock_less
        this.cfg.min_modify_price = this.data.auto_handle_cfg.min_modify_price
        this.cfg.has = true
      } else {
        this.cfg.add_stock = 1
        this.cfg.minute = 360
        this.cfg.modify_price_if_stock_less = 0
        if (this.data.is_semi) {
          this.cfg.min_modify_price = this.data.origin_supply_price/100/3
        } else {
          this.cfg.min_modify_price = this.data.origin_supply_price/100/2
        }
        this.cfg.has = false
      }

      this.logs = this.data.auto_handle_cfg_logs || []
    },
    async rejectAllPriceAdjust() {
      // 批量拒绝调价
      let resp = await priceAdjustRejectById({spu_ids: [this.data.product_id]})
      if (resp.code) {
        return
      }

      this.$message("拒绝成功!")
      this.refresh()
    },
    async openActivityProductList(id) {
      this.dlgActivityProduct.ids = [id]
      this.dlgActivityProduct.visible = true
    },
    async openActivityAppliedProductList() {
      this.dlgActivityAppliedProduct.ids = [this.id]
      this.dlgActivityAppliedProduct.visible = true
    },
    startEditPrice(row) {
      this.edit.id = row.activityInvitationId
      this.edit.row = row
      this.edit.price = row.supplyPrice / 100
    },
    updateItemPriceByActivityId() {
      // 根据活动id改价
      this.$confirm('确认调整价格?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // TODO 先写死100
        let resp = await itemUpdatePrice({
          id: this.id,
          price: this.edit.price,
          reason: 2,
          activity_invitation_id: this.edit.row.activityInvitationId,
          activity_price: this.edit.row.supplyPrice,
          site_id: 100
        })
        if (resp.code) {
          return
        }
        this.refresh()
      })
    },
    addStock(row) {
      this.$confirm('确认增加1个库存，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await activityAddStock({id: row.activityInvitationId, add_stock: 1})
        if (resp.code) {
          return
        }
        this.refresh()
      })
    },
    isImportSite(siteName) {
      return siteName === '美国站' ||
          siteName === '英国站' ||
          siteName === '加拿大站' ||
          siteName === '澳大利亚站' ||
          siteName === '日本站' ||
          siteName === '法国站' ||
          siteName === '德国站' ||
          siteName === '西班牙站' ||
          siteName === '波兰站'
    },
    async deleteCfg() {
      let resp = await productUpdateAutoHandleSearchLimit({id: this.id, delete: true})
      if (resp.code) {
        return
      }

      this.$message("删除成功")
      this.refresh()
    },
    async updateCfg() {
      let resp = await productUpdateAutoHandleSearchLimit({id: this.id, add_stock: this.cfg.add_stock, minute: this.cfg.minute, modify_price_if_stock_less: this.cfg.modify_price_if_stock_less, min_modify_price: this.cfg.min_modify_price})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.refresh()
    }
  },
  created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  }
}
</script>
<style scoped lang="scss">
.price-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.price-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(58, 99, 230, 0.08);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.price-card:hover {
  box-shadow: 0 4px 12px rgba(58, 99, 230, 0.15);
}

.price-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #409EFF 0%, #64b5ff 100%);
}

.price-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.price-value {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0 15px 0;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.status-approved {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-rejected {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background-color: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  z-index: 10;
}

.custom-drawer {
  transition: all 0.3s ease;
}

.price-change {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
}

.price-up {
  color: #f56c6c;
}

.price-down {
  color: #67c23a;
}

.highlight-cell {
  font-weight: 600;
  color: #1890ff;
}

@media (max-width: 768px) {
  .card-container, .price-info {
    grid-template-columns: 1fr;
  }

  .dashboard {
    padding: 15px;
    margin: 20px auto;
  }
}

</style>