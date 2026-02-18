class com.sulake.badgeeditor.ui.PreviewSetMc extends MovieClip implements com.sulake.common.util.EventRelayListener
{
   var mSetColor;
   var mSetPosition;
   var mHidden;
   var arrowRight;
   var arrowLeft;
   var tickBox;
   var mSetNumber;
   var mPreviewMc;
   var mOrigPosition;
   var canvasRect;
   function PreviewSetMc()
   {
      super();
      this.mSetColor = "ffffff";
      this.mSetPosition = 5;
      this.mHidden = false;
      var owner = this;
      this.arrowRight.onPress = function()
      {
         owner.sendGraphicChange("next");
      };
      this.arrowLeft.onPress = function()
      {
         owner.sendGraphicChange("previous");
      };
      this.tickBox.onPress = function()
      {
         owner.toggleTickBox();
      };
      var _loc3_ = this._name.length;
      this.mSetNumber = parseInt(this._name.substring(_loc3_ - 1,_loc3_));
      if(this.mSetNumber == 5)
      {
         this.setType("base");
      }
      else
      {
         this.setType("symbol");
      }
      com.sulake.common.util.EventRelay.addListener(this,"ColorChange");
      com.sulake.common.util.EventRelay.addListener(this,"PositionChange");
      com.sulake.common.util.EventRelay.addListener(this,"GraphicChange");
   }
   function getSymbolNum()
   {
      if(this.mHidden)
      {
         return -1;
      }
      return this.mPreviewMc._currentframe;
   }
   function setType(aType)
   {
      if(aType == "base")
      {
         this.mPreviewMc = this.attachMovie("base_selection","preview_mc",55,{_x:11,_y:-1});
      }
      if(aType == "symbol")
      {
         this.mPreviewMc = this.attachMovie("symbol_selection","preview_mc",55,{_x:11,_y:-1});
      }
      this.mOrigPosition = {x:this.mPreviewMc._x,y:this.mPreviewMc._y};
      return undefined;
   }
   function sendGraphicChange(aType)
   {
      com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("GraphicChange",{setNumber:this.mSetNumber,type:aType},null));
   }
   function toggleTickBox(aStatus)
   {
      if(aStatus != undefined)
      {
         this.mHidden = aStatus;
      }
      else
      {
         this.mHidden = !this.mHidden;
      }
      if(this.mHidden)
      {
         this.tickBox.gotoAndStop("off");
         this.sendGraphicChange("hide");
         com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("UiSetStatus",{setNumber:this.mSetNumber,type:"disable"},null));
         this.setArrowState("disable");
      }
      else
      {
         this.tickBox.gotoAndStop("on");
         this.sendGraphicChange("show");
         com.sulake.common.util.EventRelay.sendEvent(new com.sulake.common.util.Event("UiSetStatus",{setNumber:this.mSetNumber,type:"enable"},null));
         this.setArrowState("enable");
      }
   }
   function setArrowState(aState)
   {
      var owner = this;
      if(aState == "enable")
      {
         this.arrowRight.onPress = function()
         {
            owner.sendGraphicChange("next");
         };
         this.arrowLeft.onPress = function()
         {
            owner.sendGraphicChange("previous");
         };
         this.arrowRight._alpha = 100;
         this.arrowLeft._alpha = 100;
      }
      else if(aState == "disable")
      {
         delete this.arrowRight.onPress;
         delete this.arrowLeft.onPress;
         this.arrowRight._alpha = 40;
         this.arrowLeft._alpha = 40;
      }
   }
   function nextImage()
   {
      var _loc3_ = this.mPreviewMc._totalframes;
      var _loc2_ = this.mPreviewMc._currentframe;
      _loc2_ = _loc2_ + 1;
      if(_loc2_ > _loc3_)
      {
         _loc2_ = 1;
      }
      this.setImage(_loc2_);
   }
   function previousImage()
   {
      var _loc3_ = this.mPreviewMc._totalframes;
      var _loc2_ = this.mPreviewMc._currentframe;
      _loc2_ = _loc2_ - 1;
      if(_loc2_ < 1)
      {
         _loc2_ = _loc3_;
      }
      this.setImage(_loc2_);
   }
   function setImage(aNum)
   {
      if(aNum == -1)
      {
         this.toggleTickBox(true);
         return undefined;
      }
      this.mPreviewMc.gotoAndStop(aNum);
      this.setColors();
      this.setGfxPosition();
      return undefined;
   }
   function receiveEvent(event)
   {
      var _loc4_ = event.getTopic();
      var _loc2_ = event.getData();
      if(_loc2_.setNumber != this.mSetNumber)
      {
         return undefined;
      }
      if(_loc4_ == "ColorChange")
      {
         this.mSetColor = _loc2_.color;
         this.setColors();
      }
      if(_loc4_ == "PositionChange")
      {
         this.mSetPosition = _loc2_.position;
         this.setGfxPosition();
      }
      if(_loc4_ == "GraphicChange")
      {
         var _loc3_ = _loc2_.type;
         if(_loc3_ == "next")
         {
            this.nextImage();
         }
         else if(_loc3_ == "previous")
         {
            this.previousImage();
         }
         else if(_loc3_ == "hide")
         {
            this.mPreviewMc._alpha = 0;
         }
         else if(_loc3_ == "show")
         {
            this.mPreviewMc._alpha = 100;
         }
         else if(_loc3_ == "set")
         {
            this.setImage(_loc2_.number);
         }
      }
      return undefined;
   }
   function setColors()
   {
      var _loc3_ = undefined;
      var _loc2_ = 1;
      while(_loc2_ < 20)
      {
         _loc3_ = this.mPreviewMc["colorable" + _loc2_];
         com.sulake.common.Coloring.SetMcColor(_loc3_,{type:"hex",data:this.mSetColor});
         _loc2_ = _loc2_ + 1;
      }
      return undefined;
   }
   function setGfxPosition()
   {
      var _loc2_ = this.mPreviewMc.getBounds();
      var _loc3_ = this.canvasRect.getBounds();
      var _loc5_ = 0;
      var _loc4_ = 0;
      this.mPreviewMc._x = this.mOrigPosition.x;
      this.mPreviewMc._y = this.mOrigPosition.y;
      switch(this.mSetPosition)
      {
         case 1:
            _loc5_ = _loc2_.xMin - _loc3_.xMin;
            _loc4_ = _loc2_.yMin - _loc3_.yMin;
            break;
         case 2:
            _loc4_ = _loc2_.yMin - _loc3_.yMin;
            break;
         case 3:
            _loc5_ = _loc2_.xMax - _loc3_.xMax;
            _loc4_ = _loc2_.yMin - _loc3_.yMin;
            break;
         case 4:
            _loc5_ = _loc2_.xMin - _loc3_.xMin;
            break;
         case 5:
            break;
         case 6:
            _loc5_ = _loc2_.xMax - _loc3_.xMax;
            break;
         case 7:
            _loc5_ = _loc2_.xMin - _loc3_.xMin;
            _loc4_ = _loc2_.yMax - _loc3_.yMax;
            break;
         case 8:
            _loc4_ = _loc2_.yMax - _loc3_.yMax;
            break;
         case 9:
            _loc5_ = _loc2_.xMax - _loc3_.xMax;
            _loc4_ = _loc2_.yMax - _loc3_.yMax;
      }
      this.mPreviewMc._x = this.mOrigPosition.x - _loc5_;
      this.mPreviewMc._y = this.mOrigPosition.y - _loc4_;
   }
}
