<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="Sku" v-model="searchInfo.sku" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-input placeholder="请输入产品名字" v-model="searchInfo.name" clearable filterable @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.is_combine" placeholder="请选择是否组合" filterable clearable style="width: 100%">
                <el-option label="" value=""></el-option>
                <el-option label="单品" :value="1"></el-option>
                <el-option label="组合" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="4" :lg="3">
            <el-form-item label-width="0">
              <el-button type="primary" :style="{width: '100%'}" @click="openCreateDlg">创建商品</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false" @selection-change="selectionChange">
        <el-table-column type="selection" width="40" align="center"></el-table-column>
        <el-table-column label="Id" prop="id" align="center">
        </el-table-column>
        <el-table-column label="名字" prop="name" align="center">
        </el-table-column>
        <el-table-column label="货号" prop="sku" align="center">
        </el-table-column>
        <el-table-column label="图片" align="center">
          <div slot-scope="{row}">
            <KdxImage :src="row.image" v-if="row.image"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" align="center">
          <div slot-scope="{row}">
            {{new Date(row.created_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="最近更新时间" prop="updated_at" align="center">
          <div slot-scope="{row}">
            {{new Date(row.updated_at).toLocaleString()}}
          </div>
        </el-table-column>
        <el-table-column label="单位" prop="unit" align="center">
        </el-table-column>
        <el-table-column label="重量(g)" prop="weight" align="center">
          <div slot-scope="{row}">
            {{weight(row)}}
          </div>
        </el-table-column>
        <el-table-column label="公开状态" align="center">
          <div slot-scope="{row}">
            {{row.group_id === 0 ? "公开" : (groupId === row.group_id ? "本司" : "他司")}}
          </div>
        </el-table-column>
        <el-table-column label="是否组合" align="center">
          <div slot-scope="{row}">
            {{row.is_combine ? "组合" : "单品"}}

            <div v-if="row.is_combine">
              <hr>
              <div v-for="(goods, index) in row.combine_goods">
                <div v-if="goods">
                  {{goods.name}} * {{row.combine_goods_counts[index]}} ({{goods.unit}})
                </div>
                <div v-else>
                  {{row.combine_goods_ids[index]}} * {{row.combine_goods_counts[index]}}
                </div>
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <div slot-scope="{row}">
            <el-button size="mini" style="width: 100%" type="primary" @click="openEditGoodsDlg(row)" plain>编辑</el-button>
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

    <TemuDlgEditGoods :row="editGoodsDlg.row" :visible="editGoodsDlg.visible" @close="editGoodsDlg.visible=false" @update="getTableData"></TemuDlgEditGoods>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import {factoryWarehouseGoodsListByPage} from "@/api/factory_warehouse/goods";
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import TemuDlgEditGoods from "@/view/factory_warehouse/goods/components/dlg_edit_goods.vue";
import TemuDlgDiagramEdit from "@/view/product/components/dlg_diagram_edit.vue";

export default {
  components: {
    TemuDlgDiagramEdit,
    TemuDlgEditGoods,
    KdxImage
  },
  computed: {
    ...mapGetters("user", ["groupId"]),
  },
  mixins: [infoList],
  watch: {
    searchInfo: {
      handler() {
        if (!this.inited) {
          return
        }
        if (this.timeoutId) {
          clearTimeout(this.timeoutId)
        }
        this.timeoutId = setTimeout(this.onSubmit, 200)
      },
      immediate: true,
      deep: true
    }
  },
  data() {
    return {
      listApi: factoryWarehouseGoodsListByPage,
      selectRows: [],
      timeoutId: undefined,
      editGoodsDlg: {
        row: undefined,
        visible: false,
      }
    }
  },
  methods: {
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length <= 0) {
        return
      }

      let skus = this.selectRows.map((item) => {
        return item.sku
      })
      this.copy(skus.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    openCreateDlg() {
      this.editGoodsDlg.row = undefined
      this.editGoodsDlg.visible = true
    },
    openEditGoodsDlg(row) {
      this.editGoodsDlg.row = row
      this.editGoodsDlg.visible = true
    },
    weight(row) {
      if (!row.is_combine) {
        return row.weight
      }

      let weight = 0
      for (let i = 0; i < row.combine_goods.length; i++) {
        let goods = row.combine_goods[i]
        if (!goods) {
          continue
        }

        weight += goods.weight * row.combine_goods_counts[i]
      }

      return weight
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.getTableData()
    this.inited = true
  }
}
</script>
<style scoped lang="scss">
</style>