<template>
  <div :class="[is_dlg ? 'height_100' : '']">
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
<!--          <el-col :xs="12" :sm="6" :lg="3">-->
<!--            <el-form-item label-width="0">-->
<!--              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable style="width: 100%">-->
<!--                <el-option value=""></el-option>-->
<!--                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"-->
<!--                           :value="item.id" v-if="item.is_semi"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
<!--          <el-col :xs="12" :sm="6" :lg="3">-->
<!--            <el-form-item label-width="0">-->
<!--              <el-select v-model="searchInfo.status" placeholder="请选择订单状态" multiple collapse-tags-->
<!--                         filterable clearable style="width: 100%">-->
<!--                <el-option v-for="(item, index) in statusOptions" :key="index" :label="item.name"-->
<!--                           :value="item.id"></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="渠道" v-model="searchInfo.channel" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="单号，只支持模糊搜索" v-model="searchInfo.query_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="货号, 只支持模糊搜索" v-model="searchInfo.sku_code" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select placeholder="请选择是否收到" v-model="searchInfo.is_receive" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="未收到" :value="1"></el-option>
                <el-option label="已收到" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="提醒" v-model="searchInfo.note" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
<!--          <el-col :xs="8" :sm="4" :lg="2">-->
<!--            <el-upload action="/temu/overseas_warehouse/upload_cky" :headers="{'x-token':token}" :show-file-list="false" multiple-->
<!--                       accept=".pdf" :on-success="handleUploadCky" :on-error="handleError" style="width: 100%;">-->
<!--              <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">-->
<!--                出口易箱唛创建任务-->
<!--              </el-button>-->
<!--            </el-upload>-->
<!--          </el-col>-->
          <el-col :xs="8" :sm="4" :lg="2">
            <el-upload action="/temu/overseas_warehouse/upload_cky_code" :headers="{'x-token':token}" :show-file-list="false" multiple
                       accept=".pdf" :on-success="handleUploadCkyCode" :on-error="handleError" style="width: 100%;">
              <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                上传出口易条码
              </el-button>
            </el-upload>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <div>
              <el-popover placement="left" trigger="click">
                <el-input size="mini" style="width: 100%" v-model="winit.order_no" placeholder="万邑通单号"></el-input>
                <el-button size="mini" style="width: 100%" type="primary" @click="uploadWinit" :disabled="!winit.order_no">同步</el-button>
                <el-button slot="reference" size="mini" type="primary" style="width: 100%">同步万邑通</el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <div>
              <el-popover placement="left" trigger="click">
                <el-input size="mini" style="width: 100%" v-model="ub.order_no" placeholder="领星-UB单号"></el-input>
                <el-button size="mini" style="width: 100%" type="primary" @click="uploadUb" :disabled="!ub.order_no">同步</el-button>
                <el-button slot="reference" size="mini" type="primary" style="width: 100%">同步领星-UB</el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <div>
              <el-popover placement="left" trigger="click">
                <el-input size="mini" style="width: 100%" v-model="jieBao.order_no" placeholder="捷宝单号"></el-input>
                <el-button size="mini" style="width: 100%" type="primary" @click="uploadJieBao" :disabled="!jieBao.order_no">同步</el-button>
                <el-button slot="reference" size="mini" type="primary" style="width: 100%">同步捷宝</el-button>
              </el-popover>
            </div>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="2">
            <div>
              <el-upload action="/temu/overseas_warehouse/upload_code_collate" :headers="{'x-token':token}" :show-file-list="false"
                         accept=".xlsx" :on-success="handleCodeCollateSuccess" :on-error="handleError" style="width: 100%">
                <el-button size="mini" style="width: 100%" type="primary">上传条码对应</el-button>
              </el-upload>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
                @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="信息" align="center" prop="id">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini">渠道: {{row.channel}}</el-tag>
            </div>
            <div>
              {{row.id}}
            </div>
            <div>
              <el-select size="mini" v-model="row.is_ship" placeholder="请选择账号" filterable style="width: 100%" @change="onSetShip(row)">
                <el-option label="海运" :value="true"></el-option>
                <el-option label="空运" :value="false"></el-option>
              </el-select>
            </div>
            <div>
              <el-input size="mini" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" maxlength="200" show-word-limit v-model="row.note" placeholder="提醒" clearable @change="onSetNote(row)"></el-input>
            </div>
            <div>
              <el-tag size="mini">
                创建时间: {{new Date(row.created_at).toLocaleString()}}
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="装箱信息" align="center" width="220px">
          <div class="item-container" slot-scope="{row}">
            <div :style="{'height': ((box.items.length + 1) * 28) + 'px', 'font-size': '12px'}" :class="[`item`, `item-bottom`]" v-for="(box, index) in row.boxes" :key="index">
              <div style="font-size: 12px">
                外箱编号: {{ box.box_number }}
              </div>
              <div style="font-size: 12px">
                发货方式: {{ box.channel }}
              </div>
            </div>
            <div class="footer">
              合计: {{row.boxes.length}}箱
            </div>
          </div>
        </el-table-column>
        <el-table-column label="装箱详情" align="center" min-width="400px">
          <template slot="header">
            <span>装箱详情</span>
            <el-row :gutter="5">
              <el-col :span="4">编号</el-col>
              <el-col :span="4">货号</el-col>
              <el-col :span="4">重量</el-col>
              <el-col :span="6">收货数量</el-col>
              <el-col :span="6">发货数量</el-col>
            </el-row>
          </template>
          <div class="item-container" slot-scope="{row}" style="font-size: 12px">
            <template v-for="(box, index) in row.boxes">
              <div :style="{'height': ((box.items.length + 1) * 28) + 'px'}" :class="[`item`, `item-bottom`]" :key="index">
                <el-row :gutter="5">
                  <template v-for="(item) in box.items">
                    <el-col :span="4">{{item.stock_code_id}}</el-col>
                    <el-col :span="4" >{{item.stock_code ? item.stock_code.sku_code : "未知"}}</el-col>
                    <el-col :span="4" >{{item.stock_code ? item.stock_code.weight + "g" : "未知重量"}}</el-col>
                    <el-col :span="6">
                      <el-input-number size="mini" v-model="item.receive" :step="1" :min="0" :max="item.quantity" style="width: 100%" v-if="edit === row"></el-input-number>
                      <el-tag size="mini" v-else>收到: {{item.receive}}</el-tag>
                    </el-col>
                    <el-col :span="6">
                      <el-input-number size="mini" v-model="item.quantity" :step="1" :min="item.receive" style="width: 100%" v-if="edit === row"></el-input-number>
                      <el-tag size="mini" v-else>发货: {{item.quantity}}</el-tag>
                    </el-col>
                  </template>
                  <el-col :offset="12" :span="6">收到: {{calcItemsReceive([box])}}个</el-col>
                  <el-col :span="6">发出: {{calcItemsQuantity([box])}}个/总重: {{calcItemsWeight([box])}}KG</el-col>
                </el-row>
              </div>
            </template>
            <div class="footer">
              <el-row :gutter="5">
                <el-col :offset="12" :span="6">合计收到: {{calcItemsReceive(row.boxes)}}个</el-col>
                <el-col :span="6">合计发出: {{calcItemsQuantity(row.boxes)}}个/总重: {{calcItemsWeight(row.boxes)}}KG</el-col>
              </el-row>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <template v-if="edit === row">
              <el-button type="warning" size="mini" style="width: 100%" @click="onSetAllReceive">
                设置为全部收到
              </el-button>
              <div style="margin-top: 5px">
                <el-upload :action="`/temu/overseas_warehouse/upload_receive?id=${row.id}`" :headers="{'x-token':token}" :show-file-list="false" multiple
                           accept=".xlsx" :on-success="(res) => { handleUploadReceive (row, res)}" :on-error="handleError" style="width: 100%;">
                  <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                    上传入库文件
                  </el-button>
                </el-upload>
              </div>
              <el-button type="danger" size="mini" style="width: 100%; margin-top: 5px" @click="onSave">
                保存
              </el-button>
              <el-button type="primary" size="mini" style="width: 100%; margin-top: 5px" @click="onCancel(row)" plain>
                取消
              </el-button>
            </template>
            <template v-else>
              <div>
                <el-button type="primary" size="mini" style="width: 100%" @click="onEdit(row)" plain>
                  更新数量
                </el-button>
              </div>
              <div style="margin-top: 5px">
                <el-row>
                  <el-col :span="16">
                    <el-date-picker type="date" size="mini" v-model="row.estimated_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="预计上架时间" unlink-panels clearable></el-date-picker>
                  </el-col>
                  <el-col :span="8">
                    <el-button type="primary" size="mini" style="width: 100%" @click="onSetEstimatedTime(row)" :disabled="!row.estimated_time" plain>
                      设置
                    </el-button>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 5px">
                <el-button type="primary" size="mini" style="width: 100%" @click="copySkuCodes(row)">
                  复制货号
                </el-button>
              </div>
              <div style="margin-top: 5px">
                <el-button :type="row.reviewer ? 'primary' : 'danger'" size="mini" style="width: 100%" @click="review(row)" :disabled="row.reviewer>0">
                  {{row.reviewer ? "已过审" : "过审"}}
                </el-button>
              </div>
              <template v-if="row.estimated_time">
                <div style="margin-top: 5px">
                  <el-upload :action="`/temu/overseas_warehouse/upload_xm?id=${row.id}`" :headers="{'x-token':token}" :show-file-list="false" multiple
                             accept=".pdf" :on-success="handleUploadXm" :on-error="handleError" style="width: 100%;">
                    <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                      上传中转物流箱唛
                    </el-button>
                  </el-upload>
                </div>
                <div style="margin-top: 5px" v-if="row.reviewer">
                  <el-button type="primary" size="mini" style="width: 100%" @click="onSyncFactory(row)" plain>
                    同步去工厂
                  </el-button>
                </div>
              </template>
              <div style="margin-top: 5px">
                <el-button type="danger" size="mini" style="width: 100%" @click="onDelete(row)">
                  删除
                </el-button>
              </div>
              <div>
              </div>
            </template>


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

    <TemuDlgPackageTracking :id="packageTrackingDlg.id" :waybill_id="packageTrackingDlg.waybill_id" :visible="packageTrackingDlg.visible" @close="packageTrackingDlg.visible=false"></TemuDlgPackageTracking>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "@/api/temu/account";
