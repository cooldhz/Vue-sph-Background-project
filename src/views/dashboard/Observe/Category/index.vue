<template>
  <el-card>
    <div slot="header" class="clearfix">
      <div class="category-header">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="small">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div style="width: 100%; height: 300px" ref="chart"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "Category",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let chart = echarts.init(this.$refs.chart);
    chart.setOption({
      title: {
        text: "Search Engine",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      // toolbox: {},
      series: [
        {
          name: "销售额类别占比",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outside",
          },
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    chart.on("mouseover", (params) => {
      const { value, name } = params.data;
      chart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.category-header {
  height: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>