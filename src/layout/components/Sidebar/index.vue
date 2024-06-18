<template>
  <div>
    <div class="flex">
      <div class="logo"><img :src="logo" /></div>
      <div class="dot"></div>
      <div class="system-name">医疗信息集成平台</div>
      <el-menu
        :default-active="activeMenu"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="horizontal"
      >
        <sidebar-item
          v-for="route in permission_routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
        <!-- <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" /> -->
      </el-menu>
    </div>

    <div class="right-menu">
      <div class="runTime">
        <!-- <div class="img"></div>
        <p>系统运行时间</p>
        <p>
          <span>{{ runTime }}</span>
        </p>
        <p>天安全运行</p> -->
      </div>
      
      <img v-show="testFlag == '1'" :src="test" width="60" height="60" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          {{ this.$store.state.user.name }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="changepwd">
            <span>修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :show-close="false"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="ruleForm.oldPass"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";
// import logo from "@/assets/logo.png";
import logo from "@/assets/w8ts.png";
// import logo from "@/assets/nanchong.png";
// import logo from "@/assets/jyLog.png";
import { updateUserPassword as _updateUserPassword } from "@/api/user";
import { queryConfigList as _queryConfigList } from "@/api/common";
import test from "@/assets/test.png";
export default {
  components: { SidebarItem },
  data() {
    var validatePass = (rule, value, callback) => {
      var regex = new RegExp(
        "(?=.*[0-8])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-8]).{8,16}"
      );
      if (value === "") {
        callback(new Error("请输⼊密码"));
      } else if (value.length < 8 || value.length > 16) {
        callback(new Error("请输⼊8~16位密码"));
      } else if (!regex.test(value)) {
        callback(
          new Error("密码必须同时包含字母、数字和特殊字符其中三项且⾄少8位")
        );
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      logo: logo,
      runTime: 0, // 安全运行时间
      ruleForm: {
        pass: "",
        checkPass: "",
        oldPass: "",
      },
      dialogVisible: false,

      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        oldPass: [{ trigger: "blur" }],
      },
      test,
      testFlag: "0",
    };
  },
  computed: {
    ...mapGetters(["sidebar", "permission_routes"]),
    routes() {
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    variables() {
      return variables;
    },
  },
  mounted() {
    // this.runTime = this.$moment()
    //   .diff(this.$moment("2021-06-30"), "days")
    //   .toString();
    // 8院
    this.runTime = this.$moment()
      .diff(this.$moment("2023-03-08"), "days")
      .toString();
    _queryConfigList({ page: 1, size: 10 }).then((res) => {
      this.testFlag = res.data.test.value;
    });
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login`);
    },
    changepwd() {
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            userId: this.$store.state.user.userId,
            originPwd: this.ruleForm.oldPass,
            newPwd: this.ruleForm.pass,
          };
          _updateUserPassword(data).then(async (res) => {
            console.log(res);
            if (res.code == 200) {
              await this.$store.dispatch("user/logout");
              this.$router.push(`/login`);
            } else {
              this.$message.error(res.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scope>
.logo {
  font-size: 0;
  padding-left: 20px;
  img {
    height: 30px;
  }
}
.dot {
  font-size: 26px;
  font-weight: bold;
  margin: 0 6px;
  padding-top: 10px;
}
.right-menu {
  float: right;
  height: 100%;
  line-height: 50px;
  min-width: 80px;
  display: flex;
  width: 450px;
  &:focus {
    outline: none;
  }

  .right-menu-item {
    display: inline-block;
    padding: 0 8px;
    height: 100%;
    font-size: 18px;
    color: #5a5e66;
    vertical-align: text-bottom;

    &.hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
  }
  .avatar-container {
    margin-right: 30px;
    .avatar-wrapper {
      margin-top: 5px;
      position: relative;
      .user-avatar {
        cursor: pointer;
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        cursor: pointer;
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
.system-name {
  font-size: 26px;
  min-width: 220px;
  font-weight: bold;
  margin-right: 30px;
}
.el-menu {
  margin-top: 8px;
}
.flex {
  min-width: 480px;
  align-items: center;
}
.runTime {
  min-width: 200px;
  width: 300px;
  display: flex;
  height: 56px;
  .img {
    width: 54px;
    height: 54px;
    background-image: url(../../../assets/runTime.png);
  }
  span {
    color: #00c1b5;
    font-size: 26px;
    font-weight: bold;
  }
  p {
    line-height: 25px;
  }
}
</style>