import TemuDlgPackageTracking from "@/view/temu/semi_order/components/dlg_package_tracking.vue";
import {
  overseasWarehouseDelete,
  overseasWarehouseList, overseasWarehouseReview, overseasWarehouseSetEstimatedTime, overseasWarehouseSetShip,
  overseasWarehouseSyncFactory,
  overseasWarehouseUpdate, overseasWarehouseUploadWinit, overseasWarehouseUploadUb, overseasWarehouseUploadJieBao,
  overseasWarehouseSetNote
} from "@/api/oversea_warehouse/list";
import {mapGetters} from "vuex";

export default {
  name: 'TemuOverseaList',

  components: {
    TemuDlgPackageTracking,
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  props: {
    sku_code: {
      type: String,
      default: "",
    },
    is_dlg: {
      type: Boolean,
      default: false,
    },
    is_receive: {
      type: Number,
      default: undefined,
    }
  },
  data() {
    return {
      listApi: overseasWarehouseList,

      selectRows: [],

      fullscreenLoading: false,

      edit: undefined,

      accountOptions: [],
      statusOptions: [
        {id: 1, name: "平台处理中"},
        {id: 2, name: "待发货"},
        {id: 4, name: "已发货"},
        {id: 5, name: "已签收"},
        {id: 3, name: "已取消"},
      ],

      winit: {
        order_no: "",
      },

      ub: {
        order_no: "",
      },

      jieBao: {
        order_no: "",
      },

      packageTrackingDlg: {
        id: undefined,
        waybill_id: undefined,
        visible: false,
      }
    }
  },
  methods: {
    overseasWarehouseReview,
    onSubmit() {
      this.page = 1
      this.getTableData()
      this.fullscreenLoading = false
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
    calcItemsQuantity(boxes) {
      let quantity = 0
      boxes.forEach((box) => {
        box.items.forEach((item) => {
          quantity += item.quantity
        })
      })
      return quantity
    },
    calcItemsReceive(boxes) {
      let receive = 0
      boxes.forEach((box) => {
        box.items.forEach((item) => {
          receive += item.receive
        })
      })
      return receive
    },
    calcItemsWeight(boxes) {
      let weight = 0
      boxes.forEach((box) => {
        box.items.forEach((item) => {
          if (item.stock_code) {
            weight += item.stock_code.weight * item.quantity
          }
        })
      })
      return (weight / 1000).toFixed(1)
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    handleUploadCky(res) {
      if (res.code) {
        this.$message.error(res.msg)
        return
      }
      this.fullscreenLoading = false
      this.$message("上传成功")
      this.getTableData()
    },
    handleUploadCkyCode(res) {
      if (res.code) {
        this.$message.error(res.msg)
        return
      }
      this.fullscreenLoading = false
      this.$message("上传成功")
    },
    handleUploadXm(res) {
      if (res.code) {
        this.$message.error(res.msg)
        return
      }
      this.fullscreenLoading = false
      this.$message("上传成功")
      this.getTableData()
    },
    handleUploadReceive(row, res) {
      if (res.code) {
        this.$message.error(res.msg)
        return
      }
      this.fullscreenLoading = false
      this.$message("上传成功")

      let mp = new Map()
      res.data.forEach(item => {
        mp.set(item.id, item.count)
      })

      for (const box of row.boxes) {
        for (const item of box.items) {
          let newReceive = mp.get(item.id)
          if (newReceive) {
            item.receive += newReceive
          }
        }
      }
    },
    handleCodeCollateSuccess(row, res) {
      if (res.code) {
        this.$message.error(res.msg)
        return
      }
      this.fullscreenLoading = false
      this.$message("上传成功")
    },
    handleError(err) {
      this.fullscreenLoading = false
      this.$message.error("上传失败!" + err);
    },
    onDelete(row) {
      this.$confirm('确认降价，非常危险操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await overseasWarehouseDelete({ids: [row.id]})
        if (resp.code) {
          return
        }
        this.$message("操作成功")
        this.getTableData()
      })
    },
    onEdit(row) {
      if (this.edit) {
        this.onCancel(this.edit)
      }

      row.boxes.forEach((box) => {
        box.items.forEach((item) => {
          item.old_quantity = item.quantity
          item.old_receive = item.receive
        })
      })
      this.edit = row
    },
    copySkuCodes(row) {
      let codes = []

      row.boxes.forEach((box) => {
        box.items.forEach((item) => {
          if (!item.stock_code) {
            return
          }

          if (codes.indexOf(item.stock_code.sku_code) < 0) {
            codes.push(item.stock_code.sku_code)
          }
        })
      })

      if (codes.length) {
        this.copy(codes.join(" "))
      }
    },
    review(row) {
      this.$confirm('请确认是否可以过审?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await overseasWarehouseReview({id: row.id})
        if (resp.code) {
          return
        }
        this.$message("审核成功")
        this.getTableData()
      })
    },
    async onSyncFactory(row) {
      let resp = await overseasWarehouseSyncFactory({ids: [row.id]})
      if (resp.code) {
        return
      }
      this.$message("同步成功")
    },
    onCancel(row) {
      row.boxes.forEach((box) => {
        box.items.forEach((item) => {
          item.quantity = item.old_quantity
          item.receive = item.old_receive
        })
      })
      this.edit = undefined
    },
    // 保存
    async onSetAllReceive() {
      if (!this.edit) {
        this.$message.error("当前没在编辑中")
        return
      }

      this.edit.boxes.forEach((box) => {
        box.items.forEach((item) => {
          if (item.quantity > item.receive) {
            item.receive = item.quantity
          }
        })
      })

      this.$message("设置成功")
    },
    async onSetEstimatedTime(row) {
      if (!row.estimated_time) {
        return
      }

      let resp = await overseasWarehouseSetEstimatedTime({id: row.id, time: row.estimated_time})
      if (resp.code) {
        return
      }
      this.$message("设置成功")
      this.getTableData()
    },
    async onSetShip(row) {
      let resp = await overseasWarehouseSetShip({id: row.id, is_ship: row.is_ship})
      if (resp.code) {
        this.getTableData()
        return
      }

      this.$message("设置成功")
    },
    async onSetNote(row) {
      let resp = await overseasWarehouseSetNote({id: row.id, note: row.note})
      if (resp.code) {
        this.getTableData()
        return
      }

      this.$message("设置成功")
    },
    async onSave() {
      if (!this.edit) {
        this.$message.error("当前没在编辑中")
        return
      }

      let list = []
      this.edit.boxes.forEach((box) => {
        box.items.forEach((item) => {
          list.push({
            id: item.id,
            quantity: item.quantity,
            receive: item.receive,
          })
        })
      })

      let resp = await overseasWarehouseUpdate(list)
      if (resp.code) {
        return
      }
      this.$message("更新成功")
      this.getTableData()
    },
    async uploadWinit() {
      let resp = await overseasWarehouseUploadWinit({order_no: this.winit.order_no})
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.getTableData()
    },
    async uploadUb() {
      let resp = await overseasWarehouseUploadUb({order_no: this.ub.order_no})
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.getTableData()
    },
    async uploadJieBao() {
      let resp = await overseasWarehouseUploadJieBao({order_no: this.jieBao.order_no})
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.getTableData()
    }
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
    if (this.sku_code) {
      this.$set(this.searchInfo, "sku_code", this.sku_code)
    }
    if (this.is_receive) {
      this.$set(this.searchInfo, "is_receive", this.is_receive)
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
    height: 110px;
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

.height_100 {
  height: 100%;
}
</style>