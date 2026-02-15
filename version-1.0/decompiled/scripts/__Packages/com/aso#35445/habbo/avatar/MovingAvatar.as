class com.§aso#35445§.habbo.avatar.MovingAvatar extends com.§aso#35445§.habbo.avatar.AvatarImage
{
   var movingToCoordinates;
   var walkCallBackID;
   var moveCallBackID;
   var holderMc;
   var §aso#23467§;
   var prevflipH;
   static var TOLERANCE_LIMIT = 15;
   function MovingAvatar(mc, tName, tScale)
   {
      super(mc,tName,tScale);
      this.movingToCoordinates = [];
      this.walkCallBackID = setInterval(this,"aso#15665",200);
      this.moveCallBackID = setInterval(this,"aso#09676",100);
      com["aso#35445"].habbo.ecard.LoczManager.getInstance().registerObject(this.holderMc);
      com["aso#35445"].habbo.ecard.LoczManager.getInstance().setLocZ(this.holderMc);
      this.holderMc.onUnload = function()
      {
         com["aso#35445"].habbo.ecard.LoczManager.getInstance().unregisterObject(this);
      };
      this["aso#23467"] = random(8);
      var owner = this;
      this.holderMc.onPress = function()
      {
         owner.pressed();
      };
   }
   function pressed()
   {
      _root.button_holder.debugger = _root.button_holder.debugger + " " + this.movingToCoordinates[2];
   }
   function setDestination(aDest)
   {
      this.movingToCoordinates = [aDest[0] + 38,aDest[1],aDest[2]];
      this.setMoveDirection(this.movingToCoordinates);
   }
   function setMoveDirection(aDest)
   {
      var _loc7_ = 0;
      if(!this.prevflipH)
      {
         _loc7_ = 68;
      }
      var _loc9_ = this.holderMc._x + _loc7_;
      var _loc8_ = this.holderMc._y;
      var _loc4_ = true;
      var _loc5_ = true;
      var _loc3_ = _loc9_ - aDest[0];
      var _loc2_ = _loc8_ - aDest[1];
      if(Math.abs(_loc9_ - aDest[0]) < com["aso#35445"].habbo.avatar.MovingAvatar.TOLERANCE_LIMIT)
      {
         _loc4_ = false;
      }
      if(Math.abs(_loc8_ - aDest[1]) < com["aso#35445"].habbo.avatar.MovingAvatar.TOLERANCE_LIMIT * 0.4)
      {
         _loc5_ = false;
      }
      if(_loc5_ == false && _loc3_ < 0)
      {
         this.setDirection(1);
         return undefined;
      }
      if(_loc5_ == false && _loc3_ > 0)
      {
         this.setDirection(5);
         return undefined;
      }
      if(_loc4_ == false && _loc2_ < 0)
      {
         this.setDirection(3);
         return undefined;
      }
      if(_loc4_ == false && _loc2_ > 0)
      {
         this.setDirection(7);
         return undefined;
      }
      if(_loc2_ > 0 && _loc3_ > 0)
      {
         this.setDirection(6);
         return undefined;
      }
      if(_loc2_ < 0 && _loc3_ > 0)
      {
         this.setDirection(4);
         return undefined;
      }
      if(_loc2_ > 0 && _loc3_ < 0)
      {
         this.setDirection(0);
         return undefined;
      }
      if(_loc2_ < 0 && _loc3_ < 0)
      {
         this.setDirection(2);
         return undefined;
      }
      var _loc10_ = Math.abs(_loc3_) + Math.abs(_loc2_);
   }
   function walkToNextSpot()
   {
      if(this.movingToCoordinates.length = 0)
      {
         return undefined;
      }
      var _loc5_ = 0;
      if(!this.prevflipH)
      {
         _loc5_ = 68;
      }
      var _loc3_ = com["aso#35445"].habbo.ecard.FurniManager.getInstance().getSpotByCoordinates(this.holderMc._x - 38 + _loc5_,this.holderMc._y);
      if(_loc3_ == undefined)
      {
      }
      var _loc2_ = _loc3_.getCloseFreeSpot();
      if(_loc2_ == undefined)
      {
         return undefined;
      }
      var _loc4_ = _loc2_.getCoordinates();
      this.setDestination([_loc4_.x,_loc4_.y,_loc2_._name]);
   }
   function §aso#15665§()
   {
      if(this.movingToCoordinates.length == 0)
      {
         return undefined;
      }
      this.nextAnimationFrame();
      this["aso#50207"]();
   }
   function §aso#09676§()
   {
      if(this.movingToCoordinates.length == 0)
      {
         return undefined;
      }
      var _loc3_ = this.movingToCoordinates[0];
      var _loc2_ = this.movingToCoordinates[1];
      var _loc4_ = 0;
      if(!this.prevflipH)
      {
         _loc4_ = 68;
      }
      if(Math.abs(this.holderMc._x - _loc3_ + _loc4_) < 1 && Math.abs(this.holderMc._y - _loc2_) < 1)
      {
         this.stopWalking();
         return undefined;
      }
      var _loc9_ = _loc3_ - this.holderMc._x;
      var _loc8_ = _loc2_ - this.holderMc._y;
      var _loc6_ = [1,2,1,0,-1,-2,-1,0];
      var _loc5_ = [-1,0,1,2,1,0,-1,-2];
      var _loc7_ = _loc6_[this["aso#23467"]] * 2;
      this.holderMc._x += _loc7_;
      com["aso#35445"].habbo.ecard.LoczManager.getInstance().setLocZ(this.holderMc);
      this.holderMc._y += _loc5_[this["aso#23467"]] * 2;
   }
   function stopWalking()
   {
      this.movingToCoordinates = [];
   }
   function moveTo(x, y)
   {
      this.holderMc._x = x + 38;
      this.holderMc._y = y;
      com["aso#35445"].habbo.ecard.LoczManager.getInstance().setLocZ(this.holderMc);
   }
}
