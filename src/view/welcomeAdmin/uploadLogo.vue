<template>
<div class="uploadLogo">
<!--  <el-row class="title">更改系统logo</el-row>-->
  <el-row>
    <el-upload
      class="upload"
      action=""
      :http-request="uploadImg"
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </el-row>
</div>
</template>

<script>
import {uploadImg} from '../../api/login/performence'
export default {
  name: 'uploadLogo',
  data () {
    return {
      fileList: []
    }
  },
  mounted () {
  },
  methods: {
    uploadImg (uploadParams) {
      let form = new FormData()
      form.append('file', uploadParams.file)
      uploadImg(form).then(res => { // 将logo图像上传到后台，然后将此logo设置为导航栏系统logo
        if (res.data.code === 200) {
          document.getElementById('logo_admin').style.backgroundImage = 'url(' + require('../../../static/' + uploadParams.file.name) + ')'
          document.getElementById('logo_admin').style.backgroundColor = '#007dd8'
        }
      }).catch(function (error) { console.log(error) })
    }
  }
}
</script>

<style scoped>
.uploadLogo  .el-row{
  margin-top: 10px;
}
.uploadLogo .title{
  font-size: large;
  font-weight: bold;
}
</style>
