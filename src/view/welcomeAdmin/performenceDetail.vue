<template>
<div class="performenceDetail">
  <el-row>
    <el-col :span="3">
      <el-select v-model="deptId" placeholder="请选择部门" size="medium" clearable >
        <el-option
          v-for="item in deptOption"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="3">
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
      style="width:322px;padding: 0 3px 20px;margin-top:10px;margin-left:140px;position:fixed;z-index:9999;background-color: white !important;"
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
<!--  <el-row>-->
<!--    <el-col class="table_title">-->
<!--      <span>绩效详情</span>-->
<!--    </el-col>-->
<!--  </el-row>-->
  <el-row>
    <el-table
      empty-text="该季度该部门没有绩效信息"
      :data="performenceDetailData"
      style="width: 100%"
      :default-sort = "{prop: 'date', order: 'descending'}"
      stripe highlight-current-row :header-cell-style="{
                'background-color': '#f0f8ff',
                'height': '35px',
                'padding':'0',
                'border': '1px solid #E2F0FAFF',
                'font-size':'0.9vw',
                'color':'#666666',
                'text-align':'center'
            }" :cell-style="{padding:'0px',height: '25px','text-align':'center'} "
    >
      <el-table-column prop="dept_id" label="部门编号" v-if="false"></el-table-column>
      <el-table-column prop="realName" label="评分人" width="180"></el-table-column>
      <el-table-column label="评分项">
        <el-table-column prop="ability_1" label="工作能力" sortable></el-table-column>
        <el-table-column prop="ability_2" label="态度" sortable></el-table-column>
        <el-table-column prop="ability_3" label="领导力" sortable></el-table-column>
        <el-table-column prop="grade" label="平均得分"></el-table-column>
      </el-table-column>
<!--      <el-table-column prop="grade" label="总得分"></el-table-column>-->
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
</div>
</template>

<script>
import {getDeptList} from '../../api/login/dept'
import {getPerformenceList, getVoteDetail} from '../../api/login/performence'
import qs from 'qs'
import {Message} from 'element-ui'
export default {
  name: 'performenceDetail',
  data () {
    return {
      valueArr: ['-01', '-02', '-03', '-04'], // 接口接受的格式（一个季度传一个整体时间）
      // valueArr: ['01-02-03', '04-05-06', '07-08-09', '10-11-12'],//接口接受的格式（一个季度传一个每个的时间，一个季度三个月）
      showSeason: '',
      selectedSeason: '',
      season: '',
      year: new Date().getFullYear(),
      performenceDetailData: [],
      deptOption: [],
      deptId: '',
      current: 1,
      total: 0,
      size: 10
    }
  },
  mounted () {
    this.loadDeptList()
    this.getCurrentSeason()
  },
  watch: {
    deptId: { // 监听deptId,deptId值改变，则展示的部门详情随之改变
      handler (newValue, oldValue) {
        this.loadData()
      }
    },
    selectedSeason: {
      handler (newValue, oldValue) {
        this.loadData()
      }
    }
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
    },
    prev () {
      this.year = this.year - 1
    },
    next () {
      this.year = this.year + 1
    },
    selectSeason (i) {
      this.season = i + 1
      this.showSeason = false
      this.selectedSeason = `${this.year}年第${this.season}季度`
    },
    loadDeptList () {
      getDeptList().then(res => {
        this.deptOption = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.deptOption.push({value: res.data.data[i].dept_id, label: res.data.data[i].dept_name})
          }
        }
        this.deptId = this.deptOption[0].value
      }).catch(function (error) { console.log('getDeptList error') })
    },
    loadData () {
      if (this.dept_id === '' || this.selectedSeason === '') {
        Message.error('请要查看的选择部门和季度！')
      } else {
        let param = {
          'dept_id': this.deptId,
          'data': (this.selectedSeason || ' ').slice(0, 4) + '-' + Number.parseInt((this.selectedSeason || ' ').slice(6, 7)) * 3 + '-' + '28'
        }
        getVoteDetail(qs.stringify(param)).then(res => {
          if (res.data.code === 200) {
            this.performenceDetailData = res.data.data
            this.total = res.data.data.length
          }
        }).catch(function (error) { console.log('getVoteDetail error') })
      }
    }
  }
}
</script>

<style scoped>
.performenceDetail .el-row{
  margin-top: 10px;
}
.performenceDetail .table_title{
  font-weight: bold;
  font-size: large;
}
/deep/.pagination .el-pagination--small .btn-prev{
  width: 25px;
  border: 1px solid #dde4eb;
}
/deep/ .pagination .el-pagination--small .btn-next{
  width: 25px;
  padding-left: 6px;
  border: 1px solid #dde4eb;
}
/deep/ .pagination .el-pagination--small ul{
  width: 180px;
}
/deep/ .pagination .el-pagination--small ul li{
  width: 25px;
  margin-right: 5px;
  border-radius: 3px;
  border: 1px solid #dde4eb;
}
/deep/ .pagination .el-pagination--small ul li.active{
  border: 1px solid #0f7dd8;
}
</style>
