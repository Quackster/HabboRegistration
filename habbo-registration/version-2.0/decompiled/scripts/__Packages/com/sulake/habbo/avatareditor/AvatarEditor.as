class com.sulake.habbo.avatareditor.AvatarEditor
{
   static var mainMc;
   function AvatarEditor()
   {
   }
   function Registration()
   {
   }
   static function main()
   {
      com.sulake.habbo.avatareditor.AvatarEditor.mainMc = _root.createEmptyMovieClip("mainMC",_root.getNextHighestDepth());
      com.sulake.habbo.avatareditor.AvatarEditorUi.getInstance(com.sulake.habbo.avatareditor.AvatarEditor.mainMc);
   }
}
