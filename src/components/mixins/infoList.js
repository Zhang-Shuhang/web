import {toSQLLine} from '@/utils/stringFun'

export default {
    data() {
        return {
            page: 1,
            total: 10,
            pageSize: 30,
            tableData: [],
            searchInfo: {}
        }
    },
    methods: {
        handleSizeChange(val) {
            this.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val) {
            this.page = val
            this.getTableData()
        },
        onSubmit() {
            this.page = 1
            this.getTableData()
        },
        async getTableData(page = this.page, page_size = this.pageSize) {
            const table = await this.listApi({page, page_size, ...this.searchInfo})
            this.tableData = table.data.list || []
            this.total = table.data.total
            this.page = table.data.page
            if (table.data.pageSize) {
                this.pageSize = table.data.pageSize
            } else {
                this.pageSize = table.data.page_size
            }
        },
        // 排序
        sortChange({prop, order}) {
            if (prop) {
                this.searchInfo.order_by = toSQLLine(prop)
                this.searchInfo.desc = order === 'descending'
            }
            this.getTableData()
        }
    }
}