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
            <el-form-item label="消息ID:">
              <el-input v-model="formInline.resId" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息编码:">
              <el-input
                v-model="formInline.interfaceNameOrCode"
                placeholder="编码检索"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="消息类型:">
              <el-select v-model="formInline.modifyFlag">
                <el-option label="全部" value=""></el-option>
                <el-option label="新增" value="NEW"></el-option>
                <el-option label="更新" value="UPDATE"></el-option>
                <el-option label="查询" value="QUERY"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="患者ID:">
              <el-input
                v-model="formInline.patientId"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="调用方:">
              <el-input
                v-model="formInline.resSysNameOrCode"
                placeholder="厂商系统名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="调用状态:">
              <el-select v-model="formInline.result">
                <el-option label="全部" value=""></el-option>
                <el-option label="成功" value="成功"></el-option>
                <el-option label="失败" value="失败"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="日志时间:">
              <el-date-picker
                style="width: 360px"
                v-model="formInline.time"
                type="datetimerange"
                :clearable="false"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="截止时间"
                value-format="yyyy-MM-dd HH:mm:ss "
                :default-time="['00:00:00', '23:59:59']"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" @click="onSubmit(1, 10)"
                >查询</el-button
              >
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
               <el-checkbox v-model="formInline.filterFlag">过滤</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="content-container content-drawer">
      <el-table :data="tableData" tooltip-effect="dark">
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="resId"
          label="消息ID"
          width="220"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="patientId"
          label="患者ID"
          width="80"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column
          prop="interfaceName"
          label="消息名称"
          width="260"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="modifyFlag"
          label="消息类型"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-if="scope.row.modifyFlag == 'NEW'">新增</span>
            <span v-if="scope.row.modifyFlag == 'UPDATE'">更新</span>
            <span v-if="scope.row.modifyFlag == 'QUERY'">查询</span>
          </template>
        </el-table-column>

        <el-table-column width="100" label="消息内容">
          <template slot-scope="scope">
            <el-link
              type="primary"
              @click="openXML(scope.row)"
              v-loading.fullscreen.lock="fullscreenLoading"
            >
              详情
            </el-link>
            <!-- <el-link type="primary" @click="downloadLog(scope.row)">
              详情
            </el-link> -->
          </template>
        </el-table-column>
        <el-table-column label="调用状态" width="100">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              :type="scope.row.result == '失败' ? 'danger' : 'success'"
            >
              {{ scope.row.result }}</el-link
            >
          </template>
        </el-table-column>
        <el-table-column prop="lastTime" label="日志时间" width="180">
        </el-table-column>
        <el-table-column prop="executionTime" label="耗时(ms)" width="120">
        </el-table-column>
        <el-table-column
          prop="reqSysCode"
          label="调用方"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="reqSysName"
          label="厂商名称"
          width="160"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column prop="failureReason" label="失败原因" width="300">
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
    <el-dialog
      :fullscreen="true"
      title="消息详情"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
    >
      <div>
        <el-descriptions :column="3" border contentStyle="max-width:140px">
          <el-descriptions-item label="消息名称">{{
            rowinterfaceName
          }}</el-descriptions-item>
          <el-descriptions-item label="消息ID">{{
            rowid
          }}</el-descriptions-item>
          <el-descriptions-item label="厂商名称">{{
            rowconpany
          }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{
            rowstartTime
          }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{
            rowendTime
          }}</el-descriptions-item>
          <el-descriptions-item label="耗时">
            {{ rowexecutionTime }}ms
          </el-descriptions-item>
        </el-descriptions>

        <el-row gutter="10">
          <el-col :span="12">
            <div style="height: 30px; line-height: 30px; margin-top: 10px">
              <strong>发送内容</strong>
            </div>
            <div>
              <pre v-highlightjs="xml_show"> 
          <code class="highlight_s"> </code>
        </pre>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="height: 30px; margin-top: 10px">
              <strong>响应内容</strong>
              <el-button type="primary" @click="downloadLog" size="mini"
                >下载</el-button
              >
            </div>
            <div>
              <pre v-highlightjs="xmlOut_show"> 
          <code class="highlight_s"> 
        </code>
        </pre>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  serviceLogList as _serviceLogList,
  queryXmlByResId as _queryXmlByResId,
  downloadLog as _downloadLog,
  downloadLog,
} from "@/api/common";
import vkbeautify from "vkbeautify";
import saveAs from "file-saver";
export default {
  data() {
    return {
      // formInline: {
      //   result: "",
      //   time: [
      //     new Date(
      //       Date.parse(new Date(new Date() - 7 * 24 * 60 * 60 * 1000)) +
      //         8 * 3600 * 1000
      //     )
      //       .toISOString()
      //       .replace(/T/g, " ")
      //       .slice(0, 19),
      //     new Date(Date.parse(new Date()) + 8 * 3600 * 1000)
      //       .toISOString()
      //       .replace(/T/g, " ")
      //       .slice(0, 19),
      //   ],
      // },
      formInline: {
        modifyFlag: "",
        filterFlag: true,
        result: "",
        time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()],
      },
      tableData: [],
      multipleSelection: [],
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0,
      },
      dialogVisible: false,
      xml_show: "",
      xmlOut_show: "",
      rowstartTime: "",
      rowendTime: "",
      rowexecutionTime: "",
      rowid: "",
      rowconpany: "",
      rowinterfaceName: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "最近半小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(end - 3600 * 500);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(end - 3600 * 1000);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date(new Date().setHours(0, 0, 0, 0));
              start.setTime(end - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      fullscreenLoading: false,
    };
  },
  created() {
    this.formInline.time = [
      // new Date(new Date().setHours(0, 0, 0, 0)),
      new Date(
        Date.parse(new Date(new Date() - 10 * 60 * 1000)) + 8 * 3600 * 1000
      )
        .toISOString()
        .replace(/T/g, " ")
        .slice(0, 19),
      new Date(),
    ];
    this.onSubmit(1, 10, true);
  },
  methods: {
    onSubmit(current, size, time = false) {
      if (time) {
        this.formInline.time[0] = this.$moment(this.formInline.time[0]).format(
          "YYYY-MM-DD HH:mm:ss "
        );
        this.formInline.time[1] = this.$moment(this.formInline.time[1]).format(
          "YYYY-MM-DD HH:mm:ss "
        );
      }
      const data = {
        resId: this.formInline.resId,
        modifyFlag: this.formInline.modifyFlag,
        interfaceNameOrCode: this.formInline.interfaceNameOrCode,
        patientId: this.formInline.patientId,
        resSysNameOrCode: this.formInline.resSysNameOrCode,
        result: this.formInline.result,
        page: current || this.pagination.current,
        size: size || this.pagination.size,
        beginTime: this.formInline.time ? this.formInline.time[0] : "",
        endTime: this.formInline.time ? this.formInline.time[1] : "",
        filterFlag: this.formInline.filterFlag ? "1" : "",
      };
      _serviceLogList(data).then((res) => {
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
      this.formInline = {
        result: "",
        filterFlag:false,
        time: [
          new Date(
            Date.parse(new Date(new Date() - 10 * 60 * 1000)) + 8 * 3600 * 1000
          )
            .toISOString()
            .replace(/T/g, " ")
            .slice(0, 19),
          new Date(),
        ],
      };
      this.onSubmit(1, 10, true);
    },
    openXML(row) {
      this.fullscreenLoading = true;
      _queryXmlByResId({ resId: row.resId }).then((res) => {
        if (res.code == 200) {
          this.xml_show = vkbeautify.xml(res.data.xmlIn);
          this.xmlOut_show = vkbeautify.xml(res.data.xmlOut);
          this.rowstartTime = res.data.startTime;
          this.rowendTime = res.data.endTime;
          this.rowexecutionTime = row.executionTime;
          this.rowinterfaceName = row.interfaceName;
          this.rowid = row.resId;
          this.rowconpany = row.reqSysName;
          this.dialogVisible = true;
        }
        this.fullscreenLoading = false;
      });
    },
    downloadLog() {
      this.$message.success("正在下载，请稍等...");
      downloadLog({ resId: this.rowid }).then((res) => {
        this.$message.success("下载完成，请到下载内容中查看");
        const blob = new Blob([res]);
        saveAs(blob, `${this.rowid}.xml`);
      });
    },
  },
};
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
code {
  height: 76vh;
}
.highlight_s {
  padding-top: 0px;
}
// pre code.hljs {
//   overflow: visible;
// }
// ::v-deep.highlight_s span {
//   display: flex;
// }
</style>
