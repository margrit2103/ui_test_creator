import builtins
import logging
import os
import time
from ast import literal_eval
from time import strftime
import json
import websocket

import run_test

try:
    import thread
except ImportError:
    import _thread as thread

# Setup Logging for GAT Tests.
# builtins.log = logging.getLogger('test_global')
# path_for_log = os.path.join(os.getcwd(), "log_" + strftime("%Y%m%d_%H%M%S") + '.txt')
# logging.basicConfig(format='%(asctime)s: %(filename)s = %(funcName)s ||=> %(message)s :On Line %(lineno)d',
#                     filename=path_for_log,
#                     level=logging.DEBUG)


def on_message(ws, message):
    test_results = ""
    runTest = run_test.Run_Test()
    # log.info("Receive Message: " + str(message))
    test_results = runTest.runTestSuite(json.loads(message))
    print("THE Test Results: ", test_results)
    ws.send(json.dumps(test_results))


def on_error(ws, error):
    print(error)
    # log.error("Error: " + str(error))


def on_close(ws):
    # log.info("Closed Websocket")
    print("### closed ###")


def on_open(ws):
    def run(*args):
        for i in range(3):
            time.sleep(1)
            ws.send("Hello %d" % i)
            time.sleep(1)
            ws.close()
            # log.info("thread terminating...")
            thread.start_new_thread(run, ())


if __name__ == "__main__":
    websocket.enableTrace(False)
    ws = websocket.WebSocketApp("ws://192.168.2.170:9000/remote_ws",
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()
