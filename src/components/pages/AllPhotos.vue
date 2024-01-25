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
            secondLastIndex: null,
            selectedImage: null,
            selectedImageAlbums: [],
            imageToDelete: null,
            
            loading: false,
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
                        if (!item.restricted && !item.deleted){
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

        showOptions(image){
            this.selectedImage = image;
            this.selectedImageAlbums = image.albums;
        },
        popFromSelectedAlbums(album){
            this.selectedImageAlbums = this.selectedImageAlbums.filter( item => item !== album)
        },
        addToSelectedAlbums(album){
            this.selectedImageAlbums.push(album);
        },
        resetAlbumChanges(){
            this.selectedImage = "";
            this.selectedImageAlbums = [];
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
    }
}
</script>

<template>
  <div class="p-3 row">
    <div class="spinner-container" v-if="loading == true">
        <div class="spinner-border" role="info">
          <span class="sr-only">Loading...</span>
        </div>
        <div class="row">
            <strong>Processing images...</strong>
            <strong>Please wait...</strong>
        </div>
    </div>
    <div class="row">
        <div class="p-3 col-2 photo-container" v-for="(item, index) in images" :key="index">
            <img :src="`data:${item.base64.mimetype};base64,${item.base64.data.toString('base64')}`" class="photo-image img-fluid">
            <div class="image-buttons-tab">
                <i class="mdi mdi-lock-open restrict-button" @click="makeRestricted(item)"></i>
                <i class="fa-solid fa-heart favorite-button" v-if="item.favorite" @click="updateFav(item)"></i>
                <i class="fa-regular fa-heart favorite-button" v-if="!item.favorite" @click="updateFav(item)"></i>
                <i class="fa-solid fa-trash-can delete-image-button" data-bs-toggle="modal" data-bs-target="#deleteImage"
                    @click="imageToDelete = item"
                >
                </i>
            </div>
        </div>
        <div class="col-2 photo-container add-photo-container" @click="$refs.fileInput.click()">
            <i class="fa-solid fa-circle-plus"></i>
            <input type="file" accept="image/jpeg, image/png" style="display: none;" 
                ref="fileInput" @change="handleFileUpload($event)"
            >
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

    .add-photo-container{
        padding: .1em;
        border-radius: .33em;
        cursor: pointer;
        font-size: 4em;
        text-align: center;
        color: rgb(67, 67, 67);

        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    .add-photo-container:hover{
        background-color: rgba(0, 0, 0, 0.315);
        color: black;;
    }
    .photo-container{
        position: relative;
        margin-top: .5em !important;
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

    .image-buttons-tab{
        position: absolute;
        margin-top: .5em;
        padding-left: .7em;
        padding-right: .7em;
        border-bottom: thin solid black;
        border-top: thin solid black;
    }
    .image-buttons-tab i{
        padding-left: 1em;
        padding-right: 1em;
    }

    .favorite-button{
        color: red;
    }
    .favorite-button:hover{
        cursor: pointer;
        filter: brightness(85%);
    }
    .restrict-button{
        color: gray;
    }
    .restrict-button:hover{
        cursor: pointer;
        color: black;
    }
    .delete-image-button{
        color: brown;   
    }
    .delete-image-button:hover{
        cursor: pointer;
        color: rgb(255, 0, 0);
    }
    .add-to-album-text{
        color: black;
    }
    .add-to-album-text:hover{
        cursor: pointer;
    }

</style>