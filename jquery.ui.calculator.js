
    (function( $, undefined ) {
        $.widget("ui.calculator", {
            firstValueSelected:null,
            secondValueSelected:0,
            operatorSelected: null,
            operatorClick:false,
            result :0,
            change:0,
            memoryData:null,
            resultField:null,
            memClick:false,
            spanField:null,
            //define set of default options for calculator
            options:{
                theme:'jq-calculator'
            },
            /**
            * function to create calculator layout and calling event handlers for  handling number click,operator click,equal click and clear click
            */

            _create:function(){

                //create an input field
                var textfield=$(document.createElement("input")).attr('type','text').addClass('screen').css('direction','ltr');
                var span=$(document.createElement("span")).addClass('memory');
                this.element.append(span);
                this.spanField=span;
                this.element.append(textfield);
                this.resultField=textfield;
                //add default class "jq-calculator" which sets the default styling for calculator
                this.element.addClass("jq-calculator");
                var opt=this.options;

                this.element.addClass(opt.theme);
                var otherGrp = $(document.createElement("section")).addClass('mem-operators');
                this.element.append(otherGrp);

                var otherOperatorGrp =$(document.createElement("section")).addClass('other-operators');
                this.element.append(otherOperatorGrp);
                //create a section called numberGrp to include all number buttons
                var numberGrp = $(document.createElement("section")).addClass('numbers');
                this.element.append(numberGrp);
                //create operatorGrp section to include all operators
                var operatorGrp = $(document.createElement("section")).addClass('operators');
                this.element.append(operatorGrp);
                var opButtons = ['&#177;','&#37;','&#8730;','1/x','<-'];
                // rendering the Operator buttons
                for (var j=0;j<opButtons.length;j++){
                //rendering the number elements and appending to operatorGrp
                    this._renderButtonElement('other-operator',opButtons[j],this._handleOtherOperatorClick,otherOperatorGrp);
                }

                var numButtons = ['7','8','9','4','5','6','1','2','3','0','.'];
                for(var i=0;i<numButtons.length;i++){
                //call renderButtonElement to create buttons and bind event
                    this._renderButtonElement('number',numButtons[i],this._handleNumberClick,numberGrp);
                }
                //when initializing the class we need to set event listeners on the buttons
                //get the elements by class name and add event listener
                // buttons is an array of the elements retrieved
                var opButtons = ['+','-','*','/'];
                // Handling the operator buttons
                for (var j=0;j<opButtons.length;j++){
                    this._renderButtonElement('operator',opButtons[j], this._handleOperatorClick,operatorGrp);
                }
                var memButtons = ['MC','MR','MS','M+','M-',];
                // rendering the Operator buttons
                for (var j=0;j<memButtons.length;j++){
                //rendering the number elements and appending to operatorGrp
                    this._renderButtonElement('mem-operator',memButtons[j],this._handleMemoryClick,otherGrp);
                }
                // Handling Equal button
                this._renderButtonElement('clear','C', this._handleClearClick,operatorGrp);
                // Handling Clear button
                this._renderButtonElement('clearEntry','CE', this._handleClearEntryClick,operatorGrp);
                this._renderButtonElement('equal','=', this._handleEqualClick,operatorGrp);



            },
            /**
            * function to create buttons and binding event listeners
            */
            _renderButtonElement:function(type, value,clickHandler,sectionName){
                var _self=this;
                var btn = $(document.createElement("Button")).attr({class:type,value:value}).html(value).bind("click",_self,clickHandler);
                $(sectionName).append(btn);
            },
            /**
            * function to handle number click
            */
            _handleNumberClick : function(evt){
                var _this=evt.data;
                var button = evt.target
                console.log("inside handle number");
                // referring to the target i.e. HTML Button element

                var value = button.value;
                _this._CalculationHistory(value);
                if(_this.operatorClick){
                    if(_this.memClick){
                        _this.resultField.val(null);
                        _this.memClick=false;
                    }
                    _this.resultField.val(value);
                    _this.operatorClick=false;
                }else{
                   if(_this.memClick){
                        _this.resultField.val(null);
                        _this.memClick=false;
                   }
                //appending the number input
                    _this.resultField.val(_this.resultField.val()+value);
                }

            },
            /**
            * function to handle operator click
            */
            _handleOperatorClick : function(evt){
            // if result exists then its a second operation
            //we need to set the  firstValueSelected and operator
                var _this=evt.data;
                if(_this.firstValueSelected !=null){
                    _this._handleEqualClick(evt);
                     _this.firstValueSelected =_this.result;
                }else{
                    _this._clearAndStoreValue(true);
                }
            //store the value and clear the text field
                var button = evt.target;
                var value = button.value;
                _this._CalculationHistory(value);
                // Retrieving the operator from the target
                _this.operatorSelected = value;
                _this.operatorClick = true;
                },

            _handleMemoryClick:function(evt){
                var _this=evt.data;
                var button=evt.target;
                var value=button.value;
                _this.spanField.text('M');
                if(value=='MS')
                {   _this.memClick=true;
                console.log(_this.memClick);
                    _this.memoryData=_this.resultField.val();

                }
                else if(value=='MR'){
                    _this.resultField.val(_this.memoryData);
                }
                else if(value=='M+'){
                    _this.memClick=true;
                    console.log(_this.memClick);
                    _this.memoryData=Number(_this.memoryData);
                     var numeric=Number( _this.resultField.val());
                    _this.resultField.val(numeric);
                    _this.memoryData = _this.memoryData+numeric;
                    _this.resultField.val(_this.memoryData);
                }
                else if(value=='M-'){
                     _this.memClick=true;
                     console.log(_this.memClick);
                     _this.memoryData=Number(_this.memoryData);
                     var numeric=Number( _this.resultField.val());
                     _this.resultField.val(numeric);
                     _this.memoryData = _this.memoryData-numeric;
                     _this.resultField.val(_this.memoryData);

                }
                else if(value=='MC') {
                    _this.memoryData=null;
                    _this.spanField.text('');
                }
            },
            /**
            * function to clear the input text field after each input by the user and save the operands
            */
            _clearAndStoreValue: function(isFirstValue){
                var value = this.resultField.val();
                // Storing the value entered before clearing the screen
                if(isFirstValue){
                    this.firstValueSelected = Number(value);

                }else{
                    this.secondValueSelected = Number(value);
                }
                    this.resultField.val(null);
            },
                /**
                * function to perform the operation based on operator selected and setting the result
                */
            _setCalculatedResult : function(){
                switch(this.operatorSelected){
                //  appending the operators and the values
                    case '+' :
                        this.result = this.firstValueSelected+this.secondValueSelected;
                        break;
                    case '-' :
                        this.result = this.firstValueSelected-this.secondValueSelected;
                        break;
                    case '/' :
                        this.result = this.firstValueSelected/this.secondValueSelected;
                        break;
                    case '*' :
                        this.result = this.firstValueSelected*this.secondValueSelected;
                        break;
                }
            },
            /**
            * function handlequalclick is called everytime the user clicks on operator which inturn calls
            * clearandstore and setcalculatedresult
            */
            _handleEqualClick:function(evt){
                var _this=evt.data;

                //store the value and clear the text field
                _this._clearAndStoreValue(false);
                _this._setCalculatedResult();
                //evaluated the values
                _this.resultField.val(_this.result);
                _this._CalculationHistory('result'+_this.result);
                _this.operatorClick = true;
            },
            /**
            *function clearclick is called to clear the resultField
            */
            _handleClearClick : function(evt){
                var _this=evt.data;
                _this.resultField.val(null);
                // clearing the screen and initializing the values of the variables

            },
            _handleClearEntryClick : function(evt){
                var _this=evt.data;
                _this.resultField.val(null);
                // clearing the screen and initializing the values of the variables
                _this.firstValueSelected = null;
                _this.secondValueSelected = 0;
                _this.operatorSelected = null;
                _this.result = 0;
                _this.operatorClick=false;
            },

            _handleOtherOperatorClick : function(evt){
                var _this = evt.data;
                var button = evt.target;
                var value = button.value;
                switch(value){
                //  appending the operators and the values
                    case '&#177;' :
                        _this .resultField.val(_this .resultField.val()*-1);
                        break;
                    case '&#37;' :
                        _this .resultField.val(_this .resultField.val()/100);
                        break;
                    case '&#8730;' :
                        _this .resultField.val(Math.sqrt(_this .resultField.val()));
                        break;
                    case '1/x' :
                        _this .resultField.val(1/_this .resultField.val());
                        break;
                    case '<-' :
                        _this .resultField.val(_this .resultField.val().slice(0,-1));
                        break;

                }
            },
            /**
            * function destroy is called to destroy the Calculator
            */
            destroy:function(){
                $.Widget.prototype.destroy.call(this, arguments);
                this.element.css({background:'none'});
                this.element.find('.number,.operator,.equal').unbind("click");
                this.element.remove();
            },

            _CalculationHistory:function(value){

            //console.log(value);
            }


        });

        //name your widget under "ui" namespace as shown below
    })(jQuery);
