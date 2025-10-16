<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.appeal_status" placeholder="请选择状态" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in appealStatusOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.violation_type" placeholder="请选择类型" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in violationTypeOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input size="mini" v-model="searchInfo.violation_desc" placeholder="请输入违规描述关键字" filterable clearable
                         :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input size="mini" v-model="searchInfo.exclude_violation_desc" placeholder="请输入不包含违规描述关键字" filterable clearable
                         :style="{width: '100%'}">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.punish_type" placeholder="请选择违规类型" filterable clearable
                         :style="{width: '100%'}">
                <el-option value=""></el-option>
                <el-option v-for="(item, index) in punishTypeOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.levels" placeholder="层级" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option v-for="(item, index) in levelOptions" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids" v-model="searchInfo.spu_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids" v-model="searchInfo.skc_ids" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="货号" v-model="searchInfo.ext_codes" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="canAppealRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openBatchSubmitDlg(canAppealRows)">批量申诉</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" @selection-change="selectionChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" height="100%">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="spu_id" align="center">
        </el-table-column>
        <el-table-column label="图片" prop="thumb_url" align="center">
          <div class="item-container" slot-scope="{row}">
            <KdxImage :src="row.goods_img_url" v-if="row.goods_img_url"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="申诉状态" prop="appeal_status" align="center">
          <div slot-scope="{row}">
            {{appealStatusName(row.appeal_status)}}
          </div>
        </el-table-column>
        <el-table-column label="违规类型" prop="violation_type" align="center">
          <div slot-scope="{row}">
            {{violationTypeName(row.violation_type)}}
          </div>
        </el-table-column>
        <el-table-column label="违规描述" prop="violation_desc" align="center">
        </el-table-column>
        <el-table-column label="违规处理结果" prop="punish_type" align="center">
          <div slot-scope="{row}">
            {{punishTypeName(row.punish_type)}}
          </div>
        </el-table-column>
        <el-table-column label="违规站点数" prop="site_num" align="center">
          <div slot-scope="{row}">
            {{siteNum(row)}}
          </div>
        </el-table-column>
        <el-table-column label="违规记录数" prop="punish_num" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" @click="openBatchSubmitDlg([row])" style="margin-top: 5px" :disabled="row.can_not_appeal">申诉</el-button>
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

    <TemuDlgBatchSubmitMerchantAppeal :rows="batchSubmitDlg.rows" :visible="batchSubmitDlg.visible" @close="batchSubmitDlg.visible=false" @update="getTableData"></TemuDlgBatchSubmitMerchantAppeal>
  </div>
</template>

<script>
import infoList from '@/components/mixins/infoList'
import {accountList} from "@/api/temu/account";
import KdxImage from "@/components/image/image.vue";
import {merchantAppealList} from "@/api/temu/merchant_appeal";
import TemuDlgBatchSubmitMerchantAppeal from "@/view/temu/merchant_appeal/components/dlg_batch_submit.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";

export default {
  name: 'TemuReview',
  components: {
    TemuDlgDiagramEdit,
    TemuDlgBatchSubmitMerchantAppeal,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    canAppealRows() {
      return this.selectRows.filter((item) => {
        return !item.can_not_appeal && (item.appeal_status === 1 || item.appeal_status === 3)
      })
    }
  },
  data() {
    return {
      listApi: merchantAppealList,

      accountOptions: [],
      appealStatusOptions: [
        {id: 1, name: "待申诉"},
        {id: 2, name: "申诉中"},
        {id: 3, name: "申诉驳回"},
        {id: 102, name: "已解罚无需申诉"},
      ],
      violationTypeOptions: [
        {id: 1, name: "违反禁售政策"},
        {id: 2, name: "违反限售政策"},
        {id: 3, name: "内容信息违规"},
        {id: 4, name: "知识产权投诉"},
        {id: 5, name: "知识产权违规"},
        {id: 6, name: "入驻信息违规"},
      ],
      punishTypeOptions: [
        {id: 1, name: "下架违规对象"},
        {id: 2, name: "店铺当前在售商品全部下架且不允许增量上架"},
        {id: 3, name: "店铺当前禁止商品在管控站点上新"},
        {id: 4, name: "店铺当前禁止新发和编辑任何商品"},
        {id: 5, name: "店铺当前禁止新建商品"},
        {id: 6, name: "移除广告"},
        {id: 7, name: "商品限制下单"},
      ],

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

      batchSubmitDlg: {
        visible: false,
        rows: [],
      }
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    appealStatusName(tp) {
      let op = this.appealStatusOptions.find((item) => {return item.id === tp})
      if (!op) {
        return `未知: ${tp}`
      }
      return op.name
    },
    violationTypeName(tp) {
      let op = this.violationTypeOptions.find((item) => {return item.id === tp})
      if (!op) {
        return `未知: ${tp}`
      }
      return op.name
    },
    punishTypeName(tp) {
      let op = this.punishTypeOptions.find((item) => {return item.id === tp})
      if (!op) {
        return `未知: ${tp}`
      }
      return op.name
    },
    siteNum(row) {
      if (row.items[0].site_id === -1) {
        return "全部站点"
      }
      return `${row.site_num}`
    },
    openBatchSubmitDlg(rows) {
      this.batchSubmitDlg.rows = rows
      this.batchSubmitDlg.visible = true
    },
    selectionChange(val) {
      this.selectRows = val
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    let resp = await accountList()
    if (resp.code === 0) {
      this.accountOptions = resp.data
    }
    this.getTableData()
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-form-item, .el-container .admin-box .search-term .el-form-item {
  margin-bottom: 0px;
}

::v-deep .el-row {
  padding: 0px;
}

.height_100 {
  height: 100%;
}

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

</style>