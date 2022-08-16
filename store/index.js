export const state = () => ({
  api_key: null,
  playlists: null,
  userdata: null,
})

export const mutations = {
  setapikey(state, key) {
    state.api_key = key
  },
  setplaylists(state, playlists) {
    state.playlists = playlists
  },
  setuserdata(state, userdata) {
    state.userdata = userdata
  },
}

