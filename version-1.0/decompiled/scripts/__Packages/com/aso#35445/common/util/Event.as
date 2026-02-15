class com.§aso#35445§.common.util.Event
{
   var topic = undefined;
   var data = undefined;
   var sender = undefined;
   function Event(topic, data, sender)
   {
      this.sender = sender;
      this.topic = topic;
      this.data = data;
   }
   function getTopic()
   {
      return this.topic;
   }
   function getData()
   {
      return this.data;
   }
   function getSender()
   {
      return this.sender;
   }
}
