<template>
<body>
  <div class="wrapper">

    <div class="menu-nav">
      <nav>
        <button class="menu-btn" @click="menu='timer'">Timer</button>
        <button class="menu-btn" @click="menu='stats'">Stats</button>
        <button class="menu-btn" @click="menu='settings'">Settings</button>
      </nav>
      
    </div>

    <div class="menu-timer" v-if="menu=== 'timer' && !running ">
      <div class="graph" >
        <span  style="position: absolute;right:5%; margin-top: 1%; color: red;" @click="clearTheLocal()">X</span>
        <div class="actual-graph">
          

          <!-- <span>{{displayName}}</span> -->

          <table v-if="results.length !== 0">
            <thead>
              <tr>
                <th>No.</th>
                <th>Time</th>
                <th>AO5</th>
                <th>AO12</th>
                <th>Delete</th>
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

        <table v-if="totalCount !== 0">
          <thead>
            <tr>
              <th></th>
              <th>Time</th>
              <th>AO5</th>
              <th>AO12</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody  v-if="totalCount !== 0" >
            <tr>
              <td><strong>Last</strong></td>
              <td>{{results[(results.length) -1].outcome}}</td>
              <td>{{AO5Data[0]}}</td>
              <td>{{AO12Data[0]}}</td>
              <td @click='deleteData((results.length) -1)' class="xMark">X</td>
