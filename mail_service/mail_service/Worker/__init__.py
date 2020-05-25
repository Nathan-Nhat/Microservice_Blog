import pika


class Worker(object):
    def __init__(self, exchange=None, queue=None, routing_key=None, callback=None):
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host='rabbitmq'))
        self.channel = self.connection.channel()
        self.callback = callback
        self.channel.exchange_declare(exchange=exchange, exchange_type='topic')
        result = self.channel.queue_declare(queue, exclusive=False)
        self.queue_name = result.method.queue
        self.channel.queue_bind(queue=self.queue_name, exchange=exchange, routing_key=routing_key)
        self.channel.basic_qos(prefetch_count=1)
        self.tags = self.channel.basic_consume(queue=self.queue_name, on_message_callback=self.callback,
                                               auto_ack=True)

    def start_consume(self):
        self.channel.start_consuming()

    def stop_consume(self):
        self.channel.basic_cancel(self.tags)
        pass
