class com.sulake.common.util.EventRelay
{
   static var topics = undefined;
   function EventRelay()
   {
   }
   static function addListener(listener, topic)
   {
      if(com.sulake.common.util.EventRelay.topics == undefined)
      {
         com.sulake.common.util.EventRelay.topics = new Object();
      }
      if(com.sulake.common.util.EventRelay.topics[topic] == undefined)
      {
         com.sulake.common.util.EventRelay.topics[topic] = new com.sulake.common.util.Collection();
      }
      com.sulake.common.util.EventRelay.topics[topic].addElement(listener);
   }
   static function removeListener(listener, topic)
   {
      if(com.sulake.common.util.EventRelay.topics != undefined)
      {
         if(com.sulake.common.util.EventRelay.topics[topic] != undefined)
         {
            com.sulake.common.util.EventRelay.topics[topic].removeElement(listener);
            if(com.sulake.common.util.EventRelay.topics[topic].getSize() == 0)
            {
               com.sulake.common.util.EventRelay.topics[topic] = undefined;
            }
         }
      }
   }
   static function sendEvent(event)
   {
      if(com.sulake.common.util.EventRelay.topics != undefined)
      {
         if(com.sulake.common.util.EventRelay.topics[event.getTopic()] != undefined)
         {
            var enumeration = com.sulake.common.util.EventRelay.topics[event.getTopic()].getEnumeration();
            while(enumeration.hasMoreElements())
            {
               var listener = enumeration.nextElement();
               listener.receiveEvent(event);
            }
         }
      }
   }
}
