<template>
  <div>
    <div class="content-container search-header">
      <el-form
        size="mini"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="100px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="登录账号:">
              <el-input v-model="formInline.loginId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="用户名:">
              <el-input v-model="formInline.username"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="登录时间:">
              <el-date-picker
                style="width: 380px"
                v-model="formInline.time"
                type="datetimerange"
                align="center"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button
                type="primary"
                @click="querylogLoginList"
                >查询</el-button
              >
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-container content-drawer">
      <el-table
        :data="tableData"
        tooltip-effect="dark">
        <el-table-column
          label="序号"
          width="50"
          type="index"
          align="center">
        </el-table-column>
        <el-table-column
          prop="loginId"
          label="登录账号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="登录IP"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="loginTime"
          label="登录时间"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.page"
        :page-sizes="pagination.sizes"
        :page-size="formInline.size"
        layout=" total,prev, pager, next, sizes"
        :total="pagination.total"
        align="right">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { querylogLoginList as _querylogLoginList } from '@/api/logMsg.js'
import moment from 'moment'
function defaultTime() {
  return [
    moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
    moment().format('YYYY-MM-DD HH:mm:ss')
  ]
}
function defaultFormData() {
  return {
    time: defaultTime(),
    loginId: '',
    page: 1,
    size: 10,
    username: ''
  }
}
export default {
  data() {
    return { 
      formInline: defaultFormData(),
      tableData: [],
      pagination: {
        sizes: [10, 20, 30],
        total: 0
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  created() {
    this.querylogLoginList()
  },
  methods: {
    querylogLoginList() {
      const formInline = { ...this.formInline }
      delete formInline.time
      _querylogLoginList({
        ...formInline,
        startTime: this.formInline.time && this.formInline.time[0],
        endTime: this.formInline.time && this.formInline.time[1]
      }).then((res) => {
        if (res && 'data' in res) {
          this.tableData = res.data.list || []
          this.pagination.total = res.data.total
        }
      })
    },

    handleCurrentChange(current) {
      this.formInline.page = current
      this.querylogLoginList()
    },
    handleSizeChange(size) {
      this.formInline.size = size
      this.querylogLoginList()
    },
    reset() {
      this.formInline = defaultFormData()
      this.querylogLoginList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
::v-deep .el-dialog__body {
  padding: 0 10px;
}
.content-drawer {
  min-height: calc(100vh - 320px);
}
pre {
  margin-top: -24px;
  margin-bottom: -16px;
}
::v-deep .el-descriptions-item__label.is-bordered-label {
  width: 100px;
  text-align: left;
  padding-left: 20px;
}
</style>
