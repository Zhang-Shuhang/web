<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="请选择状态" v-model="searchInfo.status" multiple collapse-tags filterable clearable style="width: 100%">
                <el-option label="待处理" :value="0"></el-option>
                <el-option label="自动成功" :value="1"></el-option>
                <el-option label="手动成功" :value="2"></el-option>
                <el-option label="失败" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="定制配置名字，空格分隔" v-model="searchInfo.customize_name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="定制id" v-model="searchInfo.task_id" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="是否在生产任务中" v-model="searchInfo.is_in_produce" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="在生产任务中" :value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-form-item label-width="0">
              <el-select placeholder="是否没有定制内容" v-model="searchInfo.is_no_content" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="没有定制内容" :value="1"></el-option>
                <el-option label="没有配对定制" :value="2"></el-option>
                <el-option label="4小时内定制" :value="3"></el-option>
                <el-option label="8小时内定制" :value="4"></el-option>
                <el-option label="12小时内定制" :value="5"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onPb">排版</el-button>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onMarkComplete">标记完成</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" @selection-change="selectionChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center"></el-table-column>
        <el-table-column label="状态" prop="status" align="center">
          <div slot-scope="{row}">
            {{statusName(row.status)}}

            <div style="font-size: 12px; color: red" v-if="row.fail_reason">
              失败原因: {{row.fail_reason}}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="产品id" prop="product_sku_id" align="center">
        </el-table-column>
        <el-table-column label="货号" prop="sku_code" align="center">
        </el-table-column>
        <el-table-column label="定制内容" prop="personal_text" align="center" width="300px">
          <div slot-scope="{row}">
            <template v-if="row.personal_text">
              <div v-for="(t, index) in personalTextList(row)" :key="index">
                <el-tag size="mini" :type="personalTextList(row).length > (row.items ? row.items.length : 0) ? 'danger' : 'primary'" effect="dark">第{{index+1}}段: {{t}}[长: {{t.length}}]</el-tag>
              </div>
            </template>
          </div>
        </el-table-column>
        <el-table-column label="产品图片" prop="image" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.image" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="加工图" align="center" width="200px">
          <template slot-scope="{row}">
            <div style="background-color: lightblue" v-if="row.thumbnail_svg">
              <div style="width: 100%; height: 100%" v-html="row.thumbnail_svg">
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%;margin-bottom: 2px" type="primary" @click="openDlgOrderEditor(row)">调整</el-button>
          </div>
        </el-table-column>
      </el-table>

      <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :style="{textAlign:'right'}"
          :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 50, 100, 200, 300, 500, 1000]"
          :total="total"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          layout="total, prev, next, jumper, sizes"
      ></el-pagination>
    </div>

    <CustomizeDlgEditor :order_id="dlgOrder.id" :visible="dlgOrder.visible" @close="dlgOrder.visible=false" @suc="getTableData"></CustomizeDlgEditor>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {
  customizeOrderList, customizeOrderMarkComplete,
  customizeOrderPb,
} from "@/api/customize/order";
import CustomizeDlgEditor from "@/view/customize/editor.vue";

export default {
  components: {
    CustomizeDlgEditor,
    KdxImage
  },
  mixins: [infoList],
  computed: {
    ids() {
      let ids = []
      this.selectRows.forEach((item) => {
        ids.push(item.id)
      })
      return ids
    },
  },
  data() {
    return {
      listApi: customizeOrderList,

      selectRows: [],

      dlgOrder: {
        id: 0,
        visible: false,
      },
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    personalTextList(item) {
      let separator = "\n"
      if (item.separator) {
        separator = item.separator
      }
      return item.personal_text.split(separator ? separator : '\n').filter((item)=>{return item !== ""})
    },
    statusName(s) {
      switch (s) {
        case 0: {
          return "待处理"
        }
        case 1: {
          return "自动成功"
        }
        case 2: {
          return "手动成功"
        }
        case 3: {
          return "失败"
        }
      }
    },
    selectionChange(val) {
      this.selectRows = val
    },
    onPb() {
      this.$confirm('是否确认排版?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async ()=>{
            let resp = await customizeOrderPb()
            if (resp.code) {
              return
            }

            window.open(window.location.origin + "/customize/result/" + resp.data, "_BLANK")
            this.$message("生成成功")
          })
    },
    onMarkComplete() {
      this.$confirm('是否确认标记完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async ()=>{
            let resp = await customizeOrderMarkComplete()
            if (resp.code) {
              return
            }

            this.$message("标记成功")
            this.getTableData()
          })
    },
    openDlgOrderEditor(order) {
      this.dlgOrder.id = order.id
      this.dlgOrder.visible = true
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
    height: 90px;
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

::v-deep .el-upload--text {
  width: 100%;
}
</style>