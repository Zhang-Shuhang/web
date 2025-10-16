<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="12" :sm="12" :lg="12">
            <el-form-item label-width="0">
              <el-input placeholder="模板名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="6" :lg="6">
            <el-form-item label-width="0">
              <el-button type="primary" size="mini" :style="{width: '100%'}" @click="openCreateTemplate">创建模板</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column label="Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center" width="800">
        </el-table-column>
        <el-table-column label="自动匹配前缀" prop="name_prefixes" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" effect="dark" style="margin-right: 5px" v-for="(prefix, index) in row.name_prefixes" :key="index">{{prefix}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="默认账号" prop="default_account.name" align="center">
          <div slot-scope="{row}">
            <el-tag size="mini" v-if="row.default_account">{{row.default_account.name}}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px">
          <div slot-scope="{row}">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-button size="mini" type="primary" style="width: 100%" @click="openEditDlg(row)">编辑</el-button>
              </el-col>
              <el-col :span="8">
                <el-button size="mini" type="success" style="width: 100%" @click="openCopyDlg(row)">复制</el-button>
              </el-col>
              <el-col :span="8">
                <el-button size="mini" type="danger" style="width: 100%" @click="deleteTemplate(row)">删除</el-button>
              </el-col>
            </el-row>
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

    <TemuDlgCreateTemplate :edit="dlgTemplate.edit" :copy="dlgTemplate.copy" :visible="dlgTemplate.visible" @close="dlgTemplate.visible=false" @suc="getTableData"></TemuDlgCreateTemplate>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {simpleProductDeleteTemplate, simpleProductTemplateListByPage} from "@/api/temu/simple_product";
import TemuDlgCreateTemplate from "@/view/temu/components/dlg_create_template.vue";

export default {
  components: {
    TemuDlgCreateTemplate,
  },
  mixins: [infoList],
  computed:{
  },
  data() {
    return {
      listApi: simpleProductTemplateListByPage,

      dlgTemplate: {
        edit: undefined,
        copy: undefined,
        visible: false,
      }
    }
  },
  methods: {
    async onSubmit() {
      this.page = 1
      await this.getTableData()
    },
    deleteTemplate(row) {
      this.$confirm('是否确认删除，可能影响正在上传的任务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            const res = await simpleProductDeleteTemplate({id: row.id})
            if (res.code) {
              return
            }

            this.$message({ type: 'success', message: '删除成功!' })

            this.getTableData()
          })
    },
    openEditDlg(row) {
      this.dlgTemplate.edit = row
      this.dlgTemplate.copy = undefined
      this.dlgTemplate.visible = true
    },
    openCopyDlg(row) {
      this.dlgTemplate.edit = undefined
      this.dlgTemplate.copy = row
      this.dlgTemplate.visible = true
    },
    openCreateTemplate() {
      this.dlgTemplate.edit = undefined
      this.dlgTemplate.visible = true
    },
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.pageSize = 100
    this.getTableData()
  },
}
</script>
<style scoped lang="scss">
</style>