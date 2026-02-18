class com.sulake.habbo.avatareditor.ExternalsPreloader
{
   static var instance;
   function ExternalsPreloader()
   {
      com.sulake.habbo.avatar.GraphicLoader.getInstance();
      com.sulake.habbo.Localization.getInstance();
      var tFigureDataURL = "figure_data.xml";
      if(_root.figuredata_url != undefined)
      {
         tFigureDataURL = _root.figuredata_url;
      }
      com.sulake.habbo.avatar.FigureData.getInstance().setAndLoadURL(tFigureDataURL);
      var tDrawOrderURL = "draworder.xml";
      if(_root.draworder_url != undefined)
      {
         tDrawOrderURL = _root.draworder_url;
      }
      com.sulake.habbo.avatar.DrawOrder.getInstance(tDrawOrderURL);
   }
   static function getInstance()
   {
      if(com.sulake.habbo.avatareditor.ExternalsPreloader.instance == null)
      {
         com.sulake.habbo.avatareditor.ExternalsPreloader.instance = new com.sulake.habbo.avatareditor.ExternalsPreloader();
      }
      return com.sulake.habbo.avatareditor.ExternalsPreloader.instance;
   }
   function isReady()
   {
      if(!com.sulake.habbo.avatar.FigureData.getInstance().isLoaded())
      {
         trace("figudata not loaded, waiting");
         return false;
      }
      if(!com.sulake.habbo.avatar.DrawOrder.getInstance().isLoaded())
      {
         trace("Draworder not loaded, waiting");
         return false;
      }
      if(!com.sulake.habbo.avatar.GraphicLoader.getInstance().isReady())
      {
         return false;
      }
      if(!com.sulake.habbo.Localization.getInstance().isLoaded())
      {
         return false;
      }
      return true;
   }
}
