<template>
  <el-drawer :visible.sync="$attrs.visible" title="扫码打印条码/箱唛" size="75%" @opened="onOpened"
             :modal-append-to-body="true" :append-to-body="true" direction="rtl" :before-close="handleBeforeClose">
    <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="100px" label-position="top"
             style="margin-left: 10px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-row :gutter="5">
            <el-col :span="6">
              <el-form-item label="7x5打印机" prop="p75">
                <el-select size="mini" v-model="form.printer.p75" placeholder="7x5打印机" filterable clearable
                           style="width: 100%" @change="printerChanged">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(item, index) in printerList" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="8x6打印机" prop="p86">
                <el-select size="mini" v-model="form.printer.p86" placeholder="7x5打印机" filterable clearable
                           style="width: 100%" @change="printerChanged">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(item, index) in printerList" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="10x10打印机" prop="p1010">
                <el-select size="mini" v-model="form.printer.p1010" placeholder="10x10打印机" filterable clearable
                           style="width: 100%" @change="printerChanged">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(item, index) in printerList" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="10x15打印机" prop="p1015">
                <el-select size="mini" v-model="form.printer.p1015" placeholder="10x15打印机" filterable clearable
                           style="width: 100%" @change="printerChanged">
                  <el-option label="" value=""></el-option>
                  <el-option v-for="(item, index) in printerList" :key="index" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="请扫码输入任务编号" prop="name">
            <el-input size="mini" ref="itemId" v-model="form.id" placeholder="请扫码输入任务编号" style="width: 100%"
                      clearable @keyup.enter.native="print">
              <el-button slot="append" type="primary" style="width: 100px" size="mini" @click="print">确定</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="进度" prop="speech">
            <div style="color: red !important;">
              {{ form.speech }}
            </div>
          </el-form-item>
          <div v-if="loadForm.id">
<!--            加载的数据，这里要有一个输入，也要有一个列表-->
            <el-form-item label="请扫码输入其他任务编号" prop="name">
              <el-input size="mini" ref="loadItemId" v-model="loadForm.input" placeholder="请扫码输入其他任务编号" style="width: 100%"
                        clearable @keyup.enter.native="localComplete">
                <el-button slot="append" type="primary" style="width: 150px" size="mini" @click="localComplete">确定</el-button>
              </el-input>
            </el-form-item>
            <el-table class="table-body" ref="multipleTable" :data="loadForm.list" border height="100%" size="mini"
                      :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
              <el-table-column label="信息" align="center">
                <div slot-scope="{row}">
                  <div v-if="row.produce_no">
                    生产序号: {{row.produce_no}}
                  </div>
                  <div v-else>
                    需要部件: {{row.goods ? row.goods.name : row.goods_id}} x {{row.goods_count}}
                    <KdxImage :src="row.goods.image" v-if="row.goods"></KdxImage>
                  </div>
                </div>
              </el-table-column>
              <el-table-column label="完成情况" align="center">
                <div slot-scope="{row}">
                  <el-checkbox size="mini" v-model="row.is_complete">
                    确认
                  </el-checkbox>
                </div>
              </el-table-column>
            </el-table>
            <el-button type="primary" style="width: 100%; margin-top: 20px" size="mini" @click="completePrint" :disabled="!canComplete()">确定</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <el-tabs v-model="tabName" type="border-card" :stretch="true">
            <el-tab-pane label="定制图" name="customize_image" v-if="form.customize_image"></el-tab-pane>
            <el-tab-pane label="产品图" name="images" v-if="form.images"></el-tab-pane>
            <el-tab-pane label="说明书" name="sms" v-if="form.sms"></el-tab-pane>
          </el-tabs>

          <iframe style="width: 100%; height: 80vh" :src="form.customize_image"
                  v-if="form.customize_image && tabName === 'customize_image'"></iframe>
          <template v-if="form.images && tabName === 'images'">
            <KdxElImage style="display: inline-block" width="400px" height="400px" v-for="(img, index) in form.images"
                        :src="img" :key="index"></KdxElImage>
          </template>
          <iframe style="width: 100%; height: 80vh" :src="form.sms" v-if="form.sms && tabName === 'sms'"></iframe>
        </el-col>
      </el-row>
    </el-form>
  </el-drawer>
</template>

<script>

import {factoryBatchItemV2Complete, factoryBatchItemV2LoadOrComplete} from "@/api/sf-factory-v2/batch";
import {getLodop} from "@/utils/LodopFuncs";
import KdxElImage from "@/components/image/el_image.vue";
import {mapActions, mapGetters} from "vuex";
import {factoryDownloadByUrl} from "@/api/sf-factory-v2/download";
import KdxImage from "@/components/image/image.vue";

