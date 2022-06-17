<template>
  <div>
    <el-form ref="form" label-width="80px" inline :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in category2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      category1: [],
      category2: [],
      category3: [],
      // 收集相应的一级二级三级分类的id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    // 当一级分类的select发生改变时调用，获取二级分类数据保存到data中
    handler1() {
      this.category2 = [];
      this.category3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      this.$API.attr
        .reqCategory2List(this.cForm.category1Id)
        .then((result) => {
          if (result.code == 200) {
            this.category2 = result.data;
          }
        })
        .catch((error) => {
          new Error(error);
        });
    },
    // 当二级分类的select发生改变时调用，获取三级分类数据保存到data中
    handler2() {
      this.category3 = [];
      this.cForm.category3Id = "";
      this.$API.attr
        .reqCategory3List(this.cForm.category2Id)
        .then((result) => {
          if (result.code == 200) {
            this.category3 = result.data;
          }
        })
        .catch((error) => {
          new Error(error);
        });
    },
    // 当三级分类的select发生改变时把 存id的对象 传给 Attr 父组件
    async handler3() {
      this.$emit("getCategoryId", this.cForm);
    },
  },
  mounted() {
    this.$API.attr
      .reqCategory1List()
      .then((result) => {
        if (result.code == 200) {
          this.category1 = result.data;
        }
      })
      .catch((error) => {
        new Error(error);
      });
  },
};
</script>

<style>
</style>