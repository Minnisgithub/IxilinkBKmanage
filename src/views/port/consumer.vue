<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1">
        <div class="portAside">
          <i class="el-icon-menu"></i>
          <div class="portList">
            <div
              @click="activeClickPort(i, v)"
              v-for="(v, i) in portList"
              :key="i"
              :class="[
                'portItem',
                i === activeClassPort ? 'activePortItem' : '',
              ]"
            >
              <div class="portName">
                <span>{{ v }}</span>
                <i
                  v-show="i === activeClassPort"
                  class="el-icon-caret-right"
                ></i>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
        <div class="systemAside">
          <div class="title">接口</div>
          <el-input
            placeholder="接口名称、编码查询"
            prefix-icon="el-icon-search"
            v-model="systemName"
            @input="systemNameChange()"
          >
          </el-input>
          <div class="systemList">
            <div
              @click="activeClick(i, v)"
              v-for="(v, i) in systemList"
              :key="i"
              :class="[
                'systemItem',
                i === activeClass ? 'activeSystemItem' : '',
              ]"
            >
              <el-tooltip placement="top" :open-delay="500">
                <div slot="content">{{ v.name }}</div>
                <div class="systemName">
                  <span>{{ v.name }}</span>
                </div>
              </el-tooltip>
              <div class="systemCode">接口编码：{{ v.code }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
        <div class="systemMain">
          <div class="title">订阅系统</div>
          <div class="systemMainContent">
            <div class="subscribeing">
              <SubscriptionListPort
                ref="child1"
                :subscription="false"
                :providerOrConsumer="false"
                :activeSystemMsg="activeSystemMsg"
                @checkList="notCheckClick"
              />
            </div>
            <div class="operation">
              <el-button
                round
                type="primary"
                size="small"
                @click="subscriptionClick(true)"
              >
                订阅 <i class="el-icon-right"></i>
              </el-button>
              <el-button
                icon="el-icon-back"
                round
                size="small"
                @click="subscriptionClick(false)"
                >取消</el-button
              >
            </div>
            <div class="subscribed">
              <SubscriptionListPort
                ref="child2"
                :subscription="true"
                :providerOrConsumer="false"
                :activeSystemMsg="activeSystemMsg"
                @checkList="CheckClick"
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <MaintainDialog
      v-if="dialogFormVisible"
      :dialogFormVisible="dialogFormVisible"
      :moduleList="moduleList"
      @beforeClose="dialogFormVisible = false"
      @close="dialogFormVisible = false"
      @handleFinsh="handleFinsh"
    />
  </div>
</template>

<script>
import SubscriptionListPort from "@/components/SubscriptionListPort";
import MaintainDialog from "@/components/MaintainDialog";
import { debounce } from "@/utils/index";
import {
  consumerGroupList as _consumerGroupList,
  consumerProjectListByGroup as _consumerProjectListByGroup,
  consumerUpdateSysByProject as _consumerUpdateSysByProject,
} from "@/api/common";
import { taskDeleteList, httpTaskDeleteList } from "@/api/maintainDialog";
export default {
  components: {
    SubscriptionListPort,
    MaintainDialog,
  },
  data() {
    return {
      portList: [],
      checkPortName: "",
      systemName: "",
      systemList: [],
      activeClass: undefined,
      activeClassPort: 0,
      activeSystemMsg: undefined,
      notCheckList: [],
      CheckList: [],
      moduleList: [],
      dialogFormVisible: false,
    };
  },
  created() {
    _consumerGroupList().then((res) => {
      this.portList = res.data;
      this.checkPortName = this.portList[0];
      this.consumerProjectListByGroup();
    });
  },
  methods: {
    activeClickPort(i, v) {
      this.activeClassPort = i;
      this.checkPortName = v;
      this.systemName = "";
      this.activeClass = undefined;
      this.activeSystemMsg = {};
      this.consumerProjectListByGroup();
    },
    notCheckClick(V) {
      this.notCheckList = V;
      console.log(V);
    },
    CheckClick(V) {
      this.CheckList = V;
    },
    activeClick(i, code) {
      this.activeClass = i;
      this.activeSystemMsg = code;
    },
    systemNameChange: debounce(function () {
      this.activeClass = undefined;
      this.activeSystemMsg = {};
      this.consumerProjectListByGroup();
    }, 500),
    consumerProjectListByGroup() {
      _consumerProjectListByGroup({
        condition: this.systemName,
        groupCode: this.checkPortName,
      }).then((res) => {
        this.systemList = res.data;
      });
    },
    handleFinsh() {
      this.dialogFormVisible = false;
      this.subscription(true);
    },
    subscriptionClick(v) {
      if (v && this.activeSystemMsg["groupName"] === "院内交互") {
        if (!this.notCheckList.length) {
          this.$message.warning("请先选择接口");
          return;
        }
        const otherList = ["JY301", "JY302", "JY303"];
        this.moduleList = this.notCheckList
          .map((item) => {
            item.interfaceCode = this.activeSystemMsg["code"];
            item.sysCode = item.sysId;
            return item;
          })
          .filter((child) => !otherList.includes(child.interfaceCode));

        if (this.moduleList.length > 0) {
          this.dialogFormVisible = true;
        } else {
          this.subscription(v);
        }
      } else {
        this.subscription(v);
      }
    },
    subscription(v) {
      if (this.activeSystemMsg) {
        const data = {
          type: v ? 1 : 0,
          projectName: this.activeSystemMsg.name,
          projectId: this.activeSystemMsg.id,
          projectCode: this.activeSystemMsg.code,
          list: v ? this.notCheckList : this.CheckList,
        };
        if (data.list.length == 0) {
          this.$message.warning("请先选择接口");
        } else {
          _consumerUpdateSysByProject(data).then((res) => {
            this.$message.success(v ? "订阅成功" : "取消订阅成功");
            this.$refs.child1.tableListData(this.activeSystemMsg);
            this.$refs.child2.tableListData(this.activeSystemMsg);
          });
          if (!v) {
            // 删除已订阅的维护地址以及其它
            const webServerSubCheckList = this.CheckList.filter(
              (item) => item.consumerType === "0"
            );
            const httpSubCheckList = this.CheckList.filter(
              (item) => item.consumerType === "1"
            );
            if (webServerSubCheckList.length > 0) {
              const paramsData1 = webServerSubCheckList.map((item) => ({
                interfaceCode: item.projectCode,
                sysCode: item.sysCode,
              }));
              taskDeleteList(paramsData1).then((res) => {});
            }
            if (httpSubCheckList.length > 0) {
              const paramsData2 = httpSubCheckList.map((item) => ({
                interfaceCode: item.projectCode,
                sysCode: item.sysCode,
              }));
              httpTaskDeleteList(paramsData2).then((res) => {});
            }
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.systemAside,
.systemMain {
  height: calc(100vh - 174px);
  border-radius: 8px;
  padding: 20px;
  background-color: #fff;
  .title {
    color: #444;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
.systemList {
  height: calc(100vh - 284px);
  overflow-x: hidden;
  //   overflow-y: scroll;
}
.systemList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.systemList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(231, 226, 226, 0.808);
}
.systemItem {
  height: 70px;
  padding: 10px;
  // background-color: red;
  margin-top: 10px;
  cursor: pointer;
  .systemName {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 6px;
    // display: flex;
    // justify-content: space-between;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //用省略号显示
    white-space: nowrap; //不换行
  }
  .systemCode {
    color: #b1b3ba;
    font-size: 14px;
  }
}
.activeSystemItem {
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  border-radius: 8px;
  color: #4e70f1;
  .systemCode {
    color: #4e70f1;
  }
}
.el-input {
  margin-bottom: 10px;
}
.systemMainContent {
  height: calc(100vh - 250px);
  display: flex;
  .subscribeing {
    width: 45%;
    // background-color: #444;
  }
  .operation {
    width: 20%;
    // background-color: rgb(175, 194, 125);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-button {
      margin: 8px 0;
    }
  }
  .subscribed {
    width: 45%;
    // background-color: #444;
  }
}
.el-icon-menu {
  font-size: 40px;
  margin-left: 8px;
  color: #b1b3ba;
}

.portAside {
  height: calc(100vh - 174px);
  border-radius: 8px;
  min-width: 62px;
  color: #b1b3ba;
  .portList {
    height: calc(100vh - 204px);
    overflow-x: hidden;
    .activePortItem {
      color: #4e70f1;
    }
    .portItem {
      height: 70px;
      padding: 10px;
      // background-color: red;
      margin-top: 10px;
      .portName {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 6px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        span {
          display: inline-block;
          min-width: 40px;
        }
      }
    }
    //   overflow-y: scroll;
  }
}

.portList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.portList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(231, 226, 226, 0.808);
}
</style>