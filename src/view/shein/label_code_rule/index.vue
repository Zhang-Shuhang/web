<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="10">
          <el-col :xs="12" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-input placeholder="名字" v-model="searchInfo.name" clearable filterable>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateDlg">创建规则</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column align="center" label="名字" prop="name"></el-table-column>
        <el-table-column align="center" label="匹配" prop="prefixes">
          <template slot-scope="{row}">
            <div v-for="(p, index) in row.prefixes" :key="index">
              <el-tag style="margin-left: 5px" size="mini" type="primary"> 前缀: {{ p }} </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="条码宽" prop="width"></el-table-column>
        <el-table-column align="center" label="条码高" prop="height"></el-table-column>
        <el-table-column align="center" label="附加图片" prop="height">
          <template slot-scope="{row}">
            <KdxImage :src="row.attach_image_url" width="100%" height="100%"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column align="center" label="附加图片2" prop="height">
          <template slot-scope="{row}">
            <KdxImage :src="row.attach_image_url2" width="100%" height="100%" v-if="row.attach_image_url2"></KdxImage>
          </template>
        </el-table-column>
        <el-table-column align="center" label="附加图片起始点X" prop="attach_x"></el-table-column>
        <el-table-column align="center" label="附加图片起始点Y" prop="attach_y"></el-table-column>
        <el-table-column align="center" label="附加图片宽度" prop="attach_width"></el-table-column>
        <el-table-column align="center" label="附加图片高度" prop="attach_height"></el-table-column>

        <el-table-column align="center" label="操作">
          <template slot-scope="{row}">
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" @click="openEditDlg(row)">编辑</el-button>
            <el-button size="mini" type="primary" style="width: 100%; margin-top: 5px" @click="openCopyDlg(row)">复制</el-button>
            <el-button size="mini" type="danger" style="width: 100%; margin-top: 5px" @click="deleteRule(row)">删除</el-button>
          </template>
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

      <SheinDlgLabelCodeRule :is_create="dlg_rule.is_create" :is_copy="dlg_rule.is_copy" :row="dlg_rule.row" :visible="dlg_rule.visible" @close="dlg_rule.visible = false" @update="getTableData"></SheinDlgLabelCodeRule>
    </div>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {labelCodeRuleList, labelCodeRuleRemove} from "@/api/shein/label_code_rule";
import SheinDlgLabelCodeRule from "@/view/shein/label_code_rule/dlg_rule.vue";

export default {
  components: {
    SheinDlgLabelCodeRule,
    KdxImage
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        this.onSubmit()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: labelCodeRuleList,

      dlg_rule: {
        is_create: false,
        is_copy: false,
        row: undefined,
        visible: false,
      },
    }
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    openCreateDlg() {
      this.dlg_rule.is_create = true
      this.dlg_rule.is_copy = false
      this.dlg_rule.row = undefined
      this.dlg_rule.visible = true
    },
    openEditDlg(row) {
      this.dlg_rule.is_create = false
      this.dlg_rule.is_copy = false
      this.dlg_rule.row = row
      this.dlg_rule.visible = true
    },
    openCopyDlg(row) {
      this.dlg_rule.is_create = false
      this.dlg_rule.is_copy = true
      this.dlg_rule.row = row
      this.dlg_rule.visible = true
    },
    deleteRule(row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await labelCodeRuleRemove({id: row.id})
            if (resp.code) {
              return
            }

            this.getTableData()
          })
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 100
    this.getTableData()
  }
}
</script>
<style scoped lang="scss">
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
</style>