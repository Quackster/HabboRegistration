class com.sulake.habbo.avatar.AvatarImageManager
{
   var mainMC;
   var avatarImages;
   static var classInstance;
   function AvatarImageManager(defaultMc)
   {
      this.mainMC = defaultMc;
      com.sulake.habbo.avatar.FigureData.getInstance();
      com.sulake.habbo.avatar.DrawOrder.getInstance();
      com.sulake.habbo.avatar.GraphicLoader.getInstance();
      this.avatarImages = new Object();
   }
   static function getInstance(defaultMc)
   {
      if(com.sulake.habbo.avatar.AvatarImageManager.classInstance == null)
      {
         com.sulake.habbo.avatar.AvatarImageManager.classInstance = new com.sulake.habbo.avatar.AvatarImageManager(defaultMc);
      }
      return com.sulake.habbo.avatar.AvatarImageManager.classInstance;
   }
   function deconstruct()
   {
      this.removeAllAvatars();
      this.avatarImages = undefined;
   }
   function isReadyToDraw()
   {
      return com.sulake.habbo.avatar.FigureData.getInstance().isLoaded();
   }
   function removeAllAvatars(aNotThese)
   {
      var tDeleteThis;
      for(var tName in this.avatarImages)
      {
         tDeleteThis = true;
         var i = 0;
         while(i < aNotThese.length)
         {
            if(tName == aNotThese[i])
            {
               tDeleteThis = false;
            }
            i++;
         }
         if(tDeleteThis)
         {
            this.removeAvatar(tName);
         }
      }
      return undefined;
   }
   function removeAvatar(aName)
   {
      this.avatarImages[aName].deconstruct();
      delete this.avatarImages[aName];
      return undefined;
   }
   function createAvatarImage(tName, tScale, tMoving, aBaseMc, aOverride)
   {
      if(this.avatarImages[tName] != undefined)
      {
         if(!aOverride)
         {
            return null;
         }
         this.removeAvatar(tName);
      }
      var tBaseMc = aBaseMc;
      if(tBaseMc == undefined)
      {
         tBaseMc = this.mainMC;
      }
      var tAvatarImage = new com.sulake.habbo.avatar.AvatarImage(tBaseMc,tName,tScale);
      this.avatarImages[tName] = tAvatarImage;
      return tAvatarImage;
   }
   function getAvatar(tName)
   {
      return this.avatarImages[tName];
   }
}
