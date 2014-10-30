var Breadcrumb = AbstractView.extend({
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onShowStep':function($e){scope.onShowStep();}
		});
	},
		
	draw: function()
	{
		var str = '<ul>';
		var theClass = '';

		for(var i=0; i<this._data.length; i++) {
			if(i>0) theClass = ' class="not-first"';
			str += '<li' + theClass + '>' + this._data[i] + '</li>';	
		}
		
		str += '</ul>';
		
		this._container.append(str);
	},
	
	update: function()
	{
		var scope = this;
		
		this._container.find('li').each(function() {
			if((jQuery(this).index() + 1) == scope._model.getCurStep()) {
				jQuery(this).addClass('active');
			} else {
				jQuery(this).removeClass('active');
			}
		});	
	},
	
	onShowStep: function()
	{
		this.update();
	},
});