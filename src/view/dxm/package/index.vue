<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-select size="mini" v-model="searchInfo.state" filterable style="width: 100%">
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in stateOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-input size="mini" placeholder="卖家名" v-model="searchInfo.seller_name" clearable filterable>
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-input size="mini" placeholder="包裹号" v-model="searchInfo.package_ids" clearable filterable>
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-input size="mini" placeholder="订单号" v-model="searchInfo.order_ids" clearable filterable>
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-input size="mini" placeholder="跟踪号" v-model="searchInfo.tracking_numbers" clearable filterable>
            </el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSync">同步店小秘</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length > 0">
            <el-popover placement="bottom" trigger="click">
              <el-input-number v-model="createWithCount" :min="0" :precision="0" size="mini"
                               placeholder="请输入产品数量, 以便" style="width: 100%"></el-input-number>
              <el-button size="mini" style="width: 100%" type="primary" @click="createY2Task" :disabled="createWithCount<=0">创建</el-button>
              <el-button slot="reference" size="mini" type="primary" style="width: 100%">创建Y2任务</el-button>
            </el-popover>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length > 0">
            <el-button size="mini" style="width: 100%" type="primary" @click="notifyY2Task">图纸提醒</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column align="center" label="平台" prop="platform">
        </el-table-column>
        <el-table-column align="center" label="包裹号" prop="id">
          <template slot="header">
            <div>包裹号</div>
            <el-button size="mini" type="primary" @click="copySelect('id')" v-if="selectRows.length">复制所选
            </el-button>
          </template>
          <div slot-scope="{row}">
            {{ row.id }}
          </div>
        </el-table-column>
        <el-table-column align="center" label="订单号" prop="order_id">
          <template slot="header">
            <div>订单号</div>
            <el-button size="mini" type="primary" @click="copySelect('order_id')" v-if="selectRows.length">复制所选
            </el-button>
          </template>
          <div slot-scope="{row}">
            {{ row.order_id }}
          </div>
        </el-table-column>
        <el-table-column align="center" label="包裹状态" prop="package_state">
          <div slot-scope="{row}">
            {{ stateName(row.package_state) }}
          </div>
        </el-table-column>
        <el-table-column align="center" label="卖家名" prop="seller_name">
        </el-table-column>
        <el-table-column align="center" label="跟踪号" prop="package_track_num" width="350px">
          <template slot="header">
            <div>跟踪号</div>
            <el-button size="mini" type="primary" @click="copySelect('package_track_num')" v-if="selectRows.length">
              复制所选
            </el-button>
          </template>
          <div slot-scope="{row}">
            {{ row.id }}
          </div>
          <div slot-scope="{row}">
            <template v-if="row.package_agent_provider">
              <div>
                <el-tag size="mini" type="primary">
                  {{ row.package_agent_provider }}
                </el-tag>
              </div>
              <div>
                <el-tag size="mini" type="primary">
                  {{ row.package_track_num }}
                </el-tag>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="min_create_time">
          <div slot-scope="{row}">
            {{ new Date(row.min_create_time).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column align="center" label="订单信息">
          <el-table-column align="center" label="货号x数量" prop="sku">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.orders.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(item, index) in row.orders" :key="index">
                {{ item.sku }} x {{ item.count }}
                <div>
                  <el-tag size="mini" type="danger" effect="dark" v-if="item.sku !== item.dxm_goods_sku">商品不匹配
                  </el-tag>
                </div>
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="图片" prop="img">
            <div class="item-container" slot-scope="{row}">
              <div :class="index+1 === row.orders.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(item, index) in row.orders" :key="index">
                <KdxImage :src="item.img"></KdxImage>
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100px">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%" type="primary" @click="print(row)" v-if="row.package_track_num">
              打印
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
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import TemuDlgDaily from "@/view/temu/sale/components/dlg_daily.vue";
import {dxmPackageList, dxmPackagePrint} from "@/api/dxm/dxm_package";
import {semiOrderCreateY2Task, semiOrderNotifyY2Task} from "@/api/temu/semi_order";
import {dxmSync} from "@/api/dxm/sync";

export default {
  components: {
    TemuDlgDaily,
    KdxImage
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (this.timeout) {
          clearTimeout(this.timeout)
          this.timeout = undefined
        }
        this.timeout = setTimeout(() => {
          this.onSubmit()
        }, 1000)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: dxmPackageList,
      stateOptions: [
        {id: "paid", name: "待审核"},
        {id: "approved", name: "待处理"},
        {id: "processed", name: "运单号申请"},
        {id: "allocated_has", name: "有货"},
        {id: "allocated_out", name: "缺货"},
        {id: "shipped", name: "已发货"},
        {id: "refound", name: "已退款"},
        {id: "未付款", name: "未付款"},
        {id: "已忽略", name: "已忽略"},
      ],

      timeout: undefined,
      createWithCount: 0,

      selectRows: [],
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await dxmSync()
      if (resp.code !== 0) {
        return
      }

      if (resp.data) {
        this.$message("同步成功，请不要过快同步")
      } else {
        this.$message("同步失败，请稍后再试")
      }
    },
    createY2Task() {
      this.$confirm("请确实是否创建?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let resp = await semiOrderCreateY2Task({
          ids: this.selectRows.map((item) => {
            return item.id
          }), count: this.createWithCount
        })
        if (resp.code) {
          return
        }

        this.$message("创建成功")
        this.getTableData()
      })
    },
    async notifyY2Task() {
      let resp = await semiOrderNotifyY2Task({
        ids: this.selectRows.map((item) => { return item.id })
      })
      if (resp.code) {
        return
      }

      this.$message("推送成功")
    },
    stateName(state) {
      let op = this.stateOptions.find((item) => {
        return item.id === state
      })
      if (!op) {
        return `未知 ${state}`
      }
      return op.name
    },
    async print(row) {
      let resp = await dxmPackagePrint({id: row.id})
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank");
    },
    selectionChange(val) {
      this.selectRows = val

      if (!val) {
        return
      }

      this.copySelect('id')
    },
    copySelect(key) {
      let ids = this.selectRows.map((item) => {
        return item[key]
      }).filter((item) => {
        return item !== ""
      })
      if (ids.length > 0) {
        this.copy(ids.join(" "))
      }
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
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
  }

  .item-bottom {
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    font-weight: 900;
    height: 0px;
    line-height: 0px;
    padding-bottom: 0;
    padding-top: 0;
  }
}
</style>