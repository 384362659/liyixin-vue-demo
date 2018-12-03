<template>
  <el-dialog
    :visible.sync="visible"
    title="修改用户"
    width="600px"
  >
    <div>
      <!--{{userForm}}-->
      <el-form label-width="100px" :model="userForm">
        <el-form-item label="姓名" :hidden="true" prop="id">
          <el-input v-model="userForm.id"></el-input>
        </el-form-item>
        <el-form-item label="原密码" prop="newPassword">
          <el-input type="password" v-model="userForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="newPassword">
          <el-input type="password" v-model="userForm.newPassword"></el-input>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="updateEmp()">修改</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UserApi from '@/api/user'

export default{
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    itemId: {
      type: Number,
      requried: true
    }
  },
  data () {
    return {
      userForm: {
        id: '',
        oldPassword: '',
        newPassword: ''
      },
      isShow: true
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$emit('update:visible', false)
        this.userForm = {
          id: '',
          oldPassword: '',
          newPassword: ''
        }
      }
    }
  },
  methods: {
    async updateEmp () {
      this.userForm.id = this.$parent.itemId
      let resp = await UserApi.updateEmp(this.userForm)
      let msg = resp
      this.visible = false
      if (msg.state !== 1) {
        this.$emit('fail')
        this.$message({
          message: msg.message,
          type: 'fail'
        })
      } else {
        this.isShow = false
        this.$emit('success')
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      }
    }
  }
}
</script>
