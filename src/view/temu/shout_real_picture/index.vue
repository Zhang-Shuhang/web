<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select size="mini" v-model="searchInfo.account" placeholder="请选择账号" filterable clearable
                       :style="{width: '100%'}">
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in accountOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-select size="mini" v-model="searchInfo.status" placeholder="请选择状态" filterable clearable
                       :style="{width: '100%'}">
              <el-option value=""></el-option>
              <el-option label="待处理" :value="1"></el-option>
              <el-option label="上传成功" :value="2"></el-option>
              <el-option label="未知状态3" :value="3"></el-option>
              <el-option label="未知状态5" :value="5"></el-option>
            </el-select>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-input placeholder="货号前缀" v-model="searchInfo.sku_prefix" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Spu Ids" v-model="searchInfo.spu_ids" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Skc Ids" v-model="searchInfo.skc_ids" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="searchInfo.account">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSync">同步当前账号</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSyncSpuIds">同步选中</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openBatchUpload">批量上传</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="2">
            <el-popover placement="bottom" trigger="click">
              <el-input size="mini" style="width: 100%" placeholder="输入前缀" v-model="prefixUpload.prefix" clearable></el-input>
              <el-button size="mini" style="width: 100%" type="primary" :disabled="!prefixUpload.prefix" @click="doPrefixUpload">上传</el-button>

              <div slot="reference" style="width: auto">
                <el-button style="width: 100%" size="mini" type="primary">前缀自动上传</el-button>
              </div>
            </el-popover>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="2" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onKeyUploadShoutRealPicture">一键上传实拍图</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column align="center" label="账号" prop="account.name"></el-table-column>
        <el-table-column align="center" label="Spu Id" prop="spu_id">
          <div slot-scope="{row}">
            {{row.spu_id}}

            <el-button size="mini" type="primary" v-if="row.upload_status !==2" @click="realShoutPictureUpload([row.spu_id])">实拍图上传</el-button>
          </div>
        </el-table-column>
        <el-table-column align="center" label="Sku Id" prop="id"></el-table-column>
        <el-table-column align="center" label="货号" prop="variation.ext_code"></el-table-column>
        <el-table-column align="center" label="图片" prop="name">
          <div slot-scope="{row}">
            <template v-if="row.variation">
              <KdxImage :src="row.variation.thumb_url" width="60px" height="60px"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column align="center" label="实拍图" prop="name">
          <div slot-scope="{row}">
            <KdxImage :src="src" v-for="(src, index) in row.image_list" width="60px" height="60px" :key="index"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column align="center" label="实拍图标签要求">
          <el-table-column align="center" label="类型">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_list" :key="index">
                {{item.name}}
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="识别状态">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_list" :key="index">
                {{item.status_toast}}
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="影响站点数量">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_list" :key="index">
                {{item.affected_site_count}}
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="影响范围">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_list" :key="index">
                <span v-html="item.effect_result">
                </span>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="实拍结果">
          <el-table-column align="center" label="名字">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_result_list" :key="index">
                {{item.name}}
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="例图">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_result_list" :key="index">
                <KdxImage :src="v" v-for="(v, idx) in item.example_pics" style="display: inline-block" :key="idx" width="100%" height="80px"></KdxImage>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
          <el-table-column align="center" label="原因">
            <div class="item-container" slot-scope="{row}">
              <div class="item" v-for="(item, index) in row.check_result_list" :key="index">
                <span v-if="item.color" :style="{'color': item.color}">
                  {{item.toast}}
                </span>
                <span v-else>
                  {{item.toast}}
                </span>
                <el-link size="mini" type="primary" :href="item.jump_url" :underline="false" target="_blank" v-if="item.jump_url">跳转</el-link>
              </div>
              <div class="footer">
              </div>
            </div>
          </el-table-column>
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

      <TemuDlgBatchUpload :ids="dlg_upload.ids" :visible="dlg_upload.visible" @close="dlg_upload.visible = false" @update="getTableData"></TemuDlgBatchUpload>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {
  shoutRealPictureList,
  shoutRealPictureSync,
  shoutRealPictureSyncBySpuIds,
  shoutRealPictureUploadByPrefix
} from "@/api/temu/shout_real_picture";
import {accountList} from "@/api/temu/account";
import TemuDlgBatchUpload from "@/view/temu/shout_real_picture/dlg_batch_upload.vue";

export default {
  components: {
    TemuDlgBatchUpload,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    // 能否平台发货
    ids() {
      let list = []
      this.selectRows.forEach((item) => {
        list.push(item.spu_id)
      })
      return list
    },
  },
  watch: {
    searchInfo: {
      handler() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
          this.timeoutId = undefined
        }
        this.timeoutId = setTimeout(()=>{
          this.onSubmit()
        }, 300)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: shoutRealPictureList,

      accountOptions: [],

      timeoutId: undefined,

      dlg_upload: {
        ids: [],
        visible: false,
      },

      prefixUpload: {
        prefix: "",
      },

      selectRows: [],
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onSync() {
      let resp = await shoutRealPictureSync({id: this.searchInfo.account})
      if (resp.code) {
        return
      }
      this.$message("同步成功")
    },
    async onSyncSpuIds() {
      let spu_ids = this.selectRows.map((item)=>{
        return item.spu_id
      })
      let resp = await shoutRealPictureSyncBySpuIds({ids: spu_ids})
      if (resp.code) {
        return
      }
      this.$message("同步成功")
    },
    openBatchUpload() {
      this.dlg_upload.ids = this.ids
      this.dlg_upload.visible = true
    },
    async doPrefixUpload() {
      if (!this.prefixUpload.prefix) {
        this.$message.error("请输入前缀")
        return
      }

      let resp = await shoutRealPictureUploadByPrefix({prefix: this.prefixUpload.prefix})
      if (resp.code) {
        return
      }

      this.$message("操作成功")
      this.getTableData()
    },
    async realShoutPictureUpload(spuIds) {
      let resp = await shoutRealPictureUploadByPrefix({spu_ids: spuIds})
      if (resp.code) {
        return
      }

      this.$message("操作成功")
      this.getTableData()
    },
    onKeyUploadShoutRealPicture() {
      this.realShoutPictureUpload(this.selectRows.map((item) => {
        return item.spu_id
      }))
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

::v-deep .el-table .cell {
  padding: 0;
}
</style>