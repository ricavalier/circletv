<template>
  <q-page>
    <div class="container area">
      <h4 class="text-h4 q-mx-md q-mb-xs">Meus Favoritos:</h4>
      <div class="row">
        <div class="col-md-3 col-sm-4 col-xs-12 q-pa-sm" v-for="(filme, i) in listaFilmes" :key="i">
          <q-card class="my-card" @click="getDetalhes(filme.id)">
            <img :src="`https://www.themoviedb.org/t/p/w220_and_h330_face/${filme.poster_path}`">
            <div class="text-h6 tit-show">{{filme.title}}</div>
            <q-card-section class="q-pt-none">
              <div class="text-subtitle2">
                <span v-for="(genero,n) in filme.generos" :key="n"><b v-if="n !== 0"> - </b> {{genero.name}} </span>
              </div>
              Pontuação: {{filme.vote_average}}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
var CryptoJS = require('crypto-js')
export default {
  name: 'HOME',
  props: ['logado'],
  data () {
    return {
      listaFilmes: [],
      listaGeneros: [],
      listaFavoritos: [],
      poster: ''
    }
  },
  watch: {
    listaGeneros (l) {
      this.getListaFilmes()
    }
  },
  methods: {
    async getListaGeneros () {
      const url = process.env.API + 'genre/movie/list' + process.env.KEYLANG
      await this.$axios.get(url)
        .then(res => {
          this.listaGeneros = res.data.genres
        })
        .catch(err => {
          console.log(err)
        })
    },
    async getListaFilmes () {
      const listagem = []
      for (let i = 1; i <= 5; i++) {
        const url = process.env.API + 'movie/top_rated' + process.env.KEYLANG + '&page=' + i
        await this.$axios.get(url)
          .then(res => {
            const dados = res.data.results
            dados.forEach(obj => {
              const generoId = obj.genre_ids
              const generos = []
              generoId.forEach(arr => {
                generos.push(this.listaGeneros.find(arr2 => arr === arr2.id ? arr2.name : ''))
              })
              obj.generos = generos
              listagem.push(obj)
            })
          })
          .catch(err => {
            console.log(err)
            this.listaFilmes = []
          })
      }
      this.listaFavoritos.forEach(arr => {
        const idx = parseInt(arr)
        return listagem.filter(obj => {
          if (obj.id === idx) {
            this.listaFilmes.push(obj)
          }
        })
      })
    },
    getFavoritos () {
      let lista = localStorage.getItem('x-fav')
      if (lista !== null) {
        lista = CryptoJS.AES.decrypt(lista, process.env.PARAPHASE)
        lista = JSON.parse(lista.toString(CryptoJS.enc.Utf8))
        this.listaFavoritos = lista
      }
    },
    getDetalhes (id) {
      this.$router.push('detalhes/' + id)
    }
  },
  mounted () {
    this.getFavoritos()
    this.getListaGeneros()
  }
}
</script>
