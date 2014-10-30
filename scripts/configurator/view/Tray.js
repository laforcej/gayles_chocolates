var Tray = AbstractView.extend({
	
	_curTraySize      :null,
	_trayLabel        :null,
	_trayTabs         :null,
	_trayImg          :null,
	_pieceCount       :null,
	_trayIndicator    :null,
	_addToBasketBtn   :null,
	_nextTrayBtn      :null,
	_nextTrayBtnShown :false,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onTotalPiecesSet'             :function($e, $totalPiecesSet)                        {scope.onTotalPiecesSet($totalPiecesSet);},
			'onAddCandyToTrayMulti'        :function($e, $sku, $trayImg, $top, $left, $id, $name){scope.onAddCandyToTrayMulti($sku, $trayImg, $top, $left, $id, $name);},
			'onAddCandyToTraySingle'       :function($e, $sku, $trayImg, $grid, $name)           {scope.onAddCandyToTraySingle($sku, $trayImg, $grid, $name);},			
			'onRemoveCandyFromTrayMulti'   :function($e, $id)                                    {scope.onRemoveCandyFromTrayMulti($id);},
			'onRemoveCandyFromTraySingle'  :function($e)                                         {scope.onRemoveCandyFromTraySingle();},			
			'onShowStep'                   :function($e)                                         {scope.onShowStep();},
			'onMakeChangesToBasket'        :function($e)                                         {scope.onMakeChangesToBasket();}

		});
	},
		
	draw: function()
	{
		this._container.append('<div id="tray-label"><div id="piece-count"></div><div id="tray-tabs"></div><div class="clear"></div><div id="tray-indicator"></div></div>');
		this._container.append('<div id="tray-image"></div>');	
		this._trayLabel     = jQuery('#tray-label');
		this._trayTabs      = jQuery('#tray-tabs');
		this._trayImg       = jQuery('#tray-image');
		this._pieceCount    = jQuery('#piece-count');
		this._trayIndicator = jQuery('#tray-indicator');
		
		this._container.css({'display':'block'});
	},
	
	drawTrayTabs: function()
	{
		var scope = this;
	
		for(var i=0; i<this._model.getTrays().length; i++) {
			this._trayTabs.append('<div id="tray-tab-' + i + '" class="tray-tab" data-id="' + i + '"><div class="tray-tab-btn">TRAY ' + (i+1) + '</div><div class="config-circle circle-x tray-empty-btn disabled" data-enabled="false" title="Click to empty tray"></div></div>');
		}
		this.updateTabButtons();
		this._pieceCount.addClass('multi-trays');
	},
	
	destroyTrayTabs: function()
	{
		jQuery('.tray-tab').remove();
		this._trayLabel.css({opacity:0});
	},
	
	show: function()
	{
		this._trayImg.animate({opacity:1});
		this._trayLabel.animate({opacity:1});
	},
	
	hide: function()
	{
		var scope = this;
	
		//this._container.animate({opacity:0}, 'fast', function(){
			jQuery('.tray-tab').remove();
			scope._pieceCount.html('');
			scope._pieceCount.removeClass('single-tray');
			scope._pieceCount.removeClass('multi-trays');
			scope._trayImg.html('');
			scope._trayImg.css('background', 'none');
			scope._container.css({opacity:1});
			scope._trayIndicator.addClass('hidden');
		//});
	},
	
	showAddToBasketButton: function()
	{
		var scope = this;

		if(this._addToBasketBtn != null) return;
		
		this._trayLabel.append('<div id="small-add-basket-btn" title="Click to add to your basket"></div>');
		this._addToBasketBtn = jQuery('#small-add-basket-btn');

		var left = this._trayLabel.width() + (this._model.isMultipleTrays() ? 18 : 10);
		 
		this._addToBasketBtn.css({left:left});
		this._addToBasketBtn.animate({opacity:1}, 'fast', function(){	
			scope._addToBasketBtn.click(function(){
				scope._controller.showBasket();
				//scope.hideAddToBasketButton();
			});
		});	
	},
	
	hideAddToBasketButton: function()
	{
		var scope = this;
		
		if(this._addToBasketBtn == null) return;

		this._addToBasketBtn.animate({opacity:0}, 'fast', function(){
			scope._addToBasketBtn.unbind('click');
			scope._addToBasketBtn.remove();
			scope._addToBasketBtn = null;
		});
	},
	
	showNextTrayBtn: function()
	{
		var scope = this;
		
		this._nextTrayBtnShown = true;
		
		this._nextTrayBtn.css({display:'block', opacity:0});
		this._nextTrayBtn.animate({opacity:1}, function(){
			scope.enableNextTrayBtn();
		});
	},
	
	hideNextTrayBtn: function()
	{
		this.disableNextTrayBtn();
		this._nextTrayBtn.animate({opacity:0}, function(){
			jQuery(this).css({display: 'none'});
		});
	},
	
	populateTray: function($idx)
	{
		var data = this._model.getCurTray().products;
		var grid = this._model.getCurTrayGrid();
		var trayImg;
		var enableClose = true;

		for(var i=0; i<data.length; i++) {
			if(data[i] == undefined) { 
				enableClose = false;
				continue;
			}
			var id = 'tray-' + this._model.getCurTrayIdx() + '-' + i;
			var top = grid[i].top;
			var left = grid[i].left;
			
			this._trayImg.append('<div id="' + id + '" class="candy-in-tray" title="' + data[i].name + '"></a>');
			trayImg = jQuery('#' + id)
			trayImg.css({'background':'url(' + data[i].trayImg + ')'});		
			trayImg.css({'top':top + 'px'});
			trayImg.css({'left':left + 'px'});	
			trayImg.css({opacity:1});
		}
		
		if(enableClose) {
			this.enableCloseBtn();
		}
	},
	
	updateTabButtons: function()
	{
		var scope = this;

		if(this._model.getCurStep() < this._model.TOTAL_STEPS) {
			jQuery('.tray-tab').each(function(){
				scope.disableTabBtn([jQuery(this)]);
			});
		} else {		
			if(this._model.isTrayFull(0) || this._nextTrayBtnShown) {
				jQuery('.tray-tab').each(function(){
					var idx = jQuery(this).attr('data-id');
					if(idx != scope._model.getCurTrayIdx()) {
						scope.enableTabBtn([jQuery(this)]);
					} else {	
						scope.disableTabBtn([jQuery(this)]);
					}
				});
			}
		}		
	},

	enableTabBtn:function($btn)
	{
		var scope = this;
		var labelBtn;
	
		for(var i=0; i<$btn.length; i++) {
			labelBtn = $btn[i].find('.tray-tab-btn');
			labelBtn.click(function() {
				scope._controller.switchTray(jQuery(this).closest('.tray-tab').attr('data-id'));
			});	
			labelBtn.css({cursor:'pointer'});
			labelBtn.css({color:'#34aba0'});
		}
	},
	
	disableTabBtn:function($btn)
	{
		var labelBtn;	
	
		for(var i=0; i<$btn.length; i++) {
			labelBtn = $btn[i].find('.tray-tab-btn');
			labelBtn.unbind('click');
			labelBtn.css('cursor', 'default');	
			
			if(this._model.isLastStep()) {
				labelBtn.css({color:'#333'});
			} else {
				labelBtn.css({color:'#34aba0'});
			}
		}
	},
	
	enableCloseBtn: function()
	{
		var scope = this;
		
		if(this._model.isMultipleTrays()) {
			if(this._model.getSelectionType() == "single") {
				for(var i=0; i<this._model.getTrays().length; i++) {
					var closeBtn = jQuery('.tray-tab:eq(' + i + ')').find('.tray-empty-btn');
					
					if(closeBtn.attr('data-enabled') == 'true') return;
			
					closeBtn.css({cursor:'pointer'});	
					closeBtn.removeClass('disabled');
					closeBtn.attr('data-enabled','true');
					
					closeBtn.click(function(){
						scope._controller.emptyTray(jQuery(this).closest('.tray-tab').attr('data-id'));
					});	
				}
			} else {
				var closeBtn = jQuery('.tray-tab:eq(' + this._model.getCurTrayIdx() + ')').find('.tray-empty-btn');
				
				if(closeBtn.attr('data-enabled') == 'true') return;
		
				closeBtn.css({cursor:'pointer'});	
				closeBtn.removeClass('disabled');
				closeBtn.attr('data-enabled','true');
				
				closeBtn.click(function(){
					scope._controller.emptyTray(jQuery(this).closest('.tray-tab').attr('data-id'));
				});	
			}
		} else {
			var closeBtn = this._pieceCount.find('.tray-empty-btn');
			
			if(closeBtn.attr('data-enabled') == 'true') return;
	
			closeBtn.css({cursor:'pointer'});	
			closeBtn.removeClass('disabled');
			closeBtn.attr('data-enabled','true');

			
			closeBtn.click(function(){
				scope._controller.emptyTray(0);
			});
		} 
	},
	
	disableCloseBtn: function($idx)
	{
		var scope = this;
		
		if(this._model.isMultipleTrays()) {
			var idx = $idx || this._model.getCurTrayIdx();
			var closeBtn = jQuery('.tray-tab:eq(' + idx + ')').find('.tray-empty-btn');
		} else {
			var closeBtn = this._pieceCount.find('.tray-empty-btn');
		} 

		if(closeBtn.attr('data-enabled') == 'false') return;
		
		closeBtn.unbind('click');
		closeBtn.css({cursor:'default'});
		closeBtn.addClass('disabled');
		closeBtn.attr('data-enabled','false');
		
		this._closeBtnEnabled = false;
	},
	
	enableNextTrayBtn: function()
	{
		var nextTray = this._model.getCurTrayIdx() == 0 ? 1 : 0;
		var scope = this;
		
		this._nextTrayBtn.css({cursor: 'pointer'});
		this._nextTrayBtn.click(function() {
			scope._controller.switchTray(nextTray);
		});
	},
	
	disableNextTrayBtn: function()
	{
		if(this._nextTrayBtn == null) return;
		this._nextTrayBtn.unbind('click');
		this._nextTrayBtn.css({cursor: 'default'});
	},
	
	updatePieceCount: function()
	{
		if(!this._model.isMultipleTrays()) {
			this._pieceCount.html('<div>' + this._model.getTotalPieces() + ' PIECES</div><div class="config-circle circle-x tray-empty-btn disabled single-tray" data-enabled="false" title="Click to empty tray"></div>');
			this._pieceCount.removeClass('multi-trays');
			this._pieceCount.addClass('single-tray');
		}  else {
			this._pieceCount.html(this._model.getTotalPieces() + ' PIECES');
			this._pieceCount.addClass('multi-trays');
			this._pieceCount.removeClass('single-tray');
		}
	},
	
	updateTrayIndicator: function()
	{
		if(this._model.isMultipleTrays()) {
			var activeTab = jQuery('.tray-tab:eq(' + this._model.getCurTrayIdx() + ')');
			var top = activeTab.offset().top + 30;
			var left = activeTab.offset().left + (activeTab.width() / 2);
			
			this._trayIndicator.offset({top:top, left:left})
			this._trayIndicator.removeClass('hidden');
		} else {
			var activeTab = this._pieceCount;
			var top = activeTab.offset().top + 30;
			var left = activeTab.offset().left + (activeTab.width() / 2);
			
			this._trayIndicator.offset({top:top, left:left})
			this._trayIndicator.removeClass('hidden');
		}
	},
	
	updateNextTrayBtn: function()
	{
		
	},
	
	onTotalPiecesSet: function($totalPieces)
	{
		var offset = 0;
		
		this.updatePieceCount();
		this.destroyTrayTabs();
		
		if(this._model.isMultipleTrays()) {
			this.drawTrayTabs();
			
			if(this._nextTrayBtn != null) {
				this.disableNextTrayBtn();
				this._nextTrayBtn.remove();
			}

			var w = 0;
			jQuery('.tray-tab').each(function(){
				w += jQuery(this).width();
			});
			var paddingLeft = (this._container.width() - (this._pieceCount.width() + w)) / 2;
			this._trayLabel.css({'padding-left':paddingLeft-10});
		} else {
			
			var w = this._pieceCount.width();
			var paddingLeft = (this._container.width() - (w)) / 2;
			this._trayLabel.css({'padding-left':paddingLeft-7});
		}
		
		this.updateTrayIndicator();	
	
		//if(this._curTraySize == $totalPieces || this._curTraySize == $totalPieces/2) {
		//	return;
		//}
		
		this._trayLabel.css('opacity', 0);
		this._trayImg.css('opacity', 0);
		this._trayImg.html('');
		
		switch($totalPieces) {
			case 4:	
				this._trayImg.append('<div class="tray-img-4"></div>');
				this._curTraySize = 4;
				break;
			case 9:
				this._trayImg.append('<div class="tray-img-9"></div>');
				this._curTraySize = 9;
				break;
			case 16: 
				this._trayImg.append('<div class="tray-img-16"></div>');
				this._curTraySize = 16;
				break;
			case 25:
			case 50: 
				this._trayImg.append('<div class="tray-img-25"></div>');
				this._curTraySize = 25;
				offset = 20;
				break;				
			case 32: 
				this._trayImg.append('<div class="tray-img-16"></div>');
				this._curTraySize = 16;
				break;
		}
		var tmpDiv = this._trayImg.find('div');
		var top = ((this._trayImg.height() - tmpDiv.height()) / 2) + offset;
		var left = (this._trayImg.width() - tmpDiv.width()) / 2; 
		
		tmpDiv.css({top:top, left:left});
		
		if(this._model.isMultipleTrays()) {
			this._container.append('<div id="next-tray-prompt"><div id="next-tray-label">TRAY 2</div><div id="next-tray-btn" class="config-circle circle-next-tray"></div><div id="tray-full-msg">TRAY 1<br/>IS FULL</div></div>');
			this._nextTrayBtn = jQuery('#next-tray-prompt');
			this._nextTrayBtn.css({display:'none'});
			
			var top = $totalPieces == 50 ? 138 : 108;
			this._nextTrayBtn.css({top:top});
		}
		
		this.onResize(jQuery(window).width(), jQuery(document).width());	
		//this.show();
	},
	
	onAddCandyToTrayMulti: function($sku, $trayImg, $top, $left, $id, $name)
	{
		var trayImg;
		var zIndex = 400 + parseInt($id.split('-')[2]);

		this._trayImg.append('<div id="' + $id + '" class="candy-in-tray" title="' + $name + '"></div>');
		
		trayImg = jQuery('#' + $id);
		trayImg.css({opacity:0});
		trayImg.css({'background':'url(' + $trayImg + ')', 'top':$top + 'px', 'left':$left + 'px', 'z-index':zIndex});
		trayImg.animate({opacity:1});
	},
	
	onAddCandyToTraySingle: function($sku, $trayImg, $trayGrid, $name)
	{
		var trayImg;
		
		for(var i=0; i<this._model.getCurTray().total;i++) {
			var id = 'tray-' + this._model.getCurTrayIdx() + '-' + i;
			var top = $trayGrid[i].top;
			var left = $trayGrid[i].left;
			
			this._trayImg.append('<div id="' + id + '" class="candy-in-tray" title="' + $name + '"></div>');
			
			trayImg = jQuery('#' + id);
			trayImg.css({opacity:0});
			trayImg.css({'background':'url(' + $trayImg + ')', 'top':top + 'px','left':left + 'px'});
			trayImg.animate({opacity:1});
		}
	},
	
	onRemoveCandyFromTrayMulti: function($id)
	{	
		jQuery('#' + $id).animate({opacity:0}, 'fast', function(){
			jQuery(this).remove();
		});
	},

	onRemoveCandyFromTraySingle: function($id)
	{	
		jQuery('.candy-in-tray').animate({opacity:0}, 'fast', function(){
			jQuery(this).remove();
		});
	},

	onSwitchTray: function($idx)
	{
		var scope = this;
		var left = $idx == 0 ? 50 : -50;
			
		this._trayImg.animate({left:left,opacity:0}, 'fast', function(){
			
			jQuery('.candy-in-tray').remove();
			scope.populateTray($idx);
			scope.updateTabButtons();
			
			scope._trayImg.css({left:left*-1, opacity:0});
			scope._trayImg.delay(250).animate({left:0, opacity:1});
		});
		
		if(this._model.isMultipleTrays()) {
			this.disableNextTrayBtn();
			this.hideNextTrayBtn();	
		}
		
		this.updateTrayIndicator();
	},
	
	onShowStep: function() 
	{
		this.updateTabButtons();
		
		if(this._model.getCurStep() == 1) {
			this.hide();
		} else if(this._model.getCurStep() == 2) {
			this.show();
		}
	},
	
	onTrayNotFull: function()
	{
		this.enableCloseBtn();
		this.hideAddToBasketButton();
	},
	
	onTrayFull: function()
	{
		if(this._model.isMultipleTrays() && !this._nextTrayBtnShown && this._model.getSelectionType() != 'single') {
			this.showNextTrayBtn();	
		}
		this.enableCloseBtn();
	},
	
	onEmptyTray: function($idx)
	{
		this.disableCloseBtn($idx);			

		if($idx == this._model.getCurTrayIdx() || this._model.getSelectionType() == 'single') {
			jQuery('.candy-in-tray').animate({opacity:0}, 'fast', function(){
				jQuery(this).remove();
			});
		}
	},

	onTrayEmpty: function()
	{
		var scope = this;
		if(this._model.getSelectionType() == 'single') {
			if(this._model.isMultipleTrays()) {
				var i = 0;
				 jQuery('.tray-tab').each(function() {
					jQuery(this).find('.tray-empty-btn');
					scope.disableCloseBtn(i);
					i++;
				 });
			} else {
				this.disableCloseBtn(0);
			}
		} else {
			this.disableCloseBtn(0);	
		}

		this.hideAddToBasketButton();
	},
	
	onRestart: function()
	{
		this._curTraySize = null;
		this._nextTrayBtnShown = false;
			
		if(this._nextTrayBtn != null) {
			this.disableNextTrayBtn();
			this._nextTrayBtn.remove();
		}
		
		this.hideAddToBasketButton();
		this.hide();	
	},
	
	onResize: function($winWidth, $docWidth)
	{
		if($winWidth >= this._model.MIN_WIDTH) {
			var left = (jQuery('#right-col').width() - this._container.width()) / 2; 
			this._container.css({left:left});
		} 
	},
		
	onMakeChangesToBasket: function()
	{
		this.showAddToBasketButton();
	},
});