<template>
  <div class="app-container">
    <el-form inline>
      <!-- 表单元素 -->
      <el-form-item>
        <el-input placeholder="用户名" v-model.trim="tempSearchObj.username" />
      </el-form-item>
      <!-- 查询与清空的按钮 -->
      <el-button type="primary" icon="el-icon-search" @click="search"
        >查询</el-button
      >
      <el-button type="default" @click="resetSearch">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <!-- 添加与批量添加按钮 -->
      <el-button type="primary" @click="showAddUser">添 加</el-button>
      <el-button
        type="danger"
        @click="revomveUsers"
        :disabled="removeIds.length == 0"
        >批量删除</el-button
      >
    </div>

    <!--
         table表格：展示用户信息的地方
     -->
    <el-table
      border
      stripe
      v-loading="listLoading"
      :data="users"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column type="index" label="序号" width="80" align="center" />

      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleName" label="权限列表" />

      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column prop="gmtModified" label="更新时间" width="180" />

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{ row, $index }">
          <el-tooltip content="分配角色" placement="bottom" effect="light">
            <el-button
              type="info"
              size="mini"
              icon="el-icon-user-solid"
              @click="showAssignRole(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="修改用户" placement="bottom" effect="light">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showUpdateUser(row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="删除用户" placement="bottom" effect="light">
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="open(row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--
         分页器 
        
    -->
    <el-pagination
      style="text-align: center; padding: 20px 0"
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 10, 20, 30, 40, 50, 100]"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      layout="prev, pager, next, jumper, ->, sizes, total"
    />
    <!-- 对话框的结构 -->
    <el-dialog
      :title="user.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogUserVisible"
    >
      <el-form
        ref="userForm"
        :model="user"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName" />
        </el-form-item>
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="设置角色"
      :visible.sync="dialogRoleVisible"
      :before-close="resetRoleData"
    >
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 5px 0"></div>
          <el-checkbox-group
            v-model="userRoleIds"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="role in allRolesList"
              :key="role.id"
              :label="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole"
          >保存</el-button
        >
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      listLoading: false, // 是否显示列表加载的提示
      // 收集搜索条件输入的对象
      tempSearchObj: {
        username: "",
      },
      // 包含请求搜索条件数据的对象
      searchObj: {
        username: "",
      },
      removeIds: [], // 所有选择的user的id的数组
      users: [], // 当前页的用户列表
      page: 1,
      limit: 3,
      total: 0,

      user: {}, // 当前要操作的user
      dialogUserVisible: false, // 添加/修改用户弹出层【显示、隐藏】
      userRules: {
        // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: "用户名必须输入" },
          { min: 4, message: "用户名不能小于4位" },
        ],
        password: [{ required: true, validator: this.validatePassword }],
      },
      loading: false, // 是否正在提交请求中
      dialogRoleVisible: false, // 分配角色弹出层【显示、隐藏】
      allRolesList: [],
      userRoleIds: [],
      isIndeterminate: false,
      checkAll: false, //  是否全选
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    // 自定义密码校验
    validatePassword(rule, value, callback) {
      if (!value) {
        callback("密码必须输入");
      } else if (!value || value.length < 6) {
        callback("密码不能小于6位");
      } else {
        callback();
      }
    },
    async getUsers(page = 1) {
      this.page = page;
      const { limit, searchObj } = this;
      this.listLoading = true;
      const result = await this.$API.user.getPageList(page, limit, searchObj);
      if (result.code == 20000) {
        this.listLoading = false;
        const { items, total } = result.data;
        this.users = items.filter((item) => item.username !== "admin");
        this.total = total - 1;
        this.selectedIds = [];
      }
    },
    // 查询用户
    search() {
      this.page = 1;
      this.searchObj = { ...this.tempSearchObj };
      this.getUsers();
    },
    // 清空
    resetSearch() {
      this.searchObj = {};
      this.tempSearchObj = {};
      this.getUsers();
    },
    //  列表选中状态发生改变的监听回调
    handleSelectionChange(val) {
      this.removeIds = val.map((item) => item.id);
    },
    // 批量删除用户
    async revomveUsers() {
      this.$confirm("确定删除吗?")
        .then(async () => {
          await this.$API.user.removeUsers(this.removeIds);
          this.$message.success("删除成功");
          this.getUsers();
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    handleCurrentChange(page) {
      this.getUsers(page);
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getUsers();
    },
    // 添加用户按钮回调
    showAddUser() {
      this.user = {};
      this.dialogUserVisible = true;
      this.$nextTick(() => this.$refs.userForm.clearValidate());
    },
    // 修改用户按钮回调
    showUpdateUser(row) {
      this.user = { ...row };
      this.dialogUserVisible = true;
    },
    // 取消用户的保存或更新
    cancel() {
      this.user = {};
      this.dialogUserVisible = false;
    },
    // 保存或者更新用户
    addOrUpdate() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.$API.user[this.user.id ? "update" : "add"](this.user).then(
            (result) => {
              this.loading = false;
              if (result.code == 20000) {
                this.$message.success(
                  this.user.id ? "更新成功！" : "添加成功！"
                );
                this.dialogUserVisible = false;
                this.getUsers(this.user.id ? this.page : 1);
                this.user = {};
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 分配角色按钮回调
    showAssignRole(row) {
      this.user = row;
      this.dialogRoleVisible = true;
      this.getRole();
    },
    //  异步获取用户的角色列表
    async getRole() {
      const result = await this.$API.user.getRoles(this.user.id);
      if (result.code == 20000) {
        this.allRolesList = result.data.allRolesList;
        this.checkAll =
          this.allRolesList.length == result.data.assignRoles.length;
        this.userRoleIds = result.data.assignRoles.map((item) => item.id);
        // this.isIndeterminate =
        //   result.data.assignRoles.length > 0 && result.data.assignRoles.length < result.data.allRolesList.length;
      }
    },
    // 全选按钮回调
    handleCheckAllChange(value) {
      // value 当前勾选状态true/false
      if (value) {
        // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
        this.userRoleIds = this.allRolesList.map((item) => item.id);
        this.isIndeterminate = true;
      } else {
        this.userRoleIds = [];
        this.isIndeterminate = false;
      }
    },
    //  角色列表选中项发生改变的监听
    handleCheckedChange(value) {
      this.checkAll =
        value.length == this.allRolesList.length &&
        this.allRolesList.length > 0;
      this.isIndeterminate =
        this.userRoleIds.length > 0 &&
        this.userRoleIds.length < this.allRolesList.length;
    },
    // 设置角色 【保存按钮回调】
    async assignRole() {
      const userId = this.user.id;
      const roleIds = this.userRoleIds.join(",");
      this.loading = true;
      const result = await this.$API.user.assignRoles(userId, roleIds);
      this.loading = false;
      if (result.code == 20000) {
        this.$message.success("保存成功！");
        this.getUsers(this.page);
        this.resetRoleData();
      }
    },
    // 重置用户角色的数据 【 取消分配角色弹出层 】
    resetRoleData() {
      this.dialogRoleVisible = false;
      this.allRolesList = [];
      this.userRoleIds = [];
      this.isIndeterminate = false;
      this.checkAll = false;
    },
    // 删除某个用户
    open(row) {
      this.$confirm(
        `此操作将永久删除${row.username}该用户, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(async () => {
          const result = await this.$API.user.removeById(row.id);
          if (result.code == 20000) {
            this.$message.success("删除成功！");
            this.getUsers(this.users.length > 1 ? this.page : this.page - 1);
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
};
</script>

<style>
</style>