<script>
import ImageThumbnailViewer from "@/components/mediaViewers/ImageThumbnailViewer.vue";
export default {
  name: "PhotoViewer",
  components: {
    ImageThumbnailViewer
  },
  props: {
    photos: Array
  },
  emits:['delete-event']
}
</script>

<template>

</template>

<style scoped lang="scss">

</style>
