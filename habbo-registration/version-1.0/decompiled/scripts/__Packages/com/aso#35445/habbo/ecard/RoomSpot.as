class com.§aso#35445§.habbo.ecard.RoomSpot extends MovieClip
{
   var onPress;
   var onRelease;
   var onReleaseOutside;
   var mFree;
   var mRolloverFlag;
   var mCloseSpots;
   var onMouseMove;
   var onUnload;
   function RoomSpot()
   {
      super();
      this.onPress = this.Press;
      this.onRelease = this.onButtonRelease;
      this.onReleaseOutside = this.onButtonRelease;
      this._alpha = 0;
      this.mFree = true;
      this.mRolloverFlag = false;
      this.mCloseSpots = new Object();
      this.onMouseMove = this.mouseMove;
      com["aso#35445"].habbo.ecard.FurniManager.getInstance().registerSpot(this);
      var owner = this;
      this.onUnload = function()
      {
         owner["aso#68174"]();
      };
   }
   function §aso#68174§()
   {
      com["aso#35445"].habbo.ecard.FurniManager.getInstance().unregisterSpot(this);
      this.mCloseSpots = undefined;
      this.onPress = undefined;
      this.onRelease = undefined;
      this.onReleaseOutside = undefined;
      this.onMouseMove = undefined;
   }
   function getName()
   {
      return this._name;
   }
   function getX()
   {
      return this.getCoordinates().x;
   }
   function setSpotReservation(aVal)
   {
      this.mFree = !aVal;
   }
   function isFree()
   {
      return this.mFree;
   }
   function getY()
   {
      return this.getCoordinates().y;
   }
   function setFreeState(§aso#66361§)
   {
      this.mFree = §aso#66361§;
   }
   function setCloseSpot(aSpot2, aDirection)
   {
      this.mCloseSpots[aDirection] = aSpot2;
   }
   function mouseMove()
   {
      if(this.hitTest(_root._xmouse,_root._ymouse,true))
      {
         if(!this.mRolloverFlag)
         {
            this.mRolloverFlag = true;
            this.rollOver();
         }
      }
      else
      {
         this.mRolloverFlag = false;
         this.rollOut();
      }
   }
   function Press()
   {
      com["aso#35445"].common.util.EventRelay.sendEvent(new com["aso#35445"].common.util.Event("SpotPress",this.getCoordinates(),null));
   }
   function onButtonRelease()
   {
   }
   function rollOver()
   {
      _root.button_holder.debugger = this._name;
      this._alpha = 100;
      if(this.mFree)
      {
         com["aso#35445"].common.util.EventRelay.sendEvent(new com["aso#35445"].common.util.Event("SpotRollover",this.getCoordinates(),null));
      }
   }
   function rollOut()
   {
      this._alpha = 0;
      com["aso#35445"].common.util.EventRelay.sendEvent(new com["aso#35445"].common.util.Event("SpotRollout",this.getCoordinates(),null));
   }
   function getCoordinates()
   {
      return {x:this._x,y:this._y,name:this._name};
   }
   function getCloseFreeSpot()
   {
      var _loc3_ = undefined;
      var _loc4_ = ["above","below","right","left"];
      var _loc2_ = 0;
      while(_loc2_ < 10)
      {
         _loc3_ = this.mCloseSpots[_loc4_[random(4)]];
         if(_loc3_.isFree())
         {
            return _loc3_;
         }
         _loc2_ = _loc2_ + 1;
      }
      return undefined;
   }
}
