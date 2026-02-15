class com.sulake.habbo.avatar.Figure
{
   var mFigureId;
   var mGender;
   var mFigureData;
   static var SET_SEPARATOR = ".";
   static var SET_ITEM_SEPARATOR = "-";
   function Figure(aFigureId, aGender, aFigureString)
   {
      this.mFigureId = aFigureId;
      this.setGender(aGender);
      this.parseFigureString(aFigureString);
   }
   function getFigureId()
   {
      return this.mFigureId;
   }
   function setGender(aGender)
   {
      switch(aGender)
      {
         case "M":
            this.mGender = "M";
            break;
         case "m":
            this.mGender = "M";
            break;
         case "Male":
            this.mGender = "M";
            break;
         case "male":
            this.mGender = "M";
            break;
         case "F":
            this.mGender = "F";
            break;
         case "f":
            this.mGender = "F";
            break;
         case "Female":
            this.mGender = "F";
            break;
         case "female":
            this.mGender = "F";
      }
   }
   function getGender()
   {
      return this.mGender;
   }
   function getFigureData()
   {
      return this.mFigureData;
   }
   function parseFigureString(aFigure)
   {
      this.mFigureData = new Array();
      var tSets = aFigure.split(com.sulake.habbo.avatar.Figure.SET_SEPARATOR);
      var tFigureWasParsedWithoutProblems = true;
      var i = 0;
      while(i < tSets.length)
      {
         var tSetData = tSets[i].split(com.sulake.habbo.avatar.Figure.SET_ITEM_SEPARATOR);
         if(tSetData.length != 3)
         {
            trace("Figure data was malformed, cancelling parsing!");
            this.mFigureData = new Array();
            return false;
         }
         var tSetType = tSetData[0];
         var tSetId = tSetData[1];
         var tColorId = tSetData[2];
         var tSetData = com.sulake.habbo.avatar.FigureData.getInstance().getSetForId(tSetId);
         if(tSetData != null && tSetData.isSelectable() == true)
         {
            if(tSetData.isColorable() == true)
            {
               var tColor = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tColorId);
               var tCorrectPalette = tColor.getPaletteId() == tSetData.getPaletteId();
               if(tCorrectPalette == false)
               {
                  var tValidColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tSetData.getPaletteId(),false,true);
                  var tValidColor = tValidColors[0];
                  tColorId = tValidColor.getID();
                  tFigureWasParsedWithoutProblems = false;
               }
            }
         }
         else
         {
            var tValidSets = com.sulake.habbo.avatar.FigureData.getInstance().getSetsForSetType(tSetType,this.mGender,false,true);
            var tValidSet = tValidSets[0];
            tSetId = tValidSet.getSetId();
            var tValidColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tValidSet.getPaletteId(),false,true);
            var tValidColor = tValidColors[0];
            tColorId = tValidColor.getID();
            tFigureWasParsedWithoutProblems = false;
         }
         this.setSetItem(tSetType,tSetId,tColorId);
         i++;
      }
      var tFigureWasValid = this.validateAndFixFigure();
      return tFigureWasValid == true && tFigureWasParsedWithoutProblems == true;
   }
   function getFigureString()
   {
      var tFigureStr = "";
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tColorIdStr = "";
         var tSetObj = this.mFigureData[i];
         var tSetType = tSetObj.getSetType();
         var tSetId = tSetObj.getSetId();
         var tColorId = tSetObj.getColorId();
         var tSetData = com.sulake.habbo.avatar.FigureData.getInstance().getSetForId(tSetId);
         if(tSetData != null && tSetData.isColorable() == true)
         {
            tColorIdStr = String(tColorId);
         }
         tFigureStr = tFigureStr + com.sulake.habbo.avatar.Figure.SET_SEPARATOR + tSetType + com.sulake.habbo.avatar.Figure.SET_ITEM_SEPARATOR + tSetId + com.sulake.habbo.avatar.Figure.SET_ITEM_SEPARATOR + tColorIdStr;
         i++;
      }
      tFigureStr = tFigureStr.substr(1,tFigureStr.length);
      return tFigureStr;
   }
   function setSetItem(aSetType, aSetId, aColorId)
   {
      var tObjectExists = false;
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetObj = this.mFigureData[i];
         if(tSetObj.getSetType() == aSetType)
         {
            tSetObj.setValues(aSetType,aSetId,aColorId);
            this.mFigureData[i] = tSetObj;
            tObjectExists = true;
         }
         i++;
      }
      if(tObjectExists == false)
      {
         var tSetObj = new com.sulake.habbo.avatar.FigureSetItem(aSetType,aSetId,aColorId);
         this.mFigureData.push(tSetObj);
      }
   }
   function removeSetItemByType(aSetType)
   {
      var tSpliceIndex = undefined;
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetObj = this.mFigureData[i];
         if(tSetObj.getSetType() == aSetType)
         {
            tSpliceIndex = i;
         }
         i++;
      }
      if(tSpliceIndex != undefined)
      {
         this.mFigureData.splice(tSpliceIndex,1);
      }
   }
   function setSetTypeColor(aSetType, aColorId)
   {
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetObj = this.mFigureData[i];
         if(tSetObj.getSetType() == aSetType)
         {
            tSetObj.setValues(aSetType,tSetObj.getSetId(),aColorId);
            this.mFigureData[i] = tSetObj;
         }
         i++;
      }
   }
   function getSetItemById(aSetId)
   {
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetObj = this.mFigureData[i];
         if(tSetObj.getSetId() == aSetId)
         {
            return tSetObj;
         }
         i++;
      }
      return null;
   }
   function getSetItemByType(aSetType)
   {
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetObj = this.mFigureData[i];
         if(tSetObj.getSetType() == aSetType)
         {
            return tSetObj;
         }
         i++;
      }
      return null;
   }
   function getSetTypeColorId(aSetType)
   {
      var tSetObj = this.getSetItemByType(aSetType);
      var tColorId = tSetObj.getColorId();
      return tColorId;
   }
   function getSetColorId(aSetType)
   {
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetObj = this.mFigureData[i];
         if(tSetObj.getSetType() == aSetType)
         {
            return tSetObj.getColorId();
         }
         i++;
      }
   }
   function getClubColors()
   {
      var tClubColors = new Array();
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetItem = this.mFigureData[i];
         var tColorData = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tSetItem.getColorId());
         if(tColorData.isClubOnly())
         {
            tClubColors.push(tColorData);
         }
         i++;
      }
      return tClubColors;
   }
   function getClubSets()
   {
      var tClubSets = new Array();
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetItem = this.mFigureData[i];
         var tSetData = com.sulake.habbo.avatar.FigureData.getInstance().getSetForId(tSetItem.getSetId());
         if(tSetData.isClubOnly())
         {
            tClubSets.push(tSetData);
         }
         i++;
      }
      return tClubSets;
   }
   function randomizeFigure(aGender, aUseClub)
   {
      this.mFigureData = new Array();
      if(aUseClub == undefined)
      {
         aUseClub = false;
      }
      var tGender = aGender;
      if(aGender == "U")
      {
         if(random(2) == 0)
         {
            tGender = "M";
         }
         else
         {
            tGender = "F";
         }
      }
      this.setGender(tGender);
      var tSetTypes = com.sulake.habbo.avatar.FigureData.getInstance().getSetTypes();
      var i = 0;
      while(i < tSetTypes.length)
      {
         var tSetType = tSetTypes[i][0];
         var tMandatoryType = tSetTypes[i][1];
         var tSetProb = this.getSetTypeProbability(tSetType);
         var tRandomGet = random(100) <= tSetProb;
         if(tMandatoryType || tRandomGet)
         {
            var tSets = com.sulake.habbo.avatar.FigureData.getInstance().getSetsForSetType(tSetType,this.mGender,aUseClub,true);
            var tSet = tSets[random(tSets.length)];
            var tSetId = tSet.getSetId();
            var tPaletteId = tSet.getPaletteId();
            var tColorArr = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tPaletteId,aUseClub,true);
            if(tSetType == "hd")
            {
               tColorArr.splice(10);
            }
            var tColorIndex = random(tColorArr.length);
            var tFigureDataColor = tColorArr[tColorIndex];
            var tColorId = tFigureDataColor.getID();
            this.setSetItem(tSetType,tSetId,tColorId);
         }
         i++;
      }
   }
   function getSetTypeProbability(aSetType)
   {
      var tSetTypeProbabilities = new Array();
      tSetTypeProbabilities.push(new Array("M","hr",97));
      tSetTypeProbabilities.push(new Array("M","ha",40));
      tSetTypeProbabilities.push(new Array("M","he",15));
      tSetTypeProbabilities.push(new Array("M","ea",30));
      tSetTypeProbabilities.push(new Array("M","fa",15));
      tSetTypeProbabilities.push(new Array("M","ca",10));
      tSetTypeProbabilities.push(new Array("M","wa",40));
      tSetTypeProbabilities.push(new Array("M","sh",95));
      tSetTypeProbabilities.push(new Array("F","hr",100));
      tSetTypeProbabilities.push(new Array("F","ha",40));
      tSetTypeProbabilities.push(new Array("F","he",25));
      tSetTypeProbabilities.push(new Array("F","ea",15));
      tSetTypeProbabilities.push(new Array("F","fa",8));
      tSetTypeProbabilities.push(new Array("F","ca",15));
      tSetTypeProbabilities.push(new Array("F","wa",40));
      tSetTypeProbabilities.push(new Array("F","sh",95));
      var i = 0;
      while(i < tSetTypeProbabilities.length)
      {
         if(tSetTypeProbabilities[i][0] == this.mGender)
         {
            if(tSetTypeProbabilities[i][1] == aSetType)
            {
               return tSetTypeProbabilities[i][2];
            }
         }
         i++;
      }
      return 30;
   }
   function validateAndFixFigure()
   {
      var tReplacingSets = new Array();
      var tFigureWasValid = true;
      var i = 0;
      while(i < this.mFigureData.length)
      {
         var tSetItem = this.mFigureData[i];
         var tSetType = tSetItem.getSetType();
         var tSetId = tSetItem.getSetId();
         var tSetData = com.sulake.habbo.avatar.FigureData.getInstance().getSetForId(tSetId);
         if(tSetData.isSelectable() == false)
         {
            var tNewSets = com.sulake.habbo.avatar.FigureData.getInstance().getSetsForSetType(tSetType,this.mGender,false,true);
            var tNewSet = tNewSets[0];
            tReplacingSets.push(tNewSet);
         }
         else
         {
            var tColorId = tSetItem.getColorId();
            var tColorData = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tColorId);
            var tPaletteId = tColorData.getPaletteId();
            if(tColorData.isSelectable() == false)
            {
               var tValidColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tPaletteId,false,true);
               var tColor = tValidColors[0];
               this.setSetItem(tSetType,tSetId,tColor.getID());
               tFigureWasValid = false;
            }
         }
         i++;
      }
      var i = 0;
      while(i < tReplacingSets.length)
      {
         var tSet = tReplacingSets[i];
         var tSetType = tSet.getSetType();
         var tSetId = tSet.getSetId();
         var tColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tSet.getPaletteId(),false,true);
         var tColor = tColors[0];
         this.setSetItem(tSetType,tSetId,tColor.getID());
         tFigureWasValid = false;
         i++;
      }
      return tFigureWasValid;
   }
}
