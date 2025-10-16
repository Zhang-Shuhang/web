<template>
  <el-dialog :visible.sync="$attrs.visible" title="扫描" @opened="onOpened" :fullscreen="true"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-select v-model="deviceId" placeholder="请选择设备" filterable clearable
               :style="{width: '100%'}">
      <el-option v-for="(item, index) in devices" :key="index" :label="item.label" :value="item.deviceId"></el-option>
    </el-select>
    <video :id="vId" autoplay style="width: 100%;"></video>
  </el-dialog>
</template>


<script>
import {BrowserMultiFormatReader} from '@zxing/library';

export default {
  name: 'KdxDlgScanner',

  data() {
    return {
      vId: 'codeVideo',
      codeReader: new BrowserMultiFormatReader(),

      devices: [],
      deviceId: "",
    };
  },
  watch: {
    deviceId() {
      this.codeReader.decodeFromVideoDevice(this.deviceId, this.vId, (result, err) => {
        if (err) {
          return
        }

        if (!result) {
          return
        }

        this.$emit('result', result.text)
      });
    }
  },
  created() {
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    async onOpened() {
      this.codeReader.listVideoInputDevices().then((devices) => {
        const length = devices.length;
        if (!length) {
          this.$message.error('找不到摄像头')
          return
        }

        this.devices = devices
        this.deviceId = devices[length - 1].deviceId;
      }).catch(err => {
        this.$message.error('出错: ' + err)
      });
    },
  },
}
</script>
