<script>
import axios from 'axios';

export default {
    data(){
        return {
            username: "",
            images: [],
            showAlbumOptions: false,
            albumOptions: [],
            selectedImageIndex: null,
            imageToDelete: null,
        }
    },
    mounted(){
        this.username = sessionStorage.username;
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
                        if (item.restricted && !item.deleted){
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
        makeUnrestricted(image){
            const params = {
                username: this.username,
                imageName: image.name,
                updates: {
                    restricted: false
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
                    window.location.reload();
                })
        },
        deleteImage(){
            const params = {
                username: this.username,
                imageName: this.imageToDelete.name,
                updates: {
                    deleted: true
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
                    window.location.reload();
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
    <div class="p-3 col-2 photo-container" v-for="(item, index) in images" :key="index">
        <img :src="`data:${item.base64.mimetype};base64,${item.base64.data.toString('base64')}`" class="photo-image img-fluid">
        <div class="image-buttons-tab">
            <i class="mdi mdi-lock restrict-button" @click="makeUnrestricted(item)"></i>
            <i class="fa-solid fa-heart favorite-button" v-if="item.favorite" @click="updateFav(item)"></i>
            <i class="fa-regular fa-heart favorite-button" v-if="!item.favorite" @click="updateFav(item)"></i>
            <i class="fa-solid fa-trash-can delete-image-button" data-bs-toggle="modal" data-bs-target="#deleteImage"
                @click="imageToDelete = item"
            >
            </i>
        </div>
    </div>

    <div class="modal fade" id="deleteImage" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete this image?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <b>You will not be able to take this action back.</b>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="imageToDelete = null">
                Cancel
            </button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="deleteImage">
                Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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

</style>