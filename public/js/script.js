
var app = angular.module("bulkScreenshots", ['ngResource']);

app.factory('factory', function($resource){

	return {
		fetchPopular: function(callback){

			// The ngResource module gives us the $resource service. It makes working with
			// AJAX easy.

			var api = $resource(
				'',
				{
					username: 'shopgome'
				},
				{
				// This creates an action which we've chosen to name "fetch". It issues
				// an JSONP request to the URL of the resource. JSONP requires that the
				// callback=JSON_CALLBACK part is added to the URL.

					fetch:{method:'JSONP'}
				}
			);

			api.fetch(function(response){

				// Call the supplied callback function
				callback(response.data);

			});
		}
	}

});

function bulkScreenshotsController($scope, $http){

	$scope.add = function(event) { 
		// console.log(event.target);

		$(event.target).addClass('active');

		// create the notification
		// var notification = new NotificationFx({
		// 	message : '<span class="icon icon-megaphone"></span><p>You have some interesting news in your inbox. Go <a href="#">check it out</a> now.</p>',
		// 	layout : 'bar',
		// 	effect : 'slidetop',
  // 			type : 'notice', // notice, warning or error
  // 			onClose : function() {
  // 				$(event.target).prop('disabled', false);
  // 			}
		// });

		var links = $('#links').val();

		if(!links) {
			// create the notification
		var notification = new NotificationFx({
			message : '<span class="icon icon-megaphone"></span><p>Please add some links!</p>',
			layout : 'bar',
			effect : 'slidetop',
  			type : 'notice', // notice, warning or error
  			onClose : function() {
  				
  			},
  		ttl: 5000
		});

		// show the notification
  	notification.show();

  	// setTimeout(function() {
  	// 	// hide the notification
  	// 	notification.hide();
  	// }, 1000);

  	return false;

		}



		links = links.split('\n');
		links = JSON.stringify(links);


		// console.log(links);

		// create the notification
		var notification = new NotificationFx({
			message : '<span class="icon icon-megaphone"></span><p>Please wait ...</p>',
			layout : 'bar',
			effect : 'slidetop',
  			type : 'notice', // notice, warning or error
  			onClose : function() {
  				
  			},
  		ttl: 5000
		});

		// show the notification
  	notification.show();

		$http({
			method: 'POST',
			url: 'l2i',
			data: {
				links: links
			}
		}).success(function(data, status, headers, config) {
  			// data contains the response
  			// status is the HTTP status
  			// headers is the header getter function
  			// config is the object that was used to create the HTTP request
  			console.log(data);

  			var notification = new NotificationFx({
			message : '<span class="icon icon-megaphone"></span><p>Downloading ...</p>',
			layout : 'bar',
			effect : 'slidetop',
  			type : 'notice', // notice, warning or error
  			onClose : function() {
  				
  			},
  		ttl: 5000
		});

		// show the notification
  	notification.show();

  	setTimeout(function() {
  		//
  		document.location.href = document.location.href + 'download?file=' + data.file;
  		return;
  	}, 5000);

  			
		}).error(function(data, status, headers, config) {
			//
		});
	};

	// $scope.layout = 'grid';

	// $scope.pics = [];

	// Use the instagram service and fetch a list of the popular pics
	// factory.fetchPopular(function(data){

	// 	// Assigning the pics array will cause the view
	// 	// to be automatically redrawn by Angular.
	// 	$scope.pics = data;
	// });

}
