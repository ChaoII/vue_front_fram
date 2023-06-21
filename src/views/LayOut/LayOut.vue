<template>


  <div class="common-layout">
    <el-container class="outer">
      <el-header class="common-header flex-float">
        <div class="flex">
          <img class="logo" src="fram.png" alt="">
          <h1 class="title">人脸识别打卡后台管理系统</h1>
        </div>
        <el-tooltip
            effect="dark"
            content="退出登录"
        >
          <el-avatar :size="46" @click="loginOut" style="cursor: pointer;background-color: dodgerblue"> {{ nickName }}</el-avatar>
        </el-tooltip>
      </el-header>
      <el-container>
        <el-aside class="common-aside" width="200px">
          <el-menu background-color="none" text-color="#fff" :router="true">
            <el-menu-item index="/index">
              <el-icon>
                <HomeFilled/>
              </el-icon>
              <span>打卡记录</span>
            </el-menu-item>
            <el-menu-item index="/face">
              <el-icon>
                <PictureFilled/>
              </el-icon>
              <span>人脸管理</span>
            </el-menu-item>

            <el-menu-item index="/user">
              <el-icon>
                <Avatar/>
              </el-icon>
              <span>账号管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main style="overflow: hidden">
          <!-- router-view -->
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>

</template>
<script>
import {useRouter} from 'vue-router'
import {useStore} from "vuex"

export default {
  name: "layout",
  setup() {
    const store = useStore()
    const router = useRouter()
    const userName = store.state.uInfo.userInfo.username
    const nickName = store.state.uInfo.userInfo.username
    const loginOut = () => {
      localStorage.removeItem("loginData")
      store.commit('setToken', {});
      router.push({
        path: "/login"
      })

    }
    return {
      loginOut,
      userName,
      nickName
    }
  }
}
</script>
<style>
.outer {
  height: 100vh;
  overflow: hidden;
}

.common-header {
  background: rgb(39, 45, 53);
}


.common-aside {
  background: rgb(48, 55, 65);
}


.logo {
  width: 60px;
}

.title {
  color: dodgerblue;
}

el-main {
  background: #efefef;
}
</style>