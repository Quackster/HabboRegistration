class com.sulake.habbo.avatar.FigureDataColor
{
   var mPaletteId;
   var mColor;
   var mId;
   var mIndex;
   var mClubOnly;
   var mSelectable;
   function FigureDataColor(aPaletteId, aColor, aId, aIndex, aClubOnly, aSelectable)
   {
      this.mPaletteId = aPaletteId;
      this.mColor = aColor;
      this.mId = aId;
      this.mIndex = aIndex;
      this.mClubOnly = aClubOnly;
      this.mSelectable = aSelectable;
   }
   function getPaletteId()
   {
      return this.mPaletteId;
   }
   function getColorStr()
   {
      return this.mColor;
   }
   function getID()
   {
      return this.mId;
   }
   function getIndex()
   {
      return this.mIndex;
   }
   function isClubOnly()
   {
      return this.mClubOnly;
   }
   function isSelectable()
   {
      return this.mSelectable;
   }
}
