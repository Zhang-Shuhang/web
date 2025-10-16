<template>
  <el-drawer :visible.sync="$attrs.visible" title="条件设置" @opened="onOpened" size="60%"
             :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="form.list" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
      <el-table-column label="判断" align="center">
        <el-table-column label="Key" prop="condition.key" align="center">
          <div slot-scope="{row}">
            <el-select v-model="row.condition.key" placeholder="请选择Key" filterable clearable
                       style="width: 100%">
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in dataList" :key="index" :label="item.id"
                         :value="item.id" style="width: 500px;">
                <div style="float: left">{{ item.id }}</div>
                <div style="float: right; color: gray">{{ item.value }}</div>
              </el-option>
            </el-select>
          </div>
        </el-table-column>
        <el-table-column label="方法" prop="condition.method" align="center">
          <div slot-scope="{row}">
            <el-select v-model="row.condition.method" placeholder="请选择方法" filterable clearable
                       style="width: 100%">
              <el-option value=""></el-option>
              <el-option v-for="(item, index) in methodOptions" :key="index" :label="item.name"
                         :value="item.id" style="width: 500px;">
              </el-option>
            </el-select>
          </div>
        </el-table-column>
        <el-table-column label="值" prop="condition.value" align="center">
          <div slot-scope="{row}">
            <el-autocomplete v-model="row.condition.value" placeholder="请输入值" :fetch-suggestions="searchValueList" @select="(item) => {handleSelectValue(row, item)}" style="width: 100%" clearable>
              <template slot-scope="{ item }">
                <div style="float: left">{{ item.id }}</div>
                <div style="float: right; color: gray">{{ item.value }}</div>
              </template>
            </el-autocomplete>
          </div>
        </el-table-column>
      </el-table-column>
      <el-table-column label="取值" prop="value" align="center">
        <div slot-scope="{row}">
          <div v-if="valueType === 'Key'">
            <el-select v-model="row.key" placeholder="请选择相关Key" filterable clearable
                       style="width: 100%">
              <el-option v-for="(item, index) in dataList" :key="index" :label="item.id"
                         :value="item.id" style="width: 500px;">
                <div style="float: left">{{ item.id }}</div>
                <div style="float: right; color: gray">{{ item.value }}</div>
              </el-option>
            </el-select>
          </div>
          <div v-else-if="valueType === 'StringArray'">
            <el-select v-model="row.value" placeholder="请选择" filterable clearable
                       style="width: 100%">
              <el-option v-for="(item, index) in values" :key="index" :label="item" :value="item">
              </el-option>
            </el-select>
          </div>
          <div v-else-if="valueType === 'IdNameArray'">
            <el-select v-model="row.value" placeholder="请选择" filterable clearable
                       style="width: 100%" remote :remote-method="searchIdNameList">
              <el-option v-for="(item, index) in idNameArray" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div v-else-if="valueType === 'Number'">
            <el-input-number size="mini" style="width: 100%" v-model="row.value"></el-input-number>
          </div>
          <div v-else>
            <el-input size="mini" style="width: 100%" v-model="row.value"></el-input>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="操作" prop="value" align="center">
        <template slot="header">
          <div>操作</div>
<!--          <div>-->
<!--            <el-button type="warning" size="mini" style="width: 100%" @click="save">保存</el-button>-->
<!--          </div>-->
          <div>
            <el-button type="primary" size="mini" style="width: 100%" @click="add">添加</el-button>
          </div>
        </template>
        <div slot-scope="scope">
          <el-row>
            <el-col :span="6">
              <el-button type="primary" style="width: 100%" :disabled="scope.$index === 0" @click="move(scope.$index, scope.$index-1)">上移</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" style="width: 100%" :disabled="scope.$index+1 === form.list.length" @click="move(scope.$index, scope.$index+1)">下移</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" style="width: 100%" @click="copy(scope.row)">复制</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="warning" style="width: 100%" @click="del(scope.row)">删除</el-button>
            </el-col>
          </el-row>
        </div>
      </el-table-column>
    </el-table>
  </el-drawer>
</template>

<script>

export default {
  name: 'DlgValueSelectorV3',
  components: {},
  mixins: [],
  watch: {},
  props: {
    dataList: {
      type: Array,
      required: true,
    },
    methodOptions: {
      type: Array,
      required: true,
    },
    valueType: {
      type: String,
      required: true,
    },
    values: {
      type: Array,
    },
    list: {
      type: Array,
    },
    refresh: {
      type: Function,
    },
  },
  data() {
    return {
      form: {
        list: [],
      },
      idNameArray: [],
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)

      if (!this.save()) {
        return
      }

      if (this.refresh) {
        this.$confirm("是否刷新数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          this.refresh()
        });
      }
    },
    async onOpened() {
      if (this.list && this.list.length) {
        this.form.list = [...this.list]
      } else {
        this.form.list = []
      }
      this.idNameArray = []
    },
    handleSelectValue(row, item) {
      row.condition.value = item.value
    },
    searchValueList(query, cb) {
      if (!query) {
        cb(this.dataList)
        return
      }

      cb(this.dataList.filter((item) => {
        return item.id.indexOf(query) >= 0 || String(item.value).indexOf(query) >= 0
      }))
    },
    save() {
      // 检查条件
      let emptyCount = 0
      let hasAfterEmpty = false
      this.form.list.forEach(item => {
        if (!item.condition.key && !item.condition.method && !item.condition.value) {
          emptyCount++
        } else if (emptyCount > 0) {
          hasAfterEmpty = true
        }
      })
      if (emptyCount > 1) {
        this.$message.error("没带条件的超过1个!")
        return false
      }
      if (hasAfterEmpty) {
        this.$message.error("没带条件之后不支持带条件的!")
        return false
      }
      this.$emit('update', this.form.list)
      this.$message("保存成功!")

      return true
    },
    add() {
      this.form.list.push({
        condition: {
          has: true,
          key: "",
          method: "",
          value: undefined,
        },
        value: undefined,
        key: "",
      })
    },
    move(from, to) {
      let t = this.form.list[to]

      this.$set(this.form.list, to, this.form.list[from])
      this.$set(this.form.list, from, t)
      this.$message("移动成功!")
    },
    copy(row) {
      let d = JSON.parse(JSON.stringify(row))
      this.form.list.push(d)
      this.$message("复制成功!")
    },
    del(row) {
      this.form.list = this.form.list.filter((item) => {
        return item !== row
      })
      this.$message("删除成功!")
    },
    searchIdNameList(query) {
      let array = this.values
      if (query) {
        array = this.values.filter((item) => {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) >= 0
        })
      }
      if (array.length >= 200) {
        this.idNameArray = array.slice(0, 200)
      } else {
        this.idNameArray = array
      }
    }
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-autocomplete-suggestion li {
  width: 300px;
}
</style>