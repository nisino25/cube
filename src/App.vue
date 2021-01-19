<template>
<body>
  <div class="wrapper">

    <div>
      <nav class="menu-nav">
        <button class="menu-btn">Timer</button>
        <button class="menu-btn">Stats</button>
        <button class="menu-btn">Login</button>
      </nav>
      
    </div>

    <div class="timer">
      <div class="display">
        <button>enter</button>
      </div>
      <div class="stats">
        <div class="last24"></div>
        <div class="total"></div>
      </div>
    </div>
    <div class="graph">
      <button>Change the period</button>
      <div class="actual-graph"></div>
    </div>
  </div>
</body>
</template>

<script>
// import { auth, AuthStore, db } from './main.js'
// import {AuthStore,auth} from './main.js'


export default {
  
  methods:{


  },
  
  name: 'App',
}
</script>



<style>
/* #E8E8E8 grey */
/* #4fc08d green */
body {
  margin:0;
  padding:0;
  
  background-color: #4fc08d;
  /* background-color: red; */
}
.wrapper{
  position: absolute;
  left: 5%;
  width: 90%;
  height: 100%;

}
.menu{
  position: absolute;
  width: 100%;
  top: 2.5%;
  height: 10%;
}
.timer{
  position: absolute;
  width: 100%;
  top: 12.5%;
  height: 25%;
  /* width: 60em; */
  background-color: red;
}
.graph{
  position: absolute;
  width: 100%;
  top: 42.5%;
  height: 50%;
  /* width: 60em; */
  background-color: #304455;
}




.menu-nav{
  text-align:center;
  margin-top: 5%;
}

.menu-btn{
  outline:none;
  padding: 10px;
  padding-right: 30px;
  padding-left: 30px;
  font-size: 120%;
  background-color: #304455;
  color:#E8E8E8 ;
  border: solid 1px grey;
}


</style>
