var CartWindow = AbstractView.extend({
	
	_box            :null,
	_bg             :null,
	_content        :null,
	_addToBasketBtn :null,
	_qtyField       :null,
	_makeChangesBtn :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		jQuery('body').bind({
			'onAllTraysFull'   :function($e){scope.onAllTraysFull();},
			'onShowBasket'     :function($e){scope.onAllTraysFull();},
		});
	},
		
	draw: function()
	{
	},
	
	show: function()
	{
		var scope = this;		
				
		this._container.animate({opacity:1}, function(){
			
			scope._makeChangesBtn.click(function(){
				scope._controller.makeChangesToBasket();
				scope.hide();
			});
			
			scope._qtyField.keyup(function(){
				var val = jQuery.trim(jQuery(this).val());
			
				if(val != '' && !isNaN(val)) {
					scope.enableAddToBasketBtn();	
				} else {
					scope.disableAddToBasketBtn();					
				}
			});
		});
	},
	
	hide: function()
	{
		var scope = this;
		
		this._container.animate({opacity:0}, function(){
			scope.disableAddToBasketBtn();
			scope._makeChangesBtn.unbind('click');
			jQuery(this).html('');
			jQuery(this).css('display', 'none');
			this._addToBasketBtn = null;
			this._qtyField = null;
			this._makeChangesBtn = null;
		});
	},
	
	enableAddToBasketBtn: function()
	{
		var scope = this;
		
		this._addToBasketBtn.click(function() {
			scope.addToBasket();
		});
		this._addToBasketBtn.removeClass('disabled');
	},
	
	disableAddToBasketBtn: function()
	{	
		this._addToBasketBtn.unbind('click');
		this._addToBasketBtn.addClass('disabled');
	},
	
	addToBasket: function()
	{
		var val = jQuery.trim(jQuery('#cart-window #qty').val());

		if(val != '' && !isNaN(val)) {
			this._controller.addToBasket(val);
			this.hide();	
		}
	},
	
	onAllTraysFull: function()
	{
		var scope = this;
		
		this._container.css({display:'block'});
		this._container.append('<div id="bg"></div><div id="box"><div id="content-box"><div id="content"></div></div></div>');
		this._bg = jQuery('#cart-window #bg');
		this._box = jQuery('#cart-window #box');
		this._content = jQuery('#cart-window #box #content-box #content');
		
		this._content.append('<div id="prompt-title">Ready. Set. Ship.</div>');
		this._content.append('<div id="prompt-subtitle">You have filled your truffle box<br/>with your favourite chocolates.</div>');
		this._content.append('<span><label>QTY:</label><input id="qty" type="text" maxlength="3"></span><span id="add-to-basket-btn">Add to Basket</span>');
		this._content.append('<div id="make-changes-btn">Make change(s) to my box</div>');
		
		this._addToBasketBtn = jQuery('#add-to-basket-btn');
		this._qtyField = jQuery('#qty');
		this._makeChangesBtn = jQuery('#make-changes-btn');
	
		var top = (jQuery('#cart-window #content-box').height() - this._content.height()) / 2;
		var left = (jQuery('#cart-window #content-box').width() - this._content.width()) / 2;
			
		this._content.css({top:top, left:left});
		
		this.disableAddToBasketBtn();
		this.show();
	},
});