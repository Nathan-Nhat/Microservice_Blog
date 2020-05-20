from mail_service.Worker.forgot_pass_worker import ForgotPassWorker
from threading import Thread
import keyboard
from mail_service.Worker.resend_confirm_worker import ResendConfirmWorker


class WorkerThread(Thread):
    def __init__(self, worker):
        Thread.__init__(self)
        self.worker = worker

    def run(self) -> None:
        self.worker.start_consume()


if __name__ == '__main__':
    forgotWorker = ForgotPassWorker(exchange='mail_service', queue='forgot_password',
                                    routing_key='forgot_password.*')
    forgotWorker2 = ForgotPassWorker(exchange='mail_service', queue='forgot_password',
                                     routing_key='forgot_password.*')
    resendConfirm = ResendConfirmWorker(exchange='mail_service', queue='resend_confirm',
                                        routing_key='confirm.*')
    resendConfirm2 = ResendConfirmWorker(exchange='mail_service', queue='resend_confirm',
                                         routing_key='confirm.*')
    worker1 = WorkerThread(forgotWorker)
    worker2 = WorkerThread(forgotWorker2)
    worker3 = WorkerThread(resendConfirm)
    worker4 = WorkerThread(resendConfirm2)
    worker1.start()
    worker2.start()
    worker3.start()
    worker4.start()
    print('Running mail service')
