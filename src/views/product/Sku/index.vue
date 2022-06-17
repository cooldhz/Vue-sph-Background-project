<template>
  <div>
    <el-table style="width: 100%" :data="skuList" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="180">
        <template slot-scope="{ row, $index }">
          <img style="width: 100px" :src="row.skuDefaultImg" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(KG)" width="120">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="120">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-tooltip
            :content="row.isSale == 1 ? '下架' : '上架'"
            placement="bottom"
            effect="light"
          >
            <el-button
              type="success"
              size="mini"
              icon="el-icon-bottom"
              v-if="row.isSale == 1"
              @click="cancel(row)"
            ></el-button>
            <el-button
              type="info"
              size="mini"
              icon="el-icon-top"
              v-else
              @click="sale(row)"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="编辑" placement="bottom" effect="light">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="$message.info('正在开发中..')"
            ></el-button>
          </el-tooltip>

          <el-tooltip content="查看详情" placement="bottom" effect="light">
            <el-button
              type="info"
              size="mini"
              icon="el-icon-info"
              @click="getSkuInfo(row)"
            ></el-button>
          </el-tooltip>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center; margin-top: 5px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[3, 5, 10]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      :total="totalCount"
    >
    </el-pagination>

    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            style="margin: 3px 5px"
            type="success"
            v-for="attr in skuInfo.skuAttrValueList"
            :key="attr.id"
            >{{ attr.skuId }}-{{ attr.attrId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16" style="width: 300px">
          <el-carousel width="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item">
              <img style="height: 100%" :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      pageNum: 1,
      pageSize: 3,
      totalCount: 0,
      skuList: [],

      skuInfo: {},

      drawer: false,
    };
  },
  methods: {
    async getSkuList() {
      const result = await this.$API.sku.reqSkuList(
        this.pageNum,
        this.pageSize
      );
      if (result.code == 200) {
        this.totalCount = result.data.total;
        this.skuList = result.data.records;
      }
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSkuList();
    },
    handleCurrentChange(page) {
      this.pageNum = page;
      this.getSkuList();
    },
    // 上架
    async sale(sku) {
      const result = await this.$API.sku.reqSale(sku.id);
      if (result.code == 200) {
        this.$message.success("上架成功！");
        this.getSkuList();
      }
    },
    // 下架
    async cancel(sku) {
      const result = await this.$API.sku.reqCancel(sku.id);
      if (result.code == 200) {
        this.$message.success("下架成功！");
        this.getSkuList();
      }
    },
    // 获取SKU详情信息
    async getSkuInfo(sku) {
      this.drawer = true;
      const result = await this.$API.sku.reqSkuById(sku.id);
      console.log(result);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style>
.el-row .el-col-5 {
  font-size: 20px;
  text-align: right;
}
.el-col {
  margin: 10px 10px;
}
</style>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
>>> .el-carousel__button {
  background-color: rgb(0, 0, 0);
  border-radius: 50%;
  width: 12px;
  height: 12px;
}
</style>