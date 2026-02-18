class com.sulake.habbo.avatar.dance.DanceData
{
   var danceDataXML;
   static var instance;
   var mDanceDataUrl = "dance_data.xml";
   function DanceData()
   {
      var owner = this;
      this.danceDataXML = new XML();
      this.danceDataXML.ignoreWhite = true;
      this.danceDataXML.onLoad = function(success)
      {
         owner.danceDataLoaded(success);
      };
      this.danceDataXML.load(this.mDanceDataUrl);
   }
   static function getInstance()
   {
      if(com.sulake.habbo.avatar.dance.DanceData.instance == null)
      {
         com.sulake.habbo.avatar.dance.DanceData.instance = new com.sulake.habbo.avatar.dance.DanceData();
      }
      return com.sulake.habbo.avatar.dance.DanceData.instance;
   }
   function injectXmlData(aData)
   {
      this.danceDataXML = aData;
      this.danceDataXML.ignoreWhite = true;
      this.danceDataLoaded(true);
   }
   function danceDataLoaded()
   {
   }
   function getDanceFrame(aDanceNumber, aFrame)
   {
      var tReturnObj = new Object();
      var tDance = this.danceDataXML.firstChild.childNodes[aDanceNumber].childNodes;
      var tLen = this.danceDataXML.firstChild.childNodes[aDanceNumber].childNodes.length;
      var tPart;
      var i = 0;
      while(i < tLen)
      {
         tPart = tDance[i];
         var tMainPart = tPart.attributes.name;
         var tData = tPart.firstChild.toString().split("#");
         var tAction = tData[1].split(",")[aFrame];
         var tActFrame = Number(tData[2].split(",")[aFrame]);
         var tXfix = Number(tData[3].split(",")[aFrame]);
         var tYfix = Number(tData[4].split(",")[aFrame]);
         var tDirFix = Number(tData[5].split(",")[aFrame]);
         tReturnObj.frameCount = tData[1].split(",").length;
         tReturnObj[tMainPart] = {action:tAction,actFrame:tActFrame,xFix:tXfix,yFix:tYfix,dirFix:tDirFix};
         i++;
      }
      return tReturnObj;
   }
}
