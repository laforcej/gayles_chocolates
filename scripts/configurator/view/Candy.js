var Candy = AbstractView.extend({

	_count             :0,
	_addBtn            :null,
	_removeBtn         :null,
	_counter           :null,
	_top               :null,
	_left              :null,
	_addBtnEnabled     :true,
	_removeBtnEnabled  :true,
	_candyBtn          :null,
	_candyContent      :null,
	_candyOverlay      :null,
	_candyTitle        :null,
	_price             :null,

	constructor: function($container, $model, $controller, $data, $left, $top, $piecesAdded)
	{
		var scope = this;
		
		this._top      = $top;
		this._left     = $left;
		this._count    = $piecesAdded;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onShowStep' :function($e){scope.onShowStep();},
			'onEmptyTray':function($e){scope.onEmptyTray();}
		});
	},
	
	init: function()
	{
		var scope = this;
		
		this.draw();
	},
	
	draw: function()
	{
		var scope = this;
		
		this._container.css({top:this._top+'px', left:this._left+'px'});
		this._container.css('background', 'url(' + this._data.lg_image + ') no-repeat 11% 50%');

		this._container.append('<div id="candy-title-' + this._data.sku + '" class="candy-title">' + this._data.name + '</div>');
		this._container.append('<div id="candy-price-' + this._data.sku + '" class="candy-price">' + accounting.formatMoney(this._data.price) + '</div>');
		this._container.append('<div id="candy-btn-' + this._data.sku + '" class="candy-btn"></div>');
		this._container.append('<div id="candy-controls-' + this._data.sku + '" class="candy-controls"></div>');
		this._container.append('<div id="candy-overlay-' + this._data.sku + '" class="candy-overlay"></div>');
		
		this._candyTitle          = jQuery('#candy-title-' + this._data.sku);
		this._candyBtn            = jQuery('#candy-btn-' + this._data.sku);
		this._candyControls       = jQuery('#candy-controls-' + this._data.sku);				
		this._candyOverlay        = jQuery('#candy-overlay-' + this._data.sku);
		this._candyPrice          = jQuery('#candy-price-' + this._data.sku);;
				
		this._candyControls.append('<div id="count-' + this._data.sku + '"  class="config-circle candy-count" title="Current amount of pieces in tray"><div></div></div>');
		this._candyControls.append('<div id="add-' + this._data.sku + '"    class="config-circle circle-add candy-add" title="Click to add piece to tray"></div>');
		this._candyControls.append('<div id="remove-' + this._data.sku + '" class="config-circle circle-remove candy-remove" title="Click to remove piece from tray"></div>');
		this._candyControls.append('<div class="clear"></div>');
		
		this._counter =   jQuery('#count-' + this._data.sku);
		this._addBtn =    jQuery('#add-' + this._data.sku);
		this._removeBtn = jQuery('#remove-' + this._data.sku);
		
		this._counter.css({opacity:0});
		this.disableAddBtn();
		this.disableRemoveBtn();	
				
		this._candyBtn.mouseover(function(){
			scope.showOverlay();
		});
		
		this._candyBtn.mouseout(function(){
			scope.hideOverlay();
		});
		
		if(this._model.isLastStep()) {
			if(!this._model.isTrayFull()) {
				this.enableAddBtn();	
				this._addBtn.css({opacity:1});
			} else {
				this._addBtn.css({opacity:0});
			}
			
			if(this._count > 0) {
				this.updateCounter();
				this._counter.css({opacity:1});
				this.enableRemoveBtn();	
				this._removeBtn.css({opacity:1});
			} else {
				this._removeBtn.css({opacity:0});
			}
		}
	},
	
	addItem: function()
	{
		if(this._model.isLastStep() && this._model.isTrayFull()) return;
		
		if(this._model.getSelectionType() == 'single') {
			this._count = this._model.getCurTrayTotal();
			if(this._model.isMultipleTrays()) this._count *= 2;
		} else {
			this._count++;		
		}
		this.showCounter();
		this.showRemoveBtn();
		this.updateCounter();
		this._controller.addCandyToTray(this._data.sku, this._data.price, this._data.sm_image, this._data.name, this._data.id);
	},
	
	removeItem: function()
	{
		if(this._model.isLastStep() && this._model.isTrayEmpty()) return;
		
		if(this._model.getSelectionType() == 'single') {
			this._count = 0;
		} else {
			this._count--;
		}
		if(this._count == 0) {
			this.hideRemoveBtn();
			this.hideCounter();
		} 
		
		this.updateCounter();
		this._controller.removeCandyFromTray(this._data.sku);
	},
	
	hideAllButtons: function()
	{
		this.hideAddBtn();
		this.hideRemoveBtn();	
	},
	
	showAllButtons: function()
	{
		this.showAddBtn();
		this.showremoveBtn();	
	},
	
	showAddBtn: function() 
	{
		this.enableAddBtn();
		this._addBtn.animate({opacity:1});
	},
	
	hideAddBtn: function() 
	{
		this.disableAddBtn();
		this._addBtn.css({opacity:0});
	},
	
	enableAddBtn: function()
	{
		if(this._addBtnEnabled) return;
	
		var scope = this;
		
		this._addBtn.click(function(){
			scope.addItem();
		});
		this._addBtn.css({cursor:'pointer'});
		this._addBtnEnabled = true;
	},
	
	disableAddBtn: function()
	{
		if(!this._addBtnEnabled) return;
	
		this._addBtn.unbind('click');
		this._addBtn.css({cursor:'default'});
		this._addBtnEnabled = false;
	},	
	
	showRemoveBtn: function() 
	{
		this.enableRemoveBtn();
		this._removeBtn.animate({opacity:1});
		this._removeBtnEnabled = true;
	},
	
	hideRemoveBtn: function() 
	{
		this.disableRemoveBtn();
		this._removeBtn.css({opacity:0});	
	},
	
	enableRemoveBtn: function()
	{
		if(this._removeBtnEnabled) return;
	
		var scope = this;

		this._removeBtn.click(function(){
			scope.removeItem();
		});
		this._removeBtn.css({cursor:'pointer'});
		this._removeBtnEnabled = true;	
	},
	
	disableRemoveBtn: function()
	{
		if(!this._removeBtnEnabled) return;
	
		this._removeBtn.unbind('click');
		this._removeBtn.css({cursor:'default'});
		this._removeBtnEnabled = false;	
	},
	

	showCounter: function() 
	{
		this._counter.removeClass('hidden');
		this._counter.animate({opacity:1});
	},
	hideCounter: function() 
	{
		this._counter.css({opacity:0});
	},
	
	updateCounter: function()
	{
		this._counter.find('div').html(this._count);
	},

	show: function()
	{
	},
	
	hide: function()
	{
	},
	
	showOverlay: function()
	{
		var scope = this;
		
		this._candyOverlay.append('<div class="candy-description-title">' + this._data.name + '</div><div class="candy-description-copy">' + this._data.desc + '</div>');
		this._candyOverlay.css({'display':'block', opacity:0});
		this._candyOverlay.stop().animate({opacity:1}, 'fast');
	},	
	
	hideOverlay: function()
	{
		var scope = this;
		
		this._candyOverlay.stop().animate({opacity:0}, 'fast', function(){
			scope._candyOverlay.html('');	
			scope._candyOverlay.css('display','none');
		});
	},	
	
	onShowStep: function()
	{
		if(this._model.isLastStep()) {
			this.showAddBtn();
		} else {
			this._count = 0;
			this.hideAddBtn();
			this.hideRemoveBtn();
			this.hideCounter();	
			this.updateCounter();
		}
	},
	
	onEmptyTray: function()
	{
		this._count = 0;
		this.updateCounter();
		this.hideCounter();		
		this.showAddBtn();
		this.hideRemoveBtn();
	},	
	
	onTrayFull: function()
	{
		//if(this._data.sku == '51-023') console.log('tray full');
		this.hideAddBtn();
	},
	
	onTrayNotFull: function()
	{
		//if(this._data.sku == '51-023') console.log('tray not full');	
		this.showAddBtn();
	},
	
	onTrayEmpty: function()
	{
		//if(this._data.sku == '51-023') console.log('tray empty');
		this.showAddBtn();
	},	
	
	onSwitchTray: function($idx)
	{	
		this._count = this._model.getPiecesAddedBySku(this._data.sku);
		
		if(this._count == 0) {
			this.hideCounter();
			this.hideRemoveBtn();

			if(this._model.isTrayFull()) {
				this.hideAddBtn();
			} else {
				this.showAddBtn();
			}
		} else {
			this.showRemoveBtn();
			this.showCounter();
			if(this._model.isTrayFull()) {
				this.hideAddBtn();
			} else {
				this.showAddBtn();
			}
		}
		this.updateCounter();
	},
});