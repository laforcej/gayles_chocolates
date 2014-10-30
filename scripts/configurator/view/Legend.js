var Legend = AbstractView.extend({
	
	constructor: function($container, $model, $controller, $data)
	{
		this.inherit($container, $model, $controller, $data);
	},
		
	draw: function()
	{
		this.onResize(jQuery(window).width(), jQuery(document).width());
	},
	
	onResize: function($winWidth, $docWidth)
	{
		this._container.html('');
		if($winWidth <= this._model.MAX_WIDTH) {		
			var str = '<div style="float:none;"><ul>';
			str    += '<li><div class="config-circle circle-add">&nbsp;</div><div class="legend-label">Add piece to tray</div><div class="clear"></div></li>';
			str    += '<li><div class="config-circle circle-remove">&nbsp;</div><div class="legend-label">Remove piece from tray</div><div class="clear"></div></li>';
			str    += '</ul></div>';
			str    += '<div style="float:none;margin-top:5px;"><ul>';
			str    += '<li><div class="config-circle circle-count"><div>2</div></div><div class="legend-label">Number of this piece in the tray</div><div class="clear"></div></li>';
			str    += '<li><div class="config-circle circle-x">&nbsp;</div><div class="legend-label">Empty Tray (this cannot be undone)</div><div class="clear"></div></li>';
			str    += '</ul></div>';
			this._container.append(str);
		} else {
			var str = '<ul>';
			str    += '<li><div class="config-circle circle-add">&nbsp;</div><div class="legend-label">Add piece to tray</div><div class="clear"></div></li>';
			str    += '<li><div class="config-circle circle-remove">&nbsp;</div><div class="legend-label">Remove piece from tray</div><div class="clear"></div></li>';
			str    += '<li><div class="config-circle circle-count"><div>2</div></div><div class="legend-label">Number of this piece in the tray</div><div class="clear"></div></li>';
			str    += '<li><div class="config-circle circle-x">&nbsp;</div><div class="legend-label">Empty Tray (this cannot be undone)</div><div class="clear"></div></li>';
			str    += '</ul>';
			this._container.append(str);
		}
	}
});