<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tradeMark.tmName"
            :value="tradeMark.id"
            v-for="tradeMark in TradeMarkList"
            :key="tradeMark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spu.description"
          placeholder="SPU描述"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrId"
          :placeholder="`还有${unSelectSaleAttr.length}个未选择`"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 5px"
          :disabled="!attrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table
          style="width: 100%; margin: 15px 0"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="160">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0 2px"
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model.trim="row.inputValue"
                :ref="$index"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row, $index)"
                >+ New Tag</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,

      // 存储spu信息
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //品牌的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //品牌属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌信息
      TradeMarkList: [],
      // spu图标信息
      spuImageList: [],
      // 销售属性信息
      baseSaleAttrList: [],
      //
      attrId: "",
    };
  },
  computed: {
    unSelectSaleAttr() {
      // 从全部的销售属性中筛选自己还没有的销售属性
      return this.baseSaleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    // 初始化spu表单
    async initSpuForm(spuId) {
      //获取SPU信息
      const spuResult = await this.$API.spu.reqSpu(spuId);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌的信息
      const TradeMarkListResult = await this.$API.spu.reqTradeMarkList();
      if (TradeMarkListResult.code == 200) {
        this.TradeMarkList = TradeMarkListResult.data;
      }
      // 获取SPU图标的数据
      const spuImageResult = await this.$API.spu.reqSpuImageList(spuId);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        // 由于照片墙显示图片的数据需要数组，数组里面需要有name和url字段
        // 需要把服务器返回来的数据加上name和uel字段
        listArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listArr;
      }
      // 获取平台全部销售属性
      const baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    // 照片墙图片删除某个图片会触发
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 照片墙文件上传成功时触发
    handleSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    // 添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(":");
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.attrId = "";
    },
    // 点击新增按钮 【显示input】
    showInput(row, $index) {
      // this.inputVisible = true;
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");

      this.$nextTick(() => {
        this.$refs[$index].focus();
      });
    },
    // input失去焦点回调
    handleInputConfirm(row) {
      // 如果没有inputValue
      if (row.inputValue == "") {
        return this.$message.warning("请输入属性值！");
      }
      // 如果输入的属性值重复了
      const result = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == row.inputValue
      );
      if (result) {
        return this.$message.warning("请不要输入重复的属性值！");
      }
      const { baseSaleAttrId, inputValue } = row;
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      row.inputVisible = false;
      row.inputValue = "";
    },
    // 保存
    async addOrUpdateSpu() {
      // 整理参数【整理照片墙的数据】
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url,
        };
      });
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        // 提示信息
        this.$message.success(this.spu.id ? "SPU更新成功!" : "SPU添加成功!");
        // 回到场景0,重新获取数据
        this.$emit("changeScene", 0, { flag: this.spu.id ? "更新" : "添加" });
        // 清理数据
        // this.$options可以获取Vue的配置对象，配置对象的data函数执行 返回的响应式数据为空
        Object.assign(this._data, this.$options.data());
      } else {
        this.$message.error("出错啦！");
      }
    },
    // 点击添加SPU按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      //获取品牌的信息
      const TradeMarkListResult = await this.$API.spu.reqTradeMarkList();
      if (TradeMarkListResult.code == 200) {
        this.TradeMarkList = TradeMarkListResult.data;
      }
      // 获取平台全部销售属性
      const baseSaleAttrResult = await this.$API.spu.reqBaseSaleAttrList();
      if (baseSaleAttrResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    // 取消按钮回调
    cancel() {
      this.$emit("changeScene", 0, { flag: "" });
      // 清理数据
      // this.$options可以获取Vue的配置对象，配置对象的data函数执行 返回的响应式数据为空
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>