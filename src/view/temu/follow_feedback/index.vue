<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account_ids" placeholder="请选择账号" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.categories" placeholder="请选择类目" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Id" v-model="searchInfo.spu_id" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Id" v-model="searchInfo.skc_id" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Id" v-model="searchInfo.sku_id" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="最小价格" v-model="searchInfo.min_price" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="最大价格" v-model="searchInfo.max_price" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="是否限制备货" v-model="searchInfo.is_restricted" filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="未限制备货" :value="1"></el-option>
                <el-option label="限制备货" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="最大库存" v-model="searchInfo.max_stock" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="能否跟价" v-model="searchInfo.can_follow" filterable clearable style="width: 100%">
                <el-option value=""></el-option>
                <el-option label="能跟价" :value="1"></el-option>
                <el-option label="不能跟价" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="跟价结果" v-model="searchInfo.follow_result_labels" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in followResultLabelOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="反馈进度" v-model="searchInfo.feedback_status" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in feedbackStatusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.sku_code" clearable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSync">同步</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onBatchTj">批量调价</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column align="center" label="账号" prop="account.name">
        </el-table-column>
        <el-table-column align="center" label="Spu Id" prop="productId" sortable="custom">
        </el-table-column>
        <el-table-column align="center" label="Skc Id" prop="item.sale.product_skc_id">
        </el-table-column>
        <el-table-column align="center" label="Sku Id" prop="dimensionId" sortable="custom">
          <template slot-scope="{row}">
            {{row.dimensionId}}
            <div>
              <el-tag size="mini" type="warning" effect="dark">{{levelName(row.item)}}</el-tag>
            </div>
            <div v-if="row.item">
              <template v-if="row.item.daily_history">
                <el-tag size="mini" type="primary">库存: {{row.item.sales_inventory_num}}</el-tag>
                <el-tag size="mini" type="primary">7系: {{row.item.daily_history.seven_day_coef.toFixed(1)}}</el-tag>
              </template>
            </div>
            <div>
              <el-button size="mini" type="primary" @click="openDaily(row.dimensionId)">订单</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="货号" prop="item.sku_ext_code">
        </el-table-column>
        <el-table-column align="center" label="类目" prop="item.sale.category">
        </el-table-column>
        <el-table-column align="center" label="图片">
          <template slot-scope="{row}">
            <KdxImage :src="row.item_image.image" v-if="row.item_image"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column align="center" label="竞品图片">
          <template slot-scope="{row}">
            <KdxImage :src="img" v-for="(img, index) in row.compareImages" :key="index"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column align="center" label="原价" prop="supplyPrice">
          <template slot-scope="{row}">
            <el-tag size="mini" type="primary">{{(row.supplyPrice/100).toFixed(2)}}</el-tag>

            <div v-if="row.item">
              <el-tag size="mini" type="primary" effect="dark">当前价格: {{row.item.currency_type}} {{(row.item.supplier_price/100).toFixed(2)}}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="目标价" prop="targetSupplyPrice" sortable="custom">
          <template slot-scope="{row}">
            <el-tag size="mini" type="warning">{{(row.targetSupplyPrice/100).toFixed(2)}}</el-tag>
            <br>
            <el-tag size="mini" type="danger" effect="dark" style="margin-top: 5px">{{((row.targetSupplyPrice-row.supplyPrice)/100).toFixed(2)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跟价结果">
          <template slot-scope="{row}">
            <el-tag size="mini" type="primary">{{followResultLabel(row.followResultLabel)}}</el-tag>

            <div v-if="row.isRestricted">
              <el-tag size="mini" type="danger">限制备货</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="反馈进度">
          <template slot-scope="{row}">
            <el-tag size="mini" type="primary">{{ feedbackStatus(row.feedBackStatus) }}</el-tag>
            <div v-if="row.feedBackStatus === 0">
              <el-tag size="mini" type="danger">{{new Date(row.endTime).toLocaleString()}} 前可反馈</el-tag>
            </div>
            <div>
              <el-tag v-for="(tp, index) in row.nonSimilarTypeList" size="mini" type="primary" effect="dark" :key="index">
                非同款类型：{{nonSimilarTypeName(tp)}}
              </el-tag>
              <div v-if="row.nonSimilarOtherTypeDesc">
                非同款描述：{{row.nonSimilarOtherTypeDesc}}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-popover placement="left" trigger="click" v-if="row.feedBackStatus === 0">
              <div style="width: 700px">
                <el-row :gutter="10">
                  <el-col :span="12">
                    <KdxImage :src="row.item_image.image" width="100%" height="100%" v-if="row.item_image"></KdxImage>
                  </el-col>
                  <el-col :span="12">
                    <KdxImage :src="img" width="100%" height="100%" v-for="(img, index) in row.compareImages" :key="index"></KdxImage>
                  </el-col>
                </el-row>
                <el-radio-group v-model="non_similar_type" size="medium" style="margin-top: 5px">
                  <el-radio :label="op.id" v-for="(op, index) in nonSimilarOptions" :key="index">{{op.name}}</el-radio>
                </el-radio-group>
                <el-input v-model="non_similar_type_desc" v-if="non_similar_type === '6'" type="textarea" :rows="5" style="margin-top: 5px"></el-input>
                <el-button style="width: 100%; margin-top: 15px; height: 40px" type="primary" @click="feedback(row)">提交</el-button>
              </div>
              <el-button slot="reference" size="mini" style="width: 100%" type="warning">反馈</el-button>
            </el-popover>
            <el-button v-if="row.followResultLabel !== 5" size="mini" style="width: 100%; margin-top: 5px" type="danger" @click="feedbackAgain(row)">跟价</el-button>
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" @click="openJpDlg(row)">查看关联款</el-button>
          </template>
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

      <el-drawer size="30%" :visible.sync="dlg_jp.visible" center :modal-append-to-body="true" :append-to-body="true">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>确定关联款</span>
          </div>
          <div>
            <el-table class="table-body" ref="multipleTable" :data="dlg_jp.list" border @sort-change="sortChange"
                      size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
              <el-table-column align="center" label="账号" prop="sale.account.name">
              </el-table-column>
              <el-table-column align="center" label="Sku Id" prop="id">
              </el-table-column>
              <el-table-column align="center" label="类目" prop="sale.category">
              </el-table-column>
              <el-table-column align="center" label="货号" prop="sku_ext_code">
              </el-table-column>
              <el-table-column align="center" label="价格" prop="supplier_price">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="primary">{{(row.supplier_price/100).toFixed(2)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="图片">
                <template slot-scope="{row}">
                  <KdxImage :src="row.item_image.image" v-if="row.item_image"></KdxImage>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>疑似关联款</span>
          </div>
          <div>
            <el-table class="table-body" ref="multipleTable" :data="dlg_jp.list2" border @sort-change="sortChange"
                      size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
              <el-table-column align="center" label="账号" prop="sale.account.name">
              </el-table-column>
              <el-table-column align="center" label="Sku Id" prop="id">
              </el-table-column>
              <el-table-column align="center" label="类目" prop="sale.category">
              </el-table-column>
              <el-table-column align="center" label="货号" prop="sku_ext_code">
              </el-table-column>
              <el-table-column align="center" label="价格" prop="supplier_price">
                <template slot-scope="{row}">
                  <el-tag size="mini" type="primary">{{(row.supplier_price/100).toFixed(2)}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="图片">
                <template slot-scope="{row}">
                  <KdxImage :src="row.item_image.image" v-if="row.item_image"></KdxImage>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-drawer>

      <TemuDlgDaily :id="daily.id" :visible="daily.visible" @close="daily.visible=false"></TemuDlgDaily>

      <el-dialog width="45%" :visible.sync="batch_tj.visible" center
                 :modal-append-to-body="true" :append-to-body="true">
        <el-form class="table-form" ref="elForm"  size="mini" label-width="100px" label-position="right">
          <el-form-item label="id列表">
            <el-input type="textarea" :rows="5" v-model="batch_tj.ids_content" clearable></el-input>
          </el-form-item>
          <el-form-item label="目标价格">
            <el-input-number :rows="5" v-model="batch_tj.target_price" :min="3" :step="1" :precision="2" style="width: 100%"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button style="height: 50px; margin-top: 20px; width: 100%" type="primary" @click="confirmBatchTj">确认</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {accountList} from "../../../api/temu/account";
import {
  followFeedbackAgain,
  followFeedbackList,
  followFeedbackSimilar,
  followFeedbackSimilarProductList,
  followFeedbackSync
} from "@/api/temu/follow_feedback";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";
import {categoryExistList} from "@/api/temu/category";
import {itemUpdatePrice} from "@/api/temu/sale_item";

export default {
  components: {
    TemuDlgDaily,
    KdxImage
  },
  mixins: [infoList],
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
      listApi: followFeedbackList,

      accountOptions: [],
      categoryOptions: [],
      followResultLabelOptions: [
        {id: 2, name: "跟价成功-超时自动确认"},
        {id: 5, name: "跟价成功-卖家人工确认跟价"},
        {id: 3, name: "跟价成功"},
        {id: 4, name: "跟价失败-超时自动拒绝"},
        {id: 1, name: "跟价失败-卖家人工拒绝跟价"},
      ],
      feedbackStatusOptions: [
        {id: 0, name: "待反馈"},
        {id: 1, name: "已反馈"},
        {id: 2, name: "反馈成功"},
        {id: 3, name: "反馈失败1"},
        {id: 4, name: "反馈失败2"},
        {id: 9, name: "已超期"},
      ],
      nonSimilarOptions: [
        {id: "0", name: "类目"},
        {id: "1", name: "款式"},
        {id: "2", name: "版型"},
        {id: "3", name: "图案"},
        {id: "4", name: "颜色"},
        {id: "5", name: "品牌"},
        {id: "6", name: "其他原因"},
      ],
      dlg_jp: {
        list: undefined,
        list2: undefined,
        visible: false,
      },

      levelOptions: [
        {id: 7, name: "超级爆品"},
        {id: 6, name: "大爆品"},
        {id: 5, name: "中爆品"},
        {id: 4, name: "小爆品"},
        {id: 3, name: "3类品"},
        {id: 2, name: "2类品"},
        {id: 1, name: "1类品"},
        {id: 0, name: "新品"},
        {id: -1, name: "淘汰1类"},
        {id: -2, name: "淘汰2类"},
        {id: -3, name: "淘汰3类"},
        {id: -10, name: "已下架"},
      ],

      selectRows: [],

      non_similar_type: 0,
      non_similar_type_desc: "",

      daily: {
        id: undefined,
        visible: false,
      },

      batch_tj: {
        ids_content: "",
        target_price: 100,
        visible: false,
      },
    }
  },
  methods: {
    async onBatchTj() {
      this.batch_tj.visible = true
    },
    async onSync() {
      let resp = await followFeedbackSync()
      if (resp.code) {
        return
      }

      this.$message("同步成功")
      this.getTableData()
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    followResultLabel(status) {
      let item = this.followResultLabelOptions.find((item) => {
        return item.id === status
      })
      if (!item) {
        return "未知状态"
      }
      return item.name
    },
    feedbackStatus(status) {
      let item = this.feedbackStatusOptions.find((item) => {
        return item.id === status
      })
      if (!item) {
        return "未知状态"
      }
      return item.name
    },
    feedback(row) {
      this.$confirm('请确认是否反馈?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await followFeedbackSimilar({id: row.id, non_similar_type: Number(this.non_similar_type), non_similar_other_type_desc: this.non_similar_type_desc})
            if (resp.code) {
              return
            }

            this.$message("操作成功")
            this.getTableData()
          })
    },
    feedbackAgain(row) {
      this.$confirm('请确认是否跟价?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await followFeedbackAgain({id: row.id})
            if (resp.code) {
              return
            }

            this.$message("操作成功")
            this.getTableData()
          })
    },
    async openJpDlg(row) {
      let resp = await followFeedbackSimilarProductList({id: row.id})
      if (resp.code) {
        return
      }

      this.dlg_jp.list = resp.data.list1
      this.dlg_jp.list2 = resp.data.list2
      this.dlg_jp.visible = true
    },
    nonSimilarTypeName(tp) {
      let op = this.nonSimilarOptions.find((item) => {return Number(item.id) === tp})
      if (!op) {
        return `未知: ${tp}`
      }
      return op.name
    },
    openDaily(id) {
      this.daily.id = id
      this.daily.visible = true
    },
    selectionChange(val) {
      this.selectRows = val

      let ids = []
      let skcIds = []
      for (const row of this.selectRows) {
        if (ids.indexOf(row.dimensionId) < 0) {
          ids.push(row.dimensionId)
        }
        if (row.item && row.item.sale && skcIds.indexOf(row.item.sale.product_skc_id) < 0) {
          skcIds.push(row.item.sale.product_skc_id)
        }
      }
      if (ids.length) {
        this.copy(ids.join((" ")))

        this.$message('Skc Ids ' + skcIds.join(" "))
      }
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    levelName(row) {
      if (!row) {
        return "新品"
      }

      if (!row.daily_history) {
        return "新品"
      }

      let item = this.levelOptions.find((item) => {
        return item.id === row.daily_history.level
      })
      if (!item) {
        return "非法"
      }
      return item.name
    },
    confirmBatchTj(){
      if (this.batch_tj.target_price <= 0) {
        this.$message.error("价格有误" + this.batch_tj.target_price)
        return
      }

      let array = this.batch_tj.ids_content.split("\n")
      if (array.length <= 1) {
        array = this.batch_tj.ids_content.split(" ")
      }

      let ids = array.map(function(item) {
        return parseInt(item, 10);
      });
      if (ids.length <= 0) {
        this.$message.error("请输入id列表")
        return
      }

      this.$confirm('是否确认调价?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async ()=>{
            for (const id of ids) {
              let resp = await itemUpdatePrice({id: id, price: this.batch_tj.target_price, reason: 2})
              if (resp.code) {
                return
              }
            }
            this.getTableData()
          })
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    if (this.$route.query && this.$route.query.sku_id) {
      this.$set(this.searchInfo, "sku_id", this.$route.query.sku_id)
    } else {
      this.$set(this.searchInfo, "follow_result_labels", [3])
      this.$set(this.searchInfo, "feedback_status", [0])
    }
    this.pageSize = 100
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    resp = await categoryExistList()
    if (resp.code === 0) {
      this.categoryOptions = resp.data
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
</style>