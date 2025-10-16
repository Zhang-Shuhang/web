<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-input v-model="searchInfo.name" type="primary" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" style="width: 100%" type="primary" @click="create">创建模板</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                :default-expand-all="true">
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="Id" prop="id" align="center"></el-table-column>
        <el-table-column label="分组" prop="group.name" align="center"></el-table-column>
        <el-table-column label="名字" prop="name" align="center"></el-table-column>
        <el-table-column label="底图" align="center" width="200px">
          <div style="margin-left: 5px; margin-right: 5px" slot-scope="{row}">
            <KdxImage :src="row.base_image.thumbnail_url" width="100%" height="100%" style="background-color: lightblue" v-if="row.base_image && row.base_image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <div style="margin-left: 5px; margin-right: 5px" slot-scope="{row}">
            <el-row :gutter="5">
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="primary" @click="edit(row)">编辑</el-button>
              </el-col>
              <el-col :span="12">
                <el-button size="mini" style="width: 100%" type="warning" @click="onCopy(row)">复制</el-button>
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

    <CustomizeDlgEditor :id="dlgEditor.id" :copy_id="dlgEditor.copy_id" :visible="dlgEditor.visible" @close="dlgEditor.visible=false" @suc="getTableData"></CustomizeDlgEditor>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {
  customizeList,
} from "@/api/customize/list";
import {mapGetters} from "vuex";
import CustomizeDlgEditor from "@/view/customize/editor.vue";
import KdxImage from "@/components/image/image.vue";

export default {
  components: {
    KdxImage,
    CustomizeDlgEditor,
  },
  mixins: [infoList],
  data() {
    return {
      listApi: customizeList,

      selectRows: [],

      dlgEditor: {
        id: 0,
        copy_id: 0,
        visible: false,
      }
    }
  },
  watch: {
    searchInfo: {
      handler() {
        this.page = 1
        this.getTableData()
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  methods: {
    create() {
      this.dlgEditor.id = 0
      this.dlgEditor.copy_id = 0
      this.dlgEditor.visible = true
    },
    onCopy(row) {
      this.dlgEditor.id = 0
      this.dlgEditor.copy_id = row.id
      this.dlgEditor.visible = true
    },
    edit(row) {
      this.dlgEditor.id = row.id
      this.dlgEditor.copy_id = 0
      this.dlgEditor.visible = true
    },
    onSubmit() {
      this.page = 1
      this.getTableData()
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