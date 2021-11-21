<template >

<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
</head>

<body style=" overflow: hidden; user-select: none;" class="overflowing">
  <!-- <div v-if="pressing" style="user-select: none; background-color: Crimson; " class="timer-ready"  >
    <h3 style="color: white;font-size:200%; margin-left: -40px" >Tiemr Ready</h3>
  </div> -->

  <div class="wrapper"   :style="[ isTimerRunning? {backgroundColor: Crimson} : '']" >

    <div class="menu-nav">
      <nav>
        <button class="menu-btn" @click="menu='timer'">Timer</button>
        <button class="menu-btn" @click="menu='stats', getTheAverage()">Stats</button> 
        <button class="menu-btn" @click="menu='settings'; getTheMax()">Settings</button>
        <!-- <button class="menu-btn" @click="addRandomData()">Settings</button> -->
      </nav>
      
    </div>

    <div class="menu-timer" v-if="menu=== 'timer' && !running ">

      <div class="graph" v-if="smallBox === 'table' ">
        
        <div class="actual-graph">
          <button class="chart-button" @click="smallBox = 'chart', whichStats = 'chart' ">Chart</button>
        

           <table v-if="results.length !== 0"> 
            <thead>
              <tr>
                <th>No.</th>
                <th>Time</th>
                <th>AO5</th>
                <th>AO12</th>
                <th>AO100</th>
              </tr>
            </thead>

            <!-- <tbody v-for="(result, i) in results" :key="i" >
              <tr v-if="i < 5" >
                <td><strong>{{results.length - i}}. </strong></td>
                <td>{{results[(results.length - i) -1].outcome}}</td>
                <td>{{AO5Data[i]}}</td>
                <td>{{AO12Data[i]}}</td>
                <td>{{AO100Data[i]}}</td>
                <td @click='deleteData((results.length - i) -1)' class="xMark">X</td>
              </tr>  

            </tbody> -->
            <tr >
              <td><strong>{{results.length - 0}} </strong></td>
              <td>{{results[(results.length - 0) -1].outcome}}</td>
              <!-- <td>{{results[0].outcome}}</td> -->
              <td v-if="results.length>=5">{{AO5Data[results.length - 1]}}</td>
              <td v-else></td>
              <td v-if="results.length>=12">{{AO12Data[results.length - 1]}}</td>
              <td v-else></td>
              <td v-if="results.length>=100">{{AO100Data[results.length - 1]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - 0) -1)' class="xMark">X</td>
            </tr>  

            <tr v-if="results.length >= 2">
              <td><strong>{{results.length - 1}} </strong></td>
              <td>{{results[(results.length - 1) -1].outcome}}</td>
              <!-- <td>{{results[0].outcome}}</td> -->
              <td v-if="results.length>=5">{{AO5Data[results.length - 2]}}</td>
              <td v-else></td>
              <td v-if="results.length>=12">{{AO12Data[results.length - 2]}}</td>
              <td v-else></td>
              <td v-if="results.length>=100">{{AO100Data[results.length - 2]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - 1) -1)' class="xMark">X</td>
            </tr> 

            <tr v-if="results.length >= 3">
              <td><strong>{{results.length - 2}}</strong></td>
              <td>{{results[(results.length - 2) -1].outcome}}</td>
              <!-- <td>{{results[0].outcome}}</td> -->
              <td v-if="results.length>=5">{{AO5Data[results.length - 3]}}</td>
              <td v-else></td>
              <td v-if="results.length>=12">{{AO12Data[results.length - 3]}}</td>
              <td v-else></td>
              <td v-if="results.length>=100">{{AO100Data[results.length - 3]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - 2) -1)' class="xMark">X</td>
            </tr> 

            <tr v-if="results.length >= 4">
              <td><strong>{{results.length - 3}}</strong></td>
              <td>{{results[(results.length - 3) -1].outcome}}</td>
              <!-- <td>{{results[0].outcome}}</td> -->
              <td v-if="results.length>=5">{{AO5Data[results.length - 4]}}</td>
              <td v-else></td>
              <td v-if="results.length>=12">{{AO12Data[results.length - 4]}}</td>
              <td v-else></td>
              <td v-if="results.length>=100">{{AO100Data[results.length - 4]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - 3) -1)' class="xMark">X</td>
            </tr> 

            <tr v-if="results.length >= 5">
              <td><strong>{{results.length - 4}} </strong></td>
              <td>{{results[(results.length - 4) -1].outcome}}</td>
              <!-- <td>{{results[0].outcome}}</td> -->
              <td v-if="results.length>=5">{{AO5Data[results.length - 5]}}</td>
              <td v-else></td>
              <td v-if="results.length>=12">{{AO12Data[results.length - 5]}}</td>
              <td v-else></td>
              <td v-if="results.length>=100">{{AO100Data[results.length - 5]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - 4) -1)' class="xMark">X</td>
            </tr> 



          </table> 


        </div>
      </div>

      <div class="graph-chart" v-if="smallBox === 'chart' ">
        <div class="AwesomeChart" v-if="results.length >= 15 " >
           <a class="notion-link notion-breadcrumb__item single"  style="font-size: 75%; margin-left:20px; margin-top:20px">
        <i class="far fa-eye" id="togglePassword" style="margin-right: 3px; cursor: pointer;"></i>
        
        {{userNum}} Views
      </a>
          <span class="showing-label" style="font-size:75%">Showing Last 100 of AO25</span>
          <button class="table-button" @click="smallBox = 'table', whichStats = 'table'">Table</button>
          <vue-frappe
          class="small-chart"
          id="test"
          :labels="[
            this.results.length -100, 
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','',
            
            this.results.length,
          ]"
          type="line"
          :height="160"
          :colors="['purple', '#ffa3ef', 'light-blue']"
          :dataSets="this.smallBoxData"
          :lineOptions="{hideDots: 1,xIsSeries: true,regionFill: 1 }"
          :yMarkers="[{label: 'Average',color: 'red', value: smallAverage, options: { labelPos: 'left'}}]"
          :axisOptions="{xIsSeries:true}"
          :yAxis="{zeroline:10}"
          
          >
        </vue-frappe>

      </div>
      </div>


      <div class="timer" v-if="!running" style="user-select: none" >
        

        <div class="display">
          <div class="stats" @touch="csTimer()">


          

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
          
          <!-- <a class="button-one" title="Relevant Title" href="#">Click Me</a><a class="button-two" title="Relevant Title" href="#">No Click Me</a> -->
          
          <div class="random-algorithm" style="textAlgin:center">
            <!-- <span @click="csTimer()" >{{randomAlg}}</span> -->
            <span @touchstart="startTimer()"  @touchend="stopTimer()"   >{{randomAlg}}</span>
             
            <button class="shuffle" @click="algShuffle()">Shuffle</button>
          </div>

          

          <div style="">
            
            <div id="clock" style="top: 50%;"> 
              <hr style=""> 
              <div style="">
              <!-- <hr class="counter-left">
              <span class="counter-label">Counter</span>
              <hr class="counter-right">  -->
              
              </div>
              <span class="actual-timer" @touchstart="startTimer()"  @touchend="stopTimer()"   v-if="!running" >
                <template v-if="time == '0.00'">
                  {{ time }}
                </template>
                <template v-else-if="time - time.toFixed(2) == time">
                  {{time}}.0
                </template>
                <template v-else>
                {{time}}
                </template>
              </span>
            </div>

          </div>

        </div>
        

        <table v-if="totalCount !== 0" style="top: 25%"> 
          <thead >
            <tr>
              <th></th>
              <th>Time</th>
              <th>AO5</th>
              <th>AO12</th>
              <th>AO100</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody  v-if="totalCount !== 0" @touchstart="startTimer()"  @touchend="stopTimer()" >
            <tr>
              <td><strong>Last</strong></td>
              <td>{{results[(results.length) -1].outcome}}</td>
              <td v-if="results.length>=5">{{AO5Data[results.length - 1]}}</td>
              <td v-else></td>
              <td v-if="results.length>=12">{{AO12Data[results.length - 1]}}</td>
              <td v-else></td>
              <td v-if="results.length>=100">{{AO100Data[results.length - 1]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length) -1)' class="xMark">X</td>
            </tr>  
            <tr>
              <td><strong>Best</strong></td>
              <td>{{bestTime}}</td>
              <td v-if="results.length>= 5">{{bestAO5}}</td>
              <td v-if="results.length>= 12"> {{bestAO12}}</td>
              <td v-if="results.length>= 100">{{bestAO100}}</td>
            </tr>  

          </tbody>
        </table>
        
        <!-- <div style="">
         <hr class="counter-left">
          <span class="counter-label">Counter</span>
          <hr class="counter-right"> -->
      <!-- </div> -->
      


        
      </div>
      

    </div>

