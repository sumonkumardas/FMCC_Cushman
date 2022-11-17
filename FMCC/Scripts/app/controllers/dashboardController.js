angular.module("fmccwebportal").controller("dashboardController", function ($scope, $http, dashboardService, readingService, $document, $routeParams) {

    //------------details------------------------
    var dashboard = {};
    var dateFormat = 'YYYY-MM-DD hh:mm A';
    dashboard.offset = 0;
    dashboard.period = "sofartoday";
    dashboard.type = "overall";
    dashboard.field = "waterconsumption";
    dashboard.siteIdRouteValue = "";
    $scope.siteLattitude = 0.0;
    $scope.siteLongitude = 0.0;
    $('#waterUnitName').text(waterConsumptionUnit);
    $('#powerUnitName').text(powerComsumptionUnit);

    if (typeof $routeParams.siteId != 'undefined') {
        //alert($routeParams.siteId);
        dashboard.siteIdRouteValue = $routeParams.siteId;
    }

    if (typeof $routeParams.siteLattitude != 'undefined') {
        //alert($routeParams.siteId);
        dashboard.siteLattitude = $routeParams.siteLattitude;
    }

    if (typeof $routeParams.siteLongitude != 'undefined') {
        //alert($routeParams.siteId);
        dashboard.siteLongitude = $routeParams.siteLongitude;
    }
    
    $('#siteId').val($routeParams.siteId);

    $http.get("/api/getsitebyid", { params: { siteId: $("#siteId").val() } }).then(function (res) {
        $scope.siteName = res.data.model.Name;
    });
    document.getElementById("homedashboardLink").href = "#/dashboard/" + dashboard.siteIdRouteValue + "/" + dashboard.siteLattitude + "/" + dashboard.siteLongitude;
    document.getElementById("homedashboardCampViewLink").href = "#/campView/" + dashboard.siteIdRouteValue + "/" + dashboard.siteLattitude + "/" + dashboard.siteLongitude;
    function makeDigitSmall(number) {
        var length = number.toString().split('.')[0].length;

        if (length > 5) {
            var val = number / 1000;
            return val.toFixed(0) + ' k';
        }
    }

    dashboard.view = {
        sofartoday: function (res, offset) {
            if (res.okay) {
                var json = res.model;
                var overall = {},
                  overallData = [],
                  overallAverage = [],
                  overallCategory = [],
                  omin = Number.MAX_SAFE_INTEGER,
                  omax = Number.MIN_SAFE_INTEGER;

                json.Overall.Reading.forEach(function (item) {
                    var key = item["Key"];
                    var sum = item["Sum"];
                    //category and data
                    overallCategory.push(moment(key, "hh").format("hh:mm A"));
                    overallData.push({ y: sum });
                    overallAverage.push({ y: json.Overall.Average });
                    //find minimum
                    omin = sum < omin ? sum : omin;
                    omax = sum > omax ? sum : omax;
                });

                $scope.info.total = json.Overall.Total ? makeDigitSmall(json.Overall.Total) : "...";
                $scope.info.forecast = json.Overall.ForeCast ? makeDigitSmall(json.Overall.ForeCast) : "...";

                if (json.Overall.Minimum) {
                    if (json.Overall.Minimum.Value) {
                        if (json.Overall.Minimum.Value > 0) {
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else if (json.Overall.Minimum.Value < 0) {
                            json.Overall.Minimum.Value = -json.Overall.Minimum.Value;
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else {
                            $scope.info.minimum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.minimum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.minimum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Maximum) {
                    if (json.Overall.Maximum.Value) {
                        if (json.Overall.Maximum.Value > 0) {
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else if (json.Overall.Maximum.Value < 0) {
                            json.Overall.Maximum.Value = -json.Overall.Maximum.Value;
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else {
                            $scope.info.maximum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.maximum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.maximum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Total && json.Overall.PreviousTotal) {
                    var totalCompare = (((json.Overall.Total - json.Overall.PreviousTotal) * 100) / json.Overall.PreviousTotal);
                    if (totalCompare > 0) {
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Higher than Yesterday";
                    } else if (totalCompare < 0) {
                        totalCompare = -totalCompare;
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Lower than Yesterday";
                    } else {
                        $scope.info.totalCompare = "...";
                    }
                } else {
                    $scope.info.totalCompare = "...";
                }

                if (json.Overall.ForeCast && json.Overall.PreviousForeCast) {
                    var forcastCompare = (((json.Overall.ForeCast - json.Overall.PreviousForeCast) * 100) / json.Overall.PreviousForeCast);
                    if (forcastCompare > 0) {
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Higher than Yesterday";
                    } else if (forcastCompare < 0) {
                        forcastCompare = -forcastCompare;
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + " % Lower than Yesterday";
                    } else {
                        $scope.info.forcastCompare = "...";
                    }
                } else {
                    $scope.info.forcastCompare = "...";
                }

                overall = angular.element("<div></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({width:"557px", display:"block",height: "400px", opacity: 1 });
                overall.highcharts(dashboard.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -45;
                    config.xAxis.labels.align = "right";
                    config.xAxis.categories = overallCategory;
                    //yaxis
                    config.yAxis.max = Math.round(omax);
                    //config.yAxis.tickInterval = 500;
                    config.yAxis.min = omin > 0 ? Math.round(Math.round(Math.round(omin) / 2)) : 0;
                    //series
                    config.series[0].data = overallData;
                    config.series[1].data = overallAverage;
                    //plotoption
                    config.plotOptions.series = {}
                    config.plotOptions.series.groupPadding = 0.02;
                    //tooltip
                    config.tooltip.shared = true;
                    config.tooltip.useHTML = true;
                    config.tooltip.footerFormat = "</table>";
                    config.tooltip.headerFormat = "<span>" + moment().add(offset, "day").format("YYYY-MM-DD") + " {point.key}</span><table>";
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "/h </td></tr>";
                }));
                dashboard.container.overall.html(overall);

                dashboard.container.individual.html("");
                json.Individual.forEach(function (individual) {
                    var elm = {},
                        individualData = [],
                        individualAverage = [],
                        individualCategory = [],
                        name = individual.BuildingId,
                        imin = Number.MAX_SAFE_INTEGER,
                        imax = Number.MIN_SAFE_INTEGER;

                    individual.Reading.forEach(function (item) {
                        var key = item["Key"];
                        var sum = item["Sum"];
                        //category and data
                        individualCategory.push(moment(key, "hh").format("hh:mm A"));
                        individualData.push({ y: sum });
                        individualAverage.push({ y: individual.Average });
                        //find minimum
                        imin = sum < imin ? sum : imin;
                        imax = sum > imax ? sum : imax;
                    });

                    elm = dashboard.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-hourly").addClass("active").highcharts(dashboard.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -45;
                        config.xAxis.labels.align = "right";
                        config.xAxis.categories = individualCategory;
                        //yaxis
                        config.yAxis.max = Math.round(imax);
                        //config.yAxis.tickInterval = 500;
                        config.yAxis.min = imin > 0 ? Math.round(Math.round(imin) / 2) : 0;
                        //series
                        config.series[0].data = individualData;
                        config.series[1].data = individualAverage;
                        //plotoption
                        config.plotOptions.series = {}
                        config.plotOptions.series.groupPadding = 0.02;
                        //tooltip
                        config.tooltip.shared = true;
                        config.tooltip.useHTML = true;
                        config.tooltip.footerFormat = "</table>";
                        config.tooltip.headerFormat = "<span>" + moment().add(offset, "day").format("YYYY-MM-DD") + " {point.key}</span><table>";
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "/h </td></tr>";
                    }))
                    dashboard.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        sofarthisweek: function (res, offset) {
            if (res.okay) {
                var json = res.model;
                var overall = {},
                  overallData = [],
                  overallAverage = [],
                  overallCategory = [],
                  overallTempData = [],
                  overallTempCategory = [],
                  omin = Number.MAX_SAFE_INTEGER,
                  omax = Number.MIN_SAFE_INTEGER;

                json.Overall.Reading.forEach(function (item) {
                    var key = parseInt(item["Key"]);
                    var sum = item["Sum"];
                    //overall hourly
                    omin = sum < omin ? sum : omin;
                    omax = sum > omax ? sum : omax;
                    switch (key) {
                        case 1:
                            overallTempCategory[6] = "Sun";
                            overallTempData[6] = [moment().add(offset * 7, "day").isoWeekday(7).format("YYYY-MM-DD") + " " + "(Sunday)", sum];
                            break;
                        case 2:
                            overallTempCategory[0] = "Mon";
                            overallTempData[0] = [moment().add(offset * 7, "day").isoWeekday(1).format("YYYY-MM-DD") + " " + "(Monday)", sum];
                            break;
                        case 3:
                            overallTempCategory[1] = "Tue";
                            overallTempData[1] = [moment().add(offset * 7, "day").isoWeekday(2).format("YYYY-MM-DD") + " " + "(Tuesday)", sum];
                            break;
                        case 4:
                            overallTempCategory[2] = "Wed";
                            overallTempData[2] = [moment().add(offset * 7, "day").isoWeekday(3).format("YYYY-MM-DD") + " " + "(Wednesday)", sum];
                            break;
                        case 5:
                            overallTempCategory[3] = "Thu";
                            overallTempData[3] = [moment().add(offset * 7, "day").isoWeekday(4).format("YYYY-MM-DD") + " " + "(Thursday)", sum];
                            break;
                        case 6:
                            overallTempCategory[4] = "Fri";
                            overallTempData[4] = [moment().add(offset * 7, "day").isoWeekday(5).format("YYYY-MM-DD") + " " + "(Friday)", sum];
                            break;
                        case 7:
                            overallTempCategory[5] = "Sat";
                            overallTempData[5] = [moment().add(offset * 7, "day").isoWeekday(6).format("YYYY-MM-DD") + " " + "(Satarday)", sum];
                            break;
                        default:
                            break;
                    }
                });

                overallTempData.forEach(function (item) {
                    if (item) {
                        overallData.push(item);
                    }
                });
                overallTempCategory.forEach(function (item) {
                    if (item) {
                        overallCategory.push(item);
                        overallAverage.push({ y: json.Overall.Average });
                    }
                });

                $scope.info.total = json.Overall.Total ? json.Overall.Total.toFixed(0) : "...";
                $scope.info.forecast = json.Overall.ForeCast ? json.Overall.ForeCast.toFixed(0) : "...";

                if (json.Overall.Minimum) {
                    if (json.Overall.Minimum.Value) {
                        if (json.Overall.Minimum.Value > 0) {
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else if (json.Overall.Minimum.Value < 0) {
                            json.Overall.Minimum.Value = -json.Overall.Minimum.Value;
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else {
                            $scope.info.minimum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.minimum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.minimum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Maximum) {
                    if (json.Overall.Maximum.Value) {
                        if (json.Overall.Maximum.Value > 0) {
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else if (json.Overall.Maximum.Value < 0) {
                            json.Overall.Maximum.Value = -json.Overall.Maximum.Value;
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else {
                            $scope.info.maximum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.maximum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.maximum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Total && json.Overall.PreviousTotal) {
                    var totalCompare = (((json.Overall.Total - json.Overall.PreviousTotal) * 100) / json.Overall.PreviousTotal);
                    if (totalCompare > 0) {
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Higher than Last Week";
                    } else if (totalCompare < 0) {
                        totalCompare = -totalCompare;
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Lower than Last Week";
                    } else {
                        $scope.info.totalCompare = "...";
                    }
                } else {
                    $scope.info.totalCompare = "...";
                }

                if (json.Overall.ForeCast && json.Overall.PreviousForeCast) {
                    var forcastCompare = (((json.Overall.ForeCast - json.Overall.PreviousForeCast) * 100) / json.Overall.PreviousForeCast);
                    if (forcastCompare > 0) {
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Higher than Last Week";
                    } else if (forcastCompare < 0) {
                        forcastCompare = -forcastCompare;
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Lower than Last Week";
                    } else {
                        $scope.info.forcastCompare = "...";
                    }
                } else {
                    $scope.info.forcastCompare = "...";
                }

                overall = angular.element("<div></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "557px", display: "block", height: "400px", opacity: 1 });
                overall.highcharts(dashboard.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -45;
                    config.xAxis.labels.align = "right";
                    config.xAxis.categories = overallCategory;
                    //yaxis
                    config.yAxis.max = omax;
                    //config.yAxis.tickInterval = 500;
                    config.yAxis.min = omin > 0 ? Math.round(Math.round(omin) / 2) : 0;
                    //series
                    config.series[0].data = overallData;
                    config.series[1].data = overallAverage;
                    //plotoption
                    config.plotOptions.series = {}
                    config.plotOptions.series.groupPadding = 0.02;
                    //tooltip
                    config.tooltip.shared = true;
                    config.tooltip.useHTML = true;
                    config.tooltip.footerFormat = "</table>";
                    config.tooltip.headerFormat = "<span>{point.key}</span><table>";
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "</td></tr>";
                }));
                dashboard.container.overall.html(overall);

                dashboard.container.individual.html("");
                json.Individual.forEach(function (individual) {
                    var elm = {},
                        individualData = [],
                        individualAverage = [],
                        individualCategory = [],
                        individualTempData = [],
                        individualTempCategory = [],
                        name = individual.BuildingId,
                        imin = Number.MAX_SAFE_INTEGER,
                        imax = Number.MIN_SAFE_INTEGER;
                    //individual weekly data manipulation
                    individual.Reading.forEach(function (item) {
                        var key = parseInt(item["Key"]);
                        var sum = item["Sum"];
                        //overall hourly    
                        imin = sum < imin ? sum : imin;
                        imax = sum > imax ? sum : imax;
                        switch (key) {
                            case 1:
                                individualTempCategory[6] = "Sun";
                                individualTempData[6] = [moment().add(offset * 7, "day").isoWeekday(7).format("YYYY-MM-DD") + " " + "(Sunday)", sum];
                                break;
                            case 2:
                                individualTempCategory[0] = "Mon";
                                individualTempData[0] = [moment().add(offset * 7, "day").isoWeekday(1).format("YYYY-MM-DD") + " " + "(Monday)", sum];
                                break;
                            case 3:
                                individualTempCategory[1] = "Tue";
                                individualTempData[1] = [moment().add(offset * 7, "day").isoWeekday(2).format("YYYY-MM-DD") + " " + "(Tuesday)", sum];
                                break;
                            case 4:
                                individualTempCategory[2] = "Wed";
                                individualTempData[2] = [moment().add(offset * 7, "day").isoWeekday(3).format("YYYY-MM-DD") + " " + "(Wednesday)", sum];
                                break;
                            case 5:
                                individualTempCategory[3] = "Thu";
                                individualTempData[3] = [moment().add(offset * 7, "day").isoWeekday(4).format("YYYY-MM-DD") + " " + "(Thursday)", sum];
                                break;
                            case 6:
                                individualTempCategory[4] = "Fri";
                                individualTempData[4] = [moment().add(offset * 7, "day").isoWeekday(5).format("YYYY-MM-DD") + " " + "(Friday)", sum];
                                break;
                            case 7:
                                individualTempCategory[5] = "Sat";
                                individualTempData[5] = [moment().add(offset * 7, "day").isoWeekday(6).format("YYYY-MM-DD") + " " + "(Satarday)", sum];
                                break;
                            default:
                                break;
                        }
                    });
                    individualTempData.forEach(function (item) {
                        if (item) {
                            individualData.push(item);
                        }
                    });
                    individualTempCategory.forEach(function (item) {
                        if (item) {
                            individualCategory.push(item);
                            individualAverage.push({ y: individual.Average });
                        }
                    });
                    //individual weekly chart
                    elm = dashboard.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-weekly").addClass("active").highcharts(dashboard.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -45;
                        config.xAxis.labels.align = "right";
                        config.xAxis.categories = individualCategory;
                        //yaxis
                        config.yAxis.max = imax;
                        //config.yAxis.tickInterval = 500;
                        config.yAxis.min = imin > 0 ? Math.round(Math.round(imin) / 2) : 0;
                        //series
                        config.series[0].data = individualData;
                        config.series[1].data = individualAverage;
                        //plotoption
                        config.plotOptions.series = {}
                        config.plotOptions.series.groupPadding = 0.02;
                        //tooltip
                        config.tooltip.shared = true;
                        config.tooltip.useHTML = true;
                        config.tooltip.footerFormat = "</table>";
                        config.tooltip.headerFormat = "<span>{point.key}</span><table>";
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "</td></tr>";
                    }))
                    dashboard.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        sofarthismonth: function (res, offset) {
            if (res.okay) {
                var json = res.model;
                var overall = {},
                  overallData = [],
                  overallAverage = [],
                  overallCategory = [],
                  omin = Number.MAX_SAFE_INTEGER,
                  omax = Number.MIN_SAFE_INTEGER;

                json.Overall.Reading.forEach(function (item) {
                    var key = item["Key"];
                    var sum = item["Sum"];
                    //category and data
                    overallCategory.push(key);
                    overallData.push([moment().add(offset, "month").date(parseInt(key)).format("YYYY-MM-DD"), sum]);
                    overallAverage.push({ y: json.Overall.Average });
                    //overall hourly
                    omin = sum < omin ? sum : omin;
                    omax = sum > omax ? sum : omax;
                });

                $scope.info.total = json.Overall.Total ? json.Overall.Total.toFixed(0) : "...";
                $scope.info.forecast = json.Overall.ForeCast ? json.Overall.ForeCast.toFixed(0) : "...";

                if (json.Overall.Minimum) {
                    if (json.Overall.Minimum.Value) {
                        if (json.Overall.Minimum.Value > 0) {
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else if (json.Overall.Minimum.Value < 0) {
                            json.Overall.Minimum.Value = -json.Overall.Minimum.Value;
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else {
                            $scope.info.minimum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.minimum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.minimum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Maximum) {
                    if (json.Overall.Maximum.Value) {
                        if (json.Overall.Maximum.Value > 0) {
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else if (json.Overall.Maximum.Value < 0) {
                            json.Overall.Maximum.Value = -json.Overall.Maximum.Value;
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else {
                            $scope.info.maximum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.maximum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.maximum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Total && json.Overall.PreviousTotal) {
                    var totalCompare = (((json.Overall.Total - json.Overall.PreviousTotal) * 100) / json.Overall.PreviousTotal)
                    if (totalCompare > 0) {
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Higher than Last Month";
                    } else if (totalCompare < 0) {
                        totalCompare = -totalCompare;
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Lower than Last Month";
                    } else {
                        $scope.info.totalCompare = "...";
                    }
                } else {
                    $scope.info.totalCompare = "...";
                }

                if (json.Overall.ForeCast && json.Overall.PreviousForeCast) {
                    var forcastCompare = (((json.Overall.ForeCast - json.Overall.PreviousForeCast) * 100) / json.Overall.PreviousForeCast);
                    if (forcastCompare > 0) {
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Higher than Last Month";
                    } else if (forcastCompare < 0) {
                        forcastCompare = -forcastCompare;
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Lower than Last Month";
                    } else {
                        $scope.info.forcastCompare = "...";
                    }
                } else {
                    $scope.info.forcastCompare = "...";
                }

                overall = angular.element("<div></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "557px", display: "block", height: "400px", opacity: 1 });
                overall.highcharts(dashboard.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -45;
                    config.xAxis.labels.align = "right";
                    config.xAxis.categories = overallCategory;
                    //yaxis
                    config.yAxis.max = omax;
                    //config.yAxis.tickInterval = 500;
                    config.yAxis.min = omin > 0 ? Math.round(Math.round(omin) / 2) : 0;
                    //series
                    config.series[0].data = overallData;
                    config.series[1].data = overallAverage;
                    //plotoption
                    config.plotOptions.series = {}
                    config.plotOptions.series.groupPadding = 0.02;
                    //tooltip
                    config.tooltip.shared = true;
                    config.tooltip.useHTML = true;
                    config.tooltip.footerFormat = "</table>";
                    config.tooltip.headerFormat = "<span>{point.key}</span><table>";
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "</td></tr>";
                }));
                dashboard.container.overall.html(overall);

                dashboard.container.individual.html("");
                json.Individual.forEach(function (individual) {
                    var elm = {},
                        individualData = [],
                        individualAverage = [],
                        individualCategory = [],
                        name = individual.BuildingId,
                        imin = Number.MAX_SAFE_INTEGER,
                        imax = Number.MIN_SAFE_INTEGER;

                    individual.Reading.forEach(function (item) {
                        var key = item["Key"];
                        var sum = item["Sum"];
                        //category and data
                        individualCategory.push(key);
                        individualData.push([moment().add(offset, "month").date(parseInt(key)).format("YYYY-MM-DD"), sum]);
                        individualAverage.push({ y: individual.Average });
                        //overall hourly
                        imin = sum < imin ? sum : imin;
                        imax = sum > imax ? sum : imax;
                    });

                    elm = dashboard.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-daily").addClass("active").highcharts(dashboard.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -45;
                        config.xAxis.labels.align = "right";
                        config.xAxis.categories = individualCategory;
                        //yaxis
                        config.yAxis.max = imax;
                        //config.yAxis.tickInterval = 500;
                        config.yAxis.min = imin > 0 ? Math.round(imin * 1 / 2) : 0;
                        //series
                        config.series[0].data = individualData;
                        config.series[1].data = individualAverage;
                        //plotoption
                        config.plotOptions.series = {}
                        config.plotOptions.series.groupPadding = 0.02;
                        //tooltip
                        config.tooltip.shared = true;
                        config.tooltip.useHTML = true;
                        config.tooltip.footerFormat = "</table>";
                        config.tooltip.headerFormat = "<span>{point.key}</span><table>";
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "</td></tr>";
                    }))
                    dashboard.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        sofarthisyear: function (res, offset) {
            if (res.okay) {
                var json = res.model;

                var overall = {},
                  overallData = [],
                  overallAverage = [],
                  overallCategory = [],
                  overallTempData = [],
                  overallTempCategory = [],
                  omin = Number.MAX_SAFE_INTEGER,
                  omax = Number.MIN_SAFE_INTEGER;

                json.Overall.Reading.forEach(function (item) {
                    var key = parseInt(item["Key"]);
                    var sum = item["Sum"];
                    //overall hourly
                    omin = sum < omin ? sum : omin;
                    omax = sum > omax ? sum : omax;
                    switch (key) {
                        case 1:
                            overallTempCategory[0] = "Jan";
                            overallTempData[0] = ["January " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 2:
                            overallTempCategory[1] = "Feb";
                            overallTempData[1] = ["February " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 3:
                            overallTempCategory[2] = "Mar";
                            overallTempData[2] = ["March " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 4:
                            overallTempCategory[3] = "Apr";
                            overallTempData[3] = ["April " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 5:
                            overallTempCategory[4] = "May";
                            overallTempData[4] = ["May " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 6:
                            overallTempCategory[5] = "Jun";
                            overallTempData[5] = ["June " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 7:
                            overallTempCategory[6] = "Jul";
                            overallTempData[6] = ["July " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 8:
                            overallTempCategory[7] = "Aug";
                            overallTempData[7] = ["August " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 9:
                            overallTempCategory[8] = "Sep";
                            overallTempData[8] = ["September " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 10:
                            overallTempCategory[9] = "Oct";
                            overallTempData[9] = ["October " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 11:
                            overallTempCategory[10] = "Nov";
                            overallTempData[10] = ["November " + moment().add(offset, "year").get('year'), sum];
                            break;
                        case 12:
                            overallTempCategory[11] = "Dec";
                            overallTempData[11] = ["December " + moment().add(offset, "year").get('year'), sum];
                            break;
                        default:
                            break;
                    }
                });
                overallTempData.forEach(function (item) {
                    if (item) {
                        overallData.push(item);
                    }
                });
                overallTempCategory.forEach(function (item) {
                    if (item) {
                        overallCategory.push(item);
                        overallAverage.push({ y: json.Overall.Average });
                    }
                });

                $scope.info.total = json.Overall.Total ? json.Overall.Total.toFixed(0) : "...";
                $scope.info.forecast = json.Overall.ForeCast ? json.Overall.ForeCast.toFixed(0) : "...";

                if (json.Overall.Minimum) {
                    if (json.Overall.Minimum.Value) {
                        if (json.Overall.Minimum.Value > 0) {
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else if (json.Overall.Minimum.Value < 0) {
                            json.Overall.Minimum.Value = -json.Overall.Minimum.Value;
                            $scope.info.minimum = {
                                Value: json.Overall.Minimum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Minimum.BuildingId
                            };
                        } else {
                            $scope.info.minimum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.minimum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.minimum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Maximum) {
                    if (json.Overall.Maximum.Value) {
                        if (json.Overall.Maximum.Value > 0) {
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% High",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else if (json.Overall.Maximum.Value < 0) {
                            json.Overall.Maximum.Value = -json.Overall.Maximum.Value;
                            $scope.info.maximum = {
                                Value: json.Overall.Maximum.Value.toFixed(2) + "% Low",
                                BuildingId: json.Overall.Maximum.BuildingId
                            };
                        } else {
                            $scope.info.maximum = {
                                Value: "...",
                                BuildingId: "..."
                            };
                        }
                    } else {
                        $scope.info.maximum = {
                            Value: "...",
                            BuildingId: "..."
                        };
                    }
                } else {
                    $scope.info.maximum = {
                        Value: "...",
                        BuildingId: "..."
                    };
                }

                if (json.Overall.Total && json.Overall.PreviousTotal) {
                    var totalCompare = (((json.Overall.Total - json.Overall.PreviousTotal) * 100) / json.Overall.PreviousTotal);
                    if (totalCompare > 0) {
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Higher than Last Year";
                    } else if (totalCompare < 0) {
                        totalCompare = -totalCompare;
                        $scope.info.totalCompare = totalCompare.toFixed(2) + "% Lower than Last Year";
                    } else {
                        $scope.info.totalCompare = "...";
                    }
                } else {
                    $scope.info.totalCompare = "...";
                }

                if (json.Overall.ForeCast && json.Overall.PreviousForeCast) {
                    var forcastCompare = (((json.Overall.ForeCast - json.Overall.PreviousForeCast) * 100) / json.Overall.PreviousForeCast);
                    if (forcastCompare > 0) {
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Higher than Last Year";
                    } else if (forcastCompare < 0) {
                        forcastCompare = -forcastCompare;
                        $scope.info.forcastCompare = forcastCompare.toFixed(2) + "% Lower than Last Year";
                    } else {
                        $scope.info.forcastCompare = "...";
                    }
                } else {
                    $scope.info.forcastCompare = "...";
                }

                overall = angular.element("<div></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "557px", display: "block", height: "400px", opacity: 1 });
                overall.highcharts(dashboard.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -45;
                    config.xAxis.labels.align = "right";
                    config.xAxis.categories = overallCategory;
                    //yaxis
                    config.yAxis.max = omax;
                    //config.yAxis.tickInterval = 500;
                    config.yAxis.min = omin > 0 ? Math.round(Math.round(omin) / 2) : 0;
                    //series
                    config.series[0].data = overallData;
                    config.series[1].data = overallAverage;
                    //plotoption
                    config.plotOptions.series = {}
                    config.plotOptions.series.groupPadding = 0.02;
                    //tooltip
                    config.tooltip.shared = true;
                    config.tooltip.useHTML = true;
                    config.tooltip.footerFormat = "</table>";
                    config.tooltip.headerFormat = "<span>{point.key}</span><table>";
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "</td></tr>";
                }));
                dashboard.container.overall.html(overall);

                dashboard.container.individual.html("");
                json.Individual.forEach(function (individual) {
                    var elm = {},
                        individualData = [],
                        individualAverage = [],
                        individualCategory = [],
                        individualTempData = [],
                        individualTempCategory = [],
                        name = individual.BuildingId,
                        imin = Number.MAX_SAFE_INTEGER,
                        imax = Number.MIN_SAFE_INTEGER;

                    individual.Reading.forEach(function (item) {
                        var key = parseInt(item["Key"]);
                        var sum = item["Sum"];
                        //overall hourly
                        imin = sum < imin ? sum : imin;
                        imax = sum > imax ? sum : imax;
                        switch (key) {
                            case 1:
                                individualTempCategory[0] = "Jan";
                                individualTempData[0] = ["January " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 2:
                                individualTempCategory[1] = "Feb";
                                individualTempData[1] = ["February " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 3:
                                individualTempCategory[2] = "Mar";
                                individualTempData[2] = ["March " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 4:
                                individualTempCategory[3] = "Apr";
                                individualTempData[3] = ["April " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 5:
                                individualTempCategory[4] = "May";
                                individualTempData[4] = ["May " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 6:
                                individualTempCategory[5] = "Jun";
                                individualTempData[5] = ["June " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 7:
                                individualTempCategory[6] = "Jul";
                                individualTempData[6] = ["July " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 8:
                                individualTempCategory[7] = "Aug";
                                individualTempData[7] = ["August " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 9:
                                individualTempCategory[8] = "Sep";
                                individualTempData[8] = ["September " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 10:
                                individualTempCategory[9] = "Oct";
                                individualTempData[9] = ["October " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 11:
                                individualTempCategory[10] = "Nov";
                                individualTempData[10] = ["November " + moment().add(offset, "year").get('year'), sum];
                                break;
                            case 12:
                                individualTempCategory[11] = "Dec";
                                individualTempData[11] = ["December " + moment().add(offset, "year").get('year'), sum];
                                break;
                            default:
                                break;
                        }
                    });
                    individualTempData.forEach(function (item) {
                        if (item) {
                            individualData.push(item);
                        }
                    });
                    individualTempCategory.forEach(function (item) {
                        if (item) {
                            individualCategory.push(item);
                            individualAverage.push({ y: individual.Average });
                        }
                    });

                    elm = dashboard.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-monthly").addClass("active").highcharts(dashboard.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -45;
                        config.xAxis.labels.align = "right";
                        config.xAxis.categories = individualCategory;
                        //yaxis
                        config.yAxis.max = imax;
                        //config.yAxis.tickInterval = 500;
                        config.yAxis.min = imin > 0 ? Math.round(Math.round(imin) / 2) : 0;
                        //series
                        config.series[0].data = individualData;
                        config.series[1].data = individualAverage;
                        //plotoption
                        config.plotOptions.series = {}
                        config.plotOptions.series.groupPadding = 0.02;
                        //tooltip
                        config.tooltip.shared = true;
                        config.tooltip.useHTML = true;
                        config.tooltip.footerFormat = "</table>";
                        config.tooltip.headerFormat = "<span>{point.key}</span><table>";
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.view.chartUnit + "</td></tr>";
                    }))
                    dashboard.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        failure: function (res) {
            console.log(res);
        }
    };
    
    dashboard.option = {
        waterconsumption: {
            title: "Water Consumption",
            unit: waterConsumptionUnit,//"m",
            sup: '',
            chartUnit: waterConsumptionUnit//"m<sup>3</sup>"
        },
        powerconsumption: {
            title: "Power Consumption",
            unit: powerComsumptionUnit,//"kw",
            sup: "",
            chartUnit:powerComsumptionUnit// "kw"
        },
    };
    dashboard.container = {};
    dashboard.active = angular.element(".nav-pills li.active");
    dashboard.container.overall = angular.element(".tab-content");
    dashboard.container.individual = angular.element(".individual-charts.row");
    dashboard.template = function (options) {
        var tpl = $('<div class="col-md-6" data-ng-repeat="block in consumption.Individual" data-ng-show="block.IsActive">' +
                  '<div class="box box-warning direct-chat direct-chat-warning">' +
                    '<div class="box-header with-border">' +
                      '<h3 class="box-title"></h3>' +
                      '<div class="box-tools pull-right">' +
                        '<button type="button" class="btn btn-box-tool" data-widget="collapse">' +
                          '<i class="fa fa-minus"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-box-tool" data-widget="remove">' +
                          '<i class="fa fa-times"></i>' +
                        '</button>' +
                      '</div>' +
                    '</div>' +
                    '<div class="box-body" style="overflow-x:auto;">' +
                      '<div class="loading-mask" style="display:block;"></div>' +
                      '<div class="small-chart small-chart-hourly" style="width:425px;height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-daily" style="width:425px;height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-weekly" style="width:425px;height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-monthly" style="width:425px;height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-yearly" style="width:425px;height: 300px; margin-top: 20px;"></div>' +
                    '</div>' +
                  '</div>' +
               '</div>');
        return tpl;
    };
    dashboard.chartoption = function (callback) {
        var config = {};
        config.chart = {
            renderTo: '',
            zoomType: "x"
        }
        config.title = {
            text: null
        }
        config.subtitle = {
            text: null
        }
        config.xAxis = {
            crosshair: true
        }
        config.yAxis = {
            min: 0,
            title: {
                text: 'Value'
            }
        }
        config.tooltip = {}
        config.plotOptions = {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        }
        config.series = [{
            type: "column",
            name: "SUM",
            marker: {
                enabled: false
            },
            unit: "/h",
            data: [],
            color: "#7CB5EC",
            lineColor: "#7CB5EC"
        }, {
            type: "line",
            name: "AVG",
            unit: "",
            marker: {
                enabled: false
            },
            data: [],
            color: "#F39C12",
            lineColor: '#F39C12'
        }];
        callback(config);
        return config;
    };
    dashboard.type = dashboard.type ? dashboard.type.toLowerCase() : dashboard.type;
    dashboard.field = dashboard.field ? dashboard.field.toLowerCase() : dashboard.field;
    $scope.types = {}
    $scope.info = {
        minimum: {},
        maximum: {},
        total: 0,
        forcast: 0
    };



    $scope.types.select = function (_event, _type) {
        $scope.dashboard.offset = 0;
        $scope.dashboard.datepart = _type;
        var elm = angular.element(_event.target).parent();
        if (!elm.hasClass("active")) {
            switch (_type) {
                case "sofartoday":
                    dashboard.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    dashboard.period = "sofartoday";
                    $scope.chart.unit = $scope.view.chartUnit + "/h";
                    dashboard.active.removeClass("active");
                    dashboard.active = elm.addClass("active");
                    dashboard.container.individual.html("");
                    var z=readingService.Get($scope.dashboard.type, $scope.dashboard.field, $scope.dashboard.period, $scope.dashboard.offset, dashboard.view.SoFarToday, dashboard.view.failure);
                    break;
                case "sofarthismonth":
                    dashboard.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    dashboard.period = "sofarthismonth";
                    $scope.chart.unit = $scope.view.chartUnit;
                    dashboard.active.removeClass("active");
                    dashboard.active = elm.addClass("active");
                    dashboard.container.individual.html("");
                    readingService.Get($scope.dashboard.type, $scope.dashboard.field, $scope.dashboard.period, $scope.dashboard.offset, dashboard.view.SoFarThisMonth, dashboard.view.failure);
                    break;
                case "sofarthisweek":
                    dashboard.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    dashboard.period = "sofarthisweek";
                    $scope.chart.unit = $scope.view.chartUnit;
                    dashboard.active.removeClass("active");
                    dashboard.active = elm.addClass("active");
                    dashboard.container.individual.html("");
                    readingService.Get($scope.dashboard.type, dashboard.field, $scope.dashboard.period, $scope.dashboard.offset, dashboard.view.SoFarThisWeek, dashboard.view.failure);
                    break;
                case "sofarthisyear":
                    dashboard.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    dashboard.period = "sofarthisyear";
                    $scope.chart.unit = $scope.view.chartUnit;
                    dashboard.active.removeClass("active");
                    dashboard.active = elm.addClass("active");
                    dashboard.container.individual.html("");
                    readingService.Get($scope.dashboard.type, $scope.dashboard.field, $scope.dashboard.period, $scope.dashboard.offset, dashboard.view.SoFarThisYear, dashboard.view.failure);
                    break;
                case "yearly":
                    dashboard.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    dashboard.period = "yearly";
                    $scope.chart.unit = $scope.view.chartUnit;
                    dashboard.active.removeClass("active");
                    dashboard.active = elm.addClass("active");
                    dashboard.container.individual.html("");
                    readingService.Get($scope.dashboard.type, $scope.dashboard.field, $scope.dashboard.period, $scope.dashboard.offset, dashboard.view.yearly, dashboard.view.failure);
                    break;
                default:
                    break;
            }
        }
    };


    var G = {
        offset: 0,
        type: "overall",
        period: "sofartoday",
        active: angular.element(".nav.nav-pills li.active"),
        periodList: ["sofartoday", "sofarthisweek", "sofarthismonth", "sofarthisyear"]
    };


    $scope.view = {
        sup: "",
        type: "",
        unit: "",
        title: "",
        field: "",
        chartUnit: ""
    };
    $scope.menu = {};
    $scope.menu.select = function (e) {
        $('#navDate').val('');
        G.offset = 0;
        var elm = angular.element(e.target);
        if (elm) {
            var data = elm.data();
            G.period = G.periodList[data.period];
            if (G.active) {
                G.active.removeClass("active");
            }
            G.active = elm.parent();
            G.active.addClass("active");
        }
        angular.element(".loading-mask").show();
        readingService.Get(G.type, G.dataField, G.period, G.offset, function (res) {
            setDateRange(res.model.FromDate, res.model.ToDate);
            dashboard.view[G.period](res, G.offset);
            
            angular.element(".loading-mask").hide();
        }, function () {
            angular.element(".loading-mask").hide();
        });
    };
    Date.prototype.getWeek = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
        var dayOfYear = ((today - onejan + 1) / 86400000);
        return Math.ceil(dayOfYear / 7);
    };
        Date.prototype.monthNames = [
    "January", "February", "March",
    "April", "May", "June",
    "July", "August", "September",
    "October", "November", "December"
        ];

        Date.prototype.getMonthName = function() {
            return this.monthNames[this.getMonth()];
        };
   
        Date.prototype.getWeek = function () {
            var date = new Date(this.getTime());
            date.setHours(0, 0, 0, 0);
            // Thursday in current week decides the year.
            date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
            // January 4 is always in week 1.
            var week1 = new Date(date.getFullYear(), 0, 4);
            // Adjust to Thursday in week 1 and count number of weeks from date to week1.
            return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
        }

        //function getDateRangeOfWeek(weekNo, y) {
        //    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
        //    d1 = new Date('' + y + '');
        //    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
        //    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        //    d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
        //    rangeIsFrom = (d1.getMonth() + 1) + "-" + d1.getDate() + "-" + d1.getFullYear();
        //    d1.setDate(d1.getDate() + 6);
        //    rangeIsTo = (d1.getMonth() + 1) + "-" + d1.getDate() + "-" + d1.getFullYear();
        //    return rangeIsFrom + " to " + rangeIsTo;
        //};

        function parseIsoDatetime(dtstr) {
            var dt = dtstr.split(/[: T-]/).map(parseFloat);
            return new Date(dt[0], dt[1] - 1, dt[2], dt[3] || 0, dt[4] || 0, dt[5] || 0, 0);
        }
        function setDateRange(fromdate, todate) {
            var d1 = parseIsoDatetime(fromdate);
            var d2 = parseIsoDatetime(todate);
            $('#navDate').text(moment(d1).format(commonDateFormat) + ' to ' + moment(d2).format(commonDateFormat));
        }

    $scope.menu.changeOffset = function (e, forward) {
        G.offset = forward ? G.offset + 1 : G.offset - 1;
        G.offset = G.offset > 0 ? 0 : G.offset;
        var result = new Date();
        //if (G.period == 'sofarthisweek') {
        //    result.setDate(result.getDate() + G.offset * 7);
        //    //$('#navDate').text('week no ' + result.getWeek() + ', ' + result.getFullYear());
        //    $('#navDate').text(getDateRangeOfWeek(result.getWeek(), result.getFullYear()) );
            

        //}
        //if (G.period == 'sofarthismonth') {
        //    result.setDate(result.getDate() + G.offset * 30);   
        //    $('#navDate').text(result.getMonthName()+", "+result.getFullYear());
        //}
        //if (G.period == 'sofarthisyear') {
        //    result.setDate(result.getDate() + G.offset * 365);
        //    $('#navDate').text(result.getFullYear());
        //}
        //else {
        //}

        
        angular.element(".loading-mask").show();
        readingService.Get(G.type, G.dataField, G.period, G.offset, function (res) {
            setDateRange(res.model.FromDate, res.model.ToDate);
            dashboard.view[G.period](res, G.offset);
            angular.element(".loading-mask").hide();
        }, function () {
            angular.element(".loading-mask").hide();
        });
    };

    $scope.water = {}
    $scope.water.usage = 0;

    $scope.water.more = function () {
        $scope.view.sup = '';
        $scope.view.unit = waterConsumptionUnit;
        $scope.details = "consumption";
        $scope.view.title = "Water Consumption";
        $scope.view.chartUnit = $scope.view.unit;//"m<sup>3</sup>";
        
        G.offset = 0;
        G.period = G.periodList[0];
        angular.element(".loading-mask").show();
        G.dataField = "waterconsumption";
        G.active && G.active.removeClass("active");
        G.active = angular.element(".default-active").addClass("active");
        readingService.Get(G.type, G.dataField, G.period, G.offset, function (res) {
            setDateRange(res.model.FromDate, res.model.ToDate);
            dashboard.view[G.period](res, G.offset);
            angular.element(".loading-mask").hide();
        }, function () {
            angular.element(".loading-mask").hide();
        });
    };

    $scope.power = {};
    $scope.power.usage = 0;
    $scope.power.more = function () {

        $scope.view.sup = "";
        $scope.view.unit = powerComsumptionUnit;//"kw";
        $scope.details = "consumption";
        $scope.view.title = "Power Consumption";
        $scope.view.chartUnit = $scope.view.unit;//"kw";
        

        G.offset = 0;
        G.period = G.periodList[0];
        angular.element(".loading-mask").show();
        G.dataField = "powerconsumption";
        G.active && G.active.removeClass("active");
        G.active = angular.element(".default-active").addClass("active");
        readingService.Get(G.type, G.dataField, G.period, G.offset, function (res) {
            setDateRange(res.model.FromDate, res.model.ToDate);
            dashboard.view[G.period](res, G.offset);
            angular.element(".loading-mask").hide();
        }, function () {
            angular.element(".loading-mask").hide();
        });
    };
    $scope.loadalarm = function () {
        $scope.details = "alarm";
        var table = angular.element('<table class="table table-bordered table-hover">' +
                             '<thead>' +
                                 '<tr>' +
                                     '<th>Site Name</th>' +
                                     '<th>Status</th>' +
                                     '<th>Previous</th>' +
                                     '<th>Itqf</th>' +
                                     '<th>Category</th>' +
                                     '<th>Acknowledge</th>' +
                                     '<th>Time Stamp</th>' +
                                     '<th>FMCC Status</th>' +
                                 '</tr>' +
                             '</thead>' +
                         '</table>');

        

        jQuery("#alarm-list").html(table);
         var altable = table.DataTable({
            ajax: {
                url: '/api/alarm/loadalarmlist',
                data: function (d, SETTINGS) {
                    var result = $.extend({}, d, {
                        "siteId": $('#siteId').val(),
                    });
                    return result;

                }
            },
            language: {
                search: "",
                searchPlaceholder: "Search",
                paginate: {
                    next: "»",
                    previous: "«"
                },
            },
            processing: true,
            serverSide: true,
            ordering: true,
            paging: true,
            searching: false,
            pageLength: 10,
            columns: [
                { data: "SiteName" },
                {
                    data: "Status",
                    render: function (data, type, full, meta) {
                        if (data == 'alarm') {
                            return '<span class="label label-danger" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        } else if (data == 'active') {
                            return '<span class="label label-success" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        } else if (data == 'inactive') {
                            return '<span class="label label-warning" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        } else {
                            return '<span class="label label-primary" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        }
                    }
                },
                {
                    data: "PreviousStatus",
                    render: function (data, type, full, meta) {
                        if (data == 'alarm') {
                            return '<span class="label label-danger" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        } else if (data == 'active') {
                            return '<span class="label label-success" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        } else if (data == 'inactive') {
                            return '<span class="label label-warning" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        } else {
                            return '<span class="label label-primary" style="display:inline-block;width:60px;padding:4px 4px 7px;">' + data + '</span>';
                        }
                    }
                },
                { data: "ITQF" },
                { data: "ItemCategory" },
                { data: "AcknowledgeRequired" },
                {
                    data: "TimeStamp",
                    render: function (data) {
                        return moment(data, moment.ISO_8601).format(commonDateFormat)
                    }
                },
                {
                    data: "FMCCStatus",
                    render: function (data, type, full, meta) {
                        if (data == 1) {
                            data = 'new';
                            return '<span class="label label-primary status-1" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                        } else if (data == 2) {
                            data = 'acknowledge';
                            return '<span class="label label-success status-2" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                        } else if (data == 3) {
                            data = 'suppress';
                            return '<span class="label label-warning status-3" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                        } else {
                            return '<span class="label label-primary status-3" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                        }
                    }
                },
            ]
        });

         table.on("click", "td", function (e) {
             var rowElem = $(this);
             var rowData = altable.row(this).data();
             var idx = altable.cell(this).index().column;
             //var rowData = altable.row(this).data();
             if (idx == 7) {

                 var elm = angular.element(e.target);
                 if (elm.hasClass("status-1")) {
                     $http.post("/api/alarm/setacknowledged", rowData).then(function(res) {
                         if (res.data.okay) {
                             elm.removeClass("label-primary").removeClass("status-1").addClass("label-success").addClass("status-2").text("acknowledge");
                         } else {
                             console.log(res);
                         }
                     }, function(res) {

                     });
                 } else if (elm.hasClass("status-2")) {
                     $http.post("/api/alarm/setundefined", rowData).then(function(res) {
                         if (res.data.okay) {
                             elm.removeClass("label-success").removeClass("status-2").addClass("label-primary").addClass("status-1").text("new");
                         } else {
                             console.log(res);
                         }
                     }, function(res) {
                         console.log(res);
                     });
                 }
             } else {
                 $("#myModal4").modal();
             }
         });
    };

    $scope.alarm = {}
    $scope.alarm.count = 0;
    $scope.alarm.more = function () {
        $scope.details = "alert";
       

        var alertTable = angular.element('<table class="table table-bordered table-hover">' +
                             '<thead>' +
                                 '<tr>' +
                                  '<th>Id</th>' +
                                     '<th>Block</th>' +
                                     '<th>Type</th>' +
                                     '<th>Current Value</th>' +
                                     '<th>Reference Value</th>' +
                                     '<th>Saverity</th>' +
                                     '<th>Time Stamp</th>' +
                                     '<th>FMCC Status</th>' +
                                 '</tr>' +
                             '</thead>' +
                         '</table>');
        jQuery("#alert-list").html(alertTable);
            var atble = alertTable.DataTable({
                ajax: {
                    url: '/api/alert/loadalertlist?FMCCStatus=1&siteId='+$('#siteId').val(),
                    dataSrc: "data"
                },
                language: {
                    search: "",
                    searchPlaceholder: "Search",
                    paginate: {
                        next: "»",
                        previous: "«"
                    },
                },
                processing: true,
                serverSide: true,
                ordering: false,
                paging: true,
                searching: false,
                pageLength: 10,
                columns: [
                {data:"Id"},
            { data: "Block" },
            {
                data: "Type",
                render: function (data) {
                    if (data == 1) {
                        return 'Total Power Consumption';
                    }
                    else if (data == 2) {
                        return 'Total Water Consumption';

                    } else if (data == 3) {
                        return 'Over Cooled';
                    }
                    else if (data == 4) {
                        return 'Equipment Histogram';
                    }
                    else if (data == 5) {
                        return 'Single Point';
                    }
                }
            },
            { data: "CurrentValue" },
            { data: "ReferenceValue" },
            { data: "Saverity" },

            {
                data: "FromDate",
                title: "Timestamp",
                render: function (data) {
                    return moment(data, moment.ISO_8601).format(commonDateFormat)
                }
            },

            {
                data: "FMCCStatus",
                render: function (data, type, full, meta) {
                    if (data == 1) {
                        data = 'new';
                        return '<span class="label label-primary status-1" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    } else if (data == 2) {
                        data = 'acknowledge';
                        return '<span class="label label-success status-2" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    } else if (data == 3) {
                        data = 'suppress';
                        return '<span class="label label-warning status-3" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    } else {
                        return '<span class="label label-primary status-3" style="display:inline-block;width:90px;padding:4px 4px 7px;cursor:pointer;">' + data + '</span>';
                    }
                }
            },
                ]
        });

        alertTable.on("click", "tr", function (e) {
            var rowElem = $(this);
            var rowData = atble.row(this).data();
            var elm = angular.element(e.target);
            if (elm.hasClass("status-1")) {
                $http.post("/api/alert/setacknowledged", rowData).then(function (res) {
                    if (res.data.okay) {
                        elm.removeClass("label-primary").removeClass("status-1").addClass("label-success").addClass("status-2").text("acknowledge");
                    } else {
                        console.log(res);
                    }
                }, function (res) {

                });
            } else if (elm.hasClass("status-2")) {
                $http.post("/api/alert/setundefined", rowData).then(function (res) {
                    if (res.data.okay) {
                        elm.removeClass("label-success").removeClass("status-2").addClass("label-primary").addClass("status-1").text("new");
                    } else {
                        console.log(res);
                    }
                }, function (res) {
                    console.log(res);
                });
            }
        });
    };
    $scope.blocks = [];
    dashboardService.get({
    }).error(function (res) {
        console.log(res);
    }).success(function (res) {
        if (res.okay) {
            $scope.blocks = res.model.Blocks;
            $scope.water.usage = res.model.WaterAvg;
            $scope.power.usage = res.model.PowerAvg;
            $scope.alarm.count = res.model.AlarmCount;
            $scope.alert = res.model.AlertCount;
        } else {
            console.log(res.message);
        }
    });

    $scope.myMenu = {};
    $scope.myMenu.menuId = 6;
});