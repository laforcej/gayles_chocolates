var Pricing = AbstractView.extend({
	
	constructor: function($container, $model, $controller, $data)
	{
		this.inherit($container, $model, $controller, $data);
	},
		
	draw: function()
	{
		return;
		
		var data = this._model.getCategories();
		var str = '<ul>';
		
		for(var i=0; i<data.length; i++) {
			str    += '<li>' + data[i].name + ' cost ' + accounting.formatMoney(data[i].products[0].price) + ' each</li>';
		}
		str    += '</ul>';
		this._container.append(str);
	},
});