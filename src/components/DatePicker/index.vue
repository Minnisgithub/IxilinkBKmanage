<template>
  <div>
    <el-select v-model="value" @change="dateChange" size="mini">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 60,
      options: [
        { label: "1小时", value: 60 },
        { label: "1天", value: 72 },
        { label: "1周前", value: 42 },
        { label: "2周前", value: 84 },
        { label: "1个月", value: 180 },
      ],
    };
  },
  methods: {
    dateChange(v=this.value) {
      if (v === 60) {
        this.timevalue = new Date().getTime() - 3600 * 1000;
      } else if (v === 72) {
        this.timevalue = new Date().getTime() - 3600 * 1000 * 24;
      } else if (v === 42) {
        this.timevalue = new Date().getTime() - 3600 * 1000 * 24 * 7;
      } else if (v === 84) {
        this.timevalue = new Date().getTime() - 3600 * 1000 * 24 * 14;
      } else if (v === 180) {
        this.timevalue = new Date().getTime() - 3600 * 1000 * 24 * 30;
      }
      this.timemsg = {
        to:this.formatDateT(new Date().getTime()),
        from:this.formatDateT(this.timevalue),
        numPoints:v
      }
      this.$emit("dateChange", this.timemsg);
    },
    formatDateT(dataTime) {
      let newDate = new Date(dataTime);
      newDate.getTime(dataTime * 1000);
      return newDate.toISOString();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>