.
            </tr>  
            <tr>
              <td><strong>Best</strong></td>
              <td>{{bestTime}}</td>
              <td v-if="results.length>= 5">{{Math.min(...AO5Data)}}</td>
              <td v-if="results.length>= 12"> {{Math.min(...AO12Data)}}</td>
              <!-- <td @click='deleteData((results.length) -1)' class="xMark">X</td> -->
            </tr>  

          </tbody>
        </table>


        <div class="stats">


          <hr class="counter-left">
          <span class="counter-label">Counter</span>
          <hr class="counter-right">

          <div  class="session-goal">
              <!-- 右側の180度分の領域 -->
              <div class="square" style="right:0">
                <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleSession">
                  <div :class="[sessionCount < sessionGoal ? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                </div>
              </div>
              <!-- 左側の180度分の領域 -->
              <div class="square" style="left:0;">
                <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleSession">
                  <div :class="[sessionCount < sessionGoal ? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                  </div>
                </div>
              </div>


              <div class="session-goal-text">
                <span v-if="sessionCount <= sessionGoal"> {{ sessionCount}}</span>
                <span v-else> {{ sessionCount}}</span>
              </div>

              <div class="goal-label">Session</div>
          </div>

          <div class="daily-goal">
              <div class="square" style="right:0">
                <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleDaily">
                  <div :class="[dailyCount <= dailyGoal ? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                </div>
              </div>

              <div class="square" style="left:0;">
                <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleDaily">
                  <div :class="[dailyCount <= dailyGoal? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                  </div>
                </div>
              </div>


              <div class="session-goal-text">
                <span v-if="dailyCount <= dailyGoal"> {{dailyCount}} </span>
                <span v-else> {{dailyCount}}</span>
              </div>

              <div class="goal-label">Daily</div>
          </div>

          <div class="weekly-goal">
              <div class="square" style="right:0">
                <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleWeekly">
                  <div :class="[weeklyCount <= weeklyGoal ? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                </div>
              </div>

              <div class="square" style="left:0;">
                <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleWeekly">
                  <div :class="[weeklyCount <= weeklyGoal? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                  </div>
                </div>
              </div>


              <div class="session-goal-text">
                <span v-if="weeklyCount <= weeklyGoal"> {{weeklyCount}} </span>
                <span v-else> {{weeklyCount}}</span>
              </div>

              <div class="goal-label">Weekly</div>
          </div>

          <div class="total-goal">
              <div class="square" style="right:0">
                <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleTotal">
                  <div :class="[results.length <= totalGoal? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                </div>
              </div>

              <div class="square" style="left:0;">
                <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleTotal">
                  <div :class="[results.length <= totalGoal? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                  </div>
                </div>
              </div>


              <div class="session-goal-text">
                <span v-if="results.length <= totalGoal"> {{results.length}} </span>
                <span v-else> {{results.length}}</span>
              </div>

              <div class="goal-label">Total</div>

          </div>
          
        </div>
      </div>
      <!-- <div class="timer" @click="csTimer()" v-else>
        <span class="solving"  >Solving</span>
      </div> -->
    </div>

    <div class="menu-timer" v-else>
      <div class="solving-now" @click="csTimer()" >
        <span class="solving-now-span"  >Solving</span>
      </div>
    </div>
    

    <div class="menu-stats" v-if="menu==='stats'">
      <div class="stats-table">

        <table v-if="results.length !== 0">
          <thead>
            <tr>
              <th>No.</th>
              <th>Time</th>
              <th>AO5</th>
              <th>AO12</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody v-for="(result, i) in results" :key="i" >
            <tr>
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

    <div class="menu-setting" v-if="menu==='settings'">
      <div class="settings">
        <div class="form-style-2">
          <div class="form-style-2-heading">Change your goals</div>
          <form action="" method="post">
            <label for="field1"><span>Session Goal <span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="sessionGoal" /></label>
            <label for="field1"><span>Daily Goal <span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="dailyGoal" /></label>
            <label for="field1"><span>Weekly Goal <span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="weeklyGoal" /></label>
            <label for="field1"><span>Total Goal<span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="totalGoal" /></label>

            <!-- <label><span > </span><input class="menu-btn" style="marginTop:5%"  type="submit" value="Update" /></label> -->
          </form>
        </div>
      </div>
      <div class="stats-settings">


          <hr class="counter-left-settings">
          <span class="counter-label-settings">Counter</span>
          <hr class="counter-right-settings">
            <div  class="session-goal">
                <!-- 右側の180度分の領域 -->
                <div class="square" style="right:0">
                  <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleSession">
                    <div :class="[sessionCount < sessionGoal ? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                  </div>
                </div>
                <!-- 左側の180度分の領域 -->
                <div class="square" style="left:0;">
                  <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleSession">
                    <div :class="[sessionCount < sessionGoal ? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                    </div>
                  </div>
                </div>


                <div class="session-goal-text">
                  <span v-if="sessionCount <= sessionGoal"> {{ sessionCount}}</span>
                  <span v-else> {{ sessionCount}}</span>
                </div>

                <div class="goal-label">Session</div>
            </div>

            <div class="daily-goal">
                <div class="square" style="right:0">
                  <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleDaily">
                    <div :class="[dailyCount <= dailyGoal ? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                  </div>
                </div>

                <div class="square" style="left:0;">
                  <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleDaily">
                    <div :class="[dailyCount <= dailyGoal? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                    </div>
                  </div>
                </div>


                <div class="session-goal-text">
                  <span v-if="dailyCount <= dailyGoal"> {{dailyCount}} </span>
                  <span v-else> {{dailyCount}}</span>
                </div>

                <div class="goal-label">Daily</div>
            </div>

            <div class="weekly-goal">
                <div class="square" style="right:0">
                  <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleWeekly">
                    <div :class="[weeklyCount <= weeklyGoal ? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                  </div>
                </div>

                <div class="square" style="left:0;">
                  <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleWeekly">
                    <div :class="[weeklyCount <= weeklyGoal? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                    </div>
                  </div>
                </div>


                <div class="session-goal-text">
                  <span v-if="weeklyCount <= weeklyGoal"> {{weeklyCount}} </span>
                  <span v-else> {{weeklyCount}}</span>
                </div>

                <div class="goal-label">Weekly</div>
            </div>

            <div class="total-goal">
                <div class="square" style="right:0">
                  <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngleTotal">
                    <div :class="[results.length <= totalGoal? 'circle-before': 'circle-blue']" class="circle"  style="left:0;"></div>
                  </div>
                </div>

                <div class="square" style="left:0;">
                  <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngleTotal">
                    <div :class="[results.length <= totalGoal? 'circle-before': 'circle-blue']" class="circle" style="right:0;">
                    </div>
                  </div>
                </div>


                <div class="session-goal-text">
                  <span v-if="results.length <= totalGoal"> {{results.length}} </span>
                  <span v-else> {{results.length}}</span>
                </div>

                <div class="goal-label">Total</div>

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
var soundStart = new Audio(`/audio/263133__pan14__tone-beep.m4a`);
// var sound10Seconds = new Audio(`/audio/413690__splatez07__click.m4a`);


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
      totalGoal: 1000,
      totalCount: 0,
      dailyGoal: 150,
      dailyCount: 0,
      weeklyGoal: 500,
      weeklyCount: 0,
      startOfTheDay: new Date().setHours(0,0,0,0),
      timeStampsList: [],
      prevMonday: 0,


      whichInput: 'default',
      menu: 'timer',
      goalData: {
        session: null,
        daily: null,
        weekly: null,
        total: null,
      },
      

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
      bestAO5: null,
      bestAO12: null,
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

    checkCounts(){
      let i = 0;
      this.timeStampsList = []
      while(i < this.results.length){
        this.timeStampsList.push(this.results[i].time)
        if(this.results[i].time > this.startOfTheDay){
          this.dailyCount++;
        }
        if(this.results[i].time > this.prevMonday){
          this.weeklyCount++;
        }
        i++;
      }
      // console.log(this.timeStampsList);
    },
    getThePreviousMonday(){
      var date = new Date();
      var day = date.getDay();
      this.prevMonday = new Date();
      if(date.getDay() == 0){
        this.prevMonday.setDate(date.getDate() - 7);
      }
      else{
        this.prevMonday.setDate(date.getDate() - (day-1));
      }
      this.prevMonday.setHours(0,0,0,0),
      this.prevMonday = new Date(this.prevMonday).setHours(0,0,0,0)
    },
    clearTheLocal(){
      // sound10Seconds.play()
      let r= confirm('Are you sure you want to do clear the data?');
      if(!r){
        return;
      }
      this.results = [];
      this.sessionCount++
      this.sessionCount= 0
      localStorage.results = JSON.stringify(this.results);
      this.totalCount = 0;

    },
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
      while(i < this.results.length -4){
        this.AO5Data.push( this.getAO(5,this.results.length - i -1))
        // console.log(this.results.length - i -1)
        i++;
      }

      i = 0
      // this.AO12Data = [];
      if(this.results.length < 12){
        return;
      }
      while(i < this.results.length -11){
        this.AO12Data.push( this.getAO(12,this.results.length - i -1))
        // console.log(this.results.length - i -1)
        i++;
      }

      // console.log(this.AO5Data)
      // console.log(this.AO12Data)

      
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
      localStorage.results = JSON.stringify(this.results);
      this.sessionCount--;
      this.dailyCount--;
      this.weeklyCount--;
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
        this.dailyCount++;
        this.weeklyCount++
        this.updateAO(); 
        this.totalCount = this.results.length;
        this.getTheBest();
        // localStorage.results = this.results;
        console.log('updating')


        return;
      }else{
        soundStart.play();
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
      this.getTheBest();
      this.getThePreviousMonday();
      this.checkCounts();
      // console.log(this.dailyCount)
      
      // console.log(this.startOfTheDay)
      // console.log(this.weeklyCount)
    }
    if(localStorage.goalData){
      this.goalData = JSON.parse(localStorage.goalData);
      if(this.goalData.session > 0){
        this.sessionGoal = this.goalData.session
      }
      if(this.goalData.daily > 0){
        this.dailyGoal = this.goalData.daily
      }
      if(this.goalData.weekly > 0){
        this.weeklyGoal = this.goalData.weekly
      }
      if(this.goalData.total > 0){
        this.totalGoal = this.goalData.total
      }
    }
  },

  watch: {
    sessionCount: function() {
      localStorage.results = JSON.stringify(this.results);
    },
    sessionGoal: function(){
      this.sessionGoal = parseInt(this.sessionGoal)
      this.goalData.session = this.sessionGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    dailyGoal: function(){
      this.dailyGoal = parseInt(this.dailyGoal)
      this.goalData.daily = this.dailyGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    weeklyGoal: function(){
      this.weeklyGoal = parseInt(this.weeklyGoal)
      this.goalData.weekly = this.weeklyGoal
      localStorage.goalData = JSON.stringify(this.goalData);
    },
    totalGoal: function(){
      this.totalGoal = parseInt(this.totalGoal)
      this.goalData.total = this.totalGoal
      localStorage.goalData = JSON.stringify(this.goalData);
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
      return Math.floor(360*this.results.length/this.totalGoal);
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
      let width = this.results.length.length/this.totalGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },

    angleDaily(){
      return Math.floor(360*this.dailyCount/this.dailyGoal);
      // return 0;
    },
    rightAngleDaily(){
      let angle = Math.min(this.angleDaily, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleDaily(){
      let angle = Math.min(Math.max(this.angleDaily-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesDaily(){
      let width = this.dailyCount/this.dailyGoal*100
      return {
        "border": "5px solid red",
        "width": width + '%'
      }
    },




    angleWeekly(){
      return Math.floor(360*this.weeklyCount/this.weeklyGoal);
      // return 0;
    },
    rightAngleWeekly(){
      let angle = Math.min(this.angleWeekly, 180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    leftAngleWeekly(){
      let angle = Math.min(Math.max(this.angleWeekly-180, 0),180);
      return {
        "transform": "rotate(" + angle + "deg)",
      }
    },
    stylesWeekly(){
      let width = this.weeklyCount/this.weeklyGoal*100
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
.menu-nav{
  text-align:center;
  margin-top: 2.5%;
  font-size: 75%;
}
.graph{
  position: absolute;
  width: 100%;
  top: 8.5%;
  height:28%;
  /* width: 60em; */
  /* background-color: #304455; */
  border: solid 1px black;
}
.timer{
  position: absolute;
  width: 100%;

  top: 39%;
  height: 58%;
  /* width: 60em; */
  border: solid 1px black;
}
.stats{
  position: absolute;
  width: 100%;

  bottom: 0;
  height: 25%;
  /* background-color: white; */
  /* width: 60em; */
  /* border: solid 1px black; */
}
.stats-settings{
  position: absolute;
  width: 100%;

  bottom: 15%;
  height: 25%;
}
.stats-table{
  position: relative;
  width: 100%;

  /* top: 48%; */
  margin-top: 5%;
  bottom: 20%;
  /* width: 60em; */
  border: solid 1px black;
}


.counter-label{
  font-size: 125%;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: -30%
}
.counter-right{
  width: 35%;
  background-color:black;
  height: 1px;
  border: none;
  right: 3%;
  top: -24%;
  text-decoration:none;
  position: absolute;
}
.counter-left{
  width: 35%;
  background-color:black;
  height: 1px;
  border: none;
  left: 3%;
  top: -24%;
  text-decoration:none;
  position: absolute;
}



.counter-label-settings{
  font-size: 125%;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: -10%
}
.counter-right-settings{
  width: 35%;
  background-color:black;
  height: 1px;
  border: none;
  right: 3%;
  top: -7%;
  text-decoration:none;
  position: absolute;
}
.counter-left-settings{
  width: 35%;
  background-color:black;
  height: 1px;
  border: none;
  left: 3%;
  top: -7%;
  text-decoration:none;
  position: absolute;
}

.settings{
  position: absolute;
  width: 100%;
  top: 12.5%;
  height: 40%;
  /* width: 60em; */
  /* background-color: #304455; */
  border: solid 1px black;
}

.stats-table table{
  /* position: absolute; */
  bottom: 4%;
  width:100%;
  text-align: center;
  font-size: 80%;
}






.form-style-2{
	max-width: 500px;
	padding: 20px 12px 10px 20px;
  font-size: 100%;
	/* font: 13px Arial, Helvetica, sans-serif; */
}
.form-style-2-heading{
	font-weight: bold;
	font-style: italic;
	border-bottom: 2px solid #ddd;
	margin-bottom: 20px;
	font-size: 120%;
	padding-bottom: 3px;
}
.form-style-2 label{
	display: block;
	margin: 0px 0px 15px 0px;
}
.form-style-2 label > span{
	width: 100px;
	font-weight: bold;
	float: left;
	padding-top: 8px;
	padding-right: 5px;
}
.form-style-2 span.required{
	color:red;
} s
.form-style-2 input.input-field, 
.form-style-2 .tel-number-field, 
.form-style-2 .textarea-field, 
 .form-style-2 .select-field{
	box-sizing: border-box;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	border: 1px solid #C2C2C2;
	box-shadow: 1px 1px 4px #EBEBEB;
	-moz-box-shadow: 1px 1px 4px #EBEBEB;
	-webkit-box-shadow: 1px 1px 4px #EBEBEB;
	border-radius: 3px;
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	padding: 7px;
	outline: none;
}






.menu-btn{
  outline:none;
  padding: 5px;
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

.circle-before{
  
  border:5px solid white;
}

.circle-blue{
  border:5px solid #FF4500;
}




.session-goal{
  /* position: relative; */
  position:absolute;
  width:50px;
  height:50px;
  left: 5%;
  bottom: 30%;

}
.session-goal-text{
  font-size: 85%;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: 30%
}
.goal-label{
  font-size: 75%;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  bottom: -30%
}



.total-goal{
  position:absolute;
  width:50px;
  height:50px;
  right: 5%;
  bottom: 30%;

}
.daily-goal{
  position:absolute;
  width:50px;
  height:50px;
  left: 30%;
  bottom: 30%;
}
.weekly-goal{
  position:absolute;
  width:50px;
  height:50px;
  right: 30%;
  bottom: 30%;
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

  outline:none;
  padding: 5px;
  padding-right: 20px;
  padding-left: 20px;
  font-size: 50%;

  background-color: #304455;
  color:#E8E8E8 ;
  border: solid 1px grey;
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

.solving-now{
  position: absolute;
  top: 0%;
  height: 100%;
  font-size: 6em;
  left: 0;
  right: 0;
  text-align: center;
}
.solving-now-span{
  top:40%;
  position: absolute;
  height: 100%;
  left: 0;
  right: 0;
  text-align: center;
}






</style>

