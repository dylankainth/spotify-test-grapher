<template>
  <div>
    <div>
      <div v-if="playlist" class="row align-items-md-stretch mb-4">
        <div class="col-md-12 mb-4">
          <div
            class="h-100 p-5 rounded-3 shadow d-flex flex-column secondarystyledcard"
          >
            <div class="row align-items-start">
              <div class="col-lg-11">
                <h1>{{ playlist.name }}</h1>
                <h1>{{ playlist.tracks.total }}</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row align-items-md-stretch mb-4">
        <div class="col-md-12 mb-4">
          <div
            class="h-100 p-5 rounded-3 shadow d-flex flex-column secondarystyledcard"
          >
            <canvas id="myChart" width="400" height="400" ref="myDiv"></canvas>
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
      songs: {},
      playlist: null,
      ctx: null,
      chart: null,
    }
  },
  methods: {
    getdata() {
      for (let playlist in this.$store.state.playlists) {
        if (this.$store.state.playlists[playlist].id == this.$route.params.id) {
          this.playlist = this.$store.state.playlists[playlist]
          break
        }
      }

      const sets = parseInt((this.playlist.tracks.total + 4) / 5)

      for (let i = 0; i < sets; i++) {
        this.$axios
          .$get(
            'https://api.spotify.com/v1/playlists/' +
              this.$route.params.id +
              '/tracks?fields=items(track(name%2Cid%2Cartists))&limit=5&offset=' +
              i * 5
          )
          .then((response) => {
            for (let k = 0; k < response.items.length; k++) {
              console.log(i, i * 5, k, i * 5 + k, response.items[k].track.name)

              this.songs[response.items[k].track.id] = response.items[k].track

              this.songs[response.items[k].track.id].number = i * 5 + k
            }

            this.$axios
              .$get(
                'https://api.spotify.com/v1/audio-features?ids=' +
                  Object.keys(this.songs).join(',')
              )
              .then((response) => {
                for (let j = 0; j < response.audio_features.length; j++) {
                  this.songs[response.audio_features[j].id].audiofeatures =
                    response.audio_features[j]
                }
              })
          })
      }
    },
  },
  mounted() {

    this.getdata()

    var chartdata = Object.values(this.songs)
    console.log(chartdata)

    this.ctx = document.getElementById('myChart').getContext('2d')
    this.chart = new Chart(this.ctx, {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Scatter Dataset',
            data: chartdata,
            backgroundColor: 'rgb(256,256,256)',
          },
        ],
      },
      options: {
        parsing: {
          xAxisKey: 'number',
          yAxisKey: 'audiofeatures.energy',
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
        },
      },
    })
  },
}
</script>

<style scoped>
.secondarystyledcard {
  background-color: #087f8c;
  animation: fadeinout 1s linear forwards;
}
</style>
