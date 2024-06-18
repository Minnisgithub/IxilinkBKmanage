<template>
  <div>
    <div class="content-container content-drawer">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sysName" label="系统名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sysId" label="系统编码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="orderNum" label="系统排序" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.orderNum"
              @change="orderNumChange(scope.row)"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="是否显示" width="120">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.showFlag"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="showFlagChange(scope.row)"
            >
            </el-switch>
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
        align="right"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {
  sysListSort as _sysListSort,
  sysUpdateSort as _sysUpdateSort,
} from "@/api/common";

export default {
  data() {
    return {
      formInline: {},
      tableData: [],
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0,
      },
      resultList: [],
    };
  },
  created() {
    this.onSubmit(1, 10);
  },
  methods: {
    onSubmit(current, size) {
      const data = {
        // resId: this.formInline.resId,
        page: current || this.pagination.current,
        size: size || this.pagination.size,
      };
      _sysListSort(data).then((res) => {
        this.pagination.current = res.data.pageNum;
        this.pagination.size = res.data.pageSize;
        this.pagination.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.onSubmit();
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.pagination.current = 1;
      this.onSubmit();
    },
    reset() {
      this.formInline = {};
      this.onSubmit(1, 10);
    },
    orderNumChange(v) {
      _sysUpdateSort([v]).then((res) => {
        this.onSubmit();
      });
    },
    showFlagChange(v) {
      _sysUpdateSort([v]).then((res) => {
        this.onSubmit();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
