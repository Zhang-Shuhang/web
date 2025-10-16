<template>
  <el-drawer :visible.sync="$attrs.visible" :title="is_create || is_copy ? `创建规则` : `修改规则`" @opened="onOpened" size="40%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="130px" label-position="right">
      <el-form-item label="规则名字" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Sku Ids" v-if="form.prefixes.length <= 0">
        <el-select v-model="form.sku_ids" placeholder="请输入Sku Id" multiple allow-create filterable clearable style="width: 100%">
        </el-select>
      </el-form-item>
      <el-form-item label="货号前缀" v-if="form.sku_ids.length <= 0">
        <el-select v-model="form.prefixes" placeholder="如: YD-,MYD-" multiple allow-create filterable clearable style="width: 100%">
        </el-select>
      </el-form-item>
      <el-form-item label="条码范围宽高" prop="type">
        <el-select v-model="form.type" clearable filterable style="width: 100%">
          <el-option label="700x200" :value="0"></el-option>
          <el-option label="700x100" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="条码宽" prop="width">
        <el-input-number v-model="form.width" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="条码高" prop="height">
        <el-input-number v-model="form.height" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="加利福尼亚65号" prop="california">
            <el-input placeholder="加利福尼亚，如: 无需警示" v-model="form.california"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="制造商" prop="manufacturer">
            <el-select v-model="form.manufacturer" placeholder="制造商，如: kongduixiang" multiple allow-create filterable clearable style="width: 100%">
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="欧代名字" prop="agency_name">
            <el-input placeholder="欧代名字，如: MJCM SARL" v-model="form.agency_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="土代名字" prop="turkey_agency_name">
            <el-input placeholder="欧代名字，如: LİNOSAHİN" v-model="form.turkey_agency_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="识别码" prop="batch_number">
            <el-input placeholder="识别码，如: KDX-LN-020" v-model="form.batch_number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="食物接触标识" prop="need_food_tag">
            <el-select v-model="form.need_food_tag" clearable filterable style="width: 100%">
              <el-option label="不设置" :value="0"></el-option>
              <el-option label="需展示食品接触标志" :value="1"></el-option>
              <el-option label="不适用食物接触标识" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附加图片" prop="attach_image_url">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.attach_image_url" v-if="form.attach_image_url" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item label="附加图片起始点X" prop="attach_x">
        <el-input-number v-model="form.attach_x" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片起始点Y" prop="attach_y">
        <el-input-number v-model="form.attach_y" style="width: 100%" :min="100" :max="form.height"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片宽度" prop="attach_width">
        <el-input-number v-model="form.attach_width" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片高度" prop="attach_height">
        <el-input-number v-model="form.attach_height" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="附加图片2" prop="attach_image_url2">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess2" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.attach_image_url2" v-if="form.attach_image_url2" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item label="实拍图" prop="real_shout_image">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess3" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.real_shout_image" v-if="form.real_shout_image" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item label="实拍图2" prop="real_shout_image">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess4" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.real_shout_image2" v-if="form.real_shout_image2" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item label="实拍图3" prop="real_shout_image">
        <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                   accept=".png,.jpg" :on-success="handleSuccess5" :on-error="handleError" :style="{width: '100%'}">
          <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
        </el-upload>

        <KdxImage :src="form.real_shout_image3" v-if="form.real_shout_image3" width="200px" height="200px" style="margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item label="说明书" prop="guide_file_images">
        <el-row :gutter="5">
          <el-col :span="12">
            <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                       accept=".png,.jpg" :on-success="handleGuideFileSuccess" :on-error="handleError" :style="{width: '100%'}">
              <el-button size="mini" :style="{width: '100%'}" type="primary">上传说明书</el-button>
            </el-upload>
          </el-col>
          <el-col :span="12">
            <el-button size="mini" :style="{width: '100%'}" type="primary" @click="form.guide_file_images = []">清空说明书</el-button>
          </el-col>
        </el-row>

        <KdxImage :src="image" v-for="(image, index) in form.guide_file_images" :key="index" width="200px" height="200px" style="display: inline-block; margin-top: 10px"></KdxImage>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" style="width: 100%; margin-top: 10px; height: 50px" type="primary" @click="add">{{ is_create ? "创建" : "更新" }}</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
import {mapGetters} from "vuex";
import {labelCodeRuleAdd} from "@/api/temu/label_code_rule";
import KdxImage from "@/components/image/image.vue";

