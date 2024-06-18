<template>
  <div class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <!-- <div class="sideBar-top"> -->
    <!-- </div> -->
    <div class="main-container">
      <sidebar class="sidebar-container" />
      <navbar />
      <app-main />
    </div>
    <el-dialog
      title="密码已过期，请修改密码"
      :visible.sync="dialogVisible"
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
        <el-form-item label="新密码" prop="pass">
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
import { Navbar, Sidebar, AppMain } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { queryConfigList as _queryConfigList } from "@/api/common";
import { checkUserPwdActiveTime as _checkUserPwdActiveTime } from "@/api/user";
import { updateUserPassword as _updateUserPassword } from "@/api/user";

function flatten(arr) {
  return arr.reduce(function (prev, cur) {
    return prev.concat(Array.isArray(cur) ? flatten(cur) : cur);
  }, []);
}
export default {
  name: "Layout",
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  mixins: [ResizeMixin],
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
            // 上一次点击时间
      lastTime: new Date().getTime(),
      // 当前时间
      currentTime: new Date().getTime(),
      // 超时时间, 如果半个小时都没有点击页面就算超时
      sys_timeout: 30 * 60 * 1000,
      // 检查的时间，每隔10s检查一次有没有超时
      check_time: 10 * 1000,
      // 计时器
      whole_timer: null,
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
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile",
      };
    },
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    },
     // 判断是否超时
    isTimeOut() {
      this.currentTime = new Date().getTime();
      this.lastTime = this.$store.state.login.lastTime;
      // 超时了
      if (this.currentTime - this.lastTime > this.sys_timeout) {
        return true;
      } else {
        return false;
      }
    },
    isLoginOut() {
      clearInterval(this.whole_timer);
      let _this = this;
      this.whole_timer = setInterval(async () => {
        if (_this.isTimeOut()) {
          await this.$store.dispatch("user/logout");
          this.$router.push(`/login`);
          // 如果退出了就清除这个定时器，这里要延迟一秒清除，因为跳转到登录界面会有一点点延迟~
          setTimeout(function () {
            clearInterval(_this.whole_timer);
          }, 1000);
        }
      }, _this.check_time);
    },
      submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            userId:this.$store.state.user.userId,
            originPwd:this.ruleForm.oldPass,
            newPwd:this.ruleForm.pass,
          }
          _updateUserPassword(data).then(async(res) =>{
            console.log(res);
            if(res.code == 200){
              this.$message.success('修改成功')
               await this.$store.dispatch("user/logout");
            this.$router.push(`/login`);
            }else{
              this.$message.error(res.msg)
            }
          })
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
  mounted () {
     _checkUserPwdActiveTime({ userId: localStorage.getItem("SETUSERID") }).then(
      (res) => {
        if(res.state == 201){
          this.$message.warning(res.data)
        }else if(res.state == 202){
           this.dialogVisible = true
        }
      }
    );;
  },
    created() {
    _queryConfigList({ page: 1, size: 10 }).then((res) => {
      const list = flatten(
        res.data.config.map((res) => {
          return res.moduleArray;
        })
      );
      for (const iterator of list) {
        if (iterator.key == "autoLoginOutTime") {
          this.sys_timeout = iterator.value * 60 * 1000 - 1000;
          this.isLoginOut();
        }
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: calc(100vh - 64px) !important;
  width: 100%;
  // margin-top: 60px;

}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
