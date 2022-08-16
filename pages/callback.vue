<template>
    <div>
        <div class="row align-items-md-stretch mb-4">
        <div class="col-md-12 mb-4">
          <div
            class="h-100 p-5 rounded-3 shadow d-flex flex-column"
            style="background-color:#087f8c"
          >
            <div class="row align-items-start">
              <div class="col-lg-11">
                <h1>
                  Loading your api key
                </h1>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
    created() {

        const parsedHash = new URLSearchParams(
            window.location.hash.substring(1) // skip the first char (#)
        );

            
        this.$store.commit('setapikey',parsedHash.get("access_token"));

        this.$router.push("/")

        this.$axios.setToken(parsedHash.get("access_token"), 'Bearer')


    }
}
</script>