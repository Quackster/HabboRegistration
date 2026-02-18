class com.sulake.common.Coloring
{
   function Coloring()
   {
   }
   static function SetMcColor(aMc, aColorData)
   {
      var _loc1_ = undefined;
      if(aColorData.type == "hex")
      {
         _loc1_ = com.sulake.common.Coloring.getHexTransform(aColorData.data);
      }
      var _loc2_ = new Color(aMc);
      _loc2_.setTransform(_loc1_);
   }
   static function getHexTransform(aHexString)
   {
      var _loc3_ = aHexString.substring(0,2);
      var _loc1_ = aHexString.substring(2,4);
      var _loc2_ = aHexString.substring(4,6);
      _loc3_ = parseInt(_loc3_,16);
      _loc1_ = parseInt(_loc1_,16);
      _loc2_ = parseInt(_loc2_,16);
      _loc3_ = _loc3_ / 255 * 100;
      _loc1_ = _loc1_ / 255 * 100;
      _loc2_ = _loc2_ / 255 * 100;
      var _loc5_ = {ra:_loc3_,rb:0,ga:_loc1_,gb:0,ba:_loc2_,bb:0,aa:100,ab:0};
      return _loc5_;
   }
}
