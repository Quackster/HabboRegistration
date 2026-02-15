class com.sulake.habbo.avatareditor.AvatarEditorUi implements com.sulake.common.util.EventRelayListener
{
   var mMainMc;
   var mUserHasClub;
   var mShowClubSelections;
   var mSelectedAvatarFigure;
   var mStoredFemaleAvatarFigure;
   var mStoredMaleAvatarFigure;
   var mCloudAnimations;
   var mMenuStateString;
   var mCloudAnimationsContainerMc;
   var mEditorOkToProceed;
   var mEditorInitBlockActive;
   var mEditorInitBlockCallId;
   var mAvatarImageManager;
   var mRandomizerMenu;
   var mColorChooser;
   var mMainMenu;
   var mBodyPartMenu;
   var mRandomizerLoopId;
   static var mInstance = null;
   static var INIT_PROCEED_TIMEOUT = 5000;
   static var DEFAULT_SET_TYPE = "hd";
   function AvatarEditorUi(aMainMc)
   {
      this.mMainMc = aMainMc;
      this.mUserHasClub = _root.userHasClub == 1;
      this.mShowClubSelections = _root.showClubSelections == 1;
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
         this.mShowClubSelections = true;
      }
      this.createUi();
   }
   static function getInstance(aMainMc)
   {
      if(com.sulake.habbo.avatareditor.AvatarEditorUi.mInstance == null)
      {
         com.sulake.habbo.avatareditor.AvatarEditorUi.mInstance = new com.sulake.habbo.avatareditor.AvatarEditorUi(aMainMc);
      }
      return com.sulake.habbo.avatareditor.AvatarEditorUi.mInstance;
   }
   function createUi()
   {
      var tFigureString = _root.figure;
      var tFigureGender = _root.gender;
      if(_root.showVersion != 1)
      {
         _root.versionInfo = "";
      }
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
      }
      if(tFigureString == undefined || tFigureGender == undefined || tFigureString == "" || tFigureGender == "")
      {
         if(tFigureGender == undefined || tFigureGender == "")
         {
            tFigureGender = "U";
         }
         this.mSelectedAvatarFigure = new com.sulake.habbo.avatar.Figure("default","","");
         this.randomizeFigure(this.mSelectedAvatarFigure,tFigureGender);
      }
      else
      {
         this.mSelectedAvatarFigure = new com.sulake.habbo.avatar.Figure("default",tFigureGender,"");
         var tFigureWasValid = this.mSelectedAvatarFigure.parseFigureString(tFigureString);
         if(tFigureWasValid == false)
         {
            this.informContainerOldFigure();
         }
      }
      this.mStoredFemaleAvatarFigure = new com.sulake.habbo.avatar.Figure("storedFemale","F","");
      this.mStoredMaleAvatarFigure = new com.sulake.habbo.avatar.Figure("storedMale","M","");
      this.mCloudAnimations = new Array();
      this.createMainMenu();
      this.createBodyPartMenu();
      this.createColorChooserMenu();
      this.createAvatarDisplay();
      this.updateAvatar();
      this.createRandomizeMenu();
      com.sulake.common.util.EventRelay.addListener(this,"setTypeSelected");
      com.sulake.common.util.EventRelay.addListener(this,"colorSelected");
      com.sulake.common.util.EventRelay.addListener(this,"setSelected");
      com.sulake.common.util.EventRelay.addListener(this,"randomizeAvatar");
      if(_root.menuState != undefined && _root.menuState != "")
      {
         this.mMenuStateString = _root.menuState;
         this.updatePartAndColorMenu(this.mMenuStateString);
      }
      this.mCloudAnimationsContainerMc = this.mMainMc.createEmptyMovieClip("cloudbase",this.mMainMc.getNextHighestDepth());
      this.informContainerPageFigure(this.mSelectedAvatarFigure.getGender(),this.mSelectedAvatarFigure.getFigureString());
      var tClubStateOk = this.checkClubSetsStatus();
      if(tClubStateOk)
      {
         this.informContainerPageProceedStatus(false);
         this.mEditorOkToProceed = true;
         this.mEditorInitBlockActive = true;
         this.mEditorInitBlockCallId = setInterval(this,"removeInitBlock",com.sulake.habbo.avatareditor.AvatarEditorUi.INIT_PROCEED_TIMEOUT);
      }
      return true;
   }
   function removeInitBlock()
   {
      clearInterval(this.mEditorInitBlockCallId);
      this.mEditorInitBlockActive = false;
      this.informContainerPageProceedStatus(this.mEditorOkToProceed);
   }
   function randomizeFigure(aFigure, aGender)
   {
      aFigure.randomizeFigure(aGender,this.mUserHasClub && this.mShowClubSelections);
   }
   function updateAvatar()
   {
      _root.lookstring_field.text = this.mSelectedAvatarFigure.getGender() + "_" + this.mSelectedAvatarFigure.getFigureString();
      this.mAvatarImageManager.getAvatar("registration_avatar").setLook(this.mSelectedAvatarFigure);
   }
   function createAvatarDisplay()
   {
      this.mAvatarImageManager = com.sulake.habbo.avatar.AvatarImageManager.getInstance();
      var tDisplayAvatar = this.mAvatarImageManager.createAvatarImage("registration_avatar",2,false,this.mMainMc,true);
      tDisplayAvatar.moveTo(303,70);
   }
   function createRandomizeMenu()
   {
      var tLocX = 307;
      var tLocY = 46;
      this.mRandomizerMenu = new com.sulake.habbo.avatareditor.RandomizeMenu(this.mMainMc,tLocX,tLocY);
   }
   function createColorChooserMenu()
   {
      var tMenuLocX = 15;
      var tMenuLocY = 270;
      this.mColorChooser = new com.sulake.habbo.avatareditor.ColorChooserMenu(this.mMainMc,tMenuLocX,tMenuLocY);
      var tPaletteId = com.sulake.habbo.avatar.FigureData.getInstance().getPaletteIdForSetType(com.sulake.habbo.avatareditor.AvatarEditorUi.DEFAULT_SET_TYPE);
      var tSelectedColorId = this.mSelectedAvatarFigure.getSetTypeColorId(com.sulake.habbo.avatareditor.AvatarEditorUi.DEFAULT_SET_TYPE);
      this.mColorChooser.showColorChooser(tPaletteId,tSelectedColorId,com.sulake.habbo.avatareditor.AvatarEditorUi.DEFAULT_SET_TYPE,this.mShowClubSelections);
   }
   function createMainMenu()
   {
      var tMainMenuStruct = new Array();
      tMainMenuStruct.push(new Array("body","gender",new Array("male","female")));
      tMainMenuStruct.push(new Array("head","part",new Array("hr","ha","he","ea","fa")));
      tMainMenuStruct.push(new Array("chest","part",new Array("ch","ca")));
      tMainMenuStruct.push(new Array("legs","part",new Array("lg","sh","wa")));
      var tMenuLocX = 0;
      var tMenuLocY = 0;
      this.mMainMenu = new com.sulake.habbo.avatareditor.MainMenu(tMenuLocX,tMenuLocY,tMainMenuStruct,this.mMainMc);
      var tGender = this.mSelectedAvatarFigure.getGender();
      var tSubIndexForGender = 0;
      if(tGender == "F")
      {
         tSubIndexForGender = 1;
      }
      this.mMainMenu.showMenuIndex(0,tSubIndexForGender);
   }
   function createBodyPartMenu()
   {
      var tMenuLocX = 3;
      var tMenuLocY = 100;
      this.mBodyPartMenu = new com.sulake.habbo.avatareditor.BodyPartMenu(tMenuLocX,tMenuLocY,"prevIconBg",this.mShowClubSelections,this.mMainMc);
      var tGender = this.mSelectedAvatarFigure.getGender();
      var tColorId = this.mSelectedAvatarFigure.getSetTypeColorId(com.sulake.habbo.avatareditor.AvatarEditorUi.DEFAULT_SET_TYPE);
      var tColorData = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tColorId);
      var tColorStr = tColorData.getColorStr();
      var tSetObj = this.mSelectedAvatarFigure.getSetItemByType(com.sulake.habbo.avatareditor.AvatarEditorUi.DEFAULT_SET_TYPE);
      var tSelectedSetId = tSetObj.getSetId();
      var tSetType = tSetObj.getSetType();
      var tMandatorySet = com.sulake.habbo.avatar.FigureData.getInstance().isSetTypeMandatory(tSetType);
      this.mBodyPartMenu.showMenu(com.sulake.habbo.avatareditor.AvatarEditorUi.DEFAULT_SET_TYPE,tGender,tColorStr,tSelectedSetId,tMandatorySet);
   }
   function checkClubSetsStatus()
   {
      var tClubSets = this.mSelectedAvatarFigure.getClubSets();
      if(tClubSets.length > 0)
      {
         if(this.mUserHasClub == false)
         {
            this.informContainerPageProceedStatus(false);
            this.informContainerPageRequestClub(true);
            return false;
         }
      }
      var tClubColors = this.mSelectedAvatarFigure.getClubColors();
      if(tClubColors.length > 0)
      {
         if(this.mUserHasClub == false)
         {
            this.informContainerPageProceedStatus(false);
            this.informContainerPageRequestClub(true);
            return false;
         }
      }
      this.informContainerPageProceedStatus(true);
      this.informContainerPageRequestClub(false);
      return true;
   }
   function receiveEvent(aEvent)
   {
      var tTopic = aEvent.getTopic();
      var tData = aEvent.getData();
      if(tTopic == "setTypeSelected")
      {
         this.handleSetTypeSelectionEvent(tData);
      }
      else if(tTopic == "randomizeAvatar")
      {
         this.handleRandomizeEvent(tData);
      }
      else if(tTopic == "setSelected")
      {
         this.handleSetSelectionEvent(tData);
      }
      else if(tTopic == "colorSelected")
      {
         this.handleColorSelectionEvent(tData);
      }
      else if(tTopic == "randomizeAvatar")
      {
         this.handleRandomizeEvent(tData);
      }
   }
   function informContainerOldFigure()
   {
      var tCallFunction = "HabboEditor.showOldFigureNotice";
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
         return undefined;
      }
      flash.external.ExternalInterface.call(tCallFunction);
   }
   function informContainerPageFigure(aGender, aFigureStr)
   {
      var tCallFunction = "HabboEditor.setGenderAndFigure";
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
         return undefined;
      }
      flash.external.ExternalInterface.call(tCallFunction,aGender,aFigureStr);
   }
   function informContainerPageProceedStatus(aIsOkToContinue)
   {
      this.mEditorOkToProceed = aIsOkToContinue;
      if(this.mEditorInitBlockActive)
      {
         return undefined;
      }
      var tCallFunction = "HabboEditor.setAllowedToProceed";
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
         return undefined;
      }
      flash.external.ExternalInterface.call(tCallFunction,aIsOkToContinue);
   }
   function informContainerPageMenuStatus(aState)
   {
      var tCallFunction = "HabboEditor.setEditorState";
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
         return undefined;
      }
      flash.external.ExternalInterface.call(tCallFunction,aState);
   }
   function informContainerPageRequestClub(aShowClubRequest)
   {
      var tCallString = "HabboEditor.hideHabboClubNotice";
      if(aShowClubRequest)
      {
         tCallString = "HabboEditor.showHabboClubNotice";
      }
      var tPlayerPath = _root._url;
      if(tPlayerPath.substr(0,4) == "file")
      {
         return undefined;
      }
      flash.external.ExternalInterface.call(tCallString);
   }
   function handleSetTypeSelectionEvent(aData)
   {
      var tSetType = aData.setType;
      var tOldGender = this.mSelectedAvatarFigure.getGender();
      var tNewGender = tOldGender;
      if(tSetType == "male" || tSetType == "female")
      {
         if(tSetType == "male")
         {
            tNewGender = "M";
         }
         else
         {
            tNewGender = "F";
         }
         tSetType = "hd";
      }
      if(tOldGender != tNewGender)
      {
         var tOldFigureStr = this.mSelectedAvatarFigure.getFigureString();
         if(tNewGender == "M")
         {
            this.mStoredFemaleAvatarFigure.parseFigureString(tOldFigureStr);
            this.mSelectedAvatarFigure.setGender(tNewGender);
            this.mSelectedAvatarFigure.parseFigureString(this.mStoredMaleAvatarFigure.getFigureString());
         }
         else
         {
            this.mStoredMaleAvatarFigure.parseFigureString(tOldFigureStr);
            this.mSelectedAvatarFigure.setGender(tNewGender);
            this.mSelectedAvatarFigure.parseFigureString(this.mStoredFemaleAvatarFigure.getFigureString());
         }
         if(this.mSelectedAvatarFigure.getFigureString().length == 0)
         {
            this.randomizeFigure(this.mSelectedAvatarFigure,tNewGender);
            this.checkClubSetsStatus();
         }
         this.informContainerPageFigure(this.mSelectedAvatarFigure.getGender(),this.mSelectedAvatarFigure.getFigureString());
         this.informContainerPageProceedStatus(true);
      }
      var tMandatorySet = com.sulake.habbo.avatar.FigureData.getInstance().isSetTypeMandatory(tSetType);
      var tPaletteID = com.sulake.habbo.avatar.FigureData.getInstance().getPaletteIdForSetType(tSetType);
      var tSetItem = this.mSelectedAvatarFigure.getSetItemByType(tSetType);
      if(tSetItem != null)
      {
         var tSetId = tSetItem.getSetId();
         var tColorId = tSetItem.getColorId();
         var tColorData = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tColorId);
         var tColorStr = tColorData.getColorStr();
         if(this.mColorChooser != undefined)
         {
            this.mColorChooser.showColorChooser(tPaletteID,tColorId,tSetType,this.mShowClubSelections);
         }
         if(this.mBodyPartMenu != undefined)
         {
            this.mBodyPartMenu.showMenu(tSetType,tNewGender,tColorStr,tSetId,tMandatorySet);
         }
         this.updateAvatar();
      }
      else
      {
         var tSetId = 0;
         var tSetColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tPaletteID,this.mUserHasClub,true);
         var tColor = tSetColors[0];
         var tColorId = tColor.getID();
         var tColorStr = tColor.getColorStr();
         if(this.mColorChooser != undefined)
         {
            this.mColorChooser.showColorChooser(tPaletteID,tColorId,tSetType,this.mShowClubSelections);
         }
         if(this.mBodyPartMenu != undefined)
         {
            this.mBodyPartMenu.showMenu(tSetType,tNewGender,tColorStr,tSetId,tMandatorySet);
         }
      }
      var tState = tSetType + "-" + this.mMainMenu.getMenuMainOpenedIndex() + "-" + this.mMainMenu.getMenuSubOpenedIndex();
      this.informContainerPageMenuStatus(tState);
   }
   function handleColorSelectionEvent(aData)
   {
      var tColorStr = aData.colorStr;
      var tSetType = aData.targetSetType;
      var tColorId = aData.colorId;
      this.mBodyPartMenu.setColor(tColorStr);
      this.mSelectedAvatarFigure.setSetTypeColor(tSetType,tColorId);
      this.informContainerPageFigure(this.mSelectedAvatarFigure.getGender(),this.mSelectedAvatarFigure.getFigureString());
      this.updateAvatar();
      this.checkClubSetsStatus();
   }
   function handleSetSelectionEvent(aData)
   {
      var tSetType = aData.setType;
      var tSetId = aData.setId;
      var tAllowBodyPartMenuUpdate = true;
      var tPaletteId = com.sulake.habbo.avatar.FigureData.getInstance().getPaletteIdForSetType(tSetType);
      var tColorId = this.mSelectedAvatarFigure.getSetTypeColorId(tSetType);
      if(tColorId == undefined || tColorId == -1)
      {
         tColorId = this.mColorChooser.getCurrentSelectedColorId();
      }
      if(tColorId == undefined || tColorId == -1)
      {
         var tColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tPaletteId);
         var tColor = tColors[0];
         tColorId = tColor.getID();
         this.mColorChooser.showColorChooser(tPaletteId,tColorId,tSetType,this.mShowClubSelections);
      }
      var tColorData = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tColorId);
      var tColorStr = tColorData.getColorStr();
      var tMandatorySet = com.sulake.habbo.avatar.FigureData.getInstance().isSetTypeMandatory(tSetType);
      var tCurrentlySelectedSetItem = this.mSelectedAvatarFigure.getSetItemByType(tSetType);
      if(tSetId == tCurrentlySelectedSetItem.getSetId())
      {
         if(com.sulake.habbo.avatar.FigureData.getInstance().isSetTypeMandatory(tSetType) == false)
         {
            tSetId = 0;
            tAllowBodyPartMenuUpdate = false;
            this.mBodyPartMenu.clearSelection();
         }
      }
      if(tSetId == 0)
      {
         this.mSelectedAvatarFigure.removeSetItemByType(tSetType);
      }
      else
      {
         this.mSelectedAvatarFigure.setSetItem(tSetType,tSetId,tColorId);
      }
      if(tAllowBodyPartMenuUpdate)
      {
         this.mBodyPartMenu.setSelection(tSetId);
         this.mBodyPartMenu.setColor(tColorStr);
      }
      this.informContainerPageFigure(this.mSelectedAvatarFigure.getGender(),this.mSelectedAvatarFigure.getFigureString());
      this.updateAvatar();
      this.checkClubSetsStatus();
   }
   function handleRandomizeEvent(aData)
   {
      this.randomizeFigure(this.mSelectedAvatarFigure,this.mSelectedAvatarFigure.getGender());
      this.informContainerPageFigure(this.mSelectedAvatarFigure.getGender(),this.mSelectedAvatarFigure.getFigureString());
      this.updateAvatar();
      this.updatePartAndColorMenu();
      var tEndTime = getTimer() + 700;
      this.mRandomizerLoopId = setInterval(this,"randomizerLoop",40,tEndTime);
   }
   function randomizerLoop(aEndTime)
   {
      if(aEndTime - getTimer() > 350)
      {
         var tAnimation = this.mCloudAnimationsContainerMc.attachMovie("cloudAnimation","cloud" + i,this.mCloudAnimationsContainerMc.getNextHighestDepth());
         tAnimation._x = 305 + random(80);
         tAnimation._y = 85 + random(180);
         this.mCloudAnimations.push(tAnimation);
         return undefined;
      }
      if(getTimer() >= aEndTime)
      {
         clearInterval(this.mRandomizerLoopId);
         var i = 0;
         while(i < this.mCloudAnimations)
         {
            this.mCloudAnimations[i].removeMovieClip();
            this.mCloudAnimations[i] = null;
            i++;
         }
         this.mCloudAnimations = new Array();
         this.mCloudAnimationsContainerMc.removeMovieClip();
         this.mCloudAnimationsContainerMc = this.mMainMc.createEmptyMovieClip("cloudbase",this.mMainMc.getNextHighestDepth());
      }
   }
   function updatePartAndColorMenu(aUpdateToState)
   {
      var tSetType = this.mBodyPartMenu.getCurrentSetType();
      if(aUpdateToState != undefined && aUpdateToState != "")
      {
         var tStates = aUpdateToState.split("-");
         var tUpdateToStateType = tStates[0];
         var tMainMenuMainIndex = tStates[1];
         var tMainMenuSubIndex = tStates[2];
         this.mMainMenu.showMenuIndex(tMainMenuMainIndex,tMainMenuSubIndex);
         var tSetTypes = com.sulake.habbo.avatar.FigureData.getInstance().getSetTypes();
         var i = 0;
         while(i < tSetTypes.length)
         {
            if(tSetTypes[i][0] == tUpdateToStateType)
            {
               tSetType = tUpdateToStateType;
            }
            i++;
         }
      }
      var tGender = this.mSelectedAvatarFigure.getGender();
      var tMandatorySet = com.sulake.habbo.avatar.FigureData.getInstance().isSetTypeMandatory(tSetType);
      var tPaletteID = com.sulake.habbo.avatar.FigureData.getInstance().getPaletteIdForSetType(tSetType);
      var tSetItem = this.mSelectedAvatarFigure.getSetItemByType(tSetType);
      var tSetId;
      var tColorId;
      var tColorStr;
      if(tSetItem != null)
      {
         tSetId = tSetItem.getSetId();
         tColorId = tSetItem.getColorId();
         var tColorData = com.sulake.habbo.avatar.FigureData.getInstance().getColorData(tColorId);
         tColorStr = tColorData.getColorStr();
      }
      else
      {
         tSetId = 0;
         var tSetColors = com.sulake.habbo.avatar.FigureData.getInstance().getColorsForPaletteId(tPaletteID,this.mUserHasClub,true);
         var tColor = tSetColors[0];
         tColorId = tColor.getID();
         tColorStr = tColor.getColorStr();
      }
      if(this.mColorChooser != undefined)
      {
         this.mColorChooser.showColorChooser(tPaletteID,tColorId,tSetType,this.mShowClubSelections);
      }
      if(this.mBodyPartMenu != undefined)
      {
         this.mBodyPartMenu.showMenu(tSetType,tGender,tColorStr,tSetId,tMandatorySet);
      }
      this.checkClubSetsStatus();
      this.updateAvatar();
   }
}
