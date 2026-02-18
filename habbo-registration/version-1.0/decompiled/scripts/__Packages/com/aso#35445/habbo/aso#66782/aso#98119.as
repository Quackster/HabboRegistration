class com.§aso#35445§.habbo.§aso#66782§.§aso#98119§ implements com.§aso#35445§.common.util.EventRelayListener
{
   var §aso#42826§;
   var §aso#42405§;
   var radioButtons;
   var previewIcons;
   var §aso#06892§;
   var §aso#05500§;
   var §aso#11489§;
   var chosenGender;
   var §aso#23046§;
   var retryDrawingCallbackId;
   var §aso#26251§;
   var §aso#29035§;
   static var §aso#76947§ = null;
   static var §aso#92130§ = new Array("hr","hd","ch","lg","sh");
   function §aso#98119§(tMainMc, §aso#73742§)
   {
      this["aso#42826"] = §aso#73742§;
      this["aso#42405"] = new Array();
      this.radioButtons = new Object();
      this.previewIcons = new Object();
      this["aso#06892"] = new Object();
      this["aso#05500"] = new Object();
      this["aso#11489"] = tMainMc;
      this.chosenGender = "male";
      com["aso#35445"].habbo.Localization.getInstance();
      this["aso#23046"] = setInterval(this,"aso#61764",50);
      com["aso#35445"].common.util.EventRelay.addListener(this,"setPreviewColor");
      com["aso#35445"].common.util.EventRelay.addListener(this,"partDrawn");
   }
   static function getInstance(tMainMc, §aso#73742§)
   {
      if(com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#76947"] == null)
      {
         com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#76947"] = new com["aso#35445"].habbo["aso#66782"]["aso#98119"](tMainMc,§aso#73742§);
      }
      return com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#76947"];
   }
   function receiveEvent(event)
   {
      var _loc3_ = event.getTopic();
      var _loc2_ = event.getData();
      if(_loc3_ == "partDrawn")
      {
         this.setPreviewPart(_loc2_.mainPart,_loc2_.partName,_loc2_.partNum,_loc2_.color);
      }
      if(_loc3_ == "setPreviewColor")
      {
         this.setPreviewColor(_loc2_.mainPart,_loc2_.color);
      }
   }
   function §aso#68174§()
   {
   }
   function addEventListener()
   {
   }
   function §aso#95885§()
   {
      clearInterval(this.retryDrawingCallbackId);
   }
   function §aso#61764§()
   {
      var _loc2_ = com["aso#35445"].habbo.Localization.getInstance().isLoaded();
      var _loc3_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().isFiguredataLoaded();
      if(!_loc2_ || !_loc3_)
      {
         trace("loc=" + _loc2_ + " figdata=" + _loc3_);
         return false;
      }
      clearInterval(this["aso#23046"]);
      this["aso#30427"]();
      this["aso#99090"]();
      this["aso#36416"]();
      this["aso#60372"]();
      this["aso#11068"]();
      this["aso#17057"](298,308);
      this["aso#85720"](124,275,com["aso#35445"].habbo.Localization.getInstance().getText("randomize"));
      this.setInitialLook();
      this.setAllColorButtons();
      this["aso#64969"]();
      return true;
   }
   function setInitialLook()
   {
      var _loc8_ = _root.figure;
      var _loc9_ = _root.gender;
      if(_loc8_.length != 25 || _loc9_.length != 1)
      {
         _loc8_ = "1750118022210132810129003";
         _loc9_ = "M";
      }
      if(_loc9_ == "M")
      {
         this.chosenGender = "male";
      }
      else
      {
         this.chosenGender = "female";
      }
      var _loc10_ = [_loc8_,this.chosenGender];
      var _loc7_ = com["aso#35445"].habbo["aso#66782"]["aso#32240"].parseLookString(_loc8_);
      var _loc5_ = new Array();
      var _loc4_ = 0;
      while(_loc4_ < _loc7_.length)
      {
         _loc5_ = _loc7_[_loc4_];
         var _loc3_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().getPartIndexByNumber(_loc5_[0],this.chosenGender);
         if(_loc3_[1] == "not found")
         {
            _root.figure = undefined;
            _root.gender = undefined;
            this.setInitialLook();
            return undefined;
         }
         var _loc6_ = [_loc3_[0],Number(_loc5_[1]) - 1];
         this["aso#05500"][_loc3_[1]] = _loc6_;
         _loc4_ = _loc4_ + 1;
      }
      this["aso#42826"]["aso#18449"]("aso#30848",_loc10_,2);
   }
   function setDefaultLook()
   {
      for(var _loc3_ in com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"])
      {
         var _loc2_ = com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc3_];
         this["aso#42826"]["aso#70958"]("aso#30848",_loc2_,this.getParts(_loc2_,"setDefault"));
      }
   }
   function §aso#88504§(§aso#51599§, §aso#33211§, tDir)
   {
      if(§aso#33211§ == "part")
      {
         var _loc3_ = this.getParts(§aso#51599§,tDir);
         this["aso#42826"]["aso#70958"]("aso#30848",§aso#51599§,_loc3_);
         this["aso#39621"](§aso#51599§,_loc3_[0],_loc3_[2]);
         this.setColorButtons(§aso#51599§);
      }
      else if(§aso#33211§ == "color")
      {
         var _loc4_ = this.getColor(§aso#51599§,tDir);
         this["aso#39621"](§aso#51599§,-1,_loc4_[1]);
         this["aso#42826"].changePartColor("aso#30848",§aso#51599§,_loc4_[1]);
      }
      else if(§aso#33211§ == "rotate")
      {
         this["aso#42826"].rotateAvatar("aso#30848",tDir);
      }
   }
   function setPartColor(tMainPart, §aso#97277§, tIndex)
   {
      this["aso#05500"][tMainPart][1] = tIndex;
      this["aso#42826"].changePartColor("aso#30848",tMainPart,§aso#97277§);
   }
   function getColor(tPart, tDir)
   {
      var _loc2_ = this["aso#05500"][tPart];
      var _loc3_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().getColorAndIndexes(this.chosenGender,tPart,tDir,_loc2_[0],_loc2_[1]);
      return _loc3_;
   }
   function getParts(tMainPart, tDir)
   {
      var _loc3_ = this["aso#05500"][tMainPart];
      var _loc2_ = _loc3_[1];
      if(tMainPart != "hd")
      {
         _loc2_ = 0;
      }
      var _loc5_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().getPartsAndIndexes(this.chosenGender,tMainPart,tDir,_loc3_[0],_loc2_);
      return _loc5_;
   }
   function §aso#39621§(§aso#51599§, aPartIndex, §aso#19841§)
   {
      if(aPartIndex == -1)
      {
         aPartIndex = this["aso#05500"][§aso#51599§][0];
      }
      if(§aso#19841§ == -1)
      {
         §aso#19841§ = this["aso#05500"][§aso#51599§][1];
      }
      this["aso#05500"][§aso#51599§] = [aPartIndex,§aso#19841§];
   }
   function §aso#84328§()
   {
      for(var _loc4_ in com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"])
      {
         var _loc3_ = com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc4_];
         var _loc2_ = this.getParts(_loc3_,"randomize");
         this["aso#42826"]["aso#70958"]("aso#30848",_loc3_,_loc2_);
         this["aso#39621"](_loc3_,_loc2_[0],_loc2_[2]);
      }
      this.setAllColorButtons();
   }
   function §aso#30427§()
   {
      var _loc3_ = this["aso#11489"].createEmptyMovieClip("aso#47002",this["aso#11489"].getNextHighestDepth());
      _loc3_.attachMovie("aso#47002","graphic",1,{_x:0,_y:44});
      _root.load_anim.swapDepths(_root.getNextHighestDepth());
      _root.load_anim.removeMovieClip();
   }
   function §aso#60372§()
   {
      var _loc2_ = 20;
      this["aso#58980"]("male",true,136,_loc2_);
      this["aso#58980"]("female",false,186,_loc2_);
      this["aso#52991"](com["aso#35445"].habbo.Localization.getInstance().getText("boy"),136,_loc2_ - 18,"center");
      this["aso#52991"](com["aso#35445"].habbo.Localization.getInstance().getText("girl"),186,_loc2_ - 18,"center");
   }
   function §aso#17057§(tX, tY)
   {
      var _loc2_ = this["aso#48815"]();
      _loc2_.attachMovie("aso#87112","graphic",1);
      _loc2_._x = tX;
      _loc2_._y = tY;
      _loc2_.createTextField("text",2,0,0,0,0);
      var _loc3_ = _loc2_.text;
      _loc3_.autoSize = false;
      _loc3_._width = _loc2_._width;
      _loc3_._height = 20;
      _loc3_.text = com["aso#35445"].habbo.Localization.getInstance().getText("continue");
      _loc3_.selectable = false;
      var _loc4_ = new TextFormat();
      _loc4_.color = 16777215;
      _loc4_.font = "Verdana";
      _loc4_.bold = true;
      _loc4_.align = "center";
      _loc3_.setTextFormat(_loc4_);
      this["aso#26251"] = _loc2_;
      this.setContinueButtonState("inactive");
      this["aso#29035"] = setInterval(this,"aso#79731",3000);
   }
   function setContinueButtonState(§aso#66361§)
   {
      var owner = this;
      if(§aso#66361§ == "aso#14273")
      {
         this["aso#26251"].onRelease = function()
         {
            owner.continueClicked();
         };
         this["aso#26251"]._alpha = 100;
      }
      if(§aso#66361§ == "inactive")
      {
         this["aso#26251"].onRelease = null;
         this["aso#26251"]._alpha = 50;
      }
   }
   function §aso#79731§()
   {
      this.setContinueButtonState("aso#14273");
      clearInterval(this["aso#29035"]);
   }
   function §aso#89896§(tX, tY)
   {
      var _loc3_ = this["aso#48815"]();
      var owner = this;
      _loc3_.attachMovie("aso#81123","graphic",1);
      _loc3_._x = tX;
      _loc3_._y = tY;
      _loc3_.onRelease = function()
      {
         owner["aso#51178"]();
      };
      _loc3_.createTextField("text",2,0,1,0,0);
      var _loc2_ = _loc3_.text;
      _loc2_.autoSize = false;
      _loc2_._width = _loc3_._width - 10;
      _loc2_._x += 10;
      _loc2_._height = 20;
      _loc2_.text = com["aso#35445"].habbo.Localization.getInstance().getText("aso#10647");
      _loc2_.selectable = false;
      var _loc4_ = new TextFormat();
      _loc4_.color = 16777215;
      _loc4_.font = "Verdana";
      _loc4_.bold = true;
      _loc4_.align = "center";
      _loc2_.setTextFormat(_loc4_);
   }
   function §aso#15244§(§aso#45610§, aY, §aso#97698§)
   {
      var _loc3_ = this["aso#48815"]();
      _loc3_.attachMovie("nameBg","bg",1);
      _loc3_._x = §aso#45610§;
      _loc3_._y = aY;
      _loc3_.createTextField("text",2,0,0,0,0);
      var _loc2_ = _loc3_.text;
      _loc2_.autoSize = false;
      _loc2_._width = _loc3_._width;
      _loc2_._height = 20;
      _loc2_.text = §aso#97698§;
      _loc2_.selectable = false;
      var _loc4_ = new TextFormat();
      _loc4_.font = "Verdana";
      _loc4_.bold = true;
      _loc4_.align = "center";
      _loc2_.setTextFormat(_loc4_);
   }
   function §aso#85720§(§aso#45610§, aY, §aso#85299§)
   {
      var _loc2_ = this["aso#48815"]();
      _loc2_.attachMovie("aso#00482","bg",1);
      _loc2_._x = §aso#45610§;
      _loc2_._y = aY;
      _loc2_.createTextField("text",2,0,0,0,0);
      var _loc3_ = _loc2_.text;
      _loc3_.autoSize = false;
      _loc3_._width = _loc2_._width;
      _loc3_._height = 20;
      _loc3_.text = §aso#85299§;
      _loc3_.selectable = false;
      var _loc4_ = new TextFormat();
      _loc4_.font = "Verdana";
      _loc4_.bold = true;
      _loc4_.align = "center";
      _loc3_.setTextFormat(_loc4_);
      var owner = this;
      _loc2_.onRelease = function()
      {
         owner["aso#84328"]();
      };
   }
   function continueClicked()
   {
      var _loc5_ = "";
      if(this.chosenGender == "male")
      {
         _loc5_ = "M";
      }
      else
      {
         _loc5_ = "F";
      }
      var _loc7_ = this["aso#12460"]();
      var _loc4_ = _root.post_gender;
      var _loc3_ = _root.post_figure;
      var _loc8_ = "__app_key";
      var _loc6_ = "";
      if(_root.__app_key != undefined)
      {
         _loc6_ = _root.__app_key;
      }
      else
      {
         _loc6_ = "";
      }
      if(_loc4_ == undefined)
      {
         _loc4_ = "gender";
      }
      if(_loc3_ == undefined)
      {
         _loc3_ = "figure";
      }
      if(_root.post_url != undefined)
      {
         if(_root.__app_key != undefined)
         {
            getURL(_root.post_url + _loc4_ + "=" + _loc5_ + "&" + _loc3_ + "=" + _loc7_ + "&" + _loc8_ + "=" + _loc6_,"_self","POST");
         }
         else
         {
            getURL(_root.post_url + _loc4_ + "=" + _loc5_ + "&" + _loc3_ + "=" + _loc7_,"_self","POST");
         }
      }
      else
      {
         trace("send:" + _loc4_ + "=" + _loc5_ + "&" + _loc3_ + "=" + _loc7_ + "&" + _loc8_ + "=" + _loc6_);
      }
      this.setContinueButtonState("inactive");
   }
   function §aso#51178§()
   {
      if(_root["aso#70537"] != undefined)
      {
         getURL(_root["aso#70537"],"");
      }
   }
   function §aso#12460§()
   {
      var _loc7_ = "";
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"].length)
      {
         var _loc4_ = com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc2_];
         var _loc3_ = this["aso#05500"][_loc4_];
         var _loc5_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().getPartNumber(_loc3_[0],_loc4_,this.chosenGender);
         var _loc6_ = this["aso#06471"](Number(_loc3_[1]) + 1);
         _loc7_ += _loc5_;
         _loc7_ += _loc6_;
         _loc2_ = _loc2_ + 1;
      }
      return _loc7_;
   }
   function §aso#06471§(tNum)
   {
      var _loc1_ = String(tNum);
      if(tNum < 10)
      {
         _loc1_ = "0" + _loc1_;
      }
      return _loc1_;
   }
   function §aso#36416§()
   {
      var _loc4_ = 0;
      var _loc3_ = 42;
      var _loc6_ = 64;
      var _loc5_ = 45;
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"].length)
      {
         this["aso#94914"](com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc2_],"part","next",_loc4_ + _loc6_,_loc3_ + _loc2_ * _loc5_);
         this["aso#94914"](com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc2_],"part","prev",_loc4_,_loc3_ + _loc2_ * _loc5_);
         _loc2_ = _loc2_ + 1;
      }
      this["aso#94914"]("none","rotate","prev",119,235);
      this["aso#94914"]("none","rotate","next",200,235);
   }
   function §aso#94914§(tPart, §aso#33211§, tDir, tX, tY)
   {
      var §aso#80152§ = this["aso#48815"]();
      var owner = this;
      var _loc2_ = "";
      if(§aso#33211§ == "part")
      {
         if(tDir == "prev")
         {
            _loc2_ = "aso#07863";
         }
         else
         {
            _loc2_ = "arrowRight";
         }
      }
      else if(§aso#33211§ == "rotate")
      {
         if(tDir == "prev")
         {
            _loc2_ = "aso#43797";
         }
         else
         {
            _loc2_ = "aso#49786";
         }
      }
      eval("aso#80152").attachMovie(_loc2_,"graphic",1);
      eval("aso#80152")._x = tX;
      eval("aso#80152")._y = tY;
      eval("aso#80152").action = §aso#33211§;
      eval("aso#80152").part = tPart;
      eval("aso#80152").dir = tDir;
      eval("aso#80152").onRelease = function()
      {
         owner["aso#88504"](eval("aso#80152").part,eval("aso#80152").action,eval("aso#80152").dir);
      };
   }
   function §aso#11068§()
   {
      var _loc3_ = 44;
      var _loc4_ = 44;
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"].length)
      {
         this["aso#67753"](com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc2_],265,_loc3_ + _loc2_ * _loc4_);
         _loc2_ = _loc2_ + 1;
      }
   }
   function §aso#67753§(§aso#51599§, tX, tY)
   {
      var _loc2_ = this["aso#48815"]();
      _loc2_._x = tX;
      _loc2_._y = tY;
      this["aso#06892"][§aso#51599§] = new com["aso#35445"].habbo["aso#66782"]["aso#60793"](_loc2_,§aso#51599§);
   }
   function setAllColorButtons()
   {
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"].length)
      {
         this.setColorButtons(com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc2_]);
         _loc2_ = _loc2_ + 1;
      }
   }
   function setColorButtons(tMainPart)
   {
      var _loc6_ = this["aso#05500"][tMainPart];
      var _loc7_ = _loc6_[0];
      var _loc5_ = _loc6_[1];
      var _loc3_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().getAllPartColors(this.chosenGender,tMainPart,_loc7_);
      this["aso#06892"][tMainPart]["aso#91709"]();
      var _loc2_ = 0;
      while(_loc2_ < _loc3_.length)
      {
         this["aso#06892"][tMainPart]["aso#27643"](_loc3_[_loc2_],_loc2_,_loc5_);
         _loc2_ = _loc2_ + 1;
      }
      this["aso#06892"][tMainPart].fillEmptySlots();
      this["aso#06892"][tMainPart].findAndSetPageNow();
   }
   function §aso#99090§()
   {
      var _loc4_ = 10;
      var _loc3_ = 37;
      var _loc5_ = 45;
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"].length)
      {
         this["aso#48394"](com["aso#35445"].habbo["aso#66782"]["aso#98119"]["aso#92130"][_loc2_],_loc4_,_loc3_ + _loc2_ * _loc5_);
         _loc2_ = _loc2_ + 1;
      }
   }
   function §aso#48394§(§aso#97698§, §aso#45610§, aY)
   {
      this.previewIcons[§aso#97698§] = new Object();
      var _loc10_ = ["aso#14273"];
      var _loc6_ = 0;
      while(_loc6_ < _loc10_.length)
      {
         var _loc7_ = this["aso#48815"]();
         var _loc4_ = this["aso#48815"]();
         var _loc5_ = this["aso#48815"]();
         var _loc3_ = _loc10_[_loc6_];
         var _loc2_ = 0;
         if(_loc3_ == "previous")
         {
            _loc2_ = -50;
         }
         if(_loc3_ == "next")
         {
            _loc2_ = 50;
         }
         _loc4_._x = §aso#45610§ + _loc2_;
         _loc4_._y = aY;
         _loc7_._x = §aso#45610§ + _loc2_;
         _loc7_._y = aY;
         _loc5_._x = §aso#45610§ + _loc2_;
         _loc5_._y = aY;
         this.previewIcons[§aso#97698§][_loc3_] = new com["aso#35445"].habbo["aso#66782"].PreviewIcon(_loc4_,_loc5_,_loc7_,_loc3_);
         _loc6_ = _loc6_ + 1;
      }
   }
   function setPreviewPart(tMainPartName, §aso#00903§, §aso#35024§, §aso#99511§)
   {
      this.previewIcons[tMainPartName]["aso#14273"]["aso#20262"](§aso#00903§,§aso#35024§,tMainPartName,§aso#99511§);
   }
   function setPreviewColor(§aso#83907§, §aso#82936§)
   {
      this.previewIcons[§aso#83907§]["aso#14273"].setColor(§aso#82936§);
   }
   function §aso#48815§()
   {
      var _loc2_ = this["aso#11489"].getNextHighestDepth();
      var _loc3_ = this["aso#11489"].createEmptyMovieClip("button" + _loc2_,_loc2_);
      this["aso#42405"].push(_loc3_);
      return _loc3_;
   }
   function §aso#58980§(tName, §aso#46581§, tX, tY)
   {
      var §aso#29456§ = this["aso#48815"]();
      var owner = this;
      eval("aso#29456")._x = tX;
      eval("aso#29456")._y = tY;
      eval("aso#29456")["aso#41013"] = tName;
      eval("aso#29456").onRelease = function()
      {
         owner.radioClicked(eval("aso#29456"));
      };
      this.radioButtons[tName] = eval("aso#29456");
   }
   function §aso#57588§(§aso#29456§, tIsOn)
   {
      var _loc1_ = "On";
      if(tIsOn)
      {
         _loc1_ = "On";
      }
      else
      {
         _loc1_ = "Off";
      }
      §aso#29456§.attachMovie("radioButton" + _loc1_,"buttonImage",1);
   }
   function §aso#64969§()
   {
      if(this.chosenGender == "male")
      {
         this["aso#57588"](this.radioButtons.male,true);
         this["aso#57588"](this.radioButtons.female,false);
      }
      else
      {
         this["aso#57588"](this.radioButtons.female,true);
         this["aso#57588"](this.radioButtons.male,false);
      }
   }
   function radioClicked(§aso#29456§)
   {
      if(this.chosenGender == §aso#29456§["aso#41013"])
      {
         return undefined;
      }
      this.chosenGender = §aso#29456§["aso#41013"];
      this["aso#84328"]();
      this["aso#64969"]();
   }
   function §aso#52991§(tText, tX, tY, §aso#53962§)
   {
      var _loc4_ = this["aso#11489"].getNextHighestDepth();
      this["aso#11489"].createTextField("text" + _loc4_,_loc4_,tX,tY,0,0);
      var _loc2_ = this["aso#11489"]["text" + _loc4_];
      _loc2_.autoSize = true;
      _loc2_.text = tText;
      _loc2_.selectable = false;
      var _loc3_ = new TextFormat();
      _loc3_.font = "Verdana";
      _loc3_.bold = true;
      _loc2_.setTextFormat(_loc3_);
      _loc2_._x -= _loc2_._width / 2 - 3;
   }
}
