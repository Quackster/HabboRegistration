class com.sulake.habbo.avatareditor.ColorChooserMenu
{
   var mHolderMc;
   var mLocationX;
   var mLocationY;
   var mCurrentSelectedId;
   var mTargetSetType;
   var mShowClubColors;
   var mCurrentPaletteId;
   var mPageData;
   var mCurrentSelectionIsOnPageNo;
   var mCurrentPageIndex;
   var mPreviewItems;
   var mControlMenuButtons;
   var mMenuMc;
   static var BUTTON_WIDTH = 27;
   static var BUTTON_HEIGHT = 27;
   static var MENU_MARGIN_HOR = 3;
   static var MENU_MARGIN_VER = 2;
   static var MAX_COLS = 9;
   static var MAX_ROWS = 4;
   function ColorChooserMenu(aBaseMc, aLocX, aLocY)
   {
      this.mHolderMc = aBaseMc;
      this.mLocationX = aLocX;
      this.mLocationY = aLocY;
   }
   function showColorChooser(aColorPaletteId, aSelectedId, aTargetSetType, aShowClubColors)
   {
      if(aSelectedId == undefined)
      {
         aSelectedId = 0;
      }
      this.mCurrentSelectedId = aSelectedId;
      this.mTargetSetType = aTargetSetType;
      this.mShowClubColors = aShowClubColors;
      if(aShowClubColors == undefined)
      {
         this.mShowClubColors = false;
         trace("club definition missing");
      }
      this.mCurrentPaletteId = aColorPaletteId;
      this.clearMenu();
      var tColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(this.mCurrentPaletteId,this.mShowClubColors,true);
      this.mPageData = new Array();
      var tCurrentPage = new Array();
      var tPageIndex = 0;
      var tMaxItemsPerPage = com.sulake.habbo.avatareditor.ColorChooserMenu.MAX_COLS * com.sulake.habbo.avatareditor.ColorChooserMenu.MAX_ROWS;
      var tItemCountOnThisPage = 0;
      var tColorItemIndex = 0;
      while(tColorItemIndex < tColors.length)
      {
         if(tItemCountOnThisPage == 0 && tPageIndex > 0)
         {
            var tMenuMetaItem = new Object();
            tMenuMetaItem.type = "back";
            tCurrentPage.push(tMenuMetaItem);
            tItemCountOnThisPage++;
         }
         if(tItemCountOnThisPage == tMaxItemsPerPage - 1 && tColorItemIndex < tColors.length - 1)
         {
            var tMenuMetaItem = new Object();
            tMenuMetaItem.type = "forward";
            tCurrentPage.push(tMenuMetaItem);
            tItemCountOnThisPage++;
         }
         else
         {
            var tMenuMetaItem = new Object();
            tMenuMetaItem.type = "color";
            tMenuMetaItem.index = tColorItemIndex;
            var tColor = tColors[tColorItemIndex];
            if(tColor.getID() == this.mCurrentSelectedId)
            {
               this.mCurrentSelectionIsOnPageNo = tPageIndex;
            }
            tCurrentPage.push(tMenuMetaItem);
            tColorItemIndex++;
            tItemCountOnThisPage++;
         }
         if(tColorItemIndex == tColors.length)
         {
            this.mPageData.push(tCurrentPage);
         }
         else if(tItemCountOnThisPage == tMaxItemsPerPage)
         {
            this.mPageData.push(tCurrentPage);
            tItemCountOnThisPage = 0;
            tCurrentPage = new Array();
            tPageIndex++;
         }
      }
      this.showPage(this.mCurrentSelectionIsOnPageNo);
   }
   function showPage(aPageNo)
   {
      this.clearMenu();
      if(aPageNo < 0 || aPageNo == undefined)
      {
         this.mCurrentPageIndex = 0;
      }
      else if(aPageNo >= this.mPageData.length)
      {
         this.mCurrentPageIndex = this.mPageData.length - 1;
      }
      else
      {
         this.mCurrentPageIndex = aPageNo;
      }
      var tColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(this.mCurrentPaletteId,this.mShowClubColors,true);
      var tPageMetaData = this.mPageData[aPageNo];
      var tColIndex = 0;
      var tRowIndex = 0;
      var tMaxItemsPerPage = com.sulake.habbo.avatareditor.ColorChooserMenu.MAX_COLS * com.sulake.habbo.avatareditor.ColorChooserMenu.MAX_ROWS;
      var tLastIndex = tMaxItemsPerPage - 1;
      if(tLastIndex > tPageMetaData.length)
      {
         tLastIndex = tPageMetaData.length - 1;
      }
      var i = 0;
      while(i <= tLastIndex)
      {
         var tLocX = this.mLocationX + tColIndex * (com.sulake.habbo.avatareditor.ColorChooserMenu.BUTTON_WIDTH + com.sulake.habbo.avatareditor.ColorChooserMenu.MENU_MARGIN_HOR);
         var tLocY = this.mLocationY + tRowIndex * (com.sulake.habbo.avatareditor.ColorChooserMenu.BUTTON_HEIGHT + com.sulake.habbo.avatareditor.ColorChooserMenu.MENU_MARGIN_VER);
         var tItemMetaData = tPageMetaData[i];
         if(tItemMetaData.type == "color")
         {
            var tSelected = false;
            var tColor = tColors[tItemMetaData.index];
            if(tColor.getID() == this.mCurrentSelectedId)
            {
               tSelected = true;
            }
            var tColorBtn = this.createColorItem(tColor,tLocX,tLocY,tSelected);
            this.mPreviewItems.push(tColorBtn);
         }
         else if(tItemMetaData.type == "forward")
         {
            var tButton = this.createPageArrow("Right",tLocX,tLocY);
            this.mControlMenuButtons.push(tButton);
         }
         else if(tItemMetaData.type == "back")
         {
            var tButton = this.createPageArrow("Left",tLocX,tLocY);
            this.mControlMenuButtons.push(tButton);
         }
         tColIndex++;
         if(tColIndex >= com.sulake.habbo.avatareditor.ColorChooserMenu.MAX_COLS)
         {
            tColIndex = 0;
            tRowIndex++;
         }
         i++;
      }
   }
   function clearMenu()
   {
      var i = 0;
      while(i < this.mPreviewItems.length)
      {
         this.mPreviewItems[i].removeMovieClip();
         i++;
      }
      var i = 0;
      while(i < this.mControlMenuButtons.length)
      {
         this.mControlMenuButtons[i].removeMovieClip();
         i++;
      }
      this.mPreviewItems = new Array();
      this.mControlMenuButtons = new Array();
      this.mMenuMc.removeMovieClip();
      this.mMenuMc = this.mHolderMc.createEmptyMovieClip("colorchoosermenu",this.mHolderMc.getNextHighestDepth());
   }
   function getCurrentSelectedPaletteId()
   {
      return this.mCurrentSelectedId;
   }
   function getCurrentSelectedColorId()
   {
      return this.mCurrentSelectedId;
   }
   function createColorItem(aColor, aLocX, aLocY, aSelected)
   {
      var tColorStr = aColor.getColorStr();
      var tColorIndex = aColor.getIndex();
      var tColorId = aColor.getID();
      var tIsClubColor = aColor.isClubOnly();
      var tButtonMc = this.mMenuMc.createEmptyMovieClip("colorButton_" + tColorIndex,this.mMenuMc.getNextHighestDepth());
      var tColorIcon = tButtonMc.attachMovie("colorBg","bg",tButtonMc.getNextHighestDepth());
      if(tIsClubColor == true)
      {
         var tHcTag = tButtonMc.attachMovie("hcTagSmall","hcOverlay",tButtonMc.getNextHighestDepth());
         tHcTag._x = 1;
         tHcTag._y = 1;
      }
      if(aSelected == true)
      {
         tButtonMc.attachMovie("colorSelect","selected",tButtonMc.getNextHighestDepth());
      }
      tColorIcon._x += 3;
      tColorIcon._y += 3;
      tButtonMc._x = aLocX;
      tButtonMc._y = aLocY;
      tButtonMc.colorValue = tColorStr;
      this.setColor(tColorIcon,tColorStr);
      var tOwner = this;
      tButtonMc.onRelease = function()
      {
         tOwner.colorItemClicked(tColorId,tColorStr);
      };
      this.mPreviewItems.push(tButtonMc);
      return tButtonMc;
   }
   function createPageArrow(aDirection, aLocX, aLocY)
   {
      var tName = "arrowSmall" + aDirection;
      var tOwner = this;
      var tIconMc;
      if(aDirection == "Right")
      {
         tIconMc = this.mMenuMc.attachMovie(tName,"right",this.mMenuMc.getNextHighestDepth());
         tIconMc.onRelease = function()
         {
            tOwner.showPage(tOwner.mCurrentPageIndex + 1);
         };
      }
      else
      {
         tIconMc = this.mMenuMc.attachMovie(tName,"left",this.mMenuMc.getNextHighestDepth());
         tIconMc.onRelease = function()
         {
            tOwner.showPage(tOwner.mCurrentPageIndex - 1);
         };
      }
      tIconMc._x = aLocX;
      tIconMc._y = aLocY;
      return tIconMc;
   }
   function setColor(aMc, aColor)
   {
      aColor = String(aColor);
      var tR = aColor.substring(0,2);
      var tG = aColor.substring(2,4);
      var tB = aColor.substring(4,6);
      tR = parseInt(tR,16);
      tG = parseInt(tG,16);
      tB = parseInt(tB,16);
      tR = tR / 255 * 100;
      tG = tG / 255 * 100;
      tB = tB / 255 * 100;
      var tMcColor = new Color(aMc);
      var myColorTransform = {ra:tR,rb:0,ga:tG,gb:0,ba:tB,bb:0,aa:100,ab:0};
      tMcColor.setTransform(myColorTransform);
   }
   function colorItemClicked(aColorId, aColorStr)
   {
      var tOwner = this;
      var tRelayObj = new Object();
      tRelayObj.colorStr = aColorStr;
      tRelayObj.targetSetType = this.mTargetSetType;
      tRelayObj.colorId = aColorId;
      var tEvent = new com.sulake.common.util.Event("colorSelected",tRelayObj,tOwner);
      com.sulake.common.util.EventRelay.sendEvent(tEvent);
      this.mCurrentSelectedId = aColorId;
      this.showPage(this.mCurrentPageIndex);
   }
}
