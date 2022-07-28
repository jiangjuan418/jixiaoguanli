<template>
<div class="vote">
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
    <el-col class="table_title" :span="12">
      <span>已投票详情</span>
    </el-col>
    <el-col class="table_title" :span="12">
      <span>未投票列表</span>
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="14">
      <el-row>
        <el-table :data="completedVote.slice((current-1)*size,current*size)" style="width: 100%" stripe highlight-current-row :header-cell-style="{
                'background-color': '#f0f8ff',
                'height': '35px',
                'padding':'0',
                'border': '1px solid #E2F0FAFF',
                'font-size':'0.9vw',
                'color':'#666666',
                'text-align':'center'
            }" :cell-style="{padding:'0px',height: '25px','text-align':'center'} ">
          <el-table-column prop="manager_id" label="经理id" v-if="false"></el-table-column>
          <el-table-column prop="user_id" label="评分人id" v-if="false"></el-table-column>
<!--          <el-table-column prop="realName" label="评分人"></el-table-column>-->
          <el-table-column prop="manager_name" label="经理"></el-table-column>
          <el-table-column label="评分项">
            <el-table-column prop="ability_1" label="工作能力"></el-table-column>
            <el-table-column prop="ability_2" label="态度"></el-table-column>
            <el-table-column prop="ability_3" label="领导力"></el-table-column>
            <el-table-column prop="grade" label="平均得分"></el-table-column>
          </el-table-column>
          <el-table-column prop="total_grade" label="综合得分" sortable></el-table-column>
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
    </el-col>
    <el-col :span="8" style="margin-left: 10px">
      <el-row>
        <el-table :data="incompleteVote.slice((current_1-1)*size_1,current_1*size_1)" style="width: 100%" stripe highlight-current-row :header-cell-style="{
                'background-color': '#f0f8ff',
                'height': '35px',
                'padding':'0',
                'border': '1px solid #E2F0FAFF',
                'font-size':'0.9vw',
                'color':'#666666',
                'text-align':'center'
            }" :cell-style="{padding:'0px',height: '25px','text-align':'center'} ">
          <el-table-column>
            <el-table-column prop="manager_id" label="经理id" v-if="false"></el-table-column>
<!--            <el-table-column prop="user_id" label="评分人id" v-if="false"></el-table-column>-->
<!--            <el-table-column prop="realName" label="评分人"></el-table-column>-->
            <el-table-column prop="dept_name" label="部门"></el-table-column>
            <el-table-column prop="manager_name" label="经理"></el-table-column>
            <el-table-column fixed="right" label="投票">
              <template slot-scope="scope">
                <span slot="reference" v-if="year < new Date().getFullYear()" style="color: red">投票时间已过</span>
                <span slot="reference" v-else-if="year > new Date().getFullYear()" style="color: red">未到投票时间</span>
                <span slot="reference" v-else-if="(year === new Date().getFullYear()) && (Number.parseInt(season) < Number.parseInt(currentSeason))" style="color: red">投票时间已过</span>
                <span slot="reference" v-else-if="(year === new Date().getFullYear()) && (Number.parseInt(season) > Number.parseInt(currentSeason))" style="color: red">未到投票时间</span>
                <span slot="reference"  v-else>
                  <i class="el-icon-edit-outline" @click="evaluate(scope.row)"></i>
                &nbsp;
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row :span='24'><div class="pagination">
        <el-pagination
          small
          @size-change="handleSizeChange_1"
          @current-change="handleCurrentChange_1"
          :current-page="current_1"
          layout="total, sizes, prev, pager, next"
          :total="total_1"
          :page-size="size_1"
          :page-count="5"
        >
        </el-pagination></div>
      </el-row>
      <el-row>
        <el-dialog class="addVote" title="投票" :visible.sync="dialogFormVisible" :append-to-body="true" :show-close="false">
<!--          <el-row>-->
<!--            <el-col :span="4">当前部门</el-col>-->
<!--            <el-col :span="20">-->
<!--              <el-input v-model="addVoteForm.deptName" disabled/>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row>
            <el-col :span="3">工作能力</el-col>
            <el-col :span="21">
              <el-radio-group v-model="addVoteForm.ability_1">
                <el-radio :label="1">1分</el-radio>
                <el-radio :label="2">2分</el-radio>
                <el-radio :label="3">3分</el-radio>
                <el-radio :label="4">4分</el-radio>
                <el-radio :label="5">5分</el-radio>
                <el-radio :label="6">6分</el-radio>
                <el-radio :label="7">7分</el-radio>
                <el-radio :label="8">8分</el-radio>
                <el-radio :label="9">9分</el-radio>
                <el-radio :label="10">10分</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">态度</el-col>
            <el-col :span="21">
              <el-radio-group v-model="addVoteForm.ability_2">
                <el-radio :label="1">1分</el-radio>
                <el-radio :label="2">2分</el-radio>
                <el-radio :label="3">3分</el-radio>
                <el-radio :label="4">4分</el-radio>
                <el-radio :label="5">5分</el-radio>
                <el-radio :label="6">6分</el-radio>
                <el-radio :label="7">7分</el-radio>
                <el-radio :label="8">8分</el-radio>
                <el-radio :label="9">9分</el-radio>
                <el-radio :label="10">10分</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3">领导力</el-col>
            <el-col :span="21">
              <el-radio-group v-model="addVoteForm.ability_3">
                <el-radio :label="1">1分</el-radio>
                <el-radio :label="2">2分</el-radio>
                <el-radio :label="3">3分</el-radio>
                <el-radio :label="4">4分</el-radio>
                <el-radio :label="5">5分</el-radio>
                <el-radio :label="6">6分</el-radio>
                <el-radio :label="7">7分</el-radio>
                <el-radio :label="8">8分</el-radio>
                <el-radio :label="9">9分</el-radio>
                <el-radio :label="10">10分</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <el-row>
            <el-col><el-button type="primary" style="width:100%;" size="small" @click="addVote()">投票</el-button></el-col>
          </el-row>
        </el-dialog>
      </el-row>
    </el-col>
  </el-row>
