class com.sulake.habbo.Localization
{
   var localizationTexts;
   var localizationXML;
   static var localizationInstance = null;
   function Localization()
   {
      this.localizationTexts = new Object();
      var owner = this;
      this.localizationXML = new XML();
      this.localizationXML.ignoreWhite = true;
      this.localizationXML.onLoad = function(success)
      {
         owner.localizationLoaded(success);
      };
      var _loc3_ = _root.localization_url;
      if(_loc3_ == undefined)
      {
         _loc3_ = "localization.xml";
      }
      this.localizationXML.load(_loc3_);
   }
   static function getInstance()
   {
      if(com.sulake.habbo.Localization.localizationInstance == null)
      {
         com.sulake.habbo.Localization.localizationInstance = new com.sulake.habbo.Localization();
      }
      return com.sulake.habbo.Localization.localizationInstance;
   }
   function localizationLoaded(tSuccess)
   {
      if(!tSuccess)
      {
         trace("localization loading failed, trying again");
         return undefined;
      }
      var _loc3_ = this.localizationXML.firstChild;
      var _loc6_ = _loc3_.childNodes.length;
      var _loc5_ = "";
      var _loc4_ = "";
      var _loc2_ = 0;
      while(_loc2_ < _loc6_)
      {
         _loc4_ = String(_loc3_.childNodes[_loc2_].firstChild);
         _loc5_ = String(_loc3_.childNodes[_loc2_].attributes.name);
         this.localizationTexts[_loc5_] = _loc4_;
         _loc2_ = _loc2_ + 1;
      }
   }
   function isLoaded()
   {
      return this.localizationXML.loaded;
   }
   function getText(tKey)
   {
      return this.localizationTexts[tKey];
   }
}
