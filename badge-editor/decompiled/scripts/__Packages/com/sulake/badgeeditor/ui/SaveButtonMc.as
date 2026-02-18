class com.sulake.badgeeditor.ui.SaveButtonMc extends MovieClip
{
   var onPress;
   function SaveButtonMc()
   {
      super();
      this.onPress = this.clickOn;
   }
   function clickOn()
   {
      com.sulake.badgeeditor.SendToServer.sendData();
   }
}