<!-- ----------------------------------------- -->
    <div class="menu-timer" v-if="menu=== 'timer' && running " >
      <div class="solving-now" @touchstart="csTimer()" >
        <span class="solving-now-span"  >Solving</span>
      </div>
    </div>



    

    <div class="menu-stats" v-if="menu==='stats' && whichStats==='table'" style="overflow:visible">
      <div class="stats-table">
        <div class="index-input">
          <label for="field1"><span>Showing from  </span><input type="number" class="index-input-field" name="field1" v-model="showingIndex" /></label>
        </div>

        <table v-if="results.length !== 0" style="overflow:visible">
          <thead>
            <tr>
              <th>No.</th>
              <th>Time</th>
              <th>AO5</th>
              <th>AO12</th>
              <th>AO100</th>
            </tr>
          </thead>

          <!-- <tbody v-for="(result, i) in results" :key="i" >
            <tr v-if="results.length - i <= showingIndex">
              <td><strong>{{results.length - i}} </strong></td>
              <td>{{results[(results.length - i) -1].outcome}}</td>
              <td v-if="results.length -i>4">{{AO5Data[results.length - i -1]}}</td>
              <td v-else></td>
              <td v-if="results.length -i>11">{{AO12Data[results.length - i -1]}}</td>
              <td v-else></td>
              <td v-if="results.length -i>99">{{AO100Data[results.length - i -1]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - i) -1)' class="xMark">X</td>
            </tr>  
          </tbody> -->

          <tbody v-for="(result, i) in resultsForOneK" :key="i" >
            <tr >
              <td><strong>{{results.length - i}} </strong></td>
              <td>{{result.outcome}}</td>
              <td v-if="results.length - i>4">{{AO5Data[results.length - i -1]}}</td>
              <td v-else></td>
              <td v-if="results.length - i>11">{{AO12Data[results.length - i -1]}}</td>
              <td v-else></td>
              <td v-if="results.length - i>99">{{AO100Data[results.length - i -1]}}</td>
              <td v-else></td>
              <td @click='deleteData((results.length - i) -1)' class="xMark">X</td>
            </tr>  
          </tbody>

        </table>
      </div>
    </div>
    <div v-if="menu==='stats' && whichStats==='chart'" style="overflow:scroll">
      <div class="AwesomeChart" v-if="results.length >= 100">
          <vue-frappe
          class="AwesomeChart"
          id="test"
          :labels="[
            25, 
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',

            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','','',
            '','','','','','','','','','','','','','','','','','','',
            
            this.results.length,
          ]"
          title="My Awesome Chart"
          type="line"
          :height="450"
          :colors="['purple', '#ffa3ef', 'light-blue']"
          :dataSets="this.chartData"
          :lineOptions="{hideDots: 1,xIsSeries: true,regionFill: 1 }"
          :yMarkers="[{label: 'Average',color: 'red', value: averageOfSum, options: { labelPos: 'left'}}]"
          :axisOptions="{xIsSeries:true}"
          :yAxis="{zeroline:10}"
          
          >
        </vue-frappe>
        <button class="shuffle">Show Last 1k</button>

      </div>
      

    </div>


    <!-- ----------------------------------------- -->

    <div class="menu-setting" v-if="menu==='settings'">

      <div v-if="showingDetail" style="margin-top:20px">
        <button @click="showingDetail = false" style="margin-left:10%">Change back</button>&nbsp;
        <input type="number" class="input-field" name="field1" v-model="Maxnum" style="width: 10%" />&nbsp;
        <button @click="getDetail()">Update</button>&nbsp;
        <button @click="getEverything()">Max</button>
        <br>
        <!-- {{detailedList}} -->
        <table  style="overflow:visible; width: 80%; text-align:center; margin-left: 10%;margin-top:10px">
          
            <thead>
              <tr>
                <th style="width:15%">Time</th>
                <th>Count</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody  v-for="(result, i) in detailedList" :key="i">
              <template v-if="i >= firstDetail ">
              <tr>
                <td v-if="i == 30"><strong>30+ </strong></td>
                <td v-else><strong>{{i}}s </strong></td>
                <td>{{result.count}}</td>
                <td v-if="result.portion == 0">0 %</td>
                <td v-else>{{result.portion}} %</td>
              </tr>  
          </template>
            </tbody>
          

        </table>
        
      </div>

      <div v-else>
      <div class="settings" v-if="!showingPastAlgs">
        <div class="form-style-2" >
          <div class="form-style-2-heading">Change your goals</div>
          <form action="" method="post">
            <label for="field1"><span>Session Goal <span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="sessionGoal" /></label>
            <label for="field1"><span>Daily Goal <span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="dailyGoal" /></label>
            <label for="field1"><span>Weekly Goal <span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="weeklyGoal" /></label>
            <label for="field1"><span>Total Goal<span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="totalGoal" /></label>

            <hr>
            <label for="field1"><span @click="console.log('hey')">Upload data<span class="required">*</span></span><input type="number" class="input-field" name="field1" v-model="totalGoal" /></label>
           

            <!-- <button>Upload my data to cloud</button> -->

            <!-- <button @click="addRandomData(10)">get 5ksolves</button> -->
            <!-- <label><span > </span><input class="menu-btn" style="marginTop:5%"  type="submit" value="Update" /></label> -->
          </form>
        </div>
      </div>
      <div class="stats-settings" v-if="menu=== 'timer'">


          <hr class="counter-left-settings">
          <span class="counter-label-settings">Counter</span>
          <hr 
          
          class="counter-right-settings">
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
      <div class="refresh">
        <button @click='refreshAO()'>Refresh AO</button>&nbsp;
        <button @click='showingPastAlgs = !showingPastAlgs'>Show the algs</button>&nbsp;
        <button @click='getDetail()'>Detailed data</button>&nbsp;
        <button @click="clearTheLocal()" >X</button>
      </div>

      

      
      <div v-if="showingPastAlgs">
        <br>
        <li v-for="(i, algs ) in pastAlgs" :key="algs">{{i}} <br><br> </li>
        
      </div>

      <div style="position: absolute; bottom: 20%;">
        <a class="notion-link notion-breadcrumb__item single" >
        
        <i class="far fa-eye" id="togglePassword" style="margin-right: 7px; cursor: pointer;"></i>
        {{userNum}} Views
        <!-- <vue3-autocounter class="counter" ref='counter' :startAmount='0'  suffix=' Views' :endAmount="userNum" :duration='1.5'  separator=',' :autoinit='true' /> -->
        
      </a>
      </div>

      </div>


      

      

    </div>


    

    

  </div>

