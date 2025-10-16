<template>
  <div style="width: 300px" v-if="svg_png_url" @click="openDlg">
    <img v-if="base_png_url" :src="base_png_url" style="width: 300px; position: absolute; left: 0px; top: 0px; background-color: lightblue" @click="openDlg" />
    <img v-if="svg_png_url" :src="svg_png_url" style="width: 300px; position: absolute; left: 0px; top: 0px;" @click="openDlg" />

    <el-dialog width="50%" :visible.sync="visible" center :modal-append-to-body="true" :append-to-body="true" @open="onOpen">
      <div :style="{'width': `${width}`, 'height': `100%`}" v-if="svg_png_url" id="div">
        <img v-if="base_png_url" :src="base_png_url" style="width: 100%; position: absolute; left: 0px; top: 0px; background-color: lightblue" />
        <img v-if="svg_png_url" :src="svg_png_url" style="width: 100%; position: absolute; left: 0px; top: 0px;" />
      </div>
    </el-dialog>
  </div>
</template>


<script>

export default {
  name: 'CustomizeEffect',
  components: {},
  mixins: [],
  props: {
    row: {
      type: Object,
    },
  },
  computed: {
    base_png_url() {
      if (!this.row) {
        return ""
      }
      if (!this.row.base_image) {
        return ""
      }
      if (!this.row.base_image.resource) {
        return ""
      }
      return this.row.base_image.thumbnail_url + "?imageView2/2/w/1000/q/70"
    },
    svg_png_url() {
      if (!this.row.resource) {
        return ""
      }
      return this.row.resource.url + "?imageView2/2/w/1000/q/70"
    },
  },
  watch: {},
  data() {
    return {
      visible: false,
      width: "100%",
      height: 300,
    }
  },
  methods: {
    onOpen() {
      let left = document.getElementById("div")
      this.width = `${left.offsetWidth}px`
      this.height = this.width * this.row.height / this.row.width
    },
    openDlg() {
      this.visible = true
    }
  },
}
</script>
<style scoped lang="scss">
</style>