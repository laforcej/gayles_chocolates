var FilterBar = AbstractView.extend({

	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onSetFilter'   :function($e,$filter){scope.onSetFilter($filter);},
		});
	},
		
	draw: function()
	{
		var str = '<ul>';
		str    +=  '<li data-filter="all" class="config-btn filter-btn active" title="Click to show all pieces">SHOW ALL</li>';
		str    +=  '<li data-filter="milk_chocolate" class="config-btn filter-btn" title="Click to see Milk Chocolate only">MILK CHOCOLATE ONLY</li>';
		str    +=  '<li data-filter="dark_chocolate" class="config-btn filter-btn" title="Click to see Dark Chocolate only">DARK CHOCOLATE ONLY</li>';
		//str    +=  '<li data-filter="nuts" class="config-btn filter-btn" title="Click to see Nuts only">NUT ONLY</li>';	
		str    += '</ul>';			
		
		this._container.append(str);
		this.setupButtons();
	},
	
	setupButtons: function()
	{
		var scope = this;
		
		jQuery('.filter-btn').click(function(){
			if(jQuery(this).attr('data-filter') == scope._model.getCurFilter()) return;
			scope._controller.setFilter(jQuery(this).attr('data-filter'));
		});
	},
	
	onSetFilter: function($filter) 
	{
		var scope = this;
		
		jQuery('.filter-btn').each(function(){
			if(jQuery(this).attr('data-filter') == $filter) {
				jQuery(this).addClass('active');
			} else {
				jQuery(this).removeClass('active');				
			}
		});
	}
});