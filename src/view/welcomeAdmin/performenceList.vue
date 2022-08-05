<template>
  <div class="performenceList">
    <el-row>
      <el-col :span="4">
        <mark
          style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999"
          v-show="showSeason"
          @click.stop="showSeason=false"
        ></mark>
        <el-input placeholder="请选择季度" v-model="selectedSeason" style="width:200px"
                  @focus="showSeason=true">
          <i slot="prefix" class="el-input__icon el-icon-date"></i>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-card
        class="box-card"
        style="width:322px;padding: 0 3px 20px;margin-top:10px;margin-left:0;position:fixed;z-index:9999;background-color: white !important;"
        v-show="showSeason"
      >
        <div slot="header" class="clearfix" style="text-align:center;padding:0">
          <button
            type="button"
            aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            @click="prev"
          ></button>
          <span role="button" class="el-date-picker__header-label">{{ year }}年</span>
          <button
            type="button"
            aria-label="后一年"
            @click="next"
            class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
          ></button>
        </div>
        <div class="text item" style="text-align:center;">
          <el-button
            type="text"
            size="medium"
            style="width:40%;color: #606266;float:left;"
            @click="selectSeason(0)"
          >第一季度
          </el-button>
          <el-button
            type="text"
            size="medium"
            style="float:right;width:40%;color: #606266;"
            @click="selectSeason(1)"
          >第二季度
          </el-button>
        </div>
        <div class="text item" style="text-align:center;">
          <el-button
            type="text"
            size="medium"
            style="width:40%;color: #606266;float:left;"
            @click="selectSeason(2)"
          >第三季度
          </el-button>
          <el-button
            type="text"
            size="medium"
            style="float:right;width:40%;color: #606266;"
            @click="selectSeason(3)"
          >第四季度
          </el-button>
        </div>
      </el-card>
    </el-row>
    <el-row>
      <el-col class="table_title">
        <span>绩效排名(点击查看投票详情)</span>
      </el-col>
    </el-row>
    <el-row class="rank">
      <div id="barChart" class="barChart" style="height: 550px;"></div>
    </el-row>
    <el-dialog class="voteDetail" title="投票详情" :visible.sync="dialogFormVisible" :append-to-body="true" :show-close="false">
      <el-row>
        <el-table :data="voteData.slice((current-1)*size,current*size)" style="width: 100%" stripe highlight-current-row :header-cell-style="{
                'background-color': '#f0f8ff',
                'height': '40px',
                'padding':'0',
                'border': '1px solid #E2F0FAFF',
                'font-size':'0.9vw',
                'color':'#666666',
                'text-align':'center'
            }" :cell-style="{padding:'0px',height: '50px','text-align':'center'} ">
          <el-table-column prop="dept_id" label="部门编号" v-if="false"></el-table-column>
          <el-table-column prop="realName" label="评分人"></el-table-column>
          <el-table-column label="评分项">
            <el-table-column prop="ability_1" label="工作能力"></el-table-column>
            <el-table-column prop="ability_2" label="态度"></el-table-column>
            <el-table-column prop="ability_3" label="领导力"></el-table-column>
            <el-table-column prop="grade" label="平均得分"></el-table-column>
          </el-table-column>
<!--          <el-table-column prop="grade" label="平均分"></el-table-column>-->
        </el-table>
      </el-row>
      <el-row :span='24'><div class="pagination">
        <el-pagination
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="current"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="size"
          :page-count="5"
        >
        </el-pagination></div>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getPerformenceList, getVoteDetail} from '../../api/login/performence'
