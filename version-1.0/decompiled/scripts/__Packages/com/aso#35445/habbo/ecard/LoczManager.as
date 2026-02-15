class com.§aso#35445§.habbo.ecard.LoczManager
{
   static var mMcList;
   static var classInstance = null;
   function LoczManager()
   {
      com["aso#35445"].habbo.ecard.LoczManager.mMcList = [];
   }
   static function getInstance()
   {
      if(com["aso#35445"].habbo.ecard.LoczManager.classInstance == null)
      {
         com["aso#35445"].habbo.ecard.LoczManager.classInstance = new com["aso#35445"].habbo.ecard.LoczManager();
      }
      return com["aso#35445"].habbo.ecard.LoczManager.classInstance;
   }
   function registerObject(§aso#33632§)
   {
      com["aso#35445"].habbo.ecard.LoczManager.mMcList.push(§aso#33632§);
   }
   function unregisterObject(§aso#33632§)
   {
      var _loc2_ = com["aso#35445"].habbo.ecard.LoczManager.mMcList.length;
      var _loc1_ = 0;
      while(_loc1_ < _loc2_)
      {
         if(com["aso#35445"].habbo.ecard.LoczManager.mMcList[_loc1_] == §aso#33632§)
         {
            com["aso#35445"].habbo.ecard.LoczManager.mMcList.splice(_loc1_,1);
            return undefined;
         }
         _loc1_ = _loc1_ + 1;
      }
   }
   function setLocZ(§aso#33632§, aExtra)
   {
      if(aExtra == undefined)
      {
         aExtra = 0;
      }
      if(aExtra > 100)
      {
         return undefined;
      }
      var _loc5_ = Math.floor(§aso#33632§._y * 5 + aExtra);
      var _loc6_ = com["aso#35445"].habbo.ecard.LoczManager.mMcList.length;
      var _loc2_ = 0;
      while(_loc2_ < _loc6_)
      {
         if(com["aso#35445"].habbo.ecard.LoczManager.mMcList[_loc2_].getDepth() == _loc5_)
         {
            if(com["aso#35445"].habbo.ecard.LoczManager.mMcList[_loc2_] != §aso#33632§)
            {
               aExtra = aExtra + 1;
               this.setLocZ(§aso#33632§,aExtra);
            }
         }
         _loc2_ = _loc2_ + 1;
      }
      §aso#33632§.swapDepths(_loc5_);
   }
}
