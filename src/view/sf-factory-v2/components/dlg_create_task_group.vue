<template>
  <el-drawer :visible.sync="$attrs.visible" :title="`创建: ${platformName}`" @opened="onOpened" size="75%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="form.groups" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="仓库名" prop="warehouse_name" align="center">
        <div slot-scope="{row}">
          <el-input size="mini" style="width: 100%" placeholder="仓库" maxlength="30" show-word-limit v-model="row.warehouse_name"></el-input>
        </div>
      </el-table-column>
      <el-table-column label="产品列表" align="center" min-width="500px">
        <div slot-scope="{row}">
          <el-row :gutter="5">
            <template v-for="(item, idx) in row.list">
              <el-col :span="6" :key="idx*4">
                <el-select size="mini" v-model="item.barcode_id" placeholder="选择商品" filterable clearable style="width: 100%">
                  <el-option v-for="(item, index) in barcodeOptions" :key="index" :label="item.ext_code" :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-input-number size="mini" style="width: 100%" placeholder="数量" v-model="item.count" :precision="0" :min="1" :max="200"></el-input-number>
              </el-col>
              <el-col :span="6">
              </el-col>
              <el-col :span="6">
                <el-button size="mini" type="primary" @click="addTask(row)">添加</el-button>
                <el-button size="mini" type="danger" @click="deleteTask(row, item)" v-if="row.list.length > 1">删除</el-button>
              </el-col>
            </template>
          </el-row>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <div slot-scope="{row}">
          <el-button size="mini" type="primary" @click="addGroup">添加</el-button>
          <el-button size="mini" type="danger" @click="deleteGroup(row)" v-if="form.groups.length > 1">删除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="create">确定</el-button>
  </el-drawer>
</template>

<script>
import {factoryBarcodeList} from "@/api/sf-factory-v2/barcode";
import {factoryTaskGroupCreateJingDong} from "@/api/sf-factory-v2/task_group";

export default {
  name: 'DlgCreateTaskGroup',
  mixins: [],
  computed: {
    platformName() {
      console.log(this.platforms)
      console.log(this.platform)
      let op = this.platforms.find((item) => {
        return item.id === this.platform
      })
      if (op) {
        return op.name
      }
      return `未知${this.platform}`
    }
  },
  props: {
    platforms: {
      type: Array,
    },
    platform: {
      type: Number,
    }
  },
  watch: {},
  data() {
    return {
      barcodeOptions: [],
      form: {
        groups: [],
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      let resp = await factoryBarcodeList({platforms: [this.platform]})
      if (resp.code) {
        return
      }
      this.barcodeOptions = resp.data

      this.form.groups = [this.emptyGroup()]
    },
    emptyGroup() {
      return {
        warehouse_name: "",
        list: [this.emptyTask()]
      }
    },
    emptyTask() {
      return {
        barcode_id: undefined,
        count: 0,
        pdf: undefined,
      }
    },
    addGroup() {
      this.form.groups.push(this.emptyGroup())
    },
    deleteGroup(row) {
      this.$set(this.form, "groups", this.form.groups.filter((value) => {return value !== row}))
    },
    addTask(group) {
      group.list.push(this.emptyTask())
    },
    deleteTask(group, task) {
      this.$set(group, "list", group.list.filter((value) => {return value !== task}))
    },
    async create() {
      if (this.form.groups.length === 0) {
        this.$message.error("没有数据，无法创建!")
        return
      }

      for (const group of this.form.groups) {
        if (!group.warehouse_name) {
          this.$message.error("没有设置仓库名字!")
          return
        }
        if (group.list.length <= 0) {
          this.$message.error("没有添加需要生产的产品!")
          return
        }

        for (const task of group.list) {
          if (!task.barcode_id) {
            this.$message.error("没有选择要生产的产品!")
            return
          }
          if (task.count <= 0) {
            this.$message.error("生产数量必须>0!")
            return
          }
        }
      }

      let resp = await factoryTaskGroupCreateJingDong({...this.form})
      if (resp.code) {
        return
      }

      this.$message("创建成功")
      this.$emit("update")
      this.handleBeforeClose()
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