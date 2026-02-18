class com.sulake.badgeeditor.SendToServer
{
   function SendToServer()
   {
   }
   static function sendData()
   {
      var _loc2_ = undefined;
      var _loc6_ = [];
      var _loc5_ = [];
      var _loc4_ = [];
      _loc2_ = 5;
      while(_loc2_ > 0)
      {
         _loc6_.push(com.sulake.badgeeditor.SendToServer.addLead(_root["colorset_" + _loc2_].getColorNum()));
         if(_loc2_ == 5)
         {
            _loc5_.push("X");
         }
         else
         {
            _loc5_.push(_root["positionSet" + _loc2_].getPositionNum() - 1);
         }
         if(_loc2_ == 5)
         {
            _loc4_.push("b" + com.sulake.badgeeditor.SendToServer.addLead(_root["previewSet" + _loc2_].getSymbolNum()));
         }
         else
         {
            _loc4_.push("s" + com.sulake.badgeeditor.SendToServer.addLead(_root["previewSet" + _loc2_].getSymbolNum()));
         }
         _loc2_ = _loc2_ - 1;
      }
      var _loc3_ = "";
      _loc2_ = 0;
      while(_loc2_ < 5)
      {
         if(_loc4_[_loc2_] != "b" && _loc4_[_loc2_] != "s")
         {
            _loc3_ += String(_loc4_[_loc2_]);
            _loc3_ += String(_loc6_[_loc2_]);
            _loc3_ += String(_loc5_[_loc2_]);
         }
         _loc2_ = _loc2_ + 1;
      }
      var _loc9_ = "__app_key";
      var _loc8_ = "";
      if(_root.__app_key != undefined)
      {
         _loc8_ = _root.__app_key;
      }
      else
      {
         _loc8_ = "";
      }
      if(_root.post_url != undefined)
      {
         var _loc7_ = new LoadVars();
         _loc7_.groupId = _root.groupId;
         _loc7_.code = _loc3_;
         _loc7_.__app_key = _loc8_;
         _loc7_.onData = function(aData)
         {
            com.sulake.badgeeditor.SendToServer.onDataCame(aData);
         };
         _root.debugField += "loadvars " + _loc7_.send(_root.post_url,"_self","POST");
         _root.debugField += _root.post_url + " groupId=" + _loc7_.groupId;
      }
      else
      {
         _root.debugField = "not post_url";
         trace("send:groupId=" + _root.groupId + "&" + "code=" + _loc3_ + "&" + _loc9_ + "=" + _loc8_);
      }
   }
   static function onDataCame(aData)
   {
      _root.debugField += "data came" + aData;
   }
   static function addLead(aNum)
   {
      if(aNum == -1)
      {
         return "";
      }
      if(aNum < 10)
      {
         return "0" + aNum;
      }
      return String(aNum);
   }
}
