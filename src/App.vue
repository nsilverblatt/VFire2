<template>
  <div id="app">

    <h1 id="title">We can't fuck up this election.</h1>
    <p>If we have any hope of beating Trump in 2020, we need to make sure we all vote for the same person. <br> Rank the top 3 candidates from the polls.
    See what other people think. It's that simple.<br> At the end of each week, we'll post the winner from that past week. </p>

    <column-chart :data="arr" :colors="['#f4f700', '#666']" :max="100" suffix="%"></column-chart>

    <h1>Rank your top Candidates</h1>
    <!--this is where you drag to reorder your ranking-->
    <form id="vote-form">
      <draggable v-model="myArray" ghost-class="ghost" @end="onEnd">
        <transition-group type="transition" name="flip-list">
          <div class="sortable" :id="element.id" v-for="element in myArray" :key="element.id">
            <strong> {{element.name}}</strong>
          </div>
        </transition-group>

      </draggable>


      <!--<h1>{{myKeyArrayOnLoad}}</h1>
      <h1>{{myValArrayOnLoad}}</h1>
      <h1>{{aggregateArray}}</h1>-->



      <!--button for submitting-->
      <br>
        <button id="myButton" @click="submitName(); disableButton()">Submit</button>
      </form>

      <h5 style="text-align: center" id="chartTitle"></h5>
      <div id="chartContainer" style="height: 300px;width:100%"></div>
    </div>


  </template>

  <script>
      import draggable from 'vuedraggable'
      import {namesRef} from './firebase'
      import {totalVotes} from './firebase'
      import {Bar, mixins, default as VueChartJs} from 'vue-chartjs'
      import Vue from 'vue'
      import VueChart from 'vue-chart'
      import Chartkick from 'vue-chartkick'
      import Chart from 'chart.js'
      Vue.use(VueChart);
      Vue.use(Chartkick.use(Chart));



      export default {
          name: 'App',
          components: {
              draggable,
              VueChart
          },
          props: {
              msg: String
          },

          data(){
              var myKeyArrayOnLoad = [];
              var myValArrayOnLoad = [];
              var arr = [];
              var percentageArray = [];
              var aggregateArray = [];
              totalVotes.on("child_added", function (snapshot) {
                  myKeyArrayOnLoad.push(snapshot.key);
                  myValArrayOnLoad.push(snapshot.val());


                  // turn points into percents
                  function getPercentagePerKey(myArray) {
                      var sum = getSum(myArray);
                      var arrayWithPercentages = [];
                      for (var keyy in myArray) {
                          var val = myArray[keyy];
                          var percentage = (val / sum) * 100;
                          arrayWithPercentages.push({keyy, percentage});
                      }
                      return arrayWithPercentages;
                  }

                  function getSum(myArray) {
                      var sum = 0;
                      for (var keyy in myArray) {
                          sum += myArray[keyy];
                      }
                      return sum;
                  }
                  var percentageArray = getPercentagePerKey(myValArrayOnLoad);
                  if ((typeof Object.values(percentageArray)[0] !== "undefined")  && (typeof Object.values(percentageArray)[1] !== "undefined")
                      && (typeof Object.values(percentageArray)[2] !== "undefined"))
              {
                      var firstPercent = Object.values(percentageArray)[0]['percentage'];
                      var secondPercent = Object.values(percentageArray)[1]['percentage'];
                      var thirdPercent =  Object.values(percentageArray)[2]['percentage'];
                  }
                  aggregateArray = [parseFloat(firstPercent).toFixed(2), parseFloat(secondPercent).toFixed(2), parseFloat(thirdPercent).toFixed(2)];




                  // this is to collect data to graph (needs to be in [[  ]] format) - using percents from aggegateArray
                  var result = {};
                  myKeyArrayOnLoad.forEach((key, i) => result[key] = aggregateArray[i]);
                  for (var key in result) {
                      if (result.hasOwnProperty(key)) {
                          arr.push( [ key, result[key] ] );
                      }
                  }



              });

              return{
                  names:namesRef,

                  myArray: [
                      {name: "Joe Biden", id: "Biden"},
                      {name: "Elizabeth Warren", id: "Warren"},
                      {name: "Kamala Harris", id: "Harris"},
                  ],
                  oldIndex: '',
                  newIndex: '',
                  myKeyArrayOnLoad: myKeyArrayOnLoad,
                  myValArrayOnLoad: myValArrayOnLoad,
                  arr: arr,
                  percentageArray: percentageArray,
                  aggregateArray: aggregateArray
              }

          },



          //onUpdate(){
           //   //here you have access to the update list via this.list...
           //   this.$emit('updated', this.list);
          //},

          methods:{

              onEnd: function(evt){
                  this.oldIndex = evt.oldIndex;
                  this.newIndex = evt.newIndex;

              },


              submitName() {
                  var topChoice = this.myArray[0]["id"];
                  var secondChoice = this.myArray[1]["id"];
                  var thirdChoice = this.myArray[2]["id"];

                  //add the value to firebase's total values for each candidate
                  totalVotes.on("child_added", function (snapshot) {
                      if(topChoice === snapshot.key){
                          const keyy = snapshot.key;
                          const xx = snapshot.val();
                          const snapshot_val_added = xx + 3;
                          totalVotes.update({[keyy]: snapshot_val_added});
                      }
                      if(secondChoice === snapshot.key){
                          const keyy = snapshot.key;
                          const xx = snapshot.val();
                          const snapshot_val_added = xx + 2;
                          totalVotes.update({[keyy]: snapshot_val_added});
                      }
                      if(thirdChoice === snapshot.key){
                          const keyy = snapshot.key;
                          const xx = snapshot.val();
                          const snapshot_val_added = xx + 1;
                          totalVotes.update({[keyy]: snapshot_val_added});
                      }

                  });
                  // NEED IT TO FORCE RELOAD OR SOMETHING TO UPDATE VALUES
                  Object.assign(this.$data, this.$options.data.apply(this))


              },

              disableButton(){
                  myButton.disabled = true
              },




          }

      }






  </script>

  <style lang="scss">

    body{
      background: rgb(29, 172, 231);
    }
    #app {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #2c3e50;
      padding: 4em;
    }
button{
background-color: transparent;
border: 2px solid black;

}

    .sortable {
      width: 100%;
      background: white;
      padding: 1em;
      cursor: move;
      margin-bottom: 2px;

      span{
        float: right;
      }
    }

    .hello .sortable-drag {
      opacity: 0;
    }
    .flip-list-move {
      transition: transform 0.5s;
    }
    .myButton{
      padding: 1em;
    }
    .ghost{
      border-left: 6px solid rgb(0, 183, 255);
      box-shadow: 10px 10px 5px -1px rgba(0,0,0,0.14);
      opacity: .7;

      &::before{
        content: " ";
        position: absolute;
        width: 20px;
        height: 20px;
        margin-left: -50px;
      }
    }
  </style>
