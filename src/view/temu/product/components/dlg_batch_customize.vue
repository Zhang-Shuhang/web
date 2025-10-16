<template>
  <el-drawer :visible.sync="$attrs.visible" title="设置定制配置" @opened="onOpened" size="90%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="singleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="账号" prop="account.name" align="center">
      </el-table-column>
      <el-table-column label="Spu Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="Skc Id" prop="product_skc_id" align="center">
      </el-table-column>
      <el-table-column label="货号" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.list.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.list" :key="index">
            {{ item.ext_code }}
          </div>
        </div>
      </el-table-column>
      <el-table-column align="center" prop="thumb_url" label="图片">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.list.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.list" :key="index">
            <KdxImage :src="item.thumb_url"></KdxImage>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="是否已配置好" prop="valid" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.list.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(item, index) in row.list" :key="index">
            {{ item.valid ? "已配置好" : "未配置好" }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作结果" prop="reason" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="small" type="warning" style="width: 100%" @click="submit([row])" v-if="isValid(row)">提交</el-button>
          <el-button size="small" type="primary" style="width: 100%" @click="remove(row)">移除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="submit(validList)" :disabled="validList.length <= 0">逐个提交</el-button>
  </el-drawer>
</template>

<script>

import KdxImage from "@/components/image/image.vue";
import {productCustomizeEdit, productQueryCustomizeImages} from "@/api/temu/product";
import {mapGetters} from "vuex";

export default {
  name: 'TemuDlgBatchCustomize',
  components: {KdxImage},
  mixins: [],
  props: {
    ids: {
      type: Array,
    },
    ext_codes: {
      type: Array,
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    validList(){
      let list = []

      if (this.list) {
        list = this.list.filter((row) => {
          return this.isValid(row)
        })
      }

      return list || []
    }
  },
  data() {
    return {
      list: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await productQueryCustomizeImages({ids: this.ids, ext_codes: this.ext_codes})
      if (resp.code) {
        return
      }

      for (const d of resp.data) {
        d.reason = ""
      }
      this.list = resp.data
    },
    remove(row) {
      this.list = this.list.filter((item) => {return item !== row})
    },
    handleSuccess(item, field, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      item[field] = res.data.url
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    isValid(row) {
      for (const v of row.list) {
        if (!v.valid) {
          return false
        }
      }

      return true
    },
    submit(list) {
      for (const v of list) {
        if (!this.isValid(v)) {
          this.$message.error(`${v.id} 图片没有全部上传好!`)
          return
        }
      }

      this.$confirm('确认操作，操作非常危险, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
            for (const v of list) {
              let data = {}
              data.id = v.id
              data.list = v.list
              let resp = await productCustomizeEdit(data)
              if (resp.code) {
                v.reason = resp.msg
                return
              }
              v.reason = "成功"
              setTimeout(() => {
                this.remove(v)
              }, 3000)
            }

            this.$message("操作成功")
          })
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