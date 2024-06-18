<template>
  <div>
    <el-card class="r_center">
      <div class="title">
        <div>
          {{
            type == 'service' ? '交互服务各服务数据量' : '交互服务各系统数据量'
          }}
        </div>
        <div class="search">
          <el-date-picker
            size="mini"
            style="width: 360px"
            v-model="formInline.time"
            type="daterange"
            :clearable="false"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="截止时间"
            value-format="yyyyMMdd">
          </el-date-picker>
          <el-button
            size="mini"
            type="primary"
            style="margin-left: 16px"
            @click="onSubmit()"
            >搜索</el-button
          >
          <el-button
            size="mini"
            style="margin-left: 16px"
            @click="handlerExport"
            >导出</el-button
          >
        </div>
      </div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        @sort-change="handlerChange"
        tooltip-effect="dark"
        style="width: 100%"
        height="280">
        <template v-if="type == 'service'">
          <el-table-column
            prop="interFaceCode"
            label="服务编码"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="interFaceName"
            label="服务名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="openDetails(scope.row)">
                {{ scope.row.interFaceName }}
              </el-link>
            </template>
          </el-table-column>
        </template>

        <template v-else>
          <el-table-column
            prop="sysCode"
            label="系统编码"
            width="100"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sysName"
            label="系统名称"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="openDetails(scope.row)">
                {{ scope.row.sysName }}
              </el-link>
            </template>
          </el-table-column>
        </template>

        <el-table-column
          prop="totalNum"
          label="数据量"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link
              type="warning"
              @click="toMessageLog(scope.row, type)">
              {{ scope.row.totalNum }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="successNum"
          label="成功"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link
              type="success"
              @click="toMessageLog(scope.row, type, 'success')">
              {{ scope.row.successNum }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="failNum"
          label="失败"
          sortable="custom"
          width="100"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link
              type="danger"
              @click="toMessageLog(scope.row, type, 'fail')">
              {{ scope.row.failNum }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout=" total,prev, pager, next, sizes"
        :total="pagination.total"
        align="right">
      </el-pagination>
    </el-card>
    <ServiceDetails
      ref="serviceDetails"
      :type="type"
      :interfaceCode="interfaceCode"
      :sysCode="sysCode"
      :time="formInline.time" />
  </div>
</template>

<script>
import {
  queryInterfaceNum as _queryInterfaceNum,
  queryFirstListBySystem as _queryFirstListBySystem,
  exportInterfaceNumExcel as _exportInterfaceNumExcel,
  exportExcelBySys as _exportExcelBySys
} from '@/api/common'
import ServiceDetails from './ServiceDetails.vue'
export default {
  props: {
    type: {
      type: String,
      default: 'service'
    }
  },
  components: {
    ServiceDetails
  },
  data() {
    return {
      isLoading: true,
      interfaceCode: '',
      sysCode: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 - 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date(new Date().setHours(0, 0, 0, 0))
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3 - 1)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      formInline: {
        time: []
      },
      orderFail: null,
      tableData: [],
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0
      }
    }
  },
  computed: {
    typeName() {
      return this.type == 'service'
        ? '是否需要导出服务数量对应的系统信息?'
        : '是否需要导出系统数量对应的服务信息?'
    }
  },
  methods: {
    async onSubmit() {
      const data = {
        page: this.pagination.current,
        size: this.pagination.size,
        beginTime: this.formInline.time[0],
        orderFail: this.orderFail,
        endTime: this.formInline.time[1]
      }
      this.isLoading = true
      const res = await (this.type == 'service'
        ? _queryInterfaceNum(data)
        : _queryFirstListBySystem(data))
      this.pagination.total = res.data.total
      this.tableData = res.data.list
      this.isLoading = false
    },
    openDetails({ interFaceCode, sysCode }) {
      this.interfaceCode = interFaceCode
      this.sysCode = sysCode
      this.$refs.serviceDetails.dialogFormVisible = true
    },
    handlerChange({ order }) {
      if (order === 'descending') {
        this.orderFail = 1
      } else if (order === 'ascending') {
        this.orderFail = 0
      } else {
        this.orderFail = null
      }
      this.onSubmit()
    },
    handlerExport() {
      const data = {
        beginTime: this.formInline.time[0],
        endTime: this.formInline.time[1],
        needSysCode: 1
      }
      this.$confirm(this.typeName, '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        distinguishCancelAndClose: true,
        type: 'warning'
      })
        .then(() => {
          // 点击是按钮
          data.needSysCode = 1
          this.export(data)
        })
        .catch((action) => {
          // 点击否按钮
          if (action === 'cancel') {
            data.needSysCode = 0
            this.export(data)
          }
        })
    },

    // 导出各服务、系统
    async export(data) {
      const res = await (this.type == 'service'
        ? _exportInterfaceNumExcel(data)
        : _exportExcelBySys(data))
      this.exportExcel(res)
    },

    // 导出excel
    exportExcel(v) {
      if (v.type == 'application/json') {
        const reader = new FileReader() //创建一个FileReader实例
        reader.readAsText(v, 'utf-8') //读取文件,结果用字符串形式表示
        reader.onload = () => {
          const { msg } = JSON.parse(reader.result)
          this.$message.error(msg) //弹出错误提示
        }
      } else {
        const link = document.createElement('a')
        link.style.display = 'none'
        const url = window.URL || window.webkitURL || window.moxURL
        link.href = url.createObjectURL(v)
        link.download = `交互服务各${
          this.type == 'service' ? '服务' : '系统'
        }数据量.xlsx` //下载的文件名称
        link.click()
        window.URL.revokeObjectURL(url)
      }
    },

    toMessageLog(v, type, status) {
      console.log(v, type, status)
      const beginTime = this.formInline.time[0]
      const endTime = this.formInline.time[1]
      this.$router.push({
        path: '/messageLog/index',
        query: {
          interFaceCode:v.interFaceCode,
          sysCode:v.sysCode,
          type,
          status,
          beginTime: `${beginTime.slice(0, 4)}-${beginTime.slice(
            4,
            6
          )}-${beginTime.slice(6, 8)} 00:00:00 `,
          endTime: `${endTime.slice(0, 4)}-${endTime.slice(
            4,
            6
          )}-${endTime.slice(6, 8)} 23:59:59 `
        }
      })
    },
    handleCurrentChange(current) {
      this.pagination.current = current
      this.onSubmit()
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.pagination.current = 1
      this.onSubmit()
    }
  },
  mounted() {
    const yesterday = this.$moment().subtract(1, 'days').format('YYYYMMDD')
    this.formInline.time = [yesterday, yesterday]
    this.onSubmit(1, 10)
  }
}
</script>

<style lang="scss" scoped>
.r_center {
  width: 100%;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .search {
      width: 540px;
      line-height: 28px;
      font-weight: normal;
      font-size: 14px;
      display: flex;
      ::v-deep .el-date-editor {
        width: 180px;
      }
      ::v-deep .el-select {
        width: 120px;
        margin-right: 10px;
      }
    }
  }
}
</style>
