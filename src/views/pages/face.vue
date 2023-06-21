<template>
  <div class="home-container">
    <div class="flex">
      <div class="face-input">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入姓名"
            class="input-with-select">
          <template #append>
            <el-button @click="searchHandler">
              <el-icon>
                <Search/>
              </el-icon>
            </el-button>
          </template>
        </el-input>


      </div>
      <el-button type="primary" @click="openAddFaceDig">新增</el-button>
      <el-button type="danger" @click="restartHandler">重启</el-button>
    </div>

    <el-card class="picContent">
      <div style="overflow-y: scroll;height: calc(100vh - 200px)">
        <template v-for="(v,k) in staffs" :key="k">
          <el-card class="face-pic" shadow="hover" body-style="padding:0px">
            <img class="image" :src="host+v.pic_url">
            <el-row style="margin: 5px">
              <el-col :span="16">
                <div style="">
                  <div class="time">姓名:{{ v.name }}</div>
                  <div class="time">工号:{{ v.id }}</div>
                  <time class="time">日期:{{ v.update_time.slice(0, 10) }}</time>
                </div>
              </el-col>
              <el-col span="18">
                <div style="width: 100%;height: 100%;background-color: #42b983">
                  <el-popconfirm
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      :icon="Warning"
                      icon-color="#626AEF"
                      title="确定删除吗?"
                      @confirm="deleteFace(v.id)"
                  >
                    <template #reference>
                      <el-button style="position: absolute; bottom: 0px;right: 0px" type="danger" :icon="Delete"/>
                    </template>
                  </el-popconfirm>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </template>
      </div>

      <div class="face-page">
        <el-pagination
            v-model:currentPage="queryParams.page_index"
            v-model:page-size="queryParams.page_size"
            :page-sizes="[5,10]"
            small="small"
            :background="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="searchList"
            @current-change="searchList"
        />
      </div>
    </el-card>

    <el-dialog v-model="dialogFormVisible" title="新增人脸" width="550px">
      <div class="flex">
        <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            @change="beforeUpload"
            :auto-upload="false"
        >
          <img v-if="faceInfo.imageUrl" :src="faceInfo.imageUrl" class="avatar"/>
          <el-icon v-else class="avatar-uploader-icon">
            <Plus/>
          </el-icon>
        </el-upload>


        <div class="faceInfo">
          <el-form
              :label-position="'top'"
              label-width="100px"
              :model="faceInfo"
              style="width: 300px;"
              disabled="true"
          >
            <el-form-item label="姓名：">
              <el-input v-model="faceInfo.name"/>
            </el-form-item>
            <el-form-item label="工号：">
              <el-input v-model="faceInfo.staff_id"/>
            </el-form-item>
            <el-form-item label="日期:">
              <el-input v-model="faceInfo.update_time"/>
            </el-form-item>
          </el-form>
        </div>
      </div>


      <template #footer>
        <div class="">
          <el-button
              @click="dialogFormVisible = false;faceInfo.update_time='';faceInfo.name='',faceInfo.staff_id='';faceInfo.imageUrl=''">
            取消
          </el-button>
          <el-button type="primary" @click="submitAdd">确定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import {computed, onMounted, reactive, toRefs, ref} from 'vue';
import {useStore} from 'vuex';
import {formatAxis, formatDate} from "@/util/utils"
import {faceListApi, deleteFaceApi, restartApi} from "@/util/request";
import {host} from "@/util/service"
import {Delete, Warning} from '@element-plus/icons-vue'
import axios from "axios";
import {ElMessage} from "element-plus";
import store from "@/store";


export default {
  name: 'home',
  setup() {
    const store = useStore();
    const deleteRef = ref()
    // table高度
    const currentDate = ref(new Date())
    const data = reactive({
      queryParams: {
        name: "",
        page_size: 10,
        page_index: 1
      },
      faceInfo: {
        faceFile: "",
        name: "",
        staff_id: "",
        update_time: "",
        imageUrl: ""
      },
      staffs: [],
      total: "",
      host,
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    })


    const restartHandler = () => {
      restartApi().then(
          res => {
            ElMessage.success("重启成功！")
          }
      )
    }

    const searchHandler = () => {
      searchList()
    }
    const searchList = () => {
      faceListApi(data.queryParams).then(res => {
        if (res.data) {
          data.staffs = res.data.staffList
          data.total = res.data.total
        }
      })
    }
    const openAddFaceDig = () => {
      data.dialogFormVisible = true
    }
    const submitAdd = () => {
      console.log(data.faceInfo.faceFile)
      let formData = new FormData()
      formData.append('file', data.faceInfo.faceFile)
      const url = host + "/api/attend/addFaceLibs"
      console.log(url)
      axios({
        method: "put",
        url: url,
        headers: {"Content-Type": "multipart/form-data", "token": store.state.uInfo.userInfo.token},
        data: formData

      }).then(res => {
        console.log(res.data)
        if (res.data.code !== 0) {
          ElMessage.error(res.data.msg || "服务器出错")
          // 请求出错
        } else {
          data.dialogFormVisible = false
          data.faceInfo = {
            faceFile: "",
            name: "",
            staff_id: "",
            update_time: "",
            imageUrl: ""
          }
          searchList()
          ElMessage.success("新增人脸成功！")
        }
      })
    }
    const deleteFace = (staff_id) => {

      deleteFaceApi({"staff_id": staff_id}).then(
          res => {
            searchList()
            ElMessage.success("人脸删除成功！")
          }
      )

    }
    searchList()
    // 当前时间提示语
    const currentTime = computed(() => {
      return formatAxis(new Date());
    });

    const beforeUpload = (rawFile) => {
      data.faceInfo.faceFile = rawFile.raw
      data.faceInfo.imageUrl = URL.createObjectURL(rawFile.raw)
      data.faceInfo.staff_id = rawFile.raw.name.split("_")[0]
      data.faceInfo.name = rawFile.raw.name.split("_")[1].split(".")[0]
      data.faceInfo.update_time = formatDate(new Date(), "YYYY-mm-dd HH:MM:SS")

    }


    onMounted(() => {
      // // 设置表格初始高度为innerHeight-offsetTop-表格底部与浏览器底部距离85
      // tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 200;
      // // 监听浏览器高度变化
      // window.onresize = () => {
      //   tableHeight.value = window.innerHeight - tableRef.value.$el.offsetTop - 200;
      // };
    });

    return {
      currentTime,
      Delete,
      Warning,
      openAddFaceDig,
      restartHandler,
      submitAdd,
      searchList,
      searchHandler,
      currentDate,
      beforeUpload,
      deleteRef,
      deleteFace,
      ...toRefs(data),
    };
  }
}
</script>

<style>

.picContent {
  margin-top: 20px;
  width: 100%;
  height: calc(100vh - 146px);
}

.avatar-uploader .avatar {
  width: 178px;
  height: 240px;
  display: block;
}

.avatar-uploader-icon {
  width: 178px;
  height: 240px;

}


.faceInfo {
  font-size: 18px;
  color: gray;
  margin-left: 30px;

}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}


.face-button {
  padding-right: 10px;
  float: right;
}

.face-input {
  width: 200px;
  padding-right: 10px;
  float: right;
}


.face-pic {
  position: relative;
  float: left;
  width: 180px;
  height: 320px;
  margin: 2px;
}


.face-page {
  /*bottom: 20px;*/
  /*position: absolute;*/
}

.time {
  font-size: 12px;
  color: #999;
}


.image {
  height: 252px;
  width: 180px;
  display: block;
}

</style>
