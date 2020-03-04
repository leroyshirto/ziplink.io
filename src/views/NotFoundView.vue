<template>
  <section class="container mt-30">
    <b-card>
      <div class="text-center">
        <h2>Sorry this Page is not one of ours. Try <router-link :to="{name: 'Home'}">here...</router-link></h2>
      </div>
    </b-card>
  </section>
</template>

<style scoped lang="scss">


.mt-30 {
  margin-top: 30px;
}

.card {
  background: #fff;
  border: none;
  box-shadow: 0px 5px 42px 0px rgba(35, 70, 107, 0.08);
  border-radius: 0.8rem;
}

.card:hover {
  box-shadow: 0px 25px 42px 0px rgba(35, 70, 107, 0.24);
}
</style>
