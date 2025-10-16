<template>
  <div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px"
               label-position="right">
        <el-row :gutter="5">
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="类目名字" v-model="searchInfo.name" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-select v-model="searchInfo.can_not_tool_print" placeholder="是否可工具排版" filterable
                         clearable style="width: 100%">
                <el-option label="可工具排版" :value="1"></el-option>
                <el-option label="不可工具排版" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="打印材质" v-model="searchInfo.print_material" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :lg="4">
            <el-form-item label-width="0">
              <el-input placeholder="前缀" v-model="searchInfo.prefix" clearable filterable
                        @keyup.enter.native="onSubmit">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onSubmit">查询</el-button>
          </el-col>
          <el-col :xs="8" :sm="3" :lg="3">
            <el-button size="mini" type="primary" style="width: 100%" @click="onCreate">创建类目</el-button>
          </el-col>
        </el-row>
      </el-form>

      <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange"
                size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}"
                @selection-change="selectionChange" :default-expand-all="true">
        <el-table-column type="expand">
          <template slot-scope="{row}">
            <div class="card-container">
              <!-- 工艺卡片 - 只在有数据时显示 -->
              <div class="data-card" v-if="row.techs && row.techs.length">
                <div class="card-header">
                  <div class="card-title">
                    <i class="el-icon-setting"></i> 工艺
                  </div>
                </div>
                <div class="card-content">
                  <div class="tag-container">
                    <el-tag
                        v-for="(item, index) in row.techs"
                        :key="index"
                        type="primary"
                        size="mini"
                    >
                      {{ item.tech ? item.tech.name : `未知: ${item.tech_id}` }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 产品组成卡片 - 只在有数据时显示 -->
              <div class="data-card" v-if="row.goods_list && row.goods_list.length">
                <div class="card-header">
                  <div class="card-title">
                    <i class="el-icon-s-goods"></i> 产品组成
                  </div>
                </div>
                <div class="card-content">
                  <div class="tag-container">
                    <el-tag
                        v-for="(item, index) in row.goods_list"
                        :key="index"
                        type="success"
                        size="mini"
                    >
                      {{ item.goods ? item.goods.name : `未知: ${item.goods_id}` }}
                      x {{ item.count }}
                      <span v-if="item.goods">({{ item.goods.unit }})</span>
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 原材料卡片 - 只在有数据时显示 -->
              <div class="data-card" v-if="row.meta_materials && row.meta_materials.length">
                <div class="card-header">
                  <div class="card-title">
                    <i class="el-icon-cpu"></i> 原材料
                  </div>
                </div>
                <div class="card-content">
                  <div class="tag-container">
                    <el-tag
                        v-for="(item, index) in row.meta_materials"
                        :key="index"
                        type="warning"
                        size="mini"
                    >
                      {{ item.meta_material ? item.meta_material.name : `未知: ${item.meta_material_id}` }}
                      x {{ item.count }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 配件卡片 - 只在有数据时显示 -->
              <div class="data-card" v-if="row.accessories && row.accessories.length">
                <div class="card-header">
                  <div class="card-title">
                    <i class="el-icon-s-tools"></i> 配件
                  </div>
                </div>
                <div class="card-content">
                  <div class="tag-container">
                    <el-tag
                        v-for="(item, index) in row.accessories"
                        :key="index"
                        type="danger"
                        size="mini"
                    >
                      {{ item.accessory ? item.accessory.name : `未知: ${item.accessory_id}` }}
                      x {{ item.count }}
                    </el-tag>
                  </div>
                </div>
              </div>

              <!-- 包装卡片 - 只在有数据时显示 -->
              <div class="data-card" v-if="row.package_materials && row.package_materials.length">
                <div class="card-header">
                  <div class="card-title">
                    <i class="el-icon-shopping-bag-2"></i> 包装
                  </div>
                </div>
                <div class="card-content">
                  <div class="tag-container">
                    <el-tag
                        v-for="(item, index) in row.package_materials"
                        :key="index"
                        type="info"
                        size="mini"
                    >
                      {{ item.package_material ? item.package_material.name : `未知: ${item.package_material_id}` }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
        <el-table-column label="Id" align="center" prop="id" sortable="custom">
        </el-table-column>
        <el-table-column label="名字" align="center" prop="name" sortable="custom">
        </el-table-column>
        <el-table-column label="图片" align="center" width="100px" sortable="custom">
          <div slot-scope="{row}">
            <KdxImage :src="row.image" width="80px" height="80px"></KdxImage>
          </div>
        </el-table-column>
        <el-table-column label="匹配前缀" align="center" prop="prefix" sortable="custom">
        </el-table-column>
        <el-table-column label="匹配后缀" align="center" prop="suffix" sortable="custom">
        </el-table-column>
        <el-table-column label="打印材质" align="center" prop="print_material_id" sortable="custom">
          <div slot-scope="{row}">
            <el-tag type="primary" size="mini" v-if="row.print_material_id">{{ row.print_material_id }}</el-tag>
            <el-tag type="danger" size="mini" v-else>未设置</el-tag>
            <el-tag type="warning" size="mini" effect="dark" v-if="row.can_not_tool_print">不可工具排版</el-tag>
          </div>
        </el-table-column>
        <el-table-column label="成本" align="center" prop="cost" sortable="custom">
        </el-table-column>
        <el-table-column label="价格(￥)/(建议价|最低价为0表示不允许对应类型上传)" align="center" v-if="!canNotSeePrice">
          <el-table-column label="Vmi" align="center" sortable="custom">
            <el-table-column label="建议价" align="center" prop="vmi_price" sortable="custom">
            </el-table-column>
            <el-table-column label="最低价" align="center" prop="vmi_min_price" sortable="custom">
            </el-table-column>
          </el-table-column>
          <el-table-column label="Jit" align="center" sortable="custom">
            <el-table-column label="建议价" align="center" prop="jit_price" sortable="custom">
            </el-table-column>
            <el-table-column label="最低价" align="center" prop="jit_min_price" sortable="custom">
            </el-table-column>
          </el-table-column>
          <el-table-column label="Vmi/Jit活动最低价" align="center" prop="activity_min_price" sortable="custom">
          </el-table-column>
          <el-table-column label="半托管" align="center" sortable="custom">
            <el-table-column label="建议价" align="center" prop="semi_price" sortable="custom">
            </el-table-column>
            <el-table-column label="最低价" align="center" prop="semi_min_price" sortable="custom">
            </el-table-column>
            <el-table-column label="活动最低价" align="center" prop="semi_activity_min_price" sortable="custom">
            </el-table-column>
          </el-table-column>
          <el-table-column label="半托管Y2" align="center" sortable="custom">
            <el-table-column label="建议价" align="center" prop="semi_y2_price" sortable="custom">
            </el-table-column>
            <el-table-column label="最低价" align="center" prop="semi_y2_min_price" sortable="custom">
            </el-table-column>
            <el-table-column label="活动最低价" align="center" prop="semi_y2_activity_min_price" sortable="custom">
            </el-table-column>
          </el-table-column>
        </el-table-column>
        <el-table-column label="重(g)/长宽高(cm)" align="center" prop="weight" sortable="custom" min-width="150px">
          <div slot-scope="{row}">
            <div>
              <el-tag size="mini" type="primary">
                {{ row.weight.toFixed(1) }}g
              </el-tag>
            </div>
            <div>
              <el-tag size="mini" type="primary">
                {{ row.length.toFixed(1) }} x {{ row.width.toFixed(1) }} x {{ row.height.toFixed(1) }}cm
              </el-tag>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="每箱上限" align="center" prop="max_per_box" sortable="custom">
        </el-table-column>
        <el-table-column label="特殊备注" align="center" prop="special_desc" sortable="custom" min-width="150px">
          <div slot-scope="{row}">
            <div style="font-size: 12px">
              {{ row.special_desc }}
            </div>
          </div>
        </el-table-column>
        <el-table-column label="类目说明" align="center" prop="url" sortable="custom">
          <div slot-scope="{row}">
            <div style="font-size: 12px">
              <el-link size="mini" type="primary" :href="row.url" :underline="false" target="_blank" v-if="row.url">
                说明
              </el-link>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <div slot-scope="{row}">
            <el-button type="warning" size="mini" style="width: 100%" @click="onEdit(row.id, true)">
              复制
            </el-button>
            <el-button type="primary" size="mini" style="width: 100%" @click="onEdit(row.id, false)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" style="width: 100%" @click="onEditProperty(row.id)">
              编辑报关
            </el-button>
            <el-button type="primary" size="mini" style="width: 100%" @click="onEditPrice(row.id)" v-if="canUpdateProductCategoryPrice">
              编辑价格
            </el-button>

            <template v-if="allowCategoryTransport">
              <template v-if="row.semi_y2_price > 0">
                <el-button size="mini" type="success" style="width: 100%" @click="onCategoryTransport(row)"
                           v-if="hasSetting(row)">编辑Y2迁移设置
                </el-button>
                <el-button size="mini" type="primary" style="width: 100%" @click="onCategoryTransport(row)" v-else>
                  创建Y2迁移设置
                </el-button>
              </template>

              <div v-if="hasSetting(row)">
                <el-button size="mini" type="danger" style="width: 100%" @click="deleteCategoryTransport(row)">
                  删除Y2迁移设置
                </el-button>
              </div>
            </template>

            <div>
              <el-switch size="mini" style="height: 24px; line-height: 22px" v-model="row.is_ok" active-text="已确认" inactive-text="未确认" :disabled="!canSetProductOk" @change="updateConfirm(row)"></el-switch>
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

    <TemuDlgCategoryEdit :id="categoryEditDlg.id" :is_copy="categoryEditDlg.is_copy" :visible="categoryEditDlg.visible"
                         @close="categoryEditDlg.visible=false" @update="getTableData"></TemuDlgCategoryEdit>
    <TemuDlgCategoryEditPrice :id="categoryEditPriceDlg.id" :visible="categoryEditPriceDlg.visible"
                         @close="categoryEditPriceDlg.visible=false" @update="getTableData"></TemuDlgCategoryEditPrice>
    <TemuDlgCategoryEditProperty :id="categoryEditPropertyDlg.id" :visible="categoryEditPropertyDlg.visible"
                         @close="categoryEditPropertyDlg.visible=false" @update="getTableData"></TemuDlgCategoryEditProperty>
    <TemuDlgCategoryTransport :id="categoryTransportDlg.id" :visible="categoryTransportDlg.visible"
                              @close="categoryTransportDlg.visible=false" @update="query"></TemuDlgCategoryTransport>
  </div>

</template>

<script>
import infoList from '@/components/mixins/infoList'
import KdxImage from "@/components/image/image";
import {mapGetters} from "vuex";
import {categoryListByPage, categoryUpdateConfirm} from "@/api/product/category";
import TemuDlgCategoryEdit from "@/view/product/components/dlg_category_edit.vue";
import TemuDlgCategoryTransport from "@/view/temu/components/dlg_category_transport.vue";
import {semiDeleteY2AutoTransportSetting, semiGetY2AutoTransportSettingExist} from "@/api/temu/semi";
import TemuDlgCategoryEditProperty from "@/view/product/components/dlg_category_edit_property.vue";
import TemuDlgCategoryEditPrice from "@/view/product/components/dlg_category_edit_price.vue";

export default {
  components: {
    TemuDlgCategoryEditPrice,
    TemuDlgCategoryEditProperty,
    TemuDlgCategoryTransport,
    TemuDlgCategoryEdit,
    KdxImage
  },
  mixins: [infoList],
  data() {
    return {
      listApi: categoryListByPage,

      selectRows: [],

      categoryEditDlg: {
        id: undefined,
        is_copy: false,
        visible: false,
      },

      categoryEditPriceDlg: {
        id: undefined,
        visible: false,
      },

      categoryEditPropertyDlg: {
        id: undefined,
        visible: false,
      },

      categoryTransportDlg: {
        id: undefined,
        visible: false,
      },

      hasSettingIds: [],
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token", "canNotSeePrice", "allowCategoryTransport", "canUpdateProductCategoryPrice", "canSetProductOk"]),
  },
  methods: {
    onSubmit() {
      this.page = 1
      this.query()
    },
    async query(page = this.page, page_size = this.pageSize) {
      await this.getTableData(page, page_size)

      let ids = this.tableData.map((item) => {
        return item.id
      })
      let resp = await semiGetY2AutoTransportSettingExist({ids: ids})
      if (resp.code) {
        return
      }

      this.hasSettingIds = resp.data || []
    },
    hasSetting(row) {
      return this.hasSettingIds.indexOf(row.id) >= 0
    },
    onCreate() {
      this.categoryEditDlg.id = undefined
      this.categoryEditDlg.is_copy = false
      this.categoryEditDlg.visible = true
    },
    onEdit(id, isCopy) {
      this.categoryEditDlg.id = id
      this.categoryEditDlg.is_copy = isCopy
      this.categoryEditDlg.visible = true
    },
    onEditPrice(id) {
      this.categoryEditPriceDlg.id = id
      this.categoryEditPriceDlg.visible = true
    },
    onEditProperty(id) {
      this.categoryEditPropertyDlg.id = id
      this.categoryEditPropertyDlg.visible = true
    },
    selectionChange(val) {
      this.selectRows = val
    },
    onCategoryTransport(row) {
      this.categoryTransportDlg.id = row.id
      this.categoryTransportDlg.visible = true
    },
    async deleteCategoryTransport(row) {
      let resp = await semiDeleteY2AutoTransportSetting({id: row.id})
      if (resp.code) {
        return
      }
      this.$message("删除成功!")
      this.query()
    },
    copy(text) {
      this.$copyText(text).then(() => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    async updateConfirm(row) {
      let resp = await categoryUpdateConfirm({id: row.id})
      if (resp.code) {
        row.is_ok = !row.is_ok
        return
      }

      this.$message("确认成功")
      this.getTableData()
    }
  },
  filters: {},
  mounted() {
  },
  async created() {
    this.query()
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
  text-overflow: ellipsis;
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

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  padding: 20px;
  background-color: #f5f7fa;
  margin-left: 30px;
}

.data-card {
  flex: 1 1 300px;
  min-width: 300px;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: white;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: black;
  color: white;
  padding: 12px 20px;
  border-radius: 8px 8px 0 0;
  font-weight: bold;
  font-size: 16px;
}

.card-content {
  padding: 15px;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.el-tag {
  margin: 4px;
  border-radius: 4px;
}

.empty-message {
  color: #909399;
  font-style: italic;
  padding: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
  }

  .data-card {
    min-width: 100%;
  }
}
</style>