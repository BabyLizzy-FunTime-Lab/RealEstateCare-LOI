<template>
    <base-layout>
      <div class="tile-container">
        <TileButton
            router-direction="forward"
            name="Scheduled" path="/scheduled"
            icon="/icons/tile-buttons/scheduled-icon.png"/>
        <TileButton
            router-direction="forward"
            name="Completed" path="/completed"
            icon="/icons/tile-buttons/completed-icon.png"/>
        <TileButton
            router-direction="forward"
            name="Knowledge base" path="/knowledge-base"
            icon="/icons/tile-buttons/knowledge-base-icon.png"/>
        <TileButton
            router-direction="forward"
            name="Settings" path="/settings"
            icon="/icons/tile-buttons/settings-icon.png"/>
      </div>
    </base-layout>
</template>

<script>
import TileButton from "@/components/home/TileButton.vue";
export default {
  name: "HomePage",
  components: {
    TileButton,
  },
}
</script>

<style scoped lang="scss">
.tile-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: .2em;
  padding-bottom: .5em;
  padding-left: .2em;
  padding-right: .2em;
  height: 100%;
}
</style>
