angular.module("fmccwebportal").controller("readingController", function ($scope, $routeParams, readingService) {
    var local = {};
    local.period = "sofartoday";
    local.type = $routeParams.type || "overall";
    local.field = $routeParams.field || "waterconsumption";
    local.type = local.type ? local.type.toLowerCase() : local.type;
    local.field = local.field ? local.field.toLowerCase() : local.field;

    local.view = {
        SoFarToday: function (res) {
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

                    overallCategory.push(moment(key,"hh").format("hh:mm A"));
                    overallData.push({ y: sum });
                    overallAverage.push({ y: json.Overall.Average });

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

                overall = angular.element("<div style='overflow-x:auto;'></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "650px", height: "400px", opacity: 1 });
                overall.highcharts(local.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -90;
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
                    config.tooltip.headerFormat = "<span></span><table>";
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                }));
                local.container.overall.html(overall);

                local.container.individual.html("");
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

                    elm = local.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-hourly").addClass("active").highcharts(local.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -90;
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
                        config.tooltip.headerFormat = "<span>" + moment().format("YYYY-MM-DD") + " {point.key}</span><table>";
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                    }))
                    local.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        SoFarThisWeek: function (res) {
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
                            overallTempData[6] = [moment().isoWeekday(7).format("YYYY-MM-DD") + " " + "(Sunday)", sum];
                            break;
                        case 2:
                            overallTempCategory[0] = "Mon";
                            overallTempData[0] = [moment().isoWeekday(1).format("YYYY-MM-DD") + " " + "(Monday)", sum];
                            break;
                        case 3:
                            overallTempCategory[1] = "Tue";
                            overallTempData[1] = [moment().isoWeekday(2).format("YYYY-MM-DD") + " " + "(Tuesday)", sum];
                            break;
                        case 4:
                            overallTempCategory[2] = "Wed";
                            overallTempData[2] = [moment().isoWeekday(3).format("YYYY-MM-DD") + " " + "(Wednesday)", sum];
                            break;
                        case 5:
                            overallTempCategory[3] = "Thu";
                            overallTempData[3] = [moment().isoWeekday(4).format("YYYY-MM-DD") + " " + "(Thursday)", sum];
                            break;
                        case 6:
                            overallTempCategory[4] = "Fri";
                            overallTempData[4] = [moment().isoWeekday(5).format("YYYY-MM-DD") + " " + "(Friday)", sum];
                            break;
                        case 7:
                            overallTempCategory[5] = "Sat";
                            overallTempData[5] = [moment().isoWeekday(6).format("YYYY-MM-DD") + " " + "(Satarday)", sum];
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

                overall = angular.element("<div style='overflow-x:auto;'></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "650px", height: "400px", opacity: 1 });
                overall.highcharts(local.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -90;
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
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                }));
                local.container.overall.html(overall);

                local.container.individual.html("");
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
                                individualTempData[6] = [moment().isoWeekday(7).format("YYYY-MM-DD") + " " + "(Sunday)", sum];
                                break;
                            case 2:
                                individualTempCategory[0] = "Mon";
                                individualTempData[0] = [moment().isoWeekday(1).format("YYYY-MM-DD") + " " + "(Monday)", sum];
                                break;
                            case 3:
                                individualTempCategory[1] = "Tue";
                                individualTempData[1] = [moment().isoWeekday(2).format("YYYY-MM-DD") + " " + "(Tuesday)", sum];
                                break;
                            case 4:
                                individualTempCategory[2] = "Wed";
                                individualTempData[2] = [moment().isoWeekday(3).format("YYYY-MM-DD") + " " + "(Wednesday)", sum];
                                break;
                            case 5:
                                individualTempCategory[3] = "Thu";
                                individualTempData[3] = [moment().isoWeekday(4).format("YYYY-MM-DD") + " " + "(Thursday)", sum];
                                break;
                            case 6:
                                individualTempCategory[4] = "Fri";
                                individualTempData[4] = [moment().isoWeekday(5).format("YYYY-MM-DD") + " " + "(Friday)", sum];
                                break;
                            case 7:
                                individualTempCategory[5] = "Sat";
                                individualTempData[5] = [moment().isoWeekday(6).format("YYYY-MM-DD") + " " + "(Satarday)", sum];
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
                    elm = local.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-weekly").addClass("active").highcharts(local.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -90;
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
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                    }))
                    local.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        SoFarThisMonth: function (res) {
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
                    overallData.push([moment().date(parseInt(key)).format("YYYY-MM-DD"), sum]);
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

                overall = angular.element("<div style='overflow-x:auto;'></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "650px", height: "400px", opacity: 1 });
                overall.highcharts(local.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -90;
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
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                }));
                local.container.overall.html(overall);

                local.container.individual.html("");
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
                        individualData.push([moment().date(parseInt(key)).format("YYYY-MM-DD"), sum]);
                        individualAverage.push({ y: individual.Average });
                        //overall hourly
                        imin = sum < imin ? sum : imin;
                        imax = sum > imax ? sum : imax;
                    });

                    elm = local.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-daily").addClass("active").highcharts(local.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -90;
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
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                    }))
                    local.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        SoFarThisYear: function (res) {
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
                            overallTempData[0] = ["January " + moment().get('year'), sum];
                            break;
                        case 2:
                            overallTempCategory[1] = "Feb";
                            overallTempData[1] = ["February " + moment().get('year'), sum];
                            break;
                        case 3:
                            overallTempCategory[2] = "Mar";
                            overallTempData[2] = ["March " + moment().get('year'), sum];
                            break;
                        case 4:
                            overallTempCategory[3] = "Apr";
                            overallTempData[3] = ["April " + moment().get('year'), sum];
                            break;
                        case 5:
                            overallTempCategory[4] = "May";
                            overallTempData[4] = ["May " + moment().get('year'), sum];
                            break;
                        case 6:
                            overallTempCategory[5] = "Jun";
                            overallTempData[5] = ["June " + moment().get('year'), sum];
                            break;
                        case 7:
                            overallTempCategory[6] = "Jul";
                            overallTempData[6] = ["July " + moment().get('year'), sum];
                            break;
                        case 8:
                            overallTempCategory[7] = "Aug";
                            overallTempData[7] = ["August " + moment().get('year'), sum];
                            break;
                        case 9:
                            overallTempCategory[8] = "Sep";
                            overallTempData[8] = ["September " + moment().get('year'), sum];
                            break;
                        case 10:
                            overallTempCategory[9] = "Oct";
                            overallTempData[9] = ["October " + moment().get('year'), sum];
                            break;
                        case 11:
                            overallTempCategory[10] = "Nov";
                            overallTempData[10] = ["November " + moment().get('year'), sum];
                            break;
                        case 12:
                            overallTempCategory[11] = "Dec";
                            overallTempData[11] = ["December " + moment().get('year'), sum];
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

                overall = angular.element("<div style='overflow-x:auto;'></div>");
                overall.attr({ id: "overall-chart", "data-block": "all" });
                overall.css({ width: "650px", height: "400px", opacity: 1 });
                overall.highcharts(local.chartoption(function (config) {
                    //xaxis
                    config.xAxis.labels = {};
                    config.xAxis.labels.rotation = -90;
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
                    config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                }));
                local.container.overall.html(overall);

                local.container.individual.html("");
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
                                individualTempData[0] = ["January " + moment().get('year'), sum];
                                break;
                            case 2:
                                individualTempCategory[1] = "Feb";
                                individualTempData[1] = ["February " + moment().get('year'), sum];
                                break;
                            case 3:
                                individualTempCategory[2] = "Mar";
                                individualTempData[2] = ["March " + moment().get('year'), sum];
                                break;
                            case 4:
                                individualTempCategory[3] = "Apr";
                                individualTempData[3] = ["April " + moment().get('year'), sum];
                                break;
                            case 5:
                                individualTempCategory[4] = "May";
                                individualTempData[4] = ["May " + moment().get('year'), sum];
                                break;
                            case 6:
                                individualTempCategory[5] = "Jun";
                                individualTempData[5] = ["June " + moment().get('year'), sum];
                                break;
                            case 7:
                                individualTempCategory[6] = "Jul";
                                individualTempData[6] = ["July " + moment().get('year'), sum];
                                break;
                            case 8:
                                individualTempCategory[7] = "Aug";
                                individualTempData[7] = ["August " + moment().get('year'), sum];
                                break;
                            case 9:
                                individualTempCategory[8] = "Sep";
                                individualTempData[8] = ["September " + moment().get('year'), sum];
                                break;
                            case 10:
                                individualTempCategory[9] = "Oct";
                                individualTempData[9] = ["October " + moment().get('year'), sum];
                                break;
                            case 11:
                                individualTempCategory[10] = "Nov";
                                individualTempData[10] = ["November " + moment().get('year'), sum];
                                break;
                            case 12:
                                individualTempCategory[11] = "Dec";
                                individualTempData[11] = ["December " + moment().get('year'), sum];
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

                    elm = local.template();
                    elm.find("h3.box-title").text(name);
                    elm.find(".small-chart-monthly").addClass("active").highcharts(local.chartoption(function (config) {
                        //xaxis
                        config.xAxis.labels = {};
                        config.xAxis.labels.rotation = -90;
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
                        config.tooltip.pointFormat = "<tr><td style='padding:2px'>{series.name} <b>:</b></td><td style='padding:2px'><b>{point.y:.1f} </b>" + $scope.chart.unit + "</td></tr>";
                    }))
                    local.container.individual.append(elm)
                });
            } else {
                console.log(res.message);
            }
        },
        failure: function (res) {
            console.log(res);
        }
    };
    local.option = {
        waterconsumption: {
            title: "Water Consumption",
            unit: "m",
            sup: 3,
            chartUnit: "m<sup>3</sup>"
        },
        powerconsumption: {
            title: "Power Consumption",
            unit: "kw",
            sup: "",
            chartUnit: "kw"
        },
    };
    local.container = {};
    local.active = angular.element(".period-type.active");
    local.container.overall = angular.element(".tab-content");
    local.container.individual = angular.element(".individual-charts.row");

    local.template = function (options) {
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
                      '<div class="small-chart small-chart-hourly" style="width: 425px; height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-daily" style="width: 425px; height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-weekly" style="width: 425px; height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-monthly" style="width: 425px; height: 300px; margin-top: 20px;"></div>' +
                      '<div class="small-chart small-chart-yearly" style="width: 425px; height: 300px; margin-top: 20px;"></div>' +
                    '</div>' +
                  '</div>' +
               '</div>');
        return tpl;
    };
    local.chartoption = function (callback) {
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

    $scope.type = {};
    $scope.info = {
        minimum: {},
        maximum: {},
        total: 0,
        forcast: 0
    };
    $scope.view = {
        type: local.type,
        field: local.field,
        sup: local.option[local.field].sup,
        unit: local.option[local.field].unit,
        title: local.option[local.field].title,
        chartUnit: local.option[local.field].chartUnit
    };
    $scope.chart = { unit: $scope.view.chartUnit + "/h" }
    $scope.type.select = function (_event, _type) {
        var elm = angular.element(_event.target).parent();
        if (!elm.hasClass("active")) {
            switch (_type) {
                case "sofartoday":
                    local.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    local.period = "sofartoday";
                    $scope.chart.unit = $scope.view.chartUnit + "/h";
                    local.active.removeClass("active");
                    local.active = elm.addClass("active");
                    local.container.individual.html("");
                    readingService.Get(local.type, local.field, local.period, local.view.SoFarToday, local.view.failure);
                    break;
                case "sofarthismonth":
                    local.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    local.period = "sofarthismonth";
                    $scope.chart.unit = $scope.view.chartUnit;
                    local.active.removeClass("active");
                    local.active = elm.addClass("active");
                    local.container.individual.html("");
                    readingService.Get(local.type, local.field, local.period, local.view.SoFarThisMonth, local.view.failure);
                    break;
                case "sofarthisweek":
                    local.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    local.period = "sofarthisweek";
                    $scope.chart.unit = $scope.view.chartUnit;
                    local.active.removeClass("active");
                    local.active = elm.addClass("active");
                    local.container.individual.html("");
                    readingService.Get(local.type, local.field, local.period, local.view.SoFarThisWeek, local.view.failure);
                    break;
                case "sofarthisyear":
                    local.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    local.period = "sofarthisyear";
                    $scope.chart.unit = $scope.view.chartUnit;
                    local.active.removeClass("active");
                    local.active = elm.addClass("active");
                    local.container.individual.html("");
                    readingService.Get(local.type, local.field, local.period, local.view.SoFarThisYear, local.view.failure);
                    break;
                case "yearly":
                    local.container.overall.html("<div class='loading-mask' style='display:block;'></div>")
                    local.period = "yearly";
                    $scope.chart.unit = $scope.view.chartUnit;
                    local.active.removeClass("active");
                    local.active = elm.addClass("active");
                    local.container.individual.html("");
                    readingService.Get(local.type, local.field, local.period, local.view.yearly, local.view.failure);
                    break;
                default:
                    break;
            }
        }
    };
    readingService.Get(local.type, local.field, local.period, local.view.SoFarToday, local.view.failure);
})

