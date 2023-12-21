<script>
import ContentComponent from './components/layout/ContentComponent.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    ContentComponent,
  },
  mounted(){
    console.log(localStorage);

    if(!localStorage.token){
      localStorage.setItem('token', "");
      localStorage.setItem('destroyTime', "");
    }
    else{
      this.userToken = localStorage.token
    }
    
  },
  data(){
    return {
      username: "",
      password: "",
      userToken: ""
    }
  },
  methods: {
    postLogin(){
        const params = {
          username: this.username,
          password: this.password
        }
        axios.post('/api/login', params)
            .then( res => {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('destroyTime', res.data.destroyTime);
                this.userToken = localStorage.token;
                console.log(res.data.message);
            })
            .catch( err => {
                console.log(err);
            })
    }
  },
  computed: {
    disabledControl(){
      return !(this.username != "" && this.password != "")
    },
    disabledClass(){
      let disabled = ""
      if (!(this.username != "" && this.password != "")){
        disabled = 'disabled-button'
      }
      return disabled
    }
  }
}
</script>

<template>
  <div>
    <div class="login-page" v-if="userToken.length != 64">
        
        <img src="./assets/images/logo.png">
        <div class="login-card">
            <span class="m-2 row" style="font-size: 1.5em;">Welcome to image processor!</span>
            <input type="text" ref="username" class="login-input mx-auto m-3 row" placeholder="Username" v-model="username">
            <input type="password" ref="password" class="login-input mx-auto m-3 row" placeholder="Password" v-model="password">
            <button class="login-button mx-auto m-3 row" :class="disabledClass" @click="postLogin" :disabled="disabledControl">
                Login
            </button>
        </div>

    </div>
  
    <ContentComponent v-else/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.login-page {
    font-family: 'Times New Roman', Times, serif;
    font-weight: bold;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to right, lightgray, lightblue);
}
.login-card {
    background: whitesmoke;
    border: thin solid gray;
    filter: drop-shadow(0 0 50px gray);
    padding: 4rem;
    border-radius: 25px;
    margin-left: 15%;
}

.login-input{
  border: 0;
  outline: 0;
  padding: .33em;
  filter: drop-shadow(0 0 .33em rgb(170, 170, 170));
}
.login-input:focus{
  filter: drop-shadow(0 0 .66em rgb(170, 170, 170));
  outline: thin solid gray;
}

.login-button{
  background-color: rgb(58, 140, 181); 
  color: white; 
  border: 0; 
  outline: 0;
  padding-left: .66em;
  padding-right: .66em;
  padding-top: .33em;
  padding-bottom: .33em;
  border-radius: 30px;
}
.login-button:active{
  scale: 1.025;
  filter: drop-shadow(0 0 5px);
}
.disabled-button{
  filter: brightness(120%) !important;
  cursor: default !important;
  pointer-events: none;
}
</style>
