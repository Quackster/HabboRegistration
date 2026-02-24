onClipEvent(enterFrame){
   iPer = Math.round(_parent.getBytesLoaded() / _parent.getBytesTotal() * 100);
   this.b._width = Math.round(1.24 * iPer);
   if(iPer == 100)
   {
      _parent.play();
   }
}
