<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShowTable"
      ></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 15px"
          @click="addAttr"
          :disabled="!cForm.category3Id"
          >添加属性</el-button
        >
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column label="序号" width="80" type="index" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                style="margin: 0 5px"
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form ref="form" label-width="67px" inline :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model.trim="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 15px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model.trim="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                :ref="$index"
                v-if="row.flag"
                @blur="leaveInput(row)"
              ></el-input>
              <span
                style="display: block"
                v-else
                @click="enterInput(row, $index)"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                size="mini"
                icon="el-icon-delete"
                type="danger"
                @click="deleteAttrValue($index, row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length < 1"
          @click="saveAttrInfo"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入 lodash 当中的深拷贝
import { cloneDeep } from "lodash";
export default {
  name: "Attr",
  data() {
    return {
      attrList: [],
      cForm: {},

      // 控制表格显示和隐藏
      isShowTable: true,

      // 收集新增属性|修改属性使用的
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [
          //属性名中属性值，因为属性值可以是多个，因此需要的是数组
          // {
          //   attrId: 0, // 属性的id
          //   valueName: "", // 属性值
          // },
        ],
        categoryId: 0, // category3Id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId(cForm) {
      this.cForm = cForm;
      this.getArrList();
    },
    async getArrList() {
      let { category1Id, category2Id, category3Id } = this.cForm;
      const result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 属性的id
        valueName: "", // 属性值
        flag: true, // input和span切换
      });

      this.$nextTick(() => {
        const index = this.attrInfo.attrValueList.length - 1;
        this.$refs[index].focus();
      });
    },
    // 离开input
    leaveInput(row) {
      if (!row.valueName) {
        return this.$message.warning("请输入内容。");
      }
      // 新增的属性值不能与已有的属性值重复
      // some: 查看数组里的每一个对象是否符合条件，只要有一个符合，返回true
      const result = this.attrInfo.attrValueList.some((item) => {
        // 判断的时候，需要把【已有的数组中，最后一个添加/新增 的去除掉】
        if (item !== row) {
          return row.valueName == item.valueName;
        }
      });
      if (result) {
        return this.$message.warning("请不要重复输入。");
      }
      row.flag = false;
    },
    // 进入input
    enterInput(row, $index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[$index].focus();
      });
    },
    // 删除属性值
    deleteAttrValue($index, row) {
      this.$confirm(`此操作将永久删除${row.valueName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.attrInfo.attrValueList.splice($index, 1);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 添加属性按钮回调
    addAttr() {
      // 收集三级分类的Id
      this.attrInfo.categoryId = this.cForm.category3Id;
      // console.log(this.cForm.category3Id);
      // 切换显示隐藏
      this.isShowTable = false;
      // 清除attrInfo的相关数据
      this.attrInfo.attrName = "";
      this.attrInfo.attrValueList = [];
    },
    // 更新Attr
    updateAttr(row) {
      this.isShowTable = false;
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, "flag", false);
      });
    },
    // 保存属性信息
    async saveAttrInfo() {
      // 如果用户添加很多属性值，且属性值为空的不应该提交给服务器
      // 把flag字段删除掉，服务器不需要flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => item.valueName !== "" && delete item.flag
      );

      const result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
      if ((result.code = 200)) {
        this.$message.success("保存成功！");
        this.isShowTable = true;
        this.getArrList();
      } else {
        this.$message.error("保存失败！");
      }
    },
  },
};
</script>

<style>
</style>