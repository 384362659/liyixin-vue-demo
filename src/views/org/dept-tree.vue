<template>
  <div class="custom-tree-container">
    <el-button type="primary" size="size" @click="addNode" class="el-icon-plus">添加新部门</el-button>
    <div class="grid-content bg-purple">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-tree
              :props="ruleProp"
              @click="search(data)"
              :data="deptDatas"
              :expand-on-click-node="false"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span @click="search(data)">{{node.label}}</span>
                <span>
                  <el-button type="text" size="mini" @click="updateDept(data)">
                    <i class="el-icon-edit"></i>修改
                  </el-button>
                  <el-button type="text" size="mini" @click="deleteDept(data)">
                    <i class="el-icon-delete"></i>删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <UserIndex :deptno="checkDeptno"></UserIndex>
          </div>
        </el-col>
      </el-row>
    </div>
    <!--员工表的组件-->
    <!--操作弹框-->
    <el-dialog :title="treeTitle" :visible.sync="isShow">
      <div>
        <el-form ref="treeForm" label-width="100px" :model="treeForm" :rules="rules">
          <el-input v-model="treeForm.dname" type="hidden"></el-input>
          <el-form-item label="组织名" prop="dname">
            <el-input v-model="treeForm.dname"></el-input>
          </el-form-item>
          <el-form-item label="部门号" :hidden="!hasDept" prop="departmentCode">
            <el-input v-model="treeForm.departmentCode"></el-input>
          </el-form-item>
          <el-form-item label="ID" prop="id" :hidden="true">
            <el-input v-model="treeForm.departmentId"></el-input>
          </el-form-item>
          <el-form-item label="上级部门名称" :hidden="!hasDept" prop="updepartmentCode">
            <el-select
              :disabled="disabled"
              v-model="treeForm.updepartmentCode"
              clearable
              placeholder="请选择"
            >
              <el-option key="0" label="请选择" value="0"></el-option>
              <el-option v-for="(item,index) in leaderDept" :value="item.dname" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="saveDept">保存</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import OrgApi from '@/api/org'
import UserApi from '../../api/user/index.js'
import UserIndex from '@/components/org/emp-list'

export default {
  components: { UserIndex },
  // 展示数据
  data () {
    return {
      disabled: false,
      //	配置选项
      ruleProp: {
        // 指定节点标签为节点对象的某个属性值
        label: 'dname',
        id: 'departmentCode',
        // 指定子树为节点对象的某个属性值
        children: 'child',
        isLeaf: 'leaf'
      },
      deptDatas: [],
      treeDept: {
        departmentId: '',
        departmentCode: '',
        dname: '',
        updepartmentCode: ''
      },
      // 树形结构数据
      treeData: [],
      // 弹出框标题
      treeTitle: '',
      changeType: '',
      hasDept: true,
      visible: false,
      // 弹出框是否展示和关闭
      isShow: false,
      // 用来存放deptno
      checkDeptno: null,
      // 弹出框数据
      treeForm: {
        departmentId: '',
        departmentCode: '',
        dname: '',
        updepartmentCode: ''
      },
      leaderDept: [],
      /* 提示 */
      rules: {
        deptName: {
          required: true,
          message: '请输入新的部门名称'
        },
        deptno: {
          required: true,
          message: '请输入部门号'
        }
      }
    }
  },
  async mounted () {
    this.totalDepts()
  },
  methods: {
    // 查询
    async search (data) { // 显示部门人员
      this.checkDeptno = data.dname
    },
    // load departments
    async totalDepts () { // 获取所有数据
      let resp = await OrgApi.searchDepts()
      let container = []
      this.leaderDept = []
      resp.data.map((val, index) => {
        if (val.updepartmentCode === 0) {
          container.push(val)
        }
      })
      container.map(val => this.leaderDept.push(val))
      for (let i = 0; i < container.length; i++) {
        let childer = await OrgApi.searchChildDepts(
          container[i].departmentCode
        )
        container[i].child = childer.data
        if (childer.data.length === 0 || !childer.data) {
          // 这里遍历部门人员
          // let staff = await OrgApi.searchStaffs(container[i].dname);
          // container[i].child = staff.data;
        } else {
          for (let j = 0; j < container[i].child.length; j++) {
            let staff = await OrgApi.searchStaffs(container[i].child[j].dname)
            container[i].child[j].child = staff.data
            container[i].child[j].child.map(val => (val.dname = val.name))
          }
        }
      }
      this.deptDatas = container// 数据加载完毕
    },
    addNode () { // 添加新部门
      this.treeForm = {
        departmentCode: null,
        dname: null,
        updepartmentCode: null,
        departmentId: null
      }
      this.isShow = true
      this.treeTitle = '添加新的部门'
      this.disabled = false
    },
    updateDept (data) { // 修改部门名称
      this.isShow = true
      this.hasDept = false
      this.treeTitle = '修改部门信息'
      this.treeForm = {
        dname: data.dname,
        departmentCode: data.departmentCode
      }
      this.disabled = true
    },
    saveDept (id) {
      this.$refs['treeForm'].validate(async valid => {
        if (valid) {
          let record = []
          this.deptDatas.map(val => {
            if (val.dname === this.treeForm.updepartmentCode) {
              this.treeForm.updepartmentCode = val.departmentCode// 将部门code添加进去treeFform
            }
          })

          if (
            this.treeForm.updepartmentCode == null ||
            this.treeForm.updepartmentCode === ''
          ) {
            record = await OrgApi.modify(this.treeForm)
          } else {
            record = await OrgApi.create(this.treeForm)
          }
          this.totalDepts()

          if (record.data.state === 1) {
            this.isShow = false
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.isShow = false
            this.$message({
              message: record.data.message,
              type: 'fail'
            })
          }
        }
      })
    },
    deleteDept (data) {
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let resp = await OrgApi.remove(data.departmentCode)
          let msg = resp
          this.totalDepts()
          if (msg.state === 1) {
            this.isShow = false
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.isShow = false
            this.$message({
              message: msg.message,
              type: 'fail'
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    close () {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.style1 {
  margin-bottom: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: white;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
