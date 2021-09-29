<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
  /* font-family: "Avenir", Helvetica, Arial, sans-serif; */
  font-family: "PingFang SC", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* background: #f1f4f9; */
}

* {
  margin: 0;
  padding: 0;
}

.el-table--fit th.gutter {
  background: #e2e2e2;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-thumb {
  background-color: #9e9fa5;
  border-radius: 5px;
}

.el-table .warning-row {
  background: rgb(97, 69, 16);
}
</style>
