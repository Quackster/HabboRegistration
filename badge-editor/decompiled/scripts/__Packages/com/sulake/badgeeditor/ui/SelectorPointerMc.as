class com.sulake.badgeeditor.ui.SelectorPointerMc extends MovieClip
{
   var onPress;
   function SelectorPointerMc()
   {
      super();
      if(this._name != "selectorMc")
      {
         this.onPress = this.clickOn;
      }
   }
   function setUiEnabled(aType)
   {
      if(aType == "enable")
      {
         this.onPress = this.clickOn;
      }
      else if(aType == "disable")
      {
         delete this.onPress;
      }
   }
   function clickOn(aSlotMc)
   {
      this._parent.slotClicked(this);
   }
}
