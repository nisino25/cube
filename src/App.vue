<template>

<body>
  <div class="wrapper"   v-if="sessionGoal === 25">

    <div class="menu-nav">
      <nav>
        <button class="menu-btn">Timer</button>
        <button class="menu-btn">Stats</button>
        <button class="menu-btn">Logout</button>
        
      </nav>
      
    </div>


    <div class="graph" >
      <button>Change the period</button>
      <div class="actual-graph">
        <!-- <span>{{displayName}}</span> -->

        <table v-if="results.length !== 0">
          <thead>
            <tr>
              <th>No.</th>
              <th>Time</th>
              <th>AO5</th>
              <th>AO12</th>
            </tr>
          </thead>
          

          <tbody v-for="(result, i) in results" :key="i" >
            <tr v-if="i < 5" >
              <td><strong>{{results.length - i}}. </strong></td>
              <td>{{results[(results.length - i) -1].outcome}}</td>
              <td>{{AO5Data[i]}}</td>
              <td>{{AO12Data[i]}}</td>
              <td @click='deleteData((results.length - i) -1)' class="xMark">X</td>
            </tr>  

          </tbody>


        </table>


      </div>
    </div>


    <div class="timer" v-if="!running"  >
      <div class="display">
        <!-- <a class="button-one" title="Relevant Title" href="#">Click Me</a><a class="button-two" title="Relevant Title" href="#">No Click Me</a> -->
        <div class='timer-buttons' >
          <!-- <button class="timer-menu" @click="whichInput = 'default'">Default</button>
          <button class="timer-menu" @click="whichInput = 'typing'">Typing</button> -->
        </div>
        <div class="random-algorithm" style="textAlgin:center">
          <span>{{randomAlg}}</span>
          <button class="shuffle" @click="algShuffle()">Shuffle</button>
        </div>

        <div v-if="whichInput === 'typing'">
          <form v-on:submit.prevent="inputTime()" >
            <input type="number" step="0.01" v-model="currentTime"  placeholder="Enter your time">
          </form>
        </div>
        <div v-else>
          <div id="clock">
            <span class="actual-timer" @click="csTimer()"   v-if="!running" >{{ time }}</span>
            

          </div>

        </div>

      </div>

      <table v-if="sessionCount !== 0">
        <thead>
          <tr>
            <th></th>
            <th>Time</th>
            <th>AO5</th>
            <th>AO12</th>
          </tr>
        </thead>
        <tbody  v-if="sessionCount !== 0" >
          <tr>
            <td><strong>Current</strong></td>
            <td>{{results[(results.length) -1].outcome}}</td>
            <td>{{AO5Data[0]}}</td>
            <td>{{AO12Data[0]}}</td>
            <td @click='deleteData((results.length) -1)' class="xMark">X</td>
          </tr>  
          <tr>
            <td><strong>Best</strong></td>
            <td>{{bestTime}}</td>
            <td></td>
            <td></td>
            <!-- <td @click='deleteData((results.length) -1)' class="xMark">X</td> -->
          </tr>  

        </tbody>
      </table>


      <div class="stats">
        <div  class="session-goal">
            <!-- 右側の180度分の領域 -->
            <div class="square" style="right:0">
              <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleSession">
                <div :class="[sessionCount <= sessionGoal ? 'circle-white': 'circle-blue']" class="circle"  style="left:0;"></div>
              </div>
            </div>
            <!-- 左側の180度分の領域 -->
            <div class="square" style="left:0;">
              <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleSession">
                <div :class="[sessionCount <= sessionGoal ? 'circle-white': 'circle-blue']" class="circle" style="right:0;">
                </div>
              </div>
            </div>


            <div class="session-goal-text">
              <span v-if="sessionCount <= sessionGoal"> {{ sessionCount}}</span>
              <span v-else> {{ sessionCount}}</span>
            </div>
        </div>

        <div class="total-goal">
          <!-- 右側の180度分の領域 -->
            <div class="square" style="right:0">
              <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleTotal">
                <div :class="[totalCount <= totalGoal? 'circle-white': 'circle-blue']" class="circle"  style="left:0;"></div>
              </div>
            </div>
            <!-- 左側の180度分の領域 -->
            <div class="square" style="left:0;">
              <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleTotal">
                <div :class="[totalCount <= totalGoal? 'circle-white': 'circle-blue']" class="circle" style="right:0;">
                </div>
              </div>
            </div>


            <div class="session-goal-text">
              <span v-if="totalCount <= totalGoal"> {{totalCount}} times</span>
              <span v-else> {{totalCount}}</span>
            </div>

        </div>

        <div class="daily-goal"></div>
        <div class="weekly-goa"></div>
        <!-- <div class="monthly-goal"></div> -->
        
      </div>
    </div>
    <div class="timer" @click="csTimer()" v-else>
      <span class="solving"  >Solving</span>
    </div>

    

  </div>

  <div v-if="sessionGoal === 27">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Register</div>
            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{error}}</div>
              <form action="#" @submit.prevent="register">

                <div class="form-group row">
                  <label for="name" class="col-md-4 col-form-label text-md-right">Name</label>

                  <div class="col-md-6">
                    <input id="name" type="name" class="form-control" name="name" value required autofocus v-model="form.name"/>
                  </div>
                </div>

                <div class="form-group row">
                  <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                  <div class="col-md-6">
                    <input id="email" type="email" class="form-control" name="email" value required autofocus v-model="form.email" />
                  </div>
                </div>

                <div class="form-group row">
                  <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                  <div class="col-md-6">
                    <input id="password" type="password" class="form-control" name="password" required v-model="form.password" />
                  </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary">Register</button>
                  </div>
                </div>
              </form>


            </div>
          </div>
        </div>
      </div>
    </div>


  </div>

  <div v-if="sessionGoal === 26">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">Login</div>
            <div class="card-body">
              <div v-if="error" class="alert alert-danger">{{error}}</div>
              <form action="#" @submit.prevent="login">
                <div class="form-group row">
                  <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>

                  <div class="col-md-6">
                    <input
                      id="email"
                      type="email"
                      class="form-control"
                      name="email"
                      value
                      required
                      autofocus
                      v-model="form.email"
                    />
                  </div>
                </div>

                <div class="form-group row">
                  <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                  <div class="col-md-6">
                    <input
                      id="password"
                      type="password"
                      class="form-control"
                      name="password"
                      required
                      v-model="form.password"
                    />
                  </div>
                </div>

                <div class="form-group row mb-0">
                  <div class="col-md-8 offset-md-4">
                    <button type="submit" class="btn btn-primary">Login</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>

