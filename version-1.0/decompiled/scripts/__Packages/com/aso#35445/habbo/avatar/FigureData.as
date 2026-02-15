class com.§aso#35445§.habbo.avatar.FigureData
{
   var figureData;
   var §aso#62185§;
   var figureDataUrl;
   var figureDataXML;
   var isDataLoadedAndOk;
   static var figureDataInstance = null;
   static var §aso#81544§ = ["hr","hd","ch","lg","sh"];
   function FigureData()
   {
      var owner = this;
      this.figureData = new Object();
      this["aso#62185"] = new Object();
      if(_root.figuredata_url == undefined)
      {
         this.figureDataUrl = "figure_data_xml.xml";
      }
      else
      {
         this.figureDataUrl = _root.figuredata_url;
      }
      this.figureDataXML = new XML();
      this.figureDataXML.ignoreWhite = true;
      this.figureDataXML.onLoad = function(§aso#01874§)
      {
         owner.figureDataLoaded(§aso#01874§);
      };
      this.figureDataXML.load(this.figureDataUrl);
      this.isDataLoadedAndOk = false;
   }
   static function getInstance()
   {
      if(com["aso#35445"].habbo.avatar.FigureData.figureDataInstance == null)
      {
         com["aso#35445"].habbo.avatar.FigureData.figureDataInstance = new com["aso#35445"].habbo.avatar.FigureData();
      }
      return com["aso#35445"].habbo.avatar.FigureData.figureDataInstance;
   }
   function figureDataLoaded(tSuccess)
   {
      if(!tSuccess)
      {
         trace("figuredata loading failed, trying again");
         this.figureDataXML.load(this.figureDataUrl);
         return undefined;
      }
      this.isDataLoadedAndOk = true;
      this["aso#25830"]();
   }
   function §aso#25830§()
   {
      this.figureData.male = new Object();
      this.figureData.female = new Object();
      this["aso#62185"].male = new Object();
      this["aso#62185"].female = new Object();
      var _loc2_ = 0;
      while(_loc2_ < com["aso#35445"].habbo.avatar.FigureData["aso#81544"].length)
      {
         this.figureData.female[com["aso#35445"].habbo.avatar.FigureData["aso#81544"][_loc2_]] = new Object();
         this.figureData.male[com["aso#35445"].habbo.avatar.FigureData["aso#81544"][_loc2_]] = new Object();
         this["aso#62185"].male[com["aso#35445"].habbo.avatar.FigureData["aso#81544"][_loc2_]] = new Object();
         this["aso#62185"].female[com["aso#35445"].habbo.avatar.FigureData["aso#81544"][_loc2_]] = new Object();
         _loc2_ = _loc2_ + 1;
      }
      this["aso#21654"]("female","F");
      this["aso#21654"]("male","M");
   }
   function §aso#21654§(§aso#40592§, §aso#52570§)
   {
      var _loc14_ = this.figureDataXML.firstChild;
      var _loc10_ = new XMLNode();
      if(_loc14_.childNodes[0].attributes.i == §aso#52570§)
      {
         _loc10_ = _loc14_.childNodes[0];
      }
      else
      {
         _loc10_ = _loc14_.childNodes[1];
      }
      var _loc6_ = 0;
      while(_loc6_ < com["aso#35445"].habbo.avatar.FigureData["aso#81544"].length)
      {
         var _loc12_ = _loc10_.childNodes[_loc6_].attributes.i;
         this["aso#62185"][§aso#40592§][_loc12_] = _loc10_.childNodes[_loc6_].childNodes.length;
         var _loc5_ = 0;
         while(_loc5_ < _loc10_.childNodes[_loc6_].childNodes.length)
         {
            var _loc11_ = _loc10_.childNodes[_loc6_].childNodes[_loc5_].attributes.i;
            this.figureData[§aso#40592§][_loc12_][_loc11_] = new Object();
            var _loc3_ = this.figureData[§aso#40592§][_loc12_][_loc11_];
            _loc3_.indexNum = _loc5_;
            _loc3_.parts = new Object();
            _loc3_.colors = new Array();
            var _loc2_ = _loc10_.childNodes[_loc6_].childNodes[_loc5_];
            var _loc4_ = 0;
            while(_loc4_ < _loc2_.childNodes[0].childNodes.length)
            {
               var _loc8_ = _loc2_.childNodes[0].childNodes[_loc4_].attributes.t;
               var _loc9_ = _loc2_.childNodes[0].childNodes[_loc4_].firstChild;
               _loc3_.parts[_loc8_] = _loc9_;
               _loc4_ = _loc4_ + 1;
            }
            _loc4_ = 0;
            while(_loc4_ < _loc2_.childNodes[1].childNodes.length)
            {
               var _loc7_ = _loc2_.childNodes[1].childNodes[_loc4_].firstChild;
               _loc3_.colors.push(_loc7_);
               _loc4_ = _loc4_ + 1;
            }
            _loc5_ = _loc5_ + 1;
         }
         _loc6_ = _loc6_ + 1;
      }
   }
   function getAllPartColors(§aso#12881§, tMainPart, §aso#72350§)
   {
      var _loc2_ = this.figureData[§aso#12881§][tMainPart];
      for(var _loc4_ in _loc2_)
      {
         if(_loc2_[_loc4_].indexNum == §aso#72350§)
         {
            return _loc2_[_loc4_].colors;
         }
      }
      trace("number " + §aso#72350§ + " not found (getAllPartColors)");
      return [];
   }
   function getPartNumber(§aso#72350§, tMainPart, §aso#12881§)
   {
      var _loc2_ = this.figureData[§aso#12881§][tMainPart];
      for(var _loc4_ in _loc2_)
      {
         if(_loc2_[_loc4_].indexNum == §aso#72350§)
         {
            return _loc4_;
         }
      }
      trace("number " + §aso#72350§ + " not found");
      return "not found";
   }
   function getPartIndexByNumber(tSetToFind, §aso#12881§)
   {
      var _loc3_ = this.figureData[§aso#12881§];
      for(var _loc5_ in _loc3_)
      {
         var _loc2_ = _loc3_[_loc5_];
         if(_loc2_[tSetToFind] != undefined)
         {
            return [_loc2_[tSetToFind].indexNum,_loc5_];
         }
      }
      trace("part not found");
      return [0,"not found"];
   }
   function getNextPartByNumber(§aso#91288§, §aso#51599§, §aso#59951§)
   {
      var _loc2_ = this.figureData[§aso#59951§][§aso#51599§];
      var _loc3_ = Number(_loc2_[§aso#91288§].indexNum) + 1;
      for(var _loc4_ in _loc2_)
      {
         if(_loc2_[_loc4_].indexNum == _loc3_)
         {
            return _loc4_;
         }
      }
   }
   function isFiguredataLoaded()
   {
      return this.isDataLoadedAndOk;
   }
   function getPartAndColor(§aso#34603§, §aso#12881§)
   {
      if(§aso#12881§ == "M")
      {
         §aso#12881§ = "male";
      }
      if(§aso#12881§ == "F")
      {
         §aso#12881§ = "female";
      }
      var _loc6_ = new Array();
      var _loc10_ = parseInt(§aso#34603§[0]);
      var _loc9_ = parseInt(§aso#34603§[1]) - 1;
      var _loc11_ = this.figureData[§aso#12881§];
      for(var _loc13_ in _loc11_)
      {
         var _loc5_ = _loc11_[_loc13_];
         for(var _loc12_ in _loc5_)
         {
            if(Number(_loc12_) == _loc10_)
            {
               var _loc7_ = _loc5_[_loc12_].colors;
               _loc6_.push(_loc7_[_loc9_],_loc13_);
               var _loc2_ = _loc5_[_loc12_].parts;
               for(var _loc8_ in _loc2_)
               {
                  var _loc3_ = this["aso#90317"](String(_loc2_[_loc8_]));
                  var _loc4_ = [_loc8_,_loc3_];
                  _loc6_.push(_loc4_);
               }
               return _loc6_;
            }
         }
      }
      trace("Part not found, part=" + _loc10_ + ", color index=" + _loc9_ + ", gender=" + §aso#12881§);
      return _loc6_;
   }
   function getColorAndIndexes(§aso#12881§, tMainPart, tDir, §aso#72350§, §aso#13852§)
   {
      var _loc6_ = 0;
      if(tDir == "next")
      {
         _loc6_ = 1;
      }
      else if(tDir == "prev")
      {
         _loc6_ = -1;
      }
      else
      {
         trace("error in getColorAndIndexes");
      }
      var _loc5_ = this.figureData[§aso#12881§][tMainPart];
      for(var _loc7_ in _loc5_)
      {
         if(_loc5_[_loc7_].indexNum == §aso#72350§)
         {
            var _loc3_ = _loc5_[_loc7_];
            var _loc4_ = _loc3_.colors.length;
            §aso#13852§ += _loc6_;
            if(§aso#13852§ < 0)
            {
               §aso#13852§ = _loc4_ - 1;
            }
            if(§aso#13852§ > _loc4_ - 1)
            {
               §aso#13852§ = 0;
            }
            return [_loc3_.colors[§aso#13852§],§aso#13852§];
         }
      }
      trace("not found: getColorAndIndexes");
      return [];
   }
   function getPartsAndIndexes(§aso#12881§, tMainPart, tDir, tSetIndex, §aso#13852§)
   {
      var _loc14_ = 0;
      if(tDir == "next")
      {
         _loc14_ = 1;
      }
      else if(tDir == "prev")
      {
         _loc14_ = -1;
      }
      var _loc8_ = this.figureData[§aso#12881§][tMainPart];
      var _loc15_ = this["aso#62185"][§aso#12881§][tMainPart];
      tSetIndex += _loc14_;
      if(tDir == "setDefault")
      {
         tSetIndex = 0;
      }
      if(tDir == "randomize")
      {
         tSetIndex = random(_loc15_);
      }
      if(tSetIndex < 0)
      {
         tSetIndex = _loc15_ - 1;
      }
      if(tSetIndex > _loc15_ - 1)
      {
         tSetIndex = 0;
      }
      for(var _loc13_ in _loc8_)
      {
         if(_loc8_[_loc13_].indexNum == tSetIndex)
         {
            var _loc6_ = _loc8_[_loc13_];
            var _loc2_ = _loc6_.parts;
            var _loc7_ = _loc6_.colors.length;
            if(tDir == "randomize")
            {
               §aso#13852§ = random(_loc7_);
            }
            if(§aso#13852§ > _loc7_ - 1)
            {
               §aso#13852§ = _loc7_ - 1;
            }
            var _loc10_ = _loc6_.colors[§aso#13852§];
            var _loc5_ = [tSetIndex,_loc10_,§aso#13852§];
            var _loc3_ = new Array();
            for(var _loc11_ in _loc2_)
            {
               _loc3_ = [_loc11_,this["aso#90317"](String(_loc2_[_loc11_]))];
               _loc5_.push(_loc3_);
            }
            return _loc5_;
         }
      }
      trace("not found: getPartsAndIndexes");
      return [];
   }
   function §aso#90317§(tStr)
   {
      if(tStr.length == 1)
      {
         tStr = "00" + tStr;
      }
      else if(tStr.length == 2)
      {
         tStr = "0" + tStr;
      }
      return tStr;
   }
}
