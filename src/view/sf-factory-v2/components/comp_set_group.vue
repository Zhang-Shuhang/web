<template>
  <span>
    <i class="el-icon-edit" v-if="!is_edit" @click="startEdit"></i>
    <template v-else>
      <el-select size="mini" placeholder="分类" v-model="target_category_id" filterable clearable :style="{width: '100%'}" @change="updateEdit">
        <el-option v-for="(item, index) in categoryOptions" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </template>
  </span>
</template>

<script>
import {factoryTaskGroupSetCategory} from "@/api/sf-factory-v2/task_group";

export default {
  name: 'V2CompSetGroup',
  components: {},
  mixins: [],
  computed:{
  },
  props: {
    categoryOptions: {
      type: Array,
    },
    id: {
      type: String,
    },
    category_id: {
      type: Number,
    },
    groupList: {
      type: Array
    }
  },
  watch: {},
  data() {
    return {
      is_edit: false,
      target_category_id: undefined,
    }
  },
  methods: {
    startEdit() {
      this.is_edit = true
      if (this.category_id) {
        this.target_category_id = this.category_id
      }
    },
    async updateEdit() {
      let resp = await factoryTaskGroupSetCategory({id: this.id, category_id: this.target_category_id})
      if (resp.code) {
        return
      }

      this.$emit("success", true)
      this.endEdit()
    },
    endEdit() {
      this.is_edit = false
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