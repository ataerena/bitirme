<script>
import axios from 'axios';

export default {
    data(){
        return {
            username: "",
            userAlbums: [],
            createdAlbumName: "",
            selectedAlbum: "",
            showDeleteButton: false,
            hoveredAlbumIndex: null,

            showAlbumImages: false,
            images: [],

            nonExistantImages: [],

            imagesToAdd: [],
            albumsToAddTo: [],
          
            imageToRemove: null,
            albumToRemoveFrom: "",
        }
    },
    mounted(){
        this.username = sessionStorage.getItem('username');

        this.getAlbums();
    },
    methods: {
        createAlbum(){
            const params = {
                username: this.username,
                albumName: this.createdAlbumName
            }

            axios.post('/api/create/createAlbum', params)
                .then( res => {
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
                .finally( () => {
                    window.location.reload();
                    this.createdAlbumName = '';
                })
        },

        deleteAlbum(){
          const params = {
            username: this.username,
            albumName: this.selectedAlbum
          }

          axios.post('/api/delete/deleteAlbum', params)
          .then( res => {
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
                .finally( () => {
                    window.location.reload();
                    this.selectedAlbum = '';
                })
        },

        getAlbums(){
            const params = {
                username: this.username
            }
            this.userAlbums = [];

            axios.post('/api/get/getAlbums', params)
                .then( res => {
                    this.userAlbums = res.data.albums;
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

        getImages() {
            this.images = [];

            const params = {
                username: this.username
            };
        
            axios.post('/api/getImages', params)
                .then(response => {
                    response.data.forEach( item => {
                        if (!item.restricted && !item.deleted && item.albums.includes(this.selectedAlbum)){
                            this.images.push(item);
                        }
                    });
                })
                .catch(error => {
                  console.error('There was a problem with the request:', error);
                  this.getImages();
                })
                .finally(() => {
                  this.showAlbumImages = true;
                })
        },
        getNonAddedImages() {
            this.nonExistantImages = [];

            const params = {
                username: this.username
            };
        
            axios.post('/api/getImages', params)
                .then(response => {
                    response.data.forEach( item => {
                        if (!item.restricted && !item.deleted && !item.albums.includes(this.selectedAlbum)){
                            this.nonExistantImages.push(item);
                        }
                    });
                })
                .catch(error => {
                  console.error('There was a problem with the request:', error);
                })
        },

        updateAlbums(image){
            const params = {
                username: this.username,
                imageName: image.name,
                updates: {
                    albums: this.albumsToAddTo
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
        },

        addToAlbum(){
          const names = this.imagesToAdd.map( item => item.name);

          const params = {
            username: sessionStorage.getItem('username'),
            imageNames: names,
            albumName: this.selectedAlbum
          }

          axios.post('/api/add/addImagesToAlbum', params)
          .then( () => {
            this.$toast.open({
              message: `Images added to ${this.selectedAlbum}`,
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
          .finally(() => {
            window.location.reload();
          })
        },


        selectAlbum(album){
          this.selectedAlbum = album;
          this.getImages();
        },

        handleEnterKey(){
            const element = document.getElementById('add-album-success-button');
            element.click();
        },

        handleAlbumHover(index){
          this.hoveredAlbumIndex = index;
          this.showDeleteButton = true;
        },
        handleAlbumLeave(){
          this.hoveredAlbumIndex = null;
          this.showDeleteButton = false;
        },

        returnToAlbums(){
          this.showAlbumImages = false;
          this.selectedAlbum = "";
        },

        selectImages(image){
          if(this.imagesToAdd.includes(image)){
            this.imagesToAdd = this.imagesToAdd.filter( item => item != image);
          }
          else{
            this.imagesToAdd.push(image);
          }
        },

        openRemoveAlbumModal(image, album){
          this.albumsToAddTo = this.albumsToAddTo.filter( item => item != album);
          this.selectedAlbum = album;
          this.imageToRemove = image;
        },
        removeFromAlbum(){
          this.updateAlbums(this.imageToRemove);
          this.getImages();
        }
    }
}
</script>


<template>
  <div class="p-3 row">
    <div class="row" v-if="!showAlbumImages">
      <div class="col-2 albums-container added-albums-container" v-for="(album, index) in userAlbums" :key="index"
          @mouseenter="handleAlbumHover(index)" @mouseleave="handleAlbumLeave" @click="selectAlbum(album)"
      >
        <i class="fa-solid fa-trash delete-album-button" data-bs-toggle="modal" data-bs-target="#deleteAlbum" 
          @click.stop="selectedAlbum = album" v-show="showDeleteButton && (hoveredAlbumIndex == index)"
        >
        </i>
        {{ album }}
      </div>
      <div class="col-2 albums-container add-album-container" data-bs-toggle="modal" data-bs-target="#createAlbums">
          <i class="fa-solid fa-folder-plus"></i>
      </div>
    </div>
    <div v-else class="row">
      <div class="row">
        <div class="return-button-container" @click="returnToAlbums">
          <i class="fa-solid fa-left-long return-to-albums-button"></i>
        </div>
      </div>
      <div class="p-3 col-2 photo-container" v-for="(item, index) in images" :key="index">
          <img :src="`data:${item.base64.mimetype};base64,${item.base64.data.toString('base64')}`" class="photo-image img-fluid">
          <div class="image-buttons-tab">
              <i class="mdi mdi-lock-open restrict-button" @click="makeRestricted(item)"></i>
              <i class="fa-solid fa-heart favorite-button" v-if="item.favorite" @click="updateFav(item)"></i>
              <i class="fa-regular fa-heart favorite-button" v-if="!item.favorite" @click="updateFav(item)"></i>
              <i class="fa-solid fa-square-minus remove-from-album-button" @click="openRemoveAlbumModal(item, selectedAlbum)"
              data-bs-toggle="modal" data-bs-target="#removeFromAlbum"
              ></i>
          </div>
      </div>
      <div class="col-2 albums-container add-album-container" data-bs-toggle="modal" 
        data-bs-target="#addImageToAlbum" @click="getNonAddedImages"
      >
          <i class="fa-solid fa-square-plus"></i>
      </div>
    </div>

    <div class="modal fade" id="createAlbums" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add a new album</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <input type="text" class="create-album-input" v-model="createdAlbumName" placeholder="Enter album name"
                @keydown.escape="createdAlbumName = ''"  
                @keydown.enter="handleEnterKey"
            >
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="createdAlbumName = ''">
                Close
            </button>
            <button type="button" class="btn btn-success" id="add-album-success-button" data-bs-dismiss="modal" @click="createAlbum">
                Add
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="deleteAlbum" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Are you sure you want to delete {{ selectedAlbum }}?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <b>You will not be able to take this action back.</b>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="selectedAlbum = ''">
                Cancel
            </button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="deleteAlbum">
                Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addImageToAlbum" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Select images to add to album</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body row">
            <div class="p-3 col-2 photo-container" v-for="(item, index) in nonExistantImages" :key="index" @click="selectImages(item)">
                <img :src="`data:${item.base64.mimetype};base64,${item.base64.data.toString('base64')}`"
                  class="photo-image img-fluid" :class="{'selected': imagesToAdd.includes(item)}"
                >
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="imagesToAdd = []">
                Cancel
            </button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="addToAlbum">
                Add
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal fade" id="removeFromAlbum" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Remove image from album?</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                Cancel
            </button>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="removeFromAlbum">
                Remove
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>


<style scoped>
    .albums-container{
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    .add-album-container{
        padding: .1em;
        border-radius: .1em;
        cursor: pointer;
        font-size: 4em;
        text-align: center;
        color: rgb(67, 67, 67);
    }
    .add-album-container:hover{
        background-color: rgba(0, 0, 0, 0.315);
        color: black;;
    }

    .added-albums-container{
        font-size: 1.66em;
        border-radius: .2em;
        margin: .15em;
        cursor: pointer;

        position: relative;
    }
    .added-albums-container:hover{
        background-color: lightgray;
    }

    .create-album-input{
      border: 0;
      outline: 0;
      padding: .44em;
      filter: drop-shadow(0 0 .33em rgb(170, 170, 170));
      width: 100%;
    }
    .create-album-input:focus{
      filter: drop-shadow(0 0 .66em rgb(170, 170, 170));
      outline: thin solid gray;
    }

    .delete-album-button{
      font-size: 1rem;
      color: rgb(182, 0, 0);

      position: absolute;
      right: 0.5em;
      top: 0.5em;
    }
    .delete-album-button:hover{
      filter: brightness(133%);
    }


    .return-button-container{
      width: fit-content;
      margin-left: 1em;
      border-radius: .5em;
      cursor: pointer;
    }
    .return-button-container:hover{
      background-color: lightgray;
    }
    .return-to-albums-button{
      font-size: 2em;
    }

    .selected{
      scale: .8;
      padding: .33em;
      border: thin solid rgb(0, 172, 0);
      border-radius: .33em;
      filter: drop-shadow(0 0 2.5em rgb(126, 126, 126));
    }

    .remove-from-album-button{
      color: rgb(136, 136, 136);
    }
    .remove-from-album-button:hover{
      cursor: pointer;
      color: black;
    }
</style>