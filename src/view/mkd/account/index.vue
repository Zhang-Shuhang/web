<template>
    <div>
        <div class="search-term">
            <el-form class="table-form" ref="elForm" :model="searchInfo" size="mini" label-width="100px" label-position="right">
                <el-row :gutter="15">
                    <el-col :span="4" :offset="16">
                        <el-form-item label-width="0">
                            <el-button type="primary" :style="{width: '100%'}" @click="onSubmit">查询</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label-width="0">
                            <el-button type="warning" :style="{width: '100%'}" @click="onAuth">授权</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-table class="table-body" ref="multipleTable" :data="tableData" border height="100%" @sort-change="sortChange" size="mini"
                      :header-cell-style="{'background-color': 'black', 'color': '#fff'}" :default-expand-all="false">
                <el-table-column label="id" prop="id" align="center">
                </el-table-column>
                <el-table-column label="Name" prop="name" align="center">
                </el-table-column>
            </el-table>
        </div>
    </div>

</template>

<script>
    import infoList from '@/components/mixins/infoList'
    import {accountList, accountGenAuthUrl} from "@/api/mkd/account";

    export default {
        components: {
        },
        mixins: [infoList],
        data() {
            return {
                listApi: accountList,
            }
        },
        methods: {
            onSubmit() {
                this.page = 1
                this.getTableData()
            },
            async onAuth() {
                let resp = await accountGenAuthUrl()
                if (resp.code !== 0) {
                    return
                }

                let features = "height=500, width=800, top=100, left=100, toolbar=no, menubar=no, scrollbars=no,resizable=no, location=no, status=no";  //设置新窗口的特性
                window.open(resp.data, "newW", features); //打开新窗口
            }
        },
        filters: {},
        mounted() {
        },
        async created() {
            this.getTableData()
        }
    }
</script>
<style scoped lang="scss">
</style>