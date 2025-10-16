<template>
  <el-drawer :visible.sync="$attrs.visible" title="批量申诉" @opened="onOpened" size="75%"
               :modal-append-to-body="true" :append-to-body="true" :before-close="handleBeforeClose">
    <el-table class="table-body" ref="multipleTable" :data="list" border size="mini"
              :header-cell-style="{'background-color': 'black', 'color': '#fff'}" v-if="list && list.length">
      <el-table-column label="账号" prop="account.name" align="center">
      </el-table-column>
      <el-table-column label="违规对象ID" prop="id" align="center">
      </el-table-column>
      <el-table-column label="图片" prop="thumb_url" align="center">
        <template slot="header">
          <div>图片</div>
          <el-switch v-model="all_upload_goods_image" active-text="上传图片" @change="updateUploadGoodsImage"></el-switch>
        </template>
        <div class="item-container" slot-scope="{row}">
          <KdxImage :src="row.goods_img_url" v-if="row.goods_img_url"></KdxImage>
          <div>
            <el-switch v-model="row.upload_goods_image" active-text="上传图片"></el-switch>
          </div>
        </div>
      </el-table-column>
      <el-table-column label="违规描述" prop="violation_desc" align="center">
      </el-table-column>
      <el-table-column label="站点列表" align="center">
        <div slot-scope="{row}">
          <el-tag size="mini" type="primary" v-for="(item, index) in row.items" :key="index">{{item.site_id === -1 ? "全部" : (item.site ? item.site.name : `未知: ${item.site_id}`)}}</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="申诉类型" align="center">
        <div slot-scope="{row}">
          <el-select size="mini" v-model="row.punish_appeal_type" placeholder="请选择类型" filterable
                     :style="{width: '100%'}">
            <el-option label="已按照要求调整希望解除违规" :value="1"></el-option>
            <el-option label="管控不合理希望解除违规" :value="2"></el-option>
          </el-select>
        </div>
      </el-table-column>
      <el-table-column label="申诉说明" align="center">
        <template slot="header">
          <div>申诉说明</div>
          <el-input type="textarea" :rows="3" v-model="all_appeal_desc" placeholder="申诉说明" clearable @change="updateAppealDesc"></el-input>
        </template>
        <div slot-scope="{row}">
          <el-input type="textarea" :rows="3" v-model="row.appeal_desc" placeholder="申诉说明" clearable></el-input>
        </div>
      </el-table-column>
      <el-table-column label="申诉材料" align="center" width="250px">
        <template slot="header">
          <div>申诉材料</div>
          <el-upload :action="`/temu/account/upload_file?id=${list[0].account_id}&tag=agent-punish-mms-tag`" :headers="{'x-token':token}"
                     accept=".png,.jpg" :on-success="(res) => {handleSuccess(list, true, res)}" :on-error="handleError"
                     :on-remove="(file) => {handleRemoveAppealFileUrl(list, true, file)}" :file-list="appeal_file_url_list" :style="{width: '100%'}">
            <el-button size="mini" :style="{width: '100%'}" type="primary">批量上传图片</el-button>
          </el-upload>
        </template>
        <div slot-scope="{row}">
          <el-upload :action="`/temu/account/upload_file?id=${row.account_id}&tag=agent-punish-mms-tag`" :headers="{'x-token':token}"
                     accept=".png,.jpg" :on-success="(res) => {handleSuccess([row], false, res)}" :on-error="handleError"
                     :on-remove="(file) => {handleRemoveAppealFileUrl([row], false, file)}" :file-list="row.appeal_file_url_list" :style="{width: '100%'}">
            <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
          </el-upload>
        </div>
      </el-table-column>
    </el-table>

    <el-button size="medium" type="primary" style="height: 40px; width: 180px; position: absolute; right: 20px; bottom: 300px; z-index: 9999" @click="batchSubmit">批量提交</el-button>
  </el-drawer>
</template>


<script>
import KdxImage from "@/components/image/image.vue";
import {mapGetters} from "vuex";
import {merchantAppealSubmit} from "@/api/temu/merchant_appeal";

export default {
  name: 'TemuDlgBatchSubmitMerchantAppeal',
  components: {KdxImage},
  mixins: [],
  props: {
    rows: {
      type: Array,
    },
  },
  computed: {
    ...mapGetters("user", ["token"]),
  },
  watch: {},
  data() {
    return {
      list: [],
      appeal_file_url_list: [],
      all_appeal_desc: "",
      all_upload_goods_image: false,
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.list = this.rows.map(item => {return {...item, punish_appeal_type: 2, appeal_desc: "", appeal_file_url_list: [], upload_goods_image: false}})
      this.appeal_file_url_list = []
      this.all_appeal_desc = ""
      this.all_upload_goods_image = false
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制 ' + text + ' 成功')
      }, function () {
        this.$message.error('复制 ' + text + ' 失败')
      })
    },
    handleSuccess(rows, addAll, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      if (addAll) {
        this.appeal_file_url_list.push(res.data)
      }
      rows.forEach(item => {
        item.appeal_file_url_list.push(res.data)
      })
      console.log(rows)
    },
    handleError(err) {
      this.$message.error("上传失败!" + err);
    },
    handleRemoveAppealFileUrl(rows, removeAll, file) {
      if (removeAll) {
        this.appeal_file_url_list = this.appeal_file_url_list.filter((item) => {
          return item.url !== file.url
        })
      }
      rows.filter((row) => {
        row.appeal_file_url_list = row.appeal_file_url_list.filter((item) => {
          return item.url !== file.url
        })
      })
    },
    updateAppealDesc() {
      this.list.forEach(item => {
        item.appeal_desc = this.all_appeal_desc
      })
    },
    updateUploadGoodsImage() {
      this.list.forEach(item => {
        item.upload_goods_image = this.all_upload_goods_image
      })
    },
    async batchSubmit() {
      let list = []
      for (let i = 0; i < this.list.length; i++) {
        let v = this.list[i]
        if (!v.punish_appeal_type) {
          this.$message.error(`${v.id} 请选择 申诉类型`)
          return
        }
        if (!v.appeal_desc) {
          this.$message.error(`${v.id} 请输入 申诉说明`)
          return
        }
        if (v.appeal_file_url_list.length <= 0 && !v.upload_goods_image) {
          this.$message.error(`${v.id} 请上传 申诉材料`)
          return
        }
        let data = {
          id: v.id,
          account_id: v.account_id,
          punish_appeal_type: v.punish_appeal_type,
          appeal_desc: v.appeal_desc,
          appeal_file_url_list: v.appeal_file_url_list.map((item) => {return item.url}),
          source_punish_name: v.source_punish_name,
          target_type: v.target_type,
          target_id: v.target_id,
          goods_id: v.goods_id,
          leaf_reason_id: v.leaf_reason_id,
          leaf_reason_name: v.leaf_reason_name,
          punish_id_list: [],
          appeal_site_list: [],
          site_id_to_punish_id_list_map: {},
        }
        v.items.forEach(item => {
          data.punish_id_list.push(item.id)
          data.appeal_site_list.push(item.site_id)
          data.site_id_to_punish_id_list_map[item.site_id] = [item.id]
        })
        if (v.upload_goods_image) {
          data.appeal_file_url_list.push(v.goods_img_url)
        }
        list.push(data)
      }
      let resp = await merchantAppealSubmit(list)
      if (resp.code) {
        return
      }

      this.$message(resp.data.info)

      this.list = this.list.filter(item => {
        return resp.data.suc_ids.indexOf(item.id) < 0
      })

      this.$emit('update')
    }
  },
}
</script>
<style scoped lang="scss">
</style>