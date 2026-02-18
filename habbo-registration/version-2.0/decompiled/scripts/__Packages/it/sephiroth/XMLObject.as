class it.sephiroth.XMLObject extends XML
{
   var oResult;
   var oXML;
   function XMLObject()
   {
      super();
   }
   function parseXML(xmlinput, allArray)
   {
      if(allArray == undefined)
      {
         allArray = false;
      }
      this.oResult = new Object();
      this.oXML = xmlinput;
      this.oResult = this.translateXML(null,null,null,null,allArray);
      return this.oResult;
   }
   function parseObject(obj, name)
   {
      var tempXML = new XML("<?xml version=\"1.0\"?>");
      var rootNode = tempXML.createElement(name);
      var returnedNode = this.translateObject(obj,tempXML,rootNode);
      rootNode.appendChild(returnedNode);
      tempXML.appendChild(rootNode);
      return tempXML;
   }
   function translateObject(obj, tempXML, parentNode)
   {
      var node;
      switch(obj.__proto__)
      {
         case Array.prototype:
            var firstVal = obj.shift();
            this.translateObject(firstVal,tempXML,parentNode);
            for(var a in obj)
            {
               node = parentNode.cloneNode(false);
               parentNode.parentNode.appendChild(node);
               this.translateObject(obj[a],tempXML,node);
            }
            break;
         case Object.prototype:
            for(var a in obj)
            {
               if(a == "attributes")
               {
                  this.parseAttributes(obj[a],parentNode);
               }
               else
               {
                  node = tempXML.createElement(a);
                  parentNode.appendChild(node);
                  this.translateObject(obj[a],tempXML,node);
               }
            }
            break;
         case String.prototype:
         case Boolean.prototype:
         case Number.prototype:
         case Date.prototype:
         default:
            var textNode = tempXML.createTextNode(obj.toString());
            parentNode.appendChild(textNode);
      }
      return parentNode;
   }
   function parseAttributes(obj, parentNode)
   {
      for(var a in obj)
      {
         parentNode.attributes[a] = obj[a];
      }
   }
   function translateXML(from, path, name, position, allarray)
   {
      var xmlName;
      var nodes;
      var node;
      var old_path;
      if(path == undefined)
      {
         path = this;
         name = "oResult";
      }
      path = path[name];
      if(from == undefined)
      {
         from = new XML(this.xml.toString());
         from.ignoreWhite = true;
      }
      if(from.hasChildNodes())
      {
         nodes = from.childNodes;
         if(position != undefined)
         {
            var old_path = path;
            path = path[position];
         }
         while(nodes.length > 0)
         {
            node = nodes.shift();
            xmlName = node.nodeName.split("-").join("_");
            if(xmlName != undefined)
            {
               var __obj__ = new Object();
               __obj__.attributes = node.attributes;
               __obj__.data = node.firstChild.nodeValue;
               if(position != undefined)
               {
                  var old_path = path;
               }
               if(path[xmlName] != undefined)
               {
                  if(path[xmlName].__proto__ == Array.prototype)
                  {
                     path[xmlName].push(__obj__);
                     name = node.nodeName;
                     position = path[xmlName].length - 1;
                  }
                  else
                  {
                     var copyObj = path[xmlName];
                     path[xmlName] = new Array();
                     path[xmlName].push(copyObj);
                     path[xmlName].push(__obj__);
                     name = xmlName;
                     position = path[xmlName].length - 1;
                  }
               }
               else
               {
                  if(allarray)
                  {
                     path[xmlName] = new Array();
                     path[xmlName].push(__obj__);
                  }
                  else
                  {
                     path[xmlName] = __obj__;
                  }
                  name = xmlName;
                  if(allarray == true)
                  {
                     position = 0;
                  }
                  else
                  {
                     position = undefined;
                  }
               }
            }
            if(node.hasChildNodes())
            {
               this.translateXML(node,path,name,position,allarray);
            }
         }
      }
      return this.oResult;
   }
   function get xml()
   {
      return this.oXML;
   }
}
