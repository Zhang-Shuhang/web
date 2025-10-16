<template>
  <el-drawer :visible.sync="$attrs.visible" title="活动报名" @opened="onOpened" size="90%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div slot="title" class="title">
      <div style="float: left">
        <span>活动报名</span>
      </div>

      <div style="float: right; width: 80%">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="4">
            <el-select v-model="searchInfo.activity_ids" size="mini" placeholder="请选择长期活动" style="width: 100%" multiple collapse-tags filterable clearable @change="query">
              <el-option v-for="(item, index) in activityOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="4">
            <el-select v-model="searchInfo.thematic_ids" size="mini" placeholder="请选择限时活动" style="width: 100%" multiple collapse-tags filterable clearable @change="query">
              <el-option v-for="(item, index) in thematicOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="24" :sm="6" :lg="4">
            <el-input size="mini" placeholder="Spu/Skc Ids，空格分隔" v-model="searchInfo.spu_ids" @keyup.enter.native="query" style="width: 100%" clearable filterable></el-input>
          </el-col>
          <el-col :xs="24" :sm="6" :lg="4">
            <el-button size="mini" type="primary" @click="query" style="width: 100%">查询</el-button>
          </el-col>
          <el-col :xs="24" :sm="6" :lg="4">
            <el-button size="mini" type="primary" @click="openApplyRecordDlg" style="width: 100%">查看申请列表</el-button>
          </el-col>
          <el-col :xs="24" :sm="6" :lg="4">
            <el-button size="mini" type="danger" @click="rejectAllPrice" style="width: 100%">拒绝当前页所有调价</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-table class="table-body" ref="multipleTable" :data="showTableData" border size="mini" height="90vh" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center"  :selectable="checkSelectable" fixed></el-table-column>
      <el-table-column label="账号" prop="account.name" align="center">
      </el-table-column>
      <el-table-column label="长期活动" prop="activity.name" align="center">
        <div slot-scope="{row}">
          <div @click="setActivityId(row.activity_id)" v-if="row.activity">
            {{ row.activity.name }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="限时活动" prop="thematic.name" align="center">
        <div slot-scope="{row}">
          <template v-if="row.thematic">
            <div @click="setThematicId(row.thematic_id)">
              {{ row.thematic.name }}
            </div>
            <el-tag size="mini" type="primary" effect="dark" v-for="(tag, index) in row.thematic.activity_label_list" :key="index">{{tag}}</el-tag>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="Spu Id" prop="product_id" align="center" width="130">
        <div slot-scope="{row}">
          <div @click="setProductId(row.product_id)">
            <div>
              {{ row.product_id }}
            </div>
            <el-button size="mini" type="primary" @click="openAppliedDlg(row)">查看已报名记录</el-button>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="Skc Id" prop="product_skc_id" align="center" width="110">
      </el-table-column>
      <el-table-column label="图片" align="center" width="90">
        <div slot-scope="{row}">
          <KdxImage :src="row.picture_url"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="开始时间" prop="start_time" align="center" width="130">
        <template #header>
          <div>开始时间</div>
          <div>
            <el-checkbox v-model="onlyStarted" :label="true">仅已开始</el-checkbox>
          </div>
        </template>
        <div slot-scope="{row}">
          <template v-if="row.thematic">
            {{ new Date(row.thematic.start_time).toLocaleString()}}
          </template>
        </div>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time" align="center" width="130">
        <div slot-scope="{row}">
          <template v-if="row.thematic">
            {{ new Date(row.thematic.end_time).toLocaleString()}}
          </template>
        </div>
      </el-table-column>
<!--      <el-table-column label="折扣比例" prop="discount" align="center">-->
<!--        <div slot-scope="{row}">-->
<!--          <el-tag size="mini" type="primary">{{100-row.discount}}%</el-tag>-->
<!--        </div>-->
<!--      </el-table-column>-->
      <el-table-column label="目标库存" prop="target_activity_stock" align="center">
      </el-table-column>

      <el-table-column label="报名" align="center">
        <el-table-column label="Sku Id" align="center" width="110">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.variations" :key="index">
              <div>
                <el-tag size="mini" type="primary">{{v.product_sku_id}}</el-tag>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="货号" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.variations" :key="index">
              <el-tag size="mini" type="primary">{{v.ext_code}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="原价" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.variations" :key="index">
              <div>
                {{(v.daily_price/100).toFixed(2)}}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="目标价格" prop="suggest_activity_price" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.variations" :key="index">
              <div v-if="v.suggest_activity_price">
                {{(v.suggest_activity_price/100).toFixed(2)}}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="公司建议价格" prop="min_price" align="center">
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.variations" :key="index">
              <el-tag size="mini" type="danger" effect="dark" v-if="v.min_price">
                {{v.min_price.toFixed(2)}}
              </el-tag>
            </div>
          </div>
        </el-table-column>

        <el-table-column label="申请价格" prop="applied_price" align="center" width="130">
          <template #header>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div>申请价格</div>
              <el-input-number v-model="appliedPriceLowerBound" class="header-num-input" size="mini" style="width: 45%" placeholder=">=" :controls="false" @change="handleChangePriceLowerBound"></el-input-number>
            </div>
          </template>
          <div class="item-container" slot-scope="{row}">
            <div :class="index+1 === row.variations.length ? [`item`] : [`item`, `item-bottom`]" v-for="(v, index) in row.variations" :key="index">
              <el-input-number size="mini" style="width: 100%" :min="v.suggest_activity_price/5/100" :max="v.suggest_activity_price/100" :precision="2" placehodler="输入活动库存数量" v-model="v.applied_price"></el-input-number>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="申请库存" prop="activity_stock" align="center" width="120">
          <div slot-scope="{row}">
            <template>
              <el-input-number size="mini" style="width: 100%" :min="row.target_activity_stock" :precision="0" placehodler="输入活动库存数量" v-model="row.applied_stock"></el-input-number>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="操作" prop="sign_up_time" align="center">
          <div slot-scope="{row}">
            <template v-if="row.thematic">
              <div v-if="(new Date().getTime()) < row.thematic.start_time">
                <el-tag size="mini" type="danger" effect="dark">未开始</el-tag>
              </div>
            </template>
            <div>
              <el-button size="mini" :type="isPriceLowThanMinPrice(row) ? 'warning':'success'" style="width: 100%" @click="apply([row])">申请</el-button>
            </div>
            <div>
              <el-button size="mini" type="danger" style="width: 100%" plain @click="rejectPrice(row.product_id)">拒绝调价</el-button>
            </div>
          </div>
        </el-table-column>
      </el-table-column>
    </el-table>

    <div style="height: 120px; width: 150px; position: absolute; right: 20px; bottom: 300px; z-index: 9999; display: flex; flex-direction: column; align-items: center; gap: 6px;" v-if="selectRows.length">
      <el-button size="medium" type="warning" style="margin: 0;" @click="handBatchChangeAppliedPrice">批量修改申请价格</el-button>
      <el-button size="medium" type="warning" style="margin: 0;" @click="handBatchChangeAppliedStock">批量修改申请库存</el-button>
      <el-button size="lager" type="success" style="width: 100%; margin: 0; zoom: 1.1" @click="apply(selectRows)">批量报名</el-button>
    </div>

    <TemuDlgActivityAppliedList :spu_ids="dlgActivityAppliedProduct.spu_ids" :visible="dlgActivityAppliedProduct.visible" @close="dlgActivityAppliedProduct.visible=false" v-if="dlgActivityAppliedProduct.visible"></TemuDlgActivityAppliedList>
    <TemuDlgActivityApplyList :visible="dlgApplyRecord.visible" @close="dlgApplyRecord.visible=false"></TemuDlgActivityApplyList>
  </el-drawer>
</template>

<script>

import KdxImage from "@/components/image/image.vue";
import {activityApply, activityProduct} from "@/api/temu/activity";
import TemuDlgActivityAppliedList from "@/view/temu/activity/components/dlg_activity_applied_list.vue";
import {priceAdjustRejectById} from "@/api/temu/price_adjust";
import TemuDlgActivityApplyList from "@/view/temu/activity/components/dlg_activity_apply_list.vue";

export default {
  name: 'TemuDlgActivityProducts',
  components: {TemuDlgActivityApplyList, TemuDlgActivityAppliedList, KdxImage},
  props: {
    ids: {
      type: Array,
    },
  },
  watch: {
    content() {
    },
  },
  computed: {
    showTableData() {
      let list = this.tableData
      if (this.searchInfo.activity_ids && this.searchInfo.activity_ids.length > 0) {
        list = list.filter((item) => {
          return this.searchInfo.activity_ids.indexOf(item.activity_id) >= 0
        })
      }
      if (this.searchInfo.thematic_ids && this.searchInfo.thematic_ids.length > 0) {
        list = list.filter((item) => {
          return this.searchInfo.thematic_ids.indexOf(item.thematic_id) >= 0
        })
      }
      if (this.onlyStarted) {
        let ctime = new Date().getTime()
        list = (list || []).filter((item) => {
          return item.thematic && ctime >= item.thematic.start_time
        })
      }
      return list
    },
    activityOptions() {
      if (!this.tableData) {
        return []
      }

      let list = []
      let ids = this.tableData.map(item => item.activity_id)
      for (const d of this.tableData) {
        if (d.activity && ids.indexOf(d.activity_id) >= 0) {
          list.push(d.activity)
          ids = ids.filter((id) => {return id !== d.activity_id})
          if (ids.length <= 0) {
            break
          }
        }
      }
      return list
    },
    thematicOptions() {
      if (!this.tableData) {
        return []
      }

      let list = []
      let ids = this.tableData.map(item => item.thematic_id)
      for (const d of this.tableData) {
        if (d.thematic && ids.indexOf(d.thematic_id) >= 0) {
          list.push(d.thematic)
          ids = ids.filter((id) => {return id !== d.thematic_id})
          if (ids.length <= 0) {
            break
          }
        }
      }
      return list
    }
  },
  data() {
    return {
      searchInfo: {},
      tableData: [],
      selectRows: [],
      isMobile: false,

      dlgActivityAppliedProduct: {
        spu_ids: [],
        visible: false,
      },
      dlgApplyRecord: {
        visible: false,
      },

      appliedPriceLowerBound: undefined,
      onlyStarted: false,
      cloneTableData: []
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async query() {
      if (!this.searchInfo.spu_ids) {
        this.$message.error("请输入 Spu/Skc Ids")
        return
      }

      let resp = await activityProduct({spu_ids: this.searchInfo.spu_ids})
      if (resp.code) {
        return
      }

      for (const d of (resp.data || [])) {
        d.applied_stock = d.target_activity_stock
        d.variations = d.variations || []
        for (const v of d.variations) {
          v.applied_price = v.suggest_activity_price / 100
        }
      }

      this.tableData = resp.data
      this.cloneTableData = JSON.parse(JSON.stringify(resp.data))
    },
    onOpened() {
      this.onlyStarted = false
      if (this.ids) {
        this.$set(this.searchInfo, "spu_ids", this.ids.join(" "))
        if (this.ids.length <= 5) {
          this.query()
          return
        }
      } else {
        this.$set(this.searchInfo, "spu_ids", "")
      }
      this.$message("Sku过多，未自动查询，选择活动后自动查询")
    },
    handleChangePriceLowerBound() {
      if(this.appliedPriceLowerBound) this.tableData = this.cloneTableData.filter(item => item.variations.every(el => el.applied_price >= this.appliedPriceLowerBound));
      else this.tableData = this.cloneTableData
    },
    async handBatchChangeAppliedPrice() {
      try {
        const { value } = await this.$prompt('要将申请价格批量改为？', '提示', {
          inputType: 'number',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        });

        const hasMultiVariations = this.tableData.some(item => item.variations.length > 1);
        if (hasMultiVariations) {
          try {
            await this.$confirm('检测到存在单条数据对应多个申请价格的情况，是否一并执行批量修改？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            });
            this.tableData.forEach(item => item.variations.forEach(v => v.applied_price = value));
          } catch {
            this.tableData.forEach(item => {
              if (item.variations.length === 1) {
              item.variations[0].applied_price = value;
              }
            });
          }
        } else {
          this.tableData.forEach(item => {
            if (item.variations.length === 1) {
              item.variations[0].applied_price = value;
            }
          });
        }
        this.$message({
          type: 'success',
          message: '修改成功'
        });
      } catch {
        // 取消 prompt，无操作
      }
    },
    handBatchChangeAppliedStock() {
      this.$prompt('要将申请库存批量改为？', '提示', {
        inputType: 'number',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.tableData.forEach(item => item.applied_stock = value);

        this.$message({
          type: 'success',
          message: '修改成功'
        });
      })
    },
    appliedPrice(applied, skuId) {
      let v = applied.variations.find((item) => {
        return item.variation_id === skuId
      })
      if (!v) {
        return `未知价格: ${skuId}`
      }
      return (v.activity_price/100).toFixed(2)
    },
    setActivityId(id) {
      this.$set(this.searchInfo, "activity_ids", [id])
    },
    setThematicId(id) {
      this.$set(this.searchInfo, "thematic_ids", [id])
    },
    setProductId(id) {
      this.$set(this.searchInfo, "spu_ids", [id].join(" "))
      this.query()
    },
    async apply(rows) {
      let hasLowPrice = false
      for (const row of rows) {
        if (this.isPriceLowThanMinPrice(row)) {
          hasLowPrice = true
          break
        }
      }

      if (hasLowPrice) {
        this.$confirm('存在价格低于公司建议申报价格，产品价格过低会进行通报，如需要调低建议价，请联系周总，请确认是否申请!', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.doApply(rows)
        })
      } else {
        await this.doApply(rows)
      }
    },
    async rejectPrice(productId) {
      // 批量拒绝调价
      let resp = await priceAdjustRejectById({spu_ids: [productId]})
      if (resp.code) {
        return
      }

      this.$message("拒绝成功!")
    },
    async rejectAllPrice() {
      let spuIds = []
      for (const d of (this.tableData || [])) {
        if (spuIds.indexOf(d.product_id) < 0) {
          spuIds.push(d.product_id)
        }
      }
      if (spuIds.length <= 0) {
        this.$message("没有需要拒绝的")
        return
      }
      // 批量拒绝调价
      let resp = await priceAdjustRejectById({spu_ids: spuIds})
      if (resp.code) {
        return
      }

      this.$message("拒绝成功!")
    },
    openApplyRecordDlg() {
      this.dlgApplyRecord.visible = true
    },
    async doApply(rows) {
      let list = []

      for (const row of rows) {
        if (row.applied_stock <= 0) {
          this.$message.error("请输入申请数量")
          return
        }

        let data = {id: row.id, stock: row.applied_stock, sku_list: []}
        for (const v of row.variations) {
          data.sku_list.push({
            id: v.product_sku_id,
            price: v.applied_price,
          })
        }
        list.push(data)
      }
      if (list.length <= 0) {
        this.$message.error("请选择需要申请的产品")
        return
      }

      let resp = await activityApply(list)
      if (resp.code) {
        return
      }

      if (resp.data.has_duplicate) {
        this.$message.error("部分活动已经加入申请列表")
      } else {
        this.$message("加入申请列表成功")
      }

      this.$emit("update")
      if (this.tableData.length <= 0) {
        this.handleBeforeClose()
      }
    },
    selectionChange(val) {
      this.selectRows = val
    },
    checkSelectable(row) {
      return !row.applied && !this.isPriceLowThanMinPrice(row)
    },
    openAppliedDlg(row) {
      this.dlgActivityAppliedProduct.spu_ids = [row.product_id]
      this.dlgActivityAppliedProduct.visible = true
    },
    isPriceLowThanMinPrice(row) {
      for (const variation of row.variations) {
        if (variation.min_price <= 0) {
          return true
        }
        if (variation.applied_price < variation.min_price) {
          return true
        }
      }
      return false
    },
  },
  filters: {},
  async created() {
    this.$bus.on('mobile', isMobile => {
      this.isMobile = isMobile
    })
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-drawer__body {
  padding: 10px;
}

::v-deep .el-tabs__content {
  display: none;
}
::v-deep .el-drawer__header {
  margin-bottom: 12px;
}
.header-num-input ::v-deep .el-input__inner {
  padding: 0;
}

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 30px;
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

</style>