
     (function( $, undefined ) {
     var Calculator  = {
            firstValueSelected:null,
            secondValueSelected:0,
            operatorSelected: null,
            operatorClick:false,
            result :0,
            change:0,
            resultField:null,
            options:{
                theme:'jq-calculator'
            },
            _create:function(){

                 //create an input field
                var textfield=$(document.createElement("input")).attr('type','text').addClass('screen').css('direction','ltr');

                this.element.append(textfield);
                this.resultField=textfield;
                 this.element.addClass("jq-calculator");
                var opt=this.options;
                this.element.addClass(opt.theme);
                console.log(opt.theme);
                console.log(opt.theme);
                var numberGrp = $(document.createElement("section")).addClass('numbers');
                this.element.append(numberGrp);
                var operatorGrp = $(document.createElement("section")).addClass('operators');
                this.element.append(operatorGrp);
                var numButtons = ['7','8','9','4','5','6','1','2','3','0','.'];
                for(var i=0;i<numButtons.length;i++){
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
                  // Handling Equal button
                this._renderButtonElement('clear','C', this._handleClearClick,operatorGrp);
                 // Handling Clear button

                this._renderButtonElement('equal','=', this._handleEqualClick,operatorGrp);



             },
            _renderButtonElement:function(type, value,clickHandler,sectionName){
                var _self=this;
                var btn = $(document.createElement("Button")).attr({class:type,value:value}).html(value).bind("click",_self,clickHandler);
                 $(sectionName).append(btn);
             },

             _handleNumberClick : function(evt){
                  var _this=evt.data;

                 var button = evt.target;

                 // referring to the target i.e. HTML Button element
                 var value = button.value;
                  _this._CalculationHistory(value);
                  if(_this.operatorClick){
                      _this.resultField.val(value);
                     _this.operatorClick=false;
                  }else{
                      //appending the number input
                      _this.resultField.val(_this.resultField.val()+value);
                  }

              },
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

                  _handleClearClick : function(evt){
                  var _this=evt.data;
                           _this.resultField.val(null);
                           // clearing the screen and initializing the values of the variables
                           _this.firstValueSelected = null;
                           _this.secondValueSelected = 0;
                           _this.operatorSelected = null;
                           _this.result = 0;
                           _this.operatorClick=false;
                   },
                   destroy:function(){
                            $.Widget.prototype.destroy.call(this, arguments);
                            this.element.css({background:'none'});
                            this.element.find('.number,.operator,.equal').unbind("click");
                            this.element.remove();
                   },




                  _CalculationHistory:function(value)
                  {
                           console.log(value);
                  }



        };
         $.widget("ui.calculator", Calculator);




//          $('input[value=Change_Background]').click(function() {$('.parent').calculator("changeBackground")});
//          $('input[value=Destroy]').click(function() {$('.parent').calculator("destroy")});
        })(jQuery);
//    calculator(options,'background','red').