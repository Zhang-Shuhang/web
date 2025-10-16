<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量标签" @opened="onOpened" size="100%" :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini" :header-cell-style="{'background-color': 'black', 'color': '#fff'}">
      <el-table-column label="Id" prop="id" align="center" width="80px">
      </el-table-column>
      <el-table-column label="名字" prop="name" align="center" width="100px">
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center" width="200px">
        <div slot-scope="{row}">
          <span style="font-size: 12px">{{row.title.length >= 50 ? row.title.substring(0, 50) + '...' : row.title}}</span>
        </div>
      </el-table-column>
      <el-table-column label="标签" prop="tags" align="center" width="200px">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-for="(tag, index) in row.tags" :key="index" closable @close="removeTag(tag.id)">
            {{tag.tag}}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column label="批量移除标签" prop="tags" align="center" width="200px">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-for="(tag, index) in row.tags" :key="index" closable @close="removeAllTag(tag.tag)">
            {{tag.tag}}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column label="产品图片" align="center">
        <div slot-scope="{row}">
          <template v-for="(image, index) in row.user_images.images">
            <KdxImage :src="image" style="display: inline-block; margin-left: 5px" width="100px" height="100px" :key="index" v-if="index < 3"></KdxImage>
          </template>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200px">
        <template slot="header">
          <span>操作</span>

          <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px"
                   label-position="right">
            <el-select v-model="form.tags" placeholder="批量加标签" multiple allow-create filterable clearable remote :remote-method="remoteMethod" :loading="loading" style="width: 100%" @change="onTagsChange">
              <el-option v-for="(item, index) in options" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form>
        </template>
        <div slot-scope="{row}">
          <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px"
                   label-position="right">
            <el-select v-model="form.row_tags" placeholder="标签内容" multiple allow-create filterable clearable remote :remote-method="remoteMethod" :loading="loading" style="width: 100%" @change="onRowTagsChange(row)">
              <template v-for="(item, index) in options">
                <el-option :key="index" :label="item" :value="item" v-if="!inTags(row.tags, item)"></el-option>
              </template>
            </el-select>
          </el-form>
          <div>
            <el-button size="mini" type="primary" style="width: 100%" @click="removeSelect(row.id)">移除</el-button>
          </div>
        </div>
      </el-table-column>
    </el-table>

  </el-drawer>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import {simpleProductTagList} from "@/api/temu/simple_product";
import {productAddTag, productRemoveTag} from "@/api/product/product";

export default {
  name: 'TemuDlgSimpleProductAddTags',
  components: {KdxImage},
  mixins: [],
  props: {
    list: {
      type: Array,
    },
    removeSelect: {
      type: Function,
    },
  },
  computed: {},
  data() {
    return {
      loading: false,

      options: [],

      form: {
        tags: [],
        row_tags: [],
      },
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close')
    },
    async onOpened() {
    },
    async removeTag(id) {
      let resp = await productRemoveTag({ids: [id]})
      if (resp.code) {
        return
      }

      this.$message("删除成功")
      this.$emit('update')
    },
    async removeAllTag(tag) {
      let ids = []
      this.list.forEach((item) => {
        item.tags.forEach((v) => {
          if (v.tag === tag) {
            ids.push(v.id)
          }
        })
      })
      let resp = await productRemoveTag({ids: ids})
      if (resp.code) {
        return
      }

      this.$message("删除成功")
      this.$emit('update')
    },
    async remoteMethod(query) {
      this.loading = true;
      let resp = await simpleProductTagList({id: query})
      this.loading = false;
      if (resp.code) {
        return
      }
      this.options = resp.data
    },
    confirm() {
      this.$confirm('请确认是否添加标签?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
          .then(async () => {
            let resp = await productAddTag({ids: this.product_ids, tags: this.form.tags})
            if (resp.code) {
              return
            }

            this.$message("添加成功，等待一段时间会自动添加标签")
            this.$emit('update')
            this.handleBeforeClose()
          })
    },
    async onTagsChange() {
      let resp = await productAddTag({ids: this.list.map((item) => {return item.id}), tags: this.form.tags})
      if (resp.code) {
        return
      }
      this.$emit('update')
      this.form.tags = []
    },
    async onRowTagsChange(row) {
      let resp = await productAddTag({ids: [row.id], tags: this.form.row_tags})
      if (resp.code) {
        return
      }
      this.$emit('update')
      this.form.row_tags = []
    },
    inTags(tags, tagName) {
      return tags.find((t) => {return tagName === t.tag})
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