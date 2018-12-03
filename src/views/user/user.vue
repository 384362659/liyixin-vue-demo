<template>
  <div class="showview">
    <div class="searchBox">
      <el-input @keyup.enter.native="searchPerson" placeholder="请输入您要查询的人员姓名" v-model="personName">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-button type="primary" round @click="searchPerson()">查询</el-button>
    </div>
    <div style="text-align: right;margin-bottom: 10px;">
      <el-button type="primary" @click="openDialog">添加员工</el-button>
    </div>
    <span>
      <el-table border :data="currentData">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <!--<el-table-column label="工作" prop="dname"></el-table-column>-->
        <el-table-column label="部门号" prop="departmentCode"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-delete" @click="remove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="openDialog2(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
    <el-pagination
      layout="prev, pager, next"
      :total="totalPages"
      :page-size="10"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      class="paging"
    ></el-pagination>
    <UserFormAdd :visible.sync="visible" @success="loadData"></UserFormAdd>
    <UserFormModify :visible.sync="visible_modify" @success="loadData" v-bind:itemid="itemId"></UserFormModify>
  </div>
</template>

<script>
import UserFormAdd from '../../components/user/form-add.vue'
import UserFormModify from '../../components/user/form-modify.vue'

import UserApi from '../../api/user/index.js'

export default {
  components: { UserFormAdd, UserFormModify },
  props: {
    deptno: {
      Type: String
    }
  },
  data () {
    return {
      itemId: 0,
      visible: false,
      visible_modify: false,
      tableData: [
        {
          empName: '开发部',
          job: '开发',
          empno: '18'
        }
      ],
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
      },
      currentData: [], // 当前页数据
      totalPages: 1, // 总页数
      currentPage: 1, // 现在页数
      pageSize: 8, // 每页最大数据
      personName: ''
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    async loadData (keywords) {
      let resp = await UserApi.searchPerson(keywords)
      this.tableData = resp.data
      this.totalPages = this.tableData.length
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      this.currentData = this.tableData.slice(// slice截取数据
        (val - 1) * this.pageSize,
        val * this.pageSize
      )
    },
    handleSizeChange (data) {},
    pageChange (page) {
      this.query.pageIndex = page
      this.loadData()
    },
    remove (pCode) {
      this.$confirm('此操作将永久删除该人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let resp = await UserApi.remove(pCode)
          let msg = resp
          this.loadData()
          console.log(msg)
          if (msg.state === 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: msg.message,
              type: 'fail'
            })
          }
        })
        .catch(err => console.log)
    },
    openDialog () { // 打开添加员工框
      this.visible = true
    },
    openDialog2 (id) { // 修改密码
      this.itemId = id
      this.visible_modify = true
    },
    async searchPerson () {
      this.loadData(this.personName)// 搜索
    }
  }
}
</script>
