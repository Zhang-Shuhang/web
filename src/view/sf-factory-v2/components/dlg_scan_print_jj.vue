<template>
  <el-dialog :visible.sync="$attrs.visible"  title="扫码打印加急" width="60%" @opened="onOpened"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px" label-position="top">
      <el-form-item label="10x10打印机" prop="printer1010">
        <el-select size="mini" v-model="form.printer1010" placeholder="10x10打印机" filterable clearable style="width: 100%" @change="printerChanged">
          <el-option label="" value=""></el-option>
          <el-option v-for="(item, index) in printerList" :key="index" :label="item" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请扫码输入箱唛号" prop="name">
        <el-input size="mini" ref="itemId" v-model="form.id" placeholder="请扫码输入箱唛号" style="width: 100%" clearable @keyup.enter.native="print"></el-input>
      </el-form-item>
      <el-form-item label="进度" prop="speech">
        <div style="color: red !important;">
          {{form.speech}}
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="print">确定</el-button>
  </el-dialog>
</template>

<script>

import {factoryBatchPackage} from "@/api/sf-factory-v2/batch";
import {getLodop} from "@/utils/LodopFuncs";
import {mapActions} from "vuex";
import {factoryDownloadByUrl} from "@/api/sf-factory-v2/download";
const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();

export default {
  name: 'DlgScanPrintJj',
  mixins: [],
  watch: {},
  props: {
    box_id: {
      type: Number,
    },
  },
  data() {
    return {
      form: {
        id: undefined,
        printer1010: undefined,
        speech: undefined,
      },

      printerList: [],

      list: [],
    }
  },
  methods: {
    ...mapActions("misc", ["updatePrinter1010"]),
    handleBeforeClose() {
      this.$emit('close', false)
      this.$emit("update")
    },
    async onOpened() {
      this.printerList = this.getPrinterList()

      let ref = this.$refs['itemId']
      setTimeout(()=>{
        ref.select()
      }, 100)
    },
    getPrinterList() {
      let lodop = getLodop()
      if (!lodop) {
        return [];
      }

      let nameList = []
      for(let i = 0 ; i < lodop.GET_PRINTER_COUNT(); i++){
        const pName = lodop.GET_PRINTER_NAME(i);
        if(pName !== "导出为WPS PDF"){
          nameList.push(pName)
        }
      }
      return nameList
    },
    async print() {
      let ref = this.$refs['itemId']
      setTimeout(()=>{
        ref.select()
      }, 200)

      let resp = await factoryBatchPackage({id: this.form.id, box_id: this.box_id})
      if (resp.code) {
        return
      }

      this.doPrint(resp.data.code_printer_name, resp.data.code_url)
      if (resp.data.log_code_printer_name) {
        this.doPrint(resp.data.log_code_printer_name, resp.data.log_code_url)
      }

      this.form.speech = resp.data.speech

      if (resp.data.speech) {
        this.handleSpeakByText(resp.data.speech)
      }
    },
    async doPrint(printerName, url) {
      if (!url) {
        return
      }

      url = decodeURIComponent(url);
      let pn = this.getPrinterName(printerName)
      if (pn) {
        let pdf = await this.downloadPDF(url)

        let LODOP = getLodop();
        LODOP.PRINT_INIT("打印条码");
        LODOP.SET_PRINTER_INDEX(pn);
        LODOP.SET_PRINT_PAGESIZE(3,0,0,"");//纸张设置为自定义模式
        LODOP.SET_PRINT_STYLEA(0, "PDFScalMode", 1);
        LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", pdf);
        LODOP.SET_PRINT_COPIES(1);
        // 要么预览，要么打印，只能使用一个
        LODOP.PRINT(); // 打印
      } else {
        window.open(url, "_blank")
      }
    },
    getPrinterName(spec) {
      switch (spec) {
        case "10x10":
          return this.form.printer1010;
      }
      return ""
    },
    handleSpeakByText(text) {
      msg.text = text;     // 文字内容: 小朋友，你是否有很多问号
      msg.lang = "zh-CN";  // 使用的语言:中文
      msg.volume = 2;      // 声音音量：1
      msg.rate = 2;        // 语速：1
      msg.pitch = 1;       // 音高：1
      synth.speak(msg);    // 播放
    },
    async downloadPDF(url) {
      let resp = await factoryDownloadByUrl({url: url})
      if (resp.code) {
        return
      }
      return resp.data
    },
    printerChanged() {
      this.updatePrinter1010(this.form.printer1010)
    },
  },
  mounted() {
    this.form.printer1010 = this.printer.p1010
  },
  filters: {},
  async created() {
  }
}
</script>
<style scoped lang="scss">

.item-container {
  .item {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;
    height: 30px;
    padding: 0px;
  }

  .item-bottom {
    border-bottom: 1px solid lightblue;
  }

  .footer {
    background: lightblue;
    height: 24px;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 0;
    padding-top: 0;
  }
}

::v-deep .el-table .cell {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

::v-deep .search-term .el-form-item {
  margin-bottom: 0px !important;
}
</style>