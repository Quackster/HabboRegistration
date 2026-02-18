class com.sulake.habbo.avatar.FigureDataPart
{
   var mPartId;
   var mPartType;
   var mColorable;
   function FigureDataPart(aPartId, aType, aColorable)
   {
      this.mPartId = aPartId;
      this.mPartType = aType;
      this.mColorable = aColorable;
   }
   function getPartId()
   {
      return this.mPartId;
   }
   function getPartType()
   {
      return this.mPartType;
   }
   function isPartColorable()
   {
      return this.mColorable;
   }
}
