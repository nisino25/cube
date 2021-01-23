<template>

<body>
  <div class="wrapper">

    <div class="menu-nav">
      <nav>
        <button class="menu-btn">Timer</button>
        <button class="menu-btn">Stats</button>
        <button class="menu-btn">Login</button>
      </nav>
      
    </div>

    <div class="timer">



      <div class="display">
        <a class="button-one" title="Relevant Title" href="#">Click Me</a><a class="button-two" title="Relevant Title" href="#">No Click Me</a>


        <form v-on:submit.prevent="inputTime()" >
          <input type="number" step="0.01" v-model="currentTime"  placeholder="Enter your time">
        </form>
          
        <br><br>






      </div>
      <div class="stats">
        <div class="this-session"></div>
        <div class="last24"></div>
        <div class="total">




          <textarea v-model="message"></textarea>
          <!-- <div :style="styles"> </div> -->


          <div style="position:absolute;width:50px;height:50px;right:0">
            <!-- 右側の180度分の領域 -->
            <div class="square" style="right:0">
              <div class="square" style="right:100%;transform-origin: 100% 50%;" :style="rightAngle">
                <div class="circle" style="left:0;"></div>
              </div>
            </div>
            <!-- 左側の180度分の領域 -->
            <div class="square" style="left:0;">
              <div class="square" style="left:100%;transform-origin: 0% 50%;" :style="leftAngle">
                <div class="circle" style="right:0;">
                </div>
              </div>
            </div>


            <div style="position:absolute;width:200px;line-height: 200px;text-align: center;font-size:20px;font-weight: bold;">
              <!-- <span v-if="tweetLength <= 144"> {{ tweetLength}}</span>
              <span v-else> {{ 144 - tweetLength}}</span> -->
            </div>
          </div>


          
          
          
          

        </div>
      </div>
      <!-- <vue-ellipse-progress :progress="50"/> -->
      <!-- <vue-ellipse-progress :progress="progress"/> -->
    </div>


    <div class="graph" >
      <button>Change the period</button>
      <div class="actual-graph">

        <table >
          <thead>
            <tr>
              <th>No.</th>
              <th>Time</th>
              <th>AO5</th>
              <th>AO12</th>
            </tr>
          </thead>
          

          <tbody v-for="(result, i) in results" :key="i" >
            <tr v-if="i < 5">
              <td>
                {{results.length - i}}.
              </td>
              <td>
                {{results[(results.length - i) -1].outcome}}
              </td>
              <td>
                {{getAO(5,(results.length - i) -1)}}
              </td>
              <td>
                {{getAO(12,(results.length - i) -1)}}
              </td>
            </tr>
          </tbody>


        </table>


      </div>
    </div>
  </div>
</body>
</template>

<script>
// import VueEllipseProgress from 'vue-ellipse-progress'


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
      
    }
  },
  methods:{

    inputTime(){
      if(this.currentTime >= 100 && this.currentTime <= 1000 ){
        this.currentTime = this.currentTime/10
      }else if(this.currentTime >= 100 && this.currentTime <= 10000 ){
        this.currentTime = this.currentTime/100
      }

      this.results.push({time: Date.now(),outcome: this.currentTime});
      this.currentTime = null
    },

    getAO(whichAO,index){
      

      if(index < whichAO -1){
        return;
      }
      
      if(index> 15){
        console.log('hey')
        console.log(this.results[index].outcome)
      }
      // index = index -1
      this.AOLoopCount = 1;
      this.AOSum = this.results[index].outcome
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
        this.callCount++;
      }
      
      return  this.AOAve ;

    },
  },
  mounted() {
    let mountCount =1.5
    while(mountCount < 16){
      this.results.push({time: new moment(),outcome: mountCount});
      mountCount++
    }
    // console.log(this.results)
    


    this.reverseResults = this.results.reverse()
    // console.log('--------')
    // console.log(this.reverseResults)

  },
  computed:{
    textLength(){
      return this.message.length;
    },
    currentAngle(){
      console.log(Math.floor(360*this.textLength/144));
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


  },  
  // results: function(){
  //   this.reverseResults = this.results.reverse()
    
  // },
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
  height: 32%;
  /* width: 60em; */
  border: solid 1px black;
}
.graph{
  position: absolute;
  width: 100%;
  top: 48%;
  height: 50%;
  /* width: 60em; */
  /* background-color: #304455; */
  border: solid 1px black;
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



.button-one {
    background: #edf000; /* background color */
}
.button-two {
    background: #f15640;
}
.button-three {
    background: #27c9b8;
}
.button-one,
.button-two,
.button-three {
    color: #1d1d1d; /* text color */
    display: inline-block;
    border-radius: 0; /* square corners */
    padding: 10px 18px; /* space around text */
    text-transform: uppercase; /* all capital letters */
    font-weight: 700;
    letter-spacing: 1px;
    -moz-transition: all 0.2s;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
}
.button-one:hover,
.button-two:hover,
.button-three:hover {
    background: #fff;
}



table{
  margin-top: 4%;
  width:100%;
  text-align: center;
}

table td{
  border: 1px solid grey;
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
  border:5px solid red;
  box-sizing: border-box;
}


</style>

