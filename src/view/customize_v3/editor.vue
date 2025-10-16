<template>
  <el-drawer :visible.sync="$attrs.visible" :title="title" @opened="onOpened" :before-close="handleBeforeClose" :wrapperClosable="false" size="80%">
    <div class="left" id="left">
      <div class="left_header">
        <el-radio-group size="mini" v-model="cvs_index" style="display: inline-block" @change="switchCvs">
          <el-radio-button :label="0">图+切割</el-radio-button>
          <el-radio-button :label="1">图</el-radio-button>
          <el-radio-button :label="2">切割</el-radio-button>
        </el-radio-group>
        <template v-if="!cvs_index">
          <el-button size="mini" type="primary" style="display: inline-block; margin-left: 20px" @click="adjust(true)">
            左右居中
          </el-button>
          <el-button size="mini" type="primary" style="display: inline-block; margin-left: 5px" @click="adjust(false)">
            上下居中
          </el-button>
        </template>
        <el-button size="mini" style="display: inline-block; margin-left: 20px" @click="restoreCanvasState">还原画布初始状态</el-button>
        <el-button size="mini" style="margin-left: 10px" @click="handleRotateCanvas">旋转</el-button>
        <div style="float: right; display: inline-block">
          <el-radio-group size="mini" v-model="show_all_condition" style="display: inline-block">
            <el-radio-button :label="true">显示所有</el-radio-button>
            <el-radio-button :label="false">仅显示满足条件</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div style="font-size: 12px; text-align: right; color: #99A1AF;">鼠标滚轮缩放，按住Alt移动画布，点击“还原画布状态”还原</div>
      <div id="canvas-wrap" :class="[selectSurface && selectSurface.editable ? '' : 'cant_click']" style="width: 100%; height: 100%">
      </div>
    </div>
    <div class="right">
      <el-form :class="[selectSurface && selectSurface.editable ? '' : 'cant_click']" :model="selectSurface" size="mini"
               label-width="80px" label-position="right">
        <el-form-item :label="isCreate ? '引用模板' : '定制模板'" prop="select_customize_id" style="margin-top: 0 !important;">
          <el-row>
            <el-col :span="18">
              <el-select v-model="select_customize_id" :placeholder="isCreate ? `引用模板` : `定制模板`" filterable clearable style="width: 100%" @change="customizeIdChanged">
                <el-option v-for="(item, index) in customizeOptions" :key="index" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-button size="mini" type="primary" style="width: 100%; margin-left: 5px;" @click="syncCustomizeList">同步模板</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-tabs size="mini" v-model="selectSurfaceId" :stretch="true" addable @tab-remove="removeSurface"
               @tab-click="clickSurface" @tab-add="addSurface" @keydown.native.delete.capture.stop.prevent>
        <el-tab-pane :label="`面-${item.name}`" :name="item.id" v-for="item in surface_list" :key="item.id" :closable="item.editable">
          <template slot="label">
            <span style="display: inline-block;text-align: left;">
              面-{{item.name}}
              <el-popover placement="bottom" trigger="click" @show="edit(item)">
                <el-input v-model="editTab.name" size="mini" style="width: 100%">
                </el-input>
                <el-button size="mini" style="width: 100%" type="primary" @click="editSubmit(item)">修改</el-button>
                <el-button slot="reference" size="mini" icon="el-icon-edit" circle></el-button>
              </el-popover>
              <i class="el-icon-success" v-if="isPreviewSuc(item.id)"></i>
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-form :class="[selectSurface && selectSurface.editable ? '' : 'cant_click']" :model="selectSurface" size="mini"
               label-width="80px" label-position="right" v-if="selectSurface">
        <el-form-item label="宽/高(mm)" prop="width">
          <el-col :span="10">
            <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Number"
                           :list="selectSurface.width_conditions" @update="updateConditions(selectSurface, 'width_conditions', $event)"
                           :refresh="() => {refresh(selectSurface, 'width', selectSurface.width_conditions, handleUpdateWh)}">
              <el-input-number size="mini" style="width: 100%" v-model="selectSurface.width" :min="1" :precision="2"
                               placeholder="宽(mm)" @keyup.enter.native="handleUpdateWh"></el-input-number>
            </ValueSelectorV3>
          </el-col>
          <el-col :span="10">
            <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Number"
                           :list="selectSurface.height_conditions" @update="updateConditions(selectSurface, 'height_conditions', $event)"
                           :refresh="() => {refresh(selectSurface, 'height', selectSurface.height_conditions, handleUpdateWh)}">
              <el-input-number size="mini" style="width: 100%" v-model="selectSurface.height" :min="1" :precision="2"
                               placeholder="高(mm)" @keyup.enter.native="handleUpdateWh"></el-input-number>
            </ValueSelectorV3>
          </el-col>
          <el-col :span="4">
            <el-button size="mini" type="primary" style="width: 100%" @click="handleUpdateWh">更新</el-button>
          </el-col>
        </el-form-item>

        <el-form-item label="底图" prop="base_image_id">
          <el-row :gutter="5">
            <el-col :span="12">
              <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="IdNameArray" :values="imageOptions"
                             :list="selectSurface.base_image_conditions" @update="updateConditions(selectSurface, 'base_image_conditions', $event)"
                             :refresh="() => {refresh(selectSurface, 'base_image_id', selectSurface.base_image_conditions, notifyBaseImageChanged)}">
                <el-badge :is-dot="problem(-1)>0" :max="99" style="width: 100%">
                  <el-select v-model="selectSurface.base_image_id" placeholder="请选择底图" filterable clearable style="width: 100%" @change="notifyBaseImageChanged" remote :remote-method="searchImageList">
                    <el-option label=" " :value="0"></el-option>
                    <template v-for="(item, index) in showImageOptions">
                      <el-option :key="index" :label="item.name" :value="item.id">
                        <div style="float: left">{{ item.name }}</div>
                        <KdxImage style="float: right" :src="item.thumbnail_url" :imageViewWidth="100" width="100%" height="34px"></KdxImage>
                      </el-option>
                    </template>
                  </el-select>
                </el-badge>
              </ValueSelectorV3>
            </el-col>
            <el-col :span="2">
              <el-upload action="/customize_v3/image/update" :headers="{'x-token':token}" multiple :show-file-list="false"
                         accept=".png,.jpg,.jpeg" :before-upload="beforeUpload" :on-success="handleBaseImageSuccess" :on-error="handleError" style="width: 100%">
                <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                  上传底图
                </el-button>
              </el-upload>
            </el-col>
            <el-col :span="2">
              <el-button size="mini" type="primary" style="width: 100%; margin-left: 5px;" @click="syncImageList">同步底图</el-button>
            </el-col>
            <el-col :span="8">
              <el-input-number size="mini" style="width: 100%" v-model="selectSurface.count" :min="1" :precision="0" :max="100" placeholder="生成数量"></el-input-number>
            </el-col>
          </el-row>
        </el-form-item>

        <el-row :gutter="5">
          <el-col :span="12">
            <el-form-item label="打印材料" prop="print_material">
              <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="StringArray" :values="printMaterialOptions.map((item) => {return item.id})"
                             :list="selectSurface.print_material_conditions" @update="updateConditions(selectSurface, 'print_material_conditions', $event)"
                             :refresh="() => {refresh(selectSurface, 'print_material', selectSurface.print_material_conditions)}">
                <el-select v-model="selectSurface.print_material" placeholder="打印材料" filterable clearable
                           style="width: 100%">
                  <el-option v-for="(item, index) in printMaterialOptions" :key="index" :label="`${item.id}[DPI: ${item.dpi}]`" :value="item.id">
                  </el-option>
                </el-select>
              </ValueSelectorV3>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="放大倍数" prop="export_scale">
              <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Number"
                             :list="selectSurface.export_scale_conditions" @update="updateConditions(selectSurface, 'export_scale_conditions', $event)"
                             :refresh="() => {refresh(selectSurface, 'export_scale', selectSurface.export_scale_conditions)}">
                <el-input-number size="mini" style="width: 100%" v-model="selectSurface.export_scale" :min="0" placeholder="导出放大倍数"></el-input-number>
              </ValueSelectorV3>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="margin-top: 10px; margin-bottom: 10px">
          <el-row :gutter="5">
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewText">文字</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewImage">图</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewSvg">SVG</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewPath">路径</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewMzpt">名字拼图</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewCircle">圆</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewRect">方</el-button>
            </el-col>
            <el-col :span="3">
              <el-button size="mini" style="width: 100%" type="primary" @click="addNewInfo">数据</el-button>
            </el-col>
          </el-row>
        </div>
        <el-scrollbar>
          <el-badge :is-dot="problem(item.id)>0" :max="99" style="width: 100%" :key="index" v-for="(item, index) in selectSurface.items">
            <el-card class="box-card" shadow="always"
                   v-if="show_all_condition || isVisible(item.condition)">
            <div slot="header">
              <el-row :gutter="5">
                <el-col :span="5">
                  <div style="width: 100%" @click="show(item)">
                      <el-input style="width: 100%" v-model="item.name" placeholder="名字"></el-input>
                  </div>
                </el-col>
                <el-col :span="3">
                  <el-input-number size="mini" style="width: 100%" v-model="item.level" placeholder="显示层级"
                                   :min="0" :max="selectSurface.items.length-1" :precision="0" :step="1"
                                   @change="render(item)"></el-input-number>
                </el-col>
                <el-col :span="2">
                  <el-checkbox v-model="item.condition.has" style="display: inline-block" @change="render(item)">显示条件
                  </el-checkbox>
                </el-col>
                <el-col :span="2">
                  <el-checkbox v-model="item.uv" style="display: inline-block" :disabled="disabledUv(item)"
                               @change="render(item)">图
                  </el-checkbox>
                </el-col>
                <el-col :span="2">
                  <el-checkbox v-model="item.cutting" style="display: inline-block" :disabled="disabledCutting(item)"
                               @change="render(item)">切割
                  </el-checkbox>
                </el-col>
                <el-col :span="2">
                  <el-checkbox v-model="item.unselectable" style="display: inline-block" @change="updateUnselectable(item)">不可选
                  </el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-col :span="4">
                    <el-button size="mini" style="width: 100%" type="primary" @click="move(item, index, 0)"
                               :disabled="index===0">顶
                    </el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="mini" style="width: 100%" type="primary" @click="move(item, index, index-1)"
                               :disabled="index===0">上
                    </el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="mini" style="width: 100%" type="primary" @click="move(item, index, index+1)"
                               :disabled="index===selectSurface.items.length-1">下
                    </el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="mini" style="width: 100%" type="primary"
                               @click="move(item, index, selectSurface.items.length-1)"
                               :disabled="index===selectSurface.items.length-1">底
                    </el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="mini" style="width: 100%" type="primary" @click="copy(item)">复</el-button>
                  </el-col>
                  <el-col :span="4">
                    <el-button size="mini" style="width: 100%" type="danger" @click="remove(item)">删</el-button>
                  </el-col>
                </el-col>

                <el-col :span="15" :offset="9" v-if="item.condition.has">
                  <el-form-item label="显示条件">
                    <el-row :gutter="5">
                      <el-col :span="8">
                        <el-select v-model="item.condition.key" placeholder="请选择关键值" filterable clearable
                                   style="width: 100%" @change="render(item)">
                          <el-option value=""></el-option>
                          <el-option v-for="(item, index) in dataList" :key="index" :label="item.id"
                                     :value="item.id" style="width: 500px;">
                            <div style="float: left">{{ item.id }}</div>
                            <div style="float: right; color: gray">{{ item.value }}</div>
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-select v-model="item.condition.method" placeholder="请选择方法" filterable clearable
                                   style="width: 100%" @change="render(item)">
                          <el-option value=""></el-option>
                          <el-option v-for="(item, index) in methodOptions" :key="index" :label="item.name"
                                     :value="item.id" style="width: 500px;">
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input style="width: 100%" v-model="item.condition.value" placeholder="值"
                                  @change="render(item)"></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="5" type="flex" style="flex-wrap:wrap" v-if="item.show">
              <template v-if="item.circle">
                <el-col :span="12">
                  <el-form-item label="X(mm)" prop="left">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.circle.left" placeholder="X(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y(mm)" prop="top">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.circle.top" placeholder="Y(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="半径" prop="radius">
                    <el-input-number style="width: 100%" v-model="item.circle.radius" placeholder="半径(mm)"
                                     :precision="2" :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角度" prop="angle">
                    <el-input-number style="width: 100%" v-model="item.circle.angle" placeholder="角度" :precision="2"
                                     :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="X缩放" prop="scaleX">
                    <el-input-number style="width: 100%" v-model="item.circle.scaleX" placeholder="X缩放"
                                     :precision="2"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y缩放" prop="scaleY">
                    <el-input-number style="width: 100%" v-model="item.circle.scaleY" placeholder="Y缩放"
                                     :precision="2"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else-if="item.rect">
                <el-col :span="12">
                  <el-form-item label="X(mm)" prop="left">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.rect.left" placeholder="X(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y(mm)" prop="top">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.rect.top" placeholder="Y(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="宽(mm)" prop="width">
                    <el-input-number style="width: 100%" v-model="item.rect.width" placeholder="宽(mm)" :precision="2"
                                     :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="高(mm)" prop="height">
                    <el-input-number style="width: 100%" v-model="item.rect.height" placeholder="半径(mm)"
                                     :precision="2" :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="X弧度" prop="rx">
                    <el-input-number style="width: 100%" v-model="item.rect.rx" placeholder="X弧度" :precision="2"
                                     :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y弧度" prop="ry">
                    <el-input-number style="width: 100%" v-model="item.rect.ry" placeholder="Y弧度" :precision="2"
                                     :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="X缩放" prop="scaleX">
                    <el-input-number style="width: 100%" v-model="item.rect.scaleX" placeholder="X缩放" :precision="2"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y缩放" prop="scaleY">
                    <el-input-number style="width: 100%" v-model="item.rect.scaleY" placeholder="Y缩放" :precision="2"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角度" prop="angle">
                    <el-input-number style="width: 100%" v-model="item.rect.angle" placeholder="角度" :precision="2"
                                     :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="item.uv">
                  <el-form-item label="填充颜色" prop="fill">
                    <el-input style="width: 100%" v-model="item.rect.fill" placeholder="填充颜色"
                              @change="render(item)" clearable>
                      <div slot="suffix">
                        <el-color-picker v-model="item.rect.fill" @change="render(item)"
                                         show-alpha></el-color-picker>
                      </div>
                    </el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else-if="item.text">
                <el-form-item label="文本内容" prop="text" style="width: 100%">
                  <el-col :span="24">
                    <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Key"
                                   :list="item.text.text_conditions" @update="updateConditions(item.text, 'text_conditions', $event)"
                                   :refresh="() => {refresh(item.text, 'text', item.text.text_conditions, () => {render(item)})}">
                      <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width: 100%"
                                v-model="item.text.text" placeholder="文本内容" @change="render(item)"
                                clearable></el-input>
                    </ValueSelectorV3>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="removeSpace(item)">去空格
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="firstUp(item)">首字母大写
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="allUp(item)">大写
                    </el-button>
                  </el-col>
                  <el-col :span="6">
                    <el-button size="mini" type="primary" style="width: 100%" @click="verticalText(item)">竖排文字
                    </el-button>
                  </el-col>
                </el-form-item>
                <el-col :span="12">
                  <el-form-item label="X(mm)" prop="left">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.text.left" placeholder="X(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y(mm)" prop="top">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.text.top" placeholder="Y(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="X缩放" prop="scaleX">
                    <el-input-number style="width: 100%" v-model="item.text.scaleX" placeholder="X缩放" :precision="2" :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y缩放" prop="scaleY">
                    <el-input-number style="width: 100%" v-model="item.text.scaleY" placeholder="Y缩放" :precision="2" :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="宽" prop="width">
                    <el-input-number style="width: 100%" v-model="item.text.width" :min="0" :precision="2" :step="1" placeholder="宽度" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字体" prop="font_family">
                    <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Key"
                                   :list="item.text.font_family_conditions" @update="updateConditions(item.text, 'font_family_conditions', $event)"
                                   :refresh="() => {refresh(item.text, 'font_family', item.text.font_family_conditions, () => {fontFamilyChanged(item)})}">
                      <el-select v-model="item.text.font_family" placeholder="请选择字体" filterable clearable
                                 style="width: 100%" @change="fontFamilyChanged(item)">
                        <el-option v-for="(item, index) in fontOptions" :key="index" :label="item.name"
                                   :value="item.name"></el-option>
                      </el-select>
                    </ValueSelectorV3>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" label-width="0">
                    <el-upload action="/customize_v3/font/update" :headers="{'x-token':token}" :show-file-list="false"
                               accept=".otf,.ttf" :on-success="handleSuccess" :on-error="handleError"
                               style="width: 100%; margin-left: 5px">
                      <el-button size="mini" style="width: 100%" type="primary"
                                 v-loading.fullscreen.lock="fullscreenLoading">
                        上传字体
                      </el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="" label-width="0">
                    <el-button size="mini" style="width: 100%; margin-left: 5px" type="primary" @click="syncFontList">
                      同步字体
                    </el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字体大小" prop="font_size">
                    <el-input-number style="width: 100%" v-model="item.text.font_size" :min="0" :precision="2" placeholder="字体大小"
                                     :step="20" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字体颜色" prop="font_color">
                    <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Key"
                                   :list="item.text.font_color_conditions" @update="updateConditions(item.text, 'font_color_conditions', $event)"
                                   :refresh="() => {refresh(item.text, 'font_color', item.text.font_color_conditions, () => {render(item)})}">
                      <el-input style="width: 100%" v-model="item.text.font_color" placeholder="字体颜色"
                                @change="render(item)" clearable>
                        <div slot="suffix">
                          <el-color-picker v-model="item.text.font_color" @change="render(item)"
                                           show-alpha></el-color-picker>
                        </div>
                      </el-input>
                    </ValueSelectorV3>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="字数限制" prop="limit">
                    <el-input-number style="width: 100%" v-model="item.text.limit" :min="0"
                                     :precision="0"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="文字间隔" prop="char_spacing">
                    <el-input-number style="width: 100%" v-model="item.text.char_spacing" :precision="0" :step="50"
                                     @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="文字粗细" prop="font_weight">
                    <el-select v-model="item.text.font_weight" placeholder="文字粗细" filterable clearable
                               style="width: 100%" @change="render(item)">
                      <el-option label="100" value="100"></el-option>
                      <el-option label="200" value="200"></el-option>
                      <el-option label="300" value="300"></el-option>
                      <el-option label="400" value="400"></el-option>
                      <el-option label="500" value="500"></el-option>
                      <el-option label="600" value="600"></el-option>
                      <el-option label="700" value="700"></el-option>
                      <el-option label="800" value="800"></el-option>
                      <el-option label="900" value="900"></el-option>
                      <el-option label="bold" value="bold"></el-option>
                      <el-option label="bolder" value="bolder"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="文字位置" prop="text_align">
                    <el-col :span="8">
                      <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back"
                                 @click="changeTextAligh(item, 'left')"></el-button>
                    </el-col>
                    <el-col :span="8">
                      <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus"
                                 @click="changeTextAligh(item, 'center')"></el-button>
                    </el-col>
                    <el-col :span="8">
                      <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right"
                                 @click="changeTextAligh(item, 'right')"></el-button>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="路径" prop="path">
                    <el-row>
                      <el-col :span="18">
                        <el-input style="width: 100%" v-model="item.text.path" placeholder="路径"
                                  @change="render(item)"
                                  clearable></el-input>
                      </el-col>
                      <el-col :span="6">
                        <el-button size="mini" type="primary" style="width: 100%" @click="changeTextPathSide(item)">
                          翻转
                        </el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="描边宽度" prop="stroke_width">
                    <el-input-number style="width: 100%" v-model="item.text.stroke_width" :precision="2"
                                     @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="描边颜色" prop="stroke">
                    <el-input style="width: 100%" v-model="item.text.stroke" placeholder="描边颜色"
                              @change="render(item)" clearable>
                      <el-color-picker v-model="item.text.stroke" slot="suffix"
                                       @change="render(item)"></el-color-picker>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角度" prop="angle">
                    <el-input-number size="mini" style="width: 100%" v-model="item.text.angle" :min="-360" :max="360"
                                     :precision="2" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="!item.cutting">
                  <el-form-item label="阴影颜色" prop="shadow_color">
                    <el-input style="width: 100%" v-model="item.text.shadow_color" placeholder="阴影颜色"
                              @change="render(item)" clearable>
                      <el-color-picker v-model="item.text.shadow_color" slot="suffix"
                                       @change="render(item)"></el-color-picker>
                    </el-input>
                  </el-form-item>
                </el-col>
                <template v-if="!item.cutting && item.text.shadow_color">
                  <el-col :span="12">
                    <el-form-item label="阴影偏移X" prop="shadow_offset_x">
                      <el-input-number style="width: 100%" v-model="item.text.shadow_offset_x"
                                       placeholder="阴影偏移X(单位像素)" :precision="2"
                                       @change="render(item)"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="阴影偏移Y" prop="shadow_offset_y">
                      <el-input-number style="width: 100%" v-model="item.text.shadow_offset_y"
                                       placeholder="阴影偏移Y(单位像素)" :precision="2"
                                       @change="render(item)"></el-input-number>
                    </el-form-item>
                  </el-col>
                </template>
                <el-col :span="12">
                  <el-form-item label="行数" prop="line">
                    <el-input-number style="width: 100%" v-model="item.text.line" placeholder="行数" :min="1"
                                     :step="1"
                                     :precision="0" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else-if="item.image">
                <el-col :span="24">
                  <el-form-item label="图片链接" prop="url">
                    <el-col :span="16">
                      <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Key"
                                     :list="item.image.url_conditions" @update="updateConditions(item.image, 'url_conditions', $event)"
                                     :refresh="() => {refresh(item.image, 'url', item.image.url_conditions, () => {render(item)})}">
                        <el-input style="width: 100%" v-model="item.image.url" placeholder="图片链接" @change="render(item)" clearable></el-input>
                      </ValueSelectorV3>
                    </el-col>
                    <el-col :span="8">
                      <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                                 accept=".png,.jpg" :on-success="(res) => {handleImageSuccess(item, res)}"
                                 :on-error="handleError" style="width: 100%">
                        <el-button size="mini" style="width: 100%" type="primary">上传图片</el-button>
                      </el-upload>
                    </el-col>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="图片填充" prop="url">
                    <el-col :span="12">
                      <el-select v-model="item.image.type" placeholder="请选择图片填充类型" filterable clearable
                                style="width: 100%" @change="render(item)">
                        <el-option label="填充满" :value="IT_FILL"></el-option>
                        <el-option label="自动宽高" :value="IT_AUTO"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" style="width: 100%" @click="() => { item.image.width = selectSurface.width; render({...item, changeType: 'width'}) }">宽度拉伸至画布宽度</el-button>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" style="width: 100%" @click="() => { item.image.height = selectSurface.height; render({...item, changeType: 'height'}) }">高度拉伸至画布高度</el-button>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="primary" style="width: 100%" :disabled="item.image.type === IT_AUTO" @click="() => { item.image.width = selectSurface.width; item.image.height = selectSurface.height; render(item) }">宽高拉伸至画布宽高</el-button>
                    </el-col>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="X(mm)" prop="left">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.image.left" placeholder="X(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y(mm)" prop="top">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.image.top" placeholder="Y(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="宽(mm)" prop="width">
                    <el-input-number style="width: 100%" v-model="item.image.width" placeholder="宽(mm)"
                                     :precision="2"
                                     :step="1" @change="render({...item, changeType: 'width'})"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="高(mm)" prop="height">
                    <el-input-number style="width: 100%" v-model="item.image.height" placeholder="半径(mm)"
                                     :precision="2" :step="1" @change="render({...item, changeType: 'height'})"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角度" prop="angle">
                    <el-input-number size="mini" style="width: 100%" v-model="item.image.angle" :min="-360"
                                     :max="360"
                                     :precision="2" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="裁剪路径" prop="clipPath">
                    <el-input style="width: 100%" v-model="item.image.clipPath" placeholder="裁剪路径"
                              @change="render(item)" clearable></el-input>
                  </el-form-item>
                </el-col>
                <template v-if="item.image.clipPath">
                  <el-col :span="12">
                    <el-form-item label="裁切X缩放" prop="clipPathScaleX">
                      <el-input-number style="width: 100%" v-model="item.image.clipPathScaleX"
                                       placeholder="裁切X缩放"
                                       :precision="2"
                                       :step="0.1" @change="render(item)"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="裁切Y缩放" prop="clipPathScaleY">
                      <el-input-number style="width: 100%" v-model="item.image.clipPathScaleY"
                                       placeholder="裁切Y缩放"
                                       :precision="2"
                                       :step="0.1" @change="render(item)"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <!--                      <el-col :span="12">-->
                  <!--                        <el-form-item label="固定位置" prop="clipPathScaleY">-->
                  <!--                          <el-switch style="float: right;" v-model="item.image.clipPathAbsolutePosition" active-text="固定位置"-->
                  <!--                                     inactive-text="位置跟随" @change="render(item)"></el-switch>-->
                  <!--                        </el-form-item>-->
                  <!--                      </el-col>-->
                </template>
              </template>
              <template v-else-if="item.svg">
                <el-col :span="24">
                  <el-form-item label="Svg链接" prop="url">
                    <el-col :span="16">
                      <el-input style="width: 100%" v-model="item.svg.url" placeholder="图片链接"
                                @change="render(item)"
                                clearable></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                                 accept=".svg" :on-success="(res) => {handleSvgSuccess(item, res)}"
                                 :on-error="handleError" style="width: 100%">
                        <el-button size="mini" style="width: 100%" type="primary">上传Svg</el-button>
                      </el-upload>
                    </el-col>
                    <el-col :span="4">
                      <el-button type="info" style="width: 100%" @click="openGenSvgDrawer(item)">生成SVG</el-button>
                    </el-col>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="X(mm)" prop="left">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.svg.left" placeholder="X(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y(mm)" prop="top">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.svg.top" placeholder="Y(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="X缩放" prop="scaleX">
                    <el-input-number style="width: 100%" v-model="item.svg.scaleX" placeholder="X缩放"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Y缩放" prop="scaleY">
                    <el-input-number style="width: 100%" v-model="item.svg.scaleY" placeholder="Y缩放"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="填充满">
                    <el-switch size="mini" v-model="item.svg.scaleToMax" @change="render(item)"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角度" prop="angle">
                    <el-input-number size="mini" style="width: 100%" v-model="item.svg.angle" :min="-360" :max="360"
                                     :precision="2" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="填充颜色" prop="fill">
                    <el-input style="width: 100%" v-model="item.svg.fill" placeholder="填充颜色"
                              @change="render(item)" clearable>
                      <div slot="suffix">
                        <el-color-picker v-model="item.svg.fill" @change="render(item)"
                                         show-alpha></el-color-picker>
                      </div>
                    </el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else-if="item.path">
                <el-col :span="24">
                  <el-form-item label="路径" prop="path">
                    <el-input style="width: 100%" v-model="item.path.path" placeholder="路径内容"
                              @change="render(item)"
                              clearable></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="X(mm)" prop="left">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.path.left" placeholder="X(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Y(mm)" prop="top">
                    <el-row>
                      <el-input-number style="width: 100%" v-model="item.path.top" placeholder="Y(mm)"
                                       :precision="2" :step="1" @change="render(item)"></el-input-number>
                    </el-row>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="X缩放" prop="scaleX">
                    <el-input-number style="width: 100%" v-model="item.path.scaleX" placeholder="X缩放" :precision="2"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="Y缩放" prop="scaleY">
                    <el-input-number style="width: 100%" v-model="item.path.scaleY" placeholder="Y缩放" :precision="2"
                                     :step="0.1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="填充满">
                    <el-switch size="mini" v-model="item.path.scaleToMax" @change="render(item)"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角度" prop="angle">
                    <el-input-number size="mini" style="width: 100%" v-model="item.path.angle" :min="-360" :max="360"
                                     :precision="2" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="填充颜色" prop="fill">
                    <el-input style="width: 100%" v-model="item.path.fill" placeholder="填充颜色"
                              @change="render(item)" clearable>
                      <div slot="suffix">
                        <el-color-picker v-model="item.path.fill" @change="render(item)"
                                         show-alpha></el-color-picker>
                      </div>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="描边宽度" prop="stroke_width">
                    <el-input-number style="width: 100%" v-model="item.path.strokeWidth" :precision="2"
                                     @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="描边颜色" prop="stroke">
                    <el-input style="width: 100%" v-model="item.path.stroke" placeholder="描边颜色"
                              @change="render(item)" clearable>
                      <el-color-picker v-model="item.path.stroke" slot="suffix"
                                       @change="render(item)"></el-color-picker>
                    </el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else-if="item.mzpt">
                <el-col :span="12">
                  <el-form-item label="弧度(mm)" prop="radius">
                    <el-input-number style="width: 100%" v-model="item.mzpt.radius" placeholder="弧度(mm)"
                                     :precision="2" :step="1" @change="render(item)"></el-input-number>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="底板材料" prop="bottom_print_material">
                    <el-select v-model="item.mzpt.bottom_print_material" placeholder="底板材料" filterable clearable
                               style="width: 100%" @change="render(item)">
                      <el-option v-for="(item, index) in printMaterialOptions" :key="index" :label="`${item.id}[DPI: ${item.dpi}]`"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="元素材料" prop="elem_print_material">
                    <el-select v-model="item.mzpt.elem_print_material" placeholder="元素材料" filterable clearable
                               style="width: 100%" @change="render(item)">
                      <el-option v-for="(item, index) in printMaterialOptions" :key="index" :label="`${item.id}[DPI: ${item.dpi}]`"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="底座" prop="stand_id">
                    <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="IdNameArray" :values="mzptStandOptions"
                                   :list="item.mzpt.stand_conditions" @update="updateConditions(item.mzpt, 'stand_conditions', $event)"
                                   :refresh="() => {refresh(item.mzpt, 'stand_id', item.mzpt.stand_conditions, () => {render(item)})}">
                      <el-select v-model="item.mzpt.stand_id" placeholder="请选择座子" filterable clearable
                                 style="width: 100%" @change="render(item)">
                        <el-option label=" " :value="0"></el-option>
                        <el-option :key="index" :label="item.name" :value="item.id"
                                   v-for="(item, index) in mzptStandOptions"></el-option>
                      </el-select>
                    </ValueSelectorV3>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="item.mzpt.lines.length <= 1">
                  <el-form-item label="自动调宽" prop="auto_scale_width">
                    <el-switch style="display: block" v-model="item.mzpt.auto_scale_width"
                               active-text="自动调宽(仅1行生效)" inactive-text=""
                               @change="changeAutoScaleWidth(item)"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-collapse accordion>
                    <el-collapse-item :title="`自动匹配元素列表: ${item.mzpt.elems.length}个`">
                      <el-form-item label="列表" prop="elems">
                        <el-select v-model="mzpt.elem_ids" placeholder="列表" multiple filterable clearable
                                   style="width: 100%" @change="mzptELemsChanged(item)">
                          <template v-for="(elem, index) in mzptElemOptions">
                            <el-option :key="index" :label="elem.name"
                                       :value="elem.id" v-if="!containsMzptElem(item, elem.id)"></el-option>
                          </template>
                        </el-select>
                      </el-form-item>
                      <el-table :data="item.mzpt.elems" stripe style="width: 100%" max-height="300px" border>
                        <el-table-column align="center" label="元素名">
                          <template slot-scope="{row}">
                            <div v-if="mzptElem(row.id)">{{ mzptElem(row.id).name }}</div>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="元素">
                          <template slot-scope="{row}">
                            <KdxImage :src="mzptElem(row.id).inner_image" width="40%" height="40%" v-if="mzptElem(row.id) && mzptElem(row.id).inner_image"></KdxImage>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="自动匹配字符">
                          <template slot-scope="{row}">
                            <el-input v-model="row.name" size="mini" style="width: 100%"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column align="center" label="操作">
                          <template slot-scope="{row}">
                            <i class="el-icon-delete" style="color: red" @click="removeItemMzptElem(item, row)"></i>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-collapse-item>
                  </el-collapse>
                </el-col>

                <el-col :span="24">
                  <el-card class="box-card" v-for="(line, index) in item.mzpt.lines" :key="index" shadow="always">
                    <div slot="header" class="clearfix">
                      <span>第{{ index + 1 }}行</span>

                      <el-button style="float: right; padding: 3px 10px" type="danger" @click="deleteLine(item, line)"
                                 v-if="item.mzpt.lines.length > 1">删除
                      </el-button>
                      <el-button style="float: right; padding: 3px 10px" type="danger" @click="addNewLine(item)">添加
                      </el-button>
                    </div>
                    <div>
                      <el-row>
                        <el-col :span="12">
                          <el-form-item label="Y(mm)" prop="top">
                            <el-input-number style="width: 100%" v-model="line.top" placeholder="Y(mm)"
                                             :precision="2" :step="1" @change="render(item)"></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="左间(mm)" prop="left_gap">
                            <el-input-number style="width: 100%" v-model="line.left_gap" placeholder="左侧间隔(mm)"
                                             :precision="2" :step="1" @change="render(item)"></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="右间(mm)" prop="right_gap">
                            <el-input-number style="width: 100%" v-model="line.right_gap" placeholder="右侧间隔(mm)"
                                             :precision="2" :step="1" @change="render(item)"></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="间隔(mm)" prop="elem_gap">
                            <el-input-number style="width: 100%" v-model="line.elem_gap" placeholder="元素间隔(mm)"
                                             :precision="2" :step="1" @change="render(item)"
                                             :disabled="!item.mzpt.auto_scale_width"></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="色系">
                            <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="IdNameArray" :values="mzptColorSeriesOptions"
                                           :list="line.color_series_conditions" @update="updateConditions(line, 'color_series_conditions', $event)"
                                           :refresh="() => {refresh(line, 'color_series_id', line.color_series_conditions, () => {render(item)})}">
                              <el-select v-model="line.color_series_id" placeholder="选择色系" filterable clearable
                                         style="width: 100%" @change="render(item)">
                                <el-option label=" " :value="0"></el-option>
                                <el-option v-for="(s, index) in mzptColorSeriesOptions" :key="index" :label="s.name"
                                           :value="s.id"></el-option>
                              </el-select>
                            </ValueSelectorV3>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="名字/元素">
                            <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="Key"
                                           :list="line.name_conditions" @update="updateConditions(line, 'name_conditions', $event)"
                                           :refresh="() => {refresh(line, 'name', line.name_conditions, () => {setMzptElemIdsByName(item, line)})}">
                              <el-input v-model="line.name" placeholder="输入名字或者元素(空格分隔)" multiple
                                        collapse-tags filterable clearable style="width: 100%"
                                        @change="setMzptElemIdsByName(item, line)">
                                <el-button slot="append" size="mini" type="primary" :disabled="!line.name"
                                           @click="setMzptElemIdsByName(item, line)">设置
                                </el-button>
                              </el-input>
                            </ValueSelectorV3>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item :label="`左侧(${line.left_elems.length}个)`" prop="elem_ids">
                            <draggable v-model="line.left_elems" @end="render(item)">
                              <template v-for="(elem_id, index) in line.left_elems">
                                <el-tag size="mini" type="primary" closable
                                        :key="index" @close="removeMzptElem(item, line, 'left_elems', index)"
                                        style="margin-right: 5px" v-if="mzptElem(elem_id)">{{
                                    mzptElem(elem_id).name
                                  }}
                                </el-tag>
                              </template>
                            </draggable>
                            <el-select v-model="mzpt.left_ids" placeholder="元素列表" multiple filterable clearable
                                       style="width: 100%"
                                       @change="mzptItemChanged(item, line, 'left_elems', 'left_ids')">
                              <el-option v-for="(item, index) in mzptElemOptions" :key="index" :label="item.name"
                                         :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :label="`中间(${line.mid_elems.length}个)`" prop="mid_elems">
                            <draggable v-model="line.mid_elems" @end="render(item)">
                              <template v-for="(elem_id, index) in line.mid_elems">
                                <el-tag size="mini" type="primary" closable
                                        :key="index" @close="removeMzptElem(item, line, 'mid_elems', index)"
                                        style="margin-right: 5px" v-if="mzptElem(elem_id)">{{
                                    mzptElem(elem_id).name
                                  }}
                                </el-tag>
                              </template>
                            </draggable>
                            <el-select v-model="mzpt.mid_ids" placeholder="元素列表" multiple filterable clearable
                                       style="width: 100%"
                                       @change="mzptItemChanged(item, line, 'mid_elems', 'mid_ids')">
                              <el-option v-for="(item, index) in mzptElemOptions" :key="index" :label="item.name"
                                         :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="8">
                          <el-form-item :label="`右侧(${line.right_elems.length}个)`" prop="right_elems">
                            <draggable v-model="line.right_elems" @end="render(item)">
                              <template v-for="(elem_id, index) in line.right_elems">
                                <el-tag size="mini" type="primary" closable
                                        :key="index" @close="removeMzptElem(item, line, 'right_elems', index)"
                                        style="margin-right: 5px" v-if="mzptElem(elem_id)">{{
                                    mzptElem(elem_id).name
                                  }}
                                </el-tag>
                              </template>
                            </draggable>
                            <el-select v-model="mzpt.right_ids" placeholder="元素列表" multiple filterable clearable
                                       style="width: 100%"
                                       @change="mzptItemChanged(item, line, 'right_elems', 'right_ids')">
                              <el-option v-for="(item, index) in mzptElemOptions" :key="index" :label="item.name"
                                         :value="item.id"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                  </el-card>
                </el-col>
              </template>
              <template v-else-if="item.info">
                <el-col :span="24" style="margin-top: 5px">
                  <ValueSelectorV3 :data-list="dataList" :method-options="methodOptions" value-type="String"
                               :list="item.info.value_conditions" @update="updateConditions(item.info, 'value_conditions', $event)"
                               :refresh="() => {refresh(item.info, 'value', item.info.value_conditions)}">
                    <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width: 100%"
                              v-model="item.info.value" placeholder="内容" clearable></el-input>
                  </ValueSelectorV3>
                </el-col>
              </template>
            </el-row>
          </el-card>
          </el-badge>
        </el-scrollbar>
      </el-form>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-popover placement="top-start" trigger="click" :close-delay="100">
            <div style="width: 300px; display: inline-block">
              <KdxImage style="display: inline-block" :src="meta('Image')" width="300px" height="300px"></KdxImage>
              <KdxImage style="display: inline-block" :src="meta('Image.Preview')" width="300px" height="300px" v-if="meta('Image.Preview')"></KdxImage>
            </div>
            <div style="width: 700px; display: inline-block">
              <el-table :data="dataList" stripe style="width: 100%" :header-cell-style="{'background-color': 'black', 'color': '#fff'}" max-height="600px">
                <el-table-column align="center" prop="id" label="Key" width="200px">
                  <div slot-scope="{row}">
                    <el-input size="mini" style="width: 100%" placeholder="Key" v-model="row.id" clearable filterable></el-input>
                  </div>
                </el-table-column>
                <el-table-column align="center" prop="value" label="数据" width="300px">
                  <div slot-scope="{row}">
                    <template v-if="row.is_multiple_text">
                      <el-input size="mini" type="textarea" :autosize="{ minRows: 1, maxRows: 10 }" style="width: 100%" placeholder="数据" v-model="row.value" clearable filterable></el-input>
                    </template>
                    <template v-else>
                      <el-input size="mini" style="width: 100%" placeholder="数据" v-model="row.value" clearable filterable></el-input>
                    </template>
                  </div>
                </el-table-column>
                <el-table-column align="center" prop="value" label="图片" width="100px">
                  <div slot-scope="{row}">
                    <KdxImage :src="row.value" style="width: 100%" v-if="row.is_img"></KdxImage>
                  </div>
                </el-table-column>
                <el-table-column align="center" label="操作" width="100px">
                  <template slot="header">
                    <div>操作</div>
                    <el-button type="primary" size="mini" style="width: 100%" @click="addData">添加</el-button>
                  </template>
                  <div slot-scope="{row}">
                    <template v-if="row.is_multiple_text">
                      <el-button type="primary" size="mini" style="width: 100%" @click="parseLines(row.value)">解析</el-button>
                    </template>
                    <el-button type="warning" size="mini" style="width: 100%" @click="deleteData(row)">删除</el-button>
                  </div>
                </el-table-column>
              </el-table>
            </div>
            <el-button slot="reference" size="medium" type="primary" style="width: 100%; height: 50px">参数</el-button>
          </el-popover>
        </el-col>
        <el-col :span="8">
          <el-popover placement="top" trigger="click" v-if="selectSurface">
            <el-form :model="batchUpdateTextForm" size="mini"  label-width="100px">
              <el-form-item label="" label-width="0">
                  <el-select v-model="batchUpdateTextForm.select_text" placeholder="请选择文本元素" filterable clearable multiple
                                  style="width: 100%; zoom: 1.15;">
                    <el-option v-for="item in selectSurface.items" :key="item.id" :label="item.name"
                                :value="item.id" :disabled="!item.text"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="清空文本">
                <div style="display: flex; justify-content: space-around;">
                  <el-button @click="handleBatchUpdateText('clear')">选中文本内容清空</el-button>
                  <el-button @click="handleBatchUpdateText('clearAll')">全部文本内容清空</el-button>
                </div>
              </el-form-item>
              <el-form-item label="首字母大写">
                <div style="display: flex; justify-content: space-around;">
                  <el-button @click="handleBatchUpdateText('firstLetterUpper')">选中文本首字母大写</el-button>
                  <el-button @click="handleBatchUpdateText('firstLetterUpperAll')">全部文本首字母大写</el-button>
                </div>
              </el-form-item>
              <el-form-item label="字体">
                <div style="display: flex; gap: 6px">
                  <el-select v-model="batchUpdateTextForm.font_family" placeholder="请选择字体" filterable clearable
                                  style="width: 100%">
                    <el-option v-for="(item, index) in fontOptions" :key="index" :label="item.name"
                                :value="item.name"></el-option>
                  </el-select>
                  <el-button type="primary" @click="handleBatchUpdateText('fontFamily')">更新</el-button>
                </div>
              </el-form-item>
              <el-form-item label="字体大小">
                <div style="display: flex; gap: 6px">
                  <el-input-number style="width: 100%" v-model="batchUpdateTextForm.font_size" :min="0" :precision="2" placeholder="字体大小"
                                     :step="20"></el-input-number>
                  <el-button type="primary" @click="handleBatchUpdateText('fontSize')">更新</el-button>
                </div>
              </el-form-item>
            </el-form>
            <el-button slot="reference" size="medium" type="info" style="width: 100%; height: 50px">批量更新文本</el-button>
          </el-popover>
        </el-col>
        <el-col :span="8">
          <el-popover placement="top" trigger="click">
            <el-input placeholder="模板名字" v-model="model.name" style="width: 100%" clearable filterable></el-input>
            <el-button size="mini" type="primary" :disabled="!model.name" style="width: 100%" @click="createTemplate">创建/更新</el-button>
            <el-button slot="reference" size="medium" type="primary" style="width: 100%; height: 50px" :disabled="textProblemIds.length > 0 || loadProblemIds.length > 0">保存模板</el-button>
          </el-popover>
        </el-col>
      </el-row>
      <CustomizeDlgPreviewV3 :id="order_id" :uv_svg="dlgPreview.uv_svg" :cut_svg="dlgPreview.cut_svg" :width="dlgPreview.width" :height="dlgPreview.height" :visible="dlgPreview.visible" @close="dlgPreview.visible=false" @suc="previewSuc"></CustomizeDlgPreviewV3>
      <GenSvg :visible.sync="genSvgVisible" :token="token" :svgConfig="genSvgItem" @change="changeGenSvgItemSvgConfig" @use="useGenSvgItemSvgUrl"/>
    </div>

    <div ref="buttonArea" v-freedraggable style="position: absolute; width: 120px; height: 170px; right: 20px; bottom: 200px; z-index: 9999; box-sizing: content-box; padding: 16px; border: 2px #DEDFE0 solid; border-radius: 5px; box-shadow: 0 7px 29px 0 rgba(100,100,111,0.2);" v-if="isOrder">
      <div>
        <el-button size="medium" type="warning" :disabled="textProblemIds.length > 0 || loadProblemIds.length > 0" @click="genAndPreview" style="width: 100%; height: 50px">预览</el-button>
      </div>
      <div style="margin-top: 10px">
        <el-button size="medium" type="danger" :disabled="!isAllPreviewSuc()" style="width: 100%; height: 50px" @click="confirmGen">生成</el-button>
      </div>
      <div style="margin-top: 10px">
        <el-button size="medium" type="success" style="width: 100%; height: 50px" @click="loadNextOrder">跳过此订单</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>

import {mapGetters} from "vuex";
import {fabric} from "fabric";
import freedraggable from '@/directive/free_draggable';
import KdxImage from "@/components/image/image.vue";
import {mzptElemList, mzptElemLoadList} from "@/api/customize_v3/mzpt_elem";
import {fontList} from "@/api/customize_v3/font";
import {mzptColorSeriesList} from "@/api/customize_v3/mzpt_color_series";
import {mzptStandList} from "@/api/customize_v3/mzpt_stand";
import {printMaterialList} from "@/api/product/print_material";
import draggable from "vuedraggable";
import {imageList} from "@/api/customize_v3/image";
import ValueSelectorV3 from "@/view/customize_v3/components/value_selector.vue";
import {customizeListWithIdName, customizeLoad, customizeUpdate} from "@/api/customize_v3/list";
import {
  customizeOrderGen,
  customizeOrderLoad,
  customizeOrderPreview,
  customizeOrderUpdate
} from "@/api/customize_v3/order";
import CustomizeDlgPreviewV3 from "@/view/customize_v3/components/dlg_preview_v3.vue";
import storage from "@/utils/localStorage.js";
import GenSvg from "@/view/customize_v3/gen_svg";

const MM_TO_PX_RATIO = 28.3464566929; // 毫米在DPI为720时对像素的转换比

export default {
  name: 'CustomizeDlgEditorV3',
  components: {CustomizeDlgPreviewV3, GenSvg, ValueSelectorV3, draggable, KdxImage},
  mixins: [],
  props: {
    id: {
      type: Number,
      default: 0, // 0 表示是创建
    },
    copy_id: {
      type: Number,
      default: 0, // 0 表示是创建
    },
    order_ids: {
      type: Array,
    },
  },
  directives: {
    freedraggable
  },
  data() {
    return {
      maxWidth: 800,
      maxHeight: 800,

      cvs_index: 0,
      cvs_list: [],
      show_all_condition: true,

      isIniting: false,
      order_index: 0,

      fullscreenLoading: false,

      // 选择的面
      lastSelectSurfaceId: undefined,
      selectSurfaceId: undefined,

      loadProblemIds: [],
      textProblemIds: [],

      editTab: {
        id: undefined,
        name: undefined,
      },
      model: {
        name: "",
      },
      select_customize_id: undefined,
      surface_list: [],

      uuidGen: 1,

      imageOptions: [],
      showImageOptions: [],

      dataList: [
        {id: "SkuCode", value: "XBJ-001"},
        {id: "Image", value: "https://image.szkdx.work/1637809793%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211125110921.png"},
        {id: "Line1.Text", value: "Sandy", important: true},
        {id: "Line1.FontColor", value: "#000FFF"},
        {id: "Line1.FontFamily", value: "Arial"},
        {id: "Line2.Text", value: "Job", important: true},
        {id: "Line2.FontColor", value: "#000000"},
        {id: "Line2.FontFamily", value: "Arial"},
        {id: "Line3.Text", value: "Sandy", important: true},
        {id: "Line3.FontColor", value: "#000FFF"},
        {id: "Line3.FontFamily", value: "Arial"},
        {id: "Line4.Text", value: "Job", important: true},
        {id: "Line4.FontColor", value: "#000000"},
        {id: "Line4.FontFamily", value: "Arial"},
        {id: "Line5.Text", value: "Sandy", important: true},
        {id: "Line5.FontColor", value: "#000FFF"},
        {id: "Line5.FontFamily", value: "Arial"},
        {id: "Line6.Text", value: "Job", important: true},
        {id: "Line6.FontColor", value: "#000000"},
        {id: "Line6.FontFamily", value: "Arial"},
      ],
      methodOptions: [
        {id: "=", name: "等于"},
        {id: ">", name: "大于"},
        {id: ">=", name: "大于等于"},
        {id: "<", name: "小于"},
        {id: "<=", name: "小于等于"},
        {id: "length", name: "长度"},
        {id: "contains", name: "包括"},
        {id: "contains_one", name: "包括多个中的一个，空格分隔"},
        {id: "all_contains", name: "全部包括，空格分隔"},
        {id: "prefix", name: "前缀(无视大小写)"},
        {id: "suffix", name: "后缀(无视大小写)"},
        {id: "case_prefix", name: "前缀"},
        {id: "case_suffix", name: "后缀"},
      ],

      mzpt: {
        elem_ids: [],
        left_ids: [],
        mid_ids: [],
        right_ids: [],
      },

      customizeOptions: [],
      fontOptions: [],
      mzptElemOptions: [],
      mzptElemDetailOptions: new Map(),
      mzptColorSeriesOptions: [],
      mzptStandOptions: [],
      printMaterialOptions: [],

      IT_FILL: 0, // 填满
      IT_AUTO: 1, // 自动

      dlgPreview: {
        id: undefined,
        uv_svg: undefined,
        cut_svg: undefined,
        width: undefined,
        height: undefined,
        visible: false,
      },

      genSvgVisible: false,
      genSvgItem: null,

      preview_map: new Map(),

      buttonAreaLocSaveKey: 'CUSTOMIZE-ButtonAreaLocation',

      lastNotify: null,

      batchUpdateTextForm: {
        select_text: [],
        font_family: "",
        font_size: 300,
      },

      basicZoom: 1
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    order_id() {
      if (!this.order_ids) {
        return ""
      }
      if (this.order_index >= this.order_ids.length) {
        return ""
      }

      return this.order_ids[this.order_index]
    },
    hasCutSvg() {
      let sfc = this.selectSurface
      if (!sfc) {
        return false
      }

      for (const item of sfc.items || []) {
        if (item.cutting) {
          return true
        }
      }
      return false
    },
    selectSurface() {
      return this.surface_list.find((item) => {
        return item.id === this.selectSurfaceId
      })
    },
    lastSelectSurface() {
      return this.surface_list.find((item) => {
        return item.id === this.lastSelectSurfaceId
      })
    },
    title() {
      if (this.isCreate) {
        return this.model.name ? `模板-${this.model.name}` : '模板'
      } else {
        return `订单-${this.order_id}`
      }
    },
    isCreate() {
      return !this.isOrder
    },
    isOrder() {
      return this.order_id
    },
    maxId() {
      let id = 0
      this.surface_list.forEach((s) => {
        if (s.from_id) {
          return // 来源于其他的，不算
        }
        id = Math.max(id, Number(s.id))
      })
      return id
    },
    newItemId() {
      let id = 0
      this.surface_list.forEach((s) => {
        s.items.forEach(item => {
          id = Math.max(id, item.id)
        })
      })
      return id + 1
    },
    baseImage() {
      if (!this.selectSurface || !this.selectSurface.base_image_id) {
        return
      }
      return this.imageOptions.find((item) => {
        return item.id === this.selectSurface.base_image_id
      })
    },
    curCvs() {
      return this.cvs_list[this.cvs_index]
    },
    selectSurfacePrintMaterial() {
      let sfc = this.selectSurface
      if (!sfc) {
        return undefined;
      }

      let op = (this.printMaterialOptions || []).find((item) => {return item.id === sfc.print_material})
      if (!op) {
        return undefined
      }

      return op
    },
    conditions() {
      let list = []
      for (const sfc of this.surface_list) {
        list = list.concat(...sfc.width_conditions)
            .concat(...sfc.height_conditions)
            .concat(...sfc.base_image_conditions)
            .concat(...sfc.print_material_conditions)
            .concat(...sfc.export_scale_conditions)

        for (let i = 0; i < sfc.items.length; i++) {
          let item = sfc.items[i]
          if (item.text) {
            list = list.concat(...item.text.text_conditions)
                .concat(...item.text.font_family_conditions)
                .concat(...item.text.font_color_conditions)
          } else if (item.image && item.image.url_conditions) {
            list = list.concat(...item.image.url_conditions)
          } else if (item.mzpt) {
            list = list.concat(...item.mzpt.stand_conditions)
            for (const line of item.mzpt.lines) {
              list = list.concat(...line.color_series_conditions)
                  .concat(...line.name_conditions)
            }
          } else if (item.info) {
            list = list.concat(...item.info.value_conditions)
          }
        }
      }
      return list
    },
    notUsedKeys() {
      let mp = new Map()
      this.conditions.forEach((item) => {
        if (item.key) {
          mp.set(item.key, item.value)
        }
      })

      let list = []
      for (const d of this.dataList) {
        if (!d.important) {
          continue
        }

        if (mp.has(d.id)) {
          continue
        }

        list.push(d.id)
      }

      return list
    },
  },
  filters: {},
  mounted() {
  },
  watch: {},
  methods: {
    handleBatchUpdateText(actionType) {
      if(actionType === 'clear'){
        this.selectSurface.items.forEach((item) => {
          if(item.text && this.batchUpdateTextForm.select_text.includes(item.id)) {
            item.text.text = ""
            this.render(item)
          }
        })
      } else if(actionType === 'clearAll'){
        if(this.selectSurface) {
          this.selectSurface.items.forEach((item) => {
            if(item.text){
              item.text.text = ""
              this.render(item)
            }
          })
        }
      } else if(actionType === 'firstLetterUpper') {
        this.selectSurface.items.forEach((item) => {
          if(item.text && this.batchUpdateTextForm.select_text.includes(item.id)) {
            item.text.text = item.text.text.charAt(0).toUpperCase() + item.text.text.slice(1).toLowerCase();
            this.render(item)
          }
        })
      } else if(actionType === 'firstLetterUpperAll') {
        if(this.selectSurface) {
          this.selectSurface.items.forEach((item) => {
            if(item.text){
              item.text.text = item.text.text.charAt(0).toUpperCase() + item.text.text.slice(1).toLowerCase();
              this.render(item)
            }
          })
        }
      } else if(actionType === 'fontFamily'){
        this.selectSurface.items.forEach((item) => {
          if(item.text && this.batchUpdateTextForm.select_text.includes(item.id)) {
            item.text.font_family = this.batchUpdateTextForm.font_family;
            this.fontFamilyChanged(item);
          }
        })
      } else if(actionType === 'fontSize'){
        this.selectSurface.items.forEach((item) => {
          if(item.text && this.batchUpdateTextForm.select_text.includes(item.id)) {
            item.text.font_size = this.batchUpdateTextForm.font_size;
            this.render(item)
          }
        })
      }
    },
    recordButtonAreaLoc(){
      if(this.$refs.buttonArea){
        const left = this.$refs.buttonArea.offsetLeft;
        const top = this.$refs.buttonArea.offsetTop;
        storage.set(this.buttonAreaLocSaveKey, { left, top });
      }
    },
    useButtonAreaLoc(){
      if(this.$refs.buttonArea && storage.has(this.buttonAreaLocSaveKey)){
        const { left, top } = storage.get(this.buttonAreaLocSaveKey);
        this.$refs.buttonArea.style.left = `${ left }px`;
        this.$refs.buttonArea.style.top = `${ top }px`;
      }
    },
    handleBeforeClose() {
      this.$emit('close', false)

      if(this.lastNotify) this.lastNotify.close();

      setTimeout(() => {
        this.surface_list.forEach((sfc) => {
          this.removeSurface([sfc.id])
        })
        this.cvsFilter((c) => {
          c.cvs.getElement().parentElement.remove()
        })
        this.cvs_list = []
        this.lastSelectSurfaceId = undefined
        this.selectSurfaceId = undefined

        this.cvs_index = 0
      }, 10)

      this.recordButtonAreaLoc();
    },
    async onOpened() {
      this.fullscreenLoading = false
      this.lastSelectSurfaceId = undefined
      this.selectSurfaceId = undefined
      this.surface_list = []
      this.preview_map = new Map()

      this.cvs_index = 0
      this.order_index = 0
      this.select_customize_id = undefined
      this.model.name = ""

      if (this.customizeOptions.length <= 0) {
        await this.syncCustomizeList()
      }
      if (this.fontOptions.length <= 0) {
        await this.syncFontList()
      }
      if (this.imageOptions.length <= 0) {
        await this.syncImageList()
      }
      if (this.mzptStandOptions.length <= 0) {
        await this.syncMzptStands()
      }
      await this.syncPrintMaterial()

      this.showImageOptions = []

      this.calcMaxWh()
      setTimeout(this.calcMaxWh, 100)

      fabric.Object.prototype.objectCaching = false;

      this.cvs_list = []
      for (let i = 0; i < 3; i++) {
        let cvs = this.createFabricCanvas(i)
        if (i === 0) {
          cvs.on('object:modified', (e) => {
            this.objChanged(e.target)
          });
          cvs.on('selection:updated', this.objSelectionChanged);
          cvs.on('selection:created', this.objSelectionChanged);
          cvs.on('mouse:wheel', function(opt) {
            var delta = opt.e.deltaY;
            var zoom = cvs.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            this.zoomToPoint(opt.pointer, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();
          });
          cvs.on('mouse:down', function(opt) {
            var evt = opt.e;
            if (evt.altKey === true) {
              this.isDragging = true;
              this.selection = false;
              this.lastPosX = evt.clientX;
              this.lastPosY = evt.clientY;
            }
          });
          cvs.on('mouse:move', function(opt) {
            if (this.isDragging) {
              var e = opt.e;
              var vpt = this.viewportTransform;
              vpt[4] += e.clientX - this.lastPosX;
              vpt[5] += e.clientY - this.lastPosY;
              this.requestRenderAll();
              this.lastPosX = e.clientX;
              this.lastPosY = e.clientY;
            }
          });
          cvs.on('mouse:up', function() {
            this.isDragging = false;
            this.selection = true;
          });
        }

        this.cvs_list.push({
          id: i,
          index: -i,
          cvs: cvs,
          objMap: new Map(),
        })
      }

      this.reload()
      this.useButtonAreaLoc();
    },
    async reload() {
      for (const sfc of this.surface_list) {
        await this.removeSurface([sfc.id])
      }
      this.lastSelectSurfaceId = undefined
      this.selectSurfaceId = undefined
      this.preview_map = new Map()
      this.isIniting = false

      this.cvs_index = 0

      let resp
      if (this.id || this.copy_id) {
        resp = await customizeLoad({id: this.id || this.copy_id})
      } else if (this.order_id) {
        resp = await customizeOrderLoad({id: this.order_id})
      }
      if (resp) {
        if (resp.code) {
          return
        }
        this.model.name = resp.data.name
        this.select_customize_id = resp.data.customize_id
        if (resp.data.data_list) {
          this.dataList = resp.data.data_list
        }

        if (resp.data.surfaces) {
          this.surface_list = this.parseSurfaces(resp.data.surfaces)

          if (resp.data.not_init) {
            this.refreshAll(this.surface_list)
          }
        }
      }

      if (this.surface_list.length <= 0) {
        await this.addSurface()
      } else {
        await this.changeSurface(this.surface_list[0].id)
      }

      this.switchCvs()

      let text = this.meta("Text")
      if (text) {
        let texts = text.split("\n")
        if(this.lastNotify) this.lastNotify.close();
        this.lastNotify = this.$notify({
          title: `当前文本内容: ${texts.length}行`,
          dangerouslyUseHTMLString: true,
          message: texts.map((item) => {return `<div>${item}</div>`}).join("\n"),
          duration: 0,
          position: 'top-left',
          type: 'warning',
          customClass: 'text-notification'
        });
      }
    },
    loadNextOrder() {
      this.order_index++
      if (this.order_id) {
        this.reload()
        return
      }
      this.$message("已是最后一份订单，当前编辑已完成");
      this.handleBeforeClose()
      this.$emit("suc")
    },
    edit(item) {
      this.editTab.id = item.id
      this.editTab.name = item.name
    },
    editSubmit(item) {
      item.name = this.editTab.name
      this.editTab.id = undefined
      this.editTab.name = undefined
    },
    uuid() {
      return this.uuidGen++
    },
    calcMaxWh() {
      let elem = document.getElementById("canvas-wrap")
      if (!elem) {
        return
      }
      this.maxWidth = Math.min(elem.offsetWidth, 800)
      this.maxHeight = Math.min(elem.offsetHeight, 1000)
    },
    disabledUv(item) {
      return item.mzpt !== undefined || item.info !== undefined
    },
    disabledCutting(item) {
      return item.image !== undefined || item.mzpt !== undefined || item.info !== undefined
    },
    removeSpace(item) {
      item.text.text = item.text.text.trim()
      this.render(item)
    },
    firstUp(item) {
      let newStr = item.text.text.split(" ");
      for (let i = 0; i < newStr.length; i++) {
        newStr[i] = newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
      }
      item.text.text = newStr.join(" ")
      this.render(item)
    },
    allUp(item) {
      item.text.text = item.text.text.toUpperCase()
      this.render(item)
    },
    verticalText(item) {
      if(item.text.text.includes("\n")){
        item.text.text = item.text.text.replaceAll("\n", "");
        item.text.line = 1;
      } else {
        let line = item.text.text.length;
        item.text.text = item.text.text.replaceAll("", "\n").trim();
        item.text.line = line;  
      }
      this.render(item)
    },
    meta(id) {
      let meta = this.dataList.find((item) => item.id === id)
      if (!meta) {
        return
      }
      return meta.value
    },
    changeTextAligh(item, ta) {
      item.text.text_align = ta
      this.render(item)
    },
    createFabricCanvas(index) {
      let canvasElement = document.createElement('canvas');
      canvasElement.style.border = '1px black solid';

      let parentElement = document.getElementById('canvas-wrap');
      parentElement.appendChild(canvasElement);

      let interactive = index === 0

      let cvs = new fabric.Canvas(canvasElement, {
        width: this.maxWidth,
        height: this.maxHeight,
        interactive
      });
      cvs.setZoom(1)

      fabric.Object.prototype.borderColor = 'orange';
      fabric.Object.prototype.cornerStyle = 'circle';
      fabric.Object.prototype.cornerColor = 'white';
      fabric.Object.prototype.cornerSize = 10;
      fabric.Object.prototype.transparentCorners = false;
      fabric.Object.prototype.cornerStrokeColor = 'gray';

      cvs.getElement().parentElement.style.display = 'none';

      return cvs;
    },
    async removeSurface(removeIds) {
      if (!removeIds.length) {
        return
      }
      let realRemoveIds = this.surface_list.filter((item) => {
        return removeIds.indexOf(item.id) >= 0 || removeIds.indexOf(item.from_id) >= 0
      }).map((item) => { return item.id })
      let surfaceList = this.surface_list.filter((item) => {
        return realRemoveIds.indexOf(item.id) < 0
      })
      if (realRemoveIds.indexOf(this.selectSurfaceId) >= 0) {
        if (surfaceList.length > 0) {
          await this.changeSurface(surfaceList[0].id)
        } else {
          await this.changeSurface(undefined)
        }
      }
      this.surface_list = surfaceList
    },
    clickSurface(event) {
      this.changeSurface(event.name)
    },
    cvsFilter(f) {
      this.cvs_list.forEach((c) => {
        f(c)
      })
    },
    async changeSurface(id) {
      if (id === this.lastSelectSurfaceId) {
        return // 不更新
      }

      if (this.lastSelectSurface) {
        this.lastSelectSurface.items.forEach((item) => {
          this.removeExist(item.id)
        })
        this.textProblemIds = []
        this.loadProblemIds = []
        this.cvsFilter((c) => {
          c.cvs.setBackgroundImage(undefined);
          c.cvs.requestRenderAll()
        })
      }
      this.selectSurfaceId = id
      this.lastSelectSurfaceId = id
      this.updateAllWh()
      if (this.selectSurface) {
        this.isIniting = true
        for (let i = 0; i < this.selectSurface.items.length; i++) {
          let item = this.selectSurface.items[i]
          await this.render(item)
        }
        this.isIniting = false

        setTimeout(() => {
          if (!this.selectSurface || !this.selectSurface.items || this.selectSurface.items.length <= 0) {
            return
          }

          for (let i = 0; i < this.selectSurface.items.length; i++) {
            let item = this.selectSurface.items[i]
            if (this.problem(item.id) > 0) {
              this.show(item)
              break
            }
          }
        }, 500)
      }
    },
    async addSurface() {
      let newSurface = this.newSurface()
      this.surface_list.push(newSurface)
      this.refreshAll([newSurface])
      await this.changeSurface(newSurface.id)
    },
    newSurface() {
      return {
        id: String(this.maxId + 1),
        name: "默认",
        print_material: undefined,
        print_material_conditions: [],
        base_image_id: undefined,
        base_image_conditions: [],
        items: [],
        width: 200,
        width_conditions: [],
        height: 60,
        height_conditions: [],
        export_scale: undefined,
        export_scale_conditions: [],
        count: 1,
        editable: true,
        from_id: undefined,
      }
    },
    async handleUpdateWh() {
      if (!this.selectSurface) {
        return
      }

      this.updateAllWh()

      if (this.selectSurface) {
        for (const item of this.selectSurface.items) {
          if (item.mzpt) {
            await this.render(item) // 更新了宽高，可能就要改名字拼图
          }
        }
      }
    },
    updateAllWh() {
      if (!this.selectSurface) {
        return
      }

      this.cvsFilter((c) => {
        this.updateWh(c, this.selectSurface.width * MM_TO_PX_RATIO, this.selectSurface.height * MM_TO_PX_RATIO)
      })
      this.notifyBaseImageChanged()
    },
    updateWh(c, width, height) {
      if (c.w === width && c.h === height) {
        return
      }
      c.w = width
      c.h = height

      const r1 = width / height;
      const r2 = this.maxWidth / this.maxHeight;

      let zoom = 1
      if (r1 < r2) {
        zoom = this.maxHeight / height
      } else if (r1 > r2) {
        // 太宽了
        zoom = this.maxWidth / width
      }
      // zoom = zoom * canvas.getZoom();
      c.cvs.setWidth(width * zoom);
      c.cvs.setHeight(height * zoom);
      this.basicZoom = zoom;
      c.cvs.setZoom(zoom);
    },
    switchCvs() {
      this.cvsFilter((c) => {
        let container = c.cvs.getElement().parentElement
        let parent = container.parentElement
        parent.removeChild(container)

        if (this.cvs_index === c.id) {
          container.style.display = ""
        } else {
          container.style.display = "none"
        }
        parent.appendChild(container)
      })

      this.changeSurface(this.selectSurfaceId)
    },
    async addItem(item) {
      item.id = this.newItemId
      item.level = undefined
      item.show = false
      if (!item.condition) {
        item.condition = {has: false, key: "", method: "", value: ""}
      }
      this.selectSurface.items.push(item);
      // 触发
      await this.render(item)
      if (!item.show) {
        this.show(item)
      }
    },
    show(item) {
      if (this.isIniting) {
        return
      }
      if (item.show) {
        item.show = false
        return
      }

      this.selectSurface.items.forEach((v) => {
        if (v !== item) {
          v.show = false
        }
      })

      item.show = true

      if (!item.unselectable) {
        for (const obj of this.curCvs.cvs.getObjects()) {
          if (this.curCvs.objMap.get(obj.id) === item.id) {
            this.curCvs.cvs.setActiveObject(obj)
          }
        }
        this.curCvs.cvs.requestRenderAll()
      }
    },
    move(newItem, oldIndex, newIndex) {
      let oldItem = this.selectSurface.items[newIndex]
      this.$set(this.selectSurface.items, newIndex, newItem)
      this.$set(this.selectSurface.items, oldIndex, oldItem)
    },
    copy(item) {
      item.show = false

      let newItem =JSON.parse(JSON.stringify(item))
      if (newItem.text) {
        newItem.text.text_conditions = []
        newItem.text.font_family_conditions = []
        newItem.text.font_color_conditions = []
      } else if (newItem.image) {
        newItem.image.url_conditions = []
      } else if (newItem.info) {
        newItem.info.value_conditions = []
      }
      this.addItem(newItem)
    },
    remove(item) {
      this.selectSurface.items = this.selectSurface.items.filter((v) => v !== item)
      this.removeLoadProblems(item.id)
      this.removeTextProblems(item.id)
      this.removeExist(item.id)
      if (item.mzpt) {
        this.deleteMzptSurface(this.selectSurface, item)
      }
    },
    removeExist(id, exceptCvs = undefined) {
      this.cvsFilter((c) => {
        if (c.cvs === exceptCvs) {
          return
        }
        c.objMap.forEach((value, key) => {
          if (value === id) {
            this.deleteObj(c.cvs, key)
            c.objMap.delete(key)
          }
        })
      })
    },
    deleteObj(cvs, id) {
      cvs.getObjects().forEach((obj) => {
        if (obj.id === id) {
          cvs.remove(obj)
          obj.dispose()
        }
      })
    },
    beforeUpload() {
      this.fullscreenLoading = true
      return true
    },
    handleBaseImageSuccess(res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      if (res.data) {
        this.$message.error(res.data.join("\n"));
      } else {
        this.$message("上传成功!");
        this.syncImageList()
      }
    },
    searchImageList(query) {
      let array = []
      if (query) {
        array = this.imageOptions.filter((item) => {
          return item.name.toLowerCase().indexOf(query.toLocaleString().toLowerCase()) >= 0
        })
      }
      this.showImageOptions = array
    },
    notifyBaseImageChanged() {
      if (!this.baseImage) {
        // 没有底图或者是切割图的话
        this.cvsFilter((c) => {
          if (c.id === 2) {
            return
          }
          c.cvs.setBackgroundImage(undefined);
          c.cvs.requestRenderAll()
        })
        return
      }

      if (this.showImageOptions.indexOf(this.baseImage) < 0) {
        this.showImageOptions.push(this.baseImage)
      }

      this.cvsFilter((c) => {
        if (c.id === 2) {
          return
        }

        this.addLoadProblems(c.index)
        fabric.Image.fromURL(
            this.baseImage.thumbnail_url + `?imageView2/2/w/${Math.floor(this.maxWidth)}/q/70/format/webp`,
            (img) => {
              img.top = 0
              img.left = 0
              img.scaleX = this.selectSurface.width * MM_TO_PX_RATIO / img.width
              img.scaleY = this.selectSurface.height * MM_TO_PX_RATIO / img.height
              c.cvs.setBackgroundImage(img);
              c.cvs.requestRenderAll()
              this.removeLoadProblems(c.index)
            }
        );
      })
    },
    customizeIdChanged() {
      if (this.isCreate) {
        this.changeCustomizeId()
        return
      }

      this.$confirm("确认是否变更定制配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(this.changeCustomizeId)
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
    },
    async changeCustomizeId() {
      if (!this.select_customize_id) {
        return
      }

      let resp = await customizeLoad({id: this.select_customize_id})
      if (resp.code) {
        return
      }

      if (this.isCreate) {
        this.select_customize_id = undefined
      } else {
        this.model.name = resp.data.name
      }

      // 清空页面
      await this.removeSurface(this.surface_list.map((item) => {return item.id}))

      if (resp.data.surfaces) {
        this.surface_list = this.parseSurfaces(resp.data.surfaces)
        // 刷新数据
      } else {
        this.surface_list = []
      }
      if (this.surface_list.length <= 0) {
        await this.addSurface()
      } else {
        await this.changeSurface(this.surface_list[0].id)
      }

      this.refreshAll(this.surface_list)
      this.switchCvs()
    },
    parseSurfaces(json) {
      let sl = JSON.parse(json)
      if (!sl) {
        return []
      }

      sl.forEach((s) => {
        if (!s.items) {
          s.items = []
        }
      })
      return sl
    },
    async syncCustomizeList() {
      let resp = await customizeListWithIdName()
      if (resp.code) {
        return
      }
      this.customizeOptions = resp.data || []
    },
    async syncFontList() {
      let resp = await fontList()
      if (resp.code) {
        return
      }
      this.fontOptions = resp.data || []
    },
    async syncImageList() {
      let resp = await imageList()
      if (resp.code) {
        return
      }
      this.imageOptions = resp.data || []
    },
    async syncPrintMaterial() {
      let resp = await printMaterialList()
      if (resp.code) {
        return
      }
      this.printMaterialOptions = (resp.data || [])
    },
    async syncMzptElemList() {
      let resp = await mzptElemList()
      if (resp.code) {
        return
      }
      this.mzptElemOptions = resp.data || []
    },
    async syncMzptColorSeries() {
      let resp = await mzptColorSeriesList()
      if (resp.code) {
        return
      }
      this.mzptColorSeriesOptions = resp.data || []
    },
    async syncMzptStands() {
      let resp = await mzptStandList()
      if (resp.code) {
        return
      }
      this.mzptStandOptions = resp.data || []
    },
    async syncMzptDetail(ids) {
      let notFoundIds = ids.filter((id) => {
        return !this.mzptElemDetailOptions.has(id)
      })
      if (!notFoundIds.length) {
        return
      }

      let resp = await mzptElemLoadList({ids: notFoundIds})
      if (resp.code) {
        return
      }

      for (const e of resp.data) {
        this.mzptElemDetailOptions.set(e.id, e)
      }
    },
    async mzptElemDetails(ids) {
      await this.syncMzptDetail(ids)

      let elems = []
      for (const id of ids) {
        elems.push(this.mzptElemDetailOptions.get(id))
      }
      return elems
    },
    containsMzptElem(item, elemId) {
      return item.mzpt.elems.find((ele) => {
        return ele.id === elemId
      })
    },
    async mzptELemsChanged(item) {
      let elems = await this.mzptElemDetails(this.mzpt.elem_ids)
      for (const elem of elems) {
        item.mzpt.elems.push({
          id: elem.id,
          name: elem.letter || elem.name,
        })
      }
      this.mzpt.elem_ids = []
    },
    async mzptItemChanged(item, line, key, key2) {
      let elems = await this.mzptElemDetails(this.mzpt[key2])
      for (const elem of elems) {
        line[key].push(elem.id)
      }
      this.mzpt[key2] = []
      await this.render(item)
    },
    font(name) {
      return this.fontOptions.find((item) => {
        return item.name === name
      })
    },
    checkFont(name) {
      let values = document.fonts.values();
      let isHave = false;
      let item = values.next();
      while (!item.done && !isHave) {
        let fontFace = item.value;
        if (fontFace.family === name) {
          isHave = true
        }
        item = values.next();
      }
      return isHave;
    },
    fontFamilyChanged(item) {
      if (!item.text.font_family) {
        this.render(item)
        return
      }

      let font = this.font(item.text.font_family)
      if (!font) {
        this.$message.error(`未加载到字体: ${item.text.font_family}`)
        return
      }
      this.addLoadProblems(item.id)
      this.loadAndUseFont(font, () => {
        this.render(item)
        this.removeLoadProblems(item.id)
      })
    },
    loadAndUseFont(font, callback) {
      if (this.checkFont(font.name)) {
        if (callback) {
          callback()
        }
        return;
      }

      let face = new FontFace(font.name, `url('${font.url}')`);
      face.load().then((loaded_face) => {
        document.fonts.add(loaded_face);
        if (callback) {
          callback()
        }
      }).catch((error) => {
        this.$message.error("字体加载失败: " + error);
      });
    },
    mzptElem(id) {
      return this.mzptElemOptions.find((item) => {
        return item.id === id
      })
    },
    removeItemMzptElem(item, elem) {
      for (const line of item.mzpt.lines) {
        if (line.left_elems.indexOf(elem.id) >= 0) {
          this.$message("元素已被使用，请先删除行中使用的数据，再删除当前元素")
          return
        }
        if (line.mid_elems.indexOf(elem.id) >= 0) {
          this.$message("元素已被使用，请先删除行中使用的数据，再删除当前元素")
          return
        }
        if (line.right_elems.indexOf(elem.id) >= 0) {
          this.$message("元素已被使用，请先删除行中使用的数据，再删除当前元素")
          return
        }
      }
      item.mzpt.elems = item.mzpt.elems.filter((v) => {
        return v.id !== elem.id
      })
    },
    removeMzptElem(item, line, key, index) {
      line[key].splice(index, 1)
      this.render(item)
    },
    addNewLine(item) {
      item.mzpt.lines.push({
        top: this.selectSurface.height / 2,
        color_series_id: undefined,
        color_series_conditions: [],
        name: "",
        name_conditions: [],
        left_elems: [], // 左侧元素
        mid_elems: [], // 中间元素
        right_elems: [], // 右侧元素
        left_gap: 20, // 左侧元素跟左边的间隔
        right_gap: 20, // 右侧元素跟右边的间隔
        elem_gap: 12, // 元素间隔
      })

      this.render(item)
    },
    deleteLine(item, line) {
      item.mzpt.lines = item.mzpt.lines.filter((item) => {
        return item !== line
      })
      this.render(item)
    },
    changeAutoScaleWidth(item) {
      if (!item.mzpt.auto_scale_width) {
        return // 不要动
      }
      item.mzpt.lines.forEach((line) => {
        line.elem_gap = 12
      })
      this.render(item)
    },
    setMzptElemIdsByName(item, line) {
      if (!line.name) {
        return
      }

      let names = []
      if (line.name.indexOf(" ") >= 0) {
        names = line.name.split(" ")
      } else {
        names = [...line.name]
      }

      let mid_elems = []
      for (const n of names) {
        let elem = item.mzpt.elems.find((item) => {
          return item.name.toUpperCase() === n.toUpperCase()
        })
        if (!elem) {
          this.$message.error(`元素: ${n} 没找到`)
          return
        }

        mid_elems.push(elem.id)
      }
      line.mid_elems = mid_elems
      this.render(item)
    },
    changeTextPathSide(item) {
      if (item.text.path_side === "right") {
        item.text.path_side = "left"
      } else {
        item.text.path_side = "right"
      }
      this.render(item)
    },
    updateUnselectable(item) {
      this.render(item)
      this.cvsFilter((c) => {
        c.cvs.discardActiveObject()
        c.cvs.renderAll()
      })
    },
    async render(item, exceptCvs = undefined) {
      this.removeExist(item.id, exceptCvs)

      if (!this.isVisible(item.condition)) {
        if (item.mzpt) {
          this.deleteMzptSurface(this.selectSurface, item)
        }
        return
      }

      this.cvsFilter(async (c) => {
        if (c.cvs === exceptCvs) {
          return
        }

        switch (c.index) {
          case 0:
            if (item.uv) {
              await this.renderObjByCfg(c, true, item)
            } else if (item.cutting) {
              await this.renderObjByCfg(c, false, item)
            }
            break
          case -1:
            if (item.uv) {
              await this.renderObjByCfg(c, true, item)
            }
            break
          case -2:
            if (item.cutting) {
              await this.renderObjByCfg(c, false, item)
            }
            break
        }
      })

      if (item.mzpt) {
        await this.triggerMzptSurfaces(this.selectSurface)
      }

      this.deletePreview(this.selectSurface.id)
    },
    async createTemplate() {
      for (const item of this.surface_list) {
        if (!item.print_material) return this.$message.error(`存在一个面没有选择打印材料`);
      }

      let resp = await customizeUpdate({id: this.id || this.select_customize_id, name: this.model.name, surfaces: JSON.stringify(this.surface_list)})
      if (resp.code) {
        return
      }

      this.$message("成功")

      if (this.isOrder) {
        return
      }

      this.handleBeforeClose()
      this.$emit("suc")
    },
    isVisible(condition) {
      if (!condition.has) {
        return true
      }
      if (!condition.key) {
        return true
      }
      if (!condition.method) {
        return true
      }
      if (!condition.value) {
        return true
      }

      let v = this.dataList.find((d) => {
        return d.id === condition.key
      })
      if (!v) {
        return false
      }
      switch (condition.method) {
        case "=":
          return String(v.value) === condition.value
        case ">":
          return Number(v.value) > Number(condition.value)
        case ">=":
          return Number(v.value) >= Number(condition.value)
        case "<":
          return Number(v.value) < Number(condition.value)
        case "<=":
          return Number(v.value) <= Number(condition.value)
        case "length":
          return String(v.value).length === Number(condition.value)
        case "contains":
          return String(v.value).indexOf(condition.value) >= 0
        case "contains_one":
          for (const c of condition.value.split(" ")) {
            if (String(v.value).indexOf(c) >= 0) {
              return true
            }
          }
          return false
        case "all_contains":
          for (const c of condition.value.split(" ")) {
            if (String(v.value).indexOf(c) < 0) {
              return false
            }
          }
          return true
        case "prefix":
          return String(v.value).toLowerCase().startsWith(condition.value.toLowerCase())
        case "suffix":
          return String(v.value).toLowerCase().endsWith(condition.value.toLowerCase())
        case "case_prefix":
          return String(v.value).startsWith(condition.value)
        case "case_suffix":
          return String(v.value).endsWith(condition.value)
      }

      return false
    },
    setColor(obj, color) {
      let array = (color || "").split(";").filter((item) => {
        return item !== ""
      })
      if (array.length <= 1) {
        obj.set("fill", color)
        return
      }

      let colorIndex = 0
      for (let i = 0; i < obj.text.length; i++) {
        let t = obj.text[i]
        if (t === " ") {
          continue
        }

        if (array.length <= 0) {
          obj.setSelectionStyles({fill: "transparent"}, i, i + 1);
        } else {
          obj.setSelectionStyles({fill: array[colorIndex % array.length]}, i, i + 1);
        }

        colorIndex++
      }
    },
    adjust(is_center_x) {
      let list = this.curCvs.cvs.getActiveObjects()
      if (!list || list.length <= 0) {
        this.$message.error("未选中对象")
        return
      }

      for (const v of list) {
        if (is_center_x) {
          this.curCvs.cvs.viewportCenterObjectH(v)
        } else {
          this.curCvs.cvs.viewportCenterObjectV(v)
        }

        this.objChanged(v)
      }
    },
    restoreCanvasState() {
      this.curCvs.cvs.absolutePan({x: 0, y: 0});
      this.curCvs.cvs.setZoom(this.basicZoom);
    },
    handleRotateCanvas() {
      const canvasContainer = document.querySelector(".canvas-container:not([style*='display:none']):not([style*='display: none'])")
      const { offsetWidth: cw, offsetHeight: ch } = canvasContainer;
      
      const match = canvasContainer.style.transform.match(/(\d+(\.\d+)?)deg/);
      let currentRotation = match ? parseFloat(match[1]) : 0;
      let currentScale = ch > cw ? cw / ch : 1;

      let transform;
      switch(currentRotation) {
        case 0: transform = `rotate(90deg) translateX(${(cw - ch)/2}px) scale(${currentScale})`; break;
        case 90: transform = `rotate(180deg) scale(1)`; break;
        case 180: transform = `rotate(270deg) translateX(${(ch - cw)/2}px) scale(${currentScale})`; break;
        case 270: transform = `rotate(0deg) scale(1)`; break;
      }

      canvasContainer.style.transform = transform;
    },
    updateConditions(v, key, value) {
      v[key] = value
    },
    refreshAll(list) {
      for (const sfc of (list || [])) {
        this.refresh(sfc, 'width', sfc.width_conditions)
        this.refresh(sfc, 'height', sfc.height_conditions)
        this.refresh(sfc, 'base_image_id', sfc.base_image_conditions)
        this.refresh(sfc, 'print_material', sfc.print_material_conditions)
        this.refresh(sfc, 'export_scale', sfc.export_scale_conditions)

        if (sfc.items && sfc.items.length > 0) {
          for (let i = 0; i < sfc.items.length; i++) {
            let item = sfc.items[i]
            if (item.text) {
              this.refresh(item.text, 'text', item.text.text_conditions)
              this.refresh(item.text, 'font_family', item.text.font_family_conditions)
              this.refresh(item.text, 'font_color', item.text.font_color_conditions)
            } else if (item.image) {
              this.refresh(item.image, 'url', item.image.url_conditions)
            } else if (item.mzpt) {
              this.refresh(item.mzpt, 'stand_id', item.mzpt.stand_conditions)
              for (const line of (item.mzpt.lines || [])) {
                this.refresh(line, 'color_series_id', line.color_series_conditions)
                this.refresh(line, 'name', line.name_conditions)
              }
            } else if (item.info) {
              this.refresh(item.info, 'value', item.info.value_conditions)
            }
          }
        }
      }
    },
    refresh(v, key, list, f = null) {
      if (!list || list.length <= 0) {
        return
      }

      for (const c of list) {
        if (this.isVisible(c.condition)) {
          if (c.key) {
            let d = this.dataList.find((d) => {
              return d.id === c.key
            })
            if (!d) {
              this.$message.error(`没找到对应的Key: ${c.key}!`)
              return
            }
            v[key] = d.value
          } else {
            v[key] = c.value
          }
          if (f) {
            f()
          }
          return
        }
      }
      this.$message.error(`没有匹配到对应的数据: ${key}!`)
    },
    addData() {
      this.dataList.push({
        id: undefined,
        value: undefined,
      })
    },
    parseLines(text) {
      let lines = text.split('\n')
      for (let i = 0; i < lines.length; i++) {
        let key = `Line${i+1}.Text`
        let value = lines[i]
        let meta = this.dataList.find((item) => item.id === key)
        if (!meta) {
          meta = {id: key, value: value, important: true}
          this.dataList.push(meta)
        }
        meta.value = value
      }
      let meta = this.dataList.find((item) => item.id === "TextLine")
      if (meta) {
        meta.value = lines.length
      }

      this.$confirm('是否重刷所有数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.refreshAll(this.surface_list)

        if (this.selectSurface) {
          this.selectSurface.items.forEach((item) => {
            this.render(item)
          })
        }
      })
    },
    deleteData(d) {
      this.dataList = this.dataList.filter((v) => {
        return v !== d
      })
    },
    async renderObjByCfg(ct, isUv, item) {
      // c.setControlsVisibility({
      //   "ml": true,
      //   "mr": true,
      //   "mb": true,
      //   "mt": true,
      //   "bl": true,
      //   "br": true,
      //   "tl": true,
      //   "tr": true,
      //   "mtr": true
      // })

      if (item.circle) {
        let c = new fabric.Circle({
          top: item.circle.top * MM_TO_PX_RATIO,
          left: item.circle.left * MM_TO_PX_RATIO,
          radius: item.circle.radius * MM_TO_PX_RATIO,
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center',
          angle: item.circle.angle,
          scaleX: item.circle.scaleX,
          scaleY: item.circle.scaleY,
        })

        this.addObjToCanvas(ct, isUv, item, c)
      } else if (item.rect) {
        let c = new fabric.Rect({
          top: item.rect.top * MM_TO_PX_RATIO,
          left: item.rect.left * MM_TO_PX_RATIO,
          width: item.rect.width * MM_TO_PX_RATIO,
          height: item.rect.height * MM_TO_PX_RATIO,
          rx: item.rect.rx * MM_TO_PX_RATIO,
          ry: item.rect.ry * MM_TO_PX_RATIO,
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 1,
          originX: 'center',
          originY: 'center',
          angle: item.rect.angle,
          scaleX: item.rect.scaleX,
          scaleY: item.rect.scaleY,
        })
        if (isUv) {
          if (item.rect.fill) {
            c.fill = item.rect.fill
          }
          c.strokeWidth = 0
        }
        this.addObjToCanvas(ct, isUv, item, c)
      } else if (item.text) {
        if (item.text.font_family && !this.checkFont(item.text.font_family)) {
          // 有设置字体，然后字体没在本地加载到
          this.fontFamilyChanged(item)
          return
        }

        let path = undefined
        if (item.text.path) {
          path = new fabric.Path(item.text.path, {fill: "transparent", stroke: null, strokeWidth: 0});
          path.segmentsInfo = fabric.util.getPathSegmentsInfo(path.path);
        }

        let text = item.text.text || ""
        let c = new fabric.Textbox(text.trim(), {
          left: item.text.left * MM_TO_PX_RATIO,
          top: item.text.top * MM_TO_PX_RATIO,
          width: item.text.width * MM_TO_PX_RATIO,
          fontSize: item.text.font_size,
          textAlign: item.text.text_align,
          fontFamily: item.text.font_family,
          charSpacing: item.text.char_spacing,
          strokeWidth: item.text.stroke_width,
          stroke: item.text.stroke, // 设置描边颜色
          angle: item.text.angle,
          fontWeight: item.text.font_weight,
          path: path,
          lineHeight: 1,
          pathAlign: 'ascender',
          pathSide: item.text.path_side,
          originX: 'center',
          originY: 'center',
          scaleX: item.text.scaleX || 1,
          scaleY: item.text.scaleY || 1,
          // editable: false,
        });

        c.setControlsVisibility({
          "ml": true,
          "mr": true,
          "mb": false,
          "mt": false,

          "bl": false,
          "br": false,
          "tl": false,
          "tr": false,

          "mtr": true
        })

        if (isUv) {
          // 只有是uv，且disable了切割图才行
          if (item.text.shadow_color) {
            c.shadow = new fabric.Shadow({
              color: item.text.shadow_color,
              offsetX: item.text.shadow_offset_x,
              offsetY: item.text.shadow_offset_y,
            })
          }
        } else {
          if (!item.text.stroke_width) {
            c.set("strokeWidth", 1) // 没有描边的时候，要帮他设置好描边
          }
        }
        this.setColor(c, item.text.font_color)

        this.addObjToCanvas(ct, isUv, item, c)
        this.checkTextProblems(item, c)
      } else if (item.image) {
        if (item.image.url && isUv) {
          this.addLoadProblems(item.id)
          fabric.Image.fromURL(item.image.url, img => {
            img.top = item.image.top * MM_TO_PX_RATIO
            img.left = item.image.left * MM_TO_PX_RATIO
            if (item.image.type === this.IT_AUTO) {
              // 看宽高比
              let r1 = item.image.width / item.image.height
              let r2 = img.width / img.height
              if (item.changeType === 'width') item.image.height = item.image.width / r2;
              else if (item.changeType === 'height') item.image.width = item.image.height * r2;
              else {
                if (r2 > r1) {
                  // 图宽高比更大
                  item.image.height = item.image.width / r2
                } else {
                  item.image.width = item.image.height * r2
                }
              }
            }

            img.scaleX = item.image.width * MM_TO_PX_RATIO/ img.width
            img.scaleY = item.image.height * MM_TO_PX_RATIO/ img.height

            img.set("originX", 'center')
            img.set("originY", 'center')

            img.angle = item.image.angle

            if (item.image.clipPath) {
              img.clipPath = new fabric.Path(item.image.clipPath, {
                absolutePositioned: item.image.clipPathAbsolutePosition,
                originX: 'left',
                originY: 'top',
                scaleX: item.image.clipPathScaleX,
                scaleY: item.image.clipPathScaleY,
                fill: "transparent",
                stroke: null,
                strokeWidth: 0,
              });
            }

            this.addObjToCanvas(ct, isUv, item, img)
            this.removeLoadProblems(item.id)
          });
        }
      } else if (item.svg) {
        if (item.svg.url) {
          this.addLoadProblems(item.id)
          fabric.loadSVGFromURL(item.svg.url, (objects, options) => {
            let svg = fabric.util.groupSVGElements(objects, options);
            svg.left = item.svg.left * MM_TO_PX_RATIO
            svg.top = item.svg.top * MM_TO_PX_RATIO
            if (item.svg.scaleToMax) {
              item.svg.scaleX = this.selectSurface.width * MM_TO_PX_RATIO / svg.width
              item.svg.scaleY = this.selectSurface.height * MM_TO_PX_RATIO / svg.height
            }
            svg.scaleX = item.svg.scaleX
            svg.scaleY = item.svg.scaleY
            svg.angle = item.svg.angle
            if (isUv) {
              if (item.svg.fill) {
                svg.fill = item.svg.fill
              }
            } else {
              svg.set('stroke', 'black').set('strokeWidth', 1)
            }
            svg.set("originX", 'center')
            svg.set("originY", 'center')
            // svg.setControlsVisibility({
            //   "ml": false,
            //   "mr": false,
            //   "mb": false,
            //   "mt": false,
            //   "bl": false,
            //   "br": false,
            //   "tl": false,
            //   "tr": false,
            //   "mtr": false,
            // })

            this.addObjToCanvas(ct, isUv, item, svg)
            this.removeLoadProblems(item.id)
          });
        }
      } else if (item.path) {
        if (item.path.path) {
          let path = new fabric.Path(item.path.path, {
            originX: 'center',
            originY: 'center',
            scaleX: 1,
            scaleY: 1,
            left: item.path.left * MM_TO_PX_RATIO,
            top: item.path.top * MM_TO_PX_RATIO,
            angle: item.path.angle,
          });
          if (item.path.scaleToMax) {
            item.path.scaleX = this.selectSurface.width * MM_TO_PX_RATIO / path.width
            item.path.scaleY = this.selectSurface.height * MM_TO_PX_RATIO / path.height
          }
          path.set("scaleX", item.path.scaleX)
          path.set("scaleY", item.path.scaleY)
          if (isUv) {
            path.fill = item.path.fill
          } else {
            path.fill = "transparent"
            path.stroke = item.path.stroke
            path.strokeWidth = item.path.strokeWidth
          }

          this.addObjToCanvas(ct, isUv, item, path)
        }
      } else if (item.mzpt) {
        if (this.mzptElemOptions.length <= 0) {
          await this.syncMzptElemList()
        }
        if (this.mzptColorSeriesOptions.length <= 0) {
          await this.syncMzptColorSeries()
        }
        if (this.mzptStandOptions.length <= 0) {
          await this.syncMzptStands()
        }

        if (item.mzpt.auto_scale_width) {
          item.mzpt.lines.forEach((line) => {
            line.elem_gap = 12
          })
        }

        let elem_ids = []
        for (const line of item.mzpt.lines) {
          elem_ids.push(...line.left_elems)
          elem_ids.push(...line.mid_elems)
          elem_ids.push(...line.right_elems)
        }
        let details = await this.mzptElemDetails(elem_ids)

        let objs = []
        for (const line of item.mzpt.lines) {
          let elems = []
          let totalWidth = 0
          let paths = []
          let height = 0

          let colorIndex = 0
          line.left_elems.concat(line.mid_elems).concat(line.right_elems).forEach((id) => {
            let elem = details.find((elem) => {
              return elem.id === id
            })
            elems.push(elem)

            let path = new fabric.Path(elem.outer_path, {
              stroke: 'red',
              strokeWidth: 1,
              fill: "transparent",
              originX: 'left',
              originY: 'top',
              left: elem.offset_x,
              top: elem.offset_y,
            })
            if (this.cvs_index !== 2 && elem.letter && line.color_series_id) {
              let s = this.mzptColorSeriesOptions.find((item) => {
                return item.id === line.color_series_id
              })
              if (s) {
                path.fill = s.colors[colorIndex % s.colors.length]
              }

              colorIndex++
            }
            paths.push(path)

            // if (paths.length === 1) {
            //   xOffset = elem.offset_x + line.left_gap
            // }
            // yOffset = yOffset === 0 ? elem.offset_y : Math.min(yOffset, elem.offset_y)

            totalWidth += elem.width

            height = Math.max(height, elem.height)
          })

          let width = this.selectSurface.width * MM_TO_PX_RATIO
          let elemGap = line.elem_gap * MM_TO_PX_RATIO
          if (item.mzpt.lines.length === 1 && item.mzpt.auto_scale_width) {
            // 计算宽高，设置宽高
            width = totalWidth + line.left_gap * MM_TO_PX_RATIO + line.right_gap * MM_TO_PX_RATIO + (paths.length - 1) * elemGap

            let changed = true
            if (width < 300 * MM_TO_PX_RATIO) {
              width = 300 * MM_TO_PX_RATIO
            } else if (width > 600 * MM_TO_PX_RATIO) {
              width = 600 * MM_TO_PX_RATIO
            } else {
              changed = false
            }
            if (changed) {
              line.elem_gap = (width - line.left_gap * MM_TO_PX_RATIO - line.right_gap * MM_TO_PX_RATIO - totalWidth) / (paths.length - 1) / MM_TO_PX_RATIO
              elemGap = line.elem_gap * MM_TO_PX_RATIO
            }
            let w = (width / MM_TO_PX_RATIO).toFixed(2)
            if (this.selectSurface.width.toFixed(2) !== w) {
              this.selectSurface.width = w
              this.cvsFilter((c) => {
                this.updateWh(c, this.selectSurface.width * MM_TO_PX_RATIO, this.selectSurface.height * MM_TO_PX_RATIO)
              })
              this.notifyBaseImageChanged()
              this.$nextTick(() => {
                this.render(item) // 再渲染一次
              })
              return // 退出数据更新
            }
          } else {
            if (paths.length > 1) {
              line.elem_gap = (width - line.left_gap * MM_TO_PX_RATIO - line.right_gap * MM_TO_PX_RATIO - totalWidth) / (paths.length - 1) / MM_TO_PX_RATIO
              elemGap = line.elem_gap * MM_TO_PX_RATIO
            } else {
              elemGap = 0
            }
          }

          let leftOffset = line.left_gap * MM_TO_PX_RATIO
          for (let i = 0; i < paths.length; i++) {
            let path = paths[i]
            path.left += leftOffset
            leftOffset += elems[i].width + elemGap
          }

          let lineGroup = new fabric.Group(paths, {
            left: this.selectSurface.width / 2 * MM_TO_PX_RATIO,
            top: line.top * MM_TO_PX_RATIO,
            fill: "green",
            originX: "center",
            originY: "center",
          })
          objs.push(lineGroup)
        }

        let rect = new fabric.Rect({
          top: 0,
          left: 0,
          rx: item.mzpt.radius * MM_TO_PX_RATIO,
          ry: item.mzpt.radius * MM_TO_PX_RATIO,
          width: this.selectSurface.width * MM_TO_PX_RATIO,
          height: this.selectSurface.height * MM_TO_PX_RATIO,
          stroke: "black",
          strokeWidth: 1,
          fill: "transparent",
        })
        objs.push(rect)

        let group = new fabric.Group(objs, {
          left: this.selectSurface.width / 2 * MM_TO_PX_RATIO,
          right: this.selectSurface.height / 2 * MM_TO_PX_RATIO,
          fill: "green",
          originX: "center",
          originY: "center",
          lockMovementX: true,
          lockMovementY: true,
        })
        group.setControlsVisibility({
          "ml": false,
          "mr": false,
          "mb": false,
          "mt": false,
          "bl": false,
          "br": false,
          "tl": false,
          "tr": false,
          "mtr": false,
        })
        this.addObjToCanvas(ct, isUv, item, group)
      }

      ct.cvs.requestRenderAll()
    },
    addObjToCanvas(c, isUv, item, obj) {
      obj.id = this.uuid()
      obj.hashId = obj.id
      obj.selectable = !item.unselectable

      c.objMap.set(obj.id, item.id)

      if (c.id > 0) {
        obj.lockMovementX = true
        obj.lockMovementY = true
        obj.setControlsVisibility({
          "ml": false,
          "mr": false,
          "mb": false,
          "mt": false,
          "bl": false,
          "br": false,
          "tl": false,
          "tr": false,
          "mtr": false,
        })
      }

      c.cvs.add(obj)

      let level = item.level ? item.level + 99: 0
      obj.moveTo(level)

      if (obj.selectable) {
        c.cvs.setActiveObject(obj)
      }
    },
    objChanged(target) {
      this.cvsFilter((c) => {
        if (c.cvs !== target.canvas) {
          return
        }
        let item = undefined

        let itemId = c.objMap.get(target.id)
        if (itemId) {
          item = this.selectSurface.items.find((item) => item.id === itemId)
        }
        if (!item) {
          return
        }

        // 更新
        if (item.circle) {
          item.circle.left = target.left / MM_TO_PX_RATIO
          item.circle.top = target.top / MM_TO_PX_RATIO
          item.circle.radius = target.radius / MM_TO_PX_RATIO
          item.circle.angle = target.angle
          item.circle.scaleX = target.scaleX
          item.circle.scaleY = target.scaleY
        } else if (item.rect) {
          item.rect.left = target.left / MM_TO_PX_RATIO
          item.rect.top = target.top / MM_TO_PX_RATIO
          item.rect.width = target.width / MM_TO_PX_RATIO
          item.rect.height = target.height / MM_TO_PX_RATIO
          item.rect.rx = target.rx / MM_TO_PX_RATIO
          item.rect.ry = target.ry / MM_TO_PX_RATIO
          item.rect.angle = target.angle
          item.rect.scaleX = target.scaleX
          item.rect.scaleY = target.scaleY
        } else if (item.text) {
          item.text.left = target.left / MM_TO_PX_RATIO
          item.text.top = target.top / MM_TO_PX_RATIO
          item.text.width = target.width / MM_TO_PX_RATIO
          item.text.angle = target.angle
          item.text.text = target.text
          this.checkTextProblems(item, target)
        } else if (item.image) {
          item.image.left = target.left / MM_TO_PX_RATIO
          item.image.top = target.top / MM_TO_PX_RATIO
          item.image.width = target.width * target.scaleX / MM_TO_PX_RATIO
          item.image.height = target.height * target.scaleY / MM_TO_PX_RATIO
          item.image.angle = target.angle
        } else if (item.svg) {
          item.svg.left = target.left / MM_TO_PX_RATIO
          item.svg.top = target.top / MM_TO_PX_RATIO
          item.svg.scaleX = target.scaleX
          item.svg.scaleY = target.scaleY
          item.svg.angle = target.angle
        } else if (item.path) {
          item.path.left = target.left / MM_TO_PX_RATIO
          item.path.top = target.top / MM_TO_PX_RATIO
          item.path.scaleX = target.scaleX
          item.path.scaleY = target.scaleY
          item.path.angle = target.angle
        } else if (item.mzpt) {
          item.mzpt.left = target.left / MM_TO_PX_RATIO
          item.mzpt.top = target.top / MM_TO_PX_RATIO
        }

        this.render(item, c.cvs)
      })
    },
    problem(id) {
      let count = 0
      if (this.loadProblemIds.indexOf(id) >= 0) {
        count++
      }
      if (this.textProblemIds.indexOf(id) >= 0) {
        count++
      }
      return count > 0 ? count : null
    },
    addLoadProblems(key) {
      if (this.loadProblemIds.indexOf(key) < 0) {
        this.loadProblemIds.push(key)
      }
    },
    removeLoadProblems(key) {
      this.loadProblemIds = this.loadProblemIds.filter(v=>{return v !== key})
    },
    checkTextProblems(item, target) {
      if (target._textLines.length > (item.text.line || 1) || target.width > (item.text.width*MM_TO_PX_RATIO+1)) {
        if (this.textProblemIds.indexOf(target.id) < 0) {
          this.textProblemIds.push(item.id)
        }
      } else {
        this.textProblemIds = this.textProblemIds.filter(v=>{return v !== item.id})
      }
    },
    removeTextProblems(key) {
      this.textProblemIds = this.textProblemIds.filter(v=>{return v !== key})
    },
    objSelectionChanged(e) {
      if (!e.selected.length) {
        return
      }
      if (this.isIniting) {
        return
      }

      this.cvsFilter((c) => {
        e.selected.forEach(v=>{
          if (v.canvas !== c.cvs) {
            return
          }

          let itemId = c.objMap.get(v.id)
          if (!itemId) {
            return
          }

          let item = this.selectSurface.items.find((item) => item.id === itemId)
          if (item && !item.show) {
            this.show(item)
          }
        })
      })
    },
    addNewText() {
      this.addItem({
        name: "文字",
        uv: true,
        cutting: false,
        unselectable: false,
        text: {
          text: "Default Value",
          text_conditions: [],
          left: this.selectSurface.width / 2,
          top: this.selectSurface.height / 2,
          width: this.selectSurface.width,
          limit: 15,
          angle: 0,
          text_align: "center",
          font_size: 500,
          font_family: "",
          font_family_conditions: [],
          char_spacing: 0,
          stroke_width: 0,
          line: 1,
          stroke: "#000000", // 设置描边颜色
          font_color: "#000000",
          font_color_conditions: [],
          font_weight: "",
          shadow_color: "",
          shadow_offset_x: 0,
          shadow_offset_y: 0,
          path: "",
          path_side: "left",
          scaleX: 1,
          scaleY: 1,
        }
      })
    },
    addNewImage() {
      this.addItem({
        name: "图",
        uv: true,
        cutting: false,
        unselectable: false,
        image: {
          type: this.IT_FILL,
          left: this.selectSurface.width / 2,
          top: this.selectSurface.height / 2,
          width: this.selectSurface.width / 2,
          height: this.selectSurface.height / 2,
          angle: 0,
          url: "https://image.szkdx.work/upload/2023/12/28/17/20/c04b1867-4b16-4efc-9976-97890428715c.png", // 测试图片
          url_conditions: [],
          clipPath: "",
          clipPathAbsolutePosition: true,
          clipPathScaleX: 1,
          clipPathScaleY: 1,
        }
      })
    },
    addNewSvg() {
      this.addItem({
        name: "Svg",
        uv: false,
        cutting: true,
        unselectable: false,
        svg: {
          left: this.selectSurface.width / 2,
          top: this.selectSurface.height / 2,
          scaleX: 10,
          scaleY: 10,
          scaleToMax: false,
          angle: 0,
          url: "https://image.szkdx.work/upload/2024/6/10/19/32/43dab846-36ea-46d5-9283-b5ecec7dc21d.svg",
          fill: "",
        }
      })
    },
    addNewPath() {
      this.addItem({
        name: "路径",
        uv: false,
        cutting: true,
        unselectable: false,
        path: {
          left: this.selectSurface.width / 2,
          top: this.selectSurface.height / 2,
          scaleX: 1,
          scaleY: 1,
          scaleToMax: false,
          stroke: "black",
          strokeWidth: 1,
          angle: 0,
          path: "M138.7717,22.7297c106.9649,19.2857,62.6136,115.714,62.6136,115.714l-106.9649,32.1428L.5,82.7295V.5864L138.7717,22.7297Z",
          fill: "",
        }
      })
    },
    async addNewMzpt() {
      await this.addItem({
        name: "名字拼图",
        uv: false,
        cutting: true,
        unselectable: false,
        mzpt: {
          stand_id: undefined, // 底座(底座的id)
          stand_conditions: [], // 底座条件
          radius: 8, // 底板弧度(mm)
          bottom_print_material: "5mm木板", // 底板材料
          elem_print_material: "5mm木板", // 元素材料
          auto_scale_width: false, // true表示根据元素间隔自动缩放宽度，否则，只显示左右两侧间隔，然后算出元素间隔
          elems: [], // 可选元素
          lines: [
            {
              top: this.selectSurface.height / 2,
              color_series_id: undefined,
              color_series_conditions: [],
              name: "",
              name_conditions: [],
              left_elems: [], // 左侧元素
              mid_elems: [], // 中间元素
              right_elems: [], // 右侧元素
              left_gap: 20, // 左侧元素跟左边的间隔
              right_gap: 20, // 右侧元素跟右边的间隔
              elem_gap: 12, // 元素间隔
            },
          ]
        }
      })

      await this.triggerMzptSurfaces(this.selectSurface)
    },
    addNewCircle() {
      this.addItem({
        name: "圆形",
        uv: false,
        cutting: true,
        unselectable: false,
        circle: {
          left: this.selectSurface.width / 2,
          top: this.selectSurface.height / 2,
          radius: Math.min(this.selectSurface.width / 2, this.selectSurface.height / 2),
          scaleX: 1,
          scaleY: 1,
          angle: 0,
        }
      })
    },
    addNewRect() {
      this.addItem({
        name: "方形",
        uv: false,
        cutting: true,
        unselectable: false,
        rect: {
          left: this.selectSurface.width / 2,
          top: this.selectSurface.height / 2,
          width: this.selectSurface.width / 2,
          height: this.selectSurface.height / 2,
          rx: 1,
          ry: 1,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
          fill: "",
        }
      })
    },
    addNewInfo() {
      this.addItem({
        name: "数据",
        uv: false,
        cutting: false,
        unselectable: false,
        info: {
          value: "",
          value_conditions: [],
        }
      })
    },
    handleSuccess(res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      if (res.data) {
        this.$message.error(res.data.join("\n"));
      } else {
        this.$message("上传成功!");
        this.syncFontList()
      }
    },
    async handleSvgSuccess(item, res) {
      this.fullscreenLoading = false
      
      if (res.code !== 0 ) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      if(res.data){
        const response = await fetch(res.data);
        const svgText = await response.text();
        const hasPolygon = /polygon/i.test(svgText);
        if (hasPolygon) {
          this.$message.error("上传失败! 上传文件中含有polygon" + res.msg);
          return
        }
      }
      
      item.svg.url = res.data
      this.render(item)
    },
    handleImageSuccess(item, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      item.image.url = res.data
      this.render(item)
    },
    handleError(err) {
      this.fullscreenLoading = false
      this.$message.error("上传失败!" + err);
    },
    openGenSvgDrawer(item) {
      this.genSvgItem = item;
      this.genSvgVisible = true;
    },
    changeGenSvgItemSvgConfig(itemId, config) {
      const surface = this.surface_list.find(item => item.id === this.selectSurfaceId)
      if(!surface) return;
      const item = surface.items.find(item => item.id === itemId)
      if(!item) return;
      item.svg = {...item.svg, ...config}
      this.$message.info("配置保存");
      this.genSvgVisible = false;
    },
    useGenSvgItemSvgUrl(itemId, url) {
      const surface = this.surface_list.find(item => item.id === this.selectSurfaceId)
      if(!surface) return;
      const item = surface.items.find(item => item.id === itemId)
      if(!item) return;

      item.svg.url = url;
      item.svg.uv = true;
      this.render(item);
      this.$message.success("成功使用生成的SVG");
      this.genSvgVisible = false;
    },
    async triggerMzptSurfaces(sfc) {
      // 触发名字拼图元素
      if (!sfc) {
        return
      }

      for (let i = 0; i < sfc.items.length; i++) {
        let item = sfc.items[i]
        if (!item.mzpt) {
          continue
        }

        await this.addMzptSurface(sfc, item)
      }
    },
    deleteMzptSurface(sfc, item) {
      let list = this.surface_list.filter((v) => {
        return v.id === `${sfc.id}-${item.id}-底` || v.id === `${sfc.id}-${item.id}-元素` || v.id === `${sfc.id}-${item.id}-底座`
      })
      this.removeSurface(list.map((v) => {
        return v.id
      }))
    },
    async addMzptSurface(sfc, item) {
      if (item.mzpt.lines.length <= 0) {
        return
      }

      this.deleteMzptSurface(sfc, item)

      if (!this.isVisible(item.condition)) {
        return
      }

      // 添加新的面，里面有宽高
      let id = 0

      let bottomSfc = this.newSurface()
      bottomSfc.id = `${sfc.id}-${item.id}-底`
      bottomSfc.name = `${item.name}-底`
      bottomSfc.print_material = item.mzpt.bottom_print_material
      bottomSfc.editable = false
      bottomSfc.from_id = sfc.id
      bottomSfc.width = sfc.width
      bottomSfc.height = sfc.height
      bottomSfc.export_scale = sfc.export_scale
      bottomSfc.items.push({
        id: ++id,
        name: "底板",
        uv: false,
        cutting: true,
        unselectable: false,
        show: true,
        condition: {
          has: false,
          key: "",
          method: "",
          value: "",
        },
        rect: {
          left: sfc.width / 2,
          top: sfc.height / 2,
          width: sfc.width,
          height: sfc.height,
          rx: item.mzpt.radius,
          ry: item.mzpt.radius,
          scaleX: 1,
          scaleY: 1,
          angle: 0,
        }
      })
      this.surface_list.push(bottomSfc)

      let width = 0
      let height = 0
      let items = []
      for (const line of item.mzpt.lines) {
        let elemIds = line.left_elems.concat(line.mid_elems).concat(line.right_elems)
        let details = await this.mzptElemDetails(elemIds)

        let lineWidth = 2
        let maxHeight = 0
        for (const detail of details) {
          if (detail.inner_image) {
            lineWidth += detail.inner_image_width / MM_TO_PX_RATIO + 2
            maxHeight = Math.max(maxHeight, detail.inner_image_height / MM_TO_PX_RATIO)
          } else {
            lineWidth += detail.inner_width / MM_TO_PX_RATIO + 2
            maxHeight = Math.max(maxHeight, detail.inner_height / MM_TO_PX_RATIO)
          }
        }
        width = Math.max(width, lineWidth)
        height += maxHeight + 2 // 每个+2mm

        let colorIndex = 0
        let leftOffset = 0
        for (const detail of details) {
          if (detail.inner_image) {
            items.push({
              id: ++id,
              name: "图片裁切",
              uv: false,
              cutting: true,
              unselectable: false,
              show: false,
              condition: {
                has: false,
                key: "",
                method: "",
                value: "",
              },
              path: {
                left: leftOffset + detail.inner_image_width / MM_TO_PX_RATIO / 2,
                top: detail.inner_image_height / MM_TO_PX_RATIO / 2,
                scaleX: 1,
                scaleY: 1,
                stroke: "black",
                strokeWidth: 1,
                angle: 0,
                path: detail.outer_path,
                fill: "",
              }
            })
            items.push({
              id: ++id,
              name: "元素图片",
              uv: true,
              cutting: false,
              unselectable: false,
              show: false,
              condition: {
                has: false,
                key: "",
                method: "",
                value: "",
              },
              image: {
                type: this.IT_AUTO,
                left: leftOffset + detail.inner_image_width / MM_TO_PX_RATIO / 2,
                top: detail.inner_image_height / MM_TO_PX_RATIO / 2,
                width: detail.inner_image_width / MM_TO_PX_RATIO,
                height: detail.inner_image_height / MM_TO_PX_RATIO,
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                url: detail.inner_image,
                clipPath: "",
                clipPathAbsolutePosition: true,
                clipPathScaleX: 1,
                clipPathScaleY: 1,
              }
            })

            leftOffset += detail.inner_image_width / MM_TO_PX_RATIO + 2
          } else {
            let fill = ""
            if (detail.letter && line.color_series_id) {
              let s = this.mzptColorSeriesOptions.find((item) => {
                return item.id === line.color_series_id
              })
              if (s) {
                fill = s.colors[colorIndex % s.colors.length]
              }
              colorIndex++
            }
            items.push({
              id: ++id,
              name: "图片裁切",
              uv: fill !== "",
              cutting: true,
              unselectable: false,
              show: false,
              condition: {
                has: false,
                key: "",
                method: "",
                value: "",
              },
              path: {
                left: leftOffset + detail.inner_width / MM_TO_PX_RATIO / 2,
                top: detail.inner_height / MM_TO_PX_RATIO / 2,
                scaleX: 1,
                scaleY: 1,
                stroke: "black",
                strokeWidth: 1,
                angle: 0,
                path: detail.inner_path,
                fill: fill,
              }
            })
            leftOffset += detail.inner_width / MM_TO_PX_RATIO + 2
          }
        }
      }

      let elemSfc = this.newSurface()
      elemSfc.id = `${sfc.id}-${item.id}-元素`
      elemSfc.name = `${item.name}-元素`
      elemSfc.print_material = item.mzpt.elem_print_material
      elemSfc.editable = false
      elemSfc.from_id = sfc.id
      elemSfc.width = width
      elemSfc.height = height
      elemSfc.export_scale = undefined
      elemSfc.items = items
      this.surface_list.push(elemSfc)

      if (item.mzpt.stand_id) {
        let stand = this.mzptStandOptions.find((v) => {return v.id === item.mzpt.stand_id})
        if (!stand) {
          this.$message.error(`没有找到名字拼图底座: ${item.mzpt.stand_id}`)
          return
        }

        let standSfc = this.newSurface()
        standSfc.id = `${sfc.id}-${item.id}-底座`
        standSfc.name = `${item.name}-底座`
        standSfc.print_material = stand.print_material
        standSfc.editable = false
        standSfc.from_id = sfc.id
        standSfc.width = stand.width
        standSfc.height = stand.height
        standSfc.export_scale = undefined

        let svgItem = {
          id: ++id,
          name: "底座",
          uv: false,
          cutting: true,
          unselectable: false,
          show: false,
          condition: {
            has: false,
            key: "",
            method: "",
            value: "",
          },
          svg: {
            left: standSfc.width / 2,
            top: standSfc.height / 2,
            scaleX: 7.5,
            scaleY: 7.5,
            angle: 0,
            url: stand.svg,
            fill: "",
          }
        }
        standSfc.items = [svgItem]
        this.surface_list.push(standSfc)
      }
    },
    async genAndPreview() {
      if (this.textProblemIds.length > 0) {
        this.$message.error("存在文本问题，不可以预览")
        return
      }
      if (this.loadProblemIds.length > 0) {
        this.$message.error("存在加载问题，不可以预览")
        return
      }

      let removeFuncs = []
      this.cvsFilter((c) => {
        let v = c
        if (v.id === 0) {
          // 不是uv图
          return
        }

        let r1 = new fabric.Rect({ top: 0, left: 0, width: 2, height: 2, strokeWidth: 0, fill: 'white', originX: 'left', originY: 'top' })
        r1.toSVG = (function(originalToSVG) {
          return function() {
            const svgString = originalToSVG.call(this);
            return svgString.replace('<rect ', `<rect id="AnchorPoint1" `);
          };
        })(r1.toSVG);
        v.cvs.add(r1)
        v.cvs.sendToBack(r1);
        removeFuncs.push(() => { v.cvs.remove(r1) })

        let r2 = new fabric.Rect({ top: Math.floor(this.selectSurface.height * MM_TO_PX_RATIO)-2, left: Math.floor(this.selectSurface.width * MM_TO_PX_RATIO)-2, width: 2, height: 2, strokeWidth: 0, fill: 'white', originX: 'left', originY: 'top' })
        r2.toSVG = (function(originalToSVG) {
          return function() {
            const svgString = originalToSVG.call(this);
            return svgString.replace('<rect ', `<rect id="AnchorPoint2" `);
          };
        })(r2.toSVG);
        v.cvs.add(r2)
        v.cvs.sendToBack(r2);
        removeFuncs.push(() => { v.cvs.remove(r2) })
      })

      let exportScale = this.selectSurface.export_scale || 1
      let width = Math.floor(this.selectSurface.width * MM_TO_PX_RATIO * exportScale) / 10
      let height = Math.floor(this.selectSurface.height * MM_TO_PX_RATIO * exportScale) / 10
      let uvSvg = this.cvs_list[1].cvs.toSVG({ suppressPreamble: true, width: 800, height: height/width*800 })
      let cutSvg = this.hasCutSvg ? this.cvs_list[2].cvs.toSVG({ suppressPreamble: true, width: width, height: height }) : ""

      removeFuncs.forEach((v) => { v() })

      let resp = await customizeOrderPreview({id: this.order_id, uv_svg: uvSvg, cut_svg: cutSvg})
      if (resp.code) {
        return
      }

      this.dlgPreview.id = this.order_id
      this.dlgPreview.uv_svg = resp.data.uv_svg
      this.dlgPreview.cut_svg = resp.data.cut_svg
      this.dlgPreview.width = width
      this.dlgPreview.height = height
      this.dlgPreview.visible = true
    },
    getSpecDesc(sfc) {
      let array = []
      sfc.items.forEach((item) => {
        if (!item.info) {
          return
        }
        if (!this.isVisible(item.condition)) {
          return
        }
        if (!item.info.value) {
          return
        }
        array.push(item.info.value)
      })
      return array
    },
    previewSuc({uv_svg, cut_svg, width, height}) {
      this.dlgPreview.id = undefined
      this.dlgPreview.uv_svg = undefined
      this.dlgPreview.cut_svg = undefined
      this.dlgPreview.width = undefined
      this.dlgPreview.height = undefined

      this.preview_map.set(this.selectSurfaceId, {
        id: this.selectSurfaceId,
        print_material: this.selectSurface.print_material,
        width: width*10,
        height: height*10,
        uv_svg: uv_svg,
        cut_svg: cut_svg,
        count: this.selectSurface.count || 1,
        spec_descs: this.getSpecDesc(this.selectSurface),
      })

      for (let i = 0; i < this.surface_list.length; i++) {
        let sfc = this.surface_list[i]
        if (!this.isPreviewSuc(sfc.id)) {
          this.changeSurface(sfc.id)
          return
        }
      }

      this.$message("全部预览完毕，可以生成")
      this.confirmGen()
    },
    deletePreview(id) {
      this.preview_map.delete(id)
    },
    confirmGen() {
      if (this.notUsedKeys.length) {
        this.$confirm(`${this.notUsedKeys.join(", ")} 没有使用到，确认是否生成?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(this.confirmPrintMaterial)
      } else {
        this.confirmPrintMaterial()
      }
    },
    async confirmPrintMaterial() {
      if (!this.selectSurfacePrintMaterial) {
        this.$message.error("当前没有选择打印材质!")
        return
      }

      if (this.selectSurfacePrintMaterial.dpi !== 720) {
        this.$confirm(`当前材质DPI是${this.selectSurfacePrintMaterial.dpi}，请注意尺寸，确认是否生成?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(this.doConfirmGen)
      } else {
        this.doConfirmGen()
      }
    },
    async doConfirmGen() {
      if (this.order_id) {
        let surfaces = JSON.stringify(this.surface_list)
        let resp = await customizeOrderUpdate({
          "id": this.order_id,
          "customize_id": this.select_customize_id,
          "surfaces": surfaces,
        })
        if (resp.code) {
          return
        }
      }

      let list = []
      this.preview_map.forEach((value) => { list.push(value) })
      const res = await customizeOrderGen({id: this.order_id, list: list})
      if (res.code) {
        return
      }
      this.$message("生成成功")

      this.loadNextOrder();
    },
    isPreviewSuc(id) {
      return this.preview_map.has(id)
    },
    isAllPreviewSuc() {
      for (let i = 0; i < this.surface_list.length; i++) {
        let sfc = this.surface_list[i]
        if (!this.isPreviewSuc(sfc.id)) {
          return false
        }
      }
      return true
    }
  },
}
</script>
<style scoped lang="scss">
.left {
  //background: lightblue;
  width: 800px;
  height: calc(100% - 80px);
  display: inline-block;
  //background-color: red;
  padding: 10px 5px 10px 15px;

  .left_header {
    width: 100%;
    height: 40px;
  }
}

.right {
  width: calc(100% - 800px);
  height: 100%;
  display: inline-block;
  //background-color: green;
  position: absolute;
  padding: 10px 15px 10px 5px;
}

::v-deep .el-card__header {
  padding: 10px 10px 5px 10px !important;
  background-color: antiquewhite;
}

::v-deep .el-card__body, .el-main {
  padding: 0 10px 5px 10px !important;
}

::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 5px !important;
  margin-top: 5px !important;
}

::v-deep .el-upload--text {
  width: 100%;
}

::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 0 !important;
}

.cant_click {
  pointer-events: none;
}

::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    max-height: calc(100vh - 450px);
    overflow-x: hidden;
  }
}

::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
  margin-bottom: 0px !important;
}

::v-deep .el-badge__content.is-fixed {
  right: 15px;
  top: 10px;
}

::v-deep .el-form-item__content {
  line-height: 22px;
}

</style>
<style>
.canvas-container {
  background-color: #BAE0FF;
}

.text-notification {
  top: 9.5vh !important;
  border: 1px gray solid;
}
</style>