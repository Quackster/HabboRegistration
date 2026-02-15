class com.§aso#35445§.habbo.ecard.FurniManager
{
   var roomSpots;
   var checkProximityCallbackId;
   static var classInstance = null;
   static var SPOT_DISTANCE_Y = 38;
   static var SPOT_DISTANCE_X = 72;
   static var ROUNDING_VALUE = 4;
   function FurniManager()
   {
      this.roomSpots = new Object();
      this.checkProximityCallbackId = setInterval(this,"findCloseSpotsForAllSpots",50);
   }
   static function getInstance()
   {
      if(com["aso#35445"].habbo.ecard.FurniManager.classInstance == null)
      {
         com["aso#35445"].habbo.ecard.FurniManager.classInstance = new com["aso#35445"].habbo.ecard.FurniManager();
      }
      return com["aso#35445"].habbo.ecard.FurniManager.classInstance;
   }
   function registerSpot(aSpot)
   {
      var _loc2_ = aSpot.getName();
      this.roomSpots[_loc2_] = aSpot;
   }
   function unregisterSpot(aSpot)
   {
      var _loc2_ = aSpot.getName();
      this.roomSpots[_loc2_] = undefined;
   }
   function setSpotState(§aso#97698§, aFree)
   {
      this.roomSpots[§aso#97698§].setFreeState(aFree);
   }
   function getFreeSpot()
   {
      for(var _loc3_ in this.roomSpots)
      {
         var _loc2_ = this.roomSpots[_loc3_];
         if(_loc2_.isFree() && random(20) == 3)
         {
            return _loc2_;
         }
      }
   }
   function getSpotByCoordinates(§aso#45610§, aY)
   {
      var _loc3_ = undefined;
      for(var _loc4_ in this.roomSpots)
      {
         _loc3_ = this.roomSpots[_loc4_];
         var _loc2_ = _loc3_.getCoordinates();
         if(Math.abs(_loc2_.x - §aso#45610§) < com["aso#35445"].habbo.ecard.FurniManager.ROUNDING_VALUE * 4 && Math.abs(_loc2_.y - aY) < com["aso#35445"].habbo.ecard.FurniManager.ROUNDING_VALUE * 4)
         {
            return _loc3_;
         }
      }
   }
   function reserveSpot(tX, tY, §aso#66361§)
   {
      this.getSpotByCoordinates(tX,tY).setSpotReservation(§aso#66361§);
   }
   function findCloseSpotsForAllSpots()
   {
      for(var _loc2_ in this.roomSpots)
      {
         this.findCloseSpots(this.roomSpots[_loc2_]);
      }
   }
   function findCloseSpots(aSpot)
   {
      clearInterval(this.checkProximityCallbackId);
      var _loc2_ = undefined;
      for(var _loc4_ in this.roomSpots)
      {
         _loc2_ = this.roomSpots[_loc4_];
         this.checkSpotProximity(aSpot,_loc2_);
      }
   }
   function checkSpotProximity(aSpot, aSpot2)
   {
      if(aSpot == aSpot2)
      {
         return undefined;
      }
      var _loc8_ = false;
      var _loc5_ = false;
      var _loc7_ = false;
      var _loc6_ = false;
      var _loc2_ = aSpot.getX() - aSpot2.getX();
      var _loc1_ = aSpot.getY() - aSpot2.getY();
      if(_loc2_ < com["aso#35445"].habbo.ecard.FurniManager.SPOT_DISTANCE_X && _loc2_ > 0)
      {
         _loc6_ = true;
      }
      if(- _loc2_ < com["aso#35445"].habbo.ecard.FurniManager.SPOT_DISTANCE_X && _loc2_ < 0)
      {
         _loc7_ = true;
      }
      if(_loc1_ < com["aso#35445"].habbo.ecard.FurniManager.SPOT_DISTANCE_Y && _loc1_ > 0)
      {
         _loc5_ = true;
      }
      if(- _loc1_ < com["aso#35445"].habbo.ecard.FurniManager.SPOT_DISTANCE_Y && _loc1_ < 0)
      {
         _loc8_ = true;
      }
      if(Math.abs(_loc2_) < com["aso#35445"].habbo.ecard.FurniManager.ROUNDING_VALUE && _loc5_ == true)
      {
         aSpot.setCloseSpot(aSpot2,"above");
      }
      if(Math.abs(_loc2_) < com["aso#35445"].habbo.ecard.FurniManager.ROUNDING_VALUE && _loc8_ == true)
      {
         aSpot.setCloseSpot(aSpot2,"below");
      }
      if(Math.abs(_loc1_) < com["aso#35445"].habbo.ecard.FurniManager.ROUNDING_VALUE && _loc7_ == true)
      {
         aSpot.setCloseSpot(aSpot2,"right");
      }
      if(Math.abs(_loc1_) < com["aso#35445"].habbo.ecard.FurniManager.ROUNDING_VALUE && _loc6_ == true)
      {
         aSpot.setCloseSpot(aSpot2,"left");
      }
   }
}
