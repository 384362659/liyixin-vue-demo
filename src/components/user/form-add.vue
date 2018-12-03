<template>
  <el-dialog :visible.sync="visible" title="新增用户" width="600px">
    <div>
      <!--{{userForm}}-->
      <el-form label-width="100px" :model="userForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="部门号" prop="departmentCode">
          <el-input v-model="userForm.departmentCode"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import UserApi from "@/api/user";

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userForm: {
        name: "",
        departmentCode: "",
        password: ""
      }
    };
  },
  watch: {
    visible(val) {
      if (!val) {
        this.$emit("update:visible", false);
        this.userForm = {
          name: "",
          departmentCode: "",
          password: ""
        };
      }
    }
  },
  methods: {
    async save() {//保存人员信息
      this.visible = false;
      let resp = await UserApi.create(this.userForm);
      let msg = resp;
      if (msg.state === 0) {
        this.$emit("fail");
        this.$message({
          message: msg.message,
          type: "fail"
        });
      } else {
        this.$emit("success");
        this.$message({
          message: "添加成功",
          type: "success"
        });
      }
    }
  }
};
</script>