import qs from 'qs'
import performence from '../../store/models/performence'
export default {
  name: 'performenceList',
  data () {
    return {
      valueArr: ['-01', '-02', '-03', '-04'], // 接口接受的格式（一个季度传一个整体时间）
      // valueArr: ['01-02-03', '04-05-06', '07-08-09', '10-11-12'],//接口接受的格式（一个季度传一个每个的时间，一个季度三个月）
      showSeason: '',
      selectedSeason: '',
      season: '',
      year: new Date().getFullYear(),
      performenceData: '',
      performence_id: '',
      performence_data: '',
      dept: '',
      manager: '',
      grade: '',
      current: 1,
      total: 0,
      size: 10,
      ydata: [],
      xdata: [],
      dialogFormVisible: false,
      voteData: []
    }
  },
  mounted () {
    let that = this
    that.barChartContainer = that.$echarts.init(document.getElementById('barChart'))
    that.barChartContainer.on('click', function (params) {
      let param = {
        'dept_id': params.data.deptId,
        'data': (that.selectedSeason || ' ').slice(0, 4) + '-' + Number.parseInt((that.selectedSeason || ' ').slice(6, 7)) * 3 + '-' + '28'
      }
      getVoteDetail(qs.stringify(param)).then(res => {
        if (res.data.code === 200) {
          that.voteData = res.data.data
          that.total = res.data.data.length
        }
      }).catch(function (error) { console.log('getVoteDetail error') })
      that.dialogFormVisible = true
      // that.$router.push({path: '/welcomeAdmin/devoteDetail', query: {deptId: params.data.deptId}})
    }) // 柱状图绑定事件，点击查看绩效详情
    that.getCurrentSeason() // 刷新数据
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
    },
    handleCurrentChange (val) {
      this.current = val
    },
    getCurrentSeason () {
      let today = new Date() // 获取当前时间
      let year = today.getFullYear()
      let month = today.getMonth() + 1// getMonth返回0-11
      if (month >= 1 && month <= 3) {
        this.selectedSeason = `${year}年第1季度`
      } else if (month >= 4 && month <= 6) {
        this.selectedSeason = `${year}年第2季度`
      } else if (month >= 7 && month <= 9) {
        this.selectedSeason = `${year}年第3季度`
      } else {
        this.selectedSeason = `${year}年第4季度`
      }
      let params = {
        'data': this.selectedSeason.slice(0, 4) + '-' + Number.parseInt(this.selectedSeason.slice(6, 7)) * 3 + '-' + '28'
      }
      getPerformenceList(qs.stringify(params)).then(res => {
        if (res.data.code === 200) {
          this.ydata = []
          this.xdata = []
          for (let i = 0; i < res.data.data.length; i++) {
            this.ydata.push(res.data.data[i].dept_name + ':' + res.data.data[i].managerName)
            this.xdata.push({value: Number.parseFloat(res.data.data[i].grade), deptId: res.data.data[i].dept_id})
          }
        }
      }).catch(function (error) { console.log('performenceDetail error') })
      setTimeout(() => {
        this.drawChart(this.xdata, this.ydata)
      }, 1000)
    },
    prev () {
      this.year = this.year - 1
    },
    next () {
      this.year = this.year + 1
    },
    selectSeason (i) {
      this.season = i + 1
      // this.showSeason = `${this.year}` + this.valueArr[i]
      this.showSeason = false
      this.selectedSeason = `${this.year}年第${this.season}季度`
      // let latestData = {
      //   hasData: true,
      //   selectedSeason: this.selectedSeason
      // }
      // this.$store.commit('setSelectedSeason', latestData)
      let params = {
        'data': this.selectedSeason.slice(0, 4) + '-' + Number.parseInt(this.selectedSeason.slice(6, 7)) * 3 + '-' + '28'
      }
      getPerformenceList(qs.stringify(params)).then(res => {
        if (res.data.code === 200) {
          this.ydata = []
          this.xdata = []
          for (let i = 0; i < res.data.data.length; i++) {
            // this.ydata.push({value: res.data.data[i].dept_name + ':' + res.data.data[i].managerName, deptId: res.data.data[i].dept_id})
            this.ydata.push(res.data.data[i].dept_name + ':' + res.data.data[i].managerName)
            this.xdata.push({value: Number.parseFloat(res.data.data[i].grade), deptId: res.data.data[i].dept_id})
          }
        }
      }).catch(function (error) { console.log('performenceDetail error') })
      setTimeout(() => {
        this.drawChart(this.xdata, this.ydata)
      }, 1000)
    },
    drawChart (xdata, ydata) {
      let option = {
        // timeline: {
        //   data: [1, 2, 3, 4], // timeline.data 中的每一项，对应于 options 数组中的每个 option
        //   label: {
        //     formatter: function (s) { return '第' + s + '页' }
        //   },
        //   autoPlay: false,
        //   playInterval: 1000,
        //   tooltip: {formatter: function (s) { return '第' + s.value + '页' }}
        // },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '150',
          right: '20',
          bottom: '20',
          top: '20',
          containLabel: false
        },
        xAxis: {
          type: 'value',
          show: false
        },
        yAxis: {
          type: 'category',
          data: ydata,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 120,
            width: 200,
            align: 'left',
            overflow: 'truncate',
            formatter: function (value, index) { // 处理文字过长换行显示的问题
              let str = ''
              const num = 9 // 每行显示字数
              const valLength = value.length // 该项x轴字数
              const rowNum = Math.ceil(valLength / num) // 行数
              if (rowNum > 1) {
                for (let i = 0; i < rowNum; i++) {
                  let temp = ''
                  const start = i * num
                  const end = start + num

                  temp = value.substring(start, end) + '\n'
                  str += temp
                }
                value = str
              }
              let ind = index + 1
              if (ind === ydata.length) {
                return '{one|' + (ydata.length - index) + '} {a|' + value + '}'
              } else if (ind + 1 === ydata.length) {
                return '{two|' + (ydata.length - index) + '} {b|' + value + '}'
              } else if (ind + 2 === ydata.length) {
                return (
                  '{three|' + (ydata.length - index) + '} {c|' + value + '}'
                )
              }
              if (ydata.length - index > 9) {
                return (
                  '{five|' + (ydata.length - index) + '} {d|' + value + '}'
                )
              }
              return '{four|' + (ydata.length - index) + '} {d|' + value + '}'
            },
            rich: {
              a: {
                color: '#59c9f9'
              },
              b: {
                color: '#59c9f9'
              },
              c: {
                color: '#59c9f9'
              },
              d: {
                color: '#59c9f9'
              },
              // 第一名
              one: {
                backgroundColor: '#E86452',
                color: 'white',
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11
              },
              // 第二名
              two: {
                backgroundColor: '#FF9845',
                color: 'white',
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11
              },
              // 第三名
              three: {
                backgroundColor: '#F6BD16',
                color: 'white',
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11
              },
              // 一位数
              four: {
                backgroundColor: 'rgba(0,0,0,0.15)',
                color: 'white',
                width: 12,
                height: 16,
                padding: [1, 0, 0, 5],
                borderRadius: 10,
                fontSize: 11
              },
              // 两位数
              five: {
                backgroundColor: 'rgba(0,0,0,0.15)',
                color: 'white',
                width: 16,
                height: 16,
                padding: [1, 0, 0, 1],
                borderRadius: 10,
                fontSize: 11
              }
            }
          }
        },
        series: [{
          type: 'bar',
          showBackground: true,
          label: {
            show: true,
            position: 'right',
            color: 'rgba(0,0,0,0.45)'
          },
          barWidth: 20,
          itemStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
            // color: '#5B8FF9'
          },
          emphasis: {
            itemStyle: {
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          },
          data: xdata
        } ],
        dataZoom: [
          {
            type: 'slider',
            show: false,
            yAxisIndex: [0],
            left: '98%',
            handleSize: 20,
            // startValue: 0,
            // endValue: 6,
            // start: 0, // 数据窗口范围的起始百分比
            // end: 36
          },
          {
            type: 'inside',
            yAxisIndex: [0],
            start: 0,
            end: 36
          }
        ]
      }
      this.barChartContainer.setOption(option)
    },
    loadData () {

    }
  }
}
</script>

<style scoped>
.performenceList {
  overflow-y: auto;
}
.performenceList .el-row{
  margin-top: 10px;
}
.performenceList .table_title{
  font-weight: bold;
  font-size: large;
}
.performenceList .barChart{
  background-color: #f5f8fc;
}
/deep/.voteDetail .el-dialog .el-select .el-input {
  /*width: 50px;*/
}
/deep/.voteDetail .el-dialog__header{
  background: url("../../assets/topbox.png");
  background-size: 500px;
}
/deep/.voteDetail .el-dialog {
  width: 500px;
  /*height: 350px;*/
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.voteDetail .el-dialog__title {
  position: absolute;
  font-size: 14px;
  font-family: "微软雅黑";
  line-height: 0px;
  margin-top: -3px;
  margin-left: 1%;
  color: #FFFFFF;
}
/deep/.el-dialog__headerbtn .el-dialog__close {
  position: absolute;
  font-size: 14px;
  line-height: 0px;
  margin-top: -3px;
  margin-left: -10px;
  font-weight: bold;
  color: #FFFFFF;
}
.voteDetail .el-row{
  margin-bottom: 10px;
}
.pagination{
  margin-left: 100px;
}
</style>
