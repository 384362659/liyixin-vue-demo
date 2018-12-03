<template>
  <div class="showview">
    <span>
      <el-table border :data="tableData">
      <el-table-column label="姓名" prop="name"></el-table-column>
      <!--<el-table-column label="工作" prop="id" :hidden="true"></el-table-column>-->
      <el-table-column label="部门号" prop="departmentCode"></el-table-column>
      </el-table>
      </span>
  </div>
</template>

<script>
import UserApi from '../../api/user/index.js'
export default {
  props: {
    deptno: {
      Type: String
    }
  },
  watch: {
    deptno (val) {
      if (val) {
        this.loadData(this.deptno)
      }
    }
  },
  data () {
    return {
      itemId: 0,
      visible: false,
      visible_modify: false,
      tableData: [],
      total: 0,
      query: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
      }
    }
  },
  methods: {
    async loadData (deptno) {
      let resp = await UserApi.searchStaffs(deptno)
      this.tableData = resp.data
    }
  }
}
</script>
