var AbstractView = Base.extend({

	_container  :null,
	_data       :null,
	_model      :null,
	_controller :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this._container  = $container;
		this._model      = $model;
		this._controller = $controller;
		this._data       = $data;
		
		jQuery('body').bind({
			'onEmptyTray'   :function($e,$idx){scope.onEmptyTray($idx);},
			'onTrayFull'    :function($e){scope.onTrayFull();},
			'onTrayEmpty'   :function($e){scope.onTrayEmpty();},
			'onTrayNotFull' :function($e){scope.onTrayNotFull();},
			'onResize'      :function($e, $width, $height){scope.resize($width, $height);},
			'onRestart'     :function($e){scope.onRestart();},
			'onSwitchTray'  :function($e, $idx){scope.onSwitchTray($idx);},
			'onResize'      :function($e, $winWidth, $docWidth){scope.onResize($winWidth, $docWidth);},
		});
			
		this.init();
	},
	
	update: function()
	{
	},
	
	move: function() 
	{
	},
	
	init: function()
	{
		this.draw();
		this.onResize(null, jQuery(window).width(), jQuery(document).width());
	},
	
	draw: function()
	{
		this._container.append('<div class="candy-title">' + this._data.name + '</div>');
	},

	show: function()
	{
	},
	
	hide: function()
	{
	},
	
	destroy: function()
	{
		
	},
	
	onEmptyTray: function()
	{
	},
	
	onTrayFull: function()
	{
	},
	
	onTrayEmpty: function()
	{
	},	
	
	onTrayNotFull: function()
	{
	},
	
	onSwitchTray: function()
	{
	
	},
	
	onRestart: function()
	{
	},
	
	onResize: function($e, $winWidth, $docWidth)
	{
	},
});