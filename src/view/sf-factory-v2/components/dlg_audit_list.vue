<template>
  <el-drawer :visible.sync="$attrs.visible" title="列表"  @opened="onOpened" size="75%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="tableData" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-table class="table-body" ref="multipleTable" :data="row.tasks" border height="100%" @sort-change="sortChange" size="mini"
                    :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
            <el-table-column label="货号" prop="sku_code" align="center" sortable>
            </el-table-column>
            <el-table-column label="生产编组列表" prop="group_ids" align="center" sortable>
              <div slot-scope="{row}">
                {{row.group_ids.join(" ")}}
              </div>
            </el-table-column>
            <el-table-column label="总数量" prop="total_count" align="center" sortable>
            </el-table-column>
            <el-table-column label="大板" align="center">
              <el-table-column label="一板套数" prop="diagram.big_count" align="center" sortable>
                <div slot-scope="{row}">
                  <el-tag v-if="row.diagram && row.diagram.big_count" size="mini" type="primary">
                    {{row.diagram.big_count}}
                  </el-tag>
                </div>
              </el-table-column>
              <el-table-column label="张数" prop="big_count" align="center" sortable>
                <div slot-scope="{row}">
                  <el-tag v-if="row.diagram && row.diagram.big_count" size="mini" type="primary" effect="dark">{{row.big_count}}</el-tag>
                </div>
              </el-table-column>
            </el-table-column>
            <el-table-column label="单个排版" align="center">
              <el-table-column label="工具排版" prop="diagram.has" align="center" sortable>
                <div slot-scope="{row}">
                  <template v-if="row.left_count">
                    <el-tag v-if="row.diagram && row.diagram.has" size="mini" type="primary">
                      可工具排版
                    </el-tag>
                  </template>
                </div>
              </el-table-column>
              <el-table-column label="W1" prop="diagram.has_w1" align="center" sortable>
                <div slot-scope="{row}">
                  <template v-if="row.left_count">
                    <el-tag v-if="row.diagram && row.diagram.has_w1" size="mini" type="primary">
                      有W1图纸
                    </el-tag>
                  </template>
                </div>
              </el-table-column>
              <el-table-column label="SP" prop="diagram.has_sp" align="center" sortable>
                <div slot-scope="{row}">
                  <template v-if="row.left_count">
                    <el-tag v-if="row.diagram && row.diagram.has_sp" size="mini" type="primary">
                      有SP图纸
                    </el-tag>
                  </template>
                </div>
              </el-table-column>
              <el-table-column label="剩余是否使用工具排版" prop="left_can_tool_print" align="center" sortable>
                <div slot-scope="{row}">
                  <template v-if="row.left_count">
                    <el-tag size="mini" type="primary">
                      {{row.left_can_tool_print ? "工具排版" : "W1排版"}}
                    </el-tag>
                  </template>
                </div>
              </el-table-column>
              <el-table-column label="剩余套数" prop="left_count" align="center" sortable>
                <div slot-scope="{row}">
                  <template v-if="row.left_count">
                    <el-tag size="mini" type="primary" effect="dark">{{row.left_count}}</el-tag>
                  </template>
                </div>
              </el-table-column>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" align="center">
        <div slot-scope="{row}">
          {{ new Date(row.created_at).toLocaleString() }}
        </div>
      </el-table-column>
      <el-table-column label="确认信息" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-if="row.is_audit">
            已确认
          </el-tag>
          <el-button size="mini" style="width: 100%" type="primary" @click="audit(row)" v-else>
            确认
          </el-button>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="mini" style="width: 100%" type="primary" @click="copyGroupIds(row)">
            复制生产编组号
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
import infoList from '@/components/mixins/infoList'
import {diagramAudit, diagramAuditList} from "@/api/sf-factory-v2/diagram";

export default {
  name: 'DlgAuditList',
  mixins: [infoList],
  computed:{
  },
  props: {
  },
  watch: {},
  data() {
    return {
      listApi: diagramAuditList,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.getTableData()
    },
    audit(row) {
      this.$confirm('请确认是否生成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let resp = await diagramAudit({id: row.id})
        if (resp.code) {
          return
        }
        this.getTableData()
      })
    },
    copyGroupIds(row) {
      let ids = []
      row.tasks.forEach((item) => {
        for (const groupId of item.group_ids) {
          if (ids.indexOf(groupId) < 0) {
            ids.push(groupId)
          }
        }
      })
      this.copy(ids.join(" "))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>