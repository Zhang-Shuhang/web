<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量属性修改" @opened="onOpened" size="50%" :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px" label-position="right">
      <el-row :gutter="5">
        <template v-for="(p, index) in form.properties">
          <el-col :span="12" :key="index" v-if="needShow(p) && values(p).length">
            <el-form-item :label="p.isImportant ? '*' + p.name : p.name">
              <el-select v-model="p.ids" placeholder="请选择" multiple filterable clearable
                         :multiple-limit="p.chooseMaxNum" :style="{width: '100%'}">
                <el-option v-for="(item, index) in values(p)" :key="index" :label="item.value"
                           :value="item.vid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </el-row>

      <el-form-item label-width="0" v-if="spu_ids">
        <el-button type="primary" style="width: 100%; height: 80px; margin-top: 10px" @click="batchSubmit">批量提交({{spu_ids.length}})个</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>

import {simpleProductCategoryTemplateQuery} from "@/api/temu/simple_product";
import {adjustTaskBatch} from "@/api/temu/adjust_task";

export default {
  name: 'TemuDlgBatchAdjustTask',
  props: {
    category_id: {
      type: Number,
    },
    account_id: {
      type: Number,
    },
    property_ids: {
      type: Array,
    },
    spu_ids: {
      type: Array,
    },
  },
  computed: {
  },
  data() {
    return {
      form: {
        properties: []
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await simpleProductCategoryTemplateQuery({id: this.category_id, account_id: this.account_id})
      if (resp.code) {
        return
      }
      this.form.properties = []
      for (const property of resp.data.properties) {
        property.ids = []
        this.form.properties.push(property)
      }
    },
    values(p) {
      if (!p.parentTemplatePid) {
        return p.values || []
      }

      // 找自己的values
      let parent = this.form.properties.find((item) => {
        return item.templatePid === p.parentTemplatePid
      })
      if (!parent) {
        return []
      }

      for (const tp of (p.templatePropertyValueParentList || [])) {
        let exist = true
        for (const pvid of tp.parentVidList) {
          if (parent.ids.indexOf(pvid) < 0) {
            // 不存在
            exist = false
            break
          }
        }
        if (!exist) {
          continue
        }

        // 操作
        return p.values.filter((item) => {
          return tp.vidList.indexOf(item.vid) >= 0
        })
      }
      return []
    },
    needShow(p) {
      if (this.property_ids.indexOf(p.refPid) >= 0) {
        return true
      }
      let parent = this.form.properties.find((item) => {
        return item.templatePid === p.parentTemplatePid
      })
      if (!parent) {
        return false
      }

      for (const tp of (p.templatePropertyValueParentList || [])) {
        let exist = true
        for (const pvid of tp.parentVidList) {
          if (parent.ids.indexOf(pvid) < 0) {
            // 不存在
            exist = false
            break
          }
        }
        if (!exist) {
          continue
        }

        // 操作
        return true
      }

      return false
    },
    async batchSubmit() {
      let list = []
      for (const p of this.form.properties) {
        if (!this.needShow(p)) {
          continue
        }

        if (p.isImportant && p.ids.length <= 0) {
          this.$message.error(`${p.name} 未选择`)
          return
        }

        for (const vid of p.ids) {
          let value = p.values.find((item) => {
            return item.vid === vid
          })
          if (!value) {
            this.$message.error(`没找到: ${vid}`)
            return
          }

          list.push({
            numberInputValue: "",
            pid: p.pid,
            propName: p.name,
            propValue: value.value,
            refPid: p.refPid,
            templatePid: p.templatePid,
            valueExtendInfo: value.extendInfo,
            valueUnit: "",
            vid: vid,
          })
        }
      }

      let resp = await adjustTaskBatch({spu_ids: this.spu_ids, property_ids: this.property_ids, list: list})
      if (resp.code) {
        return
      }

      this.$emit('suc')
      this.handleBeforeClose()
    }
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">
</style>