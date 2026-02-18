class com.sulake.badgeeditor.ui.ColorSelectorSet extends MovieClip
{
   var mSetNumber;
   var mColorNumber;
   var pointerMc;
   function ColorSelectorSet()
   {
      super();
      var _loc3_ = this._name.length;
      this.mSetNumber = parseInt(this._name.substring(_loc3_ - 1,_loc3_));
      this.mColorNumber = 1;
   }
   function colorClicked(aColorMc, aColorNumber)
   {
      this.pointerMc._x = aColorMc._x;
      this.pointerMc._y = aColorMc._y;
      com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("ColorChange",{setNumber:this.mSetNumber,color:aColorMc.getColor()},null));
      this.mColorNumber = aColorNumber;
   }
   function getColorNum()
   {
      return this.mColorNumber;
   }
   function getSetNumber()
   {
      return this.mSetNumber;
   }
}
