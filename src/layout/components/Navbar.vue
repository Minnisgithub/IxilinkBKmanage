<template>
  <div class="navbar" v-show="title !== '首页'">
    <div class="vertical"></div>
    <breadcrumb
      class="breadcrumb-container"
      @cancelBreadcrumb="cancelDashboard"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
  },
  data() {
    return {
      title: "",
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    // 取消首页面包屑导航
    cancelDashboard(v) {
       this.title = v;
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #f4f7f9;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }
  .vertical {
    margin-left: 30px;
    margin-top: 6px;
    margin-bottom: 3px;
    border-left: 10px solid #4e70f1;
    padding-left: 20px;
  }
  .breadcrumb-container {
    float: left;
  }
}
</style>
