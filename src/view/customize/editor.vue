<template>
  <el-drawer :visible.sync="$attrs.visible" title="模板" @opened="onOpened" :before-close="handleBeforeClose" size="90%">
    <div style="width: 100%;height: 100%; display: flex" v-if="form">
      <div class="left" id="left">
        <div id="left_canvas">
          <canvas ref="canvas" id="canvas" :width="form.width" :height="form.height" style="display: block; margin: auto;border: 1px solid pink"></canvas>
        </div>
        <KdxImage :src="image" :width="`${max_width/2}px`" :height="`${max_width/2}px`" v-if="image"></KdxImage>
      </div>
      <div class="right">
        <el-form class="table-form" ref="elForm" :model="form" size="mini" label-width="80px" label-position="right" style="margin-left: 10px; margin-right: 10px">
          <template v-if="order_id">
            <el-form-item label="定制模板" prop="customize_id">
              <el-row>
                <el-col :span="18">
                  <el-select v-model="customize_id" placeholder="定制模板" filterable clearable :style="{width: '100%'}" @change="customizeIdChanged">
                    <el-option v-for="(item, index) in customizeOptions" :key="index" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-button size="mini" type="primary" style="width: 100%; margin-left: 5px;" @click="syncCustomizeList">同步模板</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="文本内容">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" v-model="personal_text" clearable></el-input>
            </el-form-item>
            <el-form-item label="图片内容">
              <el-row :gutter="5">
                <el-col :span="8">
                  <KdxImage :src="user_upload_image" width="100%" height="100%" v-if="user_upload_image"></KdxImage>
                </el-col>
                <el-col :span="8">
                  <KdxImage :src="user_select_image" width="100%" height="100%" v-if="user_select_image"></KdxImage>
                </el-col>
                <el-col :span="8">
                  <KdxImage :src="preview_image" width="100%" height="100%" v-if="preview_image"></KdxImage>
                </el-col>
              </el-row>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="分组" prop="group_id">
              <el-row>
                <el-col :span="18">
                  <el-select v-model="form.group_id" placeholder="请选择分组" filterable clearable :style="{width: '100%'}" @change="groupIdChanged">
                    <el-option v-for="(item, index) in groupOptions" :key="index" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-button size="mini" type="primary" style="width: 100%; margin-left: 5px;" @click="syncGroupList">同步分组</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <template>
              <el-form-item label="名字" prop="name">
                <el-input v-model="form.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="分隔符" prop="separator">
                <el-input v-model="form.separator" clearable></el-input>
              </el-form-item>
            </template>
          </template>
          <template v-if="form.group">
            <el-form-item label="底图" prop="base_image_id">
              <el-row :gutter="5">
                <el-col :span="18">
                  <el-select v-model="form.base_image_id" placeholder="请选择底图" filterable clearable :style="{width: '100%'}" @change="baseImageIdChanged">
                    <el-option label=" " :value="0"></el-option>
                    <template v-for="(item, index) in baseImageOptions">
                      <el-option :key="index" :label="item.name" :value="item.id" v-if="canSelectBaseImage(item)">
                        <div style="float: left">{{ item.name }}({{baseImageMatch(item) ? "尺寸匹配" : "尺寸不匹配"}})</div>
                        <KdxImage style="float: right" :src="item.thumbnail_url+'?imageView2/2/w/100/q/70'" width="100%" height="34px"></KdxImage>
                      </el-option>
                    </template>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-upload action="/customize_v2/base_image/update" :headers="{'x-token':token}" multiple :show-file-list="false"
                             accept=".png,.jpg,.jpeg" :before-upload="beforeUpload" :on-success="handleBaseImageSuccess" :on-error="handleError" style="width: 100%">
                    <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                      上传底图
                    </el-button>
                  </el-upload>
                </el-col>
                <el-col :span="3">
                  <el-button size="mini" type="primary" style="width: 100%; margin-left: 5px;" @click="syncBaseImageList">同步底图</el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="辅助底图">
              <el-upload action="" :auto-upload="false" :on-change="onFileChanged" ref="upload" list-type="picture" :limit="10" accept=".png,.jpg,.jpeg" style="width: 100%;">
                <el-button size="mini" style="width: 100%" type="primary">
                  上传辅助底图
                </el-button>
                <div slot="file" slot-scope="{file}">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                  <div>
                    <el-row :gutter="5">
                      <el-col :span="8">
                        <el-button size="mini" type="primary" @click="setHelpBaseImage(file)" style="width: 100%">设置背景</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="primary" @click="cancelHelpBaseImage" style="width: 100%">取消背景</el-button>
                      </el-col>
                      <el-col :span="8">
                        <el-button size="mini" type="warning" @click="handleRemove(file)" style="width: 100%">删除</el-button>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </el-upload>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item :label="`宽(${(form.width/283.5).toFixed(1)}cm)`" prop="width">
                  <el-input-number style="width: 100%" v-model="form.width" :min="0" :precision="2" :step="141.75" placeholder="宽度" @change="changeWh"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="`高(${(form.height/283.5).toFixed(1)}cm)`" prop="height">
                  <el-input-number style="width: 100%" v-model="form.height" :min="0" :precision="2" :step="141.75" placeholder="高度" @change="changeWh"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="height: 40px">
              <el-row :gutter="5" style="float: right; width: 660px">
                <el-col :span="4" :offset="4">
                  <el-button size="mini" style="width: 100%" type="primary" @click="addNewText">新增文字</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" style="width: 100%" type="primary" @click="addNewImage">新增图片</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" style="width: 100%" type="primary" @click="addNewPath">新增路径</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" style="width: 100%" type="primary" @click="addNewMzpt" :disabled="hasMzpt">新增名字拼图</el-button>
                </el-col>
                <el-col :span="4">
                  <el-button size="mini" style="width: 100%" type="primary" @click="addNewSvg">新增Svg</el-button>
                </el-col>
              </el-row>
            </div>
            <div>
              <el-card class="box-card" v-for="(row, index) in form.items" :key="index" shadow="always">
                <div slot="header" class="clearfix">
                  <span @click="showItem(row)">{{row.name}}[类型: <span v-html="typeName(row)"></span>]</span>

                  <el-button style="float: right; padding: 3px 5px" type="text" @click="showItem(row)">{{row.show ? "收起" : "展示"}}</el-button>
                  <el-button style="float: right; padding: 3px 5px" type="text" @click="bottomItem(index)" :disabled="index+1===form.items.length">置底</el-button>
                  <el-button style="float: right; padding: 3px 5px" type="text" @click="downItem(index)" :disabled="index+1===form.items.length">下移</el-button>
                  <el-button style="float: right; padding: 3px 5px" type="text" @click="upItem(index)" :disabled="index===0">上移</el-button>
                  <el-button style="float: right; padding: 3px 5px" type="text" @click="topItem(index)" :disabled="index===0">置顶</el-button>
                  <el-button style="float: right; padding: 3px 5px" type="danger" @click="deleteItem(row)">删除</el-button>
                  <el-button style="float: right; padding: 3px 5px" type="text" @click="copyItem(row)">复制</el-button>
                </div>
                <div v-if="row.show">
                  <el-form-item label="名字" prop="separator">
                    <el-input style="width: 100%" v-model="row.name" placeholder="名字"></el-input>
                  </el-form-item>
                  <template v-if="row.type === 0">
                    <el-row>
                      <el-col :span="24">
                        <el-form-item label="文本" prop="default_value">
                          <el-row>
                            <el-col :span="18">
                              <el-input style="width: 100%" v-model="row.text.default_value" placeholder="文本" @change="itemChanged(row)" clearable></el-input>
                            </el-col>
                            <el-col :span="3">
                              <el-button size="mini" type="primary" style="width: 100%" @click="removeSpace(row)">去空格</el-button>
                            </el-col>
                            <el-col :span="3">
                              <el-button size="mini" type="primary" style="width: 100%" @click="firstUp(row)">首字母大写</el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="X" prop="x">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.text.x" placeholder="X轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustLeftX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustRightX(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="Y" prop="y">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.text.y" placeholder="Y轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustTopY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustBottomY(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="宽" prop="width">
                          <el-input-number style="width: 100%" v-model="row.text.width" :min="0" :max="form.width*3" :precision="2" :step="50" placeholder="宽度" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row :gutter="5">
                      <el-col :span="12">
                        <el-form-item label="字体" prop="font_family">
                          <el-select v-model="row.text.font_family" placeholder="请选择字体" filterable clearable :style="{width: '100%'}" @change="itemFontFamilyChanged(row)">
                            <el-option v-for="(item, index) in fontOptions" :key="index" :label="item.name"
                                       :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item label="" label-width="0">
                          <el-upload action="/customize_v2/font/update" :headers="{'x-token':token}" :show-file-list="false"
                                     accept=".otf,.ttf" :on-success="handleSuccess" :on-error="handleError" style="width: 100%; margin-left: 5px">
                            <el-button size="mini" style="width: 100%" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
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
                          <el-input-number style="width: 100%" v-model="row.text.font_size" :min="0" placeholder="字体大小" :step="10" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="字体颜色" prop="font_color">
                          <el-input style="width: 100%" v-model="row.text.font_color" placeholder="字体颜色" @change="itemChanged(row)" clearable>
                            <div slot="suffix">
                              <el-color-picker v-model="row.text.font_color" @change="itemChanged(row)" show-alpha></el-color-picker>
                            </div>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="字数限制" prop="limit">
                          <el-input-number style="width: 100%" v-model="row.text.limit" :min="0" :precision="0"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文字间隔" prop="char_spacing">
                          <el-input-number style="width: 100%" v-model="row.text.char_spacing" :precision="0" :step="50" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="文字粗细" prop="font_weight">
                          <el-select v-model="row.text.font_weight" placeholder="文字粗细" filterable clearable :style="{width: '100%'}" @change="itemChanged(row)">
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
                            <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="changeTextAlight(row, 'left')"></el-button>
                          </el-col>
                          <el-col :span="8">
                            <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="changeTextAlight(row, 'center')"></el-button>
                          </el-col>
                          <el-col :span="8">
                            <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="changeTextAlight(row, 'right')"></el-button>
                          </el-col>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="描边宽度" prop="stroke_width">
                          <el-input-number style="width: 100%" v-model="row.text.stroke_width" :precision="2" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="描边颜色" prop="stroke">
                          <el-input style="width: 100%" v-model="row.text.stroke" placeholder="描边颜色" @change="itemChanged(row)" clearable>
                            <el-color-picker v-model="row.text.stroke" slot="suffix" @change="itemChanged(row)"></el-color-picker>
                          </el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="阴影颜色" prop="shadow_color">
                          <el-input style="width: 100%" v-model="row.text.shadow_color" placeholder="阴影颜色" @change="itemChanged(row)" clearable>
                            <el-color-picker v-model="row.text.shadow_color" slot="suffix" @change="itemChanged(row)"></el-color-picker>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <template v-if="row.text.shadow_color">
                        <el-col :span="12">
                          <el-form-item label="阴影偏移X" prop="shadow_offset_x">
                            <el-input-number style="width: 100%" v-model="row.text.shadow_offset_x" placeholder="阴影偏移X(单位像素)" :precision="2" @change="itemChanged(row)"></el-input-number>
                          </el-form-item>
                        </el-col>
                        <el-col :span="12">
                          <el-form-item label="阴影偏移Y" prop="shadow_offset_y">
                            <el-input-number style="width: 100%" v-model="row.text.shadow_offset_y" placeholder="阴影偏移Y(单位像素)" :precision="2" @change="itemChanged(row)"></el-input-number>
                          </el-form-item>
                        </el-col>
                      </template>
                      <el-col :span="12">
                        <el-form-item label="角度" prop="angle">
                          <el-input-number size="mini" style="width: 100%" v-model="row.text.angle" :min="-360" :max="360" :precision="2" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="路径" prop="path">
                          <el-row>
                            <el-col :span="18">
                              <el-input style="width: 100%" v-model="row.text.path" placeholder="路径" @change="itemChanged(row)" clearable></el-input>
                            </el-col>
                            <el-col :span="6">
                              <el-button size="mini" type="primary" style="width: 100%" @click="changeTextPathSide(row)">翻转</el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="行数" prop="path">
                          <el-input-number style="width: 100%" v-model="row.text.line" placeholder="行数" :min="1" :step="1" :precision="0" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-else-if="row.type === 1">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="X" prop="x">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.image.x" placeholder="X轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustLeftX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustRightX(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="Y" prop="y">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.image.y" placeholder="Y轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustTopY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustBottomY(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="宽" prop="width">
                          <el-input-number style="width: 100%" v-model="row.image.width" :min="0" :max="form.width" :precision="2" :step="50" placeholder="宽度" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="高" prop="height">
                          <el-input-number style="width: 100%" v-model="row.image.height" :min="0" :max="form.height" :precision="2" :step="50" placeholder="高度" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="图片链接" prop="url">
                          <el-col :span="16">
                            <el-input style="width: 100%" v-model="row.image.url" placeholder="图片链接" @change="itemChanged(row)" clearable></el-input>
                          </el-col>
                          <el-col :span="8">
                            <el-upload action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                                       accept=".png,.jpg" :on-success="(res) => {handleImageSuccess(row, res)}" :on-error="handleError" :style="{width: '100%'}">
                              <el-button size="mini" :style="{width: '100%'}" type="primary">上传图片</el-button>
                            </el-upload>
                          </el-col>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="裁剪路径" prop="clip_path">
                          <el-input style="width: 100%" v-model="row.image.clip_path" placeholder="裁剪路径" @change="imageClipPathChanged(row)" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="角度" prop="angle">
                          <el-input-number size="mini" style="width: 100%" v-model="row.image.angle" :min="-360" :max="360" :precision="2" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-else-if="row.type === 2">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="X" prop="x">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.path.x" placeholder="X轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustLeftX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustRightX(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="Y" prop="y">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.path.y" placeholder="Y轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustTopY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustBottomY(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="x方向缩放" prop="scale_x">
                          <el-input-number style="width: 100%" v-model="row.path.scale_x" :min="0" :max="maxX(row.obj)" :precision="2" placeholder="x方向缩放" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="y方向缩放" prop="scale_y">
                          <el-input-number style="width: 100%" v-model="row.path.scale_y" :min="0" :max="maxY(row.obj)" :precision="2" placeholder="y方向缩放" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="路径" prop="path">
                          <el-input style="width: 100%" v-model="row.path.path" placeholder="路径" @change="itemChanged(row)" clearable></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="角度" prop="angle">
                          <el-input-number size="mini" style="width: 100%" v-model="row.path.angle" :min="-360" :max="360" :precision="2" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                  <template v-else-if="row.type === 3">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="X弧度" prop="rx">
                          <el-input-number style="width: 100%" v-model="row.mzpt.rx" placeholder="X弧度(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="Y弧度" prop="ry">
                          <el-input-number style="width: 100%" v-model="row.mzpt.ry" placeholder="Y弧度(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="底厚(mm)" prop="bottom_thickness">
                          <el-input-number style="width: 100%" v-model="row.mzpt.bottom_thickness" placeholder="底板厚(mm)" :precision="0" :step="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="顶厚(mm)" prop="top_thickness">
                          <el-input-number style="width: 100%" v-model="row.mzpt.top_thickness" placeholder="顶板厚(mm)" :precision="0" :step="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item label="文厚(mm)" prop="letter_thickness">
                          <el-input-number style="width: 100%" v-model="row.mzpt.letter_thickness" placeholder="文字厚(mm)" :precision="0" :step="1"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="座子" prop="stand_id">
                          <el-select v-model="row.mzpt.stand_id" placeholder="请选择座子" filterable clearable :style="{width: '100%'}">
                            <el-option label=" " :value="0"></el-option>
                            <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, index) in mzptStandOptions"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :offset="18" :span="6">
                        <el-button size="mini" style="width: 100%" type="primary" @click="addNewLine(row)">新增行</el-button>
                      </el-col>

                      <el-card class="box-card" v-for="(line, index) in row.mzpt.lines" :key="index" shadow="always">
                        <div slot="header" class="clearfix">
                          <span>第{{index+1}}行(间隔{{line.gap ? line.gap.toFixed(2) : 0}}cm)</span>

                          <el-button style="float: right; padding: 3px 10px" type="danger" @click="deleteLine(row, line)">删除</el-button>
                        </div>
                        <div>
                          <el-col :span="12">
                            <el-form-item label="X" prop="x">
                              <el-row>
                                <el-col :span="18">
                                  <el-input-number style="width: 100%" v-model="line.x" placeholder="X轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                                </el-col>
                                <el-col :span="2">
                                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustLeftX(row, line)"></el-button>
                                </el-col>
                                <el-col :span="2">
                                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterX(row, line)"></el-button>
                                </el-col>
                                <el-col :span="2">
                                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustRightX(row, line)"></el-button>
                                </el-col>
                              </el-row>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="Y" prop="y">
                              <el-row>
                                <el-col :span="18">
                                  <el-input-number style="width: 100%" v-model="line.y" placeholder="Y轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                                </el-col>
                                <el-col :span="2">
                                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustTopY(row, line)"></el-button>
                                </el-col>
                                <el-col :span="2">
                                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterY(row, line)"></el-button>
                                </el-col>
                                <el-col :span="2">
                                  <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustBottomY(row, line)"></el-button>
                                </el-col>
                              </el-row>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="左侧间隔" prop="left_gap">
                              <el-input-number style="width: 100%" v-model="line.left_gap" placeholder="左侧间隔(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="右侧间隔" prop="right_gap">
                              <el-input-number style="width: 100%" v-model="line.right_gap" placeholder="右侧间隔(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item label="字母列表" prop="letter_ids">
                              <el-select v-model="line.letter_ids" placeholder="字母列表" multiple collapse-tags filterable clearable :style="{width: '100%'}">
                                <template v-for="(item, index) in mzptElemOptions">
                                  <el-option :key="index" :label="item.name" :value="item.id" v-if="item.letter"></el-option>
                                </template>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="色系">
                              <el-select v-model="line.color_series_id" placeholder="选择色系" filterable clearable :style="{width: '100%'}" @change="itemChanged(row)">
                                <el-option label=" " :value="0"></el-option>
                                <el-option v-for="(s, index) in mzptColorSeriesOptions" :key="index" :label="s.name" :value="s.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item label="设置名字">
                              <el-input v-model="mzpt.name" placeholder="输入名字" multiple collapse-tags filterable clearable style="width: 100%" @change="setMzptElemIdsByName(row, line)">
                                <el-button slot="append" size="mini" type="primary" :disabled="!mzpt.name" @click="setMzptElemIdsByName(row, line)">设置</el-button>
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24">
                            <el-form-item :label="`元素(${line.elem_ids.length}个)`" prop="elem_ids">
                              <draggable v-model="line.elem_ids" @end="itemChanged(row)">
                                <div v-for="(elem_id, index) in line.elem_ids" :key="index">
                                  <el-tag size="mini" type="primary" closable @close="removeMzptElem(row, line, index)" style="margin-right: 5px" v-if="mzptElem(elem_id)">{{mzptElem(elem_id).name}}</el-tag>
                                </div>
                              </draggable>
                              <el-select v-model="mzpt.ids" placeholder="元素列表" multiple filterable clearable :style="{width: '100%'}" @change="mzptItemChanged(row, line)">
                                <el-option v-for="(item, index) in mzptElemOptions" :key="index" :label="item.name"
                                           :value="item.id"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </div>
                      </el-card>
                    </el-row>
                  </template>
                  <template v-else-if="row.type === 4">
                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="X" prop="x">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.svg.x" placeholder="X轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustLeftX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterX(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustRightX(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="Y" prop="y">
                          <el-row>
                            <el-col :span="18">
                              <el-input-number style="width: 100%" v-model="row.svg.y" placeholder="Y轴(单位像素)" :precision="2" :step="50" @change="itemChanged(row)"></el-input-number>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-back" @click="adjustTopY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-plus" @click="adjustCenterY(row)"></el-button>
                            </el-col>
                            <el-col :span="2">
                              <el-button size="mini" type="primary" style="width: 100%" icon="el-icon-right" @click="adjustBottomY(row)"></el-button>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="x方向缩放" prop="scale_x">
                          <el-input-number style="width: 100%" v-model="row.svg.scale_x" :min="0" :max="maxX(row.obj)" :precision="2" placeholder="x方向缩放" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="y方向缩放" prop="scale_y">
                          <el-input-number style="width: 100%" v-model="row.svg.scale_y" :min="0"  :max="maxY(row.obj)" :precision="2" placeholder="y方向缩放" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="Svg链接" prop="url">
                          <el-input style="width: 100%" v-model="row.svg.url" placeholder="路径" @change="itemChanged(row)" clearable>
                            <el-upload slot="append" action="/temu/upload/upload" :headers="{'x-token':token}" :show-file-list="false"
                                       accept=".svg" :on-success="(res) => {handleSvgSuccess(row, res)}" :on-error="handleError" style="width: 100%;">
                              <el-button size="mini" style="width: 200px" type="primary" v-loading.fullscreen.lock="fullscreenLoading">
                                上传Svg
                              </el-button>
                            </el-upload>
                          </el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="24">
                        <el-form-item label="角度" prop="angle">
                          <el-input-number size="mini" style="width: 100%" v-model="row.svg.angle" :min="-360" :max="360" :precision="2" @change="itemChanged(row)"></el-input-number>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </template>
                </div>
              </el-card>
            </div>
            <div style="margin-top: 10px">
              <el-row :gutter="5">
                <template v-if="order_id">
                  <el-col :span="24">
                    <el-button size="medium" style="width: 100%; height: 120px" type="primary" @click="genAndPreview" :disabled="problem > 0 || hasTextLineProblem">保存并预览{{problem}} {{hasTextLineProblem}}</el-button>
                  </el-col>
                </template>
                <template v-else>
                  <el-col :span="12">
                    <el-button size="medium" style="width: 100%" type="primary" @click="createTemplate">{{id ? "更新" : "创建"}}</el-button>
                  </el-col>
                  <el-col :span="12">
                    <el-button size="medium" style="width: 100%" type="warning" @click="exportSvg">导出Svg</el-button>
                  </el-col>
                </template>
              </el-row>
            </div>
          </template>
        </el-form>
      </div>

      <CustomizeDlgPreview :width="previewWidth" :id="dlgPreview.id" :list="dlgPreview.list" :visible="dlgPreview.visible" @close="dlgPreview.visible=false" @suc="genSuc"></CustomizeDlgPreview>
    </div>
  </el-drawer>

</template>

<script>

import {mapGetters} from "vuex";
import {customizeGroupList} from "@/api/customize/group";
import {
  customizeImageBase64, customizeListWithIdName,
  customizeLoad,
  customizeUpdate
} from "@/api/customize/list";
import { fabric } from "fabric";
import KdxImage from "@/components/image/image.vue";
import {mzptElemList, mzptElemLoadList} from "@/api/customize/mzpt_elem";
import {baseImageList} from "@/api/customize/base_image";
import {fontList} from "@/api/customize/font";
import draggable from "vuedraggable";
import {
  customizeOrderLoad,
  customizeOrderPreview,
  customizeOrderUpdate
} from "@/api/customize/order";
import CustomizeDlgPreview from "@/view/customize/components/dlg_preview.vue";
import {mzptColorSeriesList} from "@/api/customize/mzpt_color_series";
import {mzptStandList} from "@/api/customize/mzpt_stand";

export default {
  name: 'CustomizeDlgEditor',
  components: {
    CustomizeDlgPreview,
    draggable,
    KdxImage
  },
  mixins: [],
  data() {
    return {
      fullscreenLoading: false,
      max_width: 1000,
      max_height: 1000,

      previewWidth: 1000,

      personal_text: undefined,
      preview_image: undefined,
      user_select_image: undefined,
      user_upload_image: undefined,
      image: "",

      mzpt: {
        ids: [],
        name: "",
      },

      canvas: undefined,

      customize_id: undefined,

      form: {
        group_id: undefined,

        width: 1000,
        height: 1000,

        name: "",
        separator: "",
        base_image_id: undefined,
        help_base_image: undefined,

        items: []
      },

      problem: 0,
      hasTextLineProblem: false,

      groupOptions: [],
      customizeOptions: [],
      baseImageOptions: [],
      fontOptions: [],
      mzptElemOptions: [],
      mzptElemDetailOptions: [],
      mzptColorSeriesOptions: [],
      mzptStandOptions: [],

      dlgPreview: {
        id: undefined,
        list: [],
        visible: false,
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo", "token"]),
    hasMzpt() {
      return this.form.items.find((item) => {return item.type === 3}) !== undefined
    }
  },
  filters: {},
  mounted() {
    fabric.Object.prototype.set({
      cornerColor: 'lightblue',         // 控件的填充颜色
      cornerStrokeColor: 'blue',    // 控件的边框颜色
      borderColor: 'red',         // 对象边框颜色
      cornerSize: 12,               // 控件的大小
      padding: 0,                  // 控件与对象边缘的距离
      transparentCorners: false     // 控件角落是否透明
    });
    // fabric.Image.prototype.getSvgSrc = function() {
    //   return this.toDataURL();
    // }
  },
  props: {
    id: {
      type: Number,
      default: 0, // 0 表示是创建
    },
    copy_id: {
      type: Number,
      default: 0, // 0 表示是创建
    },
    order_id: {
      type: Number,
      default: 0,
    },
  },
  watch: {
  },
  methods: {
    canSelectBaseImage() {
      // return Math.abs(item.width - this.form.group.png_width) <=5 && Math.abs(item.height - this.form.group.png_height) <= 5 // 宽高在5像素以内
      return true
    },
    baseImageMatch(item) {
      return Math.abs(item.width - this.form.group.png_width) <=5 && Math.abs(item.height - this.form.group.png_height) <= 5 // 宽高在5像素以内
    },
    //处理移除图片
    handleRemove(file) {
      const uploadFiles = this.$refs.upload.uploadFiles
      for (let i = 0; i < uploadFiles.length; i++) {
        if (uploadFiles[i]['url'] === file.url) {
          uploadFiles.splice(i, 1)
          this.cancelHelpBaseImage()
        }
      }
    },
    typeName(row) {
      switch (row.type) {
        case 0:
          if (!row.obj || row.obj._textLines.length <= 1) {
            return "文字"
          }
          return `文字(<span style="background-color: red; color: yellow"> ${row.obj._textLines.length} </span>)行`
        case 1:
          return "图片"
        case 2:
          return "路径"
        case 3:
          return "名字拼图"
        case 4:
          return "Svg"
      }
      return "未知类型: " + row.type
    },
    cancelHelpBaseImage() {
      this.notifyBaseImageChanged()
    },
    onFileChanged(file) {
      this.fullscreenLoading = false
      this.setHelpBaseImage(file)
    },
    setHelpBaseImage(file) {
      this.getBase64(file.raw).then((res)=>{
        fabric.Image.fromURL(
            res,
            (img) => {
              img.top = 0
              img.left = 0
              img.scale(this.form.width / img.width);
              this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
            }
        );
      })
    },
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        const reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    },
    genSuc() {
      this.handleBeforeClose()
      this.$emit("suc")
    },
    handleBeforeClose() {
      this.$emit('close', false)
      for (const item of this.form.items) {
        this.deleteItem(item)
      }
      this.destroyCanvas()
    },
    async onOpened() {
      this.fullscreenLoading = false
      if (this.groupOptions.length <= 0) {
        await this.syncGroupList()
      }
      if (this.customizeOptions.length <= 0) {
        await this.syncCustomizeList()
      }
      if (this.baseImageOptions.length <= 0) {
        this.syncBaseImageList()
      }
      if (this.fontOptions.length <= 0) {
        this.syncFontList()
      }
      if (this.mzptElemOptions.length <= 0) {
        this.syncMzptElemList()
      }
      if (this.mzptColorSeriesOptions.length <= 0) {
        this.syncMzptColorSeries()
      }
      if (this.mzptStandOptions.length <= 0) {
        this.syncMzptStands()
      }

      this.personal_text = ""
      this.preview_image = undefined
      this.user_select_image = undefined
      this.user_upload_image = undefined
      this.image = ""
      this.customize_id = undefined

      // 如果需要加载，那么就加载，如果不需要加载，就初始化
      if (this.id || this.copy_id) {
        // 请求
        let id = this.id
        if (!this.id) {
          id = this.copy_id
        }
        let resp = await customizeLoad({id: id})
        if (resp.code) {
          return
        }

        this.form.group_id = resp.data.group_id
        this.form.name = resp.data.name
        this.form.width = resp.data.width
        this.form.height = resp.data.height
        this.form.separator = resp.data.separator
        this.form.base_image_id = resp.data.base_image_id
        this.form.help_base_image = ""

        this.form.group = this.groupOptions.find((item) => {return item.id === this.form.group_id})

        this.notifyGroupChanged(()=>{
          this.baseImageIdChanged()
          this.$set(this.form, "items", [])
          if (resp.data.items) {
            for (const item of resp.data.items) {
              if (item.type === 0) {
                let d = this.newText()

                d.name = item.name
                d.type = item.type

                Object.assign(d.text, item.text)

                this.itemChanged(d)
              } else if (item.type === 1) {
                let d = this.newImage()

                d.name = item.name
                d.type = item.type

                Object.assign(d.image, item.image)

                this.itemChanged(d)
              } else if (item.type === 2) {
                let d = this.newPath()

                d.name = item.name
                d.type = item.type

                Object.assign(d.path, item.path)

                this.itemChanged(d)
              } else if (item.type === 4) {
                let d = this.newSvg()

                d.name = item.name
                d.type = item.type

                Object.assign(d.svg, item.svg)

                this.itemChanged(d)
              } else if (item.type === 3) {
                let d = this.newMzpt()

                d.name = item.name
                d.type = item.type

                Object.assign(d.mzpt, item.mzpt)

                this.itemChanged(d)
              }
            }
          }
        })
      } else if (this.order_id) {
        let resp = await customizeOrderLoad({id: this.order_id})
        if (resp.code) {
          return
        }

        this.sku_code = resp.data.sku_code
        this.image = resp.data.image
        this.personal_text = resp.data.personal_text
        this.preview_image = resp.data.preview_image
        this.user_select_image = resp.data.user_select_image
        this.user_upload_image = resp.data.user_upload_image

        this.form.width = resp.data.width
        this.form.height = resp.data.height

        this.updateCustomize(resp.data, resp.data.items, resp.data.items.length <= 0)
      } else {
        this.form = {
          group_id: undefined,
          name: "",
          separator: "",
          width: 1000,
          height: 1000,
          base_image_id: undefined,
          help_base_image: undefined,
          items: []
        }
        setTimeout(()=>{
          let left = document.getElementById("left")
          this.max_width = left.offsetWidth
          this.max_height = left.offsetHeight
        }, 100)
      }
    },
    async mzptItemChanged(row, line) {
      let elems = await this.mzptElemDetails(this.mzpt.ids)
      for (const elem of elems) {
        line.elem_ids.push(elem.id)
      }
      this.mzpt.ids = []
      this.itemChanged(row)
    },
    removeMzptElem(row, line, index) {
      line.elem_ids.splice(index, 1)
      this.itemChanged(row)
    },
    setMzptElemIdsByName(row, line) {
      if (!this.mzpt.name) {
        return
      }

      line.elem_ids = line.elem_ids.filter((id) => {
        let op = this.mzptElem(id)
        if (!op) {
          return false
        }
        return !op.letter
      })
      let runes = [...this.mzpt.name]
      for (const rune of runes) {
        let elem = this.mzptElemOptions.find((item) => {return line.letter_ids.indexOf(item.id) >= 0 && item.letter === rune.toUpperCase()})
        if (!elem) {
          this.$message.error(`字母: ${rune} 没找到`)
          return
        }

        line.elem_ids.push(elem.id)
      }
      this.itemChanged(row)
    },
    notifyBaseImageChanged() {
      let canvas = this.canvas
      if (!canvas) {
        return
      }

      if (!this.form.base_image) {
        canvas.setBackgroundImage(undefined, canvas.renderAll.bind(canvas));
        return
      }

      this.problem++

      let url = this.form.base_image.thumbnail_url + "?imageView2/2/w/1000/q/70"

      fabric.Image.fromURL(
          url,
          (img) => {
            img.top = 0
            img.left = 0
            if (this.form.width / img.width > this.form.height / img.height) {
              img.scale(this.form.width / img.width);
            } else {
              img.scale(this.form.height / img.height);
            }
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

            this.problem--
          }
      );
    },
    baseImageIdChanged() {
      if (!this.form.base_image_id) {
        this.form.base_image = undefined
      } else {
        this.form.base_image = this.baseImageOptions.find((item) => {return item.id === this.form.base_image_id})
      }
      this.notifyBaseImageChanged()
    },
    notifyGroupChanged(callback) {
      if (!this.form.group) {
        return
      }

      setTimeout(()=>{
        if (this.canvas) {
          this.destroyCanvas()
        }

        let canvas = new fabric.Canvas("canvas", {containerClass: "canvas-container"});
        let width = this.form.width
        let height = this.form.height
        let scaleRatio = Math.min(this.max_width / width, this.max_height / height)

        // 加两个白点
        canvas.add(new fabric.Rect({ top: 0, left: 0, width: 1, height: 1, lockMovementX: true, lockMovementY: true, fill: "#FFFFFF" }))
        canvas.add(new fabric.Rect({ top: height-2, left: width-2, width: 1, height: 1, lockMovementX: true, lockMovementY: true, fill: "#FFFFFF" }))

        this.previewWidth = width * scaleRatio
        canvas.setDimensions({ width: width * scaleRatio, height: height * scaleRatio });
        canvas.setZoom(scaleRatio)
        this.canvas = canvas

        this.canvas.on('object:modified', this.objChanged);
        this.canvas.on('selection:updated', this.objSelectionChanged);
        this.canvas.on('selection:created', this.objSelectionChanged);
        this.resetItems()

        if (callback) {
          callback()
        }
      }, 100)
    },
    destroyCanvas() {
      if (!this.canvas) {
        return
      }
      this.canvas.clear()
      this.canvas.remove()
      this.canvas = undefined

      document.getElementById("left_canvas").innerHTML = ""

      let canvas = document.createElement('canvas');
      canvas.id = "canvas";
      canvas.ref = "canvas";
      canvas.width = this.form.width;
      canvas.height = this.form.height;
      canvas.style.display = "block"
      canvas.style.margin = "auto"
      canvas.style.border = "1px solid pink"
      document.getElementById("left_canvas").appendChild(canvas)
    },
    customizeIdChanged() {
      this.$confirm("确认是否变更定制配置?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
          .then(async () => {
            let resp = await customizeLoad({id: this.customize_id})
            if (resp.code) {
              return
            }

            this.destroyCanvas()

            this.updateCustomize(resp.data, resp.data.items, true)
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消"
            });
          });
    },
    updateCustomize(base, items, needInit) {
      this.form.group_id = base.group_id
      this.form.separator = base.separator
      this.form.base_image_id = base.base_image_id
      this.form.help_base_image = ""
      this.form.width = base.width
      this.form.height = base.height

      this.$set(this.form, "group", this.groupOptions.find((item) => {return item.id === this.form.group_id}))
      this.form.base_image = this.baseImageOptions.find((item) => {return item.id === this.form.base_image_id})

      for (const item of this.form.items) {
        this.deleteItem(item)
      }
      this.notifyGroupChanged(()=>{
        this.baseImageIdChanged()
        this.$set(this.form, "items", [])

        for (const item of items) {
          if (item.type === 0) {
            let d = this.newText()

            d.name = item.name
            d.type = item.type

            Object.assign(d.text, item.text)

            this.itemChanged(d)
          } else if (item.type === 1) {
            let d = this.newImage()

            d.name = item.name
            d.type = item.type

            Object.assign(d.image, item.image)

            if (!d.image.url && this.user_select_image) {
              d.image.url = this.user_select_image
            }

            this.itemChanged(d)
          } else if (item.type === 2) {
            let d = this.newPath()

            d.name = item.name
            d.type = item.type

            Object.assign(d.path, item.path)

            this.itemChanged(d)
          } else if (item.type === 4) {
            let d = this.newSvg()

            d.name = item.name
            d.type = item.type

            Object.assign(d.svg, item.svg)

            this.itemChanged(d)
          } else if (item.type === 3) {
            let d = this.newMzpt()

            d.name = item.name
            d.type = item.type

            Object.assign(d.mzpt, item.mzpt)

            this.itemChanged(d)
          }
        }

        if (needInit && this.personal_text) {
          let textItems = this.form.items.filter((item) => {return item.type === 0})

          let array = this.personal_text.split(base.separator ? base.separator : "\n")
          let maxLen = Math.max(array.length, textItems.length)

          for (let i = 0; i < maxLen; i++) {
            let item = undefined
            if (i < textItems.length) {
              item = textItems[i]
            } else {
              if (this.form.group.type === 4) { // 名字拼图
                continue
              }
              item = this.newText()
            }
            if (i < array.length) {
              item.text.default_value = array[i].trim()
            }
            this.itemChanged(item)
          }

          // TODO 处理图片
          // let imgItems = this.form.items.filter((item) => {return item.type === 1})
        }
      })
    },
    groupIdChanged() {
      if (!this.form.group_id) {
        this.form.group = undefined
        return
      }
      this.form.group = this.groupOptions.find((item) => {return item.id === this.form.group_id})
      if (this.form.group) {
        this.form.width = this.form.group.png_width
        this.form.height = this.form.group.png_height
      }
      this.notifyGroupChanged(() => {
        if (!this.form.items.length) {
          this.addNewText()
        }
        this.notifyBaseImageChanged()
      })
    },
    async genAndPreview() {
      // 检查参数
      if (!this.check()) {
        return
      }
      let data = {}
      data.id = this.order_id
      data.group_id = this.form.group_id
      data.base_image_id = this.form.base_image_id
      data.width = this.form.width
      data.height = this.form.height
      if (!data.base_image_id) {
        data.base_image_id = 0
      }
      data.items = []

      for (let seq = 0; seq < this.form.items.length; seq++) {
        let item = this.form.items[seq]

        let d = {}
        d.name = item.name
        d.type = item.type
        d.sequence = seq
        d.x = item.x
        d.y = item.y
        d.width = item.width

        if (item.type === 0) {
          d.text = {}
          Object.assign(d.text, item.text)
        } else if (item.type === 1) {
          d.image = {}
          Object.assign(d.image, item.image)
        } else if (item.type === 2) {
          d.path = {}
          Object.assign(d.path, item.path)
        } else if (item.type === 3) {
          d.mzpt = {}
          Object.assign(d.mzpt, item.mzpt)

          if (!item.mzpt.stand_id) {
            d.mzpt.stand_id = 0
          }

          for (const line of d.mzpt.lines) {
            if (!line.color_series_id) {
              line.color_series_id = 0
            }
          }
        } else if (item.type === 4) {
          d.svg = {}
          Object.assign(d.svg, item.svg)
        }

        data.items.push(d)
      }

      let resp = await customizeOrderUpdate(data)
      if (resp.code) {
        return
      }

      this.$message("保存成功")

      this.getSvg(async (svg) => {
        let resp = await customizeOrderPreview({id: this.order_id, svg: svg})
        if (resp.code) {
          return
        }

        // 数据传入预览页面
        this.dlgPreview.id = this.order_id
        this.dlgPreview.list = resp.data
        this.dlgPreview.visible = true
      })
    },
    check() {
      if (!this.order_id && !this.form.name) {
        this.$message.error("请输入名字")
        return
      }
      if (!this.form.group_id) {
        this.$message.error("请选择定制组")
        return
      }

      return true
    },
    async createTemplate() {
      // 检查参数
      if (!this.check()) {
        return
      }
      let data = {}
      data.id = this.id
      data.group_id = this.form.group_id
      data.name = this.form.name
      data.width = this.form.width
      data.height = this.form.height
      data.separator = this.form.separator
      data.base_image_id = this.form.base_image_id
      data.items = []

      for (let seq = 0; seq < this.form.items.length; seq++) {
        let item = this.form.items[seq]

        let d = {}
        d.name = item.name
        d.type = item.type

        if (item.type === 0) {
          d.text = {}
          Object.assign(d.text, item.text)
        } else if (item.type === 1) {
          d.image = {}
          Object.assign(d.image, item.image)
        } else if (item.type === 2) {
          d.path = {}
          Object.assign(d.path, item.path)
        } else if (item.type === 4) {
          d.svg = {}
          Object.assign(d.svg, item.svg)
        } else if (item.type === 3) {
          d.mzpt = {}
          Object.assign(d.mzpt, item.mzpt)
        }

        data.items.push(d)
      }

      let resp = await customizeUpdate(data)
      if (resp.code) {
        return
      }

      this.$message("成功")
      this.handleBeforeClose()
      this.$emit("suc")
    },
    exportSvg() {
      this.getSvg(this.copy)
    },
    async getSvg(callback) {
      callback(this.canvas.toSVG({ suppressPreamble: true }))
    },
    copy(text) {
      this.$copyText(text).then( () => {
        this.$message('复制成功')
      }, function () {
        this.$message.error('复制失败')
      })
    },
    async loadImageBase64(item) {
      if (!item.image.url) {
        return
      }
      let url = `${item.image.url}?imageMogr2/auto-orient/thumbnail/${item.image.width}x${item.image.height}!`
      let resp = await customizeImageBase64({url: url})
      if (resp.code) {
        return
      }

      return "data:image/png;base64," + resp.data
    },
    removeSpace(item) {
      item.text.default_value = item.text.default_value.trim()
      this.itemChanged(item)
    },
    firstUp(item) {
      let newStr = item.text.default_value.split(" ");
      for (let i = 0; i < newStr.length; i++) {
        newStr[i] = newStr[i].slice(0, 1).toUpperCase() + newStr[i].slice(1).toLowerCase();
      }
      item.text.default_value = newStr.join(" ")
      this.itemChanged(item)
    },
    adjustLeftX(item, line) {
      if (item.type === 0) {
        item.text.x = item.text.width / 2
      } else if (item.type === 1) {
        item.image.x = 0
      } else if (item.type === 2) {
        item.path.x = 0
      } else if (item.type === 4) {
        item.svg.x = 0
      } else if (item.type === 3) {
        line.x = 0
      }
      this.itemChanged(item)
    },
    adjustCenterX(item, line) {
      if (item.type === 0) {
        item.text.x = (this.form.width) / 2
      } else if (item.type === 1) {
        item.image.x = (this.form.width - item.image.width) / 2
      } else if (item.type === 2) {
        item.path.x = (this.form.width - item.obj.width * item.path.scale_x) / 2
      } else if (item.type === 4) {
        item.svg.x = (this.form.width - item.obj.width * item.svg.scale_x) / 2
      } else if (item.type === 3) {
        line.x = (this.form.width) / 2 // TODO
      }
      this.itemChanged(item)
    },
    adjustRightX(item, line) {
      if (item.type === 0) {
        item.text.x = this.form.width - item.text.width/2
      } else if (item.type === 1) {
        item.image.x = this.form.width - item.image.width
      } else if (item.type === 2) {
        item.path.x = this.form.width - item.obj.width * item.path.scale_x
      } else if (item.type === 2) {
        item.svg.x = this.form.width - item.obj.width * item.svg.scale_x
      } else if (item.type === 3) {
        line.x = this.form.width
      }
      this.itemChanged(item)
    },
    adjustTopY(item, line) {
      if (item.type === 0) {
        item.text.y = item.text.font_size / 2
      } else if (item.type === 1) {
        item.image.y = 0
      } else if (item.type === 2) {
        item.path.y = 0
      } else if (item.type === 4) {
        item.svg.y = 0
      } else if (item.type === 3) {
        line.y = 0
      }
      this.itemChanged(item)
    },
    adjustCenterY(item, line) {
      if (item.type === 0) {
        item.text.y = this.form.height / 2
      } else if (item.type === 1) {
        item.image.y = (this.form.height - item.image.height) / 2
      } else if (item.type === 2) {
        item.path.y = (this.form.height - item.obj.height * item.path.scale_y) / 2
      } else if (item.type === 4) {
        item.svg.y = (this.form.height - item.obj.height * item.svg.scale_y) / 2
      } else if (item.type === 3) {
        line.y = (this.form.height - line.obj.height) / 2 // TODO
      }
      this.itemChanged(item)
    },
    adjustBottomY(item, line) {
      if (item.type === 0) {
        item.text.y = this.form.height - item.text.font_size / 2
      } else if (item.type === 1) {
        item.image.y = this.form.height - item.image.height
      } else if (item.type === 2) {
        item.path.y = this.form.height - item.obj.height * item.path.scale_y
      } else if (item.type === 4) {
        item.svg.y = this.form.height - item.obj.height * item.svg.scale_y
      } else if (item.type === 3) {
        line.y = this.form.height - line.obj.height
      }
      this.itemChanged(item)
    },
    addNewLine(row) {
      row.mzpt.lines.push({
        x: 0,
        y: 0,
        width: this.form.width,
        elem_ids: [],
        color_series_id: undefined,
        left_gap: 10,
        right_gap: 10,
        gap: 0,
      })
      this.itemChanged(row)
    },
    deleteLine(row, line) {
      row.mzpt.lines = row.mzpt.lines.filter((item) => {return item !== line})
      if (this.canvas && line.obj) {
        this.canvas.remove(line.obj)
      }
      this.itemChanged(row)
    },
    deleteItem(row) {
      let index = this.form.items.findIndex((item) => {return item === row})
      if (index < 0) {
        return
      }
      this.form.items = this.form.items.filter((item) => {
        return item !== row
      })
      if (this.canvas) {
        if (row.type === 3) {
          if (row.rect) {
            this.canvas.remove(row.rect)
          }
          for (const line of row.mzpt.lines) {
            if (line.obj) {
              this.canvas.remove(line.obj)
            }
          }
        } else {
          if (row.obj) {
            this.canvas.remove(row.obj)
          }
        }
      }
      if (this.form.items.length <= 0) {
        return
      }

      for (const item of this.form.items) {
        if (item.show) {
          return
        }
      }
      if (index === 0) {
        this.showItem(this.form.items[index])
      } else if (index + 1 >= this.form.items.length) {
        this.showItem(this.form.items[index-1])
      } else {
        this.showItem(this.form.items[index])
      }
    },
    downItem(idx) {
      let item = this.form.items[idx+1]
      this.$set(this.form.items, idx+1, this.form.items[idx])
      this.$set(this.form.items, idx, item)
    },
    upItem(idx) {
      let item = this.form.items[idx-1]
      this.$set(this.form.items, idx-1, this.form.items[idx])
      this.$set(this.form.items, idx, item)
    },
    topItem(idx) {
      let item = this.form.items[idx]
      for (let i = idx; i > 0; i--) {
        this.$set(this.form.items, i, this.form.items[i-1])
      }
      this.$set(this.form.items, 0, item)
    },
    bottomItem(idx) {
      let item = this.form.items[idx]
      for (let i = idx; i < this.form.items.length-1; i++) {
        this.$set(this.form.items, i, this.form.items[i+1])
      }
      this.$set(this.form.items, this.form.items.length-1, item)
    },
    copyItem(item) {
      if (item.type === 0) {
        let d = this.addNewText()

        d.name = item.name
        d.type = item.type

        Object.assign(d.text, item.text)

        this.itemChanged(d)
      } else if (item.type === 1) {
        let d = this.addNewImage()

        d.name = item.name
        d.type = item.type

        Object.assign(d.image, item.image)

        this.itemChanged(d)
      } else if (item.type === 2) {
        let d = this.addNewPath()

        d.name = item.name
        d.type = item.type

        Object.assign(d.path, item.path)

        this.itemChanged(d)
      } else if (item.type === 4) {
        let d = this.addNewSvg()

        d.name = item.name
        d.type = item.type

        Object.assign(d.svg, item.svg)

        this.itemChanged(d)
      } else if (item.type === 3) {
        let d = this.addNewMzpt()

        d.name = item.name
        d.type = item.type

        Object.assign(d.mzpt, item.mzpt)

        for (const line of d.mzpt.lines) {
          line.obj = undefined
          line.gap = 0
        }

        this.itemChanged(d)
      }
    },
    showItem(item) {
      if (item.show) {
        item.show = false
        return
      }

      item.show = true
      if (item.obj && this.canvas) {
        this.canvas.setActiveObject(item.obj)
        this.canvas.requestRenderAll();
      }
      this.form.items.forEach((v) => {
        if (v !== item) {
          v.show = false
        }
      })
    },
    font(name) {
      return this.fontOptions.find((item) => {return item.name === name})
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
    loadAndUse(font, callback) {
      if (this.checkFont(font.name)) {
        if (callback) {
          callback()
        }
        return;
      }

      if (!font.resource) {
        return
      }

      let prefont = new FontFace(font.name, `url('${font.resource.url}')`);
      prefont.load().then((loaded_face) => {
        document.fonts.add(loaded_face);
        if (callback) {
          callback()
        }
      }).catch((error) => {
        alert("字体加载失败" + error);
      });
    },
    setAndLoadFont(item) {
      let font = this.font(item.text.font_family)
      if (!font) {
        return
      }
      this.loadAndUse(font, () => {
        if (item.text.font === font) {
          return
        }

        item.text.font = font
        this.itemChanged(item)
      })
    },
    itemFontFamilyChanged(item) {
      this.setAndLoadFont(item)
    },
    imageClipPathChanged(item) {
      if (item.image.clip_path) {
        let path = new fabric.Path(item.image.clip_path);
        item.image.width = path.width
        item.image.height = path.height
      }
      this.itemChanged(item)
    },
    changeTextAlight(item, ta) {
      item.text.text_align = ta
      this.itemChanged(item)
    },
    changeTextPathSide(item) {
      if (item.text.path_side === "right") {
        item.text.path_side = "left"
      } else {
        item.text.path_side = "right"
      }
      this.itemChanged(item)
    },
    changeWh() {
      if (!this.canvas) {
        return
      }

      setTimeout(() => {
        let width = this.form.width
        let height = this.form.height
        let scaleRatio = Math.min(this.max_width / width, this.max_height / height)

        this.previewWidth = width * scaleRatio
        this.canvas.setDimensions({ width: width * scaleRatio, height: height * scaleRatio });
        this.canvas.setZoom(scaleRatio)
        this.notifyBaseImageChanged()
        for (const item of this.form.items) {
          this.itemChanged(item)
        }
      }, 100)
    },
    maxX() {
      // if (!obj) {
      //   return 100
      // }
      // return this.form.width / obj.width
      return 100
    },
    maxY() {
      // if (!obj) {
      //   return 100
      // }
      // return this.form.height / obj.height
      return 100
    },
    itemChanged(item) {
      if (item.type === 0) {
        this.onTextItemChanged(item, this.canvas);
      } else if(item.type === 1) {
        this.onImageItemChanged(item, this.canvas)
      } else if(item.type === 2) {
        this.onPathItemChanged(item, this.canvas)
      } else if(item.type === 3) {
        this.onMzptElemItemChanged(item, this.canvas)
      } else if(item.type === 4) {
        this.onSvgChanged(item, this.canvas)
      }
      if (this.canvas) {
        if (item.obj && this.canvas) {
          this.canvas.setActiveObject(item.obj)
        }
        this.canvas.requestRenderAll();
      }
    },
    resetItems() {
      // 重新渲染所有组件
      // 如果存在了，就直接加进去
      for (const item of this.form.items) {
        this.onAddItem(this.canvas, item)
      }
      this.canvas.requestRenderAll();
    },
    addNewPath() {
      let item = this.newPath()
      this.showItem(item)
      this.onAddItem(this.canvas, item)

      return item
    },
    newPath() {
      let item = {
        name: "路径",
        type: 2, // 0 表示文字，1表示图片

        path: {
          x: this.form.width/2,
          y: this.form.height/2,
          // 图片参数
          path: "M138.7717,22.7297c106.9649,19.2857,62.6136,115.714,62.6136,115.714l-106.9649,32.1428L.5,82.7295V.5864L138.7717,22.7297Z", // 测试图片
          scale_x: 1,
          scale_y: 1,
          angle: 0,
        },

        show: false,
      }
      this.form.items.push(item)

      return item
    },
    addNewSvg() {
      let item = this.newSvg()
      this.showItem(item)
      this.onAddItem(this.canvas, item)

      return item
    },
    newSvg() {
      let item = {
        name: "Svg",
        type: 4, // 0 表示文字，1表示图片

        svg: {
          x: 0,
          y: 0,
          url: "", // 链接
          scale_x: 1,
          scale_y: 1,
          angle: 0,
        },

        show: false,
      }
      this.form.items.push(item)

      return item
    },
    addNewMzpt() {
      let item = this.newMzpt()

      this.showItem(item)
      this.onAddItem(this.canvas, item)

      return item
    },
    newMzpt() {
      let item = {
        name: "名字拼图",
        type: 3, // 0 表示文字，1表示图片

        mzpt: {
          rx: 50,
          ry: 50,
          bottom_thickness: 5,
          top_thickness: 5,
          letter_thickness: 5,
          stand_id: undefined,

          lines: [
            {
              x: 0,
              y: 0,
              elem_ids: [],
              letter_ids: [],
              color_series_id: undefined,
              left_gap: 100,
              right_gap: 100,
              gap: 0,
            }
          ],
        },

        show: false,
      }

      this.form.items.push(item)

      return item
    },
    addNewImage() {
      let item = this.newImage()
      this.showItem(item)
      this.onAddItem(this.canvas, item)

      return item
    },
    newImage() {
      let item = {
        name: "图片",
        type: 1, // 0 表示文字，1表示图片

        image: {
          x: (this.form.width-200)/2,
          y: (this.form.height-200)/2,
          width: 2000,
          height: 2000,
          angle: 0,
          url: "https://image.szkdx.work/upload/2023/12/28/17/20/c04b1867-4b16-4efc-9976-97890428715c.png", // 测试图片
          clip_path: "",
        },

        show: false,
      }
      this.form.items.push(item)
      return item
    },
    addNewText() {
      let item = this.newText()
      this.showItem(item)
      this.onAddItem(this.canvas, item)

      return item
    },
    newText() {
      let item = {
        name: "名字",
        type: 0, // 0 表示文字，1表示图片

        text: {
          x: this.form.width/2,
          y: (this.form.height-50)/2,
          width: this.form.width,
          default_value: "Value",

          // 文本参数
          limit: 15,
          angle: 0,
          text_align: "center",
          font_size: 500,
          font_family: "",
          char_spacing: 0,
          stroke_width: 0,
          line: 1,
          is_center: true,
          stroke: "", // 设置描边颜色
          font: undefined,
          font_color: "#000000",
          font_weight: "",
          shadow_color: "",
          shadow_offset_x: 0,
          shadow_offset_y: 0,
          path: "",
          path_side: "left",
        },

        show: false,
      }
      this.form.items.push(item)
      return item
    },
    onTextItemChanged(item, canvas) {
      // 文字
      let path = undefined
      if (item.text.path) {
        path = new fabric.Path(item.text.path, {fill: "transparent", stroke: null, strokeWidth: 0});
        let pathInfo = fabric.util.getPathSegmentsInfo(path.path);
        path.segmentsInfo = pathInfo;
      }

      if (item.text.font_family && !item.text.font) {
        let font = this.font(item.text.font_family)
        if (!font) {
          this.$message.error(`没加载到字体: ${item.text.font_family}`)
          return
        }

        this.problem++

        this.loadAndUse(font, ()=>{
          item.text.font = font
          this.onTextItemChanged(item, canvas)
          this.problem--
        })

        return
      }

      let line = item.text.line || 1

      if (!item.text.is_center) {
        item.text.x += item.text.width/2
        item.text.y += line*item.text.font_size/2
        item.text.is_center = true
      }

      let tb = new fabric.Textbox(item.text.default_value.trim(), {
        left: item.text.x,
        top: item.text.y,
        width: item.text.width,
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
        originY: 'center'
        // editable: false,
      });
      if (item.text.path) {
        let path = new fabric.Path(item.text.path, {fill: "transparent", stroke: null, strokeWidth: 0});
        let pathInfo = fabric.util.getPathSegmentsInfo(path.path);
        path.segmentsInfo = pathInfo;
        tb.set("path", path)
      }

      if (item.text.shadow_color) {
        tb.shadow = new fabric.Shadow({
          color: item.text.shadow_color,
          offsetX: item.text.shadow_offset_x,
          offsetY: item.text.shadow_offset_y,
        })
      }
      this.setColor(tb, item.text.font_color)
      tb.setControlsVisibility({ "mb": false, "mt": false, "bl": false, "br": false, "tl": false, "tr": false })
      if (canvas && item.obj) {
        canvas.remove(item.obj)
      }
      canvas.add(tb)
      item.obj = tb

      this.updateHasTextProblem()
    },
    updateHasTextProblem() {
      for (const item of this.form.items) {
        if (item.type === 0 && item.obj) {
          if (item.obj._textLines.length > (item.text.line || 1)) {
            // 行数超出
            this.hasTextLineProblem = true
            return
          }

          if (item.obj.width > (item.text.width+1)) {
            // 宽度超出
            this.hasTextLineProblem = true
            return
          }
        }
      }
      this.hasTextLineProblem = false
    },
    onImageItemChanged(item, canvas) {
      let url = item.image.url
      if (url.startsWith("http")) {
        // url = `${item.image.url}?imageMogr2/auto-orient/thumbnail/${item.image.width}x${item.image.height}!`
      }

      this.problem++
      fabric.Image.fromURL(
          //本地图片需要通过require来引入,require("./xxx.jpeg")
          url,
          (img) => {
            // width: item.image.width, height: item.image.height
            img.set({left: item.image.x, top: item.image.y, crossOrigin: 'anonymous', scaleX: item.image.width / img.width, scaleY: item.image.height / img.height});

            if (item.image.clip_path) {
              img.clipPath = new fabric.Path(item.image.clip_path, {absolutePositioned: true,
                originX: 'center',
                originY: 'center',
                scaleX: 1,
                scaleY: 1,
                fill: "transparent",
                stroke: null,
                strokeWidth: 0,
              });
            }

            if (canvas && item.obj) {
              canvas.remove(item.obj)
            }

            img.angle = item.image.angle

            item.obj = img
            canvas.add(img);

            this.problem--
          }
      );
    },
    onPathItemChanged(item, canvas) {
      let path = new fabric.Path(item.path.path, {
        stroke: 'red',
        strokeWidth: 2,
        fill: false,
        originX: 'left',
        originY: 'top',
        scaleX: item.path.scale_x,
        scaleY: item.path.scale_y,
        left: item.path.x,
        top: item.path.y,
        angle: item.path.angle,
      });
      if (canvas && item.obj) {
        canvas.remove(item.obj)
      }

      item.obj = path
      canvas.add(path);
    },
    onSvgChanged(item, canvas) {
      this.problem++

      let t = this
      fabric.loadSVGFromURL(item.svg.url, function(objects, options) {
        let svg = fabric.util.groupSVGElements(objects, options);
        svg.scaleX = item.svg.scale_x
        svg.scaleY = item.svg.scale_y
        svg.left = item.svg.x
        svg.top = item.svg.y
        svg.angle = item.svg.angle

        if (canvas && item.obj) {
          canvas.remove(item.obj)
        }

        item.obj = svg
        canvas.add(svg);
        t.problem--
      });
    },
    async onMzptElemItemChanged(item, canvas) {
      if (canvas && item.rect) {
        canvas.remove(item.rect)
      }
      item.rect = new fabric.Rect({
        top: 0,
        left: 0,
        rx: item.mzpt.rx,
        ry: item.mzpt.ry,
        width: this.form.width-1.5,
        height: this.form.height-1.5,
        stroke: "green",
        stroke_width: 2,
        lockMovementX: true,
        lockMovementY: true,
        fill: "transparent",
      })
      item.rect.setControlsVisibility({ "ml": false, "mr": false, "mb": false, "mt": false, "bl": false, "br": false, "tl": false, "tr": false, "mtr": false })
      canvas.add(item.rect)

      let elem_ids = []
      for (const line of item.mzpt.lines) {
        elem_ids.push(...line.elem_ids)
      }
      let details = await this.mzptElemDetails(elem_ids)
      for (const line of item.mzpt.lines) {
        let paths = []
        let totalWidth = 0
        let elems = []
        let maxHeight = 0
        let xOffset = 0
        let yOffset = 0
        let colorIndex = 0
        for (const id of line.elem_ids) {
          let elem = details.find((item) => {
            return item.id === id
          })
          if (elem) {
            elems.push(elem)
            totalWidth += elem.width
            let path = new fabric.Path(elem.outer_path, {
              stroke: 'red',
              strokeWidth: 10,
              fill: "transparent",
              originX: 'left',
              originY: 'top',
              scaleX: 1,
              scaleY: 1,
              left: line.x + elem.offset_x,
              top: line.y + elem.offset_y,
            });
            if (elem.letter && line.color_series_id) {
              let s = this.mzptColorSeriesOptions.find((item)=>{return item.id === line.color_series_id})
              if (s) {
                let color = s.colors[colorIndex % s.colors.length]
                path.fill = color
              }

              colorIndex++
            }
            paths.push(path)

            if (paths.length === 1) {
              xOffset = elem.offset_x + line.left_gap
            }
            yOffset = yOffset === 0 ? elem.offset_y : Math.min(yOffset, elem.offset_y)

            maxHeight = Math.max(maxHeight, elem.height)
          }
        }

        if (paths.length > 0) {
          let preX = line.x+line.left_gap

          let gap;
          if (paths.length > 1) {
            gap = (this.form.width - line.left_gap - line.right_gap - totalWidth) / (paths.length - 1)
            line.gap = gap / 283.5
          } else {
            preX += (this.form.width - line.left_gap - line.right_gap - totalWidth) / 2
            line.gap = 0
          }


          for (let i = 0; i < paths.length; i++) {
            let p = paths[i]
            let elem = elems[i]

            p.left = preX + elem.offset_x

            preX += elem.width + gap
          }

          paths.push(new fabric.Rect({
            top: line.y,
            left: line.x,
            width: this.form.width,
            height: maxHeight,
            stroke: "red",
            stroke_width: 2,
            fill: "transparent",
            visible: false,
          }))
          xOffset = 0
          yOffset = 0
        }

        let group = new fabric.Group(paths, {
          left: line.x + xOffset,
          top: line.y + yOffset,
        });
        group.setControlsVisibility({ "ml": false, "mr": false, "mb": false, "mt": false, "bl": false, "br": false, "tl": false, "tr": false, "mtr": false })

        if (canvas && line.obj) {
          canvas.remove(line.obj)
        }

        line.obj = group
        canvas.add(group);
      }
    },
    onAddItem(canvas, item) {
      if (!canvas) {
        return
      }

      if (item.type === 0) {
        this.onTextItemChanged(item, canvas);
      } else if (item.type === 1) {
        this.onImageItemChanged(item, canvas);
      } else if (item.type === 2) {
        this.onPathItemChanged(item, canvas);
      } else if (item.type === 3) {
        this.onMzptElemItemChanged(item, canvas);
      } else if(item.type === 4) {
        this.onSvgChanged(item, this.canvas)
      }
    },
    setColor(obj, color) {
      let array = (color || "").split(";").filter((item)=> { return item !== "" })
      if (array.length <= 1) {
        obj.set("fill", color)
        return
      }

      let colorIndex = 0
      for(let i = 0; i < obj.text.length; i++) {
        let t = obj.text[i]
        if (t === " ") {
          continue
        }

        if (array.length <= 0) {
          obj.setSelectionStyles({ fill: "transparent" }, i, i+1);
        } else {
          obj.setSelectionStyles({ fill: array[colorIndex % array.length] }, i, i+1);
        }

        colorIndex++
      }
    },
    async syncMzptDetail(ids) {
      let notFoundIds = ids.filter((id) => {
        return !this.mzptElemDetailOptions.find((item) => {return item.id === id})
      })
      if (!notFoundIds.length) {
        return
      }

      let resp = await mzptElemLoadList({ids: notFoundIds})
      if (resp.code) {
        return
      }

      for (const e of resp.data) {
        this.mzptElemDetailOptions.push(e)
      }
    },
    async mzptElemDetails(ids) {
      await this.syncMzptDetail(ids)
      return this.mzptElemDetailOptions.filter((item) => {return ids.indexOf(item.id) >= 0})
    },
    mzptElem(id) {
      return this.mzptElemOptions.find((item) => {return item.id === id})
    },
    objSelectionChanged(e) {
      if (!e.selected.length) {
        return
      }

      for (const item of this.form.items) {
        if (item.obj === e.selected[0]) {
          if (!item.show) {
            this.showItem(item)
            return
          }
        }
      }
    },
    objChanged(e) {
      this.form.items.forEach((item) => {
        if (item.type === 3) {
          for (const line of item.mzpt.lines) {
            if (line.obj === e.target) {
              line.x = Math.floor(line.obj.left*100)/100
              line.y = Math.floor(line.obj.top*100)/100
              return
            }
          }
          return
        }

        if (item.obj !== e.target) {
          return
        }

        if (item.type === 0) {
          // 处理文字
          item.text.x = Math.floor(item.obj.left*100)/100
          item.text.y = Math.floor(item.obj.top*100)/100
          item.text.width = Math.floor(item.obj.width*100)/100
          item.text.angle = Math.floor(item.obj.angle*100)/100
          item.text.default_value = item.obj.text
        } else if (item.type === 1) {
          item.image.x = Math.floor(item.obj.left*100)/100
          item.image.y = Math.floor(item.obj.top*100)/100
          item.image.width = Math.floor(item.obj.width*item.obj.scaleX*100)/100
          item.image.height = Math.floor(item.obj.height*item.obj.scaleY*100)/100
          item.image.angle = Math.floor(item.obj.angle*100)/100
        } else if (item.type === 2) {
          item.path.x = Math.floor(item.obj.left*100)/100
          item.path.y = Math.floor(item.obj.top*100)/100
          item.path.scale_x = item.obj.scaleX
          item.path.scale_y = item.obj.scaleY
          item.path.angle = Math.floor(item.obj.angle*100)/100
        } else if (item.type === 4) {
          item.svg.x = Math.floor(item.obj.left*100)/100
          item.svg.y = Math.floor(item.obj.top*100)/100
          item.svg.scale_x = item.obj.scaleX
          item.svg.scale_y = item.obj.scaleY
          item.svg.angle = Math.floor(item.obj.angle*100)/100
        }
      })
    },
    async syncGroupList() {
      let resp = await customizeGroupList({})
      if (resp.code) {
        return
      }
      this.groupOptions = resp.data
    },
    async syncCustomizeList() {
      let resp = await customizeListWithIdName({})
      if (resp.code) {
        return
      }
      this.customizeOptions = resp.data
    },
    async syncBaseImageList() {
      let resp = await baseImageList()
      if (resp.code) {
        return
      }
      this.baseImageOptions = resp.data
    },
    async syncFontList() {
      let resp = await fontList()
      if (resp.code) {
        return
      }
      this.fontOptions = resp.data
    },
    async syncMzptElemList() {
      let resp = await mzptElemList()
      if (resp.code) {
        return
      }
      this.mzptElemOptions = resp.data
    },
    async syncMzptColorSeries() {
      let resp = await mzptColorSeriesList()
      if (resp.code) {
        return
      }
      this.mzptColorSeriesOptions = resp.data
    },
    async syncMzptStands() {
      let resp = await mzptStandList()
      if (resp.code) {
        return
      }
      this.mzptStandOptions = resp.data
    },
    beforeUpload() {
      this.fullscreenLoading = true
      return true
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
        this.syncBaseImageList()
      }
    },
    handleSvgSuccess(item, res) {
      this.fullscreenLoading = false
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }

      item.svg.url = res.data
      this.itemChanged(item)
    },
    handleImageSuccess(item, res) {
      if (res.code !== 0) {
        this.$message.error("上传失败!" + res.msg);
        return
      }
      item.image.url = res.data
      this.itemChanged(item)
    },
    handleError(err) {
      this.fullscreenLoading = false
      this.$message.error("上传失败!" + err);
    },
  },
}
</script>
<style scoped lang="scss">
  .left {
    //background: lightblue;
    width: 1000px;
    height: 100%;
    display: inline-block;
    //background-color: red;
  }

  .right {
    width: calc(100% - 1000px);
    height: 100%;
    display: inline-block;
    //background-color: green;
  }

  ::v-deep .el-card__body, .el-main {
    padding: 0 10px !important;
  }

  ::v-deep .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 5px !important;
    margin-top: 5px !important;
  }

  ::v-deep .el-upload--text {
    width: 100%;
  }
</style>
<style>
  .canvas-container {
    display: block;
    margin: auto;
    background-color: lightblue;
  }
  .template-canvas-container {
    display: none;
    margin: auto;
  }
</style>