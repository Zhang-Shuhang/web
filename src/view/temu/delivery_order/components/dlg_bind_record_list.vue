<template>
  <el-drawer :visible.sync="$attrs.visible" title="发货记录" @opened="onOpened" size="90%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        发货记录
      </div>
      <div style="display: block; width: 80%; float: right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select v-model="searchInfo.account_id" size="mini" placeholder="请选择账号" filterable clearable>
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-date-picker size="mini" type="date" v-model="searchInfo.start_at" format="yyyy/MM/dd" value-format="yyyy/MM/dd" placeholder="开始时间" unlink-panels clearable></el-date-picker>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-date-picker size="mini" type="date" v-model="searchInfo.end_at" format="yyyy/MM/dd" value-format="yyyy/MM/dd" placeholder="结束时间" unlink-panels clearable></el-date-picker>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-input size="mini" style="width: 200px" v-model="searchInfo.sub_warehouse_name" placeholder="仓库名" clearable></el-input>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select size="mini" v-model="searchInfo.user_id" placeholder="操作人" allow-create filterable clearable>
              <el-option label="" value=""></el-option>
              <el-option label="自己" :value="-1"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select size="mini" v-model="searchInfo.is_factory" placeholder="是否工厂" filterable clearable>
              <el-option label="" value=""></el-option>
              <el-option label="非工厂" value="1"></el-option>
              <el-option label="工厂" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select size="mini" v-model="searchInfo.is_sync_factory" placeholder="是否同步工厂" filterable clearable>
              <el-option label="" value=""></el-option>
              <el-option label="已同步" value="1"></el-option>
              <el-option label="未同步" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" style="width: 100%" :disabled="!syncList.length" @click="batchSyncFactory">批量同步工厂</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-button size="mini" type="primary" @click="onSubmit" style="width: 100%">查询</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="canSetLogisticList && canSetLogisticList.length > 0">
            <el-button size="mini" type="danger" style="width: 100%" @click="setAutoLogistic(canSetLogisticList)">批量仓库物流</el-button>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="canSetAttachList.length">
            <el-popover placement="left" trigger="click">
              <el-input size="mini" style="width: 100%" v-model="form.attach_to_logistic"></el-input>
              <el-button size="mini" style="width: 100%" type="primary" @click="setAttachToLogistic(canSetAttachList, form.attach_to_logistic)">设置</el-button>
              <el-button slot="reference" size="mini" type="primary" style="width: 100%" plain>批量加入物流</el-button>
            </el-popover>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table class="table-body" ref="multipleTable" :data="tableData" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column label="账号" prop="account.name" align="center">
      </el-table-column>
      <el-table-column label="发货Id列表" prop="ids" align="center">
        <div slot-scope="{row}">
          {{row.ids.join(" ")}}
        </div>
      </el-table-column>
      <el-table-column label="图片" prop="ids" align="center">
        <div slot-scope="{row}">
          <template v-if="row.images">
            <KdxImage :src="image" width="48px" height="48px" v-for="(image, index) in row.images" :key="index" style="display: inline-block"></KdxImage>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="装箱数" prop="package_num" align="center">
      </el-table-column>
      <el-table-column label="产品个数" prop="count" align="center">
        <div slot-scope="{row}">
          {{row.count}}
          <el-popover placement="left" trigger="click">
            <el-input-number size="mini" v-model="row.count" :min="1" :max="10000" :precision="0" style="width: 100%" placeholder="新的数量" clearable></el-input-number>
            <el-button size="mini" style="width: 100%" type="primary" @click="updateBindRecordCount(row)">设置</el-button>
            <el-button slot="reference" size="mini" type="primary" plain>修改</el-button>
          </el-popover>
        </div>
      </el-table-column>
      <el-table-column label="用户" prop="user_id" align="center">
        <div slot-scope="{row}">
          <div @click="setUserId(row)">
            {{row.user_id}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="发货方式" prop="delivery_method" align="center">
        <div slot-scope="{row}">
          <div v-if="row.sub_warehouse_name">
            <el-tag size="mini" type="primary" @click="setSubWarehouseName(row)">收货子仓: {{row.sub_warehouse_name}}</el-tag>
          </div>
          <el-tag size="mini" type="primary">{{row.delivery_method === 1 ? "自行配送" : row.delivery_method === 2 ? "平台物流" : "物流"}}</el-tag>
          <div v-if="row.delivery_method === 1">
            <div v-if="row.attach_to_logistic">
              <el-tag size="mini" type="warning">附带到物流: {{row.attach_to_logistic}}</el-tag>
            </div>
            <el-popover placement="left" trigger="click">
              <el-input size="mini" style="width: 100%" v-model="row.attach_to_logistic"></el-input>
              <el-button size="mini" style="width: 100%" type="primary" @click="setAttachToLogistic([row], row.attach_to_logistic)">设置</el-button>
              <el-button slot="reference" size="mini" type="primary" plain>设置加入物流</el-button>
            </el-popover>
          </div>
          <div v-else>
            <div>
              <el-tag size="mini" type="primary" v-if="row.express_company_name">
                发货物流: {{row.express_company_name}}
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary" v-if="row.express_delivery_sn">
                物流单号: {{row.express_delivery_sn}}
              </el-tag>
            </div>
          </div>
          <div v-if="row.delivery_method === 2">
            <div v-if="!row.auto_logistic || row.auto_logistic.logistic !== row.express_delivery_sn">
              <el-button size="mini" style="width: 100%" type="primary" @click="setAutoLogistic([row])">设置该仓库使用该物流</el-button>
            </div>
            <div v-else>
              <el-tag size="mini" type="warning" effect="dark">仓库物流: {{row.auto_logistic.logistic}}</el-tag>
            </div>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <div slot-scope="{row}">
          {{new Date(row.created_at).toLocaleString()}}
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <div>
            <el-button size="mini" type="danger" @click="print(row, true)">打印箱唛</el-button>
            <el-button size="mini" type="danger" @click="print(row, false)">打印箱唛带其他信息</el-button>
          </div>
          <div v-if="row.is_self_delivery">
            <el-button size="mini" type="danger" @click="printSelfDelivery(row)" style="margin-top: 5px">打印自行配送信息</el-button>
          </div>
          <div v-if="row.is_factory">
            <el-button size="mini" type="success" @click="syncToFactory([row])" style="margin-top: 5px" v-if="row.sync_times">
              同步去工厂({{row.sync_times}})
            </el-button>
            <el-button size="mini" type="primary" @click="syncToFactory([row])" style="margin-top: 5px" v-else>
              同步去工厂
            </el-button>
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
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {
  deliveryOrderAttachToLogistic,
  deliveryOrderBindRecordList,
  deliveryOrderPrint,
  deliveryOrderPrintSelfDelivery,
  deliveryOrderSetAutoLogistic,
  deliveryOrderSyncFactory, deliveryOrderUpdateBindRecordCount,
} from "@/api/temu/delivery_order";
import infoList from "@/components/mixins/infoList";

export default {
  name: 'TemuDlgBindRecordList',
  components: {KdxImage},
  mixins: [infoList],
  props: {
    accountOptions: {
      type: Array,
    }
  },
  computed: {
    // 能否平台发货
    syncList() {
      let list = []
      this.selectRows.forEach((item) => {
        if (item.is_factory && item.sync_times <= 0) {
          list.push(item)
        }
      })
      return list
    },
    canSetAttachList() {
      return this.selectRows.filter((row) => {
        return row.delivery_method === 1
      })
    },
    canSetLogisticList() {
      return this.selectRows.filter((row) => {
        return row.delivery_method === 2 && row.express_delivery_sn.startsWith("SF")
      })
    },
  },
  watch: {
    searchInfo: {
      handler() {
        if (this.$attrs.visible) {
          this.onSubmit()
        }
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: deliveryOrderBindRecordList,
      selectRows: [],
      form: {
        attach_to_logistic: undefined,
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    onOpened() {
      this.page = 1
      this.getTableData()
    },
    async print(row, onlyWithXm) {
      let resp = await deliveryOrderPrint({ids: row.ids, package_num: row.package_num, only_xm: onlyWithXm})
      if (resp.code) {
        return
      }

      window.open(`${resp.data}`, "_BLANK")
    },
    async printSelfDelivery(row) {
      let resp = await deliveryOrderPrintSelfDelivery({id: row.id})
      if (resp.code) {
        return
      }

      window.open(`${resp.data}`, "_BLANK")
    },
    batchSyncFactory() {
      this.syncToFactory(this.syncList)
    },
    async syncToFactory(rows) {
      for (const row of rows) {
        let resp = await deliveryOrderSyncFactory({id: row.id})
        if (resp.code) {
          return
        }

        this.$message(`同步成功，请前往工厂页面查看，工厂当前剩余任务空间: ${resp.data} 个`)
      }
      this.getTableData()
    },
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length <= 0) {
        return
      }

      let ids = []
      let totalCount = 0
      this.selectRows.forEach((item) => {
        ids.push(...item.ids)
        totalCount += item.count
      })
      this.$message(`总共: ${totalCount} 个货`)
      this.copy(ids.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async setAttachToLogistic(rows, attach_to_logistic) {
      if (!attach_to_logistic) {
        this.$message("请设置物流")
        return
      }

      let resp = await deliveryOrderAttachToLogistic({ids: rows.map((item)=>{return item.id}), attach_to_logistic: attach_to_logistic})
      if (resp.code) {
        return
      }

      this.getTableData()
    },
    async setAutoLogistic(rows) {
      let resp = await deliveryOrderSetAutoLogistic({ids: rows.map((item) => {return item.id})})
      if (resp.code) {
        return
      }

      this.$message("设置成功")
      this.getTableData()
    },
    setSubWarehouseName(row) {
      this.$set(this.searchInfo, "sub_warehouse_name", row.sub_warehouse_name)
      this.onSubmit()
    },
    setUserId(row) {
      this.$set(this.searchInfo, "user_id", row.user_id)
      this.onSubmit()
    },
    async updateBindRecordCount(row) {
      let resp = await deliveryOrderUpdateBindRecordCount({id: row.id, count: row.count})
      if (resp.code) {
        return
      }

      this.$message("更新成功")
      this.getTableData()
    }
  },
  mounted() {
    this.$set(this.searchInfo, "user_id", -1)
    this.$set(this.searchInfo, "is_sync_factory", "2")

    let d = new Date()
    this.$set(this.searchInfo, "start_at", `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`)
  },
  filters: {},
  async created() {
    this.pageSize = 200
  }
}
</script>
<style scoped lang="scss">
</style>