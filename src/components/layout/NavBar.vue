<template>
    <VueAwesomeSideBar
      v-model="miniMenu"
      v-model:collapse.sync="collapsed"
      :menu="menu"
      vueRouterEnabel
      position="relative"
    ></VueAwesomeSideBar>
</template>

<script>

export default {


  data() {
    return {
      collapsed: false,
      miniMenu: false,
      menu: [
        {
          header: "Home"
        },
        {
          name: 'Photos',
          icon: { class: 'mdi mdi-image' },
          href: '/photos',
        },
        {
          name: 'Albums',
          icon: { class: 'mdi mdi-image-album' },
          href: '/albums',
        },
        {
          name: 'Favorites',
          icon: { class: 'mdi mdi-folder-star' },
          href: '/favorites',
        },
        {
          name: 'Restricted',
          icon: { class: 'mdi mdi-lock' },
          href: '/restricted',
        },
        {
          name: 'Archived Images',
          icon: { class: 'mdi mdi-archive' },
          href: '/archived',
        },
      ]
    };
  },
};
</script>

<style scoped>

  .vas-menu{
    color: rgb(96, 96, 232) !important
  }

</style>
