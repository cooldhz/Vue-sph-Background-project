<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 10px"
      @click="AddTradeMark"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column
        prop="prop"
        label="序号"
        width="80"
        type="index"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="品牌Logo" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 82px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      style="text-align: center; margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="getData"
      :current-page="page"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes,total"
      :total="total"
    >
    </el-pagination>

    <!-- 对话框 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form style="width: 85%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reqAddOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义表单验证规则
    var validateTmName = (rule, value, callback) => {
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("品牌名称长度在2-10"));
      } else {
        callback();
      }
    };
    return {
      // 分页器相关
      page: 1,
      limit: 3,
      total: 0,
      // 数据列表
      list: [],
      // 弹出对话框相关
      title: "",
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "change" },
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  methods: {
    // 获取品牌数据列表
    async getData(pager = 1) {
      this.page = pager;
      const result = await this.$API.tradeMark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if ((result.code = 200)) {
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    // 添加品牌按钮
    AddTradeMark() {
      this.title = "添加品牌";
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 上传图片成功后回调
    handleAvatarSuccess(res, file) {
      // console.log(res);
      this.tmForm.logoUrl = res.data;
    },
    // 上传图片前回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 弹出的对话框确定按钮 【添加或更新品牌】
    reqAddOrUpdateTradeMark() {
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          if (this.title == "添加品牌") {
            const result = await this.$API.tradeMark.reqAddTradeMark(
              this.tmForm
            );
            if (result.code == 200) {
              this.$message.success("添加成功");
              this.getData();
            }
          } else {
            const result = await this.$API.tradeMark.reqUpdateTradeMark(
              this.tmForm
            );
            if (result.code == 200) {
              this.$message.success("修改成功");
              this.getData(this.page);
            }
          }
        } else {
          return false;
        }
      });
    },
    // 编辑按钮
    updateTradeMark(row) {
      this.title = "编辑品牌";
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
    },
    // 删除按钮
    deleteTradeMark(row) {
      // console.log(row);
      this.$confirm(`此操作将永久删除 ${row.tmName}, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let { id } = row;
          const result = await this.$API.tradeMark.reqDeleteTradeMark(id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌列表数据
            this.getData(this.list.length < 1 ? this.page - 1 : this.page);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>