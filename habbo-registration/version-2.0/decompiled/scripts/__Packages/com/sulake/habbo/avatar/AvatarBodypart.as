class com.sulake.habbo.avatar.AvatarBodypart
{
   var mPartType;
   var mModelNum;
   var mSetType;
   var mRenderedString;
   var mColorable;
   var mAction;
   var mFrame;
   var mBaseMc;
   var mHolderMc;
   var mColorArray;
   var mDirection;
   static var backupRenderOrder = new Array("li","lh","ls","bd","sh","lg","ch","wa","hd","fc","ey","hr","hrb","ri","rh","rs","ea","ca","fa","ha","he");
   function AvatarBodypart(tPartType, tModelNum, tColor, tSetType, tColorable, tBaseMc)
   {
      this.mPartType = tPartType;
      this.mModelNum = tModelNum;
      this.mSetType = tSetType;
      this.mRenderedString = "";
      this.mColorable = tColorable;
      this.mAction = "std";
      this.mFrame = 0;
      this.mBaseMc = tBaseMc;
      this.setColor(tColor);
   }
   function deconstruct()
   {
      this.mHolderMc.removeMovieClip();
   }
   function setColor(tColor)
   {
      if(!this.isColorable())
      {
         tColor = "FFFFFF";
      }
      this.mColorArray = [];
      tColor = String(tColor);
      var tR = tColor.substring(0,2);
      var tG = tColor.substring(2,4);
      var tB = tColor.substring(4,6);
      this.mColorArray.push(parseInt(tR,16),parseInt(tG,16),parseInt(tB,16));
      this.mRenderedString = "";
   }
   function getSetType()
   {
      return this.mSetType;
   }
   function getPartType()
   {
      return this.mPartType;
   }
   function constructRenderString(type, action, part, model, dir, frame)
   {
      if(this.mFrame > 0)
      {
         frame = this.mFrame;
      }
      if(this.mAction == "std")
      {
         frame = 0;
      }
      var partName = type + "_" + this.mAction + "_" + part + "_" + model + "_" + dir + "_" + frame;
      this.mFrame = 0;
      return partName;
   }
   function setAction(aAction)
   {
      this.mAction = aAction;
   }
   function getAction()
   {
      return this.mAction;
   }
   function setFrame(aFrame)
   {
      this.mFrame = aFrame;
   }
   function getFrame()
   {
      return this.mFrame;
   }
   function setFrameAndRegpoint(type, action, dir, frame, aCanvasSize, aPartIndex)
   {
      this.mDirection = dir;
      action = this.mAction;
      var tStringToRender = this.constructRenderString(type,action,this.mPartType,this.mModelNum,dir,frame);
      if(tStringToRender != this.mRenderedString)
      {
         this.mHolderMc.removeMovieClip();
         this.mHolderMc = this.mBaseMc.createEmptyMovieClip(this.mPartType + aPartIndex,aPartIndex);
         var tBitmapData = com.sulake.habbo.avatar.GraphicLoader.getInstance().getPartBitmap(tStringToRender,aCanvasSize);
         this.mHolderMc.attachBitmap(tBitmapData,1,"always",false);
         this.setPartColor(this.mColorArray[0],this.mColorArray[1],this.mColorArray[2]);
         this.mRenderedString = tStringToRender;
      }
      this.show();
      return true;
   }
   function moveY(tNum)
   {
      this.mHolderMc._y += tNum;
   }
   function moveX(tNum)
   {
      this.mHolderMc._x += tNum;
   }
   function setX(tNum, aChangeWithDirection)
   {
      if(aChangeWithDirection)
      {
         var tX = tNum;
         var tY = 0;
         switch(this.mDirection)
         {
            case 0:
               tY += tX / 2;
               tX /= 2;
               break;
            case 1:
               tY += tX;
               tX = 0;
               break;
            case 2:
               tY -= tX / 2;
               tX /= 2;
               break;
            case 4:
               tY += tX / 2;
               tX = (- tX) / 2;
               break;
            case 5:
               tY -= tX;
               tX = 0;
               break;
            case 6:
               tY -= tX / 2;
               tX = (- tX) / 2;
               break;
            case 7:
               tX = - tX;
         }
         this.mHolderMc._x = tX;
         this.mHolderMc._y = tY;
      }
      else
      {
         this.mHolderMc._x = tNum;
      }
   }
   function setY(tNum)
   {
      this.mHolderMc._y = tNum;
   }
   function updatePartColor()
   {
      this.setPartColor(this.mColorArray[0],this.mColorArray[1],this.mColorArray[2]);
   }
   function hide()
   {
      this.mHolderMc._visible = false;
   }
   function show()
   {
      this.mHolderMc._visible = true;
   }
   function isColorable()
   {
      return this.mColorable;
   }
   function setPartColor(tR, tG, tB)
   {
      if(this.mPartType == "ey")
      {
         return undefined;
      }
      tR = tR / 255 * 100;
      tG = tG / 255 * 100;
      tB = tB / 255 * 100;
      var my_color = new Color(this.mHolderMc);
      var myColorTransform = {ra:tR,rb:0,ga:tG,gb:0,ba:tB,bb:0,aa:100,ab:0};
      my_color.setTransform(myColorTransform);
   }
}
