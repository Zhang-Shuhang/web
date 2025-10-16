<template>
  <el-drawer :visible.sync="$attrs.visible" @opened="onOpened" title="编辑图文定制" size="70%"
             :modal-append-to-body="true"
             :append-to-body="true" direction="rtl" :before-close="handleBeforeClose" @closed="handleClosed">
    <div class="main">
      <div class="top" style="width: 100%; display: flex; justify-content: space-evenly; align-items: center;">
        <div style="width: 90%; display: flex; justify-content: space-around; align-items: center;">
          <div>配置名:</div>
          <el-input v-model="currentEditName" disabled style="width: 92%" size="mini"/>
        </div>
        <ReferenceCustomizeRule @reference="onOpened" />
      </div>
      <div class="bottom">
        <div class="container" >
          <div style="width: 100%; height: 130px; display: flex; flex-direction: column; justify-content: space-evenly; color: #606266;">
            <div style="height: 30px; margin-left: 5px; display: flex; align-items: center;">
              <div style="width: 80px;">背景操作：</div>
              <el-button type="primary" size="mini" @click="imageSelectDrawer = true">选择背景图片</el-button>
              <Upload style="margin-left: 10px;" @image="handleChangeImage"/>
            </div>
            <div style="height: 30px; margin-left: 5px; display: flex; align-items: center;">
              <div style="width: 80px;">蒙版操作：</div>
              <el-badge :value="currentEditOverlayImage !== '' ? 1 : 0" :max="99">
                <el-button type="primary" size="mini" @click="imageSelectOverlayDrawer = true">选择蒙版</el-button>
              </el-badge>
              <el-button type="success" size="mini" style="margin-left: 10px;" :disabled="!currentEditOverlayImage" @click="operateExistingOverlay('show')">显示蒙版</el-button>
              <el-button type="info" size="mini" style="margin-left: 10px;" :disabled="!currentEditOverlayImage" @click="operateExistingOverlay('hidden')">隐藏蒙版</el-button>
              <el-button type="danger" size="mini" style="margin-left: 10px;" :disabled="!currentEditOverlayImage"  @click="operateExistingOverlay('remove')">移除蒙版</el-button>
              <Upload style="margin-left: 10px;" @image="handleChangeOverlayImage"/>
            </div>
            <div style="height: 30px; margin-left: 5px; display: flex; align-items: center;">
              <div style="width: 80px;">区域操作：</div>
              <el-button type="success" size="mini" @click="handleAutoGenerateArea">自动生成区域</el-button>
              <el-button type="danger" size="mini" style="margin-left: 10px;" @click="handleDeleteCanvasObject">删除选中区域</el-button>
            </div>
          </div>
          <div ref="canvasWrap" class="canvas-wrap">
            <canvas ref="cvs" style="border: 1px black solid;"></canvas>
          </div>
        </div>
        <div class="collapse-wrap">
          <el-scrollbar style="height: 100%">
            <el-collapse v-model="activeName" @change="handleCollapseOperationSyncCanvas"
                         style="padding-right: 14px;" accordion>
              <draggable v-model="areaList" :animation="300">
                <el-collapse-item :title="`定制区域${index + 1}`" :name="item.id" v-for="(item, index) in areaList"
                                  :key="item.id">
                  <el-form :model="item" size="mini" label-width="100px" label-position="right">
                    <el-row>
                      <el-form-item label="定制类型">
                        <el-radio-group v-model="item.type">
                          <el-radio :label="0">文字</el-radio>
                          <el-radio :label="1">图片</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-col :span="11">
                        <el-form-item label="起点坐标X">
                          <el-input-number v-model="item.x" placeholder="请输入区域的X坐标" :precision="2"
                                           :controls="false"
                                           style="width: 100%;"
                                           @change="handleChangeInputSizeValue(item.id, 'x')"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11" :offset="1">
                        <el-form-item label="起点坐标Y">
                          <el-input-number v-model="item.y" placeholder="请输入区域的Y坐标" :precision="2"
                                           :controls="false"
                                           style="width: 100%;"
                                           @change="handleChangeInputSizeValue(item.id, 'y')"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="11">
                        <el-form-item label="区域宽度">
                          <el-input-number v-model="item.width" placeholder="请输入区域的宽度" :precision="2"
                                           :controls="false" style="width: 100%;"
                                           @change="handleChangeInputSizeValue(item.id, 'width')"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11" :offset="1">
                        <el-form-item label="区域高度">
                          <el-input-number v-model="item.height" placeholder="请输入区域的高度" :precision="2"
                                           :controls="false" style="width: 100%;"
                                           @change="handleChangeInputSizeValue(item.id, 'height')"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="item.type === 1">
                      <el-col :span="11">
                        <el-form-item label="最小宽度(px)">
                          <el-input-number v-model="item.image_min_height" placeholder="请输入最小像素宽度要求"
                                           :precision="2"
                                           :controls="false" style="width: 100%;"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="11" :offset="1">
                        <el-form-item label="最小高度(px)">
                          <el-input-number v-model="item.image_min_width" placeholder="请输入最小像素高度要求"
                                           :precision="2"
                                           :controls="false" style="width: 100%;"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row v-if="item.type === 0">
                      <el-form-item label="字数限制">
                        <el-input-number v-model="item.text_limit" placeholder="请输入字数限制"></el-input-number>
                      </el-form-item>
                    </el-row>
                    <el-row v-if="item.type === 0">
                      <el-form-item label="颜色">
                        <div style="display: flex;">
                          <el-button icon="el-icon-plus" type="primary"
                                     @click="item.text_colors.push({ color: '#000000' })"></el-button>
                          <el-button icon="el-icon-delete" type="danger" @click="item.text_colors = []"></el-button>
                          <div style="margin-left: 10px;">数量: {{ item.text_colors.length }}</div>
                        </div>
                        <el-color-picker v-model="el.color" v-for="(el, index) in item.text_colors" :key="index" :predefine="['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF']"
                                         style="margin: 5px 10px 5px 0"></el-color-picker>
                      </el-form-item>
                    </el-row>
                    <el-row v-if="item.type === 0">
                      <el-form-item label="对齐方式">
                        <el-radio-group v-model="item.text_align">
                          <el-radio :label="1">左对齐</el-radio>
                          <el-radio :label="2">居中对齐</el-radio>
                          <el-radio :label="3">右对齐</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-form-item label="消费者上传时">
                        <el-radio-group v-model="item.is_required">
                          <el-radio :label="true">必须上传定制内容</el-radio>
                          <el-radio :label="false">可不传定制内容</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-row>
                  </el-form>
                </el-collapse-item>
              </draggable>
            </el-collapse>
          </el-scrollbar>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; ">
        <el-button type="primary" style="width: 12%; margin: 30px 40px 0 0;" @click="handleSaveCurrent">{{
            currentEditId === 0 ? '创 建' : '编 辑 完 成'
          }}
        </el-button>
      </div>
    </div>
    <TemuDlgImageSelector :sku="currentEditName" :visible="imageSelectDrawer" :update="handleChangeImage"
                          @close="imageSelectDrawer = false"/>
    <TemuDlgImageSelector :sku="currentEditName" :only-png="true" :visible="imageSelectOverlayDrawer" :update="handleChangeOverlayImage"
                          @close="imageSelectOverlayDrawer = false"/>
  </el-drawer>
