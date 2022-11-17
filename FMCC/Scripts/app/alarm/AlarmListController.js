angular.module("fmcc")
  .controller("AlarmList", function ($scope, $rootScope, ready) {
      $('#alarm-list').DataTable({
          ajax: {
              url: 'service/alarm/loadalarmlist',
              dataSrc: "data"
          },
          processing: true,
          serverSide: true,
          ordering: true,
          paging: true,
          searching: true,
          pageLength: 10,
          columns: [
              { data: "SiteName" },
              { data: "Status" },
              { data: "PreviousStatus" },
              { data: "ITQF" },
              { data: "ItemCategory" },
              { data: "AcknowledgeRequired" },
              { data: "TimeStamp" }
          ]
      });
      $rootScope.show = ready.show;
  });
