<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>商品属性</span>
    </div>
    <div>
      <el-row :gutter="5">
        <template v-for="(p, index) in value.properties">
          <el-col :span="6" v-if="p.valueRule === 0 && values(p).length">
            <el-form-item :label="p.isImportant ? '*' + p.name : p.name">
              <el-select v-model="p.ids" placeholder="请选择" multiple collapse-tags filterable clearable
                         :multiple-limit="p.chooseMaxNum" :style="{width: '100%'}" @change="changed">
                <el-option v-for="(item, index) in values(p)" :key="index" :label="item.value"
                           :value="item.vid"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-else-if="p.valueRule === 2 && canShow(p)">
            <el-form-item :label="p.isImportant ? '*' + p.name : p.name">
              <el-input v-model="p.prop_value" clearable style="width: 100%" @change="changed">
                <template slot="append" v-if="p.valueUnit">{{p.valueUnit.join(",")}}</template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row :gutter="5">
        <template v-for="(p, index) in value.properties">
          <el-col :span="24" :key="index*3+1" v-if="p.valueRule === 1 && values(p).length">
            <el-form-item :label="p.isImportant ? '*' + p.name : p.name">
              <el-row>
                <el-col :span="9">
                  <el-select v-model="p.id" placeholder="请选择" filterable clearable :style="{width: '100%'}" @change="changed">
                    <el-option v-for="(item, index) in values(p)" :key="index" :label="item.value"
                               :value="item.vid"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="9">
                  <el-input-number v-model="p.number_input_value" :precision="p.valuePrecision" :min="0" :max="100" style="width: 100%" @change="changed"></el-input-number>
                </el-col>
                <el-col :span="3">
                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-minus" :disabled="!canDelete(p)" @click="deleteProperty(p)"></el-button>
                </el-col>
                <el-col :span="3">
                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="addProperty(p)"></el-button>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
      <el-row :gutter="5">
        <template v-for="(p, index) in value.properties">
          <el-col :span="6" :key="index*3+2" v-if="p.valueRule === 2 && !canShow(p) && (!p.parentTemplatePid || values(p).length > 0)">
            <el-form-item :label="p.isImportant ? '*' + p.name : p.name">
              <el-input-number v-model="p.prop_value" :precision="Math.min(p.valuePrecision, 5)" :min="0" style="width: 100%" @change="changed"></el-input-number>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </div>
  </el-card>
</template>

<script>

export default {
  name: 'TemuProductProperties',
  components: {},
  mixins: [],
  props: ['value'],
  data() {
    return {}
  },
  watch: {
    "value.properties"() {
      this.changed()
    }
  },
  methods: {
    values(p) {
      if (!p.parentTemplatePid) {
        return p.values || []
      }

      // 找自己的values
      let parent = this.value.properties.find((item) => {
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
    canDelete(property) {
      let list = this.value.properties.filter((prop) => {
        return prop !== property && prop.templatePid === property.templatePid
      })
      return list.length > 0
    },
    property(id) {
      return this.value.properties.find((prop) => {
        return prop.refPid === id
      })
    },
    deleteProperty(property) {
      this.value.properties = this.value.properties.filter((prop) => {
        return prop !== property
      })
      this.changed()
    },
    addProperty(property) {
      let newP = {...property}
      newP.number_input_value = undefined
      newP.id = undefined
      this.value.properties.push(newP)
      this.changed()
      return newP
    },
    canShow(property) {
      if (!property.showCondition) {
        return true
      }

      for (const condition of property.showCondition) {
        let p = this.property(condition.parentRefPid)
        if (!p) {
          return false
        }

        for (const vid of condition.parentVids) {
          if (!p.ids) {
            // 没初始化
            return false
          }
          if (p.ids.indexOf(vid) < 0) {
            // 没设置值
            return false
          }
        }
      }
      return true
    },
    changed() {
      let properties = []
      for (const prop of this.value.properties) {
        if (!this.canShow(prop)) {
          continue
        }

        if (prop.valueRule === 0) {
          let values = this.values(prop)
          if (!values) {
            continue
          }
          if (!values.length) {
            continue
          }
          if (prop.isImportant && prop.ids.length <= 0) {
            this.$message.error(`商品属性 ${prop.name} 必填`)
            return
          }

          for (const id of prop.ids) {
            let v = values.find((v) => {
              return v.vid === id
            })
            if (!v) {
              continue // 不能选，但是他选了
            }

            // 操作
            properties.push({
              "valueUnit": prop.valueUnit.length ? prop.valueUnit[0] : "",
              "propValue": v.value,
              "propName": prop.name,
              "refPid": prop.refPid,
              "vid": v.vid,
              "controlType": prop.controlType,
              "pid": prop.pid,
              "templatePid": prop.templatePid,
              "valueExtendInfo": v.extendInfo
            })
          }
        } else if (prop.valueRule === 1) {
          let values = this.values(prop)
          if (!values) {
            continue
          }
          if (!values.length) {
            continue
          }

          if (prop.isImportant && (!prop.id || !prop.number_input_value)) {
            this.$message.error(`商品属性 ${prop.name} 必填`)
            return
          }

          let v = values.find((v) => {
            return v.vid === prop.id
          })
          if (!v) {
            continue // 不能选，但是他选了
          }

          // 操作
          properties.push({
            "valueUnit": prop.valueUnit.length ? prop.valueUnit[0] : "",
            "propValue": v.value,
            "propName": prop.name,
            "numberInputValue": `${prop.number_input_value}`,
            "refPid": prop.refPid,
            "vid": v.vid,
            "controlType": prop.controlType,
            "pid": prop.pid,
            "templatePid": prop.templatePid,
            "valueExtendInfo": v.extendInfo
          })
        } else if (prop.valueRule === 2) {
          if (prop.parentTemplatePid) {
            let values = this.values(prop)
            if (!values) {
              continue
            }
            if (!values.length) {
              continue
            }
          }
          if (prop.isImportant && !prop.prop_value) {
            this.$message.error(`商品属性 ${prop.name} 必填`)
            return
          }

          if (!prop.prop_value) {
            continue
          }

          // 操作
          properties.push({
            "valueUnit": prop.valueUnit.length ? prop.valueUnit[0] : "",
            "propValue": prop.prop_value,
            "propName": prop.name,
            "refPid": prop.refPid,
            "vid": 0,
            "controlType": prop.controlType,
            "pid": prop.pid,
            "templatePid": prop.templatePid,
            "valueExtendInfo": ""
          })
        }
      }
      this.value.real_properties = properties
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
</style>