const synth = window.speechSynthesis;
const msg = new SpeechSynthesisUtterance();

export default {
  name: 'DlgScanPrintCodeAndXmV2',
  components: {KdxImage, KdxElImage},
  mixins: [],
  computed: {
    ...mapGetters("misc", ["printer"]),
  },
  data() {
    return {
      form: {
        id: undefined,
        speech: "",
        customize_image: "",
        images: [],
        sms: "",
        printer: {
          p75: "7x5",
          p86: "8x6",
          p1010: "10x10",
          p1015: "10x15",
        },
      },

      loadForm: {
        id: undefined,
        input: "",
        list: [],
      },

      tabName: "customize_image",

      printerList: [],

      list: [],
    }
  },
  methods: {
    ...mapActions("misc", ["updatePrinter"]),
    handleBeforeClose() {
      this.$emit('close', false)
      this.$emit("update")
    },
    async onOpened() {
      this.printerList = this.getPrinterList()

      let ref = this.$refs['itemId']
      setTimeout(() => {
        ref.select()
      }, 100)
    },
    getPrinterList() {
      let lodop = getLodop()
      if (!lodop) {
        return [];
      }

      let nameList = []
      for (let i = 0; i < lodop.GET_PRINTER_COUNT(); i++) {
        const pName = lodop.GET_PRINTER_NAME(i);
        if (pName !== "导出为WPS PDF") {
          nameList.push(pName)
        }
      }
      return nameList
    },
    localComplete() {
      if (!this.loadForm.id) {
        return
      }

      for (const v of this.loadForm.list) {
        if (v.produce_no === this.loadForm.input) {
          v.is_complete = true;
          this.$message(`${v.produce_no} 已完成`)
          break
        }
      }

      let ref = this.$refs['loadItemId']
      if (ref) {
        setTimeout(() => {
          ref.select()
        }, 200)
      }
    },
    canComplete() {
      if (!this.loadForm.id) {
        return false
      }

      for (const v of this.loadForm.list) {
        if (!v.is_complete) {
          return false
        }
      }

      return true
    },
    async completePrint() {
      if (!this.canComplete()) {
        return
      }

      let data = {id: this.loadForm.id, list: []}
      for (const v of this.loadForm.list) {
        data.list.push({
          produce_no: v.produce_no,
          goods_id: v.goods_id,
          goods_count: v.goods_count,
        })
      }

      let resp = await factoryBatchItemV2Complete(data)
      if (resp.code) {
        return
      }

      let ref = this.$refs['itemId']
      setTimeout(() => {
        ref.select()
      }, 200)

      this.loadForm.id = undefined
      this.loadForm.list = []

      this.doPrint(resp.data.code_printer_name, resp.data.code_url, resp.data.code_base64, resp.data.code_count || 1)
      this.doPrint(resp.data.package_printer_name, resp.data.package_url, resp.data.package_base64, 1)

      this.form.speech = resp.data.speech
      this.form.images = resp.data.images
      this.form.customize_image = ""
      this.form.sms = resp.data.sms

      if (resp.data.customize_image) {
        this.tabName = "customize_image"

        let realCustomizeImage = resp.data.customize_image
        setTimeout(() => {
          this.form.customize_image = realCustomizeImage
        }, 300)
      } else {
        if (this.form.images) {
          this.tabName = "images"
        } else if (this.form.sms) {
          this.tabName = "sms"
        }
      }

      if (resp.data.speech) {
        this.handleSpeakByText(resp.data.speech)
      }
    },
    async print() {
      let ref = this.$refs['itemId']
      let timeout = setTimeout(() => {
        ref.select()
      }, 200)

      let resp = await factoryBatchItemV2LoadOrComplete({id: this.form.id})
      if (resp.code) {
        return
      }

      if (resp.data.is_load) {
        this.loadForm.id = resp.data.id

        let list = []
        resp.data.list.forEach(item => {
          list.push({...item, is_complete: this.form.id === item.produce_no})
        })
        this.loadForm.list = list

        setTimeout(() => {
          let ref = this.$refs['loadItemId']
          if (ref) {
            clearTimeout(timeout)

            setTimeout(() => {
              ref.select()
            }, 200)
          }
        }, 100)
      } else {
        this.loadForm.id = undefined
        this.loadForm.list = []

        this.doPrint(resp.data.code_printer_name, resp.data.code_url, resp.data.code_base64, resp.data.code_count || 1)
        this.doPrint(resp.data.package_printer_name, resp.data.package_url, resp.data.package_base64, 1)
      }

      this.form.speech = resp.data.speech
      this.form.images = resp.data.images
      this.form.customize_image = ""
      this.form.sms = resp.data.sms

      if (resp.data.customize_image) {
        this.tabName = "customize_image"

        let realCustomizeImage = resp.data.customize_image
        setTimeout(() => {
          this.form.customize_image = realCustomizeImage
        }, 300)
      } else {
        if (this.form.images) {
          this.tabName = "images"
        } else if (this.form.sms) {
          this.tabName = "sms"
        }
      }

      if (resp.data.speech) {
        this.handleSpeakByText(resp.data.speech)
      }
    },
    async doPrint(printerName, url, base64, count) {
      if (!url && !base64) {
        return
      }

      url = decodeURIComponent(url);
      let pn = this.getPrinterName(printerName)
      if (pn) {
        const printCount = 50
        let pdf = base64 || await this.downloadPDF(url)
        for (let i = 0; i < 200; i++) {
          let LODOP = getLodop();
          LODOP.PRINT_INIT("打印条码");
          LODOP.SET_PRINTER_INDEX(pn);
          LODOP.SET_PRINT_PAGESIZE(3, 0, 0, "");//纸张设置为自定义模式
          LODOP.SET_PRINT_STYLEA(0, "PDFScalMode", 1);
          LODOP.ADD_PRINT_PDF(0, 0, "100%", "100%", pdf);
          if (count <= printCount) {
            LODOP.SET_PRINT_COPIES(count);
          } else {
            LODOP.SET_PRINT_COPIES(printCount);
          }
          // 要么预览，要么打印，只能使用一个
          LODOP.PRINT(); // 打印

          count -= printCount
          if (count <= 0) {
            break
          }
        }
      } else {
        window.open(url, "_blank")
      }
    },
    getPrinterName(spec) {
      switch (spec) {
        case "7x5":
          return this.form.printer.p75;
        case "8x6":
          return this.form.printer.p86;
        case "10x10":
          return this.form.printer.p1010;
        case "10x15":
          return this.form.printer.p1015;
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
      try {
        if (!(/^https?:/i.test(url))) return;
        if (window.XMLHttpRequest) var xhr = new XMLHttpRequest(); else var xhr = new ActiveXObject("MSXML2.XMLHTTP");
        xhr.open('GET', url, false); //同步方式
        if (xhr.overrideMimeType)
          try {
            xhr.responseType = 'arraybuffer';
            var arrybuffer = true;
          } catch (err) {
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
          }
        xhr.send(null);
        var data = xhr.response || xhr.responseBody;
        if (typeof Uint8Array !== 'undefined') {
          if (arrybuffer) {
            var dataArray = new Uint8Array(data);
          } else {
            var dataArray = new Uint8Array(data.length);
            for (var i = 0; i < dataArray.length; i++) {
              dataArray[i] = data.charCodeAt(i);
            }
          }
        } else {
          var dataArray = VBS_BinaryToArray(data).toArray(); //兼容IE低版本
        }

        return this.getBASE64(dataArray);
      } catch (e) {
        let resp = await factoryDownloadByUrl({url: url})
        if (resp.code) {
          return
        }

        return resp.data
      }
    },
    getBASE64(dataArray) {
      var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var strData = "";
      for (var i = 0, ii = dataArray.length; i < ii; i += 3) {
        if (isNaN(dataArray[i])) break;
        var b1 = dataArray[i] & 0xFF, b2 = dataArray[i + 1] & 0xFF, b3 = dataArray[i + 2] & 0xFF;
        var d1 = b1 >> 2, d2 = ((b1 & 3) << 4) | (b2 >> 4);
        var d3 = i + 1 < ii ? ((b2 & 0xF) << 2) | (b3 >> 6) : 64;
        var d4 = i + 2 < ii ? (b3 & 0x3F) : 64;
        strData += digits.substring(d1, d1 + 1) + digits.substring(d2, d2 + 1) + digits.substring(d3, d3 + 1) + digits.substring(d4, d4 + 1);
      }
      return strData;
    },
    printerChanged() {
      this.updatePrinter(this.form.printer)
    },
  },
  mounted() {
    if (!this.printer) {
      return
    }

    this.form.printer.p75 = this.printer.p75
    this.form.printer.p86 = this.printer.p86
    this.form.printer.p1010 = this.printer.p1010
    this.form.printer.p1015 = this.printer.p1015
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