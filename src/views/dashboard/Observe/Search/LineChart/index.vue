<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <svg
        t="1653622563697"
        class="icon info"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2877"
        width="25"
        height="25"
      >
        <path
          d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
          p-id="2878"
          fill="#bfbfbf"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span style="font-size: 28px; margin-right: 20px">12321</span>
      <span>17.1 <i class="el-icon-caret-top" style="color: red"></i></span>
    </div>
    <div class="footer">
      <div style="width: 100%; height: 50px" ref="chart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
  mounted() {
    let chart = echarts.init(this.$refs.chart);
    chart.setOption({
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
          data: [20, 10, 20, 6, 10],
          type: "line",
          smooth: true,
          //拐点的样式的设置
          itemStyle: {
            opacity: 0,
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 1,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.info {
  position: absolute;
  left: 85px;
  top: 7px;
  font-weight: 700;
}
.header {
  position: relative;
  height: 40px;
  line-height: 40px;
}
.footer {
  margin-top: 5px;
}
</style>