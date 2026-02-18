class com.sulake.habbo.avatareditor.RandomizeMenu
{
   var mHolderMc;
   var mLocX;
   var mLocY;
   var mMenuMc;
   var mEnabled;
   var mWaitIntervalId;
   function RandomizeMenu(aBaseMc, aLocX, aLocY)
   {
      this.mHolderMc = aBaseMc;
      this.mLocX = aLocX;
      this.mLocY = aLocY;
      this.mMenuMc = this.mHolderMc.createEmptyMovieClip("randomizeMenu",this.mHolderMc.getNextHighestDepth());
      var tButtonMC = this.mMenuMc.attachMovie("randomizeButtonBg","bg",this.mMenuMc.getNextHighestDepth());
      tButtonMC._x = this.mLocX;
      tButtonMC._y = this.mLocY;
      this.enableButton();
      tButtonMC.createTextField("text",2,0,0,0,0);
      var tTarget = tButtonMC.text;
      tTarget.autoSize = false;
      tTarget._width = tButtonMC._width;
      tTarget._height = 20;
      tTarget.text = com.sulake.habbo.Localization.getInstance().getText("randomize");
      tTarget.selectable = false;
      var tFormatting = new TextFormat();
      tFormatting.font = "Verdana";
      tFormatting.bold = true;
      tFormatting.align = "center";
      tTarget.setTextFormat(tFormatting);
      tTarget._y = (tButtonMC._height - tTarget._height) / 2;
      var tOwner = this;
      tButtonMC.onRelease = function()
      {
         tOwner.randomizeClicked();
      };
   }
   function enableButton()
   {
      this.mEnabled = true;
      clearInterval(this.mWaitIntervalId);
   }
   function disableButton()
   {
      this.mEnabled = false;
   }
   function randomizeClicked()
   {
      if(this.mEnabled == false)
      {
         return undefined;
      }
      this.disableButton();
      this.mWaitIntervalId = setInterval(this,"enableButton",1000);
      var tOwner = this;
      var tEvent = new com.sulake.common.util.Event("randomizeAvatar",new Object(),tOwner);
      com.sulake.common.util.EventRelay.sendEvent(tEvent);
   }
}
