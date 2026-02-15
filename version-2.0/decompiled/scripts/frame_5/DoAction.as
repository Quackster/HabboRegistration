if(_framesloaded == _totalframes && com.sulake.habbo.avatareditor.ExternalsPreloader.getInstance().isReady())
{
   gotoAndStop("main");
}
else
{
   gotoAndStop("loading");
   play();
}
