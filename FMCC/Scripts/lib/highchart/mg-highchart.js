/**
 * @license mg-highchart v0.0.1
 * (c) 2016 Mostafizur Rahman http://github.com/
 * License: MIT
 */
(function (angular) {

    'use strict';

    angular
		.module('mgHighchart', [])
		.directive('highchart', ['$compile', '$parse', '$filter', function ($compile, $parse, $filter) {
		    return {
		        restrict: 'AEC',
                scope: {
                    
                },
                link: function ($scope, $element, $attributes) {
		            var opt = $parse($attributes.options)($scope);
		            $(function () {
		                $('#container').highcharts({
		                    title: opt.title,
		                    xAxis: opt.xAxis,
		                    labels: opt.labels,
		                    series: $parse($attributes.data)($scope)
		                });
		            });

		            //$scope.$watch($attributes.data, function () {
		            //    alert("changed");
		            //});
		        },
		        template: function (elem, attr) {
		            return '<div id="container"></div>';
		            
		        }
		    };

		}]);

})(angular);