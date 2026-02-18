class com.sulake.habbo.avatar.FigureData
{
   var mXML;
   var mIsDataLoaded;
   var mDownloadURL;
   var mSetTypeArr;
   var mSetArr;
   var mPaletteArr;
   static var mFigureDataInstance = null;
   static var MAX_DOWNLOAD_RETRIES = 5;
   var mDownloadCount = 0;
   function FigureData()
   {
   }
   static function getInstance()
   {
      if(com.sulake.habbo.avatar.FigureData.mFigureDataInstance == null)
      {
         com.sulake.habbo.avatar.FigureData.mFigureDataInstance = new com.sulake.habbo.avatar.FigureData();
      }
      return com.sulake.habbo.avatar.FigureData.mFigureDataInstance;
   }
   function injectXmlData(aData)
   {
      this.mXML = aData;
      this.mXML.ignoreWhite = true;
      this.xmlLoaded(true);
   }
   function setAndLoadURL(aFigureDataURL)
   {
      this.mIsDataLoaded = false;
      this.mXML = new XML();
      this.mXML.ignoreWhite = true;
      this.mDownloadURL = aFigureDataURL;
      var owner = this;
      this.mXML.onLoad = function(aSuccess)
      {
         owner.xmlLoaded(aSuccess);
      };
      this.mXML.load(this.mDownloadURL);
   }
   function xmlLoaded(aSuccess)
   {
      if(aSuccess == false)
      {
         this.mDownloadCount++;
         if(this.mDownloadCount <= com.sulake.habbo.avatar.FigureData.MAX_DOWNLOAD_RETRIES)
         {
            trace("FigureData loading failed, retry " + this.mDownloadCount + " / " + com.sulake.habbo.avatar.FigureData.MAX_DOWNLOAD_RETRIES);
            this.mXML.load(this.mDownloadURL);
            return undefined;
         }
         trace("FigureData loading failed completely");
         return undefined;
      }
      var tXMLObj = new it.sephiroth.XMLObject();
      var tAs2Obj = tXMLObj.parseXML(this.mXML,true);
      this.parseSets(tAs2Obj.figuredata[0].sets[0]);
      this.parseColors(tAs2Obj.figuredata[0].colors[0]);
      this.mIsDataLoaded = true;
   }
   function isLoaded()
   {
      return this.mIsDataLoaded;
   }
   function getSetTypes()
   {
      return this.mSetTypeArr;
   }
   function getSetForId(aId)
   {
      var i = 0;
      while(i < this.mSetArr.length)
      {
         if(this.mSetArr[i].getSetId() == aId)
         {
            return this.mSetArr[i];
         }
         i++;
      }
      trace("Set not found for ID: " + aId);
      return null;
   }
   function getSetsForSetType(aSetType, aGender, aUseExtendedSets, aOnlySelectableSets)
   {
      if(aUseExtendedSets == undefined)
      {
         aUseExtendedSets = true;
      }
      if(aOnlySelectableSets == undefined)
      {
         aOnlySelectableSets = true;
      }
      var tSets = new Array();
      var i = 0;
      while(i < this.mSetArr.length)
      {
         var tSet = this.mSetArr[i];
         if(aOnlySelectableSets == false || tSet.isSelectable() == true)
         {
            if(tSet.getSetType() == aSetType)
            {
               if(tSet.getGender() == aGender || tSet.getGender() == "U")
               {
                  if(aUseExtendedSets == true || tSet.isClubOnly() == false && aUseExtendedSets == false)
                  {
                     tSets.push(tSet);
                  }
               }
            }
         }
         i++;
      }
      return tSets;
   }
   function getPaletteIdForSetType(aSetType)
   {
      var i = 0;
      while(i < this.mSetArr.length)
      {
         var tSet = this.mSetArr[i];
         if(tSet.getSetType() == aSetType)
         {
            return tSet.getPaletteId();
         }
         i++;
      }
   }
   function getPartsForSetId(aSetId)
   {
      var i = 0;
      while(i < this.mSetArr.length)
      {
         if(this.mSetArr[i].getSetId() == aSetId)
         {
            return this.mSetArr[i].getParts();
         }
         i++;
      }
   }
   function getColorsForPaletteId(aPaletteId, aUseClub, aOnlySelectable)
   {
      var tPaletteArr = new Array();
      if(aUseClub == undefined)
      {
         aUseClub = true;
      }
      if(aOnlySelectable == undefined)
      {
         aOnlySelectable = true;
      }
      var i = 0;
      while(i < this.mPaletteArr.length)
      {
         var tColor = this.mPaletteArr[i];
         if(tColor.isSelectable() == true || aOnlySelectable == false)
         {
            if(tColor.getPaletteId() == aPaletteId)
            {
               var tClubColor = tColor.isClubOnly();
               if(aUseClub || aUseClub == false && tClubColor == false)
               {
                  tPaletteArr.push(tColor);
               }
            }
         }
         i++;
      }
      return tPaletteArr;
   }
   function getColorData(aColorId)
   {
      var i = 0;
      while(i < this.mPaletteArr.length)
      {
         var tColorData = this.mPaletteArr[i];
         if(tColorData.getID() == aColorId)
         {
            return tColorData;
         }
         i++;
      }
   }
   function isSetTypeMandatory(aSetType)
   {
      var i = 0;
      while(i < this.mSetTypeArr.length)
      {
         var tSetType = this.mSetTypeArr[i][0];
         var tMandatory = this.mSetTypeArr[i][1];
         if(tSetType == aSetType)
         {
            return tMandatory;
         }
         i++;
      }
   }
   function parseColors(aColorsNode)
   {
      this.mPaletteArr = new Array();
      var tPalettes = aColorsNode.palette;
      var i = 0;
      while(i < tPalettes.length)
      {
         var tPaletteNode = tPalettes[i];
         var tPaletteID = tPaletteNode.attributes.id;
         var tColors = tPaletteNode.color;
         var j = 0;
         while(j < tColors.length)
         {
            var tColorNode = tColors[j];
            var tColorId = tColorNode.attributes.id;
            var tColorIndex = tColorNode.attributes.index;
            var tClubOnly = tColorNode.attributes.club == 1;
            var tSelectable = tColorNode.attributes.selectable == 1;
            var tColor = tColorNode.data;
            var tColorInstance = new com.sulake.habbo.avatar.FigureDataColor(tPaletteID,tColor,tColorId,tColorIndex,tClubOnly,tSelectable);
            this.mPaletteArr.push(tColorInstance);
            j++;
         }
         i++;
      }
   }
   function parseSets(aSetsNode)
   {
      this.mSetArr = new Array();
      this.mSetTypeArr = new Array();
      var tSetTypeNodes = aSetsNode.settype;
      var i = 0;
      while(i < tSetTypeNodes.length)
      {
         var tSetTypeNode = tSetTypeNodes[i];
         var tSetType = tSetTypeNode.attributes.type;
         var tPaletteId = tSetTypeNode.attributes.paletteid;
         var tMandatorySet = tSetTypeNode.attributes.mandatory == 1;
         this.mSetTypeArr.push(new Array(tSetType,tMandatorySet));
         var tSetNodes = tSetTypeNode["set"];
         var j = 0;
         while(j < tSetNodes.length)
         {
            var tSetNode = tSetNodes[j];
            var tSetId = tSetNode.attributes.id;
            var tGender = tSetNode.attributes.gender;
            var tSetClubOnly = tSetNode.attributes.club == 1;
            var tSetColorable = tSetNode.attributes.colorable == 1;
            var tSetIsSelectable = tSetNode.attributes.selectable;
            if(tSetIsSelectable == undefined)
            {
               tSetIsSelectable = true;
            }
            else
            {
               tSetIsSelectable == 1;
            }
            var tPartsInSet = new Array();
            var tParts = tSetNode.part;
            var k = 0;
            while(k < tParts.length)
            {
               var tPart = tParts[k];
               var tPartId = tPart.attributes.id;
               var tPartType = tPart.attributes.type;
               var tPartColorable = tPart.attributes.colorable == 1;
               var tPartsObj = new com.sulake.habbo.avatar.FigureDataPart(tPartId,tPartType,tPartColorable);
               tPartsInSet.push(tPartsObj);
               k++;
            }
            var tHiddenLayersArr = new Array();
            var tHiddenLayersNode = tSetNode.hiddenlayers;
            if(tHiddenLayersNode.length > 0)
            {
               var k = 0;
               while(k < tHiddenLayersNode[0].layer.length)
               {
                  var tLayer = tHiddenLayersNode[0].layer[k];
                  var tPartType = tLayer.attributes.parttype;
                  tHiddenLayersArr.push(tPartType);
                  k++;
               }
            }
            var tSet = new com.sulake.habbo.avatar.FigureDataSet(tSetId,tSetType,tPaletteId,tGender,tPartsInSet,tSetClubOnly,tSetIsSelectable,tSetColorable,tHiddenLayersArr);
            this.mSetArr.push(tSet);
            j++;
         }
         i++;
      }
   }
}
