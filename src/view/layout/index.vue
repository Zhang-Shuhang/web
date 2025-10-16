<template>
    <el-container class="layout-cont">
        <el-container :class="[isSider ? 'openside' : 'hideside', isMobile ? 'mobile' : '']">
            <el-row :class="[isShadowBg ? 'shadowBg' : '']" @click.native="changeShadow()"></el-row>
            <el-aside class="main-cont main-left">
                <Aside class="aside" />
            </el-aside>
            <!-- 分块滑动功能 -->
            <el-main class="main-cont main-right">
                <transition :duration="{ enter: 800, leave: 100 }" mode="out-in" name="el-fade-in-linear">
                    <div :style="{ width: `calc(100% - ${isMobile ? '0px' : isCollapse ? '54px' : '220px'})` }"
                        class="topfix">
                        <el-header class="header-cont">
                            <div @click="totalCollapse" class="menu-total">
                                <i class="el-icon-s-unfold" v-if="isCollapse"></i>
                                <i class="el-icon-s-fold" v-else></i>
                            </div>
                            <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
                                <el-breadcrumb-item :key="item.path" v-for="item in matched.slice(isMobile ? matched.length-1 : 1, matched.length)">{{
                                    item.meta.title }}
                                </el-breadcrumb-item>
                            </el-breadcrumb>
                            <div class="fl-right right-box">
                                <el-button class="jumpbtn" v-if="v2PermissionList.length !== 0 && webV2Url && !isMobile"
                                    type="primary" plain size="mini" @click="handleJump">Web-v2</el-button>
                                <MessageBox v-if="canSeeMessage"></MessageBox>
                                <Screenfull class="screenfull"></Screenfull>
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        <img :src="userInfo.headerImg" height="30" width="30" />
                                        {{ userInfo.title }}
                                        <i class="el-icon-arrow-down"></i>
                                    </span>
                                    <el-dropdown-menu class="dropdown-group" slot="dropdown">
                                        <el-dropdown-item icon="el-icon-s-custom">
                                            Id: {{userInfo.ID}}
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="temuWhiteRedirect" icon="el-icon-connection">
                                            Temu跳转
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="showPassword = true" icon="el-icon-setting">
                                            修改密码
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="LoginOut" icon="el-icon-table-lamp">登 出
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </el-header>
                        <!-- 当前面包屑用路由自动生成可根据需求修改 -->
                        <!--
                        :to="{ path: item.path }" 暂时注释不用-->
                        <HistoryComponent v-show="!isMobile" />
                    </div>
                </transition>
                <transition mode="out-in" name="el-fade-in-linear">
                    <keep-alive>
                        <router-view :key="$route.fullPath" class="admin-box" v-if="$route.meta.keepAlive"
                            :style="{ top: isMobile ? '20px' : '60px' }"></router-view>
                    </keep-alive>
                </transition>
                <transition mode="out-in" name="el-fade-in-linear">
                    <router-view :key="$route.fullPath" class="admin-box" v-if="!$route.meta.keepAlive"
                        :style="{ top: isMobile ? '20px' : '60px' }"></router-view>
                </transition>
            </el-main>
        </el-container>
        <el-dialog :visible.sync="showPassword" @close="clearPassword" title="修改密码" width="360px">
            <el-form :model="pwdModify" :rules="rules" label-width="80px" ref="modifyPwdForm">
                <el-form-item :minlength="6" label="原密码" prop="password">
                    <el-input show-password v-model="pwdModify.password"></el-input>
                </el-form-item>
                <el-form-item :minlength="6" label="新密码" prop="newPassword">
                    <el-input show-password v-model="pwdModify.newPassword"></el-input>
                </el-form-item>
                <el-form-item :minlength="6" label="确认密码" prop="confirmPassword">
                    <el-input show-password v-model="pwdModify.confirmPassword"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="showPassword = false">取 消</el-button>
                <el-button @click="savePassword" type="primary">确 定</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import Aside from '@/view/layout/aside'
import HistoryComponent from '@/view/layout/aside/historyComponent/history'
import Screenfull from '@/view/layout/screenfull'
import { mapGetters, mapActions } from 'vuex'
import { changePassword } from '@/api/user'
import { store } from '@/store/index'
import {getSystemWebV2Url} from "@/api/system";
import {accountWhiteRedirect} from "@/api/temu/account";
import MessageBox from "@/view/layout/message/index.vue";

