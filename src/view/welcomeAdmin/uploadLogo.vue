<template>
<div class="uploadLogo">
  <el-row>
    <el-upload
      action=""
      list-type="picture-card"
      :before-upload="haveSameImg"
      :http-request="uploadImg"
      :on-success="onSuccess"
      :file-list="fileList">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}" >
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt=""
        >
        <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="setLogo(file)"
        >
          <i class="el-icon-setting"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </el-row>
</div>
</template>

<script>
import {uploadImg} from '../../api/login/performence'
import {Message} from 'element-ui'
export default {
  name: 'uploadLogo',
  data () {
    return {
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  mounted () {
    console.log('mounted')
    let imgData = JSON.parse(localStorage.getItem('imageList'))
    this.fileList = imgData.fileList
  },
  methods: {
    onSuccess (res, file, filelist) {
      console.log('onSuccess')
    },
    uploadImg (uploadParams) { // 上传图片
      let form = new FormData()
      form.append('file', uploadParams.file)
      uploadImg(form).then(res => {
        if (res.data.code === 200) {
          let tempList = this.fileList
          tempList.push({name: uploadParams.file.name, url: 'http://127.0.0.1:8081/myPhpPro/img/' + uploadParams.file.name})
          this.fileList = tempList
          let latestData = {
            hasData: true,
            fileList: this.fileList
          }
          this.$store.commit('setImageList', latestData)
        }
      }).catch(function (error) { console.log(error) })
    },
    haveSameImg (file) { // 上传文件之前的钩子函数，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name === file.name) {
          Message.warning('该图像已上传')
          return false
        }
      }
      return true
    },
    handleRemove (file) {
      // console.log(file)
      // console.log('remove function')
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name === file.name) {
          this.fileList.splice(i, 1)
          let latestData = {
            hasData: true,
            fileList: this.fileList
          }
          this.$store.commit('setImageList', latestData)
          // console.log(this.fileList)
        }
      }
    }, // 移除图片
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }, // 查看完整图片
    setLogo (file) {
      document.getElementById('logo_admin').style.backgroundImage = 'url(' + require('D:/xampp/htdocs/myPhpPro/img/' + file.name) + ')'
      document.getElementById('logo_admin').style.backgroundColor = '#007dd8'
    } // 更改系统logo
  }
}
</script>

<style scoped>
.uploadLogo  .el-row{
  margin-top: 100px;
}
/deep/.el-upload-list__item-thumbnail {
  transition: none !important;
}
/deep/.el-upload-list__item.is-ready {
  display: none;
}
</style>
