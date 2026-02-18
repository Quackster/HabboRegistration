class com.§aso#35445§.common.util.Collection
{
   var data = undefined;
   function Collection()
   {
      this.data = new Array(0);
   }
   function addElement(element)
   {
      this.data.push(element);
      return this.data.length - 1;
   }
   function insertElementAt(element, index)
   {
      this.data.splice(index,0,element);
   }
   function removeElement(element)
   {
      return this.removeElementAt(this.indexOf(element));
   }
   function removeElementAt(index)
   {
      if(index < 0 && index >= this.getSize())
      {
         return false;
      }
      this.data.splice(index,1);
      return true;
   }
   function elementAt(index)
   {
      return this.data[index];
   }
   function indexOf(element)
   {
      var _loc2_ = 0;
      while(_loc2_ < this.data.length)
      {
         if(this.data[_loc2_] == element)
         {
            return _loc2_;
         }
         _loc2_ = _loc2_ + 1;
      }
      return -1;
   }
   function getSize()
   {
      return this.data.length;
   }
   function getCopy()
   {
      return new com["aso#35445"].common.util.Collection().setArray(this.getArray());
   }
   function getEnumeration()
   {
      return new com["aso#35445"].common.util.Enumeration(this);
   }
   function getArray()
   {
      return this.data.slice(0);
   }
   function setArray(data)
   {
      this.data = data;
      return this;
   }
}
