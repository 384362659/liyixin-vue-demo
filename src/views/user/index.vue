<template>
  <div>
    <el-table border :data="tableData">
      <el-table-column prop="name" label="姓名" ></el-table-column>
      <el-table-column  label="性别" >
        <template slot-scope="scope">
          {{sexConvert(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄" ></el-table-column>

    </el-table>

  </div>
</template>

<script>
  import axios from 'axios'


  export default{
    data () {
      return {
        tableData:[],
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted(){
      this.loadData()
    },
    methods:{
      sexConvert(sex){
        return sex==='1' ? '男':'女'
      },
      async loadData(){
        let resp = await axios.get("/api/users?pageIndex=1&pageSize=10&userName")
        this.tableData=resp.data.list
      }
    }
  }

</script>
