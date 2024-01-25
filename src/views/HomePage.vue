<template>
    <base-layout>
      <div class="tile-container">
        <BaseTileButton
            router-direction="forward"
            name="Scheduled" path="/scheduled"
            icon="/icons/tile-buttons/scheduled-icon.png"/>
        <BaseTileButton
            router-direction="forward"
            name="Completed" path="/completed"
            icon="/icons/tile-buttons/completed-icon.png"/>
        <BaseTileButton
            router-direction="forward"
            name="Knowledge base" path="/knowledge-base"
            icon="/icons/tile-buttons/knowledge-base-icon.png"/>
        <BaseTileButton
            router-direction="forward"
            name="Settings" path="/settings"
            icon="/icons/tile-buttons/settings-icon.png"/>
      </div>
    </base-layout>
</template>

<script>
import BaseTileButton from "@/components/base/BaseTileButton.vue";
export default {
  name: "HomePage",
  components: {
    BaseTileButton,
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
