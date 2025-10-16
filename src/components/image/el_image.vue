<style lang="scss">
.imgDiv {
  display: inline-block;
  position: relative;
}
</style>

<template>
  <div>
    <div v-lazy-container="{ selector: 'img', error: src }" class="imgDiv">
<!--      <img :data-src="thumb" :style="{height:height,width:width}" @click="showViewer"/>-->

      <el-image :style="{height:height,width:width}" :src="thumb" :preview-src-list="preview_list || [src]"></el-image>

<!--      <el-dialog width="50%" :visible.sync="visible" center :modal-append-to-body="true" :append-to-body="true" @opened="onOpened">-->
<!--        <el-image :src="preview" :style="{height:'100%',width:'100%', backgroundColor:'lightblue'}"></el-image>-->

<!--        <el-row :gutter="5" v-if="previews.length > 1">-->
<!--          <el-col :span="6" :offset="6">-->
<!--            <el-button size="mini" style="width: 100%" icon="el-icon-back" @click="changeIndex(-1)"></el-button>-->
<!--          </el-col>-->
<!--          <el-col :span="6">-->
<!--            <el-button size="mini" style="width: 100%" icon="el-icon-right" @click="changeIndex(1)"></el-button>-->
<!--          </el-col>-->
<!--        </el-row>-->
<!--      </el-dialog>-->
    </div>
  </div>
</template>

<script>

export default {
  name: 'KdxElImage',
  components: {},
  props: {
    src: {
      type: String,
      required: true
    },
    preview_list: {
      type: Array,
    },
    width: {
      type: String,
      default: '80px'
    },
    height: {
      type: String,
      default: '80px'
    },
    useCacheImage: {
      type: Boolean,
      default: true,
    },
    hasAddBtn: {
      type: Boolean,
      default: true,
    },
    imageViewWidth: {
      type: Number,
      default: 500,
    },
  },
  computed: {
    thumb() {
      let src = this.src
      if (!src) {
        return ""
      }
      if (src.indexOf("imageView2") > 0) {
        return src
      }
      if (src.indexOf("_square.jpg") > 0) {
        src = src.replaceAll("_square.jpg", ".jpg")
      }
      if (src.indexOf("kj-img.pddpic.com") >= 0) {
        src = src.replaceAll("kj-img.pddpic.com", "img.cdnfe.com")
      }
      if (src.indexOf("img.kwcdn.com") >= 0 || src.indexOf("kj-img.pddpic.com") >= 0 || src.indexOf("image.szkdx.work") >= 0 || src.indexOf("img.cdnfe.com") >= 0){
        return src + `?imageView2/2/w/${this.imageViewWidth}/q/70`
      }
      return src
    },
    preview() {
      let src = this.previews[this.index]
      if (!src) {
        return ""
      }
      if (src.indexOf("kj-img.pddpic.com") >= 0) {
        src = src.replaceAll("kj-img.pddpic.com", "img.cdnfe.com")
      }
      // if (src.indexOf("imageView2") > 0) {
      //   return src
      // }
      // if (src.indexOf("_square.jpg") > 0) {
      //   src = src.replaceAll("_square.jpg", ".jpg")
      // }
      // if (src.indexOf("img.kwcdn.com") >= 0 || src.indexOf("kj-img.pddpic.com") >= 0 || src.indexOf("image.szkdx.work") >= 0 || src.indexOf("img.cdnfe.com") >= 0){
      //   return src + "?imageView2/2/w/800/q/70"
      // }
      return src
    },
  },
  data() {
    return {
      visible: false,
      // isCollapse: false,
      // isMobile: false,
      index: 0,
      previews: [],
    }
  },
  methods: {
    showViewer() {
      this.visible = true
    },
    async onOpened() {
      let index = (this.preview_list || []).indexOf(this.src)
      if (index >= 0) {
        this.previews = this.preview_list
        this.index = index
      } else {
        this.previews = [this.src]
        this.index = 0
      }
    },
    changeIndex(step) {
      this.index = (this.index + step) % this.previews.length
    }
  },
  created() {
    // this.$bus.on('mobile', isMobile => {
    //   this.isMobile = isMobile
    // })
    // this.$bus.on('collapse', isCollapse => {
    //   this.isCollapse = isCollapse
    // })
  },
}
</script>