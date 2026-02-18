class com.§aso#35445§.habbo.Localization
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
      this.localizationXML.onLoad = function(§aso#01874§)
      {
         owner["aso#93101"](§aso#01874§);
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
      if(com["aso#35445"].habbo.Localization.localizationInstance == null)
      {
         com["aso#35445"].habbo.Localization.localizationInstance = new com["aso#35445"].habbo.Localization();
      }
      return com["aso#35445"].habbo.Localization.localizationInstance;
   }
   function §aso#93101§(tSuccess)
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
