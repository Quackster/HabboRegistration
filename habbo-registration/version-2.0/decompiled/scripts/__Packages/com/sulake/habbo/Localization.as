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
      var localization_url = _root.localization_url;
      if(localization_url == undefined)
      {
         localization_url = "localization.xml";
      }
      this.localizationXML.load(localization_url);
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
      var tMainNode = this.localizationXML.firstChild;
      var tKeyCount = tMainNode.childNodes.length;
      var tKey = "";
      var tValue = "";
      var i = 0;
      while(i < tKeyCount)
      {
         tValue = String(tMainNode.childNodes[i].firstChild);
         tKey = String(tMainNode.childNodes[i].attributes.name);
         this.localizationTexts[tKey] = tValue;
         i++;
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
