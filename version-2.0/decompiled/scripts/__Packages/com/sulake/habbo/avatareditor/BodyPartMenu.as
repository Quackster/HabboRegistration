class com.sulake.habbo.avatareditor.BodyPartMenu
{
   var mLocationX;
   var mLocationY;
   var mMenuItemBgMcId;
   var mUseClub;
   var mContainerMc;
   var mMenuMc;
   var mPreviewItems;
   var mControlMenuButtons;
   var mCurrentSelectionIsOnPageNo;
   var mCurrentSetType;
   var mCurrentGender;
   var mCurrentColor;
   var mCurrentSelectedId;
   var mSetIsMandatory;
   var mPageData;
   var mCurrentPageIndex = 0;
   var MAX_COLS = 5;
   var MAX_ROWS = 3;
   static var MENU_MARGIN = 9;
   function BodyPartMenu(aLocX, aLocY, aMenuItemBgMcId, aUseClub, aContainerMc)
   {
      this.mLocationX = aLocX;
      this.mLocationY = aLocY;
      this.mMenuItemBgMcId = aMenuItemBgMcId;
      this.mUseClub = aUseClub;
      this.mContainerMc = aContainerMc;
      this.mMenuMc = this.mContainerMc.createEmptyMovieClip("bodypartmenu",this.mContainerMc.getNextHighestDepth());
      this.mPreviewItems = new Array();
      this.mControlMenuButtons = new Array();
   }
   function showMenu(aSetType, aGender, aColorStr, aSelectedId, aIsMandatory)
   {
      if(aSelectedId == undefined)
      {
         aSelectedId = 0;
      }
      if(aIsMandatory == undefined)
      {
         aIsMandatory = true;
      }
      var tColor = aColorStr;
      if(tColor == undefined)
      {
         tColor = "FDFDFD";
      }
      if(aSelectedId == 0)
      {
         this.mCurrentSelectionIsOnPageNo = 0;
      }
      this.mCurrentSetType = aSetType;
      this.mCurrentGender = aGender;
      this.mCurrentColor = tColor;
      this.mCurrentSelectedId = aSelectedId;
      this.mSetIsMandatory = aIsMandatory;
      this.clearMenu();
      var tSets = com.sulake.habbo.avatar.FigureData.getInstance().getSetsForSetType(this.mCurrentSetType,this.mCurrentGender,this.mUseClub,true);
      this.mPageData = new Array();
      var tPageIndex = 0;
      var tCurrentPage = new Array();
      var tMaxItemsPerPage = this.MAX_COLS * this.MAX_ROWS;
      var tItemCountOnThisPage = 0;
      var tPartItemIndex = 0;
      while(tPartItemIndex < tSets.length)
      {
         if(tPageIndex == 0 && tPartItemIndex == 0)
         {
            if(this.mSetIsMandatory == false)
            {
               var tMenuMetaItem = new Object();
               tMenuMetaItem.type = "remove";
               tCurrentPage.push(tMenuMetaItem);
               tItemCountOnThisPage++;
            }
         }
         else if(tItemCountOnThisPage == 0 && tPageIndex > 0)
         {
            var tMenuMetaItem = new Object();
            tMenuMetaItem.type = "back";
            tCurrentPage.push(tMenuMetaItem);
            tItemCountOnThisPage++;
         }
         if(tItemCountOnThisPage == tMaxItemsPerPage - 1 && tPartItemIndex < tSets.length)
         {
            var tMenuMetaItem = new Object();
            tMenuMetaItem.type = "forward";
            tCurrentPage.push(tMenuMetaItem);
            tItemCountOnThisPage++;
         }
         else
         {
            var tMenuMetaItem = new Object();
            tMenuMetaItem.type = "part";
            tMenuMetaItem.index = tPartItemIndex;
            var tSet = tSets[tPartItemIndex];
            if(tSet.getSetId() == aSelectedId)
            {
               this.mCurrentSelectionIsOnPageNo = tPageIndex;
            }
            tCurrentPage.push(tMenuMetaItem);
            tPartItemIndex++;
            tItemCountOnThisPage++;
         }
         if(tPartItemIndex == tSets.length)
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
   function clearSelection()
   {
      this.mCurrentSelectedId = 0;
      var i = 0;
      while(i < this.mPreviewItems.length)
      {
         var tPreviewIcon = this.mPreviewItems[i];
         tPreviewIcon.clearSelection();
         i++;
      }
   }
   function setSelection(aSelectedId)
   {
      if(this.mCurrentSelectedId != aSelectedId)
      {
         var i = 0;
         while(i < this.mPreviewItems.length)
         {
            var tPreviewIcon = this.mPreviewItems[i];
            if(tPreviewIcon.getSetId() == this.mCurrentSelectedId)
            {
               tPreviewIcon.clearSelection();
            }
            else if(tPreviewIcon.getSetId() == aSelectedId)
            {
               tPreviewIcon.setSelection();
            }
            i++;
         }
         this.mCurrentSelectedId = aSelectedId;
      }
   }
   function clearMenu()
   {
      var i = 0;
      while(i < this.mPreviewItems.length)
      {
         this.mPreviewItems[i].destruct();
         this.mPreviewItems[i] = null;
         i++;
      }
      this.mPreviewItems = new Array();
      var i = 0;
      while(i < this.mControlMenuButtons.length)
      {
         this.mControlMenuButtons[i].removeMovieClip();
         this.mControlMenuButtons[i] = null;
         i++;
      }
      this.mControlMenuButtons = new Array();
      this.mMenuMc.removeMovieClip();
      this.mMenuMc = this.mContainerMc.createEmptyMovieClip("bodypartmenu",this.mContainerMc.getNextHighestDepth());
   }
   function setColor(aColorStr)
   {
      this.mCurrentColor = aColorStr;
      var i = 0;
      while(i < this.mPreviewItems.length)
      {
         var tPreviewIcon = this.mPreviewItems[i];
         tPreviewIcon.setColor(this.mCurrentColor);
         i++;
      }
   }
   function getCurrentSetType()
   {
      return this.mCurrentSetType;
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
      var tSets = com.sulake.habbo.avatar.FigureData.getInstance().getSetsForSetType(this.mCurrentSetType,this.mCurrentGender,this.mUseClub);
      var tPageMetaData = this.mPageData[aPageNo];
      var tItemWidth = 45;
      var tItemHeight = 45;
      var tColIndex = 0;
      var tRowIndex = 0;
      var tMaxItemsPerPage = this.MAX_COLS * this.MAX_ROWS;
      var tLastIndex = tMaxItemsPerPage - 1;
      if(tLastIndex > tPageMetaData.length)
      {
         tLastIndex = tPageMetaData.length - 1;
      }
      var i = 0;
      while(i <= tLastIndex)
      {
         var tLocX = this.mLocationX + tColIndex * (tItemWidth + com.sulake.habbo.avatareditor.BodyPartMenu.MENU_MARGIN);
         var tLocY = this.mLocationY + tRowIndex * (tItemHeight + com.sulake.habbo.avatareditor.BodyPartMenu.MENU_MARGIN);
         var tItemMetaData = tPageMetaData[i];
         if(tItemMetaData.type == "part")
         {
            var tSelected = false;
            var tSet = tSets[tItemMetaData.index];
            if(tSet.getSetId() == this.mCurrentSelectedId)
            {
               tSelected = true;
            }
            var tPreviewIcon = this.createPartItem(tSet,this.mCurrentColor,tLocX,tLocY,tSelected);
            this.mPreviewItems.push(tPreviewIcon);
         }
         else if(tItemMetaData.type == "remove")
         {
            var tSelected = this.mCurrentSelectedId == 0;
            var tButton = this.createRemoveItem(tLocX,tLocY,tSelected);
            this.mControlMenuButtons.push(tButton);
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
         if(tColIndex >= this.MAX_COLS)
         {
            tColIndex = 0;
            tRowIndex++;
         }
         i++;
      }
   }
   function itemClicked(aSetId, aSetType)
   {
      if(aSetType == undefined)
      {
         aSetType = this.mCurrentSetType;
      }
      var tOwner = this;
      var tRelayObj = new Object();
      tRelayObj.setId = aSetId;
      tRelayObj.setType = aSetType;
      var tEvent = new com.sulake.common.util.Event("setSelected",tRelayObj,tOwner);
      com.sulake.common.util.EventRelay.sendEvent(tEvent);
   }
   function createRemoveItem(aLocX, aLocY, aSelected)
   {
      var tDepth = this.mMenuMc.getNextHighestDepth();
      var tIconMc = this.mMenuMc.attachMovie("partRemove","remove",tDepth);
      tIconMc._x = aLocX + 10;
      tIconMc._y = aLocY - 5;
      if(aSelected)
      {
         tIconMc.attachMovie("partSelected","bg",tIconMc.getNextHighestDepth());
      }
      var tOwner = this;
      tIconMc.onRelease = function()
      {
         tOwner.itemClicked(0);
      };
      return tIconMc;
   }
   function createPartItem(aSet, aColorStr, aLocX, aLocY, aSelected)
   {
      var tSetId = aSet.getSetId();
      var tSetType = aSet.getSetType();
      var tPartList = aSet.getParts();
      var tDepth = this.mMenuMc.getNextHighestDepth();
      var tBgMc = this.mMenuMc.createEmptyMovieClip(String(tSetId) + tDepth,tDepth);
      tDepth++;
      var tIconMc = this.mMenuMc.createEmptyMovieClip(String(tSetId) + tDepth,tDepth);
      tDepth++;
      var tMaskMc = this.mMenuMc.createEmptyMovieClip(String(tSetId) + tDepth,tDepth);
      var tXoffset = 0;
      tIconMc._x = aLocX + tXoffset;
      tIconMc._y = aLocY;
      tBgMc._x = aLocX + tXoffset;
      tBgMc._y = aLocY;
      tMaskMc._x = aLocX + tXoffset;
      tMaskMc._y = aLocY;
      var tPreviewIcon = new com.sulake.habbo.avatareditor.PreviewIcon(tSetId,tIconMc,tMaskMc,tBgMc,aSelected);
      var i = 0;
      while(i < tPartList.length)
      {
         var tPartItem = tPartList[i];
         var tPartType = tPartItem.getPartType();
         var tPartID = String(tPartItem.getPartId());
         tPreviewIcon.createBodypart(tPartType,tPartID,tSetType,tPartItem.isPartColorable(),aColorStr);
         i++;
      }
      var tClubItem = aSet.isClubOnly();
      if(tClubItem)
      {
         tPreviewIcon.addClubTag();
      }
      var tOwner = this;
      tMaskMc.onRelease = function()
      {
         tOwner.itemClicked(tSetId,tSetType);
      };
      return tPreviewIcon;
   }
   function createPageArrow(aDirection, aLocX, aLocY)
   {
      var tName = "partArrow" + aDirection;
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
}