</div>
</template>

<script>
import qs from 'qs'
import {getNotVote, getVote, addVote} from '../../api/login/vote'
import {Message} from 'element-ui'
export default {
  name: 'vote',
  data () {
    return {
      userId: '', // 当前用户id
      valueArr: ['-01', '-02', '-03', '-04'],
      showSeason: '',
      selectedSeason: '',
      season: '',
      currentSeason: '',
      year: new Date().getFullYear(),
      current: 1,
      total: 0,
      size: 10,
      current_1: 1,
      total_1: 0,
      size_1: 10,
      completedVote: [],
      incompleteVote: [],
      dialogFormVisible: false,
      addVoteForm: {
        'userId': '',
        'managerId': '',
        'deptName': '',
        'ability_1': 10,
        'ability_2': 10,
        'ability_3': 10
      }
    }
  },
  mounted () {
    if (this.$store.state.Login.hasData) {
      // this.realName = this.$store.state.Login.realName
      this.userId = this.$store.state.Login.userId
    }
    this.getCurrentSeason() // 页面刷新获取当前季度
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
    },
    handleCurrentChange (val) {
      this.current = val
    },
    handleSizeChange_1 (val) {
      this.size = val
    },
    handleCurrentChange_1 (val) {
      this.current = val
    },
    getCurrentSeason () {
      let today = new Date() // 获取当前时间
      let year = today.getFullYear()
      let month = today.getMonth() + 1// getMonth返回0-11
      if (month >= 1 && month <= 3) {
        this.currentSeason = 1
        this.selectedSeason = `${year}年第1季度`
      } else if (month >= 4 && month <= 6) {
        this.currentSeason = 2
        this.selectedSeason = `${year}年第2季度`
      } else if (month >= 7 && month <= 9) {
        this.currentSeason = 3
        this.selectedSeason = `${year}年第3季度`
      } else {
        this.currentSeason = 4
        this.selectedSeason = `${year}年第4季度`
      }
      this.getVote()
      this.getNotVote()
    },
    prev () {
      this.year = this.year - 1
    },
    next () {
      this.year = this.year + 1
    },
    selectSeason (i) { // 季度选择
      this.season = i + 1
      this.showSeason = false
      this.selectedSeason = `${this.year}年第${this.season}季度`
      this.getVote()
      this.getNotVote()
    },
    evaluate (data) {
      this.dialogFormVisible = true
      this.addVoteForm.deptName = data.dept_name
      this.addVoteForm.userId = this.userId
      this.addVoteForm.managerId = data.manager_id
      // 打分
    },
    getVote () {
      let params = {
        'userId': this.userId,
        'date': (this.selectedSeason || ' ').slice(0, 4) + '-' + Number.parseInt((this.selectedSeason || ' ').slice(6, 7)) * 3 + '-' + '28'
      }
      getVote(qs.stringify(params)).then(res => {
        if (res.data.code === 200) {
          this.completedVote = res.data.data
          this.total = res.data.data.length
        }
      }).catch(function (error) { console.log('getVote error') })
    },
    getNotVote () {
      let params = {
        'userId': this.userId,
        'date': (this.selectedSeason || ' ').slice(0, 4) + '-' + Number.parseInt((this.selectedSeason || ' ').slice(6, 7)) * 3 + '-' + '28'
      }
      getNotVote(qs.stringify(params)).then(res => {
        if (res.data.code === 200) {
          this.incompleteVote = res.data.data
          this.total_1 = res.data.data.length
        }
      }).catch(function (error) { console.log('getVote error') })
    },
    addVote () {
      if (this.userId === this.addVoteForm.managerId) {
        Message.error('部门主管无法给自己投票')
      } else {
        let params = {
          'userId': this.userId,
          'managerId': this.addVoteForm.managerId,
          'ability_1': this.addVoteForm.ability_1,
          'ability_2': this.addVoteForm.ability_2,
          'ability_3': this.addVoteForm.ability_3
        }
        addVote(qs.stringify(params)).then(res => {
          if (res.data.code === 200) {
            Message.success('投票成功')
            this.dialogFormVisible = false
            this.getVote()
            this.getNotVote()
          } else {
            Message.error('投票失败')
          }
        }).catch(function (error) { console.log('getVote error') })
      }
    }
  }
}
</script>

<style scoped>
.vote .el-row{
  margin-top: 10px;
}
.vote .table_title{
  font-weight: bold;
  font-size: large;
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
.addManager .el-row{
  margin-bottom: 10px;
}
/deep/.addVote .el-dialog .el-select .el-input {
  /*width: 50px;*/
}
/deep/.addVote .el-dialog__header{
  background: url("../../assets/topbox.png");
  background-size: 500px;
}
/deep/.addVote .el-dialog {
  width: 500px;
  /*height: 350px;*/
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.addVote .el-dialog__title {
  position: absolute;
  font-size: 14px;
  font-family: "微软雅黑";
  line-height: 0px;
  margin-top: -3px;
  margin-left: 1%;
  color: #FFFFFF;
}
.addVote .el-row{
  margin-bottom: 20px;
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
</style>
