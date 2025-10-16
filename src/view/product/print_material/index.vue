<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="16">
            <el-form-item label-width="0">
              <el-input placeholder="材料名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="4" :lg="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="onCreate">创建</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="Id" align="center" prop="id">
        </el-table-column>
        <el-table-column label="能否旋转" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-if="row.can_rotate">可旋转</el-tag>
            <el-tag size="mini" type="warning" effect="dark" v-else>不可旋转</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Ps动作列表" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-for="(name, index) in row.ps_action_names" :key="index">{{name}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="Ai动作列表" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary" v-for="(name, index) in row.ai_action_names" :key="index">{{name}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="DPI" align="center" prop="dpi">
        </el-table-column>
        <el-table-column label="保存文件类型" align="center" prop="save_type">
        </el-table-column>
        <el-table-column label="默认工厂" align="center" prop="default_factory">
        </el-table-column>
        <el-table-column label="是否自启动" align="center" prop="is_auto_start">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">{{row.is_auto_start ? "是" : "否"}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="是否仅切割" align="center" prop="only_cut">
          <div slot-scope="{row}">
            <el-tag size="mini" type="primary">{{row.only_cut ? "是" : "否"}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <div slot-scope="{row}">
            <el-button type="primary" size="mini" style="width: 100%" @click="onEdit(row.id)" plain>
              编辑
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
    </div>

    <TemuDlgPrintMaterialEdit :id="editDlg.id" :visible="editDlg.visible" @close="editDlg.visible=false" @update="getTableData"></TemuDlgPrintMaterialEdit>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {mapGetters} from "vuex";
import TemuDlgPrintMaterialEdit from "@/view/product/components/dlg_print_material_edit.vue";
import {printMaterialListByPage} from "@/api/product/print_material";

export default {
  components: {
    TemuDlgPrintMaterialEdit,
  },
  mixins: [infoList],
  data() {
    return {
      listApi: printMaterialListByPage,

      selectRows: [],

      editDlg: {
        visible: false,
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.getTableData()
    },
    async onCreate() {
      this.editDlg.id = undefined
      this.editDlg.visible = true
    },
    async onEdit(id) {
      this.editDlg.id = id
      this.editDlg.visible = true
    },
    copy(text) {
      this.$copyText(text).then( () => {
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
    height: 100px;
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
</style>