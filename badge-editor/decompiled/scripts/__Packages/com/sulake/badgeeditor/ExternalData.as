class com.sulake.badgeeditor.ExternalData
{
   var mDataUrl;
   var mDataXML;
   var mReady;
   var mData;
   static var classInstance;
   function ExternalData()
   {
      if(_root.xml_url == undefined)
      {
         this.mDataUrl = "conf.xml";
      }
      else
      {
         this.mDataUrl = _root.xml_url;
      }
      this.mDataXML = new XML();
      this.mDataXML.ignoreWhite = true;
      var owner = this;
      this.mDataXML.onLoad = function(success)
      {
         owner.dataLoaded(success);
      };
      this.mDataXML.load(this.mDataUrl);
      this.mReady = false;
      this.mData = new Object();
   }
   static function getInstance()
   {
      if(com.sulake.badgeeditor.ExternalData.classInstance == null)
      {
         com.sulake.badgeeditor.ExternalData.classInstance = new com.sulake.badgeeditor.ExternalData();
      }
      return com.sulake.badgeeditor.ExternalData.classInstance;
   }
   function isReady()
   {
      return this.mReady;
   }
   function getVariable(aName)
   {
      return this.mData[aName];
   }
   function dataLoaded(aSuccess)
   {
      if(!aSuccess)
      {
         return undefined;
      }
      this.readData();
      this.mReady = true;
   }
   function readData()
   {
      var _loc5_ = this.mDataXML.firstChild;
      var _loc6_ = _loc5_.childNodes.length;
      var _loc4_ = undefined;
      var _loc2_ = 0;
      while(_loc2_ < _loc6_)
      {
         _loc4_ = _loc5_.childNodes[_loc2_];
         var _loc3_ = _loc2_ + 1;
         this.mData["color" + _loc3_] = String(_loc4_.firstChild);
         _loc2_ = _loc2_ + 1;
      }
   }
}
