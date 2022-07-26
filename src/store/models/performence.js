export default {
  state: {
    selectedSeason: '',
    hasDate: false
  },
  mutations: {
    setSelectedSeason (state, latestData) {
      state.hasData = true
      state.selectedSeason = latestData.selectedSeason
    }
  }
}