</body>

</template>

<script>
import firebase from "firebase";
var moment = require('moment'); // require
moment().format(); 

export default {
  data(){
    return{
      results: [],
      reverseResults: [],
      message:"Hello",
      imadesho: false,


      AOSum: null, 
      AOMax: null,
      AOMin: null,
      AOAve: null,
      AOData: null,

      currentTime: null,

      callCount: 0,
      AOLoopCount: null,

      AO5Data: null,
      AO12Data: null,

      sessionGoal: 25,
      sessionCount: 0,
      totalGoal: 100,
      totalCount: 0,


      whichInput: 'default',
      

      time: '0.000',
      timeBegan: null,
      timeStopped: null,
      stoppedDuration: 0,
      started: null,
      running: false,



      randomAlg: null,
      randomNum: null,
      lastLetter: '',
      currentLetter: null,
      additionalletter: null,
      ShuffleCount: 0,
      flag: false,


      bestTime: null,
      WholeDataOfOutcome: [],
      WholeDataOfFive: [],
      WholeDataOfTwelve: [],

      form: {
        email: "",
        password: ""
      },


    }
  },
  methods:{
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then(() => {});
        })
        .catch(err => {
          this.error = err.message;
        });
    },
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        // .then(data => {
        //   this.$router.replace({ name: "Dashboard" });
        // })
        .catch(err => {
          this.error = err.message;
        });
    },


    algShuffle(){
      // console.log('shuffling')
      
      this.randomNum = Math.random(this.randomNum);
      this.ShuffleCount = 0;
      this.randomAlg = ''


      while(this.ShuffleCount < 22){

        this.randomNum = Math.random(this.randomNum);
        // this.randomNum = 0.34
        // console.log(this.randomNum)

        // switch(this.randomNum){
        //   case (this.randomNum < 0.166):
        //     this.currentLetter = 'R'
        //     break;

        //   case (this.randomNum < 0.333):
        //     this.currentLetter = 'L'
        //     break;

        //   case (this.randomNum < 0.464):
        //     this.currentLetter = 'U'
        //     break;
          
        //   case (this.randomNum < 0.664):
        //     this.currentLetter = 'D'
        //     break;
          
        //   case (this.randomNum < 0.83):
        //     this.currentLetter = 'F'
        //     break;
          
        //   case (this.randomNum <= 1):
        //     this.currentLetter = 'B'
        //     break;
        // }

        if(this.randomNum < 0.166){
          this.currentLetter = 'R'
        }else if(this.randomNum < 0.333){
          this.currentLetter = 'L'
        }else if(this.randomNum < 0.464){
          this.currentLetter = 'U'
        }else if(this.randomNum < 0.664){
          this.currentLetter = 'D'
        }else if(this.randomNum < 0.83){
          this.currentLetter = 'F'
        }else if(this.randomNum <= 1 ){
          this.currentLetter = 'B'
        }

        // console.log(this.currentLetter)

        if(this.currentLetter !== this.lastLetter){
          // console.log(this.currentLetter)

          this.lastLetter = this.currentLetter;
          this.randomNum = Math.random(this.randomNum);

          if(this.randomNum < 0.5){ 
            this.additionalletter = '2 '
          }else if(this.randomNum < 0.75){
            this.additionalletter = `' `
          }else if(this.randomNum <= 1){
            this.additionalletter = ' '
          }
          // console.log(this.additionalletter)
          
          this.randomAlg = this.randomAlg+ this.currentLetter + this.additionalletter

          this.ShuffleCount++;
        }
      
        
        
      }
      // r,l,u,d,f,b

      switch(this.randomNum){
        case (this.randomNum < 0.166):
          this.currentLetter = 'R'
          break;

        case (this.randomNum < 0.333):
          this.currentLetter = 'L'
          break;

        case (this.randomNum < 0.464):
          this.currentLetter = 'U'
          break;
         
        case (this.randomNum < 0.664):
          this.currentLetter = 'D'
          break;
         
        case (this.randomNum < 0.83):
          this.currentLetter = 'F'
          break;
         
        case (this.randomNum < 1):
          this.currentLetter = 'B'
          break;
      }

      





    },

    inputTime(){
      
      if(this.currentTime >= 100 && this.currentTime <= 1000 ){
        this.currentTime = this.currentTime/10
      }else if(this.currentTime >= 100 && this.currentTime <= 10000 ){
        this.currentTime = this.currentTime/100
      }

      this.results.push({time: Date.now(),outcome: Number(this.currentTime) });
      this.currentTime = null

      this.sessionCount++;
      this.totalCount = this.results.length;
      console.log(this.results.length)
      this.updateAO();
      
      // console.log(this.results)
    },

    getAO(whichAO,index){
      this.callCount++;
      // console.log(index);
      // console.log(this.callCount)
      // console.log(`Ao:${whichAO} ind:${index}, count:${this.callCount}`)
      

      if(index < whichAO -1){
        return;
      }
      // index = index -1
      this.AOLoopCount = 1;
      this.AOSum = this.results[index].outcome
      // console.log(index)
      // this.AOData = [this.results[index].outcome];
      this.AOData = [this.results[index].outcome];
      
      while(this.AOLoopCount < whichAO){
        this.AOData.push(this.results[index - this.AOLoopCount].outcome)
        this.AOSum = this.AOSum + this.results[index - this.AOLoopCount].outcome


        this.AOLoopCount++;
      }
      // let data = [num,this.results[index -1].outcome,this.results[index -2].outcome, this.results[index -3].outcome, this.results[index -4].outcome]

      // this.AOSum = 0
      this.AOMax = Math.max( ...this.AOData)
      this.AOMin = Math.min( ...this.AOData)
      

      
      this.AOSum = this.AOSum - this.AOMin - this.AOMax;
      this.AOAve = this.AOSum / (whichAO - 2)
      this.AOAve = (this.AOAve).toFixed(2)
      
      if(whichAO === 5){
        // console.log(this.callCount)
        // console.log(index)
        // console.log(this.AOData)
        // console.log(this.results)
        // this.callCount++;
      }
      
      return  this.AOAve ;

    },
    practice(){
      // array.splice(index, 1);
      console.log(this.results)
      this.results.splice(13,1);
      console.log(this.results)
    },
    updateAO(){
      let i = 0
      this.AO5Data = [];
      this.AO12Data = [];
      if(this.results.length < 5){
        return;
      }
      while(i < 5){
        this.AO5Data.push( this.getAO(5,this.results.length - i -1))
        // console.log(this.results.length - i -1)
        i++;
      }

      i = 0
      // this.AO12Data = [];
      if(this.results.length < 12){
        return;
      }
      while(i < 12){
        this.AO12Data.push( this.getAO(12,this.results.length - i -1))
        // console.log(this.results.length - i -1)
        i++;
      }

      
    },
    deleteData(num){
      let r= confirm(`Deleting No${num+1}. ${this.results[num].outcome}s...`);
      if(!r){
        this.movingRobber = false;
        return;
      }
      console.log(num)
      this.results.splice(num,1);
      this.updateAO()
      this.totalCount = this.results.length
      this.getTheBest();
      // localStorage.results = this.results;
      // console.log('updating')
    },

    getTheBest(){
      let countBest = 0
      this.WholeDataOfOutcome = [];
      this.WholeDataOfFive = [];
      this.WholeDataOfTwelve = [];

      while( countBest < this.results.length ){
        this.WholeDataOfOutcome.push(this.results[countBest].outcome)
        // this.AOData.push(this.results[index - this.AOLoopCount].outcome)
        countBest++
      }

      this.bestTime = Math.min( ...this.WholeDataOfOutcome)
      // console.log(this.WholeDataOfOutcome)
    },


    csTimer(){
      if(this.running){
        this.running = false;
        this.timeStopped = new Date();
        clearInterval(this.started);
        
        this.results.push({time: Date.now(),outcome: Number(this.time) });
        // this.currentTime = null

        this.sessionCount++;
        this.updateAO(); 
        this.totalCount = this.results.length;
        this.getTheBest();
        // localStorage.results = this.results;
        console.log('updating')


        return;
      }else{
        clearInterval(this.started);
        this.stoppedDuration = 0;
        this.timeBegan = null;
        this.timeStopped = null;
        this.time = "0.000";


        if(this.running) return;
        if (this.timeBegan === null) {
          this.reset();
          this.timeBegan = new Date();
        }

        if (this.timeStopped !== null) {
          this.stoppedDuration += (new Date() - this.timeStopped);
        }

        this.started = setInterval(this.clockRunning, 10);	
        this.running = true;
        return;
      }

    },

    incrementCount(){
      this.totalCount = this.results.length;
      this.sessionCount++;

    },




    start() {
      if(this.running) return;
      
      if (this.timeBegan === null) {
        this.reset();
        this.timeBegan = new Date();
      }

      if (this.timeStopped !== null) {
        this.stoppedDuration += (new Date() - this.timeStopped);
      }

      this.started = setInterval(this.clockRunning, 10);	
      this.running = true;
    },

    stop() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
    },

    reset() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = "00:00:00.000";
    },

    clockRunning(){
      let currentTime = new Date(),
      timeElapsed = new Date(currentTime - this.timeBegan - this.stoppedDuration),
      // hour = timeElapsed.getUTCHours(),
      // min = timeElapsed.getUTCMinutes(),
      sec = timeElapsed.getUTCSeconds(),
      ms = timeElapsed.getUTCMilliseconds();

      this.time = 
        // this.zeroPrefix(hour, 2) + ":" + 
        // this.zeroPrefix(min, 2) + ":" + 
        this.zeroPrefix(sec, 2) + "." + 
        this.zeroPrefix(ms, 2);
      this.time = Number(this.time)
    },

    zeroPrefix(num, digit) {
      var zero = '';
      for(var i = 0; i < digit; i++) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },






    downTest(){
      console.log('down')
    },
    upTest(){
      console.log('up')
    },

    
  },
  created() {
    // console.log('created called.');
    // this.results = []


    this.updateAO();
    this.algShuffle();

    
    


    // this.reverseRe sults = this.results.reverse()
  },
  mounted() {
    if (localStorage.results) {
      this.results = JSON.parse(localStorage.results);  
      console.log('getting data')
      this.totalCount = this.results.length
      this.updateAO();
      // localStorage.results = []
    }
  },
  watch: {
    sessionCount: function() {
      console.log('hey')
      localStorage.results = JSON.stringify(this.results);
    }
  },
  computed:{
    textLength(){
      return this.message.length;
    },
    currentAngle(){
      // console.log(Math.floor(360*this.textLength/144));
      return Math.floor(360*this.textLength/144);
    },  
    rightAngle(){
      let angle = Math.min(this.currentAngle, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngle(){
      let angle = Math.min(Math.max(this.currentAngle-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    styles(){
      let width = this.message.length/144*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },
    


    angleSession(){
      return Math.floor(360*this.sessionCount/this.sessionGoal);
    },
    rightAngleSession(){
      let angle = Math.min(this.angleSession, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleSession(){
      let angle = Math.min(Math.max(this.angleSession-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesSession(){
      let width = this.sessionCount.length/this.sessionGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },



    angleTotal(){
      return Math.floor(360*this.totalCount.length/this.totalGoal);
      // return 0;
    },
    rightAngleTotal(){
      let angle = Math.min(this.angleTotal, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleTotal(){
      let angle = Math.min(Math.max(this.angleTotal-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesTotal(){
      let width = this.totalCount.length/this.totalGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },






    formattedElapsedTime() {
      const date = new Date(null);
      date.setSeconds(this.elapsedTime / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(":") - 2, 8);
    }



  }, 
  state: {
    user: {
      loggedIn: false,
      data: null
    }
  },
  getters: {
      user(state){
        return state.user
      }
    },
    mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    }
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
.graph{
  position: absolute;
  width: 100%;
  top: 12.5%;
  height: 32%;
  /* width: 60em; */
  /* background-color: #304455; */
  border: solid 1px black;
}
.timer{
  position: absolute;
  width: 100%;

  top: 48%;
  height: 50%;
  /* width: 60em; */
  border: solid 1px black;
}

.stats{
  position: absolute;
  width: 100%;

  bottom: 0;
  height: 35%;
  background-color: white;
  /* width: 60em; */
  /* border: solid 1px black; */
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

.timer-menu{
  outline:none;
  padding: 8px;
  padding-right: 15px;
  padding-left: 15px;
  font-size: 80%;
  background-color: #304455;
  color:#E8E8E8 ;
  border: solid 1px grey;
}

.timer-buttons{
  text-align: center;
  margin-top: 3%;
  margin-bottom: 3%;
}



.graph table{
  position: absolute;
  bottom: 4%;
  width:100%;
  text-align: center;
  font-size: 80%;
}

.timer table{
  position: absolute;
  top: 45%;
  width:100%;
  text-align: center;
  font-size: 80%;
}

table td{
  border: 1px solid grey;
}

.xMark{
  color: #cc0000
}



.square{
  position:absolute;
  width:25px;
  height:50px;
  overflow:hidden;
}


.circle{
  position:absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /*background-color: green;*/
  /* border:5px solid red; */
  box-sizing: border-box;
}

.circle-white{
  border:5px solid #E8E8E8 ;;
}

.circle-blue{
  border:5px solid #304455;
}




.session-goal{
  position: relative;
  position:absolute;
  width:50px;
  height:50px;
  left: 0;

}
.session-goal-text{
  position: relative;
  position:absolute;
  width:50px;
  height:50px;
  left: 0;

}



.total-goal{
  position: relative;
  position:absolute;
  width:50px;
  height:50px;
  right: 0;

}
.total-goal-text{
  position: relative;
  position:absolute;
  width:50px;
  height:50px;
  right: 0;

}











.random-algorithm{
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
}

.shuffle{
  position: absolute;
  right:5%;
}






#clock {
  order: 0;
  flex: 0 1 auto;
  align-self: center;

  color: black;
  /* //text-shadow: 0px 0px 25px $color; */
}



.actual-timer {
  margin-top: 10%;
  position: absolute;
  font-size: 6em;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: -20%;
  /* background-color:white; */
  /* padding-bottom: 5%; */
}

.solving{
  position: absolute;
  margin-top: 30%;
  font-size: 6em;
  left: 0;
  right: 0;
  text-align: center;
}






</style>

