<template>
  <el-dialog
    :title="type == 'service' ? '服务：厂商详情' : '厂商：服务详情'"
    :visible.sync="dialogFormVisible"
    width="60%"
    @open="handlerOpen"
    style="margin-top: -60px"
    :close-on-click-modal="false">
    <div>
      <el-table
        v-loading="isLoading"
        :data="tableData"
        tooltip-effect="dark">
        <template v-if="type == 'system'">
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
                @click="toMessageLog(scope.row,type)">
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
                @click="toMessageLog(scope.row,type,'success')">
                {{ scope.row.successNum }}
              </el-link>
            </template>
        </el-table-column>
        <el-table-column
          prop="failNum"
          label="失败"
          width="100"
          show-overflow-tooltip>
           <template slot-scope="scope">
              <el-link
                type="danger"
                @click="toMessageLog(scope.row,type,'fail')">
                {{ scope.row.failNum }}
              </el-link>
            </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.current"
          :page-sizes="pagination.sizes"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next"
          :total="pagination.total"
          align="right">
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  querySecondInterfaceNum as _querySecondInterfaceNum,
  querySecondListBySystem as _querySecondListBySystem
} from '@/api/common'
export default {
  props: {
    type: {
      type: String,
      default: 'service'
    },
    interfaceCode: {
      type: String,
      default: ''
    },
    sysCode: {
      type: String,
      default: ''
    },
    time: {
      type: Array
    }
  },
  data() {
    return {
      isLoading: true,
      dialogFormVisible: false,
      tableData: [],
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    async onSubmit() {
      const data = {
        page: this.pagination.current,
        size: this.pagination.size,
        beginTime: this.time[0],
        endTime: this.time[1]
      }
      this.isLoading = true
      const res = await (this.type == 'service'
        ? _querySecondInterfaceNum({
            ...data,
            interfaceCode: this.interfaceCode
          })
        : _querySecondListBySystem({ ...data, sysCode: this.sysCode }))
      this.pagination.total = res.data.total
      this.tableData = res.data.list
      this.isLoading = false
    },
    handleCurrentChange(current) {
      this.pagination.current = current
      this.onSubmit()
    },
    handlerOpen() {
      this.onSubmit()
    },
    handleSizeChange(size) {
      this.pagination.size = size
      this.pagination.current = 1
      this.onSubmit()
    },
      toMessageLog(v,type,status){
      const beginTime = this.time[0]
      const endTime = this.time[1]
      this.$router.push({
          path: '/messageLog/index',
          query: { v,type,status,
          beginTime: `${beginTime.slice(0, 4)}-${beginTime.slice(4, 6)}-${beginTime.slice(6, 8)} 00:00:00 `,
          endTime: `${endTime.slice(0, 4)}-${endTime.slice(4, 6)}-${endTime.slice(6, 8)} 23:59:59 `,
          }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog .el-input__inner {
  width: 100px !important;
}
.pagination {
  margin-top: 10px;
}
</style>
