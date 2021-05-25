<template>
<div>
  <div class="q-pa-md" v-if="menu">
    <q-list class="menu" bordered separator>
      <q-item clickable v-ripple>
        <q-item-section @click="abrePagina('favoritos')">
          <q-item-label><q-icon class="q-mr-sm icon-size" name="favorite" />Meus Favoritos</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section @click="sairLogin()">
          <q-item-label><q-icon class="q-mr-sm icon-size" name="logout" />Sair</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <div class="q-pa-md" v-else>
    <h5>Login</h5>
    <p>
      <q-input color="primary" v-model="login.user" label="Usuário" type="text">
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>
    </p>
    <p>
      <q-input color="primary" v-model="login.senha" label="Senha" :type="toggleSenha ? 'password' : 'text'">
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <q-icon class="cursor-pointer" :name="toggleSenha ? 'visibility' : 'visibility_off'" @click="toggleSenha = !toggleSenha" />
        </template>
      </q-input>
    </p>
    <p>
      <q-btn icon="check" color="primary" class="full-width" label="Acessar" @click="getLogin()" />
    </p>
    <q-banner inline-actions rounded :class="login.msg.status === 1 ? 'bg-positive text-white' : 'bg-warning text-white'" v-if="login.msg.status > 0">
      {{login.msg.texto}}
      <template v-slot:action>
        <q-btn flat icon="close" @click="fechaMsg()" />
      </template>
    </q-banner>
  </div>
</div>
</template>
<script>
var CryptoJS = require('crypto-js')
export default {
  name: 'Login',
  data () {
    return {
      toggleSenha: true,
      login: {
        user: '',
        senha: '',
        msg: {
          status: 0,
          texto: ''
        }
      },
      menu: false,
      valida: {
        user: 'guest',
        senha: 'guest'
      }
    }
  },
  methods: {
    getLogin () {
      this.login.user === this.valida.user && this.login.senha === this.valida.senha ? this.respLogin(true) : this.respLogin(false)
    },
    formatData (dat) {
      return dat < 10 ? '0' + dat : dat
    },
    respLogin (stt) {
      if (stt) {
        this.procLogin()
        this.login.msg = {
          status: 1,
          texto: 'Login efetuado com sucesso'
        }
      } else {
        this.login.msg = {
          status: 2,
          texto: 'Erro ao fazer o login'
        }
      }
      setTimeout(() => {
        this.fechaMsg()
        this.chkLogin()
      }, 2000)
    },
    procLogin () {
      let data = new Date()
      data = `${data.getFullYear()}-${this.formatData(data.getMonth())}-${this.formatData(data.getDate())} ${this.formatData(data.getHours())}:${this.formatData(data.getMinutes())}:${this.formatData(data.getSeconds())}`
      const token = {
        user: this.login.user,
        time: data,
        type: 'usuario'
      }

      const crp = CryptoJS.AES.encrypt(JSON.stringify(token), process.env.PARAPHASE).toString()
      localStorage.setItem('x-tk-set', crp)
      this.$emit('set-login')
    },
    fechaMsg () {
      this.login.msg = {
        status: 0,
        texto: ''
      }
    },
    chkLogin () {
      const gtk = localStorage.getItem('x-tk-set')
      this.menu = gtk !== null
    },
    sairLogin () {
      localStorage.removeItem('x-tk-set')
      this.chkLogin()
      this.$emit('set-login')
    },
    abrePagina (link) {
      this.$router.push(`/${link}`)
    }
  },
  mounted () {
    this.chkLogin()
  }
}
</script>
