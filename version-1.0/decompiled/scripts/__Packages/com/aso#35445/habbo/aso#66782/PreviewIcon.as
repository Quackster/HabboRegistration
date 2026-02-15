class com.§aso#35445§.habbo.§aso#66782§.PreviewIcon
{
   var holderMc;
   var §aso#44218§;
   var bgMc;
   var partList;
   static var §aso#57167§ = {hr:82,hd:76,ch:53,lg:32,sh:21};
   function PreviewIcon(§aso#64548§, tMaskMc, §aso#16636§)
   {
      this.holderMc = §aso#64548§;
      this["aso#44218"] = tMaskMc;
      this.bgMc = §aso#16636§;
      this.partList = new Object();
      this.bgMc.attachMovie("prevIconBg","bg",1);
      this.bgMc.bg._x += 11;
      this.bgMc.bg._y -= 4;
      this["aso#44218"].attachMovie("prevIconMask","mask",1);
      this["aso#44218"].mask._x += 18;
      this["aso#44218"].mask._y += 3;
      this.holderMc.setMask(this["aso#44218"]);
   }
   function §aso#20262§(§aso#00903§, §aso#35024§, tMainPartName, §aso#99511§)
   {
      if(§aso#00903§ == "bd" || §aso#00903§ == "lh" || §aso#00903§ == "rh")
      {
         return undefined;
      }
      var _loc2_ = new com["aso#35445"].habbo.avatar["aso#36837"](§aso#00903§,§aso#35024§,§aso#99511§,tMainPartName,this.holderMc);
      _loc2_.setFrameAndRegpoint("h","std",2,0);
      _loc2_.moveY(com["aso#35445"].habbo["aso#66782"].PreviewIcon["aso#57167"][tMainPartName]);
      this.partList[§aso#00903§] = _loc2_;
   }
   function §aso#08284§(tMainPartName)
   {
      for(var _loc3_ in this.partList)
      {
         if(this.partList[_loc3_].getMainPartName() == tMainPartName)
         {
            this.partList[_loc3_]["aso#68174"]();
            this.partList[_loc3_] = null;
         }
      }
   }
   function setColor(§aso#82936§)
   {
      for(var _loc2_ in this.partList)
      {
         this.partList[_loc2_].setColor(§aso#82936§);
         this.partList[_loc2_]["aso#31819"]();
      }
   }
}
