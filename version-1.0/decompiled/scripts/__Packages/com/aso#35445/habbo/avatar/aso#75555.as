class com.§aso#35445§.habbo.avatar.§aso#75555§
{
   var pPartName;
   var pModelNum;
   var pMainPartName;
   var pRenderedString;
   var pCachedImageData;
   var pColorArray;
   function §aso#75555§(§aso#00903§, tModelNum, §aso#99511§, tMainPartName)
   {
      this.pPartName = §aso#00903§;
      this.pModelNum = tModelNum;
      this.pMainPartName = tMainPartName;
      this.pRenderedString = "";
      this.setColor(§aso#99511§);
      this.pCachedImageData = new Array();
   }
   function §aso#68174§()
   {
   }
   function setColor(§aso#99511§)
   {
      this.pColorArray = [];
      §aso#99511§ = String(§aso#99511§);
      var _loc5_ = §aso#99511§.substring(0,2);
      var _loc3_ = §aso#99511§.substring(2,4);
      var _loc4_ = §aso#99511§.substring(4,6);
      this.pColorArray.push(parseInt(_loc5_,16),parseInt(_loc3_,16),parseInt(_loc4_,16));
      this.pRenderedString = "";
   }
   function getMainPartName()
   {
      return this.pMainPartName;
   }
   static function §aso#54383§(type, action, part, model, dir, frame)
   {
      var _loc1_ = type + "_" + action + "_" + part + "_" + model + "_" + dir + "_" + frame;
      return _loc1_;
   }
}
