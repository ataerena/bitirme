<script>
import axios from 'axios';

export default {
    data(){
      return {
        username: "",
        password: "",
        passwordConfirm: "",
        usernameWarning: false,
        passwordWarning: false,
        matchWarning: false,
        showPassword: false,
        inputType: "password",
      }
    },
    computed: {
      disabledControl(){
        return !(this.usernameValid && this.passwordValid && this.passwordMatch)
      },
      disabledClass(){
        let disabled = ""
        if (!(this.usernameValid && this.passwordValid && this.passwordMatch)){
          disabled = 'disabled-button'
        }
        return disabled
      },
      usernameValid(){
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        
        return usernameRegex.test(this.username);
      },
      passwordValid(){
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        
        return passwordRegex.test(this.password);
      },
      passwordMatch(){
        
        return this.password == this.passwordConfirm;
      },
    },
    watch: {
      username: {
        handler(newVal) {
          const usernameRegex = /^[a-zA-Z0-9_]+$/;
          this.usernameWarning = !usernameRegex.test(newVal) && newVal.length !== 0;
        },
        immediate: true
      },
      password: {
        handler(newVal) {
          const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          this.passwordWarning = !passwordRegex.test(newVal) && newVal.length !== 0;
        },
        immediate: true
      },
      passwordConfirm: {
        handler(newVal) {
          this.matchWarning = this.password !== newVal && this.password.length !== 0 && newVal.length !== 0;
        },
        immediate: true
      },
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
    },
    methods: {
      postRegister(){
        const params = {
          username: this.username,
          password: this.password
        }
        axios.post('/api/register', params)
            .then( res => {
              console.log(res);
            })
            .catch( err => {
              console.log(err);
            })
            .finally(() => {
              this.goToLogin();
            })
      },

      goToLogin(){
        sessionStorage.setItem('register', false);
        window.location.reload();
      }
    },
        
}
</script>

<template>
  <div class="register-page">  
    <img src="../../assets/images/logo.png">
    <div class="register-card">
        <span class="m-2 row" style="font-size: 1.5em;">Create an account</span>
        <div class="mx-auto m-3 row">
          <input type="text" ref="username" class="register-input" placeholder="Username" @keyup.enter="postRegister" v-model="username">
        </div>
        <div class="mx-auto m-3 row" style="position: relative;">
          <input :type="inputType" ref="password" class="register-input" placeholder="Password" @keyup.enter="postRegister" v-model="password">
          <i class="fa-solid fa-lock toggle-password" v-if="showPassword == false" @click="showPassword = true"></i>
          <i class="fa-solid fa-unlock toggle-password" v-if="showPassword == true" @click="showPassword = false"></i>
        </div>
        <div class="mx-auto m-3 row">
          <input :type="inputType" ref="password" class="register-input" placeholder="Password Confirm" @keyup.enter="postRegister" v-model="passwordConfirm">
        </div>
        <button class="register-button--regPage mx-auto m-3 row" @click="postRegister" :class="disabledClass" :disabled="disabledControl">
            Create Account
        </button>
        <footer class="credentials-warning">
          <div v-if="usernameWarning" class="warning-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Check your username!</span>
          </div>
          <div v-if="passwordWarning" class="warning-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Your password must include uppercase, lowercase, numeric and special characters and be at least 8 characters long!</span>
          </div>
          <div v-if="matchWarning" class="warning-item">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>Passwords do not match!</span>
          </div>
          <div class="go-to-login" @click="goToLogin">
            Back to login
          </div>
        </footer>
    </div>
</div>
</template>


<style scoped>
.register-page {
    font-family: 'Times New Roman', Times, serif;
    font-weight: bold;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to right, lightgray, lightblue);
}
.register-card {
    background: whitesmoke;
    border: thin solid gray;
    filter: drop-shadow(0 0 50px gray);
    padding: 4rem;
    border-radius: 25px;
    margin-left: 15%;

    max-width: 450px;
}

.register-input{
  border: 0;
  outline: 0;
  padding: .33em;
  filter: drop-shadow(0 0 .33em rgb(170, 170, 170));
}
.register-input:focus{
  filter: drop-shadow(0 0 .66em rgb(170, 170, 170));
  outline: thin solid gray;
}

.register-button--regPage{
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
.register-button--regPage:active{
  scale: 1.025;
  filter: drop-shadow(0 0 5px gray);
}
.disabled-button{
  filter: brightness(120%) !important;
  cursor: default !important;
  pointer-events: none;
}

.credentials-warning{
  color: rgb(118, 118, 118);
}
.warning-item{
  max-width: 200px;
  padding-bottom: .5em;
}
.fa-circle-exclamation:nth-of-type(1){
  padding-right: .4rem !important;
}
.fa-circle-exclamation:nth-of-type(3){
  padding-right: .4rem !important;
}

.go-to-login:hover{
  text-decoration: underline;
  font-weight: bold;
  cursor: pointer;
}

.toggle-password {
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10.5em;
}
</style>