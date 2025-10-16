<template>
  <div>
    <el-form-item label="模板名字">
      <el-input size="mini" style="width: 100%; margin-right: 5px; display: inline-block" placeholder="模板名字"
                v-model="value.name"></el-input>
    </el-form-item>
    <el-form-item label="匹配货号前缀">
      <el-select v-model="value.name_prefixes" placeholder="请选择默认匹配货号前缀" allow-create multiple
                 filterable clearable :style="{width: '100%'}">
      </el-select>
    </el-form-item>
    <el-form-item label="标题附带前缀">
      <el-input v-model="value.prefix" placeholder="标题附带前缀" clearable :style="{width: '100%'}">
      </el-input>
    </el-form-item>
    <el-form-item label="是否定制品">
      <el-switch v-model="value.is_personalize" @change="isPersonalizeChanged"></el-switch>
    </el-form-item>
    <el-form-item label="工艺" v-if="value.is_personalize">
      <div>
        <el-radio-group v-model="value.technology_type" @change="technologyTypeChanged">
          <el-radio v-for="(item, index) in technologyOptions" :key="index" :label="item.id">{{
              item.name
            }}
          </el-radio>
        </el-radio-group>
      </div>
      <div style="width: 600px">
        <el-col :span="12">
          <div v-if="technologyFirstOptions">
            <el-select v-model="value.technology_first_type" style="width: 100%" placeholder="一级工艺" filterable
                       clearable @change="technologyFirstTypeChanged">
              <el-option v-for="(item, index) in technologyFirstOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
        <el-col :span="12">
          <div v-if="technologySecondOptions">
            <el-select v-model="value.technology_twice_type" style="width: 100%" placeholder="二级工艺" filterable
                       clearable multiple
                       :multiple-limit="value.technology_type === 1 ? 1 : value.technology_type === 2 ? 3 : 0">
              <el-option v-for="(item, index) in technologySecondOptions" :key="index" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </div>
        </el-col>
      </div>
    </el-form-item>
    <el-form-item label="是否JIT" v-else>
      <el-switch v-model="value.is_jit"></el-switch>
    </el-form-item>
    <el-form-item label="是否自动上传">
      <el-switch v-model="value.is_auto_upload"></el-switch>
      <template v-if="value.is_auto_upload">
        <div>
          <el-input v-model="value.title_prompt" type="textarea" :rows="6" placeholder="标题生成咒语" clearable
                    :style="{width: '100%'}">
          </el-input>
        </div>
        <div>
          <el-input v-model="value.auto_ext_code_rule" placeholder="自动货号规则，必须包括 [ID] ，如(MKB-[ID]-ZS)"
                    clearable :style="{width: '100%'}">
          </el-input>
        </div>
      </template>
    </el-form-item>
    <el-form-item label="说明书">
      <el-upload action="/temu/account/upload_guide_file" :headers="{'x-token':token}" :show-file-list="false"
                 accept=".pdf" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
        <el-button size="mini" :style="{width: '100%'}" type="primary">上传</el-button>
      </el-upload>
      <el-link size="mini" type="primary" :href="value.guide_file" :underline="false" target="_blank"
               v-if="value.guide_file">说明书
      </el-link>
    </el-form-item>
  </div>
</template>
<script>
import {simpleProductTechnologyList} from "@/api/temu/simple_product";
import {mapGetters} from "vuex";

export default {
  name: 'TemuProductTemplateBase',
  components: {},
  mixins: [],
  props: ['value'],
  data() {
    return {
      technologyOptions: [],
    }
  },
  computed: {
    ...mapGetters("user", ["token"]),
    technologyFirstOptions() {
      let item = this.technologyOptions.find((item) => {
        return item.id === this.value.technology_type
      })
      if (!item) {
        return []
      }
      return item.list
    },
    technologySecondOptions() {
      let item = this.technologyFirstOptions.find((item) => {
        return item.id === this.value.technology_first_type
      })
      if (!item) {
        return []
      }
      return item.childDetail || []
    },
  },
  watch: {},
  methods: {
    isPersonalizeChanged() {
      if (this.value.is_personalize) {
        this.value.technology_type = 1
        this.value.is_jit = false
      } else {
        this.value.technology_type = undefined
      }
      this.technologyTypeChanged()
    },
    technologyTypeChanged() {
      this.value.technology_first_type = undefined
      this.technologyFirstTypeChanged()
    },
    technologyFirstTypeChanged() {
      this.value.technology_twice_type = []
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.value.guide_file = res.data.url
      this.$message(`上传成功，支持: ${res.data.languages.join(", ")} 语言`)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
    let resp = await simpleProductTechnologyList()
    if (resp.code === 0) {
      this.technologyOptions = resp.data
    }
  }
}
</script>
<style scoped lang="scss">
</style>