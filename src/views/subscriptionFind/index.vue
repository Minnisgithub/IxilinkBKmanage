<template>
  <div>
    <div class="content-container search-header">
      <el-form
        size="mini"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
        label-width="100px"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="接口分组：">
              <el-select v-model="formInline.result">
                <!-- <el-option label="全部" value=""></el-option>
                <el-option label="成功" value="成功"></el-option> -->
                <el-option
                  v-for="(v, i) in resultList"
                  :key="i"
                  :label="v"
                  :value="v"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口名称:">
              <el-input
                v-model="formInline.condition"
                placeholder="名称\编码检索"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="onSubmit(1, 10)"
                >查询</el-button
              >
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-container content-drawer">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="groupCode"
          label="组名"
          width="180"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="interfaceName"
          label="接口名称"
          width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="interfaceCode"
          label="接口编码"
          width="160"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          label="提供方名称"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.providerNames.join(',') || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="providerNum"
          label="提供方数量"
          width="100"
          show-overflow-tooltip
        >
        
        </el-table-column>
        <el-table-column
          label="消费方名称"
          width="160"
          show-overflow-tooltip
        >
         <template slot-scope="scope">
            <span>{{scope.row.consumerNames.join(',') || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consumerNum"
          label="消费方数量"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column prop="hospitalName" label="医疗机构" min-width="180">
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
  subscriptionList as _subscriptionList,
  consumerGroupList as _consumerGroupList,
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
    _consumerGroupList().then((res) => {
      this.resultList = res.data;
    });
  },
  methods: {
    onSubmit(current, size) {
      const data = {
        // resId: this.formInline.resId,
        condition: this.formInline.condition,
        groupCode: this.formInline.result,
        page: current || this.pagination.current,
        size: size || this.pagination.size,
      };
      _subscriptionList(data).then((res) => {
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
  },
};
</script>

<style lang="scss" scoped>
</style>