export default {
    name: 'Layout',
    data() {
        return {
            show: false,
            isCollapse: true,
            isSider: true,
            isMobile: false,
            isShadowBg: false,
            showPassword: false,
            pwdModify: {},
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, message: '最少6个字符', trigger: 'blur' }
                ],
                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '最少6个字符', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { min: 6, message: '最少6个字符', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.pwdModify.newPassword) {
                                callback(new Error('两次密码不一致'))
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            },
            value: ''
        }
    },
    components: {
        MessageBox,
        Aside,
        HistoryComponent,
        Screenfull,
    },
    methods: {
        ...mapActions('user', ['LoginOut']),
        totalCollapse() {
            this.isCollapse = !this.isCollapse
            this.isSider = !this.isCollapse
            this.isShadowBg = !this.isCollapse
            this.$bus.emit('collapse', this.isCollapse)
        },
        changeShadow() {
            this.isShadowBg = !this.isShadowBg
            this.isSider = !!this.isCollapse
            this.totalCollapse()
        },
        savePassword() {
            this.$refs.modifyPwdForm.validate(valid => {
                if (valid) {
                    changePassword({
                        username: this.userInfo.userName,
                        password: this.pwdModify.password,
                        newPassword: this.pwdModify.newPassword
                    }).then(() => {
                        this.$message.success('修改密码成功！')
                        this.showPassword = false
                    })
                } else {
                    return false
                }
            })
        },
        clearPassword() {
            this.pwdModify = {
                password: '',
                newPassword: '',
                confirmPassword: ''
            }
            this.$refs.modifyPwdForm.clearValidate()
        },
        async temuWhiteRedirect() {
          let resp = await accountWhiteRedirect()
          if (resp.code) {
            return
          }

          window.open(resp.data, "_blank");
        },
        async handleJump({ target }) {
            let resp = await getSystemWebV2Url()
            if (resp.code) {
                return
            }

            target.nodeName === "SPAN" ? target.parentNode.blur() : target.blur();
            const user = store.getters['user/userInfo'];
            const token = store.getters['user/token'];
            let permissionUrlStr = this.v2PermissionList.reduce((last, cur) => `${last}&permission=${cur}`, '')

            window.open(`${resp.data}/#/welcome?username=${user.userName}&userId=${user.ID}&token=${token}${permissionUrlStr}`);
        },
    },
    computed: {
        ...mapGetters('user', ['userInfo', 'v2PermissionList', 'webV2Url', 'canSeeMessage']),
        title() {
            return this.$route.meta.title || '当前页面'
        },
        matched() {
            return this.$route.matched
        }
    },
    mounted() {
        let screenWidth = document.body.clientWidth
        if (screenWidth < 1000) {
            this.isMobile = true
            this.isSider = false
            this.isCollapse = true
        } else if (screenWidth >= 1000 && screenWidth < 1500) {
            this.isMobile = false
            this.isSider = false
            this.isCollapse = true
        } else {
            this.isMobile = false
            this.isSider = false
            this.isCollapse = true
        }
        this.$bus.emit('collapse', this.isCollapse)
        this.$bus.emit('mobile', this.isMobile)
        window.onresize = () => {
            return (() => {
                let screenWidth = document.body.clientWidth
                if (screenWidth < 1000) {
                    this.isMobile = true
                    this.isSider = false
                    this.isCollapse = true
                } else if (screenWidth >= 1000 && screenWidth < 1500) {
                    this.isMobile = false
                    this.isSider = false
                    this.isCollapse = true
                } else {
                    this.isMobile = false
                    this.isSider = false
                    this.isCollapse = true
                }
                this.$bus.emit('collapse', this.isCollapse)
                this.$bus.emit('mobile', this.isMobile)
            })()
        }
    }
}
</script>

<style lang="scss">
$headerHigh: 52px;
$mainHight: 100vh;

.dropdown-group {
    min-width: 100px;
}

.topfix {
    position: fixed;
    top: 0;
    box-sizing: border-box;
    z-index: 999;
}

.admin-box {
    min-height: calc(100vh - 240px);
    background-color: rgb(255, 255, 255);
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow-x: hidden;
    overflow-y: scroll;

    .el-pagination {
        padding-top: 0px !important;
        padding-bottom: 10px !important;
    }
}

.search-term {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.table-form {}

.table-body {
    flex: 1;
}

.el-scrollbar__wrap {
    padding-bottom: 17px;
}

.layout-cont {
    .right-box {
        text-align: center;
        vertical-align: middle;

        img {
            vertical-align: middle;
            border: 1px solid #ccc;
            border-radius: 6px;
        }
    }

    .header-cont {
        height: $headerHigh !important;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
        line-height: $headerHigh;
    }

    .main-cont {
        .breadcrumb {
            line-height: 48px;
            display: inline-block;
            padding: 0 24px;
            // padding: 6px;
            // border-bottom: 1px solid #eee;
        }

        &.el-main {
            overflow: auto;
            background: #fff;
            // padding: 0px 10px;
            // background: #fff;
        }

        //height: $mainHight !important;
        //overflow: visible;
        //position: relative;

        .menu-total {
            // z-index: 5;
            // position: absolute;
            // top: 10px;
            // right: -35px;
            margin-left: -10px;
            float: left;
            margin-top: 10px;
            width: 30px;
            height: 30px;
            line-height: 30px;
            font-size: 30px;
            // border: 0 solid #ffffff;
            // border-radius: 50%;
            // background: #fff;
        }

        .aside {
            overflow: auto;

            // background: #fff;
            &::-webkit-scrollbar {
                display: none;
            }
        }

        .el-menu-vertical {
            height: calc(100vh) !important;
            visibility: auto;

            &:not(.el-menu--collapse) {
                width: 220px;
            }
        }

        .el-menu--collapse {
            width: 54px;

            li {

                .el-tooltip,
                .el-submenu__title {
                    padding: 0px 15px !important;
                }
            }
        }

        &::-webkit-scrollbar {
            display: none;
        }

        &.main-left {
            width: auto !important;
        }

        &.main-right {
            .admin-title {
                float: left;
                font-size: 16px;
                vertical-align: middle;
                margin-left: 20px;

                img {
                    vertical-align: middle;
                }

                &.collapse {
                    width: 53px;
                }
            }
        }
    }
}

.tilte {
    background: #001529;
    min-height: 64px;
    line-height: 64px;
    background: #002140;
    text-align: center;

    .logoimg {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        background: #fff;
        border-radius: 50%;
        padding: 3px;
    }

    .tit-text {
        display: inline-block;
        color: #fff;
        font-weight: 600;
        font-size: 20px;
        vertical-align: middle;
    }
}

.jumpbtn {
    display: inline-block;
    margin-right: 5px;
}

.screenfull {
    display: inline-block;
}
</style>
