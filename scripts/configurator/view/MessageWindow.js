var MessageWindow = AbstractView.extend({
	
	_box        :null,
	_bg         :null,
	_content    :null,
	_btnCancel  :null,
	_btnConfirm :null,
	_type       :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onShowPrompt'   :function($e, $type, $msg, $btnCancel, $btnConfirm){scope.onShowPrompt($type, $msg, $btnCancel, $btnConfirm);},
		});
	},
		
	draw: function()
	{
	},
	
	show: function()
	{
		var scope = this;		
		
		this._container.animate({opacity:1}, 'fast', function(){
			jQuery('.message-window-btn').click(function() {
				scope._controller.messageWindowResult(scope._type, jQuery(this).attr('data-val'));
				scope.hide();
			});
		});
	},
	
	hide: function()
	{
		var scope = this;
		
		this._container.animate({opacity:0}, 'fast', function(){
			scope._container.html('');
			jQuery('.message-window-btn').unbind('click');
			jQuery(this).css('display', 'none');
		});
	},
	
	onShowPrompt: function($type, $msg, $btnCancel, $btnConfirm)
	{
		this._type = $type;
		this._container.css({display:'block'});
		this._container.append('<div id="bg"></div><div id="box"><div id="content-box"><div id="content"></div></div></div>');
		this._bg = jQuery('#message-window #bg');
		this._box = jQuery('#message-window #box');
		this._content = jQuery('#message-window #content-box #content');
		
		this._content.append('<div id="prompt">' + $msg + '</div>');
		this._content.append('<div id="prompt-cancel" class="message-window-btn" data-val="0">' + $btnCancel + '</div>');
		this._content.append('<div id="prompt-confirm" class="message-window-btn" data-val="1">' + $btnConfirm + '</div>');
		
		this.onResize(jQuery(window).width(), jQuery(document).width());

		this.show();
	},
	
	onResize: function($winWidth, $docWidth)
	{
		if(this._box != null) {
			var left = (this._container.width() - this._box.width()) / 2;
			var top  = 50; //(this._container.height() - this._box.height()) / 2;
			
			this._box.css({top:top, left:left});
			
			var top = (jQuery('#message-window #content-box').height() - this._content.height()) / 2;
			var left = (jQuery('#message-window #content-box').width() - this._content.width()) / 2;
			
			this._content.css({top:top, left:left});
		}
	},
});