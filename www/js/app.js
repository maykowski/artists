// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ion-sticky', 'patient-state'])

    .factory('PatientService', PatientService)
    .factory('VisitService', VisitService)

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
    })


    .controller('ListController', ['$scope', '$http', '$state', 'patients', 'PatientService',
        function ($scope, $http, $state, patients, PatientService) {
            $scope.patients = patients.data.patients;

            $scope.whichpatient = $state.params.aId;
            $scope.data = {showDelete: false, showReorder: false};

            $scope.onItemDelete = function (item) {
                $scope.patients.splice($scope.patients.indexOf(item), 1);
            }


            $scope.doRefresh = function () {
                PatientService.getPatients().then(function (response) {
                    $scope.patients = response.patients;
                    $scope.$broadcast('scroll.refreshComplete');
                }.bind(this));
            }

            $scope.toggleStar = function (item) {
                item.star = !item.star;
            }

            $scope.moveItem = function (item, fromIndex, toIndex) {
                $scope.patients.splice(fromIndex, 1);
                $scope.patients.splice(toIndex, 0, item);
            };
        }])
    .controller('PatientController', ['$scope', '$http', '$state', '$filter', 'PatientService', 'VisitService',
        function ($scope, $http, $state, $filter, PatientService, VisitService) {
            $scope.whichpatient = PatientService.getPatientDetails($state.params.aId).then(function (response) {
                $scope.whichpatient = response;
            });

            VisitService.getVisits().then(function (response) {
                $scope.visits = $filter('filter')(response.data.visits, {patient_id: $state.params.aId});
            }), function (error) {
                alert("Error retrieving json data")
            };
        }])

    .controller('VisitController', ['$scope', '$http', '$state', '$filter', 'VisitService',
        function ($scope, $http, $state, $filter, VisitService) {
            VisitService.getVisits().then(function (visitResponse) {
                $scope.whichvisit = $filter('filter')(visitResponse.data.visits, {id: $state.params.visitId})[0];
            }).then(function (response) {
                return VisitService.getReference();
            }).then(function (refResponse) {
                var reference = refResponse.data.reference;
                angular.forEach($scope.whichvisit.results, function (value, key) {
                    angular.forEach(value.results, function (value2, key2) {
                        var ref = $filter('filter')(reference, value2.name);
                        value2.min = ref[0].min;
                        value2.max = ref[0].max;

                    });
                });
            }), function (error) {
                alert("Error retrieving json data in VisitController")
            };
        }])


    .controller('InfoController', function ($scope, $state) {

        var whatToDo = this;

        /**
         * Sends an email using Email composer with attachments plugin and using
         * parameter email.
         *
         * @param email
         */
        $scope.sendEmail = function (email) {
            if (window.plugins && window.plugins.emailComposer) { //check if plugin exists

                window.plugins.emailComposer.showEmailComposerWithCallback(function (result) {
                        console.log("Email sent successfully");
                    },

                    null,        // Subject
                    null,        // Body
                    [email],     // To (Email to send)
                    null,        // CC
                    null,        // BCC
                    false,       // isHTML
                    null,        // Attachments
                    null);       // Attachment Data
            }

        }
    });

function PatientService($http, $filter) {
    function getPatients() {
        return $http.get('js/data.json').then(function (response) {
            return response;
        });
    }

    function getPatientDetails(id) {
        return getPatients().then(function (response) {
            patient = $filter('filter')(response.data.patients, {id: id})[0];
            return patient;
        });
    }

    return {
        getPatients: getPatients,
        getPatientDetails: getPatientDetails
    };
}

function VisitService($http) {
    function getVisits() {
        return $http.get('js/visits.json').then(function (response) {
            return response;
        });
    }

    function getReference() {
        return $http.get('js/reference.json').then(function (response) {
            return response;
        });
    }

    return {
        getVisits: getVisits,
        getReference: getReference
    };
}
