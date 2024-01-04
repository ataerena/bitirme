<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
    data(){
        return{
            file: null,
        }
    },
    methods: {
        ...mapActions(['logout']),
        logOut() {
            this.logout();
        },
        async handleFileUpload(event) {
          const username = sessionStorage.getItem('username');
          const file = event.target.files[0];
          const formData = new FormData();
          formData.append('image', file);
          formData.append('username', username);

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
            window.location.reload();
          }
        }
    }
}
</script>

<template>
    <div class="row p-4 pb-2">
        
        
        <div class="col-5 p-2">
            <div class="search-container">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="search" placeholder="Search for a photo" class="p-2">
            </div>
        </div>
        <div class="col top-buttons-wrapper">
            <div class="col-3 mr-5 top-button" @click="$refs.fileInput.click()">
                <i class="fa-solid fa-cloud-arrow-up" style="color: rgb(93, 93, 93);"></i>
                <input type="file" accept="image/*" style="display: none;" 
                    ref="fileInput" @change="handleFileUpload($event)"
                >
                Upload
            </div>
            <div class="col-1 top-button" style="max-height: inherit;">
                <img src="../../assets/images/logo-fav.png" class="img-fluid">
            </div>
            <div class="col-1 text-center top-button">
                <i class="fa-solid fa-arrow-right-from-bracket" @click="logOut"></i>
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