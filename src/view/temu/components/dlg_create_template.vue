<template>
  <el-drawer :visible.sync="$attrs.visible" @opened="onOpened" size="90%" :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div slot="title">
      <div style="display: block; float: left; height: 24px; line-height: 22px">
        {{ form.cat_name ? '创建模板: ' + form.cat_name : '创建模板' }}
      </div>
      <div style="display: block; float: right; height: 24px; line-height: 22px" v-if="form.cat_id">
        <el-button size="mini" type="primary" @click="reSelectCategory">
          重选类目
        </el-button>
      </div>
    </div>
    <div class="search-term">
      <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="150px" label-position="right">
        <template v-if="!form.cat_id">
          <TemuProductCategorySearch :default_account_id="form.default_account_id" @select="handleSelect"></TemuProductCategorySearch>
        </template>
        <template v-else>
          <TemuProductTemplateBase v-model="form"></TemuProductTemplateBase>
          <TemuProductProperties v-model="form"></TemuProductProperties>
          <TemuProductSpecProp v-model="form"></TemuProductSpecProp>
          <TemuProductSize v-model="form"></TemuProductSize>
          <TemuProductSkuList v-model="form"></TemuProductSkuList>

          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>详情图</span>

              <div style="float: right">
                <el-row :gutter="5">
                  <el-col :span="12">
                    <el-select v-model="selectProduct" size="mini" placeholder="请选择产品" filterable clearable
                               style="width: 100%"
                               @change="notifySelectProductChanged" remote :remote-method="searchProductList"
                               value-key="id">
                      <el-option :key="index" :label="p.name" :value="p" v-for="(p, index) in showProductList">
                        <div style="width: 300px">
                          <div style="float: left">{{ p.name }}</div>
                          <div style="float: right"
                               v-if="p.user_images_list && p.user_images_list.length > 0 && p.user_images_list[0].images.length > 0">
                            <KdxImage :src="p.user_images_list[0].images[0]" width="100%" height="28px"></KdxImage>
                          </div>
                        </div>
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="addImage">图片</el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="addText">文字</el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div>
              <el-table :data="form.details" stripe style="width: 100%" border
                        :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
                <el-table-column align="left" label="文字/图片" width="200px">
                  <template slot-scope="{row}">
                    <el-tag size="mini" type="primary">{{ row.is_text ? "文字" : `图片:${row.image_name}` }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="内容">
                  <template slot-scope="{row}">
                    <div v-if="row.is_text">
                      <el-row :gutter="5">
                        <el-col :span="18">
                          <el-input type="textarea" :rows="6" v-model="row.text" placeholder="请输入文本内容"
                                    clearable></el-input>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label-width="80" label="文字颜色" style="margin-bottom: 0px">
                            <el-color-picker v-model="row.font_color"></el-color-picker>
                          </el-form-item>
                          <el-form-item label-width="80" label="背景颜色" style="margin-bottom: 0px">
                            <el-color-picker v-model="row.background_color"></el-color-picker>
                          </el-form-item>
                          <el-form-item label-width="80" label="字体大小" style="margin-bottom: 0px">
                            <el-input-number v-model="row.font_size" :min="12" :max="100" :precision="0">
                            </el-input-number>
                          </el-form-item>
                          <el-form-item label-width="80" label="对齐方式" style="margin-bottom: 0px">
                            <el-radio-group v-model="row.align">
                              <el-radio-button label="left">靠左</el-radio-button>
                              <el-radio-button label="center">居中</el-radio-button>
                              <el-radio-button label="right">靠右</el-radio-button>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <div v-else>
                      <el-row :gutter="5">
                        <el-col :span="18">
                          <KdxImage :src="row.image" width="200px" height="100%" v-if="row.image"></KdxImage>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item label-width="80" label="选择图片">
                            <el-select v-model="row.image_name" size="mini" placeholder="请选择详情图" filterable
                                       style="width: 100%"
                                       @change="notifyDetailChanged(row)">
                              <el-option :key="index" :label="p.name" :value="p.name"
                                         v-for="(p, index) in form.detail_options">
                                <div style="width: 300px">
                                  <div style="float: left">{{ p.name }}</div>
                                  <div style="float: right">
                                    <KdxImage :src="p.image" width="100%" height="28px"></KdxImage>
                                  </div>
                                </div>
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="left" label="操作" width="200px">
                  <template slot-scope="{row}">
                    <el-row :gutter="5">
                      <el-col :span="8">
                        <el-button size="mini" type="danger" style="width: 100%" @click="deleteDetail(row)">删除
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="primary" style="width: 100%" @click="moveDetail(row, -1)">上移
                        </el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="primary" style="width: 100%" @click="moveDetail(row, 1)">下移
                        </el-button>
                      </el-col>
                    </el-row>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>

          <el-button type="primary" size="mini" @click="create" style="width: 100%; height: 50px; margin-top: 10px">
            {{ edit ? "更新" : "创建" }}
          </el-button>
        </template>
      </el-form>
    </div>

  </el-drawer>
</template>

<script>
import {
  simpleProductCategoryTemplateQuery,
  simpleProductSaveTemplate,
  simpleProductQueryOrAddSpecs,
  simpleProductSkuSpecParentList,
  simpleProductTemplate,
  simpleProductCategorySizeSpecMeta,
} from "@/api/temu/simple_product";
import KdxImage from "@/components/image/image.vue";
import {productListByPage} from "@/api/product/product";
import TemuProductProperties from "@/view/temu/components/product_properties.vue";
import TemuProductCategorySearch from "@/view/temu/components/product_category_search.vue";
import TemuProductTemplateBase from "@/view/temu/components/product_template_base.vue";
import TemuProductSpecProp from "@/view/temu/components/product_spec_prop.vue";
import TemuProductSize from "@/view/temu/components/product_size.vue";
import TemuProductSkuList from "@/view/temu/components/product_sku_list.vue";

export default {
  name: 'TemuDlgCreateTemplate',
  components: {
    TemuProductSkuList,
    TemuProductSize,
    TemuProductSpecProp,
    TemuProductTemplateBase,
    TemuProductCategorySearch,
    TemuProductProperties,
    KdxImage,
  },
  mixins: [],
  props: {
    edit: {
      type: Object,
    },
    copy: {
      type: Object,
    },
  },
  computed: {},
  watch: {
    async "form.cat_id"() {
      if (!this.form.cat_id) {
        return
      }
      let resp = await simpleProductCategoryTemplateQuery({
        account_id: this.form.default_account_id,
        id: this.form.cat_id
      })
      if (resp.code) {
        return
      }
      let template = resp.data
      let properties = []
      for (const property of template.properties) {
        if (property.valueRule === 0) {
          properties.push({ids: [], ...property})
        } else if (property.valueRule === 1) {
          properties.push({id: undefined, number_input_value: 0, ...property})
        } else if (property.valueRule === 2) {
          properties.push({prop_value: undefined, ...property})
        }
      }
      this.form.properties = properties;

      resp = await simpleProductCategorySizeSpecMeta({id: this.form.cat_id})
      if (resp.code) {
        return
      }
      this.form.size = resp.data
      this.form.size_records = []
      if (this.form.size && this.form.size.sizeSpecMetaVO.groups) {
        if (this.form.size.sizeSpecMetaVO.groups[0].id === 101) {

        } else if (this.form.size.sizeSpecMetaVO.groups[0].id === 201) {
          let group = {}
          group[this.form.size.sizeSpecMetaVO.groups[0].id] = "size"
          this.form.size.sizeSpecMetaVO.elements.forEach(element => {
            group[element.id] = undefined
          })
          this.form.size_records.push(group)
        }
      }

      resp = await simpleProductSkuSpecParentList()
      if (resp.code) {
        return
      }

      this.form.sku_spec_list = resp.data

      for (const f of this.afterCatIdChangedFuncs) {
        f()
      }
      this.afterCatIdChangedFuncs = []
    },
  },
  data() {
    return {
      form: {
        name: "",
        category: "",
        default_account_id: undefined,
        name_prefixes: [],
        prefix: undefined,
        is_personalize: false,
        is_jit: false,
        technology_type: undefined,
        technology_first_type: undefined,
        technology_twice_type: [],
        cat_id: 0,
        cat_name: "",
        cat_ids: [],
        size: undefined,
        size_records: [],
        properties: [],
        real_properties: [],
        sku_spec_list: [],
        is_auto_upload: false,
        title_prompt: "",
        auto_ext_code_rule: "",

        guide_file: "",

        spec_prop_id1: undefined,
        spec_values1: [],

        spec_prop_id2: undefined,
        spec_values2: [],

        spec_values: [],

        sku_list: [],

        details: [], // 详情
        detail_options: [],
      },
      showProductList: [],
      selectProduct: undefined,

      afterCatIdChangedFuncs: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.form.name = ""
      this.form.cat_id = 0
      this.form.default_account_id = undefined
      this.form.name_prefixes = []
      this.form.prefix = undefined
      this.form.cat_name = ""
      this.form.cat_ids = []
      this.form.properties = []
      this.form.real_properties = []
      this.form.sku_spec_list = []
      this.form.sku_list = []
      this.form.spec_prop_id1 = undefined
      this.form.spec_prop_id2 = undefined
      this.form.spec_values1 = []
      this.form.spec_values2 = []
      this.form.spec_values = []
      this.form.is_personalize = false
      this.form.is_jit = false
      this.form.technology_type = undefined
      this.form.technology_first_type = undefined
      this.form.technology_twice_type = []
      this.form.details = []
      this.form.is_auto_upload = false
      this.form.title_prompt = ""
      this.form.auto_ext_code_rule = ""

      this.afterCatIdChangedFuncs = []

      this.form.guide_file = ""

      // 如果是编辑
      if (this.edit) {
        this.form.name = this.edit.name
        this.form.default_account_id = this.edit.default_account_id
        this.form.name_prefixes = this.edit.name_prefixes
        this.form.prefix = this.edit.prefix
        this.form.is_personalize = this.edit.is_personalize
        this.form.is_jit = this.edit.is_jit
        this.form.technology_type = this.edit.technology_type
        this.form.technology_first_type = this.edit.technology_first_type
        this.form.technology_twice_type = this.edit.technology_twice_type
        this.form.is_auto_upload = this.edit.is_auto_upload
        this.form.title_prompt = this.edit.title_prompt
        this.form.auto_ext_code_rule = this.edit.auto_ext_code_rule
        await this.initByParams(this.edit.id)
      } else if (this.copy) {
        this.form.name = this.copy.name
        this.form.default_account_id = this.copy.default_account_id
        this.form.name_prefixes = this.copy.name_prefixes
        this.form.prefix = this.copy.prefix
        this.form.is_personalize = this.copy.is_personalize
        this.form.is_jit = this.copy.is_jit
        this.form.technology_type = this.copy.technology_type
        this.form.technology_first_type = this.copy.technology_first_type
        this.form.technology_twice_type = this.copy.technology_twice_type
        this.form.is_auto_upload = this.copy.is_auto_upload
        this.form.title_prompt = this.copy.title_prompt
        this.form.auto_ext_code_rule = this.copy.auto_ext_code_rule
        await this.initByParams(this.copy.id)
      }
    },
    async initByParams(id) {
      let resp = await simpleProductTemplate({id: id})
      if (resp.code) {
        return
      }

      let obj = resp.data
      if (!obj.cat_ids) {
        return
      }

      this.form.guide_file = obj.guide_file
      this.form.details = obj.details || []

      this.afterCatIdChangedFuncs.push(() => {
        if (obj.size && this.form.size) {
          this.form.size.sizeSpecMetaVO.elements.forEach(element => {
            let e = obj.size.elements.find((e) => {
              return e.id === element.id
            })
            if (e) {
              element.autoSelected = 1
            }
          })
          if (this.form.size.sizeSpecMetaVO.groups) {
            let mp = new Map()
            obj.size.records.forEach((record) => {
              let k = record[this.form.size.sizeSpecMetaVO.groups[0].id]
              if (!k) {
                return
              }
              mp.set(k, record)
            })
            this.form.size_records.forEach(record => {
              let k = record[this.form.size.sizeSpecMetaVO.groups[0].id]
              if (!k) {
                return
              }
              let d = mp.get(k)
              if (!d) {
                return
              }

              this.form.size.sizeSpecMetaVO.elements.forEach(element => {
                if (d[element.id]) {
                  record[element.id] = d[element.id]
                }
              })
            })
          }
        }
        for (const prop of obj.properties) {
          for (const p of this.form.properties) {
            if (p.templatePid === prop.templatePid) {
              if (p.valueRule === 0) {
                p.ids.push(prop.vid)
              } else if (p.valueRule === 2) {
                p.prop_value = prop.propValue
              }
              break
            }
          }
        }
        let rule1List = this.form.properties.filter(item => item.valueRule === 1)
        this.form.properties = this.form.properties.filter(item => item.valueRule !== 1)
        if (rule1List.length) {
          // 要找到旧的，并操作
          for (const p of rule1List) {
            let list = obj.properties.filter(item => item.templatePid === p.templatePid)
            if (list.length) {
              for (const v of list) {
                let d = p.values.find((item) => {
                  return v.propValue === item.value
                })
                if (!d) {
                  continue
                }
                let newP = this.addProperty(p)
                newP.id = d.vid
                newP.number_input_value = v.numberInputValue
              }
            } else {
              this.addProperty(p)
            }
          }
        }

        if (obj.sku_list[0].parentSpec1Id) {
          this.form.spec_prop_id1 = obj.sku_list[0].parentSpec1Id
        }
        if (obj.sku_list[0].parentSpec2Id) {
          this.form.spec_prop_id2 = obj.sku_list[0].parentSpec2Id
        }
        for (const p of obj.spec_props) {
          if (p.parentSpecId === this.form.spec_prop_id1) {
            this.form.spec_values1.push(p.specName)
          } else if (p.parentSpecId === this.form.spec_prop_id2) {
            this.form.spec_values2.push(p.specName)
          }
        }
        this.$bus.$emit("notifyCreateSkuSpecList", async () => {
          for (const s of obj.sku_list) {
            let spec1Name = s.spec1Name
            let spec2Name = s.spec2Name

            for (const v of this.form.sku_list) {
              if (v.spec1 !== spec1Name || v.spec2 !== spec2Name) {
                continue
              }
              v.prefixSku = s.prefixSku
              v.appendSku = s.appendSku
              v.imageName = s.imageName
              v.len = s.len
              v.width = s.width
              v.height = s.height
              v.weight = s.weight
              v.price = s.price
              v.sku_classification = s.sku_classification
              v.number_of_pieces = s.number_of_pieces
              v.piece_unit_code = s.piece_unit_code
              v.individually_packed = s.individually_packed
              if (!v.sku_classification) {
                v.sku_classification = 1
                v.number_of_pieces = 1
                v.piece_unit_code = 1
                v.individually_packed = 0
              }
              v.is_sensitive = s.is_sensitive
              v.sensitive_list = s.sensitive_list
              v.max_battery_capacity_hp = s.max_battery_capacity_hp
              v.max_liquid_capacity_hp = s.max_liquid_capacity_hp
              v.max_knife_length_hp = s.max_knife_length_hp
              v.knife_angle = s.knife_angle
              for (const ac of s.accessories) {
                let exist = false
                for (const accessory of v.accessories) {
                  if (accessory.vid === ac.vid) {
                    exist = true
                    break
                  }
                }
                if (!exist) {
                  v.accessories.push(ac)
                }
              }
              break
            }
          }
        });
      })
      this.form.cat_ids = obj.cat_ids
      this.form.cat_id = obj.cat_ids[obj.cat_ids.length - 1]
    },
    reSelectCategory() {
      this.form.cat_id = undefined
    },
    handleSelect(event) {
      this.form.default_account_id = event.account_id
      this.form.cat_id = event.cat_id
      this.form.cat_ids = event.cat_ids
      this.form.cat_name = event.cat_name
    },
    async create() {
      if (!this.form.name) {
        this.$message.error("请输入模板名字")
        return
      }

      if (!this.form.default_account_id) {
        this.$message.error("请选择账号")
        return
      }

      if (!this.form.spec_prop_id1 && !this.form.spec_prop_id2) {
        this.$message.error("请选择规格")
        return
      }

      if (this.form.spec_prop_id1 && !this.form.spec_values1.length) {
        this.$message.error("请输入规格1类型")
        return
      }

      if (this.form.spec_prop_id2 && !this.form.spec_values2.length) {
        this.$message.error("请输入规格2类型")
        return
      }

      if (this.form.is_personalize) {
        if (!this.form.technology_type) {
          this.$message.error("请选择工艺类型")
          return
        }
        if (!this.form.technology_first_type) {
          this.$message.error("请选择一级工艺")
          return
        }
        if (!this.form.technology_twice_type && this.technologySecondOptions.length > 0) {
          this.$message.error("请选择二级工艺")
          return
        }
      }

      const multiTemplatePids = [...new Set(this.form.properties.filter(item => item.valueRule === 1).map(item => item.templatePid))];
      for (const tempPid of multiTemplatePids) {
        let list = this.form.properties.filter(item => item.templatePid === tempPid)
        const sum = list.reduce((acc, current) => acc + current.number_input_value, 0) || 0;

        if (list[0].isImportant) {
          if (sum !== 100) {
            this.$message.error(`属性 ${list[0].name} 和必须为100`)
            return
          }
        } else {
          if (sum !== 100 && sum !== 0) {
            this.$message.error(`属性 ${list[0].name} 和又不为0有不为100(要么填要么不填)`)
            return
          }
        }
      }

      let size = undefined
      if (this.form.size) {
        size = {elements: [], groups: [], records: []}
        this.form.size.sizeSpecMetaVO.elements.forEach(element => {
          if (!element.autoSelected) {
            return
          }
          size.elements.push({
            id: element.id,
            name: element.name,
            unit: element.unit,
          })
        })
        this.form.size.sizeSpecMetaVO.groups.forEach(group => {
          size.groups.push({
            id: group.id,
            name: group.name,
          })
        })
        for (const record of this.form.size_records) {
          let values = {}
          this.form.size.sizeSpecMetaVO.groups.forEach(group => {
            values[group.id] = record[group.id]
          })
          for (const element of this.form.size.sizeSpecMetaVO.elements) {
            if (!element.autoSelected) {
              continue
            }

            if (!record[element.id]) {
              this.$message.error(`请填写: ${element.name}`)
              return
            }
            values[element.id] = record[element.id]
          }
          size.records.push(values)
        }
      }

      let properties = this.form.real_properties

      let params = []
      if (this.form.spec_prop_id1) {
        for (const v of this.form.spec_values1) {
          params.push({"parent_spec_id": this.form.spec_prop_id1, "spec_name": v})
        }
      }
      if (this.form.spec_prop_id2) {
        for (const v of this.form.spec_values2) {
          params.push({"parent_spec_id": this.form.spec_prop_id2, "spec_name": v})
        }
      }
      let resp = await simpleProductQueryOrAddSpecs(params)
      if (resp.code) {
        return
      }

      let specProps = []
      for (const d of resp.data) {
        let s = this.form.sku_spec_list.find((item) => {
          return item.parentSpecId === d.parent_spec_id
        })
        if (!s) {
          this.$message("没找到规格数据: " + d.parent_spec_id)
          return
        }

        let sd = {
          "parentSpecId": s.parentSpecId,
          "parentSpecName": s.parentSpecName,
          "specId": d.spec_id,
          "specName": d.spec_name,
          "refPid": 0,
          "pid": 0,
          "templatePid": 0,
          "propName": s.parentSpecName,
          "vid": 0,
          "propValue": d.spec_name,
          "valueUnit": "",
          "valueGroupId": 0,
          "valueGroupName": "",
          "valueExtendInfo": ""
        }
        specProps.push(sd)
      }

      let skuList = []
      let skus = []
      for (const s of this.form.sku_list) {
        if (s.is_sensitive) {
          if (s.sensitive_list.length <= 0) {
            this.$message.error("必须选择敏感属性")
            return
          }

          for (const sensitive of s.sensitive_list) {
            if (sensitive === 110001 || sensitive === 120001) {
              if (s.max_battery_capacity_hp <= 0 || s.max_battery_capacity_hp > 200) {
                this.$message.error("储电容量 只能在 1-200 之间")
                return
              }
            } else if (sensitive === 140001) {
              if (s.max_liquid_capacity_hp <= 0 || s.max_liquid_capacity_hp > 500) {
                this.$message.error("液体容量 只能在 1-500 之间")
                return
              }
            } else if (sensitive === 170001) {
              if (s.max_knife_length_hp <= 0 || s.max_knife_length_hp > 110) {
                this.$message.error("刀具长度 只能在 1-110 之间")
                return
              }
              if (s.knife_angle <= 0 || s.knife_angle > 360) {
                this.$message.error("刀尖角度 只能在 1-360 之间")
                return
              }
            }
          }
        }

        if (s.sku_classification === 3) {
          if (s.accessories.length <= 0) {
            this.$message.error("混合套装 配件必须填写好")
            return
          }

          let totalAccessory = 0
          for (const ac of s.accessories) {
            if (ac.num <= 0) {
              this.$message.error(`混合套装 配件 ${ac.value} 必须填写数量!`)
              return
            }
            totalAccessory += ac.num
          }

          if (totalAccessory !== s.number_of_pieces) {
            this.$message.error(`混合套装 配件数量不匹配 ${totalAccessory} != ${s.number_of_pieces}`)
            return
          }
        }

        let d = {
          len: s.len,
          width: s.width,
          height: s.height,
          weight: s.weight,
          prefixSku: s.prefixSku,
          appendSku: s.appendSku,
          imageName: s.imageName,
          price: s.price,
          sku_classification: s.sku_classification,
          number_of_pieces: s.number_of_pieces,
          piece_unit_code: s.piece_unit_code,
          accessories: s.accessories,
          individually_packed: s.individually_packed,
          is_sensitive: s.is_sensitive,
          sensitive_list: s.sensitive_list,
          max_battery_capacity_hp: s.max_battery_capacity_hp,
          max_liquid_capacity_hp: s.max_liquid_capacity_hp,
          max_knife_length_hp: s.max_knife_length_hp,
          knife_angle: s.knife_angle,
        }
        if (s.spec1) {
          d.parentSpec1Id = this.form.spec_prop_id1
          d.spec1Name = s.spec1
        }
        if (s.spec2) {
          d.parentSpec2Id = this.form.spec_prop_id2
          d.spec2Name = s.spec2
        }
        if (skus.indexOf(s.prefixSku+s.appendSku) >= 0) {
          this.$message.error("存在相同的Sku: " + s.prefixSku + " " + s.appendSku)
          return
        }
        skus.push(s.prefixSku+s.appendSku)
        skuList.push(d)
      }

      if (!this.form.cat_ids.length) {
        this.$message.error("类目路径为空")
        return
      }

      for (const detail of this.form.details) {
        if (detail.is_text) {
          if (!detail.text) {
            this.$message.error("图文详情，未输入文字")
            return
          }
        } else {
          if (!detail.image_name) {
            this.$message.error("图文详情，图片未选择")
            return
          }
        }
      }

      if (this.form.is_auto_upload) {
        if (!this.form.title_prompt) {
          this.$message.error("设置了自动上传，请务必设置标题咒语")
          return
        }
        if (!this.form.auto_ext_code_rule) {
          this.$message.error("设置了自动上传，请务必设置自动货号规则")
          return
        }
        if (this.form.auto_ext_code_rule.indexOf("[ID]") < 0) {
          this.$message.error("设置了自动上传，自动货号规则中必须包括 [ID]")
          return
        }

        if (this.form.sku_list.length > 1) {
          for (const sku of this.form.sku_list) {
            if (!sku.appendSku) {
              this.$message.error("设置了自动上传，请务必填写附带货号")
              return
            }
            if (!sku.imageName) {
              this.$message.error("设置了自动上传，请务必填写变体图名字")
              return
            }
          }
        }
      }

      let data = {}
      if (this.edit) {
        data.id = this.edit.id
      }
      data.name = this.form.name
      data.params = {}
      data.params.cat_ids = this.form.cat_ids
      data.params.properties = properties
      data.params.spec_props = specProps
      data.params.sku_list = skuList
      data.params.guide_file = this.form.guide_file
      data.params.details = this.form.details
      data.params.size = size
      data.default_account_id = this.form.default_account_id
      data.name_prefixes = this.form.name_prefixes
      data.prefix = this.form.prefix
      data.is_personalize = this.form.is_personalize
      if (this.form.is_personalize) {
        data.technology_type = this.form.technology_type
        data.technology_first_type = this.form.technology_first_type
        data.technology_twice_type = this.form.technology_twice_type
      } else {
        data.is_jit = this.form.is_jit
      }
      if (this.form.is_auto_upload) {
        data.is_auto_upload = this.form.is_auto_upload
        data.title_prompt = this.form.title_prompt
        data.auto_ext_code_rule = this.form.auto_ext_code_rule
      }

      resp = await simpleProductSaveTemplate(data)
      if (resp.code) {
        return
      }

      this.$message("上传成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    async notifySelectProductChanged() {
      if (!this.selectProduct) {
        return
      }

      if (!this.selectProduct.user_images_list || this.selectProduct.user_images_list.length <= 0) {
        return
      }

      let userImages = this.selectProduct.user_images_list[0]
      let options = []
      let list = []
      userImages.detail_images.forEach((item, index) => {
        let option = {
          name: userImages.detail_image_names[index],
          image: item,
        }
        options.push(option)
        list.push({
          is_text: false,
          image_name: option.name,
          image: option.image,
        })
      })

      this.form.detail_options = options
      this.form.details = list
    },
    addImage() {
      this.form.details.push({
        is_text: false,
        image_name: "",
        image: "",
      })
    },
    addText() {
      this.form.details.push({
        is_text: true,
        font_size: 12,
        font_color: "#333333",
        background_color: "#ffffff",
        align: "left",
        text: "",
      })
    },
    notifyDetailChanged(row) {
      let op = this.form.detail_options.find((item) => {
        return item.name === row.image_name
      })
      if (op) {
        row.image = op.image
      }
    },
    async searchProductList(query) {
      let resp = await productListByPage({name: query, page_size: 100})
      if (resp.code) {
        return
      }
      this.showProductList = resp.data.list.filter((item) => {
        return item.user_images_list && item.user_images_list.length > 0 && item.user_images_list[0].detail_images && item.user_images_list[0].detail_images.length > 0
      })
    },
    deleteDetail(row) {
      this.form.details = this.form.details.filter((item) => {
        return item !== row
      })
    },
    moveDetail(row, change) {
      let oldIndex = this.form.details.findIndex((item) => {
        return item === row
      })
      if (oldIndex < 0) {
        return
      }

      let newIndex = oldIndex + change
      if (newIndex < 0) {
        return
      }
      if (newIndex >= this.form.details.length) {
        return
      }

      let old = this.form.details[newIndex]
      this.$set(this.form.details, newIndex, row)
      this.$set(this.form.details, oldIndex, old)
    },
    addProperty(property) {
      let newP = {...property}
      newP.number_input_value = undefined
      newP.id = undefined
      this.form.properties.push(newP)
      return newP
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
::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 5px !important;
}

::v-deep .el-card__body, .el-main {
  padding: 5px !important;
}

::v-deep .el-select-dropdown__item {
  width: 100% !important;
  height: 100% !important;
}
</style>