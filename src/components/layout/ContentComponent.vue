<script>
import NavBar from './NavBar.vue';
import TopBar from './TopBar.vue';
import axios from 'axios'

export default {
    components: {
        NavBar,
        TopBar,
    },
    name: 'ContentComponent',
    mounted(){
        axios.post('/api/postEndpoint', {'key': 'value'})
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.error('Error:', error);
            });
    }
}
</script>

<template>

    <div class="row border-bottom">
        <TopBar />
    </div>
    <div class="bottom-content">
        <div class="left-nav">
            <NavBar/>
        </div>
        <div class="main">
            <router-view></router-view>
        </div>
    </div>

</template>

<style scoped>

    .bottom-content{
        display: flex;
        flex-direction: row;
    }
    .left-nav{
        position: relative;
    }
    .main{
        position: relative;
        padding: 1.5%;
    }


</style>