<template>

  <iframe :src="homeUrl" v-loading.fullscreen.lock="fullscreenLoading" id="foo" scrolling="yes" frameborder="0" :width="width" :height="height"></iframe>
</template>

<script>
import { config } from "../../config/index";
export default {
  name: "home",
  data() {
    return {
      homeUrl: config.default_home_url,
      fullscreenLoading: false,
      width: document.documentElement.clientWidth -18,
      height: document.documentElement.clientHeight -110
    };
  },
  created(){
    this.initHomeIndex()
  },
  methods: {
    initHomeIndex() {
      let homeUrl = window.localStorage["homeUrl"];
      if (homeUrl) {
        this.homeUrl = window.localStorage["homeUrl"];
      }
    }
  }
};
</script>
