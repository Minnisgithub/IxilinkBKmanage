<template>
  <div>
    <div class="title">
      <img :src="subscription ? subscriptioned : subscriptioning" alt="" />
      <span :class="[subscription ? 'bule' : 'gray']">{{
        subscription ? "已订阅" : "未订阅"
      }}</span>
    </div>
    <el-input
      placeholder="系统名称、编码快速查询"
      prefix-icon="el-icon-search"
      v-model="systemName"
      @input="systemNameChange()"
    >
    </el-input>
    <div class="subscript">
      <el-table
        :data="tableData"
        ref="multipleTable"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" min-width="5%"> </el-table-column>
        <el-table-column label="序号" min-width="14%" align="center">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sysName"
          label="厂商系统名称"
          min-width="40%"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a
              v-if="
                subscription &&
                activeSystemMsg.groupName === '院内交互' &&
                !otherList.includes(scope.row.projectCode)
              "
              class="sysNameCla"
              @click="sysNameClick(scope.row)"
              >{{ scope.row.sysName }}</a
            >
            <a v-else>{{ scope.row.sysName }}</a>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="系统编码" min-width="25%">
          <template slot-scope="scope">
            <span>{{ scope.row.sysCode || scope.row.sysId }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        small
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-size="pagination.size"
        layout=" total,prev, pager, next"
        :total="pagination.total"
        align="right"
      >
      </el-pagination>

      <MaintainDialog
        v-if="dialogFormVisible"
        :dialogFormVisible="dialogFormVisible"
        :isUpdate="isUpdate"
        :showType="showType"
        :moduleList="list"
        @beforeClose="dialogFormVisible = false"
        @close="dialogFormVisible = false"
        @handleFinsh="handleFinsh"
      />
    </div>
  </div>
</template>

<script>
import MaintainDialog from "@/components/MaintainDialog";
import subscriptioned from "@/assets/subscriptioned.png";
import subscriptioning from "@/assets/subscriptioning.png";
import { debounce } from "@/utils/index";
import {
  providerNotInSysListByProject as _providerNotInSysListByProject,
  providersysListByProject as _providersysListByProject,
  consumersysListByProject as _consumersysListByProject,
  consumerNotInSysListByProject as _consumerNotInSysListByProject,
} from "@/api/common";
import { getTaskInfo, getHttpTaskInfo } from "@/api/maintainDialog";
export default {
  props: {
    providerOrConsumer: {
      type: Boolean,
      default: true,
    },
    subscription: {
      type: Boolean,
      default: true,
    },
    activeSystemMsg: {
      type: Object,
    },
  },
  components: {
    MaintainDialog,
  },
  data() {
    return {
      subscriptioned,
      subscriptioning,
      systemName: "",
      tableData: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      checkList: [],
      list: [],
      otherList: ["JY301", "JY302", "JY303"],
      dialogFormVisible: false,
      isUpdate: true,
      showType: "",
    };
  },
  watch: {
    activeSystemMsg(newValue, oldValue) {
      this.$refs.multipleTable.clearSelection();
      this.multipleSelection = [];
      this.systemName = "";
      this.pagination.current = 1;
      this.tableData = [];
      if (newValue.id) {
        this.tableListData(newValue);
      }
    },
  },
  created() {},
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("checkList", this.multipleSelection);
    },

    tableListData(v) {
      const data = {
        projectId: v.id,
        condition: this.systemName,
        page: this.pagination.current,
        size: 10,
      };
      if (this.subscription) {
        if (this.providerOrConsumer) {
          _providersysListByProject(data).then((res) => {
            this.tableData = res.data.list;
            this.pagination.current = res.data.pageNum;
            this.pagination.total = res.data.total;
          });
        } else {
          _consumersysListByProject(data).then((res) => {
            this.tableData = res.data.list;
            this.pagination.current = res.data.pageNum;
            this.pagination.total = res.data.total;
          });
        }
      } else {
        if (this.providerOrConsumer) {
          _providerNotInSysListByProject(data).then((res) => {
            this.tableData = res.data.list;
            this.pagination.current = res.data.pageNum;
            this.pagination.total = res.data.total;
          });
        } else {
          _consumerNotInSysListByProject(data).then((res) => {
            this.tableData = res.data.list;
            this.pagination.current = res.data.pageNum;
            this.pagination.total = res.data.total;
          });
        }
      }
    },
    systemNameChange: debounce(function () {
      console.log();
      this.pagination.current = 1;
      if (this.activeSystemMsg.id) {
        this.tableListData(this.activeSystemMsg);
      }
    }, 500),
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.tableListData(this.activeSystemMsg);
    },
    sysNameClick(row) {
      const data = {
        interfaceCode: row.projectCode,
        sysCode: row.sysCode,
      };
      // 获取配置信息
      let methodTypeMap = {
        0: getTaskInfo,
        1: getHttpTaskInfo,
      };
      methodTypeMap[row.consumerType](data).then((res) => {
        this.showType = row.consumerType;
        this.isUpdate = true;
        this.list = [];
        const obj = { ...res.data };
        if (!res.data) {
          (obj.id = row.id),
            (obj.interfaceCode = row.projectCode),
            (obj.sysCode = row.sysCode),
            (this.isUpdate = false);
        }
        console.log(obj)
        obj.sysName = row.sysName;
        this.list.push(obj);
        console.log(this.list,22333)
        this.dialogFormVisible = true;
      });
    },
    handleFinsh() {
      this.dialogFormVisible = false;
      this.tableListData(this.activeSystemMsg);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  line-height: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}
.sysNameCla {
  color: #0e46e2;
}
img {
  width: 30px;
  height: 30px;
  margin-right: 8px;
}
.gray {
  color: #7c8086;
}
.bule {
  color: #6d80ca;
}
.el-input {
  margin-bottom: 10px;
}

.subscript {
  height: calc(100vh - 364px);
  overflow-x: hidden;
  //   overflow-y: scroll;
}
.subscript::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.subscript::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(231, 226, 226, 0.808);
}
</style>