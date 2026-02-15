class com.§aso#35445§.habbo.avatar.AvatarImage
{
   var §aso#93522§;
   var holderMc;
   var actions;
   var partList;
   var §aso#23467§;
   var prevflipH;
   var animationFrame;
   var pAction;
   var flipWidth;
   var partSet;
   var figure;
   var handItem;
   var headDirection;
   static var §aso#63156§ = "sit";
   static var §aso#55775§ = 4;
   static var §aso#21233§ = "h";
   static var §aso#58559§ = "sh";
   static var flipList = new Array(0,1,2,3,2,1,0,7);
   static var §aso#03687§ = new Array("hr","hd","ch","lg","sh");
   static var §aso#18870§ = new Array("li","lh","ls","bd","sh","lg","ch","hd","fc","ey","hr","ri","rh","rs");
   static var headElements = new Array("hd","hr","ey","fc");
   static var §aso#78339§ = new Array("li","lh","ls","bd","sh","lg","ri","rh","rs");
   function AvatarImage(mc, tName, tScale)
   {
      if(tScale == undefined)
      {
         tScale = 1;
      }
      this["aso#93522"] = tScale;
      this.holderMc = mc.createEmptyMovieClip(tName,mc.getNextHighestDepth());
      this.holderMc.cacheAsBitmap = true;
      this.holderMc._x = 104;
      this.holderMc._y = 226;
      this.holderMc._xscale = 100 * this["aso#93522"];
      this.holderMc._yscale = 100 * this["aso#93522"];
      this.actions = new Array();
      this.partList = new Object();
      this["aso#23467"] = com["aso#35445"].habbo.avatar.AvatarImage["aso#55775"];
      this.prevflipH = false;
      this.animationFrame = 0;
      this.pAction = "sit";
      this.setAction("sit");
   }
   function §aso#20262§(§aso#00903§, §aso#35024§, §aso#99511§, tMainPartName)
   {
      var _loc3_ = new com["aso#35445"].habbo.avatar["aso#36837"](§aso#00903§,§aso#35024§,§aso#99511§,tMainPartName,this.holderMc);
      var _loc2_ = {mainPart:tMainPartName,partName:§aso#00903§,partNum:§aso#35024§,color:§aso#99511§};
      com["aso#35445"].common.util.EventRelay.sendEvent(new com["aso#35445"].common.util.Event("partDrawn",_loc2_,null));
      this.partList[§aso#00903§] = _loc3_;
   }
   function §aso#08284§(tMainPartName)
   {
      for(var _loc3_ in this.partList)
      {
         if(this.partList[_loc3_].getMainPartName() == tMainPartName)
         {
            this.partList[_loc3_]["aso#68174"]();
            this.partList[_loc3_] = null;
         }
      }
   }
   function changeBodypartColor(tMainPartName, §aso#99511§)
   {
      for(var _loc4_ in this.partList)
      {
         if(this.partList[_loc4_].getMainPartName() == tMainPartName)
         {
            this.partList[_loc4_].setColor(§aso#99511§);
         }
      }
      var _loc5_ = {mainPart:tMainPartName,color:§aso#99511§};
      com["aso#35445"].common.util.EventRelay.sendEvent(new com["aso#35445"].common.util.Event("setPreviewColor",_loc5_,null));
   }
   function moveTo(x, y)
   {
      this.holderMc._x = x;
      this.holderMc._y = y;
   }
   function rotateAvatar(tDir)
   {
      var _loc2_ = 0;
      if(tDir == "next")
      {
         _loc2_ = -1;
      }
      else if(tDir == "prev")
      {
         _loc2_ = 1;
      }
      this["aso#23467"] += _loc2_;
      if(this["aso#23467"] > 7)
      {
         this["aso#23467"] = 0;
      }
      if(this["aso#23467"] < 0)
      {
         this["aso#23467"] = 7;
      }
      this["aso#50207"]();
   }
   function §aso#09676§()
   {
      var _loc3_ = [1,2,1,0,-1,-2,-1,0];
      var _loc2_ = [-1,0,1,2,1,0,-1,-2];
      this.holderMc._x += _loc3_[this["aso#23467"]] * 2;
      this.holderMc._y += _loc2_[this["aso#23467"]] * 2;
      if(this.holderMc._x > 760)
      {
         this.setDirection(random(3) + 4);
         this.holderMc._x -= 4;
      }
      if(this.holderMc._x < 10)
      {
         this.setDirection(random(3));
         this.holderMc._x += 4;
      }
      if(this.holderMc._y < 0)
      {
         this.setDirection(random(3) + 2);
         this.holderMc._y += 4;
      }
      if(this.holderMc._y > 560)
      {
         this.setDirection(random(3) + 6);
         this.holderMc._y -= 4;
      }
   }
   function §aso#50207§()
   {
      var _loc6_ = com["aso#35445"].habbo.avatar.AvatarImage.flipList[this["aso#23467"]];
      var _loc7_ = com["aso#35445"].habbo.avatar.AvatarImage["aso#18870"].length;
      var _loc8_ = false;
      var _loc3_ = 0;
      while(_loc3_ < _loc7_)
      {
         var _loc5_ = com["aso#35445"].habbo.avatar.AvatarImage["aso#18870"][_loc3_];
         var _loc2_ = this.pAction;
         var _loc4_ = 0;
         if(_loc2_ == "wlk" && this.isWalkElement(_loc5_))
         {
            _loc4_ = this.animationFrame;
         }
         else
         {
            _loc2_ = "std";
         }
         _loc8_ = this.partList[_loc5_].setFrameAndRegpoint("h",_loc2_,_loc6_,_loc4_);
         _loc3_ = _loc3_ + 1;
      }
      if(this.flipWidth == undefined)
      {
         this.flipWidth = 68;
      }
      if(this["aso#23467"] != _loc6_)
      {
         this.holderMc._xscale = -100 * this["aso#93522"];
         if(!this.prevflipH)
         {
            this.holderMc._x += this.flipWidth * this["aso#93522"];
            this.prevflipH = true;
         }
      }
      else
      {
         this.holderMc._xscale = 100 * this["aso#93522"];
         if(this.prevflipH)
         {
            this.holderMc._x -= this.flipWidth * this["aso#93522"];
            this.prevflipH = false;
         }
      }
   }
   function isWalkElement(§aso#65940§)
   {
      var _loc2_ = com["aso#35445"].habbo.avatar.AvatarImage["aso#78339"].length;
      var _loc1_ = 0;
      while(_loc1_ < _loc2_)
      {
         if(com["aso#35445"].habbo.avatar.AvatarImage["aso#78339"][_loc1_] == §aso#65940§)
         {
            return true;
         }
         _loc1_ = _loc1_ + 1;
      }
      return false;
   }
   function §aso#27222§()
   {
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo.avatar.AvatarImage["aso#03687"].length)
      {
         this["aso#08284"](com["aso#35445"].habbo.avatar.AvatarImage["aso#03687"][_loc2_]);
         _loc2_ = _loc2_ + 1;
      }
   }
   function §aso#15665§()
   {
      this.nextAnimationFrame();
      this["aso#50207"]();
   }
   function getAvatarImage(§set§, figure, action, gesture, direction, headDirection, animationFrame)
   {
      this.partSet = §set§;
      this.figure = figure;
      this.setAction(action);
      this.setGesture(gesture);
      this.setDirection(direction);
      this.setHeadDirection(headDirection);
      this.setAnimationFrame(animationFrame);
   }
   function setAction(§aso#03266§)
   {
      if(§aso#03266§ == null)
      {
         §aso#03266§ = com["aso#35445"].habbo.avatar.AvatarImage["aso#63156"];
      }
      §aso#03266§ = §aso#03266§.toLowerCase();
      var _loc7_ = §aso#03266§.split(",");
      for(var _loc8_ in _loc7_)
      {
         var _loc3_ = new Array();
         var _loc2_ = _loc7_[_loc8_];
         var _loc5_ = _loc2_;
         if(_loc2_ == "wlk")
         {
            _loc3_.push("bd","lg","lh","rh","ls","rs","sh");
         }
         if(_loc2_ == "sit")
         {
            _loc3_.push("bd","lg","sh");
         }
         if(_loc2_ == "lay")
         {
            _loc3_ = com["aso#35445"].habbo.avatar.AvatarImage["aso#18870"];
         }
         if(_loc2_ == "wav")
         {
            _loc3_.push("ls","lh");
         }
         if(_loc2_.substr(0,3) == "cri" || _loc2_.substr(0,3) == "crr")
         {
            _loc3_.push("rs","rh","ri");
            var _loc6_ = undefined;
            if((_loc6_ = _loc2_.indexOf("=")) >= 0)
            {
               this.handItem = _loc2_.substring(_loc6_ + 1);
               _loc5_ = _loc2_.substring(0,_loc6_);
            }
         }
         if(_loc2_ == "spk")
         {
            _loc3_.push("fc","hd","hr");
         }
         var _loc4_ = 0;
         while(_loc4_ < _loc3_.length)
         {
            this.actions.push(_loc3_[_loc4_],_loc5_);
            _loc4_ = _loc4_ + 1;
         }
      }
   }
   function setGesture(gesture)
   {
      if(gesture != null)
      {
         this.actions.push("ey",gesture);
         this.actions.push("fc",gesture);
      }
   }
   function setAnimationFrame(af)
   {
      this.animationFrame = af;
   }
   function nextAnimationFrame()
   {
      this.pAction = "wlk";
      this.animationFrame += 1;
      if(this.animationFrame >= 4)
      {
         this.animationFrame = 0;
      }
   }
   function setDirection(d)
   {
      this["aso#23467"] = d % 8;
   }
   function setHeadDirection(d)
   {
      this.headDirection = d % 8;
   }
   function setDestination()
   {
   }
}
