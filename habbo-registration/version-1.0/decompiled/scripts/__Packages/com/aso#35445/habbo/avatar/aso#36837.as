class com.§aso#35445§.habbo.avatar.§aso#36837§ extends com.§aso#35445§.habbo.avatar.§aso#75555§
{
   var pPartName;
   var pModelNum;
   var pMainPartName;
   var pRenderedString;
   var pBaseMc;
   var pHolderMc;
   var pColorArray;
   static var §aso#18870§ = new Array("li","lh","ls","bd","sh","lg","ch","hd","fc","ey","hr","ri","rh","rs");
   function §aso#36837§(§aso#00903§, tModelNum, §aso#99511§, tMainPartName, §aso#64548§)
   {
      super();
      this.pPartName = §aso#00903§;
      this.pModelNum = tModelNum;
      this.pMainPartName = tMainPartName;
      this.pRenderedString = "";
      this.setColor(§aso#99511§);
      this.pBaseMc = §aso#64548§;
   }
   function §aso#68174§()
   {
      this.pHolderMc.removeMovieClip();
   }
   function setFrameAndRegpoint(type, action, dir, frame)
   {
      var _loc2_ = com["aso#35445"].habbo.avatar["aso#75555"]["aso#54383"](type,action,this.pPartName,this.pModelNum,dir,frame);
      if(_loc2_ != this.pRenderedString)
      {
         this.pHolderMc = this.pBaseMc.attachMovie(_loc2_,this.pPartName,this.getPartDepth(this.pPartName));
         this.setPartColor(this.pColorArray[0],this.pColorArray[1],this.pColorArray[2]);
         this.pRenderedString = _loc2_;
         if(this.pHolderMc == undefined)
         {
            this.pBaseMc.attachMovie("empty_mc",this.pPartName,this.getPartDepth(this.pPartName));
            return false;
         }
      }
      return true;
   }
   function moveY(tNum)
   {
      this.pHolderMc._y += tNum;
   }
   function §aso#31819§()
   {
      this.setPartColor(this.pColorArray[0],this.pColorArray[1],this.pColorArray[2]);
   }
   function getPartDepth(§aso#00903§)
   {
      var _loc1_ = 0;
      while(_loc1_ < com["aso#35445"].habbo.avatar["aso#36837"]["aso#18870"].length)
      {
         if(§aso#00903§ == com["aso#35445"].habbo.avatar["aso#36837"]["aso#18870"][_loc1_])
         {
            return _loc1_ + 10;
         }
         _loc1_ = _loc1_ + 1;
      }
      trace("Error: getPartDepth() failed");
      return random(1000);
   }
   function setPartColor(§aso#41984§, tG, tB)
   {
      if(this.pPartName == "ey")
      {
         return undefined;
      }
      §aso#41984§ = §aso#41984§ / 255 * 100;
      tG = tG / 255 * 100;
      tB = tB / 255 * 100;
      var _loc3_ = new Color(this.pHolderMc);
      var _loc4_ = {ra:§aso#41984§,rb:0,ga:tG,gb:0,ba:tB,bb:0,aa:100,ab:0};
      _loc3_.setTransform(_loc4_);
   }
}
