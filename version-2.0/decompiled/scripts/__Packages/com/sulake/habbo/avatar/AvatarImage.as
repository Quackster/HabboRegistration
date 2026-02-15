class com.sulake.habbo.avatar.AvatarImage
{
   var AVATAR_SCALE;
   var holderMc;
   var partList;
   var prevflipH;
   var animationFrame;
   var mMainAction;
   var mActions;
   var mGesture;
   var mSpeaking;
   var mAnimationIntervalID;
   var bodyDirection;
   var headDirection;
   var mCanvasSize;
   var flipWidth;
   var handItem;
   var mSpeakIntervalID;
   static var DEFAULT_ACTION = "std";
   static var DEFAULT_DIRECTION = 4;
   static var SET_BIG_AVATAR = "h";
   static var SET_SMALL_AVATAR = "sh";
   static var flipList = new Array(0,1,2,3,2,1,0,7);
   static var renderOrder = new Array("li","lh","ls","bd","sh","lg","ch","wa","hd","fc","ey","hr","hrb","ri","rh","rs","ea","ca","fa","ha","he");
   static var headElements = new Array("hd","hr","ey","fc");
   static var waveElements = new Array("lh","ls");
   static var walkElements = new Array("li","lh","ls","bd","sh","lg","ri","rh","rs");
   var mHideLayers = [];
   function AvatarImage(mc, tName, tScale)
   {
      if(tScale == undefined)
      {
         tScale = 1;
      }
      this.AVATAR_SCALE = tScale;
      this.holderMc = mc.createEmptyMovieClip(tName,mc.getNextHighestDepth());
      this.holderMc.cacheAsBitmap = true;
      if(this.AVATAR_SCALE != 1)
      {
         this.holderMc._xscale = 100 * this.AVATAR_SCALE;
         this.holderMc._yscale = 100 * this.AVATAR_SCALE;
      }
      this.partList = new Object();
      this.setDirection(com.sulake.habbo.avatar.AvatarImage.DEFAULT_DIRECTION);
      this.prevflipH = false;
      this.animationFrame = 0;
      this.mMainAction = com.sulake.habbo.avatar.AvatarImage.DEFAULT_ACTION;
      this.mActions = [];
      this.mGesture = "std";
      this.mSpeaking = false;
      this.mAnimationIntervalID = setInterval(this,"checkAnimation",100);
   }
   function deconstruct()
   {
      this.deleteAllBodyparts();
      this.holderMc.removeMovieClip();
      delete this.partList;
      clearInterval(this.mAnimationIntervalID);
   }
   function hide()
   {
      this.holderMc._alpha = 0;
   }
   function show()
   {
      this.holderMc._alpha = 100;
   }
   function setLook(aFigure)
   {
      this.mHideLayers = [];
      this.deleteAllBodyparts();
      var tFigureSetArray = aFigure.getFigureData();
      var i = 0;
      while(i < tFigureSetArray.length)
      {
         var tFigureSetItem = tFigureSetArray[i];
         var tSetType = tFigureSetItem.getSetType();
         var tPartNr = tFigureSetItem.getSetId();
         var tPartColor = tFigureSetItem.getColorId();
         var tColorObj = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tPartColor);
         var tColorString = tColorObj.getColorStr();
         var tFigureDataSet = com.sulake.habbo.avatar.FigureData.getInstance().getSetForId(tPartNr);
         this.mHideLayers = this.mHideLayers.concat(tFigureDataSet.getHiddenLayers());
         var tParts = com.sulake.habbo.avatar.FigureData.getInstance().getPartsForSetId(String(tPartNr));
         var j = 0;
         while(j < tParts.length)
         {
            var tId = tParts[j].getPartId();
            var tType = tParts[j].getPartType();
            this.createBodypart(tType,String(tId),tColorString,tSetType,"std",tParts[j].isPartColorable());
            j++;
         }
         i++;
      }
      this.drawAvatar();
   }
   function createBodypart(tPartType, tPartNum, tColor, tSetType, tAction, tColorable)
   {
      if(_root.PrintHabboParts)
      {
         _root.parts_needed.text += "\n" + tPartType + "_" + tPartNum;
      }
      var tBodypartRef = new com.sulake.habbo.avatar.AvatarBodypart(tPartType,tPartNum,tColor,tSetType,tColorable,this.holderMc);
      if(tAction == undefined)
      {
         tAction = com.sulake.habbo.avatar.AvatarImage.DEFAULT_ACTION;
      }
      tBodypartRef.setAction(tAction);
      if(this.partList[tPartType] == undefined)
      {
         this.partList[tPartType] = [];
      }
      this.partList[tPartType].push(tBodypartRef);
   }
   function deleteBodypart(tSetTypeName)
   {
      for(var tPartType in this.partList)
      {
         for(var tItem in this.partList[tPartType])
         {
            var tBodypart = com.sulake.habbo.avatar.AvatarBodypart(tItem);
            if(tBodypart.getSetType() == tSetTypeName)
            {
               tBodypart.deconstruct();
            }
         }
         if(this.partList[tPartType].length == 0)
         {
            this.partList[tPartType] = null;
         }
      }
   }
   function moveTo(x, y)
   {
      this.holderMc._x = x;
      this.holderMc._y = y;
   }
   function rotateAvatar(tDir)
   {
      var tAdd = 0;
      if(tDir == "next")
      {
         tAdd = -1;
      }
      else if(tDir == "prev")
      {
         tAdd = 1;
      }
      if(this.mMainAction == "lay")
      {
         if(tDir == "next" || tDir == "prev")
         {
            if(this.bodyDirection != 2)
            {
               tAdd = 4;
            }
            else
            {
               tAdd = -4;
            }
         }
      }
      if(this.mMainAction == "sit")
      {
         if(tDir == "next")
         {
            tAdd = -2;
         }
         else if(tDir == "prev")
         {
            tAdd = 2;
         }
      }
      this.bodyDirection += tAdd;
      if(this.bodyDirection > 7)
      {
         if(this.mMainAction == "lay")
         {
            this.bodyDirection = 2;
         }
         else
         {
            this.bodyDirection = 0;
         }
      }
      if(this.bodyDirection < 0)
      {
         if(this.mMainAction == "lay")
         {
            this.bodyDirection = 4;
         }
         else if(this.mMainAction == "sit")
         {
            this.bodyDirection = 6;
         }
         else
         {
            this.bodyDirection = 7;
         }
      }
      this.headDirection = this.bodyDirection;
      this.clearAllBodyparts();
      this.drawAvatar();
   }
   function drawAvatar(aHideLayers)
   {
      var tDir = com.sulake.habbo.avatar.AvatarImage.flipList[this.bodyDirection];
      var tRenderOrder = com.sulake.habbo.avatar.DrawOrder.getInstance().getOrderArray(tDir,this.mMainAction);
      if(tRenderOrder.length < 1)
      {
         tRenderOrder = com.sulake.habbo.avatar.AvatarImage.renderOrder.concat();
      }
      var i = 0;
      var k = 0;
      while(i < tRenderOrder.length)
      {
         var tPartName = tRenderOrder[i];
         var tPartAction = this.mMainAction;
         var tFrame = 0;
         if(tPartAction == "wlk" && this.isWalkElement(tPartName))
         {
            tFrame = this.animationFrame;
         }
         if(tPartAction == "wav" && this.isWaveElement(tPartName))
         {
            tFrame = this.animationFrame;
         }
         if(this.isHeadElement(tPartName))
         {
            tDir = com.sulake.habbo.avatar.AvatarImage.flipList[this.headDirection];
         }
         var j = 0;
         while(j < this.partList[tPartName].length)
         {
            com.sulake.habbo.avatar.AvatarBodypart(this.partList[tPartName][j]).setFrameAndRegpoint("h",tPartAction,tDir,tFrame,this.mCanvasSize,k);
            k++;
            j++;
         }
         i++;
      }
      this.hideLayers();
      if(this.flipWidth == undefined)
      {
         this.flipWidth = 68;
      }
      if(this.bodyDirection != com.sulake.habbo.avatar.AvatarImage.flipList[this.bodyDirection])
      {
         this.holderMc._xscale = -100 * this.AVATAR_SCALE;
         if(!this.prevflipH)
         {
            this.holderMc._x += this.flipWidth * this.AVATAR_SCALE;
            this.prevflipH = true;
         }
      }
      else
      {
         this.holderMc._xscale = 100 * this.AVATAR_SCALE;
         if(this.prevflipH)
         {
            this.holderMc._x -= this.flipWidth * this.AVATAR_SCALE;
            this.prevflipH = false;
         }
      }
   }
   function hideLayers()
   {
      var tHrbHidden = false;
      var tHrHidden = false;
      var i = 0;
      while(i < this.mHideLayers.length)
      {
         if(this.mHideLayers[i] == "hrb")
         {
            tHrbHidden = true;
         }
         if(this.mHideLayers[i] == "hr")
         {
            tHrHidden = true;
         }
         i++;
      }
      if(!tHrbHidden && !tHrHidden)
      {
         this.mHideLayers.push("hr");
      }
      var i = 0;
      while(i < this.mHideLayers.length)
      {
         var tHidePartName = this.mHideLayers[i];
         var j = 0;
         while(j < this.partList[tHidePartName].length)
         {
            com.sulake.habbo.avatar.AvatarBodypart(this.partList[tHidePartName][j]).hide();
            j++;
         }
         i++;
      }
   }
   function isWalkElement(tElemName)
   {
      var tLen = com.sulake.habbo.avatar.AvatarImage.walkElements.length;
      var i = 0;
      while(i < tLen)
      {
         if(com.sulake.habbo.avatar.AvatarImage.walkElements[i] == tElemName)
         {
            return true;
         }
         i++;
      }
      return false;
   }
   function isWaveElement(tElemName)
   {
      var tLen = com.sulake.habbo.avatar.AvatarImage.walkElements.length;
      var i = 0;
      while(i < tLen)
      {
         if(com.sulake.habbo.avatar.AvatarImage.waveElements[i] == tElemName)
         {
            return true;
         }
         i++;
      }
      return false;
   }
   function isHeadElement(tElemName)
   {
      var tLen = com.sulake.habbo.avatar.AvatarImage.headElements.length;
      var i = 0;
      while(i < tLen)
      {
         if(com.sulake.habbo.avatar.AvatarImage.headElements[i] == tElemName)
         {
            return true;
         }
         i++;
      }
      return false;
   }
   function deleteAllBodyparts()
   {
      for(var tString in this.partList)
      {
         var i = 0;
         while(i < this.partList[tString].length)
         {
            com.sulake.habbo.avatar.AvatarBodypart(this.partList[tString][i]).deconstruct();
            i++;
         }
         this.partList[tString] = null;
      }
      _root.parts_needed.text = "";
   }
   function clearAllBodyparts()
   {
      for(var tString in this.partList)
      {
         var i = 0;
         while(i < this.partList[tString].length)
         {
            com.sulake.habbo.avatar.AvatarBodypart(this.partList[tString][i]).deconstruct();
            i++;
         }
      }
   }
   function getAvatarMc()
   {
      return this.holderMc;
   }
   function setAction(actionList, isGesture)
   {
      if(isGesture == undefined)
      {
         isGesture = false;
      }
      if(actionList == null)
      {
         actionList = com.sulake.habbo.avatar.AvatarImage.DEFAULT_ACTION;
      }
      actionList = actionList.toLowerCase();
      var actionArray = actionList.split(",");
      for(var tAction in actionArray)
      {
         var changeParts = new Array();
         var actionId = actionArray[tAction];
         var actionStr = actionId;
         if(actionId == "wlk")
         {
            changeParts.push("bd","lg","lh","rh","ls","rs","sh");
         }
         if(actionId == "sit")
         {
            changeParts.push("bd","lg","sh");
         }
         if(!isGesture && actionId == "std")
         {
            changeParts.push("li","lh","ls","bd","sh","lg","ch","hd","hr","ri","rh","rs");
            this.setAnimationFrame(0);
         }
         if(actionId == "lay")
         {
            this.mCanvasSize = [109,90,35,-15];
            changeParts.push("li","lh","ls","bd","sh","lg","ch","wa","hd","fc","ey","hr","hrb","ri","rh","rs","ea","ca","fa","ha","he");
         }
         else
         {
            this.mCanvasSize = undefined;
         }
         if(actionId == "wav")
         {
            changeParts.push("ls","lh");
         }
         if(actionId.substr(0,3) == "cri" || actionId.substr(0,3) == "crr")
         {
            changeParts.push("rs","rh","ri");
            var off;
            if((off = actionId.indexOf("=")) >= 0)
            {
               this.handItem = actionId.substring(off + 1);
               actionStr = actionId.substring(0,off);
            }
         }
         if(actionId == "spk")
         {
            changeParts.push("fc","hd","hr");
         }
         if(actionId == "spk" && this.mMainAction == "lay")
         {
            actionId = "lsp";
         }
         if(isGesture && (actionId == "std" || actionId == "sml" || actionId == "agr" || actionId == "spr" || actionId == "sad"))
         {
            changeParts.push("fc","ey");
         }
         if(this.mMainAction == "lay" && actionId != "lay")
         {
            var i = 0;
            while(i < com.sulake.habbo.avatar.AvatarImage.renderOrder.length)
            {
               var j = 0;
               while(j < this.partList[com.sulake.habbo.avatar.AvatarImage.renderOrder[i]].length)
               {
                  com.sulake.habbo.avatar.AvatarBodypart(this.partList[com.sulake.habbo.avatar.AvatarImage.renderOrder[i]][j]).setAction("std");
                  j++;
               }
               i++;
            }
         }
         var i = 0;
         while(i < changeParts.length)
         {
            var j = 0;
            while(j < this.partList[changeParts[i]].length)
            {
               com.sulake.habbo.avatar.AvatarBodypart(this.partList[changeParts[i]][j]).setAction(actionStr);
               j++;
            }
            i++;
         }
      }
      if(actionList != "spk")
      {
         this.mMainAction = actionList;
      }
      this.drawAvatar();
   }
   function setGesture(aGesture)
   {
      if(this.mMainAction == "lay")
      {
         return undefined;
      }
      var tChangeParts = ["fc","ey"];
      var i = 0;
      while(i < tChangeParts.length)
      {
         var j = 0;
         while(j < this.partList[tChangeParts[i]].length)
         {
            com.sulake.habbo.avatar.AvatarBodypart(this.partList[tChangeParts[i]][j]).setAction(aGesture);
            j++;
         }
         i++;
      }
   }
   function startSpeaking(aHowLong)
   {
      this.mSpeaking = true;
      this.mSpeakIntervalID = setInterval(this,"stopSpeaking",aHowLong);
   }
   function stopSpeaking()
   {
      clearInterval(this.mSpeakIntervalID);
      this.mSpeaking = false;
      this.checkAnimation(true);
   }
   function setAnimationFrame(af)
   {
      this.animationFrame = af;
   }
   function nextAnimationFrame()
   {
      this.mMainAction = "wlk";
      this.animationFrame += 1;
      if(this.animationFrame >= 4)
      {
         this.animationFrame = 0;
      }
   }
   function checkAnimation(aStopSpeaking)
   {
      var tSpeakChangeParts = ["fc","hd","hr"];
      var tSpeakActionStr = this.mMainAction;
      if(tSpeakActionStr != "lay")
      {
         tSpeakActionStr = "std";
      }
      if(this.mSpeaking)
      {
         if(random(3) == 2)
         {
            if(this.mMainAction == "lay")
            {
               tSpeakChangeParts = ["fc","hd"];
               tSpeakActionStr = "lsp";
            }
            else
            {
               tSpeakActionStr = "spk";
            }
         }
      }
      var i = 0;
      while(i < tSpeakChangeParts.length)
      {
         var j = 0;
         while(j < this.partList[tSpeakChangeParts[i]].length)
         {
            com.sulake.habbo.avatar.AvatarBodypart(this.partList[tSpeakChangeParts[i]][j]).setAction(tSpeakActionStr);
            j++;
         }
         i++;
      }
      if(this.mSpeaking || aStopSpeaking)
      {
         this.drawAvatar();
      }
   }
   function forceSpeakFrame(aFrame)
   {
      var tSpeakChangeParts = ["fc","hd","hr"];
      var tSpeakActionStr = this.mMainAction;
      if(tSpeakActionStr != "lay")
      {
         tSpeakActionStr = "std";
      }
      if(this.mMainAction == "lay")
      {
         tSpeakChangeParts = ["fc","hd"];
         tSpeakActionStr = "lsp";
      }
      else
      {
         tSpeakActionStr = "spk";
      }
      var i = 0;
      while(i < tSpeakChangeParts.length)
      {
         var j = 0;
         while(j < this.partList[tSpeakChangeParts[i]].length)
         {
            var tBodypart = com.sulake.habbo.avatar.AvatarBodypart(this.partList[tSpeakChangeParts[i]][j]);
            tBodypart.setAction(tSpeakActionStr);
            if(tBodypart.getPartType() != "hr")
            {
               tBodypart.setFrame(aFrame);
            }
            j++;
         }
         i++;
      }
   }
   function setDirection(d)
   {
      this.bodyDirection = d % 8;
      this.setHeadDirection(d);
      this.drawAvatar();
   }
   function setHeadDirection(d)
   {
      this.headDirection = d % 8;
   }
   function getDirection()
   {
      return this.bodyDirection;
   }
   function setPosition(aX, aY)
   {
      this.holderMc._x = aX;
      this.holderMc._y = aY;
      return undefined;
   }
   function movePosition(aX, aY)
   {
      this.holderMc._x += aX;
      this.holderMc._y += aY;
      return undefined;
   }
   function turnHead(aDirection)
   {
      if(aDirection == "right")
      {
         this.headDirection = this.bodyDirection + 1;
         if(this.headDirection > 7)
         {
            this.headDirection = 0;
         }
      }
      else
      {
         this.headDirection = this.bodyDirection - 1;
         if(this.headDirection < 0)
         {
            this.headDirection = 7;
         }
      }
   }
   function setDanceParts(aDanceFrame)
   {
      for(var tPartType in aDanceFrame)
      {
         for(var tPartName in this.partList)
         {
            var i = 0;
            while(i < this.partList[tPartName].length)
            {
               var tBodypart = com.sulake.habbo.avatar.AvatarBodypart(this.partList[tPartName][i]);
               if(tBodypart.getPartType() == tPartType)
               {
                  tBodypart.setAction(aDanceFrame[tPartType].action);
                  tBodypart.setFrame(aDanceFrame[tPartType].actFrame);
                  tBodypart.setX(aDanceFrame[tPartType].xFix,true);
                  tBodypart.setY(aDanceFrame[tPartType].yFix);
               }
               i++;
            }
         }
      }
   }
   function clearDanceParts()
   {
      for(var tPartType in com.sulake.habbo.avatar.AvatarImage.renderOrder)
      {
         var i = 0;
         while(i < this.partList[tPartType].length)
         {
            var tBodypart = com.sulake.habbo.avatar.AvatarBodypart(this.partList[tPartType][i]);
            tBodypart.setAction("std");
            tBodypart.setFrame(0);
            tBodypart.setX(0);
            tBodypart.setY(0);
            i++;
         }
      }
   }
   function forceDanceFrame(aFrame, aDanceNumber)
   {
      if(aFrame == -1)
      {
         this.clearDanceParts();
         return 0;
      }
      var tDanceFrame = com.sulake.habbo.avatar.dance.DanceData.getInstance().getDanceFrame(aDanceNumber,aFrame);
      this.setDanceParts(tDanceFrame);
      return tDanceFrame.frameCount;
   }
}
