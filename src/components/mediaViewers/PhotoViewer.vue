<script>
import ImageThumbnailViewer from "@/components/mediaViewers/ImageThumbnailViewer.vue";
export default {
  name: "PhotoViewer",
  components: {
    ImageThumbnailViewer
  },
  props: {
    photos: Array,
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    emitInputChange(data, eventName) {
      this.$emit(eventName, data);
    },
  },
  emits:['delete-event']
}
</script>

<template>
  <div id="thumbnail--container">
    <ImageThumbnailViewer
        v-for="(photo, index) in photos"
        :read-only="readOnly"
        :key="index"
        :image="photo"
        @delete-event="emitInputChange($event, 'delete-event')"
    />
  </div>
</template>

<style scoped lang="scss">
#thumbnail--container {
  width: 100%;
  margin-bottom: .5em;
  display: grid;
  justify-items: left;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto;
  gap: .5em .5em;
}
</style>
