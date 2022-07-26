<template>
  <div class="managerList">
    <el-row>
      <el-col class="table_title">
        <span>部门经理列表</span>
        <i class="el-icon-circle-plus-outline" @click="addManager"></i>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="managerData" style="width: 100%" stripe highlight-current-row :header-cell-style="{
                'background-color': '#f0f8ff',
                'height': '35px',
                'padding':'0',
                'border': 'none',
                'font-size':'0.9vw',
                'color':'#666666',
                'text-align':'center'
            }" :cell-style="{padding:'0px',height: '25px','text-align':'center'} ">
        <el-table-column prop="manager_id" label="编号" width="100"></el-table-column>
        <el-table-column prop="manager_name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="dept_name" label="主管部门" width="120"></el-table-column>
        <el-table-column prop="dept_id" label="主管部门id" width="0" v-if="false"></el-table-column>
        <el-table-column prop="manager_sex" label="性别" width="180">
          <template slot-scope="scope">
            {{ scope.row.manager_sex || '未填' }}
          </template>
        </el-table-column>
        <el-table-column prop="manager_age" label="年龄" width="180">
          <template slot-scope="scope">
            {{ scope.row.manager_age || '未填' }}
          </template>
        </el-table-column>
        <el-table-column prop="manager_email" label="邮箱" width="180">
          <template slot-scope="scope">
            {{ scope.row.manager_email || '未填' }}
          </template>
        </el-table-column>
        <el-table-column prop="manager_number" label="联系电话" width="180">
          <template slot-scope="scope">
            {{ scope.row.manager_number || '未填' }}
          </template>
        </el-table-column>
        <el-table-column prop="manager_address" label="住址" width="300">
          <template slot-scope="scope">
            {{ scope.row.manager_address || '未填' }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <i class="el-icon-delete" @click="delManager(scope.row.manager_id, scope.row.dept_id)"></i>
            &nbsp;
            <i class="el-icon-edit" @click="editManager(scope.row)"></i>
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
        layout="total, sizes, prev, pager, next"
        :total="total"
        :page-size="size"
        :page-count="5"
      >
      </el-pagination></div>
    </el-row>
    <el-dialog class="addManager" title="新增经理" :visible.sync="dialogFormVisible" :append-to-body="true" :show-close="false">
      <el-row>
        <el-col :span="8">未任命经理的部门</el-col>
        <el-col :span="16">
          <el-select v-model="addManagerForm.deptName" placeholder="请选择部门(非空)" size="medium" clearable @change="getDeptId">
            <el-option
              v-for="item in deptOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">该部门的员工</el-col>
        <el-col :span="16">
          <el-select v-model="addManagerForm.deptLeader" placeholder="请选择经理(非空)" size="medium" clearable @change="getManagerId">
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
        <el-col><el-button type="primary" style="width:100%;" size="small" @click="add()">添加</el-button></el-col>
      </el-row>
    </el-dialog>
    <el-dialog class="editManager" title="更换经理" :visible.sync="dialogFormVisible1" :append-to-body="true" :show-close="false">
      <el-row>
        <el-col :span="8">当前部门</el-col>
        <el-col :span="12">
          <el-input v-model="editManagerForm.currentDept" disabled/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">该部门当前经理</el-col>
        <el-col :span="12">
          <el-input v-model="editManagerForm.currentManage" disabled/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">更换经理</el-col>
        <el-col :span="16">
          <el-select v-model="editManagerForm.managerName" placeholder="请选择经理" size="medium" clearable @change="getSelectedManagerId">
            <el-option
              v-for="item in allDeptUsers"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col><el-button type="primary" style="width:100%;" size="small" @click="edit()">修改</el-button></el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {getManagerList, delManager, getDepts, getUsersOfTheDept, getAllDepts, editManager, addManager} from '../../api/login/manager'
import qs from 'qs'
import {Message} from 'element-ui'
export default {
  name: 'managerList',
  data () {
    return {
      managerData: [],
      current: 0,
      total: 0,
      size: 10,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      selectedDeptId: '',
      deptOptions: [],
      leaderOptions: [],
      allDeptUsers: [],
      addManagerForm: {
        deptName: '',
        deptId: '',
        deptLeader: '',
        managerId: ''
      },
      editManagerForm: {
        currentDept: '',
        currentManage: '',
        managerName: '',
        currentManageId: '',
        selectedManagerId: ''
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
      getManagerList().then(res => {
        if (res.data.code === 200) {
          this.managerData = res.data.data
          this.total = res.data.data.length
        }
      }).catch(function (error) { console.log('getManagerList error') })
      getDepts().then(res => {
        this.deptOptions = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.deptOptions.push({value: res.data.data[i].dept_id, label: res.data.data[i].dept_name})
          }
        }
      }).catch(function (error) { console.log('getDepts error') })
      getAllDepts().then(res => {
        this.allDeptOptions = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.allDeptOptions.push({value: res.data.data[i].dept_id, label: res.data.data[i].dept_name})
          }
        }
      }).catch(function (error) { console.log('getDepts error') })
    },
    addManager () {
      this.dialogFormVisible = true
    },
    add () {
      if (this.addManagerForm.deptId === '' || this.addManagerForm.managerId === '') {
        Message.error('请选择部门和经理')
      } else {
        let params = {
          'dept_id': this.addManagerForm.deptId,
          'manager_id': this.addManagerForm.managerId
        }
        addManager(qs.stringify(params)).then(res => {
          if (res.data.code === 200) {
            alert(res.data.message)
            this.dialogFormVisible = false
            this.loadData()
          } else {
            alert(res.data.message)
            this.dialogFormVisible = false
          }
        }).catch(function (error) { console.log('addManager error') })
      }
    },
    delManager (managerId, deptId) {
      this.$confirm('确定卸任该经理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          'dept_id': deptId,
          'manager_id': managerId
        }
        delManager(qs.stringify(params)).then(res => {
          if (res.data.code === 200) {
            this.loadData()
            alert(res.data.message)
          } else {
            alert(res.data.message)
          }
        }).catch(function (error) { console.log('delDept error') })
      })
    },
    getDeptId (data) {
      this.addManagerForm.deptId = data
      let params = {
        'deptId': this.addManagerForm.deptId
      }
      getUsersOfTheDept(qs.stringify(params)).then(res => {
        this.leaderOptions = []
        this.editManagerForm.managerName = ''
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.leaderOptions.push({value: res.data.data[i].id, label: res.data.data[i].realName})
          }
        }
      }).catch(function (erro) { console.log('getUsersOfTheDept error') })
    },
    getManagerId (data) {
      this.addManagerForm.managerId = data
    },
    editManager (data) {
      this.dialogFormVisible1 = true
      this.editManagerForm.currentManage = data.manager_name
      this.editManagerForm.currentDept = data.dept_name
      this.editManagerForm.currentDeptId = data.dept_id
      this.editManagerForm.currentManageId = data.manager_id
      let params = {
        'deptId': this.editManagerForm.currentDeptId
      }
      getUsersOfTheDept(qs.stringify(params)).then(res => {
        this.allDeptUsers = []
        if (res.data.code === 200) {
          for (let i = 0; i < res.data.data.length; i++) {
            this.allDeptUsers.push({value: res.data.data[i].id, label: res.data.data[i].realName})
          }
        }
      }).catch(function (erro) { console.log('getUsersOfTheDept error') })
    },
    getSelectedManagerId (data) {
      this.editManagerForm.selectedManagerId = data
    },
    edit () {
      let params = {
        'dept_id': this.editManagerForm.currentDeptId,
        'manager_id': this.editManagerForm.currentManageId,
        'selected_manager_id': this.editManagerForm.selectedManagerId
      }
      editManager(qs.stringify(params)).then(res => {
        if (res.data.code === 200) {
          alert(res.data.message)
          this.loadData()
        } else {
          alert(res.data.message)
        }
        this.dialogFormVisible1 = false
      }).catch(function (error) { console.log('editManager error') })
    }
  }
}
</script>

<style scoped>
.managerList{

}
.managerList .el-row{
  margin-top: 10px;
}
.managerList .table_title{
  font-weight: bold;
  font-size: large;
}
/deep/.addManager .el-dialog .el-select .el-input {
  /*width: 50px;*/
}
/deep/.addManager .el-dialog__header{
  background: url("../../assets/topbox.png");
  background-size: 480px;
}
/deep/.addManager .el-dialog {
  width: 480px;
  /*height: 350px;*/
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.addManager .el-dialog__title {
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
.addManager .el-row{
  margin-bottom: 10px;
}
/deep/.editManager .el-dialog .el-select .el-input {
  /*width: 50px;*/
}
/deep/.editManager .el-dialog__header{
  background: url("../../assets/topbox.png");
  background-size: 480px;
}
/deep/.editManager .el-dialog {
  width: 480px;
  /*height: 350px;*/
  font-size: 14px;
  font-family: "微软雅黑";
}
/deep/.editManager .el-dialog__title {
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
.editManager .el-row{
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
