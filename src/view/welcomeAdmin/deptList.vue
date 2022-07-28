<template>
<div class="deptList">
  <el-row>
    <el-col class="table_title">
      <span>部门信息列表</span>
      <i class="el-icon-circle-plus-outline" @click="addDept"></i>
    </el-col>
  </el-row>
  <el-row>
    <el-table :data="deptData.slice((current-1)*size,current*size)" style="width: 100%" stripe highlight-current-row :header-cell-style="{
                'background-color': '#f0f8ff',
                'height': '35px',
                'padding':'0',
                'border': 'none',
                'font-size':'0.9vw',
                'color':'#666666',
                'text-align':'center'
            }" :cell-style="{padding:'0px',height: '25px','text-align':'center'} ">
      <el-table-column prop="dept_id" label="部门编号" width="100"></el-table-column>
      <el-table-column prop="dept_name" label="部门名称" width="120"></el-table-column>
      <el-table-column prop="dept_leader" label="部门主管" width="120">
        <template slot-scope="scope">
          {{ scope.row.dept_leader || '未任命' }}
        </template>
      </el-table-column>
      <el-table-column prop="dept_leader_id" label="部门主管id" width="0%" v-if="false"></el-table-column>
      <el-table-column prop="dept_phone" label="联系方式" width="180">
        <template slot-scope="scope">
          {{ scope.row.dept_phone || '暂无' }}
        </template>
      </el-table-column>
      <el-table-column prop="dept_email" label="邮箱" width="180">
        <template slot-scope="scope">
          {{ scope.row.dept_email || '暂无' }}
        </template>
      </el-table-column>
      <el-table-column prop="creation_time" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="address" label="地址" width="180">
        <template slot-scope="scope">
          {{ scope.row.address || '暂无' }}
        </template>
      </el-table-column>
      <el-table-column prop="describe" label="描述" width="300">
        <template slot-scope="scope">
          {{ scope.row.describe || '暂无' }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <i class="el-icon-delete" @click="delDept(scope.row.dept_id,scope.row.dept_leader_id)"></i>
          &nbsp;
          <i class="el-icon-edit" @click="editDept(scope.row)"></i>
<!--          <el-button type="text" size="mini" @click="delDept(scope.row.dept_id)">删除</el-button>-->
<!--          <el-button type="text" size="mini" @click="editDept(scope.row.dept_id)">修改</el-button>-->
<!--          <el-button type="text" size="mini" @click="saveDept(scope.row.dept_id)">保存</el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </el-row>
  <el-row :span='24'><div class="pagination">
    <el-pagination
      small
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="current"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="size"
      :page-count="5"
    >
    </el-pagination></div>
  </el-row>
  <el-dialog class="addDept" title="添加部门" :visible.sync="dialogFormVisible" :append-to-body="true" :show-close="false">
    <el-row>
      <el-col :span="4">部门名称(必填)</el-col>
      <el-col :span="8">
        <el-input v-model="addDeptForm.deptName" placeholder="部门名称" name="deptName"/>
      </el-col>
      <el-col :span="4">部门主管</el-col>
      <el-col :span="8">
<!--        <el-input v-model="addDeptForm.deptLeader" placeholder="部门主管名字" name="deptLeader"/>-->
        <el-select v-model="addDeptForm.deptLeader" placeholder="请选择部门主管" size="medium" clearable>
          <el-option
            v-for="item in leaderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">联系方式</el-col>
      <el-col :span="8">
        <el-input v-model="addDeptForm.deptPhone" placeholder="部门联系方式" name="deptPhone"/>
      </el-col>
      <el-col :span="4">邮箱</el-col>
      <el-col :span="8">
        <el-input v-model="addDeptForm.deptEmail" placeholder="部门邮箱" name="deptEmail"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">地址</el-col>
      <el-col :span="20">
        <el-input v-model="addDeptForm.deptAddress" placeholder="部门地址" name="deptPhone"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">简介</el-col>
      <el-col :span="20">
        <el-input type="textarea" :rows="2" v-model="addDeptForm.deptDescribe" placeholder="部门简介" name="deptDescribe"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col><el-button type="primary" style="width:100%;" size="small" @click="add">添加</el-button></el-col>
    </el-row>
  </el-dialog>
  <el-dialog class="editDept" title="修改部门信息" :visible.sync="dialogFormVisible1" :append-to-body="true" :show-close="false">
    <el-row>
      <el-col :span="4">部门名称</el-col>
      <el-col :span="8">
        <el-input v-model="editDeptForm.deptName" placeholder="部门名称" name="deptName"/>
      </el-col>
      <el-col :span="4">部门主管</el-col>
      <el-col :span="8">
<!--        <el-input v-model="editDeptForm.deptLeader" placeholder="部门主管名字" name="deptLeader"/>-->
        <el-select v-model="editDeptForm.deptLeader" placeholder="请选择部门主管" size="medium" clearable @change="getManagerId">
          <el-option
            v-for="item in usersInTheSameDept"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="0">
        <el-input v-model="editDeptForm.deptId" placeholder="部门编号" name="deptId"/>
      </el-col>
      <el-col :span="4">联系方式</el-col>
      <el-col :span="8">
        <el-input v-model="editDeptForm.deptPhone" placeholder="部门联系方式" name="deptPhone"/>
      </el-col>
      <el-col :span="4">邮箱</el-col>
      <el-col :span="8">
        <el-input v-model="editDeptForm.deptEmail" placeholder="部门邮箱" name="deptEmail"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">地址</el-col>
      <el-col :span="20">
        <el-input v-model="editDeptForm.deptAddress" placeholder="部门地址" name="deptPhone"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">简介</el-col>
      <el-col :span="20">
        <el-input type="textarea" :rows="2" v-model="editDeptForm.deptDescribe" placeholder="部门简介" name="deptDescribe"/>
      </el-col>
    </el-row>
    <el-row>
      <el-col><el-button type="primary" style="width:100%;" size="small" @click="edit()">修改</el-button></el-col>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
import {getDeptList, delDept, getManagers, addDept, getUsersOfTheSameDept, editDept} from '../../api/login/dept'
import qs from 'qs'
import {Message} from 'element-ui'
export default {
  name: 'deptList',
  data () {
    return {
      add_dept_name: '',
      // selectedDept: '',
      deptData: [],
      current: 1,
      total: 0,
      size: 10,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      leaderOptions: [],
      usersInTheSameDept: [],
      addDeptForm: {
        deptName: '',
        deptLeader: '',
        deptPhone: '',
        deptEmail: '',
        deptAddress: '',
        deptDescribe: '',
        creationTime: ''
      },
      editDeptForm: {
        deptId: '',
        deptName: '',
        deptLeader: '',
        deptPhone: '',
        deptEmail: '',
        deptAddress: '',
        deptDescribe: '',
        creationTime: '',
        managerId: ''
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    handleSizeChange (val) {
      this.size = val
    },
    handleCurrentChange (val) {
      this.current = val
    },
    loadData () {
      getDeptList().then(res => {
        if (res.data.code === 200) {
          this.deptData = res.data.data
          this.total = res.data.data.length
        }
      }).catch(function (error) { console.log('getDeptList error') })
      getManagers().then(res => {
        this.leaderOptions = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.leaderOptions.push({value: res.data.data[i].id, label: res.data.data[i].realName})
          }
        }
      }).catch(function (error) { console.log('getManagers error') })
    },
    delDept (deptId, deptLeaderId) {
      this.$confirm('确定删除该部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          'dept_id': deptId,
          'dept_leader_id': deptLeaderId
        }
        delDept(qs.stringify(params)).then(res => {
          if (res.data.code === 200) {
            this.loadData()
            alert(res.data.message)
          } else {
            alert(res.data.message)
          }
        }).catch(function (error) { console.log('delDept error') })
      })
    },
    editDept (rowData) {
      this.dialogFormVisible1 = true
      this.editDeptForm.deptId = rowData.dept_id
      this.editDeptForm.deptName = rowData.dept_name
      this.editDeptForm.deptLeader = rowData.dept_leader_id
      this.managerId = this.editDeptForm.deptLeader
      this.editDeptForm.deptPhone = rowData.dept_phone
      this.editDeptForm.deptEmail = rowData.dept_email
      this.editDeptForm.deptAddress = rowData.address
      this.editDeptForm.deptDescribe = rowData.describe
      this.getUsersOfTheSameDept(this.editDeptForm.deptId)
    },
    getUsersOfTheSameDept (deptId) {
      let params = {
        'deptId': deptId
      }
      getUsersOfTheSameDept(qs.stringify(params)).then(res => {
        this.usersInTheSameDept = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.usersInTheSameDept.push({value: res.data.data[i].id, label: res.data.data[i].realName})
          }
        }
      }).catch(function (erro) { console.log('getUsersOfTheSameDept error') })
    },
    addDept () {
      this.dialogFormVisible = true
      this.addDeptForm.deptLeader = ''
    },
    add () {
      if (this.addDeptForm.deptName === '') {
        Message.error('请输入部门名称')
      } else {
        let params = {
          'deptName': this.addDeptForm.deptName,
          'deptLeader': this.addDeptForm.deptLeader,
          'deptPhone': this.addDeptForm.deptPhone,
          'deptEmail': this.addDeptForm.deptEmail,
          'deptAddress': this.addDeptForm.deptAddress,
          'deptDescribe': this.addDeptForm.deptDescribe
        }
        addDept(qs.stringify(params)).then(res => {
          if (res.data.code === 200) {
            alert(res.data.message)
            this.dialogFormVisible = false
            this.loadData()
          } else {
            alert(res.data.message)
            this.dialogFormVisible = false
          }
        }).catch(function (error) { console.log('addDept error') })
      }
    },
    edit () {
      if (this.editDeptForm.deptName === '') {
        Message.error('请输入部门名称')
      } else {
        this.$confirm('若更改了部门经理，则原部门经理的绩效信息会从数据库删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = {
            'deptId': this.editDeptForm.deptId,
            'deptName': this.editDeptForm.deptName,
            // 'deptLeader': this.managerId,
            'deptLeader': this.editDeptForm.deptLeader,
            'deptPhone': this.editDeptForm.deptPhone,
            'deptEmail': this.editDeptForm.deptEmail,
            'deptAddress': this.editDeptForm.deptAddress,
            'deptDescribe': this.editDeptForm.deptDescribe
          }
          editDept(qs.stringify(params)).then(res => {
            if (res.data.code === 200) {
              alert(res.data.message)
              this.loadData()
            } else {
              alert(res.data.message)
            }
            this.dialogFormVisible1 = false
          }).catch(function (error) { console.log('addDept error') })
        })
      }
    },
    getManagerId (data) {
      this.managerId = data
    }
  }
}
</script>

<style scoped>
.deptList{

}
.deptList .el-row{
  margin-top: 10px;
}
.deptList .table_title{
  font-weight: bold;
  font-size: large;
}
/deep/.addDept .el-dialog .el-select .el-input {
  /*width: 50px;*/
}
/deep/.addDept .el-dialog__header{
  background: url("../../assets/topbox.png");
  background-size: 480px;
}
/deep/.addDept .el-dialog {
  width: 480px;
  height: 350px;
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.addDept .el-dialog__title {
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
.addDept .el-row{
  margin-bottom: 10px;
}
/deep/.editDept .el-dialog .el-select .el-input {
  /*width: 50px;*/
}
/deep/.editDept .el-dialog__header{
  background: url("../../assets/topbox.png");
  background-size: 480px;
}
/deep/.editDept .el-dialog {
  width: 480px;
  height: 350px;
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.editDept .el-dialog__title {
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
.editDept .el-row{
  margin-bottom: 10px;
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
