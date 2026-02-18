class com.sulake.badgeeditor.ui.PositionSelectorMc extends MovieClip implements com.sulake.common.util.EventRelayListener
{
   var mSelectedSlot;
   var mSetNumber;
   var selectorMc;
   function PositionSelectorMc()
   {
      super();
      this.mSelectedSlot = 5;
      var _loc3_ = this._name.length;
      this.mSetNumber = parseInt(this._name.substring(_loc3_ - 1,_loc3_));
      com.sulake.common.util.EventRelay.addListener(this,"PositionPreset");
      com.sulake.common.util.EventRelay.addListener(this,"UiSetStatus");
   }
   function setUiEnabled(aType)
   {
      if(aType == "enable")
      {
         this._alpha = 100;
         this.selectorMc._alpha = 100;
      }
      else if(aType == "disable")
      {
         this._alpha = 40;
         this.selectorMc._alpha = 40;
      }
      var _loc2_ = 1;
      while(_loc2_ <= 9)
      {
         this["slot" + _loc2_].setUiEnabled(aType);
         _loc2_ = _loc2_ + 1;
      }
   }
   function slotClicked(aSlotMc)
   {
      this.selectorMc._x = aSlotMc._x;
      this.selectorMc._y = aSlotMc._y;
      var _loc4_ = aSlotMc._name.length;
      var _loc3_ = parseInt(aSlotMc._name.substring(_loc4_ - 1,_loc4_));
      com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("PositionChange",{setNumber:this.mSetNumber,position:_loc3_},null));
      this.mSelectedSlot = _loc3_;
   }
   function getPositionNum()
   {
      return this.mSelectedSlot;
   }
   function receiveEvent(event)
   {
      var _loc3_ = event.getTopic();
      var _loc2_ = event.getData();
      if(_loc2_.setNumber != this.mSetNumber)
      {
         return undefined;
      }
      if(_loc3_ == "PositionPreset")
      {
         this.mSelectedSlot = _loc2_.position;
         this.selectorMc._x = this["slot" + this.mSelectedSlot]._x;
         this.selectorMc._y = this["slot" + this.mSelectedSlot]._y;
      }
      if(_loc3_ == "UiSetStatus")
      {
         this.setUiEnabled(_loc2_.type);
      }
   }
}