export default {
  name: 'TemuDlgLabelCodeRule',
  components: {KdxImage},
  props: {
    is_create: {
      type: Boolean,
    },
    is_copy: {
      type: Boolean,
    },
    row: {
      type: Object,
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
  },
  watch: {},
  data() {
    return {
      form: {
        name: "",
        sku_ids: [],
        prefixes: [],
        california: "",
        manufacturer: [],
        agency_name: "",
        turkey_agency_name: "",
        batch_number: "",
        need_food_tag: 0,
        type: 0,
        width: 700,
        height: 500,
        attach_image_url: "",
        attach_image_url2: "",
        attach_x: 0,
        attach_y: 190,
        attach_width: 700,
        attach_height: 300,
        real_shout_image: "",
        real_shout_image2: "",
        real_shout_image3: "",
        guide_file_images: [],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
      if (this.is_create) {
        this.form = {
          name: "",
          sku_ids: [],
          prefixes: [],
          california: "",
          manufacturer: [],
          agency_name: "",
          turkey_agency_name: "",
          batch_number: "",
          need_food_tag: 0,
          type: 0,
          width: 700,
          height: 500,
          attach_image_url: "",
          attach_image_url2: "",
          attach_x: 0,
          attach_y: 190,
          attach_width: 700,
          attach_height: 300,
          real_shout_image: "",
          real_shout_image2: "",
          real_shout_image3: "",
          guide_file_images: [],
        }
      } else {
        this.form = {
          name: this.row.name,
          sku_ids: this.row.sku_ids || [],
          prefixes: this.row.prefixes || [],
          california: this.row.california,
          manufacturer: this.row.manufacturer || [],
          agency_name: this.row.agency_name,
          turkey_agency_name: this.row.turkey_agency_name,
          batch_number: this.row.batch_number,
          need_food_tag: this.row.need_food_tag,
          type: this.row.type,
          width: this.row.width,
          height: this.row.height,
          attach_image_url: this.row.attach_image_url,
          attach_image_url2: this.row.attach_image_url2,
          attach_x: this.row.attach_x,
          attach_y: this.row.attach_y,
          attach_width: this.row.attach_width,
          attach_height: this.row.attach_height,
          real_shout_image: this.row.real_shout_image,
          real_shout_image2: this.row.real_shout_image2,
          real_shout_image3: this.row.real_shout_image3,
          guide_file_images: this.row.guide_file_images || [],
        }
      }
    },
    async add() {
      let data = {}
      if (!this.is_create && !this.is_copy) {
        data.id = this.row.id
        data.version = this.row.version
      }
      data.name = this.form.name
      data.sku_ids = this.form.sku_ids
      data.prefixes = this.form.prefixes
      data.california = this.form.california
      data.manufacturer = this.form.manufacturer || []
      data.agency_name = this.form.agency_name
      data.turkey_agency_name = this.form.turkey_agency_name
      data.batch_number = this.form.batch_number
      data.need_food_tag = this.form.need_food_tag
      data.type = this.form.type
      data.width = this.form.width
      data.height = this.form.height
      data.attach_image_url = this.form.attach_image_url
      data.attach_image_url2 = this.form.attach_image_url2
      data.attach_x = this.form.attach_x
      data.attach_y = this.form.attach_y
      data.attach_width = this.form.attach_width
      data.attach_height = this.form.attach_height
      data.real_shout_image = this.form.real_shout_image
      data.real_shout_image2 = this.form.real_shout_image2
      data.real_shout_image3 = this.form.real_shout_image3
      data.guide_file_images = this.form.guide_file_images
      if (!data.name) {
        this.$message("请输入名字")
        return
      }
      if (data.sku_ids.length <= 0) {
        if (data.prefixes.length <= 0) {
          this.$message("前缀跟Sku Id起码要填写一个")
          return
        }
      } else {
        if (data.prefixes.length > 0) {
          this.$message("前缀跟Sku Id只能填写一个")
          return
        }
      }
      if (!data.attach_image_url) {
        this.$message("请上传图片")
        return
      }
      let resp = await labelCodeRuleAdd(data)
      if (resp.code) {
        return
      }

      // 操作
      this.handleBeforeClose()
      this.$emit('update')
    },
    handleSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.attach_image_url = res.data
    },
    handleSuccess2(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.attach_image_url2 = res.data
    },
    handleSuccess3(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.real_shout_image = res.data
    },
    handleSuccess4(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.real_shout_image2 = res.data
    },
    handleSuccess5(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.real_shout_image3 = res.data
    },
    handleGuideFileSuccess(res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      this.form.guide_file_images.push(res.data)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.pageSize = 100
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-upload--text {
  width: 100%;
}
</style>