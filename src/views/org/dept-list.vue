<template>
  <div>
    <div>
      <div class="searchBox">
        <el-input @keyup.enter.native="loadData" placeholder="请输入您要查询的部门名称关键字" v-model="keywords">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button type="primary" round @click="loadData()">查询</el-button>
      </div>
      <el-table border :data="currentData">
        <el-table-column class="column" label="部门号" prop="departmentCode"></el-table-column>
        <el-table-column class="column" label="部门名称" prop="dname"></el-table-column>
        <el-table-column class="column" label="部门地址" prop="updepartmentCode"></el-table-column>
        <el-table-column class="column" label="上级部门" prop="departmentId"></el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next"
        :total="totalPages"
        :page-size="10"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="paging"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import OrgApi from '@/api/org'
export default {
  data () {
    return {
      deptData: [], // 总数据
      currentData: [], // 当前页数据
      keywords: null, // 关键字
      totalPages: 1, // 总页数
      currentPage: 1, // 现在页数
      pageSize: 8 // 每页最大数据
    }
  },
  methods: {
    async loadData () {
      // 加载数据
      let resp = await OrgApi.searchDepts(this.keywords)
      this.deptData = resp.data
      this.totalPages = this.deptData.length
      this.handleCurrentChange(this.currentPage)
    },
    handleCurrentChange (val) {
      // 监测页数变化
      this.currentData = this.deptData.slice(
        (val - 1) * this.pageSize,
        val * this.pageSize
      )
    },
    handleSizeChange (data) {
      // 监测所有数据变化
    }
  },
  async mounted () {
    // 模板编译完成
    this.loadData()
  }
}
</script>