</template>

<script>
import TemuDlgImageSelector from "@/view/temu/components/dlg_image_selector.vue";
import ReferenceCustomizeRule from "@/view/temu/components/reference_customize_rule.vue";
import {fabric} from "fabric";
import {v4 as uuidv4} from "uuid";
import draggable from 'vuedraggable'
import {customizeListByPage, customizeEdit, transparentAreas} from '@/api/temu/customize';
import {throttle} from '@/utils/throttle.js';
import Upload from "@/view/components/upload.vue"

export default {
  name: 'TemuDlgCustomizeEdit',
  components: {TemuDlgImageSelector, draggable, ReferenceCustomizeRule, Upload},
  mixins: [],
  props: {
    edit: {
      type: Object,
    },
  },
  watch: {
    areaList: function (newValue) {
      newValue.forEach((item, index) => {
        let canvasObj = this.cvs.getObjects().find(el => el.id === item.id);
        let controlList = ['tl', 'tr', 'br', 'bl', 'ml', 'mt', 'mr', 'mb', `${canvasObj.id}`];
        let forbiddenList = Object.keys(canvasObj.controls).filter(el => !controlList.includes(el));
        canvasObj.setControlsVisibility(forbiddenList.reduce((last, cur) => {
          last[`${cur}`] = false;
          return last;
        }, {}));
        this.addIndexControl(canvasObj, canvasObj.id, index + 1);
      })
    }
  },
  data() {
    return {
      cvs: null,
      maxWidth: 1200,
      maxHeight: 1200,
      activeName: '',
      currentEditId: 0,
      currentEditName: '',
      currentEditImage: '',
      currentEditOverlayImage: '',
      areaList: [],
      downPoint: null,
      upPoint: null,
      imageSelectDrawer: false,
      imageSelectOverlayDrawer: false,

      referenceTableData: [],
      referenceSearchName: "",

      sizeScale: 1
    }
  },
  methods: {
    handleBeforeClose() {
      this.$emit('close', false)
    },
    handleClosed() {
      window.removeEventListener("resize", this.resetCanvasWidthAndHeight);
      document.removeEventListener('keydown', this.handleDeleteCanvasObject);
    },
    async onOpened(config) {
      const configData = config ? config : this.edit;
      this.currentEditId = this.edit.id;
      this.currentEditName = this.edit.name;
      this.$copyText(this.currentEditName)

      this.$nextTick(() => {
        if (!this.cvs) {
          this.cvs = new fabric.Canvas(this.$refs.cvs, {
            width: this.maxWidth,
            height: this.maxHeight,
            backgroundColor: 'lightblue'
          });

          this.resetCanvasWidthAndHeight();

          fabric.Object.prototype.borderColor = 'orange';
          fabric.Object.prototype.cornerStyle = 'circle';
          fabric.Object.prototype.cornerColor = 'white';
          fabric.Object.prototype.cornerSize = 10;
          fabric.Object.prototype.transparentCorners = false;
          fabric.Object.prototype.cornerStrokeColor = 'gray';

          this.cvs.on({
            'mouse:down': this.recordMouseDown,
            'mouse:up': this.recordMouseUp,
            'selection:created': this.handleCanvasOperationSyncCollapse,
            'selection:updated': this.handleCanvasOperationSyncCollapse,
            'selection:cleared': this.handleCanvasOperationSyncCollapse,
            'object:scaling': this.handleChangeCanvasElSize,
            'object:moving': throttle(this.handleChangeCanvasElSize, 50),
          })
        }

        if (configData.image) this.handleChangeImage(configData.image);
        else this.cvs.setBackgroundImage(null);
        
        if (configData.overlay_image) this.handleChangeOverlayImage(configData.overlay_image);
        else this.cvs.setOverlayImage(null);
        
        this.cvs.remove(...this.cvs.getObjects());
        this.areaList = [];
        this.cvs.renderAll();

        window.addEventListener("resize", this.resetCanvasWidthAndHeight);
        document.addEventListener('keydown', this.handleDeleteCanvasObject);

        if (configData.surfaces) configData.surfaces.forEach(item => {
          this.downPoint = {x: item.x, y: item.y};
          this.upPoint = {x: item.x + item.width, y: item.y + item.height};
          delete item.created_at;
          delete item.updated_at;
          this.createRectArea(item);
        })
      })
    },
    async handleSaveCurrent() {
      this.areaList.forEach(item => {
        item.text_colors = [...new Set(item.text_colors.map(el => el.color))]
      })
      try {
        await customizeEdit({
          id: this.currentEditId,
          image: this.currentEditImage,
          overlay_image: this.currentEditOverlayImage,
          surfaces: this.areaList
        });
        this.$message({
          message: '操作成功',
          type: 'success'
        });
        this.$emit('suc')
        this.handleBeforeClose()
      } catch (e) {
        this.areaList.forEach(item => {
          item.text_colors = item.text_colors.map(el => ({color: el}))
        });
      }
    },
    resetCanvasWidthAndHeight() {
      const {width: canvasWrapWidth, height: canvasWrapHeight} = this.$refs.canvasWrap.getBoundingClientRect();

      const widthScale = canvasWrapWidth / this.maxWidth;
      const heightScale = canvasWrapHeight / this.maxHeight;

      const dimensions = {
        width: canvasWrapWidth,
        height: canvasWrapHeight
      };

      widthScale > heightScale ? (dimensions.width = canvasWrapHeight) : (dimensions.height = canvasWrapWidth);

      this.cvs.setDimensions(dimensions);
      this.cvs.setZoom(Math.min(widthScale, heightScale));
      this.cvs.renderAll();
    },
    recordMouseDown(opt) {
      this.downPoint = opt.absolutePointer
    },
    recordMouseUp(opt) {
      if (this.cvs.getActiveObjects().length === 0) {
        this.upPoint = opt.absolutePointer
        this.createRectArea()
      }
    },
    handleCanvasOperationSyncCollapse(opt) {
      if (!opt.e) return;

      if (opt.deselected) this.activeName = '';

      if (opt.selected && opt.selected.length === 1) this.activeName = opt.selected[0].id;
    },
    handleChangeCanvasElSize({transform, target}) {
      const calcXYAndWH = (target) => {
        const {left, top, width, height, scaleX, scaleY, id} = target;
        const area = this.areaList.find(item => item.id === id);
        if (area) {
          area.x = left;
          area.y = top;
          area.width = width * scaleX;
          area.height = height * scaleY;
        }
      }

      const {action} = transform;
      if (action === 'scale' || action === 'scaleX' || action === 'scaleY' || action === 'drag') {
        if(!target._objects) {
          calcXYAndWH(target)
        } else {
          target._objects.forEach(obj => {
            calcXYAndWH({...obj, top: target.top + obj.top + target.height / 2, left: target.left + obj.left + target.width / 2, scaleX: target.scaleX, scaleY: target.scaleY})
          })
        }
      }
    },
    handleChangeInputSizeValue(id, propName) {
      const area = this.areaList.find(item => item.id === id);
      const el = this.cvs.getObjects().find(item => item.id === id);
      if (propName === 'x') el.set('left', area[propName])
      else if (propName === 'y') el.set('top', area[propName])
      else if (propName === 'width') el.set('width', area[propName] / el.scaleX)
      else if (propName === 'height') el.set('height', area[propName] / el.scaleY)

      el.setCoords();
      this.cvs.renderAll();
    },
    handleCollapseOperationSyncCanvas(name) {
      this.cvs.discardActiveObject();

      let object = this.cvs.getObjects().find(item => name === item.id);

      if (object) this.cvs.setActiveObject(object);

      this.cvs.renderAll();
    },
    handleDeleteCanvasObject(e) {
      if (e instanceof PointerEvent || Array.from(e.target.classList).includes('el-drawer') && (e.code === 'Backspace' || e.code === 'Delete')) {
        let activeObjects = this.cvs.getActiveObjects();
        if (activeObjects.length !== 0) {
          let idList = activeObjects.map(item => item.id);
          this.areaList = this.areaList.filter(item => !idList.includes(item.id));
          this.cvs.remove(...activeObjects);
          this.cvs.discardActiveObject();
          this.cvs.renderAll();
        }
      }
    },
    async editImageSize(url){
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          if(img.width !== img.height) {
            this.$message.error("图片尺寸不为1:1，无法导入")
            resolve(false)
          }
          this.sizeScale = this.maxWidth / img.width
          resolve(true);
        };
      })
    },
    async handleChangeImage(url) {
      if(!(await this.editImageSize(url))) return;
      this.currentEditImage = url
      this.cvs.setBackgroundImage(url, this.cvs.renderAll.bind(this.cvs), { scaleX: this.sizeScale, scaleY: this.sizeScale });
      this.cvs.renderAll();
    },
    async handleChangeOverlayImage(url) {
      if(!(await this.editImageSize(url))) return;
      this.currentEditOverlayImage = url 
      this.cvs.setOverlayImage(url, this.cvs.renderAll.bind(this.cvs), { scaleX: this.sizeScale, scaleY: this.sizeScale });
      this.cvs.renderAll();
    },
    operateExistingOverlay(type) {
      if(!this.currentEditOverlayImage) return this.$message.error('不存在蒙版图，请先选择蒙版图');
      if(type === 'hidden'){
        this.cvs.setOverlayImage(null);
      } else if (type=== 'remove'){
        this.cvs.setOverlayImage(null);
        this.currentEditOverlayImage = '';
      } else if(type === 'show'){
        this.cvs.setOverlayImage(this.currentEditOverlayImage, this.cvs.renderAll.bind(this.cvs), { scaleX: this.sizeScale, scaleY: this.sizeScale });
      }
      this.cvs.renderAll();
    },
    async handleAutoGenerateArea() {
      if(!this.currentEditOverlayImage) return this.$message.error('自动生成需要蒙版图，请先选择蒙版图');

      const data = await transparentAreas({url: this.currentEditOverlayImage});
      if(data.data){
        this.areaList = [];
        this.cvs.remove(...this.cvs.getObjects());

        this.$nextTick(() => {
          const areas = data.data;
          for(let i = 0; i < areas.length; i++){
            this.downPoint = { x: areas[i].x * this.sizeScale, y: areas[i].y * this.sizeScale }
            this.upPoint = { x: areas[i].x * this.sizeScale + areas[i].width * this.sizeScale, y: areas[i].y * this.sizeScale + areas[i].height * this.sizeScale }
            this.createRectArea()
          }
        })
      } else this.$message.error('自动生成区域失败，检查或重试')
    },
    createRectArea(data) {
      const {x: downX, y: downY} = this.downPoint;
      const {x: upX, y: upY} = this.upPoint;

      if (Math.abs(downX - upX) < 10 || Math.abs(downY - upY) < 10) return;

      let id = uuidv4();
      if (data) id = data.id;

      const rect = new fabric.Rect({
        top: Math.min(this.downPoint.y, this.upPoint.y),
        left: Math.min(this.downPoint.x, this.upPoint.x),
        width: Math.abs(this.downPoint.x - this.upPoint.x),
        height: Math.abs(this.downPoint.y - this.upPoint.y),
        fill: 'rgba(255, 0, 0, 0.2)',
        stroke: 'red',
        lockSkewingX: true,
        lockSkewingY: true,
        id
      })

      this.addIndexControl(rect, id, this.areaList.length + 1);
      rect.setControlVisible('mtr', false);

      this.cvs.add(rect)
      let areaInfo = {
        id,
        type: 0,
        x: Math.min(this.downPoint.x, this.upPoint.x),
        y: Math.min(this.downPoint.y, this.upPoint.y),
        width: Math.abs(this.downPoint.x - this.upPoint.x),
        height: Math.abs(this.downPoint.y - this.upPoint.y),
        image_min_height: 800,
        image_min_width: 800,
        text_limit: 10,
        text_colors: ['#000000'],
        text_align: 2,
        is_required: true
      }

      if (data) areaInfo = {...areaInfo, ...data};

      areaInfo.text_colors = areaInfo.text_colors.map(item => ({color: item}));

      this.areaList.push(areaInfo)

      this.downPoint = null
      this.upPoint = null
    },
    addIndexControl(rect, id, index) {
      rect.controls[`${id}`] = new fabric.Control({
        x: -0.5,
        y: -0.5,
        offsetX: -16,
        offsetY: -16,
        cursorStyle: 'move',
        cornerSize: 24,
        render: function (ctx, left, top) {
          ctx.save();
          let size = this.cornerSize;
          ctx.fillStyle = 'red';
          ctx.translate(left, top);
          ctx.fillRect(-size / 2, -size / 2, size, size);
          ctx.fillStyle = 'white';
          ctx.font = "20px Arial";
          ctx.fontWeight = "bolder"
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(`${index}`, 0, 2);
          ctx.restore()
        }
      });
    },
    getReferenceTableData: throttle(async function ()  {
      const data = await customizeListByPage({page: 1, page_size: 20, is_ok: 1, name: this.referenceSearchName})
      if(data.data.list) this.referenceTableData = data.data.list
    }, 500)
  },
  mounted() {
  },
  filters: {},
  async created() {
    this.getReferenceTableData()
  }
}
</script>
<style scoped lang="scss">

.main {
  width: 100%;
  height: 95%;
  display: flex;
  flex-direction: column;

  .top {
    width: 100%;
    height: 6%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }

  .bottom {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-around;

    .container {
      width: 50%;
      height: 100%;

      .canvas-wrap {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
    }

    .collapse-wrap {
      width: 700px;
    }
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px !important;
}
</style>