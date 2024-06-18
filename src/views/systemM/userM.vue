<template>
  <div>
    <div class="content-container search-header">
      <el-form
        size="mini"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="用户账号:">
          <el-input
            v-model="formInline.userName"
            placeholder=""
            style="width: 100px"
          ></el-input>
        </el-form-item>

        <el-form-item label="创建日期:">
          <el-date-picker
            style="width: 360px"
            v-model="formInline.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="选择日期"
            end-placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss "
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-container content-drawer">
      <div class="content-header">用户列表</div>
      <div class="button-list">
        <el-button
          size="small"
          class="addButton"
          @click="gotoadd"
          icon="el-icon-plus"
          >新增</el-button
        >
        <!-- 
        <el-button size="small">禁用</el-button>
        <el-button size="small">启用</el-button> -->
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="序号" width="80" align="center">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="用户名" width="120">
        </el-table-column>
        <el-table-column
          prop="loginId"
          label="用户账号"
          width="160"
          show-overflow-tooltip
        >
        </el-table-column>

        <el-table-column prop="roleName" label="用户角色" width="200">
          <template slot-scope="scope">
            {{ scope.row.list.map((v) => v.roleName).join(",") }}
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="联系方式" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button @click="changeClick(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <el-divider direction="vertical"></el-divider>
            <el-popconfirm title="确定删除？" @confirm="deleteClick(scope.row)">
              <el-button slot="reference" type="text" size="small"
                >删除</el-button
              >
            </el-popconfirm>
            <!-- <el-divider direction="vertical"></el-divider> -->
            <!-- <el-button @click="deleteClick(scope.row)" type="text" size="small"
              >重置</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.current"
        :page-sizes="pagination.sizes"
        :page-size="pagination.size"
        layout=" total,prev, pager, next, sizes"
        :total="pagination.total"
        align="right"
      >
      </el-pagination>
      <el-dialog
        title="新增用户"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="账号" :label-width="formLabelWidth" prop="id">
            <el-input v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="账号密码"
            :label-width="formLabelWidth"
            prop="pwd"
          >
            <el-input v-model="form.pwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="角色"
            :label-width="formLabelWidth"
            prop="region"
          >
            <el-select multiple v-model="form.region" placeholder="请选择角色">
              <el-option
                v-for="item in typeOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="联系电话"
            :label-width="formLabelWidth"
            prop="phone"
          >
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addForm('form')">确 定</el-button>
        </div>
      </el-dialog>
      <el-drawer
        title="用户编辑"
        :visible.sync="visible"
        style="position: absolute"
        direction="rtl"
        :modal="false"
        :size="'820px'"
      >
        <div class="basic-msg">
          <span style="marginright: 20px">创建于：{{ createTime }}</span>
          <!-- <span>创建人：{{ createdby }}</span> -->
        </div>
        <el-form :model="changeform" :rules="rules" ref="changeform">
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="changeform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="账号" :label-width="formLabelWidth" prop="id">
            <el-input v-model="changeform.id" autocomplete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="账号密码"
            :label-width="formLabelWidth"
            prop="pwd"
          >
            <el-input v-model="changeform.pwd" autocomplete="off"></el-input>
          </el-form-item> -->
          <el-form-item
            label="角色"
            :label-width="formLabelWidth"
            prop="region"
          >
            <el-select
              multiple
              v-model="changeform.region"
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.roleId"
                :label="item.roleName"
                :value="item.roleId"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="联系电话"
            :label-width="formLabelWidth"
            prop="phone"
          >
            <el-input v-model="changeform.phone" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="changeform.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth"
            ><el-button @click="save('changeform')" type="primary" size="small"
              >保存</el-button
            >
            <el-button @click="cancel" size="small"
              >取消</el-button
            ></el-form-item
          >
        </el-form>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {
  userAdd as _userAdd,
  userQueryList as _userQueryList,
  userDelete as _userDelete,
  userUpdate as _userUpdate,
  roleQueryList as _roleQueryList,
} from "@/api/common";
export default {
  data() {
    return {
      formInline: {},
      tableData: [],
      multipleSelection: [],
      pagination: {
        current: 1,
        sizes: [10, 20, 30],
        size: 10,
        total: 0,
      },
      visible: false,
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "120px",
      rules: {
        name: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        id: [{ required: true, message: "请输入用户账号", trigger: "blur" }],
        pwd: [
          { required: true, message: "请输入用户账号密码", trigger: "blur" },
        ],
        region: [{ required: false, message: "请选择角色", trigger: "change" }],
        phone: [
          { required: false, message: "请输入联系电话", trigger: "blur" },
        ],
        email: [{ required: false, message: "请输入邮箱", trigger: "blur" }],
      },
      createTime: "",
      createdby: "",
      changeform: {},
      typeOptions: [],
    };
  },
  created() {
    this.onSubmit();
    _roleQueryList({ page: 1, size: 999 }).then((res) => {
      this.typeOptions = res.data.list;
    });
  },
  methods: {
    onSubmit() {
      const data = {
        page: this.pagination.current,
        size: this.pagination.size,
        loginId: this.formInline.userName,
        startTime: this.formInline.time ? this.formInline.time[0] : undefined,
        endTime: this.formInline.time ? this.formInline.time[1] : undefined,
      };
      _userQueryList(data).then((res) => {
        this.pagination.current = res.data.pageNum;
        this.pagination.size = res.data.pageSize;
        this.pagination.total = res.data.total;
        this.tableData = res.data.list;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    deleteClick(val) {
      _userDelete({ userId: val.userId }).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: "成功删除",
            type: "success",
            duration: 1000,
          });
          this.onSubmit();
        }
      });
    },
    handleCurrentChange(current) {
      this.pagination.current = current;
      this.onSubmit();
    },
    handleSizeChange(current) {
      this.pagination.size = current;
      this.pagination.current = 1;
      this.onSubmit();
    },
    gotoadd() {
      this.dialogFormVisible = true;
    },
    addForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            userName: this.form.name,
            loginId: this.form.id,
            password: this.form.pwd,
            list: this.form.region.map((v) => {
              return { roleId: v };
            }),
            mobile: this.form.phone,
            email: this.form.email,
          };
          _userAdd(data).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.$message.success("新增成功");
              this.onSubmit();
            }
          });
        } else {
          return false;
        }
      });
    },
    changeClick(val) {
      this.createdby = val.createdby;
      this.createTime = val.createTime;
      this.visible = true;
      this.changeform = {
        name: val.userName,
        id: val.loginId,
        pwd: val.password,
        region: val.list.map((v) => v.roleId),
        phone: val.mobile,
        email: val.email,
        changeId: val.userId,
      };
    },
    save(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            userId: this.changeform.changeId,
            userName: this.changeform.name,
            loginId: this.changeform.id,
            // password: this.changeform.pwd,
            list: this.changeform.region.map((v) => {
              return { roleId: v };
            }),
            mobile: this.changeform.phone,
            email: this.changeform.email,
          };
          _userUpdate(data).then((res) => {
            if (res.code == 200) {
              this.visible = false;
              this.$message.success("修改成功");
              this.onSubmit();
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.visible = false;
    },
    // reset(id) {
    //   this.$confirm("此操作将重置密码为123456, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       _resetPwd({ id }).then((res) => {
    //         if (res.code == 200) {
    //           this.$message({
    //             type: "success",
    //             message: "重置成功!",
    //           });
    //           this.onSubmit();
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消重置",
    //       });
    //     });
    // },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  .el-input__inner {
    width: 300px;
  }
}
</style>
