<template>
  <span>
    <i class="el-icon-edit" v-if="!is_edit" @click="startEdit"></i>
    <template v-else>
      <el-input v-model="group" @keyup.enter.native="updateEdit" size="mini">
        <el-button slot="append" size="mini" type="primary" @click="updateEdit" icon="el-icon-success"></el-button>
        <el-button slot="append" style="margin-left: 10px" size="mini" type="primary" @click="endEdit" icon="el-icon-error"></el-button>
      </el-input>
    </template>
  </span>
</template>

<script>
import {groupSet} from "@/api/sf-factory/group";

export default {
  name: 'CompSetGroup',
  components: {},
  mixins: [],
  computed:{
  },
  props: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    groupList: {
      type: Array
    }
  },
  watch: {},
  data() {
    return {
      is_edit: false,
      group: "",
    }
  },
  methods: {
    startEdit() {
      this.is_edit = true
      this.group = this.name
    },
    async updateEdit() {
      let resp = await groupSet({id: this.id, name: this.group})
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