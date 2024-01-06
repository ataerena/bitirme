<script>
import ContentComponent from './components/layout/ContentComponent.vue';
import RegisterPage from './components/pages/RegisterPage.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    ContentComponent,
    RegisterPage,
  },
  mounted(){

    if(!sessionStorage.token){
      sessionStorage.setItem('token', "");
      sessionStorage.setItem('destroyTime', "");
    }
    else{
      this.userToken = sessionStorage.token
    }

    if (!sessionStorage.register) {
      sessionStorage.setItem('register', false);
    } 
    else {
      this.register = JSON.parse(sessionStorage.getItem('register'));
    }
    
  },
  data(){
    return {
      username: "",
      password: "",
      showPassword: false,
      inputType: "password",
      userToken: "",
      register: false,
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
            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('destroyTime', res.data.destroyTime);
            sessionStorage.setItem('username', this.username);
            this.userToken = sessionStorage.token;

            this.$toast.open({
              message: res.data.message,
              type: "success",
              duration: 5000,
              dismissible: true,
            });
          })
          .catch( ({response}) => {
            this.$toast.open({
              message: response.data.message,
              type: "error",
              duration: 5000,
              dismissible: true,
            });
          })
    },
    goToRegister(){
      sessionStorage.setItem('register', true);
      this.register = true;
    }
  },
  computed: {
    disabledControl(){
      return !(this.username != "" && this.password != "" && this.username[0] != " " && !this.password.includes(" "))
    },
    disabledClass(){
      let disabled = ""
      if (!(this.username != "" && this.password != "" && this.username[0] != " " && !this.password.includes(" "))){
        disabled = 'disabled-button'
      }
      return disabled
    },
  },
  watch: {
    showPassword: {
      handler(newVal){
        if(newVal == true){
          this.inputType = 'text';
        }
        else{
          this.inputType = 'password'
        }
      },
      immediate: true
    }
  }
}
</script>

<template>
  <div>
    <div class="login-page" v-if="userToken.length != 64 && register == false">
        
        <img src="./assets/images/logo.png">
        <div class="login-card">
            <span class="m-2 row" style="font-size: 1.5em;">Welcome to image processor!</span>
            <div class="mx-auto m-3 row">
              <input type="text" ref="username" class="login-input" placeholder="Username" @keyup.enter="postLogin" v-model="username">
            </div>
            <div class="mx-auto m-3 row" style="position: relative;">
              <input :type="inputType" ref="password" class="login-input " placeholder="Password" @keyup.enter="postLogin" v-model="password">
              <i class="fa-solid fa-lock toggle-password" v-if="showPassword == false" @click="showPassword = true"></i>
              <i class="fa-solid fa-unlock toggle-password" v-if="showPassword == true" @click="showPassword = false"></i>
            </div>
            <button class="login-button mx-auto m-3 row" :class="disabledClass" @click="postLogin" :disabled="disabledControl">
                Login
            </button>
            <footer class="register-button" @click="goToRegister">
              Don't have an account?
            </footer>
        </div>

    </div>
    <RegisterPage v-if="register == true" />
  
    <ContentComponent v-if="userToken.length == 64 && register == false" class="content-component"/>
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
  filter: drop-shadow(0 0 3px gray);
}
.login-button:active{
  scale: 1.025;
  filter: drop-shadow(0 0 5px gray);
}
.disabled-button{
  filter: brightness(120%) !important;
  cursor: default !important;
  pointer-events: none;
}

.register-button{
  color: rgb(87, 87, 87);
}
.register-button:hover{
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
}

.toggle-password {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 17.5em;
}
</style>
