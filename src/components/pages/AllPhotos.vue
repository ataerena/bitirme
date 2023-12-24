<script>
import axios from 'axios';

export default {
    data(){
        return {
            username: "",
            images: [],
        }
    },
    mounted(){
        this.username = sessionStorage.username;
        this.getImagePaths();
    },
    methods: {
        getImagePaths() {
            this.images = [];
            const username = this.username;

            const params = {
                username: username
            };
        
            axios.post('/api/getImages', params)
                .then(response => {
                    this.images = response.data.images
                })
                .catch(error => {
                    console.error('There was a problem with the request:', error);
                });
        },

    }
}
</script>

<template>
  <div class="p-3 row">
    <div class="p-3 col-2 photo-container" v-for="(item, index) in images" :key="index">
        <img :src="'data:image/png;base64, '+ item" class="photo-image img-fluid">
    </div>
  </div>
</template>

<style>
    .photo-image{
        filter: drop-shadow(0 0 8px gray);
        border: thin solid rgb(185, 185, 185);
    }
    .photo-image:hover{
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgb(75, 75, 75));
        scale: 1.0125;
    }
</style>