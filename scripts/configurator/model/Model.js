var Model = Base.extend({
	MAX_WIDTH         :960,
	MIN_WIDTH         :760,
	MAX_LEFT_COL_WIDTH:700,
	TOTAL_STEPS       :3,
	PIECES_PER_ROW    :5,
	TRAY_GRID_4       :[
						{top: 64,left:202},
						{top: 90,left:147},
						
						{top: 90,left:255},
						{top:118,left:200}
					   ],
	TRAY_GRID_9       :[
						{top: 35,left:200},
						{top: 61,left:145},
						{top: 89,left: 90},
						
						{top: 61,left:254},
						{top: 89,left:200},
						{top:115,left:145},
						
						{top: 89,left:310},
						{top:115,left:254},
						{top:143,left:200}
						],
	TRAY_GRID_16      :[
						{top: 17,left:202},
						{top: 40,left:155},
						{top: 64,left:110},
						{top: 86,left: 62},
						
						{top: 40,left:248},
						{top: 64,left:202},
						{top: 86,left:155},
						{top:109,left:110},
						
						{top: 64,left:296},
						{top: 86,left:248},
						{top:109,left:202},
						{top:132,left:155},
						
						{top: 86,left:343},
						{top:109,left:296},
						{top:132,left:248},
						{top:155,left:202}
						],
	TRAY_GRID_25      :[
						{top: 17,left:204},
						{top: 40,left:156},
						{top: 63,left:110},
						{top: 85,left: 62},
						{top:108,left: 15},
						
						{top: 40,left:250},
						{top: 63,left:204},
						{top: 85,left:156},
						{top:108,left:110},
						{top:131,left:62},
						
						{top: 63,left:297},
						{top: 85,left:250},
						{top:108,left:204},
						{top:131,left:156},
						{top:155,left:110},
						
						{top: 85,left:341},
						{top:108,left:297},
						{top:131,left:250},
						{top:155,left:204},
						{top:177,left:156},
						
						{top:108,left:387},
						{top:131,left:341},
						{top:155,left:297},
						{top:177,left:250},
						{top:201,left:204}
						],
	BREADCRUMB        :['quantity', 'variety', 'selections'],
	STEP_1_DATA       :{
		'title':'Choose size',
		'options':[
			{'label':'4 pieces',                      'value': 4},
			{'label':'9 pieces',                      'value': 9},
			{'label':'16 pieces',                     'value':16},
			{'label':'25 pieces',                     'value':25},
			{'label':'32 pieces (two 16-piece trays)','value':32},
			{'label':'50 pieces (two 25-piece trays)','value':50},						
		]
	},
	STEP_2_DATA       :{
		'title':'Choose flavors',
		'options':[
			{'label':'All the same flavor','value':'single'},
			{'label':'I will make selections','value':'custom'}						
		]
	},	
	STEP_3_DATA       :{
		'title':'Choose chocolates'
	},
	
	FOUR_PIECE_SKU        :{sku: '51-072', id:247},
	NINE_PIECE_SKU        :{sku: '51-073', id:325},
	SIXTEEN_PIECE_SKU     :{sku: '51-078', id:404},
	TWENTY_FIVE_PIECE_SKU :{sku: '51-075', id:338},
	THIRTY_TWO_PIECE_SKU  :{sku: '51-076', id:344},
	FIFTY_PIECE_SKU       :{sku: '51-077', id:345},

	_curFilter       :'all',
	_curTab	         :0,
	_data            :null,
	_curStep         :1,
	_trays           :null,
	_curTray         :0,
	_selectionType   :'',
	_totalPieces     :0,
	_curTrayGrid     :[],
	_trayToBeEmptied :null,
	_configPath      :'',
	_curProductSKU   :'',
	
	constructor: function($data, $path)
	{
		this._data = $data;
		this._configPath = $path;

		/*for (var item in this._data.selection_ids) {
		console.log('---------------------------------------');
		console.log(item);
		console.log('---------------------------------------');			
			for (var item2 in this._data.selection_ids[item]) {
				console.log(item2);	
			}
		console.log('---------------------------------------');
		}*/
	},
	
	restart: function()
	{
		this._totalPieces   = 0;
		this._selectionType = '';
		this._curStep       = 1;
		this._piecesAdded   = 0;
		this._trays         = [];
		this._curTray       = 0;
	},
	setCurFilter: function($filter)
	{
		this._curFilter = $filter;	
	},
	
	getCategories: function()
	{
		return this._data.categories;	
	},
	
	getCurTab: function()
	{
		return this._curTab;	
	},
		
	getBreadcrumb: function()
	{
		return this._breadcrumb;	
	},
	
	getCurFilter: function()
	{
		return this._curFilter;	
	},
	setCurTab: function($idx)
	{
		this._curTab = $idx;	
	},
	
	getProducts: function($idx)
	{
		return this._data.categories[$idx].products;
	},
	
	getTotalPieces: function()
	{
		return this._totalPieces;
	},
	setTotalPieces: function($totalPieces)
	{
		this._totalPieces = $totalPieces;
		this._trays = null;
		
		if(this._totalPieces == 32 || this._totalPieces == 50) {
			this._trays = [
			{
				'price':0,
				'total':this._totalPieces/2,
				'products':[]
			},
			{
				'price':0,
				'total':this._totalPieces/2,
				'products':[]
			}];	
		} else {
			this._trays = [
			{
				'price':0,
				'total':this._totalPieces,
				'products':[]
			}];
		}
		
		for(var i=0; i<this._trays.length; i++) {
			var tray = this._trays[i];
			for(var j=0; j<tray.total; j++) {
				tray.products.push(undefined);
			}
		}
		
		switch(this._totalPieces) {
			case 4:	
				this._curTrayGrid = this.TRAY_GRID_4.slice();
				this._curProductSKU = this.FOUR_PIECE_SKU;
				break;
			case 9:
				this._curTrayGrid = this.TRAY_GRID_9.slice();
				this._curProductSKU = this.NINE_PIECE_SKU;
				break;
			case 16: 
				this._curTrayGrid = this.TRAY_GRID_16.slice();
				this._curProductSKU = this.SIXTEEN_PIECE_SKU;
				break;
			case 25:
				this._curTrayGrid = this.TRAY_GRID_25.slice();
				this._curProductSKU = this.TWENTY_FIVE_PIECE_SKU;
				break;
			case 50: 
				this._curTrayGrid = this.TRAY_GRID_25.slice();
				this._curProductSKU = this.FIFTY_PIECE_SKU;
				break;				
			case 32: 
				this._curTrayGrid = this.TRAY_GRID_16.slice();
				this._curProductSKU = this.THIRTY_TWO_PIECE_SKU;
				break;
		}
		
		/*console.log('Product SKU = ' + this._curProductSKU) 
		console.log('---------------------------------------');	
		for(var item in this._data.selection_ids[this._curProductSKU.sku]) {
			console.log("selectionID: " + item);
			console.log('--------');	 
			
			for(var item2 in this._data.selection_ids[this._curProductSKU.sku][item]) {
				console.log('SKU: ' + item2 + ' = ' + this._data.selection_ids[this._curProductSKU.sku][item][item2]);	
				
				for(var item3 in this._data.selection_ids[this._curProductSKU.sku][item][item2]) {
					console.log(item3 + " :: " + this._data.selection_ids[this._curProductSKU.sku][item][item2][item3]);
					console.log('-----'); 
				}
			}
			
			console.log('\n\n');
		}*/
	},

	getTrays: function()
	{
		return this._trays;	
	},
	
	getCurTrayIdx: function()
	{
		return this._curTray;
	},

	getCurTray: function()
	{
		return this._trays[this._curTray];
	},
	setCurTray: function($idx)
	{
		this._curTray = $idx;	
	},
	
	getPiecesInTray: function($idx)
	{
		if($idx != undefined) {
			this._trays[$idx].products.length;
		} else {
			this._trays[this._curTray].products.length;				
		}
	},
	
	getPiecesAddedBySku: function($sku) {
		var cnt = 0;
		
		if(this._trays != null) {
			if(this._selectionType == 'single') {
				for(var j=0; j<this._trays.length;j++) {
					for(var i=0; i<this._trays[j].products.length; i++) {
						if(this._trays[j].products[i] == undefined) continue; 
						if(this._trays[j].products[i].sku == $sku) {
							cnt++;	
						}
					}
				}
			} else {
				for(var j=0; j<this._trays[this._curTray].products.length;j++) {
					if(this._trays[this._curTray].products[j] == undefined) continue; 
					if(this._trays[this._curTray].products[j].sku == $sku) {
						cnt++;	
					}
				}
			}
		}
		return cnt;
	},
	
	getCurStep: function()
	{
		return this._curStep;	
	},
	setCurStep: function($step)
	{
		this._curStep += $step;	
	},
	
	getSelectionType: function()
	{
		return this._selectionType;
	},
	setSelectionType: function($type)
	{
		this._selectionType = $type;
	},
	
	getCurTrayTotal: function()
	{
		return this._trays[this._curTray].total;
	},
	
	getCurProductSelectionIDs: function()
	{
		return this._data.selection_ids[this._curProductSKU.sku];
	},
	
	getCurProductID: function()
	{
		return this._curProductSKU.id;
	},
	
	getEmptyTraySlot: function()
	{
		var emptySlot = 0;
		
		if(!this.isTrayEmpty()) {
			for(var i=0; i<this._trays[this._curTray].products.length;i++) {
				if(this._trays[this._curTray].products[i] == undefined) {
					break;	
				}
			}
			emptySlot = i;
		}
		
		return emptySlot;
	},
	
	getTrayGridCoords: function($idx)
	{
		return this._curTrayGrid[$idx];
	},
	
	getCurTrayGrid: function()
	{
		return this._curTrayGrid;
	},
	
	setTrayToBeEmptied: function($idx)
	{
		this._trayToBeEmptied = $idx;
	},
	
	getTrayToBeEmptied: function()
	{
		return this._trayToBeEmptied;
	},
	
	getConfigPath: function()
	{
		return this._configPath;
	},
	
	addCandyToTraySingle: function($sku, $price, $trayImg, $name, $prodID)
	{	
		for(var j=0; j<this._trays.length; j++) {
			for(var i=0; i<this._trays[j].total; i++) {
				this._trays[j].products[i] = {'sku':$sku, 'price':$price, 'trayID':$sku + '-' + j + '-' + i, 'trayImg':$trayImg, 'name':$name, 'id':$prodID};
			}
		}
	},
	
	addCandyToTrayMulti: function($sku, $price, $emptySlot, $trayID, $trayImg, $name, $prodID)
	{			
		this._trays[this._curTray].products[$emptySlot] = {'sku':$sku, 'price':$price, 'id':$prodID, 'trayImg':$trayImg, 'name':$name, 'trayID':$trayID};	
	},
	
	removeCandyFromTraySingle: function()
	{
		for(var i=0; i<this._trays.length; i++) {
			for(var j=0; j<this._trays[i].products.length; j++) {
				this._trays[i].products[j] = undefined;
			}
		}
	},
	
	removeCandyFromTrayMulti: function($sku)
	{
		var candyToRemove;
		
		for(var i=this._trays[this._curTray].products.length-1; i>=0;i--) {
			if(this._trays[this._curTray].products[i] == undefined) continue; 
			if(this._trays[this._curTray].products[i].sku == $sku) {
				candyToRemove = this._trays[this._curTray].products[i].trayID;
				this._trays[this._curTray].products[i] = undefined;
				break;
			}
		}
		
		return candyToRemove;
	},
	
	isMultipleTrays: function()
	{
		return this._totalPieces == 32 || this._totalPieces == 50;
	},
	
	isTrayFull: function($idx)
	{
		var tray = $idx != undefined ? this._trays[$idx] : this.getCurTray();
	
		for(var i=0; i<tray.products.length; i++) {
			if(tray.products[i] == undefined) return false;
		}
		return true;
	},
	
	isTrayEmpty: function()
	{
		var tray = this.getCurTray();
	
		for(var i=0; i<tray.products.length; i++) {
			if(tray.products[i] != undefined) return false;
		}
		return true;
	},	
	
	isLastStep: function()
	{
		return this._curStep == this.TOTAL_STEPS;
	},
	
	areAllTraysFull: function()
	{
		var flag = true;
		
		for(var i=0; i<this._trays.length; i++) {
			for(var j=0; j<this._trays[i].products.length; j++) {
				if(this._trays[i].products[j] == undefined) {
					flag = false;
					break;	
				}
			}
		}
		return flag;
	},
	
	emptyTray: function()
	{
		if(this._selectionType == 'single') {
			for(var i=0; i<this._trays.length; i++) {
				for(var j=0; j<this._trays[i].products.length; j++) {
					this._trays[i].products[j] = undefined;
				}
			}
		} else {
			var tray = this._trays[this._trayToBeEmptied];
			
			for(var i=0; i<tray.products.length; i++) {
				tray.products[i] = undefined;
			}
		}
	},
});