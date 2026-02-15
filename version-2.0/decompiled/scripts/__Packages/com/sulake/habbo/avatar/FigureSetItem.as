class com.sulake.habbo.avatar.FigureSetItem
{
   var mSetType;
   var mSetId;
   var mColorId;
   function FigureSetItem(aSetType, aSetId, aColorId)
   {
      this.mSetType = aSetType;
      this.mSetId = aSetId;
      this.mColorId = aColorId;
   }
   function setValues(aSetType, aSetId, aColorId)
   {
      this.mSetType = aSetType;
      this.mSetId = aSetId;
      this.mColorId = aColorId;
   }
   function getSetId()
   {
      return this.mSetId;
   }
   function getSetType()
   {
      return this.mSetType;
   }
   function getColorId()
   {
      return this.mColorId;
   }
}
