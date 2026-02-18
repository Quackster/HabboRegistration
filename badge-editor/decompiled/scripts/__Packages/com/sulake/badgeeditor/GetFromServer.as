class com.sulake.badgeeditor.GetFromServer
{
   function GetFromServer()
   {
   }
   static function getData(aData)
   {
      var _loc1_ = 0;
      var _loc3_ = undefined;
      var _loc9_ = undefined;
      var _loc10_ = undefined;
      var _loc12_ = false;
      var _loc7_ = 4;
      var _loc2_ = undefined;
      var _loc8_ = undefined;
      var _loc5_ = 0;
      while(_loc5_ < 5)
      {
         _loc3_ = aData.substring(_loc1_,_loc1_ + 3);
         _loc1_ += 3;
         _loc10_ = aData.substring(_loc1_,_loc1_ + 2);
         _loc1_ += 2;
         _loc9_ = aData.substring(_loc1_,_loc1_ + 1);
         _loc1_ += 1;
         _loc8_ = Number(_loc3_.substring(1,3));
         if(_loc3_.substring(0,1) == "b")
         {
            _loc2_ = 5;
            _loc12_ = true;
         }
         else
         {
            _loc2_ = _loc7_;
            _loc7_ = _loc7_ - 1;
         }
         if(_loc3_ == "")
         {
            com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("GraphicChange",{setNumber:_loc2_,type:"set",number:-1},null));
            com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("ColorPreset",{setNumber:_loc2_,colorNum:1},null));
         }
         else
         {
            var _loc4_ = parseInt(_loc9_) + 1;
            com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("ColorPreset",{setNumber:_loc2_,colorNum:parseInt(_loc10_)},null));
            com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("PositionPreset",{setNumber:_loc2_,position:_loc4_},null));
            com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("PositionChange",{setNumber:_loc2_,position:_loc4_},null));
            com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("GraphicChange",{setNumber:_loc2_,type:"set",number:_loc8_},null));
         }
         _loc5_ = _loc5_ + 1;
      }
      if(!_loc12_)
      {
         com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("GraphicChange",{setNumber:5,type:"set",number:-1},null));
         com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("ColorPreset",{setNumber:5,colorNum:1},null));
      }
   }
}
