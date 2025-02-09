<script setup>

defineProps({
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  }
})

const today = new Date(this.year, this.month, 0);
const numDays = today.getDate();
console.log(numDays);
</script>

<template>
  <div>
    <div class="week-header">
      <h2 class="week-title">Sunday</h2>
      <h2 class="week-title">Monday</h2>
      <h2 class="week-title">Tuesday</h2>
      <h2 class="week-title">Wednesday</h2>
      <h2 class="week-title">Thursday</h2>
      <h2 class="week-title">Friday</h2>
      <h2 class="week-title">Saturday</h2>
    </div>

  </div>

</template>

<style scoped>
.week-header{
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}
.week-title{
  color: #673C4F;
  background-color: white;
  font-size: 14px;
  width: 75px;
  text-align: center;
}

</style>