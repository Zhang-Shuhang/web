<template>
  <el-drawer :visible.sync="$attrs.visible" title="图片选择" @opened="onOpened" size="30%" direction="ltr"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <div style="margin-bottom: 10px">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-select size="mini" v-model="fromVariation" filterable style="width: 100%">
            <el-option label="产品图" :value="2"></el-option>
            <el-option label="图片名称搜索"></el-option>
            <el-option label="Temu产品图片" :value="1"></el-option>
          </el-select>
        </el-col>
        <el-col :span="16">
          <el-input size="mini" style="width: 100%" v-model="searchInfo.content" placeholder="输入名字"
                    clearable></el-input>
        </el-col>
      </el-row>
    </div>
    <el-table class="table-body" ref="multipleTable" :data="tableData" border @sort-change="sortChange" size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center" v-if="multiple"></el-table-column>
      <el-table-column label="名字" prop="name" align="center">
      </el-table-column>
      <el-table-column label="图片" prop="url" align="center">
        <template slot="header">
          <div>
            图片
          </div>
          <el-button size="mini" type="primary" style="width: 100%" @click="selectAll" v-if="selectRows.length">选择
          </el-button>
        </template>
        <div slot-scope="{row}">
          <KdxImage :src="row.url"></KdxImage>
        </div>
      </el-table-column>
      <el-table-column label="选择" align="center">
        <div slot-scope="{row}">
          <el-button size="mini" type="primary" style="width: 100%" :disabled="disabled(row)" @click="select(row.url)">
            选择
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
  </el-drawer>
</template>


<script>
import infoList from "@/components/mixins/infoList";
import KdxImage from "@/components/image/image.vue";
import {productImageFromProduct, productImageList} from "@/api/product/product";
import {productImageListBySkuCode} from "@/api/temu/product";

export default {
  name: 'TemuDlgImageSelector',
  components: {KdxImage},
  mixins: [infoList],
  props: {
    sku: {
      type: String,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    onlyPng: {
      type: Boolean,
      default: false,
    },
    update: {
      type: Function,
      default: undefined,
    },
  },
  computed: {},
  watch: {
    searchInfo: {
      handler() {
        if (!this.inited) {
          return
        }

        this.page = 1
        this.getTableData()
      },
      immediate: true,
      deep: true
    },
    fromVariation: {
      handler() {
        this.page = 1
        this.getTableData()
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: this.getProductImageList,
      fromVariation: 2,
      selectRows: [],
      inited: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.inited = false
      this.$emit('close', false)
    },
    async onOpened() {
      if (this.sku) {
        this.$set(this.searchInfo, "content", this.sku)
      } else {
        this.$set(this.searchInfo, "content", "")
      }
      this.page = 1
      this.pageSize = 30
      this.getTableData()
      this.inited = true
    },
    select(url) {
      if (this.update) {
        if (this.multiple) {
          this.update([url])
        } else {
          this.update(url)
          this.handleBeforeClose()
        }
      }
    },
    selectAll() {
      if (this.update) {
        let list = []
        this.selectRows.forEach((item) => {
          list.push(item.url)
        })
        this.update(list)
        this.handleBeforeClose()
      }
    },
    selectionChange(val) {
      this.selectRows = val
    },
    disabled(row) {
      if (!this.onlyPng) {
        return false
      }
      return row.name.indexOf(".png") < 0
    },
    async getProductImageList(params) {
      if (!this.$attrs.visible) {
        return
      }

      if (this.fromVariation === 1) {
        if (!this.searchInfo.content) {
          this.$message.error("必须输入搜索内容")
          return
        }

        let resp = await productImageListBySkuCode({id: this.searchInfo.content})
        if (resp.code) {
          return
        }

        let array = resp.data || []
        let pageInfo = {data: {}}
        pageInfo.data.page = params.page
        pageInfo.data.page_size = params.page_size
        pageInfo.data.total = array.length
        pageInfo.data.list = []
        for (let i = 0; i < array.length; i++) {
          let v = array[i]
          pageInfo.data.list.push({url: v, name: `图-${i + 1}`})
        }
        return pageInfo
      } else if (this.fromVariation === 2) {
        return await productImageFromProduct(params)
      } else {
        return await productImageList(params)
      }
    }
  },
}
</script>
<style scoped lang="scss">
::v-deep .el-drawer__body {
  padding: 10px;
}
</style>