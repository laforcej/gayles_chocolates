var Controller = Base.extend({

	DEBUG           :false,	
	_data           :null,
	_imgsToLoad     :0,
	_imgsLoaded     :0,
	_model          :null,
	_container      :null,
	_tray           :null,
	_breadcrumb     :null,
	_steps          :null,
	_filterBar      :null,
	_pricing        :null,
	_legend         :null,
	_candySelector	:null,
	_cartWindow     :null,
	_messageWindow  :null,
	_submitModal    :null,
	
	constructor: function($container, $model)
	{
		this._model     = $model;
		this._container = $container;
		this.init();
	},
	
	create: function()
	{
		
	},
	
	destroy: function()
	{
		
	},
	
	init: function()
	{
		var scope = this;
		
		this._tray          = new Tray(          jQuery('#tray'),           this._model, this);
		this._breadcrumb    = new Breadcrumb(    jQuery('#breadcrumb'),     this._model, this, this._model.BREADCRUMB);
		this._steps         = new Steps(         jQuery('#steps'),          this._model, this);
		this._filterBar     = new FilterBar(     jQuery('#filter-bar'),     this._model, this);
		this._pricing       = new Pricing(       jQuery('#pricing'),        this._model, this);
		this._legend        = new Legend(        jQuery('#legend'),         this._model, this);
		this._candySelector = new CandySelector( jQuery('#candy-selector'), this._model, this, this._model.getCategories());
		this._cartWindow    = new CartWindow(    jQuery('#cart-window'),    this._model, this);
		this._messageWindow = new MessageWindow( jQuery('#message-window'), this._model, this);
		
		jQuery('body').bind({
			'onHideElements'     :function($e){scope.onHideElements($e);},
			'onAddItem'          :function($e, $sku, $price, $trayImage){scope.onAddItemToTray($sku, $price, $trayImage);},
			'onRemoveItem'       :function($e, $sku, $price){scope.onRemoveItemFromTray($sku, $price);},
			'onResizeController' :function($e, $winWidth, $docWidth){scope.onResize($winWidth, $docWidth);},
		});
		this.onResize(jQuery(window).width(), jQuery(document).width());
		this.preload();
	},
	
	draw: function()
	{	
		jQuery('#configurator').css('background','none');
		jQuery('body').trigger('onShowStep');
		this._container.fadeIn();
	},
	
	showPrompt: function($type)
	{
		if($type == 'emptyTray') {
			jQuery('body').trigger('onShowPrompt', [$type, 'You selected to empty your tray. This can not be undone.', 'KEEP TRAY', 'EMPTY TRAY']);	
		} else if($type == 'startOver') {
			jQuery('body').trigger('onShowPrompt', [$type, 'Do you wish to start over? All current progress will be lost', 'CANCEL', 'START OVER']);	
		}
		
		//this.restart();
	},
	
	messageWindowResult: function($type, $result) 
	{
		if($type == 'emptyTray') {
			if($result == 1) {
				this._model.emptyTray();
				jQuery('body').trigger('onEmptyTray', this._model.getTrayToBeEmptied());
				this.checkTrays();			
			}
		} else if($type == 'startOver') {
			if($result == 1) {
				this.restart();
			}
		}
	},
	
	emptyTray: function($idx)
	{	
		this._model.setTrayToBeEmptied($idx);
		this.showPrompt('emptyTray');
	},
	
	restart: function()
	{
		this._model.restart();
		
		jQuery('body').trigger('onRestart');
		jQuery('body').trigger('onShowStep');
	},
	
	setTotalPieces: function($totalPieces)
	{
		this._model.setTotalPieces($totalPieces);
		jQuery('body').trigger('onTotalPiecesSet', $totalPieces);
	},
	
	setSelectionType: function($type)
	{
		this._model.setSelectionType($type);
	},
	
	setCurStep: function($curStep)
	{
		this._model.setCurStep($curStep);
		jQuery('body').trigger('onShowStep');
	},
	
	switchTray: function($idx)
	{
		this._model.setCurTray($idx);
		jQuery('body').trigger('onSwitchTray', $idx);
	},

	addCandyToTray: function($sku, $price, $trayImg, $name, $id)
	{	
		if(this._model.getSelectionType() == 'single') {
			this._model.addCandyToTraySingle($sku, $price, $trayImg, $name, $id);	
			jQuery('body').trigger('onAddCandyToTraySingle', [$sku, $trayImg, this._model.getCurTrayGrid(), $name]);		
		} else {
			var emptySlot = this._model.getEmptyTraySlot();
			var tmpId = 'tray-' + this._model.getCurTrayIdx() + '-' + emptySlot;
			
			this._model.addCandyToTrayMulti($sku, $price, emptySlot, tmpId, $trayImg, $name, $id);	
			jQuery('body').trigger('onAddCandyToTrayMulti', [$sku, $trayImg, this._model.getTrayGridCoords(emptySlot).top, this._model.getTrayGridCoords(emptySlot).left, tmpId, $name]);		
		}
		
		this.checkTrays();
	},
	
	removeCandyFromTray: function($sku)
	{
		if(this._model.getSelectionType() == 'single') {
			this._model.removeCandyFromTraySingle();			
			jQuery('body').trigger('onRemoveCandyFromTraySingle');
		} else {
			var candyToRemove = this._model.removeCandyFromTrayMulti($sku);	
			jQuery('body').trigger('onRemoveCandyFromTrayMulti', [candyToRemove]);	
		}
		this.checkTrays();
	},
	
	loadCategory: function($e, $idx)
	{
		this._model.setCurTab($idx);
		jQuery('body').trigger('onLoadCategory', $idx);	
	},
	
	setFilter: function($filter)
	{
		this._model.setCurFilter($filter);
		jQuery('body').trigger('onSetFilter', $filter);	
	},
		
	checkTrays: function()
	{
		if(this._model.isTrayFull()) {
			jQuery('body').trigger('onTrayFull');	
			if(this._model.areAllTraysFull()) {
				jQuery('body').trigger('onAllTraysFull');		
			}
		} else if(this._model.isTrayEmpty()) {
			jQuery('body').trigger('onTrayEmpty');	
		} else {
			jQuery('body').trigger('onTrayNotFull');	
		}
	},
	
	addToBasket: function($qty) 
	{
		var cnt = 0;
		var trays = this._model.getTrays();
		var selectionIDs = this._model.getCurProductSelectionIDs();
		var productID = this._model.getCurProductID();
		
		//console.log('Adding to Basket...(Product SKU: ' + this._model._curProductSKU.sku + ')');
		//console.log('-------------------------------------------------');
		
		for(var i=0; i<trays.length; i++) {
			for(var j=0; j<trays[i].products.length; j++) {
				var sku = trays[i].products[j].sku;				
				jQuery('#configurator').append('<input type="hidden" name="bundle_option[' + (selectionIDs['selection_' + cnt][sku].attribute_id) + ']" value="' + selectionIDs['selection_' + cnt][sku].selection_id + '"/>');
				jQuery('#configurator').append('<input type="hidden" name="bundle_option_qty[' + (selectionIDs['selection_' + cnt][sku].attribute_id) + ']" value="1"/>');	
				//console.log('selection_' + cnt + ' :: ' + sku + ' :: value=' +  selectionIDs['selection_' + cnt][sku].selection_id);				
				cnt++;
			}
		}
		
		console.log('Form URL Start: ' + jQuery('#product_addtocart_form').attr('action'));
		
		var tmpArray = jQuery('#product_addtocart_form').attr('action').split('/product/');
		var formURL = tmpArray[0] + '/product/' + productID + '/';
		
		//console.log('Form URL New: ' + formURL);
		
		jQuery('#product_addtocart_form').attr('action', formURL);
		jQuery('input[name*="product"]').val(productID);
		
		jQuery('#configurator').append('<input type="hidden" name="qty" value="' + $qty + '"/>');	
		
		this.showSubmitModal();
		jQuery('#product_addtocart_form').delay(500).submit();
	},
	
	makeChangesToBasket: function()
	{
		jQuery('body').trigger('onMakeChangesToBasket');	
	},
	
	showBasket: function()
	{
		jQuery('body').trigger('onShowBasket');	
	},
	
	showSubmitModal: function()
	{
		jQuery('body').append('<div id="submit-modal"><div style="position:absolute;">Processing your order...please wait</div></div>');
		
		this._submitModal = jQuery('#submit-modal');
		
		var width = jQuery(window).width();
		var height = jQuery(document).height();
		var div = this._submitModal.find('div');
		
		this._submitModal.width(width);
		this._submitModal.height(height);
		
		var top = (jQuery(window).height() - div.height()) / 2;
		var left = (jQuery(window).width() - div.width()) / 2;
		div.css({top: top, left: left});	
	},
	
	ready: function()
	{
	},
	
	preload: function()
	{
		var scope = this;
		var data  = this._model.getCategories();
		
		var traySrc1 = this._model.getConfigPath() + 'images/trays/tray_4.png';
		var tmpTrayImg1 = new Image();
		tmpTrayImg1.onload = function(){
			scope.onImgLoaded();
		};
		tmpTrayImg1.src = traySrc1;
		
		var traySrc2 = this._model.getConfigPath() + 'images/trays/tray_9.png';
		var tmpTrayImg2 = new Image();
		tmpTrayImg2.onload = function(){
			scope.onImgLoaded();
		};
		tmpTrayImg2.src = traySrc2;
		
		var traySrc3 = this._model.getConfigPath() + 'images/trays/tray_16.png';
		var tmpTrayImg3 = new Image();
		tmpTrayImg3.onload = function(){
			scope.onImgLoaded();
		};
		tmpTrayImg3.src = traySrc3;
		
		var traySrc4 = this._model.getConfigPath() + 'images/trays/tray_25.png';
		var tmpTrayImg4 = new Image();
		tmpTrayImg4.onload = function(){
			scope.onImgLoaded();
		};
		tmpTrayImg4.src = traySrc4;
		
		this._imgsToLoad += 4;
		
		for(var i=0; i<data.length; i++) {
			for(var j=0; j<data[i].products.length; j++) {
				var src1 = data[i].products[j].lg_image;
				var tmpImg1 = new Image();
				tmpImg1.onload = function(){
					scope.onImgLoaded();
				};
				tmpImg1.onerror = function($e){
					scope.onImgError($e);
				};
				tmpImg1.src = src1;
				this._imgsToLoad++;

				var src2 = data[i].products[j].sm_image;
				var tmpImg2 = new Image();
				tmpImg2.onload = function(){
					scope.onImgLoaded();
				};
				tmpImg2.src = src2;
				this._imgsToLoad++;
			}
		}
	},
	
	onImgLoaded: function()
	{
		
		this._imgsLoaded++;
		
		if(this._imgsLoaded == this._imgsToLoad) {
			this.draw();
		}
	},
	
	onImgError: function($e)
	{
		console.log('error: ' + $e.target.src);
	},
	
	onResize: function($winWidth, $docWidth)
	{
		if($winWidth > this._model.MIN_WIDTH) {
			if($winWidth < this._model.MAX_WIDTH) {
				var width = this._model.MIN_WIDTH - jQuery('#left-col').width();
				jQuery('#right-col').width(505);
				jQuery('#configurator').width(this._model.MIN_WIDTH);
			} else {
				jQuery('#right-col').width(700);
				jQuery('#configurator').width(this._model.MAX_WIDTH);
			}
			
		} else {
			jQuery('#right-col').width(505);
			jQuery('#configurator').width(this._model.MAX_WIDTH);
		}
				
		jQuery('body').trigger('onResize', [$winWidth, $docWidth]);
		
		if(this._submitModal != null) {
			var width = jQuery(window).width();
			var height = jQuery(document).height();
		
			this._submitModal.width(width);
			this._submitModal.height(height);
			
			var div = this._submitModal.find('div');
			var top = (jQuery(window).height() - div.height()) / 2;
			var left = (jQuery(window).width() - div.width()) / 2;
			div.css({top: top, left: left});
		}
		
		
	}
});