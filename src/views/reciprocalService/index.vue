<template>
  <div class="jsstyle">
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="24"
        :md="11"
        :lg="11"
        :xl="11">
        <div class="grid-content left">
          <div class="l_top">
            <el-card class="l_top_l">
              <div class="title">今日交互服务数量</div>
              <div class="flex-space-around">
                <div @click="goMsgLog('')">
                  <p class="number Info">{{ baseMsg.totalNum }}</p>
                  <p class="des">调用总数</p>
                </div>
                <div @click="goMsgLog('success')">
                  <p class="number success">{{ baseMsg.successNum }}</p>
                  <p class="des">调用成功数</p>
                </div>
                <div @click="goMsgLog('fail')">
                  <p class="number error">{{ baseMsg.errorNum }}</p>
                  <p class="des">调用失败数</p>
                </div>
              </div>
            </el-card>
          </div>
          <el-card class="l_center">
            <div class="title">
              <div>消息处理数量</div>
              <div class="search">
                时间选择：
                <el-select
                  @change="timeChange"
                  size="mini"
                  v-model="value"
                  placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div id="main"></div>
          </el-card>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="13"
        :lg="13"
        :xl="13">
        <div class="grid-content right">
          <ServiceStatistics
            type="service"
            class="statistics" />
          <ServiceStatistics
            type="system"
            class="statistics" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  countSeries as _countSeries,
  terminal as _terminal,
  project as _project,
  esbproject as _esbproject,
  computerSearch as _computerSearch,
  messagesDataClean as _messagesDataClean
} from '@/api/dashboard'
import {
  jhBaseMsg as _jhBaseMsg,
  jhTimeList as _jhTimeList,
  jhMsgHandleNum as _jhMsgHandleNum
} from '@/api/common'
import ServiceStatistics from './ServiceStatistics'
import moment from 'moment'
export default {
  name: 'Echarts',
  components: {
    ServiceStatistics
  },
  data() {
    return {
      interval: '1分钟',
      option: {},
      baseMsg: {
        totalNum: 0,
        errorNum: 0,
        successNum: 0
      },
      options: [
        {
          value: 'DAY',
          label: '一天'
        },
        {
          value: 'ONE_WEEK',
          label: '一周'
        },
        {
          value: 'TWO_WEEK',
          label: '两周'
        },
        {
          value: 'MONTH',
          label: '一个月'
        }
      ],
      value: 'DAY',

      formInline: {
        time: [new Date(new Date().setHours(0, 0, 0, 0)), new Date()]
      },
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
    timeChange() {
      this.jhMsgHandleNum()
    },
    goMsgLog(status) {
      const startOfDay = this.$moment().startOf('day')
      const beginTime = this.$moment(startOfDay).format('YYYY-MM-DD HH:mm:ss')
      const now = this.$moment()
      const endTime = this.$moment(now).format('YYYY-MM-DD HH:mm:ss')
      this.$router.push({
        path: '/messageLog/index',
        query: {
          status,
          beginTime,
          endTime
        }
      })
    },
    myEcharts() {
      this.myChart = this.$echarts.init(document.getElementById('main'))
    },
    jhBaseMsg() {
      _jhBaseMsg().then((res) => {
        this.baseMsg = res.data
      })
    },
    jhMsgHandleNum() {
      const data = {
        timeUnit: this.value
      }
      _jhMsgHandleNum(data).then((res) => {
        this.option = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {},

          toolbox: {
            show: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: res.data.map((item) => {
              return item.timeNode
            })
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name: `消息处理数量`,
              type: 'line',
              data: res.data.map((item) => {
                return item.num
              })
            }
          ]
        }
        this.myChart.setOption(this.option)
      })
    }
  },
  mounted() {
    this.myEcharts()
    window.addEventListener('resize', () => {
      this.myChart.resize()
    })
    this.jhBaseMsg()
    this.jhMsgHandleNum()
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {
      this.myChart.resize()
    })
  }
}
</script>

<style lang="scss" scoped>
.grid-content {
  height: 800px;
  border-radius: 8px;
  min-height: 36px;
}
.left {
  display: flex;
  flex-direction: column;
  .l_top {
    flex: 1;
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    .number {
      text-align: center;
      font-size: 24px;
      font-weight: 800;
    }
    .success {
      color: #0f6;
    }
    .error {
      color: #f00;
    }
    .Info {
      color: #909399;
    }
    .des {
      color: #98a6ad;
    }
    .l_top_l {
      width: 100%;
      background: #fff url(../../assets/error.png) no-repeat 94% 10%;
      .flex-space-around {
        cursor: pointer;
        margin-top: 30px;
      }
    }
  }
  .l_center {
    flex: 2;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .search {
        width: 200px;
        line-height: 28px;
        font-weight: normal;
        font-size: 14px;
        display: flex;
        ::v-deep .el-date-editor {
          width: 180px;
        }
        ::v-deep .el-select {
          width: 120px;
          margin-right: 10px;
        }
      }
    }
  }
}
.right {
  display: flex;
  flex-direction: column;
  .statistics {
    flex: 1;
    &:first-child {
      margin-bottom: 10px;
    }
  }
}
.title {
  font-size: 18px;
  font-weight: bold;
}
#main {
  height: 400px;
}
.jsstyle {
  width: 100%;
}
</style>
