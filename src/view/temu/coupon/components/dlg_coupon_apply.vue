<template>
  <el-drawer :visible.sync="$attrs.visible" title="创建优惠券" @opened="onOpened" size="50%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-position="top">
      <el-form-item label="开始时间">
        <el-date-picker type="date" v-model="form.begin_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="开始日期" unlink-panels clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker type="date" v-model="form.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="结束日期" unlink-panels clearable></el-date-picker>
      </el-form-item>
      <el-form-item label="发布数量">
        <el-input-number :min="1" :precision="0" placeholder="发布数量" v-model="form.punish_count" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-form-item label="发布价格(CNY)">
        <el-input-number :min="1" :precision="2" placeholder="发布价格(CNY)" v-model="form.coupon_amount" style="width: 100%" clearable></el-input-number>
      </el-form-item>
      <el-button size="mini" type="primary" @click="apply" style="width: 100%; margin-top: 5px; height: 50px">创建</el-button>
    </el-form>

    <el-table class="table-body" ref="multipleTable" :data="tableData" border height="70vh" @sort-change="sortChange"
              size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false"
              @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
      <el-table-column label="账号" prop="account.name" align="center">
      </el-table-column>
      <el-table-column label="Spu Id" prop="product_id" align="center" sortable="custom">
      </el-table-column>
      <el-table-column label="产品图" prop="carousel_image_urls" min-width="300px" align="center">
        <div slot-scope="{row}">
          <KdxImage style="display: inline-block" :src="item" v-for="(item, index) in row.carousel_image_urls" :key="index"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="开始时间" prop="begin_time" align="center" sortable="custom">
        <div slot-scope="{row}">
          {{ new Date(row.begin_time).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="结束时间" prop="end_time" align="center" sortable="custom">
        <div slot-scope="{row}">
          <el-popover placement="left" trigger="click" v-if="row.can_operate">
            <el-date-picker type="date" v-model="form.end_time" format="yyyy/MM/dd" value-format="yyyy/MM/dd" :style="{width: '100%'}" placeholder="新的结束日期" unlink-panels clearable></el-date-picker>
            <el-button size="mini" style="width: 100%" type="primary" @click="delay(row)">设置</el-button>
            <el-button slot="reference" size="mini" type="primary" plain>{{ new Date(row.end_time).toLocaleString() }}</el-button>
          </el-popover>
          <div v-else>
            {{new Date(row.end_time).toLocaleString()}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="发放数量" prop="punish_count" align="center" sortable="custom">
        <div slot-scope="{row}">
          <el-popover placement="left" trigger="click" v-if="row.can_operate">
            <el-input-number size="mini" :min="1" :precision="0" style="width: 100%" v-model="form.increase_count" placeholder="新增数量" clearable></el-input-number>
            <el-button size="mini" style="width: 100%" type="primary" @click="increase(row)">增加</el-button>
            <el-button slot="reference" size="mini" type="primary" plain>{{ row.punish_count }}</el-button>
          </el-popover>
          <div v-else>
            {{row.punish_count}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="领取数量" prop="claimed_count" align="center" sortable="custom">
      </el-table-column>
      <el-table-column label="使用数量" prop="use_count" align="center" sortable="custom">
      </el-table-column>
      <el-table-column label="金额" prop="coupon_amount" align="center" sortable="custom">
        <div slot-scope="{row}">
          {{ (row.coupon_amount/100).toFixed(2) }} {{ row.coupon_currency }}
        </div>
      </el-table-column>
      <el-table-column label="操作" prop="activity_price" align="center">
        <div slot-scope="{row}">
          <el-button type="primary" size="mini" style="width: 100%" @click="offline(row)" plain v-if="row.can_operate">
            关闭
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
  </el-drawer>
</template>

<script>

import infoList from "@/components/mixins/infoList";
import KdxImage from "@/components/image/image.vue";
import {couponCreate, couponList} from "@/api/temu/coupon";

export default {
  name: 'TemuDlgCouponApply',
  components: {KdxImage},
  mixins: [infoList],
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
  },
  data() {
    return {
      listApi: couponList,

      form: {
        begin_time: "",
        end_time: "",
        punish_count: 200,
        coupon_amount: 1,
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.$set(this.searchInfo, "spu_ids", (this.ids || []).join(" "))
      let c = new Date()
      this.form.begin_time = c.toLocaleDateString()
      this.form.end_time = new Date(c.getTime() + 86400000*7).toLocaleDateString()
      this.getTableData()
    },
    async apply() {
      let data = {}
      data.title = "New Coupon"
      data.begin_time = this.form.begin_time
      data.end_time = this.form.end_time
      data.punish_count = this.form.punish_count
      data.coupon_amount = this.form.coupon_amount
      data.ids = this.ids
      let resp = await couponCreate(data)
      if (resp.code) {
        return
      }

      this.getTableData()

      this.$message("创建成功")
    },
    selectionChange(val) {
      this.selectRows = val
    },
  },
  filters: {},
  async created() {
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