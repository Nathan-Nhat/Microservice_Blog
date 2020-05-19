from mail_service.Worker.forgot_pass_worker import ForgotPassWorker
from threading import Thread
import keyboard


class WorkerThread(Thread):
    def __init__(self, worker, id):
        Thread.__init__(self)
        self.worker = worker
        self.id = id

    def run(self) -> None:
        self.worker.start_consume(self.id)


if __name__ == '__main__':
    forgotWorker = ForgotPassWorker(exchange='mail_service', queue='forgot_password',
                                    routing_key='forgot_password.*')
    forgotWorker2 = ForgotPassWorker(exchange='mail_service', queue='forgot_password',
                                     routing_key='forgot_password.*')
    worker1 = WorkerThread(forgotWorker, 1)
    worker2 = WorkerThread(forgotWorker2, 2)
    worker1.start()
    worker2.start()
    while True:
        if keyboard.is_pressed('x'):
            worker1.worker.stop_consume()
            worker2.worker.stop_consume()
            break
