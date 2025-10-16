<template>
  <el-drawer :visible.sync="$attrs.visible" title="箱唛列表"  @opened="onOpened" size="75%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        箱唛列表
      </div>
      <div style="display: block; float: right; width: 60%">
        <el-row :gutter="5">
          <el-col :span="4">
            <el-input size="mini" placeholder="箱唛号" v-model="searchInfo.package_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input size="mini" placeholder="生产编号" v-model="searchInfo.item_ids" clearable filterable @keyup.enter.native="onSubmit">
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-select size="mini" placeholder="是否打印" v-model="searchInfo.is_printed" clearable filterable style="width: 100%" @change="onSubmit">
              <el-option label="" value=""></el-option>
              <el-option label="未打印" value="1"></el-option>
              <el-option label="已打印" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select size="mini" placeholder="是否扫描" v-model="searchInfo.is_scan" clearable filterable style="width: 100%" @change="onSubmit">
              <el-option label="" value=""></el-option>
              <el-option label="未扫描" value="1"></el-option>
              <el-option label="已扫描" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select size="mini" placeholder="是否生成图纸" v-model="searchInfo.is_generate" clearable filterable style="width: 100%" @change="onSubmit">
              <el-option label="" value=""></el-option>
              <el-option label="已生成" value="1"></el-option>
              <el-option label="未生成" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select size="mini" placeholder="是否开始生产" v-model="searchInfo.is_start_producing" clearable filterable style="width: 100%" @change="onSubmit">
              <el-option label="" value=""></el-option>
              <el-option label="已经开始生产" value="1"></el-option>
              <el-option label="未开始生产" value="2"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" type="primary" @click="onSubmit" style="width: 100%">查询</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column label="箱唛" prop="code" align="center">
        <div slot-scope="{row}">
          <el-link size="mini" type="primary" :href="row.code_url" :underline="false" target="_blank" v-if="row.code_url">{{row.code}}</el-link>
        </div>
      </el-table-column>
      <el-table-column label="箱唛打印信息" align="center">
        <div slot-scope="{row}">
          <el-tag type="primary" size="mini">{{row.is_printed ? new Date(row.printed_time).toLocaleString() : "未打印"}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="箱唛扫描信息" align="center">
        <div slot-scope="{row}">
          <el-tag type="primary" size="mini">{{row.box_scan_time ? new Date(row.box_scan_time).toLocaleString() : "未扫描"}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="生产序号" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            {{ item.id }}
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="唯一Id" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            {{ item.unique_id }}
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="货号" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            {{ item.ext_code }}
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="图片" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            <el-link size="mini" type="primary" :href="item.image" :underline="false" target="_blank">图片</el-link>
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="条码" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            <el-link size="mini" type="primary" :href="item.barcode ? item.barcode.pdf_url : item.code_url" :underline="false" target="_blank" v-if="item.barcode || item.code_url">条码</el-link>
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="打印时间" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            <el-tag size="mini" type="primary" v-if="item.printed_time">{{ new Date(item.printed_time).toLocaleString() }}</el-tag>
          </div>
          <div class="footer">
            打印进度: {{printedCount(row.items)}}/{{row.items.length}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="是否生成图纸" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            <el-tag size="mini" type="primary">{{ item.is_generate_diagram > 0 ? `已生成(${row.is_generate_diagram === 1 ? '无法排版' : row.is_generate_diagram})` : "未生成" }}</el-tag>
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="开始生产时间" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            <el-tag size="mini" type="primary" v-if="item.start_producing_time">{{ new Date(item.start_producing_time).toLocaleString() }}</el-tag>
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.items.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.items" :key="index">
            <el-button size="mini" :type="item.is_cancel ? 'primary' : 'danger'" @click="cancel(item.id)">{{item.is_cancel ? "继续生产" : "取消生产"}}</el-button>
          </div>
          <div class="footer">
          </div>
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>

</template>


<script>
import {mapGetters} from "vuex";
import {factoryBatchCancel, factoryBatchPackageList} from "@/api/sf-factory-v2/batch";

export default {
  name: 'DlgBatchPackages',
  mixins: [],
  computed:{
    ...mapGetters("user", ["token"]),
  },
  props: {
    box_id: {
      type: Number,
    },
  },
  watch: {},
  data() {
    return {
      searchInfo: {
        id: undefined,
        package_ids: undefined,
        item_ids: undefined,
      },

      list: [],
      selectRows: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.searchInfo.id = this.box_id
      this.searchInfo.package_ids = undefined
      this.searchInfo.item_ids = undefined
      this.onSubmit()
    },
    async onSubmit() {
      let resp = await factoryBatchPackageList(this.searchInfo)
      if (resp.code) {
        return
      }

      this.list = resp.data
    },
    selectionChange(val) {
      this.selectRows = val
      if (this.selectRows.length <= 0) {
        return
      }

      let ids = this.selectRows.map((item) => {
        return item.code
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
    printedCount(list) {
      let count = 0;
      (list || []).forEach(item => {
        if (item.is_printed) {
          count++
        }
      })
      return count
    },
    async cancel(id) {
      let resp = await factoryBatchCancel({id: id})
      if (resp.code) {
        return
      }

      this.onSubmit()
    }
  },
  mounted() {
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 30px;
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

::v-deep .el-table .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}
</style>