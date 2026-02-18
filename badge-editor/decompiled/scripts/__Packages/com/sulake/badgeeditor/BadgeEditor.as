class com.sulake.badgeeditor.BadgeEditor
{
   var mIsReadyCallbackId;
   var description_txt;
   var symbols_header;
   var position_header;
   var colours_header;
   var base_header;
   var base_colours_header;
   var save_btn;
   var cancel_btn;
   static var classInstance;
   function BadgeEditor()
   {
      com.sulake.badgeeditor.ExternalData.getInstance();
      this.mIsReadyCallbackId = setInterval(this,"checkReadyToStart",100);
   }
   static function getInstance()
   {
      if(com.sulake.badgeeditor.BadgeEditor.classInstance == null)
      {
         com.sulake.badgeeditor.BadgeEditor.classInstance = new com.sulake.badgeeditor.BadgeEditor();
      }
      return com.sulake.badgeeditor.BadgeEditor.classInstance;
   }
   function checkReadyToStart()
   {
      var _loc3_ = com.sulake.badgeeditor.ExternalData.getInstance().isReady();
      var _loc4_ = com.sulake.habbo.Localization.getInstance().isLoaded();
      if(_loc3_ && _loc4_)
      {
         clearInterval(this.mIsReadyCallbackId);
         _root.gotoAndStop("editor");
         _root.onEnterFrame = this.setPredefinedData;
         this.doLocalize();
      }
   }
   function setPredefinedData()
   {
      var _loc2_ = undefined;
      if(_root.badge_data == undefined)
      {
         _loc2_ = "b0502Xs13181s01014";
      }
      else
      {
         _loc2_ = _root.badge_data;
      }
      com.sulake.badgeeditor.GetFromServer.getData(_loc2_);
      delete _root.onEnterFrame;
      _root.startupCover.swapDepths(1000);
      _root.startupCover.removeMovieClip();
   }
   function doLocalize()
   {
      this.description_txt = com.sulake.habbo.Localization.getInstance().getText("description_txt");
      this.symbols_header = com.sulake.habbo.Localization.getInstance().getText("symbols_header");
      this.position_header = com.sulake.habbo.Localization.getInstance().getText("position_header");
      this.colours_header = com.sulake.habbo.Localization.getInstance().getText("colours_header");
      this.base_header = com.sulake.habbo.Localization.getInstance().getText("base_header");
      this.base_colours_header = com.sulake.habbo.Localization.getInstance().getText("base_colours_header");
      this.save_btn = com.sulake.habbo.Localization.getInstance().getText("save_btn");
      this.cancel_btn = com.sulake.habbo.Localization.getInstance().getText("cancel_btn");
      _root.description_txt.text = this.description_txt;
      _root.symbols_header.text = this.symbols_header;
      _root.position_header.text = this.position_header;
      _root.colours_header.text = this.colours_header;
      _root.base_header.text = this.base_header;
      _root.base_colours_header.text = this.base_colours_header;
      _root.save_btn.text = this.save_btn;
      _root.cancel_btn.text = this.cancel_btn;
   }
   function cancelClicked()
   {
      getUrl("javascript:closeBadgeEditor();", "");
   }
}
