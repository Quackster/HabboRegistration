class com.§aso#35445§.common.util.Enumeration
{
   var index = 0;
   var collection = undefined;
   function Enumeration(collection)
   {
      this.collection = collection.getCopy();
   }
   function hasMoreElements()
   {
      return this.collection.getSize() > this.index;
   }
   function nextElement()
   {
      return this.collection.elementAt(this.index++);
   }
   function getLastIndex()
   {
      return this.index - 1;
   }
}
