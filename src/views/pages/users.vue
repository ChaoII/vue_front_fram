<template>
  <!-- 白色内容区域 -->
  <div class="home-container">
    <div class="flex">
      <div class="input_box">
        <el-input
            v-model="queryParams.search_name"
            placeholder="搜索关键字"
            class="input-with-select"
        >
          <template #append>
            <el-button @click="searchList">
              <el-icon>
                <Search/>
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      <el-button type="primary" @click="addUser">新建</el-button>
    </div>
    <!-- 表格 -->
    <!--
      el-table  的  data:要展示的数据数组
      el-table-column：列 prop每条数据的对应属性
        label：列标题
        scope.row:相当于一条数据
     -->
    <el-card class="users-Content">
      <el-table :data="userList" style="width: 100%" :table-layout="'fixed'">
        <el-table-column prop="username" label="姓名"/>
        <el-table-column prop="nickname" label="昵称"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="editRow(scope.row)">编辑</el-button>
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="Warning"
                icon-color="#626AEF"
                title="确定删除吗?"
                @confirm="deleteRow(scope.row)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>

          </template>
        </el-table-column>
        <!-- mg_state 状态 -->
      </el-table>
      <!-- 分页 -->
      <div class="users-page">
        <el-pagination
            v-model:current-page="queryParams.page_index"
            v-model:page-size="queryParams.page_size"
            :page-sizes="[5,10]"
            :small="true"
            layout="total, sizes, prev, pager, next, jumper"
            :background="true"
            :total="total"
            @size-change="searchList"
            @current-change="searchList"
        />
      </div>
    </el-card>

    <!-- 新增弹窗 -->
    <el-dialog v-model="dialogFormVisible" title="新建用户">
      <el-form
          ref="userForm"
          :model="formData"
          :rules="rules"
          label-width="100px"
          label-position="right"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名称"/>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="formData.password" placeholder="请输入密码"/>
        </el-form-item>
        <el-form-item label="昵称：" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="dialogFormVisible = false;formData.username='';formData.password='';formData.nickname=''">
            取消
          </el-button>
          <el-button type="primary" @click="submitForm(userForm)">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog v-model="dialogFormEVisible" title="编辑用户">
      <!--
          表单
          | email    | 邮箱     | 可以为空 |
          | mobile   | 手机号   | 可以为空 |
       -->
      <el-form
          ref="userForm2"
          :model="formData2"
          :rules="rules"
          label-width="100px"
          label-position="right"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="formData2.username" placeholder="请输入用户名称"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData2.nickname" placeholder="请输入昵称"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button>取消</el-button>
          <el-button type="primary" @click="submitEForm(userForm2)">确定</el-button>
        </div>
      </template>

    </el-dialog>
  </div>
</template>
<script>
import {toRefs, reactive, ref} from 'vue'
import {userListApi, userAddApi, userEditApi, userDeleteApi} from "@/util/request.js"
import {ElMessage} from "element-plus";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "roles",
  setup() {
    const data = reactive({
      queryParams: {
        search_name: "",
        page_size: 5,
        page_index: 1
      },

      total: 0,
      userList: [],
      dialogFormVisible: false,
      dialogFormEVisible: false,
      formData: {
        username: "",
        password: "",
        nickname: "",
      },
      formData2: {
        id:"",
        username: "",
        nickname: "",
      },
      rules: {
        username: [
          {required: true, message: '此项必填', trigger: 'blur'},
          {min: 2, max: 6, message: '长度必须3-10个字符之间', trigger: 'change'},
        ],

        password: [
          {required: true, message: "此项为必填", trigger: "blur"},
          {min: 6, max: 20, message: '长度必须6-20个字符之间', trigger: 'change'},
        ],
      },
    })
    const searchList = () => {
      userListApi(data.queryParams).then(res => {
        if (res.data) {
          data.userList = res.data.user
          data.total = res.data.total
        }
      })
    }
    const addUser = () => {
      data.dialogFormVisible = true
    }
    // 新增提交
    const submitForm = (formEl) => {
      // validate
      formEl.validate(res => {
        if (!res) {
          return
        }
        // 表单通过请求接口
        userAddApi(data.formData).then(res => {
          if (res.data) {
            // 隐藏弹窗
            data.dialogFormVisible = false
            // 清空form
            data.formData = {
              username: "",
              password: "",
              nickname: "",
            }
            // 重新更新列表
            searchList()
            ElMessage.success("新增用户成功!")
          }
        })
      })
    }
    // 修改提交
    const submitEForm = (formEl) => {
      formEl.validate(res => {
        if (!res) {
          console.log(res)
          return
        }
        // 提交修改
        userEditApi(data.formData2).then(res => {
          if (res.data) {
            data.dialogFormEVisible = false;
            searchList()
          }
        })
      })
    }
    // 数据编辑
    const editRow = row => {
      const {id, username, nickname} = row
      // 展示编辑表单
      data.dialogFormEVisible = true;
      data.formData2.username = username
      data.formData2.nickname = nickname
      data.formData2.id = id
    }
    // 删除数据
    const deleteRow = row => {
      const data = {"id": row.id}
      console.log(data)
      // eslint-disable-next-line no-unused-vars
      userDeleteApi(data).then(res => {
        searchList()
        ElMessage.success("用户删除成功")
      })
    }


    // 方法初始化
    searchList()
    const userForm = ref()
    const userForm2 = ref()
    return {
      ...toRefs(data),
      searchList,
      addUser,
      submitForm,
      submitEForm,
      userForm,
      userForm2,
      editRow,
      deleteRow
    }
  }
}
</script>
<style scoped>
.users-Content {
  margin-top: 20px;
  width: 100%;
  height: calc(100vh - 146px);
}

.users-page {
  position: absolute;
  bottom: 20px;
}

.input_box {
  width: 200px;
  margin-right: 10px;
}
</style>