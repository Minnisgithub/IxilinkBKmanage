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
          <el-col :span="6">
            <el-form-item label="系统名称:">
              <el-input
                v-model="formInline.sysName"
                placeholder="请输入">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                @click="onSubmit(1, 10)"
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
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index">
        </el-table-column>
        <el-table-column
          prop="sysName"
          label="系统名称"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="providerNum"
          label="提供接口数量"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="providerName"
          label="提供接口名称">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.providerName"
              placement="left"
              trigger="click">
              <div class="pre">{{ scope.row.providerName }}</div>
              <el-button
                type="text"
                size="small"
                slot="reference">
                查看详细
              </el-button>
            </el-popover>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          label="消费接口数量"
          prop="consumerNum"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="consumerName"
          label="消息接口名称">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.consumerName"
              placement="left"
              trigger="click">
              <div class="pre">{{ scope.row.consumerName }}</div>
              <el-button
                type="text"
                size="small"
                slot="reference">
                查看详细
              </el-button>
            </el-popover>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          label="医疗机构名称"
          prop="hospitalName"
          show-overflow-tooltip>
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
    </div>
  </div>
</template>

<script>
import { subscriptionListBySystem as _subscriptionListBySystem } from '@/api/common'

export default {
  data() {
    return {
      formInline: {},
      tableData: [],
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0
      },
      resultList: []
    }
  },
  created() {
    this.onSubmit(1, 10)
  },
  methods: {
    onSubmit(current, size) {
      const data = {
        sysName: this.formInline.sysName,
        page: current || this.pagination.current,
        size: size || this.pagination.size
      }
      _subscriptionListBySystem(data).then((res) => {
        this.pagination.current = res.data.pageNum
        this.pagination.size = res.data.pageSize
        this.pagination.total = res.data.total
        this.tableData = res.data.list
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
    },
    reset() {
      this.formInline = {}
      this.onSubmit(1, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.pre {
  width: 500px;
  height: 500px;
  overflow: auto;
  padding-right: 10px;
}
</style>
