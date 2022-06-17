<template>
  <div>
    <el-card style="margin-bottom: 15px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene !== 0" />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" @click="addSpu"
          >添加spu</el-button
        >
        <el-table style="width: 100%; margin: 15px 0" border :data="spuList">
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-tooltip content="添加sku" placement="bottom" effect="light">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-plus"
                  @click="addSku(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="修改spu" placement="bottom" effect="light">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  @click="updateSpu(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="查看当前spu全部sku列表"
                placement="bottom"
                effect="light"
              >
                <el-button
                  type="info"
                  size="mini"
                  icon="el-icon-info"
                  @click="handler(row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                content="删除spu"
                placement="bottom"
                effect="light"
                style="margin-left: 10px"
              >
                <el-popconfirm
                  title="这是一段内容确定删除吗？"
                  @onConfirm="deleteSpu(row)"
                >
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    slot="reference"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[3, 5, 10]"
          :page-size="pageSize"
          layout="prev, pager, next, jumper,->,total,sizes"
          :total="totalCount"
        >
        </el-pagination>
      </div>
      <SpuForm
        v-show="scene == 1"
        @changeScene="changeScene"
        ref="spu"
      ></SpuForm>
      <SkuForm
        v-show="scene == 2"
        ref="sku"
        @changeScenes="changeScenes"
      ></SkuForm>
    </el-card>

    <el-dialog
      :title="`${spu.spuName}sku的列表`"
      :visible.sync="dialogTableVisible"
      :before-close="beforeClose"
    >
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row, $index }">
            <img style="width: 100px" :src="row.skuDefaultImg" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      scene: 0, //  0代表展示spu列表  1代表添加|修改spu   2代表添加sku
      pageNum: 1,
      pageSize: 3,
      totalCount: 0,

      cForm: {},
      spuList: [],

      // 控制对话框的显示和隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  methods: {
    // 获取三级分类Id
    getCategoryId(cForm) {
      this.cForm = cForm;
      this.getSpuList();
    },
    // 获取spu列表
    async getSpuList(page = 1) {
      this.pageNum = page;
      let { category3Id } = this.cForm;
      let { pageNum, pageSize } = this;
      const result = await this.$API.spu.reqSpuList(
        pageNum,
        pageSize,
        category3Id
      );
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.totalCount = result.data.total;
      }
    },
    // 分页器改变pageSize是触发
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getSpuList();
    },
    // 分页器改变页码触发
    handleCurrentChange(pageNum) {
      this.getSpuList(pageNum);
    },
    // 添加spu按钮回调
    addSpu() {
      this.$refs.spu.addSpuData(this.cForm.category3Id);
      this.scene = 1;
    },
    // 更新编辑spu
    updateSpu(row) {
      this.scene = 1;
      this.$refs.spu.initSpuForm(row.id);
    },
    // 更改场景，重新发请求 方法
    changeScene(scene, { flag }) {
      this.scene = scene;
      if (flag == "添加") {
        this.getSpuList();
      } else {
        this.getSpuList(this.pageNum);
      }
    },
    // 删除spu 回调
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message.success(`删除${row.spuName}成功！`);
        this.getSpuList(
          this.spuList.length > 1 ? this.pageNum : this.pageNum - 1
        );
      }
    },

    // 添加sku
    addSku(row) {
      let { category1Id, category2Id } = this.cForm;
      this.scene = 2;
      this.$refs.sku.getDate(category1Id, category2Id, row);
    },
    // skuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看sku按钮的回调
    async handler(spu) {
      this.spu = spu;
      this.dialogTableVisible = true;
      const result = await this.$API.spu.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    // 关闭对话框之前的回调
    beforeClose(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>