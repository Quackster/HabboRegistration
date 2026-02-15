class com.§aso#35445§.habbo.§aso#66782§.§aso#32240§
{
   function §aso#32240§()
   {
   }
   static function parseLookString(tLook)
   {
      var _loc6_ = new Array();
      var _loc2_ = new Array();
      if(tLook.length != 25)
      {
         trace("Avatar look string not correct length");
         return _loc6_;
      }
      var _loc1_ = 0;
      while(_loc1_ < 5)
      {
         _loc2_ = [];
         var _loc4_ = tLook.substring(_loc1_ * 5,_loc1_ * 5 + 3);
         var _loc3_ = tLook.substring(_loc1_ * 5 + 3,_loc1_ * 5 + 5);
         _loc2_.push(_loc4_,_loc3_);
         _loc6_.push(_loc2_);
         _loc1_ = _loc1_ + 1;
      }
      return _loc6_;
   }
}
