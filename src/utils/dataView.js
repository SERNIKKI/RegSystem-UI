import echarts from 'echarts'
//颜色集合
var colors = ['#ee6666', '#73c0de', '#5470c6', '#fac858', '#91cc75', '#fb764a', '#4ECE3D', '#FACA00']


// 折线图
const lineChart = (params, className, data, arr, arr1) => {
  return new line(params, className, data, arr, arr1)
}

function line(params, className, data, arr, arr1) {
  if (params == 'resize') {
    this.resize(className, data)
    return
  } else if (params == 'pushData') {
    this.init(className, data, arr, arr1);
    return
  }
  this.init(params);
}

line.prototype = {
  init: function (params, data, arr, arr1) {
    var options = []
    var xData = []
    let series = []
    // 随机数
    if (data) {
      console.log(arr)
      xData = data.xList
      arr.forEach((ele, index) => {
        series.push(
          {
            name: arr[index],
            data: data.yList[arr1[index]],
            type: 'line',
            showBackground: true,
            color: colors[Math.ceil(Math.random() * 8)],
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            barWidth: 30,//柱图宽度
          }
        )
      });
    } else {
      xData = ['默认折线图']
      series = [{
        data: [150],
        type: 'line',
        color: colors[Math.ceil(Math.random() * 8)],
      }]
    }

    options = {
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'axis'
      },
      series: series
    },
      this.setLinechart(options, params)
  },
  setLinechart: function (options, params) {
    this.lineChart = echarts.init(
      document.getElementsByClassName(params)[0]
    );
    this.lineChart.setOption(options);
  },
  resize: function (className) {
    this.lineChart = echarts.init(
      document.getElementsByClassName(className)[0]
    );
    this.lineChart.resize()
  }
}

// 柱状图
const barChart = (params, className, data, arr, arr1) => {
  return new bar(params, className, data, arr, arr1)
}

function bar(params, className, data, arr, arr1) {
  if (params == 'resize') {
    this.resize(className)
    return
  } else if (params == 'pushData') {
    this.init(className, data, arr, arr1);
    return
  }
  this.init(params);
}

bar.prototype = {
  init: function (params, data, arr, arr1) {
    var options = []
    var xData = []
    let series = []
    // 随机数
    if (data) {
      console.log(arr)
      xData = data.xList
      arr.forEach((ele, index) => {
        series.push(
          {
            name: arr[index],
            data: data.yList[arr1[index]],
            type: 'bar',
            showBackground: true,
            color: colors[Math.ceil(Math.random() * 8)],
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },
            barWidth: 30,//柱图宽度
          }
        )
      });
    } else {
      xData = ['柱', '状', '图']
      series = [
        {
          data: [100, 150, 120],
          type: 'bar',
          showBackground: true,
          color: colors[Math.ceil(Math.random() * 8)],
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          },
          barWidth: 30,//柱图宽度
        }
      ]
    }
    options = {
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value'
      },
      tooltip: {
        trigger: 'item'
      },
      series: series
    },
      this.setbarchart(options, params)
  },
  setbarchart: function (options, params) {
    this.barChart = echarts.init(
      document.getElementsByClassName(params)[0]
    );
    this.barChart.setOption(options);
  },
  resize: function (className) {
    this.barChart = echarts.init(
      document.getElementsByClassName(className)[0]
    );
    this.barChart.resize()
  }
}

// 饼图
const pieChart = (params, className, data) => {
  return new pie(params, className, data)
}

function pie(params, className, data) {
  if (params == 'resize') {
    this.resize(className)
    return
  } else if (params == 'pushData') {
    this.init(className, data);
    return
  }
  this.init(params);
}

pie.prototype = {
  init: function (params, data) {
    var options = []
    var Data = []
    if (data) {
      Data = data.map((item, idx) => ({
        value: item.VALUE,
        name: item.NAME,
        itemStyle: {
          normal: {
            color: colors[idx]
          }
        }
      }));
    } else {
      Data = [
        {
          value: 1048, name: '初始数据', itemStyle: {
            normal: {
              color: colors[0]
            }
          }
        },
        {
          value: 735, name: '初始数据', itemStyle: {
            normal: {
              color: colors[1]
            }
          }
        },
        {
          value: 580, name: '初始数据', itemStyle: {
            normal: {
              color: colors[2]
            }
          }
        },
      ]
    }
    options = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          labelLine: {
            normal: {
              smooth: 0.2,
            }
          },
          data: Data,
          top: "60"
        }
      ]
    },
      this.setpiechart(options, params)
  },
  setpiechart: function (options, params) {
    this.pieChart = echarts.init(
      document.getElementsByClassName(params)[0]
    );
    this.pieChart.setOption(options);
  },
  resize: function (className) {
    this.pieChart = echarts.init(
      document.getElementsByClassName(className)[0]
    );
    this.pieChart.resize()
  }
}

// 混搭图
const groupChart = (params, className, data, arr) => {
  return new group(params, className, data, arr)
}

function group(params, className, data, arr) {
  if (params == 'resize') {
    this.resize(className)
    return
  } else if (params == 'pushData') {
    this.init(className, data, arr);
    return
  }
  this.init(params);
}

group.prototype = {
  init: function (params, data, arr) {
    var options = []
    var xData = []
    var yData1 = []
    var yData2 = []
    if (data) {
      console.log(arr)
      xData = data.xList
      if (arr.length <= 2) {
        yData1 = data.yList[arr[1]]
        yData2 = []
      } else {
        yData1 = data.yList[arr[1]]
        yData2 = data.yList[arr[3]]
      }
      console.log(yData1)
      console.log(yData2)
    } else {
      xData = ['混', '搭', '图']
      yData1 = [20, 22, 33]
      yData2 = [2.0, 4.9, 7.0]
    }

    if (!arr) {
      var arr = []
    }
    // 随机数
    var num1 = Math.ceil(Math.random() * 8)
    var num2 = Math.ceil(Math.random() * 8)
    options = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      // legend: {
      //     data: ['蒸发量', '平均温度']
      // },
      xAxis: [
        {
          type: 'category',
          data: xData,
          axisPointer: {
            type: 'shadow'
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: arr[0] || arr[1] || '', //展示中文名，没有展示英文
          // interval: 50,
          axisLabel: {
            // formatter: '{value} ml'
          }
        },
        {
          type: 'value',
          name: arr[2] || arr[3] || '',
          axisLabel: {
            // formatter: '{value} °C',
            color: '#000'
          }
        }
      ],
      series: [
        {
          // name: '蒸发量',
          type: 'bar',
          color: colors[num1],
          data: yData1,
          barWidth: 30,//柱图宽度
        },
        {
          // name: '平均温度',
          type: 'line',
          yAxisIndex: 1,
          color: colors[num2],
          data: yData2
        }
      ]
    },
      this.setgroupchart(options, params)
  },
  setgroupchart: function (options, params) {
    this.groupChart = echarts.init(
      document.getElementsByClassName(params)[0]
    );
    this.groupChart.setOption(options);
  },
  resize: function (className) {
    this.groupChart = echarts.init(
      document.getElementsByClassName(className)[0]
    );
    this.groupChart.resize()
  }
}
export {lineChart, barChart, pieChart, groupChart}
