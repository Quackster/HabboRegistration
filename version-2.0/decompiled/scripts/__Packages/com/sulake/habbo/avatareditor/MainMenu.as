class com.sulake.habbo.avatareditor.MainMenu
{
   var mLocationX;
   var mLocationY;
   var mContainerMc;
   var mMenuStruct;
   var mOpenedSubItemMcs;
   var mMainItemMcs;
   var mOpenedIndexes;
   var mOpenedMainIndex;
   static var MAIN_OFFSET_X = 18;
   static var MAIN_OFFSET_Y = 0;
   static var MAIN_ITEM_WIDTH = 60;
   static var MAIN_ITEM_MARGIN = 5;
   static var SUB_OFFSET_X = 10;
   static var SUB_OFFSET_Y = 50;
   static var SUB_ITEM_WIDTH = 46;
   static var SUB_ITEM_GENDER_WIDTH = 130;
   static var SUB_ITEM_MARGIN = 12;
   function MainMenu(aLocX, aLocY, aMenuStruct, aContainerMc)
   {
      this.mLocationX = aLocX;
      this.mLocationY = aLocY;
      this.mContainerMc = aContainerMc;
      this.mMenuStruct = aMenuStruct;
      this.mOpenedSubItemMcs = new Array();
      this.mMainItemMcs = new Array();
      this.mOpenedIndexes = new Array();
      var i = 0;
      while(i < this.mMenuStruct.length)
      {
         this.mOpenedIndexes[i] = 0;
         i++;
      }
      this.mOpenedMainIndex = 0;
   }
   function showMenuIndex(aOpenedMainIndex, aOpenedSubIndex)
   {
      if(aOpenedMainIndex == undefined)
      {
         aOpenedMainIndex = this.mOpenedMainIndex;
      }
      else if(aOpenedMainIndex < 0)
      {
         aOpenedMainIndex = 0;
      }
      else if(aOpenedMainIndex > this.mMenuStruct.length)
      {
         aOpenedMainIndex = this.mMenuStruct.length;
      }
      this.mOpenedMainIndex = aOpenedMainIndex;
      if(aOpenedSubIndex == undefined)
      {
         aOpenedSubIndex = this.mOpenedIndexes[this.mOpenedMainIndex];
      }
      if(aOpenedSubIndex < 0)
      {
         aOpenedSubIndex = 0;
      }
      else if(aOpenedSubIndex > this.mMenuStruct[this.mOpenedMainIndex][2].length)
      {
         aOpenedSubIndex = this.mMenuStruct[this.mOpenedMainIndex][2].length;
      }
      this.clearMainItems();
      this.mOpenedIndexes[this.mOpenedMainIndex] = aOpenedSubIndex;
      var tLocY = this.mLocationY + com.sulake.habbo.avatareditor.MainMenu.MAIN_OFFSET_Y;
      var i = 0;
      while(i < this.mMenuStruct.length)
      {
         var tMenuItem = this.mMenuStruct[i];
         var tLocX = this.mLocationX + com.sulake.habbo.avatareditor.MainMenu.MAIN_OFFSET_X + i * (com.sulake.habbo.avatareditor.MainMenu.MAIN_ITEM_WIDTH + com.sulake.habbo.avatareditor.MainMenu.MAIN_ITEM_MARGIN);
         var tSelected = i == aOpenedMainIndex;
         this.createMainItem(tMenuItem[0],tLocX,tLocY,tSelected);
         i++;
      }
      this.openSubIndex(aOpenedSubIndex);
   }
   function getMenuMainOpenedIndex()
   {
      return this.mOpenedMainIndex;
   }
   function getMenuSubOpenedIndex()
   {
      return this.mOpenedIndexes[this.mOpenedMainIndex];
   }
   function clearMenu()
   {
      this.clearMainItems();
      this.clearSubItems();
   }
   function openMainItemId(aOpenedId)
   {
      var i = 0;
      while(i < this.mMenuStruct.length)
      {
         if(this.mMenuStruct[i][0] == aOpenedId)
         {
            this.showMenuIndex(i);
            return undefined;
         }
         i++;
      }
   }
   function openSubIndex(aOpenedSubIndex)
   {
      this.clearSubItems();
      var tMenuItem = this.mMenuStruct[this.mOpenedMainIndex];
      var tSubMenuType = tMenuItem[1];
      var tSubItems = tMenuItem[2];
      var tLocY = this.mLocationY + com.sulake.habbo.avatareditor.MainMenu.SUB_OFFSET_Y;
      var tSubItemWidth = com.sulake.habbo.avatareditor.MainMenu.SUB_ITEM_WIDTH;
      if(tSubMenuType == "gender")
      {
         tSubItemWidth = com.sulake.habbo.avatareditor.MainMenu.SUB_ITEM_GENDER_WIDTH;
      }
      var i = 0;
      while(i < tSubItems.length)
      {
         var tLocX = this.mLocationX + com.sulake.habbo.avatareditor.MainMenu.SUB_OFFSET_X + i * (tSubItemWidth + com.sulake.habbo.avatareditor.MainMenu.SUB_ITEM_MARGIN);
         var tSelected = i == aOpenedSubIndex;
         this.createSubItem(tSubItems[i],tSubMenuType,tLocX,tLocY,tSelected);
         i++;
      }
   }
   function createMainItem(aItemId, aLocX, aLocY, aSelected)
   {
      var tItemId = "main_" + aItemId;
      var tMc = this.mContainerMc.createEmptyMovieClip(tItemId,this.mContainerMc.getNextHighestDepth());
      var tSelectionStr = "";
      if(aSelected == true)
      {
         tSelectionStr = "Selected";
      }
      else
      {
         tSelectionStr = "Unselected";
      }
      tMc.attachMovie("mainMenuMain" + tSelectionStr + "Bg","selectedBg",tMc.getNextHighestDepth());
      var tContentMc = tMc.attachMovie("mainMenuMain_" + aItemId + "_" + tSelectionStr,"mainItem" + aItemId,tMc.getNextHighestDepth());
      tContentMc._x = 12;
      tContentMc._y = 5;
      var tOwner = this;
      tMc.onRelease = function()
      {
         tOwner.mainItemClicked(aItemId);
      };
      tMc._x = aLocX;
      tMc._y = aLocY;
      this.mMainItemMcs.push(tMc);
   }
   function createSubItem(aItemId, aMenuItemType, aLocX, aLocY, aSelected)
   {
      var tItemId = "sub_" + aItemId;
      var tMc = this.mContainerMc.createEmptyMovieClip(tItemId,this.mContainerMc.getNextHighestDepth());
      if(aMenuItemType == "gender")
      {
         if(aSelected == true)
         {
            tMc.attachMovie("mainMenuSubGenderSelectedBg","selectedBg",tMc.getNextHighestDepth());
         }
         var tIconMc = tMc.attachMovie("mainMenuSub_" + aItemId,"mainItem" + aItemId,tMc.getNextHighestDepth());
         tIconMc._x = 5;
         tIconMc._y = 0;
         tMc.createTextField("text",2,0,0,0,0);
         var tTarget = tMc.text;
         tTarget.autoSize = false;
         tTarget._width = com.sulake.habbo.avatareditor.MainMenu.SUB_ITEM_GENDER_WIDTH - com.sulake.habbo.avatareditor.MainMenu.SUB_ITEM_WIDTH;
         tTarget._height = 20;
         var tGenderKey = "girl";
         if(aItemId == "male")
         {
            tGenderKey = "boy";
         }
         tTarget.text = com.sulake.habbo.Localization.getInstance().getText(tGenderKey);
         tTarget.selectable = false;
         var tFormatting = new TextFormat();
         tFormatting.font = "Verdana";
         tFormatting.bold = true;
         tFormatting.align = "left";
         tTarget.setTextFormat(tFormatting);
         tTarget._x = tIconMc._width + 5;
         tTarget._y = (tMc._height - tTarget._height) / 2;
      }
      else
      {
         if(aSelected == true)
         {
            tMc.attachMovie("mainMenuSubSelectedBg","selectedBg",tMc.getNextHighestDepth());
         }
         var tContentMc = tMc.attachMovie("mainMenuSub_" + aItemId,"mainItem" + aItemId,tMc.getNextHighestDepth());
         tContentMc._x = 5;
         tContentMc._y = 0;
      }
      var tOwner = this;
      tMc.onRelease = function()
      {
         tOwner.subItemClicked(aItemId);
      };
      this.mOpenedSubItemMcs.push(tMc);
      tMc._x = aLocX;
      tMc._y = aLocY;
   }
   function mainItemClicked(aItemId)
   {
      this.openMainItemId(aItemId);
      var tSubItemIndex = this.mOpenedIndexes[this.mOpenedMainIndex];
      var tSelectedSetType = this.mMenuStruct[this.mOpenedMainIndex][2][tSubItemIndex];
      var tOwner = this;
      var tRelayObj = new Object();
      tRelayObj.setType = tSelectedSetType;
      var tEvent = new com.sulake.common.util.Event("setTypeSelected",tRelayObj,tOwner);
      com.sulake.common.util.EventRelay.sendEvent(tEvent);
   }
   function subItemClicked(aItemId)
   {
      var tSubItems = this.mMenuStruct[this.mOpenedMainIndex][2];
      var i = 0;
      while(i < tSubItems.length)
      {
         if(tSubItems[i] == aItemId)
         {
            this.showMenuIndex(this.mOpenedMainIndex,i);
         }
         i++;
      }
      var tOwner = this;
      var tRelayObj = new Object();
      tRelayObj.setType = aItemId;
      var tEvent = new com.sulake.common.util.Event("setTypeSelected",tRelayObj,tOwner);
      com.sulake.common.util.EventRelay.sendEvent(tEvent);
   }
   function clearMainItems()
   {
      var i = 0;
      while(i < this.mMainItemMcs.length)
      {
         this.mMainItemMcs[i].removeMovieClip();
         i++;
      }
   }
   function clearSubItems()
   {
      var i = 0;
      while(i < this.mOpenedSubItemMcs.length)
      {
         this.mOpenedSubItemMcs[i].removeMovieClip();
         i++;
      }
   }
}
