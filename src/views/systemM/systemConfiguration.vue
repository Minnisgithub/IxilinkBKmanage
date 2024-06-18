<template>
  <div class="flexC content-container">
    <div>
      <div v-for="(item, i) in dataList" :key="i">
        <h3>{{ item.moduleName }}</h3>
        <el-form
          v-for="(v, index) in item.moduleArray"
          :key="index"
          :label-position="labelPosition"
          label-width="200px"
          :model="v"
        >
          <el-form-item :label="v.name + ':'">
            <el-input v-if="v.configType == 1" v-model="v.value"></el-input>
            <el-switch
              v-if="v.configType == 3"
              v-model="v.value"
              active-value="1"
              inactive-value="0"
            ></el-switch>
            <el-input-number
              v-if="v.configType == 2"
              v-model="v.value"
            ></el-input-number>
            <span v-show="v.description" class="description"
              >提示：{{ v.description }}</span
            >
          </el-form-item>
        </el-form>
      </div>
      <el-form label-width="200px"
        ><el-form-item>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item></el-form
      >
    </div>
    <!-- <div class="flexC">
      <div>
        <h3>单点登录：</h3>
        <el-form :label-position="labelPosition" label-width="200px">
          <el-form-item label="单点登录注册用户开关：">
            <el-switch
              v-model="switchValue"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
            <el-form-item label="单点登录凭证:">
            <el-input
              v-model="certificate"
            ></el-input>
          </el-form-item>
               <el-form-item label="单点登录人员注册地址:">
            <el-input
              v-model="registerUrl"
            ></el-input>
          </el-form-item>
              <el-form-item label="单点登录校验token地址:">
            <el-input
              v-model="checkTokenUrl"
            ></el-input>
          </el-form-item>
        </el-form>
     
      </div>
    </div> -->
  </div>
</template>

<script>
import {
  queryConfigList as _queryConfigList,
  updateConfigList as _updateConfigList,
} from "@/api/common";
function flatten(arr){
  return arr.reduce(function(prev, cur){
    return prev.concat(Array.isArray(cur) ? flatten(cur) : cur)
  }, [])
}
export default {
  data() {
    return {
      switchValue: "0",
      certificate: "",
      registerUrl: "",
      checkTokenUrl: "",
      labelPosition: "right",
      dataList: [],
    };
  },
  created() {
    this.queryConfigList();
  },
  methods: {
    onSubmit() {
      console.log(this.dataList);
      const dataList = JSON.parse(JSON.stringify(this.dataList));
      const data = dataList.map((res) => {
        return res.moduleArray;
      });
      _updateConfigList(flatten(data)).then((res) => {
        if (res.code == 200) {
          this.queryConfigList();
          this.$message.success("更新成功");
        }
      });
    },
    queryConfigList() {
      _queryConfigList({ page: 1, size: 10 }).then((res) => {
        this.dataList = res.data.config;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input {
  width: 400px;
}
.description {
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.5);
}
.flexC {
  display: flex;
  justify-content: center;
}
</style>