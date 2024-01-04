<script>
import axios from 'axios';

export default {
    data(){
        return {
            username: "",
            activeAlbum: "",
            images: [],
            showAlbumOptions: false,
            albumOptions: [],
            selectedImageIndex: null,
        }
    },
    mounted(){
        this.username = sessionStorage.username;
        this.activeAlbum = sessionStorage.activeAlbum;
        JSON.parse(sessionStorage.albums).albums.forEach(item => {
            this.albumOptions.push(item)
        });
        this.getImages();
    },
    methods: {
        getImages() {
            this.images = [];
            const username = this.username;

            const params = {
                username: username
            };
        
            axios.post('/api/getImages', params)
                .then(response => {
                    response.data.forEach( item => {
                        if (item.albums.includes(this.activeAlbum) && !item.deleted && !item.restricted){
                            this.images.push(item);
                        }
                    });
                    console.log(this.images);
                })
                .catch(error => {
                    console.error('There was a problem with the request:', error);
                })
                .finally(() => {
                    console.log(this.images);
                })
        },
        updateFav(image){
            if( image.favorite == false){
                image.favorite = true
            }
            else {
                image.favorite = false
            }

            const params = {
                username: this.username,
                imageName: image.name,
                updates: {
                    favorite: image.favorite
                }
            }

            axios.post(`/api/update/updateImage`, params)
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        makeRestricted(image){
            const params = {
                username: this.username,
                imageName: image.name,
                updates: {
                    restricted: true
                }
            }

            axios.post(`/api/update/updateImage`, params)
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                })
                .finally( () => {
                    this.getImages();
                })
        },
        showOptions(index){
            if (index != this.selectedImageIndex){
                this.showAlbumOptions = true;
            }
            else if (this.showAlbumOptions == true && index == this.selectedImageIndex){
                this.showAlbumOptions = false;
            }
            else {
                this.showAlbumOptions = true
            }
            
            this.selectedImageIndex = index
        }
    }
}
</script>

<template>
  <div class="p-3 row">
    <div class="album-name">{{ activeAlbum.toUpperCase() }}</div>
    <div class="p-3 col-2 photo-container" v-for="(item, index) in images" :key="index">
        <img :src="`data:${item.base64.mimetype};base64,${item.base64.data.toString('base64')}`" class="photo-image img-fluid">
        <div class="image-buttons-tab">
            <i class="fa-solid fa-circle-plus add-to-album-button" @click="showOptions(index)"></i>
            <i class="mdi mdi-lock-open restrict-button" @click="makeRestricted(item)"></i>
            <i class="fa-solid fa-heart favorite-button" v-if="item.favorite" @click="updateFav(item)"></i>
            <i class="fa-regular fa-heart favorite-button" v-if="!item.favorite" @click="updateFav(item)"></i>
            <div v-if="showAlbumOptions && (index == selectedImageIndex)" class="album-dropdown">
                <div class="album-item" v-for="(album, index) in albumOptions" :key="index">
                    {{ album }}
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
    .photo-container{
        position: relative;
    }
    .photo-image{
        filter: drop-shadow(0 0 8px gray);
        border: thin solid rgb(185, 185, 185);
    }
    .photo-image:hover{
        cursor: pointer;
        filter: drop-shadow(0 0 10px rgb(75, 75, 75));
        scale: 1.0125;
    }

    .album-name{
        color: rgb(52, 52, 52);
        font-size: 1.66em;
        font-weight: bold;
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        border-bottom: thin solid black;
    }
</style>