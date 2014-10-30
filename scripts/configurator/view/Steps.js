var Steps = AbstractView.extend({
	
	_backBtn      :null,
	_nextBtn      :null,
	_startOverBtn :null,
	_stepOptions  :null,
	_stepNav      :null,
	_step1Dirty   :null,
	
	constructor: function($container, $model, $controller, $data)
	{
		var scope = this;
		
		this.inherit($container, $model, $controller, $data);
		
		jQuery('body').bind({
			'onShowStep':function($e){scope.onShowStep();},
		});
	},
		
	draw: function()
	{
		this._container.append('<div id="step-options"></div>');
		this._container.append('<div id="step-nav"></div>');
		
		this._stepOptions = jQuery('#step-options');
		this._stepNav     = jQuery('#step-nav');
		
		//draw step nav
		this._stepNav.append('<div id="config-back"       class="display-none config-btn config-btn-back" title="Click to see the previous step">BACK</div>');
		this._stepNav.append('<div id="config-next"       class="display-none config-btn config-btn-next" title="Click to see the next step">NEXT</div>');
		this._stepNav.append('<div id="config-start-over" class="display-none" title="Click to start over">start over</div>');
		
		this._backBtn      = jQuery('#config-back');
		this._nextBtn      = jQuery('#config-next');
		this._startOverBtn = jQuery('#config-start-over');	
		
		this.setupButtons();
	},
	
	drawStep1: function()
	{
		this._stepOptions.html('');
		this._step1Dirty = false;
			
		var data = this._model.STEP_1_DATA;
		var str =  '<div id="step-1" class="step">';
		str +=       '<div class="step-title">1.' + data.title + '</div>';
        str +=       '<div>';
        /*str +=         '<ul class="config-options">';
		
		for(var i=0; i<data.options.length; i++) {
			var active = data.options[i].value == this._model.getTotalPieces() ? ' class="active"' : '';
			str += '<li data-option-value="' + data.options[i].value + '"' + active + '>' + data.options[i].label + '</li>';
		}
		
        str +=         '</ul>';*/
		
		for(var i=0; i<data.options.length; i++) {
			var active = data.options[i].value == this._model.getTotalPieces() ? ' active' : '';
			if(data.options[i].value == 32) {
				str += '<div class="box-size-option box-size-' + data.options[i].value + '"  data-pieces="' + data.options[i].value +'"> <div class="box-size-radio box-size-radio-' + data.options[i].value + active + '">' + data.options[i].value + ' pieces<br/><span>(2-16 piece trays)</span></div></div>';	
			} else if(data.options[i].value == 50) {
				str += '<div class="box-size-option box-size-' + data.options[i].value + '"  data-pieces="' + data.options[i].value +'"> <div class="box-size-radio box-size-radio-' + data.options[i].value + active + '">' + data.options[i].value + ' pieces<br/><span>(2-25 piece trays)</span></div></div>';
			} else {
				str += '<div class="box-size-option box-size-' + data.options[i].value + '"  data-pieces="' + data.options[i].value +'"> <div class="box-size-radio box-size-radio-' + data.options[i].value + active + '">' + data.options[i].value + ' pieces</div></div>';
			}
		}		

        str +=       '</div>';
		str +=    '</div>';
		
		this._stepOptions.append(str);
		this.enableOptionButtons();
		
		this._backBtn.addClass('display-none');
		this._nextBtn.removeClass('display-none');
		this._nextBtn.addClass('disabled');
		this._startOverBtn.addClass('display-none');
	},
	
	drawStep2: function()
	{
		this._stepOptions.html('');
		
		var data = this._model.STEP_2_DATA;
		var str =  '<div id="step-2" class="step">';
		str +=       '<div class="step-title">2.' + data.title + '</div>';
        str +=       '<div>';
        str +=         '<ul class="config-options">';
		
		for(var i=0; i<data.options.length; i++) {
			var active = data.options[i].value == this._model.getSelectionType() ? ' class="active"' : '';
			str += '<li data-option-value="' + data.options[i].value + '"' + active + '>' + data.options[i].label + '</li>';
		}
		
        str +=         '</ul>';
        str +=       '</div>';
		str +=    '</div>';
		
		this._stepOptions.append(str);
		this.enableOptionButtons();
	},
	
	drawStep3: function()
	{
		this._stepOptions.html('');
		
		var data = this._model.STEP_3_DATA;
		var str =  '<div id="step-3" class="step">';
		str +=       '<div class="step-title">3.' + data.title + '</div>';
        str +=       '<div>';
		str +=         '<div class="step-3-instructions">Scroll through all the Truffles<br/>and Classics.</div>';
		str +=         '<div class="config-circle circle-add dark flt-left">&nbsp;</div><div class="step-3-label flt-left">Add piece to tray</div><div class="clear"></div></div>';		
		str +=         '<div class="config-circle circle-remove dark flt-left">&nbsp;</div><div class="step-3-label flt-left">Remove piece from tray</div><div class="clear"></div></div>';				
        str +=       '</div>';
		str +=    '</div>';
		
		this._stepOptions.append(str);
	},
	
	setupButtons: function()
	{
		var scope   = this;

		this._backBtn.click(function(e){
			if(scope._model.getCurStep() > 1) {
				scope._controller.setCurStep(-1);
			}
		});
		this._nextBtn.click(function(e){
			if((scope._model.getCurStep() == 1 && (scope._model.getTotalPieces() == 0)) || (scope._model.getCurStep() == 2 && scope._model.getSelectionType() == '')) return;
			if(scope._model.getCurStep() < scope._model.TOTAL_STEPS) {
				scope._controller.setCurStep(1);
			}
		});
		this._startOverBtn.click(function(e){
			scope._controller.showPrompt('startOver');
		});		
	},
	
	enableOptionButtons: function()
	{
		var scope = this;
		var option;
		
		if(scope._model.getCurStep() == 1) {
			jQuery('.box-size-option').click(function(e){
				option = jQuery(this).find('.box-size-radio');
				if(option.hasClass('active')) return;
				
				option.addClass('active');
				jQuery(this).siblings().each(function(){
					jQuery(this).find('.box-size-radio').removeClass('active');	
				});
				scope._controller.setTotalPieces(parseInt(jQuery(this).attr('data-pieces')));
				scope.updateButtons();
				scope._step1Dirty = true;
			});
		}
		
		jQuery('.config-options li').click(function(e){
			option = jQuery(this);
			if(option.hasClass('active')) return;
			
			option.toggleClass('active');
			jQuery(this).siblings().each(function(){
				jQuery(this).removeClass('active');	
			});
			
			var optionVal = jQuery(this).attr('data-option-value');
			switch(scope._model.getCurStep()) {
				case 1:
					scope._controller.setTotalPieces(parseInt(optionVal));
					break
				case 2:
					scope._controller.setSelectionType(optionVal);
					break;
			}
			scope.updateButtons();
		});		
	},
	
	updateButtons: function()
	{
		if(this._model.getCurStep() == 1) {
			this._backBtn.addClass('display-none');
			this._nextBtn.removeClass('display-none');
			this._startOverBtn.css('display','none');
			
			if(this._model.getTotalPieces() == 0) {
				this._nextBtn.addClass('disabled');
			} else {
				this._nextBtn.removeClass('disabled');
			}
			this._nextBtn.addClass('step-1');
		} else if(this._model.getCurStep() == 2) {
			this._backBtn.removeClass('display-none');
			this._backBtn.removeClass('disabled');
			
			if(this._model.getSelectionType() == '') {
				this._nextBtn.addClass('disabled');	
			} else {
				this._nextBtn.removeClass('disabled');	
			}
			this._nextBtn.removeClass('step-1');
		} else {
			this.hideNextButton();
			this.hideBackButton();
			this.showStartOverButton();	
			this._nextBtn.removeClass('step-1');
		}
	},
	
	hideNextButton: function()
	{
		this._nextBtn.addClass('display-none');	
	},	
	
	hideBackButton: function()
	{
		this._backBtn.addClass('display-none');	
	},		
	
	showStartOverButton: function()
	{
		this._startOverBtn.removeClass('display-none');
		this._startOverBtn.css('display','inline-block');
	},
	
	onShowStep: function()
	{
		switch(this._model.getCurStep()) {
			case 1:
				this.drawStep1();
				break;
			case 2:			
				this.drawStep2();
				this._container.css('width', 'auto');
				
				if(!this._step1Dirty) {
					console.log('pieces: ' + this._model.getTotalPieces());
					this._controller.setTotalPieces(this._model.getTotalPieces());
				}
				
				break;
			case 3:
				jQuery('body').trigger('onEnableButtons');
				this.drawStep3();
				this._container.css('width', 'auto');
				break;	
		}
		this.updateButtons();
	},		
	
	onResize: function($winWidth, $docWidth)
	{
		//console.log($winWidth + ' :: ' + this._model.MAX_WIDTH);
		if($winWidth < this._model.MAX_WIDTH) {
			jQuery('.box-size-4').css('left',  -19);
			jQuery('.box-size-9').css('left',   62);
			jQuery('.box-size-16').css('left', 159);
			jQuery('.box-size-25').css('left', 268);
			jQuery('.box-size-32').css('left', 424);
			jQuery('.box-size-50').css('left', 554);						
		} else {
			jQuery('.box-size-9').css('left',  107);
			jQuery('.box-size-16').css('left', 246);
			jQuery('.box-size-25').css('left', 416);
			jQuery('.box-size-32').css('left', 610);
			jQuery('.box-size-50').css('left', 774);	
		}
	},
});