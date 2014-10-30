var CandySelector = AbstractView.extend({
	
	_tabs              :null,
	_window            :null,
	_navNext           :null,
	_navBack           :null,
	_selectionsDivider :null,
	_categoryWindow    :null,
	_scrollAmt         :null,
	_noProductsMsg     :null,
	_prodWidth         :null,
	_itemsVisible      :0,
	_numPages          :0,
	_curPage           :1,
	_blocker           :null,
	_scrollerWidth     :0,
	_totalCount        :0,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onShowStep'     :function($e){scope.onShowStep();},
			'onLoadCategory' :function($e, $idx){scope.onLoadCategory($idx);},
			'onSetFilter'    :function($e, $filter){scope.onSetFilter($filter);}
		});
	
	},
	
	init: function()
	{
		this.inherit();
	},
		
	draw: function()
	{
		this.drawTabs();
		this.drawSelections();
		this.drawNav();
		this.drawDescription();
		this.drawBlocker();
	},
	
	drawTabs: function()
	{
		var scope = this;
		var newX = 40;
		var tmpTab;
		
		this._container.append('<div id="tabs"></div>');
		this._tabs = jQuery('#tabs');
	
		for(var i=0; i<this._data.length; i++) {
			var id = 'tab-' + i ;
			
			if(i == 0) {
				this._tabs.append('<div id="' + id + '" class="tab active">' + this._data[i].name + '</div>');
			} else {
				this._tabs.append('<div id="' + id + '" class="tab">' + this._data[i].name + '</div>');
			}
			tmpTab = jQuery('#' + id);
			newX += tmpTab.width();
		}
		this._tabs.append('<div class="clear"></div>');
		jQuery('.tab').css({cursor:'pointer'});
	},
	
	drawSelections: function()
	{
		var newX         = 0;
		var newY         = 20;
		var products     = this._model.getProducts(this._model.getCurTab());
		var count        = 0;
		var curFilter    = this._model.getCurFilter();
		var curRow       = 1;
		var startX		 = 0;
		var numRows      = 1;
			
		this._container.append('<div id="window"></div>');
		this._window = jQuery('#window');
		this._window.html('');
		this._window.append('<div class="category-window"></div>');
		this._categoryWindow = jQuery('.category-window');
		this._numPages = 1;
		this._curPage = 1;
		this._itemsVisible = jQuery('#configurator').width() == this._model.MIN_WIDTH ? 4 : 5;
		this._totalCount = 0;
		
		
		for(var i=0; i<products.length; i++) {
			if(curFilter == 'all' || 
			  (curFilter == 'milk_chocolate' && products[i].milk_chocolate == '1' && products[i].dark_chocolate == '0' && products[i].nut_only == '0') ||
			  (curFilter == 'dark_chocolate' && products[i].dark_chocolate == '1' && products[i].milk_chocolate == '0' && products[i].nut_only == '0') ||
			  (curFilter == 'nut_only'       && products[i].nut_only == '1'       && products[i].dark_chocolate == '0' && products[i].milk_chocolate == '0')
			){ 
				var tmpProdId = 'category-product-' + this._totalCount;
				this._categoryWindow.append('<div id="' + tmpProdId + '" class="candy"></div>');
				new Candy(jQuery('#' + tmpProdId), this._model, this._controller, products[i], newX, newY, this._model.getPiecesAddedBySku(products[i].sku));
				/*if(count == itemsVisible - 1) {
					count = 0;
					if(curRow == 1) {
						newX = startX;
						newY += jQuery('#' + tmpProdId).height() + 20;
						curRow = 2;
						numRows = 2;
					} else {
						newX += jQuery('#' + tmpProdId).width();
						startX = newX;
						newY = 20;
						curRow = 1;
						this._overflow = true;
						countCols = true;
					}	
				} else {
					newX += jQuery('#' + tmpProdId).width();
					count++;
				}*/
				
				if(curRow == 1) {
					curRow = 2;
					newY = jQuery('#' + tmpProdId).height() + 40;
				} else {
					curRow = 1;
					newX += jQuery('#' + tmpProdId).width();
					newY = 20;	
					count++;
					numRows = 2;					
					//if(countCols && curRow == 1) this._extraCols++;
					this._prodWidth = jQuery('#' + tmpProdId).width();
				}
				
				this._totalCount++;			
			}
			
		}
				
		if(this._totalCount == 0) {
			this._window.css({width:'100%'});
			this._window.append('<div class="no-products-msg">We\'re sorry but there are no products to display</div>');
			
			this._noProductsMsg = jQuery('.no-products-msg');
			var left = (this._window.width() - this._noProductsMsg.width()) / 2;
			this._noProductsMsg.css({left:left, opacity:0});
			this._noProductsMsg.animate({opacity:1}, 'fast');
		} else {
			this._scrollerWidth = parseInt(jQuery('#' + tmpProdId).css('left').split('px')[0]) + jQuery('#' + tmpProdId).width();
			this._categoryWindow.append('<div class="clearfix"></div>');
			
			this._numPages = Math.floor(this._totalCount / (this._itemsVisible * 2));
			
			if(this._totalCount % (this._itemsVisible * 2) != 0) {
				this._numPages++;	
			}			
			
			this._window.width((jQuery('#' + tmpProdId).width() * this._itemsVisible) -1 );
			this._window.css({left:(this._container.width() - this._window.width()) / 2});
			this._categoryWindow.css({left:-1});
			
			if(this._numPages > 1){		
				this._scrollAmt = jQuery('#' + tmpProdId).width();
			}
			
			if(numRows == 2) {
				this._window.append('<div id="selections-divider"></div>');
				this._selectionsDivider = jQuery('#selections-divider');
				this._selectionsDivider.width(this._window.width());
			}
			
			//remove the border on the last two candies
			jQuery('#category-product-' + (this._totalCount - 1)).css({'border':'none'});
			jQuery('#category-product-' + (this._totalCount - 2)).css({'border':'none'});
		}
		this._window.animate({opacity:1}, 'slow');
	},
	
	drawNav: function() 
	{
		this._container.append('<div id="nav-next" class="candy-selector-nav"><div id="nav-next-label">MORE</div></div><div id="nav-back" class="candy-selector-nav"></div>');
		
		this._navNext = jQuery('#nav-next');
		this._navBack = jQuery('#nav-back');
		this._navNext.css({left:this._container.width() - this._navNext.width()});
		
		this.updateNav();
	},
	
	drawBlocker: function()
	{
		this._container.append('<div id="blocker"></div>');
		this._blocker = jQuery('#candy-selector #blocker');
	},
	
	drawDescription: function()
	{
		this._container.append('<div id="candy-descriptions">Difference between a <a href="javascript:void(0);" class="tooltip" data-tooltip="Truffles are made with premium chocolate, fresh dairy butter and heavy whipping cream that are combined together to form a ganache. The ganache is enhanced with only natural flavors. Truffles can be round, square or in a special shape.">Truffle</a> and a <a href="javascript:void(0);" class="tooltip" data-tooltip="Classics are shell molded with premium chocolate in beautiful Belgium and Italian molds. The fillings are inspired by classic candies and flavors such as peanut butter, toffee, brandied cherries, caramels, orange, almond and ginger. Some are crunchy and some are smooth.">Classic</a>?</div>');
	},
	
	showBlocker: function()
	{
		this._blocker.css({display:'block', opacity:.8});
	},
	
	hideBlocker: function()
	{
		this._blocker.animate({opacity:0}, function(){
			jQuery(this).css({display:'none'});	
		});
	},
	
	enableTabs: function()
	{
		var scope = this;
		
		jQuery('.tab').click(function($e){
			var idx = jQuery(this).index();
			
			if(scope._model.getCurTab() == idx) return;
			
			scope._controller.loadCategory($e, idx);
			
			jQuery('.tab').each(function(){
				if(jQuery(this).index() == idx) {
					jQuery(this).addClass('active');	
					jQuery(this).css({cursor:'default'});
					jQuery(this).attr('title', '');
				} else {
					jQuery(this).removeClass('active');	
					jQuery(this).css({cursor:'pointer'});
					jQuery(this).attr('title', 'Click to view ' + scope._model.getCategories()[jQuery(this).index()].name);
				}
			});
		});	
		
		jQuery('.tab').each(function(){
			if(jQuery(this).index() == scope._model.getCurTab()) {
				jQuery(this).addClass('active');	
				jQuery(this).css({cursor:'default'});
			} else {
				jQuery(this).removeClass('active');	
				jQuery(this).css({cursor:'pointer'});
			}
		});
		
	},
	
	disableTabs: function()
	{
		jQuery('.tab').unbind('click');
		jQuery('.tab').css({cursor:'default'});
	},	
	
	updateNav: function()
	{
		if(this._numPages > 1) {
			this.showNavBtn(this._navNext);	
			this.showNavBtn(this._navBack);
			
			if(this._curPage >= this._numPages) {
				console.log('disable next');
				this.enableNavBackBtn();
				this.disableNavNextBtn();	
			} else if(this._curPage == 1) {
				this.disableNavBackBtn();
				this.enableNavNextBtn();
			} else {
				this.enableNavBackBtn();
				this.enableNavNextBtn();
			}
		} else {
			this.hideNavBtn(this._navNext);	
			this.hideNavBtn(this._navBack);
		}
	},
	
	enableNavNextBtn: function()
	{
		var scope = this;
		
		if(this._navNext.attr('data-enabled') == 'true') return;
			
		this._navNext.click(function(){
			scope.scrollWindow(jQuery(this));	
		});
		/*this._navNext.mouseover(function(){
			var background = jQuery(this).css('backgroundPosition').split(" ");
			jQuery(this).css({'backgroundPosition':background[0] + ' -104px'});
			jQuery('#nav-next-label').addClass('hover');
		});
		this._navNext.mouseout(function(){
			var background = jQuery(this).css('backgroundPosition').split(" ");
			jQuery(this).css({'backgroundPosition':background[0] + ' -74px'});
			jQuery('#nav-next-label').removeClass('hover');
		});*/
		var background = this._navNext.css('backgroundPosition').split(" ");
		this._navNext.css({cursor:'pointer','backgroundPosition':background[0] + ' -74px'});
		this._navNext.attr('data-enabled','true');
		
		jQuery('#nav-next-label').removeClass('hover');
		jQuery('#nav-next-label').removeClass('display-none');
	},
	
	disableNavNextBtn: function()
	{
		if(this._navNext.attr('data-enabled') == 'false') return;
		
		var background = this._navNext.css('backgroundPosition').split(" ");
			
		this._navNext.unbind('click');
		this._navNext.unbind('mouseover');
		this._navNext.unbind('mouseout');
		this._navNext.attr('data-enabled','false');
		this._navNext.css({cursor:'default','backgroundPosition':background[0] + ' -104px'});
		
		jQuery('#nav-next-label').addClass('display-none');
		jQuery('#nav-next-label').addClass('hover');
	},
	
	enableNavBackBtn: function()
	{
		if(this._navBack.attr('data-enabled') == 'true') return;
		
		var scope = this;
		
		this._navBack.click(function(){
			scope.scrollWindow(jQuery(this));	
		});
		/*this._navBack.mouseover(function(){
			var background = jQuery(this).css('backgroundPosition').split(" ");
			jQuery(this).css({'backgroundPosition':background[0] + ' -343px'});
		});
		this._navBack.mouseout(function(){
			var background = jQuery(this).css('backgroundPosition').split(" ");
			jQuery(this).css({'backgroundPosition':background[0] + ' -313px'});
		});*/
		var background = this._navNext.css('backgroundPosition').split(" ");
		this._navBack.css({cursor:'pointer','backgroundPosition':background[0] + ' -313px'});
		this._navBack.attr('data-enabled','true');
	},
	
	disableNavBackBtn: function()
	{
		if(this._navBack.attr('data-enabled') == 'false') return;
		
		var background = this._navNext.css('backgroundPosition').split(" ");
		
		this._navBack.unbind('click');
		this._navBack.unbind('mouseover');
		this._navBack.unbind('mouseout');
		this._navBack.css({'cursor':'default'});
		this._navBack.css({cursor:'default','backgroundPosition':background[0] + ' -343px'});
		this._navBack.attr('data-enabled','false');
	},

	showNavBtn: function($btn)
	{
		$btn.css({display:'block'});
	},
	
	hideNavBtn: function($btn)
	{
		$btn.css({display:'none'});
	},
	
	scrollWindow: function($source)
	{
		this._curPage += ($source.attr('id') == this._navNext.attr('id') ? 1 : -1);
		
		var direction = $source.attr('id') == this._navNext.attr('id') ? 'next' : 'back';
		
		if(direction == 'next') {
			if(this._curPage == this._numPages) {
				var left = this._window.width() - this._scrollerWidth;	
				
			} else {
				var amt = direction == 'next' ? -this._scrollAmt : this._scrollAmt;		
				var left = (this._categoryWindow.position().left) + (this._itemsVisible * amt);	
			}
		} else {
			if(this._curPage == 1) {
				var left = -1;		
			} else {
				
				var amt = direction == 'next' ? -this._scrollAmt : this._scrollAmt;		
				var left = (this._categoryWindow.position().left) + (this._itemsVisible * amt);	
			}
		}
		
		this._categoryWindow.animate({left:left});
		this.updateNav();
	},
	
	onShowStep: function()
	{
		if(this._model.isLastStep()) {
			this.enableTabs();
			if(this._numPages > 1) {
				this.showNavBtn(this._navNext);
				this.showNavBtn(this._navBack);	
			}
			this.hideBlocker();
		} else {
			this.disableTabs();	
			this.hideNavBtn(this._navNext);
			this.hideNavBtn(this._navBack);	
			this.showBlocker();
		}
	},
	
	onLoadCategory: function($idx)
	{
		this._extraCols = 0;
		this._curCol = 0;
		this._curPage = 1;
		this._numPages = 0;
		this._window.remove();
		this.drawSelections();
		this.updateNav();
	},
	
	onSetFilter: function()
	{
		this._extraCols = 0;
		this._curCol = 0;
		this._curPage = 1;
		this._numPages = 0;
		this._window.remove();
		this.drawSelections();
		this.updateNav();
	},
	
	onResize: function($winWidth, $docWidth) 
	{
		if($winWidth < this._model.MAX_WIDTH) {
			this._itemsVisible = 4;
			this._container.width(this._model.MIN_WIDTH);
			this._window.width((this._prodWidth * this._itemsVisible) -1 );
			this._window.css({left:(this._container.width() - this._window.width()) / 2});
			this._categoryWindow.css({left:-1});
			
			if(this._totalCount > 0) {
				this._numPages = Math.floor(this._totalCount / (this._itemsVisible * 2));
				
				if(this._totalCount % (this._itemsVisible * 2) != 0) {
					this._numPages++;	
				}				
				if(this._numPages > 1){		
					this._scrollAmt = this._prodWidth;
				}
			
				this._window.append('<div id="selections-divider"></div>');
				this._selectionsDivider = jQuery('#selections-divider');
				this._selectionsDivider.width(this._window.width());
				this._navNext.css({left:this._model.MIN_WIDTH - this._navNext.width()});
			}
		} else {
			this._itemsVisible = 5;
			this._container.width(this._model.MAX_WIDTH);
			this._window.width((this._prodWidth * this._itemsVisible) -1 );
			this._window.css({left:(this._container.width() - this._window.width()) / 2});
			this._categoryWindow.css({left:-1});
			
			if(this._totalCount > 0) {
				this._numPages = Math.floor(this._totalCount / (this._itemsVisible * 2));
				
				if(this._totalCount % (this._itemsVisible * 2) != 0) {
					this._numPages++;	
				}				
				if(this._numPages > 1){		
					this._scrollAmt = this._prodWidth;
				}
		
				this._window.append('<div id="selections-divider"></div>');
				this._selectionsDivider = jQuery('#selections-divider');
				this._selectionsDivider.width(this._window.width());
				this._navNext.css({left:this._container.width() - this._navNext.width()});
			}
		}
		
		this._curPage = 1;
		this.updateNav();
	},
});