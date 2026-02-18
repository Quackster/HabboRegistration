class com.sulake.habbo.avatareditor.PreviewIcon
{
   var setId;
   var holderMc;
   var maskMc;
   var bgMc;
   var partList;
   var mPartsMc;
   static var PART_Y_OFFSETS = {hr:83,ha:82,he:82,ea:75,fa:72,hd:78,ch:53,ca:53,wa:43,lg:32,sh:23};
   static var PART_Y_OFFSET = -97;
   static var PART_X_OFFSETS = {hr:1,ha:0,he:0,ea:-3,fa:-4,hd:0,ch:0,ca:0,wa:0,lg:0,sh:-2};
   static var PART_X_OFFSET = 3;
   function PreviewIcon(tSetId, tBaseMc, tMaskMc, tBgMc, aSelected)
   {
      this.setId = tSetId;
      this.holderMc = tBaseMc;
      this.maskMc = tMaskMc;
      this.bgMc = tBgMc;
      this.partList = new Object();
      if(aSelected)
      {
         this.setSelection();
      }
      this.mPartsMc = this.bgMc.createEmptyMovieClip("parts",this.bgMc.getNextHighestDepth());
      this.maskMc.attachMovie("prevIconMask","mask",this.bgMc.getNextHighestDepth());
      this.maskMc.mask._x += 18;
      this.maskMc.mask._y += 3;
      this.holderMc.setMask(this.maskMc);
   }
   function destruct()
   {
      this.maskMc.removeMovieClip();
      this.bgMc.removeMovieClip();
      this.partList = null;
   }
   function createBodypart(tPartName, tPartNum, tMainPartName, tColorable, tColor)
   {
      if(tPartName == "bd" || tPartName == "lh" || tPartName == "rh")
      {
         return undefined;
      }
      var tBodypartRef = new com.sulake.habbo.avatar.AvatarBodypart(tPartName,tPartNum,tColor,tMainPartName,tColorable,this.mPartsMc);
      if(this.partList[tPartName] == undefined)
      {
         this.partList[tPartName] = [];
      }
      this.partList[tPartName].push(tBodypartRef);
      tBodypartRef.setFrameAndRegpoint("h","std",2,0,null,this.getPartDepth(tPartName,com.sulake.habbo.avatar.DrawOrder.getInstance().getOrderArray(2,"std")));
      tBodypartRef.moveY(com.sulake.habbo.avatareditor.PreviewIcon.PART_Y_OFFSETS[tMainPartName] + com.sulake.habbo.avatareditor.PreviewIcon.PART_Y_OFFSET);
      tBodypartRef.moveX(com.sulake.habbo.avatareditor.PreviewIcon.PART_X_OFFSETS[tMainPartName] + com.sulake.habbo.avatareditor.PreviewIcon.PART_X_OFFSET);
   }
   function deleteBodypart(tMainPartName)
   {
      for(var tPartName in this.partList)
      {
         for(var tItem in this.partList[tPartName])
         {
            var tBodypart = com.sulake.habbo.avatar.AvatarBodypart(tItem);
            if(tBodypart.getPartType() == tMainPartName)
            {
               tBodypart.deconstruct();
            }
            if(this.partList[tPartName].length == 0)
            {
               this.partList[tPartName] = null;
            }
         }
      }
      this.partList = new Array();
   }
   function addClubTag()
   {
      var tClubTag = this.bgMc.attachMovie("hcTagSmall","hcTag",this.bgMc.getNextHighestDepth());
      tClubTag._x = 41;
      tClubTag._y = 25;
   }
   function setSelection()
   {
      this.bgMc.attachMovie("partSelected","selectionBg",this.bgMc.getNextHighestDepth());
      this.bgMc.selectionBg._x += 11;
      this.bgMc.selectionBg._y -= 4;
   }
   function clearSelection()
   {
      var tSelectionMc = this.bgMc.selectionBg;
      if(tSelectionMc != undefined)
      {
         tSelectionMc.removeMovieClip();
      }
   }
   function setColor(aColor)
   {
      for(var tPartName in this.partList)
      {
         var i = 0;
         while(i < this.partList[tPartName].length)
         {
            var tBodypart = com.sulake.habbo.avatar.AvatarBodypart(this.partList[tPartName][i]);
            tBodypart.setColor(aColor);
            tBodypart.updatePartColor();
            i++;
         }
      }
   }
   function getSetId()
   {
      return this.setId;
   }
   function getPartDepth(tPartName, aRenderOrder)
   {
      var i = 0;
      while(i < aRenderOrder.length)
      {
         if(tPartName == aRenderOrder[i])
         {
            return i + this.partList[tPartName].length;
         }
         i++;
      }
      trace("Error: getPartDepth() failed for part: " + tPartName);
      return random(1000);
   }
}
