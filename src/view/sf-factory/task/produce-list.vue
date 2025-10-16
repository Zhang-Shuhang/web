<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="查询条件" ref="search_content" v-model="searchInfo.search_content" clearable filterable @keyup.enter.native="onSubmit">
                <el-select v-model="searchInfo.search_cond" slot="prepend" filterable :style="{width: '100px'}">
                  <el-option v-for="(item, index) in searchCondOptions" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-select placeholder="请选择分类" v-model="searchInfo.group" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                <el-option v-for="(item, index) in groupOptions" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :lg="4">
            <el-form-item label-width="0">
              <el-select placeholder="请选择状态" v-model="searchInfo.urgent_status" filterable clearable :style="{width: '100%'}">
                <el-option label="" value=""></el-option>
                <el-option label="非加急" :value="1"></el-option>
                <el-option label="加急" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onOpenBarcodeUrlDlg">扫码生成条码</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onOpenCompleteDlg">扫码完成订单</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3" v-if="selectRows.length">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onComplete(selectRows)">标记完成</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini" show-summary :summary-method="getSummaries"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="平台" prop="platform" align="center">
          <div slot-scope="{row}">
            <el-tag size="small" effect="dark" v-if="row.platform===0">Temu</el-tag>
            <el-tag size="small" effect="dark" v-else-if="row.platform===1">Tiktok</el-tag>
            <el-tag size="small" effect="dark" v-else-if="row.platform===2">Shein</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Id" prop="id" align="center">
          <div slot-scope="{row}">
            {{row.id}}
            <div>
              <el-tag size="mini" type="primary">{{row.is_first ? "首" : "返"}}</el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="分类" min-width="150px" align="center">
          <div slot-scope="{row}">
            <template v-if="row.group">
              <el-tag size="mini" type="primary">{{row.group.name}}</el-tag>
            </template>
            <template v-else>
              <el-tag size="mini" type="warning">无分类</el-tag>
            </template>
            <CompSetGroup :id="row.id" :name="row.group ? row.group.name : ''" @success="onSubmit"></CompSetGroup>
          </div>
        </el-table-column>
        <el-table-column label="Skc" prop="skc" align="center">
        </el-table-column>
        <el-table-column label="Sku Id" prop="sku_id" align="center">
        </el-table-column>
        <el-table-column label="Sku Code" prop="sku_code" align="center">
        </el-table-column>
        <el-table-column label="物流单号" prop="logistic" align="center" width="220px">
          <div slot-scope="{row}">
            <div style="font-size: 12px">{{row.logistic}}</div>
          </div>
        </el-table-column>
        <el-table-column label="图片" prop="image" align="center">
          <div slot-scope="{row}">
            <template v-if="row.image">
              <KdxImage :src="row.image" width="60px" height="60px"></KdxImage>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="数量" prop="count" align="center"></el-table-column>
        <el-table-column label="日期" prop="date" align="center"></el-table-column>
        <el-table-column label="上传时间" prop="date" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleDateString()}}
          </div>
        </el-table-column>

        <el-table-column label="操作" width="200px" align="center">
          <div slot-scope="{row}">
            <div>
              <el-button size="mini" style="width: 100%" type="primary" plain :disabled="!checkSelectable(row)" @click="onComplete([row])">标记完成</el-button>
            </div>
            <div>
              <el-button size="mini" style="width: 100%" type="primary" @click="changeUrgentStatus(row)">{{row.urgent_status && row.urgent_status.status ? "取消加急" : "设置加急"}}</el-button>
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

    <el-dialog :visible.sync="barcodeUrlDlg.visible" title="扫码打印条码" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="()=>{barcodeUrlDlg.visible=false}">
      <el-input size="mini" ref="barcodeUrlDlgId" v-model="barcodeUrlDlg.id" placeholder="请输入id" style="width: 100%" clearable @keyup.enter.native="openBarcodeUrl"></el-input>
      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="openBarcodeUrl">确定</el-button>
    </el-dialog>
    
    <el-dialog :visible.sync="completeTaskDlg.visible" title="扫码完成订单" width="60%"
               :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="()=>{completeTaskDlg.visible=false}">
      <el-input size="mini" ref="completeTaskDlgId" v-model="completeTaskDlg.id" placeholder="请输入id" style="width: 100%" clearable @keyup.enter.native="completeTask"></el-input>
      <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="completeTask">确定</el-button>
    </el-dialog>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {factoryTaskList, factoryTaskComplete, factoryTaskChangeUrgentStatus} from "@/api/sf-factory/task";
