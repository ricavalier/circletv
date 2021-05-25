<template>
  <q-page class="detalhes">
    <div class="container area">
      <h4 class="text-h4 q-mx-md q-mb-xs">Detalhes: {{_props.logado}}</h4>
      <q-card class="my-card q-ma-md" flat bordered>
        <q-card-section>
          <div class="row">
            <div class="col-md-5 col-sm-12 flex flex-center">
              <img class="img-responsive" :src="`https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${detalhesFilme.poster_path}`" v-if="!!detalhesFilme.poster_path">
              <img class="img-responsive" src="~assets/circle-tv-blue.svg" v-else>
            </div>
            <div class="col-md-7 col-sm-12 q-pa-md">
              <div class="text-h5 q-mt-sm text-uppercase text-primary">{{detalhesFilme.title}} <span v-if="!!detalhesFilme.release_date">({{getAno(detalhesFilme.release_date)}})</span></div>
              <div class="text-overline q-mb-sm">{{detalhesFilme.original_title}}</div>
              <div class="text-grey">
                <p v-if="!!detalhesFilme.overview">
                  <strong>Sínopse</strong><br>
                  <span>{{detalhesFilme.overview}}</span>
                </p>
                <p v-if="!!detalhesFilme.genres">
                  <strong>Gênero</strong><br>
                  <span v-for="(genero, n) in detalhesFilme.genres" :key="n">
                    <b v-if="n > 0"> - </b> {{genero.name}}
                  </span>
                </p>
                <p v-if="!!detalhesFilme.production_companies">
                  <strong>Produção</strong><br>
                  <span v-for="(prod, n) in detalhesFilme.production_companies" :key="n">
                    <b v-if="n > 0"> - </b> {{prod.name}}
                  </span>
                </p>
                <p v-if="!!detalhesFilme.production_countries">
                  <strong>Local de Produção</strong><br>
                  <span v-for="(pais, n) in detalhesFilme.production_countries" :key="n">
                    <b v-if="n > 0"> - </b> {{pais.name}}
                  </span>
                </p>
                <p v-if="!!detalhesFilme.release_date">
                   <strong>Estreia</strong><br>
                  <span>{{getData(detalhesFilme.release_date)}} </span>
                </p>
                <p v-if="!!detalhesFilme.runtime">
                  <strong>Duração</strong><br>
                  <span>{{detalhesFilme.runtime}} minutos</span>
                </p>
                <p v-if="!!detalhesFilme.budget">
                  <strong>Orçamento</strong><br>
                  <span>US$ {{detalhesFilme.budget.toLocaleString('en-us', {minimumFractionDigits: 2})}} </span>
                </p>
                <p v-if="!!detalhesFilme.revenue">
                  <strong>Bilheteria</strong><br>
                  <span>US$ {{detalhesFilme.revenue.toLocaleString('en-us', {minimumFractionDigits: 2})}} </span>
                </p>
                <p v-if="!!detalhesFilme.spoken_languages">
                  <strong>Idiomas do Filme</strong><br>
                  <span v-for="(fala, n) in detalhesFilme.spoken_languages" :key="n">
                    <b v-if="n > 0"> - </b> {{fala.name}}
                  </span>
                </p>
                <p v-if="!!detalhesFilme.homepage">
                  <strong>Conteúdo Adulto?</strong><br>
                  <span><a class="text-grey" :href="detalhesFilme.homepage" target="_blank">{{detalhesFilme.homepage}}</a> </span>
                </p>
                <p>
                  <strong>Conteúdo Adulto?</strong><br>
                  <span>{{detalhesFilme.adult  ? 'Sim' : 'Não'}} </span>
                </p>
              </div>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions>
          <div v-if="logado">
            <q-icon class="icon-size cursor-pointer" name="favorite_border" color="primary" v-if="!favorito" @click="addFavorito()" />
            <q-icon class="icon-size cursor-pointer" name="favorite" color="primary" v-if="favorito" @click="removeFavorito()" />
          </div>
          <div class="alinha-icones cursor-pointer">
            <q-icon class="icon-size q-ml-md" name="how_to_vote" color="primary" />
            <strong class="text-primary q-ml-sm txt-vote">{{detalhesFilme.vote_average}}</strong>
            <q-icon class="icon-size q-ml-md" name="how_to_reg" color="primary" />
            <strong class="text-primary q-ml-sm txt-vote">{{detalhesFilme.vote_count}}</strong>
            <q-btn class="q-ml-md" flat color="primary" label="Votar" @click="showVotar()" v-if="logado" />
          </div>
          <q-input class="q-ml-md" color="primary" @keyup="valVoto(votar.score)" @blur="valVoto(votar.score)" outlined dense v-model="votar.score" type="number" label="Vote (entre 0 e 10)" v-if="this.votar.status">
            <template v-slot:append>
              <q-btn color="primary" dense flat icon="send" @click="votacao(votar.score)" />
            </template>
          </q-input>
        </q-card-actions>
      </q-card>
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
      detalhesFilme: [],
      listaGeneros: [],
      pagina: '',
      chkLogado: this._props.logado,
      favorito: false,
      votar: {
        status: false,
        score: 0
      }
    }
  },
  watch: {
    listaGeneros (l) {
      this.getListaFilmes()
    }
  },
  methods: {
    getData (d) {
      const data = d.split('-').reverse()
      return `${data[0]}/${data[1]}/${data[2]}`
    },
    getAno (a) {
      const ano = a.split('-')
      return ano[0]
    },
    getDetalhes (id) {
      const url = process.env.API + 'movie/' + id + process.env.KEYLANG
      this.$axios.get(url)
        .then(res => {
          this.detalhesFilme = res.data
        })
        .catch(err => {
          console.log(err)
          this.$router.push('/home')
        })
    },
    addFavorito () {
      let lista = localStorage.getItem('x-fav')
      if (lista !== null) {
        lista = CryptoJS.AES.decrypt(lista, process.env.PARAPHASE)
        lista = JSON.parse(lista.toString(CryptoJS.enc.Utf8))
      } else {
        lista = []
      }
      lista.push(this.pagina)
      lista = CryptoJS.AES.encrypt(JSON.stringify(lista), process.env.PARAPHASE).toString()
      localStorage.setItem('x-fav', lista)
      this.chkFavorito()
    },
    removeFavorito () {
      let lista = localStorage.getItem('x-fav')
      if (lista !== null) {
        lista = CryptoJS.AES.decrypt(lista, process.env.PARAPHASE)
        lista = JSON.parse(lista.toString(CryptoJS.enc.Utf8))
      } else {
        lista = []
      }
      lista = lista.filter(obj => obj !== this.pagina)
      lista = CryptoJS.AES.encrypt(JSON.stringify(lista), process.env.PARAPHASE).toString()
      localStorage.setItem('x-fav', lista)
      this.chkFavorito()
    },
    chkFavorito () {
      let lista = localStorage.getItem('x-fav')
      if (lista !== null) {
        lista = CryptoJS.AES.decrypt(lista, process.env.PARAPHASE)
        lista = JSON.parse(lista.toString(CryptoJS.enc.Utf8))
        const chk = lista.filter(obj => obj === this.pagina)
        this.favorito = chk.length > 0
      } else {
        this.favorito = false
      }
    },
    votacao (n) {
      const media = this.detalhesFilme.vote_average
      const votos = this.detalhesFilme.vote_count
      const atual = media * votos
      const nota = parseFloat(n)
      const total = (atual + nota) / (votos + 1)
      this.detalhesFilme.vote_average = parseFloat(total.toFixed(1))
      this.detalhesFilme.vote_count = parseInt(votos + 1)
      this.votar = {
        score: 0,
        status: false
      }
    },
    showVotar () {
      this.votar.status = !this.votar.status
    },
    valVoto (v) {
      v = v > 10 ? 10 : v
      v = v < 0 ? 0 : v
      this.votar.score = v
    }
  },
  mounted () {
    this.pagina = this.$route.params.id
    this.getDetalhes(this.pagina)
    this.chkFavorito()
  }
}
</script>
<style lang="scss" scoped>
.img-responsive {
    max-width: 100%;
    height: auto;
    display: block;
}
</style>
