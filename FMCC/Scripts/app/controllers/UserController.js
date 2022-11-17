angular
    .module("fmccwebportal")
    .controller("UserController", function ($scope, $http, $rootScope, UserRole) {
        $scope.user = {
            Id: 0,
            fullname: "",
            email: "",
            username: "",
            password: "",
            designation: "",
            mobile: "",
            phone: "",
            image: "",
            imagepreview: "",
        };
        var userTable = $("#users").DataTable({
            ajax: {
                url: '/api/userrolemanagement/getusers',
                dataSrc: "data"
            },
            language: {
                search: "",
                searchPlaceholder: "Search...",
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
                { data: "FullName", title: "Full Name" },
                { data: "Username", title: "User Name" },
                { data: "Designation", title: "Designation" },
                { data: "Email", title: "Email" },
                { data: null, width: '85px', defaultContent: "<button class='btn btn-flat btn-default btn-sm' style='min-width:100px;'> Select </button>" }
            ]
        });
        var fileInput = $("<input type='file' accept='image/x-png, image/gif, image/jpeg'>");

        $scope.setUser = function () {
            if (fileInput[0].files[0]) {
                UserRole.setUser({
                    FullName: $scope.user.fullname,
                    Email: $scope.user.email,
                    Username: $scope.user.username,
                    Password: $scope.user.password,
                    Designation: $scope.user.designation,
                    MobileNo: $scope.user.mobile,
                    PhoneNo: $scope.user.phone
                }).then(function (response) {
                    if (response.data.okay) {
                        if (response.data.model && fileInput[0].files[0]) {
                            var formData = new FormData();
                            formData.append("Id", response.data.model);
                            formData.append("file", fileInput[0].files[0]);
                            $http({
                                url: "/api/userrolemanagement/upload",
                                method: "POST",
                                data: formData,
                                headers: { 'Content-Type': undefined }
                            }).then(function (response) {
                                $scope.user.Id = 0;
                                $scope.user.fullname = '';
                                $scope.user.email = '';
                                $scope.user.username = '';
                                $scope.user.password = '';
                                $scope.user.designation = '';
                                $scope.user.mobile = '';
                                $scope.user.phone = '';
                                $scope.user.image = '';
                                userTable.ajax.reload();
                                angular.element("#filebrowser").text("Browse");
                                $("#preview").attr("src", "/images/users/user.png");
                            }, function () {
                                userTable.ajax.reload();
                                $("#preview").attr("src", "/images/users/user.png");
                            });
                        } else {
                            $scope.user.Id = 0;
                            $scope.user.fullname = '';
                            $scope.user.email = '';
                            $scope.user.username = '';
                            $scope.user.password = '';
                            $scope.user.designation = '';
                            $scope.user.mobile = '';
                            $scope.user.phone = '';
                            $scope.user.image = '';
                            userTable.ajax.reload();
                            $("#filebrowser").text("Browse");
                            $("#preview").attr("src", "/images/users/user.png");
                        }
                    }
                });
            } else {
                alert("Please browse a photo.");
            }
           
        };
        $scope.updateUser = function () {
            UserRole.updateUser({
                Id: $scope.user.Id,
                FullName: $scope.user.fullname,
                Email: $scope.user.email,
                Username: $scope.user.username,
                Password: $scope.user.password,
                Designation: $scope.user.designation,
                MobileNo: $scope.user.mobile,
                PhoneNo: $scope.user.phone
            }).then(function (response) {
                if (response.data.okay) {
                    if (response.data.model && fileInput[0].files[0]) {
                        var formData = new FormData();
                        formData.append("Id", response.data.model);
                        formData.append("file", fileInput[0].files[0]);
                        $http({
                            url: "/api/userrolemanagement/upload",
                            method: "POST",
                            data: formData,
                            headers: { 'Content-Type': undefined }
                        }).then(function (response) {
                            $scope.user.Id = 0;
                            $scope.user.fullname = '';
                            $scope.user.email = '';
                            $scope.user.username = '';
                            $scope.user.password = '';
                            $scope.user.designation = '';
                            $scope.user.mobile = '';
                            $scope.user.phone = '';
                            $scope.user.image = '';
                            userTable.ajax.reload();
                            $("#filebrowser").text("Browse");
                            $("#preview").attr("src", "/images/users/user.png");
                        }, function () {
                            userTable.ajax.reload();
                            $("#preview").attr("src", "/images/users/user.png");
                        });
                    } else {
                        $scope.user.Id = 0;
                        $scope.user.fullname = '';
                        $scope.user.email = '';
                        $scope.user.username = '';
                        $scope.user.password = '';
                        $scope.user.designation = '';
                        $scope.user.mobile = '';
                        $scope.user.phone = '';
                        $scope.user.image = '';
                        userTable.ajax.reload();
                        $("#filebrowser").text("Browse");
                        $("#preview").attr("src", "/images/users/user.png");
                    }
                }
            });
        };
        $scope.deleteUser = function () {
            createModal(function (e) {
                if ($scope.user) {
                    UserRole.deleteUser({
                        Id: $scope.user.Id
                    }).then(function (res) {
                        angular.element(e.target).closest(".modal").remove();
                        if (res.data.okay) {
                            $scope.user.Id = 0;
                            $scope.user.fullname = '';
                            $scope.user.email = '';
                            $scope.user.username = '';
                            $scope.user.password = '';
                            $scope.user.designation = '';
                            $scope.user.mobile = '';
                            $scope.user.phone = '';
                            $scope.user.image = '';
                            userTable.ajax.reload();
                            $("#filebrowser").text("Browse");
                            $("#preview").attr("src", "/images/users/user.png");
                            
                        }
                    });
                } else {
                    angular.element(e.target).closest(".modal").remove();
                }
            });
        };
        $scope.cancelUser = function () {
            $scope.user.Id = 0;
            $scope.user.fullname = '';
            $scope.user.email = '';
            $scope.user.username = '';
            $scope.user.password = '';
            $scope.user.designation = '';
            $scope.user.mobile = '';
            $scope.user.phone = '';
            $scope.user.image = '';
            userTable.ajax.reload();
            $("#filebrowser").text("Browse");
            $("#preview").attr("src", "/images/users/user.png");

        };
        $scope.uploadPhoto = function () {
            fileInput.bind("change", function (e) {
                var file = fileInput[0].files[0];
                var reader = new FileReader();
                reader.addEventListener("load", function () {
                    $rootScope.$apply(function () {
                        $("#preview").attr("src", reader.result);
                    })
                }, false);
                if (file) {
                    reader.readAsDataURL(file);
                }
                angular.element("#filebrowser").text(file.name);
            });
            fileInput.click();
        }
        $("#users tbody").on("click", "tr", function (e) {
            var rowElem = $(this);
            var rowData = userTable.row(this).data(); 'btn-primary'
            if (e.target.tagName == "BUTTON") {
                var target = $(e.target);
                if (target.hasClass('btn-primary')) {
                    target.removeClass('btn-primary');
                    $rootScope.$apply(function () {
                        $scope.user.Id = 0;
                        $scope.user.fullname = '';
                        $scope.user.email = '';
                        $scope.user.username = '';
                        $scope.user.password = '';
                        $scope.user.designation = '';
                        $scope.user.mobile = '';
                        $scope.user.phone = '';
                        $scope.user.image = "";
                        $("#filebrowser").text("Browse");
                        $("#preview").attr("src", "/images/users/user.png");
                    })
                }
                else {
                    userTable.$("button").removeClass('btn-primary');
                    target.addClass('btn-primary');
                    $rootScope.$apply(function () {
                        $scope.user.Id = rowData.Id;
                        $scope.user.fullname = rowData.FullName;
                        $scope.user.email = rowData.Email;
                        $scope.user.username = rowData.Username;
                        $scope.user.password = rowData.Password;
                        $scope.user.designation = rowData.Designation;
                        $scope.user.mobile = rowData.MobileNo;
                        $scope.user.phone = rowData.PhoneNo;
                        $scope.user.image = rowData.Image;
                        $("#filebrowser").text("Change");
                        if (rowData.Image) {
                            $("#preview").attr("src", rowData.Image);
                        } else {
                            $("#preview").attr("src", "/images/users/user.png");
                        }
                        
                    });
                }
            }
        });
        function createModal(proceed) {
            var modalElm = angular.element(angular.element("#delete-confirmation-template").html())
            angular.element("body").append(modalElm)
            var modal = modalElm.modal({ show: false });
            modal.show();
            modal.find(".proceed-button").on("click", proceed)
            modal.find(".cancel-button").on("click", function (e) {
                modalElm.remove();
            })
        }
    });