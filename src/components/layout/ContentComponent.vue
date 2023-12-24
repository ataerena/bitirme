<script>
import NavBar from './NavBar.vue';
import TopBar from './TopBar.vue';

export default {
    components: {
        NavBar,
        TopBar,
    },
    name: 'ContentComponent',
}
</script>

<template>

    <div class="content-container">
        <NavBar/>
        <div class="right-content">
            <TopBar class="top-bar"/>
            <router-view></router-view>
        </div>
    </div>

</template>

<style scoped>
    .content-container{
        display: flex;
        flex-direction: row;

        overflow: hidden;
    }
    .right-content{
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .top-bar{
        border-bottom: thin solid #093c71;
    }


</style>