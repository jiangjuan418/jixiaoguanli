export default {
  state: {
    fileList: [],
    hasData: false
  },
  mutations: {
    setImageList (state, latestData) {
      state.hasData = true
      state.fileList.push(latestData.fileList)
      // sessionStorage.setItem('imageList', JSON.stringify(latestData))
      localStorage.setItem('imageList', JSON.stringify(latestData))
      // sessionStorage仅在当前会话下有效，关闭页面或浏览器后被清除。
      // localStorage生命周期是永久，这意味着除非用户显示在浏览器提供的UI上清除localStorage信息，否则这些信息将永远存在。
      // 二者存放数据大小为一般为5MB,而且它仅在客户端（即浏览器）中保存，不参与和服务器的通信。
    }
  }
}
