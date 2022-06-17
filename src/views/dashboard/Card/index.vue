<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" :count="salesTotal">
            <template slot="charts">
              <span>
                周同比 56.67%
                <i class="el-icon-caret-top" style="color: red"></i>
              </span>

              <span>
                日同比 -17.67%
                <i class="el-icon-caret-bottom" style="color: green"></i>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥{{ salesToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" :count="visitTotal">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日访问量 {{ visitToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" :count="payTotal">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span>转化率 {{ payRate }}%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" :count="`${activityRate}%`">
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer">
              <span>
                周同比 12%
                <i class="el-icon-caret-top" style="color: red"></i>
              </span>

              <span>
                日同比 11%
                <i class="el-icon-caret-bottom" style="color: green"></i>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from "./Detail";
import LineCharts from "./LineCharts";
import BarCharts from "./BarCharts";
import ProgressCharts from "./ProgressCharts";
import { mapGetters, mapState } from "vuex";
export default {
  name: "Card",
  components: { Detail, LineCharts, BarCharts, ProgressCharts },
  computed: {
    ...mapGetters("home", ["salesTotal"]),
    ...mapGetters("home", ["salesToday"]),
    ...mapState({
      visitTotal: (state) => state.home.data.visitTotal,
      visitToday: (state) => state.home.data.visitToday,
      payTotal: (state) => state.home.data.payTotal,
      payRate: (state) => state.home.data.payRate,
      activityRate: (state) => state.home.data.activityRate,
    }),
  },
};
</script>

<style>
</style>