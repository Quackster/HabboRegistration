class com.§aso#35445§.habbo.§aso#66782§.§aso#60793§
{
   var §aso#39200§;
   var §aso#69566§;
   var §aso#54804§;
   var §aso#88925§;
   var §aso#38229§;
   var §aso#17478§;
   var mChosenIndex;
   var §aso#87533§;
   static var §aso#86141§ = 16;
   static var §aso#24859§ = 15;
   function §aso#60793§(§aso#28614§, §aso#51599§)
   {
      this["aso#39200"] = §aso#51599§;
      this["aso#69566"] = §aso#28614§;
      this["aso#54804"] = new Array();
      this["aso#88925"] = new Array();
      this["aso#38229"] = new Array();
      this["aso#17478"] = 0;
      this.mChosenIndex = 0;
      this.setUpSelector();
   }
   function §aso#91709§()
   {
      this["aso#96306"]();
      this["aso#24438"]();
      this.hideSelector();
      this["aso#88925"] = [];
      this["aso#17478"] = 0;
   }
   function §aso#27643§(§aso#82936§, §aso#22625§, §aso#77918§, §aso#71929§)
   {
      this.mChosenIndex = §aso#77918§;
      if(!§aso#71929§)
      {
         this["aso#88925"].push(§aso#82936§);
      }
      if(§aso#22625§ >= com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"])
      {
         this["aso#75134"]();
      }
      var _loc4_ = Math.floor(§aso#77918§ / com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"]);
      if(§aso#22625§ < _loc4_ * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] || §aso#22625§ >= (_loc4_ + 1) * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"])
      {
         if(!§aso#71929§)
         {
            return undefined;
         }
      }
      var _loc5_ = this["aso#54804"].length + 1;
      var §aso#29456§ = this["aso#69566"].createEmptyMovieClip("button" + _loc5_,_loc5_);
      eval("aso#29456").attachMovie("colorButtonBg","bg",1);
      var _loc3_ = eval("aso#29456").attachMovie("aso#82515","colorIcon",2);
      _loc3_._x += 2;
      _loc3_._y += 2;
      if(this["aso#54804"].length < com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] / 2)
      {
         eval("aso#29456")._x = this["aso#54804"].length * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#24859"];
      }
      else
      {
         eval("aso#29456")._x = (this["aso#54804"].length - com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] / 2) * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#24859"];
         eval("aso#29456")._y += com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#24859"];
      }
      eval("aso#29456")["aso#76526"] = §aso#82936§;
      eval("aso#29456")["aso#45189"] = §aso#22625§;
      this.setColor(_loc3_,§aso#82936§);
      var owner = this;
      eval("aso#29456").onRelease = function()
      {
         owner.positionSelection(eval("aso#29456")._x,eval("aso#29456")._y);
         owner["aso#05079"](eval("aso#29456")["aso#76526"],eval("aso#29456")["aso#45189"]);
      };
      this["aso#54804"].push(eval("aso#29456"));
      if(§aso#22625§ == §aso#77918§)
      {
         this.positionSelection(eval("aso#29456")._x,eval("aso#29456")._y);
      }
   }
   function fillEmptySlots()
   {
      var _loc3_ = this["aso#54804"].length;
      while(_loc3_ < com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"])
      {
         var _loc4_ = this["aso#54804"].length + 1;
         var _loc2_ = this["aso#69566"].createEmptyMovieClip("button" + _loc4_,_loc4_);
         _loc2_.attachMovie("inactiveColorButton","graphic",1);
         if(this["aso#54804"].length < com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] / 2)
         {
            _loc2_._x = this["aso#54804"].length * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#24859"];
         }
         else
         {
            _loc2_._x = (this["aso#54804"].length - com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] / 2) * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#24859"];
            _loc2_._y += com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#24859"];
         }
         this["aso#54804"].push(_loc2_);
         _loc3_ = _loc3_ + 1;
      }
   }
   function findAndSetPageNow()
   {
      this["aso#17478"] = Math.floor(this.mChosenIndex / com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"]);
   }
   function §aso#96306§()
   {
      var _loc2_ = this["aso#54804"].length - 1;
      while(_loc2_ >= 0)
      {
         this["aso#54804"][_loc2_].removeMovieClip();
         this["aso#54804"].pop();
         _loc2_ = _loc2_ - 1;
      }
   }
   function §aso#24438§()
   {
      var _loc2_ = this["aso#38229"].length - 1;
      while(_loc2_ >= 0)
      {
         this["aso#38229"][_loc2_].removeMovieClip();
         this["aso#38229"].pop();
         _loc2_ = _loc2_ - 1;
      }
   }
   function setUpSelector()
   {
      this["aso#87533"] = this["aso#69566"].createEmptyMovieClip("selector",100);
      this["aso#87533"].attachMovie("paletteSelector","graphic",1);
      this["aso#87533"]._visible = false;
   }
   function positionSelection(§aso#45610§, aY)
   {
      this["aso#87533"]._visible = true;
      this["aso#87533"]._x = §aso#45610§ - 1;
      this["aso#87533"]._y = aY - 1;
   }
   function hideSelector()
   {
      this["aso#87533"]._visible = false;
   }
   function setColor(§aso#33632§, §aso#82936§)
   {
      var _loc9_ = new Array();
      §aso#82936§ = String(§aso#82936§);
      var _loc3_ = §aso#82936§.substring(0,2);
      var _loc1_ = §aso#82936§.substring(2,4);
      var _loc2_ = §aso#82936§.substring(4,6);
      _loc3_ = parseInt(_loc3_,16);
      _loc1_ = parseInt(_loc1_,16);
      _loc2_ = parseInt(_loc2_,16);
      _loc3_ = _loc3_ / 255 * 100;
      _loc1_ = _loc1_ / 255 * 100;
      _loc2_ = _loc2_ / 255 * 100;
      var _loc6_ = new Color(§aso#33632§);
      var _loc5_ = {ra:_loc3_,rb:0,ga:_loc1_,gb:0,ba:_loc2_,bb:0,aa:100,ab:0};
      _loc6_.setTransform(_loc5_);
   }
   function §aso#05079§(§aso#82936§, §aso#19841§)
   {
      this.mChosenIndex = §aso#19841§;
      com["aso#35445"].habbo["aso#66782"]["aso#98119"].getInstance().setPartColor(this["aso#39200"],§aso#82936§,§aso#19841§);
   }
   function §aso#75134§()
   {
      if(this["aso#38229"].length > 0)
      {
         return undefined;
      }
      var _loc3_ = this["aso#69566"].createEmptyMovieClip("leftArrow",99);
      var _loc2_ = this["aso#69566"].createEmptyMovieClip("rightArrow",98);
      _loc3_.attachMovie("aso#94493","graphic",1);
      _loc2_.attachMovie("aso#37808","graphic",1);
      _loc3_._x = -20;
      _loc2_._x = 122;
      var owner = this;
      _loc3_.onRelease = function()
      {
         owner.setColorPage("previous");
      };
      _loc2_.onRelease = function()
      {
         owner.setColorPage("next");
      };
      this["aso#38229"].push(_loc3_,_loc2_);
   }
   function setColorPage(§aso#79310§)
   {
      var _loc4_ = this["aso#88925"].length;
      var _loc5_ = Math.ceil(_loc4_ / com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"]);
      if(§aso#79310§ == "next")
      {
         this["aso#17478"] += 1;
      }
      else
      {
         this["aso#17478"] -= 1;
      }
      if(this["aso#17478"] * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] > _loc4_)
      {
         this["aso#17478"] = 0;
      }
      if(this["aso#17478"] < 0)
      {
         this["aso#17478"] = _loc5_ - 1;
      }
      this["aso#96306"]();
      this.hideSelector();
      var _loc3_ = 0;
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"])
      {
         _loc3_ = this["aso#17478"] * com["aso#35445"].habbo["aso#66782"]["aso#60793"]["aso#86141"] + _loc2_;
         if(_loc3_ > _loc4_ - 1)
         {
            this.fillEmptySlots();
            return undefined;
         }
         this["aso#27643"](this["aso#88925"][_loc3_],_loc3_,this.mChosenIndex,true);
         _loc2_ = _loc2_ + 1;
      }
   }
}
