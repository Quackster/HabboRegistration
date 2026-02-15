class com.§aso#35445§.habbo.avatar.§aso#63577§
{
   var §aso#02295§;
   var §aso#56196§;
   function §aso#63577§(mc)
   {
      this["aso#02295"] = mc;
      com["aso#35445"].habbo.avatar.FigureData.getInstance();
      this["aso#56196"] = new Object();
   }
   function §aso#68174§()
   {
      this["aso#56196"] = undefined;
   }
   function changePartColor(tName, tPart, §aso#99511§)
   {
      var _loc2_ = this["aso#56196"][tName];
      _loc2_.changeBodypartColor(tPart,§aso#99511§);
      _loc2_["aso#50207"]();
   }
   function §aso#70958§(tName, tMainPartName, §aso#47973§)
   {
      var _loc4_ = this["aso#56196"][tName];
      _loc4_["aso#08284"](tMainPartName);
      var _loc2_ = 3;
      while(_loc2_ < §aso#47973§.length)
      {
         _loc4_["aso#20262"](§aso#47973§[_loc2_][0],§aso#47973§[_loc2_][1],§aso#47973§[1],tMainPartName);
         _loc2_ = _loc2_ + 1;
      }
      _loc4_["aso#50207"]();
   }
   function §aso#18449§(tName, tLook, tScale, tMoving)
   {
      var _loc3_ = com["aso#35445"].habbo["aso#66782"]["aso#32240"].parseLookString(tLook[0]);
      var _loc2_ = undefined;
      if(tMoving)
      {
         _loc2_ = new com["aso#35445"].habbo.avatar.MovingAvatar(this["aso#02295"],tName,tScale);
      }
      else
      {
         _loc2_ = new com["aso#35445"].habbo.avatar.AvatarImage(this["aso#02295"],tName,tScale);
      }
      this["aso#69145"](_loc2_,_loc3_,tLook[1]);
      _loc2_["aso#50207"]();
      this["aso#56196"][tName] = _loc2_;
      return true;
   }
   function getAvatar(tName)
   {
      return this["aso#56196"][tName];
   }
   function rotateAvatar(tName, tDir)
   {
      var _loc2_ = this["aso#56196"][tName];
      _loc2_.rotateAvatar(tDir);
   }
   function §aso#69145§(§aso#09255§, tLookArray, §aso#12881§)
   {
      var _loc3_ = 0;
      while(_loc3_ < tLookArray.length)
      {
         var _loc2_ = com["aso#35445"].habbo.avatar.FigureData.getInstance().getPartAndColor(tLookArray[_loc3_],§aso#12881§);
         var _loc5_ = _loc2_[0];
         var _loc4_ = _loc2_[1];
         var _loc1_ = 2;
         while(_loc1_ < _loc2_.length)
         {
            §aso#09255§["aso#20262"](_loc2_[_loc1_][0],_loc2_[_loc1_][1],_loc5_,_loc4_);
            _loc1_ = _loc1_ + 1;
         }
         _loc3_ = _loc3_ + 1;
      }
      return true;
   }
}
