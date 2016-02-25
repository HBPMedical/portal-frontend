/**
 * Created by Michael DESIGAUD on 12/08/2015.
 */

angular.module('chuvApp.util')
  .factory('ChartUtil', [function () {

    function buildDesignMatrix (config, dataset) {
      config.hasXAxis = false;

      return {
        options: {
          "chart": {
            "type":"heatmap",
            "zoomType":"y"
          },
          colorAxis: {
            minColor: '#FFFFFF',
            maxColor: '#000000'
          },
          yAxis: {
            title: null
          }
        },
        title: {
          text: "Design matrix"
        },
        xAxis: {
          categories: dataset.header,
          title: null
        },
        size: {
         height: config.height
        },
        series: [{
          name: null,
          borderWidth: 0,
          data: function() {

            // create a list of [coord X, coord Y, val]
            // this is the dataset expected by highcharts
            var result = [],
              idx1, idx2, data;

            for (idx1 = 0; idx1 < config.yAxisVariables.length; idx1++) {
              data = dataset.data[config.yAxisVariables[idx1]];
              for (idx2 = 0; idx2 < data.length; idx2++) {
                result.push([idx1, idx2, data[idx2]]);
              }
            }

            return result;
          }()
        }]
      };
    }

    function buildPieChart (config, dataset) {
      config.hasXAxis = false;

      var xCode = dataset.header[0];
      var yCode = dataset.header[1];
      var y2Code = dataset.header[2];

      var result = {
        xAxis: {
          code: xCode,
          title: { text: xCode},
          //categories: dataset.data[config.xAxis.code]
        },
        options: {
          chart: {
            type: "pie",
          },
          yAxis: [{title: {text: yCode}}]
        },
        size: {
         height: config.height
        },
        title: {
          text: null
        },
        series: [
          {name:yCode,data: dataset.data[yCode],code:yCode}
        ]
      };

      if(y2Code){
        result.series.push({name:y2Code,data: dataset.data[y2Code],type: 'scatter',code:y2Code})
      }

      return result;
    }

    function buildRegularChart (type) {

      function orderBy(orderAxis, targetAxis) {
        if (!orderAxis)
          return targetAxis;

        return _.unzip(
          _.sortBy(
            _.zip(orderAxis, targetAxis),
            0
          )
        )[1];
      }


      return function (config, dataset) {
        config.hasXAxis = true;

        var result = {
          xAxis: {
            code: config.xAxisVariable,
            title: { text: config.xAxisVariable},
            categories: _.sortBy(dataset.data[config.xAxisVariable])
          },
          title: {
            text: null
          },
          size: {
           height: config.height
          },
          options: {
            chart: {
              type: type
            }
          },
          series: config.yAxisVariables.map(function (code) {
            return {
              name: code,
              data: orderBy(dataset.data[config.xAxisVariable], dataset.data[code])
            }
          })
        };

        return result;
      }
    }

    return function (config, dataset) {

      if (!dataset) {
        return null;
      }
      if (!angular.isArray(config.yAxisVariables)) {
        config.yAxisVariables = _.clone(dataset.header);
      }

      return ({
        designmatrix: buildDesignMatrix,
        pie: buildPieChart,
        column: buildRegularChart("column"),
        scatter: buildRegularChart("scatter"),
        line: buildRegularChart("line")
      }[config.type] || angular.identity)(config, dataset);
    }

  }]);
