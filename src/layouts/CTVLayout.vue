<template>
  <q-layout view="hHh lpR lfr">

    <q-header elevated class="bg-header text-white" height-hint="98">
      <q-toolbar>
        <!-- <q-btn dense flat round icon="menu" @click="left = !left" /> -->

        <q-toolbar-title @click="toHome()" class="cursor-pointer">
          <q-avatar>
            <img src="~assets/circle-tv-grey.svg">
          </q-avatar>
          CIRCLE TV
        </q-toolbar-title>
        <q-btn dense flat round icon="chevron_left" @click="goBack()" />
        <q-btn dense flat icon="person" @click="right = !right" v-if="usuario" :label="usuario" />
        <q-btn dense flat round icon="person_off" @click.native="right = !right" v-else />
      </q-toolbar>

      <!-- <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs> -->
    </q-header>

    <q-drawer v-model="left" side="left" overlay bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer v-model="right" side="right" overlay bordered>
      <login @set-login="chkLogin"></login>
    </q-drawer>

    <q-page-container>
      <router-view :logado="usuario" />
    </q-page-container>

    <q-footer bordered class="bg-grey-8 text-white">
      <div class="container area text-white">
        <div class="row">
          <div class="col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <img class="img-responsive logo-footer" src="~assets/circle-tv-white.svg">
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <h6 class="text-uppercase q-my-xs">Desenvolvimento:</h6>
            <p>Página desenvolvida por <br><a href="http://www.ricavalier.com.br/" target="_blank">Ricardo da Cunha Cavalier</a></p>
          </div>
          <div class="col-md-4 col-sm-6 col-xs-12 q-pa-sm">
            <h6 class="text-uppercase q-my-xs">Contribuição:</h6>
            <a href="https://www.themoviedb.org/" target="_blank"> The Movie DB</a><br>
            <a href="https://quasar.dev/" target="_blank"> Quasar Framework</a>
          </div>
        </div>
      </div>
    </q-footer>

  </q-layout>
</template>

<script>
import Login from '../components/Login.vue'
var CryptoJS = require('crypto-js')
// import Login from 'src/pages/Login.vue'
export default {
  components: { login: Login },
  data () {
    return {
      left: false,
      right: false,
      usuario: ''
    }
  },
  watch: {
    usuario (u) {

    }
  },
  methods: {
    toHome () {
      this.$router.push('/home')
    },
    goBack () {
      this.$router.go(-1)
    },
    chkLogin () {
      let gtk = localStorage.getItem('x-tk-set')
      console.log(gtk)
      if (gtk) {
        gtk = CryptoJS.AES.decrypt(gtk, process.env.PARAPHASE)
        gtk = JSON.parse(gtk.toString(CryptoJS.enc.Utf8))
        console.log(gtk)
        this.usuario = gtk ? gtk.user : ''
      } else {
        this.usuario = ''
      }
    }
  },
  mounted () {
    this.chkLogin()
  }
}
</script>

<style scoped>
.bg-header {
  background: #182864;
  background: -moz-linear-gradient(-45deg,  #182864 0%, #2e57a5 100%);
  background: -webkit-linear-gradient(-45deg,  #182864 0%,#2e57a5 100%);
  background: linear-gradient(135deg,  #182864 0%,#2e57a5 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#182864', endColorstr='#2e57a5',GradientType=1 );
}
</style>