</body>

</template>

<script>

var moment = require('moment'); // require
moment().format(); 
var soundStart = new Audio(`/audio/263133__pan14__tone-beep.m4a`);
import { VueFrappe } from 'vue2-frappe'

// import Vue3autocounter from 'vue3-autocounter';
import db from "./firebase.js"

export default {
  components: {
    VueFrappe,
    // 'vue/3-autocounter': Vue3autocounter,
  },
  

  data(){
    return{
      fireData:[],
      userNum: 0,


      showingDetail: false,
      detailedList: [],
      firstDetail: undefined,
      lastDetail: undefined,
      Maxnum: undefined,

      settingUptimer: undefined,
      pressing :false,
      isTimerRunning: false,
      Crimson: 'Crimson',
      
      chartData: [
        {
          name: "AO25", chartType: 'line',
          values: [
            0,0,0,0
          ],
        }
      ],
      TimerReady: false,
      smallBoxData:[
        {
          name: "AO25", chartType: 'line',
          values: [
            0,0,0,0
          ],
        }
        
      ],

      pastAlgs: [],
      showingPastAlgs: false,


      results: [],
      reverseResults: [],
      message:"Hello",
      imadesho: false,

      showingLast2k: false,


      AOSum: null, 
      AOMax: null,
      AOMin: null,
      AOAve: null,
      AOData: null,

      currentTime: null,
      callCount: 0,
      AOLoopCount: null,

      wholeAOData:{
        five: null,
        twelve: null,
        hundred: null
      },

      AO5Data: [],
      AO12Data: [],
      AO100Data: [],
      AO25Data: [],

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
      whichStats: 'chart',
      smallBox: 'chart',
      goalData: {
        session: null,
        daily: null,
        weekly: null,
        total: null,
      },
      

      time: '0.00',
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
      bestAO100: null,
      bestAO25: null,
      WholeDataOfOutcome: [],
      WholeDataOfFive: [],
      WholeDataOfTwelve: [],

      showingIndex: null,

      averageOfSum: 0,
      smallAverage: 0,


      
      

      form: {
        email: "",
        password: ""
      },


    }
  },

  methods:{
    getDetail(){
      if(this.showingDetail) this.showingDetail = false

      this.showingDetail = true
      this.detailedList = []

      // clear the list 
      let count = 0
      while(count < 31){
        this.detailedList.push({count: 0, portion: 0})
        count++ 
      } 
      // console.log(this.detailedList)

      // with last 2500 solves

      count = 0;
      let theTime = undefined;
      let resultIndex = this.results.length -1
      // this.Maxnum = maximum
      if(this.results.length < this.Maxnum) this.Maxnum =this.results.length

      while(count < this.Maxnum){
        // console.log(this.results[resultIndex - count])
        theTime = Math.floor(this.results[resultIndex - count].outcome)
        // console.log(theTime)

        if(theTime >= 30){
          this.detailedList[30] = {
            count: this.detailedList[30].count + 1,
            portion: 0,
          }
        }else{
          this.detailedList[theTime] ={
            // count: this.detailedList[theTime].count++,
            count: this.detailedList[theTime].count + 1 ,
            portion: 0,
          }
        }

        
        count++
      }
      console.log(this.detailedList)
      console.log(this.results)

      count = 0
      let firstDone = false
      // let lastDone = Maxnum

      while(count < 31){
        // this.detailedList.push({count: 0, portion: 0})
        if(!firstDone && this.detailedList[count].count!== 0){
          this.firstDetail = count;
          firstDone = true
        }

        if(this.detailedList[count].count!== 0) this.lastDetail = count

        // let thePortion = undefined


        
        count++ 
      } 
      count =0 
      while(count < 31){
        console.log(`${this.detailedList[count].count}/ ${this.Maxnum}`)
        let thePortion =  (this.detailedList[count].count / this.Maxnum) * 100
        this.detailedList[count].portion = thePortion.toFixed(2)


        
        count++ 
      } 



      
      



    },
    getTheMax(){
      this.Maxnum = 1000
      if(this.results.length < this.Maxnum) this.Maxnum =this.results.length
    },
    getEverything(){
      this.Maxnum = this.results.length
      this.getDetail();
    },
    startTimer() {
      this.pressing = true
      // this.isTimerRunning = true

      setTimeout(() =>{
        if(this.pressing){
        console.log('ready to start timer')
        this.isTimerRunning = true
      }else{
        console.log('not longe nough')
        this.isTimerRunning = false
      } 
      },750)
    },

    // toggleSwitch(){
      
    // },

    stopTimer(){
      this.pressing = false

      // this.isTimerRunning = false
      if(this.isTimerRunning){
        this.csTimer()
      }else{
        //
      }

      this.isTimerRunning = false
    },


    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },

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
      this.wholeAOData = []
      this.AO5Data = [];
      this.AO12Data = [];
      this.AO100Data = [];
      this.wholeAOData.five = this.AO5Data;
      this.wholeAOData.twelve = this.AO12Data;
      this.wholeAOData.hundred = this.AO100Data;

      this.AO25Data


      this.sessionCount++
      this.sessionCount= 0
      localStorage.results = JSON.stringify(this.results);
      // localStorage.wholeAOData = JSON.stringify(this.wholeAOData);
      localStorage.AO5 = JSON.stringify(this.AO5Data)
      localStorage.AO12 = JSON.stringify(this.AO12Data)
      localStorage.AO100 = JSON.stringify(this.AO100Data)
      localStorage.AO25Data = JSON.stringify(this.AO25Data)
      this.totalCount = 0;

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

      this.pastAlgs.unshift(this.randomAlg);
      if(this.pastAlgs.length> 4){
        this.pastAlgs.pop()
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
      this.AO100Data = [];
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
      i=0


      if(this.results.length < 100){
        return;
      }
      while(i < this.results.length -99){
        this.AO100Data.push( this.getAO(100,this.results.length - i -1))
        // console.log(this.results.length - i -1)
        i++;
      }


      
    },
    saveAO(){
      if(this.results.length >= 5){
        this.AO5Data.push( Number(this.getAO(5,this.results.length -1)));

        if(this.getAO(5,this.results.length -1) < this.bestAO5){
          this.bestAO5 = this.getAO(5,this.results.length -1);
        }
        
      }
      else{
        this.AO5Data.push(parseInt(100) );
      }

      if(this.results.length >= 12){
        this.AO12Data.push( Number(this.getAO(12,this.results.length -1)));
        if(this.getAO(12,this.results.length -1) < this.bestAO12){

          this.bestAO12 = this.getAO(12,this.results.length -1);
        }
      }
      else{
        this.AO12Data.push(parseInt(100));
      }

      if(this.results.length >= 24){
        this.AO25Data.push( Number(this.getAO(25,this.results.length -1)));
        if(this.getAO(25,this.results.length -1) < this.bestAO25){

          this.bestAO25 = this.getAO(25,this.results.length -1);
        }
      }
      else{
        this.AO12Data.push(parseInt(100));
      }

      if(this.results.length >= 100){
        this.AO100Data.push( Number(this.getAO(100,this.results.length -1)));

        if(this.getAO(100,this.results.length -1) < this.bestAO100){
          this.bestAO100 = this.getAO(100,this.results.length -1);
        }
      }
      else{
        this.AO100Data.push(parseInt(100) );
      }
      localStorage.AO5 = JSON.stringify(this.AO5Data)
      localStorage.AO12 = JSON.stringify(this.AO12Data)
      localStorage.AO100 = JSON.stringify(this.AO100Data)
      localStorage.AO25 = JSON.stringify(this.AO25Data)


      // this.wholeAOData.five = this.AO5Data;
      // this.wholeAOData.twelve = this.AO12Data;
      // this.wholeAOData.hundred = this.AO100Data;

      // localStorage.wholeAOData = JSON.stringify(this.wholeAOData);
      




    },
    deleteData(num){
      let r= confirm(`Deleting No${num+1}. ${this.results[num].outcome}s...`);
      if(!r){
        this.movingRobber = false;
        return;
      }
      console.log(num)
      this.results.splice(num,1);
      if( num >=4){
        this.AO5Data.splice(num,1)
      }
      if( num>= 11){
        this.AO12Data.splice(num,1)
      }
      if( num>= 24){
        this.AO25Data.splice(num,1)
      }
      if( num>= 99){
        this.AO100Data.splice(num,1)
      }
      // this.updateAO()

      this.totalCount = this.results.length
      this.getTheBest();
      localStorage.results = JSON.stringify(this.results);
      this.sessionCount--;
      this.dailyCount--;
      this.weeklyCount--;


      let i = num;
      while(i< this.results.length){
        if( i >= 4){
          this.AO5Data[i] = this.getAO(5,i)
          if( i >=11){
            this.AO12Data[i] = this.getAO(12,i)
            if( i>=24){
              this.AO25Data[i] = this.getAO(25,i)
              if( i>=99){
              this.AO100Data[i] = this.getAO(100,i)
              }
            }
          }
        }


        i++

      }
      localStorage.AO5 = JSON.stringify(this.AO5Data)
      localStorage.AO12 = JSON.stringify(this.AO12Data)
      localStorage.AO100 = JSON.stringify(this.AO100Data)
      localStorage.AO25 = JSON.stringify(this.AO25Data)

      this.time = '0.00'


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
        // this.updateAO(); 
        this.saveAO()
        this.totalCount = this.results.length;
        this.getTheBest();
        this.algShuffle();
        // localStorage.results = this.results;
        console.log('updating')

        if(this.results.length >=125){
          let i = 0;
          let iii = 100;
          let iiiii = 0;
          while(i< 100){
            this.smallBoxData[0].values[i]= this.AO25Data[this.results.length -1 -iii],
            iiiii = iiiii+ Number( this.AO25Data[this.results.length -1 -iii]),
            i++;
            
            iii--;
          }
          this.smallAverage = iiiii /100
        }


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
    addRandomData(num){
      console.log('getting random data')
      let randomNum = Math.random();
      let i =0
      randomNum = randomNum * 30;
      while(i<num){
        randomNum = Math.random();
        randomNum = randomNum * 20;
        randomNum = parseFloat(randomNum.toFixed(2))
        this.results.push({time: Date.now(),outcome: randomNum });
        this.saveAO()
        i++

      }
      console.log(this.results)



    },
    showSomeData(){
      console.log(this.AO5Data)
    },
    refreshAO(){
      this.AO5Data = [];
      this.AO12Data = [];
      this.AO100Data = [];
      this.AO25Data = [];
      let i = 0;
      while(i< this.results.length){
        if( i >= 4){
          this.AO5Data[i] = Number(this.getAO(5,i))
        }else{
          this.AO5Data[i] = 100;
        }

        if( i >= 11){
          this.AO12Data[i] = Number(this.getAO(12,i))
        }else{
          this.AO12Data[i] = 100;
        }

        if( i >= 24){
          // this.AO25Data[i] = parseInt( this.getAO(25,i)) 
          this.AO25Data[i] = Number(this.getAO(25,i)  )
        }else{
          this.AO25Data[i] = 100;
        }

        if( i >= 99){
          this.AO100Data[i] = Number(this.getAO(100,i))
        }else{
          this.AO100Data[i] = 100;
        }
        i++;
  
        // if( i >= 4){
        //   this.AO5Data[i] = this.getAO(5,i)
        //   if( i >=11){
        //     this.AO12Data[i] = this.getAO(12,i)
        //     if( i>=99){
        //       this.AO100Data[i] = this.getAO(100,i)
        //     }else{
        //       this.AO100Data[i]  = 100;
        //     }
        //   }else{
        //     this.AO12Data[i]  = 100;
        //   }
        // }else{
        //   this.AO5Data[i] = 100;
        // }
        
      }
      localStorage.AO5 = JSON.stringify(this.AO5Data)
      localStorage.AO12 = JSON.stringify(this.AO12Data)
      localStorage.AO100 = JSON.stringify(this.AO100Data)
      localStorage.AO25 = JSON.stringify(this.AO25Data)
      console.log('done')
      console.log(this.AO25Data)
      console.log('20');
      console.log(parseInt('20'))

    },
    getTheAverage(){
      if(this.whichStats !== 'chart'){
        return;
      }
      let i = 0;
      let totalSum = 0;
      while(i < this.results.length){
        totalSum = this.results[i].outcome + totalSum 
        i++
      }

      this.averageOfSum = totalSum / (this.results.length-1)

      this.updateChart()

      

    },
    updateChart(){
      // let i = 0;
      // let iii = 0.01;
      // while(i< 99){
      //   // this.chartData[0].values[i]= Math.ceil(((this.results.length - 25) * iii) + 25),
      //   this.chartData[0].values[i]= this.AO25Data[Math.ceil(((this.results.length - 25) * iii) + 25)],

      //   i++;
      //   iii = iii + 0.01
      // }

      let i = 0;
      let iii = 0.0025;
      while(i< 399){
        // this.chartData[0].values[i]= Math.ceil(((this.results.length - 25) * iii) + 25),
        this.chartData[0].values[i]= this.AO25Data[Math.ceil(((this.results.length - 25) * iii) + 25)],

        i++;
        iii = iii + 0.0025
      }

      
      
      
      

    },

    getChartFor1k(){
      let i = 0;
      let iii = -1

      while(i< 499){
        this.chartData[0].values.unshift(this.AO25Data[this.AO25Data.length-iii])
        iii = iii-2
        i++
      }

      if(this.chartData[0].values.length > 400){
        this.chartData[0].values.pop()
      }

    },
    

  },

  created() {

    this.updateAO();
    this.algShuffle();

    db.collection("nisino25-cube")
     .get()
     .then((querySnapshot) => {
       querySnapshot.forEach((doc) => {
        //  console.log(`${doc.id} => ${doc.data().TotalNum}`)
         this.fireData.push(doc.data().TotalNum)
         this.userNum = doc.data().TotalNum + 1
       })
     })



    //  this.addRandomData(100)

    
    
  },
  mounted() {
    if (localStorage.results) {
      this.results = JSON.parse(localStorage.results);  
      console.log('getting data')
      this.totalCount = this.results.length
      // this.updateAO();
      this.getTheBest();
      this.getThePreviousMonday();
      this.checkCounts();
      this.showingIndex = this.results.length

      this.AO5Data = JSON.parse(localStorage.AO5);  
      this.AO12Data = JSON.parse(localStorage.AO12);  
      this.AO100Data = JSON.parse(localStorage.AO100);  
      this.AO25Data = JSON.parse(localStorage.AO25);  

      this.bestAO5 = Math.min(...this.AO5Data);
      this.bestAO12 = Math.min(...this.AO12Data);
      this.bestAO100 = Math.min(...this.AO100Data);
      this.bestAO25 = Math.min(...this.AO25Data);
      


      this.chartData[0].values = [
        
        // this.results[100].outcome,
        this.results[Math.ceil(this.results.length * 0.1)].outcome,
        this.results[Math.ceil(this.results.length * 0.2)].outcome,
        this.results[Math.ceil(this.results.length * 0.3)].outcome,
        this.results[Math.ceil(this.results.length * 0.4)].outcome,
        this.results[Math.ceil(this.results.length * 0.5)].outcome,
        this.results[Math.ceil(this.results.length * 0.6)].outcome,
        this.results[Math.ceil(this.results.length * 0.7)].outcome,
        this.results[Math.ceil(this.results.length * 0.8)].outcome,
        this.results[Math.ceil(this.results.length * 0.9)].outcome,
        this.results[Math.ceil(this.results.length * 0.1)].outcome,
        this.results[Math.ceil(this.results.length * 0.2)].outcome,
        this.results[Math.ceil(this.results.length * 0.3)].outcome,
        this.results[Math.ceil(this.results.length * 0.4)].outcome,
        this.results[Math.ceil(this.results.length * 0.5)].outcome,
        this.results[Math.ceil(this.results.length * 0.6)].outcome,
        this.results[Math.ceil(this.results.length * 0.7)].outcome,
        this.results[Math.ceil(this.results.length * 0.8)].outcome,
        this.results[Math.ceil(this.results.length * 0.9)].outcome,
        this.results[Math.ceil(this.results.length * 0.1)].outcome,
        this.results[Math.ceil(this.results.length * 0.2)].outcome,
        this.results[Math.ceil(this.results.length * 0.3)].outcome,
        this.results[Math.ceil(this.results.length * 0.4)].outcome,
        this.results[Math.ceil(this.results.length * 0.5)].outcome,
        this.results[Math.ceil(this.results.length * 0.6)].outcome,
        this.results[Math.ceil(this.results.length * 0.7)].outcome,
        this.results[Math.ceil(this.results.length * 0.8)].outcome,
        this.results[Math.ceil(this.results.length * 0.9)].outcome,
        this.results[Math.ceil(this.results.length * 0.1)].outcome,
        this.results[Math.ceil(this.results.length * 0.2)].outcome,
        this.results[Math.ceil(this.results.length * 0.3)].outcome,
        this.results[Math.ceil(this.results.length * 0.4)].outcome,
        this.results[Math.ceil(this.results.length * 0.5)].outcome,
        this.results[Math.ceil(this.results.length * 0.6)].outcome,
        this.results[Math.ceil(this.results.length * 0.7)].outcome,
        this.results[Math.ceil(this.results.length * 0.8)].outcome,
        this.results[Math.ceil(this.results.length * 0.9)].outcome,
        this.results[Math.ceil(this.results.length * 0.9)].outcome,this.results[Math.ceil(this.results.length * 0.9)].outcome,this.results[Math.ceil(this.results.length * 0.9)].outcome,this.results[Math.ceil(this.results.length * 0.9)].outcome,this.results[Math.ceil(this.results.length * 0.9)].outcome,this.results[Math.ceil(this.results.length * 0.9)].outcome,
        this.results[this.results.length-1].outcome,
        30,30,30
      ]

      if(this.results.length >=125){
        let i = 0;
        let iii = 100;
        let iiiii = 0;
        while(i< 100){
          this.smallBoxData[0].values[i]= this.AO25Data[this.results.length -1 -iii],
          iiiii = iiiii+ Number( this.AO25Data[this.results.length -1 -iii]),
          i++;
          
          iii--;
        }
        this.smallAverage = iiiii /100
      }

      // if(this.results.length >=125){
      //   let i = 0;
      //   let iii = 100;
      //   let isum= 0;
      //   while(i< 100){
      //     this.smallBoxData[0].values[i]= this.AO25Data[this.results.length -1 -iii],
      //     isum = isum + this.AO25Data[this.results.length -1 -iii]
      //     i++;
      //     iii--;
      //   }
      
      //   this.smallAverage =  isum / 100
      // }
      
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
    // console.log(this.results.length) 

    // this.addRandomData(1000)
    console.log(this.results.length)


    
  },
  watch: {
    sessionCount: function() {
      localStorage.results = JSON.stringify(this.results);
      this.showingIndex = this.results.length
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
    },
    settingUptimer: function(){
      console.log(this.settingUptimer)
    },
    userNum(){
      // console.log('just ogt data')
        const ref = db.collection('nisino25-cube')
        ref.doc('8CKObNnyitQVBrRvt342').update({
          TotalNum: this.userNum
          // TotalNum: 200 
        })
      // console.log('Sent data now')
    },
    

  
  },
  computed:{
    currentColor: function (){
      if(this.TimerReady){
        return 'red'
      }else{
        return ''
      }
    },
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
    
    resultsForOneK(){
      let list = []
      let lastIndex = this.results.length-1
      if(this.results.length <= 100){
        return this.results
      }else{
        let count =0
        while(count < 100){
          list.push(this.results[lastIndex-count])
          count++
        }
      }

      return list
    },

    






    formattedElapsedTime() {
      const date = new Date(null);
      date.setSeconds(this.elapsedTime / 1000);
      const utc = date.toUTCString();
      return utc.substr(utc.indexOf(":") - 2, 8);
    }



  }, 
  
  name: 'App',
}

</script>

<style>
.timer-ready{
  width: 100%; height: 100%; margin: 0em;
  left: 0em; top: 0em; background: black;
  position: fixed;
}

.timer-ready h3{
  width: 100px;
  height: 100px;
  /* Center vertically and horizontally */
  position: absolute;
  /* padding: 100px ; */

  top: 50%;
  left: 50%;
  margin: -25px 0 0 -25px;
}




 .line-vertical {
    display: none;
}

.overflowing{
  overflow: hidden;
}

.notOverflowing{

}

/* #E8E8E8 grey */
/* #4fc08d green */
body {
  margin:0;
  padding:0;
  overflow: hidden;
  
  
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
.graph-chart{
  position: absolute;
  width: 100%;
  top: 8.5%;
  height:28%;
  /* width: 60em; */
  /* background-color: #304455; */
  border: solid 1px black;
}
.small-chart{
  margin-top: 5%;
  position: absolute;
  width: 100%;
  top: 30%;
  /* height:10%; */
  left: 0;
  right: 0;
  text-align: center;
}

.timer{
  position: absolute;
  overflow: hidden;
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
  top: 4%;
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

.showing-label{
  margin-top: 3%;
  font-size: 100%;
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  top: -20%
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
  top: 55%;
  left: 0;
  right: 0;
  text-align: center;
  color: red;
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

.table-button{
  margin-top: 3%;
  position: absolute;
  right:5%;

  outline:none;
  padding: 3px;
  padding-right: 15px;
  padding-left: 15px;
  font-size: 50%;

  background-color: #304455;
  color:#E8E8E8 ;
  border: solid 1px grey;
}


.chart-button{
  margin-top: 0.5%;
  position: absolute;
  right:1.5%;

  outline:none;
  padding: 3px;
  padding-right: 15px;
  padding-left: 15px;
  font-size: 50%;

  background-color: #304455;
  color:#E8E8E8 ;
  border: solid 1px grey;
}





#clock {
  order: 0;
  flex: 0 1 auto;
  align-self: center;
  margin-top: 225px;
  /* position: absolute; */
  /* bottom: 0; */

  color: black;
  /* //text-shadow: 0px 0px 25px $color; */
}

#clock hr{
  height: 1px;
  /* background-color: dimgray; */
  background-color:black;
  border: none;
  margin-top: -60px;
  width: 90%;
    
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
  height: 90%;
  font-size: 6em;
  left: 0;
  right: 0;
  text-align: center;
}
.solving-now-span{
  top:40%;
  position: absolute;
  height: 0%;
  left: 0;
  right: 0;
  text-align: center;
}


.index-input{
  /* top:10%; */
  /* position: absolute; */
  margin-top: 10px;
  height: 0%;
  left: 0;
  right: 0;
  text-align: center;
}

.index-input-field{
  width: 12.5%;
}

.menu-stats table{
  /* position: ; */
  margin-top:25px;
}

.AwesomeChart{
  position: absolute;
  width: 108%;
  left: -5%;

}





</style>

