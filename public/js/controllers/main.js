// on this controller we will handle AngularJs operations 
app.controller('mainController', function ($scope, $http, User, $timeout) {
            $scope.canEdit = false; // flag for show and hide edit input and save button
            $scope.editedUser = {}; // object we will store user that select to edit 
            $scope.editUsername = function ($index) { // function to edit username and show/hide edit and save button 
                $scope.canEdit = true;
                $scope.$index = $index;
                angular.copy($scope.users[$index], $scope.editedUser);
            };
            $scope.formData = {
			};
			$timeout(function(){
				$scope.formData = {
					username : "Eyad "+ new Date().getMilliseconds(),
					email: "eyad@test.test",
					name: "Eyad for test",
					password: "Eyad "+ new Date().getMilliseconds(),
					age: "20",
					biography: "hi hihi hi ihi hihihihihi"
				}
			}, 2000);
            $scope.newData = {};

            // when landing on the page, get all users and show them
            User.get()
                    .success(function (data) {

                        $scope.users = data;
                    })
                    .error(function (data) {
                        console.log('Error: ' + data);
                    });

            // when submitting the add form, send the text to the node API
            $scope.createUser = function () {

                if ($scope.userForm.$valid) {
                    if (!$.isEmptyObject($scope.formData)) {
						//console.log($scope.formData);return;
                        User.create($scope.formData)
                                .success(function (data) {
                                    $scope.dataSubmit = true;
                                    $scope.formData = {}; // clear the form so our user is ready to enter another
                                    $scope.users = data;
                                })
                                .error(function (data) {
                                    console.log('Error: ' + data);
                                });
                    }
                }

            };
            // send to node to update user data 
            $scope.updateUser = function (id) {
                User.update(id, $scope.editedUser)
                        .success(function (data) {
                            angular.copy($scope.editedUser, $scope.users[$scope.$index])
                            $scope.canEdit = false;
                        })
                        .error(function (data) {
                            console.log('Error: ' + data);
                        });
//                }
            };



            // delete a user after checking it
            $scope.deleteUser = function (id) {
                User.delete(id)
                        .success(function (data) {
                            $scope.users = data;
                        })
                        .error(function (data) {
                            console.log('Error: ' + data);
                        });
            };

        });