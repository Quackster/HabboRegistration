class com.sulake.habbo.avatar.FigureDataSet
{
   var mSetId;
   var mSetType;
   var mPaletteId;
   var mGender;
   var mClubOnly;
   var mSelectable;
   var mColorable;
   var mParts;
   var mHiddenLayers;
   function FigureDataSet(aSetId, aSetType, aPaletteId, aGender, aParts, aClubOnly, aSelectable, aColorable, aHiddenLayers)
   {
      this.mSetId = aSetId;
      this.mSetType = aSetType;
      this.mPaletteId = aPaletteId;
      this.mGender = aGender;
      this.mClubOnly = aClubOnly;
      this.mSelectable = aSelectable;
      this.mColorable = aColorable;
      this.mParts = aParts;
      this.mHiddenLayers = aHiddenLayers;
   }
   function getSetId()
   {
      return this.mSetId;
   }
   function getSetType()
   {
      return this.mSetType;
   }
   function getPaletteId()
   {
      return this.mPaletteId;
   }
   function getGender()
   {
      return this.mGender;
   }
   function isClubOnly()
   {
      return this.mClubOnly;
   }
   function isSelectable()
   {
      return this.mSelectable;
   }
   function isColorable()
   {
      return this.mColorable;
   }
   function getParts()
   {
      return this.mParts;
   }
   function getHiddenLayers()
   {
      return this.mHiddenLayers;
   }
}
