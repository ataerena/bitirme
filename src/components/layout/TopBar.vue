<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
    data(){
        return{
            file: null,
            search: "",
            images: [],
            username: "",
            loading: false,
        }
    },
    methods: {
        ...mapActions(['logout', 'setSearchTerm', 'setSearchResults']),
        logOut() {
            this.logout();
        },
        async handleFileUpload(event) {
          const username = sessionStorage.getItem('username');
          const file = event.target.files[0];
          const formData = new FormData();
          formData.append('image', file);
          formData.append('username', username);
          this.loading = true;

          try {
            const response = await axios.post('/api/file/upload', formData);
            console.log(response);
            
            this.$toast.open({
              message: response.data,
              type: "success",
              duration: 5000,
              dismissible: true,
            });
          } 
          catch ({response}) {
            this.$toast.open({
              message: response.data.message,
              type: "error",
              duration: 5000,
              dismissible: true,
            });
          }

          finally {
            this.loading = false
            window.location.reload();
          }
        },

        searchImages(){
            const params = {
                username: this.username,
            }

            let searchResults = [];
            let searchTerm = this.search.toLowerCase();

            if(this.search.length != 0){
                axios.post('/api/getImages', params)
                    .then ( res => {
                        res.data.forEach( item => {
                            this.$router.push('/homepage');
                        
                            if ( !item.restricted && !item.deleted && item.name.toLowerCase().includes(searchTerm)){
                                searchResults.push(item);
                            }
                        
                            this.setSearchTerm(this.search);
                            this.setSearchResults(searchResults); 
                        })
                    })
            }
        }
    },
    mounted(){
        this.username = sessionStorage.getItem('username');
    }
}
</script>

<template>
    <div class="row p-4 pb-2">
        
        <div class="spinner-container" v-if="loading == true">
            <div class="spinner-border" role="info">
              <span class="sr-only">Loading...</span>
            </div>
            <div class="row">
                <strong>Processing images...</strong>
                <strong>Please wait...</strong>
            </div>
        </div>
        
        <div class="row" v-else>
            <div class="col-5 p-2">
                <div class="search-container">
                    <i class="fa-solid fa-magnifying-glass" @click="searchImages"></i>
                    <input type="search" placeholder="Search for a photo" class="p-2" 
                        v-model="search" @keydown.enter="searchImages"
                    >
                </div>
            </div>
            <div class="col top-buttons-wrapper">
                <div class="col-3 mr-5 top-button" @click="$refs.fileInput.click()">
                    <i class="fa-solid fa-cloud-arrow-up" style="color: rgb(93, 93, 93);"></i>
                    <input type="file" accept="image/jpeg, image/png" style="display: none;" 
                        ref="fileInput" @change="handleFileUpload($event)"
                    >
                    Upload
                </div>
                <div class="col-1 top-button" style="max-height: inherit;">
                    <img src="../../assets/images/logo-fav.png" class="img-fluid" @click="$router.push('/homepage')">
                </div>
                <div class="col-1 text-center top-button">
                    <i class="fa-solid fa-arrow-right-from-bracket" @click="logOut"></i>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>

    *{
        transition: filter .333s;
    }

    input[type="search"]{
        border: none;
        outline: none;
        width: 100%;
        background: whitesmoke;
        border-radius: 5px;
        padding-left: 40px !important;
    }
    input:focus{
        border-radius: 5px;
        filter: drop-shadow( 0 0 5px rgb(179, 179, 185));
    }


    .search-container{
        position: relative;
    }
    .fa-magnifying-glass {
        cursor: pointer;
        z-index: 1;
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
    }

    .top-buttons-wrapper{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .top-button{
        cursor: pointer;
    }
    .top-button:nth-of-type(1){
        text-align: center;
    }
    .top-button:nth-of-type(1):hover{
        filter: drop-shadow( 0 0 5px rgb(163, 163, 163));
    }
    .top-button:nth-of-type(2):hover{
        filter: drop-shadow( 0 0 5px rgb(190, 190, 252));
    }
    .top-button:nth-of-type(3):hover{
        filter: drop-shadow( 0 0 3px rgb(155, 155, 155));
    }

    .home-button{
        max-height: 60px; 
        padding-left: 2.5%; 
        cursor: pointer;
    }
    .home-button:hover{
        filter: drop-shadow( 0 0 5px rgb(184, 184, 195));
    }
</style>