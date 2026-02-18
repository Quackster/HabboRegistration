class com.sulake.habbo.avatar.GraphicLoader
{
   var mGraphicsLoaded;
   var mHolderMc;
   static var instance;
   function GraphicLoader(aInjected)
   {
      this.mGraphicsLoaded = false;
      if(aInjected)
      {
         this.mGraphicsLoaded = true;
         this.mHolderMc = _root.createEmptyMovieClip("media_holder",_root.getNextHighestDepth());
         this.mHolderMc._x = -1000;
      }
      else
      {
         this.loadGraphicSwf();
      }
   }
   static function getInstance(aInjected)
   {
      if(com.sulake.habbo.avatar.GraphicLoader.instance == null)
      {
         com.sulake.habbo.avatar.GraphicLoader.instance = new com.sulake.habbo.avatar.GraphicLoader(aInjected);
      }
      return com.sulake.habbo.avatar.GraphicLoader.instance;
   }
   function loadGraphicSwf()
   {
      this.mHolderMc = _root.createEmptyMovieClip("media_holder",_root.getNextHighestDepth());
      var mcLoader = new MovieClipLoader();
      mcLoader.addListener(this);
      mcLoader.loadClip("avatars_big.swf",this.mHolderMc);
   }
   function onLoadComplete(aMc)
   {
      this.mHolderMc._x = -1000;
      this.mGraphicsLoaded = true;
   }
   function isReady()
   {
      return this.mGraphicsLoaded;
   }
   function getPartBitmap(aPartName, aCanvasSize)
   {
      if(aCanvasSize == undefined)
      {
         aCanvasSize = [64,106,0,-8];
      }
      var tImageMc = this.mHolderMc.attachMovie(aPartName,"temp",2);
      if(tImageMc == undefined)
      {
         return null;
      }
      var tBitmapData = new flash.display.BitmapData(aCanvasSize[0],aCanvasSize[1],true,0);
      var tTransform = new flash.geom.Matrix();
      tTransform.translate(aCanvasSize[2],aCanvasSize[1] + aCanvasSize[3]);
      tBitmapData.draw(this.mHolderMc,tTransform);
      return tBitmapData;
   }
}
