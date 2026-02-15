class com.§aso#35445§.common.util.EventRelay
{
   static var topics = undefined;
   function EventRelay()
   {
   }
   static function addListener(listener, topic)
   {
      if(com["aso#35445"].common.util.EventRelay.topics == undefined)
      {
         com["aso#35445"].common.util.EventRelay.topics = new Object();
      }
      if(com["aso#35445"].common.util.EventRelay.topics[topic] == undefined)
      {
         com["aso#35445"].common.util.EventRelay.topics[topic] = new com["aso#35445"].common.util.Collection();
      }
      com["aso#35445"].common.util.EventRelay.topics[topic].addElement(listener);
   }
   static function removeListener(listener, topic)
   {
      if(com["aso#35445"].common.util.EventRelay.topics != undefined)
      {
         if(com["aso#35445"].common.util.EventRelay.topics[topic] != undefined)
         {
            com["aso#35445"].common.util.EventRelay.topics[topic].removeElement(listener);
            if(com["aso#35445"].common.util.EventRelay.topics[topic].getSize() == 0)
            {
               com["aso#35445"].common.util.EventRelay.topics[topic] = undefined;
            }
         }
      }
   }
   static function sendEvent(event)
   {
      if(com["aso#35445"].common.util.EventRelay.topics != undefined)
      {
         if(com["aso#35445"].common.util.EventRelay.topics[event.getTopic()] != undefined)
         {
            var _loc2_ = com["aso#35445"].common.util.EventRelay.topics[event.getTopic()].getEnumeration();
            while(_loc2_.hasMoreElements())
            {
               var _loc1_ = _loc2_.nextElement();
               _loc1_.receiveEvent(event);
            }
         }
      }
   }
}
