<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="15">
          <el-col :span="4" :offset="16">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="create.visible=true">创建</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="list" border height="100%" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
        <el-table-column label="id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="Name" prop="name" align="center">
        </el-table-column>
        <el-table-column label="是否有效" prop="valid" align="center">
          <div slot-scope="{row}">
            <el-tag type="primary">{{ row.valid ? "有效" : "过期" }}</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" type="primary" @click="onEdit(row.id)">
              编辑Cookie
            </el-button>
            <el-button size="mini" type="danger" @click="onDelete(row.id)" style="margin-left: 20px">
              删除
            </el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>

    <SheinDlgCreate :visible="create.visible" @close="create.visible=false" @update="onSubmit"></SheinDlgCreate>
    <SheinDlgEdit :id="edit.id" :visible="edit.visible" @close="edit.visible=false"></SheinDlgEdit>
  </div>

</template>

<script>
import {accountList, accountDelete} from "@/api/shein/account";
import SheinDlgCreate from "./components/dlg_create";
import SheinDlgEdit from "./components/dlg_edit";

export default {
  components: {
    SheinDlgEdit,
    SheinDlgCreate
  },
  mixins: [],
  data() {
    return {
      list: [],
      create: {
        visible: false,
      },

      edit: {
        id: 0,
        visible: false,
      },
    }
  },
  methods: {
    async onSubmit() {
      let resp = await accountList()
      if (resp.code === 0) {
        this.list = resp.data
      }
    },
    onEdit(id) {
      this.edit.id = id
      this.edit.visible = true
    },
    onDelete(id) {
      this.$confirm("此操作将删除该账号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
            const res = await accountDelete({id: id});
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.onSubmit();
            }
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.onSubmit()
  }
}
</script>
<style scoped lang="scss">
</style>