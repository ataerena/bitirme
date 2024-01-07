<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

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
        }
    },
    computed: {
        ...mapGetters(['getSearchTerm', 'getSearchResults']),
        searchTerm(){
            return this.getSearchTerm
        },
        searchResults(){
            return this.getSearchResults
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
                    this.getImages();
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
        updateAlbums(){
            const params = {
                username: this.username,
                imageName: this.selectedImage.name,
                updates: {
                    albums: this.selectedImageAlbums
                }
            }

            axios.post(`/api/update/updateImage`, params)
                .then(res => {
                    this.$toast.open({
                      message: res.data.message,
                      type: "success",
                      duration: 5000,
                      dismissible: true,
                    });
                })
                .catch(err => {
                    console.log(err);
                })
                .finally( () => {
                    this.getImages();
                })
        },
    }
}
</script>

<template>
  <div class="p-3 row">
    <div v-if="searchResults.length == 0" class="no-results-text text-center">
      No results to show. Search for a keyword.
    </div>
    <div v-else class="search-results-text text-center">
      Viewing results for <span class="search-term">{{ searchTerm }}</span>
    </div>
    <div class="p-3 col-2 photo-container" v-for="(item, index) in searchResults" :key="index">
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


    <div class="modal fade" id="albumsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add to or remove from albums</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row text-center" v-for="album in ['deneme', 'deneme2', 'deneme3']" :key="album">
                <div class="col" style="font-size: 1.5em;">
                    <i class="fa-solid fa-square-plus add-to-album-button m-1"
                        v-if="false"
                        @click="addToSelectedAlbums(album)"
                    >
                    </i>
                    <i class="fa-solid fa-square-minus add-to-album-button m-1" 
                        v-if="false"
                        @click="popFromSelectedAlbums(album)"
                    >
                    </i>
                    <span class="add-to-album-text m-1">{{ album }}</span>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="resetAlbumChanges">Close</button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="updateAlbums">Save changes</button>
          </div>
        </div>
      </div>
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
    .add-to-album-button{
        color: gray;
    }
    .add-to-album-button:hover{
        cursor: pointer;
        color: black;
    }
    .add-to-album-text{
        color: black;
    }
    .add-to-album-text:hover{
        cursor: pointer;
    }
    .no-results-text{
      font-size: 2em;
      font-weight: bold;
    }
    .search-results-text{
        font-size: 1.33em;
        font-weight: bold;
    }
    .search-term{
        text-decoration: underline;
    }

</style>