<template>
  <div>

    <div  v-if="!this.$store.state.api_key" class="row align-items-md-stretch mb-4">
        <div class="col-md-12 mb-4">
          <div
            class="h-100 p-5 rounded-3 shadow d-flex flex-column secondarystyledcard"
          >
            <div class="row align-items-start">
              <div class="col-lg-11">
                <button @click="openurl" type="button" class="btn" style="background-color:#095256">Sign into Spotify</button>
              </div>
            </div>
          </div>
        </div>
      </div>

       <div class="spinner-border text-light" v-if="this.$store.state.api_key && !this.$store.state.playlists" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>

    
    <div v-if="this.$store.state.api_key">
      <div v-if="userdata" class="row align-items-md-stretch mb-4">
        <div class="col-md-12 mb-4">
          <div
            class="h-100 p-5 secondarystyledcard rounded-3 shadow d-flex flex-column"
          >
            <div class="row align-items-start">
              <div class="col-lg-11">
                <h1>
                  Good Afternoon,
                  {{ userdata.display_name }} 
                </h1>
              </div>
            
            </div>
          </div>
        </div>
      </div>

      <div v-if="this.$store.state.playlists">
        <div class="row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-4">
          <div
            class="col"
            v-for="playlist in this.$store.state.playlists"
            v-bind:key="playlist.id"
          >
            <Nuxt-Link
              :to="'/playlists/' + playlist.id"
              style="text-decoration: none"
            >
              <div
                class="card secondarystyledcard lg-3 rounded-3 shadow border-0"
                style="max-width: 540px"
              >
                <div class="row g-0">
                  <div class="col-md-4 d-none d-sm-block">
                    <img
                      class="img-fluid rounded-start playlistimage"
                      :src="playlist.images[0].url"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5 class="card-title">{{ playlist.name }}</h5>
                      <p class="card-text">
                        <small v-if="playlist.description"
                          >{{ playlist.description.substring(0, 30) }}...</small
                        >
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Nuxt-Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: null,
      hour:null,
      userdata:null
    }
  },
  methods: {
    openurl() {
      window.location = this.url
    },
    async getdata() {
      
      const me = await this.$axios.$get('https://api.spotify.com/v1/me')
      // const meplayer = await this.$axios.$get('https://api.spotify.com/v1/me/player')
      // const merecentlyplayed = await this.$axios.$get('https://api.spotify.com/v1/me/player/recently-played?limit=25')
      // const mefollowing = await this.$axios.$get('https://api.spotify.com/v1/me/following?type=artist')

      // const metoplongartists = await this.$axios.$get('https://api.spotify.com/v1/me/top/artists?time_range=long_term?limit=25')
      // const metopmediumartists = await this.$axios.$get('https://api.spotify.com/v1/me/top/artists?time_range=medium_term?limit=25')
      // const metopshortartists = await this.$axios.$get('https://api.spotify.com/v1/me/top/artists?time_range=short_term?limit=25')

      // const metoplongtracks = await this.$axios.$get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term?limit=25')
      // const metopmediumtracks = await this.$axios.$get('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term?limit=25')
      // const metopshorttracks = await this.$axios.$get('https://api.spotify.com/v1/me/top/tracks?time_range=short_term?limit=25')

      if (!this.$store.state.playlists) {
        var playlists = []

        const numberofplaylists = await this.$axios.$get(
          'https://api.spotify.com/v1/me/playlists?limit=0&offset=0'
        )

        const sets = parseInt((numberofplaylists.total + 4) / 5)

        for (let i = 0; i < sets; i++) {
          var playlistset = await this.$axios.$get(
            'https://api.spotify.com/v1/me/playlists?limit=5&offset=' + i * 5
          )
          console.log(playlistset)
          playlists = playlists.concat(playlistset.items)
        }

        this.$store.commit('setplaylists',playlists);
        this.$store.commit('setuserdata',me);
      }
    },
  },
  mounted() {
    var today = new Date()
    var curHr = today.getHours()

    if (!this.$store.state.api_key) {
      var client_id = '866e2cf7fae84f3798bea822648fbc2c'
      var redirect_uri = 'https://spotify-test-grapher.netlify.app/callback/'

      var state = Math.random().toString(36).slice(2, 18)

      /* localStorage.setItem('spotistate', state)*/
      // var scope = 'user-read-private user-read-email user-read-playback-state user-follow-read user-read-recently-played playlist-read-private'

      var scope = 'user-read-private user-read-email playlist-read-private'
      this.url = 'https://accounts.spotify.com/authorize'
      this.url += '?response_type=token'
      this.url += '&client_id=' + encodeURIComponent(client_id)
      this.url += '&scope=' + encodeURIComponent(scope)
      this.url += '&redirect_uri=' + encodeURIComponent(redirect_uri)
      this.url += '&state=' + encodeURIComponent(state)
    } else if (this.$store.state.api_key) {
      this.getdata()
    }
  },
}
</script>
<style scoped>
.secondarystyledcard {
  background-color: #087f8c;
  animation: fadeinout 1s linear forwards;
}
.playlistimage {
  aspect-ratio: 1/1;
  width: 100%;
}

@-webkit-keyframes fadeinout {

    0%{
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes fadeinout {

    0%{
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
</style>
