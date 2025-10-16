<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.accounts" placeholder="请选择账号" multiple collapse-tags filterable
                         clearable style="width: 100%">
                <el-option value=""></el-option>
                <template v-for="(item, index) in accountOptions">
                  <el-option :key="index" :label="item.name" :value="item.id" v-if="item.is_semi"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.ship_start_at" format="yyyy/MM/dd"
                              value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="发货开始时间"
                              unlink-panels clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-date-picker type="date" v-model="searchInfo.ship_end_at" format="yyyy/MM/dd" value-format="yyyy/MM/dd"
                              :style="{width: '100%'}" placeholder="发货结束时间" unlink-panels
                              clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="订单id，空格分隔" v-model="searchInfo.order_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="包裹号(PK-)，空格分隔" v-model="searchInfo.pk_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="物流追踪号，空格分隔" v-model="searchInfo.tracking_numbers" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.delivery_type" placeholder="请选择下单类型" multiple filterable clearable
                         style="width: 100%">
                <el-option label="线下单" :value="1"></el-option>
                <el-option label="在线下单" :value="2"></el-option>
                <el-option label="合作仓发货" :value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_end" placeholder="是否妥投" filterable clearable style="width: 100%">
                <el-option label="已妥投" :value="1"></el-option>
                <el-option label="未妥投" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_damage" placeholder="是否有损坏退货" filterable clearable style="width: 100%">
                <el-option label="有损坏退货" :value="1"></el-option>
                <el-option label="没有损坏退货" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小花费天数" v-model.number="searchInfo.cost_min"
                        clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大花费天数" v-model.number="searchInfo.cost_max"
                        clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最小节点数"
                        v-model.number="searchInfo.min_node_count" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-input size="mini" style="width: 100%" placeholder="最大节点数"
                        v-model.number="searchInfo.max_node_count" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-col>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-input size="mini" style="width: 100%" placeholder="最后追踪信息"
                      v-model.number="searchInfo.last_content" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <template v-if="canSubmitList.length > 0">
            <el-col :xs="8" :sm="3" :lg="3">
              <el-button type="danger" size="mini" style="width: 100%" @click="submitAppeal(canSubmitList, 2)" plain>
                批量申请丢失
              </el-button>
            </el-col>
            <el-col :xs="8" :sm="3" :lg="3">
              <el-button type="danger" size="mini" style="width: 100%" @click="submitAppeal(canSubmitList, 6)" plain>
                批量申请损坏
              </el-button>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" align="center" prop="account.name" sortable="custom">
        </el-table-column>
        <el-table-column label="运单号" align="center" prop="id" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            <el-link size="mini" type="primary" :href="`https://www.track123.com/cn/track?code=&trackNos=${row.id}`"
                     :underline="false" target="_blank">
              {{ row.id }}
            </el-link>
          </div>
        </el-table-column>
        <el-table-column label="订单id" align="center" prop="order_id" sortable="custom">
        </el-table-column>
        <el-table-column label="包裹号" align="center" prop="package_sn" sortable="custom">
        </el-table-column>
        <el-table-column label="物流商" align="center" prop="ship_company.name" sortable="custom">
        </el-table-column>
        <el-table-column label="发货时间" align="center" prop="shipping_time" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            {{ new Date(row.shipping_time).toLocaleString() }}
          </div>
        </el-table-column>
        <el-table-column label="最后信息" align="center" prop="last_content" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            <template v-if="row.last_content">
              {{ row.last_content }}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="最后信息时间" align="center" prop="last_content_time" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            <template v-if="row.last_content_time">
              {{ new Date(row.last_content_time).toLocaleString() }}
            </template>
          </div>
        </el-table-column>
        <el-table-column label="未更新天数" align="center" prop="not_update_days" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            {{ row.not_update_days.toFixed(2) }}
          </div>
        </el-table-column>
        <el-table-column label="耗时" align="center" prop="cost_duration" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            {{ row.cost_duration.toFixed(2) }}
          </div>
        </el-table-column>
        <el-table-column label="是否妥投" align="center" prop="is_end" sortable="custom">
          <div slot-scope="{row}" style="font-size: 12px">
            {{ row.is_end ? "已妥投" : "未妥投" }}
          </div>
        </el-table-column>
        <el-table-column label="节点数" align="center" prop="node_count" sortable="custom">
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <div slot-scope="{row}">
            <div v-if="canSubmit(row)">
              <div>
                <el-button type="danger" size="mini" style="width: 100%" @click="submitAppeal([row], 2)" plain>
                  申请丢失
                </el-button>
              </div>
              <div>
                <el-button type="danger" size="mini" style="width: 100%" @click="submitAppeal([row], 6)" plain>
                  申请损坏
                </el-button>
              </div>
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
import {accountList} from "../../../api/temu/account";
import {
  semiOrderCancelList, semiOrderSubmitAppealInfo, semiOrderTrackList
} from "@/api/temu/semi_order";

export default {
  components: {},
  mixins: [infoList],
  data() {
    return {
      listApi: semiOrderTrackList,
      accountOptions: [],
      selectRows: [],
    }
  },
  computed: {
    canSubmitList() {
      if (!this.selectRows) {
        return []
      }
      return this.selectRows.filter((row) => {
        return this.canSubmit(row)
      })
    },
  },
  methods: {
    semiOrderCancelList,
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    isUsps(row) {
      return row.ship_company_id === 960246690
    },
    isFedex(row) {
      return row.ship_company_id === 699272611
    },
    canSubmit(row) {
      return (this.isUsps(row) || this.isFedex(row)) && (row.delivery_type === 2 || row.delivery_type === 4)
    },
    submitAppeal(rows, appeal_type) {
      this.$confirm("请确认是否提交?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await semiOrderSubmitAppealInfo({
          pk_ids: rows.map(item => item.package_sn),
          appeal_type: appeal_type
        });
        if (res.code) {
          return
        }
        this.$message("操作成功")
      })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    },
    selectionChange(val) {
      this.selectRows = val

      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.id
      })
      this.copy(ids.join("\n"))
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
    this.pageSize = 100
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
</style>