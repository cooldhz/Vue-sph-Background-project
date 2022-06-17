<template>
  <el-card class="box-card" style="margin: 15px 0">
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <!-- 右侧 -->
      <div class="right">
        <span @click="setDay">本日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="16">
          <div ref="charts" style="width: 100%; height: 300px"></div>
        </el-col>
        <el-col :span="8">
          <div style="font-size: 18px; font-weight: 700">
            门店{{ title }}排名
          </div>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
            <li>
              <span>4</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
            <li>
              <span>5</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
            <li>
              <span>7</span>
              <span>肯德基</span>
              <span class="rvalue">123446</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      mycharts: null,
      date: [],
    };
  },
  methods: {
    setDay() {
      let day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    setWeek() {
      let start = dayjs().day(1).format("YYYY-MM-DD");
      let end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setMonth() {
      let start = dayjs().startOf("month").format("YYYY-MM-DD");
      let end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    setYear() {
      let start = dayjs().startOf("year").format("YYYY-MM-DD");
      let end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      homeData: (state) => state.home.data,
    }),
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: true,
          },
        },
      ],
      series: [
        {
          name: "销售额",
          type: "bar",
          barWidth: "60%",
          data: [],
        },
      ],
    });
  },
  watch: {
    title() {
      // 重新修改图表的配置数据
      // 图表配置数据可以再次修改，如果有新的数值，用新的，没有 用以前的数据
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: [
          {
            data:
              this.title == "销售额"
                ? this.homeData.orderFullYearAxis
                : this.homeData.userFullYearAxis,
          },
        ],
        series: [
          {
            data:
              this.title == "销售额"
                ? this.homeData.orderFullYear
                : this.homeData.userFullYear,
            name: this.title,
          },
        ],
      });
    },
    homeData() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.homeData.orderFullYearAxis,
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            axisLine: {
              show: true,
            },
          },
        ],
        series: [
          {
            name: "销售额",
            type: "bar",
            barWidth: "60%",
            data: this.homeData.orderFullYear,
          },
        ],
      });
    },
  },
};
</script>

<style scoped>
>>> .el-card__header {
  border: none;
}
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.tabs {
  width: 100%;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  padding: 0 8px;
  line-height: 40px;
}
.date {
  width: 225px;
}
ul {
  width: 100%;
  height: 300px;
  list-style: none;
  margin-top: 20px;
  padding: 0;
}
li {
  height: 8%;
  width: 350px;
}
li span {
  margin: 0 15px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>