import {factoryTaskGroupBarcodeUrl} from "@/api/sf-factory/task_group";
import KdxImage from "@/components/image/image";
import {mapGetters} from "vuex";
import {groupList} from "@/api/sf-factory/group";
import CompSetGroup from "@/view/sf-factory/components/comp_set_group.vue";

export default {
  components: {
    CompSetGroup,
    KdxImage
  },
  computed:{
    ...mapGetters("user", ["userInfo", "token"]),
  },
  mixins: [infoList],
  data() {
    return {
      listApi: factoryTaskList,

      groupOptions: [],

      searchCondOptions: [
        {id: 1, name: "Id"},
      ],

      selectRows: [],

      barcodeUrlDlg: {
        id: undefined,
        visible: false,
      },
      completeTaskDlg: {
        id: undefined,
        visible: false,
      }
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
      this.$refs['search_content'].select()
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      this.getTableData()
      if (res.data) {
        this.$message.error(res.data.join("\n"));
      } else {
        this.$message("上传成功!");
      }
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    selectionChange(val) {
      this.selectRows = val
    },
    checkSelectable (row) {
      switch (row.platform) {
        case 0:
          if (!this.userInfo.temu_upload_barcode_url) {
            return row.code
          }
      }
      return row.barcode_pdf_url
    },
    async onComplete(list) {
      if (!list || list.length <= 0) {
        return
      }

      // 确认
      let ids = list.map(s=>s.id);
      let resp = await factoryTaskComplete({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("操作成功")
      this.getTableData()
    },
    onOpenBarcodeUrlDlg() {
      this.barcodeUrlDlg.visible = true
      setTimeout(()=>{
        this.$refs['barcodeUrlDlgId'].select()
      }, 200)
    },
    async openBarcodeUrl() {
      let resp = await factoryTaskGroupBarcodeUrl({id: this.barcodeUrlDlg.id})
      if (resp.code) {
        return
      }

      window.open(resp.data, "_blank")
      this.$refs['barcodeUrlDlgId'].select()
      this.$message("操作完成")
    },
    onOpenCompleteDlg() {
      this.completeTaskDlg.visible = true
      setTimeout(()=>{
        this.$refs['completeTaskDlgId'].select()
      }, 200)
    },
    async completeTask() {
      let resp = await factoryTaskComplete({ids: [this.completeTaskDlg.id]})
      if (resp.code) {
        return
      }

      this.$refs['completeTaskDlgId'].select()
      this.getTableData()
      this.$message("操作完成")
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      columns.forEach((column, index) => {
        if (column.property === "count") {
          const values = data.map(item => Number(item[column.property]));
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0)
          sums[index] = "总计 " + sums[index].toFixed(0) + " 个"
        }
        if (column.property === "id") {
          sums[index] = "总计 " + data.length + " 箱"
        }
      });

      return sums;
    },
    async syncGroupList() {
      let resp = await groupList()
      if (resp.code) {
        return
      }

      this.groupOptions = resp.data
    },
    async changeUrgentStatus(row) {
      let newStatus = 1
      if (row.urgent_status && row.urgent_status.status) {
        newStatus = 0
      }

      let resp = await factoryTaskChangeUrgentStatus({id: row.logistic, status: newStatus})
      if (resp.code) {
        return
      }

      this.$message("更新状态成功")
      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.$set(this.searchInfo, "search_cond", 1)
    this.$set(this.searchInfo, "status", 2)

    this.syncGroupList()

    this.getTableData()
  },
  updated() {
    this.$nextTick(()=>{
      this.$refs.multipleTable.doLayout()
    })
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>