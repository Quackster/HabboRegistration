class com.sulake.badgeeditor.ui.ColorSelectorSingle extends MovieClip implements com.sulake.common.util.EventRelayListener
{
   var onPress;
   var mSelectorNumber;
   var mHexColor;
   var maskMc;
   function ColorSelectorSingle()
   {
      super();
      this.onPress = this.clickOn;
      var _loc3_ = this._name.length;
      this.mSelectorNumber = parseInt(this._name.substring(_loc3_ - 2,_loc3_));
      if(!this.mSelectorNumber > 0)
      {
         this.mSelectorNumber = parseInt(this._name.substring(_loc3_ - 1,_loc3_));
      }
      var _loc4_ = com.sulake.badgeeditor.ExternalData.getInstance().getVariable("color" + this.mSelectorNumber);
      this.setColor(_loc4_);
      com.sulake.common.util.EventRelay.addListener(this,"ColorPreset");
      com.sulake.common.util.EventRelay.addListener(this,"UiSetStatus");
   }
   function clickOn()
   {
      this._parent.colorClicked(this,this.mSelectorNumber);
   }
   function setUiEnabled(aType)
   {
      if(aType == "enable")
      {
         this.onPress = this.clickOn;
         this._alpha = 100;
      }
      else if(aType == "disable")
      {
         delete this.onPress;
         this._alpha = 40;
      }
   }
   function setColor(aColor)
   {
      this.mHexColor = aColor;
      com.sulake.common.Coloring.SetMcColor(this.maskMc,{type:"hex",data:aColor});
   }
   function getColor()
   {
      return this.mHexColor;
   }
   function receiveEvent(event)
   {
      var _loc3_ = event.getTopic();
      var _loc2_ = event.getData();
      if(_loc2_.setNumber != this._parent.getSetNumber())
      {
         return undefined;
      }
      if(_loc3_ == "ColorPreset")
      {
         if(this.mSelectorNumber == _loc2_.colorNum)
         {
            this.clickOn();
         }
      }
      if(_loc3_ == "UiSetStatus")
      {
         this.setUiEnabled(_loc2_.type);
      }
   }
}
