<template>
  <div>
    {{ message }}
  </div>
</template>

<script>

export default {
  name: 'App',
  data: () => {
    return {
      message: 'hello World'

    }
  }
}
</script>

<style lang="scss">
#app, body {
  margin: 0;
  padding: 0;
}
</style>
