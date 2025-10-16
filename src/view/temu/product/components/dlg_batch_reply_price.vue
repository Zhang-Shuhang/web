<template>
  <el-drawer :visible.sync="$attrs.visible" title="还价" @opened="onOpened" size="90%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="singleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="Id" prop="id" align="center">
      </el-table-column>
      <el-table-column label="拒绝原因" prop="price.reject_remark" align="center">
        <div slot-scope="{row}">
          <span style="font-size: 12px">
            {{row.price.reject_remark}}
          </span>
        </div>
      </el-table-column>
      <el-table-column label="Sku" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.reviews.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(review, index) in row.reviews" :key="index">
            {{ review.id }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="货号" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.reviews.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(review, index) in row.reviews" :key="index">
            {{ review.variation.ext_code }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="变体图" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.reviews.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(review, index) in row.reviews" :key="index">
            <KdxImage :src="review.variation.thumb_url" width="90px" height="90px"></KdxImage>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="原价" align="center">
        <div slot-scope="{row}">
          {{(row.price.supply_price/100).toFixed(2)}}
        </div>
      </el-table-column>
      <el-table-column label="建议价" align="center">
        <div slot-scope="{row}">
          {{(row.price.suggest_supply_price/100).toFixed(2)}}
        </div>
      </el-table-column>
      <el-table-column label="还价" align="center" min-width="180px">
        <template slot="header">
          <div>还价</div>

          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="reduce001">统一降价1分</el-button>
          </div>
          <div style="margin-top: 5px">
            <el-button type="danger" size="mini" style="width: 100%" @click="batchAgree">批量设置同意价格</el-button>
          </div>
          <div>
            <el-col :span="16">
              <el-input-number v-model="reply_price.batch" size="mini" style="width: 100%" :step="0.01" :precision="2" :min="0">
              </el-input-number>
            </el-col>
            <el-col :span="8">
              <el-button size="mini" style="width: 100%" type="danger" @click="batchSetReplyPrice">批量设置</el-button>
            </el-col>
          </div>
        </template>
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.reviews.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(review, index) in row.reviews" :key="index">
            <el-input-number v-model="review.reply_price" size="mini" style="width: 100%" :step="0.01" :precision="2" :min="row.price.suggest_supply_price/100" :max="row.price.supply_price/100">
            </el-input-number>

            <el-button size="small" type="primary" style="width: 100%" @click="agree(row, review)">设置同意价格</el-button>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="原因" align="center" width="250px">
        <template slot="header">
          <div>
            原因
          </div>
          <div>
            <el-select v-model="reason.type" size="mini" placeholder="类型" filterable clearable style="width: 100%">
              <el-option :label="r.name" :value="r.type" v-for="(r, index) in reasonOptions" :key="index"></el-option>
            </el-select>
          </div>
          <div>
            <el-input type="textarea" size="mini" :autosize="{ minRows: 2, maxRows: 10 }" style="width: 100%" v-model="reason.detail" clearable></el-input>
          </div>
          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="addReason" :disabled="reason.type === undefined || !reason.detail">添加</el-button>
          </div>
          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="clearReasons">清空</el-button>
          </div>
        </template>
        <div slot-scope="{row}">
          <div v-for="(reason, index) in row.reasons" :key="index">
            {{reasonName(reason.type)}}: {{reason.detail}}
            <i class="el-icon-delete" style="color: red" @click="deleteReason(row, index)"></i>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="额外链接" align="center" width="250px">
        <template slot="header">
          <div>
            额外链接
          </div>
          <div>
            <el-input size="mini" style="width: 100%" v-model="external_link" clearable></el-input>
          </div>
          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="addExternalLink" :disabled="external_link === undefined || !external_link">添加</el-button>
          </div>
          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="clearExternalLinkList">清空</el-button>
          </div>
        </template>
        <div slot-scope="{row}">
          <div v-for="(external_link, index) in row.external_link_list" :key="index">
            <el-link size="mini" type="primary" :href="external_link" :underline="false" target="_blank">{{external_link}}</el-link>
            <i class="el-icon-delete" style="color: red" @click="deleteExternalLink(row, index)"></i>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="结果" align="center">
        <div class="item-container" slot-scope="{row}">
          <div :class="index+1 === row.reviews.length ? [`item`] : [`item`, `item-bottom`]"
               v-for="(review, index) in row.reviews" :key="index">
            {{review.result}}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="small" type="warning" style="width: 100%" @click="submit([row])">提交</el-button>
          <el-button size="small" type="warning" style="width: 100%;margin-top: 5px" @click="reject([row])">拒绝</el-button>
          <el-button size="small" type="primary" style="width: 100%;margin-top: 5px" @click="remove(row)">移除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-button size="medium" type="primary" style="height: 100px; width: 100px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="submit(list)">逐个提交</el-button>
    <el-button size="medium" type="warning" style="height: 100px; width: 100px; position: absolute; right: 130px; bottom: 300px; z-index: 9999" @click="reject(list)">统一拒绝</el-button>
  </el-drawer>
</template>

<script>

import KdxImage from "@/components/image/image.vue";
import {variationReplyPrice, variationRejectPrice} from "@/api/temu/variation";

export default {
  name: 'TemuDlgBatchReplyPrice',
  components: {KdxImage},
  mixins: [],
  props: {
    rows: {
      type: Array,
    }
  },
  watch: {
    content() {
    },
  },
  computed: {
  },
  data() {
    return {
      list: [],
      reply_price: {
        batch: undefined,
      },
      reason: {
        type: undefined,
        detail: undefined,
      },
      external_link: "",

      reasonOptions: [
        {type: 0, name: "材质"},
        {type: 3, name: "品类"},
        {type: 4, name: "外观"},
        {type: 5, name: "版型"},
        {type: 6, name: "图案"},
        {type: 7, name: "规格尺寸"},
      ]
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let list = []
      for (const row of this.rows) {
        let d = {id: row.id, price: row.price, reviews: [], reasons: [], external_link_list: []}
        for (const review of row.reviews) {
          let r = {...review, reply_price: row.price.supply_price / 100, result: ""}
          d.reviews.push(r)
        }
        list.push(d)
      }
      this.list = list
    },
    remove(row) {
      this.list = this.list.filter((item) => {return item !== row})
    },
    agree(row, review) {
      review.reply_price = row.price.suggest_supply_price/100
    },
    batchAgree() {
      for (const item of this.list) {
        for (const review of item.reviews) {
          review.reply_price = item.price.suggest_supply_price/100
        }
      }
    },
    reduce001() {
      for (const item of this.list) {
        for (const review of item.reviews) {
          review.reply_price = (item.price.supply_price-1)/100
        }
      }
    },
    batchSetReplyPrice() {
      if (!this.reply_price.batch) {
        return
      }

      let batchPrice = Number(this.reply_price.batch)
      if (!batchPrice) {
        return
      }

      for (const item of this.list) {
        for (const review of item.reviews) {
          if (batchPrice < item.price.suggest_supply_price/100) {
            review.reply_price = item.price.suggest_supply_price/100
          } else {
            review.reply_price = batchPrice
          }
        }
      }
    },
    reasonName(tp) {
      let op = this.reasonOptions.find((item) => {return item.type === tp})
      if (!op) {
        return `未知${tp}`
      }
      return op.name
    },
    addReason() {
      this.list.forEach((item) => {
        item.reasons.push({type: this.reason.type, detail: this.reason.detail})
      })
    },
    deleteReason(row, index) {
      row.reasons.splice(index, 1)
    },
    clearReasons() {
      this.list.forEach((item) => {
        item.reasons = []
      })
    },
    addExternalLink() {
      this.list.forEach((item) => {
        if (item.external_link_list.indexOf(this.external_link) < 0) {
          item.external_link_list.push(this.external_link)
        }
      })
    },
    deleteExternalLink(row, index) {
      row.external_link_list.splice(index, 1)
    },
    clearExternalLinkList() {
      this.list.forEach((item) => {
        item.external_link_list = []
      })
    },
    submit(list) {
      for (const v of list) {
        if ((v.external_link_list || []).length > 0) {
          let reasons = v.reasons || []
          if (reasons.length <= 0) {
            this.$message.error(`${v.id} 有链接的，必须带原因!`)
            return
          }
        }
      }

      this.$confirm('确认操作，操作非常危险, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            for (const v of list) {
              // 操作
              let data = {}
              data.id = v.id
              data.list = []
              data.reasons = v.reasons
              data.external_link_list = v.external_link_list
              for (const review of v.reviews) {
                data.list.push({
                  id: review.id,
                  price: review.reply_price,
                })
              }
              let resp = await variationReplyPrice(data)
              if (resp.code) {
                v.result = resp.msg
                return
              }
              v.result = "成功"
              this.remove(v)
            }

            this.$message("操作成功")
          })
    },
    reject(list) {
      this.$confirm('确认是否拒绝， 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let ids = []
            for (const v of list) {
              ids.push(v.id)
            }
            let resp = await variationRejectPrice({ids: ids})
            if (resp.code) {
              return
            }
            for (const v of list) {
              v.result = "拒绝成功"
              this.remove(v)
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

</style>