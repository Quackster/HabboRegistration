class com.sulake.habbo.avatar.DrawOrder
{
   var mDownloadURL;
   var mDrawOrder;
   var mXML;
   var mDownloadCount;
   var mIsDataLoaded;
   static var instance;
   static var MAX_DOWNLOAD_RETRIES = 5;
   function DrawOrder(aUrl)
   {
      if(aUrl.length < 2 || aUrl == undefined)
      {
         aUrl = "draworder.xml";
      }
      this.mDownloadURL = aUrl;
      this.mDrawOrder = new Object();
      this.mXML = new XML();
      this.mXML.ignoreWhite = true;
      this.mDownloadCount = 0;
      var owner = this;
      this.mXML.onLoad = function(aSuccess)
      {
         owner.xmlLoaded(aSuccess);
      };
      this.mXML.load(this.mDownloadURL);
   }
   static function getInstance(aUrl)
   {
      if(com.sulake.habbo.avatar.DrawOrder.instance == null)
      {
         com.sulake.habbo.avatar.DrawOrder.instance = new com.sulake.habbo.avatar.DrawOrder(aUrl);
      }
      return com.sulake.habbo.avatar.DrawOrder.instance;
   }
   function injectXmlData(aData)
   {
      this.mXML = aData;
      this.mXML.ignoreWhite = true;
      this.xmlLoaded(true);
   }
   function xmlLoaded(aSuccess)
   {
      if(aSuccess == false)
      {
         this.mDownloadCount++;
         if(this.mDownloadCount <= com.sulake.habbo.avatar.DrawOrder.MAX_DOWNLOAD_RETRIES)
         {
            trace("Draworder loading failed, retry " + this.mDownloadCount + " / " + com.sulake.habbo.avatar.DrawOrder.MAX_DOWNLOAD_RETRIES);
            this.mXML.load(this.mDownloadURL);
            return undefined;
         }
         trace("Draworder loading failed completely");
         return undefined;
      }
      var tXMLObj = new it.sephiroth.XMLObject();
      var tAs2Obj = tXMLObj.parseXML(this.mXML,true);
      this.saveData(tAs2Obj);
      this.mIsDataLoaded = true;
   }
   function isLoaded()
   {
      return this.mIsDataLoaded;
   }
   function saveData(aDataObj)
   {
      this.mDrawOrder = aDataObj;
   }
   function getOrderArray(aDir, aAction)
   {
      if(this.isLoaded() == false)
      {
         return [];
      }
      aAction = "std";
      var tActionNode = this.getActionNode(aAction);
      var tDirectionNode = this.getDirectionNode(tActionNode,aDir);
      var tDirArr = this.getMinimalDirectionArray(tDirectionNode);
      return tDirArr;
   }
   function getActionNode(aAction)
   {
      var tActionArr = this.mDrawOrder.actionSet[0].action;
      var i = 0;
      while(i < tActionArr.length)
      {
         if(tActionArr[i].attributes.id == aAction)
         {
            return tActionArr[i];
         }
         i++;
      }
   }
   function getDirectionNode(aActionNode, aDir)
   {
      var tAllDirectionsArray = aActionNode.direction;
      var i = 0;
      while(i < tAllDirectionsArray.length)
      {
         if(tAllDirectionsArray[i].attributes.id == String(aDir))
         {
            return tAllDirectionsArray[i];
         }
         i++;
      }
   }
   function getMinimalDirectionArray(aDirNode)
   {
      var tReturnArr = [];
      var tDirNodeArr = aDirNode.partList[0].part;
      var i = 0;
      while(i < tDirNodeArr.length)
      {
         tReturnArr.push(tDirNodeArr[i].attributes["set-type"]);
         i++;
      }
      return tReturnArr;
   }
}
