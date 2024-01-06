<script>
import axios from 'axios';

export default {
    data(){
        return {
            username: "",
            userAlbums: [],
            createdAlbumName: "",
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
                    this.getAlbums();
                    this.createdAlbumName = '';
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

        handleEnterKey(){
            const element = document.getElementById('add-album-success-button');
            element.click();
        }
    }
}
</script>


<template>
  <div class="p-3 row">
    <div class="col-2 albums-container added-albums-container" v-for="album in userAlbums" :key="album">
        {{ album }}
    </div>
    <div class="col-2 albums-container add-album-container" data-bs-toggle="modal" data-bs-target="#createAlbums">
        <i class="fa-solid fa-folder-plus"></i>
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
        border-radius: .33em;
        cursor: pointer;
        font-size: 4em;
        text-align: center;
        color: rgb(67, 67, 67);
    }
    .add-album-container:hover{
        background-color: lightgray;
        color: black;;
    }

    .added-albums-container{
        font-size: 1.66em;
        border-radius: 1em;
        margin: .15em;
        cursor: pointer;
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
</style>