<template>
  <el-drawer :visible.sync="$attrs.visible" title="备货" @opened="onOpened" size="85%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <template slot="title">
      <div style="float: left">
        备货({{ isConfirm ? '已确认' : '未确认' }})
      </div>
      <div style="float: right; width: 600px">
        <el-row :gutter="5">
          <el-col :span="6">
            <el-switch v-model="isConfirm" @change="syncBeiHuoList(true)" active-text="已确认"
                       inactive-text="未确认"></el-switch>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="primary"
                       style="width: 100%" :disabled="!beiHuoList || beiHuoList.length <= 0 || selectRows.length===0"
                       @click="exportByChannel(`出口易`, selectRows)">导出出口易
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="primary"
                       style="width: 100%" :disabled="!beiHuoList || beiHuoList.length <= 0 || selectRows.length===0"
                       @click="exportByChannel(`万邑通`, selectRows)">导出万邑通
            </el-button>
          </el-col>
          <el-col :span="6">
            <el-button size="mini" type="danger"
                       style="width: 100%" :disabled="selectRows.length===0"
                       @click="deleteBeiHuo(selectRows)">删除
            </el-button>
          </el-col>
        </el-row>
      </div>
    </template>
    <el-table class="table-body" ref="multipleTable" :data="showBeiHuoList" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
      <el-table-column label="货号" prop="id" align="center">
      </el-table-column>
      <el-table-column label="是否工厂" prop="is_factory" align="center" sortable="custom">
        <template slot="header">
          <el-select size="mini" v-model="is_factory" style="width: 100%">
            <el-option label="全部" :value="0"></el-option>
            <el-option label="工厂" :value="1"></el-option>
            <el-option label="非工厂" :value="2"></el-option>
          </el-select>
        </template>

        <template slot-scope="{row}">
          <el-tag size="mini" :type="row.is_factory ? `warning` : `primary`" effect="dark">
            {{ row.is_factory ? "工厂" : "非工厂" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="建议备货量" prop="advice_count" align="center">
        <template slot-scope="{row}">
          <el-input-number size="mini" style="width: 100%" v-model="row.advice_count" :min="0" :max="100000"
                           :precison="0"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="海运数量" prop="ship_count" align="center">
      </el-table-column>
      <el-table-column v-for="(w, index) in areas" :key="index" :label="w" align="center">
        <el-table-column label="剩余库存" prop="left_count" align="center">
          <template slot-scope="{row}">
            {{ beiHuo(row, w).left_count }}
          </template>
        </el-table-column>
        <el-table-column label="采购库存" prop="count" align="center">
          <template slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="beiHuo(row, w).count" :min="0" :max="100000"
                             :precison="0" @change="addBeiHuo(row)"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="在途库存" prop="on_way_count" align="center">
          <template slot-scope="{row}">
            {{ beiHuo(row, w).on_way_count }}
          </template>
        </el-table-column>
        <el-table-column label="总库存" align="center">
          <template slot-scope="{row}">
            {{ beiHuo(row, w).on_way_count + beiHuo(row, w).count + beiHuo(row, w).left_count }}
          </template>
        </el-table-column>
        <el-table-column label="分配比例" align="center">
          <template slot-scope="{row}">
            <el-input-number size="mini" style="width: 100%" v-model="beiHuo(row, w).ratio" :min="0"
                             :precison="2"></el-input-number>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250px">
        <template slot-scope="{row}">
          <el-row :gutter="5">
            <el-col :span="12">
              <el-button size="mini" type="warning" style="width: 100%" @click="setAdd(row)">比例分配</el-button>
            </el-col>
            <el-col :span="12">
              <el-button size="mini" type="primary" style="width: 100%" @click="addBeiHuo(row)">保存</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="5" style="margin-top: 5px">
            <el-col :span="12">
              <el-button size="mini" type="warning" style="width: 100%" @click="confirmBeiHuo(row)">
                {{ row.is_confirm ? '取消采购' : '确认采购' }}
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button size="mini" type="danger" style="width: 100%" @click="deleteBeiHuo([row])">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>


<script>
import {
  overseasWarehouseAddBeiHuo,
  overseasWarehouseBeiHuoList,
  overseasWarehouseConfirmBeiHuo,
  overseasWarehouseDeleteBeiHuo,
  overseasWarehouseExportBeiHuo
} from "@/api/oversea_warehouse/list";

export default {
  name: 'TemuDlgStockBeiHuo',
  mixins: [],
  props: {
    ids: {
      type: Array,
    },
  },
  computed: {
    showBeiHuoList() {
      if (!this.beiHuoList) {
        return []
      }
      if (this.is_factory === 0) {
        return this.beiHuoList
      }
      return this.beiHuoList.filter(item => {return item.is_factory === (this.is_factory === 1)})
    }
  },
  watch: {},
  data() {
    return {
      array: [],
      areas: ["美东", "美西"],
      beiHuoList: [],
      selectRows: [],
      isConfirm: false,
      is_factory: 0,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    beiHuo(row, area) {
      return row.list.find((item) => {
        return item.area === area
      })
    },
    selectionChange(val) {
      this.selectRows = val
    },
    async confirmBeiHuo(row) {
      let resp = await overseasWarehouseConfirmBeiHuo({ids: [row.id], is_confirm: !row.is_confirm})
      if (resp.code) {
        return
      }

      this.$message("确认成功")
      this.syncBeiHuoList(false)
    },
    async addBeiHuo(row) {
      let list = []
      row.list.forEach(item => {
        list.push({stock_id: row.id, area: item.area, count: item.count, is_confirm: row.is_confirm})
      })
      let resp = await overseasWarehouseAddBeiHuo(list)
      if (resp.code) {
        return
      }

      if (this.ids.length === 1) {
        this.$emit("update")
      }
    },
    deleteBeiHuo(rows) {
      if (rows.length <= 0) {
        return
      }

      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let ids = rows.map(item => {
          return item.id
        })
        let resp = await overseasWarehouseDeleteBeiHuo({ids: ids, is_confirm: rows[0].is_confirm})
        if (resp.code) {
          return
        }

        this.beiHuoList = this.beiHuoList.filter(item => {
          return rows.indexOf(item) === -1
        })
        if (!this.beiHuoList.length) {
          this.handleBeforeClose()
          this.$emit("update")
        }
      })
    },
    async exportByChannel(channel, rows) {
      let resp = await overseasWarehouseExportBeiHuo({channel: channel, ids: rows.map(item => {return item.id}), is_confirm: rows[0].is_confirm})
      if (resp.code) {
        return
      }
      this.$message("导出成功，服务器只保留1天，请记得清空备货计划")
      window.open(resp.data, "_blank")
    },
    setAdd(row) {
      let totalRatio = 0
      let totalCount = row.advice_count
      row.list.forEach(item => {
        if (!item.ratio) {
          return
        }
        totalRatio += item.ratio
        totalCount += item.on_way_count
        totalCount += item.left_count
      })
      if (!totalRatio) {
        this.$message.error("分配比例不对")
        return
      }

      let leftCanAllocate = row.advice_count
      row.list.forEach(item => {
        if (!totalRatio) {
          item.count = 0
          return
        }

        let count = item.on_way_count + item.left_count
        let itemTotalCount = Math.floor(item.ratio / totalRatio * totalCount)
        if (itemTotalCount <= count) {
          item.count = 0
          return
        }

        item.count = itemTotalCount - count
        if (item.count >= leftCanAllocate) {
          item.count = leftCanAllocate
        }
        leftCanAllocate -= item.count

        totalRatio -= item.ratio
        totalCount -= itemTotalCount // 去掉分配的数量
      })
      this.addBeiHuo(row)
    },
    async syncBeiHuoList(isSwitch) {
      let resp = await overseasWarehouseBeiHuoList({ids: this.ids, is_confirm: this.isConfirm})
      if (resp.code) {
        if (isSwitch) {
          this.isConfirm = !this.isConfirm
        }
        return
      }

      this.beiHuoList = resp.data
    },
    async onOpened() {
      // 拿备货列表
      this.isConfirm = false
      await this.syncBeiHuoList(false)
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
::v-deep .el-switch {
  height: 30px; // 重置
}
</style>