<template>
  <el-dialog :visible.sync="$attrs.visible" title="批量更新视频" @opened="onOpened" width="40%"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <div style="padding:30px">
      <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px"
               label-position="top">
        <el-row>
          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="主视频" style="margin: 5px">
              <video width="100%" controls :src="form.carouse_video.url" v-if="form.carouse_video"></video>
              <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector('carouse_video')">选择主图视频</el-button>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12">
            <el-form-item label="详情视频" style="margin: 5px">
              <video width="100%" controls :src="form.detail_video.url" v-if="form.detail_video"></video>
              <el-button size="mini" type="primary" style="width: 100%" @click="openDlgVideoSelector('detail_video')">请选择详情视频</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-button type="warning" style="width: 100%; margin-top: 20px; height: 40px" :disabled="!form.carouse_video && !form.detail_video" @click="batchUpdateVideos">更新</el-button>
      </el-form>
    </div>

    <TemuDlgVideoSelector :visible="dlgSelectVideo.visible" @close="dlgSelectVideo.visible=false" @select="selectVideo"></TemuDlgVideoSelector>
  </el-dialog>
</template>

<script>
import KdxImage from "@/components/image/image.vue";
import TemuDlgVideoSelector from "@/view/temu/components/dlg_video_selector.vue";
import {productBatchVideos} from "@/api/temu/product";

export default {
  name: 'TemuDlgVideoBatch',
  components: {TemuDlgVideoSelector, KdxImage},
  props: {
    ids: {
      type: Array,
    },
  },
  computed: {},
  watch: {},
  data() {
    return {
      form: {
        carouse_video: undefined,
        detail_video: undefined,
      },
      dlgSelectVideo: {
        video_field: "",
        visible: false,
      }
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
    },
    select(row) {
      this.$emit('select', row)
      this.handleBeforeClose()
    },
    openDlgVideoSelector(field) {
      this.dlgSelectVideo.video_field = field
      this.dlgSelectVideo.visible = true
    },
    selectVideo(video) {
      this.form[this.dlgSelectVideo.video_field] = video
    },
    async batchUpdateVideos() {
      let resp = await productBatchVideos({ids: this.ids, carouse_video_id: this.form.carouse_video ? this.form.carouse_video.id : 0, detail_video_id: this.form.detail_video ? this.form.detail_video.id : 0})
      if (resp.code) {
        return
      }

      this.$message("更细能成功")
      this.$emit("suc")
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