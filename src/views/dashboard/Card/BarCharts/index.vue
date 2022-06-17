<template>
  <!-- 容器 -->
  <div ref="charts" style="width: 100%; height: 100%">123</div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarCharts",
  mounted() {
    let barChart = echarts.init(this.$refs.charts);
    barChart.setOption({
      tooltip: {
        formatter: function (data) {
          return data.seriesName + ':' + data.value;
        },
      },
      xAxis: {
        show: false,
        type: "category",
        boundaryGap: false,
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          name: "支付笔数",
          type: "bar",
          data: [20, 20, 30, 10, 20, 30, 40, 10, 5, 10, 20, 26],
          color: "#5470c6",
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
</style>