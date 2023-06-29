<template>
  <div class="home-container">
    <div class="flex">
      <div class="index-picker">
        <el-date-picker
            v-model="timeRange"
            type="datetimerange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            range-separator="~"
            :default-time="timeRange"
            format="YYYY/MM/DD hh:mm:ss"
            value-format="YYYY-MM-DD hh:mm:ss"
        />
      </div>
      <div class="index-input">
        <el-input v-model="queryParams.name" type="text" placeholder="请输入姓名"></el-input>
      </div>
      <dic class="index-button">
        <el-button type="primary" @click="searchHandler">搜索</el-button>
      </dic>
    </div>

    <el-card shadow="hover" header="打卡记录" class="home-attend-info">
      <el-table class="table" :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" width="80px"/>
        <el-table-column prop="uid" label="工号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="attend_time" label="打卡时间"></el-table-column>
        <el-table-column prop="pic_url" label="图片">
          <template #default="scope">
              <el-image
                  style="width: 60px; height: 100px;"
                  :src="host+'/'+scope.row.pic_url"
                  :zoom-rate="1.2"
                  :preview-src-list="[host+'/'+scope.row.pic_url]"
                  :initial-index="0"
                  fit="scale"
              />
          </template>
        </el-table-column>
      </el-table>
      <div class="index-page">
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
  </div>
</template>
<script>
import {computed, onMounted, reactive, toRefs, ref} from 'vue';
import {useStore} from 'vuex';
import {formatAxis} from "@/util/utils"
import {attendInfoListApi} from "@/util/request";
import {host} from "@/util/service"
import store from "@/store";

export default {
  name: 'home',
  setup() {
    const store = useStore();
    const date = new Date();
    // table高度
    const data = reactive({
      queryParams: {
        start_time: "",
        end_time: "",
        name: "",
        page_size: 5,
        page_index: 1
      },
      tableData: [],
      timeRange: [
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0, 0),
        new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23 + 8, 59, 59)
      ],
      total: "",
      height: ""
    })


    const searchHandler = () => {
      searchList()
    }
    const searchList = () => {
      data.queryParams.start_time = data.timeRange[0]
      data.queryParams.end_time = data.timeRange[1]
      const uInfo = store.state.uInfo.userInfo
      console.log(uInfo)
      attendInfoListApi(data.queryParams).then(res => {
        if (res.data) {
          data.tableData = res.data.attendList
          data.total = res.data.total
        }
      })
    }

    searchList()
    // 当前时间提示语
    const currentTime = computed(() => {
      return formatAxis(new Date());
    });

    return {
      currentTime,
      searchList,
      searchHandler,
      host,
      ...toRefs(data),
    };
  }
}
</script>

<style>

.index-picker {
  width: 420px;
  padding-right: 10px;
  float: right;
}

.index-input {
  width: 200px;
  padding-right: 10px;
  float: right;
}

.index-button {
  padding-right: 10px;
  float: right;
}

.home-attend-info {
  margin-top: 20px;
  width: 100%;
  height: calc(100vh - 146px);
}

.index-page {
  bottom: 20px;
  position: absolute;
}

.image {
  width: 40px;
  height: 60px;
}

</style>
