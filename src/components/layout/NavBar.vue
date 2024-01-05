<template>
  <div>
    <VueAwesomeSideBar
      v-model="miniMenu"
      v-model:collapse.sync="collapsed"
      :menu="menu"
      menuType="fully"
      vueRouterEnabel
      position="relative"
      @item-click="handleItemClick"
    ></VueAwesomeSideBar>

    <div v-if="passwordModal" class="custom-modal">
      <div class="modal-content">
        <h4>Confirm Password</h4>
        <input :type="showPassword == false ? 'password' : 'text'"
          v-model="password" placeholder="Enter your password" @keydown="handleKeydown"
        />
        <i class="fa-solid fa-lock toggle-password" v-if="showPassword == false" @click="showPassword = true"></i>
        <i class="fa-solid fa-unlock toggle-password" v-if="showPassword == true" @click="showPassword = false"></i>
        <button @click="submitPassword">Submit</button>
        <button @click="cancel">Cancel</button>
        <div v-if="wrongPassword == true" style="color: rgb(188, 0, 0);">
          <i class="fa-solid fa-triangle-exclamation"></i>
          Wrong password!
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  mounted(){
    this.username = sessionStorage.getItem('username');

    const albums = JSON.parse(sessionStorage.getItem('albums'));
    albums.albums.forEach(item => {
      this.menu[2].children.push({
        name: item,
        type: 'album-child',
        icon: { class: 'fa-solid fa-photo-film' }
      })
    });
  },
  methods: {
    handleItemClick(item){
      if(item.name == 'Restricted' && this.$route.path != '/restricted'){
        this.passwordModal = true;
      }
      else {
        this.passwordModal = false
      }

      if(item.type == 'album-child'){
        this.$router.push('/albums');
        sessionStorage.setItem('activeAlbum', item.name);
        if(this.$route.path == '/albums'){
          this.$router.go();
        }
      }
      else {
        sessionStorage.setItem('activeAlbum', null);
      }
    },
    submitPassword(){
      const params = {
        username: this.username,
        password: this.password
      };

      axios.post('/api/auth/reauthenticate', params)
        .then( res => {
          console.log(res);
          this.$router.push('/restricted');
          this.cancel();
        })
        .catch( ({err}) => {
          console.log(err);
          this.wrongPassword = true;
        })
    },
    cancel(){
      this.passwordModal = false;
      this.showPassword = false;
      this.wrongPassword = false;
      this.password = "";
    },
    handleKeydown(event){
      if (event.key == 'Enter'){
        this.submitPassword();
      }
      if (event.key == 'Escape'){
        this.cancel();
      }
    },
  },

  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      passwordModal: false,
      wrongPassword: false,
      collapsed: false,
      miniMenu: false,
      menu: [
        {
          header: "Home"
        },
        {
          name: 'Photos',
          icon: { class: 'mdi mdi-image' },
          href: '/photos',
        },
        {
          name: 'Albums',
          icon: { class: 'mdi mdi-image-album' },
          children: []
        },
        {
          name: 'Favorites',
          icon: { class: 'mdi mdi-folder-star' },
          href: '/favorites',
        },
        {
          name: 'Restricted',
          icon: { class: 'mdi mdi-lock' },
        },
        /* {
          name: 'Archived Images',
          icon: { class: 'mdi mdi-archive' },
          href: '/archived',
        }, */
      ]
    };
  },
};
</script>

<style scoped>

  .vas-menu{
    color: rgb(96, 96, 232) !important
  }


  .custom-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }
  
  .modal-content {
    max-width: 30em;
    background: #fff;
    padding: 1.66em;
    border-radius: 1rem;
    text-align: center;
  }
  
  /* Style the buttons as needed */
  .modal-content button {
    margin: .5em;
    padding: .33em;
    border: thin solid gray;
    border-radius: 1em;
    cursor: pointer;
  }
  .modal-content button:active {
    border: thin solid gray;
    filter: drop-shadow(0 0 5px gray);
  }

  .modal-content input{
    border: 0;
    outline: 0;
    padding: .33em;
    margin-bottom: 1em;
    filter: drop-shadow(0 0 .33em rgb(170, 170, 170));
  }
  .modal-content input:focus{
    filter: drop-shadow(0 0 .66em rgb(170, 170, 170));
    outline: thin solid gray;
  }

  .toggle-password {
    cursor: pointer;
    position: absolute;
    top: 5em;
    left: 26.66em !important;
    max-width: fit-content;
  }
</style>
