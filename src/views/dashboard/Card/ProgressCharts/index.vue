<template>
  <!-- 容器 -->
  <div ref="charts" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    let lineChart = echarts.init(this.$refs.charts);
    lineChart.setOption({
      tooltip: {
        formatter: function (data) {
          let value = data.value;
          return data.seriesName + ":" + data.value + "%";
        },
      },
      xAxis: {
        show: false,
        boundaryGap: false,
        // 最小值、最大值设置
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        // 均分
        type: "category",
      },
      series: [
        {
          name: "运营活动效果",
          type: "bar",
          data: [78],
          barWidth: "18",
          color: "#5470c6",
          showBackground: true,
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