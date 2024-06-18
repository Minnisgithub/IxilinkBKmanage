<template>
  <div>
    <div class="header">
      <!-- <div class="runTime">
        <div class="img"></div>
        <div>
          <p>系统运行时间</p>
          <p>
            <span>{{ runTime }}</span> 天安全运行
          </p>
        </div>
      </div> -->
      <div class="terminal">
        <div>
          <p>
            <img
              :src="terminalImg"
              alt="" />
            终端
          </p>
          <p class="fs20">
            <span class="blue">{{ partTerminalNum }}</span
            >/{{ terminalNum }}
          </p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="projectNum">
        <div>
          <p>
            <img
              :src="projectNumImg"
              alt="" />项目
          </p>
          <p class="fs20">
            <span class="blue">{{ partProjectNum }}</span
            >/{{ projectNum }}
          </p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>

      <div class="overallReceiveCount">
        <div>
          <p>
            <img
              :src="overallReceiveCountImg"
              alt="" />历史接收消息总数
          </p>
          <p class="fs20">{{ overallReceiveCount }}</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>

      <div class="overallSendCount">
        <div>
          <p>
            <img
              :src="overallSendCountImg"
              alt="" />历史发送消息总数
          </p>
          <p class="fs20">{{ overallSendCount }}</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <!-- <div class="overallReceiveCount">
        <div>
          <p><i class="el-icon-s-help"></i>今日服务调用总数</p>
          <p class="fs20">{{ baseMsg.total }}</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="overallReceiveCount">
        <div>
          <p><i class="el-icon-circle-check"></i>今日服务调用成功数</p>
          <p class="fs20">{{ baseMsg.success  }}</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="overallReceiveCount">
        <div>
          <p><i class="el-icon-circle-close"></i>今日服务调用失败数</p>
          <p class="fs20">{{ baseMsg.fail  }}</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider> -->
      <div class="overallReceiveCount">
        <div>
          <p><i class="el-icon-s-help"></i>接口项目总数</p>
          <p class="fs20">{{ baseMsg.interfaceTotal }}</p>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="overallReceiveCount">
        <div>
          <p><i class="el-icon-help"></i>集成项目总数</p>
          <p class="fs20">{{ baseMsg.integrationTotal }}</p>
        </div>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col
        :xs="24"
        :sm="24"
        :md="15"
        :lg="15"
        :xl="15">
        <div class="grid-content left">
          <div class="l_top">
            <el-card class="l_top_l">
              <div class="title">错误消息数量</div>
              <div class="flex-space-around">
                <div>
                  <p class="number success">{{ jccount }}</p>
                  <p class="des">集成项目</p>
                </div>
                <div>
                  <p class="number error">{{ jkcount }}</p>
                  <p class="des">接口项目</p>
                </div>
              </div>
            </el-card>
            <el-card class="l_top_m">
              <div class="title">今日服务</div>
              <div class="flex-space-around">
                <div class="item" @click="goMsgLog('')">
                  <p class="number Info">{{ baseMsg.total }}</p>
                  <p class="des">调用总数</p>
                </div>
                <div  class="item" @click="goMsgLog('success')">
                  <p class="number success">{{ baseMsg.success }}</p>
                  <p class="des">调用成功数</p>
                </div>
                <div  class="item" @click="goMsgLog('fail')">
                  <p class="number error">{{ baseMsg.fail }}</p>
                  <p class="des">调用失败数</p>
                </div>
              </div>
            </el-card>
            <el-card class="l_top_r">
              <div class="title">队列警报</div>
              <div class="flex-space-around">
                <div>
                  <p class="number Info">{{ jbcount }}</p>
                  <p class="des">队列警报</p>
                </div>
              </div>
            </el-card>
          </div>
          <el-card class="l_center">
            <div class="title">
              <div>消息处理数量（采集间隔 {{ interval }}）</div>
              <div class="search">
                <el-select
                  v-model="msgValue"
                  @change="msgValueChange"
                  placeholder="请选择"
                  size="mini">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <DatePicker
                  ref="datePicker"
                  @dateChange="timeChange"></DatePicker>
                <el-button
                  size="mini"
                  icon="el-icon-refresh"
                  @click="refesh"></el-button>
              </div>
            </div>
            <div id="main"></div>
          </el-card>
          <el-card class="l_bottom">
            <div class="title">CPU</div>
            <div id="main1"></div>
          </el-card>
        </div>
      </el-col>
      <el-col
        :xs="24"
        :sm="24"
        :md="9"
        :lg="9"
        :xl="9">
        <div class="grid-content right">
          <el-card class="r_top">
            <div
              style="margin-bottom: 20px"
              class="title">
              消息清理调度信息
            </div>
            <div>
              <el-alert
                v-if="skippedDates.length > 0"
                title="错误消息未清理"
                type="warning"
                show-icon
                :closable="false">
              </el-alert>
              <el-alert
                v-else
                title="消息已清理"
                type="success"
                show-icon
                :closable="false">
              </el-alert>
              <el-descriptions :column="1">
                <el-descriptions-item
                  label="开始时间"
                  label-class-name="my-label"
                  content-class-name="my-content"
                  >{{ startTime }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="清理时长"
                  label-class-name="my-label"
                  content-class-name="my-content"
                  >{{ duration }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="配置数据保存期限"
                  label-class-name="my-label"
                  content-class-name="my-content"
                  >{{ configuredRetention }}</el-descriptions-item
                >
                <el-descriptions-item
                  label="实际数据保存期限"
                  label-class-name="my-label"
                  content-class-name="my-content">
                  {{ actualRetention }}
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </el-card>
          <el-card class="r_center">
            <div class="title">堆内存</div>
            <div id="main2"></div>
          </el-card>
          <el-card class="r_bottom">
            <div class="title">磁盘空间</div>
            <div id="main3"></div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  currentTime as _currentTime,
  overallReceiveCount as _overallReceiveCount,
  jccount as _jccount,
  jkcount as _jkcount,
  jblengths as _jblengths,
  alljblengths as _alljblengths,
  countSeries as _countSeries,
  terminal as _terminal,
  project as _project,
  esbproject as _esbproject,
  computerSearch as _computerSearch,
  messagesDataClean as _messagesDataClean
} from '@/api/dashboard'
import DatePicker from '@/components/DatePicker'
import { baseMsg as _baseMsg } from '@/api/common'

export default {
  name: 'Echarts',
  components: {
    DatePicker
  },
  data() {
    return {
      terminalImg: require('@/assets/terminal.png'),
      projectNumImg: require('@/assets/projectNum.png'),
      overallReceiveCountImg: require('@/assets/overallReceiveCount.png'),
      overallSendCountImg: require('@/assets/overallSendCount.png'),
      runTime: 0, // 安全运行时间
      partTerminalNum: 0,
      terminalNum: 0,
      projectNum: 0,
      partProjectNum: 0,
      overallSendCount: 0, // 历史发送消息总数
      overallReceiveCount: 0, // 历史接收消息总数
      jccount: 0,
      jkcount: 0,
      jbcount: 0,
      interval: '1分钟',
      options: [
        {
          value: '接收',
          label: '接收'
        },
        {
          value: '发送',
          label: '发送'
        }
      ],
      msgValue: '接收',
      option: {},
      option1: {},
      ProcessCpuLoad: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      SystemCpuLoad: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ],
      option2: {},
      option3: {},
      startTime: '',
      duration: '',
      actualRetention: '',
      configuredRetention: '',
      skippedDates: [],
      baseMsg: {
        total: 0,
        success: 0,
        fail: 0,
        interfaceTotal: 0,
        integrationTotal: 0
      }
    }
  },

  methods: {
    // 错误消息数量
    errorMsg() {
      _jccount().then((res) => {
        this.jccount = res.totalCount
      })
      _jkcount().then((res) => {
        this.jkcount = res.totalCount
      })
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
    // 队列警报
    jblengths() {
      _jblengths().then((res) => {
        if (res) {
          _alljblengths().then((item) => {
            this.judgeEndpoints(res.endpoints, item.endpoints)
            this.judgeProjects(res.projects, item.projects)
            this.jbcount =
              this.judgeEndpoints(res.endpoints, item.endpoints).length +
              this.judgeProjects(res.projects, item.projects).length
          })
        }
      })
    },
    judgeEndpoints(endpoints, allendpoints) {
      let overPoints = []
      for (const key in endpoints) {
        for (const allkey in allendpoints) {
          if (key == allkey) {
            if (endpoints[key].length > allendpoints[allkey].warning) {
              overPoints.push([endpoints[key].name, endpoints[key].length])
            }
          }
        }
      }
      return overPoints
    },
    judgeProjects(projects, allProjects) {
      let overPoints = []
      for (const key in projects) {
        for (const allkey in allProjects) {
          if (key == allkey) {
            for (const ckey in projects[key].routes) {
              for (const callkey in allProjects[allkey]) {
                if (callkey == ckey) {
                  if (
                    projects[key].routes[ckey].length >
                    allProjects[allkey][callkey].warning
                  ) {
                    overPoints.push(
                      projects[key].name +
                        [
                          projects[key].routes[ckey].name,
                          projects[key].routes[ckey].length
                        ]
                    )
                  }
                }
              }
            }
          }
        }
      }
      return overPoints
    },
    // 消息处理数量
    msgValueChange() {
      this.$refs.datePicker.dateChange()
    },
    refesh() {
      this.$refs.datePicker.dateChange()
    },
    timeChange(v) {
      const numPoints = v.numPoints
      if (numPoints === 60) {
        this.interval = '1分钟'
      } else if (numPoints === 72) {
        this.interval = '30分钟'
      } else if (numPoints === 42) {
        this.interval = '6小时'
      } else if (numPoints === 84) {
        this.interval = '6小时'
      } else if (numPoints === 180) {
        this.interval = '6小时'
      }
      _countSeries(v).then((res) => {
        let { receiveCount, receiveErrorCount, sendCount, sendErrorCount } =
          res.primary
        const timeLength = res.primary.receiveCount.map((item) => {
          return new Date(+new Date(item.timestamp) + 8 * 3600 * 1000)
            .toISOString()
            .replace(/T/g, ' ')
            .replace(/\.[\d]{3}Z/, '')
        })
        let data1 = this.msgValue == '接收' ? receiveCount : sendCount
        let data2 = this.msgValue == '接收' ? receiveErrorCount : sendErrorCount
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
            data: timeLength,
            show: false //让刻度隐藏
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name: `主机${this.msgValue}消息量`,
              type: 'line',
              data: data1.map((item) => {
                return item.value
              })
            },
            {
              name: `主机${this.msgValue}错误消息量`,
              type: 'line',
              data: data2.map((item) => {
                return item.value
              })
            }
          ]
        }
        this.myChart.setOption(this.option)
      })
    },
    myEcharts() {
      this.myChart = this.$echarts.init(document.getElementById('main'))
      this.myChart1 = this.$echarts.init(document.getElementById('main1'))
      this.myChart2 = this.$echarts.init(document.getElementById('main2'))
      this.myChart3 = this.$echarts.init(document.getElementById('main3'))
      this.myChart3.setOption(this.option3)
    },
    computerSearch() {
      const data = [
        {
          type: 'read',
          mbean: 'loki:type=FileSystem',
          attribute: 'Total',
          group: 'disk',
          path: null
        },
        {
          type: 'read',
          mbean: 'loki:type=FileSystem',
          attribute: 'UsePercent',
          group: 'disk',
          path: null
        },
        {
          type: 'read',
          mbean: 'loki:type=FileSystem',
          attribute: 'Used',
          group: 'disk',
          path: null
        },
        {
          type: 'read',
          mbean: 'java.lang:type=OperatingSystem',
          attribute: 'FreePhysicalMemorySize',
          group: 'memory',
          path: null
        },
        {
          type: 'read',
          mbean: 'java.lang:type=OperatingSystem',
          attribute: 'TotalPhysicalMemorySize',
          group: 'memory',
          path: null
        },
        {
          type: 'read',
          mbean: 'java.lang:type=Memory',
          attribute: 'HeapMemoryUsage',
          group: 'langMemory',
          path: 'committed'
        },
        {
          type: 'read',
          mbean: 'java.lang:type=Memory',
          attribute: 'NonHeapMemoryUsage',
          group: 'langMemory',
          path: 'committed'
        },
        {
          type: 'read',
          mbean: 'java.lang:type=OperatingSystem',
          attribute: 'ProcessCpuLoad',
          group: 'cpu',
          path: null
        },
        {
          type: 'read',
          mbean: 'java.lang:type=OperatingSystem',
          attribute: 'SystemCpuLoad',
          group: 'cpu',
          path: null
        }
      ]
      _computerSearch(data).then((res) => {
        this.ProcessCpuLoad.push(res[7].value * 100)
        this.ProcessCpuLoad.shift()
        this.SystemCpuLoad.push(res[8].value * 100)
        this.SystemCpuLoad.shift()
        this.option1 = {
          legend: {
            right: '10%',
            data: [
              { icon: 'circle', name: '进程CPU负载' },
              { icon: 'circle', name: '系统CPU负载' }
            ]
          },
          xAxis: {
            type: 'category'
          },
          yAxis: {
            type: 'value',
            min: 0,
            max: 100
          },
          color: ['#35c5cb', '#7e90e3'],
          series: [
            {
              name: `进程CPU负载`,
              data: this.ProcessCpuLoad,
              type: 'line',
              smooth: true,
              symbol: 'none',
              areaStyle: {
                color: '#35c5cb'
              },
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#35c5cb' //改变折线颜色
                  }
                }
              }
            },
            {
              name: `系统CPU负载`,
              data: this.SystemCpuLoad,
              type: 'line',
              smooth: true,
              areaStyle: { color: '#e6f2f9' },
              symbol: 'none',
              itemStyle: {
                normal: {
                  lineStyle: {
                    color: '#7e90e3' //改变折线颜色
                  }
                }
              }
            }
          ]
        }
        this.myChart1.setOption(this.option1)
        let pileUsable =
          Math.floor((res[3].value / 1024 / 1024 / 1024) * 100) / 100
        let pileEngine =
          Math.floor(
            ((res[5].value + res[6].value) / 1024 / 1024 / 1024) * 100
          ) / 100
        let pileOther =
          Math.floor((res[4].value / 1024 / 1024 / 1024) * 100) / 100 -
          pileUsable -
          pileEngine
        this.option2 = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: 'center',
            right: '0',
            orient: 'vertical',
            formatter: (name) => {
              let data = this.option2.series[0].data
              let total = 0
              let tarValue = 0
              for (let i = 0, l = data.length; i < l; i++) {
                total += data[i].value
                if (data[i].name == name) {
                  tarValue = data[i].value
                }
              }
              let p = ((tarValue / total) * 100).toFixed(0)
              return name + p + '%'
            }
          },
          tooltip: {
            formatter: (params) => {
              return params.data.name + ' ' + params.value + ' ' + 'GB'
            }
          },
          series: [
            {
              name: '磁盘空间',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              color: ['#67C23A', '#6d7ee1', '#34c6d0'],
              data: [
                { value: pileUsable, name: '可用' },
                { value: pileEngine, name: '引擎' },
                { value: pileOther, name: '其他' }
              ]
            }
          ]
        }
        this.myChart2.setOption(this.option2)

        let diskspaceAll =
          Math.floor((res[0].value / 1024 / 1024 / 1024) * 100) / 100
        let diskspaceUsed =
          Math.floor((res[2].value / 1024 / 1024 / 1024) * 100) / 100
        this.option3 = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: 'center',
            right: '0',
            orient: 'vertical',
            formatter: (name) => {
              let data = this.option3.series[0].data
              let total = 0
              let tarValue = 0
              for (let i = 0, l = data.length; i < l; i++) {
                total += data[i].value
                if (data[i].name == name) {
                  tarValue = data[i].value
                }
              }
              let p = ((tarValue / total) * 100).toFixed(0)
              return name + p + '%'
            }
          },
          tooltip: {
            formatter: (params) => {
              return params.data.name + ' ' + params.value + ' ' + 'GB'
            }
          },
          series: [
            {
              name: '磁盘空间',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              color: ['#67C23A', '#6d7ee1'],
              data: [
                { value: diskspaceAll - diskspaceUsed, name: '可用' },
                { value: diskspaceUsed, name: '已用' }
              ]
            }
          ]
        }
        this.myChart3.setOption(this.option3)
      })
    },
    countTime() {
      this.timeObject = setInterval(() => {
        this.computerSearch()
      }, 3000)
    }
  },
  mounted() {
    _baseMsg().then((res) => {
      console.log(res)
      this.baseMsg = res.data
    })
    // 运行时间
    _currentTime().then((res) => {
      // 接口获取时间
      // const date = new Date(res.issueDate);
      // const newdata = new Date();
      // let dateDiff = newdata.getTime() - date.getTime();
      // this.runTime = Math.floor(dateDiff / (24 * 3600 * 1000));
      // 配合odin平台时间
      this.runTime = this.$moment()
        .diff(this.$moment('2021-06-30'), 'days')
        .toString()
    })
    //  历史收发消息
    _overallReceiveCount().then((res) => {
      this.overallReceiveCount = res.primary.overallReceiveCount
      this.overallSendCount = res.primary.overallSendCount
    })
    // 终端
    _terminal().then((res) => {
      this.terminalNum = res.length
      let sum = 0
      for (const iterator of res) {
        if (iterator.state == 'STARTED') {
          sum++
        }
      }
      this.partTerminalNum = sum
    })
    // 项目
    _project().then((res) => {
      this.projectNum += res.length
      for (const iterator of res) {
        if (iterator.status == 'STARTED') {
          this.partProjectNum++
        }
      }
    })
    _esbproject().then((res) => {
      this.projectNum += res.length
      for (const iterator of res) {
        if (iterator.status == 'STARTED') {
          this.partProjectNum++
        }
      }
    })
    this.errorMsg() // 错误消息数量
    this.jblengths() // 队列警报
    this.$refs.datePicker.dateChange(60) //消息处理数量(默认1小时)
    this.myEcharts()
    window.addEventListener('resize', () => {
      this.myChart.resize()
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
    })
    // cpu 堆内存 磁盘空间
    this.countTime()
    this.computerSearch()
    _messagesDataClean().then((res) => {
      this.startTime = new Date(+new Date(res.startTime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      this.duration = res.duration + 'ms'
      this.actualRetention = new Date(
        +new Date(res.actualRetention) + 8 * 3600 * 1000
      )
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      this.configuredRetention = new Date(
        +new Date(res.configuredRetention) + 8 * 3600 * 1000
      )
        .toISOString()
        .replace(/T/g, ' ')
        .replace(/\.[\d]{3}Z/, '')
      this.skippedDates = res.skippedDates
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {
      this.myChart.resize()
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
    })
    clearInterval(this.timeObject)
  }
}
</script>

<style lang="scss" scoped>
.header {
  height: 70px;
  display: flex;
  color: #444747;
  margin-bottom: 6px;
  .el-divider {
    height: 60px;
  }
  .fs20 {
    padding-top: 8px;
    font-size: 20px;
    font-weight: bold;
  }
  img {
    vertical-align: top;
  }
  .blue {
    color: #506cd4;
  }
  p {
    margin: 6px;
  }
  .runTime {
    display: flex;
    min-width: 200px;
    .img {
      width: 54px;
      height: 54px;
      background-image: url(../../assets/runTime.png);
    }
    span {
      color: #00c1b5;
      font-size: 26px;
      font-weight: bold;
    }
  }
  .terminal {
    width: 220px;
    text-align: center;
  }
  .projectNum {
    width: 220px;
    text-align: center;
  }
  .overallReceiveCount {
    width: 260px;
    text-align: center;
  }
  .overallSendCount {
    width: 260px;
    text-align: center;
  }
}
.grid-content {
  border-radius: 8px;
  min-height: 36px;
}
.left {
  .l_top {
    height: 150px;
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
      flex: 2;
      background: #fff url(../../assets/error.png) no-repeat 94% 10%;
    }
    .l_top_m {
      flex: 3;
      margin: 0 10px;
      background: #fff url(../../assets/error.png) no-repeat 94% 10%;
      .item {
        cursor: pointer;
      }
    }
    .l_top_r {
      flex: 2;
      background: #fff url(../../assets/warning.png) no-repeat 94% 10%;
    }
  }
  .l_center {
    height: 390px;
    margin-bottom: 10px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .search {
        width: 300px;
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
  .l_bottom {
    height: 200px;
  }
}
.right {
  .r_top {
    height: 320px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  .r_center {
    height: 200px;
    margin-bottom: 10px;
  }
  .r_bottom {
    height: 220px;
  }
}
.title {
  font-size: 18px;
  font-weight: bold;
}
#main {
  height: 340px;
}
#main1 {
  height: 200px;
}
#main2 {
  height: 160px;
}
#main3 {
  height: 180px;
}
::v-deep .my-label {
  width: 140px;
}
.el-descriptions {
  margin-top: 10px;
  padding: 8px;
}
</style>
