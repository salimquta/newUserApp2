// users services 
app.factory('User', function($http) {
        return {
            get : function() {
                return $http.get('/api/users');
            },
            create : function(usersData) {
                return $http.post('/api/users', usersData);
            },
            update : function(id , usersData) {
                return $http.put('/api/users/'+ id , usersData);
            },
            delete : function(id) {
                return $http.delete('/api/users/' + id);
            }
        }
    });