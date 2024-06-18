<template>
  <div>
    <div class="content-container search-header">
      <!-- <el-form
        size="mini"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="角色名称:">
          <el-input
            v-model="formInline.appName"
            placeholder=""
            style="width: 100px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form> -->
    </div>
    <div class="content-container content-drawer">
      <div class="content-header">角色列表</div>
      <div class="button-list">
        <el-button
          size="small"
          class="addButton"
          @click="gotoadd"
          icon="el-icon-plus"
          >新增</el-button
        >
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="序号" width="160" align="center">
          <template slot-scope="scope">
            <span>{{
              (pagination.current - 1) * pagination.size + scope.$index + 1
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="400"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="400"
          align="center"
        >
        </el-table-column>
        <!-- <el-table-column prop="createdtime" label="创建时间" width="200">
        </el-table-column> -->
        <el-table-column
          fixed="right"
          label="操作"
          min-width="100"
          align="center"
        >
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
        title="新增角色"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
      >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item
            label="角色名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="描述"
            :label-width="formLabelWidth"
            prop="description"
          >
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="选择权限"
            :label-width="formLabelWidth"
            prop="power"
          >
            <el-tree
              :data="data"
              show-checkbox
              node-key="permissionId"
              :default-expand-all="true"
              :default-checked-keys="[]"
              :props="defaultProps"
              @check="handleCheckChange"
            >
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addForm('form')">确 定</el-button>
        </div>
      </el-dialog>
      <el-drawer
        title="角色编辑"
        :visible.sync="visible"
        style="position: absolute"
        direction="rtl"
        :modal="false"
        :size="'820px'"
      >
        <el-form :model="changeform" :rules="rules" ref="changeform">
          <el-form-item
            label="角色名称"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input v-model="changeform.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="描述"
            :label-width="formLabelWidth"
            prop="description"
          >
            <el-input
              v-model="changeform.description"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="选择权限"
            :label-width="formLabelWidth"
            prop="power"
          >
            <el-tree
              :data="data"
              show-checkbox
              ref="rightsTree"
              node-key="permissionId"
              :default-expand-all="true"
              :default-checked-keys="checkedKeyList"
              :props="defaultProps"
              @check="handleCheckedChange"
            >
            </el-tree>
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
  roleAdd as _roleAdd,
  roleQueryList as _roleQueryList,
  roleDelete as _roleDelete,
  queryPermissionList as _queryPermissionList,
  roleUpdate as _roleUpdate,
} from "@/api/common";
import { json } from "vkbeautify";
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
        name: [{ required: true, message: "请输角色名称", trigger: "blur" }],
        description: [
          { required: false, message: "请输角色描述", trigger: "blur" },
        ],
      },
      createdtime: "",
      createdby: "",
      changeform: {},
      data: [],
      defaultProps: {
        children: "children",
        label: "permissionName",
      },
      checkedKeyList: [],
    };
  },
  created() {
    this.onSubmit();
    _queryPermissionList().then((res) => {
      this.data = res.data;
    });
  },
  methods: {
    onSubmit() {
      const data = {
        page: this.pagination.current,
        size: this.pagination.size,
        cond: this.formInline.appName,
      };
      _roleQueryList(data).then((res) => {
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
      _roleDelete(val.roleId).then((res) => {
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
            roleName: this.form.name,
            permissionIds: this.newPermissionList,
            description: this.form.description,
          };
          _roleAdd(data).then((res) => {
            if (res.code == 200) {
              this.dialogFormVisible = false;
              this.$message.success("新增成功");
              this.form = {};
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
      this.createdtime = val.description;
      this.checkedKeyList = [];
      for (const iterator of val.permissionIds) {
        if (iterator.children.length > 0) {
          for (const item of iterator.children) {
            this.checkedKeyList.push(item.permissionId);
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.rightsTree.setCheckedKeys(this.checkedKeyList);
      });
      this.visible = true;
      this.changeform = {
        name: val.roleName,
        description: val.description,
        roleId: val.roleId,
      };
      this.checkPermissionList = checkedKeyList;
    },
    save(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            roleId: this.changeform.roleId,
            roleName: this.changeform.name,
            permissionIds: this.checkPermissionList,
            description: this.changeform.description,
          };
          _roleUpdate(data).then((res) => {
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
    handleCheckChange(e, data) {
      const key = [...data.checkedKeys, ...data.halfCheckedKeys];
      let Plist = JSON.parse(JSON.stringify(this.data));
      let fArr = Plist.filter((Plist) => {
        return key.indexOf(Plist.permissionId) !== -1;
      });
      for (const iterator of fArr) {
        const arr = iterator.children.filter((v) => {
          return key.indexOf(v.permissionId) !== -1;
        });
        iterator.children = arr;
      }
      this.newPermissionList = fArr;
    },
    handleCheckedChange(e, data) {
      const key = [...data.checkedKeys, ...data.halfCheckedKeys];
      let Plist = JSON.parse(JSON.stringify(this.data));
      let fArr = Plist.filter((Plist) => {
        return key.indexOf(Plist.permissionId) !== -1;
      });
      for (const iterator of fArr) {
        const arr = iterator.children.filter((v) => {
          return key.indexOf(v.permissionId) !== -1;
        });
        iterator.children = arr;
      }
      this.checkPermissionList = fArr;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__body {
  .el-input__inner {
    width: 300px;
  }
}
.search-header {
  background-color: #f4f7f9;
}
</style>
