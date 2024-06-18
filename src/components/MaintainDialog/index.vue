<!--
  功能：维护推送地址和方法名，方法名默认为 operation
  作者：heping
-->
<template>
  <div class="maintain-dialog-container">
    <el-dialog
      title="维护配置：必须维护推送地址和方法名后才可订阅"
      :visible.sync="Visible"
      :before-close="beforeClose"
      destroy-on-close
      @close="close"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane
          v-if="showType === '0' || !showType"
          label="webService配置"
          name="first"
        >
          <el-form
            class="form1"
            ref="formInfoRef1"
            :model="formModel"
            label-width="auto"
          >
            <div v-for="(item, index) in formModel.moduleList" :key="item.id">
              <el-form-item label="名称：">
                {{ item.sysName }}
              </el-form-item>
              <el-form-item
                label="参数名称："
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                ]"
                :prop="'moduleList.' + index + '.argsName'"
              >
                <el-input v-model="item.argsName"></el-input>
              </el-form-item>
              <el-form-item
                label="接口地址："
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                ]"
                :prop="'moduleList.' + index + '.endPoint'"
              >
                <el-input v-model="item.endPoint"></el-input>
              </el-form-item>
              <el-form-item
                label="方法名："
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                ]"
                :prop="'moduleList.' + index + '.localPart'"
              >
                <el-input v-model="item.localPart"></el-input>
              </el-form-item>
              <el-form-item
                label="命名空间："
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                ]"
                :prop="'moduleList.' + index + '.nameSpace'"
              >
                <el-input v-model="item.nameSpace"></el-input>
              </el-form-item>
              <el-form-item label="qname：">
                <el-input v-model="item.qname"></el-input>
              </el-form-item>
              <el-form-item label="soapAction：">
                <el-input v-model="item.soapAction"></el-input>
              </el-form-item>
            </div>
            <el-form-item label=" " style="margin-top: 48px">
              <el-button
                type="primary"
                :loading="saveLoading"
                @click="submitForm('formInfoRef1')"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-if="showType === '1' || !showType"
          label="HTTP配置"
          name="second"
        >
          <el-form
            class="httpform"
            ref="formInfoRef2"
            :model="formModel"
            label-width="auto"
          >
            <div
              v-for="(item, index) in formModel.httpModuleList"
              :key="item.id"
            >
              <el-form-item label="名称：">
                {{ item.sysName }}
              </el-form-item>
              <el-form-item
                label="请求方法："
                :rules="[
                  { required: true, message: '不能为空', trigger: 'change' },
                ]"
                :prop="'httpModuleList.' + index + '.requestType'"
              >
                <el-select
                  class="requestTypeSelect"
                  v-model="item.requestType"
                  placeholder="请选择请求方法"
                >
                  <el-option label="GET" :value="0"> </el-option>
                  <el-option label="POST" :value="1"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="接口地址："
                :rules="[
                  { required: true, message: '不能为空', trigger: 'blur' },
                ]"
                :prop="'httpModuleList.' + index + '.address'"
              >
                <el-input v-model="item.address"></el-input>
              </el-form-item>

              <el-form-item label="请求头信息:" required>
                <div
                  v-for="(v, i) in formModel.httpModuleList[index].list"
                  :key="i"
                >
                  <el-row class="header-info">
                    <el-col :span="18">
                      <div style="display: flex">
                        <el-form-item
                          :rules="[
                            {
                              required: true,
                              message: '不能为空',
                              trigger: 'blur',
                            },
                          ]"
                          :prop="`httpModuleList[${index}].list[${i}].headerName`"
                          ><el-input
                            size="small"
                            placeholder="请求头名"
                            v-model="v.headerName"
                          ></el-input
                        ></el-form-item>
                        <el-form-item
                          :rules="[
                            {
                              required: true,
                              message: '不能为空',
                              trigger: 'blur',
                            },
                          ]"
                          :prop="`httpModuleList[${index}].list[${i}].headerValue`"
                          ><el-input
                            size="small"
                            placeholder="请求头值"
                            v-model="v.headerValue"
                          ></el-input
                        ></el-form-item>
                      </div>
                    </el-col>
                    <el-col :span="6">
                      <i
                        v-if="
                          formModel.httpModuleList[index].list.length - 1 ===
                            i ||
                          formModel.httpModuleList[index].list.length === 0
                        "
                        class="el-icon-circle-plus"
                        @click="addOrdeleteRequestHeaderInfo(index, 1)"
                      ></i>
                      <i
                        v-if="formModel.httpModuleList[index].list.length > 1"
                        class="el-icon-remove"
                        @click="addOrdeleteRequestHeaderInfo(index)"
                      ></i>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </div>
            <el-form-item label=" " style="margin-top: 48px">
              <el-button
                type="primary"
                :loading="saveLoading"
                @click="submitForm('formInfoRef2')"
              >
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import {
  insertList,
  updateList,
  insertHttpList,
  updateHttpMsg,
} from "@/api/maintainDialog";
export default {
  name: "maintainDialog",
  props: {
    dialogFormVisible: {
      type: Boolean,
      require: true,
      default: false,
    },
    isUpdate: {
      type: Boolean,
      default: false,
    },
    showType: {
      type: String,
      default: "",
    },
    moduleList: {
      type: Array,
      require: true,
      default: () => [],
    },
  },
  components: {},
  data() {
    return {
      activeName: "first",
      formModel: {
        moduleList: JSON.parse(JSON.stringify(this.moduleList)).map((item) => {
          item.localPart = item.localPart ? item.localPart : "operation";
          return item;
        }),
        httpModuleList: JSON.parse(JSON.stringify(this.moduleList)).map(
          (item) => {
            item.requestType = item.requestType ? item.requestType : 0;
            item.list =
              item.list && item.list.length
                ? item.list
                : [
                    {
                      headerName: "",
                      headerValue: "",
                    },
                  ];
            return item;
          }
        ),
      },
      saveLoading: false,
    };
  },
  computed: {
    Visible: {
      get() {
        return this.dialogFormVisible;
      },
      set(val) {
        this.$emit("update:dialogFormVisible", val);
      },
    },
  },
  watch: {},
  methods: {
    // 提交表单
    async submitForm(formEl) {
      if (!formEl) return;
      await this.$refs[formEl].validate((valid) => {
        if (valid) {
          this.handlerInsertOrUpdate(formEl);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 新增或删除请求头表单
    addOrdeleteRequestHeaderInfo(index, type) {
      if (type) {
        this.formModel.httpModuleList[index].list.push({
          headerName: "",
          headerValue: "",
        });
        return;
      }
      this.formModel.httpModuleList[index].list.splice(index, 1);
    },
    // 添加或编辑
    async handlerInsertOrUpdate(formEl) {
      // webService配置
      if (formEl === "formInfoRef1") {
        if (this.isUpdate) {
          const { code } = await updateList(this.formModel.moduleList[0]);
          if (code == 200) {
            this.$message.success("成功");
            this.$emit("handleFinsh");
          }
        } else {
          const { code } = await insertList(this.formModel.moduleList);
          if (code == 200) {
            this.$message.success("成功");
            this.$emit("handleFinsh");
          }
        }
        return;
      }
      // Http配置
      if (this.isUpdate) {
        const { code } = await updateHttpMsg(this.formModel.httpModuleList[0]);
        if (code == 200) {
          this.$message.success("成功");
          this.$emit("handleFinsh");
        }
      } else {
        const { code } = await insertHttpList(this.formModel.httpModuleList);
        if (code == 200) {
          this.$message.success("成功");
          this.$emit("handleFinsh");
        }
      }
    },
    close() {
      this.Visible = false;
      this.$emit("close");
    },
    beforeClose() {
      this.Visible = false;
      this.$emit("beforeClose");
    },
  },
  mounted() {
    if (this.showType === "1") {
      this.activeName = "second";
    } else {
      this.activeName = "first";
    }
  },
};
</script> 

<style lang='scss' scoped>
::v-deep .el-dialog .el-input__inner {
  width: 90%;
}
.el-dialog .requestTypeSelect {
  width: 80%;
  ::v-deep .el-input__inner {
    width: 100%;
  }
}

.maintain-dialog-container {
  .httpform {
    .header-info {
      margin-bottom: 10px;
    }
    .el-icon-circle-plus {
      font-size: 24px;
      color: #1489ff;
      margin-right: 4px;
      cursor: pointer;
      line-height: 40px;
    }
    .el-icon-remove {
      font-size: 24px;
      color: red;
      cursor: pointer;
      line-height: 40px;
    }
  }
}
</style>
