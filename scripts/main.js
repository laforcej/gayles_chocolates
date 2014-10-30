var _configurator;

jQuery(document).ready(function(){
	_model      = new Model(CreateYourOwnBox, configPath);
	_controller = new Controller(jQuery('#configurator'), _model);

	jQuery('.tooltip').qtip({
		content: {attr: 'data-tooltip'},
		style: {classes: 'custom-qtip'},
		position: {
			my: 'bottom right',
			at: 'top center'
		},
	});
});

jQuery(window).resize(function($e){
	jQuery('body').trigger('onResizeController', [jQuery(window).width(), jQuery(document).width()]);
});