<template>
  <div :class="{speedTipStyleMin:uploadFile.min,speedTipStyleMax:!uploadFile.min}" class="speedTipStyle"
       v-if="$store.state.uploadMd5!==''||uploadFile.fileInterrupt">
    <div style="width: 1em; height: 1em; position: absolute;right: 15px;cursor: pointer"  @click="changeBorder()" :title="uploadFile.min?'最大化':'最小化'">
      <i class="el-icon-s-operation" v-if="!uploadFile.min"/>
      <i class="el-icon-minus" v-else></i>
    </div>

    <div style="text-align: center;transition:all 1s;" :class="{hidden:uploadFile.min,show:!uploadFile.min}">
      <strong v-if="!uploadFile.fileInterrupt">正在上传文件:</strong>
      <strong v-else>上传中断:</strong>
      <div
        style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;width:80px;height:23px;line-height:23px;display: inline-block;background-color: #66c03a;color: white;padding:3px 6px;border-radius: .5em;position: relative;top:8px;left: 5px;cursor: pointer;"
        :title="$store.state.uploadFileName">
        <strong>{{ $store.state.uploadFileName }}</strong>
      </div>
    </div>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="parseFloat(uploadFile.percentage.toFixed(2))"
                 :status="uploadFile.tipColor"/>
    <div style="text-align: center;margin-top:5px"><strong
      style="font-size:23px;color: darkorange">{{ uploadFile.speed.toFixed(2) }}</strong> Mbps/s
    </div>
    <div style="display: flex;justify-content: center;transition:all 1s;" :class="{hiddenBottom:uploadFile.min,showBottom:!uploadFile.min}">
      <el-button v-if="uploadFile.fileInterrupt" type="warning" title="点击「上传文件」,来重新上传"
                 @click="$router.push({path:'/more',query:{path:$store.state.uploadPath}})"
                 :disabled="$route.path==='/more'">
        <strong>重新上传</strong>
      </el-button>
      <el-button type="info" title="取消上传" @click="$store.state.uploadCancel=true;uploadFile.fileInterrupt=false">
        <strong>取消上传</strong>
      </el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: "speedTip",
  data() {
    return {
      uploadFile: {
        indexMax: 0,
        tipColor: "",
        percentage: 0,
        fileInterrupt: false,
        speed: 0,
        oldDate: 0,
        min: false
      }
    }
  },
  watch: {
    "$store.state.uploadIndex": (newData, oldData) => {
      console.log(12);
      if (newData !== 0) {
        this.uploadFile.speed = (8 / (Date.now() - this.uploadFile.oldDate) * 1000);
        this.uploadFile.fileInterrupt = false;//开始上传后标识改过来
      }
      this.uploadFile.indexMax = store.state.uploadIndexMax;
      this.uploadFile.oldDate = Date.now();
      this.uploadFile.percentage = newData / this.uploadFile.indexMax * 100;
      if (this.uploadFile.percentage < 20) {
        this.uploadFile.tipColor = "exception";
      } else if (this.uploadFile.percentage < 50) {
        this.uploadFile.tipColor = "warning";
      } else if (this.uploadFile.percentage < 80) {
        this.uploadFile.tipColor = ""
      } else {
        this.uploadFile.tipColor = "success"
      }
    }
  },
  methods: {
    changeBorder() {
      this.uploadFile.min = !this.uploadFile.min;
    }
  },
  created() {
    if (sessionStorage.getItem("uploadMd5")) {
      this.$store.state.uploadIndexMax = sessionStorage.getItem("uploadIndexMax");
      this.$store.state.uploadIndex = sessionStorage.getItem("uploadIndex");
      this.$store.state.uploadFileName = sessionStorage.getItem("uploadFileName");
      this.$store.state.uploadPath = sessionStorage.getItem("uploadPath");
      this.$store.state.uploadMd5 = sessionStorage.getItem("uploadMd5");
      this.fileInterrupt = true;
    }
  }
}
</script>

<style scoped>
.speedTipStyleMax {
  width: 200px;
  height: 160px;
}

.speedTipStyle {
  position: fixed;
  top: 20px;
  right: 30px;
  z-index: 100;
  background-color: white;
  box-shadow: 0 0 10px grey;
  padding: 10px 50px;
  transition: all 1s;
  border-radius: 1em;
  overflow: hidden;
}

.speedTipStyleMin {
  width: 200px;
  height: 50px;
}

.hidden {
  opacity: 0;
  height: 1px;
  margin-bottom: 0;
}

.show {
  opacity: 1;
  height: 30px;
  margin-bottom: 20px;
}

.hiddenBottom {
  opacity: 0;
  height: 1px;
  margin-top: 3px
}

.showBottom {
  opacity: 1;
  height: 40px;
  margin-top: 10px
}
</style>
