<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="5"
              :sm="5"
              :md="5"
              :lg="5"
              :xl="5">
        <div class="systemAside">
          <div class="title">系统</div>
          <el-input placeholder="系统名称、编码"
                    prefix-icon="el-icon-search"
                    v-model="systemName"
                    @input="systemNameChange()">
          </el-input>
          <div class="systemList">
            <div @click="activeClick(i, v)"
                 v-for="(v, i) in systemList"
                 :key="i"
                 :class="[
                'systemItem',
                i === activeClass ? 'activeSystemItem' : '',
              ]">
              <div class="systemName">
                <span>{{ v.sysName }}</span>
                <i v-show="i === activeClass"
                   class="el-icon-right"></i>
              </div>
              <div class="systemCode">系统编码：{{ v.sysId }}</div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="19"
              :sm="19"
              :md="19"
              :lg="19"
              :xl="19">
        <div class="systemMain">
          <div class="title">系统接口</div>
          <div class="systemMainContent">
            <div class="subscribeing">
              <SubscriptionList ref="child1"
                                :subscription="false"
                                :providerOrConsumer="false"
                                :activeSystemMsg="activeSystemMsg"
                                @checkList="notCheckClick" />
            </div>
            <div class="operation">
              <el-button round
                         size="small"
                         type="primary"
                         @click="subscriptionClick(true)">
                订阅 <i class="el-icon-right"></i>
              </el-button>
              <el-button icon="el-icon-back"
                         round
                         size="small"
                         @click="subscriptionClick(false)">取消</el-button>
            </div>
            <div class="subscribed">
              <SubscriptionList ref="child2"
                                :subscription="true"
                                :providerOrConsumer="false"
                                :activeSystemMsg="activeSystemMsg"
                                @checkList="CheckClick" />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <MaintainDialog v-if="dialogFormVisible"
                    :dialogFormVisible="dialogFormVisible"
                    :moduleList="moduleList"
                    @beforeClose="dialogFormVisible = false"
                    @close="dialogFormVisible = false"
                    @handleFinsh="handleFinsh" />
  </div>
</template>

<script>
import SubscriptionList from '@/components/SubscriptionList'
import MaintainDialog from '@/components/MaintainDialog'
import { debounce } from '@/utils/index'
import {
  consumerSysList as _consumerSysList,
  consumerUpdateSubscribeInterfaceList as _consumerUpdateSubscribeInterfaceList,
} from '@/api/common'
import { taskDeleteList } from '@/api/maintainDialog'
export default {
  components: {
    SubscriptionList,
    MaintainDialog,
  },
  data() {
    return {
      systemName: '',
      systemList: [],
      activeClass: undefined,
      activeSystemMsg: undefined,
      notCheckList: [],
      CheckList: [],
      moduleList: [],
      dialogFormVisible: false,
    }
  },
  created() {
    this.consumerSysList()
  },
  methods: {
    activeClick(i, v) {
      this.activeClass = i
      this.activeSystemMsg = {
        sysCode: v.sysId,
        sysId: v.id,
        sysName: v.sysName,
      }
    },
    notCheckClick(V) {
      this.notCheckList = V
    },
    CheckClick(V) {
      this.CheckList = V
    },
    systemNameChange: debounce(function () {
      this.activeClass = undefined
      this.activeSystemMsg = {}
      this.consumerSysList()
    }, 500),
    consumerSysList() {
      _consumerSysList({ queryCondition: this.systemName }).then((res) => {
        this.systemList = res.data
      })
    },
    handleFinsh() {
      this.dialogFormVisible = false
      this.subscription(true)
    },
    subscriptionClick(v) {
      if (v) {
        if (!this.notCheckList.length) {
          this.$message.warning('请先选择接口')
          return
        }
        const otherList = ['JY301', 'JY302', 'JY303']
        this.moduleList = this.notCheckList
          .map((item) => {
            item.interfaceCode = item.code
            item.sysCode = this.activeSystemMsg['sysCode']
            item.sysName = item.name
            return item
          })
          .filter(
            (child) =>
              child.groupName === '院内交互' && !otherList.includes(child.code)
          )
        if (this.moduleList.length > 0) {
          this.dialogFormVisible = true
        } else {
          this.subscription(v)
        }
      } else {
        this.subscription(v)
      }
    },
    subscription(v) {
      if (this.activeSystemMsg) {
        const data = {
          type: v ? 1 : 0,
          sysName: this.activeSystemMsg.sysName,
          sysId: this.activeSystemMsg.sysId,
          sysCode: this.activeSystemMsg.sysCode,
          list: v ? this.notCheckList : this.CheckList,
        }
        if (data.list.length == 0) {
          this.$message.warning('请先选择接口')
        } else {
          _consumerUpdateSubscribeInterfaceList(data).then((res) => {
            this.$message.success(v ? '订阅成功' : '取消订阅成功')
            this.$refs.child1.tableListData(data)
            this.$refs.child2.tableListData(data)
          })
          if (!v) {
            // 删除已订阅的维护地址以及其它
            const paramsData = this.CheckList.map((item) => ({
              interfaceCode: item.code,
              sysCode: this.activeSystemMsg['sysCode'],
            }))
            taskDeleteList(paramsData).then((res) => {})
          }
        }
      }
    },
  },
}
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
  .systemName {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 6px;
    display: flex;
    justify-content: space-between;
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
</style>