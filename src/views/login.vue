<template>
  <center>
    <el-form
      ref="AccountFrom"
      :model="account"
      :rules="rules"
      lable-position="center"
      class="demo-ruleForm login-container"
    >
      <h1 class="title">欢迎使用Vue管理系统</h1>
      <br>
      <br>
      <el-form-item prop="empName" inline-message="true">
        <el-input type="text" v-model="account.empName" auto-complete="off" placeholder="请输入账号"></el-input>
      </el-form-item>
      <br>
      <el-form-item prop="password" inline-message="true">
        <el-input
          type="password"
          v-model="account.password"
          auto-complete="off"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          plain
          @click.native.prevent="Login"
          :loading="logining"
          style="width: 100%"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </center>
</template>

<script>
import UserApi from '@/api/user'
export default {
  name: 'login',
  data () {
    return {
      logining: false,
      account: { empName: '', password: '' },
      rules: {
        empName: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },

  methods: {
    Login () {
      this.$refs.AccountFrom.validate(valid => {
        if (valid) {
          // 验证通过 可以提交
          this.logining = true
          // 将提交的数据进行封装
          var params = {
            name: this.account.empName,
            password: this.account.password
          }
          // 调用函数  传递参数 获取结果
          UserApi.login(params).then(data => {
            console.log(data)
            this.logining = false
            if (data.data.state === 1) {
              // 登录成功

              // 用vue路由跳转到后台主界面
              this.$message({
                message: '登录成功!',
                type: 'success'
              })
              sessionStorage.setItem('EMPNAME', data.data.name)
              // sessionStorage.setItem("EMPNAME", "test");
              this.$router.push({ path: '/' })
            } else {
              this.$message({
                message: data.data.message,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
body {
  background: rgb(77, 76, 76);
}

.demo-ruleForm {
  margin: 100px auto;
  height: 300px;
  width: 30%;
  padding: 50px;
  border-radius: 20px;
  background-color: rgb(243, 229, 201);
  el-button {
    width: 100%;
    font-size: 16px;
  }
}
</style>
