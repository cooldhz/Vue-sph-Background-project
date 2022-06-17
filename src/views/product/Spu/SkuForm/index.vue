<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model.trim="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model.trim="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            style="margin: 3px 0"
            :label="attrInfo.attrName"
            v-for="attrInfo in attrInfoList"
            :key="attrInfo.id"
          >
            <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
              <el-option
                :label="attrValue.valueName"
                :value="`${attrInfo.id}:${attrValue.id}`"
                v-for="attrValue in attrInfo.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select
              v-model="spuSaleAttr.attrIdAndValueId"
              placeholder="请选择"
            >
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 120px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                size="mini"
                v-if="row.isDefault == 0"
                @click="changeDefault(row, spuImageList)"
                >设为默认</el-button
              >
              <el-button size="mini" type="success" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性信息
      spuSaleAttrList: [],
      // 存储平台属性信息
      attrInfoList: [],
      //收集sku数据的字段
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: "",
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        //平台属性
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        //销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 收集图片的数据字段: 但是需要注意，收集的数据目前缺少isDefault字段，将来提交服务器之前需要整理
      imageList: [],
    };
  },
  methods: {
    async getDate(category1Id, category2Id, spu) {
      //收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      // 获取图片的数据
      const ImageResult = await this.$API.spu.reqSpuImageLIst(spu.id);
      // 获取销售属性的数据
      const SpuSaleAttrListResult = await this.$API.spu.reqSpuSaleAttrList(
        spu.id
      );
      //获取平台属性的数据
      const AttrInfoListResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      Promise.all([
        ImageResult,
        SpuSaleAttrListResult,
        AttrInfoListResult,
      ]).then((result) => {
        let imgList = result[0].data;
        imgList.forEach((item) => {
          item.isDefault = "0";
        });
        this.spuImageList = imgList;
        this.spuSaleAttrList = result[1].data;
        this.attrInfoList = result[2].data;
      });
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.imageList = val;
    },
    // 改变图片默认值【排他】
    changeDefault(row, spuImageList) {
      // 全部的 isDefault = 0
      spuImageList.forEach((item) => (item.isDefault = "0"));
      // 自己的 isDefault = 1
      row.isDefault = "1";
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消按钮 回调
    cancel() {
      // this.$options可以获取Vue的配置对象，配置对象的data函数执行 返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
      // 自定义事件，让父组件切换场景 0
      this.$emit("changeScenes", 0);
    },
    // 保存按钮回调 提交sku
    async addSku() {
      const { skuInfo, attrInfoList, spuSaleAttrList, imageList } = this;
      // 整理收集到的平台属性
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理收集到的销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      // 整理收集到的图片信息
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      const result = await this.$API.spu.reqAddSku(skuInfo);
      if (result.code == 200) {
        this.$message.success("保存成功！");
        Object.assign(this._data, this.$options.data());
        this.$emit("changeScenes", 0);
      }
    },
  },
};
</script>

<style>
</style>