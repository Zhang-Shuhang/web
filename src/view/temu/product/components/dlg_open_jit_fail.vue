<template>
  <el-drawer :visible.sync="$attrs.visible" title="还价" @opened="onOpened" size="60%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" @selection-change="selectionChange">
      <el-table-column type="selection" width="40" align="center" fixed></el-table-column>
      <el-table-column label="Spu Id" prop="productId" align="center" width="150">
      </el-table-column>
      <el-table-column label="Skc Id" prop="productSkcId" align="center" width="150">
      </el-table-column>
      <el-table-column label="错误原因" prop="errorMsg" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <StartBrowser :id="row.user_id" :account_id="row.account_id" st="width: 100%" name="修改实拍图" :open_url="`https://agentseller.temu.com/govern/compliant-live-photos?scene=1&spuId=${row.productId}`" v-if="row.errorMsg.indexOf('商品实拍图') >= 0"></StartBrowser>
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script>

import StartBrowser from "@/view/temu/components/start_browser.vue";

export default {
  name: 'TemuDlgOpenJitFail',
  components: {StartBrowser},
  mixins: [],
  props: {
    list: {
      type: Array,
    }
  },
  watch: {
  },
  computed: {
  },
  data() {
    return {
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
    },
    selectionChange(val) {
      let ids = val.map(s => s.productSkcId)
      if (ids.length) {
        let text = ids.join(" ")
        this.$copyText(text).then( () => {
          this.$message('复制 ' + text + ' 成功')
        }, function () {
          this.$message.error('复制 ' + text + ' 失败')
        })
      }
    },
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
    height: 90px;
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

::v-deep .el-upload--text {
  width: 100%;
}

</style>