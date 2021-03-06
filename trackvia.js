var TrackVia = function(apiKey, user, pass, clientId, refreshToken) {
    this.init(apiKey, user, pass, clientId, refreshToken);
};

$.extend(TrackVia.prototype, {
    apiKey : null,
    user : null,
    pass : null,
    clientId : null,
    accessToken : null,
    refreshToken : null,
    baseUrl : "https://go.trackvia.com",

    init: function(apiKey, user, pass, clientId, refreshToken) {
        this.apiKey = apiKey;
        this.user = user;
        this.pass = pass;
        this.clientId = clientId;
	this.refreshToken = refreshToken || null;
    },
    
    login: function() {
	if ( this.refreshToken != null ){
		var params = {
			'grant_type' : 'refresh_token',
		    	'client_id': this.clientId,
			'refresh_token' : this.refreshToken,
		};

		var scope = this;

		return $.get ( this.baseUrl + "/oauth/token",
			params,
			function(response){
				scope.accessToken = response.accessToken;
			},
			'json'
		);

	} else{
		var data =  {
		    'grant_type': 'password',
		    'client_id': this.clientId,
		    'username': this.user,
		    'password': this.pass
		 };

		var scope = this;

		// Do the Auth request
		return $.post( this.baseUrl + "/oauth/token",
			data, 
			function(response) {
			    scope.accessToken = response.accessToken;
			    scope.refreshToken = response.refreshToken.value;
			},
			'json'
		);
	}
    },

    getAccessToken: function() {
        return this.accessToken;
    },
    
    getRefreshToken: function() {
        return this.refreshToken;
    },
    
    getQueryParams: function(params) {
    	if ( params == null ) {
    		params = {}
    	}
    	params.access_token = this.accessToken;
    	params.user_key = this.apiKey;
    		
    	return '?' + $.param(params);
    },

    getApps: function() {
        var apiUrl =  this.baseUrl + '/openapi/apps' + this.getQueryParams();
    
        return $.get(apiUrl);
    },
    
    getViews: function() {
        var apiUrl =  this.baseUrl + '/openapi/views' + this.getQueryParams();
    	
        return $.get(apiUrl);
    },
    
    getView: function(viewId) {
        var apiUrl =  this.baseUrl + '/openapi/views/' + viewId + this.getQueryParams();
    	
        return $.get(apiUrl);
    },
    
    searchView: function(viewId, q, start, max ) {
    	var params =  { 'q' : q,  'start' : start,  'max' : max };
        var apiUrl =  this.baseUrl + '/openapi/views/' + viewId + '/find' + this.getQueryParams(params);
    	
        return $.get(apiUrl);
    },
    
    createRecord: function(viewId, record) {
        var apiUrl =  this.baseUrl + '/openapi/views/' + viewId + '/records' + this.getQueryParams();
        var jsonRequest = { 'data' : [] };
        jsonRequest.data.push(record);

        return $.ajax({
                                            
            url: apiUrl,
            type: 'POST',
            data: JSON.stringify(jsonRequest),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
       });
    },
   
    getRecord: function(viewId, recordId) {
        var apiUrl =  this.baseUrl + '/openapi/views/' + viewId + '/records/' + recordId + this.getQueryParams();

        return $.get(apiUrl);
    },
  
    deleteRecord: function(viewId, recordId) {
        var apiUrl =  this.baseUrl + '/openapi/views/' + viewId + '/records/' + recordId + this.getQueryParams();

        return $.ajax( {
        		url : apiUrl,
        		type: 'DELETE'
        });
    },
    
    updateRecord: function(viewId, recordId, record) {
        var apiUrl =  this.baseUrl + '/openapi/views/' + viewId + '/records/'+ recordId + this.getQueryParams();
        var jsonRequest = { 'data' : [] };
        jsonRequest.data.push(record);

        return $.ajax({
                                            
            url: apiUrl,
            type: 'PUT',
            data: JSON.stringify(jsonRequest),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
       });
    }
   
});

