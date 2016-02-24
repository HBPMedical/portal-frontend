/**
 * Created by Michael DESIGAUD on 12/08/2015.
 */

'use strict';
angular.module('chuvApp.models').controller('ReviewController',['$scope','$translatePartialLoader','$translate','Model','$stateParams','ChartUtil',"$state",'$log','User','$location', '$modal', '$timeout', '$filter', 'Variable', 'Group',
  function($scope, $translatePartialLoader, $translate, Model, $stateParams, ChartUtil, $state, $log, User, $location, $modal, $timeout, $filter, Variable, Group) {

    var filterFilter = $filter("filter");

    $translatePartialLoader.addPart('model');
    $translate.refresh();

    $scope.model = {};
    $scope.query = {};
    $scope.dataset = null;

    $scope.chartConfig = {
      type: 'designmatrix',
      height: 480,
      yAxisVariables: null,
      xAxisVariable: null
    };

    /**
     * load model by slug
     * @param slug
     */
    $scope.load = function (slug) {
      Model.get({slug: slug}, function(result) {
        $scope.model = result;
        $scope.dataset = result.dataset;
        if($stateParams.isCopy === "true"){
          $scope.model.title = "Copy of "+$scope.model.title;
        }
        $scope.chartConfig = result.config;
        $scope.query = result.query;

        $scope.$emit('event:loadModel',result);
        $scope.executeBtnAnimate();
        $scope.executed = true;
      });
    };

    if ($stateParams.slug !== undefined) {
      $scope.load($stateParams.slug);
    }


    /**
     * Return true if object has been created by current user
     * @param obj
     * @returns {boolean}
     */
    $scope.isMine = function (obj) {
      return obj.id == null || obj.createdBy.id == User.current().id;
    };

    /**
     * save or update model
     */
    $scope.saveModel = function() {
      $scope.model.config = $scope.chartConfig;
      $scope.model.dataset = $scope.dataset;
      $scope.model.query = angular.copy($scope.query); // will be modified, therefore we do a deep copy
      delete $scope.model.query.filterQuery;

      if ($scope.model.slug == null) {
        // save new model
        Model.save($scope.model, function (model) {
          $state.go('models-edit', {slug: model.slug});
          alert("Save ok");
        },function(){
          alert("Error on save!");
        });
      } else {
        // save existing model
        Model.update({slug: $scope.model.slug}, $scope.model, function (model) {
          $state.go('models-edit', {slug: model.slug});
          alert("Save ok");
        },function(){
          alert("Error on save!");
        });
      }
    };

    /**
     * Execute animation
     */
    $scope.executeBtnAnimate = function () {
      var searchHelpSelector = $('.search-help-container');
      var searchResultSelector = $('.search-result');
      new TimelineMax({ paused: true, onComplete: function () {
        TweenMax.set(searchHelpSelector, { position: 'absolute'});
        TweenMax.set(searchResultSelector, { position: 'relative', left: 0, x: 0, y: 0 });
      } })
        .fromTo(searchHelpSelector, 0.3, { scale: 1 }, { scale: 0.8 })
        .fromTo(searchHelpSelector, 0.3, {  autoAlpha: 1, x: '0%' }, { autoAlpha: 0, x: '40%' })
        .fromTo(searchResultSelector, 0.3, { scale: 0.8, autoAlpha: 0 }, { scale: 1, autoAlpha: 1 })
        .play();
    };

    /**
     * check if list contains value
     * @param list
     * @param value
     * @returns {boolean}
     */
    $scope.contains = function (list, value) {
      var findFunction = function (item) {
        return angular.equals(item, value)
      };

      return _.find(list, findFunction) !== undefined;
    };

    /**
     * Returns a promise that resolves when filterQuery is set.
     */
    $scope.configureFilterQuery = function () {
      var childScope = $scope.$new();

      var modal = $modal.open({
        templateUrl: 'scripts/app/models/review/filter-query-modal.html',
        scope: childScope,
        size: 'lg',
        controller: function () {
          childScope.contructQB = function () {

            var filterVariables = $scope.query.filters
              .concat($scope.query.coVariables)
              .concat($scope.query.groupings)
              .map(function (variable) {
                variable = $scope.allVariables[variable.code];
                return {
                  id: variable.code,
                  label: variable.label,
                  type: 'double',
                  operators: ['equal', 'not_equal', 'less', 'greater', 'between', 'not_between']
                }
              });

            $(".query-builder").queryBuilder({
              plugins: ['bt-tooltip-errors'],
              filters: filterVariables,
              allow_empty: true,
              inputs_separator: " - ",
              rules: $scope.query.filterQuery,
              icons: {
                add_group: "ti ti-plus",
                add_rule: "ti ti-plus",
                remove_group: "ti ti-close",
                remove_rule: "ti ti-close",
                error: "ti ti-na"
              }
            });

            if (!$scope.query.filterQuery && $scope.query.textQuery) {
              $(".query-builder").queryBuilder('setRulesFromSQL', $scope.query.textQuery)
            }
          };

          childScope.validateQuery = function () {
            var qb = $(".query-builder");
            if(qb.queryBuilder('validate')) {
              $scope.query.filterQuery = qb.queryBuilder('getRules');
              // ok this is not to be used in the DB, but is intented as a textual representation
              $scope.query.textQuery = qb.queryBuilder('getSQL', false, false).sql;
              qb.queryBuilder('destroy');
              modal.close();
            }
          }
        }
      });

      $scope.$on("$stateChangeStart", modal.dismiss);
      modal.result.then($scope.executeQuery);

      // do not unwrap this: childScope.contructQB is set later.
      modal.opened.then(function () {
        $timeout(
          childScope.contructQB,
          300
        )
      });


      return modal.result;
    };

    //$scope.executeQuery = function () {
    //  $scope.query.filters.length && !$scope.query.filterQuery
    //    ? $scope.configureFilterQuery().then(doExecuteQuery)
    //    : doExecuteQuery();
    //};

    /**
     *
     * @param model
     */
    $scope.loadResources = function (model) {
      Variable.query()
        .$promise.then(function (allVariables) {
          allVariables = _.sortBy(allVariables,"label");
          $scope.variables = filterFilter(allVariables, {isVariable: true});
          $scope.groupingVariables = filterFilter(allVariables, {isGrouping: true});
          $scope.coVariables = filterFilter(allVariables, {isCovariable: true});
          $scope.filterVariables = filterFilter(allVariables, {isFilter: true});

          $scope.allVariables = _.indexBy(allVariables, 'code');
          return Group.get().$promise;
        })
        .then(function (group) {
          $scope.groups = group.groups;
          _.extend($scope.query, model.query);
        });
    };

    /**
     * Execute a search query
     */
    $scope.executeQuery = function doExecuteQuery() {
      var query = angular.copy($scope.query);
      //check query
      var error = "";
      //The query must have at less a Variable, a Grouping and a Covariable to be sent to the API.
      if (query.variables.length < 1) {
        error += "The query must have at less a Variable.\n";
      }
      // check if grouping is complete
      if ($scope.contains(query.groupings, {code: undefined})) {
        error += "A grouping is not complete yet.\n";
      }

      if (query.coVariables.length < 1) {
        error += "The query must have at less a Covariable.\n";
      }
      // check if coVariables is complete
      if ($scope.contains(query.coVariables, {code: undefined})) {
        error += "A covariable is not complete yet.\n";
      }

      // check if filter is complete
      if ($scope.contains(query.filters, {operator: '', values: []})) {
        error += "A filter is not complete yet.\n";
      }
      if (error.length > 0) {
        alert(error);
        return;
      }

      $scope.loading_model = true;

      Model.executeQuery(query).success(function (queryResult) {
        $scope.executeBtnAnimate();
        $scope.executed = true;
        $scope.loading_model = false;
        $scope.dataset = queryResult;
        update_location_search();
        $scope.hcConfig = ChartUtil($scope.chartConfig, $scope.dataset);
      });
    }

    $scope.$on("chartConfigChanged", function () {
      $scope.hcConfig = ChartUtil($scope.chartConfig, $scope.dataset);
    });

    if ($location.search().execute) {

      // wait for data to be there before executing query.
      var watchOnce = $scope.$watchGroup(
        ["query.variables", "query.groupings", "query.coVariables", "variables"],
        function (newValue) {
          if (!_.all(newValue)) return;

          // unbind watch
          watchOnce();

          $scope.executeQuery();
        }
      );

    }

    function update_location_search() {

      function unmap_category(category) {
        return $scope.query[category]
          .map(function (variable) { return variable.code; })
          .join(",");
      }

      var query = {
        variable: unmap_category("variables"),
        covariable: unmap_category("coVariables"),
        grouping: unmap_category("groupings"),
        filter: unmap_category("filters"),
        query: $scope.query.textQuery,
        execute: true
      };

      angular.forEach(query, function(val, key) {
        $location.search(key, val);
      });
    }

    /**
     * programmatically redirects to the review model, with the current model.
     */
    $scope.go_to_explore = function () {
      var should_configure = $scope.query.variables &&
        $scope.query.groupings &&
        $scope.query.coVariables &&
        $scope.query.filters &&
        ($scope.query.variables.length ||
        $scope.query.groupings.length ||
        $scope.query.filters.length ||
        $scope.query.coVariables.length);

      if (!should_configure) {
        return $location.url("/explore")
      }

      function unmap_category(category) {
        return $scope.query[category]
          .map(function (variable) { return variable.code; })
          .join(",");
      }

      var query = {
        variable: unmap_category("variables"),
        covariable: unmap_category("coVariables"),
        grouping: unmap_category("groupings"),
        filter: unmap_category("filters")
      };

      $location.url(
        "/explore?configure=true&"
        + Object.keys(query).map(function (category) {
          return category + "=" + query[category]
        }).join("&"));
    };


  }
]);