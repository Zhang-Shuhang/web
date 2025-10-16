<template>
  <div :class="[is_dlg ? 'height_100' : '']">
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
              <el-input placeholder="Spu Id" v-model="searchInfo.spu_id" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Id" v-model="searchInfo.skc_id" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku Id" v-model="searchInfo.sku_id" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="WB单号" v-model="searchInfo.plan_id" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="原因" v-model="searchInfo.reason" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onKeyUploadShoutRealPicture">一键上传实拍图</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" @selection-change="selectionChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" height="100%">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="账号" prop="account.name" align="center">
        </el-table-column>
        <el-table-column label="WB单号" prop="id" align="center">
        </el-table-column>
        <el-table-column label="Spu Id" prop="product_id" align="center">
          <div class="item-container" slot-scope="{row}">
            {{ row.product_id }}
          </div>
        </el-table-column>
        <el-table-column label="jit/定制/VMI" align="center">
          <div class="item-container" slot-scope="{row}">
            <el-tag type="primary" size="mini" v-if="row.plan && row.plan.product && row.plan.product.product_type === 2">
              JIT
            </el-tag>
            <el-tag type="primary" size="mini" v-else-if="row.plan && row.plan.product && row.plan.product.product_type === 3">
              定制
            </el-tag>
            <el-tag type="primary" size="mini" v-else>
              VMI
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Sku Id" prop="product_sku_id" align="center">
          <div class="item-container" slot-scope="{row}">
            <div v-if="row.plan">
              <div :class="index+1 === row.plan.items.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(item, index) in row.plan.items" :key="index">
                {{ item.product_sku_id }}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="货号" prop="ext_code" align="center">
          <div class="item-container" slot-scope="{row}">
            <div v-if="row.plan">
              <div :class="index+1 === row.plan.items.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(item, index) in row.plan.items" :key="index">
                {{ item.ext_code }}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="图片" prop="thumb_url" align="center">
          <div class="item-container" slot-scope="{row}">
            <div v-if="row.plan">
              <div :class="index+1 === row.plan.items.length ? [`item`] : [`item`, `item-bottom`]"
                   v-for="(item, index) in row.plan.items" :key="index">
                <template v-if="item.variation">
                  <KdxImage :src="item.variation.thumb_url"></KdxImage>
                </template>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="原因" prop="reason" align="center">
        </el-table-column>
        <el-table-column label="链接" prop="url" align="center">
          <div slot-scope="{row}">
            <el-link size="mini" type="primary" :href="row.url" :underline="false" target="_blank" v-if="row.url">跳转
            </el-link>

            <div v-if="row.url">
              <StartBrowser :id="row.account.parent_id" :account_id="row.account_id" :open_url="row.url"></StartBrowser>
              <el-button size="mini" type="primary" @click="realShoutPictureUpload([row.product_id])" style="margin-top: 5px">实拍图上传</el-button>
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
import KdxImage from "@/components/image/image.vue";
import {planApplyFailedList} from "@/api/temu/plan_apply_failed";
import {shoutRealPictureUploadByPrefix} from "@/api/temu/shout_real_picture";
import {mapGetters} from "vuex";
import StartBrowser from "@/view/temu/components/start_browser.vue";

export default {
  name: 'TemuReview',
  components: {
    StartBrowser,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    ...mapGetters("user", ["token", "userInfo"]),
  },
  data() {
    return {
      listApi: planApplyFailedList,

      accountOptions: [],

      selectRows: [],
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
    async realShoutPictureUpload(spuIds) {
      if (spuIds.length <= 0) {
        return
      }

      let resp = await shoutRealPictureUploadByPrefix({spu_ids: spuIds})
      if (resp.code) {
        return
      }

      this.$message("操作成功，需要去发货列表点击全部加入发货台!")
      this.getTableData()
    },
    onKeyUploadShoutRealPicture() {
      this.realShoutPictureUpload(this.selectRows.filter((item) => { return item.url }).map((item) => {
        return item.product_id
      }))
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