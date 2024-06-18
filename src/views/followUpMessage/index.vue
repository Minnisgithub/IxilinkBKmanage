<template>
  <div class="follow-up-message">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-card>
          <div class="form-box">
            <div class="startFollowUp" v-show="isShowStartFollowUp">
              开始补推...
            </div>
            <el-form
              :model="formData"
              :rules="rules"
              ref="ruleForm"
              label-width="120px"
            >
              <el-form-item label="接口编码" prop="interfaceCode">
                <el-autocomplete
                  style="width: 100%"
                  ref="abc"
                  v-model="formData.interfaceCode"
                  :fetch-suggestions="querySearchAsync"
                  value-key="code"
                  @select="handlerInterfaceSelect"
                  popper-class="listCustom"
                  placeholder="请输入内容"
                  clearable
                  ><template slot-scope="{ item }">
                    <!-- 自定义下拉列表的内容 -->
                    <div>
                      <div style="font-size: 14px; font-weight: bold">
                        {{ item.name }}
                      </div>
                      <div style="color: #ccc; margin-top: -10px">
                        接口编码：{{ item.code }}
                      </div>
                    </div>
                  </template></el-autocomplete
                >
              </el-form-item>
              <el-form-item label="消费方编码" prop="consumerCode">
                <el-select
                  style="width: 100%"
                  :disabled="isDisable"
                  v-model="formData.consumerCode"
                  :placeholder="placeholderTips"
                >
                  <el-option
                    v-for="(item, index) in consumerCodeList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="提供方编码" prop="reqSysCode">
                <el-select
                  style="width: 100%"
                  :disabled="isDisable"
                  v-model="formData.reqSysCode"
                  :placeholder="placeholderTips"
                >
                  <el-option
                    v-for="(item, index) in reqSysCodeList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="请求消息id" prop="hisResId">
                <el-input v-model="formData.hisResId"></el-input>
              </el-form-item>
              <el-form-item label="患者id" prop="patientId">
                <el-input v-model="formData.patientId"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="beginTime">
                <el-date-picker
                  v-model="formData.beginTime"
                  style="width: 100%"
                  type="datetime"
                  placeholder="请选择开始时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间" prop="endTime">
                <el-date-picker
                  style="width: 100%"
                  v-model="formData.endTime"
                  type="datetime"
                  placeholder="请选择结束时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                >
                </el-date-picker>
              </el-form-item>
            </el-form>
          </div>
          <div class="footer">
            <el-button @click="submitForm('ruleForm')" type="primary"
              >提交</el-button
            >
            <el-button @click="reset('')">重置</el-button>
          </div>
        </el-card></el-col
      >
      <el-col :span="17">
        <el-card>
          <div class="search-form">
            <div class="title">消息补推日志</div>
            <div class="form">
              <el-form
                size="mini"
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
                label-width="90px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="接口编码:">
                      <el-input
                        style="width: 240px"
                        v-model="formInline.interfaceCode"
                        placeholder=""
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="消费方编码:">
                      <el-input
                        style="width: 240px"
                        v-model="formInline.comsumerCode"
                        placeholder=""
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="提供方编码:">
                      <el-input
                        style="width: 240px"
                        v-model="formInline.providerCode"
                        placeholder=""
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="9">
                    <el-form-item label="日志时间:">
                      <el-date-picker
                        style="width: 360px"
                        v-model="formInline.time"
                        type="datetimerange"
                        :clearable="true"
                        :picker-options="pickerOptions"
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="截止时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item>
                      <el-button type="primary" @click="queryLog(false)"
                        >查询</el-button
                      >
                      <el-button @click="reset('log')">重置</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="table">
              <el-table
                v-loading="isLoading"
                height="90%"
                :data="tableData"
                :header-cell-style="{ background: '#fff', color: '#666' }"
                tooltip-effect="dark"
              >
                <el-table-column label="序号" width="50" align="center">
                  <template slot-scope="scope">
                    <span>{{
                      (pagination.current - 1) * pagination.size +
                      scope.$index +
                      1
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="interfaceCode"
                  label="接口编码"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="comsumerCode"
                  label="消费方编码"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                  prop="providerCode"
                  label="提供方编码"
                  show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column prop="startTime" width="200" label="开始时间">
                </el-table-column>
                <el-table-column width="200" prop="endTime" label="结束时间">
                </el-table-column>
                <el-table-column
                  prop="successNum"
                  label="成功条数"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-link
                      type="success"
                      @click="toMessageLog(scope.row, 'success')"
                    >
                      {{ scope.row.successNum }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="failNum"
                  label="失败条数"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <el-link
                      type="danger"
                      @click="toMessageLog(scope.row, 'fail')"
                    >
                      {{ scope.row.failNum }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="operator" label="操作人">
                </el-table-column>
              </el-table>
              <el-pagination
                style="margin-top: 10px"
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
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
const moment = require("moment");

function defaultForm() {
  return {
    // 表单数据
    interfaceCode: "",
    consumerCode: "",
    reqSysCode: "",
    hisResId: "",
    patientId: "",
    beginTime: moment().format("YYYY-MM-DD HH:mm:ss"),
    endTime: moment().clone().add(1, "hour").format("YYYY-MM-DD HH:mm:ss"),
  };
}
// 查询日志
function defaultFormInline() {
  return {
    comsumerCode: "",
    interfaceCode: "",
    providerCode: "",
    time: [],
  };
}
import {
  supplementLog as _supplementLog,
  queryInterfaceList as _queryInterfaceList,
  queryConsumerListByCode as _queryConsumerListByCode,
  queryProviderListByCode as _queryProviderListByCode,
  queryLogSupplementMessage as _queryLogSupplementMessage,
} from "@/api/common";
export default {
  name: "message",
  data() {
    return {
      formData: defaultForm(),
      formInline: defaultFormInline(),
      tableData: [],
      isLoading: true,
      isDisable: true,
      isShowStartFollowUp: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 - 1);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 3 - 1);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0,
      },
      interfaceCodeList: [],
      consumerCodeList: [],
      reqSysCodeList: [],
      rules: {
        interfaceCode: [
          { required: true, message: "请输入接口编码", trigger: "change" },
        ],
        consumerCode: [
          { required: true, message: "请选择消费方编码", trigger: "blur" },
        ],
        reqSysCode: [
          { required: true, message: "请选择提供方编码", trigger: "blur" },
        ],
        beginTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.queryLog(true);
  },
  computed: {
    placeholderTips() {
      return this.isDisable ? "请先选择接口编码" : "请选择";
    },
  },
  watch: {
    "formData.interfaceCode": {
      handler(newVal) {
        if (newVal) {
          this.isDisable = false;
        } else {
          this.isDisable = true;
        }
        this.formData.consumerCode = "";
        this.formData.reqSysCode = "";
        this.consumerCodeList = [];
        this.reqSysCodeList = [];
      },
    },
  },
  methods: {
    queryLog(time = false) {
      this.isLoading = true;
      if (time) {
        this.formInline.time = [
          this.$moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss"),
          this.$moment().format("YYYY-MM-DD HH:mm:ss"),
        ];
      }
      const data = {
        comsumerCode: "",
        startTime: this.formInline.time && this.formInline.time[0],
        endTime: this.formInline.time && this.formInline.time[1],
        interfaceCode: "",
        page: this.pagination.current,
        providerCode: "",
        size: this.pagination.size,
      };
      _queryLogSupplementMessage(data).then((res) => {
        this.tableData = res.data.list;
        this.pagination.total = res.data.total;
        this.isLoading = false;
      });
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.queryLog();
    },
    handleSizeChange(size) {
      this.pagination.size = size;
      this.queryLog();
    },
    // 校验
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.isShowStartFollowUp = true;
          const res = await _supplementLog(this.formData).catch(() => {
            this.isShowStartFollowUp = false;
          });
          if (res.code !== 200) {
            this.$message({
              message: res.message,
              type: "error",
            });
            this.isShowStartFollowUp = false;
            return;
          }
          this.isShowStartFollowUp = false;
          this.$message({
            message: res.data || "补推成功",
            type: "success",
          });
          this.reset();
          this.queryLog(true);
        } else {
          return false;
        }
      });
    },
    // 异步搜索 当前系统和数据库的表
    querySearchAsync(queryString, cb) {
      this.interfaceCodeList = [];
      _queryInterfaceList({
        codeOrName: queryString,
        page: 1,
        size: 99999,
      }).then((res) => {
        if (res.code !== 200) {
          this.$message({
            message: res.message,
            type: "error",
          });
          return;
        }
        this.interfaceCodeList = res.data.list;
        cb(this.interfaceCodeList);
      });
    },
    // 当接口编码选择时
    handlerInterfaceSelect({ code }, type) {
      // 获取消费方编码列表
      _queryConsumerListByCode({
        code,
        page: 1,
        size: 99999,
      }).then((res) => {
        if (res.code !== 200) {
          this.$message({
            message: res.message,
            type: "error",
          });
          return;
        }
        this.consumerCodeList = res.data.list;
      });
      // 获取提供方编码列表
      _queryProviderListByCode({
        code,
        page: 1,
        size: 99999,
      }).then((res) => {
        if (res.code !== 200) {
          this.$message({
            message: res.message,
            type: "error",
          });
          return;
        }
        this.reqSysCodeList = res.data.list;
      });
    },
    reset(type) {
      if (type) {
        this.formInline = defaultFormInline();
        this.queryLog(true);
        return;
      }
      this.formData = defaultForm();
      setTimeout(() => {
        this.$refs["ruleForm"].clearValidate();
      }, 0);
    },
    toMessageLog(v, status) {
      console.log(v, status);
      const interFaceCode = v.interfaceCode;
      const sysCode = v.comsumerCode;
      const exception = '消息补推';
      const beginTime = this.formInline.time[0];
      const endTime = this.formInline.time[1];
      this.$router.push({
        path: "/messageLog/index",
        query: {
          interFaceCode,
          sysCode,
          exception,
          status,
          beginTime,
          endTime,
        },
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.follow-up-message {
  .startFollowUp {
    font-size: 18px;
    margin-left: 20px;
    margin-bottom: 20px;
    font-weight: bold;
    color: rgb(6, 185, 6);
  }
  ::v-deep.el-card__body {
    height: 660px;
    position: relative;
    .footer {
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }
  .form-box {
    padding-right: 10px;
    padding-top: 10px;
    height: 100%;
  }
  .search-form {
    display: flex;
    height: 100%;
    flex-direction: column;
    .title {
      margin-bottom: 20px;
      color: #666;
      font-weight: bold;
      flex: 0 0 auto;
    }
    .table {
      flex: 1;
      height: 100%;
    }
    .form {
      margin: 10px 0;
      flex: 0 0 auto;
    }
  }
}
